import { useTranslation } from 'react-i18next';
import { loc } from '@/utils/loc.js';
import { getSentenceExplanation } from '@/utils/sentenceExplanation.js';

export default function AnswerExplanation({ item, incorrect = false }) {
  const { t, i18n } = useTranslation();
  if (!incorrect) return null;
  const detail = getSentenceExplanation(item);
  if (!detail) return null;
  return (
    <div className="rounded-xl border border-[var(--red)] bg-[var(--paper-hi)] p-4 space-y-2" aria-live="polite">
      <p className="font-semibold text-sm text-[var(--ink)]">{t('answer_explanation_title')}</p>
      {incorrect && item.answer && <p className="text-xs text-[var(--mute)]">{t('answer_explanation_context')}</p>}
      <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{loc(detail.explanation, i18n.language)}</p>
      {detail.example && (
        <div className="border-t border-[var(--hair)] pt-2">
          <p className="text-xs text-[var(--mute)]">{t('answer_explanation_example')}</p>
          <p className="font-cn text-[var(--ink)]">{detail.example.zh}</p>
          <p className="text-xs text-[var(--mute)]">{detail.example.pinyin}</p>
          <p className="text-sm text-[var(--ink-soft)]">{loc(detail.example.translation, i18n.language)}</p>
        </div>
      )}
    </div>
  );
}
