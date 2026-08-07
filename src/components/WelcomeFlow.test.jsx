// src/components/WelcomeFlow.test.jsx
// GENDERS, DAILY_GOAL_PRESETS y la galería de avatares (avatars.js) se usan
// reales — son datos puros. Solo se mockean los efectos secundarios
// (updateUserProfile, setDailyGoal) para poder verificar con qué se llaman.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

const updateUserProfileMock = vi.hoisted(() => vi.fn());
vi.mock('@/utils/userProfile.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, updateUserProfile: updateUserProfileMock };
});
const setDailyGoalMock = vi.hoisted(() => vi.fn());
vi.mock('@/utils/streak.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, setDailyGoal: setDailyGoalMock };
});

import WelcomeFlow from './WelcomeFlow.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); localStorage.clear(); });

function goToAvatarStep() {
  fireEvent.change(screen.getByPlaceholderText("What's your name?"), { target: { value: 'Ana' } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  fireEvent.click(screen.getByRole('button', { name: /^男/ }));
  fireEvent.click(screen.getByRole('button', { name: /next/i }));
}

describe('WelcomeFlow', () => {
  it('el paso 0 no deja avanzar sin nombre', () => {
    render(<WelcomeFlow onComplete={() => {}} />);
    expect(screen.getByRole('button', { name: /next/i }).disabled).toBe(true);
    fireEvent.change(screen.getByPlaceholderText("What's your name?"), { target: { value: 'Ana' } });
    expect(screen.getByRole('button', { name: /next/i }).disabled).toBe(false);
  });

  it('"← Back" en el paso 1 vuelve al paso 0 conservando el nombre', () => {
    render(<WelcomeFlow onComplete={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText("What's your name?"), { target: { value: 'Ana' } });
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('How do you identify?')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(screen.getByDisplayValue('Ana')).toBeTruthy();
  });

  it('el paso 2 (avatar) no deja avanzar hasta elegir uno', () => {
    render(<WelcomeFlow onComplete={() => {}} />);
    goToAvatarStep();
    expect(screen.getByText('Choose your avatar')).toBeTruthy();
    expect(screen.getByRole('button', { name: /next/i }).disabled).toBe(true);

    const avatarButtons = screen.getAllByRole('button').filter(b => b.hasAttribute('title'));
    expect(avatarButtons.length).toBeGreaterThan(0);
    fireEvent.click(avatarButtons[0]);
    expect(screen.getByRole('button', { name: /next/i }).disabled).toBe(false);
  });

  it('completar los 4 pasos llama a updateUserProfile, setDailyGoal y onComplete con el nombre', () => {
    const onComplete = vi.fn();
    render(<WelcomeFlow onComplete={onComplete} />);
    goToAvatarStep();
    const avatarButtons = screen.getAllByRole('button').filter(b => b.hasAttribute('title'));
    fireEvent.click(avatarButtons[0]);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Paso 3 (meta diaria): 'normal' (120 XP) viene preseleccionado.
    expect(screen.getByText('How much do you want to practice each day?')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /start/i }));

    expect(updateUserProfileMock).toHaveBeenCalledWith(
      expect.objectContaining({ gender: 'm', useGooglePhoto: false })
    );
    expect(setDailyGoalMock).toHaveBeenCalledWith(120);
    expect(onComplete).toHaveBeenCalledWith('Ana');
  });
});
