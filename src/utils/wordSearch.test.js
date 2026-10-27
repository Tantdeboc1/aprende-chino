import { describe, expect, it } from 'vitest';
import { buildWordSearch, getWordSearchPool } from './wordSearch.js';
import source from '../../public/data/libro-data.json';

const catalog = source.lessons.flatMap(lesson => lesson.words);

describe('word search rounds', () => {
  it('uses distinct complete Chinese words from the app and excludes invalid entries', () => {
    const pool = getWordSearchPool([...catalog, { char: '一', meaning: 'uno' }, { char: '你好!', meaning: 'hola' }], 5);
    expect(pool.length).toBeGreaterThan(250);
    expect(new Set(pool.map(w => w.hanzi)).size).toBe(pool.length);
    expect(pool.every(w => w.hanzi.length >= 2 && w.hanzi.length <= 5 && /^[\u3400-\u9fff]+$/u.test(w.hanzi))).toBe(true);
    expect(getWordSearchPool([], 5)).toEqual([]);
  });
  it('generates solvable boards without overlap for real vocabulary', () => {
    for (const [size, count] of [[5, 2], [6, 3], [7, 4]]) {
      const pool = getWordSearchPool(catalog, size);
      for (let round = 0; round < 100; round++) {
        const { cells, words } = buildWordSearch(size, count, round, pool);
        const used = new Set();
        expect(cells).toHaveLength(size * size);
        expect(new Set(words.map(w => w.hanzi)).size).toBe(count);
        for (const word of words) {
          expect(word.path.map(i => cells[i]).join('')).toBe(word.hanzi);
          expect([1, size]).toContain(word.path[1] - word.path[0]);
          for (const index of word.path) {
            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThan(size * size);
            expect(used.has(index)).toBe(false);
            used.add(index);
          }
        }
      }
    }
  });
  it('cycles through all vocabulary before reusing a word and handles an insufficient pool', () => {
    const pool = getWordSearchPool(catalog, 5);
    const seen = new Set();
    for (let round = 0; round < Math.floor(pool.length / 2); round++) {
      for (const word of buildWordSearch(5, 2, round, pool).words) {
        expect(seen.has(word.hanzi)).toBe(false);
        seen.add(word.hanzi);
      }
    }
    expect(buildWordSearch(5, 4, 0, pool.slice(0, 3))).toBeNull();
  });
});
