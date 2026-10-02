import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@/i18n';
import LearningExplanation from './LearningExplanation.jsx';
import feedbackText from '@/data/feedbackText.js';

afterEach(cleanup);

describe('learning feedback', () => {
  it('does not add a teaching panel to vocabulary', () => {
    render(<LearningExplanation word={{ char: '你', pinyin: 'nǐ', meaning: 'you', examples: [{ zh: '你好', pinyin: 'nǐ hǎo', translation: { en: 'Hello' } }] }} chosenWord={{ char: '我', pinyin: 'wǒ', meaning: 'I' }} />);
    expect(screen.queryByText('Why this answer')).toBeNull();
    expect(screen.queryByText('你好')).toBeNull();
  });

  it('explains the difference between the correct and selected tones', () => {
    render(<LearningExplanation kind="sound" tone={2} chosenTone={3} />);
    expect(screen.getByText(/rises from mid to high/)).toBeTruthy();
    expect(screen.getByText(/Tone 3.*drops low/)).toBeTruthy();
  });

  it('does not explain an accurately identified tone', () => {
    render(<LearningExplanation kind="sound" tone={2} chosenTone={2} />);
    expect(screen.queryByText('Why this answer')).toBeNull();
  });

  it('has teaching copy in all six supported languages', () => {
    for (const entry of Object.values(feedbackText)) {
      for (const lang of ['es','en','fr','de','it','pt']) expect(entry[lang]).toBeTruthy();
    }
  });
});
