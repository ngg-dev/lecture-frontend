export const bookType = `type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
};`;

export const bookValue = `const book: Book = {
  id: "b-101",
  title: "Солярис",
  author: "Станислав Лем",
  price: 620
};`;

export const snippets = {
  price: { text: `function addDelivery(price: number): number {
  return price + 100;
}

addDelivery("690"); // намеренная ошибка`, errors: [2345] },
  priceFixed: { text: `function addDelivery(price: number): number {
  return price + 100;
}

addDelivery(690); // 790`, errors: [] },
  primitives: { text: `let price = 690;       // выведен number
const title = "Солярис";
let available: boolean = true;
const prices: number[] = [690, 540];

price = "690"; // намеренная ошибка`, errors: [2322] },
  functions: { text: `function total(price: number, count: number): number {
  return price * count;
}
total(620, 2); // 1240

function printTitle(title: string): void {
  console.log(title);
}
printTitle("Солярис");`, errors: [] },
  book: { text: `${bookType}\n\n${bookValue}`, errors: [] },
  optional: { text: `type BookPreview = {
  readonly id: string;
  title: string;
  subtitle?: string;
};

function subtitle(book: BookPreview) {
  return book.subtitle?.toUpperCase() ?? "Без подзаголовка";
}`, errors: [] },
  nullable: { text: `let selected: Book | null = null;

function label(book: Book | null): string {
  if (book === null) return "Выберите книгу";
  return book.title;
}`, context: bookType, errors: [] },
  selectedBook: { text: `type SelectedBook = Book | null;
let selected: SelectedBook = null;

function label(book: SelectedBook): string {
  if (book === null) return "Выберите книгу";
  return book.title;
}`, context: bookType, errors: [] },
  unknown: { text: `function unsafe(value: any) {
  return value.price.toFixed(0); // TS разрешает, JS может упасть
}

function safe(value: unknown) {
  return value.price; // намеренная ошибка: ещё не проверили
}`, errors: [18046] },
  interface: { text: `interface Book {
  id: string;
  title: string;
  price: number;
}

interface FeaturedBook extends Book {
  badge: string;
}`, errors: [] },
  alias: { text: `type BookId = string;
type Status = "loading" | "success" | "error";
type AddBook = (id: BookId) => void;

type FeaturedBook = Book & { badge: string };`, context: bookType, errors: [] },
  structural: { text: `type BookTitle = { title: string };
function showTitle(book: BookTitle) {
  return book.title;
}
const book = { title: "Солярис", price: 620 };
showTitle(book); // подходит по структуре

showTitle({ title: "Солярис", price: 620 }); // лишнее поле`, errors: [2353] },
  union: { text: `type Status = "idle" | "loading" | "success" | "error";
let status: Status = "loading";
status = "succes"; // намеренная опечатка

function formatId(id: string | number) {
  return id.toUpperCase(); // доступно не у всех вариантов
}`, errors: [2820, 2339] },
  state: { text: `type LoadState =
  | { status: "loading" }
  | { status: "success"; books: Book[] }
  | { status: "error"; message: string };

const state: LoadState = {
  status: "success", books: []
};`, context: bookType, errors: [] },
  narrowState: { text: `function count(state: LoadState): string {
  if (state.status === "success") {
    return "Книг: " + state.books.length;
  }
  if (state.status === "error") return state.message;
  return "Загружаем…";
}`, context: `${bookType}\ntype LoadState = { status: "loading" } | { status: "success"; books: Book[] } | { status: "error"; message: string };`, errors: [] },
  pickOmit: { text: `type BookCard = Pick<Book, "id" | "title" | "price">;
type NewBook = Omit<Book, "id">;

const draft: NewBook = {
  title: "Солярис", author: "Станислав Лем", price: 620
};`, context: bookType, errors: [] },
  partial: { text: `type PricePatch = Pick<Book, "id"> &
  Partial<Pick<Book, "price" | "title">>;

const patch: PricePatch = { id: "b-101", price: 700 };
const emptyPatch: PricePatch = { id: "b-101" }; // допустимо

type Snapshot = Readonly<Book>;
const saved: Snapshot = {
  id: "b-101", title: "Солярис", author: "Лем", price: 620
};
saved.price = 700; // намеренная ошибка`, context: bookType, errors: [2540] },
  record: { text: `type Cart = Record<string, number>;
const cart: Cart = { "b-101": 2 };

function quantity(id: string): number {
  return cart[id] ?? 0;
}
// noUncheckedIndexedAccess учитывает отсутствующий ключ`, errors: [] },
  moreUtilities: { text: `type Status = "idle" | "loading" | "success" | "error";
type Pending = Extract<Status, "idle" | "loading">;
type Settled = Exclude<Status, Pending>;
type Selected = NonNullable<Book | null>;

function getPrice(book: Book) { return book.price; }
type Price = ReturnType<typeof getPrice>; // number`, context: bookType, errors: [] },
  genericProblem: { text: `function first(items: unknown[]): unknown {
  return items[0];
}
const book = first([{ title: "Солярис" }]);
book.title; // намеренная ошибка: результат unknown`, errors: [18046] },
  generic: { text: `function first<T>(items: T[]): T | undefined {
  return items[0];
}
const book = first([{ title: "Солярис" }]);
const price = first([620, 690]);

book?.title;       // string | undefined
price?.toFixed(0); // string | undefined`, errors: [] },
  result: { text: `type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

const list: Result<Book[]> = { ok: true, data: [] };
const item: Result<Book> = { ok: false, error: "Нет книги" };`, context: bookType, errors: [] },
  constraint: { text: `function findById<T extends { id: string }>(
  items: T[], id: string
): T | undefined {
  return items.find(item => item.id === id);
}
const book = findById([{ id: "b-101", price: 620 }], "b-101");
book?.price; // дополнительные поля сохранились`, errors: [] },
  keyof: { text: `function getField<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const book = { title: "Солярис", price: 620 };
const price = getField(book, "price"); // number
getField(book, "prcie"); // намеренная опечатка`, errors: [2345] },
  guard: { text: `function formatPrice(value: string | number): string {
  if (typeof value === "number") {
    return value.toFixed(0) + " ₽";
  }
  return value.trim() + " ₽";
}`, errors: [] },
  guards: { text: `function message(value: Date | Error): string {
  if (value instanceof Date) return value.toISOString();
  return value.message;
}

function title(value: { title: string } | { error: string }) {
  if ("title" in value) return value.title;
  return value.error;
}`, errors: [] },
  assertion: { text: `const raw: unknown = { price: "620" };
const book = raw as Book;
book.price.toFixed(0); // TS пропускает; при запуске TypeError

const amount = Number("620"); // реальное преобразование`, context: bookType, errors: [] },
  isBook: { text: `type Book = { id: string; title: string; price: number };

function isBook(value: unknown): value is Book {
  return typeof value === "object" && value !== null
    && "id" in value && typeof value.id === "string"
    && "title" in value && typeof value.title === "string"
    && "price" in value && typeof value.price === "number"
    && Number.isFinite(value.price) && value.price >= 0;
}`, errors: [] },
  boundary: { text: `async function getBook(url: string): Promise<Book> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("HTTP " + response.status);
  const raw: unknown = await response.json();
  if (!isBook(raw)) throw new Error("Неверный формат книги");
  return raw;
}`, context: `type Book = { id: string; title: string; price: number };\ndeclare function isBook(value: unknown): value is Book;`, errors: [] },
  never: { text: `type Status = "loading" | "success" | "error";
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
}`, errors: [] }
};

