import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
import { build } from 'esbuild';
import { slides, chapters, sources, totalMinutes } from '../src/content.js';
import { snippets, fullSource } from '../src/examples.js';
import { compileSource } from '../src/compiler.js';
import { snippetDiagnostics } from '../src/snippet-diagnostics.js';
import { examplePairs } from '../src/example-pairs.js';
import { reactSnippets } from '../src/react-examples.js';
import { compileReactExample } from './compile-react-example.mjs';
const allSnippets = { ...snippets, ...reactSnippets };
import { isBook, validateBookJson, goodBook, loadStates } from '../src/model.js';
import { root } from './bundle-options.mjs';

assert.equal(new Set(slides.map(slide => slide.id)).size, slides.length, 'Уникальные ID слайдов');
assert.equal(totalMinutes, 68, 'Основной рассказ – 68 минут плюс резерв на вопросы');
assert.equal(chapters.length, 7);
for (const chapter of chapters) assert(slides.some(slide => slide.chapter === chapter.id));
for (const slide of slides) {
  assert(chapters.some(chapter => chapter.id === slide.chapter), slide.id);
  assert(slide.notes?.length > 40, `Нужны заметки: ${slide.id}`);
  assert(slide.minutes > 0 && slide.minutes <= 5, slide.id);
  for (const source of slide.sources || []) assert(sources[source], `Источник: ${source}`);
  if (slide.code?.snippet) assert.equal(slide.code.text, allSnippets[slide.code.snippet].text);
  for (const column of slide.codeColumns || []) if (column.snippet) assert.equal(column.text, allSnippets[column.snippet].text);
  if (slide.combinedSnippet) assert.equal(slide.codeColumns.map(column => column.text).join('\n\n'), snippets[slide.combinedSnippet].text);
  if (slide.demo) assert(['compiler', 'generic', 'state', 'guard', 'project'].includes(slide.demo));
}
const libraryRoot = resolve(root, 'node_modules/typescript/lib');
const names = (await readdir(libraryRoot)).filter(name => /^lib\..*\.d\.ts$/.test(name));
const libraries = Object.fromEntries(await Promise.all(names.map(async name => ['/' + name, await readFile(resolve(libraryRoot, name), 'utf8')])));
for (const [id, snippet] of Object.entries(snippets)) {
  const result = compileSource(ts, libraries, fullSource(snippet));
  const errors = [...new Set(result.diagnostics.map(item => item.code))].sort();
  assert.deepEqual(errors, [...snippet.errors].sort(), `${id}: ${JSON.stringify(result.diagnostics)}`);
  assert(result.javascript, `Ожидался JS для ${id}`);
  for (const item of snippetDiagnostics(snippet, result)) {
    assert(item.line > 0 && item.line <= snippet.text.split('\n').length, `${id}: строка диагностики вне примера`);
    assert(item.character > 0 && item.character <= snippet.text.split('\n')[item.line - 1].length, `${id}: позиция диагностики вне строки`);
  }
}
for (const [id, snippet] of Object.entries(reactSnippets)) {
  const result = compileReactExample(snippet);
  assert.deepEqual([...new Set(result.diagnostics.map(item => item.code))].sort(), [...snippet.errors].sort(), `${id}: ${JSON.stringify(result.diagnostics)}`);
  for (const item of snippetDiagnostics(snippet, result)) assert(item.line > 0 && item.line <= snippet.text.split('\n').length, `${id}: строка диагностики вне JSX-примера`);
}
for (const [id, pair] of Object.entries(examplePairs)) {
  assert.equal(allSnippets[pair.valid].errors.length, 0, `${id}: рабочий вариант должен проходить проверку`);
  const index = slides.findIndex(slide => slide.code?.snippet === id);
  if (index >= 0 && !slides[index].combineCases) assert(index > 0 && slides[index - 1].code?.snippet === pair.valid, `${id}: рабочий вариант должен предшествовать ошибке`);
}
const runAssertion = id => new Function(ts.transpile(snippets[id].text, { target: ts.ScriptTarget.ES2022 }))();
assert.doesNotThrow(() => runAssertion('assertionFixed'));
assert.throws(() => runAssertion('assertion'), TypeError);
const wrong = compileSource(ts, libraries, snippets.price.text, true);
assert(wrong.emitSkipped && !wrong.javascript);
const fixed = compileSource(ts, libraries, snippets.priceFixed.text, true);
assert.equal(fixed.diagnostics.length, 0);
assert(fixed.javascript.includes('addDelivery(690)'));
assert(!fixed.javascript.includes(': number'), 'Аннотации должны стираться');
const genericWrong = compileSource(ts, libraries, snippets.generic.text + '\nprice?.title;');
assert(genericWrong.diagnostics.some(item => item.code === 2339));
const newStatus = compileSource(ts, libraries, snippets.never.text.replace('"loading" |', '"idle" | "loading" |'));
assert(newStatus.diagnostics.some(item => item.code === 2322), 'never должен ловить пропущенный вариант');
assert(isBook(goodBook));
for (const invalid of [null, [], {}, { ...goodBook, price: '620' }, { ...goodBook, price: -1 }, { ...goodBook, price: Infinity }, { ...goodBook, price: NaN }, { ...goodBook, id: 101 }]) assert.equal(isBook(invalid), false);
assert(validateBookJson(JSON.stringify(goodBook)).ok);
assert(!validateBookJson('{').ok);
assert(!validateBookJson('null').ok);
assert.equal(loadStates.empty.status, 'success');
assert.equal(loadStates.empty.books.length, 0);
assert(!('books' in loadStates.error));
// Verify that the guard shown on the slide behaves like the actual demo.
const guardJs = ts.transpile(snippets.isBook.text + '\nreturn isBook;', { target: ts.ScriptTarget.ES2022 });
const slideGuard = new Function(guardJs)();
for (const value of [goodBook, null, {}, { ...goodBook, price: '620' }, { ...goodBook, price: -2 }]) assert.equal(slideGuard(value), isBook(value));
execFileSync(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '-p', 'examples/tsconfig.json'], { cwd: root, stdio: 'inherit' });
execFileSync(process.execPath, [resolve(root, 'node_modules/typescript/bin/tsc'), '-p', 'examples/standalone/tsconfig.json'], { cwd: root, stdio: 'inherit' });
const output = execFileSync(process.execPath, ['examples/standalone/dist/shop.js'], { cwd: root, encoding: 'utf8' });
assert.equal(output.trim(), '790');
for (const file of ['src/main.jsx', 'src/Demos.jsx']) await build({ entryPoints: [resolve(root, file)], write: false, bundle: false, loader: { '.jsx': 'jsx' } });
for (const file of ['docs/prior-knowledge.md', 'docs/practice.md', 'docs/sources.md']) await access(resolve(root, file));
console.log(`Проверено: слайдов ${slides.length}, ${totalMinutes} минут, TS-примеров ${Object.keys(snippets).length}, React-примеров ${Object.keys(reactSnippets).length}; диагностика, emit, React TSX и запуск JS.`);
