export function isValidPrice(price) {
  return typeof price === 'number' && Number.isFinite(price) && price >= 0;
}
/** @returns {import('../../../contracts/book.js').BookDto} */
export function toBookDto(book) {
  return { id: String(book._id), title: book.title, author: book.author,
    category: book.category, price: book.price };
}
