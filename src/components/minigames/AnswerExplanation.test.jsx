import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@/i18n';
import AnswerExplanation from './AnswerExplanation.jsx';

afterEach(cleanup);
const item = { sentence: '你___吗？', answer: '好', lesson: 1 };

describe('grammar explanations', () => {
  it('shows the rule only after a mistake', () => {
    const { rerender } = render(<AnswerExplanation item={item} />);
    expect(screen.queryByText('Why this answer')).toBeNull();
    rerender(<AnswerExplanation item={item} incorrect />);
    expect(screen.getByText('Why this answer')).toBeTruthy();
    expect(screen.getByText(/The particle 吗/)).toBeTruthy();
  });
});
