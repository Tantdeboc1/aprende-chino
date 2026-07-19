// src/components/ui/StreakPanel.jsx
// Panel de racha + XP diario + calendario de actividad + milestones
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { getMilestones, getDailyGoalProgress } from '@/utils/streak.js';

// ── Mini-calendario GitHub-style (últimas 12 semanas) ─────────────────────────
function ActivityCalendar({ activityDates }) {
  const { t } = useTranslation();
  const weeks = useMemo(() => {
    const today = new Date();
    const set = new Set(activityDates || []);
    const grid = [];

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
      <p className="text-xs mb-2" style={{ color: J.mute }}>{t('streak_activity_label')}</p>
      <div className="flex gap-[3px] justify-center">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day) => (
              <div
                key={day.date}
                title={day.date}
                className="w-[10px] h-[10px] rounded-[2px] transition-colors"
                style={{
                  background: day.active ? J.jade : J.hair,
                  boxShadow: day.isToday ? `0 0 0 1px ${day.active ? J.jade : J.mute2}` : 'none',
                }}
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
  // Cuando se supera el objetivo no tiene sentido enseñar "960/50":
  // mostramos "50/50" + el extra como "+910 extra" para que se entienda.
  const isOver = goal.current > goal.goal;
  const displayedCurrent = isOver ? goal.goal : goal.current;
  const extra = isOver ? goal.current - goal.goal : 0;

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs" style={{ color: J.mute }}>{t('streak_daily_goal')}</p>
        <p className="text-xs font-bold" style={{ color: J.inkSoft }}>
          {displayedCurrent}/{goal.goal} XP
          {extra > 0 && (
            <span style={{ marginLeft: 6, color: J.jade, fontWeight: 700 }}>+{extra}</span>
          )}
        </p>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: J.hair }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${goal.percent}%`, background: goal.completed ? J.jade : J.sand }}
        />
      </div>
      {goal.completed && (
        <p className="text-xs mt-1 text-center font-semibold" style={{ color: J.jade }}>
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
      <p className="text-xs mb-2" style={{ color: J.mute }}>{t('streak_milestones_label')}</p>
      <div className="flex gap-2 flex-wrap justify-center">
        {milestones.map((m) => (
          <div
            key={m.days}
            className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all"
            style={{
              border: `1px solid ${m.unlocked ? J.sand : J.hair}`,
              background: m.unlocked ? J.sandBg : J.paper,
              opacity: m.unlocked ? 1 : 0.4,
            }}
          >
            <span className="text-lg">{m.icon}</span>
            <span className="text-[0.625rem] font-bold" style={{ color: m.unlocked ? J.sandDeep : J.mute2 }}>
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
    <div className="rounded-2xl p-4" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
      {/* Header con racha + XP */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
        style={{ background: 'none', border: 0, cursor: 'pointer' }}
      >
        <div className="flex items-center gap-3">
          <div className="font-cn w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{
              background: streak.currentStreak > 0 ? J.sandBg : J.paper,
              color: streak.currentStreak > 0 ? J.sand : J.mute2,
              fontWeight: 700,
            }}>
            {streak.currentStreak > 0 ? '连' : '休'}
          </div>
          <div className="text-left">
            <p className="font-bold text-lg leading-tight" style={{ color: J.ink }}>
              {streak.currentStreak > 0
                ? t('streak_days_active', { count: streak.currentStreak })
                : t('streak_inactive')
              }
            </p>
            <p className="text-xs" style={{ color: J.mute }}>
              {t('streak_best_label', { count: streak.longestStreak })}
              {' · '}
              {t('streak_total_xp', { xp: streak.totalXP || 0 })}
            </p>
          </div>
        </div>
        <svg
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          style={{ color: J.mute }}
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
