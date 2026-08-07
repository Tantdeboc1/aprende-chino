// src/components/Dictionary.test.jsx
// El chunk es/*.js de i18next carga de forma diferida (ver src/i18n.js):
// en jsdom solo EN está disponible de forma síncrona al montar, así que las
// aserciones usan el texto en inglés (fallbackLng) en vez de hardcodear ES.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/context/AuthContext.jsx', () => ({
  useAuth: () => ({ mode: 'guest', user: null }),
}));

// CharacterSheet monta HanziWriter (carga async de trazos) — fuera del
// alcance de este test, que solo comprueba que Dictionary abre/cierra el
// bottom-sheet con el carácter correcto.
vi.mock('@/components/ui/CharacterSheet.jsx', () => ({
  default: (props) => (
    <div data-testid="character-sheet">
      {props.char?.char}
      <button onClick={props.onClose}>cerrar ficha</button>
    </div>
  ),
}));

import Dictionary from './Dictionary.jsx';

const CHARS = [
  { char: '你', pinyin: 'nǐ', pinyinNumeric: 'ni3', meaning: 'tú', radical: '亻', type: 'Pron.', lesson: 1, examples: [] },
  { char: '好', pinyin: 'hǎo', pinyinNumeric: 'hao3', meaning: 'bueno', radical: '女', type: 'Adj.', lesson: 1, examples: [] },
  { char: '谢谢', pinyin: 'xièxie', pinyinNumeric: 'xie4xie', meaning: 'gracias', radical: '言', type: 'V.', lesson: 2, examples: [] },
  { char: '再见', pinyin: 'zàijiàn', pinyinNumeric: 'zai4jian4', meaning: 'adiós', radical: '冂', type: 'V.', lesson: 2, examples: [], isSupplementary: true },
];

function setup(overrides = {}) {
  const props = {
    goBack: vi.fn(),
    characters: CHARS,
    speakChinese: vi.fn(),
    searchTerm: '',
    setSearchTerm: vi.fn(),
    selectedLesson: null,
    setSelectedLesson: vi.fn(),
    showSupplementary: false,
    setShowSupplementary: vi.fn(),
    lessonsData: [{ lesson: 1, titleEs: 'Lección 1' }, { lesson: 2, titleEs: 'Lección 2' }],
    progress: {},
    ...overrides,
  };
  render(<Dictionary {...props} />);
  return props;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => cleanup());

describe('Dictionary', () => {
  it('lista las palabras principales (sin las de vocabulario extra) y el botón atrás llama a goBack', () => {
    const props = setup();
    expect(screen.getByText('你')).toBeTruthy();
    expect(screen.getByText('好')).toBeTruthy();
    expect(screen.getByText('谢谢')).toBeTruthy();
    // 再见 es isSupplementary y showSupplementary empieza en false.
    expect(screen.queryByText('再见')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });

  it('filtra por lección al pulsar el chip correspondiente', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /lesson 1/i }));
    expect(props.setSelectedLesson).toHaveBeenCalledWith(1);
  });

  it('busca por significado con el buscador (debounce)', async () => {
    setup({ selectedLesson: null });
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'gracias' } });

    await waitFor(() => {
      expect(screen.getByText('谢谢')).toBeTruthy();
      expect(screen.queryByText('你')).toBeNull();
    });
  });

  it('busca por pinyin tono-agnóstico ("xiexie" encuentra "xièxie")', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'xiexie' } });

    await waitFor(() => {
      expect(screen.getByText('谢谢')).toBeTruthy();
      expect(screen.queryByText('你')).toBeNull();
    });
  });

  it('marcar/desmarcar favorito persiste en localStorage y el filtro de favoritos funciona', () => {
    setup();
    // Botón favorito (收) de la primera tarjeta (你).
    const favButtons = screen.getAllByTitle(/favorites/i);
    fireEvent.click(favButtons[0]);

    expect(JSON.parse(localStorage.getItem('aprende-chino-favorites'))).toEqual(['你']);

    fireEvent.click(screen.getByRole('button', { name: /favorites/i }));
    // Con el filtro activo solo debe quedar 你 (el que se marcó).
    expect(screen.getByText('你')).toBeTruthy();
    expect(screen.queryByText('好')).toBeNull();
  });

  it('el toggle de vocabulario extra muestra las palabras suplementarias', () => {
    setup({ showSupplementary: true });
    expect(screen.getByText('再见')).toBeTruthy();
  });

  it('el botón de altavoz llama a speakChinese con hanzi, pinyin y pinyinNumeric', () => {
    const props = setup();
    const speakButtons = screen.getAllByLabelText(/listen/i);
    fireEvent.click(speakButtons[0]); // 你

    expect(props.speakChinese).toHaveBeenCalledWith({ hanzi: '你', pinyin: 'nǐ', pinyinNumeric: 'ni3' });
  });

  it('al pulsar una tarjeta abre la ficha del carácter (CharacterSheet) y se puede cerrar', () => {
    setup();
    fireEvent.click(screen.getByText('你'));
    expect(screen.getByTestId('character-sheet')).toBeTruthy();

    fireEvent.click(screen.getByText('cerrar ficha'));
    expect(screen.queryByTestId('character-sheet')).toBeNull();
  });

  it('sin resultados muestra el mensaje de "no characters found"', async () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'zzzzz-no-existe' } });
    await waitFor(() => {
      expect(screen.getByText(/no characters found/i)).toBeTruthy();
    });
  });
});
