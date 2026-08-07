// src/utils/wordType.test.js
import { describe, it, expect } from 'vitest';
import { wordTypeLabel } from './wordType.js';

describe('wordTypeLabel', () => {
  it('localiza una abreviatura simple a inglés', () => {
    expect(wordTypeLabel('S.', 'en')).toBe('N.');
    expect(wordTypeLabel('V.', 'en')).toBe('V.');
  });

  it('resuelve compuestos átomo a átomo ("S./V." → "N./V." en inglés)', () => {
    expect(wordTypeLabel('S./V.', 'en')).toBe('N./V.');
  });

  it('normaliza inconsistencias del dato ("VO" → "VO.", "NP" → "NP.")', () => {
    expect(wordTypeLabel('VO', 'en')).toBe('V.-obj.');
    expect(wordTypeLabel('NP', 'de')).toBe('Eigenn.');
  });

  it('idioma no soportado cae a español', () => {
    expect(wordTypeLabel('S.', 'zh')).toBe('S.');
  });

  it('"—" y valores vacíos se devuelven tal cual', () => {
    expect(wordTypeLabel('—', 'en')).toBe('—');
    expect(wordTypeLabel('', 'en')).toBe('');
    expect(wordTypeLabel(null, 'en')).toBe('');
  });

  it('átomo desconocido se conserva sin traducir', () => {
    expect(wordTypeLabel('XYZ.', 'en')).toBe('XYZ.');
  });
});
