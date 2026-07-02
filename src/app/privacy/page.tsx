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
        <p className="text-zinc-400 text-sm">
          Effective July 2, 2026.
        </p>

        <p className="text-zinc-300 text-lg leading-relaxed">
          At Smirk, we believe privacy is a fundamental human right. Our architecture is designed
          so that we never have access to your private keys, unencrypted funds, or the ability
          to spend your money.
        </p>

        <p className="text-zinc-400">
          Smirk is published by <strong className="text-white">Such Software LLC</strong>, a
          single-member limited liability company organized under the laws of the Commonwealth
          of Pennsylvania, United States (&quot;Such Software,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). This policy
          explains what stays on your device, what our backend receives to power tipping and
          balances, and which independent third parties see what. It applies to the Smirk browser
          extension, desktop application, and this website (smirk.cash).
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
            To provide a fast mobile and browser-extension experience without requiring you
            to download the entire blockchain, Smirk collects and stores your Private View
            Keys for Monero (XMR) and Wownero (WOW).
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4">
            <li>
              <strong className="text-white">Purpose:</strong> These keys allow our Light Wallet Server (LWS)
              to scan the blockchain on your behalf to identify incoming tips and update your balance.
            </li>
            <li>
              <strong className="text-white">Limitation:</strong> A View Key cannot be used to spend your funds.
              It only allows the server to see that a transaction has occurred. Your funds remain secure
              and spendable only by your local Smirk wallet (browser extension or mobile app).
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

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">D. Bitcoin &amp; Litecoin Public Addresses</h3>
          <p className="text-zinc-400 mb-3">
            To show your BTC and LTC balances and broadcast your transactions, our backend
            forwards your <strong>public</strong> wallet addresses to mainstream blockchain
            indexers (e.g. mempool.space for Bitcoin, litecoinspace.org for Litecoin).
            These are the same indexers most non-custodial wallets use.
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4">
            <li><strong className="text-white">What is shared:</strong> only public address strings and signed transaction bytes — never seed phrases or private keys.</li>
            <li><strong className="text-white">What we store:</strong> nothing additional on our side beyond what is already in your wallet&apos;s local view.</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">E. Wallet Fingerprint</h3>
          <p className="text-zinc-400 mb-3">
            On first login your wallet derives a one-way <strong>fingerprint</strong>
            (SHA-256 of your seed) and sends it to our backend as a stable, anonymous
            identifier. It is used to associate your wallet with social handles and tip
            history across devices, and is the value our backend joins on internally.
            It is <strong>not reversible</strong> back to your seed and cannot be used
            to spend your funds.
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">F. Optional Dapp Connections (<code>window.smirk</code>)</h3>
          <p className="text-zinc-400 mb-3">
            Smirk exposes a <code>window.smirk</code> API to web pages so dapps like
            smirk.cash, claim pages, and merchant sites can request a connection or a
            signature from your wallet. Connections are per-origin and require an
            explicit approval prompt the first time a site asks; you can revoke any
            origin at any time from Settings. You can also globally disable the
            <code>window.smirk</code> surface from Settings — when off, pages cannot
            detect that Smirk is installed.
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4">
            <li><strong className="text-white">What gets shared:</strong> only the public material you approve (asset public keys, addresses) plus the signatures you explicitly authorize per request.</li>
            <li><strong className="text-white">What we do not share:</strong> seed phrases, private spend keys, balances of un-authorized assets, history of other origins.</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">G. Optional Crypto Swaps</h3>
          <p className="text-zinc-400 mb-3">
            Smirk offers in-wallet crypto swaps (e.g. BTC ↔ XMR) via third-party
            aggregators such as <strong>Trocador</strong>. We do not operate an
            exchange ourselves. When you choose to swap, the wallet queries the
            third-party aggregator for quotes and routes the trade through them.
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4">
            <li><strong className="text-white">What gets shared with the aggregator:</strong> the asset pair, amount, and your destination and refund public addresses — exactly what the aggregator needs to fulfill the trade.</li>
            <li><strong className="text-white">Subject to the aggregator&apos;s own privacy policy:</strong> we are a passthrough at trade time. Trocador&apos;s policy lives at <a className="text-[#fbeb0a] hover:underline" href="https://trocador.app/en/privacypolicy/" target="_blank" rel="noopener noreferrer">trocador.app/en/privacypolicy/</a>.</li>
            <li><strong className="text-white">Referral commission:</strong> Such Software receives a referral commission (around 1% of the swap amount) from Trocador, already reflected in the quoted rate. We are never in custody of or in the settlement path for the swapped funds — see our <Link href="/terms" className="text-[#fbeb0a] hover:underline">Terms</Link> for details.</li>
            <li><strong className="text-white">Opt-in:</strong> no swap data leaves your device until you tap to request a quote.</li>
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
            <li><strong className="text-[#fbeb0a]">Public Addresses:</strong> Your BTC/LTC public addresses are forwarded to mainstream blockchain indexers — the same ones every non-custodial wallet uses. Nothing private.</li>
            <li><strong className="text-[#fbeb0a]">Fingerprint:</strong> A one-way SHA-256 of your seed is sent to identify your wallet — not reversible, cannot move funds.</li>
            <li><strong className="text-[#fbeb0a]">Encrypted:</strong> All tip payloads are encrypted on your device.</li>
            <li><strong className="text-[#fbeb0a]">Identity:</strong> We only store your Social ID to help people find your public key.</li>
            <li><strong className="text-[#fbeb0a]">Dapps:</strong> The <code>window.smirk</code> API is opt-in per origin, revocable per origin, and can be turned off globally in Settings.</li>
            <li><strong className="text-[#fbeb0a]">Swaps:</strong> Optional, opt-in, routed through third-party aggregators (e.g. Trocador). We never operate an exchange, but we do earn a ~1% referral commission that&apos;s baked into the quoted rate.</li>
          </ul>
        </section>

        {/* Third parties you choose to enable */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">4. Third parties you choose to enable</h2>
          <p className="text-zinc-400">
            Some features connect you to independent third parties operated by others,
            not by us — Trocador for swaps, the blockchain indexers noted above, and any
            site you connect to through the <code>window.smirk</code> interface. Those
            endpoints see whatever your interactions with them entail, and each has its
            own privacy policy. We neither control nor monitor those connections, and we
            are not responsible for how those parties handle your data.
          </p>
        </section>

        {/* Children */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">5. Children</h2>
          <p className="text-zinc-400">
            Smirk is not directed to people under 18, and we do not knowingly collect
            data from minors. If you believe a minor has used Smirk and you want to
            delete any associated state, uninstalling the extension or app on the
            relevant device removes all local data; contact us at the address below to
            remove associated backend records.
          </p>
        </section>

        {/* Your rights */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">6. Your rights</h2>
          <p className="text-zinc-400 mb-3">
            Your seed phrase and private spend keys never leave your device, and
            uninstalling removes all local state. For the limited data our backend does
            hold (Monero/Wownero view keys, your wallet fingerprint, linked social
            handles, and encrypted tip metadata), residents of the EU/UK (GDPR Articles
            15–22) and California (CCPA / CPRA) may request access to, correction of, or
            deletion of that data by emailing{' '}
            <a href="mailto:support@such.software" className="text-[#fbeb0a] hover:underline">
              support@such.software
            </a>
            . We do not sell your data.
          </p>
          <p className="text-zinc-400">
            For data held by third parties you&apos;ve used through Smirk (Trocador, node
            operators, blockchain indexers), contact those providers directly using the
            privacy contact in their respective policies.
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">7. Changes to this policy</h2>
          <p className="text-zinc-400">
            We&apos;ll post any update to this page with a new effective date. Material
            changes will be announced via{' '}
            <a
              href="https://x.com/such_software"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#fbeb0a] hover:underline"
            >
              @such_software
            </a>{' '}
            and the app&apos;s release notes. Continued use of Smirk after a change indicates
            acceptance of the revised policy.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-zinc-800/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#fbeb0a] mb-4">Contact</h2>
          <p className="text-zinc-300">
            Privacy questions:{' '}
            <a href="mailto:support@such.software" className="text-[#fbeb0a] hover:underline">
              support@such.software
            </a>
            . Smirk is developed and maintained by Such Software LLC.
          </p>
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
