import Link from 'next/link';
import SwapWalkthrough from '@/components/SwapWalkthrough';
import { SWAP_DEMOS } from '@/lib/swap-demos';
export const metadata = { title: "EigenSwap" };
export default function Demo() {
 const demo = SWAP_DEMOS.find(value => value.slug === "eigenswap")!;
 return <div className="demo-page"><Link href="/demos" className="text-sm text-zinc-400 hover:text-[#fbeb0a]">← All demos</Link>
  <p className="mt-8 text-xs text-[#fbeb0a]">{demo.badge} · Interactive simulation</p><h1 className="mt-4 text-3xl font-bold sm:text-4xl">{demo.title}</h1>
  <p className="mt-5 leading-relaxed text-zinc-300">{demo.intro}</p><p className="mt-4 border-l-2 border-zinc-700 pl-4 text-xs leading-relaxed text-zinc-400">{demo.support} No wallet connection or real funds.</p><SwapWalkthrough demo={demo} />
 </div>;
}
