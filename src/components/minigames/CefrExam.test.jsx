// src/components/minigames/CefrExam.test.jsx
// Examen de 15 preguntas (5 听 + 5 读 + 5 写). `buildMeaningQuestions` se
// mockea con una fixture de 5 preguntas fijas (reutilizada tanto para 听
// como para 读, igual que hace el propio componente al llamarla dos veces).
// Para 写 se usa el dataset real `completeSentenceData.js` con `shuffle` a
// identidad, así que las 5 primeras preguntas son las 5 primeras entradas
// del fichero — sus respuestas ('好','我','是','吗','也') están documentadas
// abajo por si se reordena el dataset.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));
vi.mock('@/components/ui/ConfettiCelebration.jsx', () => ({ default: () => null }));

const MEANING_Q = vi.hoisted(() => Array.from({ length: 5 }, (_, i) => ({
  correct: { char: `字${i}`, pinyin: `zi${i}` },
  answer: `meaning${i}`,
  options: [`meaning${i}`, `wrongA${i}`, `wrongB${i}`, `wrongC${i}`],
})));
vi.mock('@/utils/quizEngine.js', () => ({ buildMeaningQuestions: vi.fn(() => MEANING_Q) }));

const CEFR_SKILLS = vi.hoisted(() => [
  { id: 'listening', cn: '听', i18nKey: 'cefr_skill_listening', def: 'Listening' },
  { id: 'reading', cn: '读', i18nKey: 'cefr_skill_reading', def: 'Reading' },
  { id: 'writing', cn: '写', i18nKey: 'cefr_skill_writing', def: 'Writing' },
]);
vi.mock('@/utils/cefrExam.js', () => ({
  CEFR_SKILLS,
  CEFR_LEVEL: 'A1',
  CEFR_PASS_PCT: 60,
  saveCefrResult: vi.fn(({ correct, total }) => ({ pct: Math.round((correct / total) * 100) })),
  loadCefrResult: vi.fn(() => null),
  isCefrPass: vi.fn((pct) => pct >= 60),
}));

import CefrExam from './CefrExam.jsx';

const WRITING_ANSWERS = ['好', '我', '是', '吗', '也'];

function answerText(i) {
  if (i < 5) return MEANING_Q[i].answer;
  if (i < 10) return MEANING_Q[i - 5].answer;
  return WRITING_ANSWERS[i - 10];
}

function start() {
  render(<CefrExam goBack={() => {}} speak={vi.fn()} allCharacters={[]} />);
  fireEvent.click(screen.getByRole('button', { name: /start exam/i }));
}

function answerCurrent(text) {
  fireEvent.click(screen.getByRole('button', { name: text }));
  act(() => { vi.advanceTimersByTime(850); });
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('CefrExam', () => {
  it('la intro lista las 3 destrezas y arranca con la 1ª pregunta (听)', () => {
    start();
    expect(screen.getByText(/1\/15/)).toBeTruthy();
  });

  it('responder las 15 preguntas todas bien certifica el A1', () => {
    start();
    for (let i = 0; i < 15; i++) answerCurrent(answerText(i));
    expect(screen.getByText(/passed/i)).toBeTruthy();
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('fallar la primera pregunta se refleja en el desglose por destreza al terminar', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: /wronga0/i }));
    act(() => { vi.advanceTimersByTime(850); });
    for (let i = 1; i < 15; i++) answerCurrent(answerText(i));

    expect(screen.getByText('4/5 · 80%')).toBeTruthy();
  });

  it('el botón atrás de la intro llama a goBack', () => {
    const goBack = vi.fn();
    render(<CefrExam goBack={goBack} speak={vi.fn()} allCharacters={[]} />);
    fireEvent.click(screen.getByRole('button', { name: /back to skills/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
