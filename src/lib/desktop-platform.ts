export type SuggestedPlatform = 'macos' | 'windows' | 'linux' | 'mobile' | null;

/** A local display hint only; it never changes the available downloads. */
export function suggestDesktopPlatform(platform: string, userAgent: string, touchPoints = 0): SuggestedPlatform {
  if (/Android|iPhone|iPad|iPod/i.test(userAgent) || /Mac/i.test(platform) && touchPoints > 1) return 'mobile';
  if (/Win/i.test(platform)) return 'windows';
  if (/Mac/i.test(platform)) return 'macos';
  if (/Linux/i.test(platform)) return 'linux';
  return null;
}
