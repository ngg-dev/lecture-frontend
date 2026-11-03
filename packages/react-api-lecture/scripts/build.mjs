import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';
const root = resolve(import.meta.dirname, '..');
await build({entryPoints: [resolve(root, 'src/main.jsx')], outfile: resolve(root, 'app.js'), bundle: true, alias: {react: resolve(root, 'node_modules/react'), 'react-dom': resolve(root, 'node_modules/react-dom'), scheduler: resolve(root, 'node_modules/scheduler')}, format: 'iife', minify: true, define: {'process.env.NODE_ENV': '"production"'}});
await mkdir(resolve(root, 'dist'), {recursive: true});
for (const name of ['index.html', 'styles.css', 'content.js', 'demos.js', 'keys-demo.js', 'catalog-demo.js', 'app.js']) await copyFile(resolve(root, name), resolve(root, 'dist', name));
console.log('React lecture built: app.js and dist/');
