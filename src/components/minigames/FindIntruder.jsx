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
  1: { bg: 'bg-[#c8392f]',    border: 'border-[#c8392f]',    text: 'text-[#c8392f]'    },
  2: { bg: 'bg-[#b88a3e]', border: 'border-[#b88a3e]', text: 'text-[#b88a3e]' },
  3: { bg: 'bg-[#b88a3e]', border: 'border-[#b88a3e]', text: 'text-[#b88a3e]' },
  4: { bg: 'bg-[#2f6b4a]',  border: 'border-[#2f6b4a]',  text: 'text-[#2f6b4a]'  },
};
const DEFAULT_COLOR = { bg: 'bg-[#c8392f]', border: 'border-[#c8392f]', text: 'text-[#c8392f]' };

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
    const emoji = pct === 100 ? '' : pct >= 70 ? '' : '';
    return (
      <div className="min-h-screen bg-[#f4ecdc] flex flex-col items-center justify-center p-6">
        <div className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-[#1c1813] mb-1">{t('intruder_results_title')}</h2>
          <p className="text-[#928a76] mb-6">{t('intruder_results_subtitle')}</p>
          <div className="flex justify-center gap-8 mb-8">
            <div>
              <p className="text-4xl font-bold text-[#1c1813]">{score}/{rounds.length}</p>
              <p className="text-xs text-[#928a76] mt-1">{t('sov_correct_label')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#1c1813]">{pct}%</p>
              <p className="text-xs text-[#928a76] mt-1">{t('sov_accuracy_label')}</p>
            </div>
          </div>
          <div className="space-y-2">
            <button onClick={() => initRound(lessonFilter)} className="w-full py-3 rounded-xl bg-[#c8392f] hover:bg-[#8b1f1a] text-[#fbf5e6] font-bold transition-colors">
              {t('sov_play_again')}
            </button>
            <button onClick={goBack} className="w-full py-2.5 rounded-xl bg-[#f8f1de] hover:bg-[#bdb39a] text-[#5b5446] font-medium transition-colors">
              {t('sov_back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (rounds.length === 0 || !current) {
    return (
      <div className="min-h-screen bg-[#f4ecdc] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-4xl"></p>
        <p className="text-[#928a76] text-center">{t('sov_no_data')}</p>
        <button onClick={() => setLessonFilter(null)} className="px-4 py-2 rounded-lg bg-[#f8f1de] text-[#5b5446] text-sm hover:bg-[#bdb39a] transition-colors">
          {t('sov_all_lessons')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4ecdc] pb-8">
      {/* Header */}
      <div className={`bg-[#fbf5e6] border-b border-[rgba(28,24,19,0.10)] border-l-4 ${accent.border} px-4 pt-10 pb-4`}>
        <button onClick={goBack} className="flex items-center gap-1.5 text-[#928a76] hover:text-[#1c1813] text-sm mb-3 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          {t('sov_back')}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#1c1813]">{t('intruder_title')}</h1>
            <p className="text-sm text-[#928a76]">{t('intruder_subtitle')}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${accent.text}`}>{score}</p>
            <p className="text-xs text-[#928a76]">{currentIdx + 1}/{rounds.length}</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-[#f8f1de] rounded-full overflow-hidden">
          <div className={`h-full ${accent.bg} rounded-full transition-all duration-500`} style={{ width: `${((currentIdx + (result ? 1 : 0)) / rounds.length) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-5">
        {/* Filtro */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setLessonFilter(null)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === null ? 'bg-[#c8392f] text-[#fbf5e6] border-transparent' : 'bg-[#fbf5e6] text-[#928a76] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'}`}>
            {t('sov_all_lessons')}
          </button>
          {[1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setLessonFilter(n)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === n ? `${LESSON_COLORS[n].bg} text-[#fbf5e6] border-transparent` : 'bg-[#fbf5e6] text-[#928a76] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'}`}>
              L{n}
            </button>
          ))}
        </div>

        {/* Instrucción */}
        <div className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] rounded-xl p-4 text-center">
          <p className="text-[#1c1813] font-semibold text-base">{t('intruder_question')}</p>
          <p className="text-[#928a76] text-xs mt-1">{t('intruder_question_hint')}</p>
        </div>

        {/* Pista */}
        {showHint && (
          <div className="bg-[#e8d4a8]/20 border border-[#b88a3e]/50 rounded-xl p-3">
            <p className="text-xs text-[#928a76] mb-0.5">{t('sov_hint_label')}</p>
            <p className="text-[#b88a3e] text-sm">{current.hint?.[lang] || current.hint?.es}</p>
          </div>
        )}

        {/* Los 4 caracteres */}
        <div className="grid grid-cols-2 gap-3">
          {current.shuffledItems.map((item, i) => {
            const isIntruder = item === current.intruder;
            const isSelected = selected === item;
            let cardClass = 'bg-[#fbf5e6] border-[rgba(28,24,19,0.18)] hover:border-[#928a76]';
            if (result) {
              if (isIntruder) cardClass = 'bg-[#f0d6cf]/40 border-[#c8392f]';
              else if (isSelected) cardClass = 'bg-[#f0d6cf]/30 border-[#c8392f]';
              else cardClass = 'bg-[#cfe1d3]/20 border-[#2f6b4a]/50';
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(item)}
                disabled={!!result}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${cardClass}`}
              >
                <span className="text-4xl font-bold text-[#1c1813] mb-1">{item}</span>
                {result && isIntruder && (
                  <span className="text-xs text-[#c8392f] font-bold mt-1">{t('intruder_this_one')}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {result === 'correct' && (
          <div className="bg-[#cfe1d3]/30 border border-[#2f6b4a] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl"></span>
              <p className="text-[#2f6b4a] font-bold text-sm">{t('sov_correct')}</p>
            </div>
            <p className="text-[#5b5446] text-xs">
              {t('intruder_explanation', { group: current.category?.[lang] || current.category?.es })}
            </p>
          </div>
        )}
        {result === 'incorrect' && (
          <div className="bg-[#f0d6cf]/30 border border-[#c8392f] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl"></span>
              <p className="text-[#c8392f] font-bold text-sm">{t('sov_incorrect')}</p>
            </div>
            <p className="text-xs text-[#928a76]">{t('intruder_correct_was')}</p>
            <p className="text-[#1c1813] font-bold text-lg mt-0.5">{current.intruder}</p>
            <p className="text-[#5b5446] text-xs mt-1">
              {t('intruder_explanation', { group: current.category?.[lang] || current.category?.es })}
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          {!result && (
            <>
              {!showHint && (
                <button onClick={() => setShowHint(true)} className="flex-1 py-3 rounded-xl border border-[rgba(28,24,19,0.18)] text-[#928a76] hover:text-[#1c1813] hover:border-[rgba(28,24,19,0.18)] text-sm font-medium transition-colors">
                  {t('sov_hint_button')}
                </button>
              )}
            </>
          )}
          {result && (
            <button onClick={handleNext} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${result === 'correct' ? 'bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6]' : 'bg-[#f8f1de] hover:bg-[#bdb39a] text-[#5b5446]'}`}>
              {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
