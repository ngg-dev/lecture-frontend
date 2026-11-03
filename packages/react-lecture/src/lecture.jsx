import React, {useState,useEffect,useRef,useCallback,memo} from 'react';
import {createRoot} from 'react-dom/client';
import {wireShop} from './shop-demo.js';

import {money,Code,Demo,Button,Reveal,Note,Inline,Tabs,Head,ProductCard} from './ui.jsx';
import {FunctionGrowth,ModuleCoordination,LibraryLife,ReactPrinciples,PropsFlow,ComponentMemoryLesson,StepMap} from './extras.jsx';

function Cover(){const [count,setCount]=useState(0);return <div className="cover"><div className="cover-copy"><div className="eyeline"/><div className="section-tag">Первая лекция</div><h1>От JavaScript<br/>к компонентам</h1><p className="lead">Как собирать интерфейс из частей<br/>и обновлять его при изменении данных.</p><p className="hint">От ручного обновления страницы к готовым инструментам.</p></div><div className="cover-visual"><div className="cover-card"><div className="row spread"><span className="badge">Маленький эксперимент</span><span className="small">01</span></div><div className="counts"><div><span className="count-label">Нажатий</span><div className="count" aria-live="polite">{count}</div></div></div><p className="hint">Начать можно с одного действия.</p><Button primary onClick={()=>setCount(count+1)}>Попробовать</Button></div></div></div>}
function Agenda(){
  const topics=[
    ['Обновим корзину вручную','Добавим товар, изменим цену и скидку. Посмотрим, как растёт код, когда обновить нужно сразу несколько мест.'],
    ['Сравним способы упростить код','Общие функции, модули, библиотеки и фреймворки: что они берут на себя и какую работу оставляют нам.'],
    ['Соберём страницу из частей','Познакомимся с компонентами — частями интерфейса: кнопкой, карточкой товара, корзиной. Передадим им данные.'],
    ['Разберёмся, почему экран обновляется','Проверим обычную переменную и узнаем, как компонент хранит данные и сообщает об изменениях.'],
    ['Свяжем части интерфейса','Сделаем так, чтобы кнопка в карточке меняла общее количество товаров и сумму в корзине.'],
    ['Подготовим проект к работе','Разберём запуск проекта и сборку: как из исходного кода получить файлы для публикации в интернете.']
  ];
  return <div className="agenda agenda-expanded">{topics.map(([title,desc],i)=><div className="agenda-item" key={title}><span className="idx">0{i+1}</span><div><h2>{title}</h2><p>{desc}</p></div></div>)}</div>;
}
// One visual cart is shared by the introductory slides and both comparison modes.
function CartPanel({quantity=0,total=0,price=700,onAdd,onReset,rootRef,focus='all',countAttrs={},totalAttrs={},priceAttrs={},statusAttrs={},addAttrs={},resetAttrs={},children}) {
  const linked = type => 'cart-dependency '+(focus===type?'dependency-focus':'');
  return <Demo label="Корзина" className="cart-preview"><div ref={rootRef}>
    <div className="cart-core">
      <div className="row spread"><h2>Книга</h2><span className="price" {...priceAttrs}>{price} ₽</span></div>
      <div className="counts">
        <div className={linked('count')}><span className="count-label">Количество</span><div className="count" {...countAttrs}>{quantity}</div></div>
        <div className={linked('total')}><span className="count-label">Сумма</span><div className="count cart-total"><span {...totalAttrs}>{total}</span> ₽</div></div>
      </div>
      <div className="controls"><Button primary onClick={onAdd} {...addAttrs}>Добавить книгу</Button><Button onClick={onReset} {...resetAttrs}>Сбросить</Button></div>
      <div className={'status '+linked('count')} role="status" {...statusAttrs}>{quantity?'В корзине есть товары':'Корзина пока пуста'}</div>
    </div>
    {children}
  </div></Demo>;
}
function CartChanges({onFavorite,onCoupon,onPrice,discount=false,canCheckout=false,focus='all'}) {
  return <div className="cart-extension">
    <span className="shop-location">Другие действия с этой же корзиной</span>
    <div className="controls"><button data-add onClick={onFavorite}>Из избранного: +1</button><button data-coupon onClick={onCoupon} aria-pressed={discount}>{discount?'Убрать скидку':'Скидка 10%'}</button><button data-api onClick={onPrice}>Новая цена от API</button></div>
    <div className={'cart-checkout cart-dependency '+(focus==='count'?'dependency-focus':'')}><button data-checkout disabled={!canCheckout}>Оформить заказ</button></div>
  </div>;
}
function OneAction(){const [quantity,setQuantity]=useState(0);return <div className="grid"><div><p className="big-question">Добавили книгу.<br/>Где должен появиться результат?</p><p className="body-text">Цена одной книги — 700 ₽. Одно действие меняет и количество, и сумму.</p><Reveal label="А что ещё может измениться?"><ul className="small-list"><li>Сообщение о пустой корзине.</li><li>Доступность кнопки оформления заказа.</li><li>Подтверждение успешного добавления.</li></ul></Reveal></div><CartPanel quantity={quantity} total={quantity*700} onAdd={()=>setQuantity(quantity+1)} onReset={()=>setQuantity(0)}/></div>}
const manualHTML=`<h2>Книга</h2>
<p>Цена: 700 ₽</p>
<p>Количество: <span id="count">0</span></p>
<p>Сумма: <span id="total">0</span> ₽</p>
<button id="add">Добавить книгу</button>
<p id="status">Корзина пока пуста</p>`;
const manualJS=`const button = document.querySelector('#add');
const countElement = document.querySelector('#count');
const totalElement = document.querySelector('#total');
const statusElement = document.querySelector('#status');

let count = 0;

button.addEventListener('click', function () {
  count = count + 1;
  countElement.textContent = count;
  totalElement.textContent = count * 700;
  statusElement.textContent = 'В корзине есть товары';
});`;
const manualCartSource="const button = document.querySelector('#add');\nconst resetButton = document.querySelector('#reset');\nconst countElement = document.querySelector('#count');\nconst totalElement = document.querySelector('#total');\nconst statusElement = document.querySelector('#status');\n\nlet count = 0;\n\nfunction updateView() {\n  countElement.textContent = count;\n  totalElement.textContent = count * 700;\n  statusElement.textContent = count > 0\n    ? 'В корзине есть товары'\n    : 'Корзина пока пуста';\n}\n\nfunction add() {\n  count = count + 1;\n  updateView();\n}\n\nfunction reset() {\n  count = 0;\n  updateView();\n}\n\nbutton.addEventListener('click', add);\nresetButton.addEventListener('click', reset);";
function ManualDemo({complete=false}){
  const root=useRef(null),[revision,setRevision]=useState(0);
  useEffect(()=>{
    const host=root.current;
    const button=host.querySelector('#add'),resetButton=host.querySelector('#reset'),countElement=host.querySelector('#count'),totalElement=host.querySelector('#total'),statusElement=host.querySelector('#status');
    let count=0;
    function updateView(){countElement.textContent=count;totalElement.textContent=count*700;statusElement.textContent=count>0?'В корзине есть товары':'Корзина пока пуста'}
    function add(){count=count+1;updateView()}
    function reset(){count=0;updateView()}
    button.addEventListener('click',add);
    if(complete)resetButton.addEventListener('click',reset);
    return ()=>{button.removeEventListener('click',add);if(complete)resetButton.removeEventListener('click',reset)};
  },[revision,complete]);
  return <CartPanel key={revision} rootRef={root} onReset={complete?undefined:()=>setRevision(revision+1)} resetAttrs={complete?{id:'reset'}:{}} addAttrs={{id:'add'}} countAttrs={{id:'count'}} totalAttrs={{id:'total'}} statusAttrs={{id:'status'}}/>;
}

function Manual(){const [part,setPart]=useState('html');return <div className="grid"><div><Tabs options={[["html","1. HTML"],["find","2. Найти элементы"],["update","3. Обновить текст"]]} value={part} onChange={setPart}/>{part==='html'?<Code text={manualHTML} file="фрагмент index.html" kind="HTML"/>:<Code text={manualJS} file="обработчик добавления — app.js" highlight={part==='find'?[1,2,3,4]:[9,10,11,12]}/>}{part!=='html'&&<Note><Inline>querySelector</Inline> находит элемент. <Inline>textContent</Inline> меняет его текст.</Note>}</div><ManualDemo/></div>}
function Growing(){
  const [qty,setQty]=useState(0),[discount,setDiscount]=useState(false),[price,setPrice]=useState(700),[last,setLast]=useState('Кнопка API имитирует ответ сервера.');
  function add(source){setQty(qty+1);setLast(source)}
  function reset(){setQty(0);setDiscount(false);setPrice(700);setLast('Кнопка API имитирует ответ сервера.')}
  return <div className="grid"><div><p className="big-question">Та же корзина.<br/>Больше причин для изменений.</p><p className="body-text">Товар добавляют из каталога или избранного. Скидка меняет сумму, а ответ API — цену книги.</p><Reveal label="Где здесь сложность?"><p>У каждого изменения есть зависимые части интерфейса. Нужно описать, какие элементы обновить и какие значения в них записать.</p></Reveal></div><CartPanel quantity={qty} total={Math.round(qty*price*(discount?.9:1))} price={price} onAdd={()=>add('Добавили книгу из каталога.')} onReset={reset}>
    <CartChanges onFavorite={()=>add('Добавили ту же книгу из избранного.')} onCoupon={()=>{setDiscount(!discount);setLast('Изменили скидку: количество осталось прежним.')}} onPrice={()=>{setPrice(price===700?900:700);setLast('Имитируем ответ API с новой ценой.')}} discount={discount} canCheckout={qty>0}/>
    <p className="hint cart-action-note" role="status">{last}</p>
  </CartPanel></div>;
}

