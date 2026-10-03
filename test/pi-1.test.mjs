import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { load } from './pi-host.mjs';

test('intent restores the active branch and clears when moving to an empty branch', async () => {
  const host = await load(resolve('index.ts'));
  host.entries.push({ type: 'custom', customType: 'session-intent', data: { text: 'branch intent' } });
  await host.emit('session_start');
  assert.equal(host.statuses.get('session-intent'), 'Intent: branch intent');
  await host.extension.commands.get('intent').handler('new intent', host.ctx);
  assert.equal(host.entries.at(-1).data.text, 'new intent');
  host.entries.length = 0;
  await host.emit('session_tree');
  assert.equal(host.statuses.get('session-intent'), undefined);
});
