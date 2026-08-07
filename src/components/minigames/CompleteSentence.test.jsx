// src/components/minigames/CompleteSentence.test.jsx
// `shuffle` se mockea a identidad. Usa los datos reales de
// completeSentenceData.js: la 1ª entrada es "你___吗？" con answer "好" y
// options ['好','大','人','我'] — con shuffle=identidad la correcta cae en la
// posición 0 (coincidencia del propio dato, no garantía estructural del
// código como en otros minijuegos — si se reordena el dataset, ajustar aquí).
// El chunk es/*.js de i18next carga de forma diferida: las aserciones usan
// el texto en inglés (fallbackLng), que es el único disponible en jsdom.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import CompleteSentence from './CompleteSentence.jsx';

function start() {
  render(<CompleteSentence goBack={() => {}} selectedLesson={null} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
}

afterEach(() => cleanup());

describe('CompleteSentence', () => {
  it('ronda 1 ("你___吗？"): pulsar la opción correcta (好) suma acierto', () => {
    start();
    expect(screen.getByText('Are you ___?')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '好' }));
    expect(screen.getByText('✓ Correct!')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('pulsar una opción incorrecta falla y revela la frase completa', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: '大' }));

    expect(screen.getByText('✗ Incorrect')).toBeTruthy();
    expect(screen.getByText('你好吗？')).toBeTruthy();
  });

  it('tras el resultado, "Next" pasa a la ronda 2 (frase distinta)', () => {
    start();
    fireEvent.click(screen.getByRole('button', { name: '好' }));
    fireEvent.click(screen.getByRole('button', { name: /^next/i }));

    expect(screen.queryByText('Are you ___?')).toBeNull();
    expect(screen.getByText('___ am very busy.')).toBeTruthy();
  });
});
