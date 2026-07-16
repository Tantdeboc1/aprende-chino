// src/utils/arrayUtils.js
// Shared array utilities used across components

/**
 * Fisher-Yates shuffle — returns a new shuffled array, does not mutate the original.
 */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick n random unique items from an array.
 */
export function pickN(arr, n) {
  return shuffle(arr).slice(0, n);
}

/**
 * Pick `n` random items WITHOUT repeats while the pool lasts; only recycles
 * (reshuffling) when more items are requested than the pool has. Used by the
 * quizzes to choose the "protagonist" of each question without duplicates.
 */
export function pickCycle(arr, n) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const out = [];
  while (out.length < n) {
    out.push(...shuffle(arr).slice(0, n - out.length));
  }
  return out;
}
