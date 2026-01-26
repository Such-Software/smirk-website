'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getChallenge, verifySignature, getMe, type AuthResponse } from '@/lib/api';

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

  // Check for extension on mount
  useEffect(() => {
    const check = () => setHasExtension(!!window.smirk);
    // Check immediately and after a delay (extension might inject late)
    check();
    const timeout = setTimeout(check, 500);
    return () => clearTimeout(timeout);
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
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
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
      </div>

      {/* Initial state - Connect button */}
      {step === 'initial' && (
        <div className="flex flex-col items-center gap-6">
          {hasExtension === false && (
            <p className="text-zinc-400 text-sm mb-4">
              Install the{' '}
              <a
                href="https://chrome.google.com/webstore/detail/smirk-wallet"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#fbeb0a] hover:underline"
              >
                Smirk extension
              </a>{' '}
              to continue
            </p>
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
