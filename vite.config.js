// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import { fileURLToPath, URL } from 'node:url'
import { APP_VERSION } from './src/utils/version.js'

// Subida de sourcemaps a Sentry (solo build-time, cero peso en runtime).
// Se activa SOLO si hay SENTRY_AUTH_TOKEN en el entorno (build de release/CI);
// los builds normales no lo cargan. Requiere además SENTRY_ORG y SENTRY_PROJECT.
// El `release` debe coincidir con el que envía errorTracking.js (APP_VERSION).
// Los CSS de @fontsource declaran cada fuente con .woff2 + fallback .woff
// legacy. Todos los navegadores soportados descargan el .woff2 (soporte
// universal desde ~2016), así que el fallback solo infla el CSS al doble
// (~250 kB gzip extra en el arranque) y emite ~490 .woff (16 MB) al dist que
// nadie descarga. Este plugin quita esa parte del `src` ANTES de que Vite
// resuelva los url() → los .woff ni se emiten. enforce:'pre' garantiza que
// corre sobre el CSS crudo, antes del pipeline CSS de Vite.
const stripWoffFallback = {
  name: 'strip-woff-fallback',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('@fontsource') || !/\.css(\?|$)/.test(id)) return undefined;
    // `[^)]*\.woff\)` no casa con .woff2) porque exige ')' justo tras "woff".
    return code.replace(/,\s*url\([^)]*\.woff\)\s*format\((['"])woff\1\)/g, '');
  },
};

const sentryPlugins = process.env.SENTRY_AUTH_TOKEN
  ? [sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      release: { name: APP_VERSION },
      telemetry: false,
      // Sube los .map (generados por build.sourcemap:'hidden') y los BORRA del
      // dist tras subirlos, para no publicarlos en GitHub Pages.
      sourcemaps: { filesToDeleteAfterUpload: ['./dist/**/*.map'] },
    })]
  : [];

