'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col items-center">
        <Link href="/" className="logo-glow mb-4">
          <Image
            src="/logo.svg"
            alt="Smirk"
            width={80}
            height={80}
            priority
          />
        </Link>
        <h1 className="creepster-text text-3xl">Privacy Policy</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl w-full bg-zinc-900/50 rounded-2xl p-8 space-y-8">
        <p className="text-zinc-300 text-lg leading-relaxed">
          At Smirk, we believe privacy is a fundamental human right. Our architecture is designed
          so that we never have access to your private keys, unencrypted funds, or the ability
          to spend your money.
        </p>

        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">1. The Non-Custodial Guarantee</h2>
          <p className="text-zinc-300 mb-4">Smirk is a <strong>non-custodial</strong> service.</p>
          <ul className="space-y-3 text-zinc-400">
            <li>
              <strong className="text-white">Private Spend Keys:</strong> Your private spend keys
              (the keys required to move money) are generated and stored locally on your device.
              They are never transmitted to our servers.
            </li>
            <li>
              <strong className="text-white">No Access:</strong> We cannot &quot;freeze&quot; accounts or
              &quot;seize&quot; funds because we do not hold the keys to move them.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">2. Information We Collect</h2>
          <p className="text-zinc-300 mb-4">
            To facilitate social tipping and identity verification, we collect the following:
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">A. Monero &amp; Wownero Private View Keys</h3>
          <p className="text-zinc-400 mb-3">
            To provide a fast mobile and extension experience without requiring you to download
            the entire blockchain, Smirk collects and stores your Private View Keys for Monero (XMR)
            and Wownero (WOW).
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4">
            <li>
              <strong className="text-white">Purpose:</strong> These keys allow our Light Wallet Server (LWS)
              to scan the blockchain on your behalf to identify incoming tips.
            </li>
            <li>
              <strong className="text-white">Limitation:</strong> A View Key cannot be used to spend your funds.
              It only allows the server to see that a transaction has occurred. Your funds remain secure
              and spendable only by your local extension.
            </li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">B. Social Identity Data</h3>
          <p className="text-zinc-400 mb-2">
            When you link a social account (Telegram, Discord, etc.), we store:
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4">
            <li>Your platform-specific User ID and Username.</li>
            <li>Your public wallet address (so others can find you to send tips).</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">C. Transaction Metadata &amp; Payloads</h3>
          <ul className="space-y-2 text-zinc-400 ml-4">
            <li><strong className="text-white">Encrypted Payloads:</strong> The ciphertext of the tip (which we cannot read).</li>
            <li><strong className="text-white">Status &amp; Timestamps:</strong> Metadata regarding when a tip was created or claimed.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">3. How We Protect Your Data</h2>
          <ul className="space-y-3 text-zinc-400">
            <li>
              <strong className="text-white">Backend Security:</strong> Our Rust-based backend utilizes
              SQLx type safety and memory-safe architecture to protect your stored view keys and social data.
            </li>
            <li>
              <strong className="text-white">No Sale of Data:</strong> We do not, and will never,
              sell your social handles, transaction history, or view key data to third parties.
            </li>
          </ul>
        </section>

        {/* Smirk Approach */}
        <section className="bg-zinc-800/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#fbeb0a] mb-4 flex items-center gap-2">
            <span>🛡️</span> Why do we need your View Key? (The &quot;Smirk&quot; Approach)
          </h2>
          <p className="text-zinc-300 mb-4">Traditional Monero wallets require hours of syncing. By providing your Private View Key to our server:</p>
          <ul className="space-y-2 text-zinc-400">
            <li>✓ We scan the blockchain for you in real-time.</li>
            <li>✓ We notify your extension when a tip arrives.</li>
            <li>✓ You remain the only one with the Private Spend Key required to actually move those funds.</li>
          </ul>
        </section>

        {/* Quick Summary */}
        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">🛡️ Quick-Glance Summary</h2>
          <ul className="space-y-2 text-zinc-400">
            <li><strong className="text-[#fbeb0a]">Non-Custodial:</strong> We never see your private spend keys. Your money is yours.</li>
            <li><strong className="text-[#fbeb0a]">View Keys:</strong> We collect Monero/Wownero view keys to scan for your tips so you don&apos;t have to sync the whole blockchain.</li>
            <li><strong className="text-[#fbeb0a]">Encrypted:</strong> All tip payloads are encrypted on your device.</li>
            <li><strong className="text-[#fbeb0a]">Identity:</strong> We only store your Social ID to help people find your public key.</li>
          </ul>
        </section>

        {/* Back link */}
        <div className="pt-4 text-center">
          <Link
            href="/"
            className="text-[#fbeb0a] hover:underline"
          >
            ← Back to Smirk
          </Link>
        </div>
      </div>
    </div>
  );
}
