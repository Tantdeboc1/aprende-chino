// src/components/GlobalExam.test.jsx
// `shuffle` de arrayUtils.js se mockea a identidad: buildMeaningQuestions
// (quizEngine.js) arma `options = shuffle([correctMeaning, ...distractors])`,
// así que con shuffle=identidad la correcta cae SIEMPRE primera — determinismo
// suficiente para probar puntuación/aprobado/reprobado sin depender del orden real.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import GlobalExam from './GlobalExam.jsx';

// 20 caracteres únicos: buildMeaningQuestions coge QUESTIONS_PER_ROUND=20.
const CHARS = Array.from({ length: 20 }, (_, i) => ({
  char: `字${i}`, pinyin: `p${i}`, meaning: `significado${i}`, lesson: 1,
}));

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), allCharacters: CHARS, ...overrides };
  render(<GlobalExam {...props} />);
  return props;
}

/** Las opciones de la pregunta actual son los últimos 4 botones. */
const options = () => screen.getAllByRole('button').slice(-4);

beforeEach(() => {
  vi.useFakeTimers();
  window.matchMedia = window.matchMedia || (() => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('GlobalExam', () => {
  it('pantalla de bienvenida: "Start" arranca el examen con 20 preguntas', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start|comenzar/i }));
    expect(screen.getByText('1/20')).toBeTruthy();
  });

  it('acertar (primera opción, shuffle=identidad) suma punto y avanza tras el feedback', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start|comenzar/i }));
    fireEvent.click(options()[0]); // correcta

    await act(() => vi.advanceTimersByTimeAsync(700));
    expect(screen.getByText('2/20')).toBeTruthy();
    expect(screen.getByText('★ 1')).toBeTruthy();
  });

  it('fallar suma a los errores sin sumar acierto', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start|comenzar/i }));
    fireEvent.click(options()[3]); // no es la correcta

    await act(() => vi.advanceTimersByTimeAsync(700));
    expect(screen.getByText('✕ 1')).toBeTruthy();
    expect(screen.getByText('★ 0')).toBeTruthy();
  });

  it('se acaba el tiempo (90s): termina el examen aunque queden preguntas', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start|comenzar/i }));
    await act(() => vi.advanceTimersByTimeAsync(90_000));
    expect(screen.getByText(/exam completed|examen completado/i)).toBeTruthy();
  });

  it('responder las 20 preguntas acertando todas termina con 100% y aprueba', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start|comenzar/i }));
    for (let i = 0; i < 20; i++) {
      fireEvent.click(options()[0]);
      await act(() => vi.advanceTimersByTimeAsync(700));
    }
    expect(screen.getAllByText('100%').length).toBeGreaterThan(0);
    expect(screen.getByText(/exam completed|examen completado/i)).toBeTruthy();
  });

  it('"Repeat" desde resultados reinicia el examen desde la pregunta 1', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start|comenzar/i }));
    await act(() => vi.advanceTimersByTimeAsync(90_000)); // termina por tiempo

    fireEvent.click(screen.getByRole('button', { name: /repeat|repetir/i }));
    expect(screen.getByText('1/20')).toBeTruthy();
  });

  it('el botón de volver en la pantalla de bienvenida llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /back|salir|volver/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
