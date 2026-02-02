'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getPublicStats, type PublicStats } from '@/lib/api';

// Asset display names and colors
const ASSETS: Record<string, { name: string; color: string }> = {
  btc: { name: 'Bitcoin', color: '#f7931a' },
  ltc: { name: 'Litecoin', color: '#c0c0c0' },
  xmr: { name: 'Monero', color: '#6b7280' },
  wow: { name: 'Wownero', color: '#ff69b4' },
  grin: { name: 'Grin', color: '#ffc107' },
  unknown: { name: 'Unknown', color: '#374151' },
};

// Platform display names
const PLATFORMS: Record<string, string> = {
  telegram: 'Telegram',
  discord: 'Discord',
  signal: 'Signal',
  matrix: 'Matrix',
};

export default function StatsPage() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPublicStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#fbeb0a] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <p className="text-red-400 mb-4">{error}</p>
        <Link href="/" className="text-[#fbeb0a] hover:underline">
          Go home
        </Link>
      </div>
    );
  }

  // Calculate total for percentage bars
  const totalByAsset = Object.values(stats?.users_by_preferred_asset || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Smirk" width={40} height={40} />
          <span className="creepster-text text-xl">SMIRK</span>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8">Platform Stats</h1>

      {/* Total Users */}
      <div className="bg-zinc-900 rounded-xl p-6 mb-6 text-center">
        <div className="text-5xl font-bold text-[#fbeb0a] mb-2">
          {stats?.total_users.toLocaleString()}
        </div>
        <div className="text-zinc-400">Total Smirkers</div>
      </div>

      {/* Users by Preferred Coin */}
      {Object.keys(stats?.users_by_preferred_asset || {}).length > 0 && (
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Favorite Login Coin</h2>
          <div className="space-y-4">
            {Object.entries(stats?.users_by_preferred_asset || {})
              .sort(([, a], [, b]) => b - a)
              .map(([asset, count]) => {
                const info = ASSETS[asset] || ASSETS.unknown;
                const percentage = totalByAsset > 0 ? (count / totalByAsset) * 100 : 0;
                return (
                  <div key={asset} className="group">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium" style={{ color: info.color }}>
                        {info.name}
                      </span>
                      <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                        {count.toLocaleString()} logins ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-4 bg-zinc-800 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all duration-500 group-hover:brightness-110"
                        style={{
                          width: `${Math.max(percentage, 2)}%`,
                          backgroundColor: info.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          <p className="text-xs text-zinc-600 mt-4 text-center">
            Based on {totalByAsset.toLocaleString()} total logins
          </p>
        </div>
      )}

      {/* Linked Accounts */}
      {Object.keys(stats?.linked_accounts_by_platform || {}).length > 0 && (
        <div className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Linked Accounts</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(stats?.linked_accounts_by_platform || {})
              .sort(([, a], [, b]) => b - a)
              .map(([platform, count]) => (
                <div key={platform} className="bg-zinc-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#fbeb0a]">{count}</div>
                  <div className="text-sm text-zinc-400">{PLATFORMS[platform] || platform}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tips Sent */}
      <div className="bg-zinc-900 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Tips Sent</h2>
        <div className="text-center">
          <div className="text-3xl font-bold text-[#fbeb0a]">
            {stats?.total_tips_sent.toLocaleString()}
          </div>
          <div className="text-sm text-zinc-400 mt-1">Total tips created</div>
        </div>
      </div>

      {/* Back link */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-zinc-500 hover:text-[#fbeb0a] transition-colors">
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}
