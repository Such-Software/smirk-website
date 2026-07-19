'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Terms() {
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
        <h1 className="creepster-text text-3xl">Terms of Service</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl w-full bg-zinc-900/50 rounded-2xl p-8 space-y-8">
        <p className="text-zinc-400 text-sm">
          Effective July 2, 2026.
        </p>

        {/* The short version */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">The short version</h2>
          <p className="text-zinc-300 leading-relaxed">
            Smirk is non-custodial wallet software published by Such Software LLC.
            You hold your own keys; we never take custody of your coins and cannot
            recover them for you. Some features route you to independent third
            parties (like Trocador for swaps) that have their own terms, and Smirk can
            send end-to-end encrypted messages over the Nostr network. Crypto is risky
            and largely irreversible. The software is provided &quot;as is.&quot; These are
            the details.
          </p>
        </section>

        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">1. Who we are and acceptance of these Terms</h2>
          <p className="text-zinc-400 mb-4">
            These Terms of Service (&quot;Terms&quot;) are a binding agreement between you
            (&quot;you&quot;) and <strong className="text-white">Such Software LLC</strong>, a
            single-member limited liability company organized under the laws of the
            Commonwealth of Pennsylvania, United States (&quot;Such Software,&quot; &quot;we,&quot; &quot;us,&quot;
            or &quot;our&quot;). They govern your access to and use of the Smirk browser
            extension, desktop application, the source code, this website
            (smirk.cash), and any related software and services (together, the
            &quot;Software&quot;).
          </p>
          <p className="text-zinc-400">
            By downloading, installing, accessing, or using the Software, you agree
            to these Terms and to our{' '}
            <Link href="/privacy" className="text-[#fbeb0a] hover:underline">
              Privacy Policy
            </Link>
            . If you do not agree, do not use the Software.
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">2. Eligibility</h2>
          <p className="text-zinc-400">
            You may use the Software only if you are at least 18 years old (or the
            age of majority in your jurisdiction, whichever is greater) and are able
            to form a binding contract with us. By using the Software you represent
            that you meet these requirements, that you have not previously been
            suspended or removed from using the Software, and that your use complies
            with all laws that apply to you.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">3. The Software is non-custodial</h2>
          <p className="text-zinc-400 mb-4">
            Smirk is a <strong className="text-white">non-custodial</strong>{' '}
            multi-cryptocurrency wallet supporting Bitcoin (BTC), Litecoin (LTC),
            Monero (XMR), Wownero (WOW), and Grin (GRIN). Your seed phrase and
            private spend keys are generated and stored locally on your device and
            remain under your sole control. They are never transmitted to our
            servers. Cryptocurrencies exist on their respective blockchains, not
            inside the Software; any transfer of value happens on a decentralized
            network, not with us. We cannot access, freeze, or seize your funds.
          </p>
          <p className="text-zinc-400 mb-4">
            <strong className="text-white">We cannot recover your funds, seed
            phrase, keys, or password under any circumstances.</strong> If you lose
            your seed phrase, or if it is stolen or shared, your funds may be
            permanently and irretrievably lost, and we will be unable to help. You
            are solely responsible for securely backing up your seed phrase and for
            the security of your devices.
          </p>
          <div className="bg-zinc-800/50 rounded-xl p-4 text-zinc-300">
            <strong className="text-[#fbeb0a]">WARNING:</strong> IF YOU LOSE YOUR
            RECOVERY PHRASE, YOU WILL PERMANENTLY LOSE ACCESS TO YOUR FUNDS. THERE IS
            NO WAY TO RECOVER THEM.
          </div>
          <p className="text-zinc-400 mt-4">
            Such Software is not a bank, custodian, money services business, money
            transmitter, broker, dealer, exchange, or investment adviser, and it
            does not provide investment, financial, legal, accounting, or tax
            advice. The Software is a tool you operate yourself. All cryptocurrency
            transactions are processed by their respective decentralized networks; we
            do not control those networks and cannot guarantee transaction speed,
            confirmation, or reversal. Once a transaction is broadcast, it cannot be
            cancelled or modified.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">4. Your responsibilities</h2>
          <ul className="space-y-3 text-zinc-400">
            <li>
              <strong className="text-white">Keys and backups.</strong> Record your
              seed phrase and keep it private and secure. Never share your seed
              phrase or private keys with anyone, including us — we will never ask
              for them.
            </li>
            <li>
              <strong className="text-white">Accuracy.</strong> Blockchain
              transactions are generally irreversible. You are responsible for
              verifying recipient addresses, networks, and amounts before you send.
              Funds sent to the wrong address or network cannot be recovered.
            </li>
            <li>
              <strong className="text-white">Security.</strong> Maintain the security
              of your wallet password and devices, and promptly notify us if you
              discover or suspect a security issue affecting the Software.
            </li>
            <li>
              <strong className="text-white">Compliance and taxes.</strong> You are
              responsible for complying with the laws that apply to you and for
              determining, reporting, and paying any taxes that arise from your
              activity. Such Software is not responsible for determining, collecting,
              reporting, or remitting any taxes arising from your use of the Software.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">5. Restricted persons and locations (sanctions)</h2>
          <p className="text-zinc-400">
            You represent and warrant that you are not, and are not acting on behalf
            of, a person who is: (a) located in, ordinarily resident in, or organized
            under the laws of any jurisdiction subject to comprehensive United States
            sanctions (currently including Cuba, Iran, North Korea, Syria, and the
            Crimea, Donetsk, and Luhansk regions of Ukraine); or (b) listed on any
            sanctions or restricted-party list maintained by the U.S. government
            (including the U.S. Treasury Department&apos;s Office of Foreign Assets
            Control (OFAC) Specially Designated Nationals and Blocked Persons List and
            the U.S. Commerce Department&apos;s Entity List), the United Nations, the
            European Union or its member states, or the United Kingdom. You agree not
            to use the Software if applicable law prohibits you from doing so.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">6. Acceptable use</h2>
          <p className="text-zinc-300 mb-4">You agree not to use the Software:</p>
          <ul className="space-y-2 text-zinc-400 ml-4 list-disc list-inside">
            <li>for money laundering, terrorist financing, fraud, or any other
              illegal activity, or to evade sanctions;</li>
            <li>on behalf of any person barred under Section 5;</li>
            <li>to interfere with, disrupt, overburden, attack, or circumvent the
              security of the Software or any network it connects to;</li>
            <li>to access the Software by automated means (bots, scrapers) without
              our permission, or to introduce viruses, malware, or other harmful
              code;</li>
            <li>to infringe others&apos; rights, impersonate others, provide false
              information, or harass, abuse, or harm others;</li>
            <li>to create, store, send, request, or distribute content that is unlawful —
              including child sexual abuse material (CSAM) or any content that sexually
              exploits or endangers a minor, and content that infringes intellectual property.</li>
          </ul>
          <p className="text-zinc-400 mt-4">
            We may suspend, restrict, or terminate your access to the Software (or to
            particular features) if we reasonably believe you have violated these
            Terms or applicable law. Because the Software is non-custodial, ending
            your license does not affect your ability to access your funds with your
            seed phrase in other compatible wallet software.
          </p>
          <p className="text-zinc-400 mt-4">
            <strong className="text-white">Usernames and identity.</strong> A Smirk username
            (which backs your name@smirk.cash handle) is assigned on a first-come basis and
            gives you no ownership of the name. You may not choose a username that impersonates
            another person or project or that infringes a trademark, and we may refuse, reclaim,
            or reassign usernames — including reserved names — to prevent impersonation or abuse.
            Your Nostr keys are derived from your seed and remain yours regardless.
          </p>
          <p className="text-zinc-400 mt-4">
            <strong className="text-white">Reporting unlawful content.</strong> We report child
            sexual abuse material to the National Center for Missing &amp; Exploited Children
            (NCMEC) and cooperate with law enforcement and valid legal process as required by
            law. To report unlawful content or abuse, or to send a copyright or other legal
            notice, contact{' '}
            <a href="mailto:legal@such.software" className="text-[#fbeb0a] hover:underline">
              legal@such.software
            </a>
            .
          </p>
          <p className="text-zinc-400 mt-4">
            <strong className="text-white">Copyright (DMCA).</strong> Such Software LLC complies
            with the Digital Millennium Copyright Act. If you believe content made available
            through a service we operate infringes your copyright, send a notice containing the
            elements required by 17 U.S.C. §&nbsp;512(c)(3) to our registered Designated Agent:
          </p>
          <p className="text-zinc-400 mt-2 ml-4">
            Such Software LLC — DMCA Designated Agent<br />
            [mailing address, as registered with the U.S. Copyright Office]<br />
            <a href="mailto:legal@such.software" className="text-[#fbeb0a] hover:underline">
              legal@such.software
            </a>
          </p>
          <p className="text-zinc-400 mt-2">
            We remove or disable access to material in response to valid notices and, in
            appropriate circumstances, terminate repeat infringers. If you believe your content
            was removed in error, you may submit a counter-notification under §&nbsp;512(g) to the
            same contact.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">7. Third-party services</h2>
          <p className="text-zinc-400 mb-4">
            The Software lets you connect to independent third parties. Those services
            are operated by others, not by us. When you use one, you may be subject to
            and required to accept that provider&apos;s own terms and privacy policy, and
            you may be entering into a separate contract directly with that provider.
            We are not a party to those transactions, do not control those providers,
            and are not responsible for their acts, omissions, pricing, availability,
            verification decisions, or performance. See our{' '}
            <Link href="/privacy" className="text-[#fbeb0a] hover:underline">
              Privacy Policy
            </Link>{' '}
            for what data flows where.
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">7.1 Swaps (Trocador)</h3>
          <p className="text-zinc-400 mb-4">
            In-wallet swaps between coins are executed by{' '}
            <strong className="text-white">Trocador</strong>, a third-party
            non-custodial exchange aggregator, and the underlying exchange providers
            it routes to — not by Such Software. When you start a swap, order details
            (input and output coin, amount, and your receiving and refund addresses)
            are sent to Trocador&apos;s API. Such Software does not exchange your assets,
            does not take custody of funds during a swap, and is not the counterparty
            to your trade. Your use of Trocador is governed by Trocador&apos;s terms and{' '}
            <a
              href="https://trocador.app/en/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#fbeb0a] hover:underline"
            >
              privacy policy
            </a>
            .
          </p>
          <p className="text-zinc-400">
            <strong className="text-white">Swap fee.</strong> Such Software receives a
            referral commission (currently around 1% of the swap amount) from Trocador
            for swaps initiated in the Software. This commission is already reflected
            in the exchange rate shown to you before you confirm a swap; there is no
            separate charge. Because the fee is a referral commission paid by Trocador
            and we are never in custody of or in the settlement path for the swapped
            funds, we act as a referrer, not as a money transmitter or exchanger.
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">7.2 Additional providers</h3>
          <p className="text-zinc-400">
            We may add other independent swap, exchange, or fiat on-ramp/off-ramp providers
            (and, in the future, peer-to-peer swap functionality) within the Software. Each such
            provider is operated by others, not by us, and your use of it is governed by that
            provider&apos;s own terms and privacy policy. Some providers — particularly fiat
            on-ramps — may require identity verification (KYC) and may decline service under
            their own policies and applicable law; any such verification is between you and that
            provider, and Such Software does not perform it or receive that verification data. We
            are not the counterparty to, and take no custody in, those transactions.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">8. Connecting to sites (window.smirk)</h2>
          <p className="text-zinc-400">
            The Software exposes a <code>window.smirk</code> interface so that web
            pages — such as smirk.cash, claim pages, and merchant sites — can request
            a connection to your wallet or ask you to approve a signature. Connections
            are per-origin and require an explicit approval prompt the first time a
            site asks; you can revoke any origin, or disable the interface entirely,
            from Settings. Third-party sites are operated by others, are not part of
            the Software, and are not endorsed by us. You interact with them at your
            own risk and are responsible for what you connect to and what you approve.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">9. Nodes, servers, and other endpoints</h2>
          <p className="text-zinc-400">
            To read balances and broadcast transactions, the Software connects to
            blockchain nodes, indexers, and — for Monero and Wownero — a light-wallet
            server operated by Such Software. You may use the default endpoints
            shipped with the Software or, where supported, configure your own. Node
            and endpoint operators see the information your interaction with them
            entails. Network (miner/validator) fees are charged by the relevant
            blockchain, not by us, and are displayed before you confirm a transaction.
            Fees, spreads, and limits for third-party services (such as Trocador) are
            set by those providers. What data goes where is described in our{' '}
            <Link href="/privacy" className="text-[#fbeb0a] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">9.1 Messaging and the Nostr relay</h3>
          <p className="text-zinc-400 mb-4">
            Smirk supports optional end-to-end encrypted direct messages over the Nostr protocol.
            Messages are encrypted on your device; relays carry only ciphertext. Such Software may
            operate a Nostr relay that the Software can use, alongside independent public relays. A
            relay we operate transmits and briefly stores encrypted messages so your devices can
            retrieve them; we do not read, and cannot read, their contents.
          </p>
          <p className="text-zinc-400">
            Because a relay is a shared service, we may <strong className="text-white">rate-limit,
            refuse, or remove</strong> events and restrict who may publish, to protect the service
            and other users from spam, abuse, or unlawful use, and to comply with the law. We do
            not guarantee message delivery, ordering, or retention, and we are not the author of,
            and are not responsible for, messages that users send. You are solely responsible for
            the messages you send, and you must not use messaging for unlawful, abusive, or
            infringing content or for spam. Because gift-wrapped messages are encrypted end to
            end, we cannot read or proactively screen their contents; we act on reports and valid
            legal process, and report unlawful material as described in Section 6. You may use
            other Nostr relays instead of ours.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">10. Assumption of risk</h2>
          <p className="text-zinc-300 mb-4">
            You understand and accept the risks of cryptocurrencies and blockchain
            technology, including:
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4 list-disc list-inside">
            <li>extreme price volatility and potential loss of value;</li>
            <li>the irreversibility of on-chain transactions and losses from sending
              to a wrong address or network;</li>
            <li>bugs or vulnerabilities in protocols, smart contracts, or
              cryptographic libraries; forks and network changes;</li>
            <li>regulatory changes that may affect cryptocurrency use;</li>
            <li>hardware, software, Internet-connection, or third-party service
              failures, and phishing or malware attacks.</li>
          </ul>
          <p className="text-zinc-400 mt-4">
            You agree that Such Software is not responsible for losses arising from
            these risks, including losses from forgotten recovery phrases, incorrect
            addresses, endpoint or server failures, phishing, or unauthorized
            third-party activity.
          </p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">11. Intellectual property and open source</h2>
          <p className="text-zinc-400">
            Smirk&apos;s own application code is open source, licensed under the MIT
            License (Copyright 2026 Such Software LLC). The Software also incorporates
            third-party open-source components under their own licenses, including the
            Monero and Wownero wallet cores and the Grin/Mimblewimble libraries. The
            applicable license texts are available in the Software&apos;s source
            repository. To the extent any names, branding, or logos — including
            &quot;Smirk&quot; and &quot;Such Software LLC&quot; — are not covered by those open-source
            licenses, they remain the exclusive property of Such Software LLC, and
            nothing here grants you a license to use them.
          </p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">12. Discontinuance of Services</h2>
          <p className="text-zinc-400">
            We may, in our sole discretion and without liability to you, modify or
            discontinue any portion of the Software at any time. You are solely
            responsible for maintaining a backup of your recovery phrase outside of
            the Software. If you have your recovery phrase, you can always access your
            funds using any compatible wallet software, even if Smirk discontinues its
            Services.
          </p>
        </section>

        {/* Section 13 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">13. Disclaimer of warranties</h2>
          <p className="text-zinc-400 uppercase text-sm leading-relaxed">
            THE SOFTWARE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE,&quot; WITH ALL FAULTS AND
            WITHOUT WARRANTY OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, SUCH
            SOFTWARE DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING THE
            IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
            TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SOFTWARE WILL BE
            UNINTERRUPTED, TIMELY, SECURE, ERROR-FREE, OR THAT ANY DATA (INCLUDING
            RATES OR BALANCES) IS ACCURATE.
          </p>
        </section>

        {/* Section 14 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">14. Limitation of liability</h2>
          <p className="text-zinc-400 uppercase text-sm leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SUCH SOFTWARE AND ITS MEMBERS,
            MANAGERS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT,
            INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY
            LOSS OF PROFITS, REVENUE, DATA, OR CRYPTOCURRENCY, ARISING FROM OR RELATED
            TO YOUR USE OF (OR INABILITY TO USE) THE SOFTWARE, EVEN IF ADVISED OF THE
            POSSIBILITY.
          </p>
          <p className="text-zinc-400 uppercase text-sm leading-relaxed mt-4">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, OUR TOTAL AGGREGATE LIABILITY FOR
            ALL CLAIMS RELATING TO THE SOFTWARE WILL NOT EXCEED ONE HUNDRED U.S.
            DOLLARS (US$100).
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed mt-4">
            Some jurisdictions do not allow certain exclusions or limitations, so some
            of the above may not apply to you; in that case our liability is limited to
            the greatest extent permitted by law.
          </p>
        </section>

        {/* Section 15 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">15. Indemnification</h2>
          <p className="text-zinc-400">
            You agree to indemnify and hold harmless Such Software and its members,
            managers, employees, and agents from any claims, losses, liabilities, and
            expenses (including reasonable legal fees) arising from your use of the
            Software, your violation of these Terms or applicable law (including
            sanctions, AML, or tax obligations), or your infringement of any third
            party&apos;s rights.
          </p>
        </section>

        {/* Section 16 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">16. Apple App Store and Google Play</h2>
          <p className="text-zinc-400">
            If you obtained the Software from the Apple App Store, the following
            additional terms apply. These Terms are between you and Such Software only,
            not with Apple, and Apple is not responsible for the Software or its
            content. Apple has no obligation to provide maintenance or support for the
            Software. In the event of any failure of the Software to conform to any
            applicable warranty, you may notify Apple, and Apple will refund the
            purchase price (if any); to the maximum extent permitted by law, Apple has
            no other warranty obligation with respect to the Software. Such Software,
            not Apple, is responsible for addressing any claims relating to the
            Software, including product-liability, legal-compliance, and
            intellectual-property claims. You represent that you are not located in a
            country subject to a U.S. Government embargo or designated as a
            &quot;terrorist supporting&quot; country and that you are not on any U.S. Government
            list of prohibited or restricted parties. Apple and its subsidiaries are
            third-party beneficiaries of these Terms and may enforce them against you.
            If you obtained the Software from Google Play, your use is also subject to
            the Google Play Terms of Service.
          </p>
        </section>

        {/* Section 17 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">17. Governing law and disputes</h2>
          <p className="text-zinc-400 mb-4">
            These Terms are governed by the laws of the Commonwealth of Pennsylvania,
            without regard to its conflict-of-laws rules.
          </p>
          <p className="text-zinc-400 mb-4">
            <strong className="text-white">Courts.</strong> Except as provided below,
            any dispute arising out of or relating to these Terms or the Software will
            be brought exclusively in the state or federal courts located in or serving
            Chester County, Pennsylvania, and you consent to the personal jurisdiction
            and venue of those courts. Either party may bring an individual claim in
            small-claims court, and either party may seek injunctive or equitable
            relief in any court of competent jurisdiction to protect its intellectual
            property or security.
          </p>
          <p className="text-zinc-400 mb-4">
            <strong className="text-white">Jury-trial and class-action waiver.</strong>{' '}
            To the maximum extent permitted by law, you and Such Software each waive any
            right to a jury trial and agree that disputes will be brought only on an
            individual basis, and not as a plaintiff or class member in any class,
            collective, or representative proceeding.
          </p>
          <p className="text-zinc-400 mb-4">
            <strong className="text-white">Optional arbitration.</strong> At our
            option, we may elect to resolve a given dispute through final and binding
            individual arbitration administered by the American Arbitration Association
            under its rules, applying Pennsylvania law. This does not change the
            individual-basis and jury/class-waiver terms above.
          </p>
          <p className="text-zinc-400 mb-4">
            <strong className="text-white">30-day opt-out.</strong> You may opt out of
            the class-action waiver and the optional-arbitration provision by emailing{' '}
            <a href="mailto:support@such.software" className="text-[#fbeb0a] hover:underline">
              support@such.software
            </a>{' '}
            with the subject line &quot;Legal Opt-Out&quot; within 30 days of first accepting
            these Terms. Opting out will not affect any other part of these Terms.
          </p>
          <p className="text-zinc-400 mb-4">
            <strong className="text-white">Time limit.</strong> Any claim relating to
            the Software must be brought within one (1) year after it arises, or it is
            permanently barred, except where a longer period is required by law.
          </p>
          <p className="text-zinc-400">
            Nothing in these Terms limits any mandatory consumer-protection rights you
            have under the law of your country of residence that cannot be waived by
            agreement.
          </p>
        </section>

        {/* Section 18 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">18. Changes to these Terms</h2>
          <p className="text-zinc-400">
            We may update these Terms from time to time. When we do, we will revise the
            effective date above and post the updated Terms here; material changes may
            also be noted in the app&apos;s release notes or via{' '}
            <a
              href="https://x.com/such_software"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#fbeb0a] hover:underline"
            >
              @such_software
            </a>
            . Your continued use of the Software after an update means you accept the
            revised Terms.
          </p>
        </section>

        {/* Section 19 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">19. General</h2>
          <p className="text-zinc-400">
            If any provision of these Terms is held unenforceable, the rest remain in
            effect and the unenforceable provision will be limited or removed to the
            minimum extent necessary. These Terms (with the Privacy Policy) are the
            entire agreement between you and Such Software regarding the Software and
            supersede any prior agreements. You may not assign these Terms without our
            consent; we may assign them to an affiliate or successor. Our failure to
            enforce a provision is not a waiver. We are not liable for delays or
            failures caused by events beyond our reasonable control. We may provide
            notices to you through the Software or this website.
          </p>
        </section>

        {/* Quick Summary */}
        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Quick Summary</h2>
          <ul className="space-y-2 text-zinc-400">
            <li><strong className="text-[#fbeb0a]">Non-Custodial:</strong> You control your keys. We cannot access or recover your funds.</li>
            <li><strong className="text-[#fbeb0a]">Your Responsibility:</strong> Back up your recovery phrase. Losing it means losing your funds forever.</li>
            <li><strong className="text-[#fbeb0a]">Swaps:</strong> Executed by Trocador, not us. We earn a ~1% referral commission that&apos;s already baked into the quoted rate.</li>
            <li><strong className="text-[#fbeb0a]">Messaging:</strong> Optional encrypted DMs over Nostr. Relays carry only ciphertext; we may rate-limit or refuse abuse, and aren&apos;t responsible for what users send.</li>
            <li><strong className="text-[#fbeb0a]">Irreversible:</strong> Cryptocurrency transactions cannot be cancelled or reversed.</li>
            <li><strong className="text-[#fbeb0a]">No Guarantees:</strong> We provide the service as-is. Use at your own risk.</li>
            <li><strong className="text-[#fbeb0a]">Be Legal:</strong> Don&apos;t use Smirk for illegal activities.</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-zinc-800/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#fbeb0a] mb-4">Questions?</h2>
          <p className="text-zinc-300">
            Questions about these Terms:{' '}
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
            &larr; Back to Smirk
          </Link>
        </div>
      </div>
    </div>
  );
}
