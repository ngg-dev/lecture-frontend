import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, ComponentProps, FormEvent } from 'react';

export type Book = { id: string; title: string; author: string; price: number };
export type BookPreview = Pick<Book, 'id' | 'title' | 'price'>;
export type NewBook = Omit<Book, 'id'>;
export type Cart = Record<string, number>;
interface PriceEditorProps {
  book: Book;
  onSave: (id: string, price: number) => void;
}
function SaveButton(props: ComponentProps<'button'>) {
  return <button {...props} />;
}
export function PriceEditor({ book, onSave }: PriceEditorProps) {
  const [draft, setDraft] = useState(String(book.price));
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setDraft(String(book.price));
  }, [book.id, book.price]);
  function change(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.currentTarget.value);
    setMessage('');
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(draft);
    if (draft.trim() === '' || !Number.isFinite(price) || price < 0) {
      setMessage('Введите конечное неотрицательное число.');
      return;
    }
    onSave(book.id, price);
    setMessage('Цена сохранена локально.');
  }
  return <form className="project-price-form" onSubmit={save} noValidate>
    <h3>{book.title}</h3>
    <label htmlFor="project-price">Новая цена, ₽</label>
    <input id="project-price" ref={inputRef} type="number" value={draft} onChange={change} />
    <div className="demo-actions">
      <SaveButton type="submit">Сохранить цену</SaveButton>
      <button type="button" onClick={() => inputRef.current?.focus()}>Фокус на поле</button>
    </div>
    <p role="status">{message || 'Пустое поле и отрицательная цена не пройдут проверку.'}</p>
  </form>;
}
