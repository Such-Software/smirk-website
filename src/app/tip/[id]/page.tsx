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
  const [fragmentKey, setFragmentKey] = useState<string | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [claimSuccess, setClaimSuccess] = useState<{ txid: string } | null>(null);

  useEffect(() => {
    // Check for extension
    const check = () => setHasExtension(!!window.smirk);
    check();
    const timeout = setTimeout(check, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Extract fragment key from URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      setFragmentKey(hash.slice(1)); // Remove the # prefix
    }
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

  const handleClaim = async () => {
    if (!window.smirk || !fragmentKey || !tipId) return;

    setClaiming(true);
    setClaimError(null);

    try {
      // First connect to extension (if not already)
      await window.smirk.connect();

      // Claim the tip
      const result = await window.smirk.claimPublicTip(tipId, fragmentKey);

      if (result.success && result.txid) {
        setClaimSuccess({ txid: result.txid });
        // Refresh tip info to show claimed status
        const tipInfo = await getPublicTipInfo(tipId);
        setTip(tipInfo);
      } else {
        setClaimError(result.error || 'Failed to claim tip');
      }
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : 'Failed to claim tip');
    } finally {
      setClaiming(false);
    }
  };

  const isClaimable = tip?.status === 'pending' &&
    tip.is_public &&
    fragmentKey &&
    (tip.funding_confirmations ?? 0) >= (tip.confirmations_required ?? 0);

  const needsConfirmations = tip?.status === 'pending' &&
    tip.is_public &&
    fragmentKey &&
    (tip.funding_confirmations ?? 0) < (tip.confirmations_required ?? 0);

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

          {/* Claim success */}
          {claimSuccess && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4">
              <h3 className="text-green-400 font-semibold mb-2">Claimed!</h3>
              <p className="text-zinc-400 text-sm">
                Funds are being sent to your wallet.
              </p>
              <p className="text-zinc-500 text-xs mt-2 font-mono break-all">
                TX: {claimSuccess.txid}
              </p>
            </div>
          )}

          {/* Needs confirmations */}
          {needsConfirmations && !claimSuccess && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#fbeb0a]">Waiting for Confirmations</h2>
              <div className="text-zinc-400 text-sm">
                <p>This tip is still confirming on the blockchain.</p>
                <p className="mt-2">
                  <span className="text-[#fbeb0a] font-semibold">{tip?.funding_confirmations ?? 0}</span>
                  {' / '}
                  <span>{tip?.confirmations_required ?? 0}</span>
                  {' confirmations'}
                </p>
                <p className="mt-3 text-zinc-500 text-xs">
                  Refresh this page to check progress.
                </p>
              </div>
            </div>
          )}

          {/* Claim button for public tips */}
          {isClaimable && !claimSuccess && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {hasExtension ? 'Ready to Claim!' : 'Install Smirk Wallet'}
              </h2>

              {hasExtension ? (
                <div className="space-y-4">
                  <button
                    onClick={handleClaim}
                    disabled={claiming}
                    className="px-8 py-4 bg-[#fbeb0a] text-black font-bold rounded-xl
                               hover:bg-[#d4c708] transition-colors disabled:opacity-50
                               disabled:cursor-not-allowed text-lg w-full"
                  >
                    {claiming ? 'Claiming...' : 'Claim This Tip'}
                  </button>
                  {claimError && (
                    <p className="text-red-400 text-sm">{claimError}</p>
                  )}
                </div>
              ) : (
                <div className="text-zinc-400 text-sm space-y-4">
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

          {/* Targeted tip instructions (no fragment key) */}
          {tip.status === 'pending' && !fragmentKey && !tip.is_public && (
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

          {/* Public tip with missing fragment key */}
          {tip.status === 'pending' && tip.is_public && !fragmentKey && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-red-400">Incomplete Link</h2>
              <div className="text-zinc-400 text-sm space-y-2">
                <p>This is a public tip, but the claim link is incomplete.</p>
                <p>Make sure you have the <strong>full URL</strong> including the secret key after the <code className="bg-zinc-800 px-1 rounded">#</code> symbol.</p>
                <p className="text-zinc-500 text-xs mt-4">
                  Example: smirk.cash/tip/abc123<strong>#secretKey</strong>
                </p>
              </div>
            </div>
          )}

          {tip.status === 'claimed' && !claimSuccess && (
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
