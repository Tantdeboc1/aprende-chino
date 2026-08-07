// src/components/minigames/ReadingComprehension.test.jsx
// Camino dorado: selector de historia → lectura → elegir "Test de preguntas"
// → responder → resultados. `Math.random` se fija a 0: con ese valor, el
// Fisher-Yates de TestExercise deja la opción de índice 0 siempre en la
// última posición (D) — por eso el test busca la opción por su TEXTO
// ("Yes", la respuesta correcta de la fixture) y no por posición.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

const STORY = vi.hoisted(() => ({
  id: 'story1',
  titulo: '小猫',
  tituloTr: { en: 'Little Cat' },
  tema: 1,
  hanzi: '猫很可爱。',
  pinyin: "māo hěn kě'ài.",
  traduccion: { en: 'The cat is cute.' },
  preguntas: [{
    pregunta: { en: 'Is the cat cute?' },
    opciones: [{ en: 'Yes' }, { en: 'No' }, { en: 'Maybe' }, { en: 'Unknown' }],
    correcta: 0,
  }],
  vf: [],
  cloze: [],
}));

vi.mock('@/utils/loadContent.js', () => ({ loadReadingStories: vi.fn().mockResolvedValue([STORY]) }));
vi.mock('@/utils/readingProgress.js', () => ({
  loadReadingProgress: () => ({}),
  recordReadingResult: vi.fn(),
}));
vi.mock('@/utils/tts-enhanced.js', () => ({ cancelSpeak: vi.fn() }));
// GameResults anima los contadores con requestAnimationFrame (useCountUp);
// se mockea para que el valor final esté disponible de inmediato en el test.
vi.mock('@/hooks/useCountUp.js', () => ({ useCountUp: (target) => ({ value: Number(target) || 0, done: true }) }));

import ReadingComprehension from './ReadingComprehension.jsx';

beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({
    matches: false, addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
  }));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

async function playThroughToTest() {
  render(<ReadingComprehension goBack={() => {}} speak={vi.fn()} characters={[]} />);
  fireEvent.click(await screen.findByText('小猫'));
  fireEvent.click(screen.getByRole('button', { name: /answer questions/i }));
  fireEvent.click(screen.getByRole('button', { name: /quiz questions/i }));
}

describe('ReadingComprehension', () => {
  it('elegir una historia lleva a la pantalla de lectura con su texto', async () => {
    render(<ReadingComprehension goBack={() => {}} speak={vi.fn()} characters={[]} />);
    fireEvent.click(await screen.findByText('小猫'));
    expect(screen.getByText((_, el) => el?.textContent === '猫很可爱。' && el.tagName === 'P')).toBeTruthy();
    expect(screen.getByRole('button', { name: /answer questions/i })).toBeTruthy();
  });

  it('el test de preguntas: responder bien lleva a resultados 1/1', async () => {
    await playThroughToTest();
    expect(screen.getByText('Is the cat cute?')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /yes/i }));
    expect(screen.getByText('Correct!')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /see results/i }));
    expect(screen.getByText('Correct').previousSibling.textContent).toBe('1');
  });

  it('responder mal muestra la respuesta correcta', async () => {
    await playThroughToTest();
    fireEvent.click(screen.getByRole('button', { name: /no$/i }));
    expect(screen.getByText('Incorrect')).toBeTruthy();
  });

  it('el botón atrás del selector llama a goBack', async () => {
    const goBack = vi.fn();
    render(<ReadingComprehension goBack={goBack} speak={vi.fn()} characters={[]} />);
    await screen.findByText('小猫');
    fireEvent.click(screen.getByRole('button', { name: /skills/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
