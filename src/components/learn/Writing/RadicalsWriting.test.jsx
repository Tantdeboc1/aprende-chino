// src/components/learn/Writing/RadicalsWriting.test.jsx
// Mismo patrón que HanziWriting.test.jsx: HanziWriter se mockea por completo.
// El init tiene un setTimeout(150ms); animateCharacter encadena awaits de
// 200ms+300ms antes de llamar a animateCharacter(); startPractice encadena
// 300ms antes de quiz(). Se avanza el reloj fake en cada paso.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

const fakeWriter = vi.hoisted(() => ({
  showCharacter: vi.fn(),
  hideCharacter: vi.fn(),
  showOutline: vi.fn(),
  animateCharacter: vi.fn(),
  quiz: vi.fn(),
  cancelQuiz: vi.fn(),
  _target: { innerHTML: '' },
}));
const createMock = vi.hoisted(() => vi.fn(() => fakeWriter));
vi.mock('hanzi-writer', () => ({ default: { create: createMock } }));

import RadicalsWriting from './RadicalsWriting.jsx';

const RADICALS = [
  { radical: '人', pinyin: 'rén', meaning: 'person', strokeCount: 2, examples: ['你', '他'] },
  { radical: '女', pinyin: 'nǚ', meaning: 'woman', strokeCount: 3, examples: ['好'] },
];

async function start(overrides = {}) {
  render(<RadicalsWriting goBack={() => {}} radicals={RADICALS} speakChinese={vi.fn()} {...overrides} />);
  await act(async () => { await vi.advanceTimersByTimeAsync(200); });
}

beforeEach(() => {
  vi.useFakeTimers();
  createMock.mockClear();
  Object.values(fakeWriter).forEach(fn => typeof fn === 'function' && fn.mockClear?.());
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('RadicalsWriting', () => {
  it('arranca en "View Order" mostrando el 1er radical (人)', async () => {
    await start();
    expect(screen.getByText('人')).toBeTruthy();
    expect(screen.getByText(/1 de 2/)).toBeTruthy();
    expect(createMock).toHaveBeenCalled();
  });

  it('pulsar "View Stroke Order" anima el radical tras los delays internos', async () => {
    await start();
    fireEvent.click(screen.getByRole('button', { name: /view stroke order/i }));
    await act(async () => { await vi.advanceTimersByTimeAsync(600); });
    expect(fakeWriter.animateCharacter).toHaveBeenCalled();
  });

  it('cambiar a "Practice" y pulsar "Start Practice" arranca el quiz', async () => {
    await start();
    fireEvent.click(screen.getByRole('button', { name: /^practice$/i }));
    await act(async () => { await vi.advanceTimersByTimeAsync(200); });
    fireEvent.click(screen.getByRole('button', { name: /start practice/i }));
    await act(async () => { await vi.advanceTimersByTimeAsync(400); });
    expect(fakeWriter.quiz).toHaveBeenCalled();
  });

  it('"Next" avanza al 2º radical (女)', async () => {
    await start();
    fireEvent.click(screen.getByRole('button', { name: /^next/i }));
    await act(async () => { await vi.advanceTimersByTimeAsync(200); });
    expect(screen.getByText('女')).toBeTruthy();
    expect(screen.getByText(/2 de 2/)).toBeTruthy();
  });

  it('el botón atrás llama a goBack', async () => {
    const goBack = vi.fn();
    await start({ goBack });
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });

  it('sin radicales válidos muestra el mensaje de vacío', async () => {
    render(<RadicalsWriting goBack={() => {}} radicals={[]} speakChinese={vi.fn()} />);
    expect(screen.getByText(/no radicals available/i)).toBeTruthy();
  });
});
