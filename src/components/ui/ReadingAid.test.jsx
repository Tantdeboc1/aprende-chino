import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import ReadingAid from './ReadingAid.jsx';
import DialogueBox from '@/components/stories/DialogueBox.jsx';
import { setLearningPrefs, setMotionPref } from '@/utils/learningPrefs.js';

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); document.documentElement.classList.remove('reduce-motion'); });
describe('reading aids', () => {
  it('reveals vocabulary on tap without activating the parent action', () => {
    setLearningPrefs({ pinyin: 'tap' });
    const parent = vi.fn();
    render(<div onClick={parent}><ReadingAid kind="pinyin">nǐ hǎo</ReadingAid></div>);
    expect(screen.queryByText('nǐ hǎo')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Show pinyin' }));
    expect(screen.getByText('nǐ hǎo')).toBeTruthy();
    expect(parent).not.toHaveBeenCalled();
  });
  it('preserves the hard story mode even when pinyin is set to always visible', () => {
    setMotionPref('reduced');
    setLearningPrefs({ pinyin: 'always' });
    render(<DialogueBox chino="你好" pinyin="nǐ hǎo" traduccion="Hello" dificultad="dificil" onAdvance={() => {}} />);
    expect(screen.queryByText('nǐ hǎo')).toBeNull();
    expect(screen.getByText('你好')).toBeTruthy();
  });
});
