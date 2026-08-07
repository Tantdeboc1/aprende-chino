// src/components/learn/Characters/Matching.test.jsx
// Matching.jsx elige la muestra de parejas con su PROPIO pickN (Math.random()
// real, no importado de arrayUtils.js — no se puede mockear desde fuera sin
// tocar el componente), así que qué caracteres concretos salen en cada
// partida es aleatorio. En vez de asumir un orden, estos tests descubren en
// el DOM qué carácter salió y usan el pool completo (conocido) para saber
// cuál es su significado correcto — deterministas sin depender de la
// selección aleatoria.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import Matching from './Matching.jsx';

// 12 caracteres únicos (chars y meanings sin solapar entre sí) para que
// pickN(characters, min(6, floor(12/2)=6)) tenga de sobra donde elegir.
const CHARS = [
  { char: '一', meaning: 'uno' }, { char: '二', meaning: 'dos' },
  { char: '三', meaning: 'tres' }, { char: '四', meaning: 'cuatro' },
  { char: '五', meaning: 'cinco' }, { char: '六', meaning: 'seis' },
  { char: '七', meaning: 'siete' }, { char: '八', meaning: 'ocho' },
  { char: '九', meaning: 'nueve' }, { char: '十', meaning: 'diez' },
  { char: '百', meaning: 'cien' }, { char: '千', meaning: 'mil' },
];

function start(overrides = {}) {
  const props = { goBack: vi.fn(), characters: CHARS, onTrackSeen: vi.fn(), ...overrides };
  render(<Matching {...props} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
  return props;
}

/** Cuál de los 12 caracteres conocidos salió realmente en esta partida. */
function pickedChar() {
  return CHARS.find(c => screen.queryByText(c.char));
}

/** Otro carácter también presente en la partida, distinto del dado. */
function anotherPickedChar(exclude) {
  return CHARS.find(c => c.char !== exclude.char && screen.queryByText(c.meaning));
}

afterEach(() => cleanup());

describe('Matching (emparejar carácter-significado)', () => {
  it('arranca con 6 parejas (12 tarjetas) tras pulsar "Start Game"', () => {
    start();
    expect(screen.getByText('Pairs: 0/6')).toBeTruthy();
  });

  it('emparejar un carácter con su significado correcto lo marca como resuelto y avisa a onTrackSeen', () => {
    const props = start();
    const char = pickedChar();

    fireEvent.click(screen.getByText(char.char));
    fireEvent.click(screen.getByText(char.meaning));

    expect(props.onTrackSeen).toHaveBeenCalledWith(char);
    expect(screen.getByText('Pairs: 1/6')).toBeTruthy();
    expect(screen.getByText(char.char).closest('button').disabled).toBe(true);
  });

  it('emparejar con un significado que no corresponde no resuelve la pareja ni avisa', () => {
    const props = start();
    const char = pickedChar();
    const other = anotherPickedChar(char);

    fireEvent.click(screen.getByText(char.char));
    fireEvent.click(screen.getByText(other.meaning));

    expect(props.onTrackSeen).not.toHaveBeenCalled();
    expect(screen.getByText('Pairs: 0/6')).toBeTruthy();
    // Ninguna de las dos queda deshabilitada: no se dio por resuelta.
    expect(screen.getByText(char.char).closest('button').disabled).toBe(false);
  });

  it('pulsar dos veces la misma tarjeta la deselecciona sin resolver nada', () => {
    const props = start();
    const char = pickedChar();

    fireEvent.click(screen.getByText(char.char));
    fireEvent.click(screen.getByText(char.char));

    expect(props.onTrackSeen).not.toHaveBeenCalled();
    // Sigue disponible: un tercer click puede iniciar una selección nueva.
    fireEvent.click(screen.getByText(char.char));
    fireEvent.click(screen.getByText(char.meaning));
    expect(props.onTrackSeen).toHaveBeenCalledWith(char);
  });

  it('el botón "Reset" reinicia el progreso a 0/6', () => {
    start();
    const char = pickedChar();
    fireEvent.click(screen.getByText(char.char));
    fireEvent.click(screen.getByText(char.meaning));
    expect(screen.getByText('Pairs: 1/6')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(screen.getByText('Pairs: 0/6')).toBeTruthy();
  });

  it('el botón atrás de la pantalla de instrucciones llama a goBack', () => {
    const props = { goBack: vi.fn(), characters: CHARS, onTrackSeen: vi.fn() };
    render(<Matching {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
