// src/components/SettingsScreen.test.jsx
// Ajustes son, casi todos, preferencias que se guardan en localStorage vía
// utils dedicados (theme.js, fontScale.js, highContrast.js, soundPrefs.js,
// gameIntroPrefs.js, streak.js). El riesgo real aquí es "el toggle se ve bien
// pero no persiste" — así que cada test comprueba el estado real guardado,
// no solo el aria-pressed visual.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import '@/i18n';

vi.mock('@/context/AuthContext.jsx', () => ({
  useAuth: () => ({
    mode: 'guest', user: null,
    signOut: vi.fn(), migrateGuestToGoogle: vi.fn(),
    pushSnapshot: vi.fn(), deleteAccount: vi.fn(),
  }),
}));

import SettingsScreen from './SettingsScreen.jsx';
import { getThemePref } from '@/utils/theme.js';
import { getFontScalePref } from '@/utils/fontScale.js';
import { getHighContrast } from '@/utils/highContrast.js';
import { getSoundPrefs } from '@/utils/soundPrefs.js';
import { getStreak } from '@/utils/streak.js';
import { introsEnabled } from '@/utils/gameIntroPrefs.js';

function setup(overrides = {}) {
  const props = {
    userName: 'Tester',
    onUserNameChange: vi.fn(),
    onProgressChange: vi.fn(),
    allCharacters: [],
    onBack: vi.fn(),
    ...overrides,
  };
  render(<SettingsScreen {...props} />);
  return props;
}

beforeEach(() => {
  localStorage.clear();
});

// El interruptor de PrefToggle (alto contraste, efectos, minijuegos) no
// tiene nombre accesible propio — el texto vive en un <p> hermano, fuera del
// <button> (solo lleva el "pomo" decorativo dentro). Se localiza por el
// texto de su etiqueta y se sube al contenedor de la fila para encontrarlo.
function prefToggleFor(labelText) {
  return screen.getByText(labelText).closest('div').parentElement.querySelector('button');
}

afterEach(() => cleanup());

describe('SettingsScreen — persistencia de preferencias', () => {
  it('cambiar el tema a "Dark" persiste en localStorage', () => {
    setup();
    expect(getThemePref()).toBe('light'); // valor por defecto
    fireEvent.click(screen.getByRole('button', { name: /dark/i }));
    expect(getThemePref()).toBe('dark');
  });

  it('cambiar el tamaño de texto a "Large" persiste', () => {
    setup();
    expect(getFontScalePref()).toBe('normal');
    fireEvent.click(screen.getByRole('button', { name: /^large$/i }));
    expect(getFontScalePref()).toBe('large');
  });

  it('el toggle de alto contraste persiste al activarlo y desactivarlo', () => {
    setup();
    expect(getHighContrast()).toBe(false);
    const toggle = prefToggleFor('High contrast');
    fireEvent.click(toggle);
    expect(getHighContrast()).toBe(true);
    fireEvent.click(toggle);
    expect(getHighContrast()).toBe(false);
  });

  it('el toggle de efectos de sonido persiste', () => {
    setup();
    expect(getSoundPrefs().effects).toBe(true); // por defecto activado
    fireEvent.click(prefToggleFor('Sound effects'));
    expect(getSoundPrefs().effects).toBe(false);
  });

  it('cambiar la velocidad de voz a "Normal" (1.0) persiste', () => {
    setup();
    expect(getSoundPrefs().voiceRate).toBe(0.8); // "Lenta" por defecto
    // "Normal" también es el nombre de un preset de meta diaria y de tamaño
    // de texto — se acota al bloque de "Voice speed".
    const voiceSection = screen.getByText('Voice speed').closest('div');
    fireEvent.click(within(voiceSection).getByRole('button', { name: /^normal$/i }));
    expect(getSoundPrefs().voiceRate).toBe(1.0);
  });

  it('cambiar la meta diaria actualiza el XP guardado en el streak', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /200 xp/i }));
    expect(getStreak().dailyGoal).toBe(200);
  });

  it('desactivar las explicaciones de minijuegos persiste', () => {
    setup();
    expect(introsEnabled()).toBe(true);
    fireEvent.click(prefToggleFor('Game explanations'));
    expect(introsEnabled()).toBe(false);
  });

  it('editar el nick y perder el foco llama a onUserNameChange con el valor recortado', () => {
    const props = setup();
    const input = screen.getByDisplayValue('Tester');
    fireEvent.change(input, { target: { value: '  Nuevo Nombre  ' } });
    fireEvent.blur(input);
    expect(props.onUserNameChange).toHaveBeenCalledWith('Nuevo Nombre');
  });

  it('el botón atrás llama a onBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /profile/i }));
    expect(props.onBack).toHaveBeenCalledTimes(1);
  });
});
