// src/utils/useKeyAnswers.js
// Accesibilidad de quizzes: responde con el teclado.
//   - Teclas 1..N eligen la opción correspondiente (cuando onSelect está activo).
//   - Enter pasa a la siguiente pregunta (cuando onNext está activo).
//   - Espacio dispara onSpace si se pasa (flashcards: voltear la tarjeta).
//
// El llamador activa/desactiva cada callback pasándolo o pasando null según la
// fase (p. ej. onSelect solo mientras no hay resultado; onNext solo con
// resultado). preventDefault() en Enter evita el doble disparo si un botón
// tiene el foco (el click nativo por Enter se genera en keydown).
import { useEffect } from 'react';

export function useKeyAnswers({ count = 0, onSelect, onNext, onSpace }) {
  useEffect(() => {
    if (!onSelect && !onNext && !onSpace) return;
    const onKey = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      const n = Number(e.key);
      if (onSelect && Number.isInteger(n) && n >= 1 && n <= count) {
        e.preventDefault();
        onSelect(n - 1);
      } else if (onNext && e.key === 'Enter') {
        e.preventDefault();
        onNext();
      } else if (onSpace && (e.key === ' ' || e.key === 'Spacebar')) {
        // preventDefault evita el scroll de la página y, si hay un botón
        // enfocado, el click nativo que Espacio genera al soltar.
        e.preventDefault();
        onSpace();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, onSelect, onNext, onSpace]);
}
