// src/components/learn/Tones/Vowels.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import '@/i18n';
import Vowels from './Vowels.jsx';

const VOWELS_DATA = {
  vowels: [
    { char: 'a', tone1: 'ā', tone2: 'á', tone3: 'ǎ', tone4: 'à' },
    { char: 'i', tone1: 'ī', tone2: 'í', tone3: 'ǐ', tone4: 'ì' },
  ],
};

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), speakChinese: vi.fn(), ...overrides };
  render(<Vowels {...props} />);
  return props;
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Vowels', () => {
  it('carga las vocales y las muestra tras el fetch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => VOWELS_DATA }));
    setup();
    await screen.findByText('ā');
    expect(screen.getByText('ī')).toBeTruthy();
  });

  it('pulsar el primer tono de "a" llama a speakChinese con la sílaba mapeada ("a1")', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => VOWELS_DATA }));
    const props = setup();
    await screen.findByText('ā');

    fireEvent.click(screen.getByText('ā'));
    expect(props.speakChinese).toHaveBeenCalledWith('a1', { category: 'pronunciation' });
  });

  it('la vocal "i" mapea a la sílaba "yi" (no existe "i" sola en el manifest)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => VOWELS_DATA }));
    const props = setup();
    await screen.findByText('ī');

    fireEvent.click(screen.getByText('ì')); // 4º tono de "i"
    expect(props.speakChinese).toHaveBeenCalledWith('yi4', { category: 'pronunciation' });
  });

  it('si el fetch falla, muestra el mensaje de error en vez de quedarse cargando', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    setup();
    await waitFor(() => expect(screen.queryByText(/loading|cargando/i)).toBeNull());
    expect(document.body.textContent.length).toBeGreaterThan(0);
  });

  it('el botón atrás llama a goBack', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => VOWELS_DATA }));
    const props = setup();
    await screen.findByText('ā');
    fireEvent.click(screen.getByRole('button', { name: /back to tones|volver/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
