// src/i18n.js
// EN y ES se cargan al inicio (ES es fallback, EN es el más común).
// FR, DE, IT y PT se cargan dinámicamente solo cuando el usuario cambia a ese idioma.
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.js';
import es from './locales/es.js';

// Cargadores dinámicos — Vite genera un chunk separado por cada uno
const lazyLoaders = {
  fr: () => import('./locales/fr.js'),
  de: () => import('./locales/de.js'),
  it: () => import('./locales/it.js'),
  pt: () => import('./locales/pt.js'),
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    debug: false,
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Cuando el usuario cambia a FR, DE, IT o PT, se carga el chunk si aún no está
// loadingLangs evita dobles cargas si el evento se dispara dos veces seguidas
const loadingLangs = new Set();
i18n.on('languageChanged', async (lng) => {
  const loader = lazyLoaders[lng];
  if (loader && !i18n.hasResourceBundle(lng, 'translation') && !loadingLangs.has(lng)) {
    loadingLangs.add(lng);
    try {
      const mod = await loader();
      i18n.addResourceBundle(lng, 'translation', mod.default, true, true);
      // Re-renderizar con las nuevas traducciones
      i18n.changeLanguage(lng);
    } finally {
      loadingLangs.delete(lng);
    }
  }
});

export default i18n;
