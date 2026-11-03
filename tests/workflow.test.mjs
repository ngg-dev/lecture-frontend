import test from 'node:test';
import assert from 'node:assert/strict';
import { access, appendFile, copyFile, cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
// A nested Node test runner inherits this marker and otherwise silently skips its tests.
const { NODE_TEST_CONTEXT, ...childEnv } = process.env;
const run = (cwd, command, args) => spawnSync(command, args, { cwd, encoding: 'utf8', env: childEnv });
const succeeds = result => assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
const fails = (result, reason) => {
  assert.notEqual(result.status, 0, 'The invalid fixture unexpectedly passed');
  assert.match(`${result.stdout}\n${result.stderr}`, reason);
};

async function fixture(t) {
  const directory = await mkdtemp(resolve(tmpdir(), 'lecture-workflow-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const history = run(root, 'git', ['log', '--all', '--reverse', '--format=%H', '--', 'migration-sources.json']);
  succeeds(history);
  const revision = history.stdout.trim().split('\n')[0];
  const snapshots = JSON.parse(await readFile(resolve(root, 'migration-sources.json'), 'utf8'));
  const files = ['package.json', 'course.json', 'index.html', 'migration-sources.json',
    'tests/migration.test.mjs', 'tests/site.test.mjs',
    'Лабораторная работа 7.md', 'Лабораторная работа 7.pdf',
    ...snapshots.flatMap(source => source.files.map(file => `packages/${source.name}/${file.path}`))];
  try {
    await access(resolve(root, 'tests/migration.snapshot.mjs'));
    files.push('tests/migration.snapshot.mjs');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  for (const file of files) {
    const destination = resolve(directory, file);
    await mkdir(dirname(destination), { recursive: true });
    if (file.startsWith('packages/')) {
      const original = spawnSync('git', ['show', `${revision}:${file}`], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
      assert.equal(original.status, 0, `Unable to read fixture provenance: ${original.stderr}`);
      await writeFile(destination, original.stdout);
    } else {
      await copyFile(resolve(root, file), destination);
    }
  }
  await cp(resolve(root, 'lectures'), resolve(directory, 'lectures'), { recursive: true });
  succeeds(run(directory, 'git', ['init', '--quiet']));
  succeeds(run(directory, 'git', ['add', '--force', '.']));
  return directory;
}

test('ordinary source edits do not freeze the default development suite', async t => {
  const directory = await fixture(t);
  await appendFile(resolve(directory, 'packages/react-lecture/src/lecture.jsx'), '\n// Ordinary lesson revision.\n');
  succeeds(run(directory, 'npm', ['test']));
});

test('migration verification reads the staged import before its first commit', async t => {
  const directory = await fixture(t);
  await appendFile(resolve(directory, 'packages/react-lecture/src/lecture.jsx'), '\n// Unstaged lesson revision.\n');
  succeeds(run(directory, 'npm', ['run', 'verify:migration']));
});

test('migration verification rejects changes to immutable provenance', async t => {
  const directory = await fixture(t);
  await appendFile(resolve(directory, 'migration-sources.json'), '\n');
  fails(run(directory, 'npm', ['run', 'verify:migration']), /immutable provenance/);
});

test('migration verification detects a corrupted original import', async t => {
  const directory = await fixture(t);
  await appendFile(resolve(directory, 'packages/react-lecture/src/lecture.jsx'), '\n// Corrupted import.\n');
  succeeds(run(directory, 'git', ['add', '.']));
  fails(run(directory, 'npm', ['run', 'verify:migration']), /react-lecture\/src\/lecture\.jsx/);
});

test('migration verification uses the earliest import commit, not later edits or the index', async t => {
  const directory = await fixture(t);
  const commit = message => succeeds(run(directory, 'git', [
    '-c', 'user.name=Regression fixture', '-c', 'user.email=fixture@example.invalid',
    '-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', message,
  ]));
  commit('Original import');
  await appendFile(resolve(directory, 'packages/react-lecture/src/lecture.jsx'), '\n// Committed lesson revision.\n');
  succeeds(run(directory, 'git', ['add', '.']));
  commit('Ordinary revision');
  // Touch the manifest history without changing its bytes to distinguish earliest from latest.
  await appendFile(resolve(directory, 'migration-sources.json'), '\n');
  succeeds(run(directory, 'git', ['add', '.']));
  commit('Later manifest history');
  await copyFile(resolve(root, 'migration-sources.json'), resolve(directory, 'migration-sources.json'));
  succeeds(run(directory, 'git', ['add', '.']));
  commit('Restore provenance');
  await appendFile(resolve(directory, 'packages/react-lecture/src/lecture.jsx'), '\n// Staged lesson revision.\n');
  succeeds(run(directory, 'git', ['add', '.']));
  succeeds(run(directory, 'npm', ['run', 'verify:migration']));
});

async function addLecture(directory) {
  const lecture = { id: 'next-lecture', title: 'Next lecture', summary: 'A new lesson',
    output: 'public', check: false, build: false };
  const catalog = JSON.parse(await readFile(resolve(directory, 'course.json'), 'utf8'));
  catalog.splice(2, 0, lecture);
  await writeFile(resolve(directory, 'course.json'), JSON.stringify(catalog));
  await appendFile(resolve(directory, 'index.html'), '\n<a href="lectures/next-lecture/">Next lecture</a>\n');
  for (const folder of ['packages/next-lecture/public', 'lectures/next-lecture']) {
    await mkdir(resolve(directory, folder), { recursive: true });
    await writeFile(resolve(directory, folder, 'index.html'), '<!doctype html><title>Next lecture</title>');
  }
  await writeFile(resolve(directory, 'packages/next-lecture/package.json'), '{"name":"next-lecture","private":true}');
  return catalog;
}

test('a valid extra lecture between original lessons passes the default suite', async t => {
  const directory = await fixture(t);
  await addLecture(directory);
  succeeds(run(directory, 'npm', ['test']));
});

for (const scenario of ['missing original', 'misordered original']) {
  test(`the catalog rejects a ${scenario} even with an extra lecture`, async t => {
    const directory = await fixture(t);
    const catalog = await addLecture(directory);
    const first = catalog.findIndex(lecture => lecture.id === 'it-lecture');
    const second = catalog.findIndex(lecture => lecture.id === 'react-lecture');
    if (scenario === 'missing original') catalog.splice(first, 1);
    else [catalog[first], catalog[second]] = [catalog[second], catalog[first]];
    await writeFile(resolve(directory, 'course.json'), JSON.stringify(catalog));
    fails(run(directory, 'node', ['--test', 'tests/site.test.mjs']), /Original lectures must remain present in relative course order/);
  });
}

for (const [field, value] of [
  ['id', '../outside'], ['id', 'it-lecture'],
  ['title', ''], ['summary', null], ['output', '../outside'], ['check', 'yes'], ['build', null],
]) {
  test(`every extra catalog record validates its ${field}`, async t => {
    const directory = await fixture(t);
    const catalog = await addLecture(directory);
    catalog[2][field] = value;
    await writeFile(resolve(directory, 'course.json'), JSON.stringify(catalog));
    fails(run(directory, 'node', ['--test', 'tests/site.test.mjs']), new RegExp(field));
  });
}