const shopActions={
  api:{handler:'function changePrice() {',assignment:/^price =/,binding:'apiButton.addEventListener',label:'Новая цена: changePrice() → updateView()'},
  coupon:{handler:'function applyCoupon() {',assignment:/^discount =/,binding:'couponButton.addEventListener',label:'Скидка: applyCoupon() → updateView()'},
  add:{handler:'function add() {',assignment:/^count =/,binding:"button.addEventListener('click', add)",label:'Добавление: add() → updateView()'},
  reset:{handler:'reset() {',assignment:/^(count|price|discount) =/,label:'Сброс: reset() → updateView()'}
};
function shopActionLines(action){
  const config=shopActions[action],lines=__SHOP_SOURCE__.split('\n');
  if(!config)return null;
  const handlerStart=lines.findIndex(line=>line.trim()===config.handler);
  const handlerEnd=lines.findIndex((line,i)=>i>handlerStart&&/^},?$/.test(line.trim()));
  const viewStart=lines.findIndex(line=>line.trim()==='function updateView() {');
  const viewEnd=lines.findIndex((line,i)=>i>viewStart&&line.trim()==='}');
  const totalTargets=/totalElement|deliveryElement|progressElement|bonusElement/;
  const viewTargets=action==='reset'?/\.(textContent|disabled|value) =/:action==='add'?/countElement|statusElement|checkoutButton|totalElement|deliveryElement|progressElement|bonusElement/:action==='api'?/priceElement|totalElement|deliveryElement|progressElement|bonusElement/:totalTargets;
  const highlighted=lines.flatMap((line,i)=>{
    const text=line.trim();
    const handler=i===handlerStart||(i>handlerStart&&i<handlerEnd&&(config.assignment.test(text)||text==='updateView();'));
    const view=i>viewStart&&i<viewEnd&&(text.startsWith('const total =')||viewTargets.test(line));
    const binding=config.binding&&line.includes(config.binding);
    return handler||view||binding?[i+1]:[];
  });
  return {highlighted,handlerLine:handlerStart+1,viewLine:viewStart+1,label:config.label};
}
function Mega({fullSource=false}) {
  const [focus, setFocus] = useState('all');
  const [snapshot, setSnapshot] = useState({count: 0, discount: false, price: 700});
  const [codeView,setCodeView]=useState({section:'handler',revision:0});
  const native = useRef(null), controller = useRef(null);
  useEffect(() => {
    controller.current = wireShop(native.current, next=>{
      setSnapshot(next);
      if(fullSource){setFocus('all');setCodeView(previous=>({section:'handler',revision:previous.revision+1}))}
    });
    return () => controller.current.dispose();
  }, [fullSource]);
  const operationCount = 8;
  const countLinks = 3, totalLinks = 4;
  const updateSource = __SHOP_SOURCE__
    .match(/  function updateView\(\) \{[\s\S]*?\n  \}/)[0]
    .replace(/^  /gm, '');
  const countTargets = /countElement|checkoutButton|statusElement/;
  const totalTargets = /totalElement|deliveryElement|progressElement|bonusElement/;
  const displayedSource=fullSource?__SHOP_SOURCE__:updateSource;
  const highlighted = displayedSource.split('\n').flatMap((line, i) =>
    /\.(textContent|hidden|disabled|value) =/.test(line)&&(focus==='count'?countTargets:focus==='total'?totalTargets:/.*/).test(line)?[i+1]:[]);
  const trace=fullSource&&codeView.section!=='dependencies'?shopActionLines(snapshot.action):null;
  const codeHighlight=trace?trace.highlighted:fullSource&&focus==='all'?[]:highlighted;
  const codeFocusLine=fullSource?(trace?(codeView.section==='handler'?trace.handlerLine:trace.viewLine):codeHighlight[0]):undefined;
  function showCode(section){setCodeView(previous=>({section,revision:previous.revision+1}))}
  const linked = type => 'cart-dependency '+(focus===type?'dependency-focus':'');
  return <div className="growth-demo">
    <p className="body-text">{fullSource?'Весь код этой же корзины. Нажмите кнопку в корзине: подсветятся обработчик, пересчёт и зависимые обновления интерфейса.':'К знакомой корзине добавились доставка и бонусы. Измените количество или скидку и проследите, какие элементы нужно обновить.'}</p>
    <div className="grid">
      <div>
        <div className="growth-code-label"><strong>{operationCount} прямых обновлений DOM</strong><span>Одна общая updateView()</span></div>
        {trace&&<div className="shop-code-trace"><p role="status">{trace.label}</p><Tabs label="Код выбранного действия" value={codeView.section} onChange={showCode} options={[["handler","Обработчик"],["view","Пересчёт и DOM"]]}/></div>}
        <Code text={displayedSource} file={fullSource?"shop.js — весь работающий код":"фрагмент shop.js"} highlight={codeHighlight} focusLine={codeFocusLine} focusKey={codeView.revision}/>
        <div className="dependency-controls">
          <span className="shop-location">Подсветить зависимости в коде и интерфейсе</span>
          <Tabs label="Зависимости данных" value={focus} onChange={value=>{setFocus(focus===value?'all':value);showCode('dependencies')}} options={[["count",`count → ${countLinks}`],["total",`total → ${totalLinks}`]]}/>
          <p className="hint">{focus==='count'?'От количества зависят счётчик, сообщение о корзине и доступность оформления.':focus==='total'?'От суммы зависят её отображление, условия доставки, шкала прогресса и бонусы.':trace?'Подсвечены изменение данных, вызов updateView(), пересчёт суммы и зависимые записи в DOM.':fullSource?'Нажмите кнопку корзины, чтобы увидеть связанные с действием строки кода.':'Каждая выделенная строка связывает данные с конкретным DOM-элементом.'}</p>
        </div>
      </div>
      <CartPanel rootRef={native} onReset={()=>controller.current.reset()} focus={focus} addAttrs={{'data-add':true}} countAttrs={{'data-count':true}} totalAttrs={{'data-total':true}} priceAttrs={{'data-price':true}} statusAttrs={{'data-status':true}}>
        <CartChanges discount={snapshot.discount} focus={focus}/>
        <p className="hint cart-action-note" role="status">{snapshot.action==='coupon'?'Изменили скидку: количество осталось прежним.':snapshot.action==='api'?'Имитируем ответ API с новой ценой.':snapshot.action==='add'?'Добавили книгу в ту же корзину.':'Кнопка API имитирует ответ сервера.'}</p>
        <div className="cart-extension shop-feature">
          <span className="shop-location">Доставка и бонусы</span>
          <div className={linked('total')}><span className="shop-location">До бесплатной доставки</span><strong data-delivery>Ещё 2000 ₽</strong></div>
          <div className={linked('total')}><progress data-progress aria-label="Сумма для бесплатной доставки" max="2000" /></div>
          <div className={linked('total')}><span className="shop-location">Бонусы за заказ</span><strong data-bonus>0</strong></div>
        </div>
        <Reveal label="Ещё три места добавления"><div className="controls"><button data-add>Поиск: +1</button><button data-add>Рекомендации: +1</button><button data-add>Повтор заказа: +1</button></div><p className="hint" style={{marginTop:14}}>Все пять кнопок вызывают add(), а она — общую updateView().</p></Reveal>
      </CartPanel>
    </div>
    <Note>Общая функция уже убрала повторение. Но каждую связь с DOM всё ещё описываем сами: найти элемент, выбрать свойство, записать значение. Новые требования увеличивают этот список.</Note>
    {fullSource&&<p className="hint" style={{marginTop:18}}>root — контейнер этой корзины; report передаёт события в пояснения лекции. Блок dispose снимает обработчики при уходе со слайда.</p>}
  </div>;
}
const solutionPaths = [
  {title:'Оставить явные обновления',subtitle:'Каждый обработчик меняет DOM',
    pros:['Быстро начать, когда элементов мало.','Прямо видно, какая команда меняет экран.'],
    cons:['Одни и те же обновления повторяются в разных обработчиках.','Новое требование приходится учитывать в нескольких местах.'],
    task:'Добавить запись в элемент шапки во все обработчики, которые меняют сумму.'},
  {title:'Собрать в общую функцию',subtitle:'Обработчики вызывают updateView()',
    pros:['Повторяющийся код обновления находится в одном месте.','Новое отображение можно добавить в одну функцию.'],
    cons:['С ростом интерфейса функция становится длиннее.','Каждую зависимость между данными и DOM всё ещё описываем вручную.'],
    task:'Добавить ещё одну запись в DOM внутри updateView(). Именно так уже устроен предыдущий пример.'},
  {title:'Разделить код на модули',subtitle:'Корзина, шапка, доставка — отдельно',
    pros:['У каждой части есть своя ответственность.','Небольшие модули проще менять и проверять отдельно.'],
    cons:['Нужно спроектировать, как модули обмениваются данными.','Согласование обновлений между частями остаётся нашей задачей.'],
    task:'Передать новую сумму модулю шапки и реализовать обновление внутри него.'},
  {title:'Взять готовый инструмент',subtitle:'Библиотеку или фреймворк для UI',
    pros:['Готовые механизмы компонентов и обновления экрана.','Меньше собственного кода для типовых задач интерфейса.'],
    cons:['Нужно изучить API и правила инструмента.','Появляется зависимость от его возможностей и обновлений; для маленькой страницы он может быть избыточен.'],
    task:'Для инструмента с декларативным UI — описать сумму в шапке через данные. Обновление DOM выполняет инструмент.'}
];
function ToolQuestion() {
  const [path, setPath] = useState(0);
  const option = solutionPaths[path];
  return <div>
    <p className="body-text">Способов несколько. Выберите вариант и сравните, какую работу он упрощает.</p>
    <div className="solution-layout">
      <div className="solution-options" role="group" aria-label="Пути решения">{solutionPaths.map((item,i)=><button key={item.title} aria-pressed={path===i} onClick={()=>setPath(i)}><span className="solution-index">0{i+1}</span><span><strong>{item.title}</strong><small>{item.subtitle}</small></span></button>)}</div>
      <section className="surface solution-detail" aria-label="Разбор выбранного пути">
        <h2>{option.title}</h2>
        <div className="solution-point solution-pros"><h3><span aria-hidden="true">+</span> Плюсы</h3><ul>{option.pros.map(item=><li key={item}>{item}</li>)}</ul></div>
        <div className="solution-point solution-cons"><h3><span aria-hidden="true">−</span> Минусы</h3><ul>{option.cons.map(item=><li key={item}>{item}</li>)}</ul></div>
        <div className="solution-task"><span className="shop-location">Новое требование: сумма ещё и в шапке</span><p>{option.task}</p></div>
      </section>
    </div>
    {path===1&&<FunctionGrowth/>}{path===2&&<ModuleCoordination/>}<p className="hint" style={{marginTop:22}}>Эти подходы можно сочетать. Общие функции и модули полезны и при работе с готовым инструментом.</p>
  </div>;
}
function showCart(count) {
  const countElement = document.querySelector('#abstract-count');
  const totalElement = document.querySelector('#abstract-total');
  countElement.textContent = count;
  totalElement.textContent = count * 700 + ' ₽';
}
function AbstractionLesson() {
  const [count, setCount] = useState(0);
  function run(next) { showCart(next); setCount(next); }
  return <div className="grid">
    <div>
      <p className="lead" style={{marginTop:0}}>Готовые абстракции над кодом и типовыми задачами.</p>
      <p className="body-text">Абстракция даёт понятный способ выполнить задачу и скрывает детали реализации. Вызов функции — уже знакомый пример.</p>
      <Code text={`showCart(${count});`} file="наш код"/>
      <Reveal label="Что спрятано за showCart()?">
        <Code text={"function showCart(count) {\n  const countElement = document.querySelector('#abstract-count');\n  const totalElement = document.querySelector('#abstract-total');\n  countElement.textContent = count;\n  totalElement.textContent = count * 700 + ' ₽';\n}"} file="реализация функции"/>
      </Reveal>
    </div>
    <Demo label="Вызываем одну функцию">
      <div className="controls">{[1,3,5].map(n=><Button key={n} onClick={()=>run(n)}>showCart({n})</Button>)}</div>
      <dl className="table-lines"><dt>Количество</dt><dd id="abstract-count">0</dd><dt>Сумма</dt><dd id="abstract-total">0 ₽</dd></dl>
      <Note>Снаружи — один вызов. Внутри — несколько операций с DOM.</Note>
      <p className="hint" style={{marginTop:20}}>Здесь абстракцию написали мы. Библиотеки и фреймворки дают готовые абстракции, чтобы не создавать всё самостоятельно.</p>
      <Reveal label="Значит, сложный код исчезает?"><p>Он остаётся внутри инструмента. Мы работаем через его интерфейс — функции, компоненты и соглашения.</p></Reveal>
    </Demo>
  </div>;
}
function LibraryFramework() {
  return <div>
    <p className="body-text">Оба дают готовые абстракции. Различие — в том, сколько устройства приложения они задают.</p>
    <div className="grid comparison-cards">
      <section className="surface"><span className="section-tag">Нужная возможность</span><h2>Библиотека</h2><p>Решает определённый класс задач. Вы встраиваете её в приложение и соединяете с другими решениями.</p><div className="comparison-example"><span className="shop-location">Например</span>Работа с датами, графиками или построение интерфейса.</div></section>
      <section className="surface"><span className="section-tag">Согласованная основа</span><h2>Фреймворк</h2><p>Даёт структуру и набор согласованных механизмов. Вы добавляете свой код в предусмотренные места.</p><div className="comparison-example"><span className="shop-location">Например, в веб-приложении</span>Страницы, маршруты, загрузка данных и правила их соединения.</div></section>
    </div>
    <Reveal label="Как это выглядит на примере магазина?">
      <div className="grid"><div className="branch"><h3>С библиотеками</h3><p>Подбираем инструмент для интерфейса, отдельно решаем, как переключать страницы и загружать товары. Соединяем части сами.</p></div><div className="branch"><h3>С фреймворком</h3><p>Используем его способ описывать страницы и загружать товары. Пишем логику магазина внутри этой структуры.</p></div></div>
    </Reveal>
    <p className="hint" style={{marginTop:20}}>Граница не абсолютная: библиотека тоже задаёт правила, а фреймворк может разрешать замену частей и подключение других библиотек.</p>
  </div>;
}
function WhyReact() {
  return <div className="why-react">
    <p className="body-text">React — распространённый инструмент, с которым можно встретиться в реальных проектах и вакансиях.</p>
    <div className="react-reasons">
      <section className="surface react-reason react-adoption">
        <span className="section-tag">01 / Распространённость</span>
        <div className="react-stat">44,7<span>%</span></div>
        <h2>Работали с React</h2>
        <p>Доля участников Stack Overflow Developer Survey 2025, использовавших React за последний год.</p>
        <p className="hint">Вопрос о веб-технологиях: 23 678 ответивших.</p>
        <a className="small" href="https://survey.stackoverflow.co/2025/technology#1-web-frameworks-and-technologies" target="_blank" rel="noreferrer">Посмотреть результаты опроса ↗</a>
      </section>
      <section className="surface react-reason">
        <span className="section-tag">02 / Реальные продукты</span>
        <h2>Используют российские компании</h2>
        <ul className="react-company-list">
          <li><strong>Яндекс</strong><span>Например, интерфейсы внутренних инструментов стабильности.</span></li>
          <li><strong>Иви</strong><span>React входит в стек вакансии разработчика Smart TV.</span></li>
          <li><strong>МТС Web Services</strong><span>React входит в стек вакансии fullstack-разработчика.</span></li>
        </ul>
      </section>
      <section className="surface react-reason">
        <span className="section-tag">03 / Работа</span>
        <h2>Навык нужен работодателям</h2>
        <div className="react-role-list"><span>Frontend-разработчик</span><span>Fullstack-разработчик</span></div>
        <p>React встречается в вакансиях Иви, МТС Web Services и Росгосстраха на Хабр Карьере.</p>
        <p className="hint">Вместе с ним нужны основы: JavaScript, HTML, CSS и умение разбираться в чужом коде.</p>
        <a className="small" href="https://career.habr.com/vacancies/skills/react-js" target="_blank" rel="noreferrer">Вакансии с React ↗</a>
      </section>
    </div>
    <Note>В этой лекции освоим основу: как описывать интерфейс компонентами и обновлять его через данные. Эти идеи пригодятся при чтении кода существующих проектов.</Note>
    <Reveal label="Источники">
      <ul className="small-list react-source-list">
        <li><a href="https://survey.stackoverflow.co/2025/technology#1-web-frameworks-and-technologies" target="_blank" rel="noreferrer">Stack Overflow Developer Survey 2025 — использование React</a></li>
        <li><a href="https://yandex.ru/jobs/vacancies/frontendrazrabotchik-v-komandu-sozdaniya-instrumentov-stabilnosti-29084" target="_blank" rel="noreferrer">Яндекс — пример стека команды (архивная вакансия)</a></li>
        <li><a href="https://career.habr.com/vacancies/skills/react-js" target="_blank" rel="noreferrer">Хабр Карьера — примеры спроса на React</a></li>
      </ul>
      <p className="hint">Источники проверены 3 октября 2026 года. Список вакансий меняется со временем.</p>
    </Reveal>
  </div>;
}
function ReactIntro() {
  const [count, setCount] = useState(0);
  return <div className="grid react-intro">
    <div>
      <div className="react-name">React</div>
      <p className="lead">Библиотека JavaScript для создания пользовательских интерфейсов.</p>
      <p className="body-text">Описываем, каким должен быть экран при текущих данных.</p><Note><strong>React берёт на себя обновление DOM.</strong> Он вызывает компоненты, сравнивает полученный результат и применяет нужные изменения к элементам страницы. Нам остаются данные, правила приложения и описание интерфейса.</Note>
      <div className="library-reason"><h2>Почему именно библиотека?</h2><p>React отвечает за интерфейс, но не задаёт полный набор решений для приложения. Переключение страниц и работу с данными можно организовать отдельно, подобрав другие библиотеки.</p></div>
      <Reveal label="Можно ли взять уже согласованный набор?"><p>Да — использовать фреймворк на основе React. Он добавляет структуру и решения для приложения вокруг React.</p></Reveal>
    </div>
    <Demo label="Одно значение — два зависимых блока">
      <div className="react-dependency-map">
        <div className="state-source"><span className="shop-location">Состояние: данные компонента</span><code>count = <strong>{count}</strong></code></div>
        <div className="dependency-fork" aria-hidden="true"><span>↓</span><span>↓</span></div>
        <div className="dependency-results" aria-live="polite">
          <div className="dependency-result"><span className="shop-location">Количество</span><code>count</code><strong key={count} className="value-pulse">{count} шт.</strong></div>
          <div className="dependency-result"><span className="shop-location">Сумма</span><code>count × 700</code><strong key={count} className="value-pulse">{money(count*700)}</strong></div>
        </div>
      </div>
      <div className="controls" style={{marginTop:24}}><Button primary onClick={()=>setCount(count+1)}>Увеличить count</Button><Button onClick={()=>setCount(0)}>Сброс</Button></div>
      <Note>Меняем одно значение состояния — оба блока получают новые данные.</Note>
      
    </Demo>
  </div>;
}

