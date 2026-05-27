// src/components/stories/ExComprehension.jsx
// Bloque 3: preguntas sobre lo que ocurrió en la historia.

import QuizCard from './QuizCard.jsx';

export default function ExComprehension({ item, onAnswer }) {
  // Si las opciones son nombres chinos cortos, usar variant chinese; si no, normal.
  const isChinese = item.opciones.every(o => /^[一-鿿·\s]+$/.test(o));
  return (
    <QuizCard
      prompt={item.pregunta}
      options={item.opciones}
      correcta={item.correcta}
      onAnswer={onAnswer}
      variant={isChinese ? 'chinese' : 'normal'}
    />
  );
}
