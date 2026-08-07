// src/components/learn/Radicals/RadicalsTheory.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import RadicalsTheory from './RadicalsTheory.jsx';

const RADICALS = [
  { radical: '氵', pinyin: 'shui3', meaning: 'water', strokeCount: 3, examples: ['河', '海'] },
  { radical: '亻', pinyin: 'ren2', meaning: 'person', strokeCount: 2, examples: ['你'] },
  { radical: '木', pinyin: 'mu4', meaning: 'wood', strokeCount: 4, examples: ['林'] },
];

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), radicals: RADICALS, ...overrides };
  render(<RadicalsTheory {...props} />);
  return props;
}

afterEach(() => cleanup());

describe('RadicalsTheory', () => {
  it('lista todos los radicales agrupados por número de trazos', () => {
    setup();
    expect(screen.getByText('氵')).toBeTruthy();
    expect(screen.getByText('亻')).toBeTruthy();
    expect(screen.getByText('木')).toBeTruthy();
  });

  it('buscar por significado filtra la lista', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/search|buscar/i), { target: { value: 'water' } });
    expect(screen.getByText('氵')).toBeTruthy();
    expect(screen.queryByText('亻')).toBeNull();
    expect(screen.queryByText('木')).toBeNull();
  });

  it('buscar por un ejemplo de carácter también encuentra el radical', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/search|buscar/i), { target: { value: '林' } });
    expect(screen.getByText('木')).toBeTruthy();
    expect(screen.queryByText('氵')).toBeNull();
  });

  it('sin resultados, muestra el mensaje de "no encontrado"', () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText(/search|buscar/i), { target: { value: 'zzz-no-existe' } });
    expect(screen.getByText(/no radicals found|no se encontraron/i)).toBeTruthy();
  });

  it('pulsar un radical despliega sus caracteres relacionados', () => {
    setup();
    expect(screen.queryByText(/more info in the dictionary|más información/i)).toBeNull();
    fireEvent.click(screen.getByText('氵'));
    expect(screen.getAllByText(/more info in the dictionary|más información/i).length).toBeGreaterThan(0);
  });

  it('el botón atrás llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /back to radicals/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
