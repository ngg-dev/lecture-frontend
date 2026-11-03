import { useState } from 'react';
import { PriceEditor } from './PriceEditor';
import type { Book, BookPreview, Cart } from './PriceEditor';

const initialBooks: Book[] = [
  { id: 'b-101', title: 'Солярис', author: 'Станислав Лем', price: 620 },
  { id: 'b-102', title: 'Пикник на обочине', author: 'Стругацкие', price: 540 }
];
type BookCardProps = { book: BookPreview; onAdd: (id: string) => void; onSelect: () => void };
export function BookCard({ book, onAdd, onSelect }: BookCardProps) {
  return <article className="project-book-card">
    <h3>{book.title}</h3><p>{book.price} ₽</p>
    <div className="demo-actions">
      <button onClick={() => onAdd(book.id)}>В корзину: {book.title}</button>
      <button onClick={onSelect}>Изменить: {book.title}</button>
    </div>
  </article>;
}
export function BookCatalog() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [selected, setSelected] = useState<Book | null>(null);
  const [cart, setCart] = useState<Cart>({});
  function add(id: string) {
    setCart(current => ({ ...current, [id]: (current[id] ?? 0) + 1 }));
  }
  function save(id: string, price: number) {
    setBooks(current => current.map(book => book.id === id ? { ...book, price } : book));
    setSelected(current => current?.id === id ? { ...current, price } : current);
  }
  const quantity = Object.values(cart).reduce((sum, count) => sum + count, 0);
  return <section className="project-demo" aria-label="Типизированный книжный магазин">
    <div className="project-catalog">
      {books.map(book => <BookCard key={book.id} book={book} onAdd={add} onSelect={() => setSelected(book)} />)}
      <p className="project-cart" aria-live="polite">В корзине: {quantity}</p>
    </div>
    {selected ? <PriceEditor key={selected.id} book={selected} onSave={save} /> : <div className="project-placeholder">
      <h3>Редактор цены</h3><p>Нажмите «Изменить» у одной из книг.</p>
    </div>}
  </section>;
}
