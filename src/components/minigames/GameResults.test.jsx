import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import '@/i18n';
import GameResults from './GameResults.jsx';

vi.mock('@/components/ui/ConfettiCelebration.jsx', () => ({ default: () => null }));

afterEach(() => cleanup());

describe('GameResults', () => {
  it('recomienda repetir al fallar y seguir con otra actividad al acertar', () => {
    const props = { title: 'Resultado', correct: 2, wrong: 2, onPlayAgain: vi.fn(), onBack: vi.fn() };
    const view = render(<GameResults {...props} />);
    expect(screen.getByText(/repeat this activity|repite la actividad/i)).toBeTruthy();
    view.rerender(<GameResults {...props} correct={4} wrong={0} />);
    expect(screen.getByRole('button', { name: /choose another activity|elegir otra actividad/i })).toBeTruthy();
  });
});
