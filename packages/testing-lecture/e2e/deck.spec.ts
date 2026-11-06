import { test, expect } from '@playwright/test';

test('парные снимки видны рядом и открываются в полном размере', async ({ page }) => {
  for (const id of ['red', 'e2e-boundary', 'debug']) {
    await page.goto(`./#${id}`);
    const pair = page.locator('.screenshot-pair');
    const images = pair.getByRole('img');
    await expect(images).toHaveCount(2);
    const [left, right] = await images.all();
    for (const image of [left, right]) {
      await expect(image).toBeVisible();
      await expect(image).toHaveJSProperty('complete', true);
      await expect(image).not.toHaveJSProperty('naturalWidth', 0);
    }
    expect((await left.boundingBox())!.x).toBeLessThan((await right.boundingBox())!.x);
    expect((await left.boundingBox())!.y).toBe((await right.boundingBox())!.y);
    await expect(pair.getByRole('link', { name: /^Открыть изображение/ })).toHaveCount(2);
    await expect(pair.locator('figcaption')).toHaveCount(0);
    await expect(page.getByRole('group', { name: 'Выбор снимка примера' })).toHaveCount(0);
  }
});

test('разборы регрессии и отказа читаются последовательными слайдами', async ({ page }) => {
  for (const [before, after] of [['unit-lab', 'unit-lab-fixed'], ['component-lab', 'component-lab-retry']]) {
    await page.goto(`./#${before}`);
    await expect(page.locator('article.slide')).toHaveAttribute('data-slide-id', before);
    await expect(page.locator('article input, article select, article form')).toHaveCount(0);
    await page.getByRole('button', { name: 'Следующий слайд' }).click();
    await expect(page.locator('article.slide')).toHaveAttribute('data-slide-id', after);
    await expect(page.locator('article input, article select, article form')).toHaveCount(0);
    await page.getByRole('button', { name: 'Предыдущий слайд' }).click();
    await expect(page.locator('article.slide')).toHaveAttribute('data-slide-id', before);
  }
  await page.goto('./#unit-lab-fixed');
  await expect(page.getByRole('table')).toBeVisible();
  const comparison = page.getByRole('region', { name: 'Ожидаемые и фактические результаты после исправления' });
  await comparison.focus();
  for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End']) await comparison.press(key);
  await expect(page).toHaveURL(/#unit-lab-fixed$/);
});

test('навигация: стрелки, пробел, границы, оглавление и hash после reload', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('article.slide')).toHaveAttribute('data-slide-id', 'cover');
  await page.locator('body').click({ position: { x: 3, y: 3 } });
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/#working-shop$/);
  await page.keyboard.press('Space');
  await expect(page).toHaveURL(/#regression$/);
  await page.keyboard.press('Home');
  await expect(page).toHaveURL(/#cover$/);
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/#cover$/);
  await page.keyboard.press('End');
  await expect(page).toHaveURL(/#recap$/);
  await expect(page.getByRole('button', { name: 'Следующий слайд' })).toBeDisabled();
  await page.getByRole('button', { name: 'Открыть оглавление' }).click();
  await page.getByRole('dialog').locator('[data-slide-id="aaa"]').click();
  await expect(page).toHaveURL(/#aaa$/);
  await page.reload();
  await expect(page.locator('article.slide')).toHaveAttribute('data-slide-id', 'aaa');
  await page.evaluate(() => { location.hash = 'component-test'; });
  await expect(page.locator('article.slide')).toHaveAttribute('data-slide-id', 'first-e2e');
  await expect(page).toHaveURL(/#first-e2e$/);
  await page.goto('./#green');
  await expect(page.locator('article.slide')).toHaveAttribute('data-slide-id', 'red');
  await expect(page).toHaveURL(/#red$/);
  await page.goto('./#does-not-exist');
  await expect(page.locator('article.slide')).toHaveAttribute('data-slide-id', 'cover');
  await expect(page).toHaveURL(/#cover$/);
});

test('код не перехватывает навигационные клавиши, а источник инцидента доступен', async ({ page }) => {
  await page.goto('./#aaa');
  await expect(page.locator('pre')).toContainText('@jest/globals');
  await page.locator('pre').focus();
  for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Space']) await page.locator('pre').press(key);
  await expect(page).toHaveURL(/#aaa$/);
  await page.goto('./#incident-knight');
  await expect(page.locator('article a[href="https://www.sec.gov/newsroom/press-releases/2013-222"]')).toBeVisible();
});

test('событие клавиатуры на document не вызывает runtime-ошибку', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })));
  await expect(page).toHaveURL(/#working-shop$/);
  expect(errors).toEqual([]);
});

test('47 слайдов без runtime-ошибок и горизонтального выхода на узком экране', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Открыть оглавление' }).click();
  const ids = await page.getByRole('dialog').locator('[data-slide-id]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-slide-id')));
  await page.keyboard.press('Escape');
  expect(ids).toHaveLength(47);
  for (const id of ids) {
    await page.evaluate(id => { location.hash = String(id); }, id);
    await expect(page.locator('article.slide')).toHaveAttribute('data-slide-id', String(id));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    if (id === 'everyday-case') {
      await expect(page.locator('article.slide')).toHaveText('Житейский кейс');
    } else {
      await expect(page.locator('.kicker')).not.toContainText(/\d+\s*мин/i);
    }
    await expect(page.locator('.example-screenshot figcaption')).toHaveCount(0);
    for (const image of await page.locator('article.slide img').all()) {
      await expect(image).toHaveJSProperty('complete', true);
      await expect(image).not.toHaveJSProperty('naturalWidth', 0);
    }
    await expect(page.locator('article input, article select, article form')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), String(id)).toBeTruthy();
    expect(await page.locator('.stage').evaluate(node => node.scrollWidth <= node.clientWidth), String(id)).toBeTruthy();
  }
  expect(errors).toEqual([]);
});
