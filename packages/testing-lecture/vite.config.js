import { defineConfig } from 'vite';
import { resolve } from 'node:path';
export default defineConfig({
  base: './',
  build: { rollupOptions: { input: {
    lecture: resolve(import.meta.dirname, 'index.html'),
    shop: resolve(import.meta.dirname, 'shop/index.html'),
  } } },
});
