// src/components/ReviewSession.jsx
// Repaso activo: quiz (char→significado, significado→char, pinyin→significado) + contextual
import { useState, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { updateSRS, getDueCards, getWeakCards, getWordHealth } from '@/utils/srs.js';
import { markDailyActivity, addXP } from '@/utils/streak.js';
import { updateChallengeProgress } from '@/utils/dailyChallenges.js';
import { preloadLessonAudio } from '@/utils/audioPreloader.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

/**
 * Elige un modo de repaso aleatorio para cada tarjeta.
 * Modos: 'char_to_meaning' | 'meaning_to_char' | 'pinyin_to_meaning' | 'context'
 */
function pickReviewMode(word) {
  const modes = ['char_to_meaning', 'meaning_to_char', 'pinyin_to_meaning'];
  // Solo añadir modo contexto si la palabra tiene ejemplos
  if (word.examples?.length > 0) modes.push('context');
  return modes[Math.floor(Math.random() * modes.length)];
}

/**
 * Genera 4 opciones de respuesta para un quiz.
 */
function generateOptions(correctWord, allWords, mode, lang) {
  const getMeaning = (w) => w.meanings?.[lang] || w.meaning;

  // Elegir qué campo usar como opción según el modo
  const getOptionText = (w) => {
    if (mode === 'meaning_to_char') return w.char;
    return getMeaning(w);
  };

  const correctText = getOptionText(correctWord);
  const others = allWords
    .filter(w => w.char !== correctWord.char && getOptionText(w) !== correctText)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(w => getOptionText(w));

  return shuffleArray([correctText, ...others]);
}

// ─── Selección de modo ──────────────────────────────────────────────────────
function ModeSelector({ dueCount, weakCount, onSelect, goBack, t }) {
  const bothEmpty = dueCount === 0 && weakCount === 0;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col pb-24">
      <div className="bg-gray-800 border-b border-gray-700 px-4 pt-10 pb-4 flex-shrink-0">
        <h1 className="text-xl font-bold text-white mb-1">
          {t('srs_mode_title', 'Repaso')}
        </h1>
        <p className="text-gray-400 text-sm leading-snug">
          {t('srs_mode_subtitle_v2', 'Pon a prueba tu memoria con distintos tipos de preguntas. ¡Cada tarjeta es un reto diferente!')}
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4 gap-4 max-w-sm mx-auto w-full">
        {bothEmpty ? (
          <div className="text-center py-8 px-4">
            <svg viewBox="0 0 200 160" className="w-48 h-36 mx-auto mb-6 opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="85" r="60" fill="#1f2937" />
              <rect x="55" y="65" width="40" height="50" rx="4" fill="#374151" stroke="#4b5563" strokeWidth="1.5"/>
              <rect x="105" y="65" width="40" height="50" rx="4" fill="#374151" stroke="#4b5563" strokeWidth="1.5"/>
              <line x1="95" y1="65" x2="95" y2="115" stroke="#6b7280" strokeWidth="1"/>
              <line x1="105" y1="65" x2="105" y2="115" stroke="#6b7280" strokeWidth="1"/>
              <line x1="63" y1="78" x2="88" y2="78" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              <line x1="63" y1="85" x2="85" y2="85" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              <line x1="63" y1="92" x2="88" y2="92" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              <line x1="112" y1="78" x2="137" y2="78" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              <line x1="112" y1="85" x2="134" y2="85" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              <line x1="112" y1="92" x2="137" y2="92" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="100" cy="52" r="14" fill="#1f2937" stroke="#f59e0b" strokeWidth="2"/>
              <text x="100" y="57" textAnchor="middle" fontSize="14" fill="#f59e0b">✦</text>
              <circle cx="60" cy="52" r="3" fill="#4b5563"/>
              <circle cx="140" cy="52" r="3" fill="#4b5563"/>
            </svg>
            <h2 className="text-xl font-bold text-white mb-2">
              {t('srs_mode_empty', 'Sin palabras para repasar')}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t('srs_mode_empty_desc', 'Las palabras se añaden aquí automáticamente cuando completas quizzes en las lecciones.')}
            </p>
            <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 text-left space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">{t('srs_how_to_start', '¿Cómo empezar?')}</p>
              <div className="flex items-start gap-3">
                <span className="text-lg">1.</span>
                <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: t('srs_step_1').replace('<1>', '<span class="text-white font-semibold">').replace('</1>', '</span>') }} />
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">2.</span>
                <p className="text-gray-300 text-sm" dangerouslySetInnerHTML={{ __html: t('srs_step_2').replace('<1>', '<span class="text-white font-semibold">').replace('</1>', '</span>') }} />
              </div>
              <div className="flex items-start gap-3">
                <span className="text-lg">3.</span>
                <p className="text-gray-300 text-sm">{t('srs_step_3')}</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{t('srs_how_it_works', '¿Cómo funciona?')}</p>
              <div className="space-y-1.5 text-gray-400 text-sm">
                <p>1. {t('srs_how_v2_step_1', 'Verás una pregunta sobre un carácter')}</p>
                <p>2. {t('srs_how_v2_step_2', 'Elige la respuesta correcta entre 4 opciones')}</p>
                <p>3. {t('srs_how_v2_step_3', 'Los modos varían: carácter→significado, significado→carácter, pinyin→significado y frases contextuales')}</p>
                <p>4. {t('srs_how_v2_step_4', 'Las palabras que falles se repasarán antes')}</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">{t('srs_choose_mode', 'Elige un modo')}</p>

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
                  <span className="text-white font-bold text-base">
                    {t('srs_mode_due_title', 'Repaso del día')}
                  </span>
                  <p className="text-gray-400 text-sm leading-snug mt-1">
                    {dueCount > 0
                      ? t('srs_mode_due_count', '{{count}} palabras listas para repasar hoy', { count: dueCount })
                      : t('srs_mode_due_empty', 'Ya repasaste todo por hoy. Vuelve mañana.')}
                  </p>
                </div>
                {dueCount > 0 && (
                  <span className="bg-red-500/20 text-red-400 font-bold text-lg px-3 py-1 rounded-xl flex-shrink-0">
                    {dueCount}
                  </span>
                )}
              </div>
            </button>

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
                  <span className="text-white font-bold text-base">
                    {t('srs_mode_weak_title', 'Palabras difíciles')}
                  </span>
                  <p className="text-gray-400 text-sm leading-snug mt-1">
                    {t('srs_mode_weak_desc', 'Practica extra con las que más te cuestan, sin importar el calendario')}
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

// ─── Etiqueta del modo de pregunta ──────────────────────────────────────────
function ModeLabel({ mode, t }) {
  const labels = {
    char_to_meaning: t('srs_mode_char_meaning', '¿Qué significa?'),
    meaning_to_char: t('srs_mode_meaning_char', '¿Qué carácter es?'),
    pinyin_to_meaning: t('srs_mode_pinyin_meaning', '¿Qué significa este pinyin?'),
    context: t('srs_mode_context', '¿Qué significa la palabra destacada?'),
  };
  return (
    <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-700 text-gray-400 font-medium">
      {labels[mode] || ''}
    </span>
  );
}

// ─── Tarjeta de pregunta (quiz activo) ──────────────────────────────────────
function QuizCard({ word, reviewMode, options, selectedAnswer, isCorrect, onAnswer, speakChinese, t, i18n, allCharacters, progress }) {
  const getMeaning = (w) => w.meanings?.[i18n.language] || w.meaning;
  const health = getWordHealth(progress, word.char);
  // Estabilizar ejemplo para modo contexto (no cambiar en cada render)
  const contextExample = useMemo(() => {
    if (reviewMode !== 'context' || !word.examples?.length) return word.char;
    return word.examples[Math.floor(Math.random() * word.examples.length)];
  }, [word.char, reviewMode]); // eslint-disable-line

  // Determinar qué mostrar como "pregunta"
  let questionContent;
  const correctAnswer = reviewMode === 'meaning_to_char' ? word.char : getMeaning(word);

  switch (reviewMode) {
    case 'char_to_meaning':
      questionContent = (
        <div className="text-center">
          <span className="text-7xl sm:text-8xl font-bold text-white leading-none">{word.char}</span>
          <p className="text-red-400 text-sm mt-2">{word.pinyin}</p>
        </div>
      );
      break;

    case 'meaning_to_char':
      questionContent = (
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-white leading-snug">{getMeaning(word)}</p>
          {word.type && <p className="text-gray-500 text-sm mt-1">{word.type}</p>}
        </div>
      );
      break;

    case 'pinyin_to_meaning':
      questionContent = (
        <div className="text-center">
          <span className="text-4xl sm:text-5xl font-bold text-red-400 leading-none">{word.pinyin}</span>
          <button
            onClick={(e) => { e.stopPropagation(); speakChinese?.({ hanzi: word.char, pinyin: word.pinyin }); }}
            className="mx-auto mt-3 w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-lg transition-colors"
          >
            🔊
          </button>
        </div>
      );
      break;

    case 'context':
      questionContent = (
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-2">
            {contextExample.split(word.char).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && <span className="text-yellow-400 underline decoration-yellow-400/50">{word.char}</span>}
              </span>
            ))}
          </p>
          <p className="text-gray-500 text-xs mt-2">{t('srs_context_hint', '¿Qué significa la palabra destacada en amarillo?')}</p>
        </div>
      );
      break;
  }

  return (
    <div className="flex-1 flex flex-col px-4 py-4">
      {/* Modo label + health */}
      <div className="flex items-center justify-between mb-4">
        <ModeLabel mode={reviewMode} t={t} />
        {health.level !== 'new' && (
          <span className="text-sm" title={t(health.labelKey)}>{health.emoji}</span>
        )}
      </div>

      {/* Pregunta */}
      <div className="w-full max-w-md mx-auto bg-gray-800 border-2 border-gray-700 rounded-2xl flex items-center justify-center p-6 min-h-[160px] sm:min-h-[200px] mb-6">
        {questionContent}
      </div>

      {/* Opciones */}
      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto w-full">
        {options.map((option, i) => {
          let buttonClass = 'bg-gray-700 border-2 border-gray-600 hover:border-gray-400 active:scale-[0.97]';

          if (selectedAnswer !== null) {
            if (option === correctAnswer) {
              buttonClass = 'bg-green-900/50 border-2 border-green-500 text-green-300';
            } else if (option === selectedAnswer && !isCorrect) {
              buttonClass = 'bg-red-900/50 border-2 border-red-500 text-red-300';
            } else {
              buttonClass = 'bg-gray-800 border-2 border-gray-700 opacity-50';
            }
          }

          return (
            <button
              key={i}
              onClick={() => onAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`rounded-xl py-4 px-3 text-center font-medium transition-all ${buttonClass} ${
                reviewMode === 'meaning_to_char' ? 'text-3xl' : 'text-sm sm:text-base'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback después de responder */}
      {selectedAnswer !== null && (
        <div className={`mt-4 max-w-md mx-auto w-full rounded-xl p-3 border ${
          isCorrect ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{isCorrect ? '✅' : '❌'}</span>
            <div>
              <p className={`font-bold text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? t('srs_quiz_correct', '¡Correcto!') : t('srs_quiz_incorrect', 'Incorrecto')}
              </p>
              {!isCorrect && (
                <p className="text-gray-300 text-xs mt-0.5">
                  {word.char} · {word.pinyin} = {getMeaning(word)}
                </p>
              )}
            </div>
          </div>
          {/* Mostrar ejemplo si no estamos en modo contexto */}
          {reviewMode !== 'context' && word.examples?.length > 0 && (
            <p className="text-gray-400 text-xs mt-2 italic">
              {t('srs_example_label', 'Ejemplo:')} {word.examples[0]}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Pantalla de resultados ─────────────────────────────────────────────────
function ResultScreen({ stats, mode, onFinish, onReviewFailed, t }) {
  const { correct, incorrect, total } = stats;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 pb-24">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">
            {pct >= 80 ? '🌟' : pct >= 50 ? '👍' : '💪'}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {t('srs_results_title', 'Sesión completada')}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {total} {t('srs_cards_reviewed', 'tarjetas repasadas')}
            {mode === 'weak' && <span className="ml-1 text-orange-400">{t('srs_mode_weak_badge')}</span>}
          </p>
        </div>

        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-5 mb-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{t('srs_quiz_correct', '¡Correcto!')}</span>
            <span className="text-green-400 font-bold text-lg">{correct}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">{t('srs_quiz_incorrect', 'Incorrecto')}</span>
            <span className="text-red-400 font-bold text-lg">{incorrect}</span>
          </div>
          <div className="border-t border-gray-700 pt-3 flex justify-between items-center">
            <span className="text-white font-semibold text-sm">{t('srs_accuracy', 'Precisión')}</span>
            <span className="text-white font-bold text-xl">{pct}%</span>
          </div>
        </div>

        <div className="space-y-2">
          {incorrect > 0 && (
            <button
              onClick={onReviewFailed}
              className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 active:scale-[0.98] transition-all"
            >
              {t('srs_review_again', 'Repasar las que fallé')} ({incorrect})
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

// ─── Componente principal ───────────────────────────────────────────────────
export default function ReviewSession({
  allCharacters,
  progress,
  onProgressChange,
  goBack,
  speakChinese,
}) {
  const { t, i18n } = useTranslation();

  const dueQueue  = useMemo(() => [...getDueCards(progress, allCharacters)].sort(() => Math.random() - 0.5), []); // eslint-disable-line
  const weakQueue = useMemo(() => getWeakCards(progress, allCharacters, 20), []); // eslint-disable-line

  const [phase,   setPhase]   = useState('select');
  const [mode,    setMode]    = useState(null);
  const [queue,   setQueue]   = useState([]);
  const [index,   setIndex]   = useState(0);
  const [done,    setDone]    = useState(false);
  const [stats,   setStats]   = useState({ correct: 0, incorrect: 0, total: 0 });
  const [failedQueue, setFailedQueue] = useState([]);

  // Quiz state per question
  const [reviewMode,    setReviewMode]    = useState(null);
  const [options,       setOptions]       = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect,     setIsCorrect]     = useState(null);
  const autoAdvanceRef = useRef(null);

  const current = queue[index] || null;
  const total   = queue.length;

  // Preparar la pregunta actual
  const setupQuestion = useCallback((wordQueue, idx) => {
    const word = wordQueue[idx];
    if (!word) return;
    const rMode = pickReviewMode(word);
    const opts = generateOptions(word, allCharacters, rMode, i18n.language);
    setReviewMode(rMode);
    setOptions(opts);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [allCharacters, i18n.language]);

  const handleSelectMode = useCallback((selectedMode) => {
    const q = selectedMode === 'due' ? dueQueue : weakQueue;
    if (q.length) preloadLessonAudio(q);
    setMode(selectedMode);
    setQueue(q);
    setIndex(0);
    setDone(false);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    setFailedQueue([]);
    setPhase('playing');
    // setup first question
    setTimeout(() => setupQuestion(q, 0), 0);
  }, [dueQueue, weakQueue, setupQuestion]);

  // Manejar respuesta del quiz
  const handleAnswer = useCallback((answer) => {
    if (selectedAnswer !== null || !current) return;

    const getMeaning = (w) => w.meanings?.[i18n.language] || w.meaning;
    const correctAnswer = reviewMode === 'meaning_to_char' ? current.char : getMeaning(current);
    const correct = answer === correctAnswer;

    setSelectedAnswer(answer);
    setIsCorrect(correct);

    markDailyActivity();

    // Mapear a quality SM-2
    const quality = correct ? 4 : 0;
    const updated = updateSRS(progress, current.char, quality);
    onProgressChange(updated);

    if (correct) {
      addXP(5);
      updateChallengeProgress('correct_answers', 1);
      updateChallengeProgress('review_mistakes', 1);
      hapticSuccess();
    } else {
      hapticError();
    }

    setStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
      total: prev.total + 1,
    }));

    if (!correct) setFailedQueue(prev => [...prev, current]);

    // Auto-avanzar después de feedback
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    autoAdvanceRef.current = setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= queue.length) {
        setDone(true);
      } else {
        setIndex(nextIndex);
        setupQuestion(queue, nextIndex);
      }
    }, correct ? 1200 : 2000); // Más tiempo para ver el feedback de error
  }, [selectedAnswer, current, reviewMode, i18n.language, progress, onProgressChange, index, queue, setupQuestion]);

  const handleReviewFailed = () => {
    const q = failedQueue.sort(() => Math.random() - 0.5);
    setQueue(q);
    setFailedQueue([]);
    setIndex(0);
    setDone(false);
    setStats({ correct: 0, incorrect: 0, total: 0 });
    setupQuestion(q, 0);
  };

  // ── Renderizado ──────────────────────────────────────────────────────────
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
        onReviewFailed={handleReviewFailed}
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
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${isWeak ? 'bg-orange-500' : 'bg-red-500'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Quiz */}
      {current && reviewMode && (
        <QuizCard
          word={current}
          reviewMode={reviewMode}
          options={options}
          selectedAnswer={selectedAnswer}
          isCorrect={isCorrect}
          onAnswer={handleAnswer}
          speakChinese={speakChinese}
          t={t}
          i18n={i18n}
          allCharacters={allCharacters}
          progress={progress}
        />
      )}
    </div>
  );
}
