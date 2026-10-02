import { describe, expect, it } from 'vitest';
import { buildStartingQuestions, startingRecommendation } from './startingGuide.js';

const characters = [
  { char: '你', meaning: 'you', lesson: 1 }, { char: '家', meaning: 'home', lesson: 3 },
  { char: '在', meaning: 'at', lesson: 6 }, { char: '人', meaning: 'person', lesson: 1 },
];
describe('starting orientation', () => {
  it('builds six questions with unique options, one correct answer and no supplementary words', () => {
    const questions = buildStartingQuestions([...characters, { char: '外', meaning: 'extra', lesson: 1, isSupplementary: true }]);
    expect(questions).toHaveLength(6);
    expect(questions.filter(q => q.skill === 'vocabulary')).toHaveLength(3);
    for (const q of questions) {
      expect(new Set(q.options).size).toBe(4);
      expect(q.options).toContain(q.answer);
      expect(q.prompt).not.toBe('外');
    }
  });
  it('recommends conservatively and does not skip basic gaps after lucky later answers', () => {
    const questions = buildStartingQuestions(characters);
    const answers = Object.fromEntries(questions.map(q => [q.id, q.answer]));
    expect(startingRecommendation(questions, {}).lesson).toBe(1);
    expect(startingRecommendation(questions, answers).lesson).toBe(6);
    expect(startingRecommendation(questions, { ...answers, 'grammar-3': null }).lesson).toBe(3);
    expect(startingRecommendation(questions, { ...answers, 'word-1': null }).lesson).toBe(1);
  });
  it('reports only the measured vocabulary and sentence samples', () => {
    const questions = buildStartingQuestions(characters);
    const result = startingRecommendation(questions, { 'word-1': 'you', 'grammar-1': '是' });
    expect(result.perSkill).toEqual({ vocabulary: { correct: 1, total: 3 }, grammar: { correct: 1, total: 3 } });
    expect(result.source).toBe('sample');
    expect(result).not.toHaveProperty('level');
  });
});
