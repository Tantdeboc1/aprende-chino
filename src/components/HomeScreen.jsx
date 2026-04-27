// src/components/HomeScreen.jsx
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getLessonStats } from '@/utils/progress.js';
import { getDueCount, getSRSStats } from '@/utils/srs.js';
import { getStreak } from '@/utils/streak.js';

const LESSONS = [
  {
    key: 'intro',
    num: null,
    color: { border: 'border-l-purple-500', dot: 'bg-purple-500', bar: 'bg-purple-500', text: 'text-purple-400', icon: 'bg-purple-900/50' },
    titleKey: 'lesson_intro_title',
    titleZh: '入门',
    subtitleKey: 'lesson_intro_subtitle',
  },
  {
    key: 'lesson-1',
    num: 1,
    color: { border: 'border-l-red-500', dot: 'bg-red-500', bar: 'bg-red-500', text: 'text-red-400', icon: 'bg-red-900/50' },
    titleKey: 'lesson_1_title',
    titleZh: '你最近怎么样',
    subtitleKey: 'lesson_1_subtitle',
  },
  {
    key: 'lesson-2',
    num: 2,
    color: { border: 'border-l-orange-500', dot: 'bg-orange-500', bar: 'bg-orange-500', text: 'text-orange-400', icon: 'bg-orange-900/50' },
    titleKey: 'lesson_2_title',
    titleZh: '你是哪国人？',
    subtitleKey: 'lesson_2_subtitle',
  },
  {
    key: 'lesson-3',
    num: 3,
    color: { border: 'border-l-yellow-500', dot: 'bg-yellow-500', bar: 'bg-yellow-400', text: 'text-yellow-400', icon: 'bg-yellow-900/50' },
    titleKey: 'lesson_3_title',
    titleZh: '你家有几口人？',
    subtitleKey: 'lesson_3_subtitle',
  },
  {
    key: 'lesson-4',
    num: 4,
    color: { border: 'border-l-green-500', dot: 'bg-green-500', bar: 'bg-green-500', text: 'text-green-400', icon: 'bg-green-900/50' },
    titleKey: 'lesson_4_title',
    titleZh: '你明天几点有课？',
    subtitleKey: 'lesson_4_subtitle',
  },
];

