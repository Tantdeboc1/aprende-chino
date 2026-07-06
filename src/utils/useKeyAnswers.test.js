// src/utils/useKeyAnswers.test.js
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyAnswers } from './useKeyAnswers.js';

const press = (key, target = window) => {
  const e = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
  target.dispatchEvent(e);
  return e;
};

describe('useKeyAnswers', () => {
  it('las teclas 1..N seleccionan la opción (índice 0-based)', () => {
    const onSelect = vi.fn();
    renderHook(() => useKeyAnswers({ count: 4, onSelect }));
    press('1');
    press('3');
    expect(onSelect).toHaveBeenNthCalledWith(1, 0);
    expect(onSelect).toHaveBeenNthCalledWith(2, 2);
  });

  it('ignora teclas fuera de rango', () => {
    const onSelect = vi.fn();
    renderHook(() => useKeyAnswers({ count: 2, onSelect }));
    press('3');
    press('0');
    press('a');
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('Enter llama a onNext y previene el default (evita doble click)', () => {
    const onNext = vi.fn();
    renderHook(() => useKeyAnswers({ count: 0, onNext }));
    const e = press('Enter');
    expect(onNext).toHaveBeenCalledOnce();
    expect(e.defaultPrevented).toBe(true);
  });

  it('no interfiere al escribir en un input', () => {
    const onSelect = vi.fn();
    renderHook(() => useKeyAnswers({ count: 4, onSelect }));
    const input = document.createElement('input');
    document.body.appendChild(input);
    press('1', input);
    expect(onSelect).not.toHaveBeenCalled();
    input.remove();
  });

  it('se desactiva pasando callbacks null y limpia al desmontar', () => {
    const onSelect = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ sel }) => useKeyAnswers({ count: 4, onSelect: sel }),
      { initialProps: { sel: onSelect } },
    );
    rerender({ sel: null });
    press('1');
    expect(onSelect).not.toHaveBeenCalled();
    unmount();
    press('1');
    expect(onSelect).not.toHaveBeenCalled();
  });
});
