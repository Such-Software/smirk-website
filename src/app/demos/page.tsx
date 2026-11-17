import Link from 'next/link';
import { SWAP_DEMOS } from '@/lib/swap-demos';
export const metadata = { title: 'Swap demos', description: 'Interactive explanations of BasicSwap-compatible and EigenSwap protocols. Simulations only, with no wallet connection or real funds.' };
export default function Demos() {
 return <div className="demo-page"><p className="text-sm text-[#fbeb0a]">Learn by stepping through</p><h1 className="mt-4 text-3xl font-bold sm:text-4xl">Swap demos</h1>
  <p className="mt-5 max-w-2xl leading-relaxed text-zinc-400">See how two peers exchange assets, and what recovery means when a swap stops. These interactive simulations never connect to a wallet or move funds.</p>
  <div className="mt-10 grid gap-5 md:grid-cols-2">{SWAP_DEMOS.map(demo => <Link key={demo.slug} href={`/demos/${demo.slug}`} className="rounded-xl border border-zinc-800 p-6 transition-colors hover:border-[#fbeb0a]">
   <p className="text-xs text-[#fbeb0a]">{demo.badge}</p><h2 className="mt-4 text-xl font-semibold">{demo.title}</h2><p className="mt-3 text-sm leading-relaxed text-zinc-400">{demo.intro}</p><p className="mt-6 text-sm">Explore the walkthrough →</p>
  </Link>)}</div><p className="mt-8 text-xs text-zinc-400">Educational previews, not a live swap interface or an announcement of a new wallet release.</p>
 </div>;
}
