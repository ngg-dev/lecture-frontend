import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { mountSlide } from './slide-renderer.js';
const lecture = window.LECTURE || {slides: []};
const slides = lecture.slides || [];
const chapters = lecture.chapters || [];
const groups = chapters.length ? chapters : [{id: null, title: lecture.title || 'Лекция'}];
const pad = n => String(n).padStart(2, '0');
function indexFromHash() { try { const id = decodeURIComponent(location.hash.slice(1)); const index = slides.findIndex((s, i) => (s.id || `slide-${i + 1}`) === id); return index < 0 ? 0 : index; } catch { return 0; } }
export default function App() {
  const [current, setCurrent] = useState(indexFromHash);
  const [announcement, setAnnouncement] = useState('');
  const [fullscreen, setFullscreen] = useState(false);
  const stage = useRef(null), article = useRef(null), overview = useRef(null), lastOverviewFocus = useRef(null), pendingFocus = useRef(false);
  const active = slides[current];
  const chapterIndex = chapters.findIndex(chapter => chapter.id === active?.chapter);
  const fullscreenSupported = Boolean(document.documentElement.requestFullscreen);
  function goTo(index, focus = false) { const next = Math.max(0, Math.min(index, slides.length - 1)); if (focus && next === current) article.current?.focus({preventScroll: true}); else pendingFocus.current = focus; setCurrent(next); }
  function openOverview() { const dialog = overview.current; if (dialog.open) return; lastOverviewFocus.current = document.activeElement; dialog.showModal(); const button = dialog.querySelector('[aria-current="true"]'); button?.focus({preventScroll: true}); button?.scrollIntoView({block: 'nearest'}); }
  function closeOverview(restore = true) { overview.current.close(); if (restore && lastOverviewFocus.current?.isConnected) lastOverviewFocus.current.focus({preventScroll: true}); }
  function backdropClick(event) { const dialog = overview.current; if (event.target !== dialog) return; const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeOverview(); }
  async function toggleFullscreen() { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { setAnnouncement('Браузер не разрешил полноэкранный режим.'); } }
  useLayoutEffect(() => {
    if (!active) { article.current.textContent = 'Не удалось загрузить лекцию. Проверьте content.js.'; return; }
    const cleanup = mountSlide(article.current, {slide: active, lecture, stage: stage.current, onNext: () => goTo(current + 1, true)});
    history.replaceState(null, '', `#${encodeURIComponent(active.id || `slide-${current + 1}`)}`);
    setAnnouncement(`Слайд ${current + 1} из ${slides.length}. ${active.title}`);
    if (pendingFocus.current) { article.current.focus({preventScroll: true}); pendingFocus.current = false; }
    return cleanup;
  }, [current]);
  useEffect(() => { document.title = `${lecture.title || 'React и API'} — интерактивная лекция`; }, []);
  useEffect(() => {
    const hashchange = () => setCurrent(indexFromHash());
    const fullchange = () => setFullscreen(Boolean(document.fullscreenElement));
    const keydown = event => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || overview.current?.open) return;
      const target = event.target;
      if (target.closest('input, textarea, select, pre, code, [contenteditable="true"], [role="slider"], [role="tablist"]')) return;
      if (target.closest('.demo-slot') && target.closest('button, a, [tabindex]')) return;
      const actions = {ArrowLeft: () => goTo(current - 1), ArrowRight: () => goTo(current + 1), PageUp: () => goTo(current - 1), PageDown: () => goTo(current + 1), Home: () => goTo(0), End: () => goTo(slides.length - 1), o: openOverview, 'щ': openOverview, f: toggleFullscreen, 'а': toggleFullscreen};
      const action = actions[event.key] || actions[event.key.toLowerCase()]; if (action) { event.preventDefault(); action(); }
    };
    window.addEventListener('hashchange', hashchange); document.addEventListener('fullscreenchange', fullchange); document.addEventListener('keydown', keydown);
    return () => { window.removeEventListener('hashchange', hashchange); document.removeEventListener('fullscreenchange', fullchange); document.removeEventListener('keydown', keydown); };
  }, [current]);
  return <>
    <a className="skip-link" href="#slide">Перейти к слайду</a>
    <div className="lecture-app">
      <header className="topbar">
        <a className="brand" href="#" onClick={(event) => { event.preventDefault(); goTo(0, true); }} aria-label="React и API: первый слайд"><span className="brand-symbol" aria-hidden="true">↗</span><span>REACT / API</span></a>
        <nav className="toolbar" aria-label="Инструменты лекции">
          <button type="button" className="tool-button" id="overview-open" onClick={openOverview} aria-label="Открыть оглавление" title="Оглавление (O)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h12M8 12h12M8 18h12M3 6h1M3 12h1M3 18h1" /></svg><span>Оглавление</span></button>
          <button type="button" className="tool-button icon-button" id="fullscreen-toggle" onClick={toggleFullscreen} hidden={!fullscreenSupported} aria-label={fullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"} aria-pressed={fullscreen} title="Полноэкранный режим (F)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5" /></svg></button>
        </nav>
      </header>
      <main className="stage" id="stage" ref={stage}>
        <article className="slide" id="slide" ref={article} tabIndex="-1" aria-labelledby="slide-title"></article>
      </main>
      <footer className="bottom-bar">
        <div className="slide-location"><span className="section-index" id="section-index">{pad(Math.max(0, chapterIndex) + 1)}</span><span id="chapter-label">{chapters[chapterIndex]?.title || active?.kicker || "React и API"}</span></div>
        <div className="slide-meter"><span className="current-number" id="slide-number">{pad(current + 1)}</span><span className="meter-slash">/</span><span id="slide-total">{pad(slides.length)}</span><span className="keyboard-hint">← → для навигации</span></div>
        <nav className="slide-navigation" aria-label="Навигация по слайдам">
          <button type="button" id="previous" onClick={() => goTo(current - 1)} disabled={current === 0 || !slides.length} className="arrow-button" aria-label="Предыдущий слайд" title="Предыдущий слайд (←)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7M7 12h14" /></svg></button>
          <button type="button" id="next" onClick={() => goTo(current + 1)} disabled={current === slides.length - 1 || !slides.length} className="arrow-button arrow-next" aria-label="Следующий слайд" title="Следующий слайд (→)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7M3 12h14" /></svg></button>
        </nav>
      </footer>
      <div className="progress-track" role="progressbar" aria-label="Прогресс лекции" aria-valuemin="1" aria-valuemax={slides.length} aria-valuenow={current + 1} aria-valuetext={`Слайд ${current + 1} из ${slides.length}: ${active?.title || ""}`} id="lecture-progress"><div id="progress-fill" style={{width: `${slides.length ? (current + 1) / slides.length * 100 : 0}%`}}></div></div>
    </div>
    <div id="announcement" className="visually-hidden" aria-live="polite" aria-atomic="true">{announcement}</div>
    <dialog className="overview-dialog" id="overview" ref={overview} onCancel={(event) => { event.preventDefault(); closeOverview(); }} onClick={backdropClick} aria-labelledby="overview-title">
      <div className="panel-header"><div><span className="eyebrow">Маршрут лекции</span><h2 id="overview-title">От запроса к интерфейсу</h2></div><button type="button" className="close-button" id="overview-close" onClick={() => closeOverview()} aria-label="Закрыть оглавление">×</button></div>
      <div className="overview-meta" id="overview-meta">{lecture.duration || 70} минут · {chapters.length} разделов · слайдов: {slides.length}</div>
      <nav id="chapter-list" aria-label="Разделы и слайды лекции">
        {groups.map((chapter, chapterNumber) => <section className="chapter-group" key={chapter.id || chapterNumber}>
          <div className="chapter-heading"><h3>{pad(chapterNumber + 1)}  {chapter.title}</h3>{chapter.minutes && <span>{chapter.minutes} мин</span>}</div>
          <div className="chapter-slides">{slides.map((slide, index) => (chapter.id === null || slide.chapter === chapter.id) && <button key={slide.id || index} type="button" data-slide-index={index} aria-current={index === current ? 'true' : undefined} onClick={() => { closeOverview(false); goTo(index, true); article.current.focus({preventScroll: true}); }}><span>{pad(index + 1)}</span>{slide.title}</button>)}</div>
        </section>)}
      </nav>
      <div className="overview-shortcuts"><span><kbd>←</kbd><kbd>→</kbd> слайды</span><span><kbd>F</kbd> полный экран</span><span><kbd>Esc</kbd> закрыть</span></div>
    </dialog>
  </>;
}
