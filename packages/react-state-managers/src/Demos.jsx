import React, { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { MemoryRouter, Routes, Route, Link, NavLink, Outlet, useParams, useLocation, useNavigate } from 'react-router';
import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { initialBooks, createDemoEnvironment, createServerModel, added, removed, selectCount } from './model.js';

const Environment = createContext(null);
const useEnvironment = () => useContext(Environment);
const money = value => `${value.toLocaleString('ru-RU')} ₽`;
function useServer(server) { return useSyncExternalStore(server.subscribe, server.getSnapshot); }
function BookCover({ book, small = false }) {
  return <div className={`book-cover ${small ? 'small' : ''}`} style={{ '--book-color': book.color || '#3d5796' }} aria-hidden="true"><span>БИБЛИОТЕКА</span><strong>{book.title}</strong><i>{book.author}</i></div>;
}
function BookCard({ book, onAdd, linked = true }) {
  return <article className="book-card"><BookCover book={book} /><div className="book-information">{linked ? <Link to={`/books/${book.id}`} className="book-title">{book.title}</Link> : <strong className="book-title">{book.title}</strong>}<p>{book.author}</p><strong className="price">{money(book.price)}</strong><button className="small-button" onClick={() => onAdd(book.id)} aria-label={`В корзину: ${book.title}`}>+ В корзину</button></div></article>;
}
function AddressBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { server } = useEnvironment();
  useEffect(() => { server.event(`URL → ${location.pathname}`); }, [location.pathname, server]);
  return <div className="address-bar"><button aria-label="Назад внутри магазина" onClick={() => navigate(-1)}>←</button><button aria-label="Вперёд внутри магазина" onClick={() => navigate(1)}>→</button><code>bookshop.local{location.pathname}</code><span className="mini-label">учебный адрес</span></div>;
}
function Status({ query, children }) {
  if (query.isLoading || query.isPending) return <div className="shop-message" role="status"><span className="loading-dot" /> Загружаем книги…</div>;
  if (query.isError && !query.data) return <div className="shop-message error" role="alert"><strong>Не удалось загрузить книги</strong><button className="small-button" onClick={() => query.refetch()}>Повторить запрос</button></div>;
  return <>{query.isFetching && <p className="fetching" role="status">Обновляем в фоне. Прежние данные остаются видны.</p>}{query.isError && <p className="error" role="alert">Обновление не удалось. Показаны прежние данные.</p>}{children}</>;
}
function StaticCatalog({ local = false }) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(0);
  return <><h3>Каталог книг</h3>{local && <div className="local-counter" aria-live="polite">Локальный счётчик Catalog: {count}</div>}<div className="books-grid">{initialBooks.map(book => <BookCard key={book.id} book={book} onAdd={id => local ? setCount(value => value + 1) : dispatch(added(id))} />)}</div></>;
}
function Catalog() {
  const { api } = useEnvironment();
  const query = api.useGetBooksQuery();
  const dispatch = useDispatch();
  return <><div className="shop-title"><h3>Каталог книг</h3><button onClick={query.refetch} disabled={query.isFetching} className="text-button">Обновить</button></div><Status query={query}>{query.data?.length ? <div className="books-grid">{query.data.map(book => <BookCard key={book.id} book={book} onAdd={id => dispatch(added(id))} />)}</div> : <p>В каталоге пока нет книг.</p>}</Status></>;
}
function StaticBook() {
  const { bookId } = useParams();
  const { mode } = useEnvironment();
  const book = initialBooks.find(item => item.id === bookId);
  const dispatch = useDispatch();
  return book ? <BookDetails book={book} onAdd={mode === 'local' ? undefined : () => dispatch(added(book.id))} /> : <p>Такой книги нет.</p>;
}
function BookDetails({ book, onAdd, children }) {
  return <><Link to="/" className="text-button">← В каталог</Link><div className="book-detail"><BookCover book={book} /><div><span className="mini-label">Книга / {book.id}</span><h3>{book.title}</h3><p>{book.author}</p><strong className="price">{money(book.price)}</strong><p className="description">Знакомая книга — теперь у неё есть отдельная страница и адрес.</p>{onAdd && <button className="small-button" onClick={onAdd}>+ В корзину</button>}{children}</div></div></>;
}
function BookPage() {
  const { api, mode } = useEnvironment();
  const { bookId } = useParams();
  const query = api.useGetBookQuery(bookId);
  const dispatch = useDispatch();
  return <Status query={query}>{query.data && <BookDetails book={query.data} onAdd={() => dispatch(added(query.data.id))}>{['mutation', 'full', 'preview'].includes(mode) ? <PriceEditor book={query.data} /> : null}</BookDetails>}</Status>;
}
function PriceEditor({ book }) {
  const { api } = useEnvironment();
  const [price, setPrice] = useState(String(book.price));
  const [updateBook, result] = api.useUpdateBookMutation();
  const [message, setMessage] = useState('');
  useEffect(() => setPrice(String(book.price)), [book.price]);
  const valid = price.trim() !== '' && Number.isFinite(Number(price)) && Number(price) >= 0;
  const save = async event => {
    event.preventDefault();
    if (!valid) return;
    setMessage('');
    try { await updateBook({ id: book.id, price: Number(price) }).unwrap(); setMessage('Цена сохранена. Подписанные запросы обновляют данные.'); }
    catch { setMessage('Сохранить не удалось. Попробуйте ещё раз.'); }
  };
  return <form className="price-editor" onSubmit={save}><span className="mini-label">Учебный режим владельца</span><label>Новая цена, ₽<input type="number" min="0" step="1" value={price} onChange={event => setPrice(event.target.value)} /></label><button className="small-button" disabled={!valid || result.isLoading}>{result.isLoading ? 'Сохраняем…' : 'Сохранить цену'}</button><p role="status">{message}</p></form>;
}
function Cart({ books }) {
  const quantities = useSelector(state => state.cart.quantities);
  const dispatch = useDispatch();
  const items = books.filter(book => quantities[book.id]);
  const total = items.reduce((sum, book) => sum + book.price * quantities[book.id], 0);
  return <><h3>Ваша корзина</h3>{items.length ? <><div className="cart-lines">{items.map(book => <div className="cart-line" key={book.id}><span>{book.title}<small>{quantities[book.id]} × {money(book.price)}</small></span><button className="text-button" onClick={() => dispatch(removed(book.id))} aria-label={`Убрать: ${book.title}`}>Убрать</button></div>)}</div><strong className="cart-total">Итого: {money(total)}</strong><p className="mini-note">Количество берём из cart, текущую цену — из каталога.</p></> : <div className="shop-message">Корзина пуста. <Link to="/">Выбрать книгу →</Link></div>}</>;
}
function ApiCart() {
  const { api } = useEnvironment();
  const query = api.useGetBooksQuery();
  return <Status query={query}><Cart books={query.data || []} /></Status>;
}
function SecondSubscriber() {
  const { api } = useEnvironment();
  const query = api.useGetBooksQuery();
  return <div className="second-subscriber">Вторая подписка: <strong>{query.isLoading ? 'ожидание' : `${query.data?.length || 0} книги`}</strong> · тот же getBooks(undefined)</div>;
}
function ShopLayout({ local }) {
  const count = useSelector(selectCount);
  return <><header className="shop-header"><strong>Книжный магазин<span>тот самый, из прошлой лекции</span></strong><nav aria-label="Навигация магазина"><NavLink end to="/">Каталог</NavLink><NavLink to="/cart">Корзина <b aria-label="Количество книг в корзине">{local ? 0 : count}</b></NavLink></nav></header><div className="shop-content"><Outlet /></div></>;
}
function MissionPanel({ requests, baseline = false }) {
  return <aside className="mission-panel" aria-label={baseline ? 'Что уже работает' : 'Задание на лекцию'}><span className="mini-label">{baseline ? 'НАША ОТПРАВНАЯ ТОЧКА' : 'ПРОВЕРИМ РЕЗУЛЬТАТ КЛИКАМИ'}</span><h3>{baseline ? 'Каталог из React-API' : 'Доработать этот магазин'}</h3>{baseline ? <ol><li><strong>Загрузить книги</strong><span>API → список → знакомые карточки.</span></li><li><strong>Добавить в корзину</strong><span>Callback меняет счётчик в общем родителе.</span></li><li><strong>Обновить каталог</strong><span>useBooks управляет загрузкой и повтором.</span></li></ol> : <ol><li><strong>Открыть отдельную книгу</strong><span>Нажмите на название: у книги свой адрес.</span></li><li><strong>Сохранить выбор при переходах</strong><span>Добавьте книгу → откройте корзину.</span></li><li><strong>Повторно использовать и обновлять данные</strong><span>Вернитесь в каталог: лишнего GET нет. В книге сохраните цену 790 ₽ → проверьте список.</span></li></ol>}<p className="mission-requests" aria-live="polite">Запросов к учебному API: <b>{requests}</b></p></aside>;
}
function BaselineShop() {
  const [server] = useState(() => createServerModel());
  const snapshot = useServer(server);
  const [count, setCount] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ status: 'loading', books: [] });
  useEffect(() => () => server.dispose(), [server]);
  useEffect(() => {
    const controller = new AbortController();
    setResult({ status: 'loading', books: [] });
    server.fetch('https://books.example/api/books', { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error('HTTP ' + response.status); return response.json(); })
      .then(data => setResult({ status: 'success', books: data.books }))
      .catch(() => { if (!controller.signal.aborted) setResult({ status: 'error', books: [] }); });
    return () => controller.abort();
  }, [server, attempt]);
  return <div className="demo-grid"><div className="shop-window"><div className="address-bar"><code>bookshop.local/</code><span className="mini-label">один экран</span></div><header className="shop-header"><strong>Книжный магазин<span>знакомая версия после React-API</span></strong><span className="baseline-count" aria-live="polite">В корзине: <b>{count}</b></span></header><div className="shop-content"><div className="shop-title"><h3>Каталог книг</h3><button className="text-button" disabled={result.status === 'loading'} onClick={() => setAttempt(value => value + 1)}>Обновить</button></div>{result.status === 'loading' ? <p className="shop-message" role="status">Загружаем книги…</p> : result.status === 'error' ? <div className="shop-message" role="alert">Не удалось загрузить книги. <button onClick={() => setAttempt(value => value + 1)}>Повторить</button></div> : result.books.length ? <div className="books-grid">{result.books.map(book => <BookCard key={book.id} book={book} linked={false} onAdd={() => setCount(value => value + 1)} />)}</div> : <p>В каталоге пока нет книг.</p>}</div></div><MissionPanel baseline requests={snapshot.requests} /></div>;
}
function Inspector() {
  const { server, mode, api } = useEnvironment();
  const snapshot = useServer(server);
  const quantities = useSelector(state => state.cart.quantities);
  const queries = useSelector(state => state[api.reducerPath].queries);
  if (mode === 'preview') return <MissionPanel requests={snapshot.requests} />;
  const usesApi = ['cache', 'mutation', 'full', 'preview'].includes(mode);
  return <aside className="inspector" aria-label="Состояние и запросы"><div className="inspector-header"><span>ЧТО ПРОИСХОДИТ</span>{usesApi && <strong aria-label="Счётчик запросов">Запросов: {snapshot.requests}</strong>}</div>{mode === 'route' ? <div className="state-readout"><span className="mini-label">React Router / путь к экрану</span><p>Название книги открывает её страницу. Адрес содержит id. Стрелки возвращают по истории магазина.</p></div> : mode === 'local' ? <div className="state-readout"><span className="mini-label">React / локальный useState</span><p>Количество принадлежит Catalog. Когда компонент уходит с экрана, его состояние теряется.</p></div> : <div className="state-readout"><span className="mini-label">Redux / cart.quantities</span><pre>{JSON.stringify(quantities, null, 2)}</pre></div>}{usesApi && <div className="cache-readout"><span className="mini-label">RTK Query / ключи кеша</span>{Object.entries(queries).map(([key, query]) => <div className="cache-entry" key={key}><code>{key}</code><span>{query.status}</span></div>)}{!Object.keys(queries).length && <p>Кеш пуст</p>}</div>}<ol className="event-log" aria-live="polite">{snapshot.events.slice(0, 7).map(event => <li key={event.id} className={event.kind}>{event.message}</li>)}</ol></aside>;
}
function ShopDemoInner({ mode }) {
  const [env] = useState(() => ({ ...createDemoEnvironment(), mode }));
  const snapshot = useServer(env.server);
  const [second, setSecond] = useState(false);
  useEffect(() => () => env.dispose(), [env]);
  const usesApi = ['cache', 'mutation', 'full', 'preview'].includes(mode);
  return <Environment.Provider value={env}><Provider store={env.store}><div className="demo-controls" hidden={mode === 'preview'}>{usesApi ? <><button className="small-button ghost" onClick={env.server.fail} disabled={snapshot.failNext}>{snapshot.failNext ? 'Следующий запрос вернёт 500' : 'Ошибка следующего запроса'}</button><label className="check-label"><input type="checkbox" checked={snapshot.delay === 2200} onChange={event => env.server.setDelay(event.target.checked ? 2200 : 650)} /> Медленный ответ</label>{mode === 'cache' && <label className="check-label"><input type="checkbox" checked={second} onChange={event => setSecond(event.target.checked)} /> Второй подписчик</label>}</> : <span>{mode === 'local' ? 'Добавьте книгу → откройте страницу книги → вернитесь в каталог.' : 'Откройте книгу, добавьте её в корзину и перейдите в корзину.'}</span>}</div><div className="demo-grid"><div className="shop-window"><MemoryRouter initialEntries={[mode === 'mutation' ? '/books/b-101' : '/']}><AddressBar /><Routes><Route element={<ShopLayout local={mode === 'local'} />}><Route index element={usesApi ? <Catalog /> : <StaticCatalog local={mode === 'local'} />} /><Route path="books/:bookId" element={usesApi ? <BookPage /> : <StaticBook />} /><Route path="cart" element={usesApi ? <ApiCart /> : <Cart books={initialBooks} />} /><Route path="*" element={<p>Страница не найдена. <Link to="/">В каталог</Link></p>} /></Route></Routes>{second && <SecondSubscriber />}</MemoryRouter></div><Inspector /></div></Provider></Environment.Provider>;
}

