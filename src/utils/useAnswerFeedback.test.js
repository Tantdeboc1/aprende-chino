// src/utils/useAnswerFeedback.test.js
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const hapticSuccessMock = vi.hoisted(() => vi.fn());
const hapticErrorMock = vi.hoisted(() => vi.fn());
vi.mock('./haptic.js', () => ({ hapticSuccess: hapticSuccessMock, hapticError: hapticErrorMock }));

import { useAnswerFeedback } from './useAnswerFeedback.js';

afterEach(() => vi.clearAllMocks());

describe('useAnswerFeedback', () => {
  it('arranca sin feedback, sin selección y contadores a 0', () => {
    const { result } = renderHook(() => useAnswerFeedback());
    expect(result.current.feedback).toBeNull();
    expect(result.current.selected).toBeNull();
    expect(result.current.correctCount).toBe(0);
    expect(result.current.wrongCount).toBe(0);
  });

  it('answer(choice, true) marca feedback correcto, suma acierto y vibra éxito', () => {
    const { result } = renderHook(() => useAnswerFeedback());
    act(() => result.current.answer('好', true));
    expect(result.current.feedback).toBe('correct');
    expect(result.current.selected).toBe('好');
    expect(result.current.correctCount).toBe(1);
    expect(result.current.wrongCount).toBe(0);
    expect(hapticSuccessMock).toHaveBeenCalledTimes(1);
    expect(hapticErrorMock).not.toHaveBeenCalled();
  });

  it('answer(choice, false) marca feedback incorrecto, suma fallo y vibra error', () => {
    const { result } = renderHook(() => useAnswerFeedback());
    act(() => result.current.answer('大', false));
    expect(result.current.feedback).toBe('incorrect');
    expect(result.current.wrongCount).toBe(1);
    expect(result.current.correctCount).toBe(0);
    expect(hapticErrorMock).toHaveBeenCalledTimes(1);
  });

  it('nextQuestion() limpia feedback y selección sin tocar los contadores', () => {
    const { result } = renderHook(() => useAnswerFeedback());
    act(() => result.current.answer('好', true));
    act(() => result.current.nextQuestion());
    expect(result.current.feedback).toBeNull();
    expect(result.current.selected).toBeNull();
    expect(result.current.correctCount).toBe(1); // se conserva
  });

  it('resetCounts() pone los contadores a 0', () => {
    const { result } = renderHook(() => useAnswerFeedback());
    act(() => result.current.answer('好', true));
    act(() => result.current.answer('大', false));
    act(() => result.current.resetCounts());
    expect(result.current.correctCount).toBe(0);
    expect(result.current.wrongCount).toBe(0);
  });
});
