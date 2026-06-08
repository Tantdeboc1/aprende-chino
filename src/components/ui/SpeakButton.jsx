// src/components/ui/SpeakButton.jsx
// Botón compacto 🔊 que reproduce texto chino con TTS.
//
// Usa el sistema existente `speakChineseEnhanced` (audio pregrabado si lo hay,
// fallback a Web Speech API). El botón evita propagación de clicks para poder
// usarse dentro de cards/botones expandibles sin disparar el toggle del padre.

import { useTranslation } from 'react-i18next';
import { speakChineseEnhanced } from '@/utils/tts-enhanced.js';
import { J } from '@/styles/tokens';

/**
 * @param {object} props
 * @param {string} props.text — texto chino a reproducir
 * @param {'sm'|'md'} [props.size='sm'] — tamaño visual
 * @param {string} [props.className]
 * @param {string} [props.title]      — tooltip personalizado (opcional)
 */
export default function SpeakButton({ text, size = 'sm', className = '', title }) {
  const { t } = useTranslation();

  if (!text) return null;

  const handleClick = (e) => {
    // Evita que el click llegue al contenedor (p.ej. tarjetas expandibles).
    e.stopPropagation();
    e.preventDefault();
    try {
      speakChineseEnhanced(text);
    } catch (_) {
      /* el helper ya hace fallback silencioso */
    }
  };

  const px = size === 'md' ? 8 : 6;
  const fontSize = size === 'md' ? 14 : 12;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={title || t('speak_aria', 'Reproducir audio')}
      title={title || t('speak_aria', 'Reproducir audio')}
      className={`inline-flex items-center justify-center rounded-md transition-colors ${className}`}
      style={{
        background: J.jadeBg,
        color: J.jadeDeep,
        border: 0,
        cursor: 'pointer',
        padding: `${px}px ${px + 2}px`,
        fontSize,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      🔊
    </button>
  );
}
