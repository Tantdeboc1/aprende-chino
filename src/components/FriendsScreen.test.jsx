// src/components/FriendsScreen.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import '@/i18n';

vi.mock('@/context/AuthContext.jsx', () => ({
  useAuth: () => ({ mode: 'google', user: { uid: 'me', photoURL: null } }),
}));

const useSocialMock = vi.hoisted(() => vi.fn());
vi.mock('@/hooks/useSocial.js', () => ({ useSocial: useSocialMock }));

import FriendsScreen from './FriendsScreen.jsx';

function baseSocial(overrides = {}) {
  return {
    enabled: true,
    loading: false,
    myCode: 'ABC123',
    friends: [],
    incoming: [],
    outgoing: [],
    lookupCode: vi.fn(),
    sendRequestTo: vi.fn(),
    acceptFrom: vi.fn(),
    acceptRequest: vi.fn(),
    declineRequest: vi.fn(),
    cancelRequest: vi.fn(),
    removeFriend: vi.fn(),
    ...overrides,
  };
}

function setup(socialOverrides = {}, props = {}) {
  const social = baseSocial(socialOverrides);
  useSocialMock.mockReturnValue(social);
  render(<FriendsScreen userName="Tester" onBack={vi.fn()} {...props} />);
  return social;
}

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

describe('FriendsScreen', () => {
  it('modo invitado (enabled: false): muestra la invitación a iniciar sesión, sin formularios', () => {
    setup({ enabled: false });
    expect(screen.getByText(/sign in with google|inicia sesión/i)).toBeTruthy();
    expect(screen.queryByPlaceholderText(/friend.?s code|código/i)).toBeNull();
  });

  it('muestra el código propio formateado', () => {
    setup({ myCode: 'abc123' });
    expect(screen.getByText('ABC-123')).toBeTruthy();
  });

  it('añadir amigo: resuelve el código y muestra la tarjeta de confirmación', async () => {
    const social = setup({}, {});
    social.lookupCode.mockResolvedValue({ uid: 'friend1', profile: { displayName: 'Ana' } });

    fireEvent.change(screen.getByPlaceholderText(/friend.?s code|código/i), { target: { value: 'xyz789' } });
    fireEvent.click(screen.getByRole('button', { name: /^send$|^enviar$/i }));

    expect(social.lookupCode).toHaveBeenCalledWith('XYZ789');
    await screen.findByText('Ana');
  });

  it('confirmar el envío llama a sendRequestTo con el destinatario resuelto', async () => {
    const social = setup();
    social.lookupCode.mockResolvedValue({ uid: 'friend1', profile: { displayName: 'Ana' } });
    social.sendRequestTo.mockResolvedValue('sent');

    fireEvent.change(screen.getByPlaceholderText(/friend.?s code|código/i), { target: { value: 'xyz789' } });
    fireEvent.click(screen.getByRole('button', { name: /^send$|^enviar$/i }));
    await screen.findByText('Ana');

    // Ahora hay dos botones "Send": el del formulario y el de confirmar en
    // la tarjeta del destinatario resuelto — el segundo (el de confirmar).
    fireEvent.click(screen.getAllByRole('button', { name: /^send$|^enviar$/i }).at(-1));
    await waitFor(() => expect(social.sendRequestTo).toHaveBeenCalledWith({ uid: 'friend1', profile: { displayName: 'Ana' } }));
  });

  it('si el destinatario ya te había invitado, confirmar acepta la suya en vez de enviar otra', async () => {
    const social = setup();
    social.lookupCode.mockResolvedValue({ uid: 'friend1', profile: { displayName: 'Ana' }, theyInvitedYou: true });
    social.acceptFrom.mockResolvedValue();

    fireEvent.change(screen.getByPlaceholderText(/friend.?s code|código/i), { target: { value: 'xyz789' } });
    fireEvent.click(screen.getByRole('button', { name: /^send$|^enviar$/i }));
    await screen.findByText('Ana');

    fireEvent.click(screen.getByRole('button', { name: /^accept$|^aceptar$/i }));
    await waitFor(() => expect(social.acceptFrom).toHaveBeenCalledWith('friend1'));
    expect(social.sendRequestTo).not.toHaveBeenCalled();
  });

  it('invitación recibida: aceptar/rechazar llaman al handler correcto con la invitación', () => {
    const req = { id: 'r1', fromName: 'Bob', fromLevel: 3 };
    const social = setup({ incoming: [req] });

    fireEvent.click(screen.getByRole('button', { name: /^accept$|^aceptar$/i }));
    expect(social.acceptRequest).toHaveBeenCalledWith(req);

    fireEvent.click(screen.getByRole('button', { name: /^decline$|^rechazar$/i }));
    expect(social.declineRequest).toHaveBeenCalledWith(req);
  });

  it('invitación enviada: cancelar llama a cancelRequest', () => {
    const req = { id: 's1', toName: 'Carla' };
    const social = setup({ outgoing: [req] });

    fireEvent.click(screen.getByRole('button', { name: /^cancel$|^cancelar$/i }));
    expect(social.cancelRequest).toHaveBeenCalledWith(req);
  });

  it('eliminar amigo pide confirmación en línea antes de llamar a removeFriend', () => {
    const social = setup({ friends: [{ uid: 'f1', profile: { displayName: 'Dani', totalXP: 50 } }] });

    fireEvent.click(screen.getByRole('button', { name: /remove friend|eliminar amigo/i }));
    expect(social.removeFriend).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /^remove$|^quitar$/i }));
    expect(social.removeFriend).toHaveBeenCalledWith('f1');
  });

  it('el ranking cambia de orden entre XP semanal y XP total', () => {
    localStorage.setItem('aprende-chino-streak-v1', JSON.stringify({ totalXP: 10, currentStreak: 0, xpByDay: {} }));
    setup({
      friends: [
        { uid: 'a', profile: { displayName: 'Alto total, bajo semanal', totalXP: 1000, weeklyXP: 0 } },
        { uid: 'b', profile: { displayName: 'Bajo total, alto semanal', totalXP: 10, weeklyXP: 500 } },
      ],
    });

    // Por defecto (semanal): "Bajo total, alto semanal" debe ir primero.
    let names = screen.getAllByText(/total,.*semanal/i).map(el => el.textContent);
    expect(names[0]).toMatch(/Bajo total/);

    fireEvent.click(screen.getByRole('button', { name: /all-time|total/i }));
    names = screen.getAllByText(/total,.*semanal/i).map(el => el.textContent);
    expect(names[0]).toMatch(/Alto total/);
  });

  it('el botón atrás llama a onBack', () => {
    const onBack = vi.fn();
    useSocialMock.mockReturnValue(baseSocial());
    render(<FriendsScreen userName="Tester" onBack={onBack} />);
    fireEvent.click(screen.getByRole('button', { name: /profile|perfil/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
