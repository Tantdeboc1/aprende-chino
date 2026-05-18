// src/components/minigames/FindIntruder.jsx
// Minijuego: Encuentra el intruso — 4 caracteres, uno no pertenece al grupo
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import intruderData from '@/data/intruderData.js';
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
const DEFAULT_COLOR = { bg: 'bg-pink-600', border: 'border-pink-500', text: 'text-pink-400' };

function buildRound(lessonFilter) {
  const pool = lessonFilter !== null
    ? intruderData.filter(d => d.lesson === lessonFilter)
    : intruderData;
  return shuffle(pool).slice(0, 8).map(d => ({
    ...d,
    shuffledItems: shuffle([...d.items]),
  }));
}

export default function FindIntruder({ goBack }) {
  const { t, i18n } = useTranslation();

  const [rounds, setRounds]             = useState([]);
  const [currentIdx, setCurrentIdx]     = useState(0);
  const [selected, setSelected]         = useState(null);
  const [result, setResult]             = useState(null);
  const [showHint, setShowHint]         = useState(false);
  const [score, setScore]               = useState(0);
  const [done, setDone]                 = useState(false);
  const [lessonFilter, setLessonFilter] = useState(null);

  const initRound = useCallback((filter) => {
    const r = buildRound(filter);
    setRounds(r);
    setCurrentIdx(0);
    setScore(0);
    setDone(false);
    setSelected(null);
    setResult(null);
    setShowHint(false);
  }, []);

  useEffect(() => { initRound(lessonFilter); }, [lessonFilter, initRound]);

  const current = rounds[currentIdx];
  const accent  = LESSON_COLORS[current?.lesson] || DEFAULT_COLOR;
  const lang    = i18n.language;

  const handleSelect = (item) => {
    if (result) return;
    setSelected(item);
    const correct = item === current.intruder;
    setResult(correct ? 'correct' : 'incorrect');
    if (correct) {
      setScore(s => s + 1);
      addXP(10);
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
      updateChallengeProgress('play_different_games', 'FindIntruder');
      if (score === rounds.length) {
        trackAchievement('perfect_score', 1);
        updateChallengeProgress('perfect_score', 1);
      }
      return;
    }
    setCurrentIdx(next);
    setSelected(null);
    setResult(null);
    setShowHint(false);
  };

  // Resultados
  if (done) {
    const pct = rounds.length > 0 ? Math.round((score / rounds.length) * 100) : 0;
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '👏' : '💪';
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-1">{t('intruder_results_title')}</h2>
          <p className="text-gray-400 mb-6">{t('intruder_results_subtitle')}</p>
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
            <button onClick={() => initRound(lessonFilter)} className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold transition-colors">
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
        <p className="text-4xl">🎯</p>
        <p className="text-gray-400 text-center">{t('sov_no_data')}</p>
        <button onClick={() => setLessonFilter(null)} className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition-colors">
          {t('sov_all_lessons')}
        </button>
      </div>
    );
  }

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
            <h1 className="text-lg font-bold text-white">{t('intruder_title')}</h1>
            <p className="text-sm text-gray-400">{t('intruder_subtitle')}</p>
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
          <button onClick={() => setLessonFilter(null)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === null ? 'bg-pink-600 text-white border-transparent' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'}`}>
            {t('sov_all_lessons')}
          </button>
          {[1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setLessonFilter(n)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === n ? `${LESSON_COLORS[n].bg} text-white border-transparent` : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'}`}>
              L{n}
            </button>
          ))}
        </div>

        {/* Instrucción */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <p className="text-white font-semibold text-base">{t('intruder_question')}</p>
          <p className="text-gray-400 text-xs mt-1">{t('intruder_question_hint')}</p>
        </div>

        {/* Pista */}
        {showHint && (
          <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-0.5">{t('sov_hint_label')}</p>
            <p className="text-yellow-400 text-sm">{current.hint?.[lang] || current.hint?.es}</p>
          </div>
        )}

        {/* Los 4 caracteres */}
        <div className="grid grid-cols-2 gap-3">
          {current.shuffledItems.map((item, i) => {
            const isIntruder = item === current.intruder;
            const isSelected = selected === item;
            let cardClass = 'bg-gray-800 border-gray-600 hover:border-gray-400';
            if (result) {
              if (isIntruder) cardClass = 'bg-pink-900/40 border-pink-500';
              else if (isSelected) cardClass = 'bg-red-900/30 border-red-500';
              else cardClass = 'bg-green-900/20 border-green-700/50';
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(item)}
                disabled={!!result}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${cardClass}`}
              >
                <span className="text-4xl font-bold text-white mb-1">{item}</span>
                {result && isIntruder && (
                  <span className="text-xs text-pink-400 font-bold mt-1">{t('intruder_this_one')}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {result === 'correct' && (
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">✅</span>
              <p className="text-green-400 font-bold text-sm">{t('sov_correct')}</p>
            </div>
            <p className="text-gray-300 text-xs">
              {t('intruder_explanation', { group: current.category?.[lang] || current.category?.es })}
            </p>
          </div>
        )}
        {result === 'incorrect' && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">❌</span>
              <p className="text-red-400 font-bold text-sm">{t('sov_incorrect')}</p>
            </div>
            <p className="text-xs text-gray-400">{t('intruder_correct_was')}</p>
            <p className="text-white font-bold text-lg mt-0.5">{current.intruder}</p>
            <p className="text-gray-300 text-xs mt-1">
              {t('intruder_explanation', { group: current.category?.[lang] || current.category?.es })}
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          {!result && (
            <>
              {!showHint && (
                <button onClick={() => setShowHint(true)} className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 text-sm font-medium transition-colors">
                  💡 {t('sov_hint_button')}
                </button>
              )}
            </>
          )}
          {result && (
            <button onClick={handleNext} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${result === 'correct' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}>
              {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
