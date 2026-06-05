// src/components/LevelUpHost.jsx
// Host global de notificaciones gamificadas. Escucha 'xp-notification' y
// muestra:
//   - LevelUpModal cuando hay subida de nivel (overlay completo, cola FIFO)
//   - AchievementToast(s) cuando se desbloquean logros (apilables a la derecha)

import { useEffect, useState } from 'react';
import LevelUpModal from './LevelUpModal.jsx';
import AchievementToast from './AchievementToast.jsx';

const MAX_VISIBLE_ACHIEVEMENTS = 3;

export default function LevelUpHost() {
  const [levelQueue, setLevelQueue] = useState([]);
  const [achievements, setAchievements] = useState([]); // {id, ach}

  useEffect(() => {
    const pushAchievements = (list) => {
      if (!Array.isArray(list) || !list.length) return;
      setAchievements(prev => [
        ...prev,
        ...list.map((ach, i) => ({
          // id único por instancia (puede haber duplicados de ID si se
          // desbloquean varios del mismo en pruebas)
          uid: `${ach.id || 'ach'}-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
          ach,
        })),
      ]);
    };

    // 'xp-notification' trae subida de nivel + logros desbloqueados al ganar XP
    const onXP = (e) => {
      const detail = e?.detail || {};
      if (detail.levelUp) setLevelQueue(q => [...q, detail.levelUp]);
      pushAchievements(detail.achievements);
    };

    // 'achievement-unlocked' lo dispara trackAchievement() para logros que no
    // pasan por el flujo de XP (rachas, quizzes, exámenes perfectos, etc.)
    const onAchievement = (e) => pushAchievements(e?.detail?.achievements);

    window.addEventListener('xp-notification', onXP);
    window.addEventListener('achievement-unlocked', onAchievement);
    return () => {
      window.removeEventListener('xp-notification', onXP);
      window.removeEventListener('achievement-unlocked', onAchievement);
    };
  }, []);

  // ── LevelUp ─────────────────────────────────────────────────────────────
  const currentLevel = levelQueue[0] || null;
  const closeLevel = () => setLevelQueue(q => q.slice(1));

  // ── Achievements ────────────────────────────────────────────────────────
  const visibleAchievements = achievements.slice(0, MAX_VISIBLE_ACHIEVEMENTS);
  const closeAchievement = (uid) => {
    setAchievements(prev => prev.filter(a => a.uid !== uid));
  };

  // Si hay un LevelUpModal activo, no mostramos toasts (su timer arrancaría
  // detrás del overlay y se cerrarían sin que el usuario los vea). Se
  // mantienen en la cola y aparecen al cerrar el modal.
  const showAchievements = !currentLevel;

  return (
    <>
      {currentLevel && (
        <LevelUpModal levelUp={currentLevel} onClose={closeLevel} />
      )}
      {showAchievements && visibleAchievements.map((item, idx) => (
        <AchievementToast
          key={item.uid}
          achievement={item.ach}
          stackIndex={idx}
          onClose={() => closeAchievement(item.uid)}
        />
      ))}
    </>
  );
}
