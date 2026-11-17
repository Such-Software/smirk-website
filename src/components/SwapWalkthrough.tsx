"use client";
import { useState } from 'react';
import { advanceDemo, INITIAL_DEMO_STATE, setDemoEvidence, simulatedAssetState, type SwapDemo } from '@/lib/swap-demos';
export default function SwapWalkthrough({ demo }: { demo: SwapDemo }) {
 const [state, setState] = useState(INITIAL_DEMO_STATE);
 const current = demo.steps[state.step];
 const chainNames: Record<string, string> = { LTC: 'Litecoin', WOW: 'Wownero', BTC: 'Bitcoin', XMR: 'Monero' };
 const holders = demo.assets.map(asset => `${chainNames[asset]} holder`);
 return <div className="mt-7">
  <div className="demo-progress" aria-hidden="true">{demo.steps.map((step, index) => <span key={step.label} data-reached={index <= state.step} />)}</div>
  <div className="swap-flow" role="group" aria-label="Simulated asset flow">
   {demo.assets.map((asset, side) => {
    const status = simulatedAssetState(state.step, side);
    const position = status === 'Not locked' ? 0 : status === 'Locked' ? 1 : 2;
    return <figure key={asset} className="flow-chain" aria-label={`${chainNames[asset]}: ${status}. From ${holders[side]} to ${holders[1 - side]}.`}>
     <figcaption className="flow-caption"><span>{chainNames[asset]} <span className="text-zinc-400">{asset}</span></span><span className="flow-status">{status}</span></figcaption>
     <div className="flow-track">
      <div className="flow-path" aria-hidden="true">
       <svg className="flow-arrow flow-arrow-first" viewBox="0 0 8 8"><path d="m2 1 3 3-3 3" /></svg>
       <svg className="flow-arrow flow-arrow-second" viewBox="0 0 8 8"><path d="m2 1 3 3-3 3" /></svg>
       <span className="flow-token" style={{ left: `${position * 50}%` }} />
      </div>
      {['Wallet', 'Shared lock', 'Recipient'].map((label, index) => <div key={label} className="flow-node" data-active={position === index}>
       <span className="flow-symbol" aria-hidden="true">{index === 1 ? <svg viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v11H5z" /></svg> : <svg viewBox="0 0 24 24"><path d="M3 5h16v15H3zM3 5l13-3v3M15 11h6v5h-6z" /></svg>}</span>
       <span className="flow-node-label">{label}</span>
       <span className="flow-person">{index === 0 ? holders[side] : index === 2 ? holders[1 - side] : 'Agreed swap'}</span>
      </div>)}
     </div>
    </figure>;
   })}
  </div>
  <details className="demo-step-picker">
   <summary>Step {state.step + 1} of {demo.steps.length}<span className="ml-3 text-[#fbeb0a]">Jump to a step</span></summary>
   <ol aria-label="Swap steps" className="mt-3 grid grid-cols-2 gap-2">
    {demo.steps.map((step, index) => <li key={step.label}><button type="button" aria-current={index === state.step ? 'step' : undefined}
     disabled={state.evidenceUnknown} onClick={() => setState(value => value.evidenceUnknown ? value : { ...value, step: index })}
     className={`h-full w-full rounded-lg border px-3 py-2 text-left text-xs disabled:cursor-not-allowed disabled:opacity-50 ${index === state.step ? 'border-[#fbeb0a] text-[#fbeb0a]' : 'border-zinc-700 text-zinc-300'}`}>
     {index + 1}. {step.label}
    </button></li>)}
   </ol>
  </details>
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
