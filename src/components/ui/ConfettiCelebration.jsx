// src/components/ui/ConfettiCelebration.jsx
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

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
    <Confetti
      width={width}
      height={height}
      numberOfPieces={200}
      recycle={false}
    />
  );
}