const componentTreeNotes = {
  App: 'Корневой компонент соединяет части страницы: шапку, карточку товара и сводку корзины.',
  ShopHeader: 'Отдельная часть страницы: название магазина и количество товаров в шапке.',
  ProductCard: 'Карточка объединяет название, цену и компонент кнопки добавления.',
  AddButton: 'Небольшой компонент внутри карточки. Его можно использовать в разных местах.',
  CartSummary: 'Отдельная часть показывает количество товаров и итоговую сумму.'
};
function ComponentTreeLesson() {
  const [selected,setSelected]=useState('App'),[count,setCount]=useState(0);
  const area=name=>'tree-preview-part '+(selected===name?'tree-selected':'');
  function treeButton(name){return <button aria-pressed={selected===name} onClick={()=>setSelected(name)}>{name}</button>}
  return <div>
    <p className="body-text">Делим страницу на части и вкладываем их друг в друга. Компонент может содержать другие компоненты — получается дерево.</p>
    <div className="component-tree-layout tree-comparison"><section className="surface"><div className="demo-label">Знакомая структура данных — дерево</div><ul className="component-tree analogy-tree"><li><button aria-pressed={selected==='App'} onClick={()=>setSelected('App')}>A · корень</button><ul><li><button aria-pressed={selected==='ShopHeader'} onClick={()=>setSelected('ShopHeader')}>B · лист</button></li><li><button aria-pressed={selected==='ProductCard'} onClick={()=>setSelected('ProductCard')}>C · узел</button><ul><li><button aria-pressed={selected==='AddButton'} onClick={()=>setSelected('AddButton')}>E · лист</button></li></ul></li><li><button aria-pressed={selected==='CartSummary'} onClick={()=>setSelected('CartSummary')}>D · лист</button></li></ul></li></ul><p className="tree-description">Корень → дочерние узлы → листья. Нажмите узел: справа выделится соответствующий компонент и его участок страницы.</p></section>
      <section className="surface" aria-label="Дерево компонентов">
        <div className="demo-label">Выберите часть в дереве</div>
        <ul className="component-tree"><li>{treeButton('App')}<ul><li>{treeButton('ShopHeader')}</li><li>{treeButton('ProductCard')}<ul><li>{treeButton('AddButton')}</li></ul></li><li>{treeButton('CartSummary')}</li></ul></li></ul>
        <p className="tree-description" aria-live="polite">{componentTreeNotes[selected]}</p>
      </section>
      <Demo label="Из этих частей получается страница">
        <div className={area('App')}>
          <div className={area('ShopHeader')}><div className="row spread"><strong>Книжная полка</strong><span className="badge" key={count}>Корзина: {count}</span></div></div>
          <div className={area('ProductCard')}><div className="row spread"><h2>Книга</h2><span className="price">700 ₽</span></div><span className={area('AddButton')}><Button primary onClick={()=>setCount(count+1)}>Добавить книгу</Button></span></div>
          <div className={area('CartSummary')}><span className="shop-location">Корзина</span><div className="row spread"><span>{count} шт.</span><strong className="price value-pulse" key={count}>{money(count*700)}</strong></div></div>
        </div>
        <Button onClick={()=>setCount(0)} style={{marginTop:18}}>Сбросить</Button>
      </Demo>
    </div>
    <div className="tree-how"><span><b>1.</b> Мы описываем части и их вложенность.</span><span><b>2.</b> React вызывает компоненты и получает описание экрана.</span><span><b>3.</b> Применяет его к DOM — браузер показывает страницу.</span></div>
    <Reveal label="А что происходит при изменении данных?"><p>React заново получает описание нужной части дерева и обновляет DOM там, где изменился результат. Нажмите «Добавить книгу»: карточка остаётся на месте, а число и сумма меняются.</p></Reveal>
  </div>;
}

