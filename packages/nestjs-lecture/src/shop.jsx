import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { initialBooks } from './books.js';
const API = 'http://127.0.0.1:3000';
const money = value => new Intl.NumberFormat('ru-RU').format(value) + ' ₽';
function Shop({ showApi = false }) {
  const [books, setBooks] = useState(initialBooks);
  const [mode, setMode] = useState('local');
  const [category, setCategory] = useState('Все книги');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const [draft, setDraft] = useState('790');
  const [saving, setSaving] = useState(false);
  const [log, setLog] = useState({ request:'Локальная модель', status:'В памяти браузера', body:'Книги подготовлены заранее. NestJS и MongoDB пока не участвуют.' });
  const pending = useRef(false);
  useEffect(() => {
    if (mode !== 'api') return;
    const abort = new AbortController();
    setLoading(true); setError('');
    fetch(`${API}/books`, { signal: abort.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
      if (!Array.isArray(data) || data.some(b => typeof b.id !== 'string' || typeof b.title !== 'string' || typeof b.author !== 'string' || typeof b.category !== 'string' || typeof b.price !== 'number' || !Number.isFinite(b.price) || b.price < 0)) throw new Error('Ответ не соответствует контракту книги');
      if (!abort.signal.aborted) {
        setBooks(data);
        setLog({ request:'GET /books', status:`${response.status} OK · настоящий API`, body:JSON.stringify(data, null, 2) });
      }
    }).catch(e => { if (!abort.signal.aborted) { setError(`Не удалось загрузить каталог. Запустите NestJS и MongoDB. ${e.message}`); setBooks([]); setLog({request:'GET /books',status:'Запрос не выполнен',body:e.message}); } })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [mode, reload]);
  function switchMode() {
    if (saving) return;
    setError('');
    if (mode === 'local') setMode('api');
    else { setMode('local'); setBooks(initialBooks); setLoading(false); setLog({ request:'Локальная модель', status:'В памяти браузера', body:'Переключено на подготовленные данные. Изменения MongoDB не затронуты.' }); }
  }
  async function savePrice(event) {
    event.preventDefault();
    if (pending.current) return;
    const book = books[0]; if (!book) return;
    const price = draft.trim() === '' ? NaN : Number(draft);
    if (!Number.isFinite(price) || price < 0) { setError('Введите конечную неотрицательную цену.'); return; }
    setError(''); pending.current = true; setSaving(true);
    try {
      if (mode === 'api') {
        const response = await fetch(`${API}/books/${book.id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({price}) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
        setBooks(previous => previous.map(b => b.id === book.id ? data : b));
        setLog({request:`PATCH /books/${book.id}`, status:`${response.status} OK · записано через API`, body:JSON.stringify(data,null,2)});
      } else {
        setBooks(previous => previous.map(b => b.id === book.id ? {...b, price} : b));
        setLog({request:`PATCH /books/${book.id} · учебная модель`,status:'Моделируем 200 · без HTTP',body:JSON.stringify({id:book.id,price},null,2)});
      }
    } catch(e) { setError(`Цена не сохранена. ${e.message}`); setLog({request:`PATCH /books/${book.id}`,status:'Изменение не сохранено',body:e.message}); }
    finally { pending.current = false; setSaving(false); }
  }
  const visible = books.filter(b => (category === 'Все книги' || b.category === category) && `${b.title} ${b.author}`.toLowerCase().includes(search.toLowerCase()));
  const selected = books.filter(b => cart[b.id]);
  const count = Object.values(cart).reduce((a,b) => a+b,0);
  const total = selected.reduce((sum,b) => sum+b.price*cart[b.id],0);
  return <div className="shop-demo">
    {showApi && <div className="shop-source"><span>{mode === 'local' ? 'ЛОКАЛЬНАЯ МОДЕЛЬ · БЕЗ СЕРВЕРА' : 'РЕАЛЬНЫЙ NESTJS API · PORT 3000'}</span><button disabled={saving} onClick={switchMode}>{mode === 'local' ? 'Подключить API' : 'Вернуться к модели'}</button></div>}
    <div className="store"><header className="store-header"><strong className="store-brand">полка<span> / </span><small>книги, которые остаются</small></strong><button className="cart-button" onClick={()=>setCartOpen(!cartOpen)} aria-expanded={cartOpen}>Корзина <b>{count}</b></button></header>
      <div className="store-hero"><div><small>ВАША СЛЕДУЮЩАЯ ИСТОРИЯ</small><h3>Хорошие книги.<br/><em>На вашей полке.</em></h3></div><p>Знакомые миры.<br/>Новые открытия.<br/><span>Коллекция классики</span></p></div>
      <div className="store-toolbar"><nav aria-label="Категории книг">{['Все книги','Классика','Проза'].map(c=><button key={c} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</nav><input aria-label="Поиск по названию или автору" placeholder="Название или автор" value={search} onChange={e=>setSearch(e.target.value)}/></div>
      {error && <div className="shop-error" role="alert">{error} {mode==='api' && <button onClick={()=>setReload(x=>x+1)}>Повторить загрузку</button>}</div>}
      {loading ? <p className="shop-empty" role="status">Загружаем книги…</p> : <div className="book-grid">{visible.map((book,i)=>{
        const art=initialBooks.find(b=>b.id===book.id) || initialBooks[i%initialBooks.length];
        return <article className="book" key={book.id}><div className="book-cover" style={{'--book-color':art.color}}><small>{book.author}</small><span>{art.mark}</span><strong>{book.title}</strong><small>ИЗБРАННОЕ / ПОЛКА</small></div><p className="book-author">{book.author}</p><h4>{book.title}</h4><div className="book-bottom"><strong>{money(book.price)}</strong><button aria-label={`Добавить «${book.title}» в корзину`} onClick={()=>setCart(c=>({...c,[book.id]:(c[book.id]||0)+1}))}>+</button></div></article>;
      })}{!visible.length && <p className="shop-empty">Книг не найдено.</p>}</div>}
      {cartOpen && <aside className="cart-panel" aria-label="Корзина"><div><h4>Ваша корзина</h4><button onClick={()=>setCartOpen(false)}>Закрыть</button></div>{selected.length ? selected.map(book=><p key={book.id}><span>{book.title} × {cart[book.id]}</span><button aria-label={`Убрать «${book.title}»`} onClick={()=>setCart(c=>({...c,[book.id]:Math.max(0,c[book.id]-1)}))}>−</button></p>) : <p>Пока пусто. Выберите книгу.</p>}<strong>Итого: {money(total)}</strong><small>Учебная корзина в React. Заказ и оплата не выполняются.</small></aside>}
    </div>
    {showApi && <div className="shop-lab"><form onSubmit={savePrice}><label htmlFor="price-draft">Изменить цену: {books[0]?.title || 'нет книги'}</label><div><input id="price-draft" aria-label="Новая цена" value={draft} onChange={e=>setDraft(e.target.value)} inputMode="decimal"/><button disabled={saving||loading||!books.length}>{saving?'Сохраняем…':'Сохранить цену'}</button></div><small>{mode==='local'?'Изменение в памяти. Reload сбросит его.':'Учебный локальный API без авторизации.'}</small></form><div className="request-preview"><div><code>{log.request}</code><span>{log.status}</span></div><pre>{log.body}</pre></div></div>}
  </div>;
}
export function mountShop(element, options) { createRoot(element).render(<Shop {...options} />); }
