import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { bundleOptions } from './bundle-options.mjs';
import { slides, chapters } from '../src/content.js';
import { codeFlows } from '../src/code-flows.js';
import { createDemoEnvironment, cartSlice, added, removed, selectCount } from '../src/model.js';

const root = resolve(import.meta.dirname, '..');
const chapterIds = new Set(chapters.map(chapter => chapter.id));
assert.equal(new Set(slides.map(slide => slide.id)).size, slides.length, 'Повторяющийся ID слайда');
const demos = new Set(['baseline', 'preview', 'route', 'local', 'store', 'manual', 'cache', 'mutation', 'full', 'alternative']);
for (const slide of slides) {
  assert(chapterIds.has(slide.chapter), `Нет главы для ${slide.id}`);
  assert(slide.title && slide.lead && slide.notes, `Не хватает содержания: ${slide.id}`);
  assert(Number.isFinite(slide.minutes) && slide.minutes > 0, `Нет ориентира времени: ${slide.id}`);
  if (slide.demo) assert(demos.has(slide.demo), `Неизвестная демонстрация: ${slide.id}`);
  for (const source of slide.sources || []) assert.equal(new URL(source).protocol, 'https:');
}
await build({ ...bundleOptions, write: false, logLevel: 'silent' });
for (const [id, flow] of Object.entries(codeFlows)) {
  const slide = slides.find(slide => slide.id === id);
  assert(slide?.code, `Нет кода для схемы ${id}`);
  assert(flow.steps.length > 1, `Неполная схема ${id}`);
  for (const step of flow.steps) {
    assert(step.label && step.value && step.detail, `Неполный шаг схемы ${id}`);
    for (const match of step.matches) assert(slide.code.text.includes(match), `Подсветка ${id} потеряла строку: ${match}`);
  }
}
const lab = await readFile(resolve(root, 'Лабораторная работа 6.md'), 'utf8');
for (const grade of ['Удовлетворительно — 3', 'Хорошо — 4', 'Отлично — 5']) assert(lab.includes(grade));

// Model tests exercise user-visible behavior, not implementation snapshots.
const oldState = { quantities: { 'b-101': 1 } };
const nextState = cartSlice.reducer(oldState, added('b-101'));
assert.equal(oldState.quantities['b-101'], 1, 'Предыдущее состояние мутировало');
assert.equal(nextState.quantities['b-101'], 2);
assert.equal(selectCount({ cart: nextState }), 2);
assert.deepEqual(cartSlice.reducer(nextState, removed('b-101')).quantities, {});
const env = createDemoEnvironment({ delay: 1 });
const { store, api, server } = env;
const waitFor = async predicate => {
  const until = Date.now() + 3000;
  while (!predicate()) { assert(Date.now() < until, 'Ожидание обновления кеша истекло'); await new Promise(resolve => setTimeout(resolve, 10)); }
};
try {
  const first = store.dispatch(api.endpoints.getBooks.initiate());
  const result = await first;
  assert.equal(result.data.length, 3);
  const second = store.dispatch(api.endpoints.getBooks.initiate());
  await second;
  assert.equal(server.getSnapshot().requests, 1, 'Одинаковые подписки продублировали HTTP');
  const details = store.dispatch(api.endpoints.getBook.initiate('b-101'));
  await details;
  assert.equal(server.getSnapshot().requests, 2, 'Отдельные аргументы не создали отдельный запрос');
  store.dispatch(added('b-101'));
  const mutation = store.dispatch(api.endpoints.updateBook.initiate({ id: 'b-101', price: 790 }));
  await mutation.unwrap();
  await waitFor(() => api.endpoints.getBooks.select()(store.getState()).data?.[0].price === 790 && api.endpoints.getBook.select('b-101')(store.getState()).data?.price === 790);
  assert.equal(selectCount(store.getState()), 1, 'Обновление API повредило корзину');
  assert.equal(server.getSnapshot().requests, 5, 'Не обновились обе активные записи кеша');
  server.fail();
  const failed = store.dispatch(api.endpoints.updateBook.initiate({ id: 'b-101', price: 890 }));
  await assert.rejects(failed.unwrap());
  assert.equal(server.getSnapshot().books[0].price, 790, 'Ошибка изменила серверные данные');
  const retry = store.dispatch(api.endpoints.updateBook.initiate({ id: 'b-101', price: 890 }));
  await retry.unwrap();
  await waitFor(() => api.endpoints.getBooks.select()(store.getState()).data?.[0].price === 890 && api.endpoints.getBook.select('b-101')(store.getState()).data?.price === 890);
  const invalid = store.dispatch(api.endpoints.updateBook.initiate({ id: 'b-101', price: -1 }));
  await assert.rejects(invalid.unwrap());
  assert.equal(server.getSnapshot().books[0].price, 890);
  const missing = store.dispatch(api.endpoints.getBook.initiate('missing'));
  const missingResult = await missing;
  assert.equal(missingResult.error.status, 404);
  first.unsubscribe(); second.unsubscribe(); details.unsubscribe(); missing.unsubscribe();
  mutation.reset(); failed.reset(); retry.reset(); invalid.reset();
} finally { env.dispose(); }
console.log(`Проверено: ${slides.length} слайда, JSX, критерии лабораторной, корзина, общий кеш, invalidation списка и деталей, ошибка и повтор.`);
console.log(`Ориентир: ${slides.filter(s => s.chapter !== 'extra').reduce((sum, s) => sum + s.minutes, 0)} мин + ${slides.filter(s => s.chapter === 'extra').reduce((sum, s) => sum + s.minutes, 0)} мин дополнения. Тайминг не является жёстким ограничением.`);
