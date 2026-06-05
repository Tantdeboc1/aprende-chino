/**
 * Sistema de Repetición Espaciada Avanzado (Advanced SRS)
 * Basado en el algoritmo SM-2 mejorado
 */

export class AdvancedSRS {
  constructor() {
    // Intervalos en días
    this.intervals = [1, 3, 7, 14, 30, 60, 120];

    // Factores multiplicadores según respuesta
    this.weights = {
      again: 0.5,    // Respuesta incorrecta: reiniciar
      hard: 1.0,     // Respuesta difícil: mantener intervalo
      good: 1.3,     // Respuesta normal: aumentar 30%
      easy: 2.5      // Respuesta fácil: aumentar 150%
    };

    // Factor de facilidad inicial (SM-2)
    this.initialEase = 2.5;
  }

  /**
   * Calcula próxima revisión basada en respuesta
   * @param {Object} cardData - {interval, ease, repetitions, lastReviewDate}
   * @param {string} response - 'again' | 'hard' | 'good' | 'easy'
   * @returns {Object} Nueva configuración de la tarjeta
   */
  calculateNextReview(cardData, response) {
    const {
      interval = 0,
      ease = this.initialEase,
      repetitions = 0,
    } = cardData;

    // Validar respuesta
    if (!['again', 'hard', 'good', 'easy'].includes(response)) {
      throw new Error(`Respuesta inválida: ${response}`);
    }

    let nextInterval, nextEase;

    if (response === 'again') {
      // Respuesta incorrecta: reiniciar desde el principio
      nextInterval = 1;
      nextEase = Math.max(1.3, ease - 0.2);
    } else {
      // Respuesta correcta: aplicar factor multiplicador
      const weight = this.weights[response];
      nextInterval = Math.ceil(
        interval === 0 ? 1 : interval * weight * (ease / 2.5)
      );

      // Ajustar factor de facilidad (SM-2)
      nextEase = Math.max(
        1.3,
        ease + (0.1 - (4 - this.getQualityScore(response)) * 0.08)
      );
    }

    const nextReviewDate = new Date(
      Date.now() + nextInterval * 24 * 60 * 60 * 1000
    );

    return {
      interval: nextInterval,
      ease: parseFloat(nextEase.toFixed(2)),
      repetitions: repetitions + 1,
      lastReviewDate: new Date(),
      nextReviewDate: nextReviewDate,
      responseHistory: [
        ...(cardData.responseHistory || []),
        { date: new Date(), response, interval: nextInterval }
      ]
    };
  }

  /**
   * Obtiene puntuación de calidad (0-5) para SM-2
   */
  getQualityScore(response) {
    const scores = {
      again: 1,
      hard: 2,
      good: 3,
      easy: 5
    };
    return scores[response] || 3;
  }

