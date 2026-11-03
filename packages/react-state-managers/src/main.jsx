import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { chapters, slides } from './content.js';
import { Demo } from './Demos.jsx';
import { codeFlows } from './code-flows.js';

const pad = number => String(number).padStart(2, '0');
function readSlide() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return 0; }
  const index = slides.findIndex(slide => slide.id === id);
  return index < 0 ? 0 : index;
}
function highlight(text) {
  return text.split(/(\/\/[^\n]*|'[^']*'|"[^"]*"|\b(?:import|from|export|const|let|return|if|else|function|async|await|new|throw|try|catch|default|true|false)\b|\b\d+(?:_\d+)*\b)/g).map((part, index) => {
    const type = part.startsWith('//') ? 'comment' : /^['"]/.test(part) ? 'string' : /^\d/.test(part) ? 'number' : /^(import|from|export|const|let|return|if|else|function|async|await|new|throw|try|catch|default|true|false)$/.test(part) ? 'keyword' : '';
    return type ? <span className={`token-${type}`} key={index}>{part}</span> : part;
  });
}
function Code({ code, matches = [] }) {
  const [copied, setCopied] = useState(false);
  const [selected, setSelected] = useState(null);
  const [copyError, setCopyError] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    try { await navigator.clipboard.writeText(code.text); setCopied(true); setCopyError(false); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 1500); }
    catch { setCopyError(true); }
  }
  return <div className="code-window"><div className="code-heading"><span>{code.file}</span><button className="copy-code" onClick={copy}>{copied ? 'Скопировано' : 'Копировать'}</button></div><pre tabIndex="0" aria-label={`Код: ${code.file}`}><code>{code.text.split('\n').map((line, index) => <span key={index} className={`code-line ${selected === index || matches.some(match => line.includes(match)) ? 'highlighted' : ''}`} data-line={index + 1} onClick={() => setSelected(selected === index ? null : index)}>{highlight(line)}{'\n'}</span>)}</code></pre>{copyError && <p className="copy-error" role="status">Буфер обмена недоступен. Выделите код и скопируйте вручную.</p>}</div>;
}
function CodeFlow({ flow, current, onChange }) {
  const firstOutcome = flow.steps.findIndex(step => step.alternative);
  const node = (step, index) => <button key={step.label} aria-pressed={index === current} onClick={() => onChange(index)}><span className="step-number">{index + 1}</span><span><strong>{step.label}</strong><code>{step.value}</code></span></button>;
  return <section className="code-flow" aria-label="Схема рядом с кодом"><p className="mini-label">{flow.title}</p><ol>{flow.steps.map((step, index) => step.alternative ? index === firstOutcome && <li className="flow-outcome-group" key="outcomes"><p>Один из двух исходов</p><div className="flow-outcomes" role="group" aria-label="Возможные результаты одного запроса">{flow.steps.map((item, itemIndex) => item.alternative && node(item, itemIndex))}</div></li> : <li key={step.label}>{node(step, index)}</li>)}</ol><p className="code-flow-detail" aria-live="polite">{flow.steps[current].detail}</p><button className="text-button" onClick={() => onChange((current + 1) % flow.steps.length)}>{current === flow.steps.length - 1 ? 'Повторить путь ↻' : flow.steps[current].alternative ? 'Другой исход →' : 'Следующий шаг →'}</button><p className="code-flow-hint">Нажмите на шаг — связанные строки кода подсветятся.</p></section>;
}
function Bullets({ items }) {
  return <ul className="bullet-list">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}
