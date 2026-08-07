// src/components/MiniGames.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/levelExam.js', () => ({
  getLevelMastery: () => ({ pct: 20 }),
  isLevelExamUnlocked: () => false,
  loadLevelExamResult: () => null,
  UNLOCK_MASTERY_PCT: 80,
}));
vi.mock('@/utils/minigameScores.js', () => ({
  loadMinigameScores: () => ({ 'sov-game': { best: 85 } }),
}));
vi.mock('@/components/ui/ProfileBadge.jsx', () => ({ default: () => null }));

import MiniGames from './MiniGames.jsx';

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), navigateTo: vi.fn(), progress: {}, allCharacters: [], ...overrides };
  render(<MiniGames {...props} />);
  return props;
}

afterEach(() => cleanup());

describe('MiniGames', () => {
  it('pulsar la tarjeta de "Historias" navega a "stories"', () => {
    const props = setup();
    fireEvent.click(screen.getByText('Stories').closest('section').querySelector('button'));
    expect(props.navigateTo).toHaveBeenCalledWith('stories');
  });

  it('pulsar un minijuego (Build the Sentence) navega a su id y muestra la mejor puntuación', () => {
    const props = setup();
    expect(screen.getByText('Best 85%')).toBeTruthy();
    fireEvent.click(screen.getByText('Build the Sentence').closest('button'));
    expect(props.navigateTo).toHaveBeenCalledWith('sov-game');
  });

  it('pulsar un reto diario navega a su id', () => {
    const props = setup();
    fireEvent.click(screen.getByText('Characters Challenge').closest('button'));
    expect(props.navigateTo).toHaveBeenCalledWith('daily-characters');
  });

  it('con el examen de nivel bloqueado, la tarjeta muestra el avance de dominio', () => {
    setup();
    expect(screen.getByText(/Master the vocabulary to unlock/)).toBeTruthy();
    expect(screen.getByText(/20\/80%/)).toBeTruthy();
  });

  it('pulsar el examen de nivel navega a "level-exam"', () => {
    const props = setup();
    fireEvent.click(screen.getByText('Final Exam · HSK 1').closest('button'));
    expect(props.navigateTo).toHaveBeenCalledWith('level-exam');
  });

  it('el botón atrás llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
