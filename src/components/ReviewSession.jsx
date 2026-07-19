// src/components/ReviewSession.jsx
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { updateSRS, getDueCards, getWeakCards } from '@/utils/srs.js';
import { markDailyActivity, addXP } from '@/utils/streak.js';
import { shuffle } from '@/utils/arrayUtils.js';
import ProfileBadge from '@/components/ui/ProfileBadge.jsx';

// ─── Selección de modo ────────────────────────────────────────────────────────
function ModeSelector({ dueCount, weakCount, onSelect, goBack, t }) {
  const bothEmpty = dueCount === 0 && weakCount === 0;

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: J.paper }}>
      {/* Header */}
      <div style={{
        background: J.jade, color: J.onAccent,
        borderLeft: `4px solid ${J.jadeDeep}`,
        padding: '40px 16px 16px',
      }}>
        <div className="flex items-start justify-between mb-3">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm"
            style={{ color: 'rgba(255,255,255,0.7)', background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}
          >
            <span>←</span> {t('srs_back', 'Volver')}
          </button>
          <ProfileBadge variant="dark" />
        </div>
        <h1 className="text-xl font-bold" style={{ color: J.onAccent }}>
          {t('srs_mode_title', '¿Qué tipo de repaso?')}
        </h1>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 gap-4 max-w-sm mx-auto w-full">
        {bothEmpty ? (
          /* Sin nada en el SRS — estado vacío motivacional */
          <div className="text-center py-8 px-4">
            {/* CJK icon */}
            <div className="font-cn mx-auto mb-6 flex items-center justify-center"
              style={{ width: 80, height: 80, borderRadius: 20, background: J.jadeBg, color: J.jade, fontSize: 42, fontWeight: 700 }}>
              复
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: J.ink }}>
              {t('srs_mode_empty', 'Sin palabras en el SRS todavía')}
            </h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: J.inkSoft }}>
              {t('srs_mode_empty_desc', 'Completa algunas lecciones o quizzes primero')}
            </p>
            <div className="rounded-xl p-4 text-left space-y-2" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: J.mute }}>{t('srs_how_to_start')}</p>
              <div className="flex items-start gap-3">
                <span className="font-cn text-lg" style={{ color: J.jade, fontWeight: 700 }}>一</span>
                <p className="text-sm" style={{ color: J.inkSoft }}>{t('srs_start_step_1')}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-cn text-lg" style={{ color: J.jade, fontWeight: 700 }}>二</span>
                <p className="text-sm" style={{ color: J.inkSoft }}>{t('srs_start_step_2')}</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="font-cn text-lg" style={{ color: J.jade, fontWeight: 700 }}>三</span>
                <p className="text-sm" style={{ color: J.inkSoft }}>{t('srs_start_step_3')}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Opción A: Pendientes */}
            <button
              onClick={() => dueCount > 0 && onSelect('due')}
              className="w-full p-5 rounded-2xl text-left transition-all active:scale-[0.98]"
              style={{
                background: J.paperHi,
                border: `2px solid ${dueCount > 0 ? J.red : J.hair}`,
                opacity: dueCount > 0 ? 1 : 0.5,
                cursor: dueCount > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-cn text-2xl" style={{ color: J.red, fontWeight: 700 }}>复</span>
                    <span className="font-bold text-base" style={{ color: J.ink }}>
                      {t('srs_mode_due_title', 'Pendientes')}
                    </span>
                  </div>
                  <p className="text-sm leading-snug" style={{ color: J.inkSoft }}>
                    {dueCount > 0
                      ? t('srs_mode_due_count', '{{count}} tarjetas vencidas hoy', { count: dueCount })
                      : t('srs_mode_due_empty', 'Sin repasos pendientes ahora')}
                  </p>
                  <p className="text-xs mt-1" style={{ color: J.mute }}>{t('srs_due_algorithm_hint')}</p>
                </div>
                {dueCount > 0 && (
                  <span className="font-bold text-lg px-3 py-1 rounded-xl flex-shrink-0"
                    style={{ background: J.redBg, color: J.redDeep }}>
                    {dueCount}
                  </span>
                )}
              </div>
            </button>

            {/* Opción B: Palabras débiles */}
            <button
              onClick={() => weakCount > 0 && onSelect('weak')}
              className="w-full p-5 rounded-2xl text-left transition-all active:scale-[0.98]"
              style={{
                background: J.paperHi,
                border: `2px solid ${weakCount > 0 ? J.sand : J.hair}`,
                opacity: weakCount > 0 ? 1 : 0.5,
                cursor: weakCount > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-cn text-2xl" style={{ color: J.sand, fontWeight: 700 }}>弱</span>
                    <span className="font-bold text-base" style={{ color: J.ink }}>
                      {t('srs_mode_weak_title', 'Palabras débiles')}
                    </span>
                  </div>
                  <p className="text-sm leading-snug" style={{ color: J.inkSoft }}>
                    {t('srs_mode_weak_desc', 'Ignora el calendario — repasa las que más te cuestan')}
                  </p>
                  <p className="text-xs mt-1" style={{ color: J.mute }}>
                    {t('srs_mode_weak_count', 'Top {{count}} con peor puntuación', { count: weakCount })}
                  </p>
                </div>
                {weakCount > 0 && (
                  <span className="font-bold text-lg px-3 py-1 rounded-xl flex-shrink-0"
                    style={{ background: J.sandBg, color: J.sandDeep }}>
                    {weakCount}
                  </span>
                )}
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Tarjeta de flashcard ────────────────────────────────────────────────────
function FlashCard({ word, isFlipped, onFlip, speakChinese, mode }) {
  const { t } = useTranslation();
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
      {!isFlipped ? (
        /* FRONTAL — solo carácter */
        <button
          onClick={onFlip}
          className="w-full max-w-sm aspect-square rounded-2xl flex flex-col items-center justify-center gap-4 active:scale-[0.98] transition-all"
          style={{
            background: J.paperHi, border: `2px solid ${J.hair}`,
            boxShadow: `0 8px 24px -8px ${J.hairS}`, cursor: 'pointer',
          }}
        >
          <span className="text-8xl font-bold font-cn leading-none" style={{ color: J.ink }}>{word.char}</span>
          <span className="text-sm mt-2" style={{ color: J.mute }}>{t('srs_tap_to_reveal')}</span>
        </button>
      ) : (
        /* REVERSO — pinyin + significado + ejemplos */
        <div className="w-full max-w-sm rounded-2xl overflow-hidden"
          style={{ background: J.paperHi, border: `2px solid ${J.jade}`, boxShadow: `0 8px 24px -8px ${J.hairS}` }}>
          {/* Carácter + pinyin */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3" style={{ borderBottom: `1px solid ${J.hair}` }}>
            <div>
              <span className="text-5xl font-bold font-cn" style={{ color: J.ink }}>{word.char}</span>
              <p className="text-lg font-medium mt-1" style={{ color: J.jade }}>{word.pinyin}</p>
            </div>
            <button
              onClick={() => speakChinese?.({ hanzi: word.char, pinyin: word.pinyin })}
              className="font-cn w-11 h-11 rounded-full flex items-center justify-center text-xl transition-colors"
              style={{ background: J.jadeBg, color: J.jadeDeep, border: 0, cursor: 'pointer', fontWeight: 700 }}
              title="Escuchar de nuevo"
            >
              声
            </button>
          </div>

          {/* Significado */}
          <div className="px-5 py-3" style={{ borderBottom: `1px solid ${J.hair}` }}>
            {word.type && (
              <span className="text-xs px-2 py-0.5 rounded mb-2 inline-block"
                style={{ background: J.sandBg, color: J.sandDeep }}>{word.type}</span>
            )}
            <p className="text-xl font-semibold" style={{ color: J.ink }}>{word.meaning}</p>
          </div>

          {/* Ejemplos */}
          {word.examples?.length > 0 && (
            <div className="px-5 py-3">
              <p className="text-xs mb-2" style={{ color: J.mute }}>Ejemplos</p>
              <div className="space-y-1.5">
                {word.examples.slice(0, 2).map((ex, i) => (
                  <p key={i} className="text-sm rounded-lg px-3 py-1.5" style={{ background: J.paper, color: J.ink }}>{ex}</p>
                ))}
              </div>
            </div>
          )}

          {/* Badge modo débil */}
          {mode === 'weak' && word._easeFactor && (
            <div className="px-5 pb-3">
              <span className="text-xs" style={{ color: J.sand }}>
                EF: {word._easeFactor.toFixed(2)} · Debilidad del SRS
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Botones de evaluación ───────────────────────────────────────────────────
function RatingButtons({ onRate }) {
  const { t } = useTranslation();
  return (
    <div className="px-4 pb-6 pt-2">
      <p className="text-center text-xs mb-3" style={{ color: J.mute }}>{t('srs_rate_prompt', '¿Cómo de bien lo recordabas?')}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onRate(0)}
          className="flex-1 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all"
          style={{ background: J.redBg, border: `1px solid ${J.red}`, color: J.redDeep, cursor: 'pointer' }}
        >
          {t('srs_again', 'Otra vez')}
          <span className="block text-xs font-normal opacity-70 mt-0.5">{t('srs_again_hint', 'No lo recuerdo')}</span>
        </button>
        <button
          onClick={() => onRate(3)}
          className="flex-1 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all"
          style={{ background: J.sandBg, border: `1px solid ${J.sand}`, color: J.sandDeep, cursor: 'pointer' }}
        >
          {t('srs_hard', 'Difícil')}
          <span className="block text-xs font-normal opacity-70 mt-0.5">{t('srs_hard_hint', 'Con esfuerzo')}</span>
        </button>
        <button
          onClick={() => onRate(4)}
          className="flex-1 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all"
          style={{ background: J.jadeBg, border: `1px solid ${J.jade}`, color: J.jadeDeep, cursor: 'pointer' }}
        >
          {t('srs_good', 'Bien')}
          <span className="block text-xs font-normal opacity-70 mt-0.5">{t('srs_good_hint', 'Lo sabía')}</span>
        </button>
        <button
          onClick={() => onRate(5)}
          className="flex-1 py-3 rounded-xl font-bold text-sm active:scale-95 transition-all"
          style={{ background: J.jadeBg, border: `1px solid ${J.jadeDeep}`, color: J.jadeDeep, cursor: 'pointer' }}
        >
          {t('srs_easy', 'Fácil')}
          <span className="block text-xs font-normal opacity-70 mt-0.5">{t('srs_easy_hint', 'Inmediato')}</span>
        </button>
      </div>
    </div>
  );
}

// ─── Pantalla de resultados ──────────────────────────────────────────────────
function ResultScreen({ stats, mode, onFinish, onReviewAgain, t }) {
  const { again, hard, good, easy, total } = stats;
  const correctPct = total > 0 ? Math.round(((good + easy) / total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 pb-24" style={{ background: J.paper }}>
      <div className="w-full max-w-sm">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="font-cn mx-auto mb-3 flex items-center justify-center"
            style={{
              width: 64, height: 64, borderRadius: 16, fontWeight: 700, fontSize: 36,
              background: correctPct >= 80 ? J.jadeBg : correctPct >= 50 ? J.sandBg : J.redBg,
              color: correctPct >= 80 ? J.jade : correctPct >= 50 ? J.sand : J.red,
            }}>
            {correctPct >= 80 ? '优' : correctPct >= 50 ? '良' : '练'}
          </div>
          <h2 className="text-2xl font-bold" style={{ color: J.ink }}>
            {t('srs_results_title', 'Sesión completada')}
          </h2>
          <p className="text-sm mt-1" style={{ color: J.inkSoft }}>
            {total} {t('srs_cards_reviewed', 'tarjetas repasadas')}
            {mode === 'weak' && <span className="ml-1" style={{ color: J.sand }}>{t('srs_mode_weak_badge')}</span>}
          </p>
        </div>

        {/* Stats */}
        <div className="rounded-2xl p-5 mb-6 space-y-3" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: J.inkSoft }}>{t('srs_again', 'Otra vez')}</span>
            <span className="font-bold text-lg" style={{ color: J.red }}>{again}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: J.inkSoft }}>{t('srs_hard', 'Difícil')}</span>
            <span className="font-bold text-lg" style={{ color: J.sand }}>{hard}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: J.inkSoft }}>{t('srs_good', 'Bien')}</span>
            <span className="font-bold text-lg" style={{ color: J.jade }}>{good}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: J.inkSoft }}>{t('srs_easy', 'Fácil')}</span>
            <span className="font-bold text-lg" style={{ color: J.jadeDeep }}>{easy}</span>
          </div>
          <div className="pt-3 flex justify-between items-center" style={{ borderTop: `1px solid ${J.hair}` }}>
            <span className="font-semibold text-sm" style={{ color: J.ink }}>{t('srs_accuracy', 'Precisión')}</span>
            <span className="font-bold text-xl" style={{ color: J.ink }}>{correctPct}%</span>
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-2">
          {again > 0 && (
            <button
              onClick={onReviewAgain}
              className="w-full py-3 rounded-xl font-bold text-sm active:scale-[0.98] transition-all"
              style={{ background: J.red, color: J.onAccent, border: 0, cursor: 'pointer' }}
            >
              {t('srs_review_again', 'Repasar las que fallé')} ({again})
            </button>
          )}
          <button
            onClick={onFinish}
            className="w-full py-3 rounded-xl font-semibold text-sm active:scale-[0.98] transition-all"
            style={{ background: J.paperHi, color: J.inkSoft, border: `1px solid ${J.hair}`, cursor: 'pointer' }}
          >
            {t('srs_finish', 'Terminar')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function ReviewSession({
  allCharacters,
  progress,
  onProgressChange,
  goBack,
  speakChinese,
}) {
  const { t } = useTranslation();

  // Precalcular las dos colas al montar (no cambian durante la sesión)
  const dueQueue  = useMemo(() => shuffle(getDueCards(progress, allCharacters)), []); // eslint-disable-line
  const weakQueue = useMemo(() => getWeakCards(progress, allCharacters, 20), []); // eslint-disable-line

  // ── Estado de la sesión ──────────────────────────────────────────────────
  const [phase,   setPhase]   = useState('select'); // 'select' | 'playing'
  const [mode,    setMode]    = useState(null);      // 'due' | 'weak'
  const [queue,   setQueue]   = useState([]);
  const [index,   setIndex]   = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [done,    setDone]    = useState(false);
  const [stats,   setStats]   = useState({ again: 0, hard: 0, good: 0, easy: 0, total: 0 });
  const [failedQueue, setFailedQueue] = useState([]);

  const current = queue[index] || null;
  const total   = queue.length;

  // ── Iniciar sesión con el modo elegido ────────────────────────────────────
  const handleSelectMode = useCallback((selectedMode) => {
    const q = selectedMode === 'due' ? dueQueue : weakQueue;
    setMode(selectedMode);
    setQueue(q);
    setIndex(0);
    setFlipped(false);
    setDone(false);
    setStats({ again: 0, hard: 0, good: 0, easy: 0, total: 0 });
    setFailedQueue([]);
    setPhase('playing');
  }, [dueQueue, weakQueue]);

  // ── Voltear tarjeta + audio automático ────────────────────────────────────
  const handleFlip = useCallback(() => {
    if (!current) return;
    setFlipped(true);
    speakChinese?.({ hanzi: current.char, pinyin: current.pinyin });
  }, [current, speakChinese]);

  // ── Evaluar tarjeta ───────────────────────────────────────────────────────
  const handleRate = useCallback((quality) => {
    if (!current) return;
    markDailyActivity();
    // Recordar la tarjeta (bien/fácil) cuenta como acierto de estudio,
    // igual que en el % de acierto del resumen (good + easy).
    if (quality >= 4) addXP(2);

    const updated = updateSRS(progress, current.char, quality);
    onProgressChange(updated);

    setStats(prev => {
      const label = quality === 0 ? 'again' : quality === 3 ? 'hard' : quality === 4 ? 'good' : 'easy';
      return { ...prev, [label]: prev[label] + 1, total: prev.total + 1 };
    });

    if (quality < 3) setFailedQueue(prev => [...prev, current]);

    const nextIndex = index + 1;
    if (nextIndex >= queue.length) {
      setDone(true);
    } else {
      setIndex(nextIndex);
      setFlipped(false);
    }
  }, [current, index, queue, progress, onProgressChange]);

  const handleReviewFailed = () => {
    setQueue(shuffle(failedQueue));
    setFailedQueue([]);
    setIndex(0);
    setFlipped(false);
    setDone(false);
    setStats({ again: 0, hard: 0, good: 0, easy: 0, total: 0 });
  };

  // ── Renderizado por fase ──────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <ModeSelector
        dueCount={dueQueue.length}
        weakCount={weakQueue.length}
        onSelect={handleSelectMode}
        goBack={goBack}
        t={t}
      />
    );
  }

  if (done) {
    return (
      <ResultScreen
        stats={stats}
        mode={mode}
        onFinish={goBack}
        onReviewAgain={handleReviewFailed}
        t={t}
      />
    );
  }

  const progressPct = total > 0 ? Math.round((index / total) * 100) : 0;
  const isWeak = mode === 'weak';

  return (
    <div className="min-h-screen flex flex-col pb-6" style={{ background: J.paper }}>
      {/* Header */}
      <div style={{
        background: isWeak ? J.sandBg : J.paperHi,
        borderBottom: `1px solid ${J.hair}`,
        padding: '40px 16px 12px',
      }}>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}
          >
            <span>←</span> {t('srs_back', 'Volver')}
          </button>
          <div className="flex items-center gap-2">
            {isWeak && <span className="font-cn" style={{ color: J.sand, fontWeight: 700 }}>弱</span>}
            <span className="text-sm font-medium" style={{ color: J.inkSoft }}>
              {index + 1} / {total}
            </span>
          </div>
        </div>
        {/* Barra de progreso */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: J.hair }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%`, background: isWeak ? J.sand : J.jade }}
          />
        </div>
      </div>

      {/* Tarjeta */}
      <FlashCard
        word={current}
        isFlipped={flipped}
        onFlip={handleFlip}
        speakChinese={speakChinese}
        mode={mode}
      />

      {/* Botones de evaluación / hint */}
      {flipped ? (
        <RatingButtons onRate={handleRate} />
      ) : (
        <div className="px-4 pb-6 pt-2 text-center">
          <p className="text-xs" style={{ color: J.mute }}>{t('srs_tap_to_reveal', 'Toca la tarjeta para ver la respuesta')}</p>
        </div>
      )}
    </div>
  );
}
