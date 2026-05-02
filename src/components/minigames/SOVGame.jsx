// src/components/minigames/SOVGame.jsx
// Minijuego: Ordena las palabras para formar la frase correcta
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import sovData from '@/data/sovData.js';
import { shuffle } from '@/utils/arrayUtils.js';

// Filtra frases por lección y prepara estado inicial
function buildRound(lessonFilter) {
  const pool = lessonFilter !== null
    ? sovData.filter(d => d.lesson === lessonFilter)
    : sovData;
  // Selecciona hasta 8 frases aleatorias
  const selected = shuffle(pool).slice(0, 8);
  return selected.map(d => ({
    ...d,
    shuffled: shuffle(d.words),
  }));
}

const LESSON_COLORS = {
  1: { bg: 'bg-red-600',    border: 'border-red-500',    text: 'text-red-400'    },
  2: { bg: 'bg-orange-600', border: 'border-orange-500', text: 'text-orange-400' },
  3: { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-400' },
  4: { bg: 'bg-green-600',  border: 'border-green-500',  text: 'text-green-400'  },
};
const DEFAULT_COLOR = { bg: 'bg-red-600', border: 'border-red-500', text: 'text-red-400' };


// ── Feedback de sonido via Web Audio API ────────────────────────────────────
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'correct') {
      // Dos tonos ascendentes: un "ding" agradable
      [523.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.25);
      });
    } else {
      // Tono grave descendente: "bong" de error
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Web Audio no disponible — ignorar
  }
}

