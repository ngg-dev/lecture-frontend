import { build } from 'esbuild';
import { mkdir, copyFile, writeFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { root, bundleOptions } from './bundle-options.mjs';
await build({
  ...bundleOptions,
  outfile: resolve(root, 'app.js'),
  bundle: true,
  format: 'iife',
  minify: true,
  legalComments: 'eof',
  define: { 'process.env.NODE_ENV': '"production"' }
});
await mkdir(resolve(root, 'dist'), { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js']) {
  await copyFile(resolve(root, file), resolve(root, 'dist', file));
}
await writeFile(resolve(root, '.nojekyll'), '');
await writeFile(resolve(root, 'dist/.nojekyll'), '');
// The assignment is distributed separately as PDF, outside the lecture.
await rm(resolve(root, 'dist/Лабораторная работа 6.md'), { force: true });
await rm(resolve(root, 'dist/lab-api'), { recursive: true, force: true });
console.log('Готово: app.js и автономная статическая папка dist/.');
