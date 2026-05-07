// src/components/LessonDetail.jsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { useWindowSize } from '@/hooks/useWindowSize.js';
import Confetti from 'react-confetti';
import { useTranslation } from 'react-i18next';
import { getLessonStats, toggleWordMastered } from '@/utils/progress.js';
import { toggleWordDifficult, isWordDifficult } from '@/utils/srs.js';
import GrammarTab from './GrammarTab.jsx';
import CulturalTab from './CulturalTab.jsx';
import grammarData from '@/data/grammarData.js';

const ACCENT = {
  1: { border: 'border-red-500',    bar: 'bg-red-500',    text: 'text-red-400',    light: 'text-red-300',    tab: 'bg-red-600',    icon: 'bg-red-900/60'    },
  2: { border: 'border-orange-500', bar: 'bg-orange-500', text: 'text-orange-400', light: 'text-orange-300', tab: 'bg-orange-600', icon: 'bg-orange-900/60' },
  3: { border: 'border-yellow-500', bar: 'bg-yellow-400', text: 'text-yellow-400', light: 'text-yellow-300', tab: 'bg-yellow-600', icon: 'bg-yellow-900/60' },
  4: { border: 'border-green-500',  bar: 'bg-green-500',  text: 'text-green-400',  light: 'text-green-300',  tab: 'bg-green-600',  icon: 'bg-green-900/60'  },
};

const TYPE_COLORS = {
  'V.':    'bg-blue-900/70 text-blue-300',
  'S.':    'bg-gray-700 text-gray-300',
  'Adj.':  'bg-purple-900/70 text-purple-300',
  'Pron.': 'bg-teal-900/70 text-teal-300',
  'Adv.':  'bg-indigo-900/70 text-indigo-300',
  'Num.':  'bg-pink-900/70 text-pink-300',
  'Clas.': 'bg-yellow-900/70 text-yellow-300',
  'Conj.': 'bg-orange-900/70 text-orange-300',
  'Pt.m.': 'bg-red-900/70 text-red-300',
  'NP.':   'bg-emerald-900/70 text-emerald-300',
};

const EXERCISE_DEFS = [
  { key: 'learn',    icon: '\u{1F4D6}', labelKey: 'exercise_study',    descKey: 'exercise_study_desc',    iconBg: 'bg-blue-900/50'   },
  { key: 'quiz',     icon: '\u{1F3AF}', labelKey: 'exercise_quiz',     descKey: 'exercise_quiz_desc',     iconBg: 'bg-red-900/50'    },
  { key: 'matching', icon: '\u{1F517}', labelKey: 'exercise_matching', descKey: 'exercise_matching_desc', iconBg: 'bg-green-900/50'  },
  { key: 'writing',  icon: '✍️', labelKey: 'exercise_writing',  descKey: 'exercise_writing_desc',  iconBg: 'bg-orange-900/50' },
];

function StatusIcon({ status }) {
  if (status === 'mastered') return <span className="text-green-400 text-base">★</span>;
  if (status === 'seen')     return <span className="text-yellow-500 text-base">◑</span>;
  return <span className="text-gray-600 text-base">○</span>;
}

