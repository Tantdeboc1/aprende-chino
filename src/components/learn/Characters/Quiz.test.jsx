// src/components/learn/Characters/Quiz.test.jsx
// Smoke del flujo completo del quiz de caracteres: intro → responder (click y
// teclado) → avanzar. Caza regresiones tipo "el quiz no avanza de ronda".
//
// El segundo describe (más abajo) mockea `shuffle` a identidad: Quiz.jsx arma
// cada pregunta con `shuffle([...pickN(wrongPool,3), correct])`, así que con
// shuffle=identidad la respuesta correcta cae SIEMPRE en la última de las 4
// opciones — determinismo suficiente para comprobar que "acertar" y "fallar"
// distinguen de verdad la opción correcta, algo que el primer describe no
// verifica (solo comprueba que se notifica *algún* booleano).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n'; // los componentes usan useTranslation
import Quiz from './Quiz.jsx';

vi.mock('@/utils/arrayUtils.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, shuffle: (arr) => arr };
});

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

// `pickCycle` elige el protagonista con su PROPIO `shuffle` interno (mismo
// módulo, no pasa por la versión mockeada que ve Quiz.jsx desde fuera), así
// que sigue siendo real-aleatorio — no se puede asumir que sea CHARS[0]. Lo
// que sí es determinista es `buildQuestion`: arma las opciones con el
// `shuffle` que Quiz.jsx importa (ese sí mockeado a identidad), así que la
// correcta cae SIEMPRE en la última de las 4.
function currentProtagonist() {
  return CHARS.find(c => screen.queryByText(c.char));
}

describe('Quiz de caracteres — acierto/fallo determinista', () => {
  afterEach(() => cleanup());

  it('pulsar la opción correcta (última) suma acierto y notifica onTrackResult(char, true)', () => {
    const onTrackResult = vi.fn();
    render(<Quiz goBack={() => {}} characters={CHARS} onTrackResult={onTrackResult} />);
    startQuiz();
    const protagonist = currentProtagonist();

    fireEvent.click(optionButtons()[3]);
    expect(onTrackResult).toHaveBeenCalledWith(protagonist, true);
  });

  it('pulsar una opción incorrecta notifica onTrackResult(char, false)', () => {
    const onTrackResult = vi.fn();
    render(<Quiz goBack={() => {}} characters={CHARS} onTrackResult={onTrackResult} />);
    startQuiz();
    const protagonist = currentProtagonist();

    fireEvent.click(optionButtons()[0]); // no es la correcta
    expect(onTrackResult).toHaveBeenCalledWith(protagonist, false);
  });

  it('completar las 10 preguntas acertando todas muestra el marcador final 10/10', () => {
    render(<Quiz goBack={() => {}} characters={CHARS} />);
    startQuiz();
    for (let i = 0; i < 10; i++) {
      fireEvent.click(optionButtons()[3]); // siempre la correcta
      fireEvent.click(screen.getAllByRole('button').at(-1)); // Next / Ver resultados
    }
    expect(screen.getByText('10/10')).toBeTruthy();
  });
});
