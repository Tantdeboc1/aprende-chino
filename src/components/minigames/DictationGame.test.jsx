// src/components/minigames/DictationGame.test.jsx
// `shuffle` se mockea a identidad: con la fixture de 4 caracteres, la
// respuesta correcta siempre es CHARACTERS[0] ('你') y las opciones quedan
// en el mismo orden ['你','好','我','他']. El audio se dispara con un
// setTimeout(350ms) al entrar en cada ronda — se usan fake timers.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import DictationGame from './DictationGame.jsx';

const CHARACTERS = [
  { char: '你', pinyin: 'nǐ', pinyinNumeric: 'ni3' },
  { char: '好', pinyin: 'hǎo', pinyinNumeric: 'hao3' },
  { char: '我', pinyin: 'wǒ', pinyinNumeric: 'wo3' },
  { char: '他', pinyin: 'tā', pinyinNumeric: 'ta1' },
];

function start(speak = vi.fn().mockResolvedValue(true)) {
  render(<DictationGame goBack={() => {}} characters={CHARACTERS} speak={speak} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
  act(() => { vi.advanceTimersByTime(350); });
  return speak;
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('DictationGame', () => {
  it('arranca la ronda 1 y reproduce el audio de la palabra correcta (你)', () => {
    const speak = start();
    expect(screen.getByText('1 / 10')).toBeTruthy();
    expect(speak).toHaveBeenCalledWith({ pinyin: 'ni3', hanzi: '你' });
  });

  it('elegir el carácter correcto (你) suma acierto', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: '你' }));
    expect(screen.getByText('★ 1')).toBeTruthy();
  });

  it('elegir un carácter incorrecto suma fallo y muestra el pinyin correcto', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: '好' }));
    expect(screen.getByText('✕ 1')).toBeTruthy();
    expect(screen.getAllByText('nǐ').length).toBeGreaterThan(0);
  });

  it('tras responder, la siguiente ronda vuelve a estar en 2 / 10', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: '你' }));
    act(() => { vi.advanceTimersByTime(1100); });
    act(() => { vi.advanceTimersByTime(350); });
    expect(screen.getByText('2 / 10')).toBeTruthy();
  });

  it('el botón atrás de la intro llama a goBack', () => {
    const goBack = vi.fn();
    render(<DictationGame goBack={goBack} characters={CHARACTERS} speak={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /back to skills/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
