'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getMe,
  getSentTips,
  getReceivedTips,
  getClaimableTips,
  type MeResponse,
  type SentTip,
  type ReceivedTip,
  type ClaimableTip,
} from '@/lib/api';

// Asset display info
const ASSET_CONFIG: Record<string, { name: string; decimals: number; symbol: string }> = {
  btc: { name: 'Bitcoin', decimals: 8, symbol: 'BTC' },
  ltc: { name: 'Litecoin', decimals: 8, symbol: 'LTC' },
  xmr: { name: 'Monero', decimals: 12, symbol: 'XMR' },
  wow: { name: 'Wownero', decimals: 11, symbol: 'WOW' },
  grin: { name: 'Grin', decimals: 9, symbol: 'GRIN' },
};

function formatAmount(amount: number, asset: string): string {
  const config = ASSET_CONFIG[asset] || { decimals: 8, symbol: asset.toUpperCase() };
  const value = amount / Math.pow(10, config.decimals);
  // Show up to 8 decimal places, trim trailing zeros
  const formatted = value.toFixed(8).replace(/\.?0+$/, '');
  return `${formatted} ${config.symbol}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    claimed: 'bg-green-500/20 text-green-400 border-green-500/50',
    clawed_back: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/50',
  };
  const color = colors[status] || colors.pending;

  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${color}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function ConfirmationBadge({
  confirmations,
  required,
  isClaimable
}: {
  confirmations: number;
  required: number;
  isClaimable: boolean;
}) {
  if (required === 0) {
    return null; // BTC/LTC don't need confirmations
  }

  if (isClaimable) {
    return (
      <span className="px-2 py-0.5 text-xs font-medium rounded border bg-green-500/20 text-green-400 border-green-500/50">
        Confirmed
      </span>
    );
  }

  return (
    <span className="px-2 py-0.5 text-xs font-medium rounded border bg-orange-500/20 text-orange-400 border-orange-500/50">
      {confirmations}/{required} confirmations
    </span>
  );
}

export default function TipsPage() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [sentTips, setSentTips] = useState<SentTip[]>([]);
  const [receivedTips, setReceivedTips] = useState<ReceivedTip[]>([]);
  const [claimableTipIds, setClaimableTipIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasExtension, setHasExtension] = useState(false);
  const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

  const token = typeof window !== 'undefined' ? localStorage.getItem('smirk_token') : null;

  // Check for extension
  useEffect(() => {
    const checkExtension = () => {
      if (typeof window !== 'undefined' && window.smirk) {
        setHasExtension(true);
      }
    };
    checkExtension();
    // Also check after a delay for late injection
    const timeout = setTimeout(checkExtension, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch data
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = () => {
      Promise.all([getMe(token), getSentTips(token), getReceivedTips(token), getClaimableTips(token)])
        .then(([userData, sentData, receivedData, claimableData]) => {
          setUser(userData);
          setSentTips(sentData.tips);
          setReceivedTips(receivedData.tips);
          // Track which tips are claimable (pending, confirmed, have encrypted_key)
          setClaimableTipIds(new Set(claimableData.tips.map((t: ClaimableTip) => t.id)));
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    };

    fetchData();

    // Poll for updates every 30 seconds for confirmation status
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const handleOpenExtension = (action: 'claim' | 'clawback', tipId?: string) => {
    // The extension doesn't have a direct deep-link API yet
    // For now, just show instructions
    if (action === 'claim') {
      alert('Open Smirk extension → Inbox → Claim the pending tip');
    } else {
      alert('Open Smirk extension → Settings → Pending Tips → Clawback');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#fbeb0a] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!token || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-zinc-400 mb-4">Please sign in first</p>
        <Link href="/" className="text-[#fbeb0a] hover:underline">
          Go to home
        </Link>
      </div>
    );
  }

  const pendingSent = sentTips.filter((t) => t.status === 'pending');
  const pendingReceived = receivedTips.filter((t) => t.status === 'pending');
  // Count actually claimable (confirmed) pending tips
  const claimableReceived = pendingReceived.filter((t) => t.is_claimable);
  // Count tips waiting for confirmations
  const confirmingReceived = pendingReceived.filter((t) => !t.is_claimable && t.confirmations_required > 0);

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Smirk" width={40} height={40} />
          <span className="creepster-text text-xl">SMIRK</span>
        </Link>
        <Link
          href="/settings"
          className="text-sm text-zinc-400 hover:text-white"
        >
          Settings
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">Tips</h1>
      <p className="text-zinc-500 text-sm mb-6">
        Manage tips you&apos;ve sent and received
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!hasExtension && (
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
          <p className="text-yellow-400 text-sm">
            Install the{' '}
            <a
              href="https://chromewebstore.google.com/detail/smirk/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Smirk extension
            </a>{' '}
            to claim or clawback tips.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-[#fbeb0a] text-black'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Sent ({sentTips.length})
          {pendingSent.length > 0 && (
            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
              activeTab === 'sent'
                ? 'bg-yellow-700 text-white'
                : 'bg-yellow-500/30 text-yellow-400'
            }`}>
              {pendingSent.length} pending
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'received'
              ? 'bg-[#fbeb0a] text-black'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          Received ({receivedTips.length})
          {claimableReceived.length > 0 && (
            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
              activeTab === 'received'
                ? 'bg-green-700 text-white'
                : 'bg-green-500/30 text-green-400'
            }`}>
              {claimableReceived.length} claimable
            </span>
          )}
          {confirmingReceived.length > 0 && (
            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
              activeTab === 'received'
                ? 'bg-orange-700 text-white'
                : 'bg-orange-500/30 text-orange-400'
            }`}>
              {confirmingReceived.length} confirming
            </span>
          )}
        </button>
      </div>

      {/* Sent Tips */}
      {activeTab === 'sent' && (
        <div className="space-y-3">
          {sentTips.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl p-8 text-center">
              <p className="text-zinc-500">No tips sent yet</p>
              <p className="text-zinc-600 text-sm mt-2">
                Use the Smirk extension to send tips to social media users
              </p>
            </div>
          ) : (
            sentTips.map((tip) => (
              <div
                key={tip.id}
                className={`bg-zinc-900 rounded-xl p-4 flex items-center justify-between ${
                  tip.status === 'pending' && !tip.is_claimable ? 'border border-dashed border-zinc-700' : ''
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono font-medium">
                      {formatAmount(tip.amount, tip.asset)}
                    </span>
                    <StatusBadge status={tip.status} />
                    {tip.status === 'pending' && (
                      <ConfirmationBadge
                        confirmations={tip.funding_confirmations}
                        required={tip.confirmations_required}
                        isClaimable={tip.is_claimable}
                      />
                    )}
                  </div>
                  <p className="text-sm text-zinc-500">
                    To{' '}
                    {tip.recipient_username ? (
                      <span className="text-zinc-400">
                        @{tip.recipient_username}
                        {tip.recipient_platform && (
                          <span className="text-zinc-600">
                            {' '}
                            ({tip.recipient_platform})
                          </span>
                        )}
                      </span>
                    ) : tip.is_public ? (
                      <span className="text-zinc-400">Public tip</span>
                    ) : (
                      <span className="text-zinc-600">Unknown</span>
                    )}
                    <span className="text-zinc-600 ml-2">
                      {formatDate(tip.created_at)}
                    </span>
                  </p>
                </div>

                {tip.status === 'pending' && hasExtension && (
                  <button
                    onClick={() => handleOpenExtension('clawback', tip.id)}
                    className="px-3 py-1.5 text-sm border border-zinc-600 text-zinc-400 rounded-lg hover:border-zinc-500 hover:text-white transition-colors"
                  >
                    Clawback
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Received Tips */}
      {activeTab === 'received' && (
        <div className="space-y-3">
          {receivedTips.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl p-8 text-center">
              <p className="text-zinc-500">No tips received yet</p>
              <p className="text-zinc-600 text-sm mt-2">
                Link your social accounts in Settings to receive tips
              </p>
            </div>
          ) : (
            receivedTips.map((tip) => {
              const canClaim = tip.status === 'pending' && tip.is_claimable && claimableTipIds.has(tip.id);
              const isConfirming = tip.status === 'pending' && !tip.is_claimable && tip.confirmations_required > 0;

              return (
                <div
                  key={tip.id}
                  className={`bg-zinc-900 rounded-xl p-4 flex items-center justify-between ${
                    isConfirming ? 'border border-dashed border-zinc-700' : ''
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`font-mono font-medium ${tip.status === 'claimed' ? 'text-green-400' : 'text-white'}`}>
                        +{formatAmount(tip.amount, tip.asset)}
                      </span>
                      <StatusBadge status={tip.status} />
                      {tip.status === 'pending' && (
                        <ConfirmationBadge
                          confirmations={tip.funding_confirmations}
                          required={tip.confirmations_required}
                          isClaimable={tip.is_claimable}
                        />
                      )}
                    </div>
                    <p className="text-sm text-zinc-500">
                      {tip.recipient_platform && (
                        <span className="text-zinc-400">
                          Via {tip.recipient_platform}
                        </span>
                      )}
                      <span className="text-zinc-600 ml-2">
                        {formatDate(tip.created_at)}
                      </span>
                    </p>
                  </div>

                  {canClaim && hasExtension ? (
                    <button
                      onClick={() => handleOpenExtension('claim', tip.id)}
                      className="px-4 py-1.5 text-sm bg-[#fbeb0a] text-black font-medium rounded-lg hover:bg-[#d4c708] transition-colors"
                    >
                      Claim
                    </button>
                  ) : isConfirming ? (
                    <span className="px-4 py-1.5 text-sm text-orange-400 font-medium">
                      Confirming...
                    </span>
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
