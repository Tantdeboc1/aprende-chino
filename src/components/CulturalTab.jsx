// src/components/CulturalTab.jsx
// Tab de notas culturales con tarjetas expandibles
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { loadCulturalData } from '@/utils/loadContent.js';
import SpeakButton from '@/components/ui/SpeakButton.jsx';

// Extrae solo los caracteres CJK del texto. Si no quedan caracteres chinos,
// no merece la pena mostrar el botón de TTS (sería leer cosas raras).
function extractHanzi(text) {
  if (!text) return '';
  // Rango BMP CJK Unified Ideographs (cubre los caracteres frecuentes).
  return text.replace(/[^一-鿿]+/g, ' ').trim();
}

export default function CulturalTab({ lessonNum }) {
  const { t, i18n } = useTranslation();
  const [openId, setOpenId] = useState(null);
  const lang = i18n.language;

  // Carga el chunk del idioma activo en demanda. Solo se descarga ~10 kB gzip
  // en lugar de los 60 kB del archivo multi-idioma completo.
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    let alive = true;
    loadCulturalData(lang).then(all => {
      if (!alive) return;
      setNotes(all[lessonNum] || []);
    // Corte de red al descargar el chunk del idioma: se queda en "Cargando…".
    // Lo tragamos para que no escape como rejection sin manejar a Sentry.
    }).catch(err => console.warn('[CulturalTab] no se pudo cargar', lang, err));
    return () => { alive = false; };
  }, [lang, lessonNum]);

  if (notes === null) {
    return (
      <div className="pt-6 text-center text-sm" style={{ color: J.mute }}>
        {t('common_loading', 'Cargando…')}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="pt-4 text-center py-12">
        <div className="font-cn text-4xl mb-3" style={{ color: J.mute2 }}>文</div>
        <p className="text-sm" style={{ color: J.mute }}>{t('culture_not_available')}</p>
      </div>
    );
  }

  return (
    <div className="pt-3 space-y-3">
      <p className="text-xs px-1" style={{ color: J.mute }}>
        {t('culture_intro_text')}
      </p>

      {notes.map(note => {
        const isOpen = openId === note.id;
        return (
          <div
            key={note.id}
            className="rounded-xl transition-all duration-200 overflow-hidden cursor-pointer"
            style={{
              background: J.paperHi,
              border: `1px solid ${isOpen ? J.jade : J.hair}`,
              boxShadow: isOpen ? `0 0 0 1px ${J.hairS}` : 'none',
            }}
            onClick={() => setOpenId(isOpen ? null : note.id)}
          >
            {/* Cabecera siempre visible */}
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: J.jadeBg }}>
                {note.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-snug" style={{ color: J.ink }}>{note.title}</p>
              </div>
              <svg
                className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                style={{ color: J.mute }}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>

            {/* Contenido expandido */}
            {isOpen && (() => {
              const hanzi = extractHanzi(note.content);
              return (
                <div className="px-4 pb-4 pt-0" style={{ borderTop: `1px solid ${J.hair}` }}>
                  <p className="text-sm leading-relaxed mt-3" style={{ color: J.inkSoft }}>
                    {note.content}
                  </p>
                  {hanzi && (
                    <div className="mt-3 flex items-center gap-2">
                      <SpeakButton text={hanzi} size="md" />
                      <span className="text-xs" style={{ color: J.mute }}>
                        {t('culture_speak_hint', 'Escuchar los hanzi de esta ficha')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
}
