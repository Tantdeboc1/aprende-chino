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
  1: { bg: 'bg-[#c8392f]',    border: 'border-[#c8392f]',    text: 'text-[#c8392f]'    },
  2: { bg: 'bg-[#b88a3e]', border: 'border-[#b88a3e]', text: 'text-[#b88a3e]' },
  3: { bg: 'bg-[#b88a3e]', border: 'border-[#b88a3e]', text: 'text-[#b88a3e]' },
  4: { bg: 'bg-[#2f6b4a]',  border: 'border-[#2f6b4a]',  text: 'text-[#2f6b4a]'  },
};
const DEFAULT_COLOR = { bg: 'bg-[#2f6b4a]', border: 'border-[#2f6b4a]', text: 'text-[#2f6b4a]' };

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
    const emoji = pct === 100 ? '' : pct >= 70 ? '' : '';
    return (
      <div className="min-h-screen bg-[#f4ecdc] flex flex-col items-center justify-center p-6">
        <div className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] rounded-2xl p-8 max-w-sm w-full text-center shadow-sm">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-[#1c1813] mb-1">{t('dialogue_results_title')}</h2>
          <p className="text-[#928a76] mb-6">{t('dialogue_results_subtitle')}</p>
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
            <button onClick={() => initRound(lessonFilter)} className="w-full py-3 rounded-xl bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-bold transition-colors">
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

  const lang = i18n.language;

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
            <h1 className="text-lg font-bold text-[#1c1813]">{t('dialogue_title')}</h1>
            <p className="text-sm text-[#928a76]">{t('dialogue_subtitle')}</p>
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
          {[1, 2, 3, 4].map(n => (
            <button key={n} onClick={() => setLessonFilter(n)} className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${lessonFilter === n ? `${LESSON_COLORS[n].bg} text-[#fbf5e6] border-transparent` : 'bg-[#fbf5e6] text-[#928a76] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'}`}>
              L{n}
            </button>
          ))}
        </div>

        {/* Zona de respuesta (diálogo ordenado) */}
        <div>
          <p className="text-xs text-[#928a76] mb-2">{t('dialogue_answer_zone')}</p>
          <div className={`min-h-[120px] rounded-xl border-2 p-3 space-y-2 transition-colors ${
            result === 'correct'   ? 'border-[#2f6b4a] bg-[#cfe1d3]/20' :
            result === 'incorrect' ? 'border-[#c8392f] bg-[#f0d6cf]/20' :
            placed.length > 0     ? `${accent.border} bg-[#fbf5e6]` :
                                    'border-[rgba(28,24,19,0.18)] bg-[#fbf5e6]/50 border-dashed'
          }`}>
            {placed.length === 0 && (
              <p className="text-[#928a76] text-sm text-center py-4">{t('dialogue_drop_here')}</p>
            )}
            {placed.map((item, i) => (
              <button
                key={item.id}
                onClick={() => handleRemoveLine(item)}
                disabled={!!result}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-start gap-2 ${
                  result === 'correct'   ? 'bg-[#2f6b4a]/50 cursor-default' :
                  result === 'incorrect' ? (item.id === i ? 'bg-[#2f6b4a]/30 border border-[#2f6b4a]/' : 'bg-[#c8392f]/30 border border-[#c8392f]/50') :
                                          'bg-[#f8f1de] hover:bg-[#bdb39a] active:scale-[0.98]'
                }`}
              >
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  item.speaker === 'A' ? 'bg-[#cfe1d3]/60 text-[#2f6b4a]' : 'bg-[#f0d6cf]/60 text-[#c8392f]'
                }`}>
                  {item.speaker}
                </span>
                <span className="text-[#1c1813] font-medium text-sm">{item.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Líneas disponibles */}
        {available.length > 0 && (
          <div>
            <p className="text-xs text-[#928a76] mb-2">{t('dialogue_lines_label')}</p>
            <div className="space-y-2">
              {available.map(item => (
                <button
                  key={item.id}
                  onClick={() => handlePickLine(item)}
                  disabled={!!result}
                  className="w-full text-left px-3 py-2 rounded-lg bg-[#f8f1de] hover:bg-[#bdb39a] active:scale-[0.98] transition-all border border-[rgba(28,24,19,0.18)] hover:border-[rgba(28,24,19,0.18)] flex items-start gap-2"
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.speaker === 'A' ? 'bg-[#cfe1d3]/60 text-[#2f6b4a]' : 'bg-[#f0d6cf]/60 text-[#c8392f]'
                  }`}>
                    {item.speaker}
                  </span>
                  <span className="text-[#1c1813] font-medium text-sm">{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Resultado correcto: mostrar diálogo completo */}
        {result === 'correct' && (
          <div className="bg-[#cfe1d3]/30 border border-[#2f6b4a] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl"></span>
              <p className="text-[#2f6b4a] font-bold text-sm">{t('sov_correct')}</p>
            </div>
            {showTranslation && current.translations?.[lang] && (
              <div className="space-y-1 mt-2 pt-2 border-t border-[#2f6b4a]/">
                {current.translations[lang].map((tr, i) => (
                  <p key={i} className="text-[#5b5446] text-xs">
                    <span className="text-[#928a76] font-bold">{current.lines[i].speaker}:</span> {tr}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        {result === 'incorrect' && (
          <div className="bg-[#f0d6cf]/30 border border-[#c8392f] rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl"></span>
              <p className="text-[#c8392f] font-bold text-sm">{t('sov_incorrect')}</p>
            </div>
            <p className="text-xs text-[#928a76] mb-1">{t('dialogue_correct_order')}</p>
            <div className="space-y-1">
              {current.lines.map((line, i) => (
                <p key={i} className="text-[#1c1813] text-sm">
                  <span className="text-[#928a76] font-bold">{line.speaker}:</span> {line.text}
                  <span className="text-[#928a76] text-xs ml-1">({line.pinyin})</span>
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
                <button onClick={() => setShowTranslation(true)} className="flex-1 py-3 rounded-xl border border-[rgba(28,24,19,0.18)] text-[#928a76] hover:text-[#1c1813] hover:border-[rgba(28,24,19,0.18)] text-sm font-medium transition-colors">
                  {t('dialogue_show_translation')}
                </button>
              )}
              <button
                onClick={handleCheck}
                disabled={placed.length !== current.lines.length}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
                  placed.length === current.lines.length ? `${accent.bg} hover:opacity-90 text-[#1c1813]` : 'bg-[#f8f1de] text-[#928a76] cursor-not-allowed'
                }`}
              >
                {t('sov_check_button')}
              </button>
            </>
          )}

          {/* Traducción como pista antes de comprobar */}
          {!result && showTranslation && current.translations?.[lang] && (
            <div className="w-full bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] rounded-xl p-3 space-y-1">
              {current.translations[lang].map((tr, i) => (
                <p key={i} className="text-[#b88a3e] text-xs">• {tr}</p>
              ))}
            </div>
          )}

          {result === 'correct' && (
            <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-bold text-sm transition-colors">
              {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')} →
            </button>
          )}

          {result === 'incorrect' && (
            <div className="flex gap-3 flex-1">
              <button onClick={handleRetry} className="flex-1 py-3 rounded-xl border border-[rgba(28,24,19,0.18)] text-[#928a76] hover:text-[#1c1813] text-sm font-medium transition-colors">
                {t('sov_retry_button')}
              </button>
              <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-[#f8f1de] hover:bg-[#bdb39a] text-[#5b5446] font-bold text-sm transition-colors">
                {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
