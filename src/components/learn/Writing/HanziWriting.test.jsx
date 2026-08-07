// src/components/learn/Writing/HanziWriting.test.jsx
// HanziWriter (librería externa de stroke-order) no funciona en jsdom — se
// mockea con una instancia falsa. El `await import('hanzi-writer')` ocurre
// dentro de un setTimeout(100ms) en un useEffect; con fake timers hay que
// avanzar el reloj Y dejar que el import (microtask) se resuelva, de ahí
// `vi.advanceTimersByTimeAsync`.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

const fakeWriter = vi.hoisted(() => ({
  animateCharacter: vi.fn(),
  quiz: vi.fn(),
  cancelQuiz: vi.fn(),
  showOutline: vi.fn(),
  _target: { innerHTML: '' },
}));
const createMock = vi.hoisted(() => vi.fn(() => fakeWriter));
vi.mock('hanzi-writer', () => ({ default: { create: createMock } }));
vi.mock('@/utils/streak.js', () => ({ addXP: vi.fn() }));

import HanziWriting from './HanziWriting.jsx';

const CHARACTERS = [
  { char: '你', pinyin: 'nǐ', meaning: 'you' },
  { char: '好', pinyin: 'hǎo', meaning: 'good' },
];

async function start(overrides = {}) {
  render(<HanziWriting goBack={() => {}} characters={CHARACTERS} speakChinese={vi.fn()} progress={{}} onProgressChange={vi.fn()} {...overrides} />);
  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
}

beforeEach(() => { vi.useFakeTimers(); createMock.mockClear(); fakeWriter.animateCharacter.mockClear(); fakeWriter.quiz.mockClear(); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('HanziWriting', () => {
  it('arranca en la pestaña "Ver orden" mostrando el 1er carácter (你)', async () => {
    await start();
    expect(screen.getByText('你')).toBeTruthy();
    expect(screen.getByText('1 de 2')).toBeTruthy();
    expect(createMock).toHaveBeenCalled();
  });

  it('pulsar "View Stroke Order" anima el carácter', async () => {
    await start();
    fireEvent.click(screen.getByRole('button', { name: /view stroke order/i }));
    expect(fakeWriter.animateCharacter).toHaveBeenCalled();
  });

  it('cambiar a la pestaña "Practice" y completar el quiz registra progreso y XP', async () => {
    const onProgressChange = vi.fn();
    await start({ onProgressChange });
    fireEvent.click(screen.getByRole('button', { name: /^practice$/i }));
    await act(async () => { await vi.advanceTimersByTimeAsync(150); });

    fireEvent.click(screen.getByRole('button', { name: /start practice/i }));
    expect(fakeWriter.quiz).toHaveBeenCalled();

    // Simula que HanziWriter completa el quiz llamando a su propio onComplete.
    const { onComplete } = fakeWriter.quiz.mock.calls.at(-1)[0];
    act(() => { onComplete(); });
    expect(onProgressChange).toHaveBeenCalled();
  });

  it('"Next" avanza al 2º carácter (好)', async () => {
    await start();
    fireEvent.click(screen.getByRole('button', { name: /^next/i }));
    await act(async () => { await vi.advanceTimersByTimeAsync(150); });
    expect(screen.getByText('好')).toBeTruthy();
    expect(screen.getByText('2 de 2')).toBeTruthy();
  });

  it('el botón atrás llama a goBack', async () => {
    const goBack = vi.fn();
    await start({ goBack });
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
