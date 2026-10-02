import { useTranslation } from 'react-i18next';
import { loc } from '@/utils/loc.js';
import text from '@/data/feedbackText.js';
import LearningExplanation from './LearningExplanation.jsx';
import AnswerExplanation from '@/components/minigames/AnswerExplanation.jsx';
import AnswerCorrection from './AnswerCorrection.jsx';

export default function MistakeReview({ items = [] }) {
  const { i18n } = useTranslation();
  if (!items.length) return null;
  return <details className="my-4 text-left">
    <summary className="cursor-pointer font-semibold text-[var(--ink)]">{loc(text.review, i18n.language)} ({items.length})</summary>
    {items.map((item, index) => <div key={index}>
      <AnswerCorrection {...item} />
      {item.kind === 'sound' && <LearningExplanation {...item} />}
      {item.sentenceItem && <AnswerExplanation item={item.sentenceItem} incorrect />}
    </div>)}
  </details>;
}
