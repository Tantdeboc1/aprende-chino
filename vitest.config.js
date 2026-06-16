// vitest.config.js
// Config separada de vite.config.js para no cargar el plugin PWA ni el build
// de producción en los tests. Solo necesita el alias `@` y un entorno jsdom
// (para los utils que tocan localStorage / window).
import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    clearMocks: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
