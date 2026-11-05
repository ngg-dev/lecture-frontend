import { test, expect } from '@playwright/test';

test('навигация: стрелки, пробел, границы, оглавление и hash после reload', async ({ page }) => {
  await page.goto('./');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Unit и e2e');
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
  await page.getByRole('dialog').getByRole('button', { name: /Один тест — три части/ }).click();
  await expect(page).toHaveURL(/#aaa$/);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Один тест — три части');
  await page.evaluate(() => { location.hash = 'component-test'; });
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Кликаем так, как кликает пользователь');
  await page.goto('./#does-not-exist');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Unit и e2e');
  await expect(page).toHaveURL(/#cover$/);
});

test('живые проверки ловят ошибку, исправление проходит; ввод не листает', async ({ page }) => {
  await page.goto('./#unit-lab');
  await page.getByRole('button', { name: 'Запустить проверки' }).click();
  await expect(page.getByRole('status')).toContainText('FAIL');
  await page.getByRole('combobox', { name: 'Реализация' }).selectOption('fixed');
  await page.getByRole('button', { name: 'Запустить проверки' }).click();
  await expect(page.getByRole('status')).toContainText('Все проверки пройдены');
  const input = page.getByRole('textbox', { name: 'Проверить свою цену' });
  await input.fill('790');
  for (const key of ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Space']) await input.press(key);
  await expect(page).toHaveURL(/#unit-lab$/);
  await page.goto('./#component-lab');
  await page.getByRole('textbox', { name: 'Новая цена' }).fill('');
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await expect(page.getByRole('alert')).toContainText('Введите неотрицательное число');
  await expect(page).toHaveURL(/#component-lab$/);
});

test('событие клавиатуры на document не вызывает runtime-ошибку', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await page.evaluate(() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })));
  await expect(page).toHaveURL(/#working-shop$/);
  expect(errors).toEqual([]);
});

test('все слайды без runtime-ошибок и горизонтального выхода на узком экране', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await page.getByRole('button', { name: 'Открыть оглавление' }).click();
  const ids = await page.getByRole('dialog').locator('[data-slide-id]').evaluateAll(nodes => nodes.map(node => node.getAttribute('data-slide-id')));
  await page.keyboard.press('Escape');
  expect(ids.length).toBeGreaterThan(35);
  for (const id of ids) {
    await page.evaluate(id => { location.hash = String(id); }, id);
    await expect(page.locator('article.slide')).toHaveAttribute('data-slide-id', String(id));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), String(id)).toBeTruthy();
    expect(await page.locator('.stage').evaluate(node => node.scrollWidth <= node.clientWidth), String(id)).toBeTruthy();
  }
  expect(errors).toEqual([]);
});
