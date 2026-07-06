// src/components/ui/UpdateToast.test.jsx
// El toast de "nueva versión" aparece al avisar el SW y permite actualizar/cerrar.
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@/i18n'; // inicializa i18next (UpdateToast usa useTranslation)
import UpdateToast from './UpdateToast.jsx';
import { setNeedRefresh } from '@/utils/pwaUpdate.js';

describe('UpdateToast', () => {
  it('aparece al llegar el aviso y el botón dispara la actualización', () => {
    const update = vi.fn();
    render(<UpdateToast />);
    act(() => setNeedRefresh(update));

    const toast = screen.getByRole('status');
    expect(toast).toBeTruthy();
    // botón principal (no el de cerrar, que lleva aria-label)
    const buttons = toast.querySelectorAll('button');
    fireEvent.click(buttons[0]);
    expect(update).toHaveBeenCalledOnce();
  });

  it('el aviso no se pierde si llega antes de montar el componente', () => {
    const update = vi.fn();
    setNeedRefresh(update); // antes del render (SW rápido, React aún montando)
    render(<UpdateToast />);
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('✕ lo cierra sin actualizar', () => {
    const update = vi.fn();
    render(<UpdateToast />);
    act(() => setNeedRefresh(update));
    const toast = screen.getByRole('status');
    const closeBtn = toast.querySelector('button[aria-label]');
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('status')).toBeNull();
    expect(update).not.toHaveBeenCalled();
  });
});
