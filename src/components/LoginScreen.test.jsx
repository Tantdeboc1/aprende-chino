// src/components/LoginScreen.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';

const useAuthMock = vi.hoisted(() => vi.fn());
vi.mock('@/context/AuthContext.jsx', () => ({ useAuth: useAuthMock }));

import LoginScreen from './LoginScreen.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe('LoginScreen', () => {
  it('pulsar "Continue with Google" llama a signInWithGoogle y muestra "Connecting…" mientras dura', async () => {
    let resolveSignIn;
    const signInWithGoogle = vi.fn(() => new Promise(res => { resolveSignIn = res; }));
    useAuthMock.mockReturnValue({ signInWithGoogle, continueAsGuest: vi.fn(), error: null });

    render(<LoginScreen />);
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));
    expect(signInWithGoogle).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/connecting/i)).toBeTruthy();

    await act(async () => { resolveSignIn(); await Promise.resolve(); });
    expect(screen.getByText(/continue with google/i)).toBeTruthy();
  });

  it('pulsar "Continue as guest" llama a continueAsGuest', () => {
    const continueAsGuest = vi.fn();
    useAuthMock.mockReturnValue({ signInWithGoogle: vi.fn(), continueAsGuest, error: null });

    render(<LoginScreen />);
    fireEvent.click(screen.getByRole('button', { name: /continue as guest/i }));
    expect(continueAsGuest).toHaveBeenCalledTimes(1);
  });

  it('un error de auth se muestra en pantalla', () => {
    useAuthMock.mockReturnValue({ signInWithGoogle: vi.fn(), continueAsGuest: vi.fn(), error: 'No se pudo iniciar sesión' });
    render(<LoginScreen />);
    expect(screen.getByText('No se pudo iniciar sesión')).toBeTruthy();
  });
});
