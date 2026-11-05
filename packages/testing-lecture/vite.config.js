import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
export default defineConfig({
  base: './',
  build: { rollupOptions: { input: {
    lecture: resolve(import.meta.dirname, 'index.html'),
    shop: resolve(import.meta.dirname, 'shop/index.html'),
  } } },
  test: {
    environment: 'jsdom', setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});
