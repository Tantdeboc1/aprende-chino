import { useEffect, useRef, useState, useCallback } from 'react';
import { J } from '@/styles/tokens';
import JNav from './JNav';

const NAV_TABS = ['home', 'learn', 'dict', 'profile'];

function getTabIndex(screen) {
  const direct = NAV_TABS.indexOf(screen);
  if (direct !== -1) return direct;
  if (['lesson-detail', 'intro-detail', 'exam', 'exercise', 'flashcard', 'tones', 'strokes', 'translate', 'review'].includes(screen)) return 0;
  return -1;
}

export default function JLayout({ children, activeScreen, onNavigate, hideNav = false }) {
  const [visible, setVisible] = useState(false);
  const prevScreen = useRef(activeScreen);
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
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (Math.abs(dx) < 60) return;
    const idx = getTabIndex(activeScreen);
    if (idx === -1) return;
    if (dx < 0 && NAV_TABS[idx + 1]) onNavigate(NAV_TABS[idx + 1]);
    if (dx > 0 && NAV_TABS[idx - 1]) onNavigate(NAV_TABS[idx - 1]);
  }, [activeScreen, onNavigate]);

  return (
    <>
      <div
        className="min-h-screen transition-opacity duration-150"
        style={{ background: J.paper, color: J.ink, opacity: visible ? 1 : 0 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
      {!hideNav && <JNav active={activeScreen} onNav={onNavigate} />}
    </>
  );
}
