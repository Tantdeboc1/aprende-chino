// src/components/stories/StoriesPage.jsx
// Listado de historias con estado bloqueada/disponible/completada.
// Guarda el resultado al terminar una historia.

import { useState, useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import ProfileBadge from '@/components/ui/ProfileBadge.jsx';
import { STORIES, getStoryById } from '@/data/stories/index.js';
import {
  loadStoryProgress,
  recordStoryResult,
  getAllStatuses,
} from '@/utils/storyProgress.js';
import { markWordSeen } from '@/utils/progress.js';

// StoryPlayer arrastra mucho código (escenarios, diálogos, ejercicios). Solo
// se necesita al reproducir una historia concreta — el listado no lo usa.
// Lazy lo saca del chunk de StoriesPage (que pasa de 85 kB a ~15 kB).
const StoryPlayer = lazy(() => import('./StoryPlayer.jsx'));

// Al terminar una historia, marca los caracteres del vocabularioObjetivo
// como "vistos" en la lección a la que pertenecen — así el progreso de
// historias también empuja el progreso de lecciones (antes eran sistemas
// totalmente independientes).
function markStoryVocabInLessons(story, lessonProgress, allCharacters) {
  if (!story?.vocabularioObjetivo?.length || !allCharacters?.length) {
    return lessonProgress;
  }
  let updated = lessonProgress;
  for (const char of story.vocabularioObjetivo) {
    // Buscar en qué lección está la palabra. Si no se encuentra, usar
    // story.tema como fallback (las historias suelen alinearse 1:1 con
    // un tema/lección concreta).
    const found = allCharacters.find(c => c.char === char);
    const lessonNum = found?.lesson || story.tema;
    if (lessonNum) {
      updated = markWordSeen(updated, lessonNum, char);
    }
  }
  return updated;
}

const ACCENTS = [
  { border: J.red,  bar: J.red,  text: J.redDeep,  icon: J.redBg  },
  { border: J.sand, bar: J.sand, text: J.sandDeep, icon: J.sandBg },
  { border: J.jade, bar: J.jade, text: J.jadeDeep, icon: J.jadeBg },
  { border: J.sand, bar: J.sand, text: J.sandDeep, icon: J.sandBg2 },
];

export default function StoriesPage({
  userName,
  speak,
  progress: lessonProgress,           // progreso de lecciones (vino de App)
  onProgressChange,                   // setter del progreso de lecciones
  allCharacters,                      // para mapear vocab → lección
}) {
  const { t } = useTranslation();
  const [activeStoryId, setActiveStoryId] = useState(null);
  const [storyProgress, setStoryProgress] = useState(() => loadStoryProgress());
  // Metadata del último resultado (XP, primera vez, etc.) — viaja al player
  // para que StoryResults lo muestre. Se resetea al salir del player.
  const [lastResultMeta, setLastResultMeta] = useState(null);
  const statuses = getAllStatuses(storyProgress);
  const activeStory = activeStoryId ? getStoryById(activeStoryId) : null;

  // Recargar progreso si cambia (e.g. al volver al mapa tras completar)
  useEffect(() => {
    if (!activeStory) setStoryProgress(loadStoryProgress());
  }, [activeStory]);

  const handleStoryFinish = ({ score, total }) => {
    if (!activeStoryId) return;
    const story = getStoryById(activeStoryId);
    const { progress: updated, xpGanado, isFirstTime } =
      recordStoryResult(activeStoryId, score, total);
    setStoryProgress(updated);
    setLastResultMeta({ xpGanado, isFirstTime });

    // Empuja también el progreso de lecciones: marca el vocabulario de
    // la historia como "visto" en las lecciones correspondientes.
    if (story && onProgressChange) {
      const nextLessonProgress = markStoryVocabInLessons(
        story, lessonProgress || {}, allCharacters || []
      );
      onProgressChange(nextLessonProgress);
    }
  };

  const handleExitFromPlayer = () => {
    setActiveStoryId(null);
    setLastResultMeta(null);
  };

  if (activeStory) {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm" style={{ background: J.paper, color: J.mute }}>{t('common_loading', 'Cargando…')}</div>}>
        <StoryPlayer
          story={activeStory}
          userName={userName}
          speak={speak}
          onExit={handleExitFromPlayer}
          onFinish={handleStoryFinish}
          resultMeta={lastResultMeta}
        />
      </Suspense>
    );
  }

  // Stats agregadas
  const completadas = STORIES.filter(s => statuses[s.id] === 'completada').length;
  const total = STORIES.length;

  return (
    <div className="min-h-screen pb-24" style={{ background: J.paper }}>
      {/* Header */}
      <div style={{
        background: J.jade, color: J.onAccent,
        borderLeft: `4px solid ${J.jadeDeep}`,
        padding: '40px 16px 18px',
      }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="font-cn w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: J.red, color: J.onAccent, fontWeight: 700, fontSize: 14 }}>
              故
            </div>
            <span className="font-bold text-base" style={{ color: J.onAccent }}>Historias</span>
          </div>
          <ProfileBadge variant="dark" />
        </div>
        <div className="mt-3">
          <h1 className="text-xl font-bold" style={{ color: J.onAccent }}>
            Aprende en contexto
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            故事 · {completadas} de {total} {completadas === 1 ? 'completada' : 'completadas'}
          </p>
        </div>
        {/* Mini progreso global */}
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${total > 0 ? (completadas / total) * 100 : 0}%`, background: J.butter }} />
        </div>
      </div>

      {/* Lista */}
      <div className="px-4 pt-5 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: J.mute }}>
            Mapa de historias
          </p>

          <div className="space-y-3">
            {STORIES.map((s, i) => {
              const status = statuses[s.id];
              const accent = ACCENTS[(s.tema - 1) % ACCENTS.length];
              const data = storyProgress[s.id];
              return (
                <StoryCard
                  key={s.id}
                  story={s}
                  index={i}
                  status={status}
                  accent={accent}
                  data={data}
                  onClick={() => status !== 'bloqueada' && setActiveStoryId(s.id)}
                />
              );
            })}
          </div>
        </div>

        {/* Aviso si solo hay 1 historia */}
        {STORIES.length === 1 && (
          <div style={{
            background: J.paperHi,
            border: `1px dashed ${J.hairS}`,
            borderRadius: 14,
            padding: '12px 14px',
            fontSize: 12,
            color: J.mute,
            textAlign: 'center',
          }}>
            Más historias en camino — al completar una, se desbloquea la siguiente.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tarjeta de historia con estado ─────────────────────────────────────────
function StoryCard({ story, index, status, accent, data, onClick }) {
  const isLocked = status === 'bloqueada';
  const isDone = status === 'completada';

  const pct = data && data.maxPuntuacion > 0
    ? Math.round((data.mejorPuntuacion / data.maxPuntuacion) * 100)
    : 0;

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className="w-full rounded-xl p-4 flex items-center gap-3 transition-all text-left"
      style={{
        background: J.paperHi,
        border: `1px solid ${J.hair}`,
        borderLeftWidth: 4,
        borderLeftColor: isLocked ? J.mute2 : accent.border,
        cursor: isLocked ? 'default' : 'pointer',
        opacity: isLocked ? 0.55 : 1,
      }}
    >
      <div className="font-cn w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
        style={{
          background: isLocked ? J.mute2 : (isDone ? J.jade : accent.icon),
          color: isLocked ? J.paperHi : (isDone ? J.paperHi : accent.text),
          fontWeight: 700,
        }}>
        {isLocked ? '🔒' : isDone ? '✓' : index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="font-semibold text-sm truncate" style={{ color: isLocked ? J.mute : J.ink }}>
            {story.titulo}
          </span>
          <span className="text-[10px] font-bold flex-shrink-0"
            style={{ color: isLocked ? J.mute : accent.text, letterSpacing: '0.05em' }}>
            T{story.tema}·H{story.historia}
          </span>
        </div>
        <p className="font-cn text-xs truncate" style={{ color: J.mute }}>
          {story.subtitulo}
        </p>

        {/* Mejor puntuación si está completada */}
        {isDone && data && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full overflow-hidden" style={{ background: J.hair }}>
              <div className="h-full rounded-full"
                style={{ width: `${pct}%`, background: J.jade }} />
            </div>
            <span className="text-[11px] font-bold flex-shrink-0" style={{ color: J.jade }}>
              {data.mejorPuntuacion}/{data.maxPuntuacion}
            </span>
          </div>
        )}

        {/* Hint si está bloqueada */}
        {isLocked && (
          <p className="text-[11px] mt-1" style={{ color: J.mute }}>
            Completa la anterior para desbloquear
          </p>
        )}
      </div>

      <span style={{ color: isLocked ? J.mute2 : J.mute, fontWeight: 700 }}>
        {isLocked ? '' : '→'}
      </span>
    </button>
  );
}
