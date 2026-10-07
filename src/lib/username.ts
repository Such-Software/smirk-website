/**
 * Normalize a `GET /users/me/username` response to a username or null.
 *
 * The legacy backend answered with a bare JSON string (or null). The v0.3
 * backend answers with `{ "username": string | null }`. Anything else, including
 * an empty string, is treated as "no username" so a shape change can never put a
 * non-string into React state and crash the page.
 */
export function parseUsernameResponse(data: unknown): string | null {
  const value =
    data !== null && typeof data === 'object' && 'username' in data
      ? (data as { username: unknown }).username
      : data;
  return typeof value === 'string' && value.length > 0 ? value : null;
}
