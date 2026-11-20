import { getStoryById } from '@/data/stories/index.js';
import { mangaPanelsFor } from '@/components/stories/mangaPanels.js';
import SpeakButton from '@/components/ui/SpeakButton.jsx';
import { PracticeOption } from '@/components/ui/PracticeControls.jsx';
import { loc, trField } from '@/utils/loc.js';

const heading = {
  es: 'Una escena de «{title}»',
  en: 'A scene from “{title}”',
  fr: 'Une scène de « {title} »',
  de: 'Eine Szene aus „{title}“',
  it: 'Una scena di «{title}»',
  pt: 'Uma cena de «{title}»',
};

const readStory = {
  es: 'Leer la historia completa', en: 'Read the full story',
  fr: 'Lire l’histoire complète', de: 'Die ganze Geschichte lesen',
  it: 'Leggi la storia completa', pt: 'Ler a história completa',
};

export default function LessonStoryPreview({ language, preview, onOpenStory }) {
  const story = getStoryById(preview.storyId);
  const sceneIndex = story.escenas.findIndex(({ id }) => id === preview.sceneId);
  const line = story.escenas[sceneIndex];
  const panel = mangaPanelsFor(story.id)[sceneIndex];
  const title = loc(heading, language).replace('{title}', () => loc(story.tituloTr, language));
  return (
    <section aria-labelledby="lesson-story-preview" className="overflow-hidden rounded-xl border border-[var(--hair)] bg-[var(--paper-hi)] sm:flex">
      <img src={panel} alt="" width="192" height="192"
        className="mx-auto block aspect-square w-44 shrink-0 self-center object-contain sm:mx-0 sm:w-48" />
      <div className="space-y-3 p-4 sm:self-center">
        <h2 id="lesson-story-preview" className="font-semibold">{title}</h2>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-cn text-xl" lang="zh-Hans">{line.chino}</p>
            <SpeakButton text={line.chino} size="md" />
          </div>
          <p className="text-sm text-[var(--ink-soft)]" lang="zh-Latn-pinyin">{line.pinyin}</p>
          <p className="text-sm">{trField(line.traduccion, line.traduccionTr, language)}</p>
        </div>
        <p className="text-sm font-medium">{loc(preview.question, language)}</p>
        {onOpenStory && (
          <PracticeOption className="w-full text-sm sm:w-auto" onClick={() => onOpenStory(story.id)}>
            {loc(readStory, language)} <span aria-hidden="true">→</span>
          </PracticeOption>
        )}
      </div>
    </section>
  );
}
