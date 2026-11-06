import { useEffect, useState } from 'react';
import { PriceEditor } from './PriceEditor';
import './shop.css';

export function Shop() {
  const [price, setPrice] = useState(690);
  const [count, setCount] = useState(0);
  const apiMode = new URLSearchParams(location.search).get('mode') === 'api';
  const [ready, setReady] = useState(!apiMode);
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    if (!apiMode) return;
    let active = true;
    fetch('./api/books/pushkin-poems').then(response => {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    }).then(book => { if (active) { setPrice(book.price); setReady(true); } })
      .catch(() => { if (active) setLoadError('Не удалось загрузить книгу'); });
    return () => { active = false; };
  }, [apiMode]);
  async function save(value: number) {
    if (apiMode) {
      const response = await fetch('./api/books/pushkin-poems', {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ price: value }),
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const book = await response.json();
      setPrice(book.price);
    } else setPrice(value);
  }
  if (!ready) return <main className="shop-page">{loadError ? <p role="alert">{loadError}</p> : <p role="status">Загружаем книгу…</p>}</main>;
  return <main className="shop-page">
    <a href="../">← К лекции</a><p className="eyebrow">СКВОЗНОЙ ПРИМЕР / КНИЖНЫЙ МАГАЗИН</p>
    <h1>Проверяем не код. Обещание пользователю.</h1>
    <article aria-label="Стихи Пушкина"><p>АЛЕКСАНДР ПУШКИН</p><h2>Стихи Пушкина</h2>
      <p aria-label="Цена книги">{price} ₽</p>
      <button onClick={() => setCount(value => value + 1)}>В корзину</button>
      <PriceEditor price={price} onSave={save} />
    </article>
    <section aria-label="Корзина"><h2>Корзина</h2>
      {count ? <><p>Стихи Пушкина × {count}</p><p>Итого: {price * count} ₽</p></> : <p>Корзина пуста</p>}
    </section>
    <p>Цена и корзина живут в памяти страницы. Перезагрузка сбрасывает данные. Это локальное демо, не настоящий сервер.</p>
  </main>;
}
