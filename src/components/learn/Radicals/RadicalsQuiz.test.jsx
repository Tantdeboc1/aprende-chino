// src/components/learn/Radicals/RadicalsQuiz.test.jsx
// Este quiz elige la respuesta correcta con Math.random() directo (no con el
// `shuffle` de arrayUtils.js) — se mockean AMBOS a un valor fijo: Math.random
// siempre 0 (→ Math.floor(0*n)=0, primer elemento del array disponible en
// cada paso) y shuffle a identidad, así la correcta cae siempre en options[0].
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import RadicalsQuiz from './RadicalsQuiz.jsx';

const RADICALS = [
  { radical: '氵', examples: ['河'] },
  { radical: '亻', examples: ['你'] },
  { radical: '木', examples: ['林'] },
  { radical: '女', examples: ['好'] },
  { radical: '口', examples: ['吃'] },
  { radical: '心', examples: ['忙'] },
];

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), radicals: RADICALS, ...overrides };
  render(<RadicalsQuiz {...props} />);
  return props;
}

const options = () => screen.getAllByRole('button').slice(-4);

beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('RadicalsQuiz', () => {
  it('pantalla de instrucciones: "Start Quiz" arranca la 1ª pregunta', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));
    expect(screen.getByText('1/10')).toBeTruthy();
    expect(options()).toHaveLength(4);
  });

  it('acertar (primera opción, determinista) suma punto', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));
    fireEvent.click(options()[0]);
    fireEvent.click(screen.getByRole('button', { name: /next question/i }));
    expect(screen.getByText('2/10')).toBeTruthy();
  });

  it('completar las 10 preguntas acertando todas muestra "10/10"', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));
    for (let i = 0; i < 10; i++) {
      fireEvent.click(options()[0]);
      const btn = screen.getByRole('button', { name: /next question|view results/i });
      fireEvent.click(btn);
    }
    expect(screen.getByText('10/10')).toBeTruthy();
    expect(screen.getByText(/quiz completed/i)).toBeTruthy();
  });

  it('"Retry" desde resultados reinicia el quiz desde la pregunta 1', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));
    for (let i = 0; i < 10; i++) {
      fireEvent.click(options()[0]);
      fireEvent.click(screen.getByRole('button', { name: /next question|view results/i }));
    }
    fireEvent.click(screen.getByRole('button', { name: /^retry$/i }));
    expect(screen.getByText('1/10')).toBeTruthy();
  });

  it('el botón atrás llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /back to radicals/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
