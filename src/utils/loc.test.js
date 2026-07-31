// src/utils/loc.test.js
import { describe, it, expect } from 'vitest';
import { loc, trField, baseLang } from './loc.js';

const campo = { es: 'hola', en: 'hello', fr: 'salut', de: 'hallo', it: 'ciao', pt: 'olá' };

describe('baseLang', () => {
  it('normaliza códigos regionales', () => {
    expect(baseLang('pt-BR')).toBe('pt');
    expect(baseLang('es-419')).toBe('es');
    expect(baseLang('en')).toBe('en');
  });

  it('cae al fallback con valores vacíos', () => {
    expect(baseLang(null)).toBe('es');
    expect(baseLang(undefined, 'en')).toBe('en');
    expect(baseLang('')).toBe('es');
  });
});

describe('loc', () => {
  it('resuelve el idioma pedido', () => {
    expect(loc(campo, 'fr')).toBe('salut');
  });

  it('resuelve códigos regionales sin caer al fallback', () => {
    // El fallo que motivó normalizar dentro de loc(): con 'pt-BR' se veía
    // inglés aunque el portugués estuviera traducido.
    expect(loc(campo, 'pt-BR')).toBe('olá');
    expect(loc(campo, 'en-US')).toBe('hello');
    expect(loc(campo, 'de-AT')).toBe('hallo');
  });

  it('cae a inglés y luego a español si falta el idioma', () => {
    expect(loc({ en: 'hello', es: 'hola' }, 'fr')).toBe('hello');
    expect(loc({ es: 'hola' }, 'fr')).toBe('hola');
    expect(loc({ zz: 'algo' }, 'fr')).toBe('algo');
  });

  it('devuelve los strings neutros tal cual', () => {
    expect(loc('好', 'fr')).toBe('好');
  });

  it('tolera valores vacíos', () => {
    expect(loc(null, 'es')).toBe('');
    expect(loc(undefined, 'es')).toBe('');
  });
});

describe('trField', () => {
  const tr = { en: 'hello', pt: 'olá' };

  it('devuelve la base en español', () => {
    expect(trField('hola', tr, 'es')).toBe('hola');
    expect(trField('hola', tr, 'es-ES')).toBe('hola');
  });

  it('resuelve códigos regionales', () => {
    expect(trField('hola', tr, 'pt-BR')).toBe('olá');
  });

  it('cae a la base si no hay traducción o no hay objeto', () => {
    expect(trField('hola', tr, 'fr')).toBe('hola');
    expect(trField('hola', null, 'fr')).toBe('hola');
  });
});
