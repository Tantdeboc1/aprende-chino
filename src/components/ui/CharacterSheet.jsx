// src/components/ui/CharacterSheet.jsx
// Bottom-sheet con trazos animados HanziWriter al tocar una entrada del diccionario
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { J, resolveColor } from '@/styles/tokens';
import { hanziCharDataLoader } from '@/utils/hanziCharData.js';
import { useExitAnimation } from '@/hooks/useExitAnimation.js';

const LESSON_BADGE = {
  1: { bg: J.redBg, fg: J.redDeep, border: J.red },
  2: { bg: J.sandBg, fg: J.sandDeep, border: J.sand },
  3: { bg: J.sandBg2, fg: J.sandDeep, border: J.sand },
  4: { bg: J.jadeBg, fg: J.jadeDeep, border: J.jade },
};

function HanziWriterCanvas({ char }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const writerRef    = useRef(null);
  const [status, setStatus]   = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    if (!char || !containerRef.current) return;
    setStatus('loading');
    writerRef.current = null;

    let cancelled = false;
    // Host imperativo (ver HomeScreen): HanziWriter pinta su SVG en este div,
    // fuera del control de React, para evitar el 'removeChild' al cerrar la hoja.
    const host = document.createElement('div');
    containerRef.current.appendChild(host);

    import('hanzi-writer').then(({ default: HanziWriter }) => {
      if (cancelled) return;
      try {
        const writer = HanziWriter.create(host, char, {
          charDataLoader: hanziCharDataLoader,
          width: 180,
          height: 180,
          padding: 10,
          strokeColor: resolveColor(J.ink),
          radicalColor: resolveColor(J.red),
          outlineColor: resolveColor(J.mute2),
          drawingWidth: 4,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 100,
          showCharacter: false,
          showOutline: true,
          onLoadCharDataSuccess: () => {
            if (!cancelled) {
              setStatus('ready');
              writer.animateCharacter();
            }
          },
          onLoadCharDataError: () => {
            if (!cancelled) setStatus('error');
          },
        });
        writerRef.current = writer;
      } catch {
        if (!cancelled) setStatus('error');
      }
    }).catch(() => {
      if (!cancelled) setStatus('error');
    });

    return () => {
      cancelled = true;
      try { writerRef.current?.pauseAnimation?.(); } catch { /* noop */ }
      try { host.remove(); } catch { /* noop */ }
    };
  }, [char]);

  const handleAnimate = () => {
    writerRef.current?.animateCharacter();
  };

  const handleReset = () => {
    writerRef.current?.cancelAnimation();
    writerRef.current?.hideCharacter();
    setTimeout(() => writerRef.current?.animateCharacter(), 100);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Canvas HanziWriter */}
        <div
          ref={containerRef}
          className="w-[180px] h-[180px] rounded-2xl flex items-center justify-center"
          style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}
        />
        {/* Overlay loading / error */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(244,236,220,0.8)' }}>
            <div className="w-6 h-6 rounded-full animate-spin" style={{ border: `2px solid ${J.jade}`, borderTopColor: 'transparent' }} />
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(244,236,220,0.8)' }}>
            <span className="text-4xl font-bold font-cn" style={{ color: J.ink }}>{char}</span>
          </div>
        )}
      </div>

      {/* Controles */}
      {status === 'ready' && (
        <div className="flex gap-2">
          <button
            onClick={handleAnimate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            style={{ background: J.jadeBg, color: J.jadeDeep, border: `1px solid ${J.jade}`, cursor: 'pointer' }}
          >
            <span className="font-cn">播</span> {t('charsheet_animate', 'Animar')}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            style={{ background: J.paperHi, color: J.inkSoft, border: `1px solid ${J.hair}`, cursor: 'pointer' }}
          >
            <span className="font-cn">重</span> {t('charsheet_repeat', 'Repetir')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CharacterSheet({ char, onClose, onSpeak, onToggleFavorite, isFav, progress }) {
  const { t } = useTranslation();
  const sheetRef = useRef(null);
  // Cierre animado: el sheet baja y el backdrop se funde antes de desmontar.
  const { closing, requestClose } = useExitAnimation(onClose, 200);

  // Cerrar al hacer tap fuera
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) requestClose();
  };

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') requestClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [requestClose]);

  if (!char) return null;

  const srsData     = progress?.__srs?.[char.char] || null;
  const masteredAt  = srsData?.interval >= 21;
  const isPending   = srsData?.nextReview != null && srsData.nextReview <= Date.now();

  const badge = LESSON_BADGE[char.lesson] || LESSON_BADGE[1];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center j-fade-in"
      style={{
        background: 'rgba(28,24,19,0.5)',
        transition: 'opacity 200ms ease',
        opacity: closing ? 0 : 1,
      }}
      onClick={handleBackdrop}
    >
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`w-full max-w-lg rounded-t-3xl px-5 pt-4 pb-8 ${closing ? 'j-slide-down' : 'animate-slide-up'}`}
        style={{ maxHeight: '90dvh', overflowY: 'auto', background: J.paper, borderTop: `1px solid ${J.hair}` }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: J.mute2 }} />

        {/* Header: badges + cerrar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {char.lesson && (
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
                background: badge.bg, color: badge.fg, border: `1px solid ${badge.border}`,
              }}>
                L{char.lesson}
              </span>
            )}
            {char.isSupplementary && (
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
                background: J.sandBg, color: J.sandDeep, border: `1px solid ${J.sand}`,
              }}>extra</span>
            )}
            {masteredAt && (
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
                background: J.jadeBg, color: J.jadeDeep, border: `1px solid ${J.jade}`,
              }}>Dominado</span>
            )}
            {isPending && (
              <span className="animate-pulse" style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
                background: J.sandBg, color: J.sandDeep, border: `1px solid ${J.sand}`,
              }}>Pendiente</span>
            )}
          </div>
          <button
            onClick={requestClose}
            aria-label="Cerrar"
            className="p-1"
            style={{ color: J.mute, background: 'none', border: 0, cursor: 'pointer', fontSize: 20, fontWeight: 700 }}
          >
            ×
          </button>
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col items-center gap-5">

          {/* HanziWriter */}
          <HanziWriterCanvas char={char.char} />

          {/* Pinyin + audio + favorito */}
          <div className="w-full flex items-center justify-between px-2">
            <div>
              <p className="text-2xl font-semibold" style={{ color: J.jade }}>{char.pinyin}</p>
              <p className="text-xs mt-0.5" style={{ color: J.mute }}>{char.type || t('charsheet_type_noun')}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSpeak?.(char)}
                className="font-cn p-2.5 rounded-full transition-colors"
                style={{ background: J.jadeBg, color: J.jadeDeep, border: 0, cursor: 'pointer', fontSize: 16, fontWeight: 700 }}
              >
                声
              </button>
              <button
                onClick={() => onToggleFavorite?.(char.char)}
                className="font-cn p-2.5 rounded-full transition-colors"
                style={{
                  background: isFav ? J.sandBg : J.paperHi, border: 0, cursor: 'pointer',
                  color: isFav ? J.red : J.mute2, fontSize: 16, fontWeight: 700,
                }}
              >
                收
              </button>
            </div>
          </div>

          {/* Significado */}
          <div className="w-full rounded-2xl p-4 text-center" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: J.mute }}>{t('charsheet_meaning_header', 'Significado')}</p>
            <p className="text-xl font-bold leading-snug" style={{ color: J.ink }}>{char.meaning}</p>
          </div>

          {/* Radical + ejemplos */}
          <div className="w-full space-y-3">
            {char.radical && char.radical !== '—' && (
              <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
                <span className="text-sm" style={{ color: J.mute }}>{t('dictionary_radical', 'Radical')}</span>
                <span className="text-3xl font-cn" style={{ color: J.ink }}>{char.radical}</span>
              </div>
            )}
            {char.examples?.length > 0 && (
              <div className="rounded-xl px-4 py-3" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
                <p className="text-xs mb-2" style={{ color: J.mute }}>{t('charsheet_examples', 'Ejemplos')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {char.examples.map((ex, i) => (
                    <span key={i} className="text-sm px-2.5 py-1 rounded-lg" style={{ background: J.paper, color: J.ink }}>{ex}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
