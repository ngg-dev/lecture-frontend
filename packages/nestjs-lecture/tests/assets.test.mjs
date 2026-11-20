import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const deck = new URL('../deck/', import.meta.url);
test('script and stylesheet URLs change with their contents to prevent stale template code',async()=>{
  const html=await readFile(new URL('index.html',deck),'utf8');
  for(const [name,ext] of [['app','js'],['styles','css']]){
    const match=html.match(new RegExp(`assets/${name}-([a-f0-9]{12})\\.${ext}`));
    assert(match,`Missing content hash in ${name} URL`);
    const bytes=await readFile(new URL(match[0],deck));
    assert.equal(match[1],createHash('sha256').update(bytes).digest('hex').slice(0,12));
  }
});
