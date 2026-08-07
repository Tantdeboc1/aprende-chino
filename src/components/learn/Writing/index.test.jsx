// src/components/learn/Writing/index.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';
import WritingMenu from './index.jsx';

function setup(overrides = {}) {
  const props = { goBack: vi.fn(), setWritingSection: vi.fn(), ...overrides };
  render(<WritingMenu {...props} />);
  return props;
}

afterEach(() => cleanup());

describe('WritingMenu', () => {
  it('elegir "汉字" llama a setWritingSection("hanzi")', () => {
    const props = setup();
    fireEvent.click(screen.getByText('汉字').closest('button'));
    expect(props.setWritingSection).toHaveBeenCalledWith('hanzi');
  });

  it('elegir "部首" llama a setWritingSection("radicals")', () => {
    const props = setup();
    fireEvent.click(screen.getByText('部首').closest('button'));
    expect(props.setWritingSection).toHaveBeenCalledWith('radicals');
  });

  it('el botón atrás llama a goBack', () => {
    const props = setup();
    fireEvent.click(screen.getByRole('button', { name: /learn/i }));
    expect(props.goBack).toHaveBeenCalledTimes(1);
  });
});
