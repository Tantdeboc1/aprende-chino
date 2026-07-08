// src/components/minigames/LessonFilterBar.jsx
// Barra de filtro por lección compartida por los minijuegos.
// Antes cada juego repetía este mismo bloque (chip "Todas" + L1..Ln); se
// extrajo aquí para evitar la duplicación. El color del chip activo "Todas"
// varía por juego (jade o rojo), de ahí el prop `allAccentClass`.
import { useTranslation } from 'react-i18next';
import { LESSON_COLORS, LESSON_NUMBERS } from '@/styles/lessonColors.js';

const INACTIVE =
  'bg-[var(--paper-hi)] text-[var(--mute)] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]';

export default function LessonFilterBar({
  value,
  onChange,
  allAccentClass = 'bg-[var(--red)]',
  dense = false,
}) {
  const { t } = useTranslation();
  const chip = `${dense ? 'px-2.5' : 'px-3'} py-1 rounded-lg text-xs font-semibold border transition-colors`;
  return (
    <div className={`flex ${dense ? 'gap-1.5' : 'gap-2'} flex-wrap`}>
      <button
        onClick={() => onChange(null)}
        className={`${chip} ${value === null ? `${allAccentClass} text-[var(--on-accent)] border-transparent` : INACTIVE}`}
      >
        {t('sov_all_lessons')}
      </button>
      {LESSON_NUMBERS.map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`${chip} ${value === n ? `${LESSON_COLORS[n].bg} text-[var(--on-accent)] border-transparent` : INACTIVE}`}
        >
          L{n}
        </button>
      ))}
    </div>
  );
}
