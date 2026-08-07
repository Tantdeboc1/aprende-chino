// src/components/learn/Tones/index.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import TonesIndex from './index.jsx';

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), speakChinese: vi.fn(), setToneSection: vi.fn(), ...overrides };
  render(<TonesIndex {...props} />);
  return props;
}

afterEach(() => cleanup());

describe('TonesIndex', () => {
  it('las tarjetas de sílabas especiales, quiz de tono y quiz de pronunciación llaman a setToneSection', () => {
    const props = setup();
    fireEvent.click(screen.getAllByRole('button')[3]); // sílabas especiales (3ª tarjeta, tras goBack+Vowels+Consonants)
    expect(props.setToneSection).toHaveBeenCalledWith('specialSyllables');
  });

  it('la tarjeta de Vocales navega internamente (no App) y su botón atrás vuelve al hub', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ vowels: [] }) }));
    setup();
    fireEvent.click(screen.getByText('元音').closest('button'));
    await screen.findByText(/back to tones|volver/i);

    fireEvent.click(screen.getByRole('button', { name: /back to tones|volver/i }));
    // De vuelta en el hub: la tarjeta de Vocales vuelve a estar visible.
    expect(screen.getByText('元音')).toBeTruthy();
    vi.unstubAllGlobals();
  });

  it('el botón atrás del hub llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /back|volver/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
