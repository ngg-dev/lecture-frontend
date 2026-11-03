# Дополнительные темы TypeScript

Эти темы сохранены для самостоятельного чтения и не входят в основной показ. Сначала пройдите типизацию данных, утилиты и применение в React. Намеренные ошибки в примерах обозначены комментариями.

## Совместимость определяется структурой

Функции достаточно нужных полей – название типа не обязано совпадать.

```ts
type BookTitle = { title: string };
function showTitle(book: BookTitle) {
  return book.title;
}
const book = { title: "Солярис", price: 620 };
showTitle(book); // подходит по структуре

showTitle({ title: "Солярис", price: 620 }); // лишнее поле
```

Для свежего объектного литерала TS дополнительно проверяет лишние поля.

Сначала показать успешную передачу переменной с price, затем ошибку в свежем литерале. Не делать вывод, что контракт удаляет лишние поля: объект остаётся тем же.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [TypeScript Handbook · Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html).

## Свяжем status и данные

Закроем риск из вступления: success требует книги, error – сообщение.

```ts
type LoadState =
  | { status: "loading" }
  | { status: "success"; books: Book[] }
  | { status: "error"; message: string };

const state: LoadState = {
  status: "success", books: []
};
```

Один различающий признак связывает поля одного варианта.

Сравнить с тремя независимыми useState: можно случайно оставить loading и error одновременно. Это учебная модель первой загрузки. Для фонового обновления со старыми данными нужен отдельный продуманный контракт.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## Ветка определяет доступные поля

Проследим, какие поля и интерфейс соответствуют каждому состоянию.

Пустой список – успешный ответ с нулём книг.

Пройти основными стрелками загрузку → ошибку → пустой ответ → книги. Обратить внимание на поле JSON и строку ветки. Невозможные сочетания не предлагаются моделью. Каждый случай имеет отдельный адрес слайда.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## Проверяем status – получаем нужные поля

TypeScript следует за обычным if.

```ts
function count(state: LoadState): string {
  if (state.status === "success") {
    return "Книг: " + state.books.length;
  }
  if (state.status === "error") return state.message;
  return "Загружаем…";
}
```

Это сужение типа, или narrowing.

В success IDE знает о books. После исключения success и error остаётся loading. Обратиться к message до проверки нельзя. Полная декларация LoadState есть на предыдущем слайде.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## Утилиты выводят тип из существующего

Карточка и форма создания используют разные части Book.

```ts
type BookCard = Pick<Book, "id" | "title" | "price">;
type NewBook = Omit<Book, "id">;

const draft: NewBook = {
  title: "Солярис", author: "Станислав Лем", price: 620
};
```

Утилиты работают с типами; поля реального объекта они не удаляют.

Объяснить угловые скобки здесь как передачу типа утилите; механика generics впереди. Для удаления поля в JS нужна реальная операция, например деструктуризация.

Источники: [TypeScript · Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html).

## Изменение и снимок – разные контракты

Partial делает поля необязательными, Readonly запрещает запись через этот тип.

```ts
type PricePatch = Pick<Book, "id"> &
  Partial<Pick<Book, "price" | "title">>;

const patch: PricePatch = { id: "b-101", price: 700 };
const emptyPatch: PricePatch = { id: "b-101" }; // допустимо

type Snapshot = Readonly<Book>;
const saved: Snapshot = {
  id: "b-101", title: "Солярис", author: "Лем", price: 620
};
saved.price = 700; // намеренная ошибка
```

Partial допускает пустое изменение; бизнес-правило проверяем отдельно.

id остаётся обязательным благодаря Pick с пересечением. price/title необязательны. Оба преобразования неглубокие. Readonly не вызывает Object.freeze, а Partial не гарантирует хотя бы одно поле.

Источники: [TypeScript · Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html).

## Ещё четыре утилиты – по потребности

Не заучиваем каталог: ищем преобразование для своей задачи.

```ts
type Status = "idle" | "loading" | "success" | "error";
type Pending = Extract<Status, "idle" | "loading">;
type Settled = Exclude<Status, Pending>;
type Selected = NonNullable<Book | null>;

function getPrice(book: Book) { return book.price; }
type Price = ReturnType<typeof getPrice>; // number
```

Extract / Exclude выбирают варианты, NonNullable убирает null и undefined.

ReturnType извлекает возвращаемый тип функции, typeof здесь получает тип значения. Это обзор; для первого проекта достаточно Pick/Omit/Partial/Record. Не смешивать с runtime typeof, который будет в guards.

Источники: [TypeScript · Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html).

## Потеряли связь между входом и выходом