function ManualPanel({ server, name }) {
  const [books, setBooks] = useState(null);
  useEffect(() => {
    const controller = new AbortController();
    server.fetch('https://books.example/api/books', { signal: controller.signal }).then(res => res.json()).then(data => setBooks(data.books)).catch(() => {});
    return () => controller.abort();
  }, [server]);
  return <div className="subscriber-card"><span className="mini-label">{name}</span><h3>{books ? `${books.length} книги` : 'Загрузка…'}</h3><code>const books = useBooks();</code></div>;
}
function ManualDemo() {
  const [server] = useState(() => createServerModel());
  const snapshot = useServer(server);
  const [second, setSecond] = useState(false);
  useEffect(() => () => server.dispose(), [server]);
  return <><div className="demo-controls"><button className="small-button" onClick={() => setSecond(!second)}>{second ? 'Убрать второй компонент' : 'Добавить второй компонент'}</button><span className="request-count">Запросов: {snapshot.requests}</span></div><div className="subscriber-grid"><ManualPanel server={server} name="Каталог" />{second ? <ManualPanel server={server} name="Витрина" /> : <div className="subscriber-placeholder">Ещё один компонент с тем же useBooks</div>}</div><p className="demo-caption">Учебный useBooks хранит свой useState и делает запрос при монтировании. Общего кеша пока нет.</p></>;
}

