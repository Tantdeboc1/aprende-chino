// src/components/minigames/EchoSpeaking.test.jsx
// `shuffle` a identidad + `useTranslationPhrases` mockeado con una fixture de
// 6 frases (mismo tamaño que ROUNDS) para que pickRounds() no recorte nada y
// el orden quede predecible. `recognize`/`scorePronunciation` se mockean para
// controlar el resultado del intento sin un micrófono real.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

const PHRASES = Array.from({ length: 6 }, (_, i) => ({
  hanzi: `你好${i}`, pinyin: `nǐ hǎo ${i}`, lesson: 1,
  translations: { en: `Hello ${i}` },
}));
vi.mock('@/hooks/useTranslationPhrases.js', () => ({ useTranslationPhrases: () => PHRASES }));

const SpeechErrorCode = vi.hoisted(() => ({ NO_PERMISSION: 'no-permission', NO_SPEECH: 'no-speech', NETWORK: 'network', UNSUPPORTED: 'unsupported' }));
const recognizeMock = vi.hoisted(() => vi.fn());
vi.mock('@/utils/speechRecognition.js', () => ({
  recognize: recognizeMock,
  isSpeechRecognitionSupported: () => true,
  SpeechErrorCode,
}));

const scorePronunciationMock = vi.hoisted(() => vi.fn());
vi.mock('@/utils/pronunciationScore.js', () => ({ scorePronunciation: scorePronunciationMock }));

vi.mock('@/utils/tts-enhanced.js', () => ({ speakChineseEnhanced: vi.fn() }));

import EchoSpeaking from './EchoSpeaking.jsx';

function start() {
  render(<EchoSpeaking goBack={() => {}} selectedLesson={null} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
  act(() => { vi.advanceTimersByTime(400); });
}

const recordButton = () => screen.getByRole('button', { name: /^record$/i });

beforeEach(() => {
  vi.useFakeTimers();
  recognizeMock.mockReset();
  scorePronunciationMock.mockReset();
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('EchoSpeaking', () => {
  it('arranca la ronda 1 de 6 con el botón de grabar disponible', () => {
    start();
    expect(screen.getByText('1/6')).toBeTruthy();
    expect(recordButton()).toBeTruthy();
  });

  it('un intento bien puntuado revela la frase y el resultado', async () => {
    recognizeMock.mockResolvedValue({ transcript: '你好0' });
    scorePronunciationMock.mockReturnValue({
      score: 92, level: 'good', normRecognized: 'ni hao', charMatches: [true, true, true],
    });
    start();

    await act(async () => {
      fireEvent.click(recordButton());
      await vi.runOnlyPendingTimersAsync();
    });

    expect(screen.getAllByText('92').length).toBeGreaterThan(0);
    expect(screen.getByText((_, el) => el?.textContent === '你好0' && el.tagName === 'P')).toBeTruthy();
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy();
  });

  it('un error de reconocimiento (sin voz) muestra el mensaje correspondiente', async () => {
    recognizeMock.mockRejectedValue({ code: SpeechErrorCode.NO_SPEECH });
    start();

    await act(async () => {
      fireEvent.click(recordButton());
      await vi.runOnlyPendingTimersAsync();
    });

    expect(screen.getByText(/didn't hear/i)).toBeTruthy();
  });

  it('el botón atrás de la intro llama a goBack', () => {
    const goBack = vi.fn();
    render(<EchoSpeaking goBack={goBack} selectedLesson={null} />);
    fireEvent.click(screen.getByRole('button', { name: /back to skills/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
