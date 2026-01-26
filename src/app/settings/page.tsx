'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getMe,
  getLinkedSocials,
  registerSocial,
  unlinkSocial,
  type MeResponse,
  type LinkedSocial,
} from '@/lib/api';

type LinkStep = 'idle' | 'entering' | 'verifying';

export default function SettingsPage() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [socials, setSocials] = useState<LinkedSocial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Telegram linking state
  const [linkStep, setLinkStep] = useState<LinkStep>('idle');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [botLink, setBotLink] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('smirk_token') : null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([getMe(token), getLinkedSocials(token)])
      .then(([userData, socialsData]) => {
        setUser(userData);
        setSocials(socialsData.socials);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleStartLink = () => {
    setLinkStep('entering');
    setLinkError(null);
  };

  const handleSubmitUsername = async () => {
    if (!token || !telegramUsername.trim()) return;

    setLinkError(null);
    try {
      const result = await registerSocial(token, 'telegram', telegramUsername.trim());
      setVerificationCode(result.verification_code);
      setBotLink(result.bot_link);
      setLinkStep('verifying');
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : 'Failed to start verification');
    }
  };

  const handleUnlink = async (platform: string) => {
    if (!token) return;
    if (!confirm(`Unlink ${platform}?`)) return;

    try {
      await unlinkSocial(token, platform);
      setSocials(socials.filter((s) => s.platform !== platform));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unlink');
    }
  };

  const handleCancelLink = () => {
    setLinkStep('idle');
    setTelegramUsername('');
    setVerificationCode(null);
    setBotLink(null);
    setLinkError(null);
  };

  const handleVerificationDone = async () => {
    if (!token) return;
    // Refresh socials to check if verified
    try {
      const socialsData = await getLinkedSocials(token);
      setSocials(socialsData.socials);
      const telegram = socialsData.socials.find((s) => s.platform === 'telegram');
      if (telegram?.verified) {
        handleCancelLink();
      } else {
        setLinkError('Verification not complete. Send the code to the bot and try again.');
      }
    } catch {
      setLinkError('Failed to check verification status');
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

  const telegramSocial = socials.find((s) => s.platform === 'telegram');

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Smirk" width={40} height={40} />
          <span className="creepster-text text-xl">SMIRK</span>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* User Info */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-zinc-400">Account</h2>
        <div className="bg-zinc-900 rounded-xl p-4">
          <p className="text-zinc-500 text-xs mb-1">User ID</p>
          <p className="font-mono text-sm break-all">{user.id}</p>
        </div>
      </section>

      {/* Linked Accounts */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-zinc-400">Linked Accounts</h2>

        {/* Telegram */}
        <div className="bg-zinc-900 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0088cc] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Telegram</p>
                {telegramSocial?.verified ? (
                  <p className="text-sm text-green-400">@{telegramSocial.username}</p>
                ) : telegramSocial?.pending_verification ? (
                  <p className="text-sm text-yellow-400">Pending: @{telegramSocial.username}</p>
                ) : (
                  <p className="text-sm text-zinc-500">Not linked</p>
                )}
              </div>
            </div>

            {telegramSocial?.verified ? (
              <button
                onClick={() => handleUnlink('telegram')}
                className="px-3 py-1 text-sm text-red-400 border border-red-400/50 rounded hover:bg-red-400/10"
              >
                Unlink
              </button>
            ) : linkStep === 'idle' ? (
              <button
                onClick={handleStartLink}
                className="px-4 py-2 bg-[#fbeb0a] text-black font-medium rounded-lg hover:bg-[#d4c708]"
              >
                Link
              </button>
            ) : null}
          </div>

          {/* Link flow UI */}
          {linkStep === 'entering' && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <label className="block text-sm text-zinc-400 mb-2">
                Enter your Telegram username
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  placeholder="@username"
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#fbeb0a]"
                />
                <button
                  onClick={handleSubmitUsername}
                  disabled={!telegramUsername.trim()}
                  className="px-4 py-2 bg-[#fbeb0a] text-black font-medium rounded-lg hover:bg-[#d4c708] disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  onClick={handleCancelLink}
                  className="px-4 py-2 border border-zinc-700 rounded-lg hover:border-zinc-500"
                >
                  Cancel
                </button>
              </div>
              {linkError && <p className="mt-2 text-sm text-red-400">{linkError}</p>}
            </div>
          )}

          {linkStep === 'verifying' && verificationCode && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-zinc-400 mb-2">Your verification code:</p>
                <p className="text-2xl font-mono font-bold text-[#fbeb0a]">{verificationCode}</p>
              </div>

              <ol className="text-sm text-zinc-400 space-y-2 mb-4">
                <li>
                  1. Open{' '}
                  <a
                    href={botLink || 'https://t.me/smirk_wallet_bot'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0088cc] hover:underline"
                  >
                    @smirk_wallet_bot
                  </a>{' '}
                  on Telegram
                </li>
                <li>2. Send: <code className="bg-zinc-700 px-2 py-0.5 rounded">/verify {verificationCode}</code></li>
                <li>3. Click &quot;I&apos;ve verified&quot; below</li>
              </ol>

              <div className="flex gap-2">
                <button
                  onClick={handleVerificationDone}
                  className="px-4 py-2 bg-[#fbeb0a] text-black font-medium rounded-lg hover:bg-[#d4c708]"
                >
                  I&apos;ve verified
                </button>
                <button
                  onClick={handleCancelLink}
                  className="px-4 py-2 border border-zinc-700 rounded-lg hover:border-zinc-500"
                >
                  Cancel
                </button>
              </div>
              {linkError && <p className="mt-2 text-sm text-red-400">{linkError}</p>}
            </div>
          )}
        </div>

        {/* Future platforms */}
        <div className="space-y-3">
          {['Discord', 'Signal', 'Matrix'].map((platform) => (
            <div key={platform} className="bg-zinc-900/50 rounded-xl p-4 opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-zinc-700 rounded-full" />
                <div>
                  <p className="font-medium">{platform}</p>
                  <p className="text-sm text-zinc-500">Coming soon</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
