import { shuffle } from './arrayUtils.js';

const forms = radical => [radical.radical, ...(radical.variants || [])]
  .map(value => value.split(' ')[0])
  .filter(value => [...value].length === 1);

// Conservatively reject known shared examples and related forms as distractors.
export function generateRadicalQuestions(radicals, count = 10) {
  const candidates = radicals.flatMap(correct => (correct.examples || [])
    .filter(char => [...char].length === 1 && char !== correct.radical)
    .map(char => ({ correct, char })));
  const used = new Set();
  const questions = [];
  while (questions.length < count && candidates.length) {
    let available = candidates.filter(({ correct }) => !used.has(correct.radical));
    if (!available.length) { used.clear(); available = candidates; }
    const { correct, char } = available[Math.floor(Math.random() * available.length)];
    used.add(correct.radical);
    const correctForms = forms(correct);
    const distractors = shuffle(radicals.filter(other => {
      const otherForms = forms(other);
      return other.radical !== correct.radical &&
        !otherForms.some(form => correctForms.includes(form) || char.includes(form)) &&
        !(other.examples || []).includes(char);
    }));
    const options = [...new Set(distractors.map(item => item.radical))].slice(0, 3);
    if (options.length < 3) {
      candidates.splice(0, candidates.length, ...candidates.filter(item => item.correct.radical !== correct.radical));
      continue;
    }
    questions.push({ id: questions.length, targetChar: char, correctAnswer: correct.radical,
      options: shuffle([correct.radical, ...options]) });
  }
  return questions;
}
