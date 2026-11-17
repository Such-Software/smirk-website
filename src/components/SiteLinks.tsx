import Link from 'next/link';
export default function SiteLinks({ label }: { label: string }) {
 return <nav aria-label={label} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm">
  <Link href="/downloads" className="hover:text-[#fbeb0a]">Downloads</Link>
  <Link href="/demos" className="hover:text-[#fbeb0a]">Demos</Link>
  <a href="https://forum.such.software/category/13/smirk-wallet" className="hover:text-[#fbeb0a]">Forum</a>
  <Link href="/premium" className="hover:text-[#fbeb0a]">Premium</Link>
 </nav>;
}
