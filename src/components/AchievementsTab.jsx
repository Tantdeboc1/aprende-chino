import { memo, useMemo } from 'react';
import Card from './ui/Card';
import { Award, Star, Flame, Zap, Target, TrendingUp } from 'lucide-react';

const ACHIEVEMENTS = [
  {
    id: 'first-character',
    title: '首次学习',
    description: 'Aprendiste tu primer carácter',
    icon: '🎯',
    requirement: (progress) => Object.keys(progress).length > 0,
    rarity: 'common'
  },
  {
    id: 'streak-7',
    title: '七日连胜',
    description: '7 días de práctica consecutivos',
    icon: '🔥',
    requirement: (progress, streakDays) => streakDays >= 7,
    rarity: 'uncommon'
  },
  {
    id: 'streak-30',
    title: '三十日连胜',
    description: '30 días de práctica consecutivos',
    icon: '🏆',
    requirement: (progress, streakDays) => streakDays >= 30,
    rarity: 'rare'
  },
  {
    id: 'master-lesson',
    title: '课程大师',
    description: 'Completaste una lección al 100%',
    icon: '⭐',
    requirement: (progress) => {
      const cards = Object.values(progress);
      return cards.some(c => c.repetitions > 5 && c.ease > 2.2);
    },
    rarity: 'uncommon'
  },
  {
    id: 'retention-expert',
    title: '记忆专家',
    description: 'Retención del 85% o superior',
    icon: '🧠',
    requirement: (progress) => {
      const cards = Object.values(progress);
      const retained = cards.filter(c => c.ease > 2.0).length;
      return cards.length > 0 && (retained / cards.length) > 0.85;
    },
    rarity: 'rare'
  },
  {
    id: 'speed-learner',
    title: '快速学习者',
    description: 'Aprende 50 caracteres en una semana',
    icon: '⚡',
    requirement: (progress) => {
      const cards = Object.values(progress);
      return cards.filter(c => {
        if (!c.lastReviewDate) return false;
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return new Date(c.lastReviewDate) > weekAgo;
      }).length >= 50;
    },
    rarity: 'rare'
  },
  {
    id: 'perfect-review',
    title: '完美复习',
    description: 'Contesta correctamente 10 preguntas seguidas',
    icon: '💯',
    requirement: (progress, streakDays, perfectStreak) => perfectStreak >= 10,
    rarity: 'uncommon'
  },
  {
    id: 'collector',
    title: '集卡者',
    description: 'Estudia 100 caracteres distintos',
    icon: '📚',
    requirement: (progress) => Object.keys(progress).length >= 100,
    rarity: 'rare'
  },
  {
    id: 'consistency',
    title: '持之以恒',
    description: 'Estudia al menos 5 días a la semana durante un mes',
    icon: '📅',
    requirement: (progress, streakDays, perfectStreak, consistency) => consistency >= 20,
    rarity: 'rare'
  },
  {
    id: 'tone-master',
    title: '音调大师',
    description: 'Domina los 4 tonos del chino',
    icon: '🎵',
    requirement: (progress) => {
      // Verificar que hay caracteres de cada tono
      const tones = [1, 2, 3, 4];
      const hasTones = tones.every(tone =>
        Object.values(progress).some(c => c.tone === tone && c.ease > 2.0)
      );
      return hasTones;
    },
    rarity: 'uncommon'
  }
];

