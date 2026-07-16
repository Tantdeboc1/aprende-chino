// src/utils/useCountdown.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './useCountdown.js';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

function render(initial, options) {
  return renderHook(
    ({ running, onExpire }) => useCountdown(initial, { running, onExpire }),
    { initialProps: options },
  );
}

describe('useCountdown', () => {
  it('descuenta un segundo por tick mientras running=true', () => {
    const { result } = render(10, { running: true });
    act(() => vi.advanceTimersByTime(3000));
    expect(result.current.timeLeft).toBe(7);
    expect(result.current.timeLeftRef.current).toBe(7);
  });

  it('no corre con running=false', () => {
    const { result } = render(10, { running: false });
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.timeLeft).toBe(10);
  });

  it('penalize resta y nunca baja de 0', () => {
    const { result } = render(10, { running: true });
    act(() => result.current.penalize(4));
    expect(result.current.timeLeft).toBe(6);
    act(() => result.current.penalize(100));
    expect(result.current.timeLeft).toBe(0);
  });

  it('llama a onExpire al llegar a 0 por tick', () => {
    const onExpire = vi.fn();
    const { result } = render(2, { running: true, onExpire });
    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.timeLeft).toBe(0);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('llama a onExpire si una penalización agota el tiempo', () => {
    const onExpire = vi.fn();
    const { result } = render(5, { running: true, onExpire });
    act(() => result.current.penalize(5));
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('onExpire ve el render más reciente (sin closure obsoleto)', () => {
    // Simula el patrón de LevelExam: onExpire captura estado del componente.
    let seen = null;
    const { result, rerender } = render(1, { running: true, onExpire: () => { seen = 'viejo'; } });
    rerender({ running: true, onExpire: () => { seen = 'nuevo'; } });
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.timeLeft).toBe(0);
    expect(seen).toBe('nuevo');
  });

  it('reset devuelve el reloj a la duración inicial (nueva partida)', () => {
    const onExpire = vi.fn();
    const { result, rerender } = render(3, { running: true, onExpire });
    act(() => vi.advanceTimersByTime(3000));
    expect(onExpire).toHaveBeenCalledTimes(1);

    // El juego paró (running=false), reset + running=true = nueva partida.
    rerender({ running: false, onExpire });
    act(() => result.current.reset());
    rerender({ running: true, onExpire });
    expect(result.current.timeLeft).toBe(3);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.timeLeft).toBe(2);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('reset y running en el mismo commit no disparan onExpire espurio', () => {
    // Reproduce "volver a jugar": timeLeft quedó a 0 de la partida anterior
    // y el componente hace reset() + start() en el mismo handler.
    const onExpire = vi.fn();
    const { result, rerender } = render(2, { running: true, onExpire });
    act(() => vi.advanceTimersByTime(2000));
    expect(onExpire).toHaveBeenCalledTimes(1);
    rerender({ running: false, onExpire });

    act(() => {
      result.current.reset();
      rerender({ running: true, onExpire });
    });
    expect(result.current.timeLeft).toBe(2);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });
});
