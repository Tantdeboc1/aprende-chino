// src/components/ui/ConfettiCelebration.jsx
import { useState, useEffect, Suspense } from "react";
import { lazyWithRetry } from "@/utils/lazyWithRetry.js";
import { useMedia } from "react-use";
import { useWindowSize } from "@/hooks/useWindowSize.js";

// react-confetti es relativamente pesado (~30 kB). Lo cargamos dinámicamente
// — el chunk del consumidor (GlobalExam, mini-juegos…) ya no lo arrastra.
const Confetti = lazyWithRetry(() => import("react-confetti"));

export default function ConfettiCelebration() {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  // Accesibilidad: si el usuario pide reducir movimiento (WCAG 2.3.3), no
  // lanzamos el confetti animado (cientos de partículas en movimiento).
  const reduceMotion = useMedia("(prefers-reduced-motion: reduce)", false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (reduceMotion || !showConfetti) return null;

  return (
    <Suspense fallback={null}>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={200}
        recycle={false}
      />
    </Suspense>
  );
}
