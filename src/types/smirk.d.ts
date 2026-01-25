// TypeScript types for the Smirk extension's injected window.smirk API

interface SmirkPublicKeys {
  btc: string;
  ltc: string;
  xmr: string;
  wow: string;
  grin: string;
}

interface SmirkSignature {
  asset: string;
  signature: string;
  public_key: string;
}

interface SmirkSignatures {
  btc: SmirkSignature;
  ltc: SmirkSignature;
  xmr: SmirkSignature;
  wow: SmirkSignature;
  grin: SmirkSignature;
}

interface SmirkAPI {
  connect(): Promise<SmirkPublicKeys>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  getPublicKeys(): Promise<SmirkPublicKeys | null>;
  signMessage(message: string): Promise<SmirkSignatures>;
}

interface Window {
  smirk?: SmirkAPI;
}
