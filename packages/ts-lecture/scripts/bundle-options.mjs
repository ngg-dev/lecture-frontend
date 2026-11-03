import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
export const root = resolve(import.meta.dirname, '..');
const modules = resolve(root, 'node_modules');
const names = [];
for (const entry of await readdir(modules, { withFileTypes: true })) {
  if (entry.name.startsWith('.')) continue;
  if (entry.name.startsWith('@')) {
    for (const name of await readdir(resolve(modules, entry.name))) names.push(`${entry.name}/${name}`);
  } else if (entry.isDirectory()) names.push(entry.name);
}
// Keep this npm project independent of an unrelated Yarn PnP manifest in a parent directory.
export const bundleOptions = {
  absWorkingDir: root,
  alias: Object.fromEntries(names.map(name => [name, resolve(modules, name)])),
  entryPoints: [resolve(root, 'src/main.jsx')],
  bundle: true
};
