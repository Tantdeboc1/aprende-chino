import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import '@/i18n';
import { STORIES } from '@/data/stories/index.js';
import StoryPlayer from './StoryPlayer.jsx';

vi.mock('./DialogueBox.jsx', () => ({ default: ({ chino, onAdvance }) => <button onClick={onAdvance}>{chino}</button> }));
vi.mock('./ExerciseBlock.jsx', () => ({ default: ({ ejercicios, onComplete }) => <button onClick={() => onComplete(6, 6, [])}>{ejercicios.traduccion.length} questions</button> }));
vi.mock('./StoryResults.jsx', () => ({ default: ({ score, total }) => <div>Result {score}/{total}</div> }));
vi.mock('./SceneBackground.jsx', () => ({ default: () => null }));

beforeEach(() => {
  window.matchMedia = window.matchMedia || (() => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
});
afterEach(cleanup);

describe('illustrated story flow', () => {
  it.each(STORIES.filter(story => story.id !== 't1-h1').map(story => [story.id, story]))('plays every scene and finishes %s', (_id, story) => {
    const onFinish = vi.fn();
    const { container } = render(<StoryPlayer story={story} userName="Alex" onExit={vi.fn()} onFinish={onFinish} />);
    fireEvent.click(screen.getByRole('button', { name: /start story|empezar historia/i }));
    let choices = 0;
    for (const scene of story.escenas) {
      expect(container.querySelector('.manga-image')?.getAttribute('src')).toContain('manga-');
      const line = scene.chino.replaceAll('{userName}', 'Alex');
      if (screen.queryByText(/elige la frase en chino|choose the chinese sentence/i)) {
        choices += 1;
        const wrong = screen.getAllByRole('button').find(button => button.className.includes('font-cn') && button.textContent !== line);
        fireEvent.click(wrong);
        expect(screen.getByRole('status')).toBeTruthy();
        fireEvent.click(screen.getByRole('button', { name: line }));
      }
      fireEvent.click(screen.getByRole('button', { name: line }));
    }
    expect(choices).toBe(2);
    fireEvent.click(screen.getByRole('button', { name: /questions/ }));
    expect(onFinish).toHaveBeenCalledWith({ score: 6, total: 6 });
    expect(screen.getByText('Result 6/6')).toBeTruthy();
  });
});
