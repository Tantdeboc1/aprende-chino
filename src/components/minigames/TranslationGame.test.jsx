// src/components/minigames/TranslationGame.test.jsx
// `shuffle` a identidad + `useTranslationPhrases` con una fixture de 8 frases
// (== ROUNDS) para que no se recorte nada. `getCandidates` (IME pinyin) se
// mockea con una lista fija: el candidato correcto es el hanzi de la ronda,
// el segundo es un distractor que nunca coincide con la solución.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

const PHRASES = Array.from({ length: 8 }, (_, i) => ({
  hanzi: `你好${i}`, pinyin: `nǐ hǎo ${i}`, lesson: 1,
  translations: { en: `Hello ${i}` },
}));
vi.mock('@/hooks/useTranslationPhrases.js', () => ({ useTranslationPhrases: () => PHRASES }));

vi.mock('@/data/pinyinDictionary.js', () => ({
  getCandidates: vi.fn(() => [{ hanzi: PHRASES[0].hanzi, pinyin: PHRASES[0].pinyin }, { hanzi: '错', pinyin: 'cuò' }]),
}));

import TranslationGame from './TranslationGame.jsx';

function start() {
  render(<TranslationGame goBack={() => {}} selectedLesson={null} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
}

function typePinyin(val = 'ni') {
  fireEvent.change(screen.getByPlaceholderText(/laoshi, nimen/i), { target: { value: val } });
}

beforeEach(() => vi.clearAllMocks());
afterEach(() => cleanup());

describe('TranslationGame', () => {
  it('escribir pinyin muestra candidatos y seleccionar uno lo añade a la construcción', () => {
    start();
    typePinyin();
    fireEvent.click(screen.getByRole('button', { name: new RegExp('^' + PHRASES[0].hanzi) }));
    expect(screen.getAllByText(PHRASES[0].hanzi).length).toBeGreaterThan(0);
  });

  it('construir la respuesta correcta y comprobar suma acierto', () => {
    start();
    typePinyin();
    fireEvent.click(screen.getByRole('button', { name: new RegExp('^' + PHRASES[0].hanzi) }));
    fireEvent.click(screen.getByRole('button', { name: /^check$/i }));
    expect(screen.getByText('✓ Correct!')).toBeTruthy();
  });

  it('construir una respuesta incorrecta muestra la solución', () => {
    start();
    typePinyin();
    fireEvent.click(screen.getByRole('button', { name: /^错/ }));
    fireEvent.click(screen.getByRole('button', { name: /^check$/i }));
    expect(screen.getByText('✗ Incorrect')).toBeTruthy();
  });

  it('tras acertar, "Next" pasa a la ronda 2 (frase distinta)', () => {
    start();
    typePinyin();
    fireEvent.click(screen.getByRole('button', { name: new RegExp('^' + PHRASES[0].hanzi) }));
    fireEvent.click(screen.getByRole('button', { name: /^check$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^next/i }));

    expect(screen.getByText('Hello 1')).toBeTruthy();
  });

  it('el botón atrás de la intro llama a goBack', () => {
    const goBack = vi.fn();
    render(<TranslationGame goBack={goBack} selectedLesson={null} />);
    fireEvent.click(screen.getByRole('button', { name: /back to skills/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
