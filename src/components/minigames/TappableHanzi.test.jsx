// src/components/minigames/TappableHanzi.test.jsx
// Smoke del tap-to-define: segmentación, popup centrado y palabra en horizontal.
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TappableHanzi from './TappableHanzi.jsx';

const dict = new Map([
  ['你好', { char: '你好', pinyin: 'nǐ hǎo', meaning: 'hola' }],
  ['我', { char: '我', pinyin: 'wǒ', meaning: 'yo' }],
]);

const t = (_k, def) => def;

describe('TappableHanzi', () => {
  it('segmenta por máxima coincidencia y marca las palabras conocidas', () => {
    const { container } = render(
      <TappableHanzi text="你好！我走。" dict={dict} maxLen={2} t={t} />,
    );
    // 你好 y 我 son clicables; 走 y la puntuación no.
    const clickables = [...container.querySelectorAll('span')].filter(s => s.style.cursor === 'pointer');
    expect(clickables.map(s => s.textContent)).toEqual(['你好', '我']);
  });

  it('al tocar una palabra abre la ficha centrada con pinyin y significado', () => {
    render(<TappableHanzi text="你好" dict={dict} maxLen={2} t={t} />);
    fireEvent.click(screen.getByText('你好'));
    expect(screen.getByText('nǐ hǎo')).toBeTruthy();
    expect(screen.getByText('hola')).toBeTruthy();
    // overlay centrado (no bottom-sheet)
    const overlay = document.querySelector('div[style*="fixed"]');
    expect(overlay.style.alignItems).toBe('center');
  });

  it('la palabra del popup fluye en horizontal (nowrap, sin ancho fijo)', () => {
    render(<TappableHanzi text="你好" dict={dict} maxLen={2} t={t} />);
    fireEvent.click(screen.getByText('你好'));
    // el chip es el elemento font-cn dentro del popup
    const chip = document.querySelector('div[style*="fixed"] .font-cn');
    expect(chip.style.whiteSpace).toBe('nowrap');
    expect(chip.style.width).toBe(''); // sin width fijo — se adapta a la palabra
  });

  it('el botón Cerrar cierra la ficha', () => {
    render(<TappableHanzi text="你好" dict={dict} maxLen={2} t={t} />);
    fireEvent.click(screen.getByText('你好'));
    fireEvent.click(screen.getByText('Cerrar'));
    expect(screen.queryByText('nǐ hǎo')).toBeNull();
  });
});
