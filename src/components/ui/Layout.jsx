// src/components/ui/Layout.jsx
import { useEffect, useRef, useState, useCallback } from 'react';
import { J } from '@/styles/tokens';
import BottomNav from './BottomNav.jsx';
import GuidedTour from './GuidedTour.jsx';
import { MINIGAME_IDS } from '@/components/minigames/registry.js';
import { isTourPending } from '@/utils/tour.js';
import { useLocalSnapshot, bumpLocalDataRev } from '@/hooks/useLocalSnapshot.js';
import { useTranslation } from 'react-i18next';

// Tabs del BottomNav en orden izquierda→derecha. 'practice' es la pestaña que
// agrupa Destrezas e Historias; 'profile' incluye Amigos.
const NAV_TABS = ['home', 'review', 'practice', 'dictionary', 'profile'];
const PRACTICE_IDX = NAV_TABS.indexOf('practice');
const PROFILE_IDX  = NAV_TABS.indexOf('profile');

// Mapeo: pantalla activa → índice en NAV_TABS (para swipe)
function getTabIndex(screen) {
  const direct = NAV_TABS.indexOf(screen);
  if (direct !== -1) return direct;
  // Pantallas que "pertenecen" a un tab pero no están en el array
  if (['lesson-detail', 'intro-detail', 'exam', 'exercise'].includes(screen)) return 0; // home
  // Destrezas, historias y cualquier minijuego (+ examen global) → Practicar.
  if (screen === 'minigames' || screen === 'stories' || screen === 'daily') return PRACTICE_IDX;
  if (MINIGAME_IDS.has(screen) || screen === 'global-exam') return PRACTICE_IDX;
  if (screen === 'friends') return PROFILE_IDX;
  return -1; // swipe deshabilitado en esta pantalla
}

// Dirección de entrada de la pantalla nueva según la navegación:
//  - entre tabs distintos → desliza desde el lado hacia el que se navega
//    (coherente con el swipe: swipe izquierda = tab siguiente = entra por
//    la derecha)
//  - drill-in dentro del mismo tab (home → lección, menú → minijuego…) y
//    pantallas fuera de tabs (ajustes) → sube ligeramente
function getEnterOffset(fromScreen, toScreen) {
  const a = getTabIndex(fromScreen);
  const b = getTabIndex(toScreen);
  if (a !== -1 && b !== -1 && a !== b) {
    return b > a ? 'translateX(18px)' : 'translateX(-18px)';
  }
  return 'translateY(14px)';
}

export default function Layout({ children, activeScreen, onNavigate, hideNav, reviewDue = 0 }) {
  const { t } = useTranslation();
  const [saveStatus, setSaveStatus] = useState(() => (typeof navigator !== 'undefined' && !navigator.onLine ? 'disconnected' : null));
  const statusTimer = useRef(null);
  useEffect(() => {
    const update = (event) => {
      clearTimeout(statusTimer.current);
      setSaveStatus(event.detail);
      if (event.detail === 'saved' || event.detail === 'synced') statusTimer.current = setTimeout(() => setSaveStatus(null), 4000);
    };
    const offline = () => update({ detail: 'disconnected' });
    window.addEventListener('progress-save-status', update);
    window.addEventListener('offline', offline);
    return () => {
      clearTimeout(statusTimer.current);
      window.removeEventListener('progress-save-status', update);
      window.removeEventListener('offline', offline);
    };
  }, []);
  const saveLabels = {
    saved: t('progress_saved_local', 'Progreso guardado en este dispositivo'),
    syncing: t('progress_syncing', 'Guardado aquí · sincronizando…'),
    synced: t('progress_synced', 'Progreso sincronizado'),
    offline: t('progress_offline', 'Guardado aquí · sincronización pendiente'),
    disconnected: t('progress_disconnected', 'Sin conexión · tu progreso se guarda aquí'),
    error: t('progress_save_error', 'No se pudo guardar el progreso'),
  };
  // bumpLocalDataRev al cerrarlo hace que el Home vuelva a leer el estado y
  // destape racha y retos sin necesidad de recargar.
  const tourPending = useLocalSnapshot(isTourPending);
  const [visible, setVisible] = useState(false);
  const prevScreen = useRef(activeScreen);
  // Offset inicial de la transición en curso (solo transform+opacity → GPU).
  const enterOffset = useRef('translateY(14px)');

  // Swipe tracking
  const touchStart = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    if (prevScreen.current !== activeScreen) {
      enterOffset.current = getEnterOffset(prevScreen.current, activeScreen);
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

    // Sin barra de navegación visible (ejercicios, escritura, minijuegos,
    // modo historia…) tampoco debe navegar por gesto: hanzi-writer llama a
    // preventDefault() en sus listeners nativos, pero eso no detiene la
    // propagación — el touchend sigue burbujeando hasta aquí, y un trazo con
    // desplazamiento horizontal largo (habitual al dibujar) se confundía con
    // un swipe de cambio de pestaña y sacaba al usuario a mitad de trazo.
    if (hideNav) return;

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
  }, [activeScreen, onNavigate, hideNav]);

  return (
    <>
      {/* Landmark <main>: da a los lectores de pantalla un destino "contenido
          principal" en cada pantalla (la nav inferior es su propio <nav>). */}
      <main
        id="main-content"
        className="min-h-screen"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : enterOffset.current,
          // El bloque global de prefers-reduced-motion (index.css) fuerza
          // transition-duration:0.01ms con !important → esta transición se
          // neutraliza sola para quien pide menos movimiento.
          transition: 'opacity 180ms ease-out, transform 240ms cubic-bezier(0.22, 0.61, 0.36, 1)',
          background: J.paper,
          color: J.ink,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </main>
      {!hideNav && <BottomNav activeScreen={activeScreen} onNavigate={onNavigate} reviewDue={reviewDue} />}
      {saveStatus && <div role="status" className="fixed left-1/2 z-50 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full px-4 py-2 text-center text-xs font-semibold shadow-sm"
        style={{ bottom: hideNav ? 18 : 84, background: J.paperHi, color: saveStatus === 'error' ? J.redDeep : J.inkSoft, border: `1px solid ${J.hair}` }}>
        {saveLabels[saveStatus]}
      </div>}

      {/* El tutorial se monta aquí y no en App a propósito: Layout envuelve
          todas las pantallas reales (no el splash, el login ni el registro) y
          React lo mantiene montado al cambiar de pantalla, así que el tour no
          pierde el paso cuando el usuario toca una pestaña y navega. */}
      {tourPending && <GuidedTour onClose={bumpLocalDataRev} />}
    </>
  );
}
