import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@/i18n';
import AnswerCorrection from './AnswerCorrection.jsx';
import MistakeReview from './MistakeReview.jsx';

afterEach(cleanup);
const word = { char: '忙', pinyin: 'máng', meanings: { en: 'busy' }, examples: ['很忙', '不忙'] };

describe('brief corrections', () => {
  it('shows the solution and chosen answer without examples or a generic explanation', () => {
    render(<AnswerCorrection word={word} chosen="free" />);
    expect(screen.getByRole('status').textContent).toContain('忙 · máng · busy');
    expect(screen.getByText('Your answer: free')).toBeTruthy();
    expect(screen.queryByText('Why this answer')).toBeNull();
    expect(screen.queryByText('很忙')).toBeNull();
  });
  it('keeps vocabulary mistake review compact', () => {
    render(<MistakeReview items={[{ word, chosen: 'free' }]} />);
    expect(screen.getByText('Review your mistakes (1)')).toBeTruthy();
    expect(screen.getByRole('status').textContent).toContain('busy');
    expect(screen.queryByText('Why this answer')).toBeNull();
  });
});
