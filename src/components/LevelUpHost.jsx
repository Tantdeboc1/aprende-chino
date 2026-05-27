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
    const handler = (e) => {
      const detail = e?.detail || {};
      if (detail.levelUp) {
        setLevelQueue(q => [...q, detail.levelUp]);
      }
      if (Array.isArray(detail.achievements) && detail.achievements.length) {
        setAchievements(prev => [
          ...prev,
          ...detail.achievements.map((ach, i) => ({
            // id único por instancia (puede haber duplicados de ID si se
            // desbloquean varios del mismo en pruebas)
            uid: `${ach.id || 'ach'}-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            ach,
          })),
        ]);
      }
    };
    window.addEventListener('xp-notification', handler);
    return () => window.removeEventListener('xp-notification', handler);
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
