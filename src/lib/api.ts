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
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Failed to get challenge');
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
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Failed to verify signature');
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
