'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPublicTipInfo, type PublicTipInfo } from '@/lib/api';

const COINS: Record<string, { name: string; icon: string; divisor: number; decimals: number }> = {
  btc: { name: 'Bitcoin', icon: '/coins/bitcoin.svg', divisor: 100_000_000, decimals: 8 },
  ltc: { name: 'Litecoin', icon: '/coins/litecoin.svg', divisor: 100_000_000, decimals: 8 },
  xmr: { name: 'Monero', icon: '/coins/monero.svg', divisor: 1_000_000_000_000, decimals: 12 },
  wow: { name: 'Wownero', icon: '/coins/wownero.svg', divisor: 100_000_000_000, decimals: 11 },
  grin: { name: 'Grin', icon: '/coins/grin.svg', divisor: 1_000_000_000, decimals: 9 },
};

function formatAmount(amount: number, asset: string): string {
  const coin = COINS[asset.toLowerCase()];
  if (!coin) return `${amount} ${asset.toUpperCase()}`;
  const value = amount / coin.divisor;
  return `${value.toFixed(Math.min(coin.decimals, 8))} ${asset.toUpperCase()}`;
}

export default function TipPage() {
  const params = useParams();
  const tipId = params.id as string;

  const [tip, setTip] = useState<PublicTipInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasExtension, setHasExtension] = useState<boolean | null>(null);

  useEffect(() => {
    // Check for extension
    const check = () => setHasExtension(!!window.smirk);
    check();
    const timeout = setTimeout(check, 500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!tipId) return;

    async function loadTip() {
      try {
        setLoading(true);
        setError(null);
        const tipInfo = await getPublicTipInfo(tipId);
        setTip(tipInfo);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tip');
      } finally {
        setLoading(false);
      }
    }

    loadTip();
  }, [tipId]);

  const coin = tip ? COINS[tip.asset.toLowerCase()] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="flex flex-col items-center">
          <h1 className="creepster-text text-3xl mb-2">SMIRK WALLET</h1>
          <div className="logo-glow">
            <Image
              src="/logo.svg"
              alt="Smirk"
              width={100}
              height={100}
              priority
            />
          </div>
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-[#fbeb0a] border-t-transparent rounded-full" />
          <p className="text-zinc-400">Loading tip...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <span className="text-3xl">!</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Tip Not Found</h2>
            <p className="text-zinc-400 text-sm max-w-md">
              {error}
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-2 border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors text-sm"
          >
            Go Home
          </Link>
        </div>
      )}

      {/* Tip found */}
      {tip && !loading && (
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          {/* Status indicator */}
          {tip.status === 'pending' ? (
            <div className="w-16 h-16 bg-[#fbeb0a] rounded-full flex items-center justify-center">
              <span className="text-3xl">🎁</span>
            </div>
          ) : tip.status === 'claimed' ? (
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center">
              <span className="text-3xl text-zinc-400">X</span>
            </div>
          )}

          {/* Tip info */}
          <div className="bg-zinc-900 rounded-xl p-6 w-full">
            {coin && (
              <div className="flex items-center justify-center gap-3 mb-4">
                <Image src={coin.icon} alt={coin.name} width={48} height={48} />
                <span className="text-2xl font-bold">{formatAmount(tip.amount, tip.asset)}</span>
              </div>
            )}

            <div className="text-sm text-zinc-400 space-y-1">
              <p>Status: <span className={
                tip.status === 'pending' ? 'text-[#fbeb0a]' :
                tip.status === 'claimed' ? 'text-green-400' :
                'text-zinc-500'
              }>{tip.status}</span></p>
              <p>Created: {new Date(tip.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Claim instructions */}
          {tip.status === 'pending' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {hasExtension ? 'Claim This Tip' : 'Install Smirk Wallet'}
              </h2>

              {hasExtension ? (
                <div className="text-zinc-400 text-sm space-y-2">
                  <p>To claim this tip:</p>
                  <ol className="text-left list-decimal list-inside space-y-1">
                    <li>Click the Smirk extension icon</li>
                    <li>Go to <strong>Inbox</strong></li>
                    <li>Click <strong>Claim</strong> on this tip</li>
                  </ol>
                </div>
              ) : (
                <div className="text-zinc-400 text-sm space-y-2">
                  <p>You need the Smirk Wallet extension to claim tips.</p>
                  <a
                    href="https://chrome.google.com/webstore/detail/smirk-wallet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-[#fbeb0a] text-black font-bold rounded-xl
                               hover:bg-[#d4c708] transition-colors"
                  >
                    Install Smirk Wallet
                  </a>
                </div>
              )}
            </div>
          )}

          {tip.status === 'claimed' && (
            <p className="text-green-400">This tip has already been claimed.</p>
          )}

          {tip.status !== 'pending' && tip.status !== 'claimed' && (
            <p className="text-zinc-500">This tip is no longer available.</p>
          )}

          <Link
            href="/"
            className="px-6 py-2 border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors text-sm"
          >
            Go Home
          </Link>
        </div>
      )}
    </div>
  );
}
