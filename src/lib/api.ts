// API client for Smirk backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface ChallengeResponse {
  challenge: string;
  challenge_id: string;
  expires_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    telegram_id: number | null;
    telegram_username: string | null;
  };
}

export interface MeResponse {
  id: string;
  username: string | null;
  telegram_id: number | null;
  telegram_username: string | null;
}

export async function getChallenge(origin: string): Promise<ChallengeResponse> {
  const res = await fetch(`${API_URL}/api/v1/auth/website/challenge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.message || 'Failed to get challenge');
  }

  return res.json();
}

export async function verifySignature(
  challengeId: string,
  signature: { asset: string; signature: string; public_key: string }
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/v1/auth/website/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      challenge_id: challengeId,
      signature,
    }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || data.message || 'Failed to verify signature');
  }

  return res.json();
}

export async function getMe(token: string): Promise<MeResponse> {
  const res = await fetch(`${API_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to get user info');
  }

  return res.json();
}

// =============================================================================
// Social Account Linking
// =============================================================================

export interface RegisterSocialResponse {
  verification_code: string;
  expires_at: string;
  bot_link: string;
  instructions: string;
}

export interface LinkedSocial {
  platform: string;
  username: string | null;
  display_name: string | null;
  platform_user_id: string | null;
  verified: boolean;
  verified_at: string | null;
  pending_verification: boolean;
}

export interface InitiateLinkResponse {
  deep_link: string;
  code: string;
  expires_at: string;
}

export interface LinkedSocialsResponse {
  socials: LinkedSocial[];
}

export async function registerSocial(
  token: string,
  platform: string,
  username: string
): Promise<RegisterSocialResponse> {
  const res = await fetch(`${API_URL}/api/v1/socials/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ platform, username }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to start verification');
  }

  return res.json();
}

/**
 * Initiate social link via deep link flow.
 *
 * Returns a deep link that opens the bot. User clicks the link,
 * bot extracts their info automatically, no manual username entry.
 */
export async function initiateLink(
  token: string,
  platform: string
): Promise<InitiateLinkResponse> {
  const res = await fetch(`${API_URL}/api/v1/socials/initiate-link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ platform }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to initiate link');
  }

  return res.json();
}

export async function getLinkedSocials(token: string): Promise<LinkedSocialsResponse> {
  const res = await fetch(`${API_URL}/api/v1/socials/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to get linked accounts');
  }

  return res.json();
}

export async function unlinkSocial(token: string, platform: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/socials/${platform}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to unlink account');
  }
}

// =============================================================================
// Public Tips
// =============================================================================

export interface PublicTipInfo {
  id: string;
  asset: string;
  amount: number;
  status: string;
  created_at: string;
  is_public: boolean;
  funding_confirmations: number;
  confirmations_required: number;
}

export async function getPublicTipInfo(tipId: string): Promise<PublicTipInfo> {
  const res = await fetch(`${API_URL}/api/v1/tips/social/${tipId}/public`);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Tip not found or not available');
    }
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to get tip info');
  }

  return res.json();
}

// =============================================================================
// User Tips
// =============================================================================

export interface SentTip {
  id: string;
  recipient_platform: string | null;
  recipient_username: string | null;
  asset: string;
  amount: number;
  is_public: boolean;
  status: string;
  created_at: string;
  claimed_at: string | null;
  clawed_back_at: string | null;
  /** Current number of confirmations for funding tx */
  funding_confirmations: number;
  /** Required confirmations before tip is claimable (XMR/GRIN=10, WOW=4, BTC/LTC=0) */
  confirmations_required: number;
  /** Whether the tip has enough confirmations to be claimed */
  is_claimable: boolean;
}

export interface ClaimableTip {
  id: string;
  asset: string;
  amount: number;
  from_platform: string | null;
  created_at: string;
}

export interface ReceivedTip {
  id: string;
  sender_user_id: string;
  recipient_platform: string | null;
  recipient_username: string | null;
  asset: string;
  amount: number;
  is_public: boolean;
  status: string;
  created_at: string;
  claimed_at: string | null;
  clawed_back_at: string | null;
  /** Current number of confirmations for funding tx */
  funding_confirmations: number;
  /** Required confirmations before tip is claimable (XMR/GRIN=10, WOW=4, BTC/LTC=0) */
  confirmations_required: number;
  /** Whether the tip has enough confirmations to be claimed */
  is_claimable: boolean;
}

export async function getSentTips(token: string): Promise<{ tips: SentTip[] }> {
  const res = await fetch(`${API_URL}/api/v1/tips/social/sent`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to get sent tips');
  }

  return res.json();
}

export async function getReceivedTips(token: string): Promise<{ tips: ReceivedTip[] }> {
  const res = await fetch(`${API_URL}/api/v1/tips/social/received`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to get received tips');
  }

  return res.json();
}

export async function getClaimableTips(token: string): Promise<{ tips: ClaimableTip[] }> {
  const res = await fetch(`${API_URL}/api/v1/tips/social/claimable`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to get claimable tips');
  }

  return res.json();
}

// =============================================================================
// Discord OAuth2 Linking
// =============================================================================

export interface DiscordAuthUrlResponse {
  auth_url: string;
}

export async function getDiscordAuthUrl(token: string): Promise<DiscordAuthUrlResponse> {
  const res = await fetch(`${API_URL}/api/v1/socials/discord/auth-url`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to get Discord auth URL');
  }

  return res.json();
}

export async function completeDiscordOAuth(
  token: string,
  code: string,
  state: string
): Promise<LinkedSocial> {
  const res = await fetch(`${API_URL}/api/v1/socials/discord/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code, state }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to link Discord account');
  }

  return res.json();
}

// =============================================================================
// Username Management
// =============================================================================

export async function getMyUsername(token: string): Promise<string | null> {
  const res = await fetch(`${API_URL}/api/v1/users/me/username`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error('Failed to get username');
  }

  return res.json();
}

export async function setUsername(token: string, username: string): Promise<{ username: string }> {
  const res = await fetch(`${API_URL}/api/v1/users/me/username`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to set username');
  }

  return res.json();
}

export interface UserLookupResponse {
  user_id: string;
  username: string;
}

export async function lookupByUsername(username: string): Promise<UserLookupResponse> {
  const res = await fetch(`${API_URL}/api/v1/users/by-username/${encodeURIComponent(username)}`);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('User not found');
    }
    throw new Error('Failed to lookup user');
  }

  return res.json();
}

// =============================================================================
// User Count (Public)
// =============================================================================

export interface UserCountResponse {
  count: number;
}

export async function getUserCount(): Promise<UserCountResponse> {
  const res = await fetch(`${API_URL}/api/v1/users/count`);

  if (!res.ok) {
    throw new Error('Failed to get user count');
  }

  return res.json();
}

// =============================================================================
// Public Stats
// =============================================================================

export interface PublicStats {
  total_users: number;
  users_by_preferred_asset: Record<string, number>;
  linked_accounts_by_platform: Record<string, number>;
  total_tips_sent: number;
}

export async function getPublicStats(): Promise<PublicStats> {
  const res = await fetch(`${API_URL}/api/v1/stats/public`);

  if (!res.ok) {
    throw new Error('Failed to get stats');
  }

  return res.json();
}
