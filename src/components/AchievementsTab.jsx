// src/components/AchievementsTab.jsx
// Unified achievements tab — uses leveling.js as single source of truth
import { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './ui/Card';
import { getAllAchievements, getLevelInfo, LEVELS } from '@/utils/leveling.js';
import { getStreak } from '@/utils/streak.js';

const RARITY_CONFIG = {
  easy:      { label: 'achievements_rarity_easy',      color: 'bg-green-900/20',  border: 'border-green-700',  text: 'text-green-400'  },
  medium:    { label: 'achievements_rarity_medium',    color: 'bg-blue-900/20',   border: 'border-blue-700',   text: 'text-blue-400'   },
  hard:      { label: 'achievements_rarity_hard',      color: 'bg-purple-900/20', border: 'border-purple-700', text: 'text-purple-400' },
  legendary: { label: 'achievements_rarity_legendary', color: 'bg-yellow-900/20', border: 'border-yellow-700', text: 'text-yellow-400' },
};

function getAchievementRarity(ach) {
  const { condition, threshold } = ach;
  if (condition === 'complete_quiz' && threshold <= 1) return 'easy';
  if (condition === 'complete_quiz' && threshold <= 10) return 'medium';
  if (condition === 'complete_quiz' && threshold <= 50) return 'hard';
  if (condition === 'complete_quiz') return 'legendary';
  if (condition === 'streak' && threshold <= 7) return 'easy';
  if (condition === 'streak' && threshold <= 30) return 'medium';
  if (condition === 'streak' && threshold <= 60) return 'hard';
  if (condition === 'streak') return 'legendary';
  if (condition === 'perfect_score' && threshold <= 1) return 'easy';
  if (condition === 'perfect_score' && threshold <= 5) return 'medium';
  if (condition === 'perfect_score') return 'hard';
  if (condition === 'words_mastered' && threshold <= 10) return 'easy';
  if (condition === 'words_mastered' && threshold <= 50) return 'medium';
  if (condition === 'words_mastered') return 'hard';
  if (condition === 'daily_goals_completed' && threshold <= 7) return 'easy';
  if (condition === 'daily_goals_completed' && threshold <= 30) return 'medium';
  if (condition === 'daily_goals_completed') return 'hard';
  if (condition === 'lessons_seen') return 'medium';
  if (condition === 'time_race_score') return 'hard';
  return 'medium';
}

const AchievementsTab = memo(() => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState('all'); // all | unlocked | locked

  const streak = useMemo(() => getStreak(), []);
  const levelInfo = useMemo(() => getLevelInfo(streak.totalXP || 0), [streak.totalXP]);
  const achievements = useMemo(() => getAllAchievements(), []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  // Group by rarity
  const grouped = useMemo(() => {
    const groups = { easy: [], medium: [], hard: [], legendary: [] };
    achievements.forEach(ach => {
      const rarity = getAchievementRarity(ach);
      groups[rarity].push({ ...ach, rarity });
    });
    return groups;
  }, [achievements]);

  // Filter
  const filterAch = (list) => {
    if (filter === 'unlocked') return list.filter(a => a.unlocked);
    if (filter === 'locked') return list.filter(a => !a.unlocked);
    return list;
  };

  return (
    <div className="space-y-6 pb-24">

      {/* Level overview */}
      <Card variant="elevated">
        <div className="text-center">
          <div className="text-5xl mb-2">{levelInfo.icon}</div>
          <h3 className="text-white font-bold text-lg">
            {t('settings_level_current', { level: levelInfo.level })}
          </h3>
          <p className="text-gray-400 text-sm">
            {levelInfo.title?.[i18n.language] || levelInfo.title?.es} · {levelInfo.zh}
          </p>

          {/* XP bar */}
          {!levelInfo.isMaxLevel && (
            <div className="mt-4 px-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Lv.{levelInfo.level}</span>
                <span>{levelInfo.xpInLevel} / {levelInfo.xpForNext} XP</span>
                <span>Lv.{levelInfo.level + 1}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-700"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
            </div>
          )}
          {levelInfo.isMaxLevel && (
            <p className="text-purple-400 font-bold text-sm mt-3">
              {t('level_max_reached')}
            </p>
          )}

          <p className="text-xs text-gray-500 mt-3">
            {streak.totalXP || 0} XP {t('settings_level_total')}
          </p>
        </div>
      </Card>

      {/* Achievement progress ring */}
      <Card variant="elevated">
        <div className="text-center">
          <h3 className="text-white font-semibold mb-4">{t('achievements_progress_title')}</h3>
          <div className="relative w-28 h-28 mx-auto mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#374151" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="#8b5cf6" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(progressPercent / 100) * 339.29} 339.29`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{unlockedCount}</p>
                <p className="text-xs text-gray-400">/ {totalCount}</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            {totalCount - unlockedCount} {t('achievements_remaining')}
          </p>
        </div>
      </Card>

      {/* Filter buttons */}
      <div className="flex gap-2">
        {['all', 'unlocked', 'locked'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-500'
            }`}
          >
            {t(`achievements_filter_${f}`)}
          </button>
        ))}
      </div>

      {/* Achievements by rarity */}
      {Object.entries(RARITY_CONFIG).map(([rarity, config]) => {
        const list = filterAch(grouped[rarity]);
        if (list.length === 0) return null;
        const unlockedInGroup = list.filter(a => a.unlocked).length;
        return (
          <div key={rarity}>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className={`text-xs font-bold uppercase tracking-widest ${config.text}`}>
                {t(config.label)}
              </p>
              <p className="text-xs text-gray-500">
                {unlockedInGroup}/{list.length}
              </p>
            </div>
            <div className="space-y-2">
              {list.map(ach => (
                <div
                  key={ach.id}
                  className={`rounded-xl border-2 p-3 flex items-center gap-3 transition-all ${
                    ach.unlocked
                      ? `${config.color} ${config.border}`
                      : 'bg-gray-800/50 border-gray-700 opacity-50'
                  }`}
                >
                  <div className="text-3xl flex-shrink-0">{ach.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">
                      {ach.title?.[i18n.language] || ach.title?.es}
                      <span className="text-gray-500 text-xs ml-1">{ach.zh}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {ach.desc?.[i18n.language] || ach.desc?.es}
                    </p>
                  </div>
                  {ach.unlocked ? (
                    <span className="text-green-400 text-sm font-bold">✓</span>
                  ) : (
                    <span className="text-gray-600 text-lg">🔒</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Level roadmap */}
      <Card variant="elevated">
        <h3 className="text-white font-semibold mb-4">{t('achievements_level_roadmap')}</h3>
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {LEVELS.map(lvl => {
            const reached = (streak.totalXP || 0) >= lvl.xp;
            const isCurrent = levelInfo.level === lvl.level;
            return (
              <div
                key={lvl.level}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isCurrent ? 'bg-purple-900/40 border border-purple-600/50' :
                  reached ? 'bg-gray-700/30' : 'opacity-40'
                }`}
              >
                <span className="text-lg w-8 text-center">{reached ? lvl.icon : '🔒'}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-white font-medium">
                    Lv.{lvl.level} — {lvl.title?.[i18n.language] || lvl.title?.es}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">{lvl.zh}</span>
                </div>
                <span className="text-xs text-gray-500 flex-shrink-0">
                  {lvl.xp.toLocaleString()} XP
                </span>
                {isCurrent && (
                  <span className="text-xs text-purple-400 font-bold flex-shrink-0">←</span>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
});

AchievementsTab.displayName = 'AchievementsTab';
export default AchievementsTab;
