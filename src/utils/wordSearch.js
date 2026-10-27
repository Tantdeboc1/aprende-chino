// Use the app vocabulary as the source of truth. Single characters make a
// word search trivial; punctuation and spaces cannot be placed in one cell.
export function getWordSearchPool(characters, size) {
  const unique = new Map();
  for (const item of characters || []) {
    const hanzi = typeof item.char === 'string' ? item.char.trim() : '';
    const length = Array.from(hanzi).length;
    if (length < 2 || length > size || !/^[\u3400-\u9fff]+$/u.test(hanzi) || !item.meaning || unique.has(hanzi)) continue;
    unique.set(hanzi, { hanzi, pinyin: item.pinyin || '', meaning: item.meaning });
  }
  return [...unique.values()];
}

function generator(seed) {
  let value = seed >>> 0;
  return () => { value = (Math.imul(value, 1664525) + 1013904223) >>> 0; return value / 4294967296; };
}

function shuffled(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function buildWordSearch(size, count, round, pool) {
  if (pool.length < count) return null;
  // One stable permutation: cycle through the entire catalogue before reuse.
  const vocabulary = shuffled(pool, generator(size * 97 + count));
  const selected = Array.from({ length: count }, (_, i) => vocabulary[(round * count + i) % vocabulary.length]);
  const random = generator((round + 1) * 7919 + size * 97 + count);
  const occupied = new Set();
  const placements = new Array(count);
  // Place long words first, backtracking if a random arrangement blocks a word.
  const order = selected.map((word, index) => ({ word, index })).sort((a, b) => b.word.hanzi.length - a.word.hanzi.length);
  function place(position) {
    if (position === order.length) return true;
    const { word, index } = order[position];
    const length = Array.from(word.hanzi).length;
    const candidates = [];
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) {
      for (const [dr, dc] of [[0, 1], [1, 0]]) {
        if (r + dr * (length - 1) >= size || c + dc * (length - 1) >= size) continue;
        const path = Array.from({ length }, (_, j) => (r + dr * j) * size + c + dc * j);
        if (path.every(cell => !occupied.has(cell))) candidates.push(path);
      }
    }
    for (const path of shuffled(candidates, random)) {
      path.forEach(cell => occupied.add(cell));
      placements[index] = path;
      if (place(position + 1)) return true;
      path.forEach(cell => occupied.delete(cell));
    }
    return false;
  }
  if (!place(0)) return null;
  const filler = Array.from(new Set(pool.flatMap(word => Array.from(word.hanzi))));
  const cells = Array.from({ length: size * size }, () => filler[Math.floor(random() * filler.length)]);
  const words = selected.map((word, i) => {
    const path = placements[i];
    path.forEach((cell, j) => { cells[cell] = Array.from(word.hanzi)[j]; });
    return { ...word, path };
  });
  return { cells, words };
}
