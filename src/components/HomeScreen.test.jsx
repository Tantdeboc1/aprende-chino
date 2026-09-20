// src/components/HomeScreen.test.jsx
// El chunk es/*.js de i18next carga de forma diferida: en jsdom solo EN está
// disponible de forma síncrona, así que las aserciones usan el texto inglés.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/context/AuthContext.jsx', () => ({
  useAuth: () => ({ mode: 'guest', user: null }),
}));

import HomeScreen from './HomeScreen.jsx';

const CHARS = [
  { char: '你', pinyin: 'nǐ', meaning: 'tú', lesson: 1, examples: [] },
  { char: '好', pinyin: 'hǎo', meaning: 'bueno', lesson: 1, examples: [] },
  { char: '再见', pinyin: 'zàijiàn', meaning: 'adiós', lesson: 2, examples: [] },
];

function setup(overrides = {}) {
  const props = {
    userName: 'Tester',
    progress: {},
    allCharacters: CHARS,
    onSelectLesson: vi.fn(),
    onSelectIntro: vi.fn(),
    onOpenProfile: vi.fn(),
    onOpenChinaMap: vi.fn(),
    ...overrides,
  };
  render(<HomeScreen {...props} />);
  return props;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => cleanup());

describe('HomeScreen', () => {
  it('saluda por el nombre y lista las lecciones con su progreso', () => {
    setup();
    expect(screen.getByText(/Tester/)).toBeTruthy();
    expect(screen.getAllByText(/lesson/i).length).toBeGreaterThan(0);
  });

  it('pulsar una tarjeta de lección llama a onSelectLesson con el número correcto', () => {
    const props = setup();
    // Sección "Lessons" abierta por defecto (SECTION_DEFAULTS.lessons=true).
    const lessonButtons = screen.getAllByRole('button').filter(b => /→$/.test(b.textContent));
    fireEvent.click(lessonButtons[0]);
    expect(props.onSelectLesson).toHaveBeenCalledWith(1);
  });

  it('la sección Basics empieza plegada; al abrirla aparece la tarjeta de introducción', () => {
    setup();
    // El toggle de sección tiene aria-expanded.
    const basicsToggle = screen.getAllByRole('button').find(b => b.getAttribute('aria-expanded') === 'false');
    expect(basicsToggle).toBeTruthy();

    fireEvent.click(basicsToggle);
    expect(basicsToggle.getAttribute('aria-expanded')).toBe('true');

    // Ahora debe haber una tarjeta extra con el icono "入" de introducción.
    expect(screen.getByText('入')).toBeTruthy();
  });

  it('pulsar el avatar llama a onOpenProfile', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /edit.*profile|profile/i }));
    expect(props.onOpenProfile).toHaveBeenCalledTimes(1);
  });

  it('Continuar abre la última lección guardada', () => {
    const props = setup({ lastLesson: 2 });
    fireEvent.click(screen.getByRole('button', { name: /continue where|continuar donde/i }));
    expect(props.onSelectLesson).toHaveBeenCalledWith(2);
  });

  it('sin onOpenChinaMap, la sección Cultura no se muestra', () => {
    setup({ onOpenChinaMap: undefined });
    expect(screen.queryByText(/explore china/i)).toBeNull();
  });

  it('el porcentaje "completado" refleja el progreso pasado', () => {
    // 1 de 2 palabras principales (no-suplementarias) de lesson 1 dominada.
    const progress = { lesson_1: { '你': { seen: true, mastered: true } } };
    setup({ progress });
    // totalWords = 3 (todas no-suplementarias), totalMastered = 1 → 33%.
    expect(screen.getByText('33%')).toBeTruthy();
  });
});
