import type { BookDto } from '../contracts/book.js';
export function total(books: BookDto[]): number {
  return books.reduce((sum, book) => sum + book.price, 0);
}
