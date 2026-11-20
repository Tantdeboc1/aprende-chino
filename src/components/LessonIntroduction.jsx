import { Suspense } from 'react';
import { loc } from '@/utils/loc.js';
import SpeakButton from '@/components/ui/SpeakButton.jsx';
import { PracticeNext } from '@/components/ui/PracticeControls.jsx';

const card = 'rounded-xl border border-[var(--hair)] bg-[var(--paper-hi)]';

export default function LessonIntroduction({
  language, opening, title, overview, connection, goals,
  vocabulary, examples, takeaway, path, vocabularyLabel, onVocabulary, children,
}) {
  const local = (value) => loc(value, language);
  return (
    <section className="space-y-4">
      {opening}
      <div className="space-y-2">
        <h2 className="text-lg font-bold">{local(title)}</h2>
        <p className="text-sm leading-relaxed">{local(overview)}</p>
        {connection && <p className="text-sm leading-relaxed">{local(connection)}</p>}
        <ul className="list-disc space-y-2 pl-5 text-sm">
          {goals.map((goal) => <li key={goal.es}>{local(goal)}</li>)}
        </ul>
      </div>
      {vocabulary && <p className="text-sm">{local(vocabulary)}</p>}
      <div className="space-y-2">
        {examples.map(({ heading, hanzi, parts, pinyin, translation, explanation }) => (
          <article key={hanzi} className={`${card} p-3 space-y-1`}>
            <h3 className="text-sm font-semibold">{local(heading)}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <p lang="zh-Hans" className="font-cn text-lg">
                {parts ? <>{parts[0]}<strong className="text-[var(--jade-deep)]">{parts[1]}</strong>{parts[2]}。</> : hanzi}
              </p>
              <SpeakButton text={hanzi} />
            </div>
            <p className="text-sm text-[var(--ink-soft)]" lang="zh-Latn-pinyin">{pinyin}</p>
            <p className="text-sm">{local(translation)}</p>
            <p className="text-sm leading-relaxed text-[var(--ink-soft)]">{local(explanation)}</p>
          </article>
        ))}
      </div>
      {takeaway && <p className="text-sm leading-relaxed">{local(takeaway)}</p>}
      <Suspense fallback={null}>{children}</Suspense>
      <p className="text-sm leading-relaxed">{local(path)}</p>
      <PracticeNext onClick={onVocabulary}>{vocabularyLabel} <span aria-hidden="true">→</span></PracticeNext>
    </section>
  );
}
