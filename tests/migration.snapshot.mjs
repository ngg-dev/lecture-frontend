import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const manifestPath = 'migration-sources.json';
const git = args => {
  const result = spawnSync('git', args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  assert.equal(result.status, 0, `git ${args.join(' ')}: ${result.error?.message || result.stderr}`);
  return result.stdout;
};

test('the original migration snapshot matches its immutable provenance', async t => {
  // With no migration commit yet (including an unborn HEAD), --all yields no history.
  const revision = git(['log', '--all', '--reverse', '--format=%H', '--', manifestPath])
    .toString('utf8').trim().split('\n')[0];
  const original = path => git(['show', `${revision}:${path}`]);
  const manifest = original(manifestPath);
  assert.deepEqual(await readFile(resolve(root, manifestPath)), manifest,
    'migration-sources.json is immutable provenance; do not update its commits or hashes');
  const snapshots = JSON.parse(manifest.toString('utf8'));
  for (const source of snapshots) {
    for (const file of source.files) {
      const bytes = original(`packages/${source.name}/${file.path}`);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256, `${source.name}/${file.path}`);
    }
  }
  t.diagnostic(`Verified original migration from ${revision || 'the staging index (before the first migration commit)'}`);
});
