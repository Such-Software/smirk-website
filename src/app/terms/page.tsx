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
          Last Updated: January 31, 2026
        </p>

        <p className="text-zinc-300 text-lg leading-relaxed">
          BY ACCESSING OR USING SMIRK WALLET, YOU AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
          IF YOU DO NOT AGREE, DO NOT USE OUR SERVICES.
        </p>

        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">1. Eligibility</h2>
          <p className="text-zinc-300 mb-4">
            You represent and warrant that you:
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4 list-disc list-inside">
            <li>Are of legal age to form a binding contract in your jurisdiction</li>
            <li>Have not previously been suspended or removed from using our Services</li>
            <li>Have full power and authority to enter into this agreement</li>
            <li>Will not use these services in violation of any applicable laws</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">2. Account &amp; Wallet Security</h2>
          <p className="text-zinc-300 mb-4">
            When you create a Smirk wallet, you agree to:
          </p>
          <ul className="space-y-3 text-zinc-400">
            <li>
              <strong className="text-white">Secure Your Recovery Phrase:</strong> You are solely
              responsible for backing up and protecting your 24-word recovery phrase (mnemonic).
              This phrase is the only way to recover your wallet.
            </li>
            <li>
              <strong className="text-white">Password Protection:</strong> Maintain the security
              of your wallet password and restrict access to your devices.
            </li>
            <li>
              <strong className="text-white">Promptly Report Issues:</strong> Notify us if you
              discover or suspect any security breaches related to your account.
            </li>
            <li>
              <strong className="text-white">Accept Responsibility:</strong> Take responsibility
              for all activities that occur under your wallet, including any authorized or
              unauthorized access.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">3. Description of Services</h2>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">3.1 Non-Custodial Wallet</h3>
          <p className="text-zinc-400 mb-4">
            Smirk is a <strong className="text-white">non-custodial</strong> multi-cryptocurrency
            wallet supporting Bitcoin (BTC), Litecoin (LTC), Monero (XMR), Wownero (WOW), and
            Grin (GRIN). Your private spend keys are generated and stored locally on your device.
            They are never transmitted to our servers. We cannot access, freeze, or seize your funds.
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">3.2 Social Tipping</h3>
          <p className="text-zinc-400 mb-4">
            Smirk enables you to send cryptocurrency tips to users on social platforms (Telegram,
            Discord, etc.) and via public tip links. Tips are encrypted and can only be claimed
            by the intended recipient (or anyone with the link for public tips).
          </p>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">3.3 No Recovery Phrase Retrieval</h3>
          <p className="text-zinc-400 mb-4">
            Our Services do not store your recovery phrase or unencrypted private keys. Therefore,
            we cannot assist you with recovery phrase retrieval.
          </p>
          <div className="bg-zinc-800/50 rounded-xl p-4 text-zinc-300">
            <strong className="text-[#fbeb0a]">WARNING:</strong> IF YOU LOSE YOUR RECOVERY PHRASE,
            YOU WILL PERMANENTLY LOSE ACCESS TO YOUR FUNDS. THERE IS NO WAY TO RECOVER THEM.
          </div>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">3.4 Transaction Processing</h3>
          <p className="text-zinc-400 mb-4">
            All cryptocurrency transactions are processed by their respective decentralized
            networks (Bitcoin, Litecoin, Monero, Wownero, Grin). We do not control these networks
            and cannot guarantee transaction speed, confirmation, or reversal. Once a transaction
            is broadcast, it cannot be cancelled or modified.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">4. Fees</h2>
          <ul className="space-y-3 text-zinc-400">
            <li>
              <strong className="text-white">Service Fees:</strong> Access to Smirk wallet is
              currently free. We may introduce fees for certain services in the future.
            </li>
            <li>
              <strong className="text-white">Network Fees:</strong> All cryptocurrency transactions
              require network fees (miner fees) paid to the respective blockchain network. These
              fees are not collected by Smirk and are displayed before you confirm any transaction.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">5. Acceptable Use</h2>
          <p className="text-zinc-300 mb-4">You agree that you will NOT:</p>
          <ul className="space-y-2 text-zinc-400 ml-4 list-disc list-inside">
            <li>Use our Services to engage in illegal activities including fraud, money laundering,
              or terrorist financing</li>
            <li>Attempt to interfere with, disrupt, or overburden our Services</li>
            <li>Use automated means (bots, scrapers) to access our Services without permission</li>
            <li>Attempt to circumvent any security measures or access controls</li>
            <li>Introduce viruses, malware, or other harmful code</li>
            <li>Impersonate others or provide false information</li>
            <li>Use our Services to harass, abuse, or harm others</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">6. Taxes</h2>
          <p className="text-zinc-400">
            It is your sole responsibility to determine what taxes apply to your cryptocurrency
            transactions and to report and remit the correct tax to the appropriate tax authority.
            Smirk is not responsible for determining, collecting, reporting, or remitting any
            taxes arising from your use of our Services.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">7. Assumption of Risk</h2>
          <p className="text-zinc-300 mb-4">
            You acknowledge and agree that there are risks associated with using cryptocurrency
            and Internet-based services, including but not limited to:
          </p>
          <ul className="space-y-2 text-zinc-400 ml-4 list-disc list-inside">
            <li>Price volatility and potential loss of value</li>
            <li>Risk of hardware, software, and Internet connection failures</li>
            <li>Risk of malicious software or phishing attacks</li>
            <li>Risk of unauthorized access to your devices or accounts</li>
            <li>Irreversibility of cryptocurrency transactions</li>
            <li>Regulatory changes that may affect cryptocurrency use</li>
          </ul>
          <p className="text-zinc-400 mt-4">
            Smirk is not responsible for any losses arising from forgotten recovery phrases,
            incorrect addresses, server failures, phishing attacks, or any other unauthorized
            third-party activities.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">8. Discontinuance of Services</h2>
          <p className="text-zinc-400">
            We may, in our sole discretion and without liability to you, modify or discontinue
            any portion of our Services at any time. You are solely responsible for maintaining
            a backup of your recovery phrase outside of the Services. If you have your recovery
            phrase, you can always access your funds using any compatible wallet software, even
            if Smirk discontinues its Services.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">9. Disclaimer of Warranties</h2>
          <p className="text-zinc-400 uppercase text-sm leading-relaxed">
            OUR SERVICES ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS.
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED,
            INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT. WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED,
            ERROR-FREE, OR SECURE.
          </p>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">10. Limitation of Liability</h2>
          <p className="text-zinc-400 uppercase text-sm leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SMIRK AND ITS DIRECTORS, EMPLOYEES, AND
            AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
            OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR FUNDS,
            ARISING FROM YOUR USE OF OR INABILITY TO USE OUR SERVICES.
          </p>
          <p className="text-zinc-400 uppercase text-sm leading-relaxed mt-4">
            IN NO EVENT SHALL OUR AGGREGATE LIABILITY EXCEED ONE HUNDRED DOLLARS ($100 USD).
          </p>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">11. Indemnification</h2>
          <p className="text-zinc-400">
            You agree to defend, indemnify, and hold harmless Smirk and its officers, directors,
            employees, and agents from any claims, damages, losses, or expenses arising from:
            (a) your use of our Services; (b) your violation of these Terms; (c) your violation
            of any rights of any third party; or (d) any content you submit through our Services.
          </p>
        </section>

        {/* Section 12 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">12. Privacy</h2>
          <p className="text-zinc-400">
            Please refer to our{' '}
            <Link href="/privacy" className="text-[#fbeb0a] hover:underline">
              Privacy Policy
            </Link>
            {' '}for information about how we collect, use, and protect your information.
          </p>
        </section>

        {/* Section 13 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">13. Modifications to Terms</h2>
          <p className="text-zinc-400">
            We reserve the right to modify these Terms at any time. We will provide notice of
            material changes by updating the &quot;Last Updated&quot; date at the top of these Terms.
            Your continued use of our Services after any changes constitutes your acceptance of
            the new Terms.
          </p>
        </section>

        {/* Section 14 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">14. Governing Law</h2>
          <p className="text-zinc-400">
            These Terms shall be governed by and construed in accordance with the laws of the
            jurisdiction where Smirk operates, without regard to conflict of law principles.
          </p>
        </section>

        {/* Section 15 */}
        <section>
          <h2 className="text-xl font-bold text-[#fbeb0a] mb-4">15. Severability</h2>
          <p className="text-zinc-400">
            If any provision of these Terms is found to be invalid or unenforceable, the remaining
            provisions shall remain in full force and effect.
          </p>
        </section>

        {/* Quick Summary */}
        <section className="border border-zinc-700 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Quick Summary</h2>
          <ul className="space-y-2 text-zinc-400">
            <li><strong className="text-[#fbeb0a]">Non-Custodial:</strong> You control your keys. We cannot access or recover your funds.</li>
            <li><strong className="text-[#fbeb0a]">Your Responsibility:</strong> Back up your recovery phrase. Losing it means losing your funds forever.</li>
            <li><strong className="text-[#fbeb0a]">Irreversible:</strong> Cryptocurrency transactions cannot be cancelled or reversed.</li>
            <li><strong className="text-[#fbeb0a]">No Guarantees:</strong> We provide the service as-is. Use at your own risk.</li>
            <li><strong className="text-[#fbeb0a]">Be Legal:</strong> Don&apos;t use Smirk for illegal activities.</li>
          </ul>
        </section>

        {/* Contact */}
        <section className="bg-zinc-800/50 rounded-xl p-6">
          <h2 className="text-lg font-bold text-[#fbeb0a] mb-4">Questions?</h2>
          <p className="text-zinc-300">
            If you have questions about these Terms of Service, please contact us through our
            official channels or at the support email provided in the extension.
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
