// src/components/minigames/FindIntruder.jsx
// Minijuego: Encuentra el intruso — 4 caracteres, uno no pertenece al grupo
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import intruderData from '@/data/intruderData.js';
import { baseLang } from '@/utils/loc.js';
import { shuffle } from '@/utils/arrayUtils.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import { playSound } from '@/utils/gameAudio.js';
import { addXP } from '@/utils/streak.js';
import { trackAchievement } from '@/utils/leveling.js';
import { updateChallengeProgress } from '@/utils/dailyChallenges.js';
import { useLessonFilter } from '@/utils/lessonFilter.js';
import { useGamePhase } from '@/utils/useGamePhase.js';
import { useKeyAnswers } from '@/utils/useKeyAnswers.js';
import GameIntro from './GameIntro.jsx';
import GameResults from './GameResults.jsx';
import LessonFilterBar from './LessonFilterBar.jsx';

import { LESSON_COLORS } from '@/styles/lessonColors.js';
const DEFAULT_COLOR = { bg: 'bg-[var(--red)]', border: 'border-[var(--red)]', text: 'text-[var(--red)]' };

function buildRound(lessonFilter) {
  const pool = lessonFilter !== null
    ? intruderData.filter(d => d.lesson === lessonFilter)
    : intruderData;
  return shuffle(pool).slice(0, 8).map(d => ({
    ...d,
    shuffledItems: shuffle([...d.items]),
  }));
}

