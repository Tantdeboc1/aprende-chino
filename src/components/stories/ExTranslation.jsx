// src/components/stories/ExTranslation.jsx
// Bloque 1: aparece una frase en chino del diálogo, elige traducción al español.

import { useTranslation } from 'react-i18next';
import QuizCard from './QuizCard.jsx';
import { shouldShowExercisePinyin } from '@/utils/storyDifficulty.js';
import { trField, baseLang } from '@/utils/loc.js';

export default function ExTranslation({ item, onAnswer }) {
  const { i18n } = useTranslation();
  const lang = baseLang(i18n.language);
  const showPinyin = shouldShowExercisePinyin();
  return (
    <QuizCard
      prompt={item.chino}
      subprompt={showPinyin ? item.pinyin : undefined}
      options={trField(item.opciones, item.opcionesTr, lang)}
      correcta={item.correcta}
      onAnswer={onAnswer}
      variant="normal"
    />
  );
}
