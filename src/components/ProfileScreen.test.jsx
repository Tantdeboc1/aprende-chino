// src/components/ProfileScreen.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/context/AuthContext.jsx', () => ({
  useAuth: () => ({ mode: 'guest', user: null }),
}));

vi.mock('@/hooks/useIncomingRequestCount.js', () => ({
  useIncomingRequestCount: () => 0,
}));

import ProfileScreen from './ProfileScreen.jsx';

const CHARS = [
  { char: '你', lesson: 1 }, { char: '好', lesson: 1 },
];

function setup(overrides = {}) {
  const props = {
    userName: 'Tester',
    progress: {},
    allCharacters: CHARS,
    onOpenSettings: vi.fn(),
    onOpenFriends: vi.fn(),
    ...overrides,
  };
  render(<ProfileScreen {...props} />);
  return props;
}

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.doUnmock('@/hooks/useIncomingRequestCount.js'); });

describe('ProfileScreen', () => {
  it('muestra el nombre de usuario y el botón de ajustes llama a onOpenSettings', () => {
    const props = setup();
    expect(screen.getByText(/Tester/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    expect(props.onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('el botón de Amigos llama a onOpenFriends', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /friends/i }));
    expect(props.onOpenFriends).toHaveBeenCalledTimes(1);
  });

  it('sin racha activa, no muestra la tarjeta de racha', () => {
    setup();
    expect(screen.queryByText(/current streak|racha/i)).toBeNull();
  });

  it('con racha activa, muestra los días consecutivos', () => {
    localStorage.setItem('aprende-chino-streak-v1', JSON.stringify({
      currentStreak: 5, longestStreak: 9, totalXP: 100, activityDates: [], xpByDay: {},
    }));
    setup();
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('pulsar una insignia despliega su descripción', () => {
    setup();
    const badgeButtons = screen.getAllByRole('button', { expanded: false });
    // El primer botón desplegable es una insignia (no ajustes/amigos, que no tienen aria-expanded).
    const badgeBtn = badgeButtons.find(b => b.getAttribute('aria-expanded') !== null);
    fireEvent.click(badgeBtn);
    expect(badgeBtn.getAttribute('aria-expanded')).toBe('true');
  });

  it('compartir: sin Web Share API, copia al portapapeles y muestra confirmación', async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    // Sin navigator.share → toma la rama de portapapeles.
    delete navigator.share;

    setup();
    fireEvent.click(screen.getByRole('button', { name: /share my profile|compartir/i }));
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    await screen.findByText(/copied to clipboard|copiado/i);
  });

  it('compartir: con Web Share API disponible, la usa en vez del portapapeles', async () => {
    const share = vi.fn().mockResolvedValue();
    navigator.share = share;

    setup();
    fireEvent.click(screen.getByRole('button', { name: /share my profile|compartir/i }));
    await vi.waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(share.mock.calls[0][0]).toMatchObject({ title: expect.any(String) });

    delete navigator.share;
  });
});
