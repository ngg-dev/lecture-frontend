/* A local teaching model of one catalog; no real HTTP requests are sent. */
(function () {
  'use strict';
  const books = [
    { id: 'b-101', title: 'Мастер и Маргарита', author: 'Михаил Булгаков', price: 690 },
    { id: 'b-102', title: 'Пикник на обочине', author: 'Аркадий и Борис Стругацкие', price: 540 },
    { id: 'b-103', title: 'Солярис', author: 'Станислав Лем', price: 620 }
  ];
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function btn(text, action, secondary = false) {
    const node = el('button', 'catalog-button' + (secondary ? ' secondary' : ''), text);
    node.type = 'button'; node.addEventListener('click', action); return node;
  }
  function mount(root, { stage = 'local' } = {}) {
    let disposed = false, timer, generation = 0, attempt = 0, shown = stage !== 'effect', cart = 0;
    let visibleBooks = stage === 'local' ? books.slice() : [], state = stage === 'local' ? 'success' : 'idle';
    if (!document.getElementById('catalog-demo-style')) {
      const style = el('style'); style.id = 'catalog-demo-style';
      style.textContent = `
      .catalog-lab{border-top:1px solid #d9dbd1;padding-top:16px;font-size:14px}.catalog-toolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}.catalog-button{font:inherit;font-size:13px;border:0;background:#2348ff;color:white;border-radius:7px;padding:10px 14px;cursor:pointer}.catalog-button.secondary{background:#e6e9de;color:#20221f}.catalog-button:disabled{opacity:.5;cursor:default}.catalog-scenario{display:flex;align-items:center;gap:8px;font-size:12px}.catalog-scenario select{font:inherit;padding:9px;border:1px solid #c7cabf;border-radius:6px;background:white}.catalog-columns{display:grid;grid-template-columns:1.2fr 1fr;gap:24px}.catalog-screen{background:#fffef9;border:1px solid #d9dbd1;border-radius:12px;min-height:235px;padding:16px}.catalog-screen-title{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:14px}.catalog-screen-title h3{font-size:18px;font-weight:600}.catalog-cart{font-size:12px;color:#62675b}.catalog-books{display:grid;gap:9px}.catalog-book{border-top:1px solid #e3e5dd;padding-top:10px;display:flex;align-items:center;gap:12px}.catalog-book-cover{width:37px;flex:0 0 37px;height:53px;background:#2348ff;border-left:4px solid #132ab7;color:#fff;padding:7px 4px;font-size:8px;overflow:hidden;display:flex;align-items:center}.catalog-book:nth-child(2) .catalog-book-cover{background:#315a47;border-color:#1d3a2b}.catalog-book:nth-child(3) .catalog-book-cover{background:#9e643d;border-color:#6e4427}.catalog-book-info{flex:1;min-width:0}.catalog-book h4{font-size:14px;line-height:1.25;margin:0}.catalog-book p{font-size:11px;line-height:1.3;color:#74766e;margin:4px 0}.catalog-book-price{font-weight:600;font-size:14px}.catalog-book button{padding:7px 9px;font-size:11px}.catalog-log{background:#252b37;color:#e3e7f0;border-radius:12px;padding:16px;min-width:0}.catalog-log h4{font-size:11px;font-weight:500;color:#b4c0db;letter-spacing:.06em;text-transform:uppercase;margin:0 0 12px}.catalog-code{font:12px/1.6 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;margin:0}.catalog-step{display:block;padding:2px 6px;margin:3px -6px;border-radius:3px}.catalog-step.active{background:#ecba5033;color:#ffe1a4;box-shadow:inset 2px 0 #ffe1a4}.catalog-status{font-size:12px;line-height:1.45;color:#60645b;margin:12px 0 0;min-height:18px}.catalog-note{font-size:11px;line-height:1.4;color:#74766e;margin-top:12px}.catalog-message{padding:26px 0}.catalog-message h4{font-size:18px;margin:0 0 8px}.catalog-message p{font-size:13px;line-height:1.5;margin:0 0 12px}.catalog-spinner{display:inline-block;width:15px;height:15px;border:2px solid #d4daec;border-top-color:#2348ff;border-radius:50%;animation:catalog-spin 1s linear infinite;margin-right:8px;vertical-align:middle}@keyframes catalog-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.catalog-spinner{animation:none}}@media(max-width:760px){.catalog-columns{grid-template-columns:1fr}.catalog-log{min-height:0}.catalog-book{flex-wrap:wrap}.catalog-scenario{flex-wrap:wrap}}`;
      document.head.append(style);
    }
    const lab = el('section', 'catalog-lab'); lab.setAttribute('aria-label', 'Развиваем один каталог');
    const toolbar = el('div', 'catalog-toolbar');
    const screen = el('div', 'catalog-screen');
    const trace = el('div', 'catalog-log');
    const code = el('pre', 'catalog-code'); trace.append(el('h4', '', stage === 'local' ? 'От массива к карточкам' : 'Что выполняется'), code);
    const status = el('p', 'catalog-status'); status.setAttribute('role', 'status');
    const scenario = el('select'); scenario.setAttribute('aria-label', 'Ответ учебного API');
    [['success','Книги · 200'],['slow','Медленно · 200'],['error','Ошибка · 500'],['empty','Пусто · 200']].forEach(([value,label]) => { const o=el('option','',label);o.value=value;scenario.append(o); });
    const scenarioLabel=el('label','catalog-scenario');scenarioLabel.append(document.createTextNode('Ответ API'), scenario);
    function log(lines, active = -1) { code.replaceChildren(...lines.map((text,i)=>el('span','catalog-step'+(i===active?' active':''),text))); }
    function cancel() { generation++; clearTimeout(timer); }
    function draw() {
      screen.replaceChildren();
      const head=el('div','catalog-screen-title');head.append(el('h3','','Книжный магазин'),el('span','catalog-cart','В корзине: '+cart));screen.append(head);
      if (!shown) { const m=el('div','catalog-message');m.append(el('h4','','Каталог пока скрыт'),el('p','','Покажите компонент — загрузка начнётся автоматически.'));screen.append(m);return; }
      if (state !== 'success') {
        const message=el('div','catalog-message');
        if(state==='loading'){const title=el('h4','','Загружаем книги…');title.prepend(el('span','catalog-spinner'));message.append(title,el('p','','Запрос отправлен. Ждём ответ API.'));}
        if(state==='idle')message.append(el('h4','','Каталог ещё не загружен'),el('p','','Нажмите «Загрузить книги».'));
        if(state==='error')message.append(el('h4','','Не получилось загрузить книги'),el('p','','Каталог можно запросить ещё раз.'),btn('Повторить',run));
        if(state==='empty')message.append(el('h4','','Книг пока нет'),el('p','','Запрос успешен, но API вернул пустой массив.'));
        screen.append(message);return;
      }
      const list=el('div','catalog-books');
      visibleBooks.forEach(book=>{const row=el('article','catalog-book');const info=el('div','catalog-book-info');info.append(el('h4','',book.title),el('p','',book.author),el('span','catalog-book-price',book.price+' ₽'));row.append(el('div','catalog-book-cover',book.title),info,btn('В корзину',()=>{cart++;draw();status.textContent='Добавлена «'+book.title+'». Корзина по-прежнему работает.';}));list.append(row);});
      screen.append(list);
    }
    function run(trigger = 'click') {
      if(disposed || !shown || state==='loading')return;
      cancel();const token=generation;const response=scenario.value;attempt++;
      state='loading'; loadButton.disabled=true;scenario.disabled=true;draw();
      const start=stage==='effect' ? (trigger === 'effect' ? 'useEffect → reload()' : 'Кнопка «Повторить» → reload()') : 'Клик → loadBooks()';
      log([start,"setStatus('loading')","await fetch('/api/books')"],2);
      status.textContent='Попытка '+attempt+': запрос отправлен.';
      timer=setTimeout(()=>{
        if(disposed || token!==generation)return;
        loadButton.disabled=false;scenario.disabled=false;
        if(response==='error'){state='error';log([start,'HTTP 500 → throw Error',"catch → setStatus('error')"],2);status.textContent='Сервер ответил ошибкой. Выберите «Книги · 200» и повторите.';}
        else{visibleBooks=response==='empty'?[]:books.slice();state=visibleBooks.length?'success':'empty';log([start,'HTTP 200 → await response.json()','setBooks(data.books)',"setStatus('success')",'React → карточки из массива'],visibleBooks.length?4:2);status.textContent=visibleBooks.length?'Ответ пришёл. Тот же BookList показывает полученные книги.':'API вернул { books: [] }. Показываем пустое состояние.';}
        draw();
      },response==='slow'?2400:800);
    }
    const loadButton=btn(stage==='effect'?'Повторить загрузку':'Загрузить книги',run);
    if(stage==='local'){
      const updateLocal = () => {
        draw();
        log(['books: [' + visibleBooks.map(book => book.title).join(', ') + ']', 'books.map(book => <ProductCard ... />)', visibleBooks.length + ' объекта → ' + visibleBooks.length + ' карточки'], 2);
      };
      const changeBooks=btn('Убрать третью книгу',()=>{
        visibleBooks=visibleBooks.length===3?books.slice(0,2):books.slice();
        changeBooks.textContent=visibleBooks.length===3?'Убрать третью книгу':'Вернуть третью книгу';
        updateLocal();status.textContent='Изменили массив — список карточек обновился.';
      });
      toolbar.append(changeBooks,btn('Сбросить',()=>{
        visibleBooks=books.slice();cart=0;changeBooks.textContent='Убрать третью книгу';updateLocal();status.textContent='Данные пока лежат в коде.';
      },true));
      updateLocal();
      status.textContent='Три книги из локального массива. Измените список или добавьте книгу в корзину.';
    } else {
      if(stage==='effect'){
        const toggle=btn('Показать каталог',()=>{shown=!shown;toggle.textContent=shown?'Скрыть каталог':'Показать каталог';loadButton.disabled=!shown;if(shown){state='idle';run('effect');}else{cancel();state='idle';scenario.disabled=false;draw();log(['Каталог скрыт','Покажите каталог для новой загрузки'],1);status.textContent='Каталог скрыт. Показать снова — новый эффект и новый запрос.';}},true);
        toolbar.append(toggle);loadButton.disabled=true;log(['Компонента нет на странице','Запрос ещё не начался']);
      }else log(['Ждём нажатия кнопки','Запрос ещё не начался']);
      toolbar.append(scenarioLabel,loadButton);
    }
    const columns=el('div','catalog-columns');columns.append(screen,trace);
    lab.append(toolbar,columns,status,el('p','catalog-note',stage==='local'?'Учебная модель React: меняем данные и видим соответствующие карточки.':'Учебная симуляция: ответ и задержка заданы локально. Код React разбираем на соседних слайдах.'));
    root.append(lab);draw();
    return()=>{disposed=true;cancel();lab.remove();};
  }
  window.CatalogDemo=Object.freeze({mount});
})();
