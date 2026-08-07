// src/components/minigames/FindIntruder.test.jsx
// Más allá del smoke (monta sin reventar): comprueba la lógica de acierto real
// — pulsar el intruso puntúa y pulsar cualquier otro no, revelando la
// respuesta correcta. `shuffle` se mockea a identidad para que las rondas
// (datos reales de intruderData.js) sean deterministas.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import FindIntruder from './FindIntruder.jsx';

function start() {
  render(<FindIntruder goBack={() => {}} selectedLesson={null} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => cleanup());

describe('FindIntruder', () => {
  it('ronda 1 (我/你/他/大): pulsar el intruso real (大) suma punto y muestra el acierto', () => {
    start();
    expect(screen.getByText('我')).toBeTruthy();
    expect(screen.getByText('大')).toBeTruthy();

    fireEvent.click(screen.getByText('大'));

    expect(screen.getByText('✓ Correct!')).toBeTruthy();
    // Marcador: 1 acierto de 8 rondas.
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('pulsar un carácter que NO es el intruso falla y revela cuál era', () => {
    start();
    fireEvent.click(screen.getByText('我')); // no es el intruso (大 sí lo es)

    expect(screen.getByText('✗ Incorrect')).toBeTruthy();
    expect(screen.getByText('The intruder was:')).toBeTruthy();
    // El carácter correcto (大) se muestra en el panel de feedback.
    expect(screen.getAllByText('大').length).toBeGreaterThan(0);
  });

  it('tras el resultado, la ronda 2 (好/忙/高/是) parte sin selección', () => {
    start();
    fireEvent.click(screen.getByText('大'));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(screen.getByText('好')).toBeTruthy();
    expect(screen.getByText('是')).toBeTruthy();
    expect(screen.queryByText('✓ Correct!')).toBeNull();
    expect(screen.queryByText('✗ Incorrect')).toBeNull();
  });

  it('pulsar una tarjeta tras ya haber respondido no cambia el resultado', () => {
    start();
    fireEvent.click(screen.getByText('大')); // acierto
    fireEvent.click(screen.getByText('我')); // ya hay resultado: no debe hacer nada

    expect(screen.getByText('✓ Correct!')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy(); // el marcador no ha bajado ni subido
  });
});
