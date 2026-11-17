export interface DemoStep { readonly label: string; readonly detail: string }
export interface SwapDemo {
 readonly slug: string; readonly title: string; readonly badge: string; readonly intro: string;
 readonly assets: readonly string[]; readonly people: readonly string[];
 readonly steps: readonly DemoStep[]; readonly recovery: readonly DemoStep[]; readonly support: string;
}
export const SWAP_DEMOS: readonly SwapDemo[] = [
  {
    "slug": "basicswap",
    "title": "BasicSwap-compatible swaps",
    "badge": "Protocol 8",
    "intro": "Follow an illustrative Litecoin and Wownero exchange, including what happens when the success path stops.",
    "assets": [
      "LTC",
      "WOW"
    ],
    "people": [
      "LTC-side leader",
      "WOW-side follower"
    ],
    "steps": [
      {
        "label": "Agree on terms",
        "detail": "Two peers agree on amounts, destinations, fees and recovery conditions. A relayed offer or connected peer does not mean funds are locked."
      },
      {
        "label": "Prepare recovery",
        "detail": "Validate the transaction graph and key proofs, preserve the swap state, and save and verify recovery data before authorizing funding."
      },
      {
        "label": "Lock Litecoin",
        "detail": "The LTC-side leader funds the agreed Litecoin contract. Wait for the required chain evidence and recovery checks."
      },
      {
        "label": "Lock Wownero",
        "detail": "The WOW-side follower funds the shared Wownero address after the Litecoin checks pass. Verify its amount and confirmations."
      },
      {
        "label": "Claim Litecoin",
        "detail": "The follower uses the authorized signature path to claim LTC. The resulting valid signature lets the leader recover the missing Wownero key share."
      },
      {
        "label": "Receive Wownero",
        "detail": "The leader sweeps the shared WOW output to its wallet. Completion requires the appropriate evidence; a broadcast alone is not settlement."
      }
    ],
    "recovery": [
      {
        "label": "Before funding: stop",
        "detail": "You can cancel the local request before funds are committed. Messages already relayed to another peer may remain."
      },
      {
        "label": "Submission uncertain",
        "detail": "Keep the signed transaction and reserved inputs. Check its exact status before retrying; do not create a new payment."
      },
      {
        "label": "Wait for recovery",
        "detail": "Eligibility follows the agreed chain timelocks and validated unspent state, not a browser countdown."
      },
      {
        "label": "Refund or compensation",
        "detail": "The LTC refund path can return LTC to the leader and reveal the share needed for the follower to recover WOW. If the leader does not complete the refund-spend path, a later follower swipe can yield LTC compensation. Compensation is not a WOW refund and is not guaranteed equal market value."
      },
      {
        "label": "Restore and recheck",
        "detail": "Load retained recovery data and revalidate current chain state. Missing evidence or a reorganization means status needs checking, not automatic success."
      }
    ],
    "support": "This compatibility work is under development. The walkthrough is not a live trading interface and cannot start a swap."
  },
  {
    "slug": "eigenswap",
    "title": "EigenSwap",
    "badge": "v0.3.3 preview",
    "intro": "Explore a Bitcoin-paying, Monero-receiving taker flow. This is an unreleased compatibility preview, not an integrated wallet feature.",
    "assets": [
      "BTC",
      "XMR"
    ],
    "people": [
      "BTC-paying taker",
      "XMR-paying maker"
    ],
    "steps": [
      {
        "label": "Review a maker quote",
        "detail": "Choose BTC amount and review XMR amount, fees, any anti-spam deposit and recovery deadlines."
      },
      {
        "label": "Prepare the swap",
        "detail": "Exchange and validate key proofs and signed recovery transactions. Persist per-swap state before publishing the Bitcoin lock."
      },
      {
        "label": "Lock Bitcoin",
        "detail": "The taker funds the agreed two-key Bitcoin output first."
      },
      {
        "label": "Verify Monero",
        "detail": "The maker locks XMR to a shared address. The taker checks address, amount and required confirmations before releasing the encrypted signature."
      },
      {
        "label": "Maker claims Bitcoin",
        "detail": "The maker completes the adaptor signature and redeems BTC. The published signature lets the taker recover the maker’s Monero key share."
      },
      {
        "label": "Sweep Monero",
        "detail": "The taker signs and publishes the XMR sweep, retains recovery material, and waits for the configured confirmation policy."
      }
    ],
    "recovery": [
      {
        "label": "Cancel and refund",
        "detail": "If the success path stalls, the taker waits for the Bitcoin cancel condition and completes the applicable refund path, paying network fees."
      },
      {
        "label": "Deposit withheld",
        "detail": "A maker may require an anti-spam deposit up to 20%. Reclaim, withhold and mercy are distinct branches: your refund may be partial, and network fees still apply."
      },
      {
        "label": "Missed deadline",
        "detail": "After the punish condition, the maker can take the BTC. XMR recovery then depends on maker cooperation; no guaranteed automatic refund."
      },
      {
        "label": "Source unavailable",
        "detail": "Status stays unknown while the source is unavailable. Keep your saved swap state and follow the Bitcoin recovery deadlines; unavailable Monero evidence does not confirm a payment."
      },
      {
        "label": "Resume from saved swap data",
        "detail": "Your wallet seed alone is not enough to restore this swap. Per-swap records are also needed. Wallet integration and background monitoring are still under development."
      }
    ],
    "support": "A local test-network implementation exists. Wallet integration and mainnet use are not available in this preview."
  }
];
export interface DemoState { readonly step: number; readonly evidenceUnknown: boolean }
export const INITIAL_DEMO_STATE: DemoState = Object.freeze({ step: 0, evidenceUnknown: false });
export function advanceDemo(state: DemoState, count: number): DemoState {
 return state.evidenceUnknown ? state : { ...state, step: Math.min(state.step + 1, count - 1) };
}
export function setDemoEvidence(state: DemoState, evidenceUnknown: boolean): DemoState { return { ...state, evidenceUnknown }; }
export function simulatedAssetState(step: number, side: number): string {
 return side === 0 ? (step < 2 ? 'Not locked' : step < 4 ? 'Locked' : 'Claimed') : (step < 3 ? 'Not locked' : step < 5 ? 'Locked' : 'Received');
}