  /**
   * Obtiene tarjetas pendientes para hoy
   */
  getCardsForToday(allProgress) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return Object.entries(allProgress).filter(([_, card]) => {
      if (!card.nextReviewDate) return true;
      const reviewDate = new Date(card.nextReviewDate);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate <= today;
    }).map(([id, card]) => ({ id, ...card }));
  }

  /**
   * Obtiene tarjetas próximas a revisar (próximos 7 días)
   */
  getUpcomingCards(allProgress, days = 7) {
    const now = new Date();
    const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    return Object.entries(allProgress)
      .filter(([_, card]) => {
        if (!card.nextReviewDate) return true;
        const reviewDate = new Date(card.nextReviewDate);
        return reviewDate > now && reviewDate <= future;
      })
      .map(([id, card]) => ({ id, ...card }));
  }

  /**
   * Calcula estadísticas de retención
   */
  calculateRetention(allProgress) {
    const cards = Object.values(allProgress).filter(c => c.repetitions > 0);
    if (cards.length === 0) return 0;

    // Tarjetas con ease > 2.0 son consideradas "retenidas"
    const retained = cards.filter(c => c.ease > 2.0).length;
    return parseFloat((retained / cards.length * 100).toFixed(2));
  }

  /**
   * Calcula factor de facilidad promedio
   */
  calculateAverageEase(allProgress) {
    const cards = Object.values(allProgress).filter(c => c.ease);
    if (cards.length === 0) return this.initialEase;

    const sum = cards.reduce((acc, c) => acc + c.ease, 0);
    return parseFloat((sum / cards.length).toFixed(2));
  }

  /**
   * Obtiene estadísticas detalladas
   */
  getStats(allProgress) {
    const cards = Object.values(allProgress);
    const cardsByStatus = {
      new: cards.filter(c => !c.repetitions || c.repetitions === 0),
      learning: cards.filter(c => c.repetitions > 0 && c.repetitions < 3),
      review: cards.filter(c => c.repetitions >= 3 && c.ease >= 2.0),
      suspended: cards.filter(c => c.ease < 1.3)
    };

    const cardsForToday = this.getCardsForToday(allProgress);
    const upcomingCards = this.getUpcomingCards(allProgress);

    return {
      total: cards.length,
      cardsByStatus,
      studiedToday: cardsForToday.length,
      dueLater: upcomingCards.length,
      retention: this.calculateRetention(allProgress),
      averageEase: this.calculateAverageEase(allProgress),
      averageRepetitions: parseFloat(
        (cards.reduce((acc, c) => acc + (c.repetitions || 0), 0) / cards.length || 0).toFixed(2)
      )
    };
  }

  /**
   * Obtiene recomendaciones basadas en stats
   */
  getRecommendations(allProgress) {
    const stats = this.getStats(allProgress);
    const recommendations = [];

    // 1. Foco en tarjetas difíciles
    const difficult = Object.entries(allProgress)
      .filter(([_, card]) => card.ease && card.ease < 1.5)
      .sort((a, b) => a[1].ease - b[1].ease)
      .slice(0, 5);

    if (difficult.length > 0) {
      recommendations.push({
        type: 'focus',
        priority: 'high',
        title: 'Refuerza caracteres problemáticos',
        description: `${difficult.length} caracteres con ease < 1.5 necesitan atención`,
        cardIds: difficult.map(([id]) => id)
      });
    }

    // 2. Mantener racha
    if (stats.studiedToday === 0) {
      recommendations.push({
        type: 'habit',
        priority: 'medium',
        title: 'No olvides tu práctica diaria',
        description: `${stats.dueLater} tarjetas esperan tu revisión`,
        action: 'review'
      });
    }

    // 3. Mejorar factor de facilidad
    if (stats.averageEase < 2.0) {
      recommendations.push({
        type: 'ease',
        priority: 'low',
        title: 'Tu facilidad promedio es baja',
        description: 'Considera reducir dificultad o aumentar práctica',
        action: 'ease-improvement'
      });
    }

    return recommendations;
  }

  /**
   * Proyecta carga de trabajo (próximos días)
   */
  projectWorkload(allProgress, days = 30) {
    const projection = {};

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(0, 0, 0, 0);
      const dateKey = date.toISOString().split('T')[0];

      const count = Object.values(allProgress).filter(card => {
        if (!card.nextReviewDate) return false;
        const reviewDate = new Date(card.nextReviewDate);
        reviewDate.setHours(0, 0, 0, 0);
        return reviewDate.getTime() === date.getTime();
      }).length;

      projection[dateKey] = count;
    }

    return projection;
  }

  /**
   * Exporta estadísticas para análisis
   */
  exportStats(allProgress) {
    const stats = this.getStats(allProgress);
    const projection = this.projectWorkload(allProgress, 30);

    return {
      timestamp: new Date().toISOString(),
      stats,
      projection,
      recommendations: this.getRecommendations(allProgress),
      rawData: allProgress
    };
  }
}

// Singleton
export const srs = new AdvancedSRS();
