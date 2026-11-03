/* Local, dependency-free teaching demos. No network requests are made. */
(function () {
  'use strict';

  const STYLE_ID = 'lecture-demo-styles';
  const BOOKS = [
    { id: 'b-101', title: 'Thinking in React', author: 'Учебный каталог', price: 690 },
    { id: 'b-102', title: 'Поток данных', author: 'Учебный каталог', price: 790 },
    { id: 'b-103', title: 'Эффекты и запросы', author: 'Учебный каталог', price: 890 }
  ];

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function add(parent, ...children) { parent.append(...children); return parent; }
  function button(text, secondary) {
    const node = el('button', secondary ? 'demo-button demo-button-secondary' : 'demo-button', text);
    node.type = 'button';
    return node;
  }
  function selectControl(label, choices) {
    const labelNode = el('label', 'demo-field');
    const select = el('select', 'demo-select');
    choices.forEach(([value, text]) => {
      const option = el('option', '', text);
      option.value = value;
      select.append(option);
    });
    add(labelNode, el('span', 'demo-label', label), select);
    return { label: labelNode, select };
  }
  function live(text) {
    const node = el('p', 'demo-live', text);
    node.setAttribute('role', 'status');
    node.setAttribute('aria-live', 'polite');
    node.setAttribute('aria-atomic', 'true');
    return node;
  }
  function title(root, eyebrow, heading, description) {
    add(root, el('p', 'demo-eyebrow', eyebrow), el('h3', 'demo-title', heading), el('p', 'demo-description', description));
  }
  function timerScope() {
    let disposed = false;
    const timers = new Set();
    return {
      after(delay, fn) {
        if (disposed) return;
        const id = setTimeout(() => { timers.delete(id); if (!disposed) fn(); }, delay);
        timers.add(id);
      },
      clear() { timers.forEach(clearTimeout); timers.clear(); },
      dispose() { disposed = true; this.clear(); }
    };
  }
  function styles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = el('style');
    style.id = STYLE_ID;
    style.textContent = `
      .demo-lab{--demo-ink:#171717;--demo-blue:#2148ef;--demo-paper:#f8f6ee;--demo-line:#d9d6cb;color:var(--demo-ink);background:var(--demo-paper);font:inherit;border-top:2px solid var(--demo-ink);padding:clamp(20px,4vw,38px);min-width:0;box-sizing:border-box}
      .demo-lab *{box-sizing:border-box}.demo-eyebrow{margin:0 0 10px;color:var(--demo-blue);font-size:11px;line-height:1.4;font-weight:750;letter-spacing:.14em;text-transform:uppercase}.demo-title{font:inherit;font-size:clamp(23px,3vw,32px);font-weight:650;line-height:1.16;letter-spacing:-.035em;margin:0 0 12px}.demo-description{max-width:72ch;margin:0 0 24px;color:#5a5a53;font-size:14px;line-height:1.6}
      .demo-controls{display:flex;align-items:end;gap:10px;flex-wrap:wrap;margin:0 0 22px}.demo-field{display:flex;flex-direction:column;gap:7px;min-width:190px}.demo-label{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#57574f}.demo-select{font:inherit;font-size:14px;color:var(--demo-ink);background:#fffdf7;min-height:43px;border:1px solid #aaa79e;border-radius:0;padding:9px 32px 9px 12px;max-width:100%}.demo-button{font:inherit;font-size:13px;font-weight:650;border:1px solid var(--demo-blue);border-radius:0;background:var(--demo-blue);color:#fff;min-height:43px;padding:10px 17px;cursor:pointer;transition:background .15s}.demo-button:hover{background:#1534b6}.demo-button-secondary{background:transparent;color:var(--demo-ink);border-color:#aaa79e}.demo-button-secondary:hover{background:#e9e6dc}.demo-button:disabled,.demo-select:disabled{opacity:.42;cursor:default}.demo-lab button:focus-visible,.demo-lab select:focus-visible,.demo-lab input:focus-visible{outline:3px solid var(--demo-blue);outline-offset:4px}
      .demo-live{font-size:13px;line-height:1.55;margin:0 0 20px;padding-left:12px;border-left:3px solid var(--demo-blue);color:#4c4c46}.demo-split{display:grid;grid-template-columns:1.05fr 1fr;gap:28px;align-items:start}.demo-section-label{font-size:11px;line-height:1.4;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#66665e;margin:0 0 12px}.demo-response{border-top:1px solid var(--demo-line);padding-top:15px;min-width:0}.demo-status-row{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:12px}.demo-status{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--demo-blue);font-weight:600}.demo-code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere;background:#eeece3;margin:0;padding:16px;overflow:auto;max-height:290px}.demo-state{border-top:1px solid var(--demo-line);padding:20px 0;min-height:167px}.demo-state h4{font-size:19px;letter-spacing:-.02em;margin:0 0 8px}.demo-state p{font-size:13px;line-height:1.6;color:#66665e;margin:0}.demo-state[data-state="error"] h4{color:#a52f22}.demo-state[data-state="loading"] h4::before{content:"";display:inline-block;width:10px;height:10px;margin-right:10px;background:var(--demo-blue);animation:demo-pulse 1s ease-in-out infinite}.demo-books{list-style:none;margin:0;padding:0}.demo-book{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--demo-line)}.demo-book-number{color:var(--demo-blue);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;padding-top:2px}.demo-book-title{font-size:16px;font-weight:650;line-height:1.35}.demo-book-author{font-size:12px;color:#77776c;margin-top:4px}.demo-note{font-size:12px;color:#6b6b61;line-height:1.6;margin:18px 0 0}
      .demo-metrics{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--demo-line);border-bottom:1px solid var(--demo-line);margin-bottom:20px}.demo-metric{padding:15px 12px 15px 0}.demo-metric+.demo-metric{border-left:1px solid var(--demo-line);padding-left:18px}.demo-metric-number{display:block;font-size:36px;line-height:1.1;font-weight:550;letter-spacing:-.05em;font-variant-numeric:tabular-nums}.demo-metric-label{display:block;color:#77776c;font-size:11px;margin-top:5px;letter-spacing:.07em;text-transform:uppercase}.demo-effect-state{display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;margin-bottom:15px;font-size:13px}.demo-log{list-style:none;margin:0;padding:0}.demo-log li{padding:9px 0;display:flex;gap:10px;align-items:baseline;border-bottom:1px solid var(--demo-line);font-size:12px;line-height:1.5}.demo-log-seq{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#85857a;font-size:11px;min-width:25px}.demo-log-kind{font-weight:750;color:var(--demo-blue);min-width:62px}.demo-log-detail{color:#66665e}.demo-toggle{display:flex;align-items:center;gap:9px;font-size:13px;min-height:43px;margin-right:auto;cursor:pointer}.demo-toggle input{width:17px;height:17px;accent-color:var(--demo-blue);margin:0}.demo-race-specs{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--demo-line);border-bottom:1px solid var(--demo-line);margin-bottom:20px}.demo-race-spec{padding:13px 0;font-size:13px}.demo-race-spec+.demo-race-spec{border-left:1px solid var(--demo-line);padding-left:18px}.demo-race-spec strong{color:var(--demo-blue);margin-right:7px}.demo-race-result{padding:15px 0;border-top:1px solid var(--demo-line);border-bottom:1px solid var(--demo-line)}.demo-result-value{font-size:30px;font-weight:600;letter-spacing:-.045em;margin:0 0 7px}.demo-race-result[data-outcome="stale"] .demo-result-value{color:#a52f22}.demo-race-result[data-outcome="fresh"] .demo-result-value{color:var(--demo-blue)}.demo-result-caption{font-size:12px;color:#6b6b61;line-height:1.6;margin:0}.demo-timeline{list-style:none;padding:0;margin:0}.demo-timeline li{display:grid;grid-template-columns:56px 12px 1fr;gap:9px;font-size:12px;line-height:1.5;padding:9px 0}.demo-timeline-time{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;color:#85857a;font-size:11px;white-space:nowrap}.demo-timeline-dot{width:7px;height:7px;background:var(--demo-blue);border-radius:50%;margin-top:5px}.demo-timeline li[data-event="ignored"] .demo-timeline-dot{background:#88887c}.demo-timeline li[data-event="stale"] .demo-timeline-dot{background:#a52f22}.demo-timeline-empty{color:#8b8b7d;font-size:13px;line-height:1.6;margin:0}
      .demo-architecture-options{display:grid;grid-template-columns:1fr 1fr;gap:0;border-top:1px solid var(--demo-line);margin:0 0 24px}.demo-architecture-choice{font:inherit;font-size:13px;font-weight:500;line-height:1.5;display:flex;gap:12px;align-items:baseline;text-align:left;background:none;color:var(--demo-ink);padding:13px 10px 13px 0;border:0;border-bottom:1px solid var(--demo-line);cursor:pointer}.demo-architecture-choice:nth-child(even){padding-left:18px;border-left:1px solid var(--demo-line)}.demo-architecture-choice[aria-pressed="true"]{color:var(--demo-blue);font-weight:700;background:#eeeee9}.demo-architecture-choice:hover{background:#eeece3}.demo-choice-index{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;color:#77776c;flex-shrink:0}.demo-architecture-choice[aria-pressed="true"] .demo-choice-index{color:var(--demo-blue)}.demo-flow{display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:25px;padding:24px 0;border-top:1px solid var(--demo-line);border-bottom:1px solid var(--demo-line);flex-wrap:wrap}.demo-flow-node{padding:12px 13px;border:1px solid #b5b2a7;min-width:100px;text-align:center}.demo-flow-node[data-tier="client"]{border-color:var(--demo-blue);color:var(--demo-blue)}.demo-flow-name{display:block;font-size:15px;font-weight:650;line-height:1.4}.demo-flow-role{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:#77776c;margin-top:4px}.demo-flow-link{display:flex;flex-direction:column;align-items:center;min-width:37px;color:#77776c;font-size:10px}.demo-flow-arrow{font-size:21px;line-height:1.2;color:var(--demo-blue)}.demo-role-list{margin:0;padding:0;list-style:none}.demo-role-list li{font-size:13px;line-height:1.6;margin:0 0 12px}.demo-role-list strong{font-weight:700}.demo-contract{font-size:12px;line-height:1.6;color:#66665e;margin:12px 0 0}.demo-endpoint{display:block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--demo-blue);overflow-wrap:anywhere;margin-bottom:12px}
      @keyframes demo-pulse{0%,100%{opacity:1}50%{opacity:.3}}@media(prefers-reduced-motion:reduce){.demo-lab *{animation:none!important;transition:none!important}}@media(max-width:650px){.demo-split{grid-template-columns:1fr;gap:22px}.demo-architecture-options{grid-template-columns:1fr}.demo-architecture-choice:nth-child(even){padding-left:0;border-left:0}.demo-field{width:100%;min-width:0}.demo-select{width:100%}.demo-flow{justify-content:flex-start}.demo-flow-node{min-width:80px;padding:10px}.demo-flow-name{font-size:13px}.demo-flow-role{font-size:9px}.demo-log li{flex-wrap:wrap;gap:6px}.demo-log-detail{flex-basis:100%;padding-left:35px}.demo-controls .demo-button{flex-grow:1}.demo-toggle{width:100%}}
    `;
    document.head.append(style);
  }

  function requestDemo(root) {
    const timers = timerScope();
    title(root, '01 / Запрос и состояние', 'Один запрос — четыре состояния', 'Выберите ответ сервера и проследите, как меняется интерфейс. Все данные и задержки здесь — учебная симуляция HTTP, без обращения к сети.');
    const scenario = selectControl('Ответ сервера', [['success', '200 · Каталог книг'], ['empty', '200 · Пустой каталог'], ['error', '500 · Ошибка сервера'], ['network', 'Сбой сети · Нет HTTP-ответа'], ['slow', '200 · Медленный ответ']]);
    const start = button('Запрос');
    const retry = button('Повторить', true);
    retry.disabled = true;
    const status = live('Готово к запросу. Выберите сценарий и нажмите «Запрос».');
    const state = el('div', 'demo-state');
    const http = el('span', 'demo-status', '—');
    const json = el('pre', 'demo-code', '// Ответ ещё не получен');
    const response = add(el('div', 'demo-response'), add(el('div', 'demo-status-row'), el('h4', 'demo-section-label', 'HTTP / JSON'), http), json);
    const controls = add(el('div', 'demo-controls'), scenario.label, start, retry);
    add(root, controls, status, add(el('div', 'demo-split'), state, response));
    function stateMessage(kind, heading, message) {
      state.dataset.state = kind;
      state.replaceChildren(el('h4', '', heading), el('p', '', message));
    }
    stateMessage('idle', 'Каталог книг', 'Пока здесь нет данных. Запрос запустится только по нажатию кнопки.');
    function run() {
      timers.clear();
      const selected = scenario.select.value;
      start.disabled = true;
      retry.disabled = true;
      scenario.select.disabled = true;
      state.setAttribute('aria-busy', 'true');
      stateMessage('loading', 'Загружаем каталог…', selected === 'slow' ? 'Сервер отвечает за 2,4 секунды. Пользователь видит, что запрос выполняется.' : 'Запрос выполняется. Не показываем пустой список до получения ответа.');
      http.textContent = 'Ожидаем ответ';
      json.textContent = '// GET /api/books\n// Запрос отправлен…';
      status.textContent = 'Loading: запрос отправлен, ожидаем ответ сервера.';
      timers.after(selected === 'slow' ? 2400 : 650, () => {
        start.disabled = false;
        retry.disabled = false;
        scenario.select.disabled = false;
        state.setAttribute('aria-busy', 'false');
        if (selected === 'network') {
          http.textContent = 'Нет HTTP-ответа';
          json.textContent = '// Сбой сети: ответ сервера не получен.\n// HTTP-статуса и JSON нет.';
          stateMessage('error', 'Нет связи с сервером', 'Запрос не получил HTTP-ответ. Проверьте соединение и повторите запрос. В этой симуляции смените сценарий, чтобы восстановить связь.');
          status.textContent = 'Error: сбой сети. HTTP-ответ не получен; статус и JSON отсутствуют. Доступен повтор запроса.';
        } else if (selected === 'error') {
          http.textContent = '500 Internal Server Error';
          json.textContent = JSON.stringify({ error: 'Сервис каталога временно недоступен' }, null, 2);
          stateMessage('error', 'Не удалось загрузить книги', 'Сервер вернул HTTP 500. Измените сценарий или повторите запрос.');
          status.textContent = 'Error: HTTP 500. Данные не загружены. Доступен повтор запроса.';
        } else if (selected === 'empty') {
          http.textContent = '200 OK';
          json.textContent = JSON.stringify({ books: [] }, null, 2);
          stateMessage('empty', 'Книг пока нет', 'Запрос завершился успешно, но сервер вернул books: []. Это отдельное состояние интерфейса.');
          status.textContent = 'Empty: HTTP 200, получен ответ с books: []. Ошибки нет.';
        } else {
          http.textContent = '200 OK';
          json.textContent = JSON.stringify({ books: BOOKS }, null, 2);
          state.dataset.state = 'success';
          const list = el('ul', 'demo-books');
          BOOKS.forEach((book, index) => {
            add(list, add(el('li', 'demo-book'), el('span', 'demo-book-number', String(index + 1).padStart(2, '0')), add(el('div'), el('div', 'demo-book-title', book.title), el('div', 'demo-book-author', book.author + ' · ' + book.price + ' ₽'))));
          });
          state.replaceChildren(el('h4', '', 'Каталог загружен'), list);
          status.textContent = 'Success: HTTP 200. В интерфейсе отображаются три книги из JSON.';
        }
      });
    }
    start.addEventListener('click', run);
    retry.addEventListener('click', run);
    return () => timers.dispose();
  }

  function effectDemo(root) {
    title(root, '02 / Жизненный цикл эффекта', 'Что действительно запускает useEffect', 'Меняйте категорию и независимый счётчик. Числа и журнал показывают render, запуск эффекта и cleanup. Это упрощённая учебная модель: каждый render завершается обновлением компонента; дополнительная проверка Strict Mode не моделируется.');
    const deps = selectControl('Зависимости', [['none', 'Без массива'], ['empty', '[] · При монтировании'], ['category', '[category] · По категории']]);
    deps.select.value = 'category';
    const category = selectControl('Категория', [['react', 'React'], ['javascript', 'JavaScript'], ['architecture', 'Архитектура']]);
    const countButton = button('Счётчик +1', true);
    const mountButton = button('Размонтировать', true);
    const status = live('Компонент смонтирован: первый render и первый запуск эффекта.');
    const controls = add(el('div', 'demo-controls'), deps.label, category.label, countButton, mountButton);
    const metrics = el('div', 'demo-metrics');
    const numbers = {};
    [['render', 'Render'], ['effect', 'Effect setup'], ['cleanup', 'Cleanup']].forEach(([key, label]) => {
      numbers[key] = el('strong', 'demo-metric-number', '0');
      add(metrics, add(el('div', 'demo-metric'), numbers[key], el('span', 'demo-metric-label', label)));
    });
    const mountedLabel = el('span');
    const unrelatedLabel = el('span');
    const code = el('pre', 'demo-code');
    const explanation = el('p', 'demo-note');
    const log = el('ol', 'demo-log');
    add(root, controls, status, metrics, add(el('div', 'demo-effect-state'), mountedLabel, unrelatedLabel), add(el('div', 'demo-split'), add(el('div'), code, explanation), add(el('div'), el('h4', 'demo-section-label', 'Последние события'), log)));
    let mounted = false;
    let activeEffect = false;
    let unrelated = 0;
    let sequence = 0;
    const counts = { render: 0, effect: 0, cleanup: 0 };
    function event(kind, detail) {
      sequence += 1;
      add(log, add(el('li'), el('span', 'demo-log-seq', String(sequence).padStart(2, '0')), el('span', 'demo-log-kind', kind), el('span', 'demo-log-detail', detail)));
      while (log.children.length > 7) log.firstElementChild.remove();
    }
    function cleanup(reason) {
      if (!activeEffect) return;
      activeEffect = false;
      counts.cleanup += 1;
      event('cleanup', reason);
    }
    function setup(reason) {
      counts.effect += 1;
      activeEffect = true;
      event('effect', reason);
    }
    function render(reason, dependencyChanged, initial) {
      if (!mounted) return;
      counts.render += 1;
      event('render', reason);
      const mode = deps.select.value;
      if (initial || mode === 'none' || (mode === 'category' && dependencyChanged)) {
        cleanup('Перед следующим запуском эффекта');
        setup('category = ' + category.select.value);
      }
      update();
    }
    function update() {
      Object.keys(counts).forEach(key => { numbers[key].textContent = String(counts[key]); });
      category.select.disabled = !mounted;
      countButton.disabled = !mounted;
      mountedLabel.textContent = mounted ? '● Компонент смонтирован' : '○ Компонент размонтирован';
      unrelatedLabel.textContent = 'Независимый счётчик: ' + unrelated;
      mountButton.textContent = mounted ? 'Размонтировать' : 'Смонтировать';
      const suffix = deps.select.value === 'none' ? '' : deps.select.value === 'empty' ? ', []' : ', [category]';
      code.textContent = 'useEffect(() => {\n  // setup: запустить синхронизацию\n  return () => {\n    // cleanup: отменить / отключить\n  };\n}' + suffix + ');';
      explanation.textContent = deps.select.value === 'none' ? 'Без массива: эффект запускается после каждого завершённого обновления компонента. Перед повторным setup вызывается cleanup предыдущего эффекта.' : deps.select.value === 'empty' ? '[]: эффект запускается при каждом монтировании. Смена категории и счётчика вызывает render, но не повторяет эффект.' : '[category]: эффект запускается при монтировании и после изменения category. Независимый счётчик вызывает только render.';
    }
    function mount(reason) {
      mounted = true;
      render(reason, true, true);
    }
    category.select.addEventListener('change', () => {
      render('Изменилась category', true, false);
      status.textContent = deps.select.value === 'empty' ? 'Категория изменилась: новый render. С зависимостями [] эффект не повторяется.' : 'Категория изменилась: render → cleanup → новый setup.';
    });
    countButton.addEventListener('click', () => {
      unrelated += 1;
      render('Изменился независимый счётчик', false, false);
      status.textContent = deps.select.value === 'none' ? 'Счётчик изменился: render → cleanup → setup, потому что массива зависимостей нет.' : 'Счётчик изменился: новый render. Зависимости эффекта не изменились.';
    });
    mountButton.addEventListener('click', () => {
      if (mounted) {
        mounted = false;
        cleanup('Компонент размонтирован');
        status.textContent = 'Компонент размонтирован. Выполнен cleanup активного эффекта; нового render нет.';
        update();
      } else {
        unrelated = 0;
        mount('Новое монтирование');
        status.textContent = 'Новое монтирование: render и setup. Счётчик компонента сброшен; журнал и итоги сохранены.';
      }
    });
    deps.select.addEventListener('change', () => {
      // Each dependency mode is a separate component variant, with an actual remount.
      if (mounted) {
        cleanup('Смена примера: размонтирование');
        unrelated = 0;
        mount('Смена примера: новое монтирование');
        status.textContent = 'Выбран другой вариант useEffect: прежний компонент очищен, новый смонтирован. Итоги сохранены.';
      } else {
        update();
        status.textContent = 'Вариант зависимостей изменён. Нажмите «Смонтировать», чтобы запустить компонент.';
      }
    });
    mount('Первое монтирование');
    return () => { cleanup('Демо закрыто'); mounted = false; };
  }

  function raceDemo(root) {
    const timers = timerScope();
    title(root, '03 / Гонка ответов', 'Последний запрос ≠ последний ответ', 'Сначала отправляется медленный запрос A, затем быстрый B. Пользователь уже выбрал B, но ответ A приходит позже. Запустите одинаковый сценарий с защитой и без неё.');
    const protectionLabel = el('label', 'demo-toggle');
    const protection = el('input');
    protection.type = 'checkbox';
    protection.checked = true;
    add(protectionLabel, protection, el('span', '', 'Игнорировать устаревший ответ'));
    const start = button('Запустить A → B');
    const reset = button('Сбросить', true);
    const status = live('Готово. Защита включена: в состояние попадёт только ответ актуального запроса.');
    const timeline = el('ol', 'demo-timeline');
    const timelineEmpty = el('p', 'demo-timeline-empty', 'События появятся после запуска. Время отсчитывается от отправки A.');
    const timelinePanel = add(el('div'), el('h4', 'demo-section-label', 'Временная шкала'), timelineEmpty, timeline);
    const result = el('div', 'demo-race-result');
    const resultValue = el('p', 'demo-result-value', '—');
    const resultCaption = el('p', 'demo-result-caption', 'В интерфейсе пока нет данных.');
    const latestLabel = el('p', 'demo-note', 'Последний выбранный запрос: —');
    add(result, el('h4', 'demo-section-label', 'Состояние интерфейса'), resultValue, resultCaption);
    add(root, add(el('div', 'demo-controls'), protectionLabel, start, reset), status,
      add(el('div', 'demo-race-specs'), add(el('div', 'demo-race-spec'), el('strong', '', 'A'), el('span', '', '1800 мс · медленный')), add(el('div', 'demo-race-spec'), el('strong', '', 'B'), el('span', '', '450 мс · быстрый'))),
      add(el('div', 'demo-split'), add(el('div'), result, latestLabel), timelinePanel));
    let generation = 0;
    let latest = null;
    let finished = 0;
    function event(time, text, kind) {
      timelineEmpty.hidden = true;
      const item = add(el('li'), el('span', 'demo-timeline-time', time + ' мс'), el('span', 'demo-timeline-dot'), el('span', '', text));
      if (kind) item.dataset.event = kind;
      timeline.append(item);
    }
    function resetState(announce) {
      generation += 1;
      timers.clear();
      latest = null;
      finished = 0;
      start.disabled = false;
      protection.disabled = false;
      result.removeAttribute('data-outcome');
      resultValue.textContent = '—';
      resultCaption.textContent = 'В интерфейсе пока нет данных.';
      latestLabel.textContent = 'Последний выбранный запрос: —';
      timeline.replaceChildren();
      timelineEmpty.hidden = false;
      if (announce) status.textContent = protection.checked ? 'Сценарий сброшен. Защита включена: устаревший A будет проигнорирован.' : 'Сценарий сброшен. Защита выключена: поздний A перезапишет данные B.';
    }
    function run() {
      resetState(false);
      const runId = generation;
      const protectedRun = protection.checked;
      start.disabled = true;
      protection.disabled = true;
      latest = 'A';
      latestLabel.textContent = 'Последний выбранный запрос: A';
      event(0, 'Отправлен запрос A. Ответ ожидается через 1800 мс.');
      status.textContent = 'Запрос A отправлен. Через 180 мс отправится B.';
      function complete(name, at) {
        if (runId !== generation) return;
        finished += 1;
        if (protectedRun && name !== latest) {
          event(at, 'Ответ A получен и проигнорирован: актуальный запрос — B.', 'ignored');
          status.textContent = 'Готово: устаревший ответ A проигнорирован. В интерфейсе остаются актуальные данные B.';
        } else {
          const stale = name !== latest;
          resultValue.textContent = 'Данные ' + name;
          result.dataset.outcome = stale ? 'stale' : 'fresh';
          resultCaption.textContent = stale ? 'Устаревший ответ перезаписал B. Интерфейс показывает A, хотя пользователь выбрал B.' : 'Ответ соответствует последнему выбранному запросу B.';
          event(at, 'Ответ ' + name + ' получен → состояние = ' + name + (stale ? '. Устаревшие данные!' : '.'), stale ? 'stale' : 'fresh');
          status.textContent = stale ? 'Готово: гонка ответов. Поздний A перезаписал B, и интерфейс показывает устаревшие данные.' : 'B ответил первым. В интерфейсе данные B; медленный A ещё выполняется.';
        }
        if (finished === 2) { start.disabled = false; protection.disabled = false; }
      }
      timers.after(180, () => {
        if (runId !== generation) return;
        latest = 'B';
        latestLabel.textContent = 'Последний выбранный запрос: B';
        event(180, 'Отправлен запрос B. Теперь актуален B, ответ через 450 мс.');
        status.textContent = 'Запрос B отправлен. Он отвечает быстрее A.';
        timers.after(450, () => complete('B', 630));
      });
      timers.after(1800, () => complete('A', 1800));
    }
    start.addEventListener('click', run);
    reset.addEventListener('click', () => resetState(true));
    protection.addEventListener('change', () => resetState(true));
    add(root, el('p', 'demo-note', 'Защита в этом примере сравнивает номер ответа с актуальным запросом. В useEffect ту же задачу решают cleanup с флагом игнорирования или отмена через AbortController. Все ответы здесь локально имитированы.'));
    return () => { generation += 1; timers.dispose(); };
  }

  function architectureDemo(root) {
    title(root, '04 / Архитектура', 'Кто отвечает за данные', 'React показывает состояние и отправляет HTTP-запрос. Выберите источник данных: дополнительный сервер появляется, когда нужны секреты, объединение сервисов или собственная база.');
    const variants = [
      {
        name: 'React → готовое API',
        nodes: [['React', 'Браузер', 'client'], ['Готовое API', 'Сервис', 'server']], links: ['HTTP'],
        roles: [['React', 'Отправляет запрос, разбирает ответ и показывает loading, error, empty или success.'], ['Готовое API', 'Уже содержит серверную логику и возвращает данные. Для запроса из браузера сервис должен разрешать CORS.']],
        note: 'Подходит для публичного API. Секретные ключи нельзя хранить в коде React: код и запросы доступны пользователю.',
        contract: 'Если готовое API имеет другую форму ответа, клиентский адаптер приводит её к согласованному формату книг.'
      },
      {
        name: 'React → Node.js → внешнее API',
        nodes: [['React', 'Браузер', 'client'], ['Node.js', 'Ваш сервер', 'server'], ['Внешнее API', 'Сервис', 'server']], links: ['HTTP', 'HTTP'],
        roles: [['React', 'Обращается к вашему endpoint и работает с привычным форматом книг.'], ['Node.js', 'Хранит секретный API-ключ, обращается к внешнему сервису и преобразует его ответ.'], ['Внешнее API', 'Поставляет данные. Его контракт может отличаться от контракта интерфейса.']],
        note: 'Секреты находятся на Node.js. Сервер также может проверять доступ, кэшировать ответы и ограничивать число запросов.',
        contract: 'Node.js переводит ответ внешнего сервиса в стабильный JSON для React.'
      },
      {
        name: 'React → Node.js → база данных',
        nodes: [['React', 'Браузер', 'client'], ['Node.js', 'Ваш сервер', 'server'], ['База данных', 'Хранилище', 'database']], links: ['HTTP', 'Драйвер / SQL'],
        roles: [['React', 'Вызывает HTTP API приложения. Показывает данные и состояния запроса.'], ['Node.js', 'Проверяет входные данные и права, выполняет бизнес-логику и обращается к базе.'], ['База данных', 'Хранит собственные книги. Доступ к ней получает сервер через драйвер или ORM.']],
        note: 'Внешний API здесь не нужен: приложение работает с собственными данными. Пароль базы хранится на сервере. React не подключается к базе напрямую. Запрос между Node.js и базой не обязан быть HTTP.',
        contract: 'Внутренняя структура таблиц скрыта за API. Изменения базы не должны менять формат, ожидаемый интерфейсом.'
      },
      {
        name: 'React → Node.js → Java API',
        nodes: [['React', 'Браузер', 'client'], ['Node.js', 'Шлюз / адаптер', 'server'], ['Java API', 'Ваша лабораторная', 'server']], links: ['HTTP', 'HTTP'],
        roles: [['React', 'Отправляет запрос к Node.js и отображает согласованный JSON.'], ['Node.js', 'Пересылает запрос к Java API, при необходимости преобразует ответ и хранит серверные секреты.'], ['Java API', 'Выполняет логику лабораторной и возвращает данные через HTTP endpoint.']],
        note: 'Для интеграции лабораторная на Java должна предоставлять HTTP endpoint, например GET /api/books. Консольной программы для этого недостаточно.',
        contract: 'Согласуйте URL, HTTP-метод, структуру JSON и ошибки. Node.js сохраняет контракт React при изменениях Java-сервиса.'
      }
    ];
    const options = el('div', 'demo-architecture-options');
    options.setAttribute('role', 'group');
    options.setAttribute('aria-label', 'Выбор архитектуры приложения');
    const flow = el('div', 'demo-flow');
    flow.setAttribute('role', 'img');
    const roleList = el('ul', 'demo-role-list');
    const note = el('p', 'demo-note');
    const contract = el('p', 'demo-contract');
    const status = live('Выбрана схема: React → готовое API.');
    const contractPanel = add(el('div'), el('h4', 'demo-section-label', 'Пример контракта для интерфейса'), el('code', 'demo-endpoint', 'GET /api/books'), el('pre', 'demo-code', JSON.stringify({ books: [{ id: 'b-101', title: 'Thinking in React', author: 'Учебный каталог', price: 690 }] }, null, 2)), contract);
    const optionButtons = variants.map((variant, index) => {
      const item = button('', true);
      item.className = 'demo-architecture-choice';
      add(item, el('span', 'demo-choice-index', '0' + (index + 1)), el('span', '', variant.name));
      item.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
      item.addEventListener('click', () => choose(index));
      options.append(item);
      return item;
    });
    add(root, options, flow, status, add(el('div', 'demo-split'), add(el('div'), el('h4', 'demo-section-label', 'Роли участников'), roleList, note), contractPanel));
    function choose(index) {
      const variant = variants[index];
      optionButtons.forEach((item, i) => item.setAttribute('aria-pressed', i === index ? 'true' : 'false'));
      flow.replaceChildren();
      flow.setAttribute('aria-label', variant.name + '. Связи: ' + variant.links.join(', ') + '.');
      variant.nodes.forEach(([name, role, tier], i) => {
        if (i > 0) {
          const link = add(el('span', 'demo-flow-link'), el('span', '', variant.links[i - 1]), el('span', 'demo-flow-arrow', '→'));
          link.setAttribute('aria-hidden', 'true');
          flow.append(link);
        }
        const node = add(el('div', 'demo-flow-node'), el('span', 'demo-flow-name', name), el('span', 'demo-flow-role', role));
        node.dataset.tier = tier;
        node.setAttribute('aria-hidden', 'true');
        flow.append(node);
      });
      roleList.replaceChildren();
      variant.roles.forEach(([name, explanation]) => add(roleList, add(el('li'), el('strong', '', name + '. '), document.createTextNode(explanation))));
      note.textContent = variant.note;
      contract.textContent = 'Путь здесь — пример договорённости. ' + variant.contract;
      status.textContent = 'Выбрана схема: ' + variant.name + '.';
    }
    choose(0);
    return () => {};
  }

  const demos = { request: requestDemo, effect: effectDemo, race: raceDemo, architecture: architectureDemo };
  window.LectureDemos = Object.freeze({
    mount(name, container, options = {}) {
      if (name === 'keys') return window.KeysDemo.mount(container);
      if (name === 'catalog') return window.CatalogDemo.mount(container, options);
      if (!container || typeof container.append !== 'function') throw new TypeError('LectureDemos.mount requires a DOM container');
      if (!Object.prototype.hasOwnProperty.call(demos, name)) throw new Error('Unknown lecture demo: ' + name);
      styles();
      const root = el('section', 'demo-lab');
      root.dataset.demo = name;
      root.setAttribute('aria-label', { request: 'Учебная симуляция HTTP-запроса', effect: 'Симуляция useEffect', race: 'Симуляция гонки ответов', architecture: 'Схемы архитектуры приложения' }[name]);
      container.append(root);
      let disposed = false;
      const disposeDemo = demos[name](root);
      return function cleanup() {
        if (disposed) return;
        disposed = true;
        disposeDemo();
        root.remove();
      };
    }
  });
})();
