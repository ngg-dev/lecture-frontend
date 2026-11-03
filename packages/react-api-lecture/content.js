/* Сценарий лекции: один каталог развивается по шагам. */
window.LECTURE = {
  "title": "React и API",
  "subtitle": "От знакомой карточки к каталогу с живыми данными",
  "duration": 70,
  "chapters": [
    {
      "id": "bridge",
      "title": "Знакомая карточка и данные",
      "minutes": 5.5
    },
    {
      "id": "lists",
      "title": "Из массива в каталог",
      "minutes": 9
    },
    {
      "id": "http",
      "title": "Загружаем книги по кнопке",
      "minutes": 6.5
    },
    {
      "id": "states",
      "title": "Объясняем состояние запроса",
      "minutes": 12
    },
    {
      "id": "effects",
      "title": "Загружаем при появлении каталога",
      "minutes": 15
    },
    {
      "id": "api",
      "title": "Выносим работу с API",
      "minutes": 8
    },
    {
      "id": "middleware",
      "title": "Интерсепторы и результат",
      "minutes": 4
    },
    {
      "id": "projects",
      "title": "Где взять API для текущей лабораторной работы",
      "minutes": 10
    }
  ],
  "slides": [
    {
      "id": "cover",
      "chapter": "bridge",
      "minutes": 0.5,
      "kicker": "Лекция 02 · 70 минут + 20 минут практики",
      "title": "React и API",
      "lead": "В прошлый раз мы сделали магазин с корзиной. Сегодня соберем каталог из массива, загрузим книги по кнопке, а затем — при открытии каталога.",
      "layout": "cover",
      "bullets": [
        "Покажем несколько знакомых карточек",
        "Загрузим те же книги по кнопке",
        "Научим каталог загружаться при открытии"
      ],
      "callout": "Один магазин, один каталог — добавляем возможности по шагам.",
      "notes": "30 секунд. Обозначить продолжение предыдущей лекции: ProductCard и добавление в корзину уже знакомы. Сегодня изменяем источник данных, а не начинаем новое приложение на каждом слайде. Основная лекция — ровно 70 минут, затем 20 минут практики. Последние 10 минут основной части отведены трем источникам API для текущей лабораторной работы."
    },
    {
      "id": "starting-point",
      "chapter": "bridge",
      "minutes": 1,
      "kicker": "От магазина к каталогу",
      "title": "Задача: собрать каталог книг",
      "lead": "Продолжаем книжный магазин: соберем каталог из данных.",
      "layout": "flow",
      "steps": [
        {
          "label": "Дано",
          "text": "Магазин книг: знакомая карточка и корзина"
        },
        {
          "label": "Нужно",
          "text": "Показать карточку для каждой книги в каталоге"
        }
      ],
      "callout": "Сначала соберем карточки из массива, затем получим этот массив с сервера.",
      "notes": "1 минута. Обозначить конкретную задачу: в знакомом магазине есть карточка и корзина; теперь нужен каталог из нескольких книг. Не перечислять навыки React или JavaScript. Начать с данных и знакомого ProductCard.",
      "sources": [
        {
          "label": "Предыдущая лекция: React и книжный магазин",
          "url": "https://ngg-dev.github.io/react-lecture/"
        }
      ]
    },
    {
      "id": "known",
      "minutes": 2,
      "productPreview": 1,
      "clickCodeExpression": "() => onAdd(book)",
      "chapter": "bridge",
      "kicker": "Точка опоры",
      "title": "Карточка уже умеет показывать книгу",
      "lead": "JSX, props, useState и обработчики событий остаются нашей основой.",
      "layout": "code",
      "code": {
        "file": "ProductCard.jsx · знакомый компонент",
        "executionExpression": "() => onAdd(book)",
        "semanticLegend": true,
        "language": "js",
        "text": "export function ProductCard({ book, onAdd }) {\n  return (\n    <article>\n      <h3>{book.title}</h3>\n      <p>{book.author}</p>\n      <p>{book.price} ₽</p>\n      <button onClick={() => onAdd(book)}>\n        В корзину\n      </button>\n    </article>\n  );\n}",
        "highlight": [
          1
        ]
      },
      "callout": "Props — значения, которые родитель передает компоненту. Здесь book — объект книги, а onAdd — функция, которую карточка вызывает при клике.",
      "notes": "2 минуты. Вопрос аудитории: кто должен хранить общую корзину — каждая карточка или общий родитель? Ожидаемый ответ: общий родитель, карточке передаем callback. Здесь book — объект, но это тот же механизм props, который уже проходили; при старом интерфейсе с отдельными props можно передавать title/author/price по отдельности. Выделить onClick: передаем функцию, а не вызываем onAdd при рендере. Сетевых запросов у карточки не будет."
    },
    {
      "id": "books-array",
      "chapter": "bridge",
      "minutes": 2,
      "kicker": "Шаг 1 · данные уже у нас",
      "title": "Как описать три книги для той же карточки?",
      "lead": "Каждая книга — объект с привычными полями. Несколько книг складываем в массив books.",
      "layout": "code",
      "code": {
        "file": "books.js · пока храним данные в коде",
        "language": "js",
        "text": "export const books = [\n  {\n    id: 'b-101', title: 'Мастер и Маргарита',\n    author: 'Михаил Булгаков', price: 690\n  },\n  {\n    id: 'b-102', title: 'Пикник на обочине',\n    author: 'Аркадий и Борис Стругацкие', price: 540\n  },\n  {\n    id: 'b-103', title: 'Солярис',\n    author: 'Станислав Лем', price: 620\n  }\n];",
        "highlight": [
          1,
          3,
          7,
          11
        ]
      },
      "notes": "2 минуты. Сначала найти в первом объекте знакомые title, author и price из ProductCard. Затем показать границы объекта и массива: фигурные и квадратные скобки. Во всех примерах занятия сохраняем эти три книги и цены. Новое поле id обозначает конкретную книгу; это не ее номер на экране. price оставляем числом, символ рубля добавляет карточка. Переход: данные трех книг уже есть — теперь нужно получить из них три карточки."
    },
    {
      "id": "map-idea",
      "chapter": "lists",
      "minutes": 4.5,
      "kicker": "Шаг 2 · одна операция для каждого объекта",
      "title": "Как получить карточку для каждой книги?",
      "lead": "map берет каждый объект book и возвращает JSX карточки. Три объекта — три карточки.",
      "layout": "demo",
      "notes": "4,5 минуты. Сопоставить каждый объект в массиве с карточкой справа. Прочитать books.map: для каждой книги callback возвращает ProductCard. Не вводить промежуточный массив названий. book передает данные одной книги, onAdd — знакомую функцию корзины. React отображает массив JSX. Для четырех объектов будет четыре карточки, для пустого массива — ни одной. key прочитать как устойчивую метку книги и перейти к следующему демо.",
      "sources": [
        {
          "label": "React: списки элементов",
          "url": "https://react.dev/learn/rendering-lists"
        }
      ],
      "demo": "catalog-story",
      "demoOptions": {
        "stage": "map"
      }
    },
    {
      "id": "keys",
      "chapter": "lists",
      "minutes": 3,
      "kicker": "Шаг 2 · узнаем книгу после перестановки",
      "title": "Зачем карточке key, если название уже видно?",
      "lead": "React использует key, чтобы сопоставить элементы списка между обновлениями. Стабильный id остается у той же книги.",
      "layout": "demo",
      "demo": "keys",
      "bullets": [
        "«Пикник» уже отмечен в обеих колонках",
        "Удалите первую книгу",
        "Сравните, у какой книги осталась отметка"
      ],
      "callout": "Для нашего каталога: key={book.id}. Индекс обозначает позицию, а не книгу.",
      "notes": "3 минуты. «Пикник» отмечен сразу. Нажать «Удалить первую книгу»: при стабильном id отметка остается у «Пикника», при индексе переезжает к «Солярису». Учебная симуляция сохраняет локальное состояние строки в Map по key. key уникален среди соседей и стоит на элементе, непосредственно возвращаемом map. Индекс допустим, если состав и порядок списка не меняются.",
      "sources": [
        {
          "label": "React: правила key",
          "url": "https://react.dev/learn/rendering-lists#rules-of-keys"
        }
      ]
    },
    {
      "id": "local-catalog",
      "chapter": "lists",
      "minutes": 1.5,
      "kicker": "Первый результат · каталог из массива",
      "title": "Что мы уже собрали без сервера?",
      "lead": "Три объекта стали тремя карточками. Кнопки добавления в корзину продолжают работать.",
      "layout": "demo",
      "demo": "catalog-story",
      "demoOptions": {
        "stage": "local"
      },
      "notes": "1,5 минуты. Показать локальный каталог и добавить книгу в корзину. Попросить аудиторию назвать путь одной книги: массив → map → props → ProductCard. Здесь нет запроса: данные уже находятся в коде. Зафиксировать завершенный результат, прежде чем добавлять сеть. Переход: владелец магазина изменил цену — в текущей версии придется менять код и выпускать новую сборку."
    },
    {
      "id": "need-api",
      "chapter": "http",
      "minutes": 1,
      "kicker": "Шаг 3 · меняем источник данных",
      "title": "Как магазину получать книги с сервера?",
      "lead": "Пусть сервер хранит каталог, а React запрашивает актуальные данные через API.",
      "layout": "flow",
      "steps": [
        {
          "label": "Данные",
          "text": "Массив книг есть на бэкенде"
        },
        {
          "label": "Следующий шаг",
          "text": "Кнопка отправляет GET /api/books"
        },
        {
          "label": "Результат",
          "text": "Ответ становится массивом books в состоянии"
        }
      ],
      "callout": "API — договор о том, как получить данные от другой программы.",
      "notes": "1 минута. Объяснить необходимость сети конкретным изменением цены или добавлением новой книги. API здесь — доступный по HTTP адрес с оговоренным форматом ответа. Начнем с кнопки, потому что обработчики событий уже знакомы. Пока не обсуждать useEffect: сначала студент должен увидеть весь путь от клика до новых карточек."
    },
    {
      "id": "contract",
      "chapter": "http",
      "minutes": 2,
      "kicker": "Шаг 3 · договариваемся с сервером",
      "title": "Что отправляем и что ждем в ответ?",
      "lead": "GET /api/books запрашивает каталог. Сервер отвечает JSON-объектом с массивом books.",
      "layout": "split",
      "bullets": [
        "GET — получить данные",
        "/api/books — адрес нашего каталога",
        "200 — успешный ответ",
        "500 — пример ошибки сервера"
      ],
      "code": {
        "file": "Ответ GET /api/books · одна книга для примера",
        "language": "js",
        "text": "{\n  \"books\": [\n    {\n      \"id\": \"b-101\",\n      \"title\": \"Мастер и Маргарита\",\n      \"author\": \"Михаил Булгаков\",\n      \"price\": 690\n    }\n  ]\n}",
        "highlight": [
          2,
          4,
          5,
          7
        ]
      },
      "callout": "Те же id, title, author и price — ProductCard уже понимает эти данные.",
      "notes": "2 минуты. Сравнить объект с локальным массивом: поля сохранились, появилась внешняя обертка books. JSON — текстовый формат данных; сервер не присылает наш React-компонент. После чтения ответа нам понадобится data.books. Реальный успешный ответ может содержать все три книги или пустой массив. Зафиксировать учебный контракт: 200 с JSON и полем books, даже если книг нет. Путь /api/books в примерах предполагает заранее подготовленный API или прокси учебного проекта."
    },
    {
      "id": "click-load",
      "chapter": "http",
      "minutes": 3.5,
      "kicker": "Шаг 3 · соединяем запрос с React",
      "title": "Как показать загруженные книги после клика?",
      "lead": "Знакомый fetch возвращает книги. Обработчик клика сохраняет их в useState, и React обновляет карточки.",
      "layout": "code",
      "code": {
        "file": "Catalog.jsx · полный компонент",
        "language": "js",
        "text": "import { useState } from 'react';\nimport { BookList } from './BookList.jsx';\n\nexport function Catalog({ onAdd }) {\n  const [books, setBooks] = useState([]);\n\n  async function loadBooks() {\n    const result = await requestBooks();\n    setBooks(result);\n  }\n\n  return (\n    <section aria-live=\"polite\">\n      <button\n        onClick={loadBooks}\n      >\n        Загрузить книги\n      </button>\n      <BookList books={books} onAdd={onAdd} />\n    </section>\n  );\n}",
        "fullComponent": true,
        "splitAt": 12,
        "highlight": [
          5,
          8,
          9,
          15
        ]
      },
      "supportCode": {
        "file": "Catalog.jsx · над компонентом",
        "language": "js",
        "text": "async function requestBooks() {\n  const res = await fetch('/api/books');\n  if (!res.ok) {\n    throw new Error('HTTP ' + res.status);\n  }\n  const data = await res.json();\n  return data.books;\n}"
      },
      "callout": "Клик → запрос → setBooks → те же карточки.",
      "notes": "3,5 минуты. Видны импорты useState и BookList и весь компонент. books теперь приходит из состояния, поэтому начинаем с пустого массива. Показать обработчик loadBooks: знакомый onClick запускает функцию, await получает книги, setter просит React показать новое состояние. Объяснить различие requestBooks и loadBooks: первая знает запрос, вторая соединяет результат с интерфейсом. Это промежуточная версия только для успешного ответа. При медленном запросе экран пока ничего не объясняет, при ошибке обработчика еще нет — следующие шаги решат эти видимые проблемы."
    },
    {
      "id": "loading",
      "chapter": "states",
      "minutes": 3,
      "kicker": "Шаг 4 · ожидание становится видимым",
      "title": "Как показать, что клик сработал?",
      "lead": "Добавим status: до запроса idle, во время запроса loading, после успеха success.",
      "layout": "code",
      "code": {
        "file": "Catalog.jsx · полный компонент",
        "language": "js",
        "text": "import { useState } from 'react';\nimport { BookList } from './BookList.jsx';\n\nexport function Catalog({ onAdd }) {\n  const [books, setBooks] = useState([]);\n  const [status, setStatus] = useState('idle');\n\n  async function loadBooks() {\n    setStatus('loading');\n    const result = await requestBooks();\n    setBooks(result);\n    setStatus('success');\n  }\n\n  return (\n    <section aria-live=\"polite\">\n      <button\n        onClick={loadBooks}\n        disabled={status === 'loading'}\n      >\n        Загрузить книги\n      </button>\n      {status === 'idle' && <p>Нажмите кнопку загрузки.</p>}\n      {status === 'loading' && <p>Загружаем книги…</p>}\n      {status === 'success' && (\n        <BookList books={books} onAdd={onAdd} />\n      )}\n    </section>\n  );\n}",
        "fullComponent": true,
        "splitAt": 15,
        "highlight": [
          6,
          9,
          12,
          19,
          24
        ]
      },
      "callout": "На время loading отключим кнопку: disabled={status === 'loading'}.",
      "notes": "3 минуты. Связать каждое изменение status со временем запроса. setStatus(loading) стоит до await, иначе ожидание останется невидимым. setStatus(success) идет после записи массива. Отключенная кнопка не дает запускать одинаковые попытки одну поверх другой в этой простой версии. books хранит данные, status объясняет происходящее; это две разные задачи. Здесь по-прежнему только успешный путь: если requestBooks завершится ошибкой, status останется loading. Так возникает необходимость catch на следующем слайде.",
      "supportCode": {
        "file": "Catalog.jsx · над компонентом",
        "language": "js",
        "text": "async function requestBooks() {\n  const res = await fetch('/api/books');\n  if (!res.ok) {\n    throw new Error('HTTP ' + res.status);\n  }\n  const data = await res.json();\n  return data.books;\n}"
      }
    },
    {
      "id": "error",
      "chapter": "states",
      "minutes": 3,
      "kicker": "Шаг 4 · запрос может не удаться",
      "title": "Как закончить ожидание, если сервер не ответил как нужно?",
      "lead": "try выполняет успешный путь. catch переводит каталог в error, если запрос завершился ошибкой.",
      "layout": "code",
      "code": {
        "file": "Catalog.jsx · полный компонент",
        "language": "js",
        "text": "import { useState } from 'react';\nimport { BookList } from './BookList.jsx';\n\nexport function Catalog({ onAdd }) {\n  const [books, setBooks] = useState([]);\n  const [status, setStatus] = useState('idle');\n\n  async function loadBooks() {\n    setStatus('loading');\n    try {\n      const result = await requestBooks();\n      setBooks(result);\n      setStatus('success');\n    } catch {\n      setStatus('error');\n    }\n  }\n\n  return (\n    <section aria-live=\"polite\">\n      <button\n        onClick={loadBooks}\n        disabled={status === 'loading'}\n      >\n        Загрузить книги\n      </button>\n      {status === 'idle' && <p>Нажмите кнопку загрузки.</p>}\n      {status === 'loading' && <p>Загружаем книги…</p>}\n      {status === 'error' && (\n        <div>\n          <p>Не удалось загрузить книги.</p>\n        </div>\n      )}\n      {status === 'success' && (\n        <BookList books={books} onAdd={onAdd} />\n      )}\n    </section>\n  );\n}",
        "fullComponent": true,
        "splitAt": 19,
        "highlight": [
          10,
          14,
          15,
          31
        ]
      },
      "callout": "Новая попытка снова начинает с loading — прежняя ошибка исчезает.",
      "notes": "3 минуты. Мысленно пройти два пути. Успешный запрос возвращает массив и доходит до success. throw из response.ok, сбой сети или ошибка чтения JSON прерывают try и ведут в catch. В учебном интерфейсе показываем фиксированное понятное сообщение, поэтому отдельный error state пока не нужен. status всегда получает конечное значение success или error; отдельный finally в этой модели не требуется. Попросить найти, какая строка закончила ожидание в каждом пути. Старые книги могут оставаться в памяти, но видимую ветку выбираем по status.",
      "supportCode": {
        "file": "Catalog.jsx · над компонентом",
        "language": "js",
        "text": "async function requestBooks() {\n  const res = await fetch('/api/books');\n  if (!res.ok) {\n    throw new Error('HTTP ' + res.status);\n  }\n  const data = await res.json();\n  return data.books;\n}"
      }
    },
    {
      "id": "empty",
      "chapter": "states",
      "minutes": 2,
      "kicker": "Шаг 4 · успешный ответ не всегда содержит книги",
      "title": "Пустой массив — это ошибка или результат?",
      "lead": "Если запрос успешен, books: [] означает «книг нет». Покажем отдельное сообщение.",
      "layout": "code",
      "code": {
        "file": "Catalog.jsx · полный компонент",
        "language": "js",
        "text": "import { useState } from 'react';\nimport { BookList } from './BookList.jsx';\n\nexport function Catalog({ onAdd }) {\n  const [books, setBooks] = useState([]);\n  const [status, setStatus] = useState('idle');\n\n  async function loadBooks() {\n    setStatus('loading');\n    try {\n      const result = await requestBooks();\n      setBooks(result);\n      setStatus('success');\n    } catch {\n      setStatus('error');\n    }\n  }\n\n  return (\n    <section aria-live=\"polite\">\n      <button\n        onClick={loadBooks}\n        disabled={status === 'loading'}\n      >\n        Загрузить книги\n      </button>\n      {status === 'idle' && <p>Нажмите кнопку загрузки.</p>}\n      {status === 'loading' && <p>Загружаем книги…</p>}\n      {status === 'error' && (\n        <div>\n          <p>Не удалось загрузить книги.</p>\n        </div>\n      )}\n      {status === 'success' && (\n        books.length === 0\n          ? <p>В каталоге пока нет книг.</p>\n          : <BookList books={books} onAdd={onAdd} />\n      )}\n    </section>\n  );\n}",
        "fullComponent": true,
        "splitAt": 19,
        "highlight": [
          35,
          36
        ]
      },
      "callout": "После старта запроса у каталога четыре варианта: загрузка, ошибка, пусто или книги.",
      "notes": "2 минуты. Не вводим status=empty: пустота вычисляется из успешного статуса и длины массива. До первого клика есть дополнительное исходное состояние idle, поэтому начальное books=[] не превращается в сообщение об отсутствии книг. Показать, что каждая строка JSX отвечает одному знакомому сценарию. Данные отображаются только при success. Кнопка находится над этой секцией и доступна независимо от выбранной ветки.",
      "supportCode": {
        "file": "Catalog.jsx · над компонентом",
        "language": "js",
        "text": "async function requestBooks() {\n  const res = await fetch('/api/books');\n  if (!res.ok) {\n    throw new Error('HTTP ' + res.status);\n  }\n  const data = await res.json();\n  return data.books;\n}"
      }
    },
    {
      "id": "retry",
      "chapter": "states",
      "minutes": 1.5,
      "kicker": "Шаг 4 · даем возможность восстановиться",
      "title": "Что делать пользователю после ошибки?",
      "lead": "Та же кнопка повторно вызывает loadBooks. При ошибке меняем ее подпись на «Повторить».",
      "layout": "code",
      "code": {
        "file": "Catalog.jsx · полный компонент",
        "language": "js",
        "text": "import { useState } from 'react';\nimport { BookList } from './BookList.jsx';\n\nexport function Catalog({ onAdd }) {\n  const [books, setBooks] = useState([]);\n  const [status, setStatus] = useState('idle');\n\n  async function loadBooks() {\n    setStatus('loading');\n    try {\n      const result = await requestBooks();\n      setBooks(result);\n      setStatus('success');\n    } catch {\n      setStatus('error');\n    }\n  }\n\n  return (\n    <section aria-live=\"polite\">\n      <button\n        onClick={loadBooks}\n        disabled={status === 'loading'}\n      >\n        {status === 'error' ? 'Повторить' : 'Загрузить книги'}\n      </button>\n      {status === 'idle' && <p>Нажмите кнопку загрузки.</p>}\n      {status === 'loading' && <p>Загружаем книги…</p>}\n      {status === 'error' && (\n        <div>\n          <p>Не удалось загрузить книги.</p>\n        </div>\n      )}\n      {status === 'success' && (\n        books.length === 0\n          ? <p>В каталоге пока нет книг.</p>\n          : <BookList books={books} onAdd={onAdd} />\n      )}\n    </section>\n  );\n}",
        "fullComponent": true,
        "splitAt": 19,
        "highlight": [
          25
        ]
      },
      "steps": [
        {
          "label": "Ошибка",
          "text": "Показываем сообщение и доступную кнопку"
        },
        {
          "label": "Повторить",
          "text": "loadBooks снова устанавливает loading"
        },
        {
          "label": "Новый ответ",
          "text": "Показываем книги, пустоту или новую ошибку"
        }
      ],
      "notes": "1,5 минуты. Для запроса по кнопке не нужен отдельный счетчик повторов: просто еще раз вызываем тот же обработчик. Не дублируем fetch во второй функции. Изменение status на loading скрывает сообщение старой ошибки, а disabled блокирует повторные клики до завершения. Попросить назвать две строки, которые позволяют восстановиться после ошибки: onClick={loadBooks} и setStatus(loading) в начале обработчика.",
      "supportCode": {
        "file": "Catalog.jsx · над компонентом",
        "language": "js",
        "text": "async function requestBooks() {\n  const res = await fetch('/api/books');\n  if (!res.ok) {\n    throw new Error('HTTP ' + res.status);\n  }\n  const data = await res.json();\n  return data.books;\n}"
      }
    },
    {
      "id": "request-demo",
      "chapter": "states",
      "minutes": 2.5,
      "kicker": "Второй результат · каталог загружается по кнопке",
      "title": "Как ведет себя наш каталог при разных ответах?",
      "lead": "Выберите результат запроса и загрузите те же книги. Демо моделирует сеть с задержкой.",
      "layout": "demo",
      "demo": "catalog",
      "demoOptions": {
        "stage": "request"
      },
      "bullets": [
        "Успех → три прежние карточки",
        "Пустой ответ → сообщение без карточек",
        "Ошибка → сообщение и «Повторить»",
        "Пока идет запрос → загрузка и отключенная кнопка"
      ],
      "callout": "Проверяем цепочку: ошибка → повтор → успех.",
      "notes": "2,5 минуты. Перед каждой попыткой попросить предсказать видимую ветку, затем запустить. Показать успешный ответ, пустой и ошибку с повтором. Это симулятор, а не настоящий серверный запрос. В рабочем учебном приложении можно открыть Network и увидеть URL, Status, Response и время ожидания; в симуляторе их заменяет наглядный журнал. Подвести итог этапа: ни ProductCard, ни BookList не пришлось переписывать. Новые данные и состояние запроса сосредоточены в Catalog."
    },
    {
      "id": "need-effect",
      "chapter": "effects",
      "minutes": 1,
      "kicker": "Шаг 5 · убираем лишний клик",
      "title": "Что если я хочу, чтобы запрос делался в момент открытия страницы?",
      "lead": "При открытии каталога книги нужны сразу. Теперь запуск запроса связываем с появлением компонента.",
      "layout": "flow",
      "steps": [
        {
          "label": "Было",
          "text": "Клик → loadBooks → запрос"
        },
        {
          "label": "Нужно",
          "text": "Каталог появился → запрос"
        },
        {
          "label": "Остается",
          "text": "Те же books, status и четыре варианта интерфейса"
        }
      ],
      "notes": "1 минута. Показать реальное ожидание посетителя: открыл раздел книг и увидел загрузку без служебного клика. Запрос по кнопке был правильным для предыдущей задачи. Теперь требование изменилось — запрос должен сопровождать появление компонента. Новый Hook нужен именно для этой связи. Кнопка «Повторить» после ошибки останется."
    },
    {
      "id": "effect-overview",
      "chapter": "effects",
      "minutes": 2,
      "kicker": "Шаг 5 · знакомимся с useEffect",
      "title": "Что такое useEffect и как он работает?",
      "lead": "Передаем React функцию, которую он запускает после завершенного обновления. Массив зависимостей определяет повторные запуски.",
      "layout": "compare",
      "callout": "Сначала React обновляет интерфейс, затем запускает функцию эффекта — например, начинает загрузку книг.",
      "notes": "2 минуты. Передаем React функцию и необязательный массив зависимостей. React запускает функцию после завершенного обновления компонента; это не гарантия запуска после отрисовки браузером. [] означает подключение; [bookId] — подключение и изменение выбранного id; без массива — каждое завершенное обновление. Здесь три отдельные иллюстрации, которые только пишут в консоль, а не новый сценарий каталога. React сравнивает зависимости через Object.is. Меняющиеся props и state, которые читает эффект, перечисляют в зависимостях. StrictMode в разработке может выполнить дополнительный проверочный цикл эффекта.",
      "sources": [
        {
          "label": "React: useEffect",
          "url": "https://react.dev/reference/react/useEffect"
        }
      ],
      "flowDirection": "vertical",
      "cards": [
        {
          "title": "Пустой массив []",
          "text": "При подключении компонента.",
          "code": "useEffect(() => {\n  console.log('Каталог подключен');\n}, []);"
        },
        {
          "title": "[bookId]",
          "text": "При подключении и изменении выбранного bookId.",
          "code": "useEffect(() => {\n  console.log('Выбрана книга', bookId);\n}, [bookId]);"
        },
        {
          "title": "Без массива",
          "text": "После каждого завершенного обновления.",
          "code": "useEffect(() => {\n  console.log('Обновление завершено');\n});"
        }
      ]
    },
    {
      "id": "render-effect",
      "chapter": "effects",
      "minutes": 1.5,
      "kicker": "Шаг 5 · выбираем место для запроса",
      "title": "Почему не вызвать запрос прямо в теле Catalog?",
      "lead": "React снова вызывает компонент при изменении состояния. Запрос в его теле будет запускаться снова.",
      "layout": "code",
      "callout": "Риск бесконечного цикла запросов: рендер → запрос → setBooks → новый рендер → новый запрос.",
      "notes": "1,5 минуты. Полный НЕПРАВИЛЬНЫЙ компонент показываем только как код; не запускаем его. Запрос стоит прямо в теле Catalog. Успешный ответ дает новый массив, setBooks меняет состояние, React повторно вызывает компонент, и тот опять начинает запрос. catch обрабатывает ошибку, но не исправляет размещение запроса. Тело компонента вычисляет JSX. Обработчик выполняется по действию пользователя; эффект запускает переданную функцию после завершенного обновления. Следующий слайд переносит запрос в useEffect.",
      "sources": [
        {
          "label": "React: синхронизация с эффектами",
          "url": "https://react.dev/learn/synchronizing-with-effects"
        }
      ],
      "code": {
        "file": "Catalog.jsx · так делать не нужно",
        "language": "js",
        "text": "import { useState } from 'react';\nimport { BookList } from './BookList.jsx';\n\nexport function Catalog({ onAdd }) {\n  const [books, setBooks] = useState([]);\n  const [status, setStatus] = useState('loading');\n\n  // Неправильно: запрос запускается в теле компонента.\n  requestBooks()\n    .then((result) => {\n      setBooks(result);\n      setStatus('success');\n    })\n    .catch(() => setStatus('error'));\n\n  return (\n    <section aria-live=\"polite\">\n      {status === 'loading' && <p>Загружаем книги…</p>}\n      {status === 'error' && (\n        <div>\n          <p>Не удалось загрузить книги.</p>\n        </div>\n      )}\n      {status === 'success' && (\n        <BookList books={books} onAdd={onAdd} />\n      )}\n    </section>\n  );\n}",
        "fullComponent": true,
        "splitAt": 16,
        "highlight": [
          9,
          11
        ],
        "intent": "warning"
      },
      "supportCode": {
        "file": "Catalog.jsx · над компонентом",
        "language": "js",
        "text": "async function requestBooks() {\n  const res = await fetch('/api/books');\n  if (!res.ok) {\n    throw new Error('HTTP ' + res.status);\n  }\n  const data = await res.json();\n  return data.books;\n}"
      },
      "calloutTone": "danger"
    },
    {
      "id": "effect-load",
      "chapter": "effects",
      "minutes": 3,
      "kicker": "Шаг 5 · переносим знакомый запрос",
      "title": "Как запустить загрузку при появлении каталога?",
      "lead": "Внутри useEffect запускаем знакомую async-функцию. Обработка успеха и ошибки остается прежней.",
      "layout": "code",
      "code": {
        "file": "Catalog.jsx · полный компонент",
        "language": "js",
        "text": "import { useEffect, useState } from 'react';\nimport { BookList } from './BookList.jsx';\n\nexport function Catalog({ onAdd }) {\n  const [books, setBooks] = useState([]);\n  const [status, setStatus] = useState('loading');\n\n  useEffect(() => {\n    async function load() {\n      setStatus('loading');\n      try {\n        const result = await requestBooks();\n        setBooks(result);\n        setStatus('success');\n      } catch {\n        setStatus('error');\n      }\n    }\n    load();\n  }, []);\n\n  return (\n    <section aria-live=\"polite\">\n      {status === 'loading' && <p>Загружаем книги…</p>}\n      {status === 'error' && (\n        <div>\n          <p>Не удалось загрузить книги.</p>\n        </div>\n      )}\n      {status === 'success' && (\n        books.length === 0\n          ? <p>В каталоге пока нет книг.</p>\n          : <BookList books={books} onAdd={onAdd} />\n      )}\n    </section>\n  );\n}",
        "fullComponent": true,
        "splitAt": 22,
        "highlight": [
          8,
          9,
          19,
          20
        ]
      },
      "callout": "async находится у внутренней load. Сам callback useEffect остается обычной функцией.",
      "notes": "3 минуты. Подсветить только новую оболочку вокруг уже знакомого запроса: useEffect, внутренняя load, ее вызов и массив зависимостей. requestBooks по-прежнему объявлена рядом с компонентом, вне его тела. Callback эффекта должен возвращать функцию завершения или ничего; async callback возвращал бы Promise, поэтому async ставим у load. Пустой массив означает, что эффект не читает меняющиеся значения компонента. Начальный status установлен в loading: ожидание видно сразу. Этот пример показывает начальный запрос. Одновременные запросы и отмену здесь не разбираем. В режиме разработки React StrictMode может выполнить дополнительный цикл проверки эффекта.",
      "sources": [
        {
          "label": "React: useEffect",
          "url": "https://react.dev/reference/react/useEffect"
        }
      ],
      "supportCode": {
        "file": "Catalog.jsx · над компонентом",
        "language": "js",
        "text": "async function requestBooks() {\n  const res = await fetch('/api/books');\n  if (!res.ok) {\n    throw new Error('HTTP ' + res.status);\n  }\n  const data = await res.json();\n  return data.books;\n}"
      }
    },
    {
      "id": "need-custom-hook",
      "chapter": "effects",
      "minutes": 1,
      "kicker": "Шаг 5 · новая задача после автозагрузки",
      "title": "Автозагрузка есть. Как теперь повторить запрос?",
      "lead": "Каталог загружает книги при открытии. Теперь вернём кнопку «Повторить» и сделаем код компонента понятнее.",
      "layout": "compare",
      "cards": [
        {
          "title": "Что сейчас мешает",
          "text": "В Catalog собраны состояние, запрос и разметка. Функция load объявлена внутри эффекта — кнопка снаружи не может её вызвать.",
          "code": "Catalog: books + status + запрос + JSX"
        },
        {
          "title": "Как хотим разделить работу",
          "text": "Вынесем состояние и загрузку в отдельную функцию с React-хуками. Catalog будет получать данные и функцию повтора и показывать результат.",
          "code": "Логика загрузки → books, status, reload → Catalog"
        }
      ],
      "callout": "Назовём эту функцию useBooks. Это собственный хук — дальше разберём, как его написать.",
      "notes": "1 минута. Связать с предыдущим слайдом: load объявлена внутри callback эффекта, поэтому кнопка в JSX не может обратиться к ней напрямую. Одновременно Catalog управляет запросом и рисует состояния. Сформулировать задачу: сохранить автозагрузку, вернуть повтор после ошибки и отделить логику данных от отображения. Один из способов — собственный useBooks, который возвращает books, status и reload. Хук — выбор организации кода: повтор можно реализовать и внутри компонента, но здесь выносим связанную логику для понятного Catalog и повторного использования. Следующий слайд объясняет правила и назначение собственных хуков; затем показываем два полных файла."
    },
    {
      "id": "custom-hooks",
      "chapter": "effects",
      "minutes": 2,
      "kicker": "Шаг 5 · собираем логику в свой хук",
      "title": "Зачем нужен собственный хук useBooks?",
      "lead": "Вынесем состояние и загрузку в useBooks. Собственный хук — JavaScript-функция, которая объединяет React-хуки и связанную с ними логику.",
      "layout": "compare",
      "cards": [
        {
          "title": "useBooks: данные и загрузка",
          "text": "Обычная, не async функция. Внутри — useState и useEffect. Наружу — books, status и функция reload.",
          "code": "const { books, status, reload } = useBooks();"
        },
        {
          "title": "Где его вызывать",
          "text": "useState и useEffect вызываем на верхнем уровне компонента или другого хука. Так порядок вызовов остается одинаковым при каждом рендере.",
          "code": "// В теле Catalog, до return\nconst catalog = useBooks();\n// Без условий, циклов и обработчиков"
        },
        {
          "title": "reload: действие по клику",
          "text": "Это обычная функция, которую вернул хук. Ее можно передать обработчику события.",
          "code": "<button onClick={reload}>Повторить</button>"
        }
      ],
      "callout": "Имя use + заглавная буква — соглашение для линтера и инструментов. Каждый вызов useBooks имеет собственное состояние.",
      "notes": "2 минуты. Собственный хук позволяет вынести повторяемую логику состояния и эффектов из JSX. React-хуки можно вызывать в компоненте или другом хуке, потому что эти вызовы участвуют в рендере и сохраняют постоянный порядок. Произвольная обычная функция может вызываться условно или по событию и такого контракта не имеет. Имя useBooks само по себе не дает магического разрешения во время выполнения: это соглашение, которое позволяет линтеру распознавать хук и проверять правила. Хук не async: во время рендера он сразу возвращает текущие books, status и reload. Async может быть функция загрузки внутри. Два вызова хука разделяют логику, но не один общий state. reload не вызывает хуки и подходит для onClick.",
      "sources": [
        {
          "label": "React: собственные хуки",
          "url": "https://react.dev/learn/reusing-logic-with-custom-hooks"
        },
        {
          "label": "React: правила хуков",
          "url": "https://react.dev/reference/rules/rules-of-hooks"
        }
      ]
    },
    {
      "id": "dependencies",
      "chapter": "effects",
      "minutes": 3,
      "kicker": "Шаг 5 · автозагрузка и повтор",
      "title": "Как useBooks загружает книги и возвращает reload?",
      "lead": "Хук управляет загрузкой. Catalog читает состояние и вызывает reload после ошибки.",
      "layout": "files",
      "fileLayout": "paired",
      "codeFiles": [
        {
          "file": "useBooks.js",
          "language": "js",
          "text": "import { useCallback, useEffect, useState } from 'react';\n\nasync function requestBooks() {\n  const response = await fetch('/api/books');\n  if (!response.ok) {\n    throw new Error('HTTP ' + response.status);\n  }\n  const data = await response.json();\n  return data.books;\n}\n\nexport function useBooks() {\n  const [books, setBooks] = useState([]);\n  const [status, setStatus] = useState('loading');\n  const reload = useCallback(async () => {\n    setStatus('loading');\n    try {\n      const result = await requestBooks();\n      setBooks(result);\n      setStatus('success');\n    } catch {\n      setStatus('error');\n    }\n  }, []);\n\n  useEffect(() => { reload(); }, [reload]);\n  return { books, status, reload };\n}"
        },
        {
          "file": "Catalog.jsx",
          "language": "js",
          "text": "import { BookList } from './BookList.jsx';\nimport { useBooks } from './useBooks.js';\n\nexport function Catalog({ onAdd }) {\n  const { books, status, reload } = useBooks();\n\n  return (\n    <section aria-live=\"polite\">\n      {status === 'loading' && <p>Загружаем книги…</p>}\n      {status === 'error' && (\n        <div>\n          <p>Не удалось загрузить книги.</p>\n          <button onClick={reload}>Повторить</button>\n        </div>\n      )}\n      {status === 'success' && (\n        books.length === 0\n          ? <p>В каталоге пока нет книг.</p>\n          : <BookList books={books} onAdd={onAdd} />\n      )}\n    </section>\n  );\n}"
        }
      ],
      "callout": "useCallback сохраняет reload, пока зависимости не меняются. Поэтому смена status не запускает эффект снова.",
      "notes": "3 минуты. Два полных файла: useBooks хранит состояние, запускает начальную загрузку и возвращает обычную функцию reload; Catalog отображает результат и передает reload в onClick. useCallback сохраняет ссылку на функцию при обычных рендерах, пока зависимости не меняются. Эффект зависит от reload, а не от status, поэтому setStatus не вызывает новую загрузку через эффект. [] здесь корректен: reload не читает меняющиеся props или state; сеттеры состояния стабильны, requestBooks объявлена вне хука. Если такие значения появятся, включаем их в зависимости и не подавляем линтер. Объясняем начальный запрос и повтор после ошибки; одновременные запросы и отмену здесь не разбираем. StrictMode в разработке может выполнить дополнительный проверочный цикл эффекта.",
      "sources": [
        {
          "label": "React: useCallback",
          "url": "https://react.dev/reference/react/useCallback"
        },
        {
          "label": "React: useEffect",
          "url": "https://react.dev/reference/react/useEffect"
        }
      ]
    },
    {
      "id": "effect-demo",
      "chapter": "effects",
      "minutes": 1.5,
      "kicker": "Третий результат · каталог загружается при открытии",
      "title": "Что изменилось для посетителя магазина?",
      "lead": "Каталог сам начинает загрузку при появлении. После ошибки остается понятное действие «Повторить».",
      "layout": "demo",
      "demo": "catalog",
      "demoOptions": {
        "stage": "effect"
      },
      "bullets": [
        "Откройте каталог → useEffect вызывает reload",
        "Выберите ошибку → увидите сообщение и кнопку «Повторить»",
        "Выберите успешный ответ → reload загрузит книги снова",
        "Пустой успешный ответ → понятное сообщение"
      ],
      "callout": "useBooks управляет загрузкой; Catalog показывает состояние и передает reload кнопке.",
      "notes": "1,5 минуты. Продолжение того же каталога: открыть компонент и увидеть автоматическую загрузку. Выбрать ошибку, затем успешный ответ и нажать «Повторить»: кнопка вызывает reload. Проверить пустой успешный ответ. Это учебная симуляция начального запроса и повтора после ошибки. Одновременные запросы и отмену здесь не разбираем. В реальном React StrictMode в разработке может выполнить дополнительный проверочный цикл эффекта."
    },
    {
      "id": "api-layer",
      "chapter": "api",
      "minutes": 3,
      "kicker": "Шаг 6 · даем запросу свое место",
      "title": "Где хранить функции запросов к API?",
      "lead": "Перенесем запрос в api/books.js. useBooks импортирует getBooks и управляет состоянием загрузки.",
      "layout": "files",
      "codeFiles": [
        {
          "file": "api/books.js",
          "text": "export async function getBooks() {\n  const response = await fetch('/api/books');\n  if (!response.ok) {\n    throw new Error('HTTP ' + response.status);\n  }\n  const data = await response.json();\n  return data.books;\n}",
          "language": "js",
          "highlight": [
            1,
            2,
            7
          ]
        },
        {
          "file": "useBooks.js",
          "language": "js",
          "text": "import { useCallback, useEffect, useState } from 'react';\nimport { getBooks } from './api/books.js';\n\nexport function useBooks() {\n  const [books, setBooks] = useState([]);\n  const [status, setStatus] = useState('loading');\n  const reload = useCallback(async () => {\n    setStatus('loading');\n    try {\n      const result = await getBooks();\n      setBooks(result);\n      setStatus('success');\n    } catch {\n      setStatus('error');\n    }\n  }, []);\n\n  useEffect(() => { reload(); }, [reload]);\n  return { books, status, reload };\n}"
        }
      ],
      "callout": "API-файл получает данные. useBooks управляет загрузкой. Catalog показывает результат.",
      "notes": "3 минуты. Два полных файла: переносим requestBooks в api/books.js, переименовываем экспорт в getBooks и импортируем его в useBooks. Тело запроса и поведение загрузки остаются знакомыми. Catalog продолжает использовать useBooks, его повторно не копируем. getBooks получает массив и сообщает об ошибке; useBooks хранит books и status, запускает начальную загрузку и возвращает reload. Пустой массив остается успешным результатом. Другой экран может использовать тот же API-модуль. Одновременные запросы и отмену здесь не разбираем.",
      "fileLayout": "paired"
    },
    {
      "id": "api-entry-problem",
      "chapter": "api",
      "minutes": 1.5,
      "kicker": "Один API · несколько мест",
      "title": "Что если я хочу одну точку входа для запросов?",
      "lead": "Список, поиск и детали книг используют один API. Адрес и заголовки повторяются в каждом месте.",
      "layout": "flow",
      "diagram": {
        "type": "api-centralization"
      },
      "callout": "Изменился адрес или общий заголовок — меняем client.js.",
      "notes": "1,5 минуты. Сравнить два равных столбца: сейчас три места знают адрес и заголовок; после переноса эти настройки знает общий клиент. Янтарные чипы показывают дубли, синий блок — единственное место настройки. Стрелки показывают исходящие запросы, а не движение данных ответа. Ответы сервера возвращаются вызывающим функциям, но на этой схеме не показаны. API-модули используют общий client.js; React-хук вызывает getBooks и управляет загрузкой."
    },
    {
      "id": "api-client-choice",
      "chapter": "api",
      "minutes": 1.5,
      "kicker": "Общий клиент · обычный JavaScript",
      "title": "Свой клиент: одна функция поверх fetch",
      "lead": "request получает путь, добавляет общие настройки и возвращает данные.",
      "layout": "files",
      "diagram": {
        "type": "fetch-client-flow"
      },
      "codeFiles": [
        {
          "file": "api/client.js",
          "language": "js",
          "text": "const baseURL = '/api';\nconst headers = { Accept: 'application/json' };\n\nexport async function request(path) {\n  const response = await fetch(baseURL + path, { headers });\n\n  if (!response.ok) {\n    throw new Error('HTTP ' + response.status);\n  }\n\n  return response.json();\n}",
          "highlight": [
            1,
            2,
            4,
            7,
            11
          ]
        },
        {
          "file": "api/books.js",
          "language": "js",
          "text": "import { request } from './client.js';\n\nexport async function getBooks() {\n  const data = await request('/books');\n  return data.books;\n}",
          "highlight": [
            1,
            4,
            5
          ]
        }
      ],
      "callout": "Это обычная JS-функция: разные API-модули могут вызывать request со своим путём.",
      "notes": "1,5 минуты. Два полных файла. request добавляет адрес и заголовок, проверяет response.ok и читает JSON. getBooks отвечает за путь /books и извлечение массива data.books. На схеме стрелки означают вызов и исходящий запрос; JSON возвращается через request в getBooks. Это простой пример GET-запроса, а не универсальный клиент для POST, тела запроса или отмены. React-хук получает от getBooks тот же массив книг. Следующий слайд показывает альтернативную реализацию client.js с Axios.",
      "sources": [
        {
          "label": "MDN: Using the Fetch API",
          "url": "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
        }
      ]
    },
    {
      "id": "axios-instance",
      "chapter": "api",
      "minutes": 2,
      "kicker": "Альтернатива · HTTP-библиотека",
      "title": "Axios — библиотека для HTTP-запросов",
      "lead": "Axios берёт на себя часть работы request: чтение JSON и проверку HTTP-статуса.",
      "layout": "files",
      "codeFiles": [
        {
          "file": "api/client.js",
          "language": "js",
          "text": "import axios from 'axios';\n\nexport const client = axios.create({\n  baseURL: '/api',\n  headers: { Accept: 'application/json' }\n});",
          "highlight": [
            3,
            4,
            5
          ]
        },
        {
          "file": "api/books.js",
          "language": "js",
          "text": "import { client } from './client.js';\n\nexport async function getBooks() {\n  const response = await client.get('/books');\n  return response.data.books;\n}",
          "highlight": [
            1,
            4,
            5
          ]
        }
      ],
      "bullets": [
        "axios.create создаёт клиент с общими настройками.",
        "Данные JSON-ответа доступны через response.data.",
        "HTTP-статус вне 2xx по умолчанию приводит к ошибке."
      ],
      "callout": "Установка: npm install axios. getBooks возвращает тот же массив книг.",
      "notes": "2 минуты. Axios — отдельная устанавливаемая библиотека. Это альтернативные два файла, заменяющие реализацию клиента с fetch из предыдущего слайда, а не дополнительный слой поверх request. axios.create создаёт экземпляр один раз при загрузке модуля. baseURL и Accept относятся к запросам через этот экземпляр. Для JSON-ответа Axios предоставляет разобранные данные через response.data; getBooks возвращает response.data.books. По умолчанию HTTP-статус вне диапазона 2xx отклоняет promise; это поведение можно настроить через validateStatus. React-хук продолжает получать массив и обрабатывать ошибку. Далее interceptor: действие перед каждым запросом через client.",
      "sources": [
        {
          "label": "Axios: введение",
          "url": "https://axios-http.com/docs/intro"
        },
        {
          "label": "Axios: instance",
          "url": "https://axios-http.com/docs/instance"
        },
        {
          "label": "Axios: обработка ошибок",
          "url": "https://axios-http.com/docs/handling_errors"
        }
      ]
    },
    {
      "id": "middleware",
      "chapter": "middleware",
      "minutes": 2,
      "kicker": "Короткое знакомство · interceptor",
      "title": "Interceptor: действие перед каждым запросом",
      "lead": "Request interceptor — функция, которую Axios вызывает перед отправкой каждого запроса через данный client.",
      "layout": "code",
      "code": {
        "file": "api/client.js · добавляем после axios.create",
        "language": "js",
        "text": "client.interceptors.request.use((config) => {\n  console.log(config.method, config.url);\n  return config;\n});",
        "highlight": [
          1,
          2,
          3
        ]
      },
      "bullets": [
        "config — настройки текущего запроса: метод, путь, заголовки",
        "console.log записывает метод и путь в консоль",
        "return config передает настройки дальше для отправки"
      ],
      "callout": "Один обработчик логирует запросы книг, заказов и деталей через client.",
      "notes": "2 минуты. Только request interceptor. Добавляем его один раз в модуле client.js после создания экземпляра, а не в компоненте. Он получает config конкретного запроса до отправки. config.method и config.url содержат метод и путь; здесь get и /books. Логирование — пример повторяющегося действия; аналогично можно общим способом дополнять заголовки. Обязательно возвращаем config, чтобы Axios продолжил отправку с этими настройками. Обработчик касается запросов именно этого client. Состояния интерфейса по-прежнему обновляет Catalog. Не вводить другие механизмы или серверные примеры.",
      "sources": [
        {
          "label": "Axios: interceptors",
          "url": "https://axios-http.com/docs/interceptors"
        }
      ]
    },
    {
      "id": "checkpoint",
      "chapter": "middleware",
      "minutes": 2,
      "kicker": "Наш каталог готов · весь путь",
      "title": "Что умеет наш каталог теперь?",
      "lead": "Каталог получает книги из API, хранит их в state и объясняет результат посетителю.",
      "layout": "flow",
      "steps": [
        {
          "label": "1. Получить",
          "text": "Эффект внутри useBooks вызывает reload; getBooks обращается к общему client"
        },
        {
          "label": "2. Запомнить",
          "text": "useBooks хранит books и status в state"
        },
        {
          "label": "3. Показать",
          "text": "Загрузка, ошибка с повтором, пустой результат или карточки книг"
        },
        {
          "label": "4. Обработать общее",
          "text": "В варианте с Axios каждый запрос client записывается в консоль"
        }
      ],
      "bullets": [
        "После ошибки кнопка вызывает reload для новой попытки",
        "ProductCard получает книгу и действие добавления в корзину",
        "Адрес API и заголовки задаются в одном client.js"
      ],
      "notes": "2 минуты. Собрать итог без новых механизмов. getBooks знает маршрут, client хранит общие настройки запросов, useBooks хранит состояние и управляет загрузкой, Catalog показывает загрузку, ошибку с повтором, успешную пустоту или книги. В Axios-варианте request interceptor логирует каждый запрос через client. После ошибки кнопка вызывает reload. Три источника API для текущей лабораторной далее используют ту же цепочку."
    },
    {
      "chapter": "projects",
      "minutes": 2.5,
      "id": "project-ready",
      "kicker": "Текущая лабораторная · вариант 1 из 3",
      "title": "Где взять API для текущей лабораторной работы",
      "lead": "Вариант 1: сейчас пишем React-приложение, которое получает все данные напрямую из готового публичного API.",
      "layout": "compare",
      "cards": [
        {
          "title": "Сейчас · лабораторная по React",
          "text": "Полностью используйте готовое публичное API. Собственный сервер для этого варианта сейчас не нужен.",
          "code": "React → публичное API"
        },
        {
          "title": "Когда дойдём до лабораторных по Node.js",
          "text": "Можно добавить прослойку на Node.js: она будет обращаться к тому же публичному API.",
          "code": "React → Node.js → публичное API"
        }
      ],
      "bullets": [
        "Пример с товарами: GET https://dummyjson.com/products → { products: [...] }",
        "Проверьте CORS и поля ответа; адаптируйте карточку к выбранным данным"
      ],
      "callout": "Сейчас — готовое публичное API. Прослойку можно сделать позже, на лабораторных по Node.js.",
      "sources": [
        {
          "label": "DummyJSON: товары",
          "url": "https://dummyjson.com/docs/products"
        }
      ],
      "notes": "2,5 минуты. Первый из трех вариантов API для лабораторной. Сейчас студенты пишут только React-клиент, который полностью использует готовое публичное API. Для прямых запросов выбирают источник, разрешающий доступ из браузера и не требующий секретного ключа. Собственный сервер сейчас не является частью этого варианта. Например, DummyJSON возвращает товары в products; карточки адаптируют к этим полям. Когда курс дойдет до лабораторных по API на Node.js, можно будет добавить свой сервер-посредник между React и тем же публичным API. Это возможное развитие проекта на следующем этапе."
    },
    {
      "chapter": "projects",
      "minutes": 2.5,
      "id": "project-proxy",
      "kicker": "Развитие варианта 1 · на лабораторных по Node.js",
      "title": "Позже можно добавить прослойку на Node.js",
      "lead": "Когда начнутся лабораторные по API на Node.js, готовое публичное API можно оставить источником данных, а запросы направить через свой сервер.",
      "layout": "flow",
      "bullets": [
        "Начать можно с одного маршрута, который получает данные из выбранного публичного API",
        "Позже Node.js может объединять разные источники, в том числе DeepSeek; секретные ключи хранятся на сервере"
      ],
      "callout": "Это следующий этап работы: текущую лабораторную выполняем напрямую с публичным API.",
      "sources": [
        {
          "label": "DeepSeek API",
          "url": "https://api-docs.deepseek.com/api/deepseek-api/"
        }
      ],
      "notes": "2,5 минуты. Продолжение первого варианта, не отдельное требование к текущей React-лабораторной. Сегодня React работает напрямую с готовым публичным API. Только когда дойдем до лабораторных по API на Node.js, студенты смогут добавить прослойку и продолжить использовать тот же источник. Сначала достаточно одного маршрута, который получает данные у внешнего API и возвращает клиенту. Затем можно развивать сервер: преобразовывать ответы или объединять провайдеров. DeepSeek приведен только как пример дополнительного источника на серверном этапе; его секретный ключ хранится на Node.js. Для сегодняшнего прямого обращения выбирают публичное API без секретного ключа, разрешающее запросы из браузера.",
      "steps": [
        {
          "label": "React",
          "text": "Отправляет запрос вашему серверу и показывает результат"
        },
        {
          "label": "Node.js",
          "text": "Обращается к публичному API и возвращает данные клиенту"
        },
        {
          "label": "То же публичное API",
          "text": "Продолжает предоставлять данные для приложения"
        }
      ]
    },
    {
      "chapter": "projects",
      "minutes": 2.5,
      "id": "project-own",
      "kicker": "Текущая лабораторная · вариант 2 из 3",
      "title": "Свой backend: начните с одного GET",
      "lead": "Если уже знаете Node.js или хотите изучить его раньше, сделайте сервер, который возвращает заранее заданные (захардкоженные) книги.",
      "layout": "code",
      "code": {
        "file": "JSON-ответ GET /api/books",
        "language": "json",
        "text": "{\n  \"books\": [{\n    \"id\": \"b-101\",\n    \"title\": \"Мастер и Маргарита\",\n    \"author\": \"Михаил Булгаков\",\n    \"price\": 690\n  }]\n}"
      },
      "flowDirection": "vertical",
      "steps": [
        {
          "label": "Сейчас",
          "text": "React → Node.js → данные в коде сервера"
        },
        {
          "label": "Позже",
          "text": "React → Node.js → база данных"
        }
      ],
      "bullets": [
        "Для начала достаточно одного маршрута и данных в коде сервера",
        "Позже можно добавить редактирование и БД; внешние API необязательны"
      ],
      "callout": "React получает настоящий HTTP-ответ от вашего сервера.",
      "notes": "2,5 минуты. Второй источник — свой backend на Node.js для тех, кто уже умеет писать сервер или хочет изучить Node.js раньше. На слайде JSON-ответ GET /api/books, а не исходный код сервера. Он сохраняет знакомые поля книги: b-101, Мастер и Маргарита, Михаил Булгаков, цена 690. Начать достаточно с одного GET и массива, заданного в коде сервера. База данных не обязательна для текущей лабораторной. Позже можно добавить БД и редактирование; внешний API этому варианту не требуется. Каталог по-прежнему показывает загрузку, ошибку, пустой ответ или карточки."
    },
    {
      "chapter": "projects",
      "minutes": 2.5,
      "id": "project-java",
      "kicker": "Текущая лабораторная · вариант 3 из 3",
      "title": "Подключите backend на Java",
      "lead": "Используйте backend из курсовой или лабораторной по Java либо создайте новый. React обращается к нему по HTTP.",
      "layout": "compare",
      "cards": [
        {
          "title": "Сейчас",
          "text": "Java возвращает JSON, React отображает данные и состояния запроса.",
          "code": "React → Java HTTP API"
        },
        {
          "title": "После изучения Node.js",
          "text": "Node.js станет прослойкой; Java сохранит предметную логику.",
          "code": "React → Node.js → Java HTTP API"
        }
      ],
      "bullets": [
        "Консольному Java-проекту сначала добавьте HTTP-интерфейс",
        "Начните с одного GET для сущности вашей работы"
      ],
      "callout": "Выберите источник API для лабораторной: готовое API, свой Node.js или Java.",
      "notes": "2,5 минуты, завершение 70-минутной лекции. Третий источник — backend на Java из курсовой или лабораторной либо новый Java-проект. Сейчас Node.js для этого не нужен: React обращается прямо к Java по HTTP и получает JSON. Консольному проекту сначала нужно добавить HTTP-интерфейс; обычный консольный вывод нельзя получить через fetch. Начать с одного GET для сущности своей работы. После изучения Node.js можно добавить прослойку, оставив предметную логику в Java. Попросить каждого выбрать один из трех источников API для текущей лабораторной и назвать сущность. Все используют цепочку: запрос → состояние → список карточек."
    },
    {
      "id": "practice",
      "chapter": "projects",
      "minutes": 20,
      "extra": true,
      "kicker": "Практика · следующие 20 минут · вне основной лекции",
      "title": "Продолжите тот же книжный каталог",
      "lead": "Используйте знакомую ProductCard и подготовленный GET /api/books. Пройдите те же шаги самостоятельно.",
      "layout": "closing",
      "steps": [
        {
          "label": "0–5 минут",
          "text": "Массив → BookList с map и key={book.id}"
        },
        {
          "label": "5–10 минут",
          "text": "Запрос по кнопке; загрузка, ошибка, пусто и книги"
        },
        {
          "label": "10–15 минут",
          "text": "useBooks: useEffect при открытии и reload после ошибки"
        },
        {
          "label": "15–20 минут",
          "text": "Вынести getBooks в API-слой и проверить все состояния"
        }
      ],
      "bullets": [
        "Ошибка → повтор → появились карточки",
        "Успешный пустой ответ → понятное сообщение",
        "useBooks возвращает books, status и reload; Catalog показывает результат",
        "Назовите один из трех источников API для текущей лабораторной"
      ],
      "callout": "Готово, когда каталог понятен при любом исходе запроса, а добавление в корзину по-прежнему работает.",
      "notes": "20 минут после основной лекции. Дать стартовый магазин, ProductCard, локальные три книги и работающий учебный endpoint или подготовленный сервер/прокси с контрактом {books:[...]}. Демо в презентации моделирует сеть и само по себе не создает /api/books в студенческом проекте. Через 5 минут проверить список, через 10 — запрос по кнопке и состояния, через 15 — useBooks, автозагрузку и reload после ошибки. Последние 5 минут — перенос запроса в api/books.js и ручная проверка всех состояний. Использовать статус idle/loading/success/error, а пустоту вычислять после success. Начальный запрос и повтор после ошибки — обязательный минимум. Axios, одновременные запросы, поиск и отмена здесь не разбираются. StrictMode в разработке может выполнить дополнительный проверочный цикл эффекта. Быстрым студентам предложить общий getJSON или экран деталей. На выходе студент объясняет путь данных и выбирает один из трех источников API для текущей лабораторной работы."
    }
  ]
};
