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
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — cambia poco, se cachea bien
          'vendor-react': ['react', 'react-dom', 'react-confetti'],
          // i18next — independiente del código de la app
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // hanzi-writer es la librería más pesada — separada para carga paralela
          'vendor-hanzi': ['hanzi-writer'],
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
