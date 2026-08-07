// src/components/AchievementToast.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import '@/i18n';
import AchievementToast from './AchievementToast.jsx';

const ACHIEVEMENT = {
  title: { en: 'First Steps' },
  desc: { en: 'You did it' },
  icon: '🎉',
  zh: '成就',
};

beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame'] }));
afterEach(() => { cleanup(); vi.useRealTimers(); });

describe('AchievementToast', () => {
  it('muestra el título, la descripción y el icono del logro', () => {
    render(<AchievementToast achievement={ACHIEVEMENT} onClose={() => {}} />);
    expect(screen.getByText('First Steps')).toBeTruthy();
    expect(screen.getByText('You did it')).toBeTruthy();
    expect(screen.getByText('🎉')).toBeTruthy();
    expect(screen.getByText('成就')).toBeTruthy();
  });

  it('sin achievement, no renderiza nada', () => {
    const { container } = render(<AchievementToast achievement={null} onClose={() => {}} />);
    expect(container.textContent).toBe('');
  });

  it('pulsar el toast cierra tras la animación de salida (380ms)', () => {
    const onClose = vi.fn();
    render(<AchievementToast achievement={ACHIEVEMENT} onClose={onClose} />);
    fireEvent.click(screen.getByText('First Steps'));
    expect(onClose).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(380); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('se autocierra a los 4500ms sin interacción', () => {
    const onClose = vi.fn();
    render(<AchievementToast achievement={ACHIEVEMENT} onClose={onClose} />);
    act(() => { vi.advanceTimersByTime(4500 + 380); });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
