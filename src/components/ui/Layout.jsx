// src/components/ui/Layout.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { J } from '@/styles/tokens';
import BottomNav from './BottomNav.jsx';
import { MINIGAME_IDS } from '@/components/minigames/registry.js';

// Tabs del BottomNav en orden izquierda→derecha
const NAV_TABS = ['home', 'review', 'stories', 'dictionary', 'minigames', 'profile'];

// Mapeo: pantalla activa → índice en NAV_TABS (para swipe)
function getTabIndex(screen) {
  const direct = NAV_TABS.indexOf(screen);
  if (direct !== -1) return direct;
  // Pantallas que "pertenecen" a un tab pero no están en el array
  if (['lesson-detail', 'intro-detail', 'exam', 'exercise'].includes(screen)) return 0; // home
  // Cualquier minijuego del registro (+ examen global) pertenece al tab juegos.
  if (MINIGAME_IDS.has(screen) || screen === 'global-exam') return 4; // minigames
  return -1; // swipe deshabilitado en esta pantalla
}

export default function Layout({ children, activeScreen, onNavigate, hideNav }) {
  const [visible, setVisible] = useState(false);
  const prevScreen = useRef(activeScreen);

  // Swipe tracking
  const touchStart = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    if (prevScreen.current !== activeScreen) {
      setVisible(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      prevScreen.current = activeScreen;
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(true);
    }
  }, [activeScreen]);

  const handleTouchStart = useCallback((e) => {
    touchStart.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStart.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStart.current;
    const dy = e.changedTouches[0].clientY - (touchStartY.current ?? 0);
    touchStart.current = null;
    touchStartY.current = null;

    // Ignorar si el gesto es más vertical que horizontal
    if (Math.abs(dy) > Math.abs(dx)) return;
    // Mínimo 60px de desplazamiento horizontal
    if (Math.abs(dx) < 60) return;

    const idx = getTabIndex(activeScreen);
    if (idx === -1) return;

    if (dx < 0) {
      // Swipe izquierda → tab siguiente
      const next = NAV_TABS[idx + 1];
      if (next) onNavigate(next);
    } else {
      // Swipe derecha → tab anterior
      const prev = NAV_TABS[idx - 1];
      if (prev) onNavigate(prev);
    }
  }, [activeScreen, onNavigate]);

  return (
    <>
      <div
        className="min-h-screen transition-opacity duration-150 mx-auto"
        style={{
          opacity: visible ? 1 : 0, background: J.paper, color: J.ink,
          // En móvil ocupa todo el ancho; en pantallas grandes se limita y
          // centra (mismo ancho que los botones de BottomNav, max-w-lg=512px)
          // para no estirar tarjetas y cabeceras de borde a borde en desktop.
          maxWidth: 512,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
      {!hideNav && <BottomNav activeScreen={activeScreen} onNavigate={onNavigate} />}
    </>
  );
}