function LessonCard({ lesson, progress, allCharacters, onClick, t }) {
  const stats = useMemo(() => {
    if (lesson.num === null) return null;
    return getLessonStats(progress, lesson.num, allCharacters);
  }, [progress, lesson.num, allCharacters]);

  const pct = stats && stats.total > 0 ? Math.round((stats.seen / stats.total) * 100) : 0;
  const masteredPct = stats && stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className={`w-full bg-gray-800 border border-gray-700 border-l-4 ${lesson.color.border} rounded-xl p-4 flex items-center gap-3 hover:bg-gray-750 hover:border-gray-600 transition-all text-left active:scale-[0.99]`}
    >
      {/* Icono */}
      <div className={`w-10 h-10 rounded-lg ${lesson.color.icon} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-bold text-base">
          {lesson.num === null ? '0' : lesson.num}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-white font-semibold text-sm truncate">{t(lesson.titleKey)}</span>
          {stats && (
            <span className={`text-xs font-bold flex-shrink-0 ${masteredPct === 100 ? 'text-green-400' : lesson.color.text}`}>
              {masteredPct === 100 ? '✓' : `${pct}%`}
            </span>
          )}
        </div>
        <p className="text-gray-400 text-xs truncate">{t(lesson.subtitleKey)}</p>
        {stats && stats.total > 0 && (
          <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${lesson.color.bar} rounded-full transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </div>

      {/* Flecha */}
      <svg className="text-gray-600 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  );
}

export default function HomeScreen({ userName, progress, allCharacters, onSelectLesson, onSelectIntro, onStartReview }) {
  const { t } = useTranslation();
  const totalMastered = useMemo(() => {
    let total = 0;
    for (let i = 1; i <= 4; i++) {
      const stats = getLessonStats(progress, i, allCharacters);
      total += stats.mastered;
    }
    return total;
  }, [progress, allCharacters]);

  const totalWords  = useMemo(() => allCharacters.filter(c => !c.isSupplementary).length, [allCharacters]);
  const dueCount    = useMemo(() => getDueCount(progress, allCharacters), [progress, allCharacters]);
  const srsStats    = useMemo(() => getSRSStats(progress, allCharacters),  [progress, allCharacters]);
  const streak      = useMemo(() => getStreak(), [progress]);

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 pt-10 pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">学</span>
          </div>
          <span className="text-white font-bold text-base">Aprende Chino</span>
        </div>

        <div className="mt-3">
          <h1 className="text-xl font-bold text-white">
            {t('home_greeting', { name: userName || 'Estudiante' })}
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">{t('home_subtitle')}</p>
        </div>

        {/* Stats rápidas */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1 bg-gray-700/50 rounded-lg px-2 py-2 text-center">
            <p className="text-white font-bold text-lg">{totalMastered}</p>
            <p className="text-gray-400 text-xs">{t('home_mastered')}</p>
          </div>
          <div className="flex-1 bg-gray-700/50 rounded-lg px-2 py-2 text-center">
            <p className="text-white font-bold text-lg">
              {totalWords > 0 ? Math.round((totalMastered / totalWords) * 100) : 0}%
            </p>
            <p className="text-gray-400 text-xs">{t('home_completed')}</p>
          </div>
          <div className={`flex-1 rounded-lg px-2 py-2 text-center ${streak.currentStreak > 0 ? 'bg-orange-900/40 border border-orange-700/40' : 'bg-gray-700/50'}`}>
            <p className={`font-bold text-lg ${streak.currentStreak > 0 ? 'text-orange-400' : 'text-white'}`}>
              {streak.currentStreak > 0 ? '🔥' : '—'}{streak.currentStreak > 0 ? streak.currentStreak : ''}
            </p>
            <p className="text-gray-400 text-xs">{t('home_streak')}</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-4 pt-5 space-y-6">

        {/* Tarjeta SRS — solo si hay repasos pendientes o palabras aprendidas */}
        {srsStats.learned > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{t('home_section_review', 'Repaso')}</p>
            <button
              onClick={onStartReview}
              className={`w-full rounded-xl p-4 flex items-center gap-3 transition-all text-left border ${
                dueCount > 0
                  ? 'bg-red-900/20 border-red-700/50 hover:bg-red-900/30'
                  : 'bg-gray-800 border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl ${
                dueCount > 0 ? 'bg-red-900/60' : 'bg-gray-700'
              }`}>
                🔁
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-semibold text-sm">{t('home_srs_title', 'Repasar ahora')}</span>
                  {dueCount > 0 && (
                    <span className="bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{dueCount}</span>
                  )}
                </div>
                <p className="text-gray-400 text-xs">
                  {dueCount > 0
                    ? t('home_srs_due', '{{count}} tarjetas pendientes de repaso', { count: dueCount })
                    : t('home_srs_ok', '¡Al día! {{learned}} palabras aprendidas', { learned: srsStats.learned })
                  }
                </p>
              </div>
              <svg className="text-gray-600 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}

        {/* Introducción */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{t('home_section_basics')}</p>
          <LessonCard
            lesson={LESSONS[0]}
            progress={progress}
            allCharacters={allCharacters}
            onClick={onSelectIntro}
            t={t}
          />
        </div>

        {/* Lecciones */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{t('home_section_lessons')}</p>
          <div className="space-y-3">
            {LESSONS.slice(1).map(lesson => (
              <LessonCard
                key={lesson.key}
                lesson={lesson}
                progress={progress}
                allCharacters={allCharacters}
                onClick={() => onSelectLesson(lesson.num)}
                t={t}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