export default function SOVGame({ goBack, selectedLesson, speakChinese }) {
  const { t } = useTranslation();

  // Estado de la ronda
  const [rounds, setRounds]           = useState([]);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [placed, setPlaced]           = useState([]);    // palabras en la zona de respuesta
  const [available, setAvailable]     = useState([]);    // palabras disponibles (chips)
  const [result, setResult]           = useState(null);  // null | 'correct' | 'incorrect'
  const [showHint, setShowHint]       = useState(false);
  const [score, setScore]             = useState(0);
  const [done, setDone]               = useState(false);
  const [lessonFilter, setLessonFilter] = useState(selectedLesson || null);

  // Inicializar ronda
  const initRound = useCallback((filter) => {
    const r = buildRound(filter);
    setRounds(r);
    setCurrentIdx(0);
    setScore(0);
    setDone(false);
    setPlaced([]);
    setAvailable(r.length > 0 ? r[0].shuffled.map((w, i) => ({ word: w, id: i })) : []);
    setResult(null);
    setShowHint(false);
  }, []);

  useEffect(() => {
    initRound(lessonFilter);
  }, [lessonFilter, initRound]);

  const current = rounds[currentIdx];
  const accent  = LESSON_COLORS[current?.lesson] || DEFAULT_COLOR;

  // Mover chip de disponibles → zona respuesta
  const handlePickWord = (item) => {
    if (result) return;
    setAvailable(prev => prev.filter(x => x.id !== item.id));
    setPlaced(prev => [...prev, item]);
  };

  // Mover chip de zona respuesta → disponibles
  const handleRemoveWord = (item) => {
    if (result) return;
    setPlaced(prev => prev.filter(x => x.id !== item.id));
    setAvailable(prev => [...prev, item]);
  };

  // Comprobar respuesta
  const handleCheck = () => {
    if (placed.length === 0) return;
    const answer = placed.map(x => x.word).join('');
    const correct = answer === current.sentence;
    setResult(correct ? 'correct' : 'incorrect');
    if (correct) {
      setScore(s => s + 1);
    } else {
      // Reproducir audio de la frase correcta al fallar
      speakChinese?.({ hanzi: current.sentence, pinyin: current.hint || '' });
    }
    playSound(correct ? 'correct' : 'incorrect');
  };

  // Siguiente pregunta
  const handleNext = () => {
    const next = currentIdx + 1;
    if (next >= rounds.length) {
      setDone(true);
      return;
    }
    setCurrentIdx(next);
    setPlaced([]);
    setAvailable(rounds[next].shuffled.map((w, i) => ({ word: w, id: i })));
    setResult(null);
    setShowHint(false);
  };

  // Reintentar misma pregunta
  const handleRetry = () => {
    setPlaced([]);
    setAvailable(current.shuffled.map((w, i) => ({ word: w, id: i })));
    setResult(null);
    setShowHint(false);
  };

  // ── Pantalla de resultados finales ──────────────────────────────────────────
  if (done) {
    const pct = rounds.length > 0 ? Math.round((score / rounds.length) * 100) : 0;
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '👏' : '💪';
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-1">{t('sov_results_title')}</h2>
          <p className="text-gray-400 mb-6">{t('sov_results_subtitle')}</p>
          <div className="flex justify-center gap-8 mb-8">
            <div>
              <p className="text-4xl font-bold text-white">{score}/{rounds.length}</p>
              <p className="text-xs text-gray-500 mt-1">{t('sov_correct_label')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{pct}%</p>
              <p className="text-xs text-gray-500 mt-1">{t('sov_accuracy_label')}</p>
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => initRound(lessonFilter)}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors"
            >
              {t('sov_play_again')}
            </button>
            <button
              onClick={goBack}
              className="w-full py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium transition-colors"
            >
              {t('sov_back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Pantalla de carga / sin datos ───────────────────────────────────────────
  if (rounds.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-4xl">🔤</p>
        <p className="text-gray-400 text-center">{t('sov_no_data')}</p>
        <button
          onClick={() => setLessonFilter(null)}
          className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition-colors"
        >
          {t('sov_all_lessons')}
        </button>
      </div>
    );
  }
  if (!current) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">{t('minigames_loading')}</p>
      </div>
    );
  }

  // ── Juego principal ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-900 pb-8">

      {/* Header */}
      <div className={`bg-gray-800 border-b border-gray-700 border-l-4 ${accent.border} px-4 pt-10 pb-4`}>
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-3 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          {t('sov_back')}
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">{t('sov_title')}</h1>
            <p className="text-sm text-gray-400">{t('sov_subtitle')}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${accent.text}`}>{score}</p>
            <p className="text-xs text-gray-500">{currentIdx + 1}/{rounds.length}</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${accent.bg} rounded-full transition-all duration-500`}
            style={{ width: `${((currentIdx + (result ? 1 : 0)) / rounds.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-5">

        {/* Filtro de lección */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setLessonFilter(null)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              lessonFilter === null
                ? 'bg-red-600 text-white border-transparent'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
            }`}
          >
            {t('sov_all_lessons')}
          </button>
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => setLessonFilter(n)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                lessonFilter === n
                  ? `${LESSON_COLORS[n].bg} text-white border-transparent`
                  : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
              }`}
            >
              L{n}
            </button>
          ))}
        </div>

        {/* Traducción */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">{t('sov_translate_label')}</p>
          <p className="text-white font-semibold text-base leading-snug">{current.translation}</p>

          {showHint && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-500 mb-0.5">{t('sov_hint_label')}</p>
              <p className="text-yellow-400 text-sm">{current.hint}</p>
            </div>
          )}
        </div>

        {/* Zona de respuesta */}
        <div>
          <p className="text-xs text-gray-500 mb-2">{t('sov_answer_zone')}</p>
          <div
            className={`min-h-[52px] rounded-xl border-2 p-3 flex flex-wrap gap-2 transition-colors ${
              result === 'correct'   ? 'border-green-500 bg-green-900/20' :
              result === 'incorrect' ? 'border-red-500 bg-red-900/20'     :
              placed.length > 0     ? `${accent.border} bg-gray-800`     :
                                      'border-gray-600 bg-gray-800/50 border-dashed'
            }`}
          >
            {placed.length === 0 && (
              <p className="text-gray-600 text-sm self-center">{t('sov_drop_here')}</p>
            )}
            {placed.map(item => (
              <button
                key={item.id}
                onClick={() => handleRemoveWord(item)}
                disabled={!!result}
                className={`px-4 py-2 rounded-lg text-white font-bold text-lg transition-all
                  ${result === 'correct'   ? 'bg-green-700 cursor-default' :
                    result === 'incorrect' ? 'bg-red-700 cursor-default'   :
                                            `${accent.bg} hover:opacity-80 active:scale-95`}
                `}
              >
                {item.word}
              </button>
            ))}
          </div>
        </div>

        {/* Chips disponibles */}
        <div>
          <p className="text-xs text-gray-500 mb-2">{t('sov_words_label')}</p>
          <div className="flex flex-wrap gap-2">
            {available.map(item => (
              <button
                key={item.id}
                onClick={() => handlePickWord(item)}
                disabled={!!result}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-95 text-white font-bold text-lg transition-all border border-gray-600 hover:border-gray-500"
              >
                {item.word}
              </button>
            ))}
            {available.length === 0 && !result && (
              <p className="text-xs text-gray-600 italic">{t('sov_all_placed')}</p>
            )}
          </div>
        </div>

        {/* Feedback de resultado */}
        {result === 'correct' && (
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-green-400 font-bold text-sm">{t('sov_correct')}</p>
              <p className="text-gray-300 text-sm">{current.sentence}</p>
            </div>
          </div>
        )}
        {result === 'incorrect' && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">❌</span>
              <p className="text-red-400 font-bold text-sm">{t('sov_incorrect')}</p>
            </div>
            <p className="text-xs text-gray-400">{t('sov_correct_answer')}</p>
            <p className="text-white font-bold text-base mt-0.5">{current.sentence}</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          {!result && (
            <>
              {!showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 text-sm font-medium transition-colors"
                >
                  💡 {t('sov_hint_button')}
                </button>
              )}
              <button
                onClick={handleCheck}
                disabled={placed.length === 0}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors
                  ${placed.length > 0
                    ? `${accent.bg} hover:opacity-90 text-white`
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {t('sov_check_button')}
              </button>
            </>
          )}

          {result === 'correct' && (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors"
            >
              {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')} →
            </button>
          )}

          {result === 'incorrect' && (
            <div className="flex gap-3 flex-1">
              <button
                onClick={handleRetry}
                className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                {t('sov_retry_button')}
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold text-sm transition-colors"
              >
                {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
