import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { StrictMode } from 'react';
import '@/i18n';
import i18n from '@/i18n';
import SkillProgress from './SkillProgress.jsx';
import GameResults from './minigames/GameResults.jsx';
import { loadSkillSessions, recordSkillSession } from '@/utils/skillProgress.js';
import copy from '@/data/skillProgressText.js';

vi.mock('@/components/ui/ConfettiCelebration.jsx', () => ({ default: () => null }));
beforeEach(async () => { localStorage.clear(); await i18n.changeLanguage('es'); });
afterEach(cleanup);

describe('skill panel', () => {
  it('shows honest empty states, existing handwriting practice and practice links', () => {
    const practice = vi.fn();
    render(<SkillProgress progress={{ __writing: { 水: 3, 人: 2 } }} onPractice={practice} />);
    expect(screen.getAllByText('Sin intentos recientes')).toHaveLength(5);
    expect(screen.getByText('2 caracteres')).toBeTruthy();
    expect(screen.getByText('5 repeticiones')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Practicar: Comprensión oral' }));
    expect(practice).toHaveBeenCalledWith('dictation-game');
    fireEvent.click(screen.getByRole('button', { name: 'Practicar: Escritura a mano' }));
    expect(practice).toHaveBeenCalledWith('handwriting');
  });
  it('shows concrete tone errors and a recognition qualification', () => {
    recordSkillSession({ id: 'tone', activity: 'tones-ear', correct: 4, total: 5, mistakes: [{ tone: 4, chosenTone: 2 }] });
    render(<SkillProgress progress={{}} />);
    expect(screen.getByText('80%')).toBeTruthy();
    expect(screen.getByText('2 → 4 · ×1')).toBeTruthy();
    expect(screen.getByText(copy.es.voice)).toBeTruthy();
  });
  it('does not double count StrictMode effects, but records a replay separately', () => {
    const props = { gameId: 'time-race', title: 'Results', correct: 3, wrong: 2 };
    const view = render(<StrictMode><GameResults {...props} /></StrictMode>);
    expect(loadSkillSessions()).toHaveLength(1);
    view.rerender(<StrictMode><GameResults {...props} /></StrictMode>);
    expect(loadSkillSessions()).toHaveLength(1);
    view.unmount();
    render(<StrictMode><GameResults {...props} /></StrictMode>);
    expect(loadSkillSessions()).toHaveLength(2);
  });
  it('provides complete copy for all app languages', () => {
    for (const lang of ['es', 'en', 'fr', 'de', 'it', 'pt']) expect(Object.keys(copy[lang])).toEqual(Object.keys(copy.es));
  });
});
