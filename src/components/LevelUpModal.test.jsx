// src/components/LevelUpModal.test.jsx
// avatars.js se usa real (datos puros); solo se mockea loadUserProfile para
// controlar qué avatar tiene el usuario. c01 se desbloquea en nivel 3 (ver
// src/data/avatars.js) — se usa para probar la rama "avatar desbloqueado".
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/userProfile.js', () => ({ loadUserProfile: () => ({ avatarId: 'a06' }) }));

import LevelUpModal from './LevelUpModal.jsx';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] });
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('LevelUpModal', () => {
  it('sin levelUp, no renderiza nada', () => {
    const { container } = render(<LevelUpModal levelUp={null} onClose={() => {}} />);
    expect(container.textContent).toBe('');
  });

  it('muestra el nivel, el título nuevo y el aviso de avatar desbloqueado (nivel 3)', () => {
    render(<LevelUpModal levelUp={{ level: 3, title: { en: 'Apprentice' }, zh: '学徒', icon: '⭐' }} onClose={() => {}} />);
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('Apprentice')).toBeTruthy();
    expect(screen.getByText('学徒')).toBeTruthy();
    expect(screen.getByText(/avatar unlocked/i)).toBeTruthy();
  });

  it('en un nivel sin desbloqueo, muestra el próximo avatar pendiente', () => {
    render(<LevelUpModal levelUp={{ level: 4, title: { en: 'Apprentice' }, zh: '学徒', icon: '⭐' }} onClose={() => {}} />);
    expect(screen.getByText(/next avatar at level 5/i)).toBeTruthy();
  });

  it('pulsar "Continue" cierra el modal tras la animación de salida', () => {
    const onClose = vi.fn();
    render(<LevelUpModal levelUp={{ level: 3, title: { en: 'Apprentice' }, zh: '学徒', icon: '⭐' }} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(onClose).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(220); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
