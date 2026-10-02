// src/components/stories/ExFillBlank.jsx
// Bloque 2: frase con un hueco, elige el carácter correcto (en chino).

import { useTranslation } from 'react-i18next';
import QuizCard from './QuizCard.jsx';
import { shouldShowExercisePinyin } from '@/utils/storyDifficulty.js';
import { trField, baseLang } from '@/utils/loc.js';

export default function ExFillBlank({ item, onAnswer, lesson }) {
  const { i18n } = useTranslation();
  const lang = baseLang(i18n.language);
  const showPinyin = shouldShowExercisePinyin();
  const traduccion = trField(item.traduccion, item.traduccionTr, lang);
  // En modo difícil/normal el subprompt se queda solo con la traducción;
  // en fácil mostramos pinyin + traducción.
  const subprompt = showPinyin
    ? `${item.pinyin}  ·  ${traduccion}`
    : traduccion;
  return (
    <QuizCard
      prompt={item.frase}
      subprompt={subprompt}
      options={item.opciones}
      correcta={item.correcta}
      explanation={{ kind: 'sentence', answer: item.frase.replace('___', item.opciones[item.correcta]), evidence: item.pinyin + ' · ' + traduccion }}
      sentenceItem={{ sentence: item.frase, answer: item.opciones[item.correcta], lesson }}
      onAnswer={onAnswer}
      variant="chinese"
    />
  );
}
