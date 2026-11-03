import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
test('migration provenance is well formed and existing course material remains available', async () => {
  const snapshots = JSON.parse(await readFile(resolve(root, 'migration-sources.json'), 'utf8'));
  assert.equal(snapshots.length, 5);
  assert.equal(new Set(snapshots.map(source => source.name)).size, 5);
  for (const source of snapshots) {
    assert.match(source.commit, /^[a-f0-9]{40}$/);
    assert.equal(source.repository, `https://github.com/ngg-dev/${source.name}`);
    assert(source.files.length > 0);
    for (const file of source.files) {
      assert(!file.path.split('/').includes('..'));
      assert.match(file.sha256, /^[a-f0-9]{64}$/);
    }
  }
  for (const existing of ['lectures/hermes/index.html', 'lectures/test/index.html', 'Лабораторная работа 7.md', 'Лабораторная работа 7.pdf']) {
    await access(resolve(root, existing));
  }
});
