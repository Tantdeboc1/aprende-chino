import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';
import QuizCard from './QuizCard.jsx';

afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('story explanations', () => {
  it('keeps evidence visible until Continue and reports the original answer correctly after shuffling', () => {
    vi.useFakeTimers();
    const onAnswer = vi.fn();
    render(<QuizCard prompt="Who?" options={['东奥','马可']} correcta={0} onAnswer={onAnswer} explanation={{ kind: 'evidence', evidence: '他叫东奥。' }} />);
    fireEvent.click(screen.getByRole('button', { name: '马可' }));
    act(() => vi.advanceTimersByTime(10000));
    expect(onAnswer).not.toHaveBeenCalled();
    expect(screen.getByText('他叫东奥。')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(onAnswer).toHaveBeenCalledExactlyOnceWith(false);
  });
});
