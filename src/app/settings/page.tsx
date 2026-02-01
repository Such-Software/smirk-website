'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getMe,
  getLinkedSocials,
  initiateLink,
  unlinkSocial,
  getMyUsername,
  setUsername,
  getDiscordAuthUrl,
  completeDiscordOAuth,
  type MeResponse,
  type LinkedSocial,
} from '@/lib/api';

type LinkStep = 'idle' | 'linking' | 'waiting';

export default function SettingsPage() {
  const [user, setUser] = useState<MeResponse | null>(null);
  const [socials, setSocials] = useState<LinkedSocial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Username state
  const [smirkUsername, setSmirkUsername] = useState<string>('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [savingUsername, setSavingUsername] = useState(false);

  // Telegram linking state
  const [linkStep, setLinkStep] = useState<LinkStep>('idle');
  const [deepLink, setDeepLink] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  // Discord linking state
  const [discordLinking, setDiscordLinking] = useState(false);
  const [discordError, setDiscordError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('smirk_token') : null;

  // Handle Discord OAuth callback (code + state in URL params)
  useEffect(() => {
    if (typeof window === 'undefined' || !token) return;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      // Clean URL immediately
      window.history.replaceState({}, '', '/settings');

      // Complete Discord OAuth
      setDiscordLinking(true);
      setDiscordError(null);

      completeDiscordOAuth(token, code, state)
        .then((linkedSocial) => {
          // Refresh socials list
          return getLinkedSocials(token).then((data) => {
            setSocials(data.socials);
          });
        })
        .catch((err) => {
          setDiscordError(err instanceof Error ? err.message : 'Failed to link Discord');
        })
        .finally(() => {
          setDiscordLinking(false);
        });
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([getMe(token), getLinkedSocials(token), getMyUsername(token)])
      .then(([userData, socialsData, username]) => {
        setUser(userData);
        setSocials(socialsData.socials);
        setSmirkUsername(username || '');
        setUsernameInput(username || '');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSaveUsername = async () => {
    if (!token) return;
    const trimmed = usernameInput.trim().toLowerCase();

    if (trimmed.length < 3 || trimmed.length > 32) {
      setUsernameError('Username must be 3-32 characters');
      return;
    }
    if (!/^[a-z0-9_]+$/.test(trimmed)) {
      setUsernameError('Only lowercase letters, numbers, and underscores allowed');
      return;
    }

    setSavingUsername(true);
    setUsernameError(null);
    try {
      const result = await setUsername(token, trimmed);
      setSmirkUsername(result.username);
      setEditingUsername(false);
    } catch (err) {
      setUsernameError(err instanceof Error ? err.message : 'Failed to save username');
    } finally {
      setSavingUsername(false);
    }
  };

  const handleStartLink = async () => {
    if (!token) return;
    setLinkStep('linking');
    setLinkError(null);

    try {
      const result = await initiateLink(token, 'telegram');
      setDeepLink(result.deep_link);
      setLinkStep('waiting');
      // Start polling for verification
      startPolling();
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : 'Failed to initiate link');
      setLinkStep('idle');
    }
  };

  const startPolling = () => {
    if (polling) return;
    setPolling(true);
  };

  // Polling effect for verification status
  useEffect(() => {
    if (!polling || !token) return;

    const interval = setInterval(async () => {
      try {
        const socialsData = await getLinkedSocials(token);
        setSocials(socialsData.socials);
        const telegram = socialsData.socials.find((s) => s.platform === 'telegram');
        if (telegram?.verified) {
          // Success! Stop polling and reset state
          setPolling(false);
          setLinkStep('idle');
          setDeepLink(null);
        }
      } catch {
        // Ignore polling errors, keep trying
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [polling, token]);

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
    setDeepLink(null);
    setLinkError(null);
    setPolling(false);
  };

  const handleLinkDiscord = async () => {
    if (!token) return;
    setDiscordLinking(true);
    setDiscordError(null);

    try {
      const { auth_url } = await getDiscordAuthUrl(token);
      // Redirect to Discord OAuth
      window.location.href = auth_url;
    } catch (err) {
      setDiscordError(err instanceof Error ? err.message : 'Failed to start Discord link');
      setDiscordLinking(false);
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
  const discordSocial = socials.find((s) => s.platform === 'discord');

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Smirk" width={40} height={40} />
          <span className="creepster-text text-xl">SMIRK</span>
        </Link>
        <Link
          href="/tips"
          className="text-sm text-zinc-400 hover:text-white"
        >
          Tips
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

      {/* Smirk Username */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-zinc-400">Smirk Username</h2>
        <div className="bg-zinc-900 rounded-xl p-4">
          {!editingUsername ? (
            <div className="flex items-center justify-between">
              <div>
                {smirkUsername ? (
                  <>
                    <p className="text-zinc-500 text-xs mb-1">Your username</p>
                    <p className="text-[#fbeb0a] font-medium">@{smirkUsername}</p>
                  </>
                ) : (
                  <p className="text-zinc-500 text-sm">No username set</p>
                )}
              </div>
              <button
                onClick={() => setEditingUsername(true)}
                className="px-4 py-2 bg-[#fbeb0a] text-black font-medium rounded-lg hover:bg-[#d4c708]"
              >
                {smirkUsername ? 'Change' : 'Set Username'}
              </button>
            </div>
          ) : (
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Choose a username (3-32 chars, lowercase alphanumeric + underscores)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.toLowerCase())}
                  placeholder="my_username"
                  maxLength={32}
                  className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#fbeb0a]"
                />
                <button
                  onClick={handleSaveUsername}
                  disabled={savingUsername}
                  className="px-4 py-2 bg-[#fbeb0a] text-black font-medium rounded-lg hover:bg-[#d4c708] disabled:opacity-50"
                >
                  {savingUsername ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setEditingUsername(false);
                    setUsernameInput(smirkUsername);
                    setUsernameError(null);
                  }}
                  className="px-4 py-2 border border-zinc-700 rounded-lg hover:border-zinc-500"
                >
                  Cancel
                </button>
              </div>
              {usernameError && <p className="mt-2 text-sm text-red-400">{usernameError}</p>}
              <p className="mt-3 text-xs text-zinc-500">
                Others can tip you directly using your Smirk username
              </p>
            </div>
          )}
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
                  <p className="text-sm text-green-400">
                    {telegramSocial.username ? `@${telegramSocial.username}` : telegramSocial.display_name || 'Linked'}
                  </p>
                ) : telegramSocial?.pending_verification ? (
                  <p className="text-sm text-yellow-400">Verification pending</p>
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
          {linkStep === 'linking' && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="animate-spin w-5 h-5 border-2 border-[#fbeb0a] border-t-transparent rounded-full" />
                <span className="text-zinc-400">Setting up link...</span>
              </div>
            </div>
          )}

          {linkStep === 'waiting' && deepLink && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-sm text-zinc-400 mb-4">
                Click the button below to open Telegram and link your account automatically:
              </p>

              <div className="flex gap-2 mb-4">
                <a
                  href={deepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0088cc] text-white font-medium rounded-lg hover:bg-[#0077b3]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                  </svg>
                  Open Telegram
                </a>
                <button
                  onClick={handleCancelLink}
                  className="px-4 py-2 border border-zinc-700 rounded-lg hover:border-zinc-500"
                >
                  Cancel
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <div className="animate-spin w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full" />
                <span>Waiting for verification...</span>
              </div>

              {linkError && <p className="mt-2 text-sm text-red-400">{linkError}</p>}
            </div>
          )}
        </div>

        {/* Discord */}
        <div className="bg-zinc-900 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5865F2] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Discord</p>
                {discordSocial?.verified ? (
                  <p className="text-sm text-green-400">
                    {discordSocial.display_name || discordSocial.username || 'Linked'}
                  </p>
                ) : discordLinking ? (
                  <p className="text-sm text-yellow-400">Linking...</p>
                ) : (
                  <p className="text-sm text-zinc-500">Not linked</p>
                )}
              </div>
            </div>

            {discordSocial?.verified ? (
              <button
                onClick={() => handleUnlink('discord')}
                className="px-3 py-1 text-sm text-red-400 border border-red-400/50 rounded hover:bg-red-400/10"
              >
                Unlink
              </button>
            ) : (
              <button
                onClick={handleLinkDiscord}
                disabled={discordLinking}
                className="px-4 py-2 bg-[#fbeb0a] text-black font-medium rounded-lg hover:bg-[#d4c708] disabled:opacity-50"
              >
                {discordLinking ? 'Linking...' : 'Link'}
              </button>
            )}
          </div>

          {discordError && (
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <p className="text-sm text-red-400">{discordError}</p>
            </div>
          )}
        </div>

        {/* Future platforms */}
        <div className="space-y-3">
          {['Signal', 'Matrix'].map((platform) => (
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
