// src/utils/useDelayedRun.js
// Programa un callback tras un delay y cancela cualquiera pendiente si se
// llama de nuevo o si el componente se desmonta antes de que dispare — el
// patrón "muestra el feedback un momento, luego avanza" que repetían varios
// minijuegos con un setTimeout suelto (sin cleanup, podía intentar hacer
// setState tras desmontar si el usuario salía a media transición).
import { useCallback, useRef, useEffect } from 'react';

export function useDelayedRun() {
  const idRef = useRef(null);
  useEffect(() => () => clearTimeout(idRef.current), []);
  return useCallback((cb, ms) => {
    clearTimeout(idRef.current);
    idRef.current = setTimeout(cb, ms);
  }, []);
}
