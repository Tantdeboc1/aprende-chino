// src/components/learn/Tones/QuizTone.test.jsx
// buildQuiz elige base y tono con Math.random() directo. Fijándolo a 0, cada
// pregunta es siempre la misma (base "ma", tono 1) — determinismo suficiente
// para probar el conteo de aciertos sin depender de qué pregunta salga.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import QuizTone from './QuizTone.jsx';

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), speakChinese: vi.fn(), ...overrides };
  render(<QuizTone {...props} />);
  return props;
}

const start = () => fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));

beforeEach(() => { vi.spyOn(Math, 'random').mockReturnValue(0); });
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('QuizTone', () => {
  it('"Start Quiz" arranca la 1ª pregunta con las 4 opciones de tono', () => {
    setup();
    start();
    expect(screen.getByText(/1\/10/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /first tone/i })).toBeTruthy();
  });

  it('"Listen" llama a speakChinese con la sílaba+tono construida', () => {
    const props = setup();
    start();
    fireEvent.click(screen.getByRole('button', { name: /^listen$/i }));
    expect(props.speakChinese).toHaveBeenCalledWith('ma1', { category: 'pronunciation' });
  });

  it('acertar el tono correcto (1º) suma punto y avanza', () => {
    setup();
    start();
    fireEvent.click(screen.getByRole('button', { name: /first tone/i }));
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    expect(screen.getByText(/2\/10/)).toBeTruthy();
  });

  it('completar las 10 preguntas acertando todas muestra "10/10"', () => {
    setup();
    start();
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByRole('button', { name: /first tone/i }));
      fireEvent.click(screen.getByRole('button', { name: /next question|view results/i }));
    }
    expect(screen.getByText('10/10')).toBeTruthy();
    expect(screen.getByText(/tone quiz completed/i)).toBeTruthy();
  });

  it('el botón atrás llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /back to tones/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
