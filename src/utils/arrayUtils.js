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
