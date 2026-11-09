export const OFFICIAL_RELEASES = 'https://github.com/Such-Software/smirk-monorepo/releases';
export const LATEST_RELEASE_API = 'https://api.github.com/repos/Such-Software/smirk-monorepo/releases/latest';
export const RELEASE_METADATA_MAX_BYTES = 512 * 1024;
export type DesktopPlatform = 'macos' | 'windows' | 'linux';
export interface DesktopRelease {
  version: string;
  releaseUrl: string;
  downloads: Record<DesktopPlatform, string | null>;
}

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

/** Only the published installer names used by the official release are offered. */
export function parseDesktopRelease(input: unknown): DesktopRelease | null {
  const release = record(input);
  if (!release || release.draft !== false || release.prerelease !== false
      || typeof release.tag_name !== 'string' || !/^v(?:0|[1-9][0-9]{0,5})\.(?:0|[1-9][0-9]{0,5})\.(?:0|[1-9][0-9]{0,5})$/.test(release.tag_name)
      || release.html_url !== `${OFFICIAL_RELEASES}/tag/${release.tag_name}`
      || typeof release.published_at !== 'string' || !Number.isFinite(Date.parse(release.published_at))
      || !Array.isArray(release.assets) || release.assets.length > 100) return null;
  const version = release.tag_name.slice(1);
  const names: Record<DesktopPlatform, string> = {
    macos: `Smirk-Wallet-${version}.dmg`,
    linux: `Smirk.Wallet_${version}_amd64.AppImage`,
    windows: `Smirk.Wallet_${version}_x64-setup.exe`,
  };
  const downloads = {} as DesktopRelease['downloads'];
  for (const platform of ['macos', 'windows', 'linux'] as const) {
    const matches = release.assets.map(record).filter(asset => asset?.name === names[platform]);
    const asset = matches.length === 1 ? matches[0] : null;
    const expected = `${OFFICIAL_RELEASES}/download/${release.tag_name}/${names[platform]}`;
    downloads[platform] = asset?.state === 'uploaded' && Number.isSafeInteger(asset.size) && Number(asset.size) > 0
      && asset.browser_download_url === expected ? expected : null;
  }
  return { version, releaseUrl: release.html_url as string, downloads };
}

/** Metadata only. No authentication, visitor headers, redirects or artifact proxy. */
export async function fetchDesktopRelease(fetcher: typeof fetch = fetch): Promise<DesktopRelease | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
  try {
    const response = await fetcher(LATEST_RELEASE_API, {
      method: 'GET', redirect: 'error', cache: 'no-store', signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'Smirk-Website-Downloads', 'X-GitHub-Api-Version': '2022-11-28' },
    });
    if (!response.ok || !response.body || !response.headers.get('content-type')?.toLowerCase().includes('application/json')) return null;
    const length = response.headers.get('content-length');
    if (length !== null && (!/^[0-9]+$/.test(length) || Number(length) > RELEASE_METADATA_MAX_BYTES)) return null;
    reader = response.body.getReader();
    const chunks: Uint8Array[] = []; let size = 0;
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.byteLength;
      if (size > RELEASE_METADATA_MAX_BYTES) return null;
      chunks.push(next.value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    return parseDesktopRelease(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)));
  } catch { return null; }
  finally {
    controller.abort(); clearTimeout(timer);
    if (reader) { void reader.cancel().catch(() => {}); reader.releaseLock(); }
  }
}
