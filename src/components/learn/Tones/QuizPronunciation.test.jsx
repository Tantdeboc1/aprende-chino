// src/components/learn/Tones/QuizPronunciation.test.jsx
// buildQuiz necesita varios valores DISTINTOS de Math.random() en el mismo
// tick para rellenar las 4 opciones únicas (pick() en bucle "hasta que no
// esté ya incluida") — fijarlo a un valor constante lo dejaría en bucle
// infinito. Se deja el random real: el flujo (arrancar → escuchar → responder
// → resultado) se prueba sin asumir qué pregunta concreta sale cada vez.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import '@/i18n';

const playAudioSmartMock = vi.hoisted(() => vi.fn().mockResolvedValue(true));
vi.mock('@/utils/audio.js', () => ({ playAudioSmart: playAudioSmartMock }));
vi.mock('../../../utils/audio', () => ({ playAudioSmart: playAudioSmartMock }));

import QuizPronunciation from './QuizPronunciation.jsx';

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), ...overrides };
  render(<QuizPronunciation {...props} />);
  return props;
}

const start = () => fireEvent.click(screen.getByRole('button', { name: /start quiz/i }));
/** Las 4 opciones son siempre los últimos 4 botones antes de responder. */
const options = () => screen.getAllByRole('button').slice(-4);

beforeEach(() => playAudioSmartMock.mockClear());
afterEach(() => cleanup());

describe('QuizPronunciation', () => {
  it('"Start Quiz" arranca la 1ª pregunta con 4 opciones', () => {
    setup();
    start();
    expect(screen.getByText(/1\/10/)).toBeTruthy();
    expect(options()).toHaveLength(4);
  });

  it('"Listen" intenta reproducir audio para el sonido objetivo', async () => {
    setup();
    start();
    fireEvent.click(screen.getByRole('button', { name: /^listen$/i }));
    await waitFor(() => expect(playAudioSmartMock).toHaveBeenCalled());
  });

  it('responder muestra el feedback y el botón para avanzar', () => {
    setup();
    start();
    const opts = options(); // capturado ANTES de responder (mismos nodos tras el re-render)
    fireEvent.click(opts[0]);
    expect(screen.getByRole('button', { name: /next question|view results/i })).toBeTruthy();
    // Tras responder, las opciones quedan deshabilitadas.
    expect(opts.every(b => b.disabled)).toBe(true);
  });

  it('completar las 10 preguntas llega a la pantalla de resultados con un marcador N/10', () => {
    setup();
    start();
    for (let i = 0; i < 10; i++) {
      fireEvent.click(options()[0]);
      fireEvent.click(screen.getByRole('button', { name: /next question|view results/i }));
    }
    expect(screen.getByText(/\d+\/10/)).toBeTruthy();
    expect(screen.getByText(/pronunciation quiz completed|completed/i)).toBeTruthy();
  });

  it('el botón atrás llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