export default function LessonDetail({
  lessonNum,
  lessonData,
  characters,
  progress,
  onProgressChange,
  goBack,
  onStartExercise,
  speakChinese,
  defaultTab = 'vocab',
  onTabChange,
}) {
  const [tab, setTab] = useState(defaultTab);
  const { width, height } = useWindowSize();

  const handleTabChange = (id) => {
    setTab(id);
    onTabChange?.(id);
  };
  const { t } = useTranslation();
  const [showSupp, setShowSupp] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const a = ACCENT[lessonNum] || ACCENT[1];

  const mainWords = useMemo(() => characters.filter(c => c.lesson === lessonNum && !c.isSupplementary), [characters, lessonNum]);
  const suppWords  = useMemo(() => characters.filter(c => c.lesson === lessonNum && c.isSupplementary),  [characters, lessonNum]);
  const shownWords = showSupp ? [...mainWords, ...suppWords] : mainWords;

  const stats = useMemo(() => getLessonStats(progress, lessonNum, characters), [progress, lessonNum, characters]);
  const seenPct     = stats.total > 0 ? Math.round((stats.seen    / stats.total) * 100) : 0;
  const masteredPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

  // Confetti al llegar al 100%
  const [showConfetti, setShowConfetti] = useState(false);
  const prevMasteredPct = useRef(masteredPct);
  useEffect(() => {
    if (masteredPct === 100 && prevMasteredPct.current < 100) {
      setShowConfetti(true);
      const t = setTimeout(() => setShowConfetti(false), 4000);
      prevMasteredPct.current = masteredPct;
      return () => clearTimeout(t);
    }
    prevMasteredPct.current = masteredPct;
  }, [masteredPct]);

  const getStatus = (char) => {
    const w = progress?.[`lesson_${lessonNum}`]?.[char];
    if (!w) return 'unseen';
    if (w.mastered) return 'mastered';
    if (w.seen) return 'seen';
    return 'unseen';
  };

  const handleToggle = (char, status) => {
    const updated = toggleWordMastered(progress, lessonNum, char, status !== 'mastered');
    onProgressChange(updated);
  };

  const handleToggleDifficult = (char) => {
    const updated = toggleWordDifficult(progress, char);
    onProgressChange(updated);
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={250}
          gravity={0.25}
          colors={['#22c55e', '#86efac', '#fbbf24', '#f87171', '#60a5fa', '#c084fc']}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
        />
      )}

      {/* Header */}
      <div className={`bg-gray-800 border-b border-gray-700 border-l-4 ${a.border} px-4 pt-10 pb-4`}>
        <button onClick={goBack} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-3 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          Inicio
        </button>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className={`text-xs font-bold uppercase tracking-widest ${a.light} mb-0.5`}>
              Lección {lessonNum}
            </p>
            <h1 className="text-xl font-bold text-white leading-snug">
              {lessonData?.titleEs || ''}
            </h1>
            <p className={`text-sm ${a.text} mt-0.5`}>{lessonData?.titleZh || ''}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-bold text-white">{masteredPct}%</p>
            <p className="text-xs text-gray-400">{t('lesson_mastered_pct')}</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{stats.mastered} {t('lesson_mastered_label')} · {stats.seen - stats.mastered} {t('lesson_seen_label')} · {stats.unseen} {t('lesson_unseen_label')}</span>
            <span>{stats.total} {t('lesson_words_label')}</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${a.bar} rounded-full transition-all duration-500`} style={{ width: `${seenPct}%` }} />
          </div>
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${masteredPct}%` }} />
          </div>
          <div className="flex gap-4 text-xs pt-0.5">
            <span className={a.text}>&#9642; {t('lesson_seen_label')}</span>
            <span className="text-green-400">&#9642; {t('lesson_mastered_label')}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto">
        {[
          { id: 'vocab',     label: `${t('lesson_tab_vocab')} (${stats.total})` },
          { id: 'exercises', label: t('lesson_tab_practice') },
          { id: 'grammar',   label: t('lesson_tab_grammar') },
          { id: 'culture',   label: t('lesson_tab_culture') },
        ].map(tabItem => (
          <button
            key={tabItem.id}
            onClick={() => handleTabChange(tabItem.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors whitespace-nowrap ${
              tab === tabItem.id
                ? `${a.tab} text-white border-transparent`
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      <div className="px-4 pb-6">

        {/* Tab Vocabulario */}
        {tab === 'vocab' && (
          <div>
            {suppWords.length > 0 && (
              <button
                onClick={() => setShowSupp(!showSupp)}
                className={`mb-3 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  showSupp
                    ? 'bg-purple-800 text-purple-200 border-purple-600'
                    : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-500'
                }`}
              >
                {t('lesson_extra_vocab')} ({suppWords.length})
              </button>
            )}

            <div className="space-y-2">
              {shownWords.map(word => {
                const status = getStatus(word.char);
                const isOpen = selectedCard === word.char;
                return (
                  <div
                    key={word.char}
                    onClick={() => setSelectedCard(isOpen ? null : word.char)}
                    className={`rounded-xl border cursor-pointer transition-all ${
                      isWordDifficult(progress, word.char) ? 'border-orange-500 bg-gray-800' :
                      status === 'mastered'                ? 'border-green-700/60 bg-gray-800' :
                      status === 'seen'                    ? 'border-yellow-700/40 bg-gray-800' :
                                                             'border-gray-700 bg-gray-800'
                    } ${isOpen ? 'ring-1 ring-gray-600' : ''}`}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <button
                        onClick={e => { e.stopPropagation(); handleToggle(word.char, status); }}
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors flex-shrink-0"
                      >
                        <StatusIcon status={status} />
                      </button>

                      <span className="text-2xl text-white font-medium w-9 text-center flex-shrink-0">{word.char}</span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-300">{word.pinyin}</span>
                          {word.type && (
                            <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_COLORS[word.type] || 'bg-gray-700 text-gray-400'}`}>
                              {word.type}
                            </span>
                          )}
                          {word.isSupplementary && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-purple-900/70 text-purple-300">extra</span>
                          )}
                        </div>
                        <p className="text-white text-sm font-medium mt-0.5 truncate">{word.meaning}</p>
                      </div>

                      <button
                        onClick={e => { e.stopPropagation(); handleToggleDifficult(word.char); }}
                        title={isWordDifficult(progress, word.char) ? t('vocab_unmark_difficult') : t('vocab_mark_difficult')}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors text-sm flex-shrink-0 ${
                          isWordDifficult(progress, word.char)
                            ? 'bg-orange-800/60 text-orange-400 hover:bg-orange-800'
                            : 'bg-gray-700 text-gray-500 hover:bg-gray-600 hover:text-orange-400'
                        }`}
                      >
                        &#9888;
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); speakChinese && speakChinese({ hanzi: word.char, pinyin: word.pinyin }); }}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-green-400 transition-colors text-sm flex-shrink-0"
                      >
                        &#128266;
                      </button>
                    </div>

                    {isOpen && word.examples && word.examples.length > 0 && (
                      <div className="px-3 pb-3 border-t border-gray-700 pt-2">
                        <p className="text-xs text-gray-500 mb-1.5">Ejemplos:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {word.examples.map((ex, i) => (
                            <span key={i} className="text-sm bg-gray-700 text-gray-200 px-2.5 py-1 rounded-lg">{ex}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Gramatica */}
        {tab === 'grammar' && (
          <GrammarTab
            grammarData={grammarData[lessonNum] || null}
            accent={{
              border: a.border,
              text: a.text,
              light: a.light,
              icon: a.icon,
            }}
          />
        )}

        {/* Tab Cultura */}
        {tab === 'culture' && (
          <CulturalTab
            lessonNum={lessonNum}
            accent={{
              icon: a.icon,
              ring: a.border,
            }}
          />
        )}

        {/* Tab Practicar */}
        {tab === 'exercises' && (
          <div className="space-y-3 pt-1">
            <button
              onClick={() => onStartExercise('exam')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl bg-gray-800 border-2 ${a.border} hover:bg-gray-750 transition-all text-left`}
            >
              <div className="w-10 h-10 rounded-lg bg-red-900/60 flex items-center justify-center text-xl flex-shrink-0">&#127891;</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm">{t('exercise_exam')}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{t('exercise_exam_desc')}</p>
              </div>
              <svg className="text-gray-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>

            <div className="grid grid-cols-2 gap-3">
              {EXERCISE_DEFS.map(ex => (
                <button
                  key={ex.key}
                  onClick={() => onStartExercise(ex.key)}
                  className="flex flex-col items-start p-3 sm:p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-500 hover:bg-gray-750 transition-all text-left"
                >
                  <div className={`w-9 h-9 rounded-lg ${ex.iconBg} flex items-center justify-center text-lg mb-2`}>
                    {ex.icon}
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-0.5">{t(ex.labelKey)}</h3>
                  <p className="text-gray-500 text-xs leading-tight">{t(ex.descKey)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
