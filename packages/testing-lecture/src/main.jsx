import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { chapters, slides, totalMinutes } from './content.js';
import { parsePrice } from './shop/model';
import { PriceEditor } from './shop/PriceEditor';
import './styles.css';

const pad = value => String(value).padStart(2, '0');
function readSlide() {
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return 0; }
  const index = slides.findIndex(slide => slide.id === id);
  return index < 0 ? 0 : index;
}
function highlight(line) {
  return line.split(/(\/\/.*$|'[^']*'|"[^"]*"|\b(?:import|export|from|const|let|return|function|async|await|if|else|test|expect|number|string|null|undefined|true|false)\b|\b\d+\b)/g).map((part, i) => {
    const type = part.startsWith('//') ? 'comment' : /^['"]/.test(part) ? 'string' : /^\d/.test(part) ? 'number' : /^(import|export|from|const|let|return|function|async|await|if|else|test|expect|number|string|null|undefined|true|false)$/.test(part) ? 'keyword' : '';
    return type ? <span className={`token-${type}`} key={i}>{part}</span> : part;
  });
}
function Code({ text, file }) {
  return <figure className="code-window"><figcaption>{file || 'Пример · ключевой фрагмент'}</figcaption><pre tabIndex="0"><code>{text.split('\n').map((line, i) => <span className="code-line" data-line={i + 1} key={i}>{highlight(line) || ' '}</span>)}</code></pre></figure>;
}
function UnitLab() {
  const [version, setVersion] = useState('buggy');
  const [draft, setDraft] = useState('');
  const [rows, setRows] = useState(null);
  const fn = version === 'fixed' ? parsePrice : value => Number(value);
  function run() {
    setRows([['790', 790], ['', null], ['   ', null], ['-1', null], ['0', 0]].map(([input, expected]) => {
      const actual = fn(input);
      return { input, expected, actual, passed: Object.is(actual, expected) };
    }));
  }
  return <section className="demo-slot" aria-label="Живые проверки цены">
    <div className="lab-tools"><label>Реализация<select aria-label="Реализация" value={version} onChange={e => { setVersion(e.target.value); setRows(null); }}><option value="buggy">Ошибка: Number(draft)</option><option value="fixed">Исправлено: parsePrice</option></select></label><button onClick={run}>Запустить проверки</button></div>
    <div role="status" aria-live="polite">{!rows ? 'Проверки ещё не запускались.' : <><strong className={rows.every(row => row.passed) ? 'pass' : 'fail'}>{rows.every(row => row.passed) ? 'Все проверки пройдены' : 'FAIL: правило нарушено'}</strong><ul className="results">{rows.map(row => <li key={row.input} className={row.passed ? 'pass' : 'fail'}>{row.passed ? 'PASS' : 'FAIL'} · {JSON.stringify(row.input)} → {String(row.actual)}; ожидаем {String(row.expected)}</li>)}</ul></>}</div>
    <label>Проверить свою цену<input aria-label="Проверить свою цену" value={draft} onChange={e => setDraft(e.target.value)} /></label><p>Результат: <code>{String(fn(draft))}</code></p>
    <small>Учебная мини-проверка в браузере. Jest запускается отдельно через npm test.</small>
  </section>;
}
function ComponentLab() {
  const [price, setPrice] = useState(690);
  const [fail, setFail] = useState(false);
  return <section className="demo-slot" aria-label="Редактор цены"><div className="lab-tools"><p className="demo-price">Цена книги: {price} ₽</p><label className="checkbox"><input type="checkbox" checked={fail} onChange={e => setFail(e.target.checked)} /> Следующее сохранение завершится отказом</label></div><PriceEditor price={price} onSave={async value => {
    if (fail) { setFail(false); throw new Error('Контролируемый отказ'); }
    setPrice(value);
  }} /><small>Реальный React-компонент. Зависимость onSave локальная; настоящего API на этом слайде нет.</small></section>;
}
function App() {
  const [index, setIndex] = useState(readSlide);
  const [showNotes, setShowNotes] = useState(false);
  const dialog = useRef(null);
  const stage = useRef(null);
  const article = useRef(null);
  const lastFocus = useRef(null);
  const slide = slides[index];
  const chapter = chapters.find(item => item.id === slide.chapter);
  const go = next => setIndex(Math.max(0, Math.min(slides.length - 1, next)));
  function openOverview() { lastFocus.current = document.activeElement; dialog.current.showModal(); dialog.current.querySelector('[aria-current="true"]')?.focus(); }
  function closeOverview() { dialog.current.close(); lastFocus.current?.focus(); }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { /* Недоступный fullscreen не мешает навигации. */ }
  }
  useEffect(() => {
    history.replaceState(null, '', `#${slide.id}`);
    document.title = `${slide.title} · Тестирование фронтенда`;
    stage.current.scrollTop = 0;
  }, [slide]);
  useEffect(() => {
    const hash = () => {
      const next = readSlide();
      if (next === index) history.replaceState(null, '', `#${slides[next].id}`);
      else setIndex(next);
    };
    const key = event => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || dialog.current.open) return;
      if (event.target instanceof Element && event.target.closest('input,textarea,select,button,a,summary,pre,[contenteditable],.demo-slot')) return;
      const actions = { ArrowRight: () => go(index + 1), ArrowLeft: () => go(index - 1), PageDown: () => go(index + 1), PageUp: () => go(index - 1), ' ': () => go(index + (event.shiftKey ? -1 : 1)), Home: () => go(0), End: () => go(slides.length - 1), o: openOverview, 'щ': openOverview, f: fullscreen, n: () => setShowNotes(value => !value) };
      const action = actions[event.key] || actions[event.key.toLowerCase()];
      if (action) { event.preventDefault(); action(); }
    };
    window.addEventListener('hashchange', hash);
    document.addEventListener('keydown', key);
    return () => { window.removeEventListener('hashchange', hash); document.removeEventListener('keydown', key); };
  }, [index]);
  return <><a className="skip-link" href="#main-slide" onClick={e => { e.preventDefault(); article.current.focus(); }}>Перейти к слайду</a><div className="lecture-shell">
    <header className="topbar"><a className="brand" href="#cover" onClick={e => { e.preventDefault(); go(0); }}><span className="brand-mark">✓</span><span>FRONTEND / TESTING</span></a><div className="toolbar"><button onClick={openOverview} aria-label="Открыть оглавление">☰ <span>Оглавление</span></button><button onClick={() => setShowNotes(value => !value)} aria-label="Заметки преподавателя" aria-pressed={showNotes}>N</button><button onClick={fullscreen} aria-label="Полноэкранный режим" hidden={!document.documentElement.requestFullscreen}>⛶</button></div></header>
    <main className="stage" ref={stage}><article className={`slide ${slide.kind === 'cover' ? 'cover' : ''}`} data-slide-id={slide.id} tabIndex="-1" id="main-slide" ref={article} aria-labelledby="slide-title">
      <p className="kicker">{chapter.title} <span>{slide.kind === 'cover' ? `${slides.length} слайдов / ${totalMinutes} минут + практика` : `${slide.minutes} мин`}</span></p><h1 id="slide-title">{slide.title}</h1><p className="slide-lead">{slide.lead}</p>
      <div className="slide-body" key={slide.id}>
        {slide.cards && <div className="cards">{slide.cards.map(([title, text], i) => <section className="concept-card" key={title}><span className="card-number">{pad(i + 1)}</span><h2>{title}</h2><p>{text}</p></section>)}</div>}
        <div className={slide.code && slide.bullets ? 'code-and-notes' : ''}>{slide.code && <Code text={slide.code} file={slide.file} />}{slide.bullets && <ul className="bullet-list">{slide.bullets.map(item => <li key={item}>{item}</li>)}</ul>}</div>
        {slide.demo === 'unit' && <UnitLab />}{slide.demo === 'component' && <ComponentLab />}
        {slide.link && <a className="primary-button" href={slide.link.href} target="_blank" rel="noreferrer">{slide.link.text} ↗</a>}
        {slide.links && <ul className="resource-list">{slide.links.map(([text, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer">{text} ↗</a></li>)}</ul>}
      </div><p className="takeaway">{slide.takeaway}</p>{showNotes && <aside className="speaker-notes"><b>Преподавателю</b><p>{slide.notes}</p></aside>}
    </article></main>
    <footer className="bottom-bar"><span className="chapter-label">{chapter.title}</span><div className="slide-meter"><b>{pad(index + 1)}</b> / {pad(slides.length)} <small>← → · пробел</small></div><nav aria-label="Навигация презентации"><button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Предыдущий слайд">←</button><button onClick={() => go(index + 1)} disabled={index === slides.length - 1} aria-label="Следующий слайд">→</button></nav></footer><div className="progress-track" role="progressbar" aria-label="Прогресс лекции" aria-valuemin="1" aria-valuemax={slides.length} aria-valuenow={index + 1}><div style={{ width: `${(index + 1) / slides.length * 100}%` }} /></div>
    </div><div className="visually-hidden" aria-live="polite">Слайд {index + 1} из {slides.length}: {slide.title}</div>
    <dialog className="overview-dialog" ref={dialog} onCancel={e => { e.preventDefault(); closeOverview(); }}><header><h2>Маршрут лекции</h2><button onClick={closeOverview} aria-label="Закрыть оглавление">✕</button></header>{chapters.map(item => <section key={item.id}><h3>{item.title}</h3>{slides.map((target, i) => target.chapter === item.id && <button key={target.id} data-slide-id={target.id} aria-current={index === i ? 'true' : undefined} onClick={() => { go(i); closeOverview(); }}>{pad(i + 1)} · {target.title}</button>)}</section>)}</dialog></>;
}
createRoot(document.getElementById('app')).render(<App />);
