import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createElement } from 'react';
import '@/i18n';

const speak = vi.hoisted(() => vi.fn());
vi.mock('@/utils/tts-enhanced.js', () => ({ speakChineseEnhanced: speak }));
vi.mock('@/utils/speechRecognition.js', () => ({ recognize: vi.fn(), isSpeechRecognitionSupported: () => false, SpeechErrorCode: {} }));
const phrases = [
  { hanzi:'你好', pinyin:'nǐ hǎo', lesson:1, translations:{ en:'Hello' } },
  { hanzi:'谢谢', pinyin:'xièxie', lesson:1, translations:{ en:'Thank you' } },
];
vi.mock('@/hooks/useTranslationPhrases.js', () => ({ useTranslationPhrases: () => phrases }));

import PronunciationPractice from './PronunciationPractice.jsx';
import EchoSpeaking from './EchoSpeaking.jsx';

afterEach(() => { cleanup(); speak.mockClear(); });

describe.each([['pronunciation', PronunciationPractice], ['echo', EchoSpeaking]])('%s without speech recognition', (_, Component) => {
  it('offers listening and repeating without recording or a score', () => {
    render(createElement(Component, { goBack: vi.fn(), selectedLesson: null }));
    fireEvent.click(screen.getByRole('button', { name:/listen and repeat/i }));
    expect(screen.getByText(/does not record or score/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name:/record/i })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name:/listen to sentence/i }));
    expect(speak).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name:/next/i }));
    expect(screen.getByText('2 / 2')).toBeTruthy();
  });
});
