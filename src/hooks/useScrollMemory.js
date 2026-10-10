import { useLayoutEffect, useRef } from 'react';

// Each destination remembers its own position. Wait for lazy content before
// restoring a long page, rather than clamping the position to the loader.
export function useScrollMemory(key, { enabled = true, positions } = {}) {
  const localPositions = useRef(new Map());
  const memory = positions || localPositions.current;

  useLayoutEffect(() => {
    if (!enabled) return;
    const top = memory.get(key) || 0;
    let restoring = true;
    let observer;
    let resizeObserver;
    let timer;
    const stopWaiting = () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
      clearTimeout(timer);
    };
    const save = () => {
      if (!restoring) memory.set(key, window.scrollY);
    };
    const finish = () => {
      window.scrollTo({ top, behavior: 'instant' });
      restoring = false;
      stopWaiting();
    };
    const tryRestore = () => {
      const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      if (top === 0 || height - window.innerHeight >= top) finish();
    };
    // A user gesture wins over a pending restoration.
    const interrupt = () => {
      if (!restoring) return;
      restoring = false;
      stopWaiting();
      save();
    };
    window.addEventListener('scroll', save, { passive: true });
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('keydown', interrupt);
    tryRestore();
    if (restoring) {
      observer = new MutationObserver(tryRestore);
      observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(tryRestore);
        resizeObserver.observe(document.body);
      }
      timer = setTimeout(finish, 2500);
    }
    return () => {
      stopWaiting();
      window.removeEventListener('scroll', save);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
      window.removeEventListener('keydown', interrupt);
    };
  }, [key, enabled, memory]);

  return memory;
}
