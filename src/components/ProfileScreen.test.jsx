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
  it('el acceso visible Editar perfil abre la personalización existente', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: 'Edit profile' }));
    expect(props.onOpenSettings).toHaveBeenCalledTimes(1);
  });
  it('calcula la precisión desde respuestas reales y conserva el acceso a todas las insignias', () => {
    setup({ progress: { lesson_1: { '你': { correct: 3, incorrect: 1 } } } });
    fireEvent.click(screen.getByText('Detailed statistics and level'));
    expect(screen.getByText('75%')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'View all' }));
    expect(screen.getAllByRole('button', { expanded: false }).length).toBeGreaterThan(3);
    fireEvent.click(screen.getByRole('button', { name: 'Show less' }));
    expect(screen.getByRole('button', { name: 'View all' })).toBeTruthy();
  });
  it('con historial vacío muestra siete días sin actividad y un objetivo sin completar', () => {
    setup();
    expect(screen.getByText('You studied on 0 of the last 7 days')).toBeTruthy();
    expect(screen.getByText('Daily goal reached on 0 days')).toBeTruthy();
    expect(screen.getByRole('progressbar', { name: 'Your goal today' }).getAttribute('aria-valuenow')).toBe('0');
    fireEvent.click(screen.getByText('Detailed statistics and level'));
    expect(screen.getByText('No answers yet')).toBeTruthy();
  });
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

  it('sin racha activa, mantiene el resumen visible con cero días', () => {
    setup();
    expect(screen.getByText(/current streak/i).parentElement.textContent).toContain('0');
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
    fireEvent.click(screen.getByRole('button', { name: 'View all' }));
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
