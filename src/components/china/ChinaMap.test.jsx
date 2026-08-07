// src/components/china/ChinaMap.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import ChinaMap from './ChinaMap.jsx';

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), speakChinese: vi.fn(), ...overrides };
  render(<ChinaMap {...props} />);
  return props;
}

afterEach(() => cleanup());

describe('ChinaMap', () => {
  it('arranca con Sichuan (四川) ya seleccionada en el panel', () => {
    setup();
    expect(screen.getAllByText('四川').length).toBeGreaterThan(0);
  });

  it('pulsar otra provincia en el mapa cambia la selección del panel', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /北京/ }));
    expect(screen.getAllByText('北京').length).toBeGreaterThan(0);
  });

  it('cerrar el panel deja el hint de "elige una provincia"', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /close|cerrar/i }));
    expect(screen.getByText(/pick a province|elige una provincia/i)).toBeTruthy();
  });

  it('el botón de escuchar llama a speakChinese con el nombre chino de la provincia', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /listen|escuchar/i }));
    expect(props.speakChinese).toHaveBeenCalledWith('四川');
  });

  it('tras cargar los textos del idioma, se muestra la gastronomía de la provincia', async () => {
    setup();
    // Los textos cargan de forma asíncrona (import dinámico real, no mockeado).
    await screen.findByText(/gastronomy|gastronomía/i);
  });

  it('el botón atrás llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /back|volver/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });

  it('sin goBack, no se muestra el botón atrás (pantalla embebida)', () => {
    setup({ goBack: undefined });
    expect(screen.queryByRole('button', { name: /back|volver/i })).toBeNull();
  });
});
