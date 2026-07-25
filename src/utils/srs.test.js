// src/utils/srs.test.js
import { describe, it, expect } from 'vitest';
import {
  getSRSData, updateSRS, toggleWordDifficult, isWordDifficult,
  initSRSCard, getDueCards, getDueCount, getWeakCards, getWordHealth,
  isLeech, getLeechCards, getNextReviewInfo, getSRSStats, LEECH_THRESHOLD,
  dedupeByChar, LEARNING_STEP_MS, SESSION_LIMIT,
} from './srs.js';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('getSRSData', () => {
  it('devuelve valores por defecto si el carácter no existe', () => {
    const d = getSRSData({}, '好');
    expect(d).toMatchObject({ interval: 1, easeFactor: 2.5, repetitions: 0, nextReview: null });
  });
});

describe('updateSRS', () => {
  it('con quality alta progresa el intervalo 1 → 6 y aumenta repetitions', () => {
    let p = {};
    p = updateSRS(p, '好', 4);        // 1ª repetición
    expect(p.__srs['好'].repetitions).toBe(1);
    expect(p.__srs['好'].interval).toBe(1);
    p = updateSRS(p, '好', 4);        // 2ª repetición
    expect(p.__srs['好'].repetitions).toBe(2);
    expect(p.__srs['好'].interval).toBe(6);
  });

  it('con quality < 3 reinicia el intervalo y sube los fallos consecutivos', () => {
    let p = updateSRS(updateSRS({}, '好', 5), '好', 5); // avanza
    p = updateSRS(p, '好', 0);                          // falla
    expect(p.__srs['好'].interval).toBe(1);
    expect(p.__srs['好'].repetitions).toBe(0);
    expect(p.__srs['好'].consecutiveFails).toBe(1);
  });

  it(`marca leech tras ${LEECH_THRESHOLD} fallos consecutivos`, () => {
    let p = {};
    for (let i = 0; i < LEECH_THRESHOLD; i++) p = updateSRS(p, '难', 0);
    expect(p.__srs['难'].leech).toBe(true);
    expect(isLeech(p, '难')).toBe(true);
  });

  it('no muta el objeto progress original (inmutable)', () => {
    const p = {};
    const p2 = updateSRS(p, '好', 4);
    expect(p.__srs).toBeUndefined();
    expect(p2.__srs['好']).toBeDefined();
  });

  it('una palabra difícil limita el intervalo a 3 días', () => {
    let p = toggleWordDifficult({}, '好');
    // avanzar varias veces: sin el tope el intervalo pasaría de 3
    for (let i = 0; i < 4; i++) p = updateSRS(p, '好', 5);
    expect(p.__srs['好'].interval).toBeLessThanOrEqual(3);
  });

  it('fallar baja el easeFactor (SM-2: q=0 → −0.8)', () => {
    const p = updateSRS({}, '好', 0);
    expect(p.__srs['好'].easeFactor).toBeCloseTo(1.7, 5); // 2.5 − 0.8
  });

  it('el easeFactor nunca baja de 1.3 por muchos fallos que acumule', () => {
    let p = {};
    for (let i = 0; i < 10; i++) p = updateSRS(p, '好', 0);
    expect(p.__srs['好'].easeFactor).toBe(1.3);
  });

  it('una palabra que fallas siempre no vuelve a saltar a intervalos largos', () => {
    // Regresión: antes el EF quedaba intacto al fallar, así que tras dos
    // aciertos la palabra saltaba a 6 y luego a 15 días como si fuera fácil.
    let fallada = {};
    for (let i = 0; i < 4; i++) fallada = updateSRS(fallada, '难', 0);
    // Las dos llegan con los mismos 3 aciertos seguidos
    for (let i = 0; i < 3; i++) fallada = updateSRS(fallada, '难', 4);
    let facil = {};
    for (let i = 0; i < 3; i++) facil = updateSRS(facil, '易', 4);

    expect(fallada.__srs['难'].interval).toBeLessThan(facil.__srs['易'].interval);
    expect(getWordHealth(fallada, '难').level).toBe('critical'); // EF < 1.5
  });

  it('fallar reprograma la tarjeta en minutos, no al día siguiente', () => {
    const before = Date.now();
    const p = updateSRS({}, '好', 0);
    const delay = p.__srs['好'].nextReview - before;
    expect(delay).toBeGreaterThan(0);
    expect(delay).toBeLessThanOrEqual(LEARNING_STEP_MS + 50);
    expect(p.__srs['好'].interval).toBe(1); // el intervalo SM-2 sigue en 1 día
  });

  it('acertar sigue programando en días', () => {
    const before = Date.now();
    const p = updateSRS(updateSRS({}, '好', 4), '好', 4); // interval 6
    expect(p.__srs['好'].nextReview - before).toBeGreaterThanOrEqual(6 * DAY_MS - 50);
  });
});

