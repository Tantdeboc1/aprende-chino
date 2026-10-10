import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { useScrollMemory } from './useScrollMemory.js';

beforeEach(() => {
  Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: 4000, writable: true, configurable: true });
  vi.spyOn(window, 'scrollTo').mockImplementation(({ top }) => { window.scrollY = top; });
});
afterEach(() => cleanup());

describe('navigation scroll memory', () => {
  it('opens an activity at the top and returns to the previous lesson position', () => {
    const { rerender } = renderHook(({ route }) => useScrollMemory(route), { initialProps: { route: 'lesson:3:practice' } });
    act(() => { window.scrollY = 680; window.dispatchEvent(new Event('scroll')); });
    rerender({ route: 'quiz' });
    expect(window.scrollY).toBe(0);
    rerender({ route: 'lesson:3:practice' });
    expect(window.scrollY).toBe(680);
  });

  it('waits for lazy content instead of overwriting the saved position with zero', async () => {
    const positions = new Map([['minigames', 1600]]);
    document.documentElement.scrollHeight = 800;
    renderHook(() => useScrollMemory('minigames', { positions }));
    act(() => window.dispatchEvent(new Event('scroll')));
    expect(positions.get('minigames')).toBe(1600);
    act(() => {
      document.documentElement.scrollHeight = 4000;
      document.body.appendChild(document.createElement('div'));
    });
    await waitFor(() => expect(window.scrollY).toBe(1600));
  });

  it('lets the user scroll while lazy content is still loading', async () => {
    const positions = new Map([['minigames', 1600]]);
    document.documentElement.scrollHeight = 800;
    renderHook(() => useScrollMemory('minigames', { positions }));
    act(() => {
      window.scrollY = 120;
      window.dispatchEvent(new Event('wheel'));
      document.documentElement.scrollHeight = 4000;
      document.body.appendChild(document.createElement('div'));
    });
    await act(async () => {});
    expect(window.scrollY).toBe(120);
    expect(positions.get('minigames')).toBe(120);
  });
});