function FirstComponent(){const [text,setText]=useState('Привет, мир!');const literal=JSON.stringify(text);function Greeting(){return <h1>{text}</h1>}return <div className="grid"><div><div className="edit-banner">Редактируем исходник, затем смотрим результат</div><label>Текст внутри заголовка<input value={text} onChange={e=>setText(e.target.value)} maxLength={45}/></label><div style={{marginTop:18}}><Code text={`function Greeting() {\n  return <h1>{${literal}}</h1>;\n}\n\nfunction App() {\n  return <Greeting />;\n}`} highlight={[2]}/></div><p className="hint" style={{marginTop:15}}>Имя компонента начинается с заглавной буквы. Функция возвращает описание интерфейса.</p></div><Demo label="Результат этого исходника"><div className="product-preview"><Greeting key={text}/></div><Reveal label="Почему разметка находится внутри функции?"><p>Для описания интерфейса используем JSX — расширение синтаксиса JavaScript. Разберём его следующим.</p></Reveal></Demo></div>}
function JSXIntro(){
  const [tag,setTag]=useState('h1');
  function Greeting(){return tag==='h1'?<h1>Привет, мир!</h1>:<p>Привет, мир!</p>}
  return <div>
    <p className="body-text"><strong>JSX</strong> — расширение синтаксиса JavaScript. Оно позволяет описывать интерфейс с помощью разметки, похожей на HTML.</p>
    <div className="grid">
      <div>
        <div className="edit-banner">Выбираем разметку в исходнике компонента</div>
        <Tabs label="Элемент в JSX" value={tag} onChange={setTag} options={[["h1","Заголовок <h1>"],["p","Абзац <p>"]]}/>
        <Code text={`function Greeting() {
  return <${tag}>Привет, мир!</${tag}>;
}`} highlight={[2]}/>
        <p className="hint" style={{marginTop:16}}>Функция и return — JavaScript. Выделенная разметка после return — JSX-выражение.</p>
      </div>
      <Demo label="Что получится на экране">
        <div className="jsx-intro-preview"><Greeting/></div>
        <Note>Компонент возвращает описание элемента. React использует его, чтобы построить интерфейс.</Note>
        <Reveal label="Браузер понимает JSX напрямую?"><p>Перед запуском JSX преобразуют в обычный JavaScript. Инструменты для этого разберём в блоке о сборке.</p></Reveal>
      </Demo>
    </div>
  </div>;
}
function JSXLesson(){const [name,setName]=useState('Анна'),[section,setSection]=useState('expression');function Greeting(){return <h1 className="greeting">Привет, {name}!</h1>}return <div className="grid"><div className="stack"><div className="edit-banner">Правим значение в исходнике</div><label>Строка для переменной name<input value={name} onChange={e=>setName(e.target.value)} maxLength={35}/></label><Code text={`function Greeting() {\n  const name = ${JSON.stringify(name)};\n\n  return (\n    <h1 className="greeting">\n      Привет, {name}!\n    </h1>\n  );\n}`} highlight={section==='expression'?[2,6]:[5]}/></div><Demo label="Результат и синтаксис"><Greeting key={name}/><hr className="divider"/><Tabs value={section} onChange={setSection} options={[["expression","{name}"],["class","className"]]}/><p>{section==='expression'?'Фигурные скобки вставляют результат выражения JavaScript. Здесь — строку из name.':'className задаёт CSS-класс элемента. В JSX используем это имя вместо class.'}</p><Reveal label="А если написать name без скобок?"><div className="product-preview">Привет, name!</div><p style={{marginTop:14}}>Получится буквальный текст name.</p></Reveal><p className="source-editor-note">Изменение поля означает редактирование кода. Оно не показывает обновление обычной переменной во время работы приложения.</p></Demo></div>}
function Reuse(){const [show,setShow]=useState(false),[outline,setOutline]=useState(false);return <div className="grid"><div><Code text={show?`function App() {\n  return (\n    <section>\n      <ProductCard />\n      <ProductCard />\n    </section>\n  );\n}`:`function ProductCard() {\n  return (\n    <article>\n      <h2>Книга</h2>\n      <p>700 ₽</p>\n    </article>\n  );\n}`}/><div className="controls" style={{marginTop:18}}><Button onClick={()=>setShow(!show)}>{show?'Показать компонент':'Использовать два раза'}</Button><Button onClick={()=>setOutline(!outline)} aria-pressed={outline}>Границы компонентов</Button></div></div><Demo label="Один компонент используется повторно"><div className="stack"><div className={outline?'overlay-outline':''}><ProductCard name="Книга" price={700}/></div>{show&&<div className={outline?'overlay-outline':''}><ProductCard name="Книга" price={700}/></div>}</div>{show&&<Note>Структура повторяется, но данные пока одинаковые. Как передать второму экземпляру другой товар?</Note>}</Demo></div>}
function PropsLesson(){const [name,setName]=useState('Книга'),[price,setPrice]=useState(700),[focus,setFocus]=useState('pass');const src=`function ProductCard(props) {\n  return (\n    <article>\n      <h2>{props.name}</h2>\n      <p>{props.price} ₽</p>\n    </article>\n  );\n}\n\nfunction App() {\n  return (\n    <ProductCard name={${JSON.stringify(name)}} price={${price}} />\n  );\n}`;return <div className="grid"><div><Tabs value={focus} onChange={setFocus} options={[["pass","1. Родитель передаёт"],["read","2. Компонент читает"]]}/><Code text={src} highlight={focus==='pass'?[12]:[1,4,5]}/></div><Demo label="Редактируем данные в вызове компонента"><div className="field-row"><label>name<input value={name} onChange={e=>setName(e.target.value)} maxLength={32}/></label><label>price<input type="number" min="0" max="99999" value={price} onChange={e=>setPrice(Math.max(0,Math.min(99999,Number(e.target.value)||0)))}/></label></div><ProductCard name={name} price={price}/><div className="data-box"><span className="small">Объект, полученный компонентом</span><pre className="file-tree">{`props = {\n  name: ${JSON.stringify(name)},\n  price: ${price}\n}`}</pre></div><Reveal label="А может ли потребитель изменить props?"><p>Нет. Потребитель — компонент, который получает props. Для него это данные только для чтения: он использует значения, а новые значения передаёт родитель.</p></Reveal></Demo></div>}
function RenderedCounter(props){return <button>Нажали {props.count} раз</button>}
function RenderBasics(){
  const [count,setCount]=useState(0);
  return <div>
    <p className="body-text"><strong>Рендер</strong> — React вызывает компонент и получает описание того, что нужно показать на экране.</p>
    <div className="grid">
      <div className="stack">
        <p className="big-question">«Как выглядит интерфейс<br/>с этими данными?»</p>
        <Code text={'function CounterView(props) {\n  return <button>Нажали {props.count} раз</button>;\n}\n\n<CounterView count={'+count+'} />'} highlight={[2,5]}/>
        <p className="hint">При следующем рендере React снова вызывает функцию. Она возвращает описание интерфейса для новых данных.</p>
      </div>
      <Demo label="Одна функция — результат для разных данных">
        <div className="render-basics-input"><span className="shop-location">В этот раз передали в props</span><Inline>count = {count}</Inline></div>
        <div className="render-basics-result" aria-live="polite"><span className="shop-location">На экране после обновления</span><RenderedCounter count={count}/></div>
        <div className="controls"><Button primary onClick={()=>setCount(count+1)}>Показать с count = {count+1}</Button><Button onClick={()=>setCount(0)}>Сначала</Button></div>
        <p className="hint" style={{marginTop:18}}>Для примера передаём компоненту другое число через props и смотрим результат.</p>
      </Demo>
    </div>
    <Note>После рендера React меняет нужные элементы страницы. Чтобы увидеть новое число, нужно получить новое описание интерфейса.</Note>
  </div>;
}
function RenderLesson(){
  const [step,setStep]=useState(0),[nextCount,setNextCount]=useState(0),[visibleCount,setVisibleCount]=useState(null);
  const messages=['React вызывает CounterView с текущими props.','Функция вернула описание кнопки. Экран пока не менялся.','React применил изменения к DOM. Теперь браузер показывает новое число.'];
  const steps=[['Вызов компонента','Начало рендера'],['Описание интерфейса','Результат рендера'],['Обновление DOM','После рендера']];
  function select(i){setStep(i);setVisibleCount(i===2?nextCount:nextCount===0?null:nextCount-1)}
  function next(){if(step===2){setNextCount(nextCount+1);setStep(0)}else select(step+1)}
  function reset(){setStep(0);setNextCount(0);setVisibleCount(null)}
  return <div>
    <p className="body-text">Мы уже обновили счётчик через состояние. Теперь замедлим процесс: вызов компонента → описание интерфейса → изменения на странице.</p>
    <div className="grid"><div><Code text={'function CounterView(props) {\n  return <button>Нажали {props.count} раз</button>;\n}\n\n<CounterView count={'+nextCount+'} />'} highlight={step===0?[1,5]:step===1?[2]:[]}/><Note>Рендер вычисляет описание. Изменения в DOM применяются следующим этапом.</Note></div>
      <Demo label="Результаты текущего шага"><div className="render-output"><span className="shop-location">Описание от компонента</span><div className="log">{step>=1?'<button>Нажали '+nextCount+' раз</button>':'Вычисляется для count = '+nextCount}</div></div><div className="render-output"><span className="shop-location">Что сейчас видно на экране</span>{visibleCount===null?<div className="log">Кнопка ещё не появилась</div>:<RenderedCounter count={visibleCount}/>}</div><p className="hint" style={{marginTop:20}}>Это замедленная модель: шагами управляем кнопкой под картой.</p></Demo></div>
    <StepMap steps={steps} step={step} onSelect={select} onNext={next} onReset={reset} message={messages[step]}/>
  </div>;
}

