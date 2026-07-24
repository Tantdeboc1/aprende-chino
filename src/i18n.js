// src/i18n.js
// Solo EN se embebe al inicio: es el fallback universal y sirve de base
// mientras llega el chunk del idioma real. ES/FR/DE/IT/PT se cargan bajo
// demanda (chunk aparte). El SplashScreen —que espera a que carguen los datos
// (libro-data ~232K)— tapa de sobra la carga de un locale (~17K), así que un
// usuario no-inglés no ve "flash" en inglés: el chunk llega antes del primer
// render útil. Ahorra ~17K gzip de arranque a todo usuario no-español.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.js';
import { withChunkRetry } from './utils/lazyWithRetry.js';

// Cargadores dinámicos — Vite genera un chunk separado por cada uno
const lazyLoaders = {
  es: () => import('./locales/es.js'),
  fr: () => import('./locales/fr.js'),
  de: () => import('./locales/de.js'),
  it: () => import('./locales/it.js'),
  pt: () => import('./locales/pt.js'),
};

// Idiomas que la app entiende. Si el navegador reporta uno fuera de esta
// lista (ruso, chino, etc.), i18next cae a fallbackLng (inglés).
const SUPPORTED_LANGS = ['es', 'en', 'fr', 'de', 'it', 'pt'];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Inglés como fallback universal — más útil que español para usuarios
    // de cualquier otro idioma que no tengamos traducido.
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS,
    // 'languageOnly' colapsa 'es-ES', 'es-MX', 'pt-BR'… a su código base.
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    debug: false,
    resources: {
      en: { translation: en },
    },
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Si el idioma detectado es uno cargado de forma diferida (fr/de/it/pt),
// fuerza el load justo después de init para evitar que la primera vista
// se pinte en inglés y haga "flash" cuando llega el bundle.
const detectedLng = (i18n.language || '').split('-')[0];
if (lazyLoaders[detectedLng] && !i18n.hasResourceBundle(detectedLng, 'translation')) {
  lazyLoaders[detectedLng]().then(mod => {
    i18n.addResourceBundle(detectedLng, 'translation', mod.default, true, true);
    i18n.changeLanguage(detectedLng);
  }).catch(() => {});
}

// Mantiene <html lang> sincronizado con el idioma activo. Importa para
// lectores de pantalla (pronunciación correcta) y SEO. index.html arranca con
// lang="es"; aquí lo corregimos al idioma real detectado y en cada cambio.
function syncHtmlLang(lng) {
  const base = (lng || '').split('-')[0];
  if (base && typeof document !== 'undefined') {
    document.documentElement.lang = base;
  }
}
syncHtmlLang(i18n.language);

// Cuando el usuario cambia a FR, DE, IT o PT, se carga el chunk si aún no está
// loadingLangs evita dobles cargas si el evento se dispara dos veces seguidas
const loadingLangs = new Set();
i18n.on('languageChanged', async (lng) => {
  syncHtmlLang(lng);
  // Normalizamos códigos regionales: 'pt-BR' → 'pt', 'fr-CA' → 'fr'.
  // Sin esto, una visita desde un Chrome con locale regional no encuentra
  // su loader en `lazyLoaders` y la UI se queda en el fallback.
  const base = (lng || '').split('-')[0];
  const loader = lazyLoaders[base];
  if (loader && !i18n.hasResourceBundle(base, 'translation') && !loadingLangs.has(base)) {
    loadingLangs.add(base);
    try {
      // withChunkRetry: reintenta y, si es un chunk perdido tras un despliegue,
      // recarga con el index.html nuevo (mismo criterio que loadContent.js).
      const mod = await withChunkRetry(loader)();
      i18n.addResourceBundle(base, 'translation', mod.default, true, true);
      // Re-renderizar con las nuevas traducciones (forzamos el código base
      // para que i18n.language quede consistente con el bundle cargado).
      i18n.changeLanguage(base);
    } catch (e) {
      // Corte de red al cambiar de idioma: la UI se queda en el idioma previo
      // (fallback inglés). Lo tragamos para no soltar un unhandled rejection a
      // Sentry — sin el catch, este handler async lo propagaría.
      console.warn('[i18n] no se pudo cargar el idioma', base, e);
    } finally {
      loadingLangs.delete(base);
    }
  }
});

export default i18n;
