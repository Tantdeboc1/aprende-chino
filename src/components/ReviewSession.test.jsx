// src/components/ReviewSession.test.jsx
// Sesión de repaso SRS: tope de tanda, reinyección de las falladas dentro de la
// misma sesión y control por teclado. Caza regresiones del tipo "fallar una
// tarjeta la manda a mañana sin haberla acertado nunca".
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@/i18n'; // el componente usa useTranslation
import ReviewSession from './ReviewSession.jsx';

// ProfileBadge tira de AuthContext y no aporta nada a este flujo.
vi.mock('@/components/ui/ProfileBadge.jsx', () => ({ default: () => null }));

const DAY_MS = 24 * 60 * 60 * 1000;

const card = (char, i) => ({ char, pinyin: `p${i}`, meaning: `m${i}`, lesson: 1, examples: [] });

/** Progreso con `chars` vencidos desde hace un día. */
function dueProgress(chars) {
  const __srs = {};
  chars.forEach(c => {
    __srs[c.char] = {
      interval: 1, easeFactor: 2.5, repetitions: 1,
      nextReview: Date.now() - DAY_MS, lastReviewed: Date.now() - DAY_MS,
    };
  });
  return { __srs };
}

function setup(chars) {
  const onProgressChange = vi.fn();
  render(
    <ReviewSession
      allCharacters={chars}
      progress={dueProgress(chars)}
      onProgressChange={onProgressChange}
      goBack={() => {}}
      speakChinese={() => {}}
    />
  );
  // Menú de modos: [volver, Pendientes, Palabras débiles]
  fireEvent.click(screen.getAllByRole('button')[1]);
  return { onProgressChange };
}

// Con la tarjeta volteada hay 1 botón de audio + los 4 de evaluación.
const ratingButtons = () => screen.getAllByRole('button').slice(-4);

beforeEach(() => localStorage.clear());

describe('ReviewSession', () => {
  it('limita la tanda a SESSION_LIMIT aunque haya muchas más vencidas', () => {
    const chars = Array.from({ length: 30 }, (_, i) => card(`字${i}`, i));
    setup(chars);
    expect(screen.getByText('1 / 20')).toBeTruthy();
  });

  it('fallar reinyecta la tarjeta en la misma sesión y penaliza el easeFactor', () => {
    const chars = [card('一', 1), card('二', 2)];
    const { onProgressChange } = setup(chars);
    expect(screen.getByText('1 / 2')).toBeTruthy();

    fireEvent.keyDown(window, { key: ' ' });        // voltear
    fireEvent.click(ratingButtons()[0]);            // "Otra vez"

    // La cola crece: la fallada vuelve más adelante en vez de irse a mañana
    expect(screen.getByText('2 / 3')).toBeTruthy();

    const updated = onProgressChange.mock.calls[0][0];
    // La cola se baraja: la fallada es la única cuyo easeFactor ha cambiado.
    const failed = Object.values(updated.__srs).find(d => d.easeFactor !== 2.5);
    expect(failed.easeFactor).toBeCloseTo(1.7, 5);  // 2.5 − 0.8
    expect(failed.nextReview - Date.now()).toBeLessThan(DAY_MS);
  });

  it('acertar avanza sin reinyectar', () => {
    const chars = [card('一', 1), card('二', 2)];
    setup(chars);
    fireEvent.keyDown(window, { key: ' ' });
    fireEvent.click(ratingButtons()[2]);            // "Bien"
    expect(screen.getByText('2 / 2')).toBeTruthy();
  });

  it('se puede repasar entero con el teclado (Espacio voltea, 1-4 puntúan)', () => {
    const chars = [card('一', 1), card('二', 2)];
    setup(chars);

    fireEvent.keyDown(window, { key: ' ' });
    expect(ratingButtons()).toHaveLength(4);
    fireEvent.keyDown(window, { key: '3' });        // Bien
    expect(screen.getByText('2 / 2')).toBeTruthy();

    fireEvent.keyDown(window, { key: 'Enter' });    // voltear la 2ª
    fireEvent.keyDown(window, { key: '4' });        // Fácil → fin de sesión
    expect(screen.queryByText('2 / 2')).toBeNull();
  });

  it('las teclas de puntuación no hacen nada con la tarjeta sin voltear', () => {
    const chars = [card('一', 1), card('二', 2)];
    const { onProgressChange } = setup(chars);
    fireEvent.keyDown(window, { key: '3' });
    expect(onProgressChange).not.toHaveBeenCalled();
    expect(screen.getByText('1 / 2')).toBeTruthy();
  });
});
