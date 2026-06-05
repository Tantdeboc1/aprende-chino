// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [react()],
  // En PRODUCCIÓN elimina console.* y debugger automáticamente (vía esbuild,
  // el minificador por defecto de Vite). En dev se mantienen para debug.
  // Excluye console.warn/error porque suelen ser señales legítimas.
  esbuild: mode === 'production'
    ? { drop: ['debugger'], pure: ['console.log', 'console.info', 'console.debug', 'console.trace'] }
    : {},
  build: {
    outDir: 'dist',
    // 'hidden': genera sourcemaps para herramientas de error tracking pero no
    // los referencia desde los bundles, así no se descargan en producción.
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        // manualChunks como función — necesario para capturar subpaths como
        // `react-dom/client` que el formato objeto no cubre (acababan en index.js).
        // Agrupa por carpeta de node_modules para que el caché del navegador
        // pueda reutilizar chunks vendor entre despliegues si esa dependencia no cambia.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/scheduler')
          ) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'vendor-i18n';
          }
          if (id.includes('node_modules/hanzi-writer')) {
            return 'vendor-hanzi';
          }
          if (
            id.includes('node_modules/react-confetti') ||
            id.includes('node_modules/tween-functions')
          ) {
            return 'vendor-confetti';
          }
          if (id.includes('node_modules/@dicebear')) {
            return 'vendor-dicebear';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Resto de dependencias de terceros → vendor común
          return 'vendor';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}))
