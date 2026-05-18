// src/components/ui/DailyChallenges.jsx
// Panel de retos diarios para HomeScreen
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getDailyChallenges, claimChallengeReward, claimAllCompletedBonus } from '@/utils/dailyChallenges.js';
import { addXP } from '@/utils/streak.js';

export default function DailyChallenges() {
  const { t } = useTranslation();
  const [refresh, setRefresh] = useState(0);
  const data = useMemo(() => getDailyChallenges(), [refresh]);

  const handleClaim = useCallback((challengeId) => {
    const xp = claimChallengeReward(challengeId);
    if (xp > 0) addXP(xp);
    setRefresh(r => r + 1);
  }, []);

  const handleClaimBonus = useCallback(() => {
    const xp = claimAllCompletedBonus();
    if (xp > 0) addXP(xp);
    setRefresh(r => r + 1);
  }, []);

  const completedCount = data.challenges.filter(c => c.completed).length;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <div>
            <p className="text-white font-bold text-sm">{t('challenges_title')}</p>
            <p className="text-gray-500 text-xs">{completedCount}/3 {t('challenges_completed')}</p>
          </div>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {data.challenges.map((c, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                c.completed ? 'bg-green-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div className="divide-y divide-gray-700/40">
        {data.challenges.map(challenge => {
          const progressValue = Array.isArray(challenge.progress)
            ? challenge.progress.length
            : (challenge.progress || 0);
          const pct = Math.min(100, Math.round((progressValue / challenge.target) * 100));

          return (
            <div key={challenge.id} className="px-4 py-3 flex items-center gap-3">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                challenge.completed ? 'bg-green-900/40' : 'bg-gray-700/50'
              }`}>
                {challenge.completed ? '✅' : challenge.icon}
              </div>

              {/* Info + progress */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${challenge.completed ? 'text-green-400' : 'text-white'}`}>
                  {t(challenge.titleKey, { count: challenge.target })}
                </p>
                {!challenge.completed && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {progressValue}/{challenge.target}
                    </span>
                  </div>
                )}
              </div>

              {/* Reward button */}
              {challenge.completed && !challenge.claimed && (
                <button
                  onClick={() => handleClaim(challenge.id)}
                  className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-bold rounded-lg transition-colors animate-pulse"
                >
                  +{challenge.xpReward} XP
                </button>
              )}
              {challenge.claimed && (
                <span className="text-xs text-gray-600">✓</span>
              )}
              {!challenge.completed && (
                <span className="text-xs text-gray-500 font-medium flex-shrink-0">
                  +{challenge.xpReward}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* All completed bonus */}
      {data.allCompleted && !data.bonusClaimed && (
        <div className="px-4 py-3 border-t border-gray-700/60 bg-yellow-900/20">
          <button
            onClick={handleClaimBonus}
            className="w-full py-2.5 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold text-sm rounded-xl transition-all animate-pulse"
          >
            🎉 {t('challenges_claim_bonus')} +50 XP
          </button>
        </div>
      )}
      {data.bonusClaimed && (
        <div className="px-4 py-2 border-t border-gray-700/60 text-center">
          <p className="text-xs text-green-500 font-medium">🎉 {t('challenges_all_done')}</p>
        </div>
      )}
    </div>
  );
}
