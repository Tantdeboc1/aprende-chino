// src/components/minigames/SOVGame.test.jsx
// Más allá del smoke: comprueba que la comprobación de la frase (`placed
// palabras unidas === current.sentence`) realmente distingue orden correcto
// de incorrecto. `shuffle` se mockea a identidad para que las rondas (datos
// reales de sovData.js) sean deterministas — ronda 1: "你好吗" / ['你','好','吗'].
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import SOVGame from './SOVGame.jsx';

function start(props = {}) {
  const speakChinese = vi.fn();
  render(<SOVGame goBack={() => {}} selectedLesson={null} speakChinese={speakChinese} {...props} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
  return { speakChinese };
}

/** Pulsa las palabras disponibles en el orden de textos dado. */
function pickWords(words) {
  for (const w of words) {
    fireEvent.click(screen.getAllByText(w).find(el => el.tagName === 'BUTTON'));
  }
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => cleanup());

describe('SOVGame', () => {
  it('ordenar las palabras en el orden correcto (你/好/吗) puntúa como acierto', () => {
    start();
    pickWords(['你', '好', '吗']);
    fireEvent.click(screen.getByRole('button', { name: /^check$/i }));

    expect(screen.getByText(/correct!/i)).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy(); // marcador
  });

  it('ordenar las palabras en un orden incorrecto falla y muestra la frase correcta', () => {
    start();
    pickWords(['好', '你', '吗']); // orden equivocado: "好你吗" ≠ "你好吗"
    fireEvent.click(screen.getByRole('button', { name: /^check$/i }));

    expect(screen.getByText(/incorrect/i)).toBeTruthy();
    expect(screen.getByText('你好吗')).toBeTruthy(); // frase correcta revelada
  });

  it('al fallar, se llama a speakChinese con la frase correcta', () => {
    const { speakChinese } = start();
    pickWords(['好', '你', '吗']);
    fireEvent.click(screen.getByRole('button', { name: /^check$/i }));

    expect(speakChinese).toHaveBeenCalledWith({ hanzi: '你好吗', pinyin: '' });
  });

  it('pulsar una palabra ya colocada la devuelve a la zona de disponibles', () => {
    start();
    fireEvent.click(screen.getAllByText('你').find(el => el.tagName === 'BUTTON'));
    // "你" ahora solo debería aparecer una vez (en la zona de respuesta).
    expect(screen.getAllByText('你')).toHaveLength(1);

    // Pulsarla de nuevo (ahora en la zona de respuesta) la devuelve a disponibles.
    fireEvent.click(screen.getByText('你'));
    expect(screen.getAllByText('你')).toHaveLength(1);

    // El botón "Check" está deshabilitado sin nada colocado.
    expect(screen.getByRole('button', { name: /^check$/i }).disabled).toBe(true);
  });

  it('el botón "Comprobar" está deshabilitado hasta colocar al menos una palabra', () => {
    start();
    expect(screen.getByRole('button', { name: /^check$/i }).disabled).toBe(true);
    fireEvent.click(screen.getAllByText('你').find(el => el.tagName === 'BUTTON'));
    expect(screen.getByRole('button', { name: /^check$/i }).disabled).toBe(false);
  });
});
