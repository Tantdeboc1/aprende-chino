// src/utils/badges.js
// Insignias: medallas que se desbloquean según el progreso del usuario.
// Las condiciones se evalúan en cliente a partir de los datos que ya
// tenemos (progress, streak, leveling). Sin estado persistente extra —
// si los datos están, la insignia aparece como ganada.
import { getSRSStats } from './srs.js';
import { getLessonStats } from './progress.js';
import { getStreak } from './streak.js';
import { getLevelInfo } from './leveling.js';

// Cada entrada: `when(ctx)` decide si está ganada. El orden del array es
// el orden de visualización en la rejilla del Perfil.
export const BADGE_DEFS = [
  { id: 'first-step',    icon: '🌱', title: 'Primer paso',        desc: 'Aprende tu primer carácter',                       when: c => c.srsStats.learned >= 1 },
  { id: 'apprentice',    icon: '📖', title: 'Aprendiz',           desc: 'Aprende 25 caracteres',                            when: c => c.srsStats.learned >= 25 },
  { id: 'scholar',       icon: '🎓', title: 'Estudioso',          desc: 'Aprende 100 caracteres',                           when: c => c.srsStats.learned >= 100 },
  { id: 'mature-50',     icon: '🌳', title: 'Memoria sólida',     desc: '50 caracteres en memoria a largo plazo',           when: c => c.srsStats.mature >= 50 },
  { id: 'centurion',     icon: '💯', title: 'Centenario',         desc: 'Domina 100 caracteres',                            when: c => c.totalMastered >= 100 },
  { id: 'streak-3',      icon: '🌶️', title: '3 días seguidos',    desc: 'Mantén una racha de 3 días',                       when: c => (c.streak.longestStreak || c.streak.currentStreak || 0) >= 3 },
  { id: 'streak-7',      icon: '🔥', title: 'Una semana',         desc: 'Mantén una racha de 7 días',                       when: c => (c.streak.longestStreak || c.streak.currentStreak || 0) >= 7 },
  { id: 'streak-30',     icon: '⚡', title: 'Imparable',          desc: 'Mantén una racha de 30 días',                      when: c => (c.streak.longestStreak || c.streak.currentStreak || 0) >= 30 },
  { id: 'perfectionist', icon: '🎯', title: 'Perfeccionista',     desc: '90 % de precisión con 50+ respuestas',             when: c => c.totalReviews >= 50 && c.accuracy >= 90 },
  { id: 'four-seasons',  icon: '🌸', title: 'Cuatro estaciones',  desc: 'Llega al 50 % en 4 lecciones',                     when: c => c.lessonsHalfDone >= 4 },
  { id: 'level-5',       icon: '⭐', title: 'Nivel 5',            desc: 'Alcanza el nivel 5',                               when: c => c.levelInfo.level >= 5 },
  { id: 'level-10',      icon: '🌟', title: 'Nivel 10',           desc: 'Alcanza el nivel 10',                              when: c => c.levelInfo.level >= 10 },
  { id: 'writer',        icon: '✍️', title: 'Calígrafo',          desc: 'Practica la escritura 50 veces',                   when: c => c.writingCount >= 50 },
];

export function computeBadges(progress, allCharacters) {
  const srsStats = getSRSStats(progress, allCharacters);
  const streak = getStreak();
  const levelInfo = getLevelInfo(streak.totalXP || 0);

  // Agregados por lección — derivadas de los datos, no de un rango fijo.
  const lessonNums = [...new Set(allCharacters.map(c => c.lesson).filter(Boolean))];
  let totalMastered = 0;
  let lessonsHalfDone = 0;
  for (const n of lessonNums) {
    const s = getLessonStats(progress, n, allCharacters);
    totalMastered += s.mastered;
    if (s.total > 0 && (s.mastered / s.total) >= 0.5) lessonsHalfDone++;
  }

  // Precisión global a partir de las cuentas que guarda el SRS.
  const srs = progress?.__srs || {};
  let correct = 0, totalReviews = 0;
  for (const d of Object.values(srs)) {
    if (d.reviews) { totalReviews += d.reviews; correct += d.correct || 0; }
  }
  const accuracy = totalReviews > 0 ? Math.round((correct / totalReviews) * 100) : 0;

  const writing = progress?.__writing || {};
  const writingCount = Object.values(writing).reduce((a, n) => a + (n || 0), 0);

  const ctx = {
    srsStats, streak, levelInfo, totalMastered, lessonsHalfDone,
    totalReviews, accuracy, writingCount,
  };

  return BADGE_DEFS.map(b => ({
    id: b.id, icon: b.icon, title: b.title, desc: b.desc,
    earned: !!b.when(ctx),
  }));
}
