// src/components/LessonHub.jsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getLessonStats, toggleWordMastered } from '@/utils/progress.js';

const LESSON_ACCENT = {
  1: { border: 'border-red-600', bg: 'bg-red-600', text: 'text-red-400', light: 'text-red-300', bar: 'bg-red-500', badge: 'bg-red-900 text-red-300 border-red-700' },
  2: { border: 'border-orange-600', bg: 'bg-orange-600', text: 'text-orange-400', light: 'text-orange-300', bar: 'bg-orange-500', badge: 'bg-orange-900 text-orange-300 border-orange-700' },
  3: { border: 'border-yellow-500', bg: 'bg-yellow-500', text: 'text-yellow-400', light: 'text-yellow-300', bar: 'bg-yellow-400', badge: 'bg-yellow-900 text-yellow-300 border-yellow-700' },
  4: { border: 'border-green-600', bg: 'bg-green-600', text: 'text-green-400', light: 'text-green-300', bar: 'bg-green-500', badge: 'bg-green-900 text-green-300 border-green-700' },
};

const TYPE_COLORS = {
  'V.': 'bg-blue-900 text-blue-300',
  'S.': 'bg-gray-700 text-gray-300',
  'Adj.': 'bg-purple-900 text-purple-300',
  'Pron.': 'bg-teal-900 text-teal-300',
  'Adv.': 'bg-indigo-900 text-indigo-300',
  'Num.': 'bg-pink-900 text-pink-300',
  'Clas.': 'bg-yellow-900 text-yellow-300',
  'Conj.': 'bg-orange-900 text-orange-300',
  'Pt.m.': 'bg-red-900 text-red-300',
  'NP.': 'bg-emerald-900 text-emerald-300',
};

function StatusIcon({ status, t }) {
  if (status === 'mastered') return <span title={t('lesson_hub_status_mastered_title')} className="text-green-400 text-lg">★</span>;
  if (status === 'seen') return <span title={t('lesson_hub_status_seen_title')} className="text-yellow-500 text-lg">◑</span>;
  return <span title={t('lesson_hub_status_unseen_title')} className="text-gray-600 text-lg">○</span>;
}

