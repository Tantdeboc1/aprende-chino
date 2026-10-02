import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';
import QuizCard from './QuizCard.jsx';

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('story corrections', () => {
  it('shows the solution without a teaching panel and reports the answer correctly after shuffling', () => {
    vi.useFakeTimers();
    const onAnswer = vi.fn();
    render(<QuizCard prompt="Who?" options={['东奥','马可']} correcta={0} onAnswer={onAnswer} explanation={{ kind: 'evidence', evidence: '他叫东奥。' }} />);
    fireEvent.click(screen.getByRole('button', { name: '马可' }));
    act(() => vi.advanceTimersByTime(10000));
    expect(onAnswer).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toContain('Correct answer: 东奥');
    expect(screen.queryByText('Why this answer')).toBeNull();
    expect(screen.queryByText('他叫东奥。')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onAnswer).toHaveBeenCalledExactlyOnceWith(false);
  });
  it('only confirms a correct answer without adding a correction', () => {
    const onAnswer = vi.fn();
    render(<QuizCard prompt="Who?" options={['东奥','马可']} correcta={0} onAnswer={onAnswer} />);
    fireEvent.click(screen.getByRole('button', { name: '东奥' }));
    expect(screen.queryByRole('status')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onAnswer).toHaveBeenCalledExactlyOnceWith(true);
  });
});
