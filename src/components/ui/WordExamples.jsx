import { useTranslation } from 'react-i18next';
import { getWordExamples } from '@/utils/wordExamples.js';
import { loc } from '@/utils/loc.js';

export default function WordExamples({ word, limit = 2 }) {
  const { t, i18n } = useTranslation();
  const examples = getWordExamples(word, i18n.language, limit);
  if (!examples.length) return null;
  return <div className="space-y-2 mt-2">
    <p className="text-xs font-semibold text-[var(--mute)]">{t('dictionary_examples')}</p>
    {examples.map(ex => <div key={ex.zh} className="rounded-lg bg-[var(--paper)] p-2 space-y-0.5">
      <p className="font-cn text-base text-[var(--ink)]">{ex.zh}</p>
      <p className="text-sm text-[var(--ink-soft)]">{ex.pinyin}</p>
      <p className="text-sm text-[var(--ink)]">{loc(ex.translation, i18n.language)}</p>
    </div>)}
  </div>;
}
