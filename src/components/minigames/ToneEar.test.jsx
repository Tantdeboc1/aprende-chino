// src/components/minigames/ToneEar.test.jsx
// `shuffle` mockeado a identidad: la pregunta es siempre el 1er carácter de
// `characters` que cumpla isSingleToned (pinyinNumeric sin espacios + tono
// 1-4). Los 4 botones de tono son siempre TONES en el mismo orden fijo
// (1º..4º), así que el botón correcto es el de índice `tone - 1`.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import ToneEar from './ToneEar.jsx';

const CHARACTERS = [
  { char: '妈', pinyin: 'mā', pinyinNumeric: 'ma1', tone: 1 },
  { char: '麻', pinyin: 'má', pinyinNumeric: 'ma2', tone: 2 },
];

function start(speak = vi.fn().mockResolvedValue(true)) {
  render(<ToneEar goBack={() => {}} characters={CHARACTERS} speak={speak} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
  act(() => { vi.advanceTimersByTime(350); });
  return speak;
}

const toneButtons = () => screen.getAllByRole('button').slice(-4);

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('ToneEar', () => {
  it('arranca la ronda 1 y reproduce el audio de la sílaba (妈, tono 1)', () => {
    const speak = start();
    expect(screen.getByText('1 / 10')).toBeTruthy();
    expect(speak).toHaveBeenCalledWith({ pinyin: 'ma1', hanzi: '妈' });
    expect(toneButtons()).toHaveLength(4);
  });

  it('elegir el tono correcto (1º) suma acierto', () => {
    start();
    fireEvent.click(toneButtons()[0]);
    expect(screen.getByText('★ 1')).toBeTruthy();
  });

  it('elegir un tono incorrecto suma fallo y muestra el carácter con su pinyin', () => {
    start();
    fireEvent.click(toneButtons()[1]);
    expect(screen.getByText('✕ 1')).toBeTruthy();
    expect(screen.getByText('妈')).toBeTruthy();
    expect(screen.getByText('mā')).toBeTruthy();
  });

  it('tras responder, la siguiente ronda vuelve a estar en 2 / 10', () => {
    start();
    fireEvent.click(toneButtons()[0]);
    act(() => { vi.advanceTimersByTime(1200); });
    act(() => { vi.advanceTimersByTime(350); });
    expect(screen.getByText('2 / 10')).toBeTruthy();
  });

  it('el botón atrás de la intro llama a goBack', () => {
    const goBack = vi.fn();
    render(<ToneEar goBack={goBack} characters={CHARACTERS} speak={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /back to skills/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
