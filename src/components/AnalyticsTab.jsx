import { memo, useMemo } from 'react';
import Card from './ui/Card';
import { TrendingUp, Zap, Fire, Target } from 'lucide-react';
import { srs } from '../utils/advancedSRS';

const AnalyticsTab = memo(({ progress, allCharacters }) => {
  const stats = useMemo(() => {
    return srs.getStats(progress);
  }, [progress]);

  const streakDays = useMemo(() => {
    // Calcular racha basado en fechas de revisión
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
  }, [progress]);

  const chartData = useMemo(() => {
    const last30 = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];

      const reviewed = Object.values(progress).filter(card =>
        card.lastReviewDate &&
        new Date(card.lastReviewDate).toISOString().split('T')[0] === dateKey
      ).length;

      last30.push({
        date: dateKey.split('-')[2],
        reviewed: reviewed,
        target: 20
      });
    }
    return last30;
  }, [progress]);

  const StatCard = ({ label, value, color, icon: Icon, subtext }) => (
    <Card variant="elevated" className="text-center">
      <div className="flex justify-center mb-2">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
      <div className={`h-1 rounded-full mt-3 w-3/4 mx-auto ${color}`} />
    </Card>
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          label="Estudiadas"
          value={stats.total}
          color="bg-blue-900/50"
          icon={Target}
          subtext={`${stats.cardsByStatus.new.length} nuevas`}
        />
        <StatCard
          label="Retención"
          value={`${stats.retention}%`}
          color="bg-green-900/50"
          icon={TrendingUp}
          subtext="Ease > 2.0"
        />
        <StatCard
          label="Racha"
          value={`${streakDays}d`}
          color="bg-purple-900/50"
          icon={Fire}
          subtext="Días consecutivos"
        />
        <StatCard
          label="Promedio"
          value={`${Math.round(stats.total / Math.max(streakDays, 1))}/día`}
          color="bg-orange-900/50"
          icon={Zap}
          subtext="Tarjetas/día"
        />
      </div>

      {/* Tarjeta de progreso por estado */}
      <Card variant="elevated">
        <h3 className="text-white font-semibold mb-4">Distribución</h3>
        <div className="space-y-3">
          <ProgressBar
            label="Nuevas"
            value={stats.cardsByStatus.new.length}
            max={stats.total}
            color="bg-blue-500"
          />
          <ProgressBar
            label="Aprendiendo"
            value={stats.cardsByStatus.learning.length}
            max={stats.total}
            color="bg-yellow-500"
          />
          <ProgressBar
            label="Revisión"
            value={stats.cardsByStatus.review.length}
            max={stats.total}
            color="bg-green-500"
          />
          <ProgressBar
            label="Suspendidas"
            value={stats.cardsByStatus.suspended.length}
            max={stats.total}
            color="bg-red-500"
          />
        </div>
      </Card>

      {/* Gráfico simple de actividad */}
      <Card variant="elevated">
        <h3 className="text-white font-semibold mb-4">Actividad (últimos 30 días)</h3>
        <div className="h-32 flex items-end gap-1 justify-center">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
              <div
                className="w-full rounded-t transition-colors group-hover:bg-purple-500"
                style={{
                  height: `${Math.max((item.reviewed / 30) * 100, 2)}%`,
                  backgroundColor: item.reviewed > item.target ? '#10b981' : '#8b5cf6'
                }}
                title={`${item.date}: ${item.reviewed} tarjetas`}
              />
              <span className="text-xs text-gray-500 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                {item.date}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          Verde: Superaste meta | Morado: Debajo de meta
        </p>
      </Card>

      {/* Factor de facilidad histórico */}
      <Card variant="elevated">
        <h3 className="text-white font-semibold mb-4">Factor de Facilidad</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Promedio actual</span>
            <span className="text-2xl font-bold text-purple-400">{stats.averageEase.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Rango óptimo: 1.3 - 2.5</span>
            <span className={stats.averageEase > 2.0 ? 'text-green-400' : 'text-yellow-400'}>
              {stats.averageEase > 2.0 ? '✓ Excelente' : '⚠ Mejorable'}
            </span>
          </div>
        </div>
      </Card>

      {/* Próximas tareas */}
      <Card variant="elevated">
        <h3 className="text-white font-semibold mb-4">Carga de Trabajo</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-red-400">
              {Object.values(progress).filter(c => {
                if (!c.nextReviewDate) return false;
                const reviewDate = new Date(c.nextReviewDate);
                reviewDate.setHours(0, 0, 0, 0);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return reviewDate <= today;
              }).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Hoy</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-400">
              {Object.values(progress).filter(c => {
                if (!c.nextReviewDate) return false;
                const reviewDate = new Date(c.nextReviewDate);
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 7);
                return reviewDate <= tomorrow && reviewDate > new Date();
              }).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Próx. 7 días</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-400">
              {Object.values(progress).filter(c => {
                if (!c.nextReviewDate) return false;
                const reviewDate = new Date(c.nextReviewDate);
                const nextWeek = new Date();
                nextWeek.setDate(nextWeek.getDate() + 7);
                return reviewDate > nextWeek;
              }).length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Después</p>
          </div>
        </div>
      </Card>

      {/* Logros desbloqueados */}
      <Card variant="elevated">
        <h3 className="text-white font-semibold mb-4">Logros</h3>
        <div className="grid grid-cols-3 gap-2">
          <AchievementBadge
            icon="🎯"
            title="Primer paso"
            unlocked={stats.total > 0}
            description="Aprendiste tu primer carácter"
          />
          <AchievementBadge
            icon="🔥"
            title="En racha"
            unlocked={streakDays >= 7}
            description="7 días de práctica"
          />
          <AchievementBadge
            icon="⭐"
            title="Maestría"
            unlocked={stats.retention >= 85}
            description="85% retención"
          />
        </div>
      </Card>
    </div>
  );
});

const ProgressBar = ({ label, value, max, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-400">{value}/{max}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full ${color} transition-all`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

const AchievementBadge = ({ icon, title, unlocked, description }) => (
  <div
    className={`
      text-center p-3 rounded-lg border-2 transition-all
      ${unlocked
        ? 'bg-yellow-900/20 border-yellow-600'
        : 'bg-gray-800 border-gray-700 opacity-50'
      }
    `}
  >
    <div className="text-2xl mb-1">{icon}</div>
    <p className="text-xs font-bold text-white">{title}</p>
    <p className="text-xs text-gray-400 mt-0.5">{description}</p>
  </div>
);

AnalyticsTab.displayName = 'AnalyticsTab';
export default AnalyticsTab;
