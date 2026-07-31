// src/utils/badges.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { computeBadges, BADGE_DEFS } from './badges.js';
import { loc } from './loc.js';

const LANGS = ['es', 'en', 'fr', 'de', 'it', 'pt'];

const characters = [
  { char: '你', lesson: 1 },
  { char: '好', lesson: 1 },
  { char: '我', lesson: 2 },
];

const badge = (list, id) => list.find(b => b.id === id);

beforeEach(() => localStorage.clear());

describe('BADGE_DEFS — traducciones', () => {
  it('todas las insignias tienen título y descripción en los 6 idiomas', () => {
    for (const b of BADGE_DEFS) {
      for (const lang of LANGS) {
        expect(b.title?.[lang], `${b.id}.title.${lang}`).toBeTruthy();
        expect(b.desc?.[lang], `${b.id}.desc.${lang}`).toBeTruthy();
      }
    }
  });

  it('no quedan títulos como string plano (el formato antiguo en español)', () => {
    for (const b of BADGE_DEFS) {
      expect(typeof b.title, `${b.id}.title`).toBe('object');
      expect(typeof b.desc, `${b.id}.desc`).toBe('object');
    }
  });

  it('se resuelven al idioma pedido, también con locale regional', () => {
    const first = BADGE_DEFS[0];
    expect(loc(first.title, 'de')).toBe(first.title.de);
    expect(loc(first.title, 'pt-BR')).toBe(first.title.pt);
  });
});

describe('computeBadges', () => {
  it('sin progreso no hay ninguna ganada', () => {
    const badges = computeBadges({}, characters);
    expect(badges).toHaveLength(BADGE_DEFS.length);
    expect(badges.every(b => !b.earned)).toBe(true);
  });

  it('first-step se gana con un carácter en el SRS', () => {
    const p = { __srs: { 你: { nextReview: Date.now(), interval: 1 } } };
    expect(badge(computeBadges(p, characters), 'first-step').earned).toBe(true);
  });

  it('writer cuenta las prácticas de escritura acumuladas', () => {
    expect(badge(computeBadges({ __writing: { 你: 49 } }, characters), 'writer').earned).toBe(false);
    expect(badge(computeBadges({ __writing: { 你: 30, 好: 20 } }, characters), 'writer').earned).toBe(true);
  });
});

describe('perfectionist — la precisión sale de correct/incorrect', () => {
  // Antes se leía progress.__srs[x].reviews, un campo que updateSRS nunca
  // escribe: la precisión era siempre 0 y la insignia inalcanzable.
  it('se gana con 90 % de acierto y 50+ respuestas', () => {
    const p = { lesson_1: { 你: { seen: true, correct: 47, incorrect: 3 } } }; // 50 resp., 94 %
    expect(badge(computeBadges(p, characters), 'perfectionist').earned).toBe(true);
  });

  it('no se gana con pocas respuestas aunque la precisión sea perfecta', () => {
    const p = { lesson_1: { 你: { seen: true, correct: 10, incorrect: 0 } } };
    expect(badge(computeBadges(p, characters), 'perfectionist').earned).toBe(false);
  });

  it('no se gana con muchas respuestas y precisión baja', () => {
    const p = { lesson_1: { 你: { seen: true, correct: 40, incorrect: 40 } } };
    expect(badge(computeBadges(p, characters), 'perfectionist').earned).toBe(false);
  });

  it('ignora las claves internas de la lección al contar', () => {
    const p = {
      lesson_1: { __examHistory: [{ score: 9, total: 10 }], 你: { correct: 47, incorrect: 3 } },
    };
    expect(badge(computeBadges(p, characters), 'perfectionist').earned).toBe(true);
  });
});
