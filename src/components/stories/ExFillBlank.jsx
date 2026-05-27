// src/components/stories/ExFillBlank.jsx
// Bloque 2: frase con un hueco, elige el carácter correcto (en chino).

import QuizCard from './QuizCard.jsx';
import { shouldShowExercisePinyin } from '@/utils/storyDifficulty.js';

export default function ExFillBlank({ item, onAnswer }) {
  const showPinyin = shouldShowExercisePinyin();
  // En modo difícil/normal el subprompt se queda solo con la traducción;
  // en fácil mostramos pinyin + traducción.
  const subprompt = showPinyin
    ? `${item.pinyin}  ·  ${item.traduccion}`
    : item.traduccion;
  return (
    <QuizCard
      prompt={item.frase}
      subprompt={subprompt}
      options={item.opciones}
      correcta={item.correcta}
      onAnswer={onAnswer}
      variant="chinese"
    />
  );
}
