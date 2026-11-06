import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { slides, chapters, totalMinutes } from '../src/content.js';

test('подробная лекция сохраняет маршрут и укладывается в 70 минут', () => {
  const ids = slides.map(slide => slide.id);
  assert.equal(ids.length, 47);
  assert.equal(ids.length, new Set(ids).size);
  assert.deepEqual(ids.slice(0, 3), ['cover', 'working-shop', 'regression']);
  assert.deepEqual(ids.slice(5, 8), ['incident-cloudflare', 'everyday-case', 'ordinary-risks']);
  assert.equal(ids.at(-1), 'recap');
  assert.equal(totalMinutes, 70);
  for (const [before, after] of [
    ['boundaries', 'tool-choice'], ['tool-choice', 'tool-map'], ['aaa-methodology', 'aaa'],
    ['red', 'cases'], ['unit-lab', 'unit-lab-fixed'], ['unit-limit', 'e2e-intro'], ['e2e-intro', 'double-submit'],
    ['double-submit', 'async'], ['async', 'mocks'], ['component-lab', 'component-lab-retry'],
    ['first-e2e', 'e2e-boundary'],
    ['answers', 'ai-testing'], ['ai-testing', 'ai-prompt'], ['ai-prompt', 'ai-review'],
  ]) assert.equal(ids[ids.indexOf(before) + 1], after, `${before} → ${after}`);
  assert(!ids.includes('green') && !ids.includes('component-test'));
  for (const slide of slides) {
    assert(slide.minutes > 0, `${slide.id}: положительное время`);
    assert(chapters.some(chapter => chapter.id === slide.chapter));
    assert(slide.title?.trim(), `${slide.id}: title`);
    if (slide.kind !== 'title-only') {
      for (const field of ['lead', 'takeaway', 'notes']) assert(slide[field]?.trim(), `${slide.id}: ${field}`);
    }
    assert(!slide.demo, `${slide.id}: пример читается без интерактивного запуска`);
  }
});

test('Jest проверяет правило, а браузерные сценарии описаны без кода', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts.test, 'jest');
  assert.equal(pkg.scripts['test:e2e'], 'playwright test');
  const { default: config } = await import('../jest.config.cjs');
  assert(config.testMatch.every(pattern => pattern.includes('/tests/')), 'Jest не захватывает e2e');
  assert.equal(config.testEnvironment, 'jsdom');
  const unitExample = slides.find(slide => slide.id === 'aaa');
  assert.equal(unitExample.chapter, 'unit');
  assert(unitExample.code.includes('@jest/globals'));
  assert(unitExample.code.includes('toBeNull'));
  for (const step of ['Arrange', 'Act', 'Assert']) assert(unitExample.code.includes(step));
  const browserExample = slides.find(slide => slide.id === 'first-e2e');
  assert.equal(browserExample.chapter, 'e2e');
  assert(!browserExample.code);
  assert.match(browserExample.lead, /Playwright/);
  for (const slide of slides.filter(slide => slide.code)) {
    assert(slide.code.split('\n').length <= 9, `${slide.id}: короткий пример кода`);
  }
});

test('реальные инциденты ссылаются на первичные источники', () => {
  for (const [id, href] of [
    ['incident-knight', 'https://www.sec.gov/newsroom/press-releases/2013-222'],
    ['incident-gitlab', 'https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/'],
    ['incident-cloudflare', 'https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/'],
  ]) {
    const incident = slides.find(slide => slide.id === id);
    assert(incident && !incident.code, `${id}: разбор без кода`);
    assert(incident.links.some(([, target]) => target === href), `${id}: первичный источник`);
  }
});

test('снимки примеров доступны локально и имеют текстовые описания', async () => {
  assert(slides.some(slide => slide.examples?.length), 'Снимки примеров сохранены в лекции');
  for (const slide of slides) {
    if (slide.examples?.length > 1) assert(slide.examplesSideBySide, `${slide.id}: снимки видны вместе`);
    for (const { src, alt } of slide.examples || []) {
      assert.match(src, /^\.\/examples\/[a-z-]+\.png$/);
      assert(alt?.trim(), `${slide.id}: описание снимка`);
      const bytes = await readFile(new URL('../public/' + src.slice(2), import.meta.url));
      assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${slide.id}: нужен настоящий PNG`);
    }
  }
});

test('практика и материалы доступны для самостоятельной работы', async () => {
  const resources = slides.find(slide => slide.id === 'resources');
  for (const href of ['./docs/practice.md', '../../packages/testing-lecture/README.md']) {
    assert(resources.links.some(([, target]) => target === href), `${href}: ссылка с материалами`);
  }
  for (const slide of slides) {
    const links = [...(slide.links || []).map(item => item[1]), ...(slide.link ? [slide.link.href] : [])];
    for (const href of links.filter(href => !href.startsWith('https:'))) {
      await access(new URL('../' + (href.startsWith('./docs/') ? './public/' + href.slice(2) : href), import.meta.url));
    }
  }
  for (const file of ['docs/practice.md', 'docs/solution.md', 'docs/prior-knowledge.md', 'docs/sources.md', 'docs/speaker-guide.md', 'README.md', 'shop/index.html']) {
    await access(new URL('../' + (file.startsWith('docs/') ? 'public/' + file : file), import.meta.url));
  }
});
