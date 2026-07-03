'use client';

/**
 * feed.smirk.cash — a public, read-only window into the Smirk Nostr square.
 *
 * The relay (wss://relay.smirk.cash) is premium-post gated, so general notes
 * (kind 1) come only from members who hold premium — the feed is self-curating.
 * This v1 is read-only; composing/replying arrives once the wallet's dapp-api
 * exposes a Nostr sign scope (see the monorepo roadmap).
 */
import { useEffect, useMemo, useState } from 'react';
import { SimplePool, nip19, type Event as NostrEvent } from 'nostr-tools';

const RELAY = 'wss://relay.smirk.cash';

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

export default function FeedPage(): React.ReactElement {
  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [status, setStatus] = useState<'connecting' | 'live' | 'empty'>('connecting');

  useEffect(() => {
    const pool = new SimplePool();
    const seen = new Set<string>();
    const sub = pool.subscribeMany(
      [RELAY],
      { kinds: [1], limit: 100 },
      {
        onevent(ev: NostrEvent) {
          if (seen.has(ev.id)) return;
          seen.add(ev.id);
          setStatus('live');
          setEvents((prev) =>
            [...prev, ev]
              .sort((a, b) => b.created_at - a.created_at)
              .slice(0, 200),
          );
        },
        oneose() {
          setStatus((s) => (s === 'connecting' ? 'empty' : s));
        },
      },
    );
    return () => {
      sub.close();
      pool.close([RELAY]);
    };
  }, []);

  const dot = useMemo(() => {
    if (status === 'live') return { color: '#4ade80', label: 'live' };
    if (status === 'empty') return { color: '#71717a', label: 'quiet' };
    return { color: '#fbeb0a', label: 'connecting' };
  }, [status]);

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
            <span className="text-zinc-400">relay.smirk.cash</span>
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-zinc-500">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: dot.color }}
            />
            {dot.label}
          </div>
        </header>

        {status !== 'live' && events.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-8 text-center">
            <p className="text-zinc-400">
              {status === 'connecting'
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
                  <span className="font-mono text-[#fbeb0a]">
                    {shortNpub(ev.pubkey)}
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
