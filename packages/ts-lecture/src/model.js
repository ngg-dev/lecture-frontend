export const goodBook = { id: 'b-101', title: 'Солярис', price: 620 };
export function isBook(value) {
  return typeof value === 'object' && value !== null
    && 'id' in value && typeof value.id === 'string'
    && 'title' in value && typeof value.title === 'string'
    && 'price' in value && typeof value.price === 'number'
    && Number.isFinite(value.price) && value.price >= 0;
}
export function validateBookJson(text) {
  let value;
  try { value = JSON.parse(text); }
  catch { return { ok: false, message: 'Не удалось прочитать JSON. Проверьте кавычки и запятые.' }; }
  if (!isBook(value)) return { ok: false, message: 'isBook → false. Нужны id и title – строки, price – конечное неотрицательное число.' };
  return { ok: true, value, message: 'isBook → true. Теперь можно безопасно обратиться к price.' };
}
export const loadStates = {
  loading: { status: 'loading' },
  error: { status: 'error', message: 'Не удалось загрузить каталог' },
  empty: { status: 'success', books: [] },
  success: { status: 'success', books: [goodBook] }
};
