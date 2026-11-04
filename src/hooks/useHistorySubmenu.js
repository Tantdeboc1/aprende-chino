import { useEffect } from 'react';

// Registra solo cambios de pantalla internos; el estado de actividad sigue
// siendo responsabilidad del componente que lo contiene.
export function useHistorySubmenu(key, value, setValue, screen) {
  useEffect(() => {
    const onPop = () => {
      const entry = history.state?.internalNavigation;
      if (entry?.screen === screen && entry.key === key && window.location.hash === `#/${screen}`) {
        setValue(entry.value);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [key, screen, setValue]);

  return next => {
    const entry = history.state?.internalNavigation;
    if (entry?.key === key && entry.screen === screen && entry.value !== null && (next === null || next === entry.parent)) {
      history.go(next === null ? -(entry.depth || 1) : -1);
      return;
    }
    if (next !== null && window.location.hash === `#/${screen}` && next !== value) {
      const current = entry?.key === key && entry.screen === screen
        ? { ...entry, value } : { screen, key, value, depth: 0 };
      history.replaceState({ ...history.state, internalNavigation: current }, '', window.location.href);
      history.pushState({ ...history.state, internalNavigation: { screen, key, value: next, parent: value, depth: (current.depth || 0) + 1 } }, '', window.location.href);
    }
    setValue(next);
  };
}
