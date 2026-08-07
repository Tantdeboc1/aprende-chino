// src/components/GrammarTab.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

const GRAMMAR_BY_LESSON = vi.hoisted(() => ({
  1: {
    intro: 'This lesson covers basic sentence patterns.',
    patterns: [{
      id: 'p1', pattern: '是', pinyin: 'shì', translation: 'to be',
      explanation: 'Used to link a subject with a noun.',
      examples: [{ zh: '我是学生', pinyin: 'wǒ shì xuéshēng', translation: 'I am a student' }],
    }],
    structures: [{
      id: 's1', title: 'Subject + 是 + Noun', formula: 'S + 是 + N',
      example: '他是老师', examplePinyin: 'tā shì lǎoshī', exampleTranslation: 'He is a teacher',
    }],
    tip: 'Remember: 是 is never used before an adjective.',
  },
}));
vi.mock('@/utils/loadContent.js', () => ({ loadGrammarData: vi.fn().mockResolvedValue(GRAMMAR_BY_LESSON) }));
vi.mock('@/components/ui/SpeakButton.jsx', () => ({ default: ({ text }) => <button>speak:{text}</button> }));

import GrammarTab from './GrammarTab.jsx';

afterEach(() => cleanup());

describe('GrammarTab', () => {
  it('muestra "Loading…" antes de que resuelva la carga', () => {
    render(<GrammarTab lessonNum={1} />);
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('carga la intro, los patrones y las estructuras de la lección', async () => {
    render(<GrammarTab lessonNum={1} />);
    expect(await screen.findByText('This lesson covers basic sentence patterns.')).toBeTruthy();
    expect(screen.getByText('是')).toBeTruthy();
    expect(screen.getByText('Subject + 是 + Noun')).toBeTruthy();
    expect(screen.getByText('S + 是 + N')).toBeTruthy();
    expect(screen.getByText(/never used before an adjective/)).toBeTruthy();
  });

  it('desplegar un patrón muestra su explicación y ejemplo', async () => {
    render(<GrammarTab lessonNum={1} />);
    fireEvent.click(await screen.findByText('是'));
    expect(screen.getByText('Used to link a subject with a noun.')).toBeTruthy();
    expect(screen.getByText('我是学生')).toBeTruthy();
  });
});
