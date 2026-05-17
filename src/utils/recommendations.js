/**
 * Sistema de recomendaciones inteligentes basado en análisis de progreso
 */

import { srs } from './advancedSRS';

export const getRecommendations = (progress, allCharacters = []) => {
  const recommendations = [];
  const stats = srs.getStats(progress);

  // 1. ANÁLISIS: Caracteres problemáticos
  const difficult = Object.entries(progress)
    .filter(([_, card]) => card.ease && card.ease < 1.5)
    .sort((a, b) => a[1].ease - b[1].ease)
    .slice(0, 5);

  if (difficult.length > 0) {
    recommendations.push({
      id: 'focus-difficult',
      type: 'focus',
      title: 'Refuerza estos caracteres difíciles',
      description: `${difficult.length} caracteres necesitan más práctica (ease < 1.5)`,
      priority: 'high',
      action: 'review',
      cards: difficult.map(([id]) => id),
      icon: '⚠️',
      tips: [
        'Practica con más frecuencia',
        'Intenta escribir el carácter',
        'Relaciona con palabras que conoces'
      ]
    });
  }

  // 2. ANÁLISIS: Patrón de estudio
  const streakDays = calculateStreakDays(progress);

  if (streakDays === 0) {
    recommendations.push({
      id: 'break-streak',
      type: 'habit',
      title: '¡Es hora de practicar!',
      description: 'Retoma tu rutina de aprendizaje',
      priority: 'high',
      action: 'review',
      icon: '🔥',
      tips: [
        'Solo necesitas 10-15 minutos',
        'Comienza con tus caracteres favoritos',
        'Cada revisión cuenta'
      ]
    });
  } else if (streakDays > 0 && streakDays < 7) {
    recommendations.push({
      id: 'build-streak',
      type: 'habit',
      title: 'Casi consigues una semana',
      description: `${7 - streakDays} días para alcanzar tu primer logro de racha`,
      priority: 'medium',
      action: 'review',
      icon: '🎯',
      tips: [
        'Mantén la consistencia',
        `Faltan solo ${7 - streakDays} días`,
        'La repetición es clave en SRS'
      ]
    });
  } else if (streakDays >= 30) {
    recommendations.push({
      id: 'maintain-streak',
      type: 'habit',
      title: '¡Excelente racha!',
      description: `Llevas ${streakDays} días estudiando. ¡Sigue así!`,
      priority: 'low',
      action: 'celebrate',
      icon: '🏆',
      tips: [
        'Tu dedicación es admirable',
        'El aprendizaje constante produce resultados',
        'Considera aumentar la dificultad'
      ]
    });
  }

  // 3. ANÁLISIS: Retención
  if (stats.retention < 70) {
    recommendations.push({
      id: 'low-retention',
      type: 'retention',
      title: 'Tu retención está baja',
      description: `Solo ${stats.retention}% de caracteres dominados. Revisa más frecuentemente.`,
      priority: 'high',
      action: 'increase-frequency',
      icon: '📉',
      tips: [
        'Aumenta la frecuencia de revisión',
        'Practica caracteres "again" más seguido',
        'Usa técnicas de mnemotecnia'
      ]
    });
  } else if (stats.retention >= 85) {
    recommendations.push({
      id: 'excellent-retention',
      type: 'retention',
      title: 'Tu retención es excelente',
      description: `${stats.retention}% de caracteres completamente dominados`,
      priority: 'low',
      action: 'celebrate',
      icon: '🌟',
      tips: [
        'Considera agregar nuevos caracteres',
        'Tu método está funcionando bien',
        'Mantén la consistencia'
      ]
    });
  }

  // 4. ANÁLISIS: Factor de facilidad
  if (stats.averageEase < 1.8) {
    recommendations.push({
      id: 'low-ease',
      type: 'difficulty',
      title: 'El material es muy difícil',
      description: 'Tu factor de facilidad promedio es bajo. Considera reducir dificultad.',
      priority: 'medium',
      action: 'reduce-difficulty',
      icon: '📚',
      tips: [
        'Comienza con caracteres más simples',
        'Tómate más tiempo entre revisiones',
        'No te desanimes, todos empezamos así'
      ]
    });
  }

  // 5. ANÁLISIS: Nuevas lecciones
  const nextNewCharacters = allCharacters.filter(char =>
    !progress[char.char]
  ).slice(0, 10);

  if (nextNewCharacters.length > 0 && stats.total > 0 && stats.retention > 75) {
    recommendations.push({
      id: 'new-content',
      type: 'progression',
      title: 'Estás listo para nuevos caracteres',
      description: `Puedes comenzar con los próximos ${Math.min(5, nextNewCharacters.length)} caracteres`,
      priority: 'low',
      action: 'new-lesson',
      icon: '📖',
      tips: [
        'Aprendiste bien los anteriores',
        'La progresión es importante',
        'Mantén una buena retención mientras aprendes nuevo material'
      ]
    });
  }

  // 6. ANÁLISIS: Tarjetas vencidas
  const overdue = Object.values(progress).filter(card => {
    if (!card.nextReviewDate) return false;
    const reviewDate = new Date(card.nextReviewDate);
    return reviewDate < new Date();
  }).length;

  if (overdue > 20) {
    recommendations.push({
      id: 'overdue-backlog',
      type: 'urgent',
      title: 'Tienes una acumulación de revisiones',
      description: `${overdue} tarjetas vencidas esperando ser revisadas`,
      priority: 'high',
      action: 'catch-up',
      icon: '⏰',
      tips: [
        'Prioriza las tarjetas vencidas',
        'Reduce otras actividades temporalmente',
        'La consistencia previene acumulaciones'
      ]
    });
  }

  // 7. ANÁLISIS: Tiempo sin estudiar
  const lastReviewDate = getLastReviewDate(progress);
  if (lastReviewDate) {
    const daysSinceReview = Math.floor((Date.now() - new Date(lastReviewDate)) / (1000 * 60 * 60 * 24));

    if (daysSinceReview > 3) {
      recommendations.push({
        id: 'gap-in-study',
        type: 'warning',
        title: 'Ha pasado tiempo desde tu última revisión',
        description: `Última revisión hace ${daysSinceReview} días. La consistencia es clave en SRS.`,
        priority: 'medium',
        action: 'resume',
        icon: '⏸️',
        tips: [
          'Estudia un poco cada día',
          'Aunque sea 5 minutos es mejor que nada',
          'Vuelve a tu rutina'
        ]
      });
    }
  }

  // Ordenar por prioridad
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
};

/**
 * Calcula días de racha
 */
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

/**
 * Obtiene la fecha de la última revisión
 */
const getLastReviewDate = (progress) => {
  const dates = Object.values(progress)
    .filter(c => c.lastReviewDate)
    .map(c => new Date(c.lastReviewDate))
    .sort((a, b) => b - a);

  return dates[0] || null;
};

/**
 * Obtiene título amigable según tipo de recomendación
 */
export const getRecommendationTitle = (type) => {
  const titles = {
    focus: 'Enfoque',
    habit: 'Hábito',
    retention: 'Retención',
    difficulty: 'Dificultad',
    progression: 'Progresión',
    urgent: '¡Urgente!',
    warning: 'Atención'
  };
  return titles[type] || 'Recomendación';
};

/**
 * Obtiene color según prioridad
 */
export const getPriorityColor = (priority) => {
  const colors = {
    high: 'bg-red-900/20 border-red-700',
    medium: 'bg-yellow-900/20 border-yellow-700',
    low: 'bg-blue-900/20 border-blue-700'
  };
  return colors[priority] || colors.low;
};
