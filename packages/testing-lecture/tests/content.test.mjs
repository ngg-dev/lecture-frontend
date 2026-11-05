import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
const model = await readFile(new URL('../src/shop/model.ts', import.meta.url), 'utf8');
const source = (await readFile(new URL('../src/content.js', import.meta.url), 'utf8'))
  .replace(/^import modelSource.*$/m, `const modelSource = ${JSON.stringify(model)};`)
  .replace(/^import babelConfig.*$/m, `const babelConfig = ${JSON.stringify(await readFile(new URL('../babel.config.cjs', import.meta.url), 'utf8'))};`);
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

test('лекция использует Jest для unit/компонентов и отдельный Playwright для e2e', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert(pkg.devDependencies.jest, 'Jest должен быть установлен');
  assert(!pkg.devDependencies.vitest, 'Предыдущий runner удалён');
  assert.match(pkg.scripts.test, /^jest\b/);
  assert.equal(pkg.scripts['test:e2e'], 'playwright test');
  const { default: config } = await import('../jest.config.cjs');
  assert(config.testMatch.every(pattern => pattern.includes('/tests/')), 'Jest не захватывает e2e');
  assert.equal(config.testEnvironment, 'jsdom');
  assert(slides.find(slide => slide.id === 'aaa').code.includes('@jest/globals'));
  assert(slides.find(slide => slide.id === 'component-test').code.includes('jest.fn'));
  assert(slides.some(slide => slide.id === 'jest-transform'));
  assert(!/vitest|\bvi\.fn\b/i.test(source), 'Примеры и объяснения полностью переведены');
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
