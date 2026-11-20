import { lectureTitle, slides, sources } from './content.js';
import { escape, renderDiagram, renderPatterns, renderRecord } from './diagrams.js';
import { mountShop } from './shop.jsx';

const example = document.querySelector('#example-shop');
if (example) {
  mountShop(example, { showApi: true });
} else {
  initLecture();
}

function sourceLinks(keys = []) {
  return keys.map(key => {
    const [label, url] = sources[key];
    return `<a href="${escape(url)}" target="_blank" rel="noreferrer">${escape(label)}</a>`;
  }).join('');
}

function renderTitle(slide) {
  const title = escape(slide.title);
  if (slide.kind !== 'technology') return title;
  return title.replace(/Node\.js|NestJS|MongoDB/g, name => {
    const accent = name === 'NestJS' ? 'coral' : 'lime';
    return `<span class="technology-name technology-name--${accent}">${name}</span>`;
  });
}

function renderSlide(slide) {
  if (slide.kind === 'shop') {
    return `<h2 id="shop-title" class="visually-hidden">${escape(slide.title)}</h2><div id="shop-root"></div>`;
  }
  return `<div class="eyebrow"><span></span>${escape(slide.chapter.toUpperCase())}</div>
    <h2 id="${slide.id}-title">${renderTitle(slide)}</h2>
    ${slide.lead ? `<p class="section-lead">${escape(slide.lead)}</p>` : ''}
    ${slide.diagram ? renderDiagram(slide.diagram) : ''}
    ${slide.record ? renderRecord(slide.record) : ''}
    ${slide.patterns ? renderPatterns(slide.patterns) : ''}
    ${slide.cards ? `<div class="lesson-cards">${slide.cards.map(([title, body]) => `<article><h3>${escape(title)}</h3><p>${escape(body)}</p></article>`).join('')}</div>` : ''}
    ${slide.table ? `<div class="table-wrap"><table><thead><tr>${slide.table[0].map(cell => `<th scope="col">${escape(cell)}</th>`).join('')}</tr></thead><tbody>${slide.table.slice(1).map(row => `<tr>${row.map(cell => `<td>${escape(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
    ${slide.takeaway ? `<div class="takeaway">${escape(slide.takeaway)}</div>` : ''}
    ${slide.aside ? `<p class="lesson-aside">${escape(slide.aside)}</p>` : ''}
    ${slide.showSources ? `<div class="slide-links">${sourceLinks(slide.sources)}</div>` : ''}
    ${slide.handout ? '<div class="slide-links"><a href="demo.html">Открыть отдельный пример</a></div>' : ''}`;
}

function initLecture() {
  const main = document.querySelector('main');
  for (const slide of slides.slice(1)) {
    const section = document.createElement('section');
    const variant = slide.kind ? ` ${slide.kind}-slide` : '';
    section.className = `slide content-slide${variant}`;
    section.id = slide.id;
    section.hidden = true;
    section.setAttribute('aria-labelledby', `${slide.id}-title`);
    section.innerHTML = renderSlide(slide);
    for (const button of section.querySelectorAll('[data-diagram-step]')) {
      button.addEventListener('click', () => {
        section.querySelectorAll('[data-diagram-step]').forEach(step => {
          step.setAttribute('aria-pressed', String(step === button));
        });
        section.querySelector('.diagram-detail').textContent = slide.diagram.nodes[Number(button.dataset.diagramStep)][2];
      });
    }
    main.append(section);
  }
  mountShop(document.querySelector('#shop-root'));

  const sections = [...main.querySelectorAll('.slide')];
  const outline = document.querySelector('#outline');
  const contents = document.querySelector('#contents');
  const notes = document.querySelector('#speaker-notes');
  const notesButton = document.querySelector('#notes-button');
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  let current = 0;

  function toggleOutline(open = outline.hidden) {
    outline.hidden = !open;
    contents.setAttribute('aria-expanded', String(open));
    if (open) outline.querySelector('[aria-current]')?.focus();
    else { contents.focus(); contents.blur(); }
  }

  function toggleNotes() {
    notes.hidden = !notes.hidden;
    notesButton.setAttribute('aria-expanded', String(!notes.hidden));
  }

  const links = slides.map((slide, index) => {
    const link = document.createElement('a');
    link.href = `#${slide.id}`;
    link.textContent = `${String(index + 1).padStart(2, '0')} · ${slide.title}`;
    link.addEventListener('click', () => toggleOutline(false));
    document.querySelector('#outline-links').append(link);
    return link;
  });

  function showSlide() {
    const id = location.hash.slice(1);
    const index = slides.findIndex(slide => slide.id === (id === 'js-backend' ? 'ts-backend' : id));
    current = Math.max(0, index);
    sections.forEach((section, i) => { section.hidden = i !== current; });
    const slide = slides[current];
    document.querySelector('#counter').innerHTML = `${String(current + 1).padStart(2, '0')} <i>/ ${slides.length}</i>`;
    document.querySelector('#slide-label').textContent = slide.chapter;
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    document.querySelector('#progress-fill').style.width = `${(current + 1) / slides.length * 100}%`;
    document.title = current === 0 ? lectureTitle : `${slide.title} · ${lectureTitle}`;
    const elapsed = slides.slice(0, current).reduce((total, item) => total + item.minutes, 0);
    notes.innerHTML = `<div class="notes-header"><strong>${elapsed}–${elapsed + slide.minutes} мин · ${slide.minutes} мин на слайд</strong><button aria-label="Закрыть заметки">×</button></div>
      <p>${escape(slide.notes)}</p>${sourceLinks(slide.sources)}<a href="docs/speaker-guide.html" target="_blank" rel="noreferrer">Полный сценарий преподавателя</a>`;
    notes.querySelector('button').addEventListener('click', toggleNotes);
    links.forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  }

  function move(delta) {
    location.hash = sections[Math.max(0, Math.min(sections.length - 1, current + delta))].id;
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { /* Встроенный браузер может ограничивать полноэкранный режим. */ }
  }

  contents.addEventListener('click', () => toggleOutline());
  document.querySelector('#close-outline').addEventListener('click', () => toggleOutline(false));
  notesButton.addEventListener('click', toggleNotes);
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  document.querySelector('#start').addEventListener('click', () => move(1));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!outline.hidden) toggleOutline(false);
      if (!notes.hidden) toggleNotes();
      return;
    }
    if (event.target.closest('button,a,input,textarea,select,[contenteditable="true"]') || event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.toLowerCase();
    if (key === 'o') { event.preventDefault(); toggleOutline(); return; }
    if (key === 'n') { event.preventDefault(); toggleNotes(); return; }
    if (!outline.hidden) return;
    if (['arrowright', 'pagedown', ' ', 'enter'].includes(key)) { event.preventDefault(); move(event.shiftKey ? -1 : 1); }
    if (['arrowleft', 'pageup'].includes(key)) { event.preventDefault(); move(-1); }
    if (key === 'home') { event.preventDefault(); move(-sections.length); }
    if (key === 'end') { event.preventDefault(); move(sections.length); }
    if (key === 'f') toggleFullscreen();
  });
  window.addEventListener('hashchange', () => { showSlide(); window.scrollTo(0, 0); });
  showSlide();
}
