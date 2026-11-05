import { expect, test, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PriceEditor } from '../src/shop/PriceEditor';

test('пользователь сохраняет новую цену числом', async () => {
  const onSave = jest.fn<(price: number) => Promise<void>>().mockResolvedValue(undefined);
  const user = userEvent.setup();
  render(<PriceEditor price={690} onSave={onSave} />);
  await user.clear(screen.getByRole('textbox', { name: 'Новая цена' }));
  await user.type(screen.getByRole('textbox', { name: 'Новая цена' }), '790');
  await user.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(onSave).toHaveBeenCalledWith(790);
  expect(await screen.findByRole('status')).toHaveTextContent('Цена сохранена');
});

test('пустая цена не отправляется, пользователь видит ошибку', async () => {
  const onSave = jest.fn<(price: number) => Promise<void>>();
  const user = userEvent.setup();
  render(<PriceEditor price={690} onSave={onSave} />);
  await user.clear(screen.getByRole('textbox', { name: 'Новая цена' }));
  await user.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Введите неотрицательное число');
  expect(onSave).not.toHaveBeenCalled();
});

test('ошибка сохранения видна; повторная попытка успешна', async () => {
  const onSave = jest.fn<(price: number) => Promise<void>>().mockRejectedValueOnce(new Error('HTTP 500')).mockResolvedValue(undefined);
  const user = userEvent.setup();
  render(<PriceEditor price={690} onSave={onSave} />);
  await user.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось сохранить');
  await user.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Цена сохранена');
});

test('пока запрос не завершён, повторная отправка недоступна', async () => {
  let finish!: () => void;
  const onSave = jest.fn(() => new Promise<void>(resolve => { finish = resolve; }));
  const user = userEvent.setup();
  render(<PriceEditor price={690} onSave={onSave} />);
  await user.click(screen.getByRole('button', { name: 'Сохранить' }));
  expect(screen.getByRole('button', { name: 'Сохраняем…' })).toBeDisabled();
  finish();
  expect(await screen.findByRole('status')).toHaveTextContent('Цена сохранена');
});
