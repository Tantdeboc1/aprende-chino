// src/components/stories/storyBackgroundUrls.js
// Solo la resolución de URL de fondo por historia (sin los SVG de fallback
// por escenario, que son pesados). Separado de SceneBackground.jsx para que
// StoriesPage pueda precargar imágenes sin arrastrar ese código al chunk de
// la lista (SceneBackground/StoryPlayer siguen siendo lazy).
const STORY_BACKGROUNDS = import.meta.glob(
  '/src/assets/fondos/story/*.{webp,png}',
  { eager: true, query: '?url', import: 'default' }
);

export function backgroundByStoryId(storyId) {
  if (!storyId) return null;
  for (const ext of ['webp', 'png']) {
    const target = `/${storyId}.${ext}`;
    const entry = Object.entries(STORY_BACKGROUNDS).find(([path]) => path.endsWith(target));
    if (entry) return entry[1];
  }
  return null;
}
