import { describe, expect, it } from 'vitest';
import { getNameModerationKey, isNameAllowed, sanitizeUserName } from './nameModeration.js';

describe('nameModeration', () => {
  it('permite nombres normales', () => {
    expect(isNameAllowed('Ana García')).toBe(true);
    expect(isNameAllowed('小明')).toBe(true);
  });

  it('bloquea insultos unidos, con tildes o cambios leet sencillos', () => {
    expect(isNameAllowed('tuputamadre')).toBe(false);
    expect(isNameAllowed('Puta Madre')).toBe(false);
    expect(isNameAllowed('m1erd4')).toBe(false);
    expect(getNameModerationKey('tuputamadre')).toBe('name_not_allowed');
  });

  it('sustituye un nombre antiguo no permitido al sincronizarlo', () => {
    expect(sanitizeUserName('tuputamadre')).toBe('Estudiante');
    expect(sanitizeUserName('  Ana  ')).toBe('Ana');
  });
});