snippets.interface = { text: `interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
}`, errors: [] };
snippets.extendInterface = { text: `interface FeaturedBook extends Book {
  badge: string;
}`, context: bookType, errors: [] };
snippets.extendType = { text: `type FeaturedBook = Book & {
  badge: string;
};`, context: bookType, errors: [] };
snippets.simpleStatus = { text: `type Status = "idle" | "loading" | "success" | "error";
let status: Status = "idle";
status = "success";`, errors: [] };
snippets.simpleStatusError = { ...snippets.simpleStatus, text: snippets.simpleStatus.text.replace('status = "success"', 'status = "succes"'), errors: [2820] };
snippets.simpleUnion = { text: `function formatId(id: string | number): string {
  if (typeof id === "number") return String(id);
  return id.toUpperCase();
}`, errors: [] };
snippets.simpleUnionError = { text: `function formatId(id: string | number): string {
  return id.toUpperCase();
}`, errors: [2339] };
snippets.unknownNumber = { text: `function formatPrice(value: unknown): string {
  if (typeof value !== "number") return "Нет цены";
  return value.toFixed(0) + " ₽";
}`, errors: [] };
snippets.pick = { text: `type BookPreview = Pick<Book, "id" | "title" | "price">;

const preview: BookPreview = {
  id: "b-101",
  title: "Солярис",
  price: 620
};`, context: bookType, errors: [] };
snippets.omit = { text: `type NewBook = Omit<Book, "id">;

const draft: NewBook = {
  title: "Солярис",
  author: "Станислав Лем",
  price: 620
};`, context: bookType, errors: [] };

