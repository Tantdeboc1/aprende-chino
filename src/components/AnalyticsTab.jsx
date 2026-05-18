// src/components/AnalyticsTab.jsx
// Analytics tab — uses leveling.js and streak.js as source of truth
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './ui/Card';
import { getAllAchievements, getLevelInfo } from '@/utils/leveling.js';
import { getStreak } from '@/utils/streak.js';

const AnalyticsTab = memo(({ progress, allCharacters }) => {
  const { t, i18n } = useTranslation();
  const streak = useMemo(() => getStreak(), []);
  const levelInfo = useMemo(() => getLevelInfo(streak.totalXP || 0), [streak.totalXP]);
  const achievements = useMemo(() => getAllAchievements(), []);
  const unlockedAchievements = achievements.filter(a => a.unlocked);

  // SRS stats from progress.__srs
  const srsStats = useMemo(() => {
    const srs = progress?.__srs || {};
    let learned = 0, mature = 0, due = 0;
    const now = Date.now();
    for (const c of allCharacters) {
      if (c.isSupplementary) continue;
      const d = srs[c.char];
      if (!d || d.nextReview === null) continue;
      learned++;
      if (d.interval >= 21) mature++;
      if (d.nextReview <= now) due++;
    }
    return { learned, mature, due, total: allCharacters.filter(c => !c.isSupplementary).length };
  }, [progress, allCharacters]);

  // Activity chart (last 30 days)
  const chartData = useMemo(() => {
    const dates = streak.activityDates || [];
    const dateSet = new Set(dates);
    const last30 = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const str = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      last30.push({ day: String(date.getDate()), active: dateSet.has(str) });
    }
    return last30;
  }, [streak.activityDates]);

  const activeDays = chartData.filter(d => d.active).length;

  return (
    <div className="space-y-6 pb-24">

      {/* Quick stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label={t('analytics_level')}
          value={`Lv.${levelInfo.level}`}
          sub={levelInfo.title?.[i18n.language] || levelInfo.title?.es}
          color="bg-purple-900/40"
          icon={levelInfo.icon}
        />
        <StatCard
          label={t('analytics_total_xp')}
          value={(streak.totalXP || 0).toLocaleString()}
          sub="XP"
          color="bg-blue-900/40"
          icon="⚡"
        />
        <StatCard
          label={t('analytics_streak')}
          value={streak.currentStreak}
          sub={t('analytics_days')}
          color="bg-orange-900/40"
          icon={streak.currentStreak > 0 ? '🔥' : '😴'}
        />
        <StatCard
          label={t('analytics_achievements')}
          value={`${unlockedAchievements.length}/${achievements.length}`}
          sub={`${Math.round((unlockedAchievements.length / achievements.length) * 100)}%`}
          color="bg-yellow-900/40"
          icon="🏅"
        />
      </div>

      {/* SRS overview */}
      <Card variant="elevated">
        <h3 className="text-white font-semibold mb-3">{t('analytics_srs_title')}</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-purple-400">{srsStats.learned}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('analytics_srs_learned')}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">{srsStats.mature}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('analytics_srs_mature')}</p>
          </div>
          <div>
            <p className={`text-2xl font-bold ${srsStats.due > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>{srsStats.due}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('analytics_srs_due')}</p>
          </div>
        </div>
        {srsStats.total > 0 && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>{t('analytics_srs_progress')}</span>
              <span>{Math.round((srsStats.learned / srsStats.total) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${(srsStats.learned / srsStats.total) * 100}%` }} />
            </div>
          </div>
        )}
      </Card>

      {/* Activity last 30 days */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">{t('analytics_activity_title')}</h3>
          <span className="text-xs text-gray-400">{activeDays}/30 {t('analytics_days')}</span>
        </div>
        <div className="flex gap-1 items-end h-16">
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`w-full rounded-sm transition-all ${d.active ? 'bg-purple-500' : 'bg-gray-700'}`}
                style={{ height: d.active ? '100%' : '20%' }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>30d</span>
          <span>{t('analytics_today')}</span>
        </div>
      </Card>

      {/* Streak records */}
      <Card variant="elevated">
        <h3 className="text-white font-semibold mb-3">{t('analytics_streak_records')}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-700/30 rounded-lg p-3 text-center">
            <p className="text-3xl font-bold text-orange-400">🔥 {streak.currentStreak}</p>
            <p className="text-xs text-gray-500 mt-1">{t('analytics_current_streak')}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-3 text-center">
            <p className="text-3xl font-bold text-yellow-400">⭐ {streak.longestStreak}</p>
            <p className="text-xs text-gray-500 mt-1">{t('analytics_best_streak')}</p>
          </div>
        </div>
      </Card>

      {/* Recent achievements */}
      {unlockedAchievements.length > 0 && (
        <Card variant="elevated">
          <h3 className="text-white font-semibold mb-3">{t('analytics_recent_achievements')}</h3>
          <div className="grid grid-cols-4 gap-2">
            {unlockedAchievements.slice(-8).map(ach => (
              <div key={ach.id} className="text-center p-2 rounded-lg bg-yellow-900/20 border border-yellow-700/50">
                <div className="text-2xl">{ach.icon}</div>
                <p className="text-xs text-white font-medium mt-1 line-clamp-1">
                  {ach.title?.[i18n.language] || ach.title?.es}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Level progress toward next */}
      {!levelInfo.isMaxLevel && (
        <Card variant="elevated">
          <h3 className="text-white font-semibold mb-3">{t('analytics_next_level')}</h3>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{levelInfo.icon}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Lv.{levelInfo.level}</span>
                <span>{levelInfo.xpInLevel}/{levelInfo.xpForNext} XP</span>
                <span>Lv.{levelInfo.level + 1}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all"
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {levelInfo.xpForNext - levelInfo.xpInLevel} XP {t('analytics_xp_remaining')}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
});

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className={`${color} rounded-xl p-4 text-center border border-gray-700/50`}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

AnalyticsTab.displayName = 'AnalyticsTab';
export default AnalyticsTab;
