import grammarData from '@/data/grammarData.js';
import { translationPhrases } from '@/data/translationPhrases.js';
import { loc } from './loc.js';

const normalize = zh => zh?.replace(/[\s。？！?!，,]/g, '') || '';
const soundKey = value => value?.toLowerCase().replace(/ü|u:/g, 'v').normalize('NFD').replace(/[\u0300-\u036f\s'’1-5]/g, '') || '';
const busyExamples = [
  { zh: '很忙', pinyin: 'hěn máng', translation: { es: 'Muy ocupado/a', en: 'Very busy', fr: 'Très occupé(e)', de: 'Sehr beschäftigt', it: 'Molto occupato/a', pt: 'Muito ocupado/a' } },
  { zh: '不忙', pinyin: 'bù máng', translation: { es: 'No estar ocupado/a', en: 'Not busy', fr: 'Ne pas être occupé(e)', de: 'Nicht beschäftigt', it: 'Non essere occupato/a', pt: 'Não estar ocupado/a' } },
];
const bank = [
  ...busyExamples,
  ...translationPhrases.map(s => ({ zh: s.hanzi, pinyin: s.pinyin, translation: s.translations, lesson: s.lesson })),
  ...Object.entries(grammarData).flatMap(([lesson, data]) => data.patterns.flatMap(p => [
    { zh: p.pattern, pinyin: p.pinyin, translation: p.translation, lesson: Number(lesson) },
    ...(p.examples || []).map(e => ({ ...e, lesson: Number(lesson) })),
  ])),
];

// Never present a bare Chinese fragment as a teaching example. Prefer the
// word's own examples, then complete examples from existing lesson content.
export function getWordExamples(word, lang, limit = 2) {
  if (!word?.char) return [];
  const supplied = (word.examples || []).map(ex => typeof ex === 'string'
    ? bank.find(e => normalize(e.zh) === normalize(ex))
    : { ...ex, zh: ex.zh || ex.hanzi, translation: ex.translation || ex.translations });
  const related = bank.filter(e => e.zh?.includes(word.char)
    && (!word.pinyin || soundKey(e.pinyin).includes(soundKey(word.pinyin)))).sort((a, b) =>
    Number(b.lesson === word.lesson) - Number(a.lesson === word.lesson) || a.zh.length - b.zh.length);
  const seen = new Set();
  return [...supplied, ...related].filter(ex => {
    if (!ex?.zh || !/^[\p{Script=Han}，。？！、,.!?“”‘’\s]+$/u.test(ex.zh)
      || !ex.pinyin || !loc(ex.translation, lang) || seen.has(normalize(ex.zh))) return false;
    seen.add(normalize(ex.zh));
    return true;
  }).slice(0, limit);
}
