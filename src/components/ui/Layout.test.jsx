// src/components/ui/Layout.test.jsx
// Regresión: el swipe horizontal de <main> (cambia de pestaña) seguía activo
// aunque `hideNav` ocultara la barra de navegación (ejercicios, escritura,
// minijuegos, modo historia…). hanzi-writer llama a preventDefault() en sus
// listeners nativos, pero eso no detiene la propagación — el touchend seguía
// llegando al onTouchEnd de <main>, y un trazo de dibujo con desplazamiento
// horizontal largo (habitual al escribir un carácter) se confundía con un
// swipe de cambio de pestaña y sacaba al usuario a mitad de trazo.
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

vi.mock('@/context/AuthContext.jsx', () => ({
  useAuth: () => ({ mode: 'guest', user: null }),
}));

import Layout from './Layout.jsx';

function swipeLeft(container, { startX = 300, endX = 200, startY = 100, endY = 100 } = {}) {
  fireEvent.touchStart(container, { touches: [{ clientX: startX, clientY: startY }] });
  fireEvent.touchEnd(container, { changedTouches: [{ clientX: endX, clientY: endY }] });
}

afterEach(() => cleanup());

describe('Layout — swipe de navegación entre pestañas', () => {
  it('con la nav visible, un swipe horizontal largo navega a la pestaña siguiente', () => {
    const onNavigate = vi.fn();
    render(
      <Layout activeScreen="home" onNavigate={onNavigate} hideNav={false}>
        <div>contenido</div>
      </Layout>
    );
    swipeLeft(screen.getByText('contenido').closest('main'));
    expect(onNavigate).toHaveBeenCalledWith('review');
  });

  it('con hideNav (ejercicio, escritura, minijuego…), el mismo gesto NO navega', () => {
    const onNavigate = vi.fn();
    render(
      <Layout activeScreen="home" onNavigate={onNavigate} hideNav={true}>
        <div>contenido</div>
      </Layout>
    );
    swipeLeft(screen.getByText('contenido').closest('main'));
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('un trazo de dibujo (desplazamiento horizontal largo, como escribir un carácter) no navega con hideNav', () => {
    const onNavigate = vi.fn();
    render(
      <Layout activeScreen="home" onNavigate={onNavigate} hideNav={true}>
        <div>contenido</div>
      </Layout>
    );
    // Trazo diagonal largo típico de un carácter: 150px horizontales.
    swipeLeft(screen.getByText('contenido').closest('main'), { startX: 250, endX: 100, startY: 80, endY: 120 });
    expect(onNavigate).not.toHaveBeenCalled();
  });

  it('con hideNav, un gesto vertical (scroll) tampoco navega (ya lo ignoraba antes)', () => {
    const onNavigate = vi.fn();
    render(
      <Layout activeScreen="home" onNavigate={onNavigate} hideNav={false}>
        <div>contenido</div>
      </Layout>
    );
    fireEvent.touchStart(screen.getByText('contenido').closest('main'), { touches: [{ clientX: 200, clientY: 100 }] });
    fireEvent.touchEnd(screen.getByText('contenido').closest('main'), { changedTouches: [{ clientX: 210, clientY: 300 }] });
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
