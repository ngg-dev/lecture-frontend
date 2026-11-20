import { transformFileAsync } from '@babel/core';
import { readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
const root = resolve(import.meta.dirname, '..');
async function compile(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) await compile(path);
    else if (entry.name.endsWith('.js')) {
      const result = await transformFileAsync(path, { babelrc: false, configFile: false,
        plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]] });
      const out = resolve(root, 'api/dist', relative(resolve(root, 'api/src'), path));
      await mkdir(dirname(out), { recursive: true }); await writeFile(out, result.code);
    }
  }
}
await compile(resolve(root, 'api/src'));
