// src/components/LessonDetail.test.jsx
// El chunk es/*.js de i18next carga de forma diferida: en jsdom solo EN está
// disponible de forma síncrona, así que las aserciones usan el texto inglés.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import LessonDetail from './LessonDetail.jsx';

const WORDS = [
  { char: '你', pinyin: 'nǐ', pinyinNumeric: 'ni3', meaning: 'tú', lesson: 1, type: 'Pron.', examples: ['你好'] },
  { char: '好', pinyin: 'hǎo', pinyinNumeric: 'hao3', meaning: 'bueno', lesson: 1, type: 'Adj.', examples: [] },
  { char: '谢谢', pinyin: 'xièxie', pinyinNumeric: 'xie4xie', meaning: 'gracias', lesson: 1, type: 'V.', examples: [], isSupplementary: true },
];

function setup(overrides = {}) {
  const props = {
    lessonNum: 1,
    lessonData: { titleEs: 'Cómo has estado', titleZh: '你最近怎么样' },
    characters: WORDS,
    progress: {},
    onProgressChange: vi.fn(),
    goBack: vi.fn(),
    onStartExercise: vi.fn(),
    speakChinese: vi.fn(),
    ...overrides,
  };
  render(<LessonDetail {...props} />);
  return props;
}

beforeEach(() => {
  // useMedia (react-use) — necesita matchMedia en jsdom.
  window.matchMedia = window.matchMedia || (() => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
});

afterEach(() => cleanup());

describe('LessonDetail', () => {
  it('lista el vocabulario principal de la lección (sin el extra) y el botón atrás llama a goBack', () => {
    const props = setup();
    expect(screen.getByText('你')).toBeTruthy();
    expect(screen.getByText('好')).toBeTruthy();
    expect(screen.queryByText('谢谢')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /home/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });

  it('el toggle de vocabulario extra muestra las palabras suplementarias', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /extra vocabulary/i }));
    expect(screen.getByText('谢谢')).toBeTruthy();
  });

  it('marcar una palabra como dominada llama a onProgressChange con mastered:true', () => {
    const props = setup();
    // Botón de estado (○/◑/★) es el primero dentro de la fila de 你.
    fireEvent.click(screen.getByText('你').closest('div').querySelector('button'));

    expect(props.onProgressChange).toHaveBeenCalledTimes(1);
    const updated = props.onProgressChange.mock.calls[0][0];
    expect(updated.lesson_1['你'].mastered).toBe(true);
  });

  it('marcar una palabra como difícil llama a onProgressChange', () => {
    const props = setup();
    const markDifficult = screen.getAllByTitle(/mark as hard/i)[0];
    fireEvent.click(markDifficult);
    expect(props.onProgressChange).toHaveBeenCalledTimes(1);
  });

  it('el botón de altavoz de una palabra llama a speakChinese con pinyinNumeric', () => {
    const props = setup();
    const row = screen.getByText('你').closest('div');
    const speakBtn = Array.from(row.querySelectorAll('button')).find(b => b.textContent === '声');
    fireEvent.click(speakBtn);

    expect(props.speakChinese).toHaveBeenCalledWith({ hanzi: '你', pinyin: 'nǐ', pinyinNumeric: 'ni3' });
  });

  it('pulsar una tarjeta despliega sus ejemplos', () => {
    setup();
    expect(screen.queryByText('你好')).toBeNull();
    fireEvent.click(screen.getByText('你').closest('div'));
    expect(screen.getByText('你好')).toBeTruthy();
  });

  it('tab Ejercicios: cada tarjeta dispara onStartExercise con su key, incluido el examen', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /^exercises$/i }));

    fireEvent.click(screen.getByRole('button', { name: /final exam/i }));
    expect(props.onStartExercise).toHaveBeenCalledWith('exam');

    // Los botones combinan el icono CJK con el texto (p.ej. "学Study Review
    // words…") como nombre accesible — sin anclar al inicio.
    fireEvent.click(screen.getByRole('button', { name: /study/i }));
    expect(props.onStartExercise).toHaveBeenCalledWith('learn');

    fireEvent.click(screen.getByRole('button', { name: /quick quiz/i }));
    expect(props.onStartExercise).toHaveBeenCalledWith('quiz');

    fireEvent.click(screen.getByRole('button', { name: /matching/i }));
    expect(props.onStartExercise).toHaveBeenCalledWith('matching');

    fireEvent.click(screen.getByRole('button', { name: /writing/i }));
    expect(props.onStartExercise).toHaveBeenCalledWith('writing');
  });

  it('muestra el porcentaje de dominio calculado a partir del progreso', () => {
    const progress = { lesson_1: { '你': { seen: true, mastered: true } } };
    setup({ progress });
    // 1 de 2 palabras principales dominada → 50%.
    expect(screen.getByText('50%')).toBeTruthy();
  });
});