export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [
    stripWoffFallback,
    react(),
    VitePWA({
      // 'prompt' (no 'autoUpdate'): el SW nuevo se queda EN ESPERA y toma el
      // control en el siguiente arranque (cuando se cierran las pestañas), en
      // lugar de activarse a mitad de sesión. Con 'autoUpdate' el plugin hacía
      // window.location.reload() al activarse un SW actualizado (isUpdate),
      // provocando la "doble carga": abrir → cargar versión cacheada → el SW
      // nuevo activa → recarga forzada. 'prompt' lo evita y además mantiene la
      // sesión actual con assets coherentes (sin riesgo de chunk mismatch). No
      // mostramos banner: simplemente la versión nueva entra en la próxima
      // visita (ver registerSW en src/main.jsx).
      registerType: 'prompt',
      manifest: {
        // La marca "HanyuPath" es fija (no se traduce); el tagline sí se
        // localiza en la app y en la ficha de Play, pero el manifest es
        // estático → usamos la versión en inglés.
        name: 'HanyuPath: Learn Chinese',
        short_name: 'HanyuPath',
        description: 'Learn Chinese with interactive exercises',
        lang: 'en',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#2f6b4a',
        background_color: '#f4ecdc',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          // maskable: Android recorta el icono en círculo/squircle; sin esta
          // variante el launcher lo mete en un fondo blanco. Clave para TWA.
          { src: 'icons/icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        // Accesos rápidos al mantener pulsado el icono (Android/TWA). Las URLs
        // son relativas al manifest → respetan el base (/aprende-chino/ en Pages)
        // y usan el hash routing existente (deep links de App.jsx).
        shortcuts: [
          {
            name: 'Repaso diario',
            short_name: 'Repaso',
            url: './#/review',
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Historias',
            short_name: 'Historias',
            url: './#/stories',
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
          {
            name: 'Minijuegos',
            short_name: 'Destrezas',
            url: './#/minigames',
            icons: [{ src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
          },
        ],
      },
      workbox: {
        // Precache: solo el shell (JS/CSS/HTML/iconos). El audio (35 MB),
        // la música, las ilustraciones webp (3,2 MB) y los trozos woff2 de las
        // fuentes auto-alojadas (~500 slices por unicode-range) van por caché
        // runtime — se guardan al primer uso.
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        // Los chunks de datos por idioma (locale i18n, grammar, cultural,
        // reading, phrases, provinces → es-*.js, en-*.js…) suman ~600 kB × 6
        // idiomas; cada usuario usa uno. Fuera del precache: el idioma activo
        // se cachea al primer uso (regla runtime 'locale-chunks' más abajo).
        globIgnores: ['audio/**', 'music/**', '**/assets/{es,en,fr,de,it,pt}-*.js'],
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
            // JSON de datos (libro-data, radicals-data, info.json, hsk1-data…):
            // NetworkFirst — con conexión SIEMPRE trae la versión fresca; el
            // caché es solo respaldo offline. Antes era StaleWhileRevalidate,
            // que servía el JSON viejo primero: al actualizar traducciones
            // (meaningTr) el diccionario/exámenes seguían en español hasta la
            // 2ª carga. NetworkFirst evita ese desfase para datos versionados.
            urlPattern: ({ url }) => url.pathname.includes('/data/') && url.pathname.endsWith('.json'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'data-json',
              networkTimeoutSeconds: 4, // offline: cae al caché rápido
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Datos de trazos de HanziWriter (auto-alojados en /hanzi-data/).
            // Inmutables por carácter → CacheFirst: se guardan al primer uso y
            // las animaciones funcionan offline a partir de entonces.
            urlPattern: ({ url }) => url.pathname.includes('/hanzi-data/') && url.pathname.endsWith('.json'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'hanzi-data',
              expiration: { maxEntries: 1000, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Chunks de datos por idioma excluidos del precache (ver
            // globIgnores). Hash en el nombre → inmutables → CacheFirst: el
            // idioma del usuario queda cacheado al primer uso y funciona
            // offline; los otros 5 no se descargan nunca.
            urlPattern: ({ url, sameOrigin }) =>
              sameOrigin && /\/assets\/(es|en|fr|de|it|pt)-[^/]+\.js$/.test(url.pathname),
            handler: 'CacheFirst',
            options: {
              cacheName: 'locale-chunks',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Trozos woff2 de las fuentes auto-alojadas (@fontsource, con hash
            // en el nombre → inmutables). CacheFirst: cada slice se guarda al
            // primer uso y los hanzi se pintan offline a partir de entonces.
            urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.endsWith('.woff2'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
    // Al final: opera sobre el bundle ya generado (sube sourcemaps a Sentry).
    // Vacío si no hay SENTRY_AUTH_TOKEN → no afecta a los builds normales.
    ...sentryPlugins,
  ],
  // En PRODUCCIÓN elimina console.* y debugger automáticamente (vía esbuild,
  // el minificador por defecto de Vite). En dev se mantienen para debug.
  // Excluye console.warn/error porque suelen ser señales legítimas.
  esbuild: mode === 'production'
    ? { drop: ['debugger'], pure: ['console.log', 'console.info', 'console.debug', 'console.trace'] }
    : {},
  build: {
    outDir: 'dist',
    // 'hidden': genera sourcemaps para Sentry sin referenciarlos desde los
    // bundles. Solo cuando hay SENTRY_AUTH_TOKEN (build de release/CI, que
    // además los borra tras subirlos): sin token los .map (7 MB) se quedaban
    // en dist y gh-pages los publicaba (deploy lento + código fuente público).
    sourcemap: process.env.SENTRY_AUTH_TOKEN ? 'hidden' : false,
    rollupOptions: {
      output: {
        // manualChunks como función — necesario para capturar subpaths como
        // `react-dom/client` que el formato objeto no cubre (acababan en index.js).
        // Agrupa por carpeta de node_modules para que el caché del navegador
        // pueda reutilizar chunks vendor entre despliegues si esa dependencia no cambia.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          // El CSS de @fontsource debe quedarse con el chunk dinámico
          // fonts.js (cargado tras el primer render): si cayera en 'vendor'
          // volvería al CSS render-blocking del arranque.
          if (id.includes('node_modules/@fontsource')) return undefined;
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
