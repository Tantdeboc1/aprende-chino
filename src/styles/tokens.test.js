import { describe, expect, it } from 'vitest';
import { resolveColor } from './tokens.js';

describe('resolveColor', () => {
  it('nunca devuelve una variable CSS sin resolver', () => {
    expect(resolveColor('var(--jade)')).not.toBe('var(--jade)');
    expect(resolveColor('var(--jade)')).toMatch(/^(#|rgb|hsl)/);
  });

  it('conserva colores literales', () => {
    expect(resolveColor('#123456')).toBe('#123456');
  });
});
