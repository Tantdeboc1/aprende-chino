// src/components/LevelExam.test.jsx
// `shuffle` de arrayUtils.js se mockea a identidad: buildExam arma
// `opts = shuffle([correct, ...distractors])`, así que con shuffle=identidad
// la correcta cae SIEMPRE primera — determinismo suficiente para probar
// desbloqueo por dominio, puntuación y aprobado/reprobado.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));
// El confeti solo adorna el aprobado. jsdom no ofrece un canvas 2D real;
// esta prueba verifica puntuación y guardado, no el efecto visual.
vi.mock('@/components/ui/ConfettiCelebration.jsx', () => ({ default: () => null }));

import LevelExam from './LevelExam.jsx';

const CHARS = [
  { char: '一', pinyin: 'yī', meaning: 'uno', lesson: 1 },
  { char: '二', pinyin: 'èr', meaning: 'dos', lesson: 1 },
  { char: '三', pinyin: 'sān', meaning: 'tres', lesson: 1 },
  { char: '四', pinyin: 'sì', meaning: 'cuatro', lesson: 1 },
];

// Progreso con TODO dominado → 100% mastery, examen desbloqueado.
const FULL_MASTERY = {
  lesson_1: Object.fromEntries(CHARS.map(c => [c.char, { mastered: true }])),
};

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), allCharacters: CHARS, progress: FULL_MASTERY, ...overrides };
  render(<LevelExam {...props} />);
  return props;
}

/** Las opciones de la pregunta actual son los últimos N botones (4 caracteres → 4 opciones). */
const options = () => screen.getAllByRole('button').slice(-4);
const advance = (ms) => act(() => vi.advanceTimersByTimeAsync(ms));

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
  window.matchMedia = window.matchMedia || (() => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('LevelExam', () => {
  it('sin dominar el % necesario, el examen aparece bloqueado', () => {
    setup({ progress: {} }); // 0% de dominio
    expect(screen.getByText(/locked|bloqueado/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /start exam|empezar examen/i })).toBeNull();
  });

  it('con el dominio suficiente, el examen se puede empezar', () => {
    setup();
    expect(screen.getByRole('button', { name: /start exam|empezar examen/i })).toBeTruthy();
  });

  it('acertar todas las preguntas aprueba y muestra el % final', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start exam|empezar examen/i }));

    for (let i = 0; i < 4; i++) {
      fireEvent.click(options()[0]); // shuffle=identidad → siempre la correcta
      await advance(650);
    }
    expect(screen.getByText('100%')).toBeTruthy();
    expect(screen.getByText(/passed|superado/i)).toBeTruthy();

    const saved = JSON.parse(localStorage.getItem('aprende-chino-level-exam-v1'));
    expect(saved.passed).toBe(true);
  });

  it('fallar todas las preguntas suspende', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start exam|empezar examen/i }));

    for (let i = 0; i < 4; i++) {
      fireEvent.click(options()[3]); // no es la correcta
      await advance(650);
    }
    expect(screen.getByText('0%')).toBeTruthy();
    expect(screen.getByText(/not yet|aún no/i)).toBeTruthy();
  });

  it('agotar el tiempo (5 min) termina el examen aunque queden preguntas', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /start exam|empezar examen/i }));
    await advance(300_000);
    expect(screen.getByText(/not yet|aún no|passed|superado/i)).toBeTruthy();
  });

  it('el botón atrás en la pantalla bloqueada llama a goBack', () => {
    const props = setup({ progress: {} });
    fireEvent.click(screen.getByRole('button', { name: /back|volver/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
