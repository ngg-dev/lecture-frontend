import { bookType } from './examples.js';

const importedTypes = ['ChangeEvent', 'FormEvent', 'ReactNode', 'ComponentProps'];
const typeImport = names => `import type { ${names.join(', ')} } from 'react';`;
const imports = `import { useState, useRef, useEffect } from 'react';\n${typeImport(importedTypes)}`;
const context = `${imports}\n${bookType}`;
const contextWithout = name => context.replace(typeImport(importedTypes), typeImport(importedTypes.filter(type => type !== name)));
const inside = text => ({ text, context: `${context}\nfunction Example() {`, suffix: '\nreturn null;\n}', errors: [] });

export const reactSnippets = {
  reactProps: { context, text: `type Props = { book: Book };

function BookCard({ book }: Props) {
  return <article>
    <h3>{book.title}</h3>
    <p>{book.price} ₽</p>
  </article>;
}`, errors: [] },
  reactCallback: { context, text: `type Props = {
  book: Book;
  onAdd: (id: string) => void;
};

function AddButton({ book, onAdd }: Props) {
  return <button onClick={() => onAdd(book.id)}>
    В корзину
  </button>;
}`, errors: [] },
  reactState: inside(`const [count, setCount] = useState(0);
const [draft, setDraft] = useState("620");

function reset() {
  setCount(2);
  setDraft("790");
}`),
  reactCollections: inside(`const [books, setBooks] = useState<Book[]>([]);
const [selected, setSelected] = useState<Book | null>(null);

function clear() {
  setBooks([]);
  setSelected(null);
}`),
  reactStatus: inside(`type Status = "idle" | "loading" | "success" | "error";
const [status, setStatus] = useState<Status>("idle");

function loaded() {
  setStatus("success");
}`),
  reactInlineEvent: { context, text: `function PriceInput() {
  const [draft, setDraft] = useState("");
  return <input type="number" value={draft}
    onChange={event => setDraft(event.currentTarget.value)} />;
}`, errors: [] },
  reactEvent: { context: contextWithout('ChangeEvent'), text: `import type { ChangeEvent } from "react";

function PriceInput() {
  const [draft, setDraft] = useState("");
  function change(event: ChangeEvent<HTMLInputElement>) {
    setDraft(event.currentTarget.value);
  }
  return <input value={draft} onChange={change} />;
}`, errors: [] },
  reactSubmit: { context: contextWithout('FormEvent'), text: `import type { FormEvent } from "react";

function PriceForm() {
  const [draft, setDraft] = useState("");
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (draft.trim() === "") return;
    const price = Number(draft);
    if (!Number.isFinite(price) || price < 0) return;
    console.log("Сохранить цену", price);
  }
  return <form onSubmit={save}>
    <input value={draft}
      onChange={event => setDraft(event.currentTarget.value)} />
    <button>Сохранить</button>
  </form>;
}`, errors: [] },
  reactChildren: { context: contextWithout('ReactNode'), text: `import type { ReactNode } from "react";

type PanelProps = { children: ReactNode };

function Panel({ children }: PanelProps) {
  return <section>{children}</section>;
}

const example = <Panel>Цена: <strong>620 ₽</strong></Panel>;`, errors: [] },
  reactButton: { context: contextWithout('ComponentProps'), text: `import type { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

function SaveButton(props: ButtonProps) {
  return <button {...props} />;
}

const example = <SaveButton disabled onClick={() => {}}>
  Сохранить
</SaveButton>;`, errors: [] },
  reactRef: { context, text: `function PriceInput() {
  const inputRef = useRef<HTMLInputElement>(null);
  return <>
    <input ref={inputRef} />
    <button onClick={() => inputRef.current?.focus()}>
      Перейти к цене
    </button>
  </>;
}`, errors: [] },
  reactEffect: { context, text: `function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => { document.title = previous; };
  }, [title]);
  return <h1>{title}</h1>;
}`, errors: [] },
  reactHook: { context, text: `type Selection = {
  selected: Book | null;
  select: (book: Book) => void;
};

function useSelectedBook(): Selection {
  const [selected, setSelected] = useState<Book | null>(null);
  return { selected, select: book => setSelected(book) };
}`, errors: [] },
  reactPromise: { context, text: `const books: Book[] = [];

async function getBooks(): Promise<Book[]> {
  return books; // локальная учебная модель
}

async function load() {
  const result = await getBooks(); // Book[]
  return result.map(book => book.title);
}`, errors: [] }
};

reactSnippets.reactCallbackError = { ...reactSnippets.reactCallback, text: reactSnippets.reactCallback.text.replace('onAdd(book.id)', 'onAdd(book.price)'), errors: [2345] };
reactSnippets.reactStateError = { ...reactSnippets.reactState, text: reactSnippets.reactState.text.replace('setCount(2)', 'setCount("2")'), errors: [2345] };
reactSnippets.reactStatusError = { ...reactSnippets.reactStatus, text: reactSnippets.reactStatus.text.replace('setStatus("success")', 'setStatus("succes")'), errors: [2345] };

export function reactFullSource(snippet) {
  return [snippet.context, snippet.text, snippet.suffix].filter(Boolean).join('\n\n');
}
