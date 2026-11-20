// @ts-check
/** @typedef {import('../contracts/book.js').BookDto} BookDto */
/** @param {BookDto} book */
export function label(book) {
  return `${book.title}: ${book.price} ₽`;
}
// Декларация book.d.ts доступна и JS через JSDoc, и TypeScript через import type.
// Это проверка при разработке, не проверка JSON во время выполнения.