const Alternative = createContext(null);
function AlternativeApp() {
  const { server, cart } = useContext(Alternative);
  const navigate = useNavigate();
  const location = useLocation();
  const quantities = useStore(cart, state => state.quantities);
  const add = useStore(cart, state => state.add);
  const remove = useStore(cart, state => state.remove);
  const client = useQueryClient();
  const query = useQuery({ queryKey: ['books'], queryFn: async ({ signal }) => {
    const response = await server.fetch('https://books.example/api/books', { signal });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return (await response.json()).books;
  }, staleTime: 60_000, retry: false, refetchOnWindowFocus: false });
  const mutation = useMutation({ mutationFn: async price => {
    const response = await server.fetch('https://books.example/api/books/b-101', { method: 'PATCH', body: JSON.stringify({ price }), headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error('Не удалось сохранить');
    return response.json();
  }, onSuccess: () => client.invalidateQueries({ queryKey: ['books'] }) });
  const count = Object.values(quantities).reduce((sum, item) => sum + item, 0);
  const books = query.data || [];
  return <><div className="address-bar"><button onClick={() => navigate(-1)} aria-label="Назад внутри примера">←</button><code>bookshop.local{location.pathname}</code></div><header className="shop-header"><strong>Тот же магазин<span>Zustand + TanStack Query</span></strong><nav><Link to="/">Каталог</Link><Link to="/cart">Корзина <b>{count}</b></Link></nav></header><div className="shop-content"><Status query={query}><Routes><Route index element={<div className="books-grid">{books.map(book => <BookCard key={book.id} book={book} onAdd={add} />)}</div>} /><Route path="books/:bookId" element={<AlternativeBook books={books} onAdd={add} />} /><Route path="cart" element={<><h3>Ваша корзина</h3>{count ? books.filter(book => quantities[book.id]).map(book => <div key={book.id} className="cart-line"><span>{book.title} × {quantities[book.id]}</span><button className="text-button" onClick={() => remove(book.id)}>Убрать</button></div>) : <p>Корзина пуста</p>}</>} /></Routes></Status><div className="alternative-action"><button className="small-button" disabled={mutation.isPending || !books.length} onClick={() => mutation.mutate((books[0]?.price || 690) + 100)}>Изменить цену первой книги +100 ₽</button><span role="status">{mutation.isError ? 'Не удалось сохранить' : mutation.isPending ? 'Сохраняем…' : 'После сохранения обновляется query с ключом books.'}</span></div></div></>;
}
function AlternativeBook({ books, onAdd }) {
  const { bookId } = useParams();
  const book = books.find(item => item.id === bookId);
  return book ? <BookDetails book={book} onAdd={() => onAdd(book.id)} /> : <p>Книга не найдена</p>;
}
function AlternativeDemo() {
  const [env] = useState(() => ({
    server: createServerModel(),
    client: new QueryClient(),
    cart: createStore(set => ({ quantities: {}, add: id => set(state => ({ quantities: { ...state.quantities, [id]: (state.quantities[id] || 0) + 1 } })), remove: id => set(state => ({ quantities: Object.fromEntries(Object.entries(state.quantities).filter(([key]) => key !== id)) })) }))
  }));
  const snapshot = useServer(env.server);
  const quantities = useStore(env.cart, state => state.quantities);
  useEffect(() => () => { env.server.dispose(); env.client.clear(); }, [env]);
  return <Alternative.Provider value={env}><QueryClientProvider client={env.client}><div className="demo-grid"><div className="shop-window"><MemoryRouter><AlternativeApp /></MemoryRouter></div><aside className="inspector"><div className="inspector-header"><span>ДРУГАЯ РЕАЛИЗАЦИЯ</span><strong>Запросов: {snapshot.requests}</strong></div><span className="mini-label">Zustand / quantities</span><pre>{JSON.stringify(quantities, null, 2)}</pre><span className="mini-label">TanStack Query / queryKey</span><pre>["books"]</pre><ol className="event-log">{snapshot.events.slice(0, 6).map(event => <li key={event.id} className={event.kind}>{event.message}</li>)}</ol></aside></div></QueryClientProvider></Alternative.Provider>;
}
export function Demo({ mode }) {
  const [revision, setRevision] = useState(0);
  return <section className="demo-slot" aria-label="Интерактивная демонстрация"><div className="demo-top"><span className="mini-label">ПОПРОБУЙТЕ В МАГАЗИНЕ</span><button className="text-button" onClick={() => setRevision(value => value + 1)}>↻ Сбросить демо</button></div>{mode === 'baseline' ? <BaselineShop key={revision} /> : mode === 'manual' ? <ManualDemo key={revision} /> : mode === 'alternative' ? <AlternativeDemo key={revision} /> : <ShopDemoInner mode={mode} key={revision} />}<p className="demo-caption">{mode === 'manual' ? 'Учебная модель запросов.' : 'Работающие React-компоненты и библиотеки.'} API и задержка моделируются локально; обращения к внешнему серверу нет. При возврате на слайд демо начинается заново.</p></section>;
}