describe('toggleWordDifficult / isWordDifficult', () => {
  it('alterna la bandera difícil', () => {
    let p = toggleWordDifficult({}, '好');
    expect(isWordDifficult(p, '好')).toBe(true);
    p = toggleWordDifficult(p, '好');
    expect(isWordDifficult(p, '好')).toBe(false);
  });
});

describe('initSRSCard', () => {
  it('crea la tarjeta con nextReview disponible ahora', () => {
    const p = initSRSCard({}, '好');
    expect(p.__srs['好'].nextReview).not.toBeNull();
    expect(p.__srs['好'].nextReview).toBeLessThanOrEqual(Date.now());
  });

  it('preserva la flag difficult si ya existía sin nextReview', () => {
    const marked = toggleWordDifficult({}, '好'); // difficult:true, nextReview:null
    const p = initSRSCard(marked, '好');
    expect(p.__srs['好'].difficult).toBe(true);
    expect(p.__srs['好'].nextReview).not.toBeNull();
  });

  it('no toca una tarjeta con nextReview válido', () => {
    const seen = updateSRS({}, '好', 4);
    const p = initSRSCard(seen, '好');
    expect(p).toBe(seen); // misma referencia → no cambió
  });
});

describe('dedupeByChar', () => {
  it('conserva el primero de cada carácter repetido', () => {
    const list = [
      { char: '水', lesson: 3 },
      { char: '好', lesson: 1 },
      { char: '水', lesson: 8 },
    ];
    const out = dedupeByChar(list);
    expect(out.map(c => `${c.char}${c.lesson}`)).toEqual(['水3', '好1']);
  });

  it('no repasa dos veces un carácter presente en dos lecciones', () => {
    const progress = { __srs: { 水: { nextReview: Date.now() - DAY_MS } } };
    const chars = [{ char: '水', lesson: 3 }, { char: '水', lesson: 8 }];
    expect(getDueCards(progress, chars).map(c => c.char)).toEqual(['水']);
  });
});

describe('getDueCards / getDueCount', () => {
  const chars = [{ char: '好' }, { char: '你' }, { char: '我' }];

  it('solo incluye palabras vistas con nextReview vencido', () => {
    const progress = { __srs: {
      好: { nextReview: Date.now() - DAY_MS },     // vencida
      你: { nextReview: Date.now() + DAY_MS },     // futura
      // 我 nunca vista
    } };
    const due = getDueCards(progress, chars);
    expect(due.map(c => c.char)).toEqual(['好']);
    expect(getDueCount(progress, chars)).toBe(1);
  });

  it('ordena de más atrasada a menos', () => {
    const progress = { __srs: {
      好: { nextReview: Date.now() - DAY_MS },
      你: { nextReview: Date.now() - 10 * DAY_MS }, // la que más espera
      我: { nextReview: Date.now() - 3 * DAY_MS },
    } };
    expect(getDueCards(progress, chars).map(c => c.char)).toEqual(['你', '我', '好']);
  });

  it('limit corta la tanda quedándose con las más atrasadas', () => {
    const progress = { __srs: {
      好: { nextReview: Date.now() - DAY_MS },
      你: { nextReview: Date.now() - 10 * DAY_MS },
      我: { nextReview: Date.now() - 3 * DAY_MS },
    } };
    expect(getDueCards(progress, chars, { limit: 2 }).map(c => c.char)).toEqual(['你', '我']);
    // El contador de la pantalla de inicio sigue viendo la cola completa
    expect(getDueCount(progress, chars)).toBe(3);
  });

  it('SESSION_LIMIT es un tope razonable para una sesión', () => {
    expect(SESSION_LIMIT).toBeGreaterThan(0);
    expect(SESSION_LIMIT).toBeLessThanOrEqual(50);
  });
});

