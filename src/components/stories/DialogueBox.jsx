// src/components/stories/DialogueBox.jsx
// Caja de diálogo estilo novela visual.
// - Efecto typewriter para el chino
// - Pinyin con visibilidad según dificultad (facil | normal | dificil)
// - Traducción al español siempre revelable al pulsar
// - Tap en la caja: completa el typewriter o avanza si ya está completo

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';

const TYPE_SPEED_MS = 35;
// Cadencia natural: tras un signo de puntuación el typewriter respira antes
// de seguir, como haría un hablante (pausa larga al cerrar frase, media en
// comas y pausas menores).
const PAUSE_FULL  = /[。！？…]/; // fin de frase → pausa larga
const PAUSE_HALF  = /[，、；：]/; // pausa media
function delayAfter(ch) {
  if (PAUSE_FULL.test(ch)) return TYPE_SPEED_MS * 8;
  if (PAUSE_HALF.test(ch)) return TYPE_SPEED_MS * 4;
  return TYPE_SPEED_MS;
}

export default function DialogueBox({
  speakerName,
  chino,
  pinyin,
  traduccion,
  dificultad = 'normal',  // facil | normal | dificil
  onAdvance,
  isLast = false,
  speak,                  // (text, opts) => Promise — TTS de la app
}) {
  const { t } = useTranslation();
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  const [showPinyin, setShowPinyin] = useState(dificultad === 'facil');
  const [showEs, setShowEs] = useState(false);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // reset al cambiar de frase
    setShown('');
    setDone(false);
    setShowPinyin(dificultad === 'facil');
    setShowEs(false);
    setPlaying(false);

    // Cancelar cualquier TTS en curso al cambiar de frase
    try { window.speechSynthesis?.cancel?.(); } catch {}

    let i = 0;
    const chars = Array.from(chino || '');
    const tick = () => {
      i += 1;
      setShown(chars.slice(0, i).join(''));
      if (i >= chars.length) {
        setDone(true);
        return;
      }
      timerRef.current = setTimeout(tick, delayAfter(chars[i - 1]));
    };
    timerRef.current = setTimeout(tick, TYPE_SPEED_MS);

    return () => {
      clearTimeout(timerRef.current);
      try { window.speechSynthesis?.cancel?.(); } catch {}
    };
  }, [chino, dificultad]);

  const handlePlay = async (e) => {
    e.stopPropagation();
    if (!speak || playing) return;
    setPlaying(true);
    try {
      await speak({ hanzi: chino, pinyin }, { category: 'pronunciation' });
    } catch (_) {}
    setPlaying(false);
  };

  const completeNow = () => {
    clearTimeout(timerRef.current);
    setShown(chino);
    setDone(true);
  };

  const handleClick = () => {
    if (!done) {
      completeNow();
      return;
    }
    // Si ya está completo: tap principal avanza.
    onAdvance?.();
  };

  // En modo normal, pulsar el chino revela el pinyin (sin avanzar).
  const handleChineseClick = (e) => {
    if (dificultad === 'normal' && !showPinyin) {
      e.stopPropagation();
      setShowPinyin(true);
    }
  };

  const pinyinVisible = dificultad === 'facil' || (dificultad === 'normal' && showPinyin);
  const pinyinAllowed = dificultad !== 'dificil';

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
      style={{
        background: 'rgba(20, 16, 12, 0.78)',
        border: `1px solid ${J.hairS}`,
        borderRadius: 18,
        padding: '18px 18px 14px',
        color: J.onAccent,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Cabecera: nombre del personaje + botón de audio */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
      }}>
        <div style={{
          display: 'inline-block',
          background: J.jade,
          color: J.onAccent,
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.04em',
          padding: '3px 10px',
          borderRadius: 999,
        }}>
          {speakerName}
        </div>
        {speak && (
          <button
            onClick={handlePlay}
            aria-label="Escuchar frase"
            title="Escuchar"
            disabled={playing}
            style={{
              background: playing ? J.red : 'rgba(255,255,255,0.10)',
              border: `1px solid ${playing ? J.redDeep : 'rgba(255,255,255,0.18)'}`,
              color: J.onAccent,
              borderRadius: 999,
              width: 30, height: 30,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: playing ? 'default' : 'pointer',
              padding: 0,
              transition: 'background 200ms ease, border 200ms ease',
            }}
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2.4" strokeLinecap="round" className="story-spin">
                <path d="M21 12a9 9 0 1 1-6.2-8.55" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 5L6 9H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h3l5 4a1 1 0 0 0 1-.8V5.8a1 1 0 0 0-1-.8z"/>
                <path d="M15.5 8.5a4.5 4.5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
                <path d="M18 5a8 8 0 0 1 0 14" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Frase china */}
      <p
        onClick={handleChineseClick}
        className="font-cn"
        style={{
          fontSize: 26,
          lineHeight: 1.35,
          fontWeight: 600,
          color: J.onAccent,
          margin: 0,
          minHeight: 36,
        }}
      >
        {shown}
        {!done && (
          <span style={{ opacity: 0.7, marginLeft: 2, animation: 'story-caret 0.9s steps(2) infinite' }}>▍</span>
        )}
      </p>

      {/* Pinyin */}
      {pinyinAllowed && (
        <p style={{
          margin: '6px 0 0',
          fontSize: 14,
          color: pinyinVisible ? 'rgba(240,200,98,0.95)' : 'rgba(255,255,255,0.35)',
          fontStyle: 'italic',
          minHeight: 18,
        }}>
          {pinyinVisible ? pinyin : (dificultad === 'normal' ? t('story_tap_pinyin_hint', '· toca el chino para ver el pinyin ·') : '')}
        </p>
      )}

      {/* Traducción */}
      <div style={{ marginTop: 8 }}>
        {showEs ? (
          <p style={{ margin: 0, fontSize: 13.5, color: 'rgba(255,255,255,0.75)' }}>
            {traduccion}
          </p>
        ) : (
          <button
            onClick={(e) => { e.stopPropagation(); setShowEs(true); }}
            style={{
              background: 'transparent',
              border: `1px dashed rgba(255,255,255,0.25)`,
              color: 'rgba(255,255,255,0.5)',
              borderRadius: 8,
              padding: '4px 10px',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            {t('story_show_translation', 'mostrar traducción')}
          </button>
        )}
      </div>

      {/* Hint avance */}
      <div style={{
        marginTop: 12,
        textAlign: 'right',
        fontSize: 11,
        color: 'rgba(255,255,255,0.45)',
        letterSpacing: '0.08em',
      }}>
        {done
          ? (isLast ? t('story_tap_finish', 'TOCA PARA TERMINAR ▸') : t('story_tap_continue', 'TOCA PARA CONTINUAR ▸'))
          : t('story_tap_skip', 'TOCA PARA SALTAR ▸')}
      </div>

      <style>{`
        @keyframes story-caret { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        @keyframes story-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .story-spin { animation: story-spin 900ms linear infinite; }
      `}</style>
    </div>
  );
}
