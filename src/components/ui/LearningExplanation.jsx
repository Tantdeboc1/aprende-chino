import WordExamples from '@/components/ui/WordExamples.jsx';
import { useTranslation } from 'react-i18next';
import { loc } from '@/utils/loc.js';
import text from '@/data/feedbackText.js';

function Word({ word, lang }) {
  const { t } = useTranslation();
  if (!word) return null;
  return <div className="space-y-1">
    <p><strong className="font-cn">{word.char || word.radical}</strong>{word.pinyin && <> · {word.pinyin}</>}{(loc(word.meanings, lang) || word.meaning) && <> · {loc(word.meanings, lang) || word.meaning}</>}</p>
    {word.radical && word.char && <p className="text-xs">{t('dictionary_radical')}: {word.radical}</p>}
    <WordExamples word={word} />
  </div>;
}

export default function LearningExplanation({ kind = 'word', word, chosenWord, tone, chosenTone, sound, chosen, answer, evidence, explanation }) {
  const { t, i18n } = useTranslation();
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
    {!(kind === 'word' && word && !explanation) && <p>{explanation || copy(kind)}</p>}
    {word && <Word word={word} lang={lang} />}
    {chosenWord && chosenWord.char !== word?.char && <><p>{copy('contrast')}</p><Word word={chosenWord} lang={lang} /></>}
    {tone !== undefined && <p>{copy(`tone${tone === 5 ? 0 : tone}`)}</p>}
    {chosenTone !== undefined && chosenTone !== tone && <p>{copy('contrast')} {copy(`tone${chosenTone === 5 ? 0 : chosenTone}`)}</p>}
    {sound && <p><strong>{sound}</strong>{soundTip && <> — {copy(soundTip)}</>}</p>}
    {chosen && <p>{copy('chosen')}: <span className="font-cn">{chosen}</span></p>}
    {answer && <p className="font-cn font-semibold text-[var(--ink)]">{answer}</p>}
    {evidence && <blockquote className="border-l-2 border-[var(--jade)] pl-3 whitespace-pre-line">{evidence}</blockquote>}
  </section>;
}
