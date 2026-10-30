// Each entry maps dialogue scenes to the corresponding illustrated panel.
const files = import.meta.glob('/src/assets/fondos/story/manga-t*-h*-*.webp', { eager: true, query: '?url', import: 'default' });
const sequence = {
  't1-h2': [1, 1, 1, 2, 3, 3, 3, 4, 4, 5],
  't2-h1': [1, 2, 3, 3, 3, 4, 4, 5, 6],
  't2-h2': [1, 3, 2, 4, 4, 5, 5, 6],
  't3-h1': [1, 3, 1, 1, 3, 4, 4, 5, 5],
  't3-h2': [2, 1, 4, 4, 5, 5, 6, 6],
  't4-h1': [1, 1, 4, 1, 4, 4, 2, 3, 3, 4],
  't4-h2': [1, 3, 3, 1, 2, 4, 5, 6],
  't5-h1': [2, 3, 3, 4, 5, 6],
  't5-h2': [1, 1, 3, 1, 5],
  't6-h1': [1, 2, 3, 4, 5],
  't6-h2': [2, 1, 3, 4, 5],
  't7-h1': [1, 2, 2, 3, 5],
  't7-h2': [1, 1, 2, 3, 5, 5],
  't8-h1': [1, 2, 2, 2, 3],
  't8-h2': [1, 1, 1, 1, 4, 2],
};

export function mangaPanelsFor(storyId) {
  return (sequence[storyId] || []).map(n => files[`/src/assets/fondos/story/manga-${storyId}-${n}.webp`]);
}

export function mangaCoverFor(storyId) {
  return mangaPanelsFor(storyId)[0];
}
