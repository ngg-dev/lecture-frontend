import { chromium, expect } from '@playwright/test';
import { spawn, spawnSync } from 'node:child_process';
import { on, once } from 'node:events';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { resolve, join, extname } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const output = join(root, 'public/examples');
const temporary = join(root, '.generated/examples');
const baseURL = (process.env.LECTURE_BASE_URL || 'http://127.0.0.1:4192/').replace(/\/?$/, '/');
try {
  const response = await fetch(baseURL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch (error) {
  throw new Error(`Не открыт магазин ${baseURL}. Сначала запустите npm run dev в packages/testing-lecture.`, { cause: error });
}
await mkdir(output, { recursive: true });
await mkdir(temporary, { recursive: true });

function run(binary, args, expectedStatus = 0, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv, NO_COLOR: '1' };
  delete env.FORCE_COLOR;
  const result = spawnSync(process.execPath, [join(root, 'node_modules', binary), ...args], {
    cwd: root, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024,
    env,
  });
  if (result.error) throw result.error;
  if (result.status !== expectedStatus) throw new Error(`${binary}: exit ${result.status}\n${result.stdout}\n${result.stderr}`);
  return result.stdout + result.stderr;
}

// The intentionally broken function lives in a disposable copy. Application files stay intact.
const modelSource = await readFile(join(root, 'src/shop/model.ts'), 'utf8');
await writeFile(join(temporary, 'model.ts'), modelSource.replace("  if (draft.trim() === '') return null;\n", ''));
await writeFile(join(temporary, 'jest-regression.test.ts'), `import { expect, test } from '@jest/globals';
import { parsePrice } from './model';

test('пустая цена отклоняется', () => {
  expect(parsePrice('')).toBe(null);
});
`);
const jestConfig = {
  rootDir: root, testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/.generated/examples/jest-regression.test.ts'],
  transform: { '^.+\\.[jt]sx?$': 'babel-jest' },
};
const red = run('jest/bin/jest.js', ['--config', JSON.stringify(jestConfig), '--runInBand', '--colors=false'], 1);
if (!red.includes('Received: 0') || !red.includes('Expected: null')) throw new Error('Jest упал по неожиданной причине');
await writeFile(join(temporary, 'model.ts'), modelSource);
const repaired = run('jest/bin/jest.js', ['--config', JSON.stringify(jestConfig), '--runInBand', '--colors=false']);
const green = run('jest/bin/jest.js', ['--runInBand', '--verbose', '--colors=false', '--runTestsByPath', 'tests/model.test.ts', 'tests/PriceEditor.test.tsx']);
const playwright = run('@playwright/test/cli.js', ['test', 'e2e/shop.spec.ts', '--reporter=html', '--trace=on', '--output=.generated/examples/playwright-results'], 0, {
  LECTURE_BASE_URL: baseURL, PLAYWRIGHT_HTML_REPORT: join(temporary, 'playwright-report'), PLAYWRIGHT_HTML_OPEN: 'never',
});
await writeFile(join(temporary, 'jest-red.txt'), red);
await writeFile(join(temporary, 'jest-repaired.txt'), repaired);
await writeFile(join(temporary, 'jest-green.txt'), green);
await writeFile(join(temporary, 'playwright.txt'), playwright);

const manifest = [];
function record(file, source, conditions, expected, command) {
  manifest.push({ file, source, conditions, expected, ...(command ? { command } : {}) });
}

async function capturePlaywrightUI(page) {
  const command = ['test', 'e2e/shop.spec.ts', '--ui-host=127.0.0.1', '--ui-port=0', '--output=.generated/examples/playwright-ui-results'];
  const runner = spawn(process.execPath, [join(root, 'node_modules/@playwright/test/cli.js'), ...command], {
    cwd: root, stdio: ['pipe', 'pipe', 'inherit'],
    // Serve the real UI without having the CLI open the default browser.
    env: { ...process.env, LECTURE_BASE_URL: baseURL, PWTEST_UNDER_TEST: '1' },
  });
  const exited = once(runner, 'close');
  const lines = createInterface({ input: runner.stdout });
  try {
    const url = await Promise.race([
      (async () => {
        for await (const [line] of on(lines, 'line', { signal: AbortSignal.timeout(15_000) })) {
          if (line.startsWith('Listening on ')) return line.slice('Listening on '.length);
        }
      })(),
      exited.then(([code]) => { throw new Error(`Playwright UI завершился с кодом ${code}`); }),
    ]);
    await page.goto(url);
    await page.getByRole('button', { name: 'Run all — F5', exact: true }).click();
    await expect(page.getByTestId('status-line')).toContainText('3 passed', { timeout: 15_000 });
    await page.getByRole('treeitem', { name: /сохранённая цена обновляется/ }).click();
    const actions = page.getByRole('tabpanel', { name: 'Actions' });
    const lastCheck = actions.getByText('Expect "toContainText"', { exact: true }).last();
    await lastCheck.click();
    await page.getByRole('tab', { name: 'After', exact: true }).click();
    const snapshot = page.frameLocator('iframe.snapshot-visible');
    await expect(snapshot.getByText('Цена сохранена', { exact: true })).toBeVisible();
    await page.screenshot({ path: join(output, 'playwright-ui.png') });
    record('playwright-ui.png', 'Настоящий Playwright UI Mode', 'Все тесты магазина запущены из интерфейса; выбран сценарий сохранения цены', '3 passed; видны шаги и снимок магазина', `npx playwright ${command.join(' ')}`);
  } finally {
    lines.close();
    runner.kill();
    await exited;
  }
}

const browser = await chromium.launch();
let server;
try {
  const context = await browser.newContext({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  async function capture(file, withCart = false) {
    const card = await page.getByRole('article', { name: 'Стихи Пушкина' }).boundingBox();
    const cart = withCart ? await page.getByRole('region', { name: 'Корзина' }).boundingBox() : null;
    await page.screenshot({ path: join(output, file), clip: {
      x: card.x - 2, y: card.y - 2, width: card.width + 4,
      height: (cart ? cart.y + cart.height - card.y : card.height) + 4,
    } });
  }
  await page.goto(new URL('shop/', baseURL).href);
  await page.getByRole('button', { name: 'В корзину' }).click();
  await expect(page.getByRole('region', { name: 'Корзина' })).toContainText('Стихи Пушкина × 1');
  await expect(page.getByRole('region', { name: 'Корзина' })).toContainText('690 ₽');
  await expect(page.getByLabel('Цена книги')).toHaveText('690 ₽');
  const hidePriceEditor = await page.addStyleTag({ content: 'article[aria-label="Стихи Пушкина"] form { display: none; }' });
  await expect(page.getByRole('textbox', { name: 'Новая цена' })).toBeHidden();
  await capture('shop-overview.png', true);
  await hidePriceEditor.evaluate(style => style.remove());
  record('shop-overview.png', 'shop/ · настоящий React DOM', 'Одна книга добавлена в корзину. Редактор цены скрыт на время съёмки', 'Карточка 690 ₽; корзина 690 ₽');

  await page.getByRole('textbox', { name: 'Новая цена' }).fill('');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Введите неотрицательное число');
  await expect(page.getByLabel('Цена книги')).toHaveText('690 ₽');
  await capture('shop-empty.png');
  record('shop-empty.png', 'shop/ · настоящий React DOM', 'Пустое поле; нажатие «Сохранить»', 'Ошибка валидации, прежняя цена 690 ₽');

  let release;
  let attempts = 0;
  const pending = new Promise(resolve => { release = resolve; });
  await page.route('**/api/books/pushkin-poems', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: { id: 'pushkin-poems', title: 'Стихи Пушкина', price: 690 } });
    } else {
      attempts++;
      if (attempts === 1) {
        await pending;
        await route.fulfill({ status: 500, json: { error: 'demo' } });
      } else {
        await route.fulfill({ json: { id: 'pushkin-poems', title: 'Стихи Пушкина', price: 790 } });
      }
    }
  });
  await page.goto(new URL('shop/?mode=api', baseURL).href);
  await page.getByRole('textbox', { name: 'Новая цена' }).fill('790');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Сохраняем…' })).toBeDisabled();
  await expect(page.getByRole('textbox', { name: 'Новая цена' })).toBeDisabled();
  await expect(page.getByLabel('Цена книги')).toHaveText('690 ₽');
  await expect(page.getByRole('status')).toHaveCount(0);
  await capture('shop-pending.png');
  record('shop-pending.png', 'shop/?mode=api · React DOM + Playwright route', 'PATCH удерживается управляемым Promise; draft 790', '«Сохраняем…» и disabled, цена ещё 690 ₽. Mock API проверяет только фронтенд');
  release();
  await expect(page.getByRole('alert')).toContainText('Не удалось сохранить');
  await expect(page.getByLabel('Цена книги')).toHaveText('690 ₽');
  await expect(page.getByRole('textbox', { name: 'Новая цена' })).toHaveValue('790');
  await expect(page.getByRole('button', { name: 'Сохранить', exact: true })).toBeEnabled();
  await expect(page.getByRole('status')).toHaveCount(0);
  await capture('shop-error.png');
  record('shop-error.png', 'shop/?mode=api · React DOM + Playwright route', 'Первый PATCH отвечает HTTP 500', 'Ошибка, ввод 790 сохранён, цена 690 ₽. Mock API проверяет только фронтенд');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Цена сохранена');
  await expect(page.getByLabel('Цена книги')).toHaveText('790 ₽');
  await expect(page.getByRole('alert')).toHaveCount(0);
  await capture('shop-retry.png');
  record('shop-retry.png', 'shop/?mode=api · React DOM + Playwright route', 'Повторный PATCH отвечает ценой 790', '«Цена сохранена», карточка 790 ₽. Mock API проверяет только фронтенд');

  await page.goto(new URL('shop/', baseURL).href);
  await page.getByRole('button', { name: 'В корзину' }).click({ clickCount: 2 });
  await page.getByRole('textbox', { name: 'Новая цена' }).fill('790');
  await page.getByRole('button', { name: 'Сохранить', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Корзина' })).toContainText('Итого: 1580 ₽');
  await expect(page.getByRole('region', { name: 'Корзина' })).toContainText('Стихи Пушкина × 2');
  await expect(page.getByLabel('Цена книги')).toHaveText('790 ₽');
  await capture('shop-cart.png', true);
  record('shop-cart.png', 'shop/ · настоящий React DOM', 'Две книги; цена изменена на 790', 'Карточка 790 ₽; Стихи Пушкина × 2; итог 1580 ₽');

  const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  async function transcript(file, text, command, description, excerpt = false) {
    // Only presentation chrome is HTML. Every character inside pre comes from the real runner.
    await page.setViewportSize({ width: 1120, height: 1400 });
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>
      *{box-sizing:border-box}body{margin:0;padding:30px;background:#07182a;color:#e8f1fc;font-family:Arial,sans-serif}
      main{border:1px solid #34658a;padding:26px}h1{font-size:23px;margin:0 0 12px;color:#7ed4f6}
      p{font:17px/1.5 ui-monospace,monospace;color:#ffe347;margin:0 0 24px}pre{font:21px/1.45 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;margin:0}
      </style><main><h1>Вывод Jest · реальный запуск${excerpt ? ' · фрагмент' : ''}</h1><p>${escape(command)}</p><pre>${escape(text)}</pre></main>`);
    await page.locator('main').screenshot({ path: join(output, file) });
    record(file, 'stdout + stderr настоящего Jest; HTML отображает текст вывода без вымышленных строк', description, file === 'jest-red.png' ? 'Exit 1, Received: 0 вместо null' : 'Exit 0, все unit и компонентные тесты прошли', command);
  }
  const redExcerpt = red.slice(0, red.indexOf('Received: 0') + 'Received: 0'.length).trim();
  await transcript('jest-red.png', redExcerpt, 'Jest · изолированная копия parsePrice без проверки пустоты', 'Фрагмент настоящего вывода намеренно неуспешного теста временной копии. Полный вывод в .generated/examples/jest-red.txt. Исходник магазина не меняется', true);
  await transcript('jest-green.png', green, 'npx jest --runInBand --verbose --runTestsByPath tests/model.test.ts tests/PriceEditor.test.tsx', 'Текущие unit и компонентные тесты пакета');

  const reportRoot = join(temporary, 'playwright-report');
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const file = resolve(reportRoot, '.' + (pathname === '/' ? '/index.html' : pathname));
      if (!file.startsWith(reportRoot + '/')) { response.writeHead(403); response.end(); return; }
      const data = await readFile(file);
      response.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' })[extname(file)] || 'application/octet-stream');
      response.end(data);
    } catch { response.writeHead(404); response.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  await page.setViewportSize({ width: 1280, height: 760 });
  await page.goto(`http://127.0.0.1:${server.address().port}/`);
  await expect(page.getByText('книга попадает в корзину из настоящего интерфейса', { exact: true })).toBeVisible();
  const firstControl = await page.getByPlaceholder('Search tests').boundingBox();
  const lastTest = await page.getByText('ошибка API не меняет цену; повтор сохраняет её', { exact: true }).boundingBox();
  await page.screenshot({ path: join(output, 'playwright-report.png'), clip: {
    x: firstControl.x - 10, y: firstControl.y - 10, width: 1280 - 2 * (firstControl.x - 10),
    height: lastTest.y + lastTest.height + 45 - (firstControl.y - 10),
  } });
  const reportCommand = 'LECTURE_BASE_URL=' + baseURL + ' npx playwright test e2e/shop.spec.ts --reporter=html --trace=on';
  record('playwright-report.png', 'Настоящий HTML report Playwright', 'e2e/shop.spec.ts в Chromium, включая контролируемый отказ API', '3 passed. Сценарий с mock API проверяет фронтенд, не реальный backend', reportCommand);

  await page.getByText('ошибка API не меняет цену; повтор сохраняет её', { exact: true }).click();
  const traceLink = await page.getByRole('link', { name: 'View Trace', exact: true }).getAttribute('href');
  await page.goto(new URL(traceLink, page.url()).href);
  await page.getByRole('tab', { name: /^Network/ }).click();
  await page.getByRole('searchbox', { name: 'Filter network' }).fill('pushkin-poems');
  const requests = page.getByRole('tabpanel', { name: /^Network/ });
  await expect(requests.getByText('PATCH', { exact: true })).toHaveCount(2);
  await expect(requests.getByText('500', { exact: true })).toBeVisible();
  await expect(requests.getByText('200', { exact: true })).toHaveCount(2);
  await page.screenshot({ path: join(output, 'playwright-trace.png') });
  record('playwright-trace.png', 'Настоящий Playwright Trace Viewer из HTML-отчёта', 'Тест «ошибка API не меняет цену; повтор сохраняет её», вкладка Network', 'Первый PATCH возвращает 500; повторный PATCH возвращает 200. Ответы подменены тестом', reportCommand);

  await capturePlaywrightUI(page);
  await writeFile(join(output, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), baseURL, examples: manifest }, null, 2) + '\n');
  console.log(`Сохранено ${manifest.length} скриншотов в public/examples/.`);
  console.log(green.trim());
  console.log(playwright.trim());
} finally {
  await browser.close();
  if (server) await new Promise(resolve => server.close(resolve));
}
