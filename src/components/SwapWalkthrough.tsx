"use client";
import { useState } from 'react';
import { advanceDemo, INITIAL_DEMO_STATE, setDemoEvidence, simulatedAssetState, type SwapDemo } from '@/lib/swap-demos';
export default function SwapWalkthrough({ demo }: { demo: SwapDemo }) {
 const [state, setState] = useState(INITIAL_DEMO_STATE);
 const current = demo.steps[state.step];
 return <div className="mt-10">
  <div className="demo-assets">{demo.assets.map((asset, side) => <div key={asset} className="rounded-xl border border-zinc-800 p-5">
   <p className="text-xs text-zinc-400">{demo.people[side]}</p><p className="mt-2 text-2xl font-bold">{asset}</p>
   <p className="mt-2 text-sm text-[#fbeb0a]">{simulatedAssetState(state.step, side)}</p>
  </div>)}</div>
  <ol aria-label="Swap steps" className="my-8 grid gap-2 sm:grid-cols-2">{demo.steps.map((step, index) => <li key={step.label} aria-current={index === state.step ? 'step' : undefined}
   className={`rounded-lg border px-4 py-3 text-sm ${index === state.step ? 'border-[#fbeb0a] text-[#fbeb0a]' : 'border-zinc-800 text-zinc-400'}`}>
   <span className="mr-3 tabular-nums">{index + 1}.</span>{step.label}
  </li>)}</ol>
  <section aria-live="polite" aria-atomic="true" className="min-h-36">
   <p className="text-xs text-zinc-400">Simulated step {state.step + 1} of {demo.steps.length}</p>
   <h2 className="mt-3 text-xl font-semibold">{current.label}</h2><p className="mt-3 leading-relaxed text-zinc-300">{current.detail}</p>
   {state.evidenceUnknown && <p role="status" className="mt-4 rounded-lg border border-amber-700 p-4 text-sm text-amber-200">Evidence unavailable. The last known stage and locked funds stay unchanged. Recheck before continuing.</p>}
  </section>
  <div className="my-6 flex flex-wrap gap-3">
   <button type="button" disabled={state.evidenceUnknown || state.step === demo.steps.length - 1} onClick={() => setState(value => advanceDemo(value, demo.steps.length))}
    className="rounded-lg bg-[#fbeb0a] px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40">{state.step === demo.steps.length - 1 ? 'Walkthrough complete' : 'Next step'}</button>
   <button type="button" onClick={() => setState(INITIAL_DEMO_STATE)} className="rounded-lg border border-zinc-700 px-5 py-3 text-sm">Start over</button>
  </div>
  <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-zinc-400">
   <input type="checkbox" checked={state.evidenceUnknown} onChange={event => setState(value => setDemoEvidence(value, event.target.checked))} className="h-4 w-4 accent-[#fbeb0a]" />Simulate unavailable evidence
  </label>
  <section className="mt-12 border-t border-zinc-800 pt-8" aria-labelledby="recovery-heading">
   <h2 id="recovery-heading" className="text-xl font-semibold">If the swap does not finish</h2><p className="mb-5 mt-3 text-sm text-zinc-400">Different states have different recovery paths. Expand one to explore it.</p>
   {demo.recovery.map(branch => <details key={branch.label} className="border-b border-zinc-800 py-4"><summary className="cursor-pointer text-sm text-zinc-200">{branch.label}</summary><p className="mt-3 text-sm leading-relaxed text-zinc-400">{branch.detail}</p></details>)}
  </section>
  <p className="mt-8 text-xs leading-relaxed text-zinc-400">Steps and confirmations are simulated. Real swaps require network fees, chain confirmations, saved recovery data and timely monitoring.</p>
 </div>;
}
