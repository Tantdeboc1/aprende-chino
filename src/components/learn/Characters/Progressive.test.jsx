// src/components/learn/Characters/Progressive.test.jsx
// El chunk es/*.js de i18next carga de forma diferida: en jsdom solo EN está
// disponible de forma síncrona, así que las aserciones usan el texto inglés.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import Progressive from './Progressive.jsx';

// 8 caracteres → 2 páginas de 6 (chunkSize fijo en el componente).
const CHARS = Array.from({ length: 8 }, (_, i) => ({
  char: `字${i}`, pinyin: `p${i}`, pinyinNumeric: `p${i}1`, meaning: `significado ${i}`, radical: '—',
}));

function setup(overrides = {}) {
  const props = {
    goBack: vi.fn(),
    characters: CHARS,
    speakChinese: vi.fn(),
    onTrackSeen: vi.fn(),
    ...overrides,
  };
  render(<Progressive {...props} />);
  return props;
}

afterEach(() => cleanup());

describe('Progressive', () => {
  it('muestra la primera página (6 caracteres) y el indicador "Page 1 of 2"', () => {
    setup();
    expect(screen.getByText('Page 1 of 2')).toBeTruthy();
    expect(screen.getByText('字0')).toBeTruthy();
    expect(screen.getByText('字5')).toBeTruthy();
    expect(screen.queryByText('字6')).toBeNull(); // en la página 2
  });

  it('al montar, marca como vistos los caracteres del grupo actual', () => {
    const props = setup();
    expect(props.onTrackSeen).toHaveBeenCalledTimes(6);
    expect(props.onTrackSeen).toHaveBeenCalledWith(CHARS[0]);
    expect(props.onTrackSeen).toHaveBeenCalledWith(CHARS[5]);
  });

  it('"Next Lesson" avanza a la página 2 y marca sus caracteres como vistos', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /next lesson/i }));

    expect(screen.getByText('Page 2 of 2')).toBeTruthy();
    expect(screen.getByText('字6')).toBeTruthy();
    expect(screen.queryByText('字0')).toBeNull();
    expect(props.onTrackSeen).toHaveBeenCalledWith(CHARS[6]);
  });

  it('en la última página el botón es "Complete" y llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /next lesson/i }));

    const completeBtn = screen.getByRole('button', { name: /complete/i });
    fireEvent.click(completeBtn);
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });

  it('"Previous Lesson" retrocede una página', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /next lesson/i }));
    expect(screen.getByText('Page 2 of 2')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /previous lesson/i }));
    expect(screen.getByText('Page 1 of 2')).toBeTruthy();
    expect(screen.getByText('字0')).toBeTruthy();
  });

  it('el botón de altavoz llama a speakChinese con pinyinNumeric', () => {
    const props = setup();
    fireEvent.click(screen.getAllByRole('button', { name: /listen/i })[0]);
    expect(props.speakChinese).toHaveBeenCalledWith({ hanzi: '字0', pinyin: 'p0', pinyinNumeric: 'p01' });
  });

  it('el botón atrás llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
