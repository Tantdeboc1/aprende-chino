// src/components/CulturalTab.test.jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

const NOTES_BY_LESSON = vi.hoisted(() => ({
  1: [{ id: 'c1', emoji: '🏮', title: 'Red envelopes', content: '红包 are given during 春节 (Spring Festival).' }],
}));
vi.mock('@/utils/loadContent.js', () => ({ loadCulturalData: vi.fn().mockResolvedValue(NOTES_BY_LESSON) }));
vi.mock('@/components/ui/SpeakButton.jsx', () => ({ default: ({ text }) => <button>speak:{text}</button> }));

import CulturalTab from './CulturalTab.jsx';

afterEach(() => cleanup());

describe('CulturalTab', () => {
  it('muestra "Loading…" antes de que resuelva la carga', () => {
    render(<CulturalTab lessonNum={1} />);
    expect(screen.getByText('Loading…')).toBeTruthy();
  });

  it('carga las notas de la lección y expandir una muestra su contenido y el botón de audio', async () => {
    render(<CulturalTab lessonNum={1} />);
    fireEvent.click(await screen.findByText('Red envelopes'));
    expect(screen.getByText(/Spring Festival/)).toBeTruthy();
    expect(screen.getByText('speak:红包 春节')).toBeTruthy();
  });

  it('una lección sin notas culturales muestra el mensaje "coming soon"', async () => {
    render(<CulturalTab lessonNum={99} />);
    expect(await screen.findByText('Cultural notes coming soon.')).toBeTruthy();
  });
});
