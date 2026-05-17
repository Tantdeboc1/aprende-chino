// src/components/ui/StreakPanel.jsx
// Panel de racha + XP diario + calendario de actividad + milestones
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getMilestones, getDailyGoalProgress } from '@/utils/streak.js';

// ── Mini-calendario GitHub-style (últimas 12 semanas) ─────────────────────────
function ActivityCalendar({ activityDates }) {
  const { t } = useTranslation();
  const weeks = useMemo(() => {
    const today = new Date();
    const set = new Set(activityDates || []);
    const grid = [];

    // 12 semanas = 84 días
    for (let w = 11; w >= 0; w--) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (w * 7 + (6 - d)));
        const str = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const isToday = date.toDateString() === today.toDateString();
        week.push({ date: str, active: set.has(str), isToday });
      }
      grid.push(week);
    }
    return grid;
  }, [activityDates]);

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-2">{t('streak_activity_label')}</p>
      <div className="flex gap-[3px] justify-center">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                title={day.date}
                className={`w-[10px] h-[10px] rounded-[2px] transition-colors ${
                  day.isToday
                    ? (day.active ? 'bg-green-400 ring-1 ring-green-300' : 'bg-gray-600 ring-1 ring-gray-400')
                    : day.active
                      ? 'bg-green-600'
                      : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Barra de progreso XP diario ───────────────────────────────────────────────
function DailyGoalBar() {
  const { t } = useTranslation();
  const goal = getDailyGoalProgress();

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-gray-500">{t('streak_daily_goal')}</p>
        <p className="text-xs font-bold text-gray-400">
          {goal.current}/{goal.goal} XP
        </p>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            goal.completed ? 'bg-green-500' : 'bg-orange-500'
          }`}
          style={{ width: `${goal.percent}%` }}
        />
      </div>
      {goal.completed && (
        <p className="text-xs text-green-400 mt-1 text-center font-semibold">
          {t('streak_goal_completed')}
        </p>
      )}
    </div>
  );
}

// ── Milestones ────────────────────────────────────────────────────────────────
function MilestonesRow() {
  const { t } = useTranslation();
  const milestones = getMilestones();

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-2">{t('streak_milestones_label')}</p>
      <div className="flex gap-2 flex-wrap justify-center">
        {milestones.map((m) => (
          <div
            key={m.days}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border transition-all ${
              m.unlocked
                ? 'border-yellow-600/50 bg-yellow-900/20'
                : 'border-gray-700 bg-gray-800/50 opacity-40'
            }`}
          >
            <span className="text-lg">{m.icon}</span>
            <span className={`text-[10px] font-bold ${m.unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
              {m.days}{t('streak_days_suffix')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel completo ────────────────────────────────────────────────────────────
export default function StreakPanel({ streak }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
      {/* Header con racha + XP */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            streak.currentStreak > 0 ? 'bg-orange-900/40' : 'bg-gray-700'
          }`}>
            {streak.currentStreak > 0 ? '🔥' : '💤'}
          </div>
          <div className="text-left">
            <p className="text-white font-bold text-lg leading-tight">
              {streak.currentStreak > 0
                ? t('streak_days_active', { count: streak.currentStreak })
                : t('streak_inactive')
              }
            </p>
            <p className="text-gray-400 text-xs">
              {t('streak_best_label', { count: streak.longestStreak })}
              {' · '}
              {t('streak_total_xp', { xp: streak.totalXP || 0 })}
            </p>
          </div>
        </div>
        <svg
          className={`text-gray-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Barra de objetivo diario siempre visible */}
      <DailyGoalBar />

      {/* Contenido expandible */}
      {expanded && (
        <div className="animate-slide-in-up">
          <ActivityCalendar activityDates={streak.activityDates} />
          <MilestonesRow />
        </div>
      )}
    </div>
  );
}
