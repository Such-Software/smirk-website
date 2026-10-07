import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseUsernameResponse } from './username.ts';

test('accepts the v0.3 object shape', () => {
  assert.equal(parseUsernameResponse({ username: 'alice' }), 'alice');
  assert.equal(parseUsernameResponse({ username: null }), null);
});

test('accepts the legacy bare string shape', () => {
  assert.equal(parseUsernameResponse('alice'), 'alice');
  assert.equal(parseUsernameResponse(null), null);
});

test('never returns a non-string', () => {
  for (const input of [undefined, '', 42, true, [], {}, { username: 7 }, { username: { a: 1 } }]) {
    const result = parseUsernameResponse(input);
    assert.ok(result === null || typeof result === 'string');
    assert.equal(result, null);
  }
});
