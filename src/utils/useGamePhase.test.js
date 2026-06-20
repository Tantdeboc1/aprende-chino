// src/utils/useGamePhase.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamePhase, initialGamePhase, GAME_PHASE } from './useGamePhase.js';
import { hideIntro, setIntrosEnabled } from './gameIntroPrefs.js';

beforeEach(() => localStorage.clear());

describe('initialGamePhase', () => {
  it('arranca en intro cuando la explicación debe mostrarse', () => {
    expect(initialGamePhase('demo')).toBe(GAME_PHASE.INTRO);
  });

  it('salta a playing cuando el juego está oculto y autoSkip=true', () => {
    hideIntro('demo');
    expect(initialGamePhase('demo')).toBe(GAME_PHASE.PLAYING);
  });

  it('salta a playing cuando todas las intros están desactivadas', () => {
    setIntrosEnabled(false);
    expect(initialGamePhase('demo')).toBe(GAME_PHASE.PLAYING);
  });

  it('respeta autoSkip=false aunque la intro esté oculta', () => {
    hideIntro('demo');
    expect(initialGamePhase('demo', false)).toBe(GAME_PHASE.INTRO);
  });
});

describe('useGamePhase', () => {
  it('expone flags coherentes con la fase inicial (intro)', () => {
    const { result } = renderHook(() => useGamePhase('demo'));
    expect(result.current.phase).toBe(GAME_PHASE.INTRO);
    expect(result.current.isIntro).toBe(true);
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.isFinished).toBe(false);
  });

  it('start → playing, finish → finished, restart → playing', () => {
    const { result } = renderHook(() => useGamePhase('demo'));

    act(() => result.current.start());
    expect(result.current.isPlaying).toBe(true);

    act(() => result.current.finish());
    expect(result.current.isFinished).toBe(true);

    act(() => result.current.restart());
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.isFinished).toBe(false);
  });

  it('arranca directamente en playing si la intro está oculta', () => {
    hideIntro('demo');
    const { result } = renderHook(() => useGamePhase('demo'));
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.isIntro).toBe(false);
  });

  it('con autoSkip=false arranca en intro aunque esté oculta', () => {
    hideIntro('demo');
    const { result } = renderHook(() => useGamePhase('demo', { autoSkip: false }));
    expect(result.current.isIntro).toBe(true);
  });

  it('las acciones son estables entre renders (identidad referencial)', () => {
    const { result, rerender } = renderHook(() => useGamePhase('demo'));
    const first = result.current.start;
    rerender();
    expect(result.current.start).toBe(first);
  });
});
