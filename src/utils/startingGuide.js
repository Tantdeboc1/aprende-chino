import completeSentenceData from '@/data/completeSentenceData.js';
import { shuffle } from './arrayUtils.js';

// Small orientation sample, not an exam or a placement certificate.
export function buildStartingQuestions(characters) {
  const pool = characters.filter(c => !c.isSupplementary && c.char && typeof c.meaning === 'string' && c.meaning);
  const questions = [];
  const sentences = ['他___老师。', '你家有___口人？', '图书馆___食堂北边。'];
  [1, 3, 6].forEach((lesson, i) => {
    const word = pool.find(c => c.lesson === lesson);
    if (word) {
      const alternatives = [...new Set(pool.filter(c => c.meaning !== word.meaning).map(c => c.meaning))].slice(0, 3);
      if (alternatives.length === 3) questions.push({ id: `word-${lesson}`, lesson, skill: 'vocabulary', prompt: word.char, answer: word.meaning, options: shuffle([word.meaning, ...alternatives]) });
    }
    const sentence = completeSentenceData.find(s => s.sentence === sentences[i]);
    questions.push({ id: `grammar-${lesson}`, lesson, skill: 'grammar', prompt: sentence.sentence, answer: sentence.answer, options: shuffle([...sentence.options]) });
  });
  return questions;
}

export function startingRecommendation(questions, answers) {
  const pairPassed = lesson => {
    const pair = questions.filter(q => q.lesson === lesson);
    return pair.length === 2 && pair.every(q => answers[q.id] === q.answer);
  };
  const lesson = !pairPassed(1) ? 1 : !pairPassed(3) ? 3 : 6;
  const perSkill = Object.fromEntries(['vocabulary', 'grammar'].map(skill => {
    const items = questions.filter(q => q.skill === skill);
    return [skill, { correct: items.filter(q => answers[q.id] === q.answer).length, total: items.length }];
  }));
  return { source: 'sample', lesson, perSkill, at: Date.now() };
}
