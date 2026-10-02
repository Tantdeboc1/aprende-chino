import { useTranslation } from 'react-i18next';
import { loc } from '@/utils/loc.js';
import text from '@/data/feedbackText.js';

function Word({ word, lang }) {
  if (!word) return null;
  const examples = word.examples || [];
  return <div className="space-y-1">
    <p><strong className="font-cn">{word.char || word.radical}</strong>{word.pinyin && <> · {word.pinyin}</>}{(loc(word.meanings, lang) || word.meaning) && <> · {loc(word.meanings, lang) || word.meaning}</>}</p>
    {word.radical && word.char && <p className="text-xs">部首: {word.radical}</p>}
    {examples.slice(0, 2).map((ex, i) => <p key={i} className="text-sm">{typeof ex === 'string' ? ex : <>{ex.zh || ex.hanzi} {ex.pinyin} {loc(ex.translation || ex.translations, lang)}</>}</p>)}
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
  return <section aria-live="polite" className="my-3 rounded-xl border border-[var(--hair)] bg-[var(--paper-hi)] p-4 text-left text-sm text-[var(--ink-soft)] space-y-2">
    <p className="font-semibold text-[var(--ink)]">{t('answer_explanation_title')}</p>
    <p>{explanation || copy(kind)}</p>
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
