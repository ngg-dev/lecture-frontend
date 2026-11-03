const router = 'https://reactrouter.com/start/declarative/routing';
const redux = 'https://redux.js.org/tutorials/essentials/part-2-app-structure';
const query = 'https://redux-toolkit.js.org/rtk-query/usage/queries';
const cache = 'https://redux-toolkit.js.org/rtk-query/usage/cache-behavior';
const tags = 'https://redux-toolkit.js.org/rtk-query/usage/automated-refetching';
const zustand = 'https://github.com/pmndrs/zustand#readme';
const tanstack = 'https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults';
export const chapters = [
  { id: 'bridge', title: 'Тот же магазин, новые задачи' },
  { id: 'router', title: 'У каждой страницы — адрес' },
  { id: 'state', title: 'Одна корзина для всех страниц' },
  { id: 'cache', title: 'Каталог из API и общий кеш' },
  { id: 'change', title: 'Меняем данные на сервере' },
  { id: 'finish', title: 'Собираем всё вместе' },
  { id: 'extra', title: 'Дополнение · Zustand + TanStack Query' }
];
const s = (id, chapter, title, lead, body) => ({ id, chapter, title, lead, ...body });
const code = (file, text) => ({ file, text });
export const slides = [
  s('cover', 'bridge', 'Магазин\nстановится\nприложением', 'Роутинг, стейт-менеджеры и кеш-менеджеры — на знакомом каталоге книг.', {
    kind: 'cover', minutes: 1,
    notes: 'Продолжение React и API. Студентам уже знакомы ProductCard, props, useState, useEffect и запросы. Сегодня добавляем возможности к тому же магазину. Сначала показываем знакомую версию, затем ставим четыре конкретные задачи и проверяем целевой результат кликами. Перед каждым новым инструментом обсуждаем проблему, которую он решает. Темп свободный: конфигурацию можно просмотреть быстрее, а действия и поток данных разобрать подробнее. Дополнительный блок необязателен.',
    takeaway: 'Открыть книгу. Сохранить корзину. Обновить каталог.'
  }),
  s('already-have', 'bridge', 'Что у нас уже есть', 'Работающий каталог из React-API: загружаем книги, показываем карточки, реагируем на клик.', {
    minutes: 2, demo: 'baseline',
    notes: 'Дождаться загрузки книг. Добавить две книги и показать счётчик в шапке: useState в общем родителе и callback уже решают эту задачу на одном экране. Нажать Обновить и проследить API → список → карточки. Это отправная точка, её не переписываем с нуля. У книг пока нет отдельных страниц, а счётчик не является полноценной корзиной с выбранными позициями. Модель ответа API локальная; компоненты React настоящие.',
    takeaway: 'Уже умеем: запрос → состояние → список карточек; клик → callback → новый счётчик.'
  }),
  s('shop-brief', 'bridge', 'Что нужно добавить в магазин', 'Четыре задачи к работающему каталогу. К каждой подберём решение.', {
    minutes: 2,
    cards: [
      ['Страницы и адреса', 'У каталога, книги и корзины есть свои адреса. Можно открыть ссылку и вернуться назад.', 'Задача 01'],
      ['Общий выбор', 'Добавили книгу в одном месте — шапка и корзина обновились. Переход не теряет выбор.', 'Задача 02'],
      ['Общий результат загрузки', 'Два экрана используют уже полученные книги и не отправляют одинаковый GET без причины.', 'Задача 03'],
      ['Новая цена на всех экранах', 'Сохранили цену на сервере — её показывают и страница книги, и каталог, и корзина.', 'Задача 04']
    ],
    notes: 'Прочитать требования через действия посетителя, пока не называть библиотеки. Для каждой задачи спросить, какого поведения не хватает исходному каталогу. Это маршрут занятия: страницы → общий выбор → общие данные → изменение. В конце повторим те же четыре проверки.',
    takeaway: 'Сначала задаём нужное поведение. Затем выбираем инструмент.'
  }),
  s('three-tasks', 'bridge', 'Как должен работать готовый магазин', 'Откройте книгу, добавьте её, перейдите в корзину и измените цену.', {
    minutes: 3, demo: 'preview',
    notes: 'Это целевой результат — устройство пока не объясняем. Открыть Мастер и Маргарита, добавить книгу и перейти в корзину: выбор сохранился. Вернуться в каталог и заметить, что счётчик GET не растёт без причины. Открыть книгу, сохранить 790 и проверить каталог и сумму корзины. Назвать четыре наблюдаемых результата из предыдущего слайда. Далее соберём их постепенно. API моделируется локально.',
    takeaway: 'Теперь разберём, как добавить каждую возможность к исходному каталогу.'
  }),
  s('router-question', 'router', 'Как открыть книгу по ссылке?', 'Нужны три страницы, история переходов и отдельный адрес каждой книги.', {
    kind: 'question', minutes: 1,
    bullets: ['Нажали на книгу → открылись её подробности', 'Отправили /books/b-101 → открылась та же книга', 'Нажали «Назад» → вернулись к предыдущей странице'],
    notes: 'Дать аудитории несколько секунд предложить вариант. Одного isDetailsOpen в useState недостаточно для связи экрана с адресом и историей. Можно организовать такую связь самостоятельно; теперь выберем готовый механизм.',
    takeaway: 'Кто свяжет адрес, историю и нужный React-компонент?'
  }),
  s('router-intro', 'router', 'React Router связывает адрес и страницу', 'Маршрутизатор выбирает React-компонент по текущему URL.', {
    minutes: 1,
    cards: [
      ['Опишем соответствие', '/ → каталог, /books/:bookId → книга, /cart → корзина.', 'Маршруты'],
      ['Перейдём по ссылке', 'Меняются адрес и экран; работает история переходов.', 'Навигация'],
      ['Получим id книги', 'Страница прочитает b-101 из адреса и найдёт нужные данные.', 'Параметр']
    ],
    notes: 'Дать название после сформулированной задачи. React Router управляет переходами в React-приложении. В выбранном декларативном режиме мы задаём маршруты и компоненты; запросы данных разберём отдельно. Показать результат на следующем слайде, затем перейти к схеме и коду.',
    takeaway: 'Задача 01: у каждой страницы есть адрес.', sources: [router]
  }),
  s('routing-demo', 'router', 'У книги появилась своя страница', 'Нажмите на название → посмотрите на адрес → вернитесь назад.', {
    minutes: 3, demo: 'route',
    notes: 'Открыть «Пикник на обочине». Обратить внимание на b-102 в адресе. Кнопки назад/вперёд относятся к истории магазина. Внутри презентации используется MemoryRouter, чтобы адрес демо не конфликтовал с адресом слайда. Это настоящий React Router; строка bookshop.local показывает его внутренний адрес. Ни браузерной перезагрузки, ни запроса HTML для каждого экрана нет.',
    takeaway: 'Маршрут связывает путь с React-компонентом.', sources: [router]
  }),
  s('route-map', 'router', 'Адрес → маршрут → компонент', 'Схема выбирает один экран. Переключайте шаги.', {
    minutes: 2,
    steps: [
      ['Адрес', '/books/b-102', 'Посетитель открыл ссылку на конкретную книгу.'],
      ['Шаблон', '/books/:bookId', 'Динамический участок bookId совпал со строкой b-102.'],
      ['Компонент', '<BookPage />', 'React Router отображает страницу книги.'],
      ['Данные', "bookId = 'b-102'", 'Страница использует id, чтобы выбрать или запросить книгу.']
    ],
    notes: 'Попросить назвать компонент для /cart и значение bookId для /books/b-103. URL не содержит весь объект книги и не загружает данные сам по себе. Позднее передадим bookId в query-хук.', sources: [router]
  }),
  s('routes', 'router', 'Опишем три страницы', 'Компоненты страниц остаются обычными React-функциями.', {
    minutes: 3,
    code: code('App.jsx · маршруты', `import { Routes, Route } from 'react-router';
import { Catalog } from './Catalog';
import { BookPage } from './BookPage';
import { CartPage } from './CartPage';
import { ShopLayout } from './ShopLayout';

export function App() {
  return (
    <Routes>
      <Route element={<ShopLayout />}>
        <Route index element={<Catalog />} />
        <Route path="books/:bookId" element={<BookPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="*" element={<p>Страница не найдена</p>} />
      </Route>
    </Routes>
  );
}`),
    bullets: ['index — каталог по адресу /', ':bookId — переменная часть адреса', '* — понятный экран для неизвестного пути'],
    notes: 'Файл App.jsx полностью показывает таблицу маршрутов. Реализацию Catalog уже знаем по прошлой лекции; BookPage и общий ShopLayout разбираем далее. Router-провайдер подключим в main.jsx. Это декларативный режим React Router, без loaders и серверного рендеринга.', sources: [router]
  }),
  s('links-layout', 'router', 'Шапка остаётся, экран меняется', 'Link меняет маршрут, Outlet показывает выбранную страницу.', {
    minutes: 2,
    code: code('ShopLayout.jsx', `import { Link, NavLink, Outlet } from 'react-router';

export function ShopLayout() {
  return (
    <>
      <header>
        <Link to="/">Книжный магазин</Link>
        <NavLink to="/cart">Корзина</NavLink>
      </header>
      <main><Outlet /></main>
    </>
  );
}`),
    bullets: ['Link — переход внутри приложения', 'NavLink — ссылка с признаком isActive', 'Outlet — место для дочернего маршрута'],
    notes: 'Сопоставить вложенный Route на предыдущем слайде и Outlet здесь. Link нужен для перехода на экран, button — для действия, например добавления в корзину. Обычная ссылка a остаётся правильным выбором для внешнего сайта или скачивания файла.', sources: [router]
  }),
  s('route-params', 'router', 'Одна страница — разные книги', 'Не создаём отдельный компонент для каждого товара.', {
    minutes: 2,
    code: code('ProductCard.jsx → BookPage.jsx · фрагменты', `// В ProductCard (импортируем Link из react-router):
<Link to={'/books/' + book.id}>{book.title}</Link>

// BookPage.jsx · сначала локальные данные:
import { useParams } from 'react-router';
import { books } from './books';

export function BookPage() {
  const { bookId } = useParams();
  const book = books.find(item => item.id === bookId);

  if (!book) return <p>Книга не найдена</p>;
  return <h1>{book.title}</h1>;
}`),
    bullets: ["/books/b-101 → 'Мастер и Маргарита'", "/books/b-103 → 'Солярис'", 'Неизвестный id → «Книга не найдена»'],
    notes: 'Пока используем знакомый массив books. useParams возвращает параметры из совпавшего URL; bookId — строка. Потом заменим find на useGetBookQuery(bookId). Фильтр или поисковый запрос, которым нужно делиться ссылкой, также можно хранить в URL, но query-параметры в этой лекции не реализуем.', sources: [router]
  }),
  s('router-start', 'router', 'Подключим Router к приложению', 'Установка и обёртка выполняются один раз.', {
    minutes: 2,
    code: code('main.jsx · вариант для обычного хостинга', `// npm install react-router
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './App';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);`),
    bullets: ['BrowserRouter использует адресную строку браузера', 'Сервер должен отдавать index.html и для /books/b-101', 'Для простого GitHub Pages удобен HashRouter'],
    notes: 'При прямом открытии вложенного пути запрос получает хостинг. У BrowserRouter нужен fallback на index.html и при размещении в подпапке — соответствующий basename. GitHub Pages обычно такого fallback не предоставляет. Для студенческой статической публикации можно заменить импорт и обёртку BrowserRouter на HashRouter: адрес будет /имя-репозитория/#/books/b-101. Hash не отправляется серверу. Vite при публикации в подпапке также требует корректный base для ресурсов. Наша презентация уже использует относительные ресурсы, а демонстрации изолированы MemoryRouter.',
    takeaway: 'Задача 01 выполнена: открываем нужную книгу по ссылке и возвращаемся назад.', sources: [router, 'https://reactrouter.com/api/declarative-routers/HashRouter']
  }),
  s('local-reset', 'state', 'Почему корзина снова пустая?', 'Неудачная попытка: при выделении страниц поместили счётчик внутрь Catalog.', {
    minutes: 3, demo: 'local',
    notes: 'Здесь намеренно неудачное решение: count живёт в useState самого Catalog, а шапка не связана с ним. При уходе Catalog размонтируется, при возврате создаётся заново с нулём. Это следствие расположения состояния, а не ошибка Router. Уже знакомый выход — поднять состояние к постоянному общему родителю. Store покажем как следующий способ организовать общие данные.',
    takeaway: 'Сначала решаем, кто владеет состоянием. Потом выбираем инструмент.'
  }),
  s('state-owner', 'state', 'Можно держать корзину в App. Что усложняется?', 'Один useState у общего родителя работает. Посмотрим на путь данных при росте дерева.', {
    minutes: 2,
    propsChain: ['App: cart, onAdd', 'ShopLayout: передаёт дальше', 'Catalog: передаёт дальше', 'ProductCard: использует onAdd'],
    bullets: ['Промежуточные компоненты передают props, которые сами не используют', 'Для нового места добавления тянем callback ещё по одной ветке', 'Добавление, удаление и изменение количества разрастаются в App'],
    notes: 'Это не ошибка useState: поднятие состояния — правильное простое решение для небольшого дерева, оно уже работало в начальном каталоге. Проблема возникает при росте числа потребителей и правил: общий родитель связывает разные ветки, а компоненты-посредники получают чужие обязанности. Один большой объект state сам по себе не решает эти задачи. Правила можно вынести в useReducer, передачу — организовать через Context; сегодня рассмотрим готовый store. Не обещать, что store автоматически уберёт все рендеры.',
    takeaway: 'Нужно упростить доступ разных компонентов к общей корзине и собрать правила её обновления.'
  }),
  s('redux-question', 'state', 'Как дать разным страницам одну корзину?', 'Количество нужно карточке, шапке и корзине — даже когда между ними несколько уровней.', {
    kind: 'question', minutes: 1,
    bullets: ['Не потерять выбор при переключении страницы', 'Не передавать onAdd через каждый промежуточный компонент', 'Хранить правила добавления и удаления в одном месте'],
    notes: 'Связать вопрос с показанной цепочкой props. Не предлагать отдельный useState для шапки и для корзины: придётся синхронизировать копии. Ищем одну корзину с понятным способом читать её и менять.',
    takeaway: 'Где хранить общие данные и как компонентам обращаться к ним напрямую?'
  }),
  s('redux-intro', 'state', 'Redux Toolkit организует общий store', 'Redux — библиотека общего состояния. Redux Toolkit помогает создать store и описать правила изменений.', {
    minutes: 1,
    cards: [
      ['Одно хранилище', 'Создаём store вне страниц: в нём будет общая корзина.', 'Шаг 1 · создать'],
      ['Общий доступ', 'Подключаем store к приложению. Шапка и страницы обращаются к одной корзине.', 'Шаг 2 · подключить'],
      ['Чтение и изменение', 'Затем опишем добавление книги и покажем общее количество в шапке.', 'Шаг 3 · использовать']
    ],
    notes: 'Redux — библиотека для общего состояния; Redux Toolkit — рекомендуемый набор средств для работы с Redux. Store полезен здесь для организации доступа и правил. Provider даст доступ компонентам, react-redux свяжет подписки с React. Для маленького приложения useState у общего родителя по-прежнему достаточен. Redux не сохраняет данные после перезагрузки без отдельной настройки и не отменяет все рендеры.',
    takeaway: 'Задача 02: разные страницы читают и меняют одну корзину.', sources: [redux]
  }),
  s('store', 'state', 'Создадим один store', 'Сначала создаём общее хранилище вне переключаемых страниц.', {
    minutes: 2,
    code: code('store.js', `import { configureStore } from '@reduxjs/toolkit';
// Содержимое cartSlice.js разберём после подключения store
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer
  }
});`),
    bullets: ['configureStore создаёт хранилище', 'cart задаёт раздел state.cart', 'cartReducer отвечает за этот раздел; его код — дальше'],
    takeaway: 'Сначала создаём store → даём доступ React → описываем изменения корзины.',
    notes: 'Начинаем с устройства хранилища, без разбора действий. configureStore собирает Redux store. cartReducer — функция, отвечающая за раздел корзины; здесь показываем её подключение, а полный файл cartSlice.js реализуем сразу после Provider. До добавления этого файла импорт ещё не разрешается: это последовательный разбор нескольких файлов, а не автономный пример. Ключ cart задаёт положение данных в полном состоянии. Один созданный экземпляр будет передан Provider над всеми маршрутами. Перезагрузка всей страницы создаёт JavaScript-приложение заново: сохранение корзины между перезагрузками пока не реализовано.', sources: [redux]
  }),
  s('provider', 'state', 'Сделаем store доступным страницам', 'Provider охватывает каталог, шапку и корзину.', {
    minutes: 2,
    code: code('main.jsx · добавляем Redux', `// npm install @reduxjs/toolkit react-redux
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router';
import { store } from './store';
import { App } from './App';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);`),
    notes: 'На этом слайде выбран HashRouter, чтобы пример можно было опубликовать на простом статическом хостинге. В обычном SPA с настроенным сервером подходит BrowserRouter. Provider — компонент react-redux, который даёт хукам доступ к переданному store. Он должен остаться над переключаемыми страницами.', sources: [redux]
  }),
  s('cart-slice', 'state', 'Запишем правило «добавить книгу»', 'Store подключён. Добавим правила и actions — сообщения об изменениях корзины.', {
    minutes: 3,
    code: code('cartSlice.js', `import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { quantities: {} },
  reducers: {
    added(state, action) {
      const id = action.payload;
      state.quantities[id] = (state.quantities[id] || 0) + 1;
    },
    removed(state, action) {
      delete state.quantities[action.payload];
    }
  }
});

export const { added, removed } = cartSlice.actions;
export default cartSlice.reducer;`),
    bullets: ['Добавили b-101: {} → { "b-101": 1 }', 'Добавили ещё раз: { "b-101": 2 }', 'Убрали строку: {} · payload передаёт id'],
    notes: 'Теперь раскрываем файл cartSlice.js, импортированный при настройке store. createSlice объединяет начальное состояние и правила обновления; из имён правил создаёт функции added и removed, возвращающие actions. В корзине храним только id и количество, цены остаются в каталоге. Для первой книги quantities станет {"b-101": 1}, для повторного добавления — 2. Показать эти два состояния. Здесь можно писать изменение draft: внутри createSlice работает Immer, который создаёт следующее состояние без изменения предыдущего. Это не разрешение мутировать объект из useSelector или обычный React state. Reducer не отправляет запросы.', sources: [redux]
  }),
  s('dispatch', 'state', 'Кнопка отправляет действие', 'ProductCard показывает книгу и сообщает о клике.', {
    minutes: 2,
    code: code('ProductCard.jsx · фрагмент компонента', `import { useDispatch } from 'react-redux';
import { added } from './cartSlice';

export function AddButton({ book }) {
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(added(book.id))}>
      В корзину
    </button>
  );
}`),
    bullets: ["added('b-101') → { type: 'cart/added', payload: 'b-101' }", 'dispatch передаёт это сообщение в store', 'Обработчик вызывается по клику, не при рендере'],
    notes: 'AddButton можно вставить в ProductCard и BookPage. В отличие от предыдущей версии callback onAdd не нужно передавать через каждый промежуточный уровень. props остаются обычным способом передать данные конкретной карточки.', sources: [redux]
  }),
  s('selector', 'state', 'Шапка читает количество из store', 'Не заводим ещё один useState для той же суммы.', {
    minutes: 2,
    code: code('CartBadge.jsx', `import { useSelector } from 'react-redux';

export function CartBadge() {
  const count = useSelector(state =>
    Object.values(state.cart.quantities)
      .reduce((sum, quantity) => sum + quantity, 0)
  );

  return <span>В корзине: {count}</span>;
}`),
    bullets: ['Selector выбирает или вычисляет значение', 'useSelector подписывает компонент на результат', 'Проверьте: b-101 × 2 и b-102 × 1 → в шапке 3'],
    notes: 'Суммарное количество выводим из quantities. Не синхронизируем два источника истины. Для суммарной стоимости позже понадобятся quantities из cart и актуальные цены из query-данных. Не возвращать из простого selector новый объект без необходимости: подписка сравнивает результат по ссылке.', sources: [redux]
  }),
  s('redux-flow', 'state', 'Соберём весь путь одного клика', 'Store, правила и подписка уже подключены. Проследим, как они работают вместе.', {
    minutes: 3,
    steps: [
      ['Кнопка', 'added("b-101")', 'Создаём action: тип cart/added и payload с id книги.'],
      ['Отправка', 'dispatch(action)', 'Передаём action в Redux store.'],
      ['Правило', 'reducer(state, action)', 'Reducer вычисляет новое количество этой книги.'],
      ['Подписка', 'useSelector(...)', 'Компонент получает выбранное значение из нового состояния.'],
      ['Экран', 'В корзине: 1', 'React обновляет отображение подписанного компонента.']
    ],
    notes: 'Итоговая схема после создания store, подключения Provider и разбора actions, dispatch и useSelector. Пройти шаги по клику, затем попросить повторить без терминов: кнопка сообщает, правило меняет, шапка читает. Action — обычный объект. Store хранит состояние; reducer — функция расчёта. useSelector подписывает компонент и при изменении выбранного результата запрашивает рендер.', sources: [redux]
  }),
  s('store-demo', 'state', 'Теперь корзина общая', 'Добавьте разные книги. Перейдите на их страницы и в корзину.', {
    minutes: 3, demo: 'store',
    takeaway: 'Задача 02 выполнена: выбор общий, переходы его не теряют.',
    notes: 'Сравнить с демонстрацией локального счётчика. Справа настоящий cart state и названия отправленных действий. Объяснить удаление строки: отдельный action cart/removed. Количество обновляется и в шапке, и в корзине. При сбросе демонстрации создаётся новое приложение со своим новым store.', sources: [redux]
  }),
  s('state-boundaries', 'state', 'Не всё состояние нужно класть в Redux', 'Для каждого значения выбираем владельца.', {
    minutes: 2,
    cards: [
      ['Адрес книги', '/books/b-101', 'React Router / URL'],
      ['Количество в корзине', '{ "b-101": 2 }', 'Redux / cart'],
      ['Полученные книги', 'Названия, авторы, цены с сервера', 'Нужен общий кеш'],
      ['Текст в поле цены', 'Пользователь ещё не нажал «Сохранить»', 'Локальный useState']
    ],
    notes: 'Спросить, где хранить открытость одной подсказки: локально. Общее состояние не обязано храниться в Redux, но в основном треке лекции мы выбрали его. Данные API имеют собственные загрузку, ошибку и обновление. В следующем блоке организуем для них общий кеш; в cartSlice не будем копировать весь ответ.',
    takeaway: 'Разделяем выбор пользователя и данные, которыми управляет сервер.'
  }),
  s('duplicate-requests', 'cache', 'Один хук вызвали два компонента', 'Добавьте вторую витрину и посмотрите на счётчик запросов.', {
    minutes: 3, demo: 'manual',
    notes: 'Это ровно идея собственного useBooks из прошлой лекции: useState и useEffect на каждый вызов. Повторное использование логики не создаёт общий экземпляр состояния и кеш. Первый компонент делает один запрос; второй — ещё один. Снять и снова добавить второй компонент: будет ещё один запрос. Строгий режим для этой учебной модели не включён.',
    takeaway: 'Собственный хук переиспользует логику. Общий кеш нужно организовать отдельно.'
  }),
  s('query-question', 'cache', 'Как использовать один ответ API в нескольких местах?', 'Книги нужны каталогу, странице книги и корзине.', {
    kind: 'question', minutes: 1,
    bullets: ['Совпадающие запросы должны использовать общий результат', 'Компонентам нужны данные, загрузка, ошибка и повтор', 'После изменения на сервере нужно обновить связанные экраны'],
    notes: 'Можно вручную поднять books, status и error к общему родителю или написать собственный слой кеша. Но появятся правила совпадения запросов, подписок, хранения и обновления. Из предыдущего демо уже видно: повторно вызвать useBooks — не значит разделить его состояние.',
    takeaway: 'Кто возьмёт на себя запрос, общий кеш и его обновление?'
  }),
  s('query-intro', 'cache', 'RTK Query управляет данными API', 'Это часть Redux Toolkit для запросов, их статусов и общего кеша.', {
    minutes: 1,
    cards: [
      ['Описываем запрос один раз', 'Endpoint задаёт адрес и способ получить данные.', 'Контракт API'],
      ['Подписываем компоненты', 'Одинаковый запрос использует общую запись с данными и статусом.', 'Query-хук'],
      ['Управляем обновлением', 'Явно перечитываем данные или обновляем их после сохранения.', 'Кеш']
    ],
    notes: 'RTK Query уже входит в @reduxjs/toolkit. Он хранит кеш внутри существующего Redux store; правила корзины остаются в cartSlice. Он не создаёт сервер: API и его контракт нужны отдельно. Сначала разберём чтение и общий результат, затем изменение цены.',
    takeaway: 'Задача 03: несколько компонентов используют общие данные сервера.', sources: [query, cache]
  }),
  s('cache-flow', 'cache', 'Сначала спросим общий кеш', 'RTK Query связывает компоненты, запросы и сохранённые ответы.', {
    minutes: 2,
    steps: [
      ['Компонент', 'useGetBooksQuery()', 'Компонент подписывается на запрос каталога.'],
      ['Ключ кеша', 'getBooks(undefined)', 'Endpoint и сериализованные аргументы определяют запись.'],
      ['Если записи нет', 'GET /api/books', 'Начинается загрузка, компонент получает её статус.'],
      ['Ответ', '{ books: [...] }', 'Данные сохраняются в кеше и становятся доступны подписчикам.'],
      ['Ещё один компонент', 'тот же ключ', 'Использует общие данные; совпадающие запросы объединяются.']
    ],
    notes: 'При наличии подходящей записи по умолчанию используется кеш. Повторный запрос можно запустить явно или настройками. Это отдельный кеш библиотеки в памяти приложения, не HTTP-кеш браузера и не localStorage. После перезагрузки без дополнительной настройки кеш исчезнет.', sources: [cache]
  }),
  s('api-contract', 'cache', 'Условный API уже существует', 'Нам нужен договор: какой адрес вызвать и что прочитать в ответе.', {
    minutes: 2,
    code: code('GET /api/books → 200 · пример JSON', `{
  "books": [
    {
      "id": "b-101",
      "title": "Мастер и Маргарита",
      "author": "Михаил Булгаков",
      "price": 690
    }
  ]
}`),
    bullets: ['GET /api/books → { books: [...] }', 'GET /api/books/b-101 → { book: {...} }', 'PATCH /api/books/b-101 + { price: 790 } → { book: {...} }'],
    notes: 'GET-каталог сохраняет контракт предыдущего занятия. Добавляем чтение одной книги и изменение её цены. Это оговорённый учебный API. На слайдах сеть имитируется локально, но функции библиотек настоящие. Студент подключает свой реальный API; одной строки /api/books недостаточно, чтобы сервер появился.',
    takeaway: 'Сначала уточняем контракт API. Затем описываем endpoint.'
  }),
  s('create-api', 'cache', 'Опишем получение каталога', 'createApi создаёт query-хук для React.', {
    minutes: 3,
    code: code('booksApi.js · первая версия', `import {
  createApi, fetchBaseQuery
} from '@reduxjs/toolkit/query/react';

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: builder => ({
    getBooks: builder.query({
      query: () => 'books',
      transformResponse: response => response.books
    })
  })
});

export const { useGetBooksQuery } = booksApi;`),
    bullets: ['Прежние getBooks + client → endpoint + fetchBaseQuery', 'baseUrl + books → /api/books; transformResponse извлекает массив', 'getBooks → автоматически созданный useGetBooksQuery'],
    notes: 'fetchBaseQuery — небольшая обёртка над fetch. По умолчанию она читает JSON и превращает HTTP-статусы вне 2xx в ошибку query. Старый общий HTTP-клиент можно адаптировать через собственный baseQuery; для этой лекции выбираем встроенный вариант, а не наслаиваем Axios. Если API на другом домене, ставим его реальный базовый адрес и проверяем CORS.', sources: [query]
  }),
  s('api-store', 'cache', 'Подключим API к тому же store', 'Для RTK Query нужны и reducer, и middleware.', {
    minutes: 2,
    code: code('store.js · расширяем прежнюю версию', `import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import { booksApi } from './booksApi';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [booksApi.reducerPath]: booksApi.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(booksApi.middleware)
});`),
    bullets: ['cart — выбранные количества', 'booksApi — кеш и статусы запросов', 'middleware — обработка запросов, подписок и времени жизни кеша'],
    notes: 'Provider из предыдущих слайдов остаётся тем же. Не создавать второй Redux store для API. Если не подключить middleware, RTK Query не будет работать корректно. В простом приложении удобно одно createApi на базовый URL с несколькими endpoints.', sources: [query]
  }),
  s('query-component', 'cache', 'Заменим useBooks одним query-хуком', 'В Catalog меняем источник данных. Карточки остаются прежними.', {
    minutes: 3,
    code: code('Catalog.jsx · основная часть', `import { useGetBooksQuery } from './booksApi';
import { ProductCard } from './ProductCard';

export function Catalog() {
  const { data: books = [], isLoading, isError, refetch }
    = useGetBooksQuery();

  if (isLoading) return <p>Загружаем…</p>;
  if (isError) return <div role="alert">
    <p>Не удалось загрузить книги</p>
    <button onClick={refetch}>Повторить</button>
  </div>;
  if (books.length === 0) return <p>Книг пока нет</p>;

  return books.map(book => (
    <ProductCard key={book.id} book={book} />
  ));
}`),
    bullets: ['books → data; status → isLoading / isError', 'reload → refetch', 'В этом Catalog убираем вызов useBooks и его прежний effect'],
    notes: 'Прямой переход с прошлой лекции: getBooks и общий HTTP-клиент заменены endpoint и fetchBaseQuery; useBooks в этом каталоге заменён сгенерированным хуком. Не запускать оба пути загрузки одновременно. Сам файл useBooks может остаться для других компонентов. ProductCard включает AddButton из Redux-блока, поэтому onAdd через BookList больше не передаём. Для первого примера ошибка заменяет список. Итоговый вариант с сохранением данных при фоновой ошибке покажем на слайде «Первый запрос и обновление». Не дублируем data в локальном state.', sources: [query]
  }),
  s('cache-demo', 'cache', 'Два подписчика — одна запись', 'Включите вторую подписку. Затем перейдите в корзину и обратно.', {
    minutes: 3, demo: 'cache',
    notes: 'Дождаться первого GET. Включить «Второй подписчик»: число GET не должно вырасти. Для этого у обоих запрос getBooks с одинаковым аргументом. Переход в корзину тоже читает этот список. Нажать «Обновить»: это уже явный refetch, число запросов увеличится. Медленный ответ делает isFetching заметнее. Ошибка следующего запроса не запускает запрос сама: после неё нажать Обновить.',
    takeaway: 'Задача 03 выполнена: новый компонент использует общий результат запроса.', sources: [cache]
  }),
  s('query-arguments', 'cache', 'Другая книга — другой ключ', 'Параметр маршрута становится аргументом query.', {
    minutes: 2,
    code: code('booksApi.js и BookPage.jsx · фрагменты', `// Ещё один endpoint внутри endpoints:
getBook: builder.query({
  query: id => 'books/' + id,
  transformResponse: response => response.book
})

// Экспорт из booksApi.js:
export const { useGetBookQuery } = booksApi;

// Внутри BookPage:
const { bookId } = useParams();
const { data: book, isLoading, isError }
  = useGetBookQuery(bookId);`),
    bullets: ['getBook("b-101") и getBook("b-102") — разные записи', 'getBooks() — отдельная запись со списком', 'Книга в списке и книга в деталях не объединяются автоматически'],
    notes: 'Это фрагменты двух файлов, не один исполняемый файл. getBook добавляется рядом с getBooks; экспорт useGetBooksQuery сохраняется. В BookPage нужны импорты useParams и useGetBookQuery. После хука применяем знакомые проверки загрузки и ошибки. RTK Query кеширует результаты запросов, но не является автоматически нормализованной базой сущностей. Позднее теги позволят обновить и список, и детали.', sources: [cache, router]
  }),
  s('cache-lifetime', 'cache', 'Кеш не означает «данные навсегда»', 'Отдельно решаем, сколько хранить результат и когда обновлять его.', {
    minutes: 2,
    cards: [
      ['Есть подписчики', 'Компоненты используют общую запись.', 'Кеш доступен'],
      ['Последний подписчик ушёл', 'По умолчанию RTK Query хранит запись ещё 60 секунд.', 'keepUnusedDataFor'],
      ['Нужны свежие данные', 'refetch, invalidation или настройки повторного запроса.', 'Обновляем явно'],
      ['Перезагрузка страницы', 'Кеш в памяти создаётся заново.', 'Это не постоянное хранилище']
    ],
    notes: '60 секунд — время удаления НЕИСПОЛЬЗУЕМОЙ записи, а не периодический запрос и не гарантия свежести. Таймер начинается после последней отписки. refetchOnMountOrArgChange, refetchOnFocus и polling существуют, но сегодня не включаем всё сразу. При необходимости focus/reconnect также подключают setupListeners. В демо настройки по умолчанию, обновляем кнопкой или после мутации.', sources: [cache]
  }),
  s('background', 'cache', 'Первый запрос и обновление выглядят по-разному', 'При обновлении можно оставить список на экране.', {
    minutes: 2,
    code: code('Catalog.jsx · итоговая обработка состояний', `const { data: books, isLoading, isFetching, isError, refetch }
  = useGetBooksQuery();

if (isLoading) return <p>Загружаем каталог…</p>;
if (isError && !books) return <div role="alert">
  <p>Не удалось загрузить книги</p>
  <button onClick={refetch}>Повторить</button>
</div>;

return (
  <>
    <button onClick={refetch} disabled={isFetching}>
      Обновить
    </button>
    {isFetching && <p>Обновляем данные…</p>}
    {isError && <p role="alert">
      Не обновилось. Показаны прежние данные.</p>}
    {books.length ? <BookList books={books} /> : <p>Книг пока нет</p>}
  </>
);`),
    notes: 'Этот фрагмент заменяет обработку состояний из первого Catalog целиком. Здесь data намеренно не подменяется пустым массивом: undefined означает отсутствие загруженного результата, а [] — успешный пустой ответ. Блокирующая ошибка показывается только без прежних данных. При ошибке refetch книги остаются на экране, рядом появляется сообщение; кнопка Обновить позволяет повторить запрос. BookList — знакомый map с ProductCard и стабильным key; кнопка карточки теперь использует AddButton. isLoading описывает первый запрос без данных, isFetching — любой текущий запрос. В демо включить медленный ответ и нажать Обновить, затем повторить с ошибкой.',
    takeaway: 'Первое ожидание — заглушка. Фоновое обновление — прежние данные и индикатор.', sources: [query]
  }),
  s('cart-page', 'cache', 'Соберём страницу корзины', 'Количество берём из Redux, название и текущую цену — из ответа API.', {
    minutes: 3,
    code: code('CartPage.jsx · внутри компонента', `const { data: books, isLoading, isError, refetch }
  = useGetBooksQuery();
const quantities = useSelector(state => state.cart.quantities);
const dispatch = useDispatch();
if (isLoading) return <p>Загружаем книги…</p>;
if (isError && !books) return <div role="alert">Нет данных.
  <button onClick={refetch}>Повторить</button>
</div>;
const items = books.filter(book => quantities[book.id]);
const total = items.reduce((sum, book) =>
  sum + book.price * quantities[book.id], 0);
return <>
  {isError && <p>Обновление не удалось. Показаны прежние цены.</p>}
  {items.length === 0 && <p>Корзина пуста</p>}
  {items.map(book => <div key={book.id}>
    <span>{book.title} × {quantities[book.id]}</span>
    <button onClick={() => dispatch(removed(book.id))}>
      Убрать</button>
  </div>)}
  <strong>Итого: {total} ₽</strong>
</>;`),
    bullets: ['id соединяет количество и книгу', 'filter выбирает строки; reduce считает сумму', 'removed удаляет всю строку и обновляет общий счётчик'],
    notes: 'Это тело CartPage, а не отдельный полный файл. Нужны импорты useGetBooksQuery из booksApi, useSelector/useDispatch из react-redux и removed из cartSlice. Все hooks вызываются до условных возвратов. Сначала проверяем загрузку и ошибку без данных, чтобы не выдавать ещё не загруженный каталог за пустую корзину. Два источника связаны id: количества — выбор пользователя, книги и цены — данные сервера. Сумму не кладём в отдельный useState. Пример: 2 × 690 + 1 × 540 = 1920. После изменения первой цены на 790 станет 2120. Пока API не подключён, ту же логику можно проверить с локальным массивом books. Для большого каталога нужен API получения выбранных сущностей, здесь список маленький и загружается целиком.', sources: [redux, query]
  }),
  s('price-question', 'change', 'Как показать новую цену во всех местах?', 'Владелец магазина сохранил 790 ₽, а каталог и корзина уже показывали прежние 690 ₽.', {
    kind: 'question', minutes: 1,
    bullets: ['Сначала сервер должен подтвердить изменение', 'При ошибке нельзя выдавать черновик за сохранённую цену', 'После успеха нужно обновить связанные данные в кеше'],
    notes: 'Возвращаемся к задаче 04. Простого setPrice достаточно только для ввода в поле. Цена принадлежит серверу, а полученные ответы могли сохраниться в разных записях кеша. RTK Query предлагает mutation для изменения и invalidation для обновления связанных ответов. Сейчас увидим результат, затем разберём оба шага.',
    takeaway: 'Как связать сохранение на сервере и повторное чтение данных?'
  }),
  s('price-demo', 'change', 'Цена изменилась. Кто обновит экран?', 'Откройте книгу, введите новую цену и нажмите «Сохранить цену».', {
    minutes: 3, demo: 'mutation',
    notes: 'Начальное состояние открывает b-101. Поменять 690 на 790. В журнале будет PATCH, затем повторный GET активной страницы. Вернуться в каталог: читается актуальный список. Корзина хранит только количества, поэтому не удерживает старую цену. В этой модели стоимость корзины считается по текущей цене; реальная цена заказа должна подтверждаться сервером.',
    takeaway: 'Меняем данные на сервере, затем обновляем затронутый кеш.', sources: [tags]
  }),
  s('mutation-code', 'change', 'Изменение описываем как mutation', 'Query читает данные. Mutation отправляет изменение.', {
    minutes: 3,
    code: code('booksApi.js · добавляем endpoint в endpoints', `updateBook: builder.mutation({
  query: ({ id, price }) => ({
    url: 'books/' + id,
    method: 'PATCH',
    body: { price }
  }),
  invalidatesTags: (result, error) =>
    error ? [] : ['Book']
})

// Экспорт рядом с query-хуками:
export const { useUpdateBookMutation } = booksApi;`),
    bullets: ['PATCH /api/books/b-101', 'Тело запроса: { "price": 790 }', 'После успеха помечаем связанные данные устаревшими'],
    notes: 'Фрагмент добавляется к существующим endpoints, прежние query-хуки не удаляются. Далее на слайде «Свяжем чтение и изменение тегом» добавим tagTypes и providesTags, без них смысл invalidatesTags не завершён. В случае ошибки пустой массив тегов не запускает обновление каталога. fetchBaseQuery сериализует JSON body и выставляет Content-Type. Mutation-хук возвращает функцию запуска, запрос не отправляется от одного вызова хука.', sources: [tags]
  }),
  s('mutation-button', 'change', 'Отправим цену по кнопке', 'Черновик поля остаётся локальным состоянием формы.', {
    minutes: 2,
    code: code('PriceEditor.jsx · логика внутри компонента', `const [price, setPrice] = useState(String(book.price));
const [updateBook, { isLoading }] = useUpdateBookMutation();
const [message, setMessage] = useState('');

async function save() {
  const value = Number(price);
  if (price.trim() === '' || !Number.isFinite(value) || value < 0) {
    setMessage('Введите неотрицательную цену');
    return;
  }
  try {
    await updateBook({ id: book.id, price: value }).unwrap();
    setMessage('Сохранено');
  } catch {
    setMessage('Не удалось сохранить. Повторите попытку');
  }
}`),
    bullets: ['input: value={price}, onChange → setPrice', 'button: onClick={save}, disabled={isLoading}', 'message показываем рядом с формой'],
    notes: 'Фрагмент предполагает импорт useState и useUpdateBookMutation, а также book из props. Форма ввода в демо показывает этот сценарий полностью. unwrap позволяет обработать успех/ошибку через try/catch. Без unwrap возвращаемый trigger promise содержит результат запроса и не отклоняется на обычную ошибку API так, как ожидает этот catch. Не переносим каждую набранную цифру сразу в Redux.', sources: [query]
  }),
  s('price-form', 'change', 'Свяжем поле и сохранение', 'Поле меняет только черновик. Отправка формы вызывает save.', {
    minutes: 2,
    code: code('PriceEditor.jsx · JSX к предыдущему слайду', `return (
  <form onSubmit={event => { event.preventDefault(); save(); }}>
    <label htmlFor="price">Новая цена, ₽</label>
    <input id="price" type="number" min="0" step="1"
      value={price}
      onChange={event => setPrice(event.target.value)} />
    <button type="submit" disabled={isLoading}>
      {isLoading ? 'Сохраняем…' : 'Сохранить цену'}
    </button>
    <p role="status">{message}</p>
  </form>
);`),
    bullets: ['value + onChange связывают поле с useState', 'preventDefault отменяет перезагрузку от HTML-формы', 'Серверные данные изменятся после успешного запроса'],
    notes: 'Продолжение PriceEditor: price, setPrice, isLoading, message и save определены на предыдущем слайде. Контролируемое поле хранит строку, потому что пустое поле тоже допустимый черновик; save проверяет его до преобразования и отправки. Проверки в save остаются нужны независимо от атрибутов HTML. Одна форма на странице; если форм несколько, каждому label/input нужен свой id. В живом демо поле дополнительно синхронизируется с новой подтверждённой ценой. Попросить предсказать, уйдёт ли запрос от простого набора цифры: нет.', sources: [query]
  }),
  s('tags', 'change', 'Свяжем чтение и изменение тегом', 'Тег Book — метка для обновления связанных результатов.', {
    minutes: 3,
    code: code('booksApi.js · связи между endpoints', `// В настройках createApi:
tagTypes: ['Book'],

// В getBooks и getBook:
providesTags: ['Book'],

// В updateBook:
invalidatesTags: (result, error) =>
  error ? [] : ['Book']`),
    bullets: ['Одинаковая метка связывает чтение и изменение', 'После успеха обновятся затронутые активные query', 'Общий тег Book подходит для небольшого каталога'],
    notes: 'Сниппет показывает места добавления свойств, а не полноценный объект. Общий тег Book обновляет все связанные активные запросы: это простой вариант для маленького каталога. Неиспользуемые связанные записи удаляются, чтобы при следующем обращении загрузились свежие данные. Invalidation не делает все копии объектов одинаковыми сама: она инициирует обновление или удаление записи. Более точные теги с id — развитие темы, здесь не обязательны.', sources: [tags]
  }),
  s('invalidation-flow', 'change', 'Что происходит после сохранения?', 'Пройдём путь от ответа PATCH до новой цены на экране.', {
    minutes: 2,
    steps: [
      ['Изменение', 'PATCH завершён', 'Сервер подтвердил новую цену.'],
      ['Метка', 'invalidate Book', 'RTK Query находит результаты, связанные с этим тегом.'],
      ['Активный запрос', 'повторный GET', 'Если результат используется, он загружается заново.'],
      ['Интерфейс', 'новая цена', 'Подписчики получают свежие данные.']
    ],
    notes: 'Пройти схему по шагам. У mutation и query разные задачи: первая сохраняет изменение, второй получает актуальное представление. Invalidation связывает эти операции. Если подписчиков нет, RTK Query удаляет затронутую запись вместо немедленного GET. В этом примере мы используем общий тег Book для списка и деталей.',
    takeaway: 'Задача 04 выполнена: сервер сохранил цену, связанные экраны получили свежие данные.', sources: [tags]
  }),
  s('full-demo', 'finish', 'Проверим заказ из начала лекции', 'Адрес книги → общий выбор → каталог без лишнего GET → новая цена на всех экранах.', {
    minutes: 4, demo: 'full',
    notes: 'Задание аудитории: добавить две разные книги; перейти на страницу первой; изменить цену; открыть корзину и объяснить результат. Затем включить ошибку следующего запроса, изменить цену ещё раз и убедиться, что сохранение не удалось. Повторить без перезагрузки. Попросить назвать владельца каждого значения: URL, quantities, цена с сервера, черновик формы. Не читать код целиком, связывать клики с предыдущими слайдами.',
    takeaway: 'Проверили четыре задачи: адреса, общий выбор, общий ответ API и обновление цены.'
  }),
  s('files', 'finish', 'Где искать каждую часть?', 'Разделим проект по понятным обязанностям.', {
    minutes: 2,
    code: code('Структура учебного приложения', `src/
  main.jsx          Provider + Router
  App.jsx           Routes + Route
  ShopLayout.jsx    общая шапка + Outlet
  ProductCard.jsx   книга + кнопка добавления
  Catalog.jsx       useGetBooksQuery
  BookPage.jsx      useParams + useGetBookQuery
  CartPage.jsx      количества + данные каталога
  PriceEditor.jsx   локальное поле + mutation
  store.js          configureStore
  cartSlice.js      правила корзины
  booksApi.js       endpoints + теги`),
    notes: 'Это схема проекта студента, а не структура исходников самой презентации. Не требуется именно такой расклад папок; важно, чтобы по имени было понятно назначение. Команда установки основного трека: npm install react-router @reduxjs/toolkit react-redux. Сценарии в презентации запускаются без внешнего API, студенческая работа использует реальный HTTP.',
    takeaway: 'npm install react-router @reduxjs/toolkit react-redux'
  }),
  s('checkpoint', 'finish', 'Проверьте себя на четырёх действиях', 'Сначала объясните результат, потом попробуйте в демонстрации.', {
    minutes: 2,
    questions: [
      ['Открыли /books/b-102. Как страница узнает, какую книгу показать?', 'React Router сопоставляет путь с /books/:bookId. useParams возвращает bookId, а useGetBookQuery(bookId) запрашивает данные нужной книги.'],
      ['Добавили книгу и перешли на другой экран. Почему количество сохранилось?', 'Store создан над маршрутами. Компоненты читают одну корзину; смена страницы не пересоздаёт store.'],
      ['Два компонента вызывают useGetBooksQuery(). Сколько запросов нужно?', 'Для одинакового ключа RTK Query использует общую запись и объединяет совпадающие запросы. Дополнительный refetch или настройки могут инициировать новое обращение.'],
      ['Изменили цену через mutation. Почему каталог должен запросить данные снова?', 'После успеха invalidatesTags помечает связанные данные. Активные запросы с providesTags обновляются, неиспользуемые записи удаляются.']
    ],
    notes: 'Не требовать терминологию слово в слово. Главное — связать действие, владельца данных и результат. При затруднении вернуться к схеме или живому магазину. Напомнить, что перезагрузка страницы отличается от клиентского перехода.'
  }),
  s('main-end', 'finish', 'Адрес. Выбор. Данные.', 'Этого разделения достаточно, чтобы начать применять инструменты.', {
    minutes: 1,
    cards: [
      ['React Router', 'Какую страницу показать?', 'URL → компонент'],
      ['Redux Toolkit', 'Что пользователь выбрал в приложении?', 'action → state → UI'],
      ['RTK Query', 'Что вернул сервер и когда обновить ответ?', 'запрос → кеш → UI']
    ],
    takeaway: 'Дальше — дополнительный вариант того же решения.',
    notes: 'На этом обязательная часть закончена. Если времени мало, дополнительный блок можно оставить для самостоятельного знакомства. У него те же задачи, те же сущности и React Router. Переход к другой библиотеке не меняет смысл данных.'
  }),
  s('alternative-map', 'extra', 'Те же задачи, другой набор инструментов', 'Дополнение для знакомства: Zustand + TanStack Query.', {
    minutes: 1,
    cards: [
      ['Корзина', 'Было: Redux Toolkit. Здесь: Zustand.', 'Общее клиентское состояние'],
      ['Книги из API', 'Было: RTK Query. Здесь: TanStack Query.', 'Серверные данные и кеш'],
      ['Страницы', 'React Router остаётся тем же.', 'Маршруты менять не нужно']
    ],
    notes: 'Эти пары выбраны для ясного сравнения в лекции, это не технический запрет на другие сочетания. React Query — React-часть TanStack Query, пакет @tanstack/react-query. Не требуется изучить оба трека одинаково глубоко или переписывать работающее приложение ради сравнения. Дальнейшие примеры используют одинаковые id и API.', sources: [zustand, 'https://tanstack.com/query/latest/docs/framework/react/installation']
  }),
  s('zustand-question', 'extra', 'Как ещё можно организовать общую корзину?', 'Нужны те же количества и общие правила добавления — попробуем другой интерфейс store.', {
    kind: 'question', minutes: 1,
    bullets: ['Один store для карточки, шапки и корзины', 'Компоненты выбирают только нужные значения', 'Правила изменения остаются рядом с состоянием'],
    notes: 'Потребность уже знакома. Это сравнение способов решения, а не новая проблема в работающей версии Redux. Предложить проследить прежний путь клика в другой записи кода.',
    takeaway: 'Как будут выглядеть создание store, чтение и добавление без Redux?'
  }),
  s('zustand-intro', 'extra', 'Zustand — ещё один store для React', 'Библиотека общего клиентского состояния: создаёт store и хук для выбора данных и действий.', {
    minutes: 1,
    cards: [
      ['Создаём один раз', 'Объект состояния и функции изменения объявляем в модуле.', 'create'],
      ['Используем в компонентах', 'Хук выбирает количество или функцию добавления.', 'Подписка'],
      ['Сохраняем разделение', 'В store лежит выбор пользователя. Запросам и кешу нужен отдельный слой.', 'Те же обязанности']
    ],
    notes: 'В выбранном варианте create возвращает хук и не требует Provider. Zustand также поддерживает другие способы организации store; их не разбираем. Это альтернатива Redux для клиентского состояния, а не замена React Router или кешу API.',
    takeaway: 'Та же задача 02: одна корзина и общий доступ к ней.', sources: [zustand]
  }),
  s('zustand', 'extra', 'Корзина на Zustand', 'Создаём store один раз, вне компонентов.', {
    minutes: 2,
    code: code('useCart.js', `import { create } from 'zustand';

export const useCart = create(set => ({
  quantities: {},
  add: id => set(state => ({
    quantities: {
      ...state.quantities,
      [id]: (state.quantities[id] || 0) + 1
    }
  }))
}));`),
    bullets: ['create возвращает хук для доступа к store', 'set обновляет состояние', 'В этом примере обновляем объект через копирование'],
    notes: 'Сравнить с cartSlice, не вводя новую предметную область. Обычный create Zustand не добавляет Immer автоматически: вложенный объект quantities копируем. Этот store общий, потому что create вызван один раз в модуле; это не несколько независимых useState внутри собственного хука. Установка: npm install zustand.', sources: [zustand]
  }),
  s('zustand-components', 'extra', 'Читаем и меняем Zustand-store', 'Смысл тот же: компонент выбирает данные и вызывает действие.', {
    minutes: 1,
    code: code('AddButton.jsx и CartBadge.jsx · фрагменты', `// Кнопка:
const add = useCart(state => state.add);
return <button onClick={() => add(book.id)}>В корзину</button>;

// Шапка:
const count = useCart(state =>
  Object.values(state.quantities)
    .reduce((sum, quantity) => sum + quantity, 0)
);
return <span>В корзине: {count}</span>;`),
    notes: 'Это два отдельных компонента с импортом useCart из ./useCart. В обычном варианте create не нужен Provider. Selector выбирает значение, и подписка реагирует на его изменение. Здесь возвращаются стабильная функция и число; не создаём новый объект из нескольких значений без осмысленного сравнения.', sources: [zustand]
  }),
  s('tanstack-question', 'extra', 'А кто будет хранить общий ответ API?', 'Корзина уже в Zustand. Для книг по-прежнему нужны запросы, статусы и обновление кеша.', {
    kind: 'question', minutes: 1,
    bullets: ['Не возвращаемся к отдельному запросу в каждом компоненте', 'Общий результат должен зависеть от ключа запроса', 'После сохранения цены нужно обновить используемые данные'],
    notes: 'Не переносить API-данные в Zustand только потому, что у нас уже есть store. Нужна та же специализация, которую в основном треке обеспечивал RTK Query. Сейчас посмотрим аналогичный путь с другой библиотекой.',
    takeaway: 'Как сохранить знакомую работу с данными API в альтернативном треке?'
  }),
  s('tanstack-intro', 'extra', 'TanStack Query управляет кешем API', 'Библиотека для загрузки и обновления серверных данных. Её React-часть также называют React Query.', {
    minutes: 1,
    cards: [
      ['Ключ + функция запроса', 'Указываем, какие данные нужны и как их загрузить.', 'useQuery'],
      ['Общий кеш и статусы', 'QueryClient хранит результаты и обслуживает подписки компонентов.', 'QueryClient'],
      ['Изменение и обновление', 'Отправляем mutation, затем обновляем записи по queryKey.', 'useMutation']
    ],
    notes: 'Смысл знаком по RTK Query: получить, сохранить, переиспользовать и обновить серверные данные. Здесь ключ и функция запроса задаются явно, а кеш живёт в QueryClient. Он не требует Redux. Сравниваем только основные механизмы; значения настроек по умолчанию у библиотек различаются.',
    takeaway: 'Те же задачи 03 и 04: общий результат API и его обновление.', sources: [tanstack]
  }),
  s('tanstack-provider', 'extra', 'У TanStack Query свой QueryClient', 'Его создаём один раз и передаём компонентам.', {
    minutes: 1,
    code: code('main.jsx · обёртка альтернативного трека', `import {
  QueryClient, QueryClientProvider
} from '@tanstack/react-query';

const queryClient = new QueryClient();

// В createRoot(...).render(...):
<QueryClientProvider client={queryClient}>
  <HashRouter>
    <App />
  </HashRouter>
</QueryClientProvider>`),
    notes: 'Фрагмент дополняет знакомую точку входа: createRoot, HashRouter и App импортируются как ранее. Redux Provider в альтернативном треке не нужен. Установка двух библиотек: npm install zustand @tanstack/react-query. React Router по-прежнему нужен. Новый QueryClient на каждом рендере создавать не следует.', sources: ['https://tanstack.com/query/latest/docs/framework/react/installation']
  }),
  s('tanstack-query', 'extra', 'Явно зададим ключ и функцию запроса', 'Для каталога используем ключ ["books"].', {
    minutes: 2,
    code: code('Catalog.jsx · TanStack Query', `import { useQuery } from '@tanstack/react-query';

const query = useQuery({
  queryKey: ['books'],
  queryFn: async ({ signal }) => {
    const response = await fetch('/api/books', { signal });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    return (await response.json()).books;
  },
  staleTime: 60_000
});

// query.data, query.isPending, query.isError, query.isFetching`),
    bullets: ['queryFn возвращает данные или выбрасывает ошибку', 'staleTime: 60 секунд считаем ответ свежим', 'Для конкретной книги: ["book", bookId]'],
    notes: 'Хук вызывается в компоненте; фрагмент опускает JSX. В TanStack Query staleTime по умолчанию 0. Устаревшие данные могут обновляться при новой подписке, фокусе окна и восстановлении сети. staleTime не таймер периодического GET и не время удаления кеша: за удаление неактивного кеша отвечает gcTime. В демо явно заданы staleTime 60000, retry false и refetchOnWindowFocus false для воспроизводимого показа. Не переносить числа и настройки RTK Query механически.', sources: [tanstack]
  }),
  s('tanstack-mutation', 'extra', 'После изменения обновим query', 'Теперь связь выражена через queryKey.', {
    minutes: 2,
    code: code('PriceEditor.jsx · фрагмент', `const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: async ({ id, price }) => {
    const response = await fetch('/api/books/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price })
    });
    if (!response.ok) throw new Error('Не удалось сохранить');
    return response.json();
  },
  onSuccess: () => queryClient.invalidateQueries({
    queryKey: ['books']
  })
});`),
    notes: 'Импорты useQueryClient и useMutation идут из @tanstack/react-query. По клику вызываем mutation.mutate({id: book.id, price: Number(price)}) после валидации; статус — mutation.isPending, ошибка — mutation.isError. Здесь страницы альтернативного демо читают один список books и находят книгу по id; поэтому достаточно инвалидировать books. Если добавили отдельный запрос [book, id], его также надо инвалидировать после успеха. invalidateQueries помечает подходящие данные устаревшими и по умолчанию обновляет активные запросы.', sources: ['https://tanstack.com/query/latest/docs/framework/react/guides/invalidations-from-mutations']
  }),
  s('alternative-demo', 'extra', 'Тот же магазин на другом стеке', 'Добавьте книгу, перейдите в корзину и измените цену.', {
    minutes: 2, demo: 'alternative',
    notes: 'В демонстрации действительно работают Zustand, TanStack Query и React Router. Детали получают книгу из общего списка, чтобы не добавлять новые endpoints ради сравнения. При смене маршрута один query остаётся в оболочке магазина, а store Zustand сохраняет количества. Кнопка изменения первой книги моделирует отдельное действие владельца. Сервер тот же по контракту, реализация ответа локальная.',
    sources: [zustand, tanstack]
  })
];
