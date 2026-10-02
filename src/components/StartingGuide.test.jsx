import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import i18n from '@/i18n';
import StartingGuide from './StartingGuide.jsx';
import copy from '@/data/startingGuideText.js';

const characters = [
  { char: '你', meaning: 'you', lesson: 1 }, { char: '家', meaning: 'home', lesson: 3 },
  { char: '在', meaning: 'at', lesson: 6 }, { char: '人', meaning: 'person', lesson: 1 },
];
beforeEach(async () => { localStorage.clear(); await i18n.changeLanguage('en'); });
afterEach(cleanup);

describe('StartingGuide', () => {
  it('offers an immediate beginner recommendation and an optional free exploration', () => {
    const finish = vi.fn();
    render(<StartingGuide characters={characters} onFinish={finish} />);
    fireEvent.click(screen.getByRole('button', { name: /starting from scratch/i }));
    expect(screen.getByText('Lesson 1')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Start this lesson' }));
    expect(finish).toHaveBeenCalledWith(expect.objectContaining({ source: 'beginner', lesson: 1 }), true);
  });
  it('allows unknown answers, requires an explicit choice and completes without writing learning progress', () => {
    const finish = vi.fn();
    render(<StartingGuide characters={characters} onFinish={finish} />);
    fireEvent.click(screen.getByRole('button', { name: /know some Chinese/i }));
    for (let i = 1; i <= 6; i++) {
      expect(screen.getByText(`Question ${i}/6`)).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Next' }).disabled).toBe(true);
      fireEvent.click(screen.getByRole('button', { name: 'I don’t know' }));
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    }
    expect(screen.getByText('Vocabulary: 0/3')).toBeTruthy();
    expect(screen.getByText('Sentences: 0/3')).toBeTruthy();
    expect(screen.getByText(copy.en.sampleHint)).toBeTruthy();
    expect(localStorage.getItem('aprende-chino-progress-v1')).toBeNull();
    expect(localStorage.getItem('aprende-chino-skill-progress-v1')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Explore the app' }));
    expect(finish).toHaveBeenCalledWith(expect.objectContaining({ source: 'sample', lesson: 1 }), false);
  });
  it('skips an unfinished sample and has copy in all six languages', () => {
    const finish = vi.fn();
    render(<StartingGuide characters={characters} onFinish={finish} />);
    fireEvent.click(screen.getByRole('button', { name: /know some Chinese/i }));
    fireEvent.click(screen.getByRole('button', { name: 'Skip and explore' }));
    expect(finish).toHaveBeenCalledWith(null, false);
    for (const lang of ['es', 'en', 'fr', 'de', 'it', 'pt']) expect(Object.keys(copy[lang])).toEqual(Object.keys(copy.en));
  });
});
