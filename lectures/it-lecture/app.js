(() => {
  'use strict';
  const slides = window.DECK;
  const $ = (selector) => document.querySelector(selector);
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const lines = (value) => escape(value).replace(/\n/g, ' <br>');
  const icon = (name) => {
    const paths = {cube:'<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z"/><path d="m3 7 9 5 9-5m-9 5v10"/>',desktop:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/>',prev:'<path d="m14 6-6 6 6 6"/>',next:'<path d="m10 6 6 6-6 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>',grid:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',full:'<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>',arrow:'<path d="M5 19 19 5M5 5h14v14"/>',code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',phone:'<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M10 18h4"/>',game:'<path d="M7 7h10c3 0 5 11 3 12-2 1-4-3-5-3H9c-1 0-3 4-5 3C2 18 4 7 7 7Z"/><path d="M7 10v5m-2-2h4m6-2h.01m3 3h.01"/>',web:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="M2 9h20M6 6.5h.01m3 0h.01"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',bag:'<path d="M5 7h14l2 14H3L5 7Z"/><path d="M9 8V5a3 3 0 0 1 6 0v3"/>',service:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>'};
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.code}</svg>`;
  };
  const reveal = (delay=0) => `class="reveal" style="--delay:${delay}ms"`;
  const heading = (s) => `<div class="slide-heading"><p ${reveal(30)}><span class="eyebrow">${escape(s.label)}</span></p><h2 ${reveal(90)}>${lines(s.title)}</h2></div>`;
  const templates = {
    intro: s => `<div class="intro-copy"><p ${reveal(30)}><span class="intro-eyebrow">Интерфейсы для людей</span></p><h1 ${reveal(100)}>Что делает<br>фронтенд-<br>разработчик</h1><div class="speaker reveal" style="--delay:270ms"><p>${escape(s.name)}</p><span>${escape(s.role)}</span></div></div><div class="hero-visual reveal" style="--delay:180ms"><img src="assets/frontend-hero.png" alt="Веб-интерфейс и красный курсор" fetchpriority="high"></div>`,
    work: s => `${heading(s)}<div class="work-layout"><div class="work-lead reveal" style="--delay:140ms"><span class="large-symbol">&lt;/&gt;</span><h3>${lines(s.lead)}</h3><p>${escape(s.description)}</p></div><div class="work-principles">${s.principles.map((p,i)=>`<article class="principle-card reveal" style="--delay:${220+i*100}ms"><span class="principle-icon">${icon(['code','web','user'][i])}</span><div><h3>${escape(p.title)}</h3><p>${escape(p.detail)}</p></div></article>`).join('')}</div></div>`,
    projects: s => `${heading(s)}<div class="project-grid">${s.projects.map((p,i)=>`<article class="project-card ${i===0?'project-featured':'project-compact'} reveal" style="--delay:${140+i*80}ms"><p class="project-category">${escape(p.category)}</p><div class="project-preview project-preview-${escape(p.id)}"><img src="${escape(p.image)}" alt="${escape(p.imageAlt)}" decoding="async"></div><h3>${escape(p.title)}</h3><p class="project-description">${escape(p.description)}</p></article>`).join('')}</div>`,
    stack: s => `${heading(s)}<div class="foundation reveal" style="--delay:130ms"><strong>${escape(s.foundation)}</strong><span>${escape(s.foundationDetail)}</span></div><div class="tech-grid">${s.technologies.map((t,i)=>`<article class="tech-card ${t.color} reveal" style="--delay:${180+i*38}ms"><div class="tech-top"><span>${escape(t.label)}</span><img src="assets/tech/${t.icon}.svg" alt="" width="46" height="46"></div><h3>${escape(t.title)}</h3><p>${escape(t.detail)}</p></article>`).join('')}</div>`,
    demand: s => `${heading(s)}<div class="market-context reveal" style="--delay:130ms">${escape(s.description)}</div><div class="demand-layout"><div class="industries reveal" style="--delay:180ms"><h3>Где нужен фронтенд</h3><div class="industry-grid">${s.fields.map((f,i)=>`<article class="sector reveal" style="--delay:${220+i*25}ms"><h4>${escape(f.name)}</h4><p>${escape(f.use)}</p></article>`).join('')}</div></div><div class="market-note reveal" style="--delay:270ms"><h3>Что важно <br>на рынке</h3><ul class="market-skills">${s.skills.map(v=>`<li>${escape(v)}</li>`).join('')}</ul></div></div>`,
    growth: s => `${heading(s)}<div class="career-map"><div class="career-hub reveal" style="--delay:140ms"><span>&lt;/&gt;</span> Навыки фронтендера</div><div class="career-branches" aria-hidden="true"></div><div class="career-grid">${s.directions.map((d,i)=>`<div class="career-option"><span class="career-connector" aria-hidden="true"><svg viewBox="0 0 14 34" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 0V29M2 24L7 29L12 24"/></svg></span><article class="career-card reveal" style="--delay:${320+i*65}ms"><span class="career-icon">${d.symbol==='{ }'?'{}':icon(d.symbol)}</span><h3>${escape(d.title)}</h3><p class="career-tools">${escape(d.tools)}</p><p class="career-description">${escape(d.detail)}</p></article></div>`).join('')}</div></div>`,
    hackathon: s => {
      return `${heading(s)}<div class="hack-main"><div class="hack-preview"><img class="hack-banner reveal" style="--delay:140ms" src="assets/hack-site-hero-crop.png" alt="Баннер Альфа-Будущее Хакатона"></div><div class="hack-rewards reveal" style="--delay:220ms"><h3>Три призовых места <span>в каждом треке</span></h3><div class="prize-winner"><span class="prize-rank">1-е место</span><strong>${escape(s.prize)}</strong><p>+ ${escape(s.benefit)}</p></div><div class="prize-runners"><div><span>2-е место</span><strong>300 000 ₽</strong></div><div><span>3-е место</span><strong>200 000 ₽</strong></div></div></div></div><div class="hack-tracks">${s.tracks.map((track,i)=>`<article class="hack-track reveal" style="--delay:${300+i*60}ms"><div class="hack-track-heading"><h3>${escape(track.title)}</h3></div><p class="hack-track-description">${escape(track.description)}</p><ul class="hack-roles" aria-label="Роли участников трека">${track.roles.map(role=>`<li>${escape(role)}</li>`).join('')}</ul></article>`).join('')}</div><div class="event-footer reveal" style="--delay:470ms"><div class="registration"><span>Регистрация до</span><strong>18 октября</strong></div><div class="event-dates"><div><strong>${escape(s.online)}</strong><span>Онлайн-этап</span></div><div><strong>${escape(s.final)}</strong><span>Финал в Москве</span></div></div></div>`;
    }
  };
  const stage = $('#stage');
  stage.innerHTML = slides.map((s,i)=>`<section class="slide slide-${s.id}" id="slide-${i+1}" aria-label="${i+1} из ${slides.length}. ${escape(s.title.replace(/\n/g,' '))}" aria-hidden="true" inert>${templates[s.id](s)}</section>`).join('');
  $('#slide-dots').innerHTML = slides.map((s,i)=>`<button class="slide-dot" data-slide="${i}" aria-label="Слайд ${i+1}: ${escape(s.title.replace(/\n/g,' '))}"><span></span></button>`).join('');
  $('#previous').innerHTML=icon('prev');$('#next').innerHTML=icon('next');$('#fullscreen').innerHTML=icon('full');
  let current = -1;
  let exitTimer;
  const sections=[...document.querySelectorAll('.slide')];
  const parseHash = () => Math.max(0,Math.min(slides.length-1,Math.trunc((Number(location.hash.slice(1))||1)-1)));
  function go(index, updateHash=true){
    index=Math.max(0,Math.min(slides.length-1,index));
    if(index===current)return;
    clearTimeout(exitTimer);
    sections.forEach(s=>s.classList.remove('is-exiting'));
    const previous=sections[current];
    const forward=index>current;
    if(previous){previous.classList.remove('is-active');previous.classList.add('is-exiting');previous.inert=true;previous.setAttribute('aria-hidden','true');}
    const next=sections[index];
    stage.dataset.direction=forward?'forward':'backward';
    next.classList.add('is-active');next.inert=false;next.setAttribute('aria-hidden','false');next.scrollTop=0;
    current=index;
    document.body.dataset.slide=slides[index].id;
    $('#slide-counter').innerHTML=`${String(index+1).padStart(2,'0')} <span>/ ${String(slides.length).padStart(2,'0')}</span>`;
    $('#previous').disabled=index===0;$('#next').disabled=index===slides.length-1;
    $('#progress').style.width=`${(index+1)/slides.length*100}%`;
    document.querySelectorAll('.slide-dot').forEach((b,i)=>{b.classList.toggle('is-current',i===index);b.setAttribute('aria-current',i===index?'step':'false');});
    $('#announcer').textContent=`Слайд ${index+1} из ${slides.length}. ${slides[index].title.replace(/\n/g,' ')}`;
    document.title=`${slides[index].title.replace(/\n/g,' ')} · Егор Антонов`;
    if(updateHash)history.replaceState(null,'',`#${index+1}`);
    exitTimer=setTimeout(()=>sections.forEach(s=>s.classList.remove('is-exiting')),650);
  }
  async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{ $('#fullscreen').title='Полный экран недоступен в этом окне. Откройте презентацию в отдельной вкладке.'; }}
  $('#previous').addEventListener('click',()=>go(current-1));$('#next').addEventListener('click',()=>go(current+1));
  document.querySelectorAll('[data-slide]').forEach(button=>button.addEventListener('click',()=>{go(Number(button.dataset.slide));}));
  $('#fullscreen').addEventListener('click',fullscreen);
  addEventListener('hashchange',()=>go(parseHash(),false));
  addEventListener('keydown',e=>{
    if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,textarea,select'))return;
    if((e.key===' '||e.key==='Enter')&&e.target.closest('button,a'))return;
    if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();go(current+1);}
    else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();go(current-1);}
    else if(e.key==='Home'){e.preventDefault();go(0);}
    else if(e.key==='End'){e.preventDefault();go(slides.length-1);}
    else if(e.key.toLowerCase()==='f')fullscreen();
  });
  let touchStart;
  stage.addEventListener('touchstart',e=>{if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  stage.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)go(current+(dx<0?1:-1));touchStart=null;},{passive:true});
  go(parseHash(),false);
})();