function EventLesson(){const [calls,setCalls]=useState(0);const handleClick=()=>{window.alert('Привет!');setCalls(calls+1)};return <div className="grid"><Code text={`function HelloButton() {\n  function handleClick() {\n    alert('Привет!');\n  }\n\n  return (\n    <button onClick={handleClick}>\n      Поздороваться\n    </button>\n  );\n}`} highlight={[7]}/><Demo label="Нажатие вызывает функцию"><Button primary onClick={handleClick}>Поздороваться</Button><p className="hint" style={{marginTop:18}}>Появится стандартное сообщение браузера.</p>{calls>0&&<div className="status">Обработчик вызван {calls} раз</div>}<Reveal label="А если написать onClick={handleClick()}?"><p>Скобки вызовут обработчик сразу при выполнении функции компонента. В обработчик попадёт её результат. Для реакции на будущий клик передаём саму функцию.</p></Reveal></Demo></div>}
const BrokenButton=memo(function BrokenButton({observe}){
  let count=0;
  function handleClick(){count=count+1;observe(count)}
  return <button className="primary" onClick={handleClick}>Нажали {count} раз</button>;
});
function BrokenLesson(){
  const [clicks,setClicks]=useState(0),[revision,setRevision]=useState(0);
  const observe=useCallback(count=>setClicks(count),[]);
  function reset(){setClicks(0);setRevision(revision+1)}
  const remaining=Math.max(0,3-clicks);
  return <div><p className="body-text">Давайте попробуем это сделать как в обычном JavaScript: объявим переменную и увеличим её в обработчике.</p><div className="grid">
    <Code text={'function Counter() {\n  let count = 0;\n\n  function handleClick() {\n    count = count + 1;\n  }\n\n  return (\n    <button onClick={handleClick}>\n      Нажали {count} раз\n    </button>\n  );\n}'} highlight={clicks?[5,10]:[2]}/>
    <Demo label="Нажмите кнопку и посмотрите на число"><BrokenButton key={revision} observe={observe}/><div className="answer-countdown" role="status"><div className="click-dots" aria-hidden="true">{[1,2,3].map(n=><span key={n} className={clicks>=n?'done':''}>{clicks>=n?'✓':n}</span>)}</div><strong>{remaining?'До ответа: '+remaining+' '+(remaining===1?'клик':'клика'):'Ответ открыт'}</strong></div>
    {clicks>=3&&<div className="appear"><hr className="divider"/><h2>Почему число не изменилось?</h2><p style={{marginTop:16}}>Переменная изменилась, но React не получил сигнал обновить экран.</p><Note><strong>Что должно произойти, чтобы на экране появилось новое число?</strong><br/>Сначала разберём, как React получает новый вид интерфейса.</Note><Button onClick={reset} style={{marginTop:18}}>Начать заново</Button></div>}</Demo>
  </div></div>;
}

function StateAnatomy(){const [part,setPart]=useState('initial'),[expanded,setExpanded]=useState(false);const info={initial:['0 — начальное значение','Используется при первом появлении компонента. При последующих рендерах React отдаёт сохранённое значение.'],value:['count — текущее значение','Читаем его, чтобы описать интерфейс в этом рендере.'],setter:['setCount — функция обновления','Передаём ей следующее значение. React запоминает его для следующего рендера и планирует обновление интерфейса.']};return <div><p className="body-text">Встроенная функция <Inline>useState</Inline> решает обе задачи: даёт компоненту сохранённое значение и функцию, чтобы передать новое значение и запросить обновление.</p><div className="tokens"><span>const [</span><button aria-pressed={part==='value'} onClick={()=>setPart('value')}>count</button><span>,</span><button aria-pressed={part==='setter'} onClick={()=>setPart('setter')}>setCount</button><span>] = useState(</span><button aria-pressed={part==='initial'} onClick={()=>setPart('initial')}>0</button><span>);</span></div><div className="explain" aria-live="polite"><h2>{info[part][0]}</h2><p style={{marginTop:16}}>{info[part][1]}</p></div><Reveal label="Что означают квадратные скобки?"><p><Inline>useState</Inline> возвращает массив из двух значений. Квадратные скобки позволяют дать каждому своё имя.</p><Button onClick={()=>setExpanded(!expanded)} style={{margin:'10px 0 18px'}}>Посмотреть развёрнутую запись</Button>{expanded&&<Code text={`const pair = useState(0);\nconst count = pair[0];\nconst setCount = pair[1];`} file="та же операция"/>}</Reveal><p className="hint" style={{marginTop:18}}>Импортируем useState из react. Вызываем на верхнем уровне компонента. Имена count и setCount выбираем сами.</p></div>}
const stateCode=`import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  function handleClick() {\n    setCount(count + 1);\n  }\n\n  return (\n    <button onClick={handleClick}>\n      Нажали {count} раз\n    </button>\n  );\n}`;
const TrackedCounter=memo(function TrackedCounter({report}){
  const [count,setCount]=useState(0);
  useEffect(()=>report(count),[count,report]);
  function handleClick(){setCount(count+1)}
  return <button className="primary" onClick={handleClick}>Нажали {count} раз</button>;
});
function StateCounter(){
  const [reset,setReset]=useState(0),[history,setHistory]=useState([]);
  const report=useCallback(count=>setHistory(previous=>[...previous,{render:previous.length+1,count}]),[]);
  function restart(){setHistory([]);setReset(reset+1)}
  return <div className="grid"><div className="stack"><Code text={stateCode} highlight={[4,7,12]}/><div className="state-readout" aria-live="polite">В текущем рендере: <Inline>count = {history.at(-1)?.count??0}</Inline></div></div><Demo label="Тот же счётчик, теперь с состоянием"><div className="controls"><TrackedCounter key={reset} report={report}/><Button onClick={restart}>Начать с нуля</Button></div><div className="render-history"><h3>Что React возвращает из useState</h3><ol aria-live="polite">{history.slice(-6).map(item=><li key={item.render} className={item.render===history.length?'latest':''}><span>Рендер {item.render}</span><strong>count = {item.count}</strong></li>)}</ol><p className="hint">Первый показ и последующие обновления этого счётчика. Показываем последние шесть значений.</p></div><Note><Inline>useState(0)</Inline> задаёт начальное значение. Следующий рендер получает сохранённое состояние, а не новый ноль.</Note></Demo></div>;
}

function StateCycle(){
  const [step,setStep]=useState(0),[base,setBase]=useState(0);
  const steps=[['Готовый экран','Ждём нажатия'],['Сигнал обновления','Работает обработчик'],['Следующий рендер','React вызывает компонент'],['Изменение DOM','Браузер показывает результат']];
  const current=step>=2?base+1:base,visible=step===3?base+1:base;
  const messages=['На экране — результат предыдущего рендера.','setCount передал новое значение. Переменная в текущем обработчике и экран ещё прежние.','useState вернул новое значение. Компонент вычисляет описание; DOM ещё не обновлён.','React применил изменения к DOM. Теперь новое число видно на экране.'];
  function next(){if(step===3){setBase(base+1);setStep(0)}else setStep(step+1)}
  return <div><p className="body-text">Замедлим одно обновление. Число в текущем вызове компонента и число на экране меняются на разных этапах.</p><div className="grid equal"><section className="surface stack"><h2>В коде</h2><div className="state-readout"><Inline>count = {current}</Inline></div><Code text={step===1?'function handleClick() {\n  setCount('+ (base+1) +');\n  console.log(count); // '+base+'\n}':'const [count, setCount] = useState(0);\n// count в этом рендере: '+current} file={step===1?'обработчик Counter.jsx':'Counter.jsx'} highlight={step===1?[2,3]:[1,2]}/></section><Demo label="На экране"><div className="product-preview">Нажали {visible} раз</div><dl className="table-lines"><dt>Значение для следующего рендера</dt><dd>{step>=1?base+1:'ещё не задано'}</dd></dl><Note>Setter не переписывает локальную переменную текущего вызова компонента.</Note></Demo></div><StepMap steps={steps} step={step} onSelect={setStep} onNext={next} onReset={()=>{setBase(0);setStep(0)}} message={messages[step]}/></div>;
}

