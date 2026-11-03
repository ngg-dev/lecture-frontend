import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { chapters, slides, totalMinutes } from './content.js';
import { Demo } from './Demos.jsx';
import { BlueprintDrawing } from './BlueprintDrawing.jsx';
import slideDiagnostics from '../.generated/slide-diagnostics.json';
import emittedExamples from '../.generated/emitted-examples.json';

const pad = number => String(number).padStart(2, '0');
function readSlide() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return 0; }
  const index = slides.findIndex(slide => slide.id === id);
  return index < 0 ? 0 : index;
}
function highlight(text) {
  return text.split(/(\/\/[^\n]*|'[^']*'|"[^"]*"|\b(?:import|from|export|const|let|return|if|else|function|async|await|new|throw|try|catch|default|true|false|type|interface|extends|keyof|readonly|unknown|never|as|is|void|number|string|boolean|typeof|instanceof|null|undefined)\b|\b\d+(?:_\d+)*\b)/g).map((part, index) => {
    const type = part.startsWith('//') ? 'comment' : /^['"]/.test(part) ? 'string' : /^\d/.test(part) ? 'number' : /^(string|number|boolean|unknown|never|void|undefined|null)$/.test(part) ? 'type' : /^(import|from|export|const|let|return|if|else|function|async|await|new|throw|try|catch|default|true|false|type|interface|extends|keyof|readonly|unknown|never|as|is|void|number|string|boolean|typeof|instanceof|null|undefined)$/.test(part) ? 'keyword' : '';
    return type ? <span className={`token-${type}`} key={index}>{part}</span> : part;
  });
}
function markErrors(line, lineNumber, problems) {
  const problem = problems.find(item => item.line === lineNumber);
  if (!problem) return highlight(line);
  const start = Math.max(0, (problem.character || 1) - 1);
  const end = Math.min(line.length, start + problem.length);
  return <>{highlight(line.slice(0, start))}<span className="code-squiggle" title={problem.message}>{highlight(line.slice(start, end))}</span>{highlight(line.slice(end))}</>;
}
function Code({ code, matches = [], state }) {
  const text = code.emittedFrom ? emittedExamples[code.emittedFrom] : code.text;
  const observedResult = code.runtimeDiagnostic?.kind === 'result' ? code.runtimeDiagnostic : null;
  const problems = observedResult ? [] : code.runtimeDiagnostic ? [code.runtimeDiagnostic] : slideDiagnostics[code.snippet] || [];
  const [selected, setSelected] = useState(null);
  const labels = {
    success: 'ОШИБОК TS НЕТ',
    comparison: 'ПРОВЕРКА ТИПОВ',
    'javascript-success': 'РЕЗУЛЬТАТ: 790',
    'javascript-result': 'РЕЗУЛЬТАТ ВЫПОЛНЕНИЯ',
    'runtime-error': 'ОШИБКА ПРИ ЗАПУСКЕ',
    error: 'ОШИБКА TS'
  };
  return <div className="code-window">
    <div className="code-heading">
      <span>{code.file}</span>
      {state && <span className={`code-case-label ${state}`}>{labels[state]}</span>}
    </div>
    <pre tabIndex="0" aria-label={`Код: ${code.file}`}><code>{text.split('\n').map((line, index) => <span
      key={index}
      className={`code-line ${selected === index || matches.some(match => line.includes(match)) ? 'highlighted' : ''} ${problems.some(item => item.line === index + 1) ? 'code-line-error' : ''}`}
      data-line={index + 1}
      onClick={() => setSelected(selected === index ? null : index)}
    >{markErrors(line, index + 1, problems)}{'\n'}</span>)}</code></pre>
    {observedResult && <div className="code-runtime-result" aria-label="Результат JavaScript">
      <p className="mini-label">РЕЗУЛЬТАТ ВЫПОЛНЕНИЯ</p><p>{observedResult.message}</p>
    </div>}
    {problems.length > 0 && <div className="code-diagnostics" aria-label={code.runtimeDiagnostic ? 'Ошибка JavaScript при запуске' : 'Диагностика TypeScript'}>
      {problems.map((problem, index) => <p key={index}>
        <b>{typeof problem.code === 'number' ? `TS${problem.code}` : problem.code} · строка {problem.line}</b>
        <span>{problem.message}</span>
      </p>)}
    </div>}
  </div>;
}
function Bullets({ items }) {
  return <ul className="bullet-list">{items.map(item => <li key={item}>{item}</li>)}</ul>;
}
function Flow({ steps, current }) {
  return <section className="flow-model" aria-label="Пошаговая схема движения данных"><div className="flow-steps">{steps.map(([label, value], index) => <React.Fragment key={label}>{index > 0 && <span className={`flow-arrow ${index <= current ? 'passed' : ''}`} aria-hidden="true">→</span>}<div aria-current={current === index ? 'step' : undefined} className={`flow-node ${current === index ? 'selected' : ''} ${index < current ? 'passed' : ''}`}><span>{pad(index + 1)} / {label}</span><svg className="flow-symbol" viewBox="0 0 48 48" aria-hidden="true">{index === 1 ? <><circle cx="24" cy="24" r="17" /><path d="m14 24 7 7 14-16" /></> : index === 3 ? <><rect x="5" y="8" width="38" height="29" /><path d="M5 15h38M17 42h14M24 37v5M13 22l5 4-5 4M24 30h10" /></> : <><path d="M11 4h18l9 10v30H11ZM29 4v10h9M17 23h15M17 30h15M17 37h8" /></>}</svg><strong>{value}</strong></div></React.Fragment>)}</div><div className="flow-explanation"><p><strong>{steps[current][0]}.</strong> {steps[current][2]}</p></div></section>;
}
function Cover({ slide, onNext }) {
  return <div className="cover-layout">
    <div className="cover-copy">
      <p className="kicker"><span className="drawing-code">TS-04</span> Лекция 04 · контракты данных</p>
      <h1 id="slide-title"><span>Обозреваем</span><span>TypeScript</span></h1>
      <p className="slide-lead">{slide.lead}</p>
      <p className="cover-meta">Слайдов: {slides.length} / {totalMinutes} минут</p>
      <button className="primary-button" onClick={onNext}>Начать с задачи <span>→</span></button>
    </div>
    <BlueprintDrawing />
  </div>;
}
function Slide({ slide, onNext }) {
  return <>
    {slide.kind === 'cover' ? <Cover slide={slide} onNext={onNext} /> : <><header className="slide-heading"><p className="kicker"><span className="drawing-code">TS-04</span>{chapters.find(chapter => chapter.id === slide.chapter).title}</p><h1 id="slide-title">{slide.title}</h1><p className="slide-lead">{slide.lead}</p></header><div className={`slide-body ${slide.code && slide.bullets ? 'code-and-notes' : ''}`}>
      {slide.demo && <Demo mode={slide.demo} stateCase={slide.stateCase} />}
      {slide.code && <Code code={slide.code} state={slide.exampleState} />}
      {slide.codeColumns && <div className="code-columns">{slide.codeColumns.map(column => <Code key={column.file} code={column} state={column.state} />)}</div>}
      {slide.bullets && <Bullets items={slide.bullets} />}
      {slide.cards && <div className={`cards cards-${slide.cards.length}`}>{slide.cards.map(([title, detail, label], index) => <div className="concept-card" key={title}><span className="card-number">{pad(index + 1)}</span><h3>{title}</h3><p>{detail}</p><span className="card-label">{label}</span></div>)}</div>}
      {slide.steps && <Flow steps={slide.steps} current={slide.activeStep} />}
      {slide.table && <div className="table-wrap"><table><thead><tr>{slide.table.headers.map(cell => <th key={cell}>{cell}</th>)}</tr></thead><tbody>{slide.table.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={i}>{cell}</td>)}</tr>)}</tbody></table></div>}
      {slide.questionList && <div className="questions">{slide.questionList.map((question, index) => <p className="question-prompt" key={question}><span>{pad(index + 1)}</span>{question}</p>)}</div>}
      {slide.answer && <div className="question-answer"><p className="mini-label">ОТВЕТ</p><p>{slide.answer}</p></div>}
    </div></>}
    {slide.takeaway && <p className="takeaway">{slide.takeaway}</p>}
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
  const go = (next, focus = false) => { focusNext.current = focus; setIndex(Math.min(slides.length - 1, Math.max(0, next))); };
  function openOverview() { lastFocus.current = document.activeElement; overview.current.showModal(); overview.current.querySelector('[aria-current="true"]')?.focus(); }
  function closeOverview() { overview.current.close(); lastFocus.current?.focus(); }
  async function toggleFullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { setAnnouncement('Браузер не разрешил полноэкранный режим.'); } }
  useEffect(() => {
    history.replaceState(null, '', `#${slide.id}`);
    document.title = `${slide.title.replaceAll('\n', ' ')} · Обозреваем TS`;
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
  return <><a className="skip-link" href="#main-slide" onClick={event => { event.preventDefault(); article.current.focus(); }}>Перейти к слайду</a><div className="lecture-shell"><header className="topbar"><a className="brand" href="#cover" onClick={event => { event.preventDefault(); go(0); }}><span className="brand-mark">TS</span> FRONTEND / TYPESCRIPT</a><div className="toolbar"><button onClick={openOverview} aria-label="Открыть оглавление">☰ <span>Оглавление</span></button><button onClick={toggleFullscreen} hidden={!document.documentElement.requestFullscreen} aria-label={fullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'} aria-pressed={fullscreen}>⛶</button></div></header><main className="stage" ref={stage}><article className={`slide ${slide.kind === 'cover' ? 'cover' : slide.kind === 'question' ? 'question-slide' : ''} ${slide.demo ? 'has-demo' : ''}`} tabIndex="-1" ref={article} aria-labelledby="slide-title" id="main-slide"><Slide key={slide.id} slide={slide} onNext={() => go(index + 1)} /></article></main><footer className="bottom-bar"><div className="chapter-label"><span>{pad(chapterIndex + 1)}</span>{chapters[chapterIndex].title}</div><div className="slide-meter"><b>{pad(index + 1)}</b><span>/ {pad(slides.length)}</span><small>← → для навигации</small></div><nav aria-label="Навигация презентации"><button onClick={() => go(index - 1, true)} disabled={index === 0} aria-label="Предыдущий слайд">←</button><button className="next-button" onClick={() => go(index + 1, true)} disabled={index === slides.length - 1} aria-label="Следующий слайд">→</button></nav></footer><div className="progress-track" role="progressbar" aria-label="Прогресс лекции" aria-valuemin="1" aria-valuemax={slides.length} aria-valuenow={index + 1}><div style={{ width: `${(index + 1) / slides.length * 100}%` }} /></div></div><div className="visually-hidden" aria-live="polite">{announcement}</div><dialog ref={overview} className="overview-dialog" onCancel={event => { event.preventDefault(); closeOverview(); }} onClick={event => { if (event.target === overview.current) { const rect = overview.current.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeOverview(); } }}><div className="overview-header"><div><p className="kicker">МАРШРУТ ЛЕКЦИИ</p><h2>Обозреваем TypeScript</h2><p>Слайдов: {slides.length} · {totalMinutes} минут · темп свободный</p></div><button onClick={closeOverview} aria-label="Закрыть оглавление">×</button></div>{chapters.map((chapter, chapterNumber) => <section className="chapter-group" key={chapter.id}><h3>{pad(chapterNumber + 1)} / {chapter.title}</h3><div>{slides.map((item, slideNumber) => item.chapter === chapter.id && <button aria-current={index === slideNumber ? 'true' : undefined} key={item.id} onClick={() => { overview.current.close(); go(slideNumber, true); }}><span>{pad(slideNumber + 1)}</span>{item.title.replaceAll('\n', ' ')}</button>)}</div></section>)}</dialog></>;
}
createRoot(document.getElementById('app')).render(<App />);