Функция подходит любому массиву, но возвращает слишком мало информации.

```ts
function first(items: unknown[]): unknown {
  return items[0];
}
const book = first([{ title: "Солярис" }]);
book.title; // намеренная ошибка: результат unknown
```

Нужно сохранить тип элемента, который передал вызывающий код.

unknown безопасен, но приходится снова проверять уже известную книгу. any уберёт проверку. Дублировать firstBook/firstNumber тоже неудобно. Здесь рождается задача для generic.

Источники: [TypeScript Handbook · Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html).

## T связывает типы одного вызова

Дженерик – параметр типа: конкретный тип выбирается при использовании.

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}
const book = first([{ title: "Солярис" }]);
const price = first([620, 690]);

book?.title;       // string | undefined
price?.toFixed(0); // string | undefined
```

T сохраняет связь; any её теряет.

Читать T[] как массив элементов одного выбранного типа. Возвращаемое T | undefined честно описывает пустоту. Тип часто выводится, поэтому first<Book>(books) необязательно.

Источники: [TypeScript Handbook · Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html).

## Один алгоритм, разные типы

Поменяйте тип массива или обратитесь к неверному полю.

Generic не угадывает данные во время выполнения – он связывает типы при проверке.

Начать с правильного first. Нажать «Неверное поле»: цена получает обращение к title, компилятор сообщает ошибку. Можно удалить элементы массива и обсудить undefined. JS-вывод не содержит <T>.

Источники: [TypeScript Handbook · Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html).

## Контейнер тот же, данные разные

Result<T> переиспользует форму результата для книги и списка.

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const list: Result<Book[]> = { ok: true, data: [] };
const item: Result<Book> = { ok: false, error: "Нет книги" };
```

Result<Book> и Result<Book[]> отличаются содержимым успешного результата.

Здесь объединяются union и generic. Название T можно заменить на Data. Promise<Book> и useState<Book[]> строятся на той же идее параметра типа. Этот контейнер сам не выполняет запрос.

Источники: [TypeScript Handbook · Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html).

## extends ограничивает допустимый T

Поиск по id работает с любым объектом, у которого есть строковый id.

```ts
function findById<T extends { id: string }>(
  items: T[], id: string
): T | undefined {
  return items.find(item => item.id === id);
}
const book = findById([{ id: "b-101", price: 620 }], "b-101");
book?.price; // дополнительные поля сохранились
```

Ограничение даёт функции минимальные гарантии, сохраняя остальные поля.

Это ограничение параметра типа, не наследование runtime-класса. Сравнить результат с функцией, возвращающей только {id:string}: price потерялся бы из известного типа.

Источники: [TypeScript Handbook · Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html).

## Ключ тоже можно связать с объектом

keyof T – набор его ключей; T[K] – тип значения по выбранному ключу.

```ts
function getField<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const book = { title: "Солярис", price: 620 };
const price = getField(book, "price"); // number
getField(book, "prcie"); // намеренная опечатка
```

Нужна связь между значениями – ищите связь между их типами.

Это последний, более сложный пример раздела. Его можно оставить для самостоятельного чтения при быстром темпе. Объяснить K extends keyof T по частям и показать намеренную опечатку.

Источники: [TypeScript Handbook · Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html).

## Тайпгард – проверка, которая сужает тип

Обычный JavaScript if даёт TypeScript новую информацию.

```ts
function formatPrice(value: string | number): string {
  if (typeof value === "number") {
    return value.toFixed(0) + " ₽";
  }
  return value.trim() + " ₽";
}
```

Проверка остаётся в JS; знание о типе существует при разработке.

В if value – number, после return остаётся string. Number(value) – преобразование, typeof – проверка; это разные действия. Сам guard не обязан исправлять данные.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## Выбираем проверку под значение

typeof – примитивы, instanceof – экземпляры, in – наличие свойства.

```ts
function message(value: Date | Error): string {
  if (value instanceof Date) return value.toISOString();
  return value.message;
}

function title(value: { title: string } | { error: string }) {
  if ("title" in value) return value.title;
  return value.error;
}
```

Проверяйте null отдельно: typeof null возвращает "object".

instanceof подходит для реальных Date/Error, а не для интерфейса Book, которого нет в JS. in сам не гарантирует тип значения поля у unknown. Array.isArray отдельно полезен для проверки массива.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## as – утверждение, а не проверка

Компилятор может поверить нам и пропустить реальную ошибку.

```ts
const raw: unknown = { price: "620" };
const book = raw as Book;
book.price.toFixed(0); // TS пропускает; при запуске TypeError

const amount = Number("620"); // реальное преобразование
```

