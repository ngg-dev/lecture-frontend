import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
const model = await readFile(new URL('../src/shop/model.ts', import.meta.url), 'utf8');
const source = (await readFile(new URL('../src/content.js', import.meta.url), 'utf8'))
  .replace(/^import modelSource.*$/m, `const modelSource = ${JSON.stringify(model)};`);
const { slides, chapters, totalMinutes } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));

test('маршрут начинается с магазина и проблемы, затем вводит проверки', () => {
  const ids = slides.map(slide => slide.id);
  assert.equal(ids.length, new Set(ids).size);
  assert.deepEqual(ids.slice(0, 3), ['cover', 'working-shop', 'regression']);
  for (const [a, b] of [['regression', 'unit-setup'], ['aaa', 'red'], ['red', 'green'], ['unit-limit', 'component-test'], ['component-limit', 'first-e2e'], ['practice-task', 'recap']]) {
    assert(ids.indexOf(a) >= 0 && ids.indexOf(a) < ids.indexOf(b), `${a} должно идти до ${b}`);
  }
  assert.equal(ids.at(-1), 'recap');
  assert(totalMinutes >= 60 && totalMinutes <= 90);
  assert(slides.find(slide => slide.id === 'green').code.includes('Number.isFinite'));
  for (const slide of slides) {
    assert(chapters.some(chapter => chapter.id === slide.chapter));
    for (const field of ['title', 'lead', 'takeaway', 'notes']) assert(slide[field]?.trim(), `${slide.id}: ${field}`);
    assert(slide.minutes > 0);
  }
});

test('учебные ссылки, практика, решение и первичные источники существуют', async () => {
  for (const slide of slides) {
    const links = [...(slide.links || []).map(item => item[1]), ...(slide.link ? [slide.link.href] : [])];
    for (const href of links.filter(href => !href.startsWith('https:'))) {
      await access(new URL('../' + (href.startsWith('./docs/') ? './public/' + href.slice(2) : href), import.meta.url));
    }
  }
  for (const file of ['docs/practice.md', 'docs/solution.md', 'docs/prior-knowledge.md', 'docs/sources.md', 'docs/speaker-guide.md', 'README.md']) {
    await access(new URL('../' + (file.startsWith('docs/') ? 'public/' + file : file), import.meta.url));
  }
});
