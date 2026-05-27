// src/data/stories/index.js
// Índice de historias. El orden define el desbloqueo secuencial.

import { storyT1H1 } from './story-t1-h1.js';
import { storyT1H2 } from './story-t1-h2.js';
import { storyT2H1 } from './story-t2-h1.js';
import { storyT2H2 } from './story-t2-h2.js';
import { storyT3H1 } from './story-t3-h1.js';
import { storyT3H2 } from './story-t3-h2.js';
import { storyT4H1 } from './story-t4-h1.js';
import { storyT4H2 } from './story-t4-h2.js';

export const STORIES = [
  storyT1H1,
  storyT1H2,
  storyT2H1,
  storyT2H2,
  storyT3H1,
  storyT3H2,
  storyT4H1,
  storyT4H2,
];

export const STORIES_BY_ID = Object.fromEntries(STORIES.map(s => [s.id, s]));

export function getStoryById(id) {
  return STORIES_BY_ID[id] || null;
}

export function getNextStoryId(currentId) {
  const idx = STORIES.findIndex(s => s.id === currentId);
  if (idx === -1 || idx >= STORIES.length - 1) return null;
  return STORIES[idx + 1].id;
}
