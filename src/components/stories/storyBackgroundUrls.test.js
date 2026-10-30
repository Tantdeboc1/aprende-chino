import { describe, expect, it } from 'vitest';
import { STORIES } from '@/data/stories/index.js';
import { backgroundByStoryId } from './storyBackgroundUrls.js';

describe('story backgrounds', () => {
  it('provides a dedicated image for every story', () => {
    for (const story of STORIES) {
      expect(backgroundByStoryId(story.id), story.id).toContain(`${story.id}.webp`);
    }
  });
});
