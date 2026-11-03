/* Dependency-free teaching model of keyed row matching; this is not React. */
(function () {
  'use strict';

  const STYLE_ID = 'lecture-keys-demo-styles';
  const BOOKS = [
    { id: 'b-101', title: 'Мастер и Маргарита' },
    { id: 'b-102', title: 'Пикник на обочине' },
    { id: 'b-103', title: 'Солярис' }
  ];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function styles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = el('style');
    style.id = STYLE_ID;
    style.textContent = `
      .keys-demo .keys-panel[data-strategy="id"]{background:#f0f8f0;border-color:#94bd9a}.keys-demo .keys-panel[data-strategy="index"]{background:#fff2f0;border-color:#d5a3a0}.keys-demo .keys-panel-head{flex-direction:column;align-items:flex-start}.keys-demo .keys-expression{font:16px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace}.keys-demo .keys-panel[data-strategy="id"] .keys-row[data-checked="true"]{background:#dceedd}.keys-demo .keys-panel[data-strategy="index"] .keys-row[data-checked="true"]{background:#f8dedb}.keys-demo .keys-panel[data-strategy="index"] .keys-row[data-moved="true"][data-checked="true"]{background:#f8dedb}.keys-demo .keys-panel[data-strategy="id"] .keys-summary[data-result="true"]{color:#23653b;font-size:18px;font-weight:650}.keys-demo .keys-panel[data-strategy="index"] .keys-summary[data-result="true"]{color:#a33333;font-size:18px;font-weight:650}.keys-demo .keys-panel[data-strategy="id"] .keys-checkbox{accent-color:#267044}.keys-demo .keys-panel[data-strategy="index"] .keys-checkbox{accent-color:#b13c3c}

      .keys-demo{--keys-blue:#2148ef;--keys-ink:#20221f;--keys-muted:#66695f;--keys-line:#d5d8ca;color:var(--keys-ink);background:#f0f0e8;padding:14px 18px;font:inherit;min-width:0;border-top:1px solid var(--keys-line)}
      .keys-demo *{box-sizing:border-box}.keys-demo .keys-intro{font-size:12px;line-height:1.45;color:var(--keys-muted);margin:0 0 10px}.keys-demo .keys-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:11px}.keys-demo .keys-button{font:inherit;font-size:12px;line-height:1.3;font-weight:600;min-height:34px;padding:8px 12px;color:#fff;background:var(--keys-blue);border:1px solid var(--keys-blue);border-radius:6px;cursor:pointer}.keys-demo .keys-button:hover{background:#1437ca}.keys-demo .keys-button:disabled{opacity:.42;cursor:default}.keys-demo .keys-reset{color:var(--keys-ink);border-color:var(--keys-line);background:transparent;margin-left:auto}.keys-demo .keys-reset:hover{background:#e6e8de}.keys-demo .keys-button:focus-visible,.keys-demo .keys-checkbox:focus-visible{outline:3px solid var(--keys-blue);outline-offset:3px}
      .keys-demo .keys-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.keys-demo .keys-panel{background:#fafaf4;border:1px solid var(--keys-line);border-radius:8px;min-width:0;overflow:hidden}.keys-demo .keys-panel-head{padding:9px 12px;border-bottom:1px solid var(--keys-line);display:flex;align-items:center;gap:10px;justify-content:space-between}.keys-demo .keys-panel[data-strategy="id"] .keys-panel-title{color:#267044}.keys-demo .keys-panel[data-strategy="index"] .keys-panel-title{color:#b13c3c}.keys-demo .keys-panel-title{margin:0;font-size:16px;line-height:1.25;font-weight:600;letter-spacing:-.025em}.keys-demo .keys-panel-title code{font:inherit;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--keys-blue)}.keys-demo .keys-panel-label{font-size:11px;line-height:1.3;color:var(--keys-muted);text-align:right}.keys-demo .keys-list{list-style:none;margin:0;padding:0;min-height:168px}.keys-demo .keys-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:9px;padding:8px 12px;min-height:56px;border-bottom:1px solid #e3e5db;transition:background .18s}.keys-demo .keys-row:last-child{border-bottom:0}.keys-demo .keys-row[data-checked="true"]{background:#e8edff}.keys-demo .keys-panel[data-strategy="index"] .keys-row[data-moved="true"][data-checked="true"]{background:#f8dedb}.keys-demo .keys-book-title{font-size:16px;font-weight:600;line-height:1.35;display:block}.keys-demo .keys-book-meta{font:14px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--keys-muted);display:flex;flex-wrap:wrap;gap:3px 8px;margin-top:3px}.keys-demo .keys-key{color:var(--keys-blue)}.keys-demo .keys-check-label{display:flex;align-items:center;gap:6px;font-size:10px;line-height:1.3;color:var(--keys-ink);cursor:pointer;white-space:nowrap}.keys-demo .keys-checkbox{appearance:auto;width:15px;height:15px;min-width:15px;padding:0;margin:0;accent-color:var(--keys-blue)}.keys-demo .keys-checkbox:disabled{opacity:1}.keys-demo .keys-summary{min-height:38px;font-size:14px;line-height:1.45;margin:0;padding:9px 12px;border-top:1px solid var(--keys-line);color:var(--keys-muted)}.keys-demo .keys-panel[data-strategy="id"] .keys-summary[data-result="true"]{color:#23653b}.keys-demo .keys-panel[data-strategy="index"] .keys-summary[data-result="true"]{color:#a33333}.keys-demo .keys-status{font-size:12px;line-height:1.4;margin:10px 0 0;color:var(--keys-ink)}.keys-demo .keys-note{font-size:10px;line-height:1.4;margin:5px 0 0;color:var(--keys-muted)}
      @media(max-width:900px){.keys-demo .keys-row{grid-template-columns:minmax(0,1fr) auto;padding:8px}.keys-demo .keys-check-label{font-size:9px;white-space:normal;max-width:87px}.keys-demo .keys-panel-head{padding:9px}.keys-demo .keys-panel-label{max-width:100px}.keys-demo .keys-book-meta{font-size:9px;gap:2px 6px}}@media(max-width:600px){.keys-demo{padding:13px}.keys-demo .keys-columns{grid-template-columns:1fr;gap:10px}.keys-demo .keys-panel-head{padding:9px 12px}.keys-demo .keys-row{padding:8px 12px}.keys-demo .keys-check-label{font-size:10px;max-width:none;white-space:nowrap}.keys-demo .keys-reset{margin-left:0}.keys-demo .keys-panel-label{max-width:none}.keys-demo .keys-controls{gap:7px}.keys-demo .keys-button{flex-grow:1}.keys-demo .keys-book-meta{font-size:10px}.keys-demo .keys-status{font-size:11px}}@media(prefers-reduced-motion:reduce){.keys-demo .keys-row{transition:none}}
    `;
    document.head.append(style);
  }

  function mount(container) {
    if (!container || typeof container.append !== 'function') {
      throw new TypeError('KeysDemo.mount: передайте DOM-контейнер.');
    }
    styles();
    const root = el('section', 'keys-demo');
    root.setAttribute('aria-label', 'Сравнение ключей списка');
    const intro = el('p', 'keys-intro', '«Пикник» уже отмечен. Удалите первую книгу и сравните результат.');
    const controls = el('div', 'keys-controls');
    function button(action, text) {
      const node = el('button', 'keys-button' + (action === 'reset' ? ' keys-reset' : ''), text);
      node.type = 'button';
      node.dataset.action = action;
      controls.append(node);
      return node;
    }
    const remove = button('remove', 'Удалить первую книгу');
    button('reset', 'Сначала');
    const columns = el('div', 'keys-columns');
    const status = el('p', 'keys-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    const note = el('p', 'keys-note', 'Индекс допустим, если состав и порядок списка не меняются. Учебная симуляция сопоставления строк по key.');
    const panels = ['id', 'index'].map(strategy => {
      const panel = el('section', 'keys-panel');
      panel.dataset.strategy = strategy;
      const heading = el('h3', 'keys-panel-title');
      heading.textContent = strategy === 'id' ? '✓ Стабильный id · отметка останется у книги' : '! Индекс · отметка переедет';
      const header = el('div', 'keys-panel-head');
      header.append(heading, el('code', 'keys-expression', strategy === 'id' ? 'key={book.id}' : 'key={index}'));
      const list = el('ol', 'keys-list');
      list.setAttribute('aria-label', strategy === 'id' ? 'Книги со стабильным ключом' : 'Книги с индексом в ключе');
      const summary = el('p', 'keys-summary');
      panel.append(header, list, summary);
      columns.append(panel);
      return { strategy, list, summary, instances: new Map() };
    });
    root.append(intro, controls, columns, status, note);
    container.append(root);
    let books = BOOKS.slice();
    let removed = false;
    let disposed = false;

    // Each row instance owns its checkbox state. Reconciliation keeps an
    // instance only when its key matches; incoming book data is then updated.
    function keyFor(panel, book, index) { return panel.strategy === 'id' ? book.id : String(index); }
    function createInstance(panel, key, book) {
      const row = el('li', 'keys-row');
      const title = el('span', 'keys-book-title');
      const meta = el('span', 'keys-book-meta');
      const keyLabel = el('span', 'keys-key');
      meta.append(keyLabel);
      const info = el('div');
      info.append(title, meta);
      const label = el('label', 'keys-check-label');
      const checkbox = el('input', 'keys-checkbox');
      checkbox.type = 'checkbox';
      checkbox.dataset.strategy = panel.strategy;
      checkbox.dataset.key = key;
      checkbox.disabled = true;
      label.append(checkbox);
      row.append(info, label);
      return { row, title, keyLabel, checkbox, checked: book.id === 'b-102', originId: book.id };
    }
    function reconcile() {
      panels.forEach(panel => {
        const next = new Map();
        books.forEach((book, index) => {
          const key = keyFor(panel, book, index);
          const instance = panel.instances.get(key) || createInstance(panel, key, book);
          instance.book = book;
          instance.title.textContent = book.title;
          instance.keyLabel.textContent = 'key: ' + key;
          instance.checkbox.setAttribute('aria-label', 'Хочу прочитать «' + book.title + '», ключ ' + (panel.strategy === 'id' ? 'по id' : 'по индексу'));
          instance.row.dataset.moved = String(instance.originId !== book.id);
          next.set(key, instance);
          panel.list.append(instance.row);
        });
        panel.instances.forEach((instance, key) => { if (!next.has(key)) instance.row.remove(); });
        panel.instances = next;
      });
      update();
    }
    function update() {
      const selected = BOOKS.filter(book => panels[0].instances.get(book.id)?.checked);
      const ready = !removed && selected.length === 1 && selected[0].id === 'b-102';
      remove.disabled = !ready;
      
      panels.forEach(panel => {
        panel.instances.forEach(instance => {
          instance.checkbox.checked = instance.checked;
          instance.checkbox.disabled = true;
          instance.row.dataset.checked = String(instance.checked);
        });
        panel.summary.dataset.result = String(removed);
        panel.summary.textContent = removed
          ? (panel.strategy === 'id' ? '✓ b-102: галочка осталась у «Пикника».' : '! key: 1 сохранился — отметка теперь у «Соляриса».')
          : (panel.strategy === 'id' ? 'Состояние связано с ключом книги.' : 'Состояние связано с ключом позиции (индекс с 0).');
      });
      status.textContent = removed
        ? 'После: первая книга удалена. С ключом 1 React узнал прежнюю строку, но теперь в ней другая книга.'
        : ready
          ? 'До: «Пикник» отмечен в обеих колонках. Удалите первую книгу — остальные сдвинутся.'
          : 'До: «Пикник» отмечен в обеих колонках.';
    }
    function reset() {
      books = BOOKS.slice();
      removed = false;
      panels.forEach(panel => {
        panel.instances.clear();
        panel.list.replaceChildren();
      });
      reconcile();
    }
    function onClick(event) {
      const target = event.target.closest('button[data-action]');
      if (disposed || !target || !root.contains(target) || target.disabled) return;
      if (target.dataset.action === 'reset') reset();
      if (target.dataset.action === 'remove') {
        books = books.slice(1);
        removed = true;
        reconcile();
      }
    }
    root.addEventListener('click', onClick);
    reconcile();
    return function cleanup() {
      if (disposed) return;
      disposed = true;
      root.removeEventListener('click', onClick);
      panels.forEach(panel => panel.instances.clear());
      root.remove();
    };
  }

  window.KeysDemo = { mount };
})();
