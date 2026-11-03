import { mountCatalogStory } from './catalog-story.js';
import { mountApiDiagram } from './api-diagrams.js';

export function mountSlide(article, { slide, lecture, stage, onNext }) {
  const chapters = lecture.chapters || [];
  const pad = n => String(n).padStart(2, "0");
  let cleanupDemo = null;
  let cleanupDiagram = null;
  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function textItems(items, className = 'text-items') {
    const group = el('div', className);
    items.forEach((item) => {
      const block = el('section', 'text-item');
      if (item.title) block.append(el('h3', '', item.title));
      if (item.text) block.append(el('p', '', item.text));
      if (item.code) block.append(el('code', '', item.code));
      group.append(block);
    });
    return group;
  }

  function bullets(items) {
    const list = el('ul', 'bullet-list');
    items.forEach((item) => list.append(el('li', '', item)));
    return list;
  }

  // The lexer creates text nodes: lecture content never becomes executable markup.
  function syntaxLines(source) {
    const lines = [document.createDocumentFragment()];
    const expression = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:async|await|break|case|catch|class|const|continue|default|delete|do|else|export|false|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|switch|throw|true|try|typeof|undefined|var|void|while|yield)\b|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*(?=\s*\())/g;
    const append = (text, kind) => {
      const parts = text.split('\n');
      parts.forEach((part, index) => {
        if (index) lines.push(document.createDocumentFragment());
        if (part) lines[lines.length - 1].append(kind ? el('span', `token-${kind}`, part) : document.createTextNode(part));
      });
    };
    let cursor = 0;
    for (const match of source.matchAll(expression)) {
      append(source.slice(cursor, match.index));
      const value = match[0];
      const kind = value.startsWith('//') || value.startsWith('/*') ? 'comment' : /^['"`]/.test(value) ? 'string' : /^\d/.test(value) ? 'number' : /^(async|await|break|case|catch|class|const|continue|default|delete|do|else|export|false|finally|for|from|function|if|import|in|instanceof|let|new|null|of|return|switch|throw|true|try|typeof|undefined|var|void|while|yield)$/.test(value) ? 'keyword' : 'function';
      append(value, kind);
      cursor = match.index + value.length;
    }
    append(source.slice(cursor));
    return lines;
  }

  function codeBlock(code) {
    const wrapper = el('div', 'code-window');
    if (code.fullComponent) wrapper.classList.add('is-component');
    if (code.intent === 'warning') wrapper.classList.add('code-warning');
    const header = el('div', 'code-heading');
    header.append(el('span', 'code-filename', code.file || 'JavaScript'));
    const copy = el('button', 'copy-code', 'Копировать');
    copy.type = 'button';
    copy.setAttribute('aria-label', `Копировать код ${code.file || ''}`.trim());
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.text || '');
        copy.textContent = 'Скопировано';
        document.getElementById('announcement').textContent = 'Код скопирован';
      } catch {
        copy.textContent = 'Выделите код';
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(codeBody);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    });
    header.append(copy);
    const pre = el('pre');
    pre.tabIndex = 0;
    pre.setAttribute('aria-label', `Код ${code.file || 'JavaScript'}`);
    const content = el('code');
    const highlights = new Set(code.highlight || []);
    syntaxLines(String(code.text || '').replace(/\r\n/g, '\n').replace(/\n$/, '')).forEach((line, index) => {
      const span = el('span', `code-line${highlights.has(index + 1) ? ' highlighted' : ''}`);
      span.dataset.line = index + 1;
      const sourceLine = line.textContent;
      const expressionStart = code.executionExpression ? sourceLine.indexOf(code.executionExpression) : -1;
      if (expressionStart >= 0) {
        const expression = el('span', 'code-expression');
        expression.dataset.expression = code.executionExpression;
        expression.append(syntaxLines(code.executionExpression)[0]);
        span.append(syntaxLines(sourceLine.slice(0, expressionStart))[0], expression,
          syntaxLines(sourceLine.slice(expressionStart + code.executionExpression.length))[0]);
      } else span.append(line);
      if (code.semanticLegend) {
        const walker = document.createTreeWalker(span, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(node => {
          const text = node.textContent;
          const matches = [...text.matchAll(/\b(book|onAdd)\b/g)];
          if (!matches.length) return;
          const fragment = document.createDocumentFragment();
          let cursor = 0;
          matches.forEach(match => {
            fragment.append(document.createTextNode(text.slice(cursor, match.index)));
            fragment.append(el('span', 'semantic-tag semantic-' + (match[0] === 'book' ? 'data' : 'callback'), match[0]));
            cursor = match.index + match[0].length;
          });
          fragment.append(document.createTextNode(text.slice(cursor)));
          node.replaceWith(fragment);
        });
      }
      content.append(span);
    });
    pre.append(content);
    const codeBody = el('div', 'code-content');
    const splitAt = Number(code.splitAt);
    if (splitAt > 1 && splitAt <= content.children.length) {
      codeBody.classList.add('code-columns');
      const secondPre = el('pre');
      secondPre.tabIndex = 0;
      secondPre.setAttribute('aria-label', `Код ${code.file || 'JavaScript'} · продолжение`);
      const secondCode = el('code');
      const lines = [...content.children];
      lines.slice(splitAt - 1).forEach(line => secondCode.append(line));
      secondPre.append(secondCode);
      const firstPane = el('div', 'code-pane');
      const secondPane = el('div', 'code-pane');
      firstPane.append(el('p', 'code-pane-label', 'Начало файла · логика'), pre);
      secondPane.append(el('p', 'code-pane-label', 'Продолжение · разметка'), secondPre);
      codeBody.append(firstPane, secondPane);
    } else codeBody.append(pre);
    wrapper.append(header, codeBody);
    return wrapper;
  }

  function flow(steps) {
    const group = el('ol', 'flow' + (slide.flowDirection === 'vertical' ? ' flow-vertical' : ''));
    steps.forEach((step, index) => {
      const item = el('li', 'flow-step');
      item.append(el('span', 'step-number', pad(index + 1)), el('h3', '', step.label));
      if (step.text) item.append(el('p', '', step.text));
      group.append(item);
    });
    return group;
  }

  function coverArtwork() {
    const art = el('div', 'cover-art');
    // The solid arrows follow data from its API source through JSON into the UI.
    art.innerHTML = `<svg viewBox="0 0 600 510" role="img" aria-label="Данные идут из API в JSON-ответ, затем в интерфейс каталога книг. Пунктирная стрелка показывает GET-запрос интерфейса к API.">
      <defs>
        <pattern id="cover-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".85" fill="#cfd2c5" /></pattern>
        <marker id="cover-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M1 1 8 5 1 9" fill="none" stroke="#2348ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></marker>
        <marker id="cover-request-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M1 1 7 4.5 1 8" fill="none" stroke="#929b86" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></marker>
      </defs>
      <rect x="15" y="18" width="580" height="462" rx="24" fill="url(#cover-grid)" />
      <text x="39" y="52" font-size="11" fill="#74766e" letter-spacing="1.5">ОТ ДАННЫХ К ИНТЕРФЕЙСУ</text>
      <path d="M209 155H292" fill="none" stroke="#2348ff" stroke-width="3" marker-end="url(#cover-arrow)" />
      <text x="232" y="132" font-size="11" fill="#2348ff">200 OK</text>
      <path d="M429 226V288" fill="none" stroke="#2348ff" stroke-width="3" marker-end="url(#cover-arrow)" />
      <text x="446" y="262" font-size="11" fill="#2348ff">Данные в UI</text>
      <path d="M300 405H143Q119 405 119 381V227" fill="none" stroke="#929b86" stroke-width="1.8" stroke-dasharray="6 6" marker-end="url(#cover-request-arrow)" />
      <rect x="47" y="309" width="144" height="49" rx="8" fill="#f5f5ed" />
      <text x="61" y="329" fill="#747d6b" font-size="11">Запрос интерфейса</text>
      <text x="61" y="347" fill="#747d6b" font-size="12">GET /api/books</text>
      <g transform="translate(39 95)">
        <rect x="5" y="6" width="170" height="130" rx="14" fill="#c6cef9" />
        <rect width="170" height="130" rx="14" fill="#2348ff" />
        <text x="21" y="29" fill="#c8d2ff" font-size="11" letter-spacing="1.1">ИСТОЧНИК ДАННЫХ</text>
        <text x="20" y="83" fill="#fff" font-size="47" letter-spacing="-1">API</text>
        <text x="22" y="110" fill="#d9e0ff" font-size="13">Сервер с книгами</text>
      </g>
      <g transform="translate(300 89)">
        <rect x="5" y="6" width="258" height="137" rx="12" fill="#dee1d5" />
        <rect width="258" height="137" rx="12" fill="#fffef9" stroke="#c8ccbf" />
        <path d="M0 39h258" stroke="#d9dbd1" />
        <text x="19" y="25" fill="#74766e" font-size="11" letter-spacing="1.2">JSON · ОТВЕТ API</text>
        <text x="19" y="66" fill="#2348ff" font-size="16">{</text>
        <text x="34" y="89" fill="#20221f" font-size="15">"books": [ … ]</text>
        <text x="19" y="114" fill="#2348ff" font-size="16">}</text>
      </g>
      <g transform="translate(300 297)">
        <rect x="5" y="6" width="258" height="164" rx="12" fill="#dee1d5" />
        <rect width="258" height="164" rx="12" fill="#fffef9" stroke="#c8ccbf" />
        <path d="M0 29h258" stroke="#d9dbd1" />
        <circle cx="16" cy="15" r="3" fill="#b9bdaf" /><circle cx="27" cy="15" r="3" fill="#b9bdaf" /><circle cx="38" cy="15" r="3" fill="#b9bdaf" />
        <text x="239" y="19" fill="#74766e" font-size="10" text-anchor="end">REACT · ИНТЕРФЕЙС</text>
        <text x="19" y="60" fill="#20221f" font-size="23" letter-spacing="-.7">Каталог книг</text>
        <rect x="19" y="76" width="220" height="32" rx="5" fill="#eef0e7" />
        <rect x="28" y="83" width="14" height="18" rx="2" fill="#2348ff" />
        <text x="54" y="97" fill="#343b2d" font-size="12">Мастер и Маргарита</text>
        <rect x="19" y="116" width="220" height="32" rx="5" fill="#eef0e7" />
        <rect x="28" y="123" width="14" height="18" rx="2" fill="#c8d0b9" />
        <text x="54" y="137" fill="#343b2d" font-size="12">Пикник на обочине</text>
      </g>
      <text x="39" y="494" font-size="11" fill="#2348ff" letter-spacing="1.1">API → JSON-ОТВЕТ → ИНТЕРФЕЙС</text>
    </svg>`;
    return art;
  }

  function cover(slide) {
    const layout = el('div', 'cover-layout');
    const copy = el('div', 'cover-copy');
    copy.append(el('p', 'kicker', slide.kicker || 'От интерфейса к данным'));
    const title = el('h1', 'slide-title');
    title.id = 'slide-title';
    if ((slide.title || lecture.title) === 'React и API') {
      title.append(document.createTextNode('React и'), el('br'), el('span', 'cover-title-emphasis', 'API'));
    } else title.textContent = slide.title || lecture.title;
    copy.append(title);
    if (slide.lead || lecture.subtitle) copy.append(el('p', 'slide-lead', slide.lead || lecture.subtitle));
    const meta = el('div', 'cover-meta');
    meta.append(el('span', '', `${lecture.duration || 70} минут`), el('span', '', `${chapters.length} разделов`), el('span', '', 'Практика + теория'));
    copy.append(meta);
    const start = el('button', 'cover-start', 'Начать лекцию');
    start.type = 'button';
    const arrow = el('span', '', '→');
    arrow.setAttribute('aria-hidden', 'true');
    start.append(arrow);
    start.addEventListener('click', () => onNext());
    copy.append(start);
    layout.append(copy, coverArtwork());
    article.append(layout);
  }

  function standard(slide) {
    const calloutClass = slide.calloutTone === 'danger' ? 'callout callout-danger' : 'callout';
    const header = el('header', 'slide-header');
    if (slide.kicker) header.append(el('p', 'kicker', slide.kicker));
    const title = el('h1', 'slide-title', slide.title);
    title.id = 'slide-title';
    header.append(title);
    if (slide.lead) header.append(el('p', 'slide-lead', slide.lead));
    article.append(header);
    const body = el('div', 'slide-body');
    if (slide.diagram) cleanupDiagram = mountApiDiagram(body, slide.diagram);
    const hasBullets = slide.bullets && slide.bullets.length;
    const hasCards = slide.cards && slide.cards.length;
    const hasSteps = slide.steps && slide.steps.length;
    let calloutPlaced = false;

    if (slide.layout === 'demo') {
      const slot = el('div', 'demo-slot');
      slot.dataset.demo = slide.demo || '';
      body.append(slot);
      article.append(body);
      if (slide.demo === 'catalog-story') {
        cleanupDemo = mountCatalogStory(slot, slide.demoOptions);
      } else if (window.LectureDemos && typeof window.LectureDemos.mount === 'function') {
        try {
          const cleanup = window.LectureDemos.mount(slide.demo, slot, slide.demoOptions);
          if (typeof cleanup === 'function') cleanupDemo = cleanup;
        } catch (error) {
          console.error('Не удалось запустить демонстрацию:', error);
          slot.replaceChildren(el('p', 'demo-unavailable', 'Демонстрация не загрузилась. Перейдите к следующему слайду или обновите страницу.'));
        }
      } else slot.append(el('p', 'demo-unavailable', 'Интерактивная демонстрация загружается из demos.js.'));
      if (hasBullets || hasCards || slide.callout || slide.code) {
        const details = el('details', 'demo-explanation');
        details.append(el('summary', '', 'Разбор демонстрации'));
        const explanation = el('div', 'demo-explanation-content');
        if (hasBullets) explanation.append(bullets(slide.bullets));
        if (hasCards) explanation.append(textItems(slide.cards));
        if (slide.code) explanation.append(codeBlock(slide.code));
        if (slide.callout) explanation.append(el('p', calloutClass, slide.callout));
        details.append(explanation);
        body.append(details);
        calloutPlaced = true;
      }
    } else if (slide.codeFiles?.length) {
      const files = el('div', `file-grid${slide.codeFiles.length > 2 ? ' file-grid-three' : ''}${slide.fileLayout === 'paired' ? ' file-grid-paired' : ''}`);
      slide.codeFiles.forEach(code => files.append(codeBlock(slide.fileLayout === 'paired' ? { ...code, splitAt: undefined } : code)));
      body.append(files);
      if (hasBullets) body.append(bullets(slide.bullets));
      if (hasSteps) body.append(flow(slide.steps));
      article.append(body);
    } else if (slide.layout === 'code' && slide.code?.fullComponent) {
      body.append(codeBlock(slide.code));
      if (hasBullets) body.append(bullets(slide.bullets));
      if (slide.supportCode) {
        const helper = el('details', 'code-helper');
        helper.append(el('summary', '', slide.supportCode.file || 'Знакомая функция запроса'));
        helper.append(codeBlock(slide.supportCode));
        body.append(helper);
      }
      article.append(body);
    } else if (slide.layout === 'code' && slide.code) {
      const columns = el('div', 'code-layout');
      columns.append(codeBlock(slide.code));
      if (hasBullets || hasCards || hasSteps || slide.callout || slide.productPreview || slide.supportCode) {
        const aside = el('aside', 'code-aside');
        aside.setAttribute('aria-label', 'Пояснение к коду');
        if (slide.supportCode) aside.append(codeBlock(slide.supportCode));
        if (slide.productPreview) aside.append(productPreview(slide.productPreview, slide.clickCodeExpression));
        if (hasBullets) aside.append(bullets(slide.bullets));
        if (hasCards) aside.append(textItems(slide.cards));
        if (hasSteps) aside.append(flow(slide.steps));
        if (slide.code.semanticLegend) {
          const legend = el('div', 'code-legend');
          const guide = el('div', 'reading-guide');
          guide.append(el('h3', 'reading-guide-title', 'Как читать примеры'));
          const colors = el('p');
          colors.append(document.createTextNode('Один цвет связывает код и пояснение: '), el('code', 'semantic-tag semantic-data', 'book'), document.createTextNode(' — данные, '), el('code', 'semantic-tag semantic-callback', 'onAdd'), document.createTextNode(' — callback.'));
          const interaction = el('p');
          interaction.append(document.createTextNode('Нажмите «В корзину» — подсветится выполняемый фрагмент '), el('code', 'guide-expression', '() => onAdd(book)'), document.createTextNode('.'));
          guide.append(colors, interaction);
          body.append(guide);
          legend.append(el('p', 'legend-intro', 'Props — входные значения от родителя:'));
          const data = el('p');
          data.append(el('code', 'semantic-tag semantic-data', 'book'), document.createTextNode(' — данные книги: название, автор и цена. Карточка показывает их.'));
          const callback = el('p');
          callback.append(el('code', 'semantic-tag semantic-callback', 'onAdd'), document.createTextNode(' — функция от родителя (callback). Вызов onAdd(book) сообщает родителю, какую книгу добавили.'));
          legend.append(data, callback);
          aside.append(legend);
        } else if (slide.callout) aside.append(el('p', calloutClass, slide.callout));
        columns.append(aside);
        columns.classList.add('has-aside');
        calloutPlaced = true;
      }
      body.append(columns);
      article.append(body);
    } else if (slide.layout === 'split') {
      const columns = el('div', 'body-columns');
      const left = el('div', 'body-text');
      if (slide.productPreview) left.append(productPreview(slide.productPreview, slide.clickCodeExpression));
      if (hasBullets) left.append(bullets(slide.bullets));
      if (hasCards) left.append(textItems(slide.cards));
      if (hasSteps) left.append(flow(slide.steps));
      columns.append(left);
      if (slide.code) columns.append(codeBlock(slide.code));
      else if (hasCards && hasBullets) {
        // Split explanatory lists and cards into two balanced columns.
        left.replaceChildren(bullets(slide.bullets));
        columns.append(textItems(slide.cards));
      }
      body.append(columns);
      article.append(body);
    } else {
      if (slide.layout === 'compare' && hasCards) body.append(textItems(slide.cards, 'compare-grid' + (slide.cards.length === 3 ? ' compare-grid-three' : '')));
      else if (hasCards) body.append(textItems(slide.cards));
      if (hasSteps) body.append(flow(slide.steps));
      if (slide.code) body.append(codeBlock(slide.code));
      if (hasBullets) body.append(bullets(slide.bullets));
      article.append(body);
    }
    if (slide.callout && !calloutPlaced) article.append(el('p', calloutClass, slide.callout));
  }

  function productPreview(count, clickCodeExpression = '') {
    const preview = el('section', 'product-preview' + (count > 1 ? ' product-preview-multiple' : ''));
    preview.setAttribute('aria-label', 'Результат в интерфейсе');
    preview.append(el('p', 'preview-label', 'Результат в интерфейсе'));
    const grid = el('div', 'product-preview-grid');
    const books = [
      { title: 'Мастер и Маргарита', author: 'Михаил Булгаков', price: 690 },
      { title: 'Пикник на обочине', author: 'Аркадий и Борис Стругацкие', price: 540 },
      { title: 'Солярис', author: 'Станислав Лем', price: 620 }
    ];
    let total = 0;
    const status = el('p', 'preview-cart', 'Корзина пуста');
    status.setAttribute('aria-live', 'polite');
    const trace = el('p', 'preview-trace');
    trace.hidden = true;
    trace.setAttribute('aria-live', 'polite');
    books.slice(0, count).forEach((book, index) => {
      const card = el('article', 'product-card');
      const cover = el('div', 'product-cover cover-' + index);
      cover.setAttribute('aria-hidden', 'true');
      cover.append(el('span', '', ['МАСТЕР', 'ПИКНИК', 'СОЛЯРИС'][index]), el('span', '', ['И МАРГАРИТА', 'НА ОБОЧИНЕ', ''][index]));
      const info = el('div', 'product-info');
      info.append(el('h3', '', book.title), el('p', 'product-author', book.author));
      const footer = el('div', 'product-footer');
      const button = el('button', 'product-add', 'В корзину');
      button.type = 'button';
      button.setAttribute('aria-label', 'В корзину: ' + book.title);
      button.addEventListener('click', () => {
        total += 1;
        status.textContent = 'В корзине: ' + total + ' · Добавлено: «' + book.title + '»';
        if (clickCodeExpression.length) {
          const slideElement = preview.closest('.slide');
          slideElement.querySelectorAll('.code-expression.executing').forEach(fragment => fragment.classList.remove('executing'));
          const fragment = Array.from(slideElement.querySelectorAll('.code-expression'))
            .find(node => node.dataset.expression === clickCodeExpression);
          if (fragment) {
            void fragment.offsetWidth; // Restart the pulse on repeated activation.
            fragment.classList.add('executing');
            fragment.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'auto' });
          }
          trace.textContent = 'Клик → onClick → onAdd(book). Родитель получает книгу «' + book.title + '» и обновляет корзину.';
          trace.hidden = false;
        }
      });
      footer.append(el('strong', 'product-price', book.price + ' ₽'), button);
      info.append(footer);
      card.append(cover, info);
      grid.append(card);
    });
    preview.append(grid, status, trace);
    return preview;
  }

  function fitCodeToStage() {
    if (!['code', 'files'].includes(slide.layout) || window.innerWidth <= 760) {
      article.style.removeProperty('--code-available-height');
      return;
    }
    const style = getComputedStyle(article);
    const body = article.querySelector('.slide-body');
    const heading = article.querySelector('.code-heading');
    if (!body || !heading) return;
    const freeHeight = stage.clientHeight
      - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
      - (article.querySelector('.slide-header')?.offsetHeight || 0)
      - parseFloat(getComputedStyle(body).marginTop)
      - heading.offsetHeight
      - (article.querySelector('.code-pane-label')?.offsetHeight || 0)
      - (slide.code?.fullComponent ? 90 : 0);
    article.style.setProperty('--code-available-height', `${Math.max(150, Math.floor(freeHeight))}px`);
  }

  article.replaceChildren();
  article.className = `slide layout-${['cover', 'split', 'code', 'files', 'flow', 'compare', 'demo', 'closing'].includes(slide.layout) ? slide.layout : 'split'}`;
  if (slide.layout === 'cover') cover(slide);
  else standard(slide);
  fitCodeToStage();
  stage.scrollTop = 0;
  article.classList.add('entering');
  let frame;
  const resize = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(fitCodeToStage); };
  const cleanup = () => {
    if (cleanupDemo) { try { cleanupDemo(); } catch (error) { console.error(error); } cleanupDemo = null; }
    if (cleanupDiagram) { cleanupDiagram(); cleanupDiagram = null; }
  };
  window.addEventListener('resize', resize);
  window.addEventListener('pagehide', cleanup);
  return () => { cleanup(); cancelAnimationFrame(frame); window.removeEventListener('resize', resize); window.removeEventListener('pagehide', cleanup); };
}
