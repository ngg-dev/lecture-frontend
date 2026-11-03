import { configureStore, createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const initialBooks = [
  { id: 'b-101', title: 'Мастер и Маргарита', author: 'Михаил Булгаков', price: 690, color: '#41624d' },
  { id: 'b-102', title: 'Пикник на обочине', author: 'Аркадий и Борис Стругацкие', price: 540, color: '#bd613d' },
  { id: 'b-103', title: 'Солярис', author: 'Станислав Лем', price: 620, color: '#3d5796' }
];

export const cartSlice = createSlice({
  name: 'cart',
  initialState: { quantities: {} },
  reducers: {
    added(state, action) {
      const id = action.payload;
      state.quantities[id] = (state.quantities[id] || 0) + 1;
    },
    removed(state, action) { delete state.quantities[action.payload]; },
    cleared(state) { state.quantities = {}; }
  }
});
export const { added, removed, cleared } = cartSlice.actions;
export const selectCount = state => Object.values(state.cart.quantities).reduce((sum, value) => sum + value, 0);

// A local HTTP model, deliberately injected into fetchBaseQuery. No external network.
export function createServerModel({ delay = 650 } = {}) {
  let books = structuredClone(initialBooks);
  let events = [];
  let snapshot = { books, events, requests: 0, failNext: false, delay };
  let disposed = false;
  let sequence = 0;
  const listeners = new Set();
  const pending = new Set();
  const publish = patch => {
    if (disposed) return;
    snapshot = { ...snapshot, ...patch, books, events };
    listeners.forEach(fn => fn());
  };
  const event = (message, kind = 'info') => {
    events = [{ id: ++sequence, message, kind }, ...events].slice(0, 14);
    publish({});
  };
  const wait = signal => new Promise((resolve, reject) => {
    if (disposed || signal?.aborted) { reject(new DOMException('Aborted', 'AbortError')); return; }
    const abort = () => { clearTimeout(timer); signal?.removeEventListener('abort', abort); pending.delete(abort); reject(new DOMException('Aborted', 'AbortError')); };
    const timer = setTimeout(() => { signal?.removeEventListener('abort', abort); pending.delete(abort); resolve(); }, snapshot.delay);
    pending.add(abort);
    signal?.addEventListener('abort', abort, { once: true });
  });
  return {
    subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn); },
    getSnapshot: () => snapshot,
    event,
    setDelay: value => publish({ delay: value }),
    fail: () => publish({ failNext: true }),
    fetch: async (input, init) => {
      const req = new Request(input, init);
      const path = new URL(req.url).pathname;
      const fail = snapshot.failNext;
      publish({ requests: snapshot.requests + 1, failNext: false });
      event(`${req.method} ${path} → ожидание`, 'request');
      await wait(req.signal);
      let status = 200;
      let data;
      const id = path.split('/')[3];
      const book = books.find(item => item.id === id);
      if (fail) { status = 500; data = { message: 'Учебная ошибка сервера' }; }
      else if (req.method === 'GET' && path === '/api/books') data = { books };
      else if (req.method === 'GET' && book) data = { book };
      else if (req.method === 'PATCH' && book) {
        const body = await req.json();
        if (!Number.isFinite(body.price) || body.price < 0) { status = 400; data = { message: 'Цена должна быть неотрицательным числом' }; }
        else {
          books = books.map(item => item.id === id ? { ...item, price: body.price } : item);
          data = { book: books.find(item => item.id === id) };
          event(`Сервер сохранил цену: ${body.price} ₽`, 'success');
        }
      } else { status = 404; data = { message: 'Книга не найдена' }; }
      event(`${req.method} ${path} ← ${status}`, status >= 400 ? 'error' : 'success');
      return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
    },
    dispose: () => { disposed = true; pending.forEach(abort => abort()); listeners.clear(); }
  };
}

export function createDemoEnvironment(options) {
  const server = createServerModel(options);
  const api = createApi({
    reducerPath: 'booksApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://books.example/api/', fetchFn: server.fetch }),
    tagTypes: ['Book'],
    keepUnusedDataFor: 60,
    endpoints: builder => ({
      getBooks: builder.query({
        query: () => 'books',
        transformResponse: response => response.books,
        providesTags: ['Book']
      }),
      getBook: builder.query({
        query: id => `books/${id}`,
        transformResponse: response => response.book,
        providesTags: ['Book']
      }),
      updateBook: builder.mutation({
        query: ({ id, price }) => ({ url: `books/${id}`, method: 'PATCH', body: { price } }),
        invalidatesTags: (result, error) => error ? [] : ['Book']
      })
    })
  });
  const trace = () => next => action => {
    const result = next(action);
    if (action.type.startsWith('cart/')) server.event(`${action.type}(${JSON.stringify(action.payload) ?? ''}) → новое состояние`, 'action');
    return result;
  };
  const store = configureStore({
    reducer: { cart: cartSlice.reducer, [api.reducerPath]: api.reducer },
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(api.middleware, trace)
  });
  return { server, api, store, dispose: () => { server.dispose(); store.dispatch(api.util.resetApiState()); } };
}
