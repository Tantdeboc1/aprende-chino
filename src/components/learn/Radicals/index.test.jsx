// src/components/learn/Radicals/index.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import RadicalsIndex from './index.jsx';

const RADICALS = [
  { radical: '氵', strokeCount: 3, examples: ['河', '海'] },
  { radical: '亻', strokeCount: 2, examples: ['你'] },
  { radical: '木', strokeCount: 3, examples: ['林', '森', '本'] },
];

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), setRadicalSection: vi.fn(), radicals: RADICALS, ...overrides };
  render(<RadicalsIndex {...props} />);
  return props;
}

afterEach(() => cleanup());

describe('RadicalsIndex', () => {
  it('calcula las estadísticas (radicales, ejemplos, trazos distintos) a partir del catálogo', () => {
    setup();
    expect(screen.getByText('3')).toBeTruthy(); // 3 radicales
    expect(screen.getByText('6')).toBeTruthy(); // 2+1+3 ejemplos
    expect(screen.getByText('2')).toBeTruthy(); // trazos distintos: {3,2}
  });

  it('cada tarjeta navega a su sección', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /theory|teoría/i }));
    expect(props.setRadicalSection).toHaveBeenCalledWith('theory');

    fireEvent.click(screen.getByRole('button', { name: /quiz.*1|identif/i }));
    expect(props.setRadicalSection).toHaveBeenCalledWith('quiz1');

    fireEvent.click(screen.getByRole('button', { name: /quiz.*2|meaning/i }));
    expect(props.setRadicalSection).toHaveBeenCalledWith('quiz2');
  });

  it('el botón atrás llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /back|volver/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
