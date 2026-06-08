'use client';

/**
 * `SmirkBridgeBootstrap` — mounts the `installSmirkPageApi` runtime
 * on every page of smirk.cash so the site works both inside the
 * v0.2.x browser extension (no-op; extension wins) and inside the
 * v0.3.0+ desktop wallet's embedded iframe (postMessage transport).
 *
 * Lives in the root layout so every route picks it up automatically —
 * page.tsx, TipPageClient.tsx, future id/forum subdomains, all of it.
 * No other files need to know about the v0.3.0 transport.
 */

import { useEffect } from 'react';
import { installSmirkPageApi } from '@such-software/smirk-dapp-api';

export function SmirkBridgeBootstrap(): null {
  useEffect(() => {
    installSmirkPageApi();
  }, []);
  return null;
}