function LimitExample(){const [count,setCount]=useState(0);function add(){setCount(count+1)}return <><button className="primary" disabled={count>=5} onClick={add}>Добавлено: {count}</button><p className="hint" style={{marginTop:18}}>{count>=5?'Лимит достигнут: disabled = true':'До лимита осталось: '+(5-count)}</p></>}
function LimitLesson(){const [reset,setReset]=useState(0);return <div className="grid"><Code text={`function AddButton() {\n  const [count, setCount] = useState(0);\n\n  function add() {\n    setCount(count + 1);\n  }\n\n  return (\n    <button disabled={count >= 5} onClick={add}>\n      Добавлено: {count}\n    </button>\n  );\n}`} highlight={[9,10]}/><Demo label="Два свойства из одного состояния"><LimitExample key={reset}/><Button onClick={()=>setReset(reset+1)}>Сброс</Button><Reveal label="Где код, который ищет кнопку и отключает её?"><p>Мы описали свойство <Inline>disabled</Inline> через состояние. React сам согласует DOM с этим описанием.</p></Reveal><p className="hint" style={{marginTop:15}}>useState импортирован из react, как в предыдущем примере.</p></Demo></div>}
function PropsState(){
  const [name,setName]=useState('Книга'),[reset,setReset]=useState(0),[view,setView]=useState('parent');
  const productCode="import { useState } from 'react';\n\nfunction Product(props) {\n  const [count, setCount] = useState(0);\n\n  function add() {\n    setCount(count + 1);\n  }\n\n  return (\n    <article>\n      <h2>{props.name}</h2>\n      <button onClick={add}>\n        Добавлено: {count}\n      </button>\n    </article>\n  );\n}";
  return <div className="grid"><div className="stack"><h2>Props приходят от родителя</h2><p className="body-text">Название задаёт родитель. Количество нажатий каждый экземпляр Product хранит у себя.</p><label>Название первой карточки<input value={name} onChange={e=>setName(e.target.value)} maxLength={30}/></label><Tabs value={view} onChange={setView} options={[['parent','Код родителя'],['component','Код компонента Product']]}/><Code text={view==='parent'?'function App() {\n  return (\n    <section>\n      <Product name={'+JSON.stringify(name)+'} />\n      <Product name="Альбом" />\n    </section>\n  );\n}':productCode} highlight={view==='parent'?[4,5]:[4,12,14]}/></div><Demo label="Два экземпляра — два независимых state"><div className="state-cards"><ProductWithCounter key={'first-'+reset} name={name} label="Экземпляр 1"/><ProductWithCounter key={'second-'+reset} name="Альбом" label="Экземпляр 2"/></div><div className="controls" style={{marginTop:22}}><Button onClick={()=>setReset(reset+1)}>Создать компоненты заново</Button></div><Reveal label="Изменение props обязательно обнуляет state?"><p>Нет. Нажмите кнопки в карточках, затем поменяйте название первой. Её state сохранится, пока это тот же компонент на том же месте. Создание новых экземпляров начнёт оба счётчика с нуля.</p></Reveal></Demo></div>;
}

function ProductWithCounter(props){
  const [count,setCount]=useState(0);
  return <article className="product-preview state-card"><span className="badge">{props.label}</span><h2>{props.name}</h2><div className="state-card-values"><span>props.name: {props.name}</span><span>state count: {count}</span></div><Button primary onClick={()=>setCount(count+1)}>Добавлено: {count}</Button></article>;
}

function ChildButton(props){return <button className="primary" onClick={props.onAdd}>Добавить книгу</button>}
function ShopHeader(props){return <div className="data-box"><span className="small">Шапка</span><h2>Корзина: {props.count}</h2><p style={{margin:'10px 0 0'}}>Сумма: {money(props.count*700)}</p></div>}
function CartProduct(props){return <div className="product-preview" style={{marginTop:20}}><h2>Книга</h2><p>700 ₽</p><ChildButton onAdd={props.onAdd}/></div>}
function SharedApp(){const [count,setCount]=useState(0);function addProduct(){setCount(count+1)}return <section><ShopHeader count={count}/><CartProduct onAdd={addProduct}/></section>}
const callbackCode="// Кнопка получает функцию через props.\nfunction AddButton(props) {\n  return (\n    <button onClick={props.onAdd}>\n      Добавить книгу\n    </button>\n  );\n}\n\n// Родитель передаёт свою функцию.\n<AddButton onAdd={addProduct} />";
function CallbackLesson({showFlow=false}){
  const [calls,setCalls]=useState(0);
  function add(){setCalls(calls+1)}
  return <div className="grid"><Code text={callbackCode} highlight={[4,11]}/><Demo label="Сообщение от ребёнка родителю">
    {showFlow&&<div className="callback-parent"><span className="shop-location">Родитель App</span><strong>Хранит функцию addProduct</strong></div>}
    {showFlow&&<div className="callback-arrows"><div><b>↓</b><span>props.onAdd — переданная функция</span></div><div key={calls} className={calls?'value-pulse':''}><b>↑</b><span>вызов props.onAdd() при клике</span></div></div>}
    <div className="product-preview"><span className="small">Дочерняя кнопка AddButton</span><div style={{marginTop:15}}><ChildButton onAdd={add}/></div></div><div className="status" role="status">Родитель получил сигналов: {calls}</div><Note>{showFlow?'Props идут вниз. Ребёнок не изменяет их: он вызывает полученную функцию. Обработчик родителя решает, что изменить.':'Props могут содержать функцию. Ребёнок вызывает её, а родитель решает, какие данные изменить.'}</Note></Demo></div>;
}
function CallbackFlow(){return <CallbackLesson showFlow/>}

function SharedLesson(){
  const [view,setView]=useState('demo'),[reset,setReset]=useState(0);
  return <div className="grid"><div className="stack"><Tabs value={view} onChange={setView} options={[['demo','Связь компонентов'],['code','Простой код App']]}/>{view==='code'?<Code text={'function App() {\n  const [count, setCount] = useState(0);\n\n  function addProduct() {\n    setCount(count + 1);\n  }\n\n  return (\n    <section>\n      <ShopHeader count={count} />\n      <CartProduct onAdd={addProduct} />\n    </section>\n  );\n}'}/>:<div className="surface"><h2>App хранит count</h2><div className="branch"><strong>ShopHeader</strong><p className="hint" style={{margin:'8px 0 0'}}>Получает число для отображения.</p></div><div className="branch"><strong>CartProduct → AddButton</strong><p className="hint" style={{margin:'8px 0 0'}}>Получает функцию добавления.</p></div><p className="body-text">Одно состояние связывает оба элемента.</p></div>}<div className="surface responsibility"><span className="demo-label">S из SOLID — Single Responsibility Principle</span><h2>Одна ответственность — одна причина для изменения</h2><ul className="small-list"><li><strong>App:</strong> управляет общим количеством и связывает части.</li><li><strong>ShopHeader:</strong> отображает сводку корзины.</li><li><strong>CartProduct:</strong> показывает товар и кнопку действия.</li></ul><p className="hint">Если меняем вид сводки, правим ShopHeader. Кнопке не нужно знать, как она устроена. Это пример разделения ответственности, а не правило «один компонент — одна строка».</p></div></div><Demo label="Теперь собираем знакомые части"><SharedApp key={reset}/><Button onClick={()=>setReset(reset+1)} style={{marginTop:18}}>Сброс</Button><Reveal label="А если у шапки и карточки будут отдельные count?"><p>Это будут независимые состояния. Общему числу выбираем одного владельца — ближайшего общего родителя.</p></Reveal></Demo></div>;
}

