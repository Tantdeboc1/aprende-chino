// src/components/stories/ExComprehension.jsx
// Bloque 3: preguntas sobre lo que ocurrió en la historia.

import { useTranslation } from 'react-i18next';
import QuizCard from './QuizCard.jsx';
import { trField, baseLang } from '@/utils/loc.js';

export default function ExComprehension({ item, onAnswer }) {
  const { i18n } = useTranslation();
  const lang = baseLang(i18n.language);
  // Si las opciones son nombres chinos cortos, usar variant chinese; si no, normal.
  const isChinese = item.opciones.every(o => /^[一-鿿·\s]+$/.test(o));
  return (
    <QuizCard
      prompt={trField(item.pregunta, item.preguntaTr, lang)}
      options={trField(item.opciones, item.opcionesTr, lang)}
      correcta={item.correcta}
      onAnswer={onAnswer}
      variant={isChinese ? 'chinese' : 'normal'}
    />
  );
}
