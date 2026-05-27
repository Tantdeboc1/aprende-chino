// src/components/stories/ExTranslation.jsx
// Bloque 1: aparece una frase en chino del diálogo, elige traducción al español.

import QuizCard from './QuizCard.jsx';
import { shouldShowExercisePinyin } from '@/utils/storyDifficulty.js';

export default function ExTranslation({ item, onAnswer }) {
  const showPinyin = shouldShowExercisePinyin();
  return (
    <QuizCard
      prompt={item.chino}
      subprompt={showPinyin ? item.pinyin : undefined}
      options={item.opciones}
      correcta={item.correcta}
      onAnswer={onAnswer}
      variant="normal"
    />
  );
}
