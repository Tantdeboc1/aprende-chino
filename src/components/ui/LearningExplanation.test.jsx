import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@/i18n';
import LearningExplanation from './LearningExplanation.jsx';
import feedbackText from '@/data/feedbackText.js';

afterEach(cleanup);

describe('learning feedback', () => {
  it('contrasts the selected word with the correct word and its example', () => {
    render(<LearningExplanation word={{ char: '你', pinyin: 'nǐ', meaning: 'you', examples: [{ zh: '你好', pinyin: 'nǐ hǎo', translation: { en: 'Hello' } }] }} chosenWord={{ char: '我', pinyin: 'wǒ', meaning: 'I' }} />);
    expect(screen.getByText(/nǐ.*you/)).toBeTruthy();
    expect(screen.getByText(/wǒ.*I/)).toBeTruthy();
    expect(screen.getByText('你好')).toBeTruthy();
    expect(screen.getByText('nǐ hǎo')).toBeTruthy();
    expect(screen.getByText('Hello')).toBeTruthy();
  });

  it('explains the difference between the correct and selected tones', () => {
    render(<LearningExplanation kind="sound" tone={2} chosenTone={3} />);
    expect(screen.getByText(/rises from mid to high/)).toBeTruthy();
    expect(screen.getByText(/Tone 3.*drops low/)).toBeTruthy();
  });

  it('has teaching copy in all six supported languages', () => {
    for (const entry of Object.values(feedbackText)) {
      for (const lang of ['es','en','fr','de','it','pt']) expect(entry[lang]).toBeTruthy();
    }
  });
});
