'use client';

import { useEffect, useState } from 'react';
import { OFFICIAL_RELEASES, type DesktopRelease, type DesktopPlatform } from '@/lib/desktop-releases';
import { suggestDesktopPlatform, type SuggestedPlatform } from '@/lib/desktop-platform';

const platforms: { id: DesktopPlatform; label: string; format: string }[] = [
  { id: 'macos', label: 'macOS', format: 'DMG installer' },
  { id: 'windows', label: 'Windows', format: 'x64 installer' },
  { id: 'linux', label: 'Linux', format: 'x86_64 AppImage' },
];

export default function DownloadChoices({ release }: { release: DesktopRelease | null }) {
  const [suggested, setSuggested] = useState<SuggestedPlatform>(null);
  useEffect(() => { setSuggested(suggestDesktopPlatform(navigator.platform, navigator.userAgent, navigator.maxTouchPoints)); }, []);
  return <>
    {suggested === 'mobile' && <p className="mb-6 rounded-xl border border-zinc-700 p-4 text-zinc-300">These installers are for desktop computers. Open this page on your Mac, Windows PC, or Linux computer.</p>}
    <div className="grid gap-4 md:grid-cols-3">
      {platforms.map(platform => {
        const href = release?.downloads[platform.id];
        const preferred = suggested === platform.id;
        return <section key={platform.id} className={`flex flex-col rounded-2xl border p-6 ${preferred ? 'border-[#fbeb0a] bg-zinc-900' : 'border-zinc-700 bg-zinc-950'}`}>
          <div className="mb-4 min-h-6 text-xs text-[#fbeb0a]">{preferred ? 'Suggested for your device' : ''}</div>
          <h2 className="text-2xl font-semibold">{platform.label}</h2>
          <p className="mt-2 text-sm text-zinc-400">{platform.format}</p>
          {href ? <a href={href} className="mt-6 rounded-xl bg-[#fbeb0a] px-4 py-3 text-center font-bold text-black hover:bg-[#d4c708] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Download for {platform.label}</a>
            : <><p className="mt-4 text-sm text-zinc-400">Check the official release for an available installer.</p><a href={OFFICIAL_RELEASES} className="mt-4 rounded-xl border border-zinc-600 px-4 py-3 text-center hover:border-[#fbeb0a]">View releases</a></>}
        </section>;
      })}
    </div>
    <p className="mt-6 text-xs text-zinc-500">Your device suggestion stays in this browser. You can choose any platform.</p>
  </>;
}
