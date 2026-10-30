import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@/i18n';
import { STORIES } from '@/data/stories/index.js';
import { STORAGE_KEYS } from '@/utils/storageKeys.js';
import StoryPlayer from './StoryPlayer.jsx';

vi.mock('./DialogueBox.jsx', () => ({ default: ({ chino, onAdvance }) => <button onClick={onAdvance}>{chino}</button> }));
vi.mock('./ExerciseBlock.jsx', () => ({ default: ({ ejercicios, onComplete }) => <button onClick={() => onComplete(0, 1, [{ block: 'traduccion', item: ejercicios.traduccion[0] }])}>finish exercises</button> }));
vi.mock('./StoryResults.jsx', () => ({ default: ({ onReview }) => <button onClick={onReview}>review mistakes</button> }));
vi.mock('./SceneBackground.jsx', () => ({ default: () => null }));

beforeEach(() => { localStorage.clear(); window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} }); });
afterEach(cleanup);

it('retains independent drafts and resumes the chosen story', () => {
  const first = STORIES[1];
  const second = STORIES[8];
  const { unmount } = render(<StoryPlayer story={first} userName="Alex" />);
  fireEvent.click(screen.getByRole('button', { name: /start story|empezar historia/i }));
  fireEvent.click(screen.getByRole('button', { name: first.escenas[0].chino.replaceAll('{userName}', 'Alex') }));
  unmount();
  const other = render(<StoryPlayer story={second} userName="Alex" />);
  fireEvent.click(screen.getByRole('button', { name: /start story|empezar historia/i }));
  other.unmount();
  expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.STORY_DRAFT))[first.id].idx).toBe(1);
  expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.STORY_DRAFT))[second.id].idx).toBe(0);
  render(<StoryPlayer story={first} userName="Alex" />);
  fireEvent.click(screen.getByRole('button', { name: /continue story|continuar historia/i }));
  expect(screen.getByText(/elige la frase en chino|choose the chinese sentence/i)).toBeTruthy();
});

it('offers missed-question review in a later story without awarding XP twice', () => {
  const story = STORIES[8];
  localStorage.setItem(STORAGE_KEYS.STORY_DRAFT, JSON.stringify({ [story.id]: { idx: story.escenas.length - 1, phase: 'exercises' } }));
  const onFinish = vi.fn();
  render(<StoryPlayer story={story} onFinish={onFinish} />);
  fireEvent.click(screen.getByRole('button', { name: /continue story|continuar historia/i }));
  fireEvent.click(screen.getByRole('button', { name: 'finish exercises' }));
  fireEvent.click(screen.getByRole('button', { name: 'review mistakes' }));
  fireEvent.click(screen.getByRole('button', { name: 'finish exercises' }));
  expect(onFinish).toHaveBeenCalledTimes(1);
});
