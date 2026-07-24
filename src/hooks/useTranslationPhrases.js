// src/hooks/useTranslationPhrases.js
// Frases del minijuego de traducción/pronunciación en el idioma activo.
// Devuelve `null` mientras carga el chunk del idioma (ver loadContent.js);
// los juegos muestran su intro mientras tanto, así que no hace falta spinner.
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadTranslationPhrases } from '@/utils/loadContent.js';

export function useTranslationPhrases() {
  const { i18n } = useTranslation();
  const lang = (i18n.language || 'es').split('-')[0];
  const [phrases, setPhrases] = useState(null);

  useEffect(() => {
    let alive = true;
    loadTranslationPhrases(lang)
      .then(data => { if (alive) setPhrases(data); })
      // Corte de red al descargar el chunk del idioma: se deja en null (los
      // juegos muestran su intro). Lo tragamos para no saturar Sentry.
      .catch(err => console.warn('[useTranslationPhrases] no se pudo cargar', lang, err));
    return () => { alive = false; };
  }, [lang]);

  return phrases;
}
