// src/components/ReviewSession.jsx
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { updateSRS, getDueCards, getWeakCards } from '@/utils/srs.js';
import { markDailyActivity } from '@/utils/streak.js';

// ─── Selección de modo ────────────────────────────────────────────────────────
function ModeSelector({ dueCount, weakCount, onSelect, goBack, t }) {
  const bothEmpty = dueCount === 0 && weakCount === 0;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 pt-10 pb-4 flex-shrink-0">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors mb-3"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          {t('srs_back', 'Volver')}
        </button>
        <h1 className="text-xl font-bold text-white">
          {t('srs_mode_title', '¿Qué tipo de repaso?')}
        </h1>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 gap-4 max-w-sm mx-auto w-full">
        {bothEmpty ? (
          /* Sin nada en el SRS */
          <div className="text-center py-10">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-xl font-bold text-white mb-2">
              {t('srs_mode_empty', 'Sin palabras en el SRS todavía')}
            </h2>
            <p className="text-gray-400 text-sm">
              {t('srs_mode_empty_desc', 'Completa algunas lecciones o quizzes primero')}
            </p>
          </div>
        ) : (
          <>
            {/* Opción A: Pendientes */}
            <button
              onClick={() => dueCount > 0 && onSelect('due')}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                dueCount > 0
                  ? 'bg-gray-800 border-red-500/50 hover:border-red-400 hover:bg-gray-750'
                  : 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">🎯</span>
                    <span className="text-white font-bold text-base">
                      {t('srs_mode_due_title', 'Pendientes')}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-snug">
                    {dueCount > 0
                      ? t('srs_mode_due_count', '{{count}} tarjetas vencidas hoy', { count: dueCount })
                      : t('srs_mode_due_empty', 'Sin repasos pendientes ahora')}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">Orden aleatorio · Algoritmo SM-2</p>
                </div>
                {dueCount > 0 && (
                  <span className="bg-red-500/20 text-red-400 font-bold text-lg px-3 py-1 rounded-xl flex-shrink-0">
                    {dueCount}
                  </span>
                )}
              </div>
            </button>

            {/* Opción B: Palabras débiles */}
            <button
              onClick={() => weakCount > 0 && onSelect('weak')}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98] ${
                weakCount > 0
                  ? 'bg-gray-800 border-orange-500/50 hover:border-orange-400 hover:bg-gray-750'
                  : 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">💔</span>
                    <span className="text-white font-bold text-base">
                      {t('srs_mode_weak_title', 'Palabras débiles')}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-snug">
                    {t('srs_mode_weak_desc', 'Ignora el calendario — repasa las que más te cuestan')}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    {t('srs_mode_weak_count', 'Top {{count}} con peor puntuación', { count: weakCount })}
                  </p>
                </div>
                {weakCount > 0 && (
                  <span className="bg-orange-500/20 text-orange-400 font-bold text-lg px-3 py-1 rounded-xl flex-shrink-0">
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
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
      {!isFlipped ? (
        /* FRONTAL — solo carácter */
        <button
          onClick={onFlip}
          className="w-full max-w-sm aspect-square bg-gray-800 border-2 border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-gray-500 active:scale-[0.98] transition-all shadow-xl"
        >
          <span className="text-8xl font-bold text-white leading-none">{word.char}</span>
          <span className="text-gray-500 text-sm mt-2">Toca para ver</span>
        </button>
      ) : (
        /* REVERSO — pinyin + significado + ejemplos */
        <div className="w-full max-w-sm bg-gray-800 border-2 border-gray-600 rounded-2xl overflow-hidden shadow-xl">
          {/* Carácter + pinyin */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-700">
            <div>
              <span className="text-5xl font-bold text-white">{word.char}</span>
              <p className="text-red-400 text-lg font-medium mt-1">{word.pinyin}</p>
            </div>
            <button
              onClick={() => speakChinese?.({ hanzi: word.char, pinyin: word.pinyin })}
              className="w-11 h-11 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xl transition-colors"
              title="Escuchar de nuevo"
            >
              🔊
            </button>
          </div>

          {/* Significado */}
          <div className="px-5 py-3 border-b border-gray-700">
            {word.type && (
              <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-400 mb-2 inline-block">{word.type}</span>
            )}
            <p className="text-white text-xl font-semibold">{word.meaning}</p>
          </div>

          {/* Ejemplos */}
          {word.examples?.length > 0 && (
            <div className="px-5 py-3">
              <p className="text-xs text-gray-500 mb-2">Ejemplos</p>
              <div className="space-y-1.5">
                {word.examples.slice(0, 2).map((ex, i) => (
                  <p key={i} className="text-sm text-gray-300 bg-gray-700/50 rounded-lg px-3 py-1.5">{ex}</p>
                ))}
              </div>
            </div>
          )}

          {/* Badge modo débil */}
          {mode === 'weak' && word._easeFactor && (
            <div className="px-5 pb-3">
              <span className="text-xs text-orange-400/70">
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
      <p className="text-center text-xs text-gray-500 mb-3">{t('srs_rate_prompt', '¿Cómo de bien lo recordabas?')}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onRate(0)}
          className="flex-1 py-3 rounded-xl bg-red-900/40 border border-red-700/50 text-red-400 font-bold text-sm active:scale-95 transition-all hover:bg-red-900/60"
        >
          {t('srs_again', 'Otra vez')}
          <span className="block text-xs font-normal opacity-70 mt-0.5">{t('srs_again_hint', 'No lo recuerdo')}</span>
        </button>
        <button
          onClick={() => onRate(3)}
          className="flex-1 py-3 rounded-xl bg-yellow-900/40 border border-yellow-700/50 text-yellow-400 font-bold text-sm active:scale-95 transition-all hover:bg-yellow-900/60"
        >
          {t('srs_hard', 'Difícil')}
          <span className="block text-xs font-normal opacity-70 mt-0.5">{t('srs_hard_hint', 'Con esfuerzo')}</span>
        </button>
        <button
          onClick={() => onRate(4)}
          className="flex-1 py-3 rounded-xl bg-green-900/40 border border-green-700/50 text-green-400 font-bold text-sm active:scale-95 transition-all hover:bg-green-900/60"
        >
          {t('srs_good', 'Bien')}
          <span className="block text-xs font-normal opacity-70 mt-0.5">{t('srs_good_hint', 'Lo sabía')}</span>
        </button>
        <button
          onClick={() => onRate(5)}
          className="flex-1 py-3 rounded-xl bg-blue-900/40 border border-blue-700/50 text-blue-400 font-bold text-sm active:scale-95 transition-all hover:bg-blue-900/60"
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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 pb-24">
      <div className="w-full max-w-sm">
        {/* Título */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">
            {correctPct >= 80 ? '🌟' : correctPct >= 50 ? '👍' : '💪'}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {t('srs_results_title', 'Sesión completada')}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {total} {t('srs_cards_reviewed', 'tarjetas repasadas')}
            {mode === 'weak' && <span className="ml-1 text-orange-400">· 💔 modo débiles</span>}
          </p>
        </div>

        {/* Stats */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{t('srs_again', 'Otra vez')}</span>
            <span className="text-red-400 font-bold text-lg">{again}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{t('srs_hard', 'Difícil')}</span>
            <span className="text-yellow-400 font-bold text-lg">{hard}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{t('srs_good', 'Bien')}</span>
            <span className="text-green-400 font-bold text-lg">{good}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{t('srs_easy', 'Fácil')}</span>
            <span className="text-blue-400 font-bold text-lg">{easy}</span>
          </div>
          <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
            <span className="text-white font-semibold text-sm">{t('srs_accuracy', 'Precisión')}</span>
            <span className="text-white font-bold text-xl">{correctPct}%</span>
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-2">
          {again > 0 && (
            <button
              onClick={onReviewAgain}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 active:scale-[0.98] transition-all"
            >
              {t('srs_review_again', 'Repasar las que fallé')} ({again})
            </button>
          )}
          <button
            onClick={onFinish}
            className="w-full py-3 rounded-xl bg-gray-700 text-gray-200 font-semibold text-sm hover:bg-gray-600 active:scale-[0.98] transition-all"
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
  const dueQueue  = useMemo(() => [...getDueCards(progress, allCharacters)].sort(() => Math.random() - 0.5), []); // eslint-disable-line
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

  // ── Voltear tarjeta + 🔊 audio automático ────────────────────────────────
  const handleFlip = useCallback(() => {
    if (!current) return;
    setFlipped(true);
    // Audio automático al revelar
    speakChinese?.({ hanzi: current.char, pinyin: current.pinyin });
  }, [current, speakChinese]);

  // ── Evaluar tarjeta ───────────────────────────────────────────────────────
  const handleRate = useCallback((quality) => {
    if (!current) return;
    markDailyActivity();

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
    setQueue(failedQueue.sort(() => Math.random() - 0.5));
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
    <div className="min-h-screen bg-gray-900 flex flex-col pb-6">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 pt-10 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            {t('srs_back', 'Volver')}
          </button>
          <div className="flex items-center gap-2">
            {isWeak && <span className="text-orange-400 text-sm">💔</span>}
            <span className="text-gray-400 text-sm font-medium">
              {index + 1} / {total}
            </span>
          </div>
        </div>
        {/* Barra de progreso */}
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${isWeak ? 'bg-orange-500' : 'bg-red-500'}`}
            style={{ width: `${progressPct}%` }}
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
          <p className="text-gray-600 text-xs">{t('srs_tap_to_reveal', 'Toca la tarjeta para ver la respuesta')}</p>
        </div>
      )}
    </div>
  );
}