export default function LessonHub({
  lessonNum,
  lessonData,
  characters,
  progress,
  onProgressChange,
  goBack,
  onStartExercise,
  speakChinese,
}) {
  const { t } = useTranslation();
  const [tab, setTab] = useState('vocab');
  const [showSupp, setShowSupp] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const a = LESSON_ACCENT[lessonNum] || LESSON_ACCENT[1];

  const mainWords = useMemo(() => characters.filter(c => c.lesson === lessonNum && !c.isSupplementary), [characters, lessonNum]);
  const suppWords = useMemo(() => characters.filter(c => c.lesson === lessonNum && c.isSupplementary), [characters, lessonNum]);
  const shownWords = showSupp ? [...mainWords, ...suppWords] : mainWords;

  const stats = useMemo(() => getLessonStats(progress, lessonNum, characters), [progress, lessonNum, characters]);
  const masteredPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
  const seenPct = stats.total > 0 ? Math.round((stats.seen / stats.total) * 100) : 0;

  const getStatus = (char) => {
    const lessonKey = `lesson_${lessonNum}`;
    const w = progress?.[lessonKey]?.[char];
    if (!w) return 'unseen';
    if (w.mastered) return 'mastered';
    if (w.seen) return 'seen';
    return 'unseen';
  };

  const handleToggleMastered = (char, currentStatus) => {
    const newMastered = currentStatus !== 'mastered';
    const updated = toggleWordMastered(progress, lessonNum, char, newMastered);
    onProgressChange(updated);
  };

  const handleSpeak = (word) => {
    if (speakChinese) speakChinese({ hanzi: word.char, pinyin: word.pinyin });
  };

  const exercises = [
    { key: 'exam',      icon: '🎓', label: t('lesson_hub_ex_exam_label'),      desc: t('lesson_hub_ex_exam_desc'),      color: 'border-red-500 hover:border-red-400', highlight: true },
    { key: 'learn',     icon: '📖', label: t('lesson_hub_ex_learn_label'),     desc: t('lesson_hub_ex_learn_desc'),     color: 'border-blue-600 hover:border-blue-400' },
    { key: 'quiz',      icon: '🧠', label: t('lesson_hub_ex_quiz_label'),      desc: t('lesson_hub_ex_quiz_desc'),      color: 'border-purple-600 hover:border-purple-400' },
    { key: 'matching',  icon: '🎯', label: t('lesson_hub_ex_matching_label'),  desc: t('lesson_hub_ex_matching_desc'),  color: 'border-yellow-600 hover:border-yellow-400' },
    { key: 'writing',   icon: '✏️', label: t('lesson_hub_ex_writing_label'),   desc: t('lesson_hub_ex_writing_desc'),   color: 'border-orange-600 hover:border-orange-400' },
    { key: 'daily',     icon: '📅', label: t('lesson_hub_ex_daily_label'),     desc: t('lesson_hub_ex_daily_desc'),     color: 'border-green-600 hover:border-green-400' },
    { key: 'minigames', icon: '🎮', label: t('lesson_hub_ex_minigames_label'), desc: t('lesson_hub_ex_minigames_desc'), color: 'border-indigo-600 hover:border-indigo-400' },
  ];

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto">

      {/* Cabecera */}
      <button onClick={goBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-5 text-sm transition-colors">
        {t('lesson_hub_back')}
      </button>

      {/* Tarjeta de lección */}
      <div className={`rounded-2xl border-2 ${a.border} bg-gray-800 p-5 mb-5`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className={`text-xs font-bold uppercase tracking-widest ${a.light} mb-1`}>{t('lesson_hub_lesson', { num: lessonNum })}</p>
            <h1 className="text-2xl font-bold text-white mb-0.5">{lessonData?.titleEs || ''}</h1>
            <p className={`text-lg ${a.text}`}>{lessonData?.titleZh || ''}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{masteredPct}%</p>
            <p className="text-xs text-gray-400">{t('lesson_hub_mastered_pct_label')}</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>{t('lesson_hub_stats', { mastered: stats.mastered, seen: stats.seen - stats.mastered, unseen: stats.unseen })}</span>
            <span>{t('lesson_hub_total_words', { total: stats.total })}</span>
          </div>
          <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full ${a.bar} rounded-full transition-all duration-500`} style={{ width: seenPct + '%' }} />
          </div>
          <div className="h-1 bg-gray-700 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: masteredPct + '%' }} />
          </div>
          <div className="flex gap-4 text-xs mt-1.5">
            <span className={`${a.text}`}>▪ {t('lesson_hub_legend_seen')}</span>
            <span className="text-green-400">▪ {t('lesson_hub_legend_mastered')}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['vocab', 'exercises'].map(tabKey => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              tab === tabKey ? `${a.bg} text-white border-transparent` : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
            }`}
          >
            {tabKey === 'vocab' ? t('lesson_hub_vocab_tab', { count: stats.total }) : t('lesson_hub_exercises_tab')}
          </button>
        ))}
      </div>

      {/* Tab: Vocabulario */}
      {tab === 'vocab' && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setShowSupp(!showSupp)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                showSupp ? 'bg-purple-800 text-purple-200 border-purple-600' : 'bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-500'
              }`}
            >
              {t('lesson_hub_extra_vocab', { count: suppWords.length })}
            </button>
            <span className="text-gray-600 text-xs">{t('lesson_hub_tap_hint')}</span>
          </div>

          <div className="space-y-2">
            {shownWords.map((word) => {
              const status = getStatus(word.char);
              const isSelected = selectedCard === word.char;
              return (
                <div
                  key={word.char}
                  className={`rounded-xl border transition-all cursor-pointer ${
                    status === 'mastered' ? 'border-green-700 bg-gray-800' :
                    status === 'seen' ? 'border-yellow-700/50 bg-gray-800' :
                    'border-gray-700 bg-gray-800'
                  } ${isSelected ? 'ring-1 ring-gray-500' : ''}`}
                  onClick={() => setSelectedCard(isSelected ? null : word.char)}
                >
                  <div className="flex items-center gap-3 p-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleMastered(word.char, status); }}
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                      title={status === 'mastered' ? t('lesson_hub_mark_not_mastered') : t('lesson_hub_mark_mastered')}
                    >
                      <StatusIcon status={status} t={t} />
                    </button>

                    <span className="text-2xl text-white font-medium w-10 text-center flex-shrink-0">{word.char}</span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-300">{word.pinyin}</span>
                        {word.type && (
                          <span className={`text-xs px-1.5 py-0.5 rounded ${TYPE_COLORS[word.type] || 'bg-gray-700 text-gray-400'}`}>
                            {word.type}
                          </span>
                        )}
                        {word.isSupplementary && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-purple-900 text-purple-300">{t('lesson_hub_extra_badge')}</span>
                        )}
                      </div>
                      <p className="text-white text-sm font-medium mt-0.5 truncate">{word.meaning}</p>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleSpeak(word); }}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-700 hover:bg-gray-600 text-green-400 transition-colors text-sm"
                    >
                      🔊
                    </button>
                  </div>

                  {isSelected && word.examples && word.examples.length > 0 && (
                    <div className="px-3 pb-3 border-t border-gray-700 pt-2">
                      <p className="text-xs text-gray-500 mb-1.5">{t('lesson_hub_examples_label')}</p>
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

      {/* Tab: Ejercicios */}
      {tab === 'exercises' && (
        <div className="space-y-3">
          {/* Examen — tarjeta grande destacada */}
          {exercises.filter(ex => ex.highlight).map(ex => (
            <button
              key={ex.key}
              onClick={() => onStartExercise(ex.key)}
              className="w-full flex items-center gap-4 p-5 rounded-xl bg-gray-800 border-2 border-red-500 hover:border-red-400 hover:bg-gray-700 transition-all text-left"
            >
              <span className="text-4xl">{ex.icon}</span>
              <div>
                <h3 className="text-white font-bold text-base mb-0.5">{ex.label}</h3>
                <p className="text-gray-400 text-sm">{ex.desc}</p>
              </div>
              <span className="ml-auto text-gray-500 text-xl">→</span>
            </button>
          ))}

          {/* Resto de ejercicios — grid 2 cols */}
          <div className="grid grid-cols-2 gap-3">
            {exercises.filter(ex => !ex.highlight).map(ex => (
              <button
                key={ex.key}
                onClick={() => onStartExercise(ex.key)}
                className={`flex flex-col items-start p-4 rounded-xl bg-gray-800 border-2 ${ex.color} transition-all hover:scale-[1.02] text-left`}
              >
                <span className="text-2xl mb-2">{ex.icon}</span>
                <h3 className="text-white font-bold text-sm mb-1">{ex.label}</h3>
                <p className="text-gray-400 text-xs leading-tight">{ex.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
tems-start p-4 rounded-xl bg-gray-800 border-2 ${ex.color} transition-all hover:scale-[1.02] text-left`}
              >
                <span className="text-2xl mb-2">{ex.icon}</span>
                <h3 className="text-white font-bold text-sm mb-1">{ex.label}</h3>
                <p className="text-gray-400 text-xs leading-tight">{ex.desc}</p>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
