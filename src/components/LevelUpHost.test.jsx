// src/components/LevelUpHost.test.jsx
// LevelUpModal y AchievementToast se mockean a stubs mínimos: lo que se
// prueba aquí es la cola FIFO de subidas de nivel y el apilado/límite de
// logros al escuchar los eventos globales 'xp-notification' y
// 'achievement-unlocked', no la UI interna de esos dos componentes (que
// tienen sus propios tests).
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, act, fireEvent } from '@testing-library/react';
import '@/i18n';

vi.mock('./LevelUpModal.jsx', () => ({
  default: ({ levelUp, onClose }) => (
    <div>
      <span>LevelUp:{levelUp.level}</span>
      <button onClick={onClose}>close level</button>
    </div>
  ),
}));
vi.mock('./AchievementToast.jsx', () => ({
  default: ({ achievement, onClose, stackIndex }) => (
    <div>
      <span>Ach:{achievement.id}:{stackIndex}</span>
      <button onClick={onClose}>close {achievement.id}</button>
    </div>
  ),
}));

import LevelUpHost from './LevelUpHost.jsx';

function dispatchXP(detail) {
  act(() => { window.dispatchEvent(new CustomEvent('xp-notification', { detail })); });
}
function dispatchAchievement(achievements) {
  act(() => { window.dispatchEvent(new CustomEvent('achievement-unlocked', { detail: { achievements } })); });
}

afterEach(() => cleanup());

describe('LevelUpHost', () => {
  it('un xp-notification con levelUp muestra el modal y oculta los logros mientras esté activo', () => {
    render(<LevelUpHost />);
    dispatchXP({ levelUp: { level: 5 }, achievements: [{ id: 'a1' }] });
    expect(screen.getByText('LevelUp:5')).toBeTruthy();
    expect(screen.queryByText(/^Ach:/)).toBeNull();
  });

  it('cerrar el modal de nivel revela los logros que estaban en cola', () => {
    render(<LevelUpHost />);
    dispatchXP({ levelUp: { level: 5 }, achievements: [{ id: 'a1' }] });
    fireEvent.click(screen.getByRole('button', { name: 'close level' }));
    expect(screen.queryByText('LevelUp:5')).toBeNull();
    expect(screen.getByText('Ach:a1:0')).toBeTruthy();
  });

  it('achievement-unlocked apila logros sin modal de nivel de por medio', () => {
    render(<LevelUpHost />);
    dispatchAchievement([{ id: 'b1' }]);
    expect(screen.getByText('Ach:b1:0')).toBeTruthy();
  });

  it('solo se muestran como máximo 3 logros a la vez', () => {
    render(<LevelUpHost />);
    dispatchAchievement([{ id: 'c1' }, { id: 'c2' }, { id: 'c3' }, { id: 'c4' }]);
    expect(screen.getByText('Ach:c1:0')).toBeTruthy();
    expect(screen.getByText('Ach:c3:2')).toBeTruthy();
    expect(screen.queryByText(/^Ach:c4/)).toBeNull();
  });

  it('cerrar un logro concreto lo quita de la pila', () => {
    render(<LevelUpHost />);
    dispatchAchievement([{ id: 'd1' }, { id: 'd2' }]);
    fireEvent.click(screen.getByRole('button', { name: 'close d1' }));
    expect(screen.queryByText(/^Ach:d1/)).toBeNull();
    expect(screen.getByText('Ach:d2:0')).toBeTruthy();
  });
});
