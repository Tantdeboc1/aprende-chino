import { useTranslation } from 'react-i18next';
import { loc } from '@/utils/loc.js';
import text from '@/data/feedbackText.js';

// A correction gives the solution, without adding a lesson or examples.
export default function AnswerCorrection({ word, answer, chosen, chosenWord }) {
  const { i18n } = useTranslation();
  const wordText = value => value && [value.char || value.radical, value.pinyin,
    loc(value.meanings, i18n.language) || value.meaning].filter(Boolean).join(' · ');
  const solution = answer || wordText(word);
  if (!solution) return null;
  const attempt = chosen || wordText(chosenWord);
  return <div role="status" className="my-3 rounded-xl border border-[var(--red)] bg-[var(--paper-hi)] p-3 text-left text-sm">
    {attempt && <p className="text-[var(--mute)]">{loc(text.chosen, i18n.language)}: {attempt}</p>}
    <p className="text-[var(--ink)]"><span className="font-semibold">{loc(text.correctAnswer, i18n.language)}:</span> <span className="font-cn">{solution}</span></p>
  </div>;
}
