import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { slides, sources } from '../src/content.js';
const root=resolve(import.meta.dirname,'..');
assert.equal(new Set(slides.map(s=>s.id)).size,slides.length);
assert.equal(slides.reduce((sum,s)=>sum+s.minutes,0),65);
for(const s of slides){
  assert(s.title && s.notes,`Incomplete slide ${s.id}`);
  assert(Number.isInteger(s.minutes)&&s.minutes>0);
  assert.match(s.id,/^[a-z][a-z0-9-]*$/);
  assert(!s.code, `Code examples belong outside the lecture (${s.id})`);
  if (s.diagram) assert.equal(s.diagram.links.length, s.diagram.nodes.length - 1, s.id);
  for(const source of s.sources||[])assert(sources[source],`Missing source ${source}`);
}
for(const file of ['src/index.html','src/demo.html','src/styles.css','contracts/book.d.ts'])await access(resolve(root,file));
const html=await readFile(resolve(root,'src/index.html'),'utf8');
assert(html.includes('id="intro"'));
console.log(`Validated ${slides.length} slides / 65 minutes, notes and sources`);
