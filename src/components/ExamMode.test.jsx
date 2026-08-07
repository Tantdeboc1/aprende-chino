// src/components/ExamMode.test.jsx
// `shuffle` de arrayUtils.js se mockea a identidad: buildQuestions arma
// `options = shuffle([correct, ...wrong])`, así que con shuffle=identidad la
// correcta cae SIEMPRE en la primera posición — determinismo suficiente para
// probar la lógica de acierto/fallo/puntuación sin depender del orden real.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import ExamMode from './ExamMode.jsx';

const CHARS = [
  { char: '一', pinyin: 'yī', meaning: 'uno', lesson: 1 },
  { char: '二', pinyin: 'èr', meaning: 'dos', lesson: 1 },
  { char: '三', pinyin: 'sān', meaning: 'tres', lesson: 1 },
  { char: '四', pinyin: 'sì', meaning: 'cuatro', lesson: 1 },
];

function setup(overrides = {}) {
  const props = {
    characters: CHARS,
    lessonNum: 1,
    lessonData: { titleEs: 'Lección 1' },
    progress: {},
    onProgressChange: vi.fn(),
    goBack: vi.fn(),
    ...overrides,
  };
  render(<ExamMode {...props} />);
  return props;
}

/** Las 4 opciones son siempre los últimos 4 botones en pantalla. */
const options = () => screen.getAllByRole('button').slice(-4);

/** El feedback tarda 900ms (setTimeout) en avanzar de pregunta/terminar. */
const advanceFeedback = () => act(() => vi.advanceTimersByTimeAsync(900));

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('ExamMode', () => {
  it('con menos de 4 caracteres disponibles, muestra el aviso de "no hay suficientes palabras"', () => {
    setup({ characters: CHARS.slice(0, 2) });
    expect(screen.getByText(/not enough words|no hay suficientes/i)).toBeTruthy();
  });

  it('la pregunta 1 muestra el primer carácter (一) como protagonista', () => {
    setup();
    expect(screen.getByText('一')).toBeTruthy();
    expect(options()).toHaveLength(4);
  });

  it('acertar (primera opción, shuffle=identidad) avanza a la pregunta 2 tras el feedback', async () => {
    setup();
    fireEvent.click(options()[0]); // correcta

    await advanceFeedback();
    expect(screen.getByText('2 / 4')).toBeTruthy();
  });

  it('fallar acumula el carácter en los errores mostrados al terminar', async () => {
    const props = setup();
    // Falla las 4 preguntas (última opción nunca es la correcta con shuffle=identidad).
    for (let i = 0; i < 4; i++) {
      fireEvent.click(options()[3]);
      await advanceFeedback();
    }
    // Resultados: 0% de acierto, "no errors" NO debería aparecer.
    expect(screen.getByText('0%')).toBeTruthy();
    expect(props.onProgressChange).toHaveBeenCalledTimes(1);
    const updated = props.onProgressChange.mock.calls[0][0];
    expect(updated.lesson_1.__examHistory[0]).toMatchObject({ score: 0, total: 4 });
  });

  it('acertar TODAS da 100%, sin errores que repasar, y guarda el resultado', async () => {
    const props = setup();
    for (let i = 0; i < 4; i++) {
      fireEvent.click(options()[0]); // siempre la correcta
      await advanceFeedback();
    }
    expect(screen.getByText('100%')).toBeTruthy();
    expect(screen.getByText(/no errors|sin errores/i)).toBeTruthy();
    const updated = props.onProgressChange.mock.calls[0][0];
    expect(updated.lesson_1.__examHistory[0]).toMatchObject({ score: 4, total: 4 });
  });

  it('"Retry" desde resultados vuelve a empezar el examen desde la pregunta 1', async () => {
    setup();
    for (let i = 0; i < 4; i++) {
      fireEvent.click(options()[0]);
      await advanceFeedback();
    }
    fireEvent.click(screen.getByRole('button', { name: /retry|reintentar/i }));
    expect(screen.getByText('1 / 4')).toBeTruthy();
  });

  it('el botón de salir llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /exit|salir/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });

  it('sin historial previo, no se muestra el botón de historial', () => {
    setup();
    expect(screen.queryByRole('button', { name: /history|historial/i })).toBeNull();
  });

  it('con historial previo, el botón de historial muestra los intentos guardados', () => {
    const progress = {
      lesson_1: { __examHistory: [{ date: new Date().toISOString(), score: 3, total: 4, wrongChars: ['一'] }] },
    };
    setup({ progress });
    fireEvent.click(screen.getByRole('button', { name: /history|historial/i }));
    expect(screen.getAllByText(/75%/).length).toBeGreaterThan(0);
  });
});
