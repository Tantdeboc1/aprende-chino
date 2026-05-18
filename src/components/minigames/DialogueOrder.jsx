// src/components/minigames/DialogueOrder.jsx
// Minijuego: Ordena el diálogo — pon las líneas en el orden correcto
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import dialogueOrderData from '@/data/dialogueOrderData.js';
import { shuffle } from '@/utils/arrayUtils.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import { playSound } from '@/utils/gameAudio.js';
import { addXP } from '@/utils/streak.js';
import { trackAchievement } from '@/utils/leveling.js';
import { updateChallengeProgress } from '@/utils/dailyChallenges.js';

const LESSON_COLORS = {
  1: { bg: 'bg-red-600',    border: 'border-red-500',    text: 'text-red-400'    },
  2: { bg: 'bg-orange-600', border: 'border-orange-500', text: 'text-orange-400' },
  3: { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-400' },
  4: { bg: 'bg-green-600',  border: 'border-green-500',  text: 'text-green-400'  },
};
const DEFAULT_COLOR = { bg: 'bg-indigo-600', border: 'border-indigo-500', text: 'text-indigo-400' };

function buildRound(lessonFilter) {
  const pool = lessonFilter !== null
    ? dialogueOrderData.filter(d => d.lesson === lessonFilter)
    : dialogueOrderData;
  return shuffle(pool).slice(0, 6);
}

export default function DialogueOrder({ goBack }) {
  const { t, i18n } = useTranslation();

  const [rounds, setRounds]             = useState([]);
  const [currentIdx, setCurrentIdx]     = useState(0);
  const [placed, setPlaced]             = useState([]);
  const [available, setAvailable]       = useState([]);
  const [result, setResult]             = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [score, setScore]               = useState(0);
  const [done, setDone]                 = useState(false);
  const [lessonFilter, setLessonFilter] = useState(null);

  const initRound = useCallback((filter) => {
    const r = buildRound(filter);
    setRounds(r);
    setCurrentIdx(0);
    setScore(0);
    setDone(false);
    setPlaced([]);
    setAvailable(r.length > 0 ? shuffle(r[0].lines.map((l, i) => ({ ...l, id: i }))) : []);
    setResult(null);
    setShowTranslation(false);
  }, []);

  useEffect(() => { initRound(lessonFilter); }, [lessonFilter, initRound]);

  const current = rounds[currentIdx];
  const accent  = LESSON_COLORS[current?.lesson] || DEFAULT_COLOR;

  const handlePickLine = (item) => {
    if (result) return;
    setAvailable(prev => prev.filter(x => x.id !== item.id));
    setPlaced(prev => [...prev, item]);
  };

  const handleRemoveLine = (item) => {
    if (result) return;
    setPlaced(prev => prev.filter(x => x.id !== item.id));
    setAvailable(prev => [...prev, item]);
  };

  const handleCheck = () => {
    if (placed.length !== current.lines.length) return;
    const correct = placed.every((item, i) => item.id === i);
    setResult(correct ? 'correct' : 'incorrect');
    if (correct) {
      setScore(s => s + 1);
      addXP(15);
      updateChallengeProgress('correct_answers', 1);
    }
    playSound(correct ? 'correct' : 'incorrect');
    if (correct) hapticSuccess(); else hapticError();
  };

  const handleNext = () => {
    const next = currentIdx + 1;
    if (next >= rounds.length) {
      setDone(true);
      trackAchievement('complete_quiz', 1);
      updateChallengeProgress('complete_quizzes', 1);
      updateChallengeProgress('play_different_games', 'DialogueOrder');
      if (score === rounds.length) {
        trackAchievement('perfect_score', 1);
        updateChallengeProgress('perfect_score', 1);
      }
      return;
    }
    setCurrentIdx(next);
    setPlaced([]);
    setAvailable(shuffle(rounds[next].lines.map((l, i) => ({ ...l, id: i }))));
    setResult(null);
    setShowTranslation(false);
  };

  const handleRetry = () => {
    setPlaced([]);
    setAvailable(shuffle(current.lines.map((l, i) => ({ ...l, id: i }))));
    setResult(null);
    setShowTranslation(false);
  };

  // Resultados
  if (done) {
    const pct = rounds.length > 0 ? Math.round((score / rounds.length) * 100) : 0;
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '👏' : '💪';
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-1">{t('dialogue_results_title')}</h2>
          <p className="text-gray-400 mb-6">{t('dialogue_results_subtitle')}</p>
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
            <button onClick={() => initRound(lessonFilter)} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors">
              {t('sov_play_again')}
            </button>
            <button onClick={goBack} className="w-full py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium transition-colors">
              {t('sov_back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (rounds.length === 0 || !current) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-4xl">🔀</p>
        <p className="text-gray-400 text-center">{t('sov_no_data')}</p>
        <button onClick={() => setLessonFilter(null)} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition-colors">
          {t('sov_all_lessons')}
        </button>
      </div>
    );
  }

  const lang = i18n.language;

  return (
    <div className="min-h-screen bg-gray-900 pb-8">
      {/* Header */}
      <div className={`bg-gray-800 border-b border-gray-700 border-l-4 ${accent.border} px-4 pt-10 pb-4`}>
        <button onClick={goBack} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-3 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          {t('sov_back')}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">{t('dialogue_title')}</h1>
            <p className="text-sm text-gray-400">{t('dialogue_subtitle')}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${accent.text}`}>{score}</p>
            <p className="text-xs text-gray-500">{currentIdx + 1}/{rounds.length}</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div className={`h-full ${accent.bg} rounded-full transition-all duration-500`} style={{ width: `${((currentIdx + (result ? 1 : 0)) / rounds.length) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-5">
        {/* Filtro */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setLessonFilter(null)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === null ? 'bg-indigo-600 text-white border-transparent' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'}`}>
            {t('sov_all_lessons')}
          </button>
          {[1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setLessonFilter(n)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === n ? `${LESSON_COLORS[n].bg} text-white border-transparent` : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'}`}>
              L{n}
            </button>
          ))}
        </div>

        {/* Zona de respuesta (diálogo ordenado) */}
        <div>
          <p className="text-xs text-gray-500 mb-2">{t('dialogue_answer_zone')}</p>
          <div className={`min-h-[120px] rounded-xl border-2 p-3 space-y-2 transition-colors ${
            result === 'correct'   ? 'border-green-500 bg-green-900/20' :
            result === 'incorrect' ? 'border-red-500 bg-red-900/20' :
            placed.length > 0     ? `${accent.border} bg-gray-800` :
                                    'border-gray-600 bg-gray-800/50 border-dashed'
          }`}>
            {placed.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-4">{t('dialogue_drop_here')}</p>
            )}
            {placed.map((item, i) => (
              <button
                key={item.id}
                onClick={() => handleRemoveLine(item)}
                disabled={!!result}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-start gap-2 ${
                  result === 'correct'   ? 'bg-green-800/50 cursor-default' :
                  result === 'incorrect' ? (item.id === i ? 'bg-green-800/30 border border-green-700/50' : 'bg-red-800/30 border border-red-700/50') :
                                          'bg-gray-700 hover:bg-gray-600 active:scale-[0.98]'
                }`}
              >
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  item.speaker === 'A' ? 'bg-blue-900/60 text-blue-400' : 'bg-purple-900/60 text-purple-400'
                }`}>
                  {item.speaker}
                </span>
                <span className="text-white font-medium text-sm">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Líneas disponibles */}
        {available.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">{t('dialogue_lines_label')}</p>
            <div className="space-y-2">
              {available.map(item => (
                <button
                  key={item.id}
                  onClick={() => handlePickLine(item)}
                  disabled={!!result}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 active:scale-[0.98] transition-all border border-gray-600 hover:border-gray-500 flex items-start gap-2"
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.speaker === 'A' ? 'bg-blue-900/60 text-blue-400' : 'bg-purple-900/60 text-purple-400'
                  }`}>
                    {item.speaker}
                  </span>
                  <span className="text-white font-medium text-sm">{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultado correcto: mostrar diálogo completo */}
        {result === 'correct' && (
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">✅</span>
              <p className="text-green-400 font-bold text-sm">{t('sov_correct')}</p>
            </div>
            {showTranslation && current.translations?.[lang] && (
              <div className="space-y-1 mt-2 pt-2 border-t border-green-800/50">
                {current.translations[lang].map((tr, i) => (
                  <p key={i} className="text-gray-300 text-xs">
                    <span className="text-gray-500 font-bold">{current.lines[i].speaker}:</span> {tr}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {result === 'incorrect' && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">❌</span>
              <p className="text-red-400 font-bold text-sm">{t('sov_incorrect')}</p>
            </div>
            <p className="text-xs text-gray-400 mb-1">{t('dialogue_correct_order')}</p>
            <div className="space-y-1">
              {current.lines.map((line, i) => (
                <p key={i} className="text-white text-sm">
                  <span className="text-gray-500 font-bold">{line.speaker}:</span> {line.text}
                  <span className="text-gray-500 text-xs ml-1">({line.pinyin})</span>
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          {!result && (
            <>
              {!showTranslation && (
                <button onClick={() => setShowTranslation(true)} className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 text-sm font-medium transition-colors">
                  💡 {t('dialogue_show_translation')}
                </button>
              )}
              <button
                onClick={handleCheck}
                disabled={placed.length !== current.lines.length}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
                  placed.length === current.lines.length ? `${accent.bg} hover:opacity-90 text-white` : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t('sov_check_button')}
              </button>
            </>
          )}

          {/* Traducción como pista antes de comprobar */}
          {!result && showTranslation && current.translations?.[lang] && (
            <div className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 space-y-1">
              {current.translations[lang].map((tr, i) => (
                <p key={i} className="text-yellow-400 text-xs">• {tr}</p>
              ))}
            </div>
          )}

          {result === 'correct' && (
            <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors">
              {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')} →
            </button>
          )}

          {result === 'incorrect' && (
            <div className="flex gap-3 flex-1">
              <button onClick={handleRetry} className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 hover:text-white text-sm font-medium transition-colors">
                {t('sov_retry_button')}
              </button>
              <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold text-sm transition-colors">
                {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
