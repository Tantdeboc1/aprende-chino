// src/components/minigames/CompleteSentence.jsx
// Minijuego: Completa la frase — elige el carácter que falta
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import completeSentenceData from '@/data/completeSentenceData.js';
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
const DEFAULT_COLOR = { bg: 'bg-teal-600', border: 'border-teal-500', text: 'text-teal-400' };

function buildRound(lessonFilter) {
  const pool = lessonFilter !== null
    ? completeSentenceData.filter(d => d.lesson === lessonFilter)
    : completeSentenceData;
  return shuffle(pool).slice(0, 8);
}

export default function CompleteSentence({ goBack }) {
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

  // Memoizar opciones barajadas para evitar re-shuffle en cada render
  const shuffledOptions = useMemo(
    () => current ? shuffle([...current.options]) : [],
    [currentIdx, rounds]
  );
  const parts = current ? current.sentence.split('___') : ['', ''];

  const handleSelect = (option) => {
    if (result) return;
    setSelected(option);
    const correct = option === current.answer;
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
      updateChallengeProgress('play_different_games', 'CompleteSentence');
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

  // Pantalla resultados
  if (done) {
    const pct = rounds.length > 0 ? Math.round((score / rounds.length) * 100) : 0;
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '👏' : '💪';
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-1">{t('complete_results_title')}</h2>
          <p className="text-gray-400 mb-6">{t('complete_results_subtitle')}</p>
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
            <button onClick={() => initRound(lessonFilter)} className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors">
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
        <p className="text-4xl">🧩</p>
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
            <h1 className="text-lg font-bold text-white">{t('complete_title')}</h1>
            <p className="text-sm text-gray-400">{t('complete_subtitle')}</p>
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
          <button onClick={() => setLessonFilter(null)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === null ? 'bg-teal-600 text-white border-transparent' : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'}`}>
            {t('sov_all_lessons')}
          </button>
          {[1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setLessonFilter(n)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === n ? `${LESSON_COLORS[n].bg} text-white border-transparent` : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'}`}>
              L{n}
            </button>
          ))}
        </div>

        {/* Traducción */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">{t('complete_translate_label')}</p>
          <p className="text-white font-semibold text-base leading-snug">
            {current.translations?.[i18n.language] || current.translations?.es}
          </p>
          {showHint && (
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-500 mb-0.5">{t('sov_hint_label')}</p>
              <p className="text-yellow-400 text-sm">{current.hint}</p>
            </div>
          )}
        </div>

        {/* Frase con hueco */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 text-center">
          <p className="text-xs text-gray-500 mb-3">{t('complete_sentence_label')}</p>
          <p className="text-2xl font-bold text-white leading-relaxed">
            {parts[0]}
            <span className={`inline-block min-w-[2.5rem] mx-1 px-2 py-1 rounded-lg border-2 border-dashed transition-all ${
              result === 'correct' ? 'border-green-500 bg-green-900/30 text-green-400' :
              result === 'incorrect' ? 'border-red-500 bg-red-900/30 text-red-400' :
              selected ? `${accent.border} bg-gray-700 text-white` :
              'border-gray-500 text-gray-500'
            }`}>
              {selected || '___'}
            </span>
            {parts[1]}
          </p>
        </div>

        {/* Opciones */}
        <div>
          <p className="text-xs text-gray-500 mb-2">{t('complete_options_label')}</p>
          <div className="grid grid-cols-2 gap-3">
            {shuffledOptions.map((option, i) => {
              const isSelected = selected === option;
              const isCorrectAnswer = option === current.answer;
              let btnClass = 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600';
              if (result) {
                if (isCorrectAnswer) btnClass = 'bg-green-700 border-green-500 text-white';
                else if (isSelected && !isCorrectAnswer) btnClass = 'bg-red-700 border-red-500 text-white';
                else btnClass = 'bg-gray-700 border-gray-600 text-gray-500';
              }
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(option)}
                  disabled={!!result}
                  className={`py-3 px-4 rounded-xl border-2 font-bold text-xl transition-all active:scale-95 ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback */}
        {result === 'correct' && (
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-green-400 font-bold text-sm">{t('sov_correct')}</p>
              <p className="text-gray-300 text-sm">{current.sentence.replace('___', current.answer)}</p>
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
            <p className="text-white font-bold text-base mt-0.5">{current.sentence.replace('___', current.answer)}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          {!result && !showHint && (
            <button onClick={() => setShowHint(true)} className="flex-1 py-3 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 text-sm font-medium transition-colors">
              💡 {t('sov_hint_button')}
            </button>
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
