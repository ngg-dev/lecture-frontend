import React, {useEffect,useRef,useState} from 'react';
import {money,Code,Demo,Button,Reveal,Note,Inline,Tabs,ProductCard} from './ui.jsx';

export function StepMap({steps,step,onSelect,onNext,onReset,message}) {
  return <section className="step-map surface" aria-label="Карта шагов">
    <ol className="step-map-list">{steps.map(([title,detail],i)=><li key={title} className={i===step?'current':i<step?'complete':'pending'}><button onClick={()=>onSelect(i)} aria-current={i===step?'step':undefined}><span className="step-badge">{i<step?'✓':i+1}</span><span><strong>{title}</strong><small>{detail}</small></span></button></li>)}</ol>
    <div className="step-map-footer"><p aria-live="polite">{message}</p><div className="controls"><Button primary onClick={onNext}>{step===steps.length-1?'Новое обновление':'Следующий шаг'}</Button><Button onClick={onReset}>Сначала</Button></div></div>
  </section>;
}

const growthFields=[
  ['count','Количество','count',v=>v.count],
  ['total','Сумма','total + " ₽"',v=>v.total+' ₽'],
  ['price','Цена книги','price + " ₽"',v=>v.price+' ₽'],
  ['status','Корзина','count > 0 ? "Есть товары" : "Пока пуста"',v=>v.count?'Есть товары':'Пока пуста'],
  ['discount','Скидка','discount ? "10%" : "Нет"',v=>v.discount?'10%':'Нет'],
  ['delivery','Доставка','total >= 2000 ? "Бесплатно" : "300 ₽"',v=>v.total>=2000?'Бесплатно':'300 ₽'],
  ['remaining','До бесплатной доставки','Math.max(0, 2000 - total) + " ₽"',v=>Math.max(0,2000-v.total)+' ₽'],
  ['bonus','Бонусы','Math.floor(total * 0.05)',v=>Math.floor(v.total*.05)],
  ['original','Сумма до скидки','count * price + " ₽"',v=>v.count*v.price+' ₽'],
  ['saving','Экономия','count * price - total + " ₽"',v=>v.count*v.price-v.total+' ₽'],
  ['weight','Вес заказа','count * 400 + " г"',v=>v.count*400+' г'],
  ['packing','Упаковка','count > 3 ? "Коробка" : "Пакет"',v=>v.count>3?'Коробка':'Пакет'],
  ['installment','Один из 4 платежей','Math.ceil(total / 4) + " ₽"',v=>Math.ceil(v.total/4)+' ₽'],
  ['checkout','Оформление','count > 0 ? "Доступно" : "Нет товаров"',v=>v.count?'Доступно':'Нет товаров'],
  ['stock','На складе после заказа','20 - count',v=>20-v.count],
  ['warning','Остаток','20 - count <= 5 ? "Мало книг" : "Достаточно"',v=>20-v.count<=5?'Мало книг':'Достаточно']
];
export function FunctionGrowth(){
  const [level,setLevel]=useState(0),[count,setCount]=useState(0),[discount,setDiscount]=useState(false);
  const host=useRef(null),fields=growthFields.slice(0,[2,5,16][level]);
  const total=count*700*(discount?.9:1);
  useEffect(()=>{
    const values={count,price:700,discount,total};
    fields.forEach(([id,,formula,read])=>{host.current.querySelector('#growth-'+id).textContent=read(values)});
  },[level,count,discount]);
  const source=['function updateView() {','  const total = count * price * (discount ? 0.9 : 1);','',
    ...fields.flatMap(([id,,formula])=>[
      '  const '+id+'Element = document.querySelector("#growth-'+id+'");',
      '  '+id+'Element.textContent = '+formula+';',''
    ]),'}'].join('\n');
  return <section className="solution-extra appear">
    <h2>Одна функция. Всё больше обязанностей.</h2>
    <p className="body-text">Добавляйте требования: обновления собраны вместе, но каждую связь с элементом по-прежнему пишем сами.</p>
    <Tabs label="Рост функции" value={level} onChange={setLevel} options={[[0,'1. Только количество и сумма'],[1,'2. Цена, статус и скидка'],[2,'3. Большой заказ: 16 полей']]}/>
    <div className="grid">
      <div><div className="edit-banner">Полей: {fields.length} · строк в updateView(): {source.split('\n').length}</div><Code text={source} file="updateView.js"/><p className="hint" style={{marginTop:15}}>count, price и discount — данные корзины вне этой функции. Кнопки меняют их и вызывают updateView().</p></div>
      <Demo label="Результат выбранной функции"><div className="controls"><Button primary disabled={count===20} onClick={()=>setCount(count+1)}>Добавить книгу</Button><Button aria-pressed={discount} onClick={()=>setDiscount(!discount)}>Скидка 10%</Button><Button onClick={()=>{setCount(0);setDiscount(false)}}>Сбросить</Button></div><dl ref={host} className="growth-values">{fields.map(([id,label])=><div key={id}><dt>{label}</dt><dd id={'growth-'+id}/></div>)}</dl></Demo>
    </div>
  </section>;
}

