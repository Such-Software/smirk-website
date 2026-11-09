import { unstable_cache } from 'next/cache';
import { fetchDesktopRelease } from './desktop-releases';

// Cache the bounded parsed result, including failures, for five minutes.
export const latestDesktopRelease = unstable_cache(
  () => fetchDesktopRelease(), ['official-smirk-desktop-release-v1'], { revalidate: 300 },
);
