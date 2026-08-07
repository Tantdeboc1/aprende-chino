// src/utils/lessonFilter.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { loadLessonFilter, saveLessonFilter, useLessonFilter } from './lessonFilter.js';

beforeEach(() => sessionStorage.clear());

describe('loadLessonFilter / saveLessonFilter', () => {
  it('sin nada guardado, usa el fallback dado', () => {
    expect(loadLessonFilter(3)).toBe(3);
    expect(loadLessonFilter()).toBeNull();
  });

  it('guarda y recupera un número de lección', () => {
    saveLessonFilter(4);
    expect(loadLessonFilter()).toBe(4);
  });

  it('guarda y recupera "todas las lecciones" (null) de forma explícita', () => {
    saveLessonFilter(2);
    saveLessonFilter(null);
    expect(loadLessonFilter(99)).toBeNull(); // null explícito gana al fallback
  });

  it('valor corrupto en sessionStorage cae al fallback', () => {
    sessionStorage.setItem('minigamesLessonFilter', 'no-es-un-numero');
    expect(loadLessonFilter(5)).toBe(5);
  });
});

describe('useLessonFilter', () => {
  it('arranca con selectedLesson si no hay nada guardado, y persiste los cambios', () => {
    const { result } = renderHook(() => useLessonFilter(2));
    expect(result.current[0]).toBe(2);

    act(() => result.current[1](7));
    expect(result.current[0]).toBe(7);
    expect(loadLessonFilter()).toBe(7);
  });

  it('un montaje posterior recupera el filtro persistido, ignorando selectedLesson', () => {
    saveLessonFilter(6);
    const { result } = renderHook(() => useLessonFilter(2));
    expect(result.current[0]).toBe(6);
  });
});
