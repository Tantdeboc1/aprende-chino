// src/components/ui/ConfettiCelebration.jsx
import { useState, useEffect, lazy, Suspense } from "react";
import { useWindowSize } from "@/hooks/useWindowSize.js";

// react-confetti es relativamente pesado (~30 kB). Lo cargamos dinámicamente
// — el chunk del consumidor (GlobalExam, mini-juegos…) ya no lo arrastra.
const Confetti = lazy(() => import("react-confetti"));

export default function ConfettiCelebration() {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!showConfetti) return null;

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
