import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceDemo, INITIAL_DEMO_STATE, setDemoEvidence, simulatedAssetState, SWAP_DEMOS } from './swap-demos.ts';
test('unknown evidence preserves the last known stage and locked assets', () => {
 for (const step of [2, 3, 4]) {
  const state = setDemoEvidence({ step, evidenceUnknown: false }, true);
  const before = [0, 1].map(side => simulatedAssetState(state.step, side));
  assert.equal(advanceDemo(state, 6), state);
  assert.deepEqual([0, 1].map(side => simulatedAssetState(state.step, side)), before);
  assert.equal(advanceDemo(setDemoEvidence(state, false), 6).step, step + 1);
 }
});
test('complete walkthroughs stop at the final stage', () => {
 for (const demo of SWAP_DEMOS) {
  let state = INITIAL_DEMO_STATE;
  for (const _ of demo.steps) state = advanceDemo(state, demo.steps.length);
  assert.equal(state.step, demo.steps.length - 1);
  assert.equal(advanceDemo(state, demo.steps.length).step, state.step);
  assert.equal(simulatedAssetState(state.step, 1), 'Received');
 }
});
test('designs retain distinct compensation and cooperation-required branches', () => {
 const basic = SWAP_DEMOS.find(demo => demo.slug === 'basicswap')!;
 const eigen = SWAP_DEMOS.find(demo => demo.slug === 'eigenswap')!;
 assert.ok(basic.recovery.some(branch => /compensation/i.test(branch.detail)));
 assert.ok(eigen.recovery.some(branch => /maker cooperation/i.test(branch.detail)));
 assert.ok(eigen.badge.includes('preview'));
});
