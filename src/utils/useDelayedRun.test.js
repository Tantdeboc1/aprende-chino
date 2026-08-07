// src/utils/useDelayedRun.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDelayedRun } from './useDelayedRun.js';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useDelayedRun', () => {
  it('ejecuta el callback tras el delay indicado', () => {
    const { result } = renderHook(() => useDelayedRun());
    const cb = vi.fn();
    act(() => result.current(cb, 500));
    expect(cb).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(500); });
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('una segunda llamada cancela la anterior en vez de acumularse', () => {
    const { result } = renderHook(() => useDelayedRun());
    const first = vi.fn();
    const second = vi.fn();
    act(() => result.current(first, 500));
    act(() => { vi.advanceTimersByTime(200); });
    act(() => result.current(second, 500)); // reemplaza al primero, sin haber disparado

    act(() => { vi.advanceTimersByTime(500); });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('cancela el timeout pendiente al desmontar (no dispara tras unmount)', () => {
    const { result, unmount } = renderHook(() => useDelayedRun());
    const cb = vi.fn();
    act(() => result.current(cb, 500));
    unmount();
    act(() => { vi.advanceTimersByTime(1000); });
    expect(cb).not.toHaveBeenCalled();
  });
});
