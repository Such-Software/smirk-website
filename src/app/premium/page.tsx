import Link from 'next/link';
export const metadata = { title: 'Premium relay posting' };
export default function Premium() {
 return <div className="demo-page max-w-2xl"><p className="text-sm text-[#fbeb0a]">For the Smirk feed</p><h1 className="mt-4 text-3xl font-bold">Premium relay posting</h1>
  <p className="mt-6 leading-relaxed text-zinc-300">Open Smirk and visit Feed to see current plans and pay. Your selected backend shows the available plans and creates an invoice for your account.</p>
  <p className="mt-5 leading-relaxed text-zinc-400">Follow the payment options shown with your invoice. Posting access activates after the backend verifies settlement; creating an invoice alone does not activate it.</p>
  <p className="mt-5 text-sm leading-relaxed text-zinc-400">Smirk relay premium and forum premium are separate. This page does not create an invoice or take a payment.</p>
  <Link href="/downloads" className="mt-8 inline-block rounded-lg border border-zinc-700 px-5 py-3 text-sm hover:border-[#fbeb0a]">Get Smirk Wallet →</Link>
 </div>;
}
