import { describe, expect, it } from 'vitest';
import { generateRadicalQuestions } from './radicalQuestions.js';

describe('generateRadicalQuestions', () => {
  it('uses real examples and excludes related forms and shared examples', () => {
    const radicals = [
      { radical: '人', variants: ['亻'], examples: ['你'] },
      { radical: '亻', examples: ['你'] },
      { radical: '女', examples: ['好'] },
      { radical: '子', examples: ['好'] },
      { radical: '木', examples: ['林'] },
      { radical: '口', examples: ['吃'] },
      { radical: '水', examples: [] },
    ];
    const questions = generateRadicalQuestions(radicals, 50);
    expect(questions).toHaveLength(50);
    for (const question of questions) {
      expect(question.targetChar).not.toBe(question.correctAnswer);
      expect(new Set(question.options).size).toBe(4);
      if (question.correctAnswer === '人') expect(question.options).not.toContain('亻');
      if (question.correctAnswer === '女') expect(question.options).not.toContain('子');
      expect(question.correctAnswer).not.toBe('水');
    }
  });

  it('terminates when fewer than four safe choices exist', () => {
    expect(generateRadicalQuestions([{ radical: '人', examples: ['你'] }])).toEqual([]);
  });
});
