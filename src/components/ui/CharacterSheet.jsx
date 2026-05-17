// src/components/ui/CharacterSheet.jsx
// Bottom-sheet con trazos animados HanziWriter al tocar una entrada del diccionario
import { useEffect, useRef, useState } from 'react';
import { Volume2, Star, X, Play, RotateCcw, Clock, TrendingUp, Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LESSON_BADGE = {
  1: 'bg-red-900 text-red-300 border border-red-700',
  2: 'bg-orange-900 text-orange-300 border border-orange-700',
  3: 'bg-yellow-900 text-yellow-300 border border-yellow-700',
  4: 'bg-green-900 text-green-300 border border-green-700',
};

function HanziWriterCanvas({ char }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const writerRef    = useRef(null);
  const [status, setStatus]   = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    if (!char || !containerRef.current) return;
    setStatus('loading');

    // Limpiar instancia anterior
    if (containerRef.current) containerRef.current.innerHTML = '';
    writerRef.current = null;

    let cancelled = false;

    import('hanzi-writer').then(({ default: HanziWriter }) => {
      if (cancelled || !containerRef.current) return;
      try {
        const writer = HanziWriter.create(containerRef.current, char, {
          width: 180,
          height: 180,
          padding: 10,
          strokeColor: '#f3f4f6',
          radicalColor: '#f87171',
          outlineColor: '#374151',
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

    return () => { cancelled = true; };
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
          className="w-[180px] h-[180px] bg-gray-800 rounded-2xl border border-gray-700 flex items-center justify-center"
        />
        {/* Overlay loading / error */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-800/80">
            <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-800/80">
            <span className="text-4xl text-white font-bold">{char}</span>
          </div>
        )}
      </div>

      {/* Controles */}
      {status === 'ready' && (
        <div className="flex gap-2">
          <button
            onClick={handleAnimate}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 border border-red-700/50 text-red-300 text-xs font-semibold transition hover:bg-red-900/60"
          >
            <Play className="w-3 h-3" /> {t('charsheet_animate')}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-700 border border-gray-600 text-gray-300 text-xs font-semibold transition hover:bg-gray-600"
          >
            <RotateCcw className="w-3 h-3" /> {t('charsheet_repeat')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function CharacterSheet({ char, onClose, onSpeak, onToggleFavorite, isFav, progress }) {
  const { t, i18n } = useTranslation();
  const sheetRef = useRef(null);

  // Cerrar al hacer tap fuera
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!char) return null;

  const srsData    = progress?.__srs?.[char.char] || null;
  const masteredAt = srsData?.interval >= 21;
  const isPending  = srsData?.nextReview != null && srsData.nextReview <= Date.now();

  // ── Cálculo de info SRS para mostrar al usuario ──────────────────────────────
  const srsInfo = (() => {
    if (!srsData || srsData.nextReview == null) return null;
    const now = Date.now();
    const msLeft = srsData.nextReview - now;
    const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
    // Progreso de madurez: 0..21 días → 0..100%
    const maturityPct = Math.min(100, Math.round((srsData.interval / 21) * 100));
    // Etiqueta del estado
    let statusLabel, statusColor;
    if (isPending) {
      statusLabel = t('srs_status_due', '¡Repasar ahora!');
      statusColor = 'text-yellow-400';
    } else if (masteredAt) {
      statusLabel = t('srs_status_mastered', 'Dominada');
      statusColor = 'text-green-400';
    } else {
      statusLabel = daysLeft === 1
        ? t('srs_status_tomorrow', 'Mañana')
        : t('srs_status_days', 'En {{n}} días', { n: daysLeft });
      statusColor = 'text-blue-400';
    }
    return { daysLeft, maturityPct, statusLabel, statusColor, interval: srsData.interval, repetitions: srsData.repetitions };
  })();

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={handleBackdrop}
    >
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="w-full max-w-lg bg-gray-900 border-t border-gray-700 rounded-t-3xl px-5 pt-4 pb-8 animate-slide-up"
        style={{ maxHeight: '90dvh', overflowY: 'auto' }}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-5" />

        {/* Header: badges + cerrar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {char.lesson && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${LESSON_BADGE[char.lesson] || ''}`}>
                L{char.lesson}
              </span>
            )}
            {char.isSupplementary && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900 text-purple-300 border border-purple-700 font-semibold">extra</span>
            )}
            {masteredAt && <span className="text-xs px-2 py-0.5 rounded-full bg-green-900 text-green-300 border border-green-700 font-semibold">{t('charsheet_mastered_badge')}</span>}
            {isPending  && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-900 text-yellow-300 border border-yellow-700 font-semibold animate-pulse">{t('charsheet_pending_badge')}</span>}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col items-center gap-5">

          {/* HanziWriter */}
          <HanziWriterCanvas char={char.char} />

          {/* Pinyin + audio + favorito */}
          <div className="w-full flex items-center justify-between px-2">
            <div>
              <p className="text-2xl text-white font-semibold">{char.pinyin}</p>
              <p className="text-xs text-gray-500 mt-0.5">{char.type || t('charsheet_default_type')}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onSpeak?.(char)}
                className="p-2.5 rounded-full bg-green-800/60 hover:bg-green-700/60 text-green-300 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => onToggleFavorite?.(char.char)}
                className={`p-2.5 rounded-full transition-colors ${isFav ? 'bg-yellow-800/60 text-yellow-300' : 'bg-gray-700/60 text-gray-500 hover:text-yellow-400'}`}
              >
                <Star className="w-5 h-5" fill={isFav ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Significado */}
          <div className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{t('charsheet_meaning_header')}</p>
            <p className="text-xl text-white font-bold leading-snug">{char.meanings?.[i18n.language] || char.meaning}</p>
          </div>

          {/* Radical + ejemplos */}
          <div className="w-full space-y-3">
            {char.radical && char.radical !== '—' && (
              <div className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                <span className="text-sm text-gray-400">{t('dictionary_radical', 'Radical')}</span>
                <span className="text-3xl text-gray-200">{char.radical}</span>
              </div>
            )}
            {char.examples?.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3">
                <p className="text-xs text-gray-500 mb-2">{t('charsheet_examples')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {char.examples.map((ex, i) => (
                    <span key={i} className="text-sm bg-gray-700 text-gray-200 px-2.5 py-1 rounded-lg">{ex}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel SRS — solo si el carácter ya ha sido estudiado */}
          {srsInfo ? (
            <div className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 space-y-3">
              <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{t('srs_panel_title', 'Repetición espaciada')}</p>

              {/* Fila: próxima revisión + repeticiones */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className={`text-sm font-semibold ${srsInfo.statusColor}`}>{srsInfo.statusLabel}</p>
                    {!isPending && (
                      <p className="text-xs text-gray-500">
                        {t('srs_interval_label', 'Intervalo: {{n}} días', { n: srsInfo.interval })}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-gray-700/60 rounded-lg px-2.5 py-1">
                  <Brain className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs text-gray-300 font-semibold">
                    {srsInfo.repetitions}× {t('srs_repetitions_label', 'repaso')}
                  </span>
                </div>
              </div>

              {/* Barra de madurez */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500">{t('srs_maturity_label', 'Madurez')}</span>
                  </div>
                  <span className={`text-xs font-bold ${masteredAt ? 'text-green-400' : 'text-gray-400'}`}>
                    {srsInfo.maturityPct}%
                  </span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      masteredAt ? 'bg-green-500' : srsInfo.maturityPct > 50 ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${srsInfo.maturityPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-600 mt-1">
                  {masteredAt
                    ? t('srs_mature_note', '✓ Carácter dominado (intervalo ≥21 días)')
                    : t('srs_maturing_note', 'Se considera dominado con intervalo ≥21 días')
                  }
                </p>
              </div>
            </div>
          ) : (
            /* Carácter aún no estudiado */
            <div className="w-full bg-gray-800/50 border border-dashed border-gray-700 rounded-2xl px-4 py-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <p className="text-xs text-gray-600">{t('srs_not_studied', 'Aún no estudiado — practica en una lección para añadirlo al repaso espaciado')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
