// Public tip lookup across the two backends.
//
// Tips created by v0.3 wallets live on the core backend (api.smirk.cash). Tips
// created by v0.2.x wallets live only on the legacy backend (backend.smirk.cash).
// The tip page must show both, so a 404 from core falls back to legacy.

export type TipSource = 'core' | 'legacy';

export interface PublicTipInfo {
  id: string;
  asset: string;
  amount: number;
  status: string;
  created_at: string;
  is_public: boolean;
  funding_confirmations: number;
  confirmations_required: number;
  /** Which backend holds the tip. Only core tips can be claimed by a v0.3 wallet. */
  source: TipSource;
}

export class TipNotFoundError extends Error {
  constructor() {
    super('Tip not found or not available');
    this.name = 'TipNotFoundError';
  }
}

type FetchLike = (url: string) => Promise<{
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}>;

function toNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/** Keep only the fields the page renders; never carry key material along. */
export function normalizePublicTip(raw: unknown, source: TipSource): PublicTipInfo {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  if (typeof r.id !== 'string' || typeof r.asset !== 'string' || typeof r.status !== 'string') {
    throw new Error('Failed to get tip info');
  }
  return {
    id: r.id,
    asset: r.asset,
    amount: toNumber(r.amount),
    status: r.status,
    created_at: typeof r.created_at === 'string' ? r.created_at : '',
    is_public: r.is_public === true,
    funding_confirmations: toNumber(r.funding_confirmations),
    confirmations_required: toNumber(r.confirmations_required),
    source,
  };
}

async function errorMessage(res: { json(): Promise<unknown> }): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as { error?: unknown };
  return typeof data.error === 'string' && data.error ? data.error : 'Failed to get tip info';
}

export async function lookupPublicTip(
  tipId: string,
  opts: { apiUrl: string; legacyApiUrl?: string; fetchImpl: FetchLike },
): Promise<PublicTipInfo> {
  const path = `/api/v1/tips/social/${encodeURIComponent(tipId)}/public`;
  const core = await opts.fetchImpl(`${opts.apiUrl}${path}`);
  if (core.ok) return normalizePublicTip(await core.json(), 'core');
  if (core.status !== 404) throw new Error(await errorMessage(core));

  const legacyUrl = opts.legacyApiUrl;
  if (!legacyUrl || legacyUrl === opts.apiUrl) throw new TipNotFoundError();
  const legacy = await opts.fetchImpl(`${legacyUrl}${path}`);
  if (legacy.ok) return normalizePublicTip(await legacy.json(), 'legacy');
  if (legacy.status === 404) throw new TipNotFoundError();
  throw new Error(await errorMessage(legacy));
}
