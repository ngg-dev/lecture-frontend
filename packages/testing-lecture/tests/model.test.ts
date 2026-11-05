import { expect, test } from 'vitest';
import { parsePrice } from '../src/shop/model';

test('цена из поля становится числом', () => {
  // Arrange — входные данные.
  const draft = '790';
  // Act — действие.
  const price = parsePrice(draft);
  // Assert — наблюдаемый результат.
  expect(price).toBe(790);
});

test.each(['', '   ', '-1', 'abc', 'Infinity', 'NaN'])('некорректная цена %j отклоняется', draft => {
  expect(parsePrice(draft)).toBeNull();
});

test.each([['0', 0], [' 790 ', 790], ['12.5', 12.5]])('допустимая цена %j становится %s', (draft, expected) => {
  expect(parsePrice(draft)).toBe(expected);
});