snippets.functionsError = { ...snippets.functions, text: snippets.functions.text.replace('total(620, 2); // 1240', 'total(620, 2); // 1240\ntotal("620", 2); // ошибка: нужна цена числом'), errors: [2345] };
snippets.anyIntro = { text: `function format(value: any) {
  return value.price.toFixed(0);
}
format({ price: 620 }); // "620"`, errors: [] };
snippets.unknownIntro = { text: `let value: unknown = { price: 620 };
value = "Нет цены";
value = null;

// Хранить и передавать можно.
// Перед использованием значение нужно проверить.`, errors: [] };

snippets.standalone = { text: "function addDelivery(price: number): number {\n  return price + 100;\n}\nconsole.log(addDelivery(690)); // 790", errors: [] };

snippets.priceBoth = { text: `function addDelivery(price: number): number {
  return price + 100;
}

addDelivery(690);   // 790
addDelivery("690"); // ошибка типов`, errors: [2345] };

snippets.primitivesFixed = { ...snippets.primitives, text: snippets.primitives.text.replace('price = "690"; // намеренная ошибка', 'price = 790; // снова number'), errors: [] };
snippets.unknownFixed = { ...snippets.unknown, text: snippets.unknown.text.replace('return value.price; // намеренная ошибка: ещё не проверили', 'return value; // тип результата – unknown'), errors: [] };
snippets.structuralFixed = { ...snippets.structural, text: snippets.structural.text.split('\n\nshowTitle({')[0], errors: [] };
snippets.unionFixed = { ...snippets.union, text: snippets.union.text.replace('"succes"; // намеренная опечатка', '"success"; // допустимый статус').replace('return id.toUpperCase(); // доступно не у всех вариантов', 'return String(id).toUpperCase(); // сначала получаем строку'), errors: [] };
snippets.partialFixed = { ...snippets.partial, text: snippets.partial.text.replace('saved.price = 700; // намеренная ошибка', 'saved.price; // читать снимок можно'), errors: [] };
snippets.genericProblemFixed = { ...snippets.genericProblem, text: snippets.genericProblem.text.replace('book.title; // намеренная ошибка: результат unknown', '// Вызов допустим, но тип book – unknown.'), errors: [] };
snippets.keyofFixed = { ...snippets.keyof, text: snippets.keyof.text.replace('getField(book, "prcie"); // намеренная опечатка', 'getField(book, "title"); // string'), errors: [] };
snippets.assertionFixed = { ...snippets.assertion, text: snippets.assertion.text.replace('{ price: "620" }', '{ price: 620 }').replace('// TS пропускает; при запуске TypeError', '// "620": при запуске работает'), errors: [] };

snippets.genericIntro = { text: `function toArray<T>(value: T): T[] {
  return [value];
}

const titles = toArray<string>("Солярис"); // string[]
const prices = toArray<number>(620);      // number[]`, errors: [] };

export function fullSource(snippet) {
  return [snippet.context, snippet.text, 'export {};'].filter(Boolean).join('\n\n');
}