export function ModuleCoordination(){
  const [level,setLevel]=useState(0),[count,setCount]=useState(0),[discount,setDiscount]=useState(false);
  const total=count*700*(discount?.9:1);
  const targets=[
    ['cart','Корзина',count+' шт.'],
    ['summary','Итог',money(total)],
    ['delivery','Доставка',total>=2000?'Бесплатно':'300 ₽'],
    ['bonus','Бонусы',Math.floor(total*.05)],
    ['checkout','Оформление',count?'Доступно':'Нет товаров'],
    ['stock','Остаток книг',20-count]
  ].slice(0,[2,4,6][level]);
  return <section className="solution-extra appear"><h2>Кто согласует данные между модулями?</h2><p className="body-text">Один из вариантов — общий обработчик передаёт данные нужным модулям. По мере роста приложения список связей увеличивается.</p>
    <Tabs value={level} onChange={setLevel} label="Размер схемы модулей" options={[[0,'1. Два модуля'],[1,'2. Четыре модуля'],[2,'3. Шесть модулей']]}/>
    <div className="module-map">
      <div className="controls module-inputs"><Button primary disabled={count===20} onClick={()=>setCount(count+1)}>Добавили книгу</Button><Button onClick={()=>setDiscount(!discount)} aria-pressed={discount}>Изменили скидку</Button><Button onClick={()=>{setCount(0);setDiscount(false)}}>Сбросить</Button></div>
      <div className="flow-arrow">↓ <span>событие</span></div>
      <div className="coordinator"><strong>Наш код согласования</strong><span>count = {count} · total = {total}</span><p>Рассчитать значения → передать их каждому зависимому модулю</p></div>
      <div className="flow-arrow">↓ <span>явно вызываем обновление каждого модуля</span></div>
      <div className="module-targets" aria-live="polite">{targets.map(([id,label,value])=><div className="module-node" key={id}><span aria-hidden="true">↓</span><strong>{label}</strong><output key={String(value)} className="value-pulse">{value}</output></div>)}</div>
    </div>
    <Note>Модули разделяют обязанности, но сами по себе не синхронизируют данные. Кто кому передаёт изменения — проектируем мы. Это одна возможная схема, а не требование связывать каждый модуль с каждым.</Note>
  </section>;
}

export function LibraryLife(){
  const [mode,setMode]=useState('library'),[step,setStep]=useState(0);
  const library=['Решили, какой дом хотим построить.','Выбрали дрель, молоток и уровень под конкретные задачи.','Сами определили порядок работ и соединили всё в готовый дом.'];
  const framework=['Получили готовый каркас дома и порядок работ.','Устанавливаем двери и окна в предусмотренные проёмы.','Добавляем свою отделку, сохраняя общую структуру.'];
  return <div><p className="body-text"><strong>Библиотека</strong> даёт готовые возможности для отдельных задач. <strong>Фреймворк</strong> задаёт основу приложения и порядок работы внутри неё.</p>
    <div className="grid"><section className="surface stack"><h2>Представим, что строим дом</h2><Tabs value={mode} onChange={v=>{setMode(v);setStep(0)}} options={[['library','Библиотека: инструменты'],['framework','Фреймворк: каркас']]}/>
      <div className="construction-scene" aria-hidden="true">{mode==='library'?<><span>Дрель</span><span>Молоток</span><span>Уровень</span></>:<><span>Каркас</span><b>→</b><span>Окна и двери</span><b>→</b><span>Отделка</span></>}</div>
      <h3>{mode==='library'?'Сами выбираем, что и когда использовать':'Работаем внутри заданной структуры'}</h3><p>{mode==='library'?'Берём дрель, когда нужно отверстие, и уровень, когда нужно выровнять стену. Общий план работ составляем сами.':'Каркас задаёт расположение стен и проёмов. Мы выбираем материалы и заполняем предусмотренные части.'}</p></section>
      <Demo label="Пройдём стройку по шагам"><ol className="analogy-stages" aria-live="polite">{(mode==='library'?library:framework).map((text,i)=><li key={text} className={i<=step?'shown':''}>{i<=step?text:'Следующий шаг…'}</li>)}</ol><Button primary onClick={()=>setStep((step+1)%3)}>{step===2?'Сначала':'Следующий шаг'}</Button><Note>{mode==='library'?<><strong>В программе:</strong> мы сами вызываем нужные функции библиотеки в нужный момент.</>:<><strong>В программе:</strong> фреймворк задаёт структуру и вызывает наш код в предусмотренных местах.</>}</Note></Demo></div>
    <p className="hint" style={{marginTop:20}}>В обоих случаях мы отвечаем за то, какой дом получится. В программе — за задачи приложения и его поведение.</p>
  </div>;
}

