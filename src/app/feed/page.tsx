'use client';

/**
 * feed.smirk.cash — a public, read-only window into the Smirk Nostr square.
 *
 * Curation is a BACKEND-OPERATOR knob: the page reads `/capabilities.feed` from
 * the default backend and shows posts accordingly (owner / premium members /
 * a featured allowlist, across the relay + optional extra relays). When the
 * backend doesn't advertise a feed config yet, it falls back to a sensible
 * default (the Smirk relay, premium + owner). Read-only for now; composing
 * arrives with the wallet's Nostr dapp-api scope.
 */
import { useEffect, useState } from 'react';
import { SimplePool, nip19, type Event as NostrEvent } from 'nostr-tools';

const BACKEND = 'https://api.smirk.cash/api/v1';
const DEFAULT_RELAY = 'wss://relay.smirk.cash';

interface FeedConfig {
  relay_url: string;
  show_owner: boolean;
  show_premium: boolean;
  owner_npub: string | null;
  allowlist_npubs: string[];
  extra_relays: string[];
}

const DEFAULT_FEED: FeedConfig = {
  relay_url: DEFAULT_RELAY,
  show_owner: true,
  show_premium: true,
  owner_npub: null,
  allowlist_npubs: [],
  extra_relays: [],
};

function toHex(idOrNpub: string): string | null {
  const s = idOrNpub.trim();
  if (/^[0-9a-f]{64}$/i.test(s)) return s.toLowerCase();
  try {
    const d = nip19.decode(s);
    return typeof d.data === 'string' ? d.data : null;
  } catch {
    return null;
  }
}

function shortNpub(pubkeyHex: string): string {
  try {
    const npub = nip19.npubEncode(pubkeyHex);
    return `${npub.slice(0, 12)}…${npub.slice(-6)}`;
  } catch {
    return `${pubkeyHex.slice(0, 8)}…`;
  }
}

function relativeTime(unixSeconds: number): string {
  const s = Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

type Status = 'loading' | 'connecting' | 'live' | 'empty' | 'off';

export default function FeedPage(): React.ReactElement {
  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [feed, setFeed] = useState<FeedConfig | null>(null);
  const [ownerHex, setOwnerHex] = useState<string | null>(null);

  // 1. Resolve the operator's feed config (graceful default when unadvertised).
  useEffect(() => {
    let cancelled = false;
    fetch(`${BACKEND}/capabilities`, { headers: { accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((caps) => {
        if (cancelled) return;
        if (caps && caps.feed) {
          setFeed(caps.feed as FeedConfig);
        } else if (caps && caps.features && caps.features.feed === false) {
          setStatus('off');
        } else {
          setFeed(DEFAULT_FEED); // old binary / unreachable → sensible default
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Subscribe once the feed config is known.
  useEffect(() => {
    if (!feed) return;
    setStatus('connecting');
    const owner = feed.owner_npub ? toHex(feed.owner_npub) : null;
    setOwnerHex(owner);
    const allow = new Set(
      feed.allowlist_npubs.map(toHex).filter((h): h is string => !!h),
    );
    const primary = feed.relay_url || DEFAULT_RELAY;
    const pool = new SimplePool();
    const seen = new Set<string>();

    const accept = (ev: NostrEvent, fromPrimary: boolean): boolean => {
      if (allow.has(ev.pubkey)) return true;
      if (owner && ev.pubkey === owner) return feed.show_owner;
      // Non-owner, non-allowlisted authors count as "premium" only on the
      // premium-gated primary relay.
      return fromPrimary && feed.show_premium;
    };
    const push = (ev: NostrEvent, fromPrimary: boolean): void => {
      if (seen.has(ev.id) || !accept(ev, fromPrimary)) return;
      seen.add(ev.id);
      setStatus('live');
      setEvents((prev) =>
        [...prev, ev].sort((a, b) => b.created_at - a.created_at).slice(0, 200),
      );
    };

    const subs: { close: () => void }[] = [];
    subs.push(
      pool.subscribeMany([primary], { kinds: [1], limit: 100 }, {
        onevent: (ev: NostrEvent) => push(ev, true),
        oneose: () => setStatus((s) => (s === 'connecting' ? 'empty' : s)),
      }),
    );
    const allowHex = [...allow];
    if (feed.extra_relays.length > 0 && allowHex.length > 0) {
      subs.push(
        pool.subscribeMany(
          feed.extra_relays,
          { kinds: [1], authors: allowHex, limit: 100 },
          { onevent: (ev: NostrEvent) => push(ev, false) },
        ),
      );
    }
    return () => {
      subs.forEach((s) => s.close());
      pool.close([primary, ...feed.extra_relays]);
    };
  }, [feed]);

  const dot =
    status === 'live'
      ? { color: '#4ade80', label: 'live' }
      : status === 'empty'
        ? { color: '#71717a', label: 'quiet' }
        : status === 'off'
          ? { color: '#71717a', label: 'off' }
          : { color: '#fbeb0a', label: 'connecting' };

  return (
    <main className="min-h-screen bg-black text-zinc-200">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <header className="mb-8 text-center">
          <a href="/" className="inline-block">
            <span className="text-[#fbeb0a] font-bold text-2xl tracking-wide">
              SMIRK FEED
            </span>
          </a>
          <p className="mt-2 text-sm text-zinc-500">
            The self-sovereign Smirk square, on{' '}
            <span className="text-zinc-400">
              {(feed?.relay_url ?? DEFAULT_RELAY).replace('wss://', '')}
            </span>
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-zinc-500">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: dot.color }}
            />
            {dot.label}
          </div>
        </header>

        {status === 'off' ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center">
            <p className="text-zinc-400">The feed isn’t enabled on this instance.</p>
          </div>
        ) : status !== 'live' && events.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center">
            <p className="text-zinc-400">
              {status === 'loading' || status === 'connecting'
                ? 'Connecting to the relay…'
                : 'No posts yet.'}
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Posts from Smirk premium members appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {events.map((ev) => (
              <li
                key={ev.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
              >
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-[#fbeb0a]">
                      {shortNpub(ev.pubkey)}
                    </span>
                    {ownerHex && ev.pubkey === ownerHex && (
                      <span className="rounded bg-[#fbeb0a] px-1.5 py-0.5 text-[10px] font-semibold text-black">
                        owner
                      </span>
                    )}
                  </span>
                  <span className="text-zinc-600">{relativeTime(ev.created_at)}</span>
                </div>
                <p className="whitespace-pre-wrap break-words text-sm text-zinc-200">
                  {ev.content}
                </p>
              </li>
            ))}
          </ul>
        )}

        <footer className="mt-10 text-center text-xs text-zinc-600">
          <a href="/" className="hover:text-zinc-400">
            ← smirk.cash
          </a>
        </footer>
      </div>
    </main>
  );
}
