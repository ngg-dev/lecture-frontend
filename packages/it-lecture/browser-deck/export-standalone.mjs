import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('.',import.meta.url));
const dist=path.join(root,'dist');
const output=process.argv[2] || path.resolve(root,'../output/frontend-talk.html');
let html=await fs.readFile(path.join(dist,'index.html'),'utf8');
let app=await fs.readFile(path.join(dist,'app.js'),'utf8');
let slides=await fs.readFile(path.join(dist,'slides.js'),'utf8');
const css=await fs.readFile(path.join(dist,'styles.css'),'utf8');
for(const asset of ['frontend-hero.png','hack-site-hero-crop.png']){
 const bytes=await fs.readFile(path.join(dist,'assets',asset));
 app=app.replaceAll('assets/'+asset,'data:image/'+(asset.endsWith('.jpg')?'jpeg':'png')+';base64,'+bytes.toString('base64'));
}
for (const asset of ['vscode.png','dino.png','obsidian.png','slack.jpg','figma.png']) {
 const bytes=await fs.readFile(path.join(dist,'assets/projects',asset));
 const mime=asset.endsWith('.jpg')?'image/jpeg':'image/png';
 slides=slides.replaceAll('assets/projects/'+asset,'data:'+mime+';base64,'+bytes.toString('base64'));
}
const tech={};
for(const name of ['javascript','typescript','react','redux','sass','vitejs','playwright','git','nodejs']){
 const bytes=await fs.readFile(path.join(dist,'assets/tech',name+'.svg'));
 tech[name]='data:image/svg+xml;base64,'+bytes.toString('base64');
}
app=app.replace('assets/tech/${t.icon}.svg','${window.DECK_ASSETS[t.icon]}');
const safeScript=s=>s.replaceAll('</script','<\\/script');
html=html.replace('<link rel="stylesheet" href="styles.css">',`<style>${css}</style>`);
html=html.replace('  <script src="slides.js" defer></script>\n  <script src="app.js" defer></script>','');
html=html.replace('</body>',`<script>${safeScript(slides)}\nwindow.DECK_ASSETS=${JSON.stringify(tech)};\n${safeScript(app)}</script>\n</body>`);
await fs.mkdir(path.dirname(output),{recursive:true});
await fs.writeFile(output,html);
console.log(output);
