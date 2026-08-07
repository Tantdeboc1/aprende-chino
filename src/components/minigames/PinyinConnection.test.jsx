// src/components/minigames/PinyinConnection.test.jsx
// `shuffle` mockeado a identidad. Con la fixture de 4 caracteres, la
// pregunta siempre es CHARACTERS[0] ('你', pinyin 'nǐ') y las opciones caen
// en ['hǎo','wǒ','tā','nǐ'] (los 3 distractores en orden + la correcta al
// final, por cómo PinyinConnection.jsx arma el array antes del 2º shuffle).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import PinyinConnection from './PinyinConnection.jsx';

const CHARACTERS = [
  { char: '你', pinyin: 'nǐ' },
  { char: '好', pinyin: 'hǎo' },
  { char: '我', pinyin: 'wǒ' },
  { char: '他', pinyin: 'tā' },
];

function start() {
  render(<PinyinConnection goBack={() => {}} characters={CHARACTERS} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('PinyinConnection', () => {
  it('arranca con el carácter 你 y sus 4 opciones de pinyin', () => {
    start();
    expect(screen.getByText('你')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'nǐ' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'hǎo' })).toBeTruthy();
  });

  it('elegir el pinyin correcto (nǐ) suma 10 puntos', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: 'nǐ' }));
    expect(screen.getByText(/Score:/).parentElement.textContent).toContain('10');
    expect(screen.getByText('★ 1')).toBeTruthy();
  });

  it('elegir un pinyin incorrecto suma un fallo', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: 'hǎo' }));
    expect(screen.getByText('✕ 1')).toBeTruthy();
  });

  it('tras responder, la siguiente pregunta se genera pasados 800ms', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: 'nǐ' }));
    act(() => { vi.advanceTimersByTime(800); });
    expect(screen.getByRole('button', { name: 'nǐ' }).disabled).toBe(false);
  });

  it('el botón atrás de la intro llama a goBack', () => {
    const goBack = vi.fn();
    render(<PinyinConnection goBack={goBack} characters={CHARACTERS} />);
    fireEvent.click(screen.getByRole('button', { name: /back to skills/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
