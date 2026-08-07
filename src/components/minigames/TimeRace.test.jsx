// src/components/minigames/TimeRace.test.jsx
// `shuffle` mockeado a identidad. Con la fixture de 4 caracteres, la
// pregunta siempre es CHARACTERS[0] ('你', significado 'you') y las 4
// opciones quedan en orden ['you','good','me','him'] (un único shuffle,
// a diferencia de PinyinConnection que aplica dos).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import TimeRace from './TimeRace.jsx';

const CHARACTERS = [
  { char: '你', meaning: 'you' },
  { char: '好', meaning: 'good' },
  { char: '我', meaning: 'me' },
  { char: '他', meaning: 'him' },
];

function start() {
  render(<TimeRace goBack={() => {}} characters={CHARACTERS} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('TimeRace', () => {
  it('arranca con el carácter 你 y sus 4 opciones de significado', () => {
    start();
    expect(screen.getByText('你')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'you' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'good' })).toBeTruthy();
  });

  it('elegir el significado correcto (you) suma 10 puntos', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: 'you' }));
    expect(screen.getByText('★ 1')).toBeTruthy();
  });

  it('elegir un significado incorrecto suma un fallo', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: 'good' }));
    expect(screen.getByText('✕ 1')).toBeTruthy();
  });

  it('tras responder, la siguiente pregunta se genera pasados 800ms', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: 'you' }));
    act(() => { vi.advanceTimersByTime(800); });
    expect(screen.getByRole('button', { name: 'you' }).disabled).toBe(false);
  });

  it('el botón atrás de la intro llama a goBack', () => {
    const goBack = vi.fn();
    render(<TimeRace goBack={goBack} characters={CHARACTERS} />);
    fireEvent.click(screen.getByRole('button', { name: /back to skills/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
