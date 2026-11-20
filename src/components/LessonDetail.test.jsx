// src/components/LessonDetail.test.jsx
// El chunk es/*.js de i18next carga de forma diferida: en jsdom solo EN está
// disponible de forma síncrona, así que las aserciones usan el texto inglés.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import '@/i18n';
import i18n from '@/i18n';
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
  localStorage.clear();
  // useMedia (react-use) — necesita matchMedia en jsdom.
  window.matchMedia = window.matchMedia || (() => ({
    matches: false, addEventListener: () => {}, removeEventListener: () => {},
    addListener: () => {}, removeListener: () => {},
  }));
});

afterEach(() => { cleanup(); i18n.changeLanguage('en'); });

describe('LessonDetail', () => {
  it.each([
    [1, 'Running into a classmate', 'Start the conversation', 'A studious friend', 't1-h2'],
    [2, 'Meet someone in your class', 'Prepare my introduction', 'Where are you from?', 't2-h1'],
    [3, 'A family photo', 'Talk about my family', "Xiaomin's family", 't3-h2'],
    [4, 'Find a time in your schedule', 'Work out the schedule', "Marco's schedule", 't4-h2'],
    [5, 'Plan a birthday', 'Prepare the birthday greeting', 'A surprise party', 't5-h1'],
    [7, 'Shopping for clothes', 'Enter the shop', 'A new outfit', 't7-h2'],
    [8, 'A conversation at the clinic', 'Practice the consultation', 'Visiting 马可', 't8-h2'],
  ])('gives lesson %i a story, three worked examples and a tailored activity', async (lessonNum, title, start, storyTitle, storyId) => {
    const onOpenStory = vi.fn();
    setup({ lessonNum, onOpenStory });
    expect(screen.getByRole('heading', { name: 'What will you learn?' })).toBeTruthy();
    const scene = screen.getByRole('region', { name: `A scene from “${storyTitle}”` });
    expect(scene.querySelector('img[src]')).toBeTruthy();
    fireEvent.click(within(scene).getByRole('button', { name: 'Read the full story' }));
    expect(onOpenStory).toHaveBeenCalledWith(storyId);
    expect(screen.getAllByRole('article')).toHaveLength(3);
    expect(await screen.findByRole('heading', { name: title })).toBeTruthy();
    fireEvent.click(await screen.findByRole('button', { name: start }));
    expect(screen.getByText('1/6')).toBeTruthy();
    cleanup();
    setup({ lessonNum });
    fireEvent.click(await screen.findByRole('button', { name: 'Continue studying' }));
    expect(screen.getByText('1/6')).toBeTruthy();
  });

  it('opens lesson six on its goals and starts the map from the introduction', async () => {
    const onOpenStory = vi.fn();
    setup({ lessonNum: 6, onOpenStory });
    const scene = screen.getByRole('region', { name: 'A scene from “A walk around the neighborhood”' });
    expect(screen.getByText('The bank is next to the supermarket.')).toBeTruthy();
    fireEvent.click(within(scene).getByRole('button', { name: 'Read the full story' }));
    expect(onOpenStory).toHaveBeenCalledWith('t6-h2');
    expect(screen.getByRole('heading', { name: 'What will you learn?' })).toBeTruthy();
    expect(screen.getByText('Say what is nearby using 有.')).toBeTruthy();
    expect(await screen.findByRole('heading', { name: 'A walk around the neighborhood' })).toBeTruthy();
    fireEvent.click(await screen.findByRole('button', { name: 'Start with a map' }));
    expect(await screen.findByText('With guidance')).toBeTruthy();
    expect(screen.getByText('1/6')).toBeTruthy();
    cleanup();
    setup({ lessonNum: 6 });
    fireEvent.click(await screen.findByRole('button', { name: 'Continue studying' }));
    expect(screen.getByText('1/6')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'What will you learn?' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /vocabulary \(/i }));
    expect(screen.getByRole('button', { name: 'Review vocabulary with flashcards' })).toBeTruthy();
  });

  it('muestra los vídeos de la lección y los reproduce al solicitar la pestaña', () => {
    const { unmount } = render(<LessonDetail lessonNum={3} lessonData={{}} characters={WORDS} progress={{}} goBack={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Videos' })).toBeTruthy();
    unmount();
    setup({ lessonNum: 3, defaultTab: 'videos' });
    expect(screen.getByRole('button', { name: 'Videos' })).toBeTruthy();
  });

  it('usa el vídeo en inglés cuando el idioma de la app no es español', async () => {
    await i18n.changeLanguage('en');
    const { unmount } = render(<LessonDetail lessonNum={3} lessonData={{}} characters={WORDS} progress={{}} goBack={vi.fn()} defaultTab="videos" />);
    const btn = screen.getAllByRole('button', { name: /watch video/i })[0];
    fireEvent.click(btn);
    const iframe = document.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.getAttribute('src')).toContain('youtube-nocookie.com/embed/');
    unmount();
    await i18n.changeLanguage('en');
  });
  it('lista el vocabulario principal de la lección (sin el extra) y el botón atrás llama a goBack', () => {
    const props = setup({ defaultTab: 'vocab' });
    expect(screen.getByText('你')).toBeTruthy();
    expect(screen.getByText('好')).toBeTruthy();
    expect(screen.queryByText('谢谢')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /home/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });

  it('el toggle de vocabulario extra muestra las palabras suplementarias', () => {
    setup({ defaultTab: 'vocab' });
    fireEvent.click(screen.getByRole('button', { name: /extra vocabulary/i }));
    expect(screen.getByText('谢谢')).toBeTruthy();
  });

  it('marcar una palabra como dominada llama a onProgressChange con mastered:true', () => {
    const props = setup({ defaultTab: 'vocab' });
    // Botón de estado (○/◑/★) es el primero dentro de la fila de 你.
    fireEvent.click(screen.getByText('你').closest('div').querySelector('button'));

    expect(props.onProgressChange).toHaveBeenCalledTimes(1);
    const updated = props.onProgressChange.mock.calls[0][0];
    expect(updated.lesson_1['你'].mastered).toBe(true);
  });

  it('marcar una palabra como difícil llama a onProgressChange', () => {
    const props = setup({ defaultTab: 'vocab' });
    const markDifficult = screen.getAllByTitle(/mark as hard/i)[0];
    fireEvent.click(markDifficult);
    expect(props.onProgressChange).toHaveBeenCalledTimes(1);
  });

  it('el botón de altavoz de una palabra llama a speakChinese con pinyinNumeric', () => {
    const props = setup({ defaultTab: 'vocab' });
    const row = screen.getByText('你').closest('div');
    const speakBtn = Array.from(row.querySelectorAll('button')).find(b => b.textContent === '声');
    fireEvent.click(speakBtn);

    expect(props.speakChinese).toHaveBeenCalledWith({ hanzi: '你', pinyin: 'nǐ', pinyinNumeric: 'ni3' });
  });

  it('pulsar una tarjeta despliega sus ejemplos', () => {
    setup({ defaultTab: 'vocab' });
    expect(screen.queryByText('你好')).toBeNull();
    fireEvent.click(screen.getByText('你').closest('div'));
    expect(screen.getByText('你好！')).toBeTruthy();
    expect(screen.getByText('Nǐ hǎo!')).toBeTruthy();
    expect(screen.getByText('Hello!')).toBeTruthy();
  });

  it('tab Ejercicios: cada tarjeta dispara onStartExercise con su key, incluido el examen', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /^exercises$/i }));

    fireEvent.click(screen.getByRole('button', { name: /final exam/i }));
    expect(props.onStartExercise).toHaveBeenCalledWith('exam');

    expect(screen.getByRole('button', { name: 'Introduction' }).closest('div').className).toContain('overflow-x-auto');

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
