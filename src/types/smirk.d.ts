// TypeScript types for the Smirk extension's injected window.smirk API.
//
// Surface mirrors `smirk-extension/src/inject/smirk-api.ts`. Keep in
// sync when the extension's API changes — when something doesn't
// match here, the website breaks silently (the extension's actual
// runtime is the source of truth, this file just lets us autocomplete).

type SmirkAsset = 'btc' | 'ltc' | 'xmr' | 'wow' | 'grin';

// Asset-scoped connect (extension v0.2.x onward) returns only the
// approved assets — fields for un-approved assets are `null` rather
// than missing, so callers can typecheck per-asset without rebinding.
interface SmirkPublicKeys {
  btc: string | null;
  ltc: string | null;
  xmr: string | null;
  wow: string | null;
  grin: string | null;
}

interface SmirkAddresses {
  btc: string | null;
  ltc: string | null;
  xmr: string | null;
  wow: string | null;
  grin: string | null;
}

interface SmirkSignature {
  asset: SmirkAsset;
  signature: string;
  publicKey: string;
}

interface SmirkSignResult {
  message: string;
  signatures: SmirkSignature[];
}

interface SmirkClaimResult {
  success: boolean;
  txid?: string;
  error?: string;
}

interface SmirkPaymentRequest {
  asset: 'btc' | 'ltc' | 'xmr' | 'wow';
  amount: string;   // Atomic-units string (avoid float)
  address: string;
  memo?: string;
}

interface SmirkPaymentResult {
  success: boolean;
  txid?: string;
  error?: string;
}

interface SmirkAPI {
  isSmirk: boolean;
  /**
   * Connect to Smirk wallet — requests user approval to share public keys.
   * @param assets Optional asset scope. If omitted, requests all assets.
   *               Per-asset requests reduce metadata exposure (UI_DESIGN
   *               Principle 7).
   */
  connect(assets?: SmirkAsset[]): Promise<SmirkPublicKeys>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  getPublicKeys(): Promise<SmirkPublicKeys | null>;
  getAddresses(): Promise<SmirkAddresses | null>;
  signMessage(message: string): Promise<SmirkSignResult>;
  /**
   * Request a payment from the user. Surfaces the Smirk send flow
   * pre-filled with the asset/amount/address; user must approve.
   */
  requestPayment(request: SmirkPaymentRequest): Promise<SmirkPaymentResult>;
  claimPublicTip(tipId: string, fragmentKey: string): Promise<SmirkClaimResult>;
}

// CustomEvent fired on `window` when the extension finishes injecting
// its API. Listen for this in your detection logic alongside an
// initial sync check; the extension may inject before OR after your
// listener mounts (module scripts defer until after DOMContentLoaded).
interface WindowEventMap {
  'smirk-ready': CustomEvent<void>;
}

interface Window {
  smirk?: SmirkAPI;
}
