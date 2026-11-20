import { build } from 'esbuild';
import { cp, mkdir, writeFile, readFile }  from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { lectureTitle, slides, sources } from '../src/content.js';
const root=resolve(import.meta.dirname,'..');
const out=resolve(root,'deck');
await mkdir(resolve(out,'docs'),{recursive:true});
const result=await build({entryPoints:[resolve(root,'src/app.js')],bundle:true,minify:true,format:'esm',write:false,jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},legalComments:'none'});
const script=result.outputFiles[0].contents;
const style=await readFile(resolve(root,'src/styles.css'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex').slice(0,12);
const scriptPath=`assets/app-${hash(script)}.js`;
const stylePath=`assets/styles-${hash(style)}.css`;
await mkdir(resolve(out,'assets'),{recursive:true});
await writeFile(resolve(out,scriptPath),script);
await writeFile(resolve(out,stylePath),style);
for (const page of ['index.html', 'demo.html']) {
  const html = (await readFile(resolve(root, 'src', page), 'utf8'))
    .replace('src="app.js"', `src="${scriptPath}"`)
    .replace('href="styles.css"', `href="${stylePath}"`)
    .replace('{{slideCount}}', String(slides.length));
  await writeFile(resolve(out, page), html);
}
await cp(resolve(root,'src/favicon.svg'),resolve(out,'favicon.svg'));
const escape=t=>String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
let time=0;
const blocks=slides.map((s,i)=>{const start=time;time+=s.minutes;return `<section><h2>${i+1}. ${escape(s.title)}</h2><small>${start}–${time} мин · ${escape(s.chapter)}</small><p>${escape(s.notes)}</p>${(s.sources||[]).map(k=>`<p><a href="${sources[k][1]}">${escape(sources[k][0])}</a></p>`).join('')}</section>`;}).join('');
await writeFile(resolve(out,'docs/speaker-guide.html'),`<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Сценарий · NestJS</title><style>body{max-width:850px;margin:40px auto;padding:0 24px;background:#17191b;color:#eee;font:18px/1.7 Arial}h1,h2,a{color:#ff7868}h2{font-size:24px}section{border-top:1px solid #555;padding:24px 0}small{color:#d4e993}</style><h1>${escape(lectureTitle)}</h1><p>${slides.length} слайдов · ${time} мин. До 5 минут на вопросы.</p><p><a href="../demo.html">Работающий пример</a> · <a href="../#intro">Презентация</a></p>${blocks}</html>`);
console.log(`Built ${slides.length} slides / ${time} minutes`);