function StateCartDemo(){
  const [count,setCount]=useState(0);
  function add(){setCount(count+1)}
  function reset(){setCount(0)}
  return <CartPanel quantity={count} total={count*700} onAdd={add} onReset={reset}/>;
}
const stateCartSource=`function CartExample() {
  const [count, setCount] = useState(0);

  function add() {
    setCount(count + 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <CartPanel
      quantity={count}
      total={count * 700}
      onAdd={add}
      onReset={reset}
    />
  );
}`;
function Compare(){
  const [mode,setMode]=useState('native');
  return <div className="grid">
    <div>
      <Tabs value={mode} onChange={setMode} options={[["native","Ручное обновление"],["react","Описание через состояние"]]}/>
      <Code file={mode==='native'?'добавление и сброс — app.js':'App.jsx'} text={mode==='native'?manualCartSource:stateCartSource} highlight={mode==='native'?[10,11,12,13,14,22,23,24,25,28]:[2,5,8,9,13,14,15,17]}/>
      {mode==='react'&&<p className="hint" style={{marginTop:16}}>CartPanel — компонент той же корзины. Через props он получает количество, сумму и обработчики. useState импортирован из react.</p>}
    </div>
    <div>
      {mode==='native'?<ManualDemo complete/>:<StateCartDemo/>}
      <Note>{mode==='native'?'Обработчик изменяет данные и явно обновляет количество, сумму и сообщение в DOM.':'Обработчик меняет состояние. Новые данные поступают в тот же компонент корзины, и React обновляет экран.'}</Note>
      <Reveal label="Значит, в React меньше любого кода?"><p>Не обязательно. React помогает организовать интерфейс и его обновления. Расчёты, обработчики и правила приложения всё равно нужно написать.</p></Reveal>
    </div>
  </div>;
}
function RunQuestion(){
  return <div className="launch-bridge">
    <div className="launch-question-mark" aria-hidden="true">?</div>
    <p className="body-text">Компоненты написаны.<br/>Теперь нужно превратить исходники в работающую страницу.</p>
    <Reveal label="Что нужно сделать?">
      <h2>Собрать наш проект.</h2>
      <p>Преобразовать JSX в JavaScript, обработать зависимости и подготовить файлы для браузера. Инструменты сборки автоматизируют эту работу. Сначала подготовим среду, в которой они запускаются.</p>
    </Reveal>
  </div>;
}
function BundlerLesson(){
  const [step,setStep]=useState(0);
  const labels=['Найти зависимости','Преобразовать исходники','Подготовить файлы','Начать заново'];
  const guidance=[
    'Начните с поиска зависимостей. Изменения появятся в блоке «Исходники».',
    'Шаг 1 · Исходники. Стрелки показывают, какой файл подключает следующий.',
    'Шаг 2 · Преобразование. Найденные JSX-модули превращаются в обычный JavaScript.',
    'Шаг 3 · Результат. Из обработанных модулей и ресурсов получаются файлы для публикации.'
  ];
  const panelClass=n=>'surface bundler-panel '+(step===n?'bundler-current':step>n?'bundler-complete':'');
  function panelHeading(n,title){return <h2><button className="bundler-step-trigger" aria-pressed={step===n} onClick={()=>setStep(n)}><span className="bundler-step-number">{n}</span>{title}</button></h2>}
  return <div className="bundler-explainer">
    <p className="body-text"><strong>Сборщик (bundler)</strong> — инструмент, который находит зависимости между модулями и собирает используемый код и ресурсы в файлы для браузера.</p>
    <div className="bundler-controls"><Button primary onClick={()=>setStep((step+1)%4)}>{labels[step]}</Button><p role="status">{guidance[step]}</p></div>
    <div className="bundler-pipeline">
      <section className={panelClass(1)} aria-label="Исходники и их зависимости">
        <span className="section-tag">Вход</span>{panelHeading(1,'Исходники')}
        <div className={'bundler-look '+(step===1?'visible':'')} aria-hidden="true">↓ Связи между файлами</div>
        {step>=1?<div className="bundler-file-graph">
          <div className="bundler-file">index.html</div>
          <div className="bundler-file-link"><span aria-hidden="true">↓</span><span>подключает через script</span></div>
          <div className="bundler-file">App.jsx</div>
          <div className="bundler-imports"><div><span className="import-arrow" aria-hidden="true">→</span><div><span className="shop-location">import</span><div className="bundler-file">ProductCard.jsx</div></div></div><div><span className="import-arrow" aria-hidden="true">→</span><div><span className="shop-location">import</span><div className="bundler-file">app.css</div></div></div></div>
        </div>:<div className="bundler-file-list">{['index.html','App.jsx','ProductCard.jsx','app.css'].map(file=><div className="bundler-file" key={file}>{file}</div>)}</div>}
        <p className="hint bundler-caption">{step>=1?'Идём от входного файла по ссылкам и import. Так находим всё, что использует проект.':'Пока видим отдельные файлы. Нужно выяснить, как они связаны.'}</p>
      </section>
      <div className={'bundler-transfer '+(step>=2?'active':'')} aria-hidden="true"><span>→</span></div>
      <section className={panelClass(2)} aria-label="Преобразование исходников">
        <span className="section-tag">Обработка</span>{panelHeading(2,'Преобразование')}
        <div className={'bundler-look '+(step===2?'visible':'')} aria-hidden="true">↓ Меняется формат кода</div>
        {step>=2?<div className="bundler-transform appear"><div className="bundler-module-names"><span>App.jsx</span><span>ProductCard.jsx</span></div><div className="bundler-format-flow"><strong>JSX</strong><span aria-hidden="true">↓</span><strong>JavaScript</strong></div><p className="hint">Преобразователь заменяет JSX на вызовы JavaScript. Браузер сможет выполнить этот код.</p></div>:<div className="bundler-await"><span className="bundler-format-preview">JSX → JavaScript</span><p className="hint">После поиска зависимостей подготовим код найденных модулей.</p></div>}
      </section>
      <div className={'bundler-transfer '+(step>=3?'active':'')} aria-hidden="true"><span>→</span></div>
      <section className={panelClass(3)} aria-label="Результат сборки">
        <span className="section-tag">Выход</span>{panelHeading(3,'Готовые файлы')}
        <div className={'bundler-look '+(step===3?'visible':'')} aria-hidden="true">↓ Результат в папке dist</div>
        {step===3?<div className="appear"><pre className="file-tree">{'dist/\n  index.html\n  assets/\n    app.js\n    app.css'}</pre><p className="hint">Код объединён и оптимизирован, ресурсы подготовлены. Эти файлы можно разместить на хостинге.</p><p className="hint">Имена и состав файлов здесь условные.</p></div>:<div className="bundler-await"><span className="bundler-format-preview">dist/</span><p className="hint">Файлы появятся после обработки исходников.</p></div>}
      </section>
    </div>
    <p className="hint" style={{marginTop:20}}>Можно идти по кнопке или выбрать этап по его заголовку. Схема учебная: сборка здесь не запускается.</p>
    <Reveal label="Когда нужна сборка?"><p>Когда используем JSX и другие преобразования, подключаем много модулей и хотим автоматизировать подготовку проекта к публикации. Обычные HTML, CSS и JavaScript, включая браузерные модули, можно использовать напрямую.</p><p style={{marginTop:14}}>На выходе может быть несколько JavaScript- и CSS-файлов. Преобразования и оптимизации зависят от инструмента и его настроек.</p></Reveal>
  </div>;
}

function BuildLesson(){const [step,setStep]=useState('jsx'),[test,setTest]=useState(false);const source=`function Greeting() {\n  return <h1>Привет!</h1>;\n}`;const compiled=`import { jsx } from 'react/jsx-runtime';\n\nfunction Greeting() {\n  return jsx('h1', {\n    children: 'Привет!'\n  });\n}`;return <div className="grid"><div><Tabs value={step} onChange={setStep} options={[["jsx","Исходник JSX"],["js","После преобразования"]]}/><Code file={step==='jsx'?'Greeting.jsx':'Greeting.js'} text={step==='jsx'?source:compiled} highlight={step==='jsx'?[2]:[4,5,6]}/><p className="hint" style={{marginTop:18}}>Выход показан упрощённо, без минификации. JSX превращается в вызовы JavaScript.</p></div><Demo label="Что умеет браузер"><p>HTML, CSS и стандартный JavaScript можно использовать без сборки.</p><Button primary onClick={()=>setTest(!test)} aria-expanded={test}>А если передать исходный JSX браузеру?</Button>{test&&<div className="status error appear"><strong>Синтаксическая ошибка.</strong><br/>JSX не является частью браузерного JavaScript. Сначала нужен этап преобразования.</div>}<Reveal label="React всегда требует сборку?"><p>Нет. Можно писать без JSX и подключать подготовленные библиотеки. Для учебного проекта с JSX удобнее использовать готовые инструменты.</p></Reveal><Note>Преобразование JSX — одна задача. Подготовка всех ресурсов проекта к публикации — задача сборки.</Note></Demo></div>}
function ViteLesson(){
  const [built,setBuilt]=useState(false),[running,setRunning]=useState(false),[title,setTitle]=useState('Мой первый проект');
  return <div>
    <div className="vite-introduction"><div className="react-name">Vite</div><p className="body-text">Инструмент для разработки и сборки веб-проектов.<br/>Будем использовать его для нашего приложения на React.</p></div>
    <div className="grid equal vite-capabilities">
      <section className="surface vite-capability">
        <span className="section-tag">01 / Для публикации</span><h2>Собирает проект</h2>
        <p>Обрабатывает исходники и зависимости, оптимизирует код и создаёт готовые файлы в папке <Inline>dist</Inline>.</p>
        <Code file="терминал" kind="Сборка" text="npm run build"/>
        <Button primary onClick={()=>setBuilt(true)} disabled={built}>{built?'Файлы готовы':'Показать результат сборки'}</Button>
        <div className={'vite-result '+(built?'ready':'')} aria-live="polite">{built?<><pre className="file-tree">{'dist/\n  index.html\n  assets/\n    app.js\n    app.css'}</pre><p className="hint">Пример файлов, которые можно загрузить на хостинг.</p></>:<p className="hint">Здесь появится результат сборки.</p>}</div>
      </section>
      <section className="surface vite-capability">
        <span className="section-tag">02 / Пока пишем код</span><h2>Запускает проект для разработки</h2>
        <p>Поднимает локальный сервер. После правок быстро обновляет изменённые части страницы — это горячее обновление модулей (HMR).</p>
        <Code file="терминал" kind="Разработка" text="npm run dev"/>
        <Button primary onClick={()=>setRunning(true)} disabled={running}>{running?'Сервер разработки запущен':'Показать режим разработки'}</Button>
        <div className={'vite-result '+(running?'ready':'')}>{running?<div className="stack appear"><label>Меняем заголовок в App.jsx<input value={title} onChange={e=>setTitle(e.target.value)} maxLength={40}/></label><div className="vite-browser"><span className="shop-location">localhost:5173 · результат в браузере</span><h3 aria-live="polite">{title||'Заголовок пустой'}</h3></div><p className="hint">Представьте, что каждая правка сохранена в файле: результат сразу обновляется.</p></div>:<p className="hint">Здесь можно попробовать быстрое обновление страницы.</p>}</div>
      </section>
    </div>
    <p className="hint" style={{marginTop:22}}>Интерактивная модель: команды не выполняются на устройстве. В разработке Vite обновляет страницу по мере правок; build отдельно готовит файлы для публикации.</p>
  </div>;
}

function NodeEnvironment(){
  const [command,setCommand]=useState('node');
  return <div>
    <div className="grid equal environment-cards">
      <section className="surface stack"><h2>Node.js</h2><p>Среда выполнения JavaScript на компьютере. На ней можно запускать серверы, скрипты и инструменты разработки.</p><Note>Node.js запускает инструменты разработки на нашем компьютере. Сам интерфейс работает в браузере.</Note></section>
      <section className="surface stack"><h2>npm</h2><p>Менеджер пакетов: устанавливает библиотеки и инструменты, а также запускает команды проекта.</p><Note><Inline>npm install</Inline> — установить зависимости.<br/><Inline>npm run dev</Inline> — выполнить команду dev из package.json.</Note></section>
    </div>
    <section className="surface environment-install"><div><h2>Что установить локально?</h2><p>Установите актуальную LTS-версию Node.js — версию с длительной поддержкой. npm обычно устанавливается вместе с ней.</p><a href="https://nodejs.org/en/download" target="_blank" rel="noreferrer">Установка Node.js для своей системы ↗</a></div><div className="environment-check"><span className="shop-location">После установки откройте терминал</span><Tabs label="Проверка установки" value={command} onChange={setCommand} options={[['node','node -v'],['npm','npm -v']]}/><p aria-live="polite">{command==='node'?'Команда покажет установленную версию Node.js.':'Команда покажет установленную версию npm.'}</p><span className="hint">Здесь выбираем команду для объяснения; выполнить её нужно в терминале своего компьютера.</span></div></section>
  </div>;
}

