// src/components/learn/Tones/Consonants.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import Consonants from './Consonants.jsx';

const DATA = { consonants: [{ pinyin: 'b', soundTr: { en: 'like b in "boy"' } }, { pinyin: 'zh', soundTr: { en: 'retroflex' } }] };

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), speakChinese: vi.fn(), ...overrides };
  render(<Consonants {...props} />);
  return props;
}

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('Consonants', () => {
  it('carga las consonantes y añade y/w si faltan, ordenadas alfabéticamente', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => DATA }));
    setup();
    await screen.findByText('b');
    expect(screen.getByText('y')).toBeTruthy();
    expect(screen.getByText('w')).toBeTruthy();
    expect(screen.getByText('zh')).toBeTruthy();
  });

  it('pulsar una consonante llama a speakChinese con la sílaba mapeada ("b" → "ba1")', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => DATA }));
    const props = setup();
    await screen.findByText('b');
    fireEvent.click(screen.getByText('b'));
    expect(props.speakChinese).toHaveBeenCalledWith('ba1', { category: 'pronunciation' });
  });

  it('una consonante compuesta ("zh") mapea a su sílaba propia', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => DATA }));
    const props = setup();
    await screen.findByText('zh');
    fireEvent.click(screen.getByText('zh'));
    expect(props.speakChinese).toHaveBeenCalledWith('zha1', { category: 'pronunciation' });
  });

  it('el botón atrás llama a goBack', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => DATA }));
    const props = setup();
    await screen.findByText('b');
    fireEvent.click(screen.getByRole('button', { name: /back to tones|volver/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
