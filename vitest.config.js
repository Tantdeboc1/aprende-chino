// vitest.config.js
// Config separada de vite.config.js para no cargar el plugin PWA ni el build
// de producción en los tests. Solo necesita el alias `@` y un entorno jsdom
// (para los utils que tocan localStorage / window).
import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  // JSX con runtime automático (import implícito de react/jsx-runtime), igual
  // que hace @vitejs/plugin-react en la app — necesario para los tests de
  // componentes (.test.jsx) sin cargar el plugin completo.
  esbuild: { jsx: 'automatic' },
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
