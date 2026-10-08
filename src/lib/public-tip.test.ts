import { test } from 'node:test';
import assert from 'node:assert/strict';

import { lookupPublicTip, normalizePublicTip, TipNotFoundError } from './public-tip.ts';

const CORE = 'https://api.example';
const LEGACY = 'https://legacy.example';

function tipBody(extra: Record<string, unknown> = {}) {
  return {
    id: 'tip-1',
    asset: 'wow',
    amount: 5,
    status: 'pending',
    created_at: '2026-08-19T10:19:00Z',
    is_public: true,
    funding_confirmations: 4,
    confirmations_required: 4,
    ...extra,
  };
}

function fakeFetch(responses: Record<string, { status: number; body?: unknown }>) {
  const calls: string[] = [];
  const impl = async (url: string) => {
    calls.push(url);
    const host = Object.keys(responses).find((h) => url.startsWith(h));
    const r = host ? responses[host] : { status: 500 };
    return { ok: r.status >= 200 && r.status < 300, status: r.status, json: async () => r.body ?? {} };
  };
  return { impl, calls };
}

test('a core tip is returned from core without touching legacy', async () => {
  const f = fakeFetch({ [CORE]: { status: 200, body: tipBody() } });
  const tip = await lookupPublicTip('tip-1', { apiUrl: CORE, legacyApiUrl: LEGACY, fetchImpl: f.impl });
  assert.equal(tip.source, 'core');
  assert.equal(f.calls.length, 1);
});

test('a v0.2.x tip missing from core is found on legacy', async () => {
  const f = fakeFetch({ [CORE]: { status: 404 }, [LEGACY]: { status: 200, body: tipBody() } });
  const tip = await lookupPublicTip('tip-1', { apiUrl: CORE, legacyApiUrl: LEGACY, fetchImpl: f.impl });
  assert.equal(tip.source, 'legacy');
  assert.equal(tip.amount, 5);
  assert.deepEqual(f.calls, [`${CORE}/api/v1/tips/social/tip-1/public`, `${LEGACY}/api/v1/tips/social/tip-1/public`]);
});

test('a tip on neither backend is not found', async () => {
  const f = fakeFetch({ [CORE]: { status: 404 }, [LEGACY]: { status: 404 } });
  await assert.rejects(
    lookupPublicTip('tip-1', { apiUrl: CORE, legacyApiUrl: LEGACY, fetchImpl: f.impl }),
    TipNotFoundError,
  );
});

test('a core server error is reported and does not fall back', async () => {
  const f = fakeFetch({ [CORE]: { status: 503, body: { error: 'busy' } }, [LEGACY]: { status: 200, body: tipBody() } });
  await assert.rejects(lookupPublicTip('tip-1', { apiUrl: CORE, legacyApiUrl: LEGACY, fetchImpl: f.impl }), /busy/);
  assert.equal(f.calls.length, 1);
});

test('without a distinct legacy URL a core 404 is final', async () => {
  const f = fakeFetch({ [CORE]: { status: 404 } });
  await assert.rejects(lookupPublicTip('tip-1', { apiUrl: CORE, legacyApiUrl: CORE, fetchImpl: f.impl }), TipNotFoundError);
  assert.equal(f.calls.length, 1);
});

test('legacy key material is never carried into the page model', () => {
  const tip = normalizePublicTip(tipBody({ encrypted_key: 'secret', tip_address: 'Wo...' }), 'legacy') as unknown as Record<string, unknown>;
  assert.equal('encrypted_key' in tip, false);
  assert.equal('tip_address' in tip, false);
});

test('the tip id is URL-encoded', async () => {
  const f = fakeFetch({ [CORE]: { status: 200, body: tipBody() } });
  await lookupPublicTip('a/b', { apiUrl: CORE, legacyApiUrl: LEGACY, fetchImpl: f.impl });
  assert.equal(f.calls[0], `${CORE}/api/v1/tips/social/a%2Fb/public`);
});
