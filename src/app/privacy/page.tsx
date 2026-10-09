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
          Effective October 9, 2026.
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
          explains what stays on your device, what our backend receives to power identity,
          balances, tipping, and optional messaging, and which independent third parties see
          what. It applies to the Smirk browser extension, desktop application, and this website
          (smirk.cash). Smirk&apos;s v0.3 backend is open source and self-hostable: you can run
          your own instance (or use another operator&apos;s), in which case the backend data
          described here goes to that server, not ours.
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
            queries <strong>Electrum/Fulcrum</strong> servers with your <strong>public</strong>
            wallet addresses. The default configuration uses public Electrum servers, the same
            kind most non-custodial wallets use; a self-hosted operator can point at their own
            node instead.
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

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">G. Optional Crypto Swaps and Other Third Parties</h3>
          <p className="text-zinc-400 mb-3">
            Smirk offers in-wallet crypto swaps through independent providers. We do not
            operate an exchange ourselves and we are never in custody of, or in the settlement
            path for, the swapped funds. Opening the Swap tab contacts no swap provider. Each
            provider is contacted only after you choose it, and directly from your device
            unless stated otherwise, so it sees your IP address.
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4">
            <li><strong className="text-white">Trocador</strong> (<code>api.trocador.app</code>), when you choose it: the pair and amount for a quote, and your receive and refund addresses when you confirm. Our backend records the swap so its status can be followed. Trocador&apos;s policy lives at <a className="text-[#fbeb0a] hover:underline" href="https://trocador.app/en/privacypolicy/" target="_blank" rel="noopener noreferrer">trocador.app/en/privacypolicy/</a>.</li>
            <li><strong className="text-white">THORChain</strong>, through Liquify&apos;s public gateway (<code>gateway.liquify.com</code>), when you tap the THORChain card: a pool and vault lookup. A quote sends the pair and amount; confirming sends your receive address and, for a Monero deposit, your refund address; status checks send the deposit&apos;s transaction id. This does not pass through our backend. The swap instruction, including those addresses, is also written into the deposit transaction itself, so it is public on chain.</li>
            <li><strong className="text-white">NonLogs</strong>, only when the backend you use offers it: the pair, amount, payout address and refund address pass through that backend to NonLogs, which keeps them under the backend operator&apos;s NonLogs account. Your IP address does not reach NonLogs. The backend keeps a record linking your account to the swap for 90 days, without addresses or amounts.</li>
            <li><strong className="text-white">Neroswap</strong> (<code>neroswap.com</code>), for WOW and GRIN price lookups, only when you tap for live prices.</li>
            <li><strong className="text-white">The old Smirk server</strong> (<code>backend.smirk.cash</code>), only when you tap to find tips sent to a v0.2 wallet: the wallet signs in there with your pre-v0.3 BTC key, which creates an empty account there if that key never had one.</li>
            <li><strong className="text-white">Commissions:</strong> Such Software receives a referral commission from Trocador (around 1% of the swap amount) and a share of NonLogs&apos; trading and convenience fees on swaps made through our backend. Both are already reflected in the quoted rate. Our <Link href="/terms" className="text-[#fbeb0a] hover:underline">Terms</Link> describe the Trocador commission.</li>
            <li><strong className="text-white">Each provider&apos;s own policy applies</strong> to what it receives.</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">H. Nostr Identity &amp; name@smirk.cash</h3>
          <p className="text-zinc-400 mb-3">
            Smirk v0.3 gives your wallet a <strong>Nostr identity</strong> — a public key
            (&quot;npub&quot;) derived from your seed. If you choose a Smirk username and link your
            npub, our backend stores that <strong>username&nbsp;↔&nbsp;npub</strong> mapping and
            publishes it in a public <strong>NIP-05 directory</strong> at{' '}
            <code>/.well-known/nostr.json</code>, so others can verify you as{' '}
            <strong>name@smirk.cash</strong> and route messages to you.
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4">
            <li><strong className="text-white">Public by design:</strong> a username and npub are public identifiers meant to be looked up. Any name you link is publicly resolvable; a name you have not linked returns nothing (the directory does not reveal whether a name exists).</li>
            <li><strong className="text-white">Optional:</strong> you do not need a username to use the wallet — it exists only to give you a name@smirk.cash handle and let people find you.</li>
            <li><strong className="text-white">Derived, not custodial:</strong> your npub is a public key; the matching private key stays on your device with your seed.</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">I. Encrypted Messaging (Nostr Direct Messages)</h3>
          <p className="text-zinc-400 mb-3">
            Smirk v0.3 supports end-to-end <strong>encrypted direct messages</strong> over the
            Nostr protocol (NIP-17 &quot;gift-wrapping&quot;). Messages are encrypted on your device
            before they leave it. They travel through Nostr <strong>relays</strong> — public
            relays and, optionally, one operated by Such Software — which carry only ciphertext
            they cannot read.
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4">
            <li><strong className="text-white">What a relay we operate can see:</strong> the encrypted envelope, the recipient&apos;s public key (needed to deliver it), and basic metadata (timing, size). It cannot see message contents, and the gift-wrapping hides the real sender.</li>
            <li><strong className="text-white">Retention:</strong> a relay we operate stores encrypted messages briefly (currently about 30 days) so your other devices can fetch them, then deletes them.</li>
            <li><strong className="text-white">Your choice of relay:</strong> you can use other Nostr relays instead of, or in addition to, ours — messaging does not depend on us.</li>
            <li><strong className="text-white">Opt-in:</strong> messaging is a feature you choose to use.</li>
            <li><strong className="text-white">Tips to a Nostr identity:</strong> these travel as gift-wrapped messages on Nostr relays. The key that claims the tip is sealed a second time between sender and recipient, so neither a relay nor a website you have granted Nostr access can read it, and the wallet refuses to decrypt its own tip messages for websites.</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">J. IP Addresses</h3>
          <p className="text-zinc-400 mb-3">
            Like any internet server, our backend receives your device&apos;s IP address with
            each request. We store only a <strong>salted, one-way hash</strong> of it, and only
            for rate-limiting and abuse prevention (for example, throttling automated signups).
            We do not use it to track you or link it to your wallet, and self-hosting avoids
            sharing it with us at all.
          </p>
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
            <li>
              <strong className="text-white">Legal requests:</strong> We may access, preserve, or
              disclose the limited data we hold to comply with valid legal process or applicable
              law, or to report unlawful content (such as child sexual abuse material) as the law
              requires.
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
            <li><strong className="text-[#fbeb0a]">Public Addresses:</strong> Your BTC/LTC public addresses are queried against Electrum/Fulcrum servers, the same kind every non-custodial wallet uses. Nothing private.</li>
            <li><strong className="text-[#fbeb0a]">Fingerprint:</strong> A one-way SHA-256 of your seed is sent to identify your wallet — not reversible, cannot move funds.</li>
            <li><strong className="text-[#fbeb0a]">Encrypted:</strong> All tip payloads are encrypted on your device.</li>
            <li><strong className="text-[#fbeb0a]">Identity:</strong> We only store your Social ID to help people find your public key.</li>
            <li><strong className="text-[#fbeb0a]">Dapps:</strong> The <code>window.smirk</code> API is opt-in per origin, revocable per origin, and can be turned off globally in Settings.</li>
            <li><strong className="text-[#fbeb0a]">Swaps:</strong> Optional and opt-in through Trocador, THORChain (via Liquify) or NonLogs. Opening the Swap tab contacts no provider. We never operate an exchange, but we earn a commission from Trocador and NonLogs that is already in the quoted rate.</li>
            <li><strong className="text-[#fbeb0a]">Identity:</strong> An optional Smirk username + your linked Nostr key (npub) are public — they back your name@smirk.cash handle. No username, no listing.</li>
            <li><strong className="text-[#fbeb0a]">Messaging:</strong> Optional end-to-end encrypted DMs over Nostr. Relays (ours or public) carry only ciphertext they can&apos;t read; a relay we run keeps encrypted messages ~30 days.</li>
            <li><strong className="text-[#fbeb0a]">Self-hostable:</strong> The v0.3 backend is open source — run your own and none of this backend data touches us.</li>
          </ul>
        </section>

        {/* Third parties you choose to enable */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">4. Third parties you choose to enable</h2>
          <p className="text-zinc-400">
            Some features connect you to independent third parties operated by others,
            not by us: Trocador, THORChain through Liquify&apos;s gateway, NonLogs (through
            our backend), and Neroswap price lookups for swaps, the Electrum/Fulcrum servers
            noted above, the public Nostr relays that carry optional messaging, the block explorers
            opened by &quot;view on explorer&quot; links, and any site you connect to
            through the <code>window.smirk</code> interface. Where your device contacts
            these endpoints directly (everything except NonLogs), each can see your IP address alongside whatever the
            interaction entails — for a swap, the asset pair, amounts, and your
            destination and refund addresses; for an explorer, the transaction or address
            you open. Each has its own privacy policy. We neither control nor monitor
            those connections, and we are not responsible for how those parties handle
            your data.
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
            For data held by third parties you&apos;ve used through Smirk (Trocador, THORChain
            and Liquify, NonLogs, Neroswap, node operators, Electrum servers), contact those
            providers directly using the
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