function PropsChain({ items }) {
  return <section className="props-chain" aria-label="Передача корзины через промежуточные компоненты">{items.map((item, index) => <React.Fragment key={item}>{index > 0 && <span className="props-arrow" aria-label="передаём props">↓ props</span>}<div className={index > 0 && index < items.length - 1 ? 'intermediate' : ''}><span>{index === 0 ? 'ХРАНИТ СОСТОЯНИЕ' : index === items.length - 1 ? 'ИСПОЛЬЗУЕТ' : 'ТОЛЬКО ПЕРЕДАЁТ'}</span><strong>{item}</strong></div></React.Fragment>)}</section>;
}
function Flow({ steps }) {
  const [current, setCurrent] = useState(0);
  return <section className="flow-model" aria-label="Пошаговая схема движения данных"><div className="flow-steps">{steps.map(([label, value], index) => <React.Fragment key={label}>{index > 0 && <span className={`flow-arrow ${index <= current ? 'passed' : ''}`} aria-hidden="true">→</span>}<button className={`flow-node ${current === index ? 'selected' : ''} ${index < current ? 'passed' : ''}`} onClick={() => setCurrent(index)} aria-pressed={current === index}><span>{pad(index + 1)} / {label}</span><strong>{value}</strong></button></React.Fragment>)}</div><div className="flow-explanation"><p aria-live="polite"><strong>{steps[current][0]}.</strong> {steps[current][2]}</p><button className="small-button" onClick={() => setCurrent((current + 1) % steps.length)}>{current === steps.length - 1 ? 'Пройти ещё раз ↻' : 'Следующий шаг →'}</button></div></section>;
}
function Cover({ slide, onNext }) {
  return <div className="cover-layout"><div><p className="kicker">Лекция 03 · продолжаем React и API</p><h1 id="slide-title">{slide.title.split('\n').map((line, index) => <span key={line} className={index === 2 ? 'accent' : ''}>{line}</span>)}</h1><p className="slide-lead">{slide.lead}</p><p className="cover-meta">Один магазин · от задачи к работающему решению</p><button className="primary-button" onClick={onNext}>Открыть магазин <span>↗</span></button></div><div className="cover-diagram" aria-label="Адрес, корзина и API соединяются в одном книжном магазине"><div className="diagram-address"><span>01 / REACT ROUTER</span><code>/books/b-101</code></div><div className="diagram-wire">↓</div><div className="diagram-book"><div className="cover-book"><small>БИБЛИОТЕКА</small><strong>Мастер<br />и Маргарита</strong><span>М. Булгаков</span></div><div><small>ЗНАКОМАЯ КАРТОЧКА</small><h3>Мастер и Маргарита</h3><p>690 ₽</p><span className="fake-button">+ В корзину</span></div></div><div className="diagram-branches"><span>↙</span><span>↘</span></div><div className="diagram-bottom"><div><span>02 / REDUX TOOLKIT</span><strong>Корзина</strong><code>{'{ "b-101": 1 }'}</code></div><div><span>03 / RTK QUERY</span><strong>Кеш API</strong><code>GET /api/books</code></div></div></div></div>;
}
function Slide({ slide, onNext }) {
  const extra = slide.chapter === 'extra';
  const flow = codeFlows[slide.id];
  const [flowStep, setFlowStep] = useState(0);
  return <>
    {slide.kind === 'cover' ? <Cover slide={slide} onNext={onNext} /> : <><header className="slide-heading"><p className="kicker">{slide.kind === 'question' ? 'Задача магазина · сначала подумаем' : extra ? 'Дополнение для знакомства' : chapters.find(chapter => chapter.id === slide.chapter).title}</p><h1 id="slide-title">{slide.title}</h1><p className="slide-lead">{slide.lead}</p></header><div className={`slide-body ${slide.code && (slide.bullets || flow) ? 'code-and-notes' : ''} ${slide.propsChain ? 'props-and-notes' : ''}`}>
      {slide.demo && <Demo mode={slide.demo} />}
      {slide.code && <Code code={slide.code} matches={flow?.steps[flowStep].matches} />}
      {slide.propsChain && <PropsChain items={slide.propsChain} />}
      {flow ? <aside className="code-sidebar"><CodeFlow flow={flow} current={flowStep} onChange={setFlowStep} />{slide.bullets && <details className="code-hints"><summary>Пояснения к коду</summary><Bullets items={slide.bullets} /></details>}</aside> : slide.bullets && <Bullets items={slide.bullets} />}
      {slide.cards && <div className={`cards cards-${slide.cards.length}`}>{slide.cards.map(([title, detail, label], index) => <div className="concept-card" key={title}><span className="card-number">{pad(index + 1)}</span><h3>{title}</h3><p>{detail}</p><span className="card-label">{label}</span></div>)}</div>}
      {slide.steps && <Flow steps={slide.steps} />}
      {slide.questions && <div className="questions">{slide.questions.map(([question, answer], index) => <details key={question}><summary><span>{pad(index + 1)}</span>{question}</summary><p>{answer}</p></details>)}</div>}
    </div></>}
    {slide.takeaway && slide.kind !== 'cover' && <p className="takeaway">{slide.takeaway}</p>}
  </>;
}
function App() {
  const [index, setIndex] = useState(readSlide);
  const [fullscreen, setFullscreen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const overview = useRef(null);
  const lastFocus = useRef(null);
  const stage = useRef(null);
  const article = useRef(null);
  const focusNext = useRef(false);
  const slide = slides[index];
  const chapterIndex = chapters.findIndex(chapter => chapter.id === slide.chapter);
  const mainCount = slides.filter(item => item.chapter !== 'extra').length;
  const go = (next, focus = false) => { focusNext.current = focus; setIndex(Math.min(slides.length - 1, Math.max(0, next))); };
  function openOverview() { lastFocus.current = document.activeElement; overview.current.showModal(); overview.current.querySelector('[aria-current="true"]')?.focus(); }
  function closeOverview() { overview.current.close(); lastFocus.current?.focus(); }
  async function toggleFullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { setAnnouncement('Браузер не разрешил полноэкранный режим.'); } }
  useEffect(() => {
    history.replaceState(null, '', `#${slide.id}`);
    document.title = `${slide.title.replaceAll('\n', ' ')} · React / State`;
    stage.current.scrollTop = 0;
    setAnnouncement(`Слайд ${index + 1} из ${slides.length}. ${slide.title}`);
    if (focusNext.current) { article.current.focus({ preventScroll: true }); focusNext.current = false; }
  }, [index, slide]);
  useEffect(() => {
    const onHash = () => setIndex(readSlide());
    const onFullscreen = () => setFullscreen(Boolean(document.fullscreenElement));
    const onKey = event => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || overview.current.open) return;
      if (event.target.closest('input,textarea,select,button,a,summary,pre,[contenteditable="true"],.demo-slot')) return;
      const actions = { ArrowRight: () => go(index + 1), ArrowLeft: () => go(index - 1), PageDown: () => go(index + 1), PageUp: () => go(index - 1), Home: () => go(0), End: () => go(slides.length - 1), o: openOverview, 'щ': openOverview, f: toggleFullscreen, 'а': toggleFullscreen };
      const action = actions[event.key] || actions[event.key.toLowerCase()];
      if (action) { event.preventDefault(); action(); }
    };
    window.addEventListener('hashchange', onHash);
    document.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => { window.removeEventListener('hashchange', onHash); document.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFullscreen); };
  }, [index]);
  return <><a className="skip-link" href="#main-slide" onClick={event => { event.preventDefault(); article.current.focus(); }}>Перейти к слайду</a><div className="lecture-shell"><header className="topbar"><a className="brand" href="#cover" onClick={event => { event.preventDefault(); go(0); }}><span>↗</span> REACT / STATE</a><div className="toolbar"><button onClick={openOverview} aria-label="Открыть оглавление">☰ <span>Оглавление</span></button><button onClick={toggleFullscreen} hidden={!document.documentElement.requestFullscreen} aria-label={fullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'} aria-pressed={fullscreen}>⛶</button></div></header><main className="stage" ref={stage}><article className={`slide ${slide.kind === 'cover' ? 'cover' : slide.kind === 'question' ? 'question-slide' : ''} ${slide.demo ? 'has-demo' : ''}`} tabIndex="-1" ref={article} aria-labelledby="slide-title" id="main-slide"><Slide key={slide.id} slide={slide} onNext={() => go(index + 1)} /></article></main><footer className="bottom-bar"><div className="chapter-label"><span>{pad(chapterIndex + 1)}</span>{chapters[chapterIndex].title}</div><div className="slide-meter"><b>{pad(index + 1)}</b><span>/ {pad(slides.length)}</span><small>← → для навигации</small></div><nav aria-label="Навигация презентации"><button onClick={() => go(index - 1, true)} disabled={index === 0} aria-label="Предыдущий слайд">←</button><button className="next-button" onClick={() => go(index + 1, true)} disabled={index === slides.length - 1} aria-label="Следующий слайд">→</button></nav></footer><div className="progress-track" role="progressbar" aria-label="Прогресс лекции" aria-valuemin="1" aria-valuemax={slides.length} aria-valuenow={index + 1}><div style={{ width: `${(index + 1) / slides.length * 100}%` }} /></div></div><div className="visually-hidden" aria-live="polite">{announcement}</div><dialog ref={overview} className="overview-dialog" onCancel={event => { event.preventDefault(); closeOverview(); }} onClick={event => { if (event.target === overview.current) { const rect = overview.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeOverview(); } }}><div className="overview-header"><div><p className="kicker">МАРШРУТ ЛЕКЦИИ</p><h2>От карточки к приложению</h2><p>{mainCount} основных слайдов + {slides.length - mainCount} дополнительных · темп свободный</p></div><button onClick={closeOverview} aria-label="Закрыть оглавление">×</button></div>{chapters.map((chapter, chapterNumber) => <section className="chapter-group" key={chapter.id}><h3>{pad(chapterNumber + 1)} / {chapter.title}</h3><div>{slides.map((item, slideNumber) => item.chapter === chapter.id && <button aria-current={index === slideNumber ? 'true' : undefined} key={item.id} onClick={() => { overview.current.close(); go(slideNumber, true); }}><span>{pad(slideNumber + 1)}</span>{item.title.replaceAll('\n', ' ')}</button>)}</div></section>)}</dialog></>;
}
createRoot(document.getElementById('app')).render(<App />);
