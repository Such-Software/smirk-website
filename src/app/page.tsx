'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getChallenge, verifySignature, getMe, getUserCount, type AuthResponse } from '@/lib/api';

type Asset = 'btc' | 'ltc' | 'xmr' | 'wow' | 'grin';

const COINS: { id: Asset; name: string; icon: string }[] = [
  { id: 'btc', name: 'Bitcoin', icon: '/coins/bitcoin.svg' },
  { id: 'ltc', name: 'Litecoin', icon: '/coins/litecoin.svg' },
  { id: 'xmr', name: 'Monero', icon: '/coins/monero.svg' },
  { id: 'wow', name: 'Wownero', icon: '/coins/wownero.svg' },
  { id: 'grin', name: 'Grin', icon: '/coins/grin.svg' },
];

type Step = 'initial' | 'choose-coin' | 'signing' | 'logged-in';

export default function Home() {
  const [step, setStep] = useState<Step>('initial');
  const [selectedCoin, setSelectedCoin] = useState<Asset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [hasExtension, setHasExtension] = useState<boolean | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [userCount, setUserCount] = useState<number | null>(null);

  // Check for extension on mount
  useEffect(() => {
    const check = () => setHasExtension(!!window.smirk);
    // Check immediately and after a delay (extension might inject late)
    check();
    const timeout = setTimeout(check, 500);
    return () => clearTimeout(timeout);
  }, []);

  // Fetch user count on mount
  useEffect(() => {
    getUserCount()
      .then((data) => setUserCount(data.count))
      .catch(() => {}); // Silently ignore errors
  }, []);

  const handleConnect = async () => {
    if (!window.smirk) {
      setError('Smirk extension not found');
      return;
    }

    try {
      setError(null);
      // Connect to extension (get public keys)
      await window.smirk.connect();
      setStep('choose-coin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    }
  };

  const handleCoinSelect = async (coin: Asset) => {
    if (!window.smirk) return;

    setSelectedCoin(coin);
    setStep('signing');
    setError(null);

    try {
      // Get challenge from backend
      const challenge = await getChallenge(window.location.origin);

      // Sign with the selected coin
      const result = await window.smirk.signMessage(challenge.challenge);
      const sig = result.signatures.find((s) => s.asset === coin);
      if (!sig) {
        throw new Error(`No signature found for ${coin}`);
      }

      // Verify with backend
      const auth = await verifySignature(challenge.challenge_id, {
        asset: coin,
        signature: sig.signature,
        public_key: sig.publicKey,
      });

      // Store token and show logged in
      localStorage.setItem('smirk_token', auth.access_token);
      localStorage.setItem('smirk_refresh', auth.refresh_token);
      setUser(auth.user);
      setStep('logged-in');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setStep('choose-coin');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smirk_token');
    localStorage.removeItem('smirk_refresh');
    setUser(null);
    setSelectedCoin(null);
    setStep('initial');
  };

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('smirk_token');
    if (token) {
      // Validate token with /auth/me
      getMe(token)
        .then((userData) => {
          setUser({
            id: userData.id,
            telegram_id: userData.telegram_id,
            telegram_username: userData.telegram_username,
          });
          setStep('logged-in');
        })
        .catch(() => {
          // Token invalid or expired - clear it
          localStorage.removeItem('smirk_token');
          localStorage.removeItem('smirk_refresh');
        })
        .finally(() => setCheckingSession(false));
    } else {
      setCheckingSession(false);
    }
  }, []);

  // Show loading while checking session
  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#fbeb0a] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {/* Logo */}
      <div className="mb-12 flex flex-col items-center">
        <h1 className="creepster-text text-4xl mb-4">SMIRK WALLET</h1>
        <div className="logo-glow">
          <Image
            src="/logo.svg"
            alt="Smirk"
            width={160}
            height={160}
            priority
          />
        </div>
        <p className="creepster-text text-2xl mt-4">smirk.ca$h</p>
        {/* Only show user count before logging in */}
        {!user && userCount !== null && userCount > 0 && (
          <Link
            href="/stats"
            className="text-zinc-500 text-sm mt-4 block hover:text-zinc-400 transition-colors"
          >
            <span className="text-[#fbeb0a] font-semibold">{userCount.toLocaleString()}</span>{' '}
            {userCount === 1 ? 'smirker' : 'smirkers'} and counting
          </Link>
        )}
      </div>

      {/* Initial state - Connect button */}
      {step === 'initial' && (
        <div className="flex flex-col items-center gap-6">
          {hasExtension === false && (
            <div className="flex flex-col items-center gap-4 mb-4">
              <p className="creepster-text text-xl text-[#fbeb0a]">GET SMIRKED</p>
              <div className="flex gap-4">
                <a
                  href="https://chrome.google.com/webstore/detail/smirk-wallet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                             hover:border-[#fbeb0a] hover:shadow-[0_0_12px_rgba(251,235,10,0.4)] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545h10.691A12 12 0 0 0 12 0zM1.931 5.47A11.943 11.943 0 0 0 0 12c0 6.012 4.42 10.991 10.189 11.864l3.953-6.847a5.45 5.45 0 0 1-6.865-2.29zm13.342 2.166a5.446 5.446 0 0 1 1.45 7.09l.002.001h-.002l-5.344 9.257c.206.01.413.016.621.016 6.627 0 12-5.373 12-12 0-1.54-.29-3.011-.818-4.364zM12 16.364a4.364 4.364 0 1 1 0-8.728 4.364 4.364 0 0 1 0 8.728z"/>
                  </svg>
                  <span className="text-sm">Chrome Store</span>
                </a>
                <a
                  href="https://github.com/Such-Software/smirk-extension/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg
                             hover:border-[#fbeb0a] hover:shadow-[0_0_12px_rgba(251,235,10,0.4)] transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-sm">GitHub</span>
                </a>
              </div>
            </div>
          )}

          <button
            onClick={handleConnect}
            disabled={hasExtension === false}
            className="px-8 py-4 bg-[#fbeb0a] text-black font-bold rounded-xl
                       hover:bg-[#d4c708] transition-colors disabled:opacity-50
                       disabled:cursor-not-allowed text-lg"
          >
            Connect with Smirk
          </button>
        </div>
      )}

      {/* Choose coin step */}
      {step === 'choose-coin' && (
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-xl font-semibold mb-2">Choose your coin to sign in</h2>
          <p className="text-zinc-400 text-sm mb-4">
            Pick your favorite cryptocurrency to authenticate
          </p>

          <div className="grid grid-cols-5 gap-4">
            {COINS.map((coin) => (
              <button
                key={coin.id}
                onClick={() => handleCoinSelect(coin.id)}
                className={`coin-btn ${selectedCoin === coin.id ? 'selected' : ''}`}
              >
                <Image src={coin.icon} alt={coin.name} width={48} height={48} />
                <span>{coin.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Signing step */}
      {step === 'signing' && (
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-[#fbeb0a] border-t-transparent rounded-full" />
          <p className="text-zinc-400">
            Signing with {selectedCoin?.toUpperCase()}...
          </p>
          <p className="text-zinc-500 text-sm">Check your extension</p>
        </div>
      )}

      {/* Logged in state */}
      {step === 'logged-in' && user && (
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-[#fbeb0a] rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Logged in!</h2>
            <p className="text-zinc-400 text-sm">
              Signed in with {selectedCoin?.toUpperCase()}
            </p>
          </div>

          <div className="bg-zinc-900 rounded-xl p-6 w-full max-w-md">
            <p className="text-zinc-500 text-xs mb-1">User ID</p>
            <p className="font-mono text-sm break-all">{user.id}</p>

            {user.telegram_username && (
              <>
                <p className="text-zinc-500 text-xs mt-4 mb-1">Telegram</p>
                <p className="text-sm">@{user.telegram_username}</p>
              </>
            )}
          </div>

          <div className="flex gap-4">
            <Link
              href="/tips"
              className="px-6 py-2 border border-zinc-700 rounded-lg text-sm
                         hover:border-[#fbeb0a] hover:shadow-[0_0_12px_rgba(251,235,10,0.4)] transition-all"
            >
              Tips
            </Link>
            <Link
              href="/settings"
              className="px-6 py-2 border border-zinc-700 rounded-lg text-sm
                         hover:border-[#fbeb0a] hover:shadow-[0_0_12px_rgba(251,235,10,0.4)] transition-all"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2 border border-zinc-700 rounded-lg text-sm
                         hover:border-[#fbeb0a] hover:shadow-[0_0_12px_rgba(251,235,10,0.4)] transition-all"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

    </div>
  );
}
