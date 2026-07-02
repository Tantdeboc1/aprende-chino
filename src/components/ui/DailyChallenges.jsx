// src/components/ui/DailyChallenges.jsx
// Panel de retos diarios para HomeScreen
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { getDailyChallenges, claimChallengeReward, claimAllCompletedBonus } from '@/utils/dailyChallenges.js';
import { addXP } from '@/utils/streak.js';
import { useLocalSnapshot, bumpLocalDataRev } from '@/hooks/useLocalSnapshot.js';

export default function DailyChallenges() {
  const { t } = useTranslation();
  // bumpLocalDataRev tras reclamar: además de este panel, actualiza en vivo
  // el resto de suscriptores que leen XP/racha (badge de nivel, StreakPanel…).
  const data = useLocalSnapshot(getDailyChallenges);

  const handleClaim = useCallback((challengeId) => {
    const xp = claimChallengeReward(challengeId);
    if (xp > 0) addXP(xp);
    bumpLocalDataRev();
  }, []);

  const handleClaimBonus = useCallback(() => {
    const xp = claimAllCompletedBonus();
    if (xp > 0) addXP(xp);
    bumpLocalDataRev();
  }, []);

  const completedCount = data.challenges.filter(c => c.completed).length;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${J.hair}` }}>
        <div className="flex items-center gap-2">
          <span className="font-cn text-lg" style={{ color: J.red, fontWeight: 700 }}>目</span>
          <div>
            <p className="font-bold text-sm" style={{ color: J.ink }}>{t('challenges_title')}</p>
            <p className="text-xs" style={{ color: J.mute }}>{completedCount}/3 {t('challenges_completed')}</p>
          </div>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {data.challenges.map((c, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-colors"
              style={{ background: c.completed ? J.jade : J.hair }}
            />
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div>
        {data.challenges.map((challenge, idx) => {
          const progressValue = Array.isArray(challenge.progress)
            ? challenge.progress.length
            : (challenge.progress || 0);
          const pct = Math.min(100, Math.round((progressValue / challenge.target) * 100));

          return (
            <div key={challenge.id} className="px-4 py-3 flex items-center gap-3"
              style={{ borderBottom: idx < data.challenges.length - 1 ? `1px solid ${J.hair}` : 'none' }}>
              {/* Icon */}
              <div className="font-cn w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{
                  background: challenge.completed ? J.jadeBg : J.paper,
                  color: challenge.completed ? J.jade : J.mute,
                  fontWeight: 700,
                }}>
                {challenge.completed ? '成' : challenge.icon}
              </div>

              {/* Info + progress */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: challenge.completed ? J.jade : J.ink }}>
                  {t(challenge.titleKey, { count: challenge.target })}
                </p>
                {!challenge.completed && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: J.hair }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: J.sand }}
                      />
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: J.mute }}>
                      {progressValue}/{challenge.target}
                    </span>
                  </div>
                )}
              </div>

              {/* Reward button */}
              {challenge.completed && !challenge.claimed && (
                <button
                  onClick={() => handleClaim(challenge.id)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg transition-colors animate-pulse"
                  style={{ background: J.sand, color: J.onAccent, border: 0, cursor: 'pointer' }}
                >
                  +{challenge.xpReward} XP
                </button>
              )}
              {challenge.claimed && (
                <span className="text-xs" style={{ color: J.mute }}>★</span>
              )}
              {!challenge.completed && (
                <span className="text-xs font-medium flex-shrink-0" style={{ color: J.mute }}>
                  +{challenge.xpReward}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* All completed bonus */}
      {data.allCompleted && !data.bonusClaimed && (
        <div className="px-4 py-3" style={{ borderTop: `1px solid ${J.hair}`, background: J.sandBg }}>
          <button
            onClick={handleClaimBonus}
            className="w-full py-2.5 font-bold text-sm rounded-xl transition-all animate-pulse"
            style={{ background: J.red, color: J.onAccent, border: 0, cursor: 'pointer' }}
          >
            ★ {t('challenges_claim_bonus')} +50 XP
          </button>
        </div>
      )}
      {data.bonusClaimed && (
        <div className="px-4 py-2 text-center" style={{ borderTop: `1px solid ${J.hair}` }}>
          <p className="text-xs font-medium" style={{ color: J.jade }}>★ {t('challenges_all_done')}</p>
        </div>
      )}
    </div>
  );
}