export function ReactPrinciples(){
  const [principle,setPrinciple]=useState(0),[count,setCount]=useState(0);
  const points=[
    ['Компоненты','Страница складывается из частей: кнопки, карточки товара, корзины. Части можно вкладывать друг в друга.'],
    ['Описание через данные','Мы задаём, что показать при текущих данных. React берёт на себя приведение DOM к этому описанию.'],
    ['Данные от родителя к детям','Общими данными владеет родитель. Дочерние части получают нужные значения от него.']
  ];
  return <div><p className="body-text"><strong>React — библиотека для построения интерфейса.</strong> Для начала достаточно трёх идей.</p>
    <div className="grid"><div className="principle-options">{points.map(([title,description],i)=><button key={title} onClick={()=>setPrinciple(i)} aria-pressed={i===principle}><span className="idx">0{i+1}</span><span><strong>{title}</strong><small>{description}</small></span></button>)}</div>
      <Demo label="Те же идеи на нашей корзине"><div className={'principle-preview principle-'+principle}><div className="state-source"><span className="shop-location">Данные родителя</span><code>count = {count}</code></div><div className="flow-arrow" aria-hidden="true">↓</div><div className="dependency-results"><div className="dependency-result"><span>Счётчик</span><strong>{count} шт.</strong></div><div className="dependency-result"><span>Сумма</span><strong>{money(count*700)}</strong></div></div><div className="controls"><Button primary onClick={()=>setCount(count+1)}>Добавить книгу</Button><Button onClick={()=>setCount(0)}>Сбросить</Button></div></div><p className="hint" style={{marginTop:20}}>{principle===0?'Обводки показывают отдельные части интерфейса.':principle===1?'Измените данные: оба результата обновятся. Команды textContent мы здесь не пишем.':'Стрелка показывает направление передачи данных: от родителя к отображающим частям.'}</p></Demo></div>
  </div>;
}

export function PropsFlow(){
  const [name,setName]=useState('Книга'),[price,setPrice]=useState(700);
  return <div><p className="body-text">Props передаются <strong>от родителя к дочернему компоненту</strong>. Получившая их карточка читает значения.</p><div className="grid"><div className="stack"><Code text={'function App() {\n  return <ProductCard name="'+name+'" price={'+price+'} />;\n}\n\nfunction ProductCard(props) {\n  return (\n    <article>\n      <h2>{props.name}</h2>\n      <p>{props.price} ₽</p>\n    </article>\n  );\n}'} highlight={[2,8,9]}/><Note>Если нужны другие значения, их передаёт родитель. Присваивание props внутри ребёнка нарушает это правило.</Note></div><Demo label="Поток props"><div className="flow-parent"><h2>App — родитель</h2><p className="hint">Выберите данные, которые он передаёт:</p><div className="controls"><Button aria-pressed={name==='Книга'} onClick={()=>{setName('Книга');setPrice(700)}}>Книга · 700 ₽</Button><Button aria-pressed={name==='Альбом'} onClick={()=>{setName('Альбом');setPrice(450)}}>Альбом · 450 ₽</Button></div></div><div className="flow-arrow">↓ <span>props: name, price</span></div><div className="flow-child"><span className="demo-label">ProductCard — потребитель</span><ProductCard name={name} price={price}/></div></Demo></div></div>;
}

export function ComponentMemoryLesson(){
  const [saved,setSaved]=useState(0),[call,setCall]=useState(1),[action,setAction]=useState('initial');
  function remember(){setSaved(saved+1);setCall(call+1);setAction('remember')}
  function repeat(){setCall(call+1);setAction('repeat')}
  const message=action==='initial'?'Начальное значение — 0.':action==='remember'?'Запомнили '+saved+'. Следующий вызов получил это число.':'Вызвали компонент ещё раз. Сохранённое число '+saved+' осталось тем же.';
  return <div>
    <p className="body-text">Компонент — функция. Чтобы новое число не потерялось между её вызовами, его нужно где-то сохранить.</p>
    <div className="grid">
      <section className="stack">
        <h2>Обычная локальная переменная</h2>
        <Code text={'function Counter() {\n  let count = 0;\n\n  return <button>Нажали {count} раз</button>;\n}'} highlight={[2]}/>
        <p className="body-text">Каждый новый вызов выполняет <Inline>let count = 0</Inline> заново. Он снова начинает с нуля.</p>
        <Note><strong>Нужны две вещи:</strong><ol className="small-list memory-needs"><li>Запомнить новое значение для следующего вызова.</li><li>Попросить React запустить обновление.</li></ol></Note>
      </section>
      <Demo label="Представим, что React запоминает число">
        <div className="memory-values" aria-live="polite">
          <div className="memory-value"><span className="shop-location">React хранит для компонента</span><strong>{saved}</strong></div>
          <div className="memory-value"><span className="shop-location">Вызов компонента № {call} получает</span><code>count = {saved}</code></div>
        </div>
        <div className="controls memory-controls"><Button primary onClick={remember}>Запомнить {saved+1} и вызвать снова</Button><Button onClick={repeat}>Вызвать ещё раз</Button></div>
        <p className="hint" role="status" style={{marginTop:18}}>{message}</p>
        <p className="hint">Это учебная модель памяти. Способ записать её в коде — на следующем слайде.</p>
      </Demo>
    </div>
    <Note>Данные, которые React хранит для конкретного компонента между рендерами, называются <strong>состоянием (state)</strong>.</Note>
  </div>;
}
