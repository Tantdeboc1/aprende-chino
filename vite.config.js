// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      // autoUpdate: el SW nuevo se activa solo; la siguiente visita ya usa
      // la versión nueva. Evita el clásico "usuarios atascados en versión
      // vieja" sin necesidad de banner de actualización.
      registerType: 'autoUpdate',
      manifest: {
        name: 'Aprende Chino · HSK 1',
        short_name: 'Aprende Chino',
        description: 'Aprende caracteres chinos HSK-1 con ejercicios interactivos',
        lang: 'es',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#2f6b4a',
        background_color: '#f4ecdc',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Precache: solo el shell (JS/CSS/HTML/iconos). El audio (35 MB),
        // la música y las ilustraciones webp (3,2 MB de fondos/avatares)
        // van por caché runtime — se guardan al primer uso.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        globIgnores: ['audio/**', 'music/**'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            // mp3 de pronunciación y música: se cachean al primer uso.
            urlPattern: ({ url }) => url.pathname.includes('/audio/') || url.pathname.includes('/music/'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'media',
              expiration: { maxEntries: 600, maxAgeSeconds: 60 * 60 * 24 * 180 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Ilustraciones (fondos de historias, avatares): al primer uso.
            urlPattern: ({ url }) => url.pathname.endsWith('.webp'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 180 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // JSON de datos (info.json, hsk1-data.json…): red primero con
            // caché de respaldo para offline.
            urlPattern: ({ url }) => url.pathname.includes('/data/') && url.pathname.endsWith('.json'),
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'data-json' },
          },
          {
            // CSS de Google Fonts.
            urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-css' },
          },
          {
            // Ficheros woff2 de Google Fonts (inmutables).
            urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-files',
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
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
          // Firestore separado del resto de Firebase: userStore lo importa
          // dinámicamente, así que este chunk solo se descarga para
          // usuarios con cuenta Google (los invitados no lo pagan).
          // Incluye también el wrapper `firebase/firestore` (sin @): si
          // cayera en vendor-firebase arrastraría el chunk grande como
          // dependencia estática y se precargaría en el arranque.
          if (id.includes('node_modules/@firebase/firestore') ||
              id.includes('node_modules/firebase/firestore')) {
            return 'vendor-firestore';
          }
          // Firebase app+auth en su propio chunk: no contamina el vendor
          // común y el navegador lo cachea entre despliegues.
          if (id.includes('node_modules/@firebase') || id.includes('node_modules/firebase')) {
            return 'vendor-firebase';
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