export default function FindIntruder({ goBack, selectedLesson }) {
  const { t, i18n } = useTranslation();
  const { isIntro, isFinished, start, finish, restart } = useGamePhase('find-intruder');

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
  const lang    = baseLang(i18n.language); // 'es-ES' → 'es' (los datos van por código base)

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
      finish();
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

  // Accesibilidad: teclas 1-4 eligen el carácter, Enter pasa de ronda.
  useKeyAnswers({
    count: current?.shuffledItems.length || 0,
    onSelect: !isIntro && !isFinished && current && !result
      ? (i) => handleSelect(current.shuffledItems[i]) : null,
    onNext: !isIntro && !isFinished && result ? handleNext : null,
  });

  // Pantalla de explicación
  if (isIntro) {
    return (
      <GameIntro
        gameId="find-intruder"
        cn="找"
        title={t('intruder_title')}
        subtitle={t('intruder_subtitle')}
        steps={[
          t('intruder_intro_1', 'Verás 4 caracteres: tres comparten categoría y uno es el intruso.'),
          t('intruder_intro_2', 'Toca el carácter que no pertenece al grupo.'),
          t('intruder_intro_3', 'Usa el botón "Pista" si necesitas una ayuda.'),
          t('intruder_intro_4', 'Son 8 rondas. Puedes filtrar por lección.'),
        ]}
        onStart={start}
        onBack={goBack}
      />
    );
  }

  // Resultados
  if (isFinished) {
    return (
      <GameResults
        gameId="find-intruder"
        title={t('intruder_results_title')}
        subtitle={t('intruder_results_subtitle')}
        correct={score}
        wrong={rounds.length - score}
        onPlayAgain={() => { restart(); initRound(lessonFilter); }}
        onBack={goBack}
      />
    );
  }

  if (rounds.length === 0 || !current) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-4xl"></p>
        <p className="text-[var(--mute)] text-center">{t('sov_no_data')}</p>
        <button onClick={() => setLessonFilter(null)} className="px-4 py-2 rounded-lg bg-[var(--paper-hi2)] text-[var(--ink-soft)] text-sm hover:bg-[var(--mute2)] transition-colors">
          {t('sov_all_lessons')}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] pb-8">
      {/* Header */}
      <div className={`bg-[var(--paper-hi)] border-b border-[rgba(28,24,19,0.10)] border-l-4 ${accent.border} px-4 pt-10 pb-4`}>
        <button onClick={goBack} className="flex items-center gap-1.5 text-[var(--mute)] hover:text-[var(--ink)] text-sm mb-3 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          {t('sov_back')}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[var(--ink)]">{t('intruder_title')}</h1>
            <p className="text-sm text-[var(--mute)]">{t('intruder_subtitle')}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${accent.text}`}>{score}</p>
            <p className="text-xs text-[var(--mute)]">{currentIdx + 1}/{rounds.length}</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-[var(--paper-hi2)] rounded-full overflow-hidden">
          <div className={`h-full ${accent.bg} rounded-full transition-all duration-500`} style={{ width: `${((currentIdx + (result ? 1 : 0)) / rounds.length) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-5">
        {/* Filtro */}
        <LessonFilterBar value={lessonFilter} onChange={setLessonFilter} />

        {/* Instrucción */}
        <div className="bg-[var(--paper-hi)] border border-[rgba(28,24,19,0.10)] rounded-xl p-4 text-center">
          <p className="text-[var(--ink)] font-semibold text-base">{t('intruder_question')}</p>
          <p className="text-[var(--mute)] text-xs mt-1">{t('intruder_question_hint')}</p>
        </div>

        {/* Pista */}
        {showHint && (
          <div className="bg-[var(--sand-bg)]/20 border border-[var(--sand)]/50 rounded-xl p-3">
            <p className="text-xs text-[var(--mute)] mb-0.5">{t('sov_hint_label')}</p>
            <p className="text-[var(--sand)] text-sm">{current.hint?.[lang] || current.hint?.es}</p>
          </div>
        )}

        {/* Los 4 caracteres */}
        <div className="grid grid-cols-2 gap-3">
          {current.shuffledItems.map((item, i) => {
            const isIntruder = item === current.intruder;
            const isSelected = selected === item;
            let cardClass = 'bg-[var(--paper-hi)] border-[rgba(28,24,19,0.18)] hover:border-[var(--mute)]';
            let animClass = '';
            if (result) {
              if (isIntruder) cardClass = 'bg-[var(--red-bg)]/40 border-[var(--red)]';
              else if (isSelected) cardClass = 'bg-[var(--red-bg)]/30 border-[var(--red)]';
              else cardClass = 'bg-[var(--jade-bg)]/20 border-[var(--jade)]/50';
              // Microanimación de feedback: rebote al acertar la intrusa,
              // sacudida al fallar, y rebote de la intrusa real para revelarla.
              if (isSelected && result === 'correct') animClass = 'j-pop';
              else if (isSelected && result === 'incorrect') animClass = 'j-shake';
              else if (isIntruder && result === 'incorrect') animClass = 'j-pop';
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(item)}
                disabled={!!result}
                className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center transition-all active:scale-95 ${cardClass} ${animClass}`}
              >
                <span className="text-4xl font-bold text-[var(--ink)] mb-1">{item}</span>
                {result && isIntruder && (
                  <span className="text-xs text-[var(--red)] font-bold mt-1">{t('intruder_this_one')}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback (aria-live para lectores de pantalla) */}
        <div aria-live="polite" role="status">
          {result === 'correct' && (
            <div className="bg-[var(--jade-bg)]/30 border border-[var(--jade)] rounded-xl p-3 animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl"></span>
                <p className="text-[var(--jade)] font-bold text-sm">{t('sov_correct')}</p>
              </div>
              <p className="text-[var(--ink-soft)] text-xs">
                {t('intruder_explanation', { group: current.category?.[lang] || current.category?.es })}
              </p>
            </div>
          )}
          {result === 'incorrect' && (
            <div className="bg-[var(--red-bg)]/30 border border-[var(--red)] rounded-xl p-3 animate-fade-in">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl"></span>
                <p className="text-[var(--red)] font-bold text-sm">{t('sov_incorrect')}</p>
              </div>
              <p className="text-xs text-[var(--mute)]">{t('intruder_correct_was')}</p>
              <p className="text-[var(--ink)] font-bold text-lg mt-0.5">{current.intruder}</p>
              <p className="text-[var(--ink-soft)] text-xs mt-1">
                {t('intruder_explanation', { group: current.category?.[lang] || current.category?.es })}
              </p>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          {!result && (
            <>
              {!showHint && (
                <button onClick={() => setShowHint(true)} className="flex-1 py-3 rounded-xl border border-[rgba(28,24,19,0.18)] text-[var(--mute)] hover:text-[var(--ink)] hover:border-[rgba(28,24,19,0.18)] text-sm font-medium transition-colors">
                  {t('sov_hint_button')}
                </button>
              )}
            </>
          )}
          {result && (
            <button onClick={handleNext} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${result === 'correct' ? 'bg-[var(--jade)] hover:bg-[var(--jade-deep)] text-[var(--on-accent)]' : 'bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] text-[var(--ink-soft)]'}`}>
              {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
