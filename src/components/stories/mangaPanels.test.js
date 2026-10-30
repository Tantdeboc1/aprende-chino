import { describe, expect, it } from 'vitest';
import { STORIES } from '@/data/stories/index.js';
import { mangaCoverFor, mangaPanelsFor } from './mangaPanels.js';

describe('story manga panels', () => {
  it('provides a valid illustration for every scene of each adapted story', () => {
    for (const story of STORIES.filter(item => item.id !== 't1-h1')) {
      const panels = mangaPanelsFor(story.id);
      expect(panels, story.id).toHaveLength(story.escenas.length);
      expect(panels.every(Boolean), story.id).toBe(true);
      expect(mangaCoverFor(story.id), story.id).toBeTruthy();
    }
  });
});
