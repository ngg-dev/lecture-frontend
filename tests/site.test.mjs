import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
test('the course catalog opens every migrated deck locally and retains existing material', async () => {
  const catalog = JSON.parse(await readFile(resolve(root, 'course.json'), 'utf8'));
  assert(Array.isArray(catalog), 'The course catalog must be an array');
  const ids = new Set();
  for (const lecture of catalog) {
    assert(lecture && typeof lecture === 'object', 'Each catalog record must be an object');
    assert.equal(typeof lecture.id, 'string', 'Lecture id must be a string');
    assert.match(lecture.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lecture id must be a local directory name');
    assert(!ids.has(lecture.id), `Duplicate lecture id: ${lecture.id}`);
    ids.add(lecture.id);
    for (const field of ['title', 'summary']) {
      assert(typeof lecture[field] === 'string' && lecture[field].trim(), `${lecture.id}: ${field} must be nonempty text`);
    }
    assert.equal(typeof lecture.output, 'string', `${lecture.id}: output must be a relative directory`);
    assert.match(lecture.output, /^[a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)*$/, `${lecture.id}: output must be a relative directory`);
    assert(!lecture.output.split('/').includes('..'), `${lecture.id}: output must stay inside its package`);
    for (const field of ['check', 'build']) {
      assert.equal(typeof lecture[field], 'boolean', `${lecture.id}: ${field} must be a boolean`);
    }
  }
  const originalIds = ['it-lecture', 'react-lecture', 'react-api-lecture', 'react-state-managers', 'ts-lecture'];
  assert.deepEqual(catalog.filter(item => originalIds.includes(item.id)).map(item => item.id), originalIds,
    'Original lectures must remain present in relative course order');
  const homepage = await readFile(resolve(root, 'index.html'), 'utf8');
  for (const lecture of catalog) {
    assert(homepage.includes(`href="lectures/${lecture.id}/"`), `Missing catalog entry: ${lecture.id}`);
    await access(resolve(root, 'lectures', lecture.id, 'index.html'));
  }
  for (const legacy of ['hermes', 'test']) assert(homepage.includes(`href="lectures/${legacy}/"`));
  for (const file of ['Лабораторная работа 7.md', 'Лабораторная работа 7.pdf']) await access(resolve(root, file));
});

test('published HTML uses working local asset paths in every course subdirectory', async () => {
  const catalog = JSON.parse(await readFile(resolve(root, 'course.json'), 'utf8'));
  for (const lecture of catalog) {
    const folder = resolve(root, 'lectures', lecture.id);
    const html = await readFile(resolve(folder, 'index.html'), 'utf8');
    const openingTags = html.match(/<(?:script|link|img)\b[^>]*>/gi) || [];
    for (const tag of openingTags) {
      const attr = tag.match(/\b(?:src|href)=["']([^"']+)["']/i);
      if (!attr || /^(?:https?:|data:|blob:|#)/.test(attr[1])) continue;
      assert(!attr[1].startsWith('/'), `Root-relative asset breaks Pages: ${lecture.id}/${attr[1]}`);
      await access(resolve(folder, decodeURIComponent(attr[1].split(/[?#]/)[0])));
    }
  }
});
