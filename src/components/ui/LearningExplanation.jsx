import { useTranslation } from 'react-i18next';
import { loc } from '@/utils/loc.js';
import text from '@/data/feedbackText.js';

// Sound discrimination is the only activity that uses this short contrast.
export default function LearningExplanation({ kind, tone, chosenTone, sound, chosen }) {
  const { t, i18n } = useTranslation();
  if (kind !== 'sound' || (tone === undefined && !sound)
    || (tone !== undefined && chosenTone === tone) || (sound && chosen === sound)) return null;
  const lang = i18n.language;
  const copy = (key) => loc(text[key], lang);
  const soundTip = ['b','p','d','t','g','k','j','q','zh','ch','z','c'].includes(sound) ? 'aspiration'
    : ['u','ü'].includes(sound) ? 'rounded'
    : ['sh','s','x','r'].includes(sound) ? 'retroflex'
    : ['m','n','l'].includes(sound) ? 'nasal'
    : ['f','h'].includes(sound) ? 'friction'
    : ({ a: 'vowelA', o: 'vowelO', e: 'vowelE', i: 'vowelI' })[sound];
  return <section aria-live="polite" className="my-3 rounded-xl border border-[var(--red)] bg-[var(--paper-hi)] p-4 text-left text-sm text-[var(--ink-soft)] space-y-2">
    <p className="font-semibold text-[var(--ink)]">{t('answer_explanation_title')}</p>
    {tone !== undefined && <p>{copy(`tone${tone === 5 ? 0 : tone}`)}</p>}
    {chosenTone !== undefined && chosenTone !== tone && <p>{copy('contrast')} {copy(`tone${chosenTone === 5 ? 0 : chosenTone}`)}</p>}
    {sound && <p><strong>{sound}</strong>{soundTip && <> — {copy(soundTip)}</>}</p>}
    {chosen && <p>{copy('chosen')}: <span className="font-cn">{chosen}</span></p>}
  </section>;
}
