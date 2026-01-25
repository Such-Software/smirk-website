// TypeScript types for the Smirk extension's injected window.smirk API

interface SmirkPublicKeys {
  btc: string;
  ltc: string;
  xmr: string;
  wow: string;
  grin: string;
}

interface SmirkSignature {
  asset: 'btc' | 'ltc' | 'xmr' | 'wow' | 'grin';
  signature: string;
  publicKey: string;
}

interface SmirkSignResult {
  message: string;
  signatures: SmirkSignature[];
}

interface SmirkAPI {
  isSmirk: boolean;
  connect(): Promise<SmirkPublicKeys>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  getPublicKeys(): Promise<SmirkPublicKeys | null>;
  signMessage(message: string): Promise<SmirkSignResult>;
}

interface Window {
  smirk?: SmirkAPI;
}
