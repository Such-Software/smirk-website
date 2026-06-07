/**
 * `installSmirkPageApi` — runtime installer for `window.smirk`.
 *
 * Local copy of `@smirk/dapp-api`'s `installSmirkPageApi`, kept here
 * until that package is published to npm. **When @smirk/dapp-api is
 * available, replace this file with:**
 *
 * ```ts
 * export { installSmirkPageApi } from '@smirk/dapp-api';
 * ```
 *
 * Source of truth lives at
 * `smirk-monorepo/packages/dapp-api/src/install-page-api.ts`.
 * Any change to this file should be mirrored there (and vice versa).
 *
 * Behaviour:
 *
 * 1. If `window.smirk` is already defined, the v0.2.x browser
 *    extension content script already ran. We leave it alone —
 *    every existing dapp continues to work untouched.
 *
 * 2. If `window.parent !== window`, the page is iframed by something.
 *    The Smirk v0.3.0 desktop wallet's embedded browser is the
 *    relevant case. We install a `window.smirk` whose every method
 *    posts a `SMIRK_REQUEST` envelope to `window.parent` and resolves
 *    on the matching response. UI surface (approval modals etc.) is
 *    the wallet's responsibility.
 *
 * 3. Otherwise (no extension, no iframe parent) we install nothing.
 *    The page's existing "extension not found" fallback applies.
 *
 * Safe to call multiple times. Returns a hint at what it did.
 */

const DEFAULT_POSTMESSAGE_CHANNEL = 'smirk:dapp';
const PROTOCOL_VERSION = 1;

export interface InstallSmirkPageApiOptions {
  readonly channel?: string;
  readonly timeoutMs?: number;
  readonly mode?: 'auto' | 'force' | 'never';
  readonly onReady?: () => void;
}

export function installSmirkPageApi(
  options: InstallSmirkPageApiOptions = {},
): 'extension-present' | 'iframe-mode' | 'none' {
  if (typeof window === 'undefined') return 'none';

  if (typeof (window as Window & { smirk?: unknown }).smirk !== 'undefined') {
    return 'extension-present';
  }

  const mode = options.mode ?? 'auto';
  if (mode === 'never') return 'none';
  if (mode === 'auto' && window.parent === window) return 'none';

  const channel = options.channel ?? DEFAULT_POSTMESSAGE_CHANNEL;
  const timeoutMs = options.timeoutMs ?? 30_000;

  installPostMessageRuntime(channel, timeoutMs);
  options.onReady?.();
  return 'iframe-mode';
}

interface PendingEntry {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timer: ReturnType<typeof setTimeout>;
}

interface WireResponse {
  type: 'SMIRK_RESPONSE';
  v: number;
  id: number;
  result?: unknown;
  error?: { code: string; message: string };
}

function installPostMessageRuntime(channel: string, timeoutMs: number): void {
  const pending = new Map<number, PendingEntry>();
  let nextId = 1;

  function request(method: string, params: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(
          Object.assign(new Error(`Smirk wallet timed out responding to ${method}`), {
            code: 'TIMEOUT',
          }),
        );
      }, timeoutMs);
      pending.set(id, { resolve, reject, timer });
      window.parent.postMessage(
        {
          channel,
          payload: {
            type: 'SMIRK_REQUEST',
            v: PROTOCOL_VERSION,
            id,
            method,
            params: params ?? {},
          },
        },
        '*',
      );
    });
  }

  window.addEventListener('message', (ev: MessageEvent) => {
    const data = ev.data as
      | { channel?: unknown; payload?: WireResponse }
      | null
      | undefined;
    if (!data || data.channel !== channel) return;
    const resp = data.payload;
    if (!resp || resp.type !== 'SMIRK_RESPONSE') return;
    const entry = pending.get(resp.id);
    if (!entry) return;
    pending.delete(resp.id);
    clearTimeout(entry.timer);
    if (resp.error) {
      entry.reject(
        Object.assign(new Error(resp.error.message), { code: resp.error.code }),
      );
    } else {
      entry.resolve(resp.result);
    }
  });

  const api = {
    isInstalled: (): boolean => true,
    protocolVersion: (): number => PROTOCOL_VERSION,
    isUnlocked: (): Promise<boolean> => request('isUnlocked', {}) as Promise<boolean>,
    isConnected: (): Promise<boolean> => request('isConnected', {}) as Promise<boolean>,
    connect: (assets?: string[]): Promise<unknown> => request('connect', { assets }),
    disconnect: (): Promise<void> => request('disconnect', {}) as Promise<void>,
    getAddresses: (assets?: string[]): Promise<unknown> =>
      request('getAddresses', { assets }),
    getPublicKeys: (assets?: string[]): Promise<unknown> =>
      request('getPublicKeys', { assets }),
    signMessage: (message: string, assets?: string[]): Promise<unknown> =>
      request('signMessage', { message, assets }),
    requestPayment: (req: unknown): Promise<unknown> =>
      request('requestPayment', req),
    claimPublicTip: (tipId: string, fragmentKey: string): Promise<unknown> =>
      request('claimPublicTip', { tipId, fragmentKey }),
  };

  Object.defineProperty(window, 'smirk', {
    value: api,
    writable: false,
    configurable: false,
    enumerable: true,
  });
  window.dispatchEvent(new CustomEvent('smirk-ready'));
}
