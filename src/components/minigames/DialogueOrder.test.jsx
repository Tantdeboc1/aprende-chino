// src/components/minigames/DialogueOrder.test.jsx
// `shuffle` se mockea a identidad: tanto la selección de rondas como el orden
// de líneas disponibles quedan en el orden original de dialogueOrderData.js.
// Ronda 1 (lección 1, diálogo "¿Cómo estás?"): líneas en orden correcto
// id 0..3 = '你好！' / '你好！你好吗？' / '我很好，谢谢！你呢？' / '我也很好。'
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: (arr) => arr }));

import DialogueOrder from './DialogueOrder.jsx';

function start() {
  render(<DialogueOrder goBack={() => {}} selectedLesson={null} />);
  fireEvent.click(screen.getByRole('button', { name: /start game/i }));
}

afterEach(() => cleanup());

describe('DialogueOrder', () => {
  it('colocar las líneas en el orden correcto y pulsar Check suma acierto', () => {
    start();
    fireEvent.click(screen.getByText('你好！'));
    fireEvent.click(screen.getByText('你好！你好吗？'));
    fireEvent.click(screen.getByText('我很好，谢谢！你呢？'));
    fireEvent.click(screen.getByText('我也很好。'));

    fireEvent.click(screen.getByRole('button', { name: /^check$/i }));
    expect(screen.getByText('✓ Correct!')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('colocar las líneas en orden incorrecto revela el orden correcto con pinyin', () => {
    start();
    // Orden invertido: incorrecto salvo coincidencia casual en el medio.
    fireEvent.click(screen.getByText('我也很好。'));
    fireEvent.click(screen.getByText('我很好，谢谢！你呢？'));
    fireEvent.click(screen.getByText('你好！你好吗？'));
    fireEvent.click(screen.getByText('你好！'));

    fireEvent.click(screen.getByRole('button', { name: /^check$/i }));
    expect(screen.getByText('✗ Incorrect')).toBeTruthy();
    expect(screen.getByText((_, el) => el?.textContent === '(Nǐ hǎo!)')).toBeTruthy();
  });

  it('tras acertar, "Next" pasa a la ronda 2 (diálogo distinto)', () => {
    start();
    fireEvent.click(screen.getByText('你好！'));
    fireEvent.click(screen.getByText('你好！你好吗？'));
    fireEvent.click(screen.getByText('我很好，谢谢！你呢？'));
    fireEvent.click(screen.getByText('我也很好。'));
    fireEvent.click(screen.getByRole('button', { name: /^check$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^next/i }));

    expect(screen.queryByText('你好！')).toBeNull();
    expect(screen.getByText('你忙吗？')).toBeTruthy();
  });

  it('el botón atrás de la intro llama a goBack', () => {
    const goBack = vi.fn();
    render(<DialogueOrder goBack={goBack} selectedLesson={null} />);
    fireEvent.click(screen.getByRole('button', { name: /back to skills/i }));
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