as Book и getJSON<Book>() сами по себе не проверяют JSON.

raw содержит строковую цену. as ничего не преобразует, toFixed вызовет TypeError. Код намеренно опасен, но компилируется. Сравнить с Number(), которая реально выполняется. Не использовать подавление ошибок вместо guards.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

## Свой guard проверяет обещанный контракт

Для компактного примера проверим id, title и price.

```ts
type Book = { id: string; title: string; price: number };

function isBook(value: unknown): value is Book {
  return typeof value === "object" && value !== null
    && "id" in value && typeof value.id === "string"
    && "title" in value && typeof value.title === "string"
    && "price" in value && typeof value.price === "number"
    && Number.isFinite(value.price) && value.price >= 0;
}
```

value is Book – обещание автора. TS не доказывает полноту нашей проверки.

Book здесь намеренно сокращён: author в этом контракте нет. Все обязательные поля текущей модели проверены, дополнительно цена конечная и неотрицательная. На реальной границе контракт расширяют или используют валидатор схем. Нельзя написать return true и ожидать безопасности.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## Один JSON проходит, другой – нет

Измените входные данные и проверьте их до обращения к price.

Диагностика TS и проверка данных во время выполнения дополняют друг друга.

Показать правильный объект, цену строкой, null, затем отрицательную цену вручную. Проверяется локальный JSON, сеть не используется. JSON.parse и isBook действительно выполняются. При ошибке не отображаем карточку.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## Проверяем данные на входе в приложение

После проверки getBook возвращает уже известный контракт.

```ts
async function getBook(url: string): Promise<Book> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("HTTP " + response.status);
  const raw: unknown = await response.json();
  if (!isBook(raw)) throw new Error("Неверный формат книги");
  return raw;
}
```

HTTP-успех и корректная форма JSON – две отдельные проверки.

Используется сокращённый Book и isBook с предыдущего слайда. response.json() часто приносит any, поэтому явно ставим unknown. Это фрагмент для реального проекта, презентация внешние запросы не отправляет. Promise<Book> описывает успешный результат, не тип брошенной ошибки.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

## never помогает не забыть новый вариант

Если обработаны все варианты, в оставшейся ветке ничего быть не может.

```ts
type Status = "loading" | "success" | "error";
function label(status: Status): string {
  switch (status) {
    case "loading": return "Загрузка";
    case "success": return "Готово";
    case "error": return "Ошибка";
    default: {
      const unreachable: never = status;
      return unreachable;
    }
  }
}
```

Добавим "idle" в Status – компилятор попросит обработать его.

Предложить добавить литерал idle в тип. Присваивание never станет ошибкой. Это дополнение к базовым guards; не превращать never в отдельную сложную лекцию.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## useRef: подскажем, на какой элемент ссылаемся

Поле появится после рендера, поэтому начальное значение – null.

```tsx
function PriceInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  return <>
    <input ref={inputRef} />
    <button onClick={() => inputRef.current?.focus()}>
      Перейти к цене
    </button>
  </>;
}
```

HTMLInputElement даёт подсказки focus; ?. учитывает возможный null.

useRef<HTMLInputElement>(null) вызывается на верхнем уровне компонента. current читаем внутри обработчика клика. Не вводить useRef как новую систему состояния: здесь только тип ссылки на уже знакомый input.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript), [React · useRef](https://react.dev/reference/react/useRef).

## useEffect не требует параметра типа

Типизируем данные title; эффект и cleanup проверяются автоматически.

```tsx
function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => { document.title = previous; };
  }, [title]);
  return <h1>{title}</h1>;
}
```

Функция эффекта возвращает cleanup или ничего. async-эффект напрямую не передаём.

Пример синхронизирует document.title и восстанавливает прежний заголовок. Зависимость title указана. Для запроса async-функцию вызывают внутри эффекта, а не делают сам callback async. Сегодня цель – понять границу типов, не повторить весь useEffect.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript), [React · useEffect](https://react.dev/reference/react/useEffect).

## Свой хук – функция с понятным результатом

Назовём объект, который возвращает useSelectedBook.

```ts
type Selection = {
  selected: Book | null;
  select: (book: Book) => void;
};

function useSelectedBook(): Selection {
  const [selected, setSelected] = useState<Book | null>(null);
  return { selected, select: book => setSelected(book) };
}
```

Компонент получает selected и select с уже известными типами.

Хук использует обычный именованный тип Selection и useState. selected может быть null, select принимает Book. Явный возвращаемый тип полезен на публичной границе хука, но TS мог бы вывести его. Внутри возвращаемого обработчика параметр book выводится из Selection.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).
