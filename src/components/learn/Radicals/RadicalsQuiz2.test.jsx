// src/components/learn/Radicals/RadicalsQuiz2.test.jsx
// Igual que RadicalsQuiz.jsx: la correcta se elige con Math.random() directo
// (no con `shuffle`) — se mockean ambos a un valor fijo para que options[0]
// sea siempre la correcta. Aquí generateQuestions() excluye del pool de
// distractores los radicales YA usados como protagonistas (sin reciclar),
// así que con un pool justo de 10 las últimas preguntas se quedan con menos
// de 4 opciones — se usan 20 radicales para que siempre haya distractores
// de sobra, como en el uso real de la app.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import RadicalsQuiz2 from './RadicalsQuiz2.jsx';

const RADICALS = Array.from({ length: 20 }, (_, i) => ({
  radical: `部${i}`, pinyin: `p${i}`, meaning: `significado${i}`,
}));

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), radicals: RADICALS, ...overrides };
  render(<RadicalsQuiz2 {...props} />);
  return props;
}

const options = () => screen.getAllByRole('button').slice(-4);

beforeEach(() => { vi.spyOn(Math, 'random').mockReturnValue(0); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('RadicalsQuiz2 (significados)', () => {
  it('pantalla de instrucciones: "Start Quiz" arranca la 1ª pregunta', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));
    expect(screen.getByText('1/10')).toBeTruthy();
  });

  it('acertar todas las 10 preguntas muestra "10/10"', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));
    for (let i = 0; i < 10; i++) {
      fireEvent.click(options()[0]);
      fireEvent.click(screen.getByRole('button', { name: /next question|view results/i }));
    }
    expect(screen.getByText('10/10')).toBeTruthy();
  });

  it('fallar no suma puntuación', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));
    fireEvent.click(options()[3]); // no es la correcta
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    for (let i = 1; i < 10; i++) {
      fireEvent.click(options()[3]);
      fireEvent.click(screen.getByRole('button', { name: /next question|view results/i }));
    }
    expect(screen.getByText('0/10')).toBeTruthy();
  });

  it('el botón atrás llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /back to radicals/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
