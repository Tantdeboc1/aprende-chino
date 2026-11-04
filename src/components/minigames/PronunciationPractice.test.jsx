// src/components/minigames/PronunciationPractice.test.jsx
// Hermano "con texto visible" de EchoSpeaking.test.jsx — misma estrategia de
// mocks (shuffle identidad, useTranslationPhrases, recognize/scorePronunciation).
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

import PronunciationPractice from './PronunciationPractice.jsx';

function start() {
  render(<PronunciationPractice goBack={() => {}} selectedLesson={null} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
}

const recordButton = () => screen.getByRole('button', { name: /^record$/i });

beforeEach(() => {
  vi.useFakeTimers();
  recognizeMock.mockReset();
  scorePronunciationMock.mockReset();
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('PronunciationPractice', () => {
  it('arranca la ronda 1 de 6 mostrando la frase a leer', () => {
    start();
    expect(screen.getByText('1/6')).toBeTruthy();
    expect(screen.getByText((_, el) => el?.textContent === '你好0' && el.tagName === 'P')).toBeTruthy();
  });

  it('un intento bien puntuado muestra el resultado y permite pasar', async () => {
    recognizeMock.mockResolvedValue({ transcript: '你好0' });
    scorePronunciationMock.mockReturnValue({
      score: 88, level: 'good', normRecognized: 'ni hao', charMatches: [true, true, true],
    });
    start();

    await act(async () => {
      fireEvent.click(recordButton());
      await vi.runOnlyPendingTimersAsync();
    });

    expect(screen.getAllByText('88').length).toBeGreaterThan(0);
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

  it('ofrece escuchar y repetir cuando se deniega el micrófono', async () => {
    recognizeMock.mockRejectedValue({ code: SpeechErrorCode.NO_PERMISSION });
    start();
    await act(async () => { fireEvent.click(recordButton()); await vi.runOnlyPendingTimersAsync(); });
    fireEvent.click(screen.getByRole('button', { name: /listen and repeat/i }));
    expect(screen.getByText(/does not record or score/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /^record$/i })).toBeNull();
  });

  it('un reintento sustituye la puntuación de la ronda y aclara sus límites', async () => {
    recognizeMock.mockResolvedValue({ transcript: '你好0' });
    scorePronunciationMock.mockReturnValueOnce({ score: 80, level: 'good', normRecognized: '你好0', charMatches: [true, true, true] })
      .mockReturnValueOnce({ score: 90, level: 'good', normRecognized: '你好0', charMatches: [true, true, true] });
    start();
    await act(async () => { fireEvent.click(recordButton()); await vi.runOnlyPendingTimersAsync(); });
    expect(screen.getByText(/does not assess tones/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /try again/i }));
    await act(async () => { fireEvent.click(recordButton()); await vi.runOnlyPendingTimersAsync(); });
    expect(screen.getByText('90')).toBeTruthy();
    expect(screen.queryByText('170')).toBeNull();
  });

  it('el botón atrás de la intro llama a goBack', () => {
    const goBack = vi.fn();
    render(<PronunciationPractice goBack={goBack} selectedLesson={null} />);
    fireEvent.click(screen.getByRole('button', { name: /back to practise/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
