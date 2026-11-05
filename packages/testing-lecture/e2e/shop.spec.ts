import { test, expect } from '@playwright/test';

test('книга попадает в корзину из настоящего интерфейса', async ({ page }) => {
  await page.goto('shop/');
  const book = page.getByRole('article', { name: 'Солярис' });
  await book.getByRole('button', { name: 'В корзину' }).click();
  await expect(page.getByRole('region', { name: 'Корзина' })).toContainText('Солярис × 1');
  await expect(page.getByRole('region', { name: 'Корзина' })).toContainText('690 ₽');
});

test('ошибка API не меняет цену; повтор сохраняет её', async ({ page }) => {
  let attempts = 0;
  await page.route('**/api/books/solaris', async route => {
    if (route.request().method() === 'GET') {
      await route.fulfill({ json: { id: 'solaris', title: 'Солярис', price: 690 } });
    } else {
      attempts++;
      await route.fulfill(attempts === 1 ? { status: 500, json: { error: 'demo' } } : { json: { id: 'solaris', title: 'Солярис', price: 790 } });
    }
  });
  await page.goto('shop/?mode=api');
  await page.getByRole('textbox', { name: 'Новая цена' }).fill('790');
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await expect(page.getByRole('alert')).toContainText('Не удалось сохранить');
  await expect(page.getByLabel('Цена книги')).toHaveText('690 ₽');
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await expect(page.getByLabel('Цена книги')).toHaveText('790 ₽');
  expect(attempts).toBe(2);
});
