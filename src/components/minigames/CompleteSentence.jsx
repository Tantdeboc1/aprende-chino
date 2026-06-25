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
import { useLessonFilter } from '@/utils/lessonFilter.js';
import { useGamePhase } from '@/utils/useGamePhase.js';
import GameIntro from './GameIntro.jsx';
import GameResults from './GameResults.jsx';

import { LESSON_COLORS, LESSON_NUMBERS } from '@/styles/lessonColors.js';
const DEFAULT_COLOR = { bg: 'bg-[#2f6b4a]', border: 'border-[#2f6b4a]', text: 'text-[#2f6b4a]' };

function buildRound(lessonFilter) {
  const pool = lessonFilter !== null
    ? completeSentenceData.filter(d => d.lesson === lessonFilter)
    : completeSentenceData;
  return shuffle(pool).slice(0, 8);
}

export default function CompleteSentence({ goBack, selectedLesson }) {
  const { t, i18n } = useTranslation();
  const { isIntro, isFinished, start, finish, restart } = useGamePhase('complete-sentence');

  const [rounds, setRounds]             = useState([]);
  const [currentIdx, setCurrentIdx]     = useState(0);
  const [selected, setSelected]         = useState(null);
  const [result, setResult]             = useState(null);
  const [showHint, setShowHint]         = useState(false);
  const [score, setScore]               = useState(0);
  const [lessonFilter, setLessonFilter] = useLessonFilter(selectedLesson);

  const initRound = useCallback((filter) => {
    const r = buildRound(filter);
    setRounds(r);
    setCurrentIdx(0);
    setScore(0);
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
      finish();
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

  // Pantalla de explicación
  if (isIntro) {
    return (
      <GameIntro
        gameId="complete-sentence"
        cn="填"
        title={t('complete_title')}
        subtitle={t('complete_subtitle')}
        steps={[
          t('complete_intro_1', 'Lee la frase con un hueco y su traducción.'),
          t('complete_intro_2', 'Elige entre las 4 opciones el carácter que falta.'),
          t('complete_intro_3', 'Usa el botón "Pista" si necesitas ver el pinyin.'),
          t('complete_intro_4', 'Son 8 frases por ronda. Puedes filtrar por lección.'),
        ]}
        onStart={start}
        onBack={goBack}
      />
    );
  }

  // Pantalla resultados
  if (isFinished) {
    return (
      <GameResults
        gameId="complete-sentence"
        title={t('complete_results_title')}
        subtitle={t('complete_results_subtitle')}
        correct={score}
        wrong={rounds.length - score}
        onPlayAgain={() => { restart(); initRound(lessonFilter); }}
        onBack={goBack}
      />
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
            <h1 className="text-lg font-bold text-[#1c1813]">{t('complete_title')}</h1>
            <p className="text-sm text-[#928a76]">{t('complete_subtitle')}</p>
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
          <button onClick={() => setLessonFilter(null)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === null ? 'bg-[#2f6b4a] text-[#fbf5e6] border-transparent' : 'bg-[#fbf5e6] text-[#928a76] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'}`}>
            {t('sov_all_lessons')}
          </button>
          {LESSON_NUMBERS.map(n => (
            <button key={n} onClick={() => setLessonFilter(n)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === n ? `${LESSON_COLORS[n].bg} text-[#fbf5e6] border-transparent` : 'bg-[#fbf5e6] text-[#928a76] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'}`}>
              L{n}
            </button>
          ))}
        </div>

        {/* Traducción */}
        <div className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] rounded-xl p-4">
          <p className="text-xs text-[#928a76] mb-1">{t('complete_translate_label')}</p>
          <p className="text-[#1c1813] font-semibold text-base leading-snug">
            {current.translations?.[i18n.language] || current.translations?.es}
          </p>
          {showHint && (
            <div className="mt-2 pt-2 border-t border-[rgba(28,24,19,0.10)]">
              <p className="text-xs text-[#928a76] mb-0.5">{t('sov_hint_label')}</p>
              <p className="text-[#b88a3e] text-sm">{current.hint}</p>
            </div>
          )}
        </div>

        {/* Frase con hueco */}
        <div className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] rounded-xl p-5 text-center">
          <p className="text-xs text-[#928a76] mb-3">{t('complete_sentence_label')}</p>
          <p className="text-2xl font-bold text-[#1c1813] leading-relaxed">
            {parts[0]}
            <span className={`inline-block min-w-[2.5rem] mx-1 px-2 py-1 rounded-lg border-2 border-dashed transition-all ${
              result === 'correct' ? 'border-[#2f6b4a] bg-[#cfe1d3]/30 text-[#2f6b4a]' :
              result === 'incorrect' ? 'border-[#c8392f] bg-[#f0d6cf]/30 text-[#c8392f]' :
              selected ? `${accent.border} bg-[#f8f1de] text-[#1c1813]` :
              'border-[rgba(28,24,19,0.18)] text-[#928a76]'
            }`}>
              {selected || '___'}
            </span>
            {parts[1]}
          </p>
        </div>

        {/* Opciones */}
        <div>
          <p className="text-xs text-[#928a76] mb-2">{t('complete_options_label')}</p>
          <div className="grid grid-cols-2 gap-3">
            {shuffledOptions.map((option, i) => {
              const isSelected = selected === option;
              const isCorrectAnswer = option === current.answer;
              let btnClass = 'bg-[#f8f1de] border-[rgba(28,24,19,0.18)] text-[#1c1813] hover:bg-[#bdb39a]';
              if (result) {
                if (isCorrectAnswer) btnClass = 'bg-[#2f6b4a] border-[#2f6b4a] text-[#fbf5e6]';
                else if (isSelected && !isCorrectAnswer) btnClass = 'bg-[#c8392f] border-[#c8392f] text-[#fbf5e6]';
                else btnClass = 'bg-[#f8f1de] border-[rgba(28,24,19,0.18)] text-[#928a76]';
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
          <div className="bg-[#cfe1d3]/30 border border-[#2f6b4a] rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl"></span>
            <div>
              <p className="text-[#2f6b4a] font-bold text-sm">{t('sov_correct')}</p>
              <p className="text-[#5b5446] text-sm">{current.sentence.replace('___', current.answer)}</p>
            </div>
          </div>
        )}
        {result === 'incorrect' && (
          <div className="bg-[#f0d6cf]/30 border border-[#c8392f] rounded-xl p-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl"></span>
              <p className="text-[#c8392f] font-bold text-sm">{t('sov_incorrect')}</p>
            </div>
            <p className="text-xs text-[#928a76]">{t('sov_correct_answer')}</p>
            <p className="text-[#1c1813] font-bold text-base mt-0.5">{current.sentence.replace('___', current.answer)}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          {!result && !showHint && (
            <button onClick={() => setShowHint(true)} className="flex-1 py-3 rounded-xl border border-[rgba(28,24,19,0.18)] text-[#928a76] hover:text-[#1c1813] hover:border-[rgba(28,24,19,0.18)] text-sm font-medium transition-colors">
              {t('sov_hint_button')}
            </button>
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