function Setup(){const [step,setStep]=useState(0);const commands=['npm create vite@latest my-app -- --template react','cd my-app','npm install','npm run dev'];const meanings=['Создать папку проекта из шаблона React.','Перейти в папку проекта.','Установить зависимости из package.json.','Запустить сервер разработки.'];return <div className="grid"><div><Code file="терминал" kind="Node.js и npm установлены" text={commands.join('\n')} highlight={[step+1]}/><div className="row" style={{marginTop:18}}><Button primary onClick={()=>setStep((step+1)%4)}>Разобрать следующую команду</Button></div><p className="body-text" style={{marginTop:18}}>{meanings[step]}</p><Reveal label="Что делает npm run?"><p>Выполняет именованный скрипт из <Inline>package.json</Inline>. В шаблоне скрипт dev запускает Vite, build запускает сборку.</p></Reveal></div><Demo label="Куда заглянуть после запуска"><pre className="file-tree">{'my-app/\n  index.html\n  package.json\n  src/\n    main.jsx\n    App.jsx\n    App.css'}</pre><Note>Первое изменение делаем в <Inline>src/App.jsx</Inline>. В нём находится основной компонент приложения.</Note><p className="hint" style={{marginTop:15}}>Node.js нужен инструментам разработки. Код интерфейса выполняется в браузере.</p></Demo></div>}
function WhenReact(){const [which,setWhich]=useState('simple');return <div className="grid"><div><Tabs value={which} onChange={setWhich} options={[["simple","Статичная страница"],["complex","Интерактивное приложение"]]}/><p className="big-question">{which==='simple'?'Контакты, текст и одна ссылка.':'Карточки, фильтры и общая корзина.'}</p><p className="body-text">{which==='simple'?'HTML и CSS могут полностью решить задачу. Дополнительный инструмент не обязателен.':'Повторяемые части и связанные данные дают больше поводов использовать компоненты и состояние.'}</p></div><Demo label="Что React не решает автоматически"><ul className="small-list"><li>Правильность расчётов и запросов.</li><li>Удобство и доступность интерфейса.</li><li>Производительность любого приложения.</li></ul><Note>Выбираем инструмент по задаче и сложности поддержки.</Note></Demo></div>}
function Ending(){return <div><div className="grid equal"><div className="surface"><h2>Теперь знакомы четыре идеи</h2><ol className="small-list"><li>Компонент описывает часть экрана.</li><li>JSX соединяет разметку и выражения.</li><li>Props передают данные в компонент.</li><li>State хранит данные, которые меняются.</li></ol></div><div><p className="big-question">Данные меняются.<br/>Интерфейс им соответствует.</p><p className="body-text">На следующем занятии можно превратить одну карточку в список и подключить API.</p></div></div><div className="source-links"><a href="https://vite.dev/guide/" target="_blank" rel="noreferrer">Vite: руководство</a></div></div>}

function FullShopCode(){return <Mega fullSource/>}

const slides=[
 {id:'intro',title:'От JavaScript к компонентам',chapter:'',component:Cover,minutes:1},
 {id:'agenda',title:'Что будем делать на лекции?',chapter:'Маршрут лекции',component:Agenda,minutes:1},
 {id:'one-action',title:'Что меняется после одного клика?',chapter:'01 / Знакомый JavaScript',component:OneAction,minutes:2},
 {id:'manual-dom',title:'Как мы работаем с интерфейсом обычно',chapter:'01 / Знакомый JavaScript',component:Manual,minutes:3},
 {id:'many-changes',title:'А если данные меняются из разных мест?',chapter:'01 / Знакомый JavaScript',component:Growing,minutes:1},
 {id:'missed-element',title:'Что происходит, когда обновлений становится много?',chapter:'01 / Знакомый JavaScript',component:Mega,minutes:3},
 {id:'full-native-code',title:'Как выглядит весь код корзины?',chapter:'01 / Знакомый JavaScript',component:FullShopCode,minutes:1},
 {id:'solution',title:'Какие есть пути решения?',chapter:'02 / Ищем подход',component:ToolQuestion,minutes:3},
 {id:'library-intro',title:'Что такое библиотеки и фреймворки?',chapter:'02 / Готовые инструменты',component:LibraryLife,minutes:1},
 {id:'abstraction',title:'Что дают библиотеки и фреймворки?',chapter:'02 / Готовые инструменты',component:AbstractionLesson,minutes:2},
 {id:'library-framework',title:'Чем библиотека отличается от фреймворка?',chapter:'02 / Ищем подход',component:LibraryFramework,minutes:2},
 {id:'react',title:'Какой инструмент разберём?',chapter:'03 / Знакомство с React',component:ReactIntro,minutes:1},
 {id:'why-react',title:'Почему React?',chapter:'03 / Знакомство с React',component:WhyReact,minutes:1},
 {id:'react-principles',title:'Что такое React и его принципы?',chapter:'03 / Общая картина',component:ReactPrinciples,minutes:1},
 {id:'component-tree',title:'Как React собирает страницу из компонентов?',chapter:'03 / Общая картина',component:ComponentTreeLesson,minutes:2},
 {id:'component',title:'Что такое компонент?',chapter:'03 / Компоненты',component:FirstComponent,minutes:3},
 {id:'jsx-intro',title:'Что такое JSX?',chapter:'03 / JSX',component:JSXIntro,minutes:2},
 {id:'jsx',title:'Как подставить данные в JSX?',chapter:'03 / JSX',component:JSXLesson,minutes:2},
 {id:'reuse',title:'Можно ли использовать компонент дважды?',chapter:'03 / Компоненты',component:Reuse,minutes:2},
 {id:'props',title:'Как передать карточке другой товар?',chapter:'03 / Props',lead:'Props — объект данных, который компонент получает от родителя.',component:PropsLesson,minutes:4},
 {id:'props-flow',title:'Как устроен поток данных в React?',chapter:'03 / Props',component:PropsFlow,minutes:1},
 {id:'events',title:'Как отреагировать на нажатие?',chapter:'04 / События',component:EventLesson,minutes:2},
 {id:'ordinary-variable',title:'А что если я хочу изменить какие-то данные?',chapter:'04 / Эксперимент',component:BrokenLesson,minutes:3},
 {id:'render-basics',title:'Что такое рендер — простыми словами?',chapter:'04 / Рендер',component:RenderBasics,minutes:1},
 {id:'component-memory',title:'Откуда взять значение при следующем рендере?',chapter:'04 / Память компонента',component:ComponentMemoryLesson,minutes:1},
 {id:'use-state',title:'Как useState хранит и обновляет значение?',chapter:'04 / Состояние',component:StateAnatomy,minutes:3},
 {id:'counter',title:'Что изменилось с useState?',chapter:'04 / Состояние',component:StateCounter,minutes:3},
 {id:'render',title:'Как обновление проходит по шагам?',chapter:'04 / Рендер подробнее',component:RenderLesson,minutes:2},
 {id:'state-cycle',title:'Что происходит после setCount?',chapter:'04 / Состояние',component:StateCycle,minutes:2},
 {id:'disabled',title:'Как состояние управляет кнопкой?',chapter:'04 / Состояние',component:LimitLesson,minutes:2},
 {id:'props-state',title:'Чем props отличаются от state?',chapter:'04 / Данные компонента',component:PropsState,minutes:2},
 {id:'callback',title:'Как ребёнок сообщает о действии?',chapter:'05 / Собираем вместе',component:CallbackLesson,minutes:3},
 {id:'callback-flow',title:'Как проходит сигнал от ребёнка к родителю?',chapter:'05 / Поток данных',component:CallbackFlow,minutes:1},
 {id:'shared-state',title:'Где хранить общее число товаров?',chapter:'05 / Собираем вместе',component:SharedLesson,minutes:3},
 {id:'comparison',title:'Что мы поручили React?',chapter:'05 / Возвращаемся к началу',component:Compare,minutes:1},
 {id:'run-question',title:'А как запустить весь этот код?',chapter:'06 / От кода к запуску',component:RunQuestion,minutes:1},
 {id:'node-npm',title:'Что нужно установить перед запуском?',chapter:'06 / Локальное окружение',component:NodeEnvironment,minutes:1},
 {id:'bundler',title:'Далее нам всё это нужно как-то собрать',chapter:'06 / Инструменты',component:BundlerLesson,minutes:2},
 {id:'build',title:'Может ли браузер выполнить этот код?',chapter:'06 / Инструменты',component:BuildLesson,minutes:1},
 {id:'vite',title:'Какой сборщик будем использовать?',chapter:'06 / Vite',component:ViteLesson,minutes:2},
 {id:'setup',title:'Как запустить свой проект?',chapter:'06 / Vite',component:Setup,minutes:2},
 {id:'when',title:'Всегда ли нужен React?',chapter:'07 / Выбор инструмента',component:WhenReact,minutes:1},
 {id:'end',title:'Что теперь можно объяснить?',chapter:'07 / Материалы',component:Ending,minutes:1}
];
function readSlide(){const raw=location.hash.slice(1);const numbered=raw.match(/^slide-(\d+)$/);if(numbered)return Math.max(0,Math.min(slides.length-1,Number(numbered[1])-1));const pos=slides.findIndex(s=>s.id===raw);return pos<0?0:pos}
function Lecture(){const [index,setIndex]=useState(readSlide);const slide=slides[index],Content=slide.component;const main=useRef(null);
 const go=useCallback(next=>{const bounded=Math.max(0,Math.min(slides.length-1,next));setIndex(bounded);history.replaceState(null,'','#slide-'+(bounded+1));window.scrollTo({top:0,behavior:'instant'})},[]);
 useEffect(()=>{function onHash(){setIndex(readSlide());window.scrollTo({top:0,behavior:'instant'})}window.addEventListener('hashchange',onHash);return ()=>window.removeEventListener('hashchange',onHash)},[]);
 useEffect(()=>{function key(e){if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select,pre,[contenteditable=true]'))return;if(['ArrowRight','PageDown'].includes(e.code)){e.preventDefault();go(index+1)}if(['ArrowLeft','PageUp'].includes(e.code)){e.preventDefault();go(index-1)}if(e.code==='Home'){e.preventDefault();go(0)}if(e.code==='End'){e.preventDefault();go(slides.length-1)}}window.addEventListener('keydown',key);return ()=>window.removeEventListener('keydown',key)},[index,go]);
 return <><main ref={main} className="slide" key={slide.id} data-slide-id={slide.id}>{index!==0&&<Head title={slide.title} chapter={slide.chapter} lead={slide.lead}/>}<Content/></main><nav className="navigation" aria-label="Навигация по слайдам"><span className="slide-number" aria-live="polite">{String(index+1).padStart(2,'0')} / {slides.length}</span><button onClick={()=>go(index-1)} disabled={index===0} aria-label="Предыдущий слайд">Назад</button><button className="primary" onClick={()=>go(index+1)} disabled={index===slides.length-1} aria-label="Следующий слайд">Далее</button></nav><div className="progress-line" style={{width:((index+1)/slides.length*100)+'%'}} aria-hidden="true"/></>
}
createRoot(document.getElementById('root')).render(<Lecture/>);
