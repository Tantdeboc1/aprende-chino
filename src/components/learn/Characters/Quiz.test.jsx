// src/components/learn/Characters/Quiz.test.jsx
// Smoke del flujo completo del quiz de caracteres: intro → responder (click y
// teclado) → avanzar. Caza regresiones tipo "el quiz no avanza de ronda".
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@/i18n'; // los componentes usan useTranslation
import Quiz from './Quiz.jsx';

const CHARS = [
  { char: '一', pinyin: 'yī', meaning: 'uno', lesson: 1, examples: [] },
  { char: '二', pinyin: 'èr', meaning: 'dos', lesson: 1, examples: [] },
  { char: '三', pinyin: 'sān', meaning: 'tres', lesson: 1, examples: [] },
  { char: '四', pinyin: 'sì', meaning: 'cuatro', lesson: 1, examples: [] },
  { char: '五', pinyin: 'wǔ', meaning: 'cinco', lesson: 1, examples: [] },
];
const MEANINGS = CHARS.map(c => c.meaning);

// Arranca el quiz desde la pantalla de instrucciones.
function startQuiz() {
  // el botón de empezar es el último botón grande de la intro
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[buttons.length - 1]);
}

const optionButtons = () =>
  screen.getAllByRole('button').filter(b => MEANINGS.includes(b.textContent));

beforeEach(() => localStorage.clear());

describe('Quiz de caracteres', () => {
  it('muestra la intro y arranca con 10 preguntas', () => {
    render(<Quiz goBack={() => {}} characters={CHARS} />);
    startQuiz();
    expect(screen.getByText(/1\/10/)).toBeTruthy();
    expect(optionButtons()).toHaveLength(4);
  });

  it('responder con click da feedback, notifica el resultado y avanza', () => {
    const onTrackResult = vi.fn();
    render(<Quiz goBack={() => {}} characters={CHARS} onTrackResult={onTrackResult} />);
    startQuiz();

    fireEvent.click(optionButtons()[0]);
    // tras responder, las opciones quedan deshabilitadas y se notifica
    expect(optionButtons().every(b => b.disabled)).toBe(true);
    expect(onTrackResult).toHaveBeenCalledOnce();
    const [charArg, okArg] = onTrackResult.mock.calls[0];
    expect(CHARS.some(c => c.char === charArg.char)).toBe(true);
    expect(typeof okArg).toBe('boolean');

    // el botón "siguiente" aparece y avanza a la pregunta 2
    const next = screen.getAllByRole('button').at(-1);
    fireEvent.click(next);
    expect(screen.getByText(/2\/10/)).toBeTruthy();
  });

  it('se puede responder y avanzar con el teclado (1-4 y Enter)', () => {
    render(<Quiz goBack={() => {}} characters={CHARS} />);
    startQuiz();

    fireEvent.keyDown(window, { key: '2' });
    expect(optionButtons().every(b => b.disabled)).toBe(true);

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByText(/2\/10/)).toBeTruthy();
  });

  it('sin caracteres suficientes no crashea', () => {
    render(<Quiz goBack={() => {}} characters={[]} />);
    startQuiz(); // initQuiz no hace nada con <4 chars → mensaje de vacío
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });
});
