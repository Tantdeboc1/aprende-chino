// src/hooks/useCountUp.js
// Contador animado 0 → target con easing-out, para pantallas de resultados
// (puntuación, aciertos, XP…). Devuelve { value, done }:
//   - value: el número a pintar (entero)
//   - done:  true al llegar al final → útil para disparar un 'j-pop'
//
// Respeta prefers-reduced-motion devolviendo el valor final de inmediato.
import { useEffect, useRef, useState } from 'react';

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export function useCountUp(target, { duration = 600, delay = 120 } = {}) {
  const n = Number(target) || 0;
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || n === 0) {
      setValue(n);
      setDone(true);
      return undefined;
    }
    setValue(0);
    setDone(false);
    let start = null;
    const tick = (now) => {
      if (start === null) start = now + delay;
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      setValue(Math.round(easeOutCubic(t) * n));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [n, duration, delay]);

  return { value, done };
}
