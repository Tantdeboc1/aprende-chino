// src/hooks/useExitAnimation.js
// Cierre animado para modales/sheets: mantiene el componente montado mientras
// dura la animación de salida y llama a onClose al terminar.
//
// Uso:
//   const { closing, requestClose } = useExitAnimation(onClose, 200);
//   - `closing` → aplicar la clase/estilos de salida cuando es true
//   - llamar a `requestClose()` en todos los triggers de cierre (backdrop,
//     Escape, botón ×…) en lugar de `onClose()`
//
// Con prefers-reduced-motion el desmontaje es inmediato (la animación CSS ya
// está neutralizada por index.css; esperar el timeout solo añadiría retardo).
import { useCallback, useEffect, useRef, useState } from 'react';

export function useExitAnimation(onClose, duration = 200) {
  const [closing, setClosing] = useState(false);
  const timerRef = useRef(null);
  // Ref para que requestClose sea estable aunque el consumidor pase un
  // onClose nuevo en cada render.
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const requestClose = useCallback(() => {
    setClosing(prev => {
      if (prev) return prev; // ya cerrándose: ignorar dobles clics
      const reduce = typeof window !== 'undefined'
        && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      timerRef.current = setTimeout(() => onCloseRef.current?.(), reduce ? 0 : duration);
      return true;
    });
  }, [duration]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { closing, requestClose };
}
