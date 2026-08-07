// src/components/learn/Tones/SpecialSyllables.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import SpecialSyllables from './SpecialSyllables.jsx';

const DATA = { specialSyllables: [{ pinyin: 'zhi', soundTr: { en: 'buzzing zh' } }, { pinyin: 'ri', soundTr: { en: 'retroflex r' } }] };

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), speakChinese: vi.fn(), ...overrides };
  render(<SpecialSyllables {...props} />);
  return props;
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('SpecialSyllables', () => {
  it('carga y muestra las sílabas especiales ordenadas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => DATA }));
    setup();
    await screen.findByText('zhi');
    expect(screen.getByText('ri')).toBeTruthy();
  });

  it('pulsar una sílaba llama a speakChinese con tono 1 añadido', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => DATA }));
    const props = setup();
    await screen.findByText('zhi');
    fireEvent.click(screen.getByText('zhi'));
    expect(props.speakChinese).toHaveBeenCalledWith('zhi1', { category: 'pronunciation' });
  });

  it('respuesta no-ok del fetch muestra el mensaje de error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    setup();
    await screen.findByText(/could not load|no se pudo/i);
  });

  it('el botón atrás llama a goBack', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => DATA }));
    const props = setup();
    await screen.findByText('zhi');
    fireEvent.click(screen.getByRole('button', { name: /back to tones|volver/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
