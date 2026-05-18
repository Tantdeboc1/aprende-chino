// src/components/ui/LevelUpNotification.jsx
// Animated popup when the user levels up or unlocks an achievement
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export default function LevelUpNotification({ notification, onDismiss }) {
  const { t, i18n } = useTranslation();
  const [phase, setPhase] = useState('enter'); // enter | visible | exit

  useEffect(() => {
    if (!notification) return;
    setPhase('enter');
    const t1 = setTimeout(() => setPhase('visible'), 50);
    const t2 = setTimeout(() => setPhase('exit'), 3500);
    const t3 = setTimeout(() => onDismiss?.(), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [notification, onDismiss]);

  if (!notification) return null;

  const isLevelUp = notification.type === 'level_up';
  const isAchievement = notification.type === 'achievement';

  const baseClass = `
    fixed top-6 left-1/2 -translate-x-1/2 z-[9999] max-w-sm w-[90%]
    rounded-2xl border-2 p-4 shadow-2xl backdrop-blur-sm
    transition-all duration-500 ease-out
  `;

  const animClass = phase === 'enter'
    ? 'opacity-0 -translate-y-4 scale-95'
    : phase === 'exit'
    ? 'opacity-0 translate-y-2 scale-95'
    : 'opacity-100 translate-y-0 scale-100';

  const colorClass = isLevelUp
    ? 'bg-purple-900/90 border-purple-500/60'
    : 'bg-yellow-900/90 border-yellow-500/60';

  return (
    <div className={`${baseClass} ${animClass} ${colorClass}`} onClick={onDismiss}>
      {/* Sparkle particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="absolute text-xs animate-ping"
            style={{
              left: `${15 + Math.random() * 70}%`,
              top: `${10 + Math.random() * 60}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1.5s',
            }}
          >
            ✨
          </span>
        ))}
      </div>

      <div className="relative flex items-center gap-3">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${
          isLevelUp ? 'bg-purple-800/60' : 'bg-yellow-800/60'
        }`}>
          {notification.icon}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold uppercase tracking-widest ${
            isLevelUp ? 'text-purple-300' : 'text-yellow-300'
          }`}>
            {isLevelUp ? t('notification_level_up') : t('notification_achievement_unlocked')}
          </p>
          <p className="text-white font-bold text-base mt-0.5">
            {isLevelUp && `Lv.${notification.level} — `}
            {notification.title?.[i18n.language] || notification.title?.es}
          </p>
          {notification.zh && (
            <p className="text-gray-400 text-xs mt-0.5">{notification.zh}</p>
          )}
        </div>
      </div>
    </div>
  );
}