describe('getWeakCards', () => {
  it('ordena las más débiles (menor easeFactor) primero', () => {
    const chars = [{ char: '好', lesson: 1 }, { char: '你', lesson: 1 }];
    const progress = { __srs: {
      好: { nextReview: Date.now(), easeFactor: 2.5 }, // fuerte
      你: { nextReview: Date.now(), easeFactor: 1.3 }, // débil
    } };
    const weak = getWeakCards(progress, chars);
    expect(weak[0].char).toBe('你');
  });

  it('devuelve [] si no hay palabras inscritas', () => {
    expect(getWeakCards({}, [{ char: '好', lesson: 1 }])).toEqual([]);
  });
});

describe('getWordHealth', () => {
  it('new cuando nunca se ha visto', () => {
    expect(getWordHealth({}, '好').level).toBe('new');
  });
  it('critical con intervalo 1', () => {
    const p = { __srs: { 好: { nextReview: Date.now(), interval: 1, easeFactor: 2.5 } } };
    expect(getWordHealth(p, '好').level).toBe('critical');
  });
  it('mastered con intervalo ≥ 21', () => {
    const p = { __srs: { 好: { nextReview: Date.now(), interval: 30, easeFactor: 2.5 } } };
    expect(getWordHealth(p, '好').level).toBe('mastered');
  });
});

describe('getLeechCards', () => {
  it('devuelve las palabras marcadas como leech', () => {
    const chars = [{ char: '好' }, { char: '难' }];
    const p = { __srs: { 难: { leech: true }, 好: { leech: false } } };
    expect(getLeechCards(p, chars).map(c => c.char)).toEqual(['难']);
  });
});

describe('getNextReviewInfo', () => {
  it('never si nunca se ha visto', () => {
    expect(getNextReviewInfo({}, '好')).toEqual({ kind: 'never' });
  });
  it('mastered con intervalo ≥ 21 aunque falte mucho', () => {
    const p = { __srs: { 好: { nextReview: Date.now() + 30 * DAY_MS, interval: 30 } } };
    expect(getNextReviewInfo(p, '好')).toEqual({ kind: 'mastered' });
  });
  it('due cuando ya toca', () => {
    const p = { __srs: { 好: { nextReview: Date.now() - 1000, interval: 2 } } };
    expect(getNextReviewInfo(p, '好')).toEqual({ kind: 'due', days: 0 });
  });
  it('una tarjeta en paso de aprendizaje se muestra como pendiente, no como "mañana"', () => {
    const p = updateSRS({}, '好', 0); // vuelve en LEARNING_STEP_MS
    expect(getNextReviewInfo(p, '好')).toEqual({ kind: 'due', days: 0 });
  });
  it('soon con los días restantes', () => {
    const p = { __srs: { 好: { nextReview: Date.now() + 3 * DAY_MS, interval: 5 } } };
    const info = getNextReviewInfo(p, '好');
    expect(info.kind).toBe('soon');
    expect(info.days).toBeGreaterThanOrEqual(2);
  });
});

describe('getSRSStats', () => {
  it('cuenta aprendidas, pendientes y maduras, ignorando suplementarias', () => {
    const chars = [
      { char: '好' }, { char: '你' }, { char: '我' },
      { char: 'X', isSupplementary: true },
    ];
    const p = { __srs: {
      好: { nextReview: Date.now() - 1000, interval: 30 }, // aprendida, due, madura
      你: { nextReview: Date.now() + DAY_MS, interval: 2 }, // aprendida, no due
      // 我 no vista
    } };
    const stats = getSRSStats(p, chars);
    expect(stats.learned).toBe(2);
    expect(stats.due).toBe(1);
    expect(stats.mature).toBe(1);
    expect(stats.total).toBe(3); // excluye la suplementaria
  });
});