const AchievementsTab = memo(({ progress, allCharacters }) => {
  const unlockedAchievements = useMemo(() => {
    const streakDays = calculateStreakDays(progress);
    return ACHIEVEMENTS.filter(a =>
      a.requirement(progress, streakDays)
    );
  }, [progress]);

  const progressPercent = useMemo(() => {
    return Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100);
  }, [unlockedAchievements]);

  const groupedByRarity = useMemo(() => {
    const groups = {
      common: [],
      uncommon: [],
      rare: []
    };
    ACHIEVEMENTS.forEach(achievement => {
      groups[achievement.rarity].push(achievement);
    });
    return groups;
  }, []);

  return (
    <div className="space-y-6 pb-24">
      {/* Barra de progreso general */}
      <Card variant="elevated">
        <div className="text-center">
          <h3 className="text-white font-semibold mb-4">Progreso de Logros</h3>
          <div className="mb-4">
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  strokeDasharray={`${(progressPercent / 100) * 339.29} 339.29`}
                  className="transition-all"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">{progressPercent}%</p>
                  <p className="text-xs text-gray-400">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            {ACHIEVEMENTS.length - unlockedAchievements.length} logros por desbloquear
          </p>
        </div>
      </Card>

      {/* Logros por rareza */}
      <div className="space-y-4">
        {/* Comunes */}
        <AchievementSection
          title="Logros Comunes"
          achievements={groupedByRarity.common}
          unlockedIds={unlockedAchievements.map(a => a.id)}
          color="bg-blue-900/20"
          borderColor="border-blue-700"
        />

        {/* Poco comunes */}
        <AchievementSection
          title="Logros Poco Comunes"
          achievements={groupedByRarity.uncommon}
          unlockedIds={unlockedAchievements.map(a => a.id)}
          color="bg-purple-900/20"
          borderColor="border-purple-700"
        />

        {/* Raros */}
        <AchievementSection
          title="Logros Raros"
          achievements={groupedByRarity.rare}
          unlockedIds={unlockedAchievements.map(a => a.id)}
          color="bg-yellow-900/20"
          borderColor="border-yellow-700"
        />
      </div>

      {/* Estadísticas de logros */}
      <Card variant="elevated">
        <h3 className="text-white font-semibold mb-4">Estadísticas</h3>
        <div className="space-y-3">
          <StatLine
            label="Logros desbloqueados"
            value={unlockedAchievements.length}
            icon="🏅"
          />
          <StatLine
            label="Tasa de desbloqueo"
            value={`${progressPercent}%`}
            icon="📈"
          />
          <StatLine
            label="Próximo logro"
            value={getNextAchievement(unlockedAchievements, ACHIEVEMENTS)?.title || 'Completados'}
            icon="🎯"
          />
        </div>
      </Card>

      {/* Tips para desbloquear logros */}
      <Card variant="elevated">
        <h3 className="text-white font-semibold mb-3">💡 Tips</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Estudia consistentemente para desbloquear racha de días</li>
          <li>• Responde correctamente para mejorar tu factor de facilidad</li>
          <li>• Aprende nuevos caracteres regularmente</li>
          <li>• Mantén una retención alta (85%+) para logros avanzados</li>
          <li>• Los logros raros requieren dedicación y paciencia</li>
        </ul>
      </Card>
    </div>
  );
});

const AchievementSection = ({ title, achievements, unlockedIds, color, borderColor }) => (
  <Card variant="elevated">
    <h3 className="text-white font-semibold mb-3 text-sm">{title}</h3>
    <div className="grid grid-cols-3 gap-2">
      {achievements.map(achievement => (
        <div
          key={achievement.id}
          className={`
            text-center p-3 rounded-lg border-2 transition-all
            ${unlockedIds.includes(achievement.id)
              ? `${color} ${borderColor} shadow-lg`
              : 'bg-gray-800 border-gray-700 opacity-50'
            }
          `}
        >
          <div className="text-3xl mb-1">{achievement.icon}</div>
          <p className="text-xs font-bold text-white line-clamp-2">{achievement.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{achievement.description}</p>
        </div>
      ))}
    </div>
  </Card>
);

const StatLine = ({ label, value, icon }) => (
  <div className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-gray-400 text-sm">{label}</span>
    </div>
    <span className="text-white font-semibold">{value}</span>
  </div>
);

const calculateStreakDays = (progress) => {
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  while (streak < 365) {
    const dateKey = currentDate.toISOString().split('T')[0];
    const hasReview = Object.values(progress).some(card =>
      card.lastReviewDate &&
      new Date(card.lastReviewDate).toISOString().split('T')[0] === dateKey
    );

    if (!hasReview && streak > 0) break;
    if (hasReview) streak++;

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
};

const getNextAchievement = (unlocked, all) => {
  const unlockedIds = unlocked.map(a => a.id);
  return all.find(a => !unlockedIds.includes(a.id));
};

AchievementsTab.displayName = 'AchievementsTab';
export default AchievementsTab;
