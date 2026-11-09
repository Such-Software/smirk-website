import type { Metadata } from 'next';
import Link from 'next/link';
import { latestDesktopRelease } from '@/lib/desktop-release-server';
import { OFFICIAL_RELEASES } from '@/lib/desktop-releases';
import DownloadChoices from './DownloadChoices';

export const metadata: Metadata = { title: 'Download desktop', description: 'Get Smirk Wallet for macOS, Windows, or Linux from the official GitHub release.' };
export const revalidate = 300;

export default async function Downloads() {
  const release = await latestDesktopRelease();
  return <div className="mx-auto w-full max-w-5xl px-6 py-12 md:py-20">
    <Link href="/" className="text-sm text-zinc-400 hover:text-[#fbeb0a]">← Smirk Wallet</Link>
    <header className="mb-10 mt-10">
      <p className="creepster-text text-2xl">Your wallet. Your computer.</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Download Smirk</h1>
      <p className="mt-5 max-w-2xl text-zinc-300">Smirk Wallet for macOS, Windows, and Linux. Downloads come directly from our official GitHub releases.</p>
      <p className="mt-3 text-sm text-zinc-400">{release ? `Latest published release: ${release.version}` : 'We could not load the latest release. You can still browse the official releases below.'}</p>
    </header>
    <DownloadChoices release={release} />
    <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm">
      <a href={release?.releaseUrl ?? OFFICIAL_RELEASES} className="text-[#fbeb0a] underline underline-offset-4">Release notes and all files</a>
      <a href="https://chromewebstore.google.com/detail/smirk-wallet/mbohhckapcchfmanheggbkekofhajnci" className="text-zinc-300 underline underline-offset-4">Get the browser extension</a>
    </div>
  </div>;
}
