// src/components/stories/StoriesPage.jsx
// Listado de historias con estado bloqueada/disponible/completada.
// Guarda el resultado al terminar una historia.

import { useState, useEffect, Suspense } from 'react';
import { lazyWithRetry } from '@/utils/lazyWithRetry.js';
import { useTranslation } from 'react-i18next';
import { loc, baseLang, trField } from '@/utils/loc.js';
import { J } from '@/styles/tokens';
import ProfileBadge from '@/components/ui/ProfileBadge.jsx';
import { STORIES, getStoryById } from '@/data/stories/index.js';
import {
  loadStoryProgress,
  recordStoryResult,
  getAllStatuses,
} from '@/utils/storyProgress.js';
import { markWordSeen } from '@/utils/progress.js';
import { backgroundByStoryId } from './storyBackgroundUrls.js';
import firstStoryCover from '@/assets/fondos/story/manga-t1h1-2.webp';
import { mangaCoverFor } from './mangaPanels.js';

// StoryPlayer arrastra mucho código (escenarios, diálogos, ejercicios). Solo
// se necesita al reproducir una historia concreta — el listado no lo usa.
// Lazy lo saca del chunk de StoriesPage (que pasa de 85 kB a ~15 kB).
const StoryPlayer = lazyWithRetry(() => import('./StoryPlayer.jsx'));

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
  onExit,
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

  // Precarga en segundo plano los fondos de las historias:
  // sin esto, la imagen empezaba a bajar justo al abrir el player (+ lazy
  // chunk), y se veía un flash de negro antes de que cargara. El listado es
  // tiempo muerto perfecto para adelantar la descarga (el SW ya cachea
  // .webp/.png CacheFirst, así que solo paga la descarga una vez).
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
    const cancelIdle = window.cancelIdleCallback || clearTimeout;
    const id = idle(() => {
      for (const s of STORIES) {
        const url = backgroundByStoryId(s.id);
        if (url) new Image().src = url;
      }
    });
    return () => cancelIdle(id);
  }, [storyProgress]);

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
              allCharacters={allCharacters}
        />
      </Suspense>
    );
  }

  // Stats agregadas
  const completadas = STORIES.filter(s => statuses[s.id] === 'completada').length;
  const total = STORIES.length;

  return (
    <div className="min-h-screen pb-24" style={{ background: J.paper }}>
      <div className="px-4 pt-4"><button onClick={onExit} className="text-sm font-semibold" style={{ color: J.inkSoft }}>← {t('minigames_back_to_minigames')}</button></div>
      {/* Header */}
      <div style={{
        background: J.jade, color: J.onAccent,
        borderLeft: `4px solid ${J.jadeDeep}`,
        padding: '40px 16px 18px',
      }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="font-cn w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: J.red, color: J.onAccent, fontWeight: 700, fontSize: '0.875rem' }}>
              故
            </div>
            <span className="font-bold text-base" style={{ color: J.onAccent }}>{t('stories_header', 'Historias')}</span>
          </div>
          <ProfileBadge variant="dark" />
        </div>
        <div className="mt-3">
          <h1 className="text-xl font-bold" style={{ color: J.onAccent }}>
            {t('stories_learn_in_context', 'Aprende en contexto')}
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            故事 · {t('stories_progress_count', '{{done}} de {{total}} completadas', { done: completadas, total })}
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
            {t('stories_map_title', 'Mapa de historias')}
          </p>

          <div className="space-y-6 j-rise">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(lesson => {
              const stories = STORIES.filter(s => s.tema === lesson);
              const lessonDone = stories.filter(s => statuses[s.id] === 'completada').length;
              return <section key={lesson} aria-label={t('exam_lesson_label', { num: lesson })}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: ACCENTS[(lesson - 1) % ACCENTS.length].text }}>{t('exam_lesson_label', { num: lesson })}</p>
                    <h2 className="font-bold" style={{ color: J.ink }}>{t(`lesson_${lesson}_subtitle`)}</h2>
                  </div>
                  {stories.length > 0 && <span className="text-xs font-semibold whitespace-nowrap" style={{ color: J.mute }}>{lessonDone}/{stories.length}</span>}
                </div>
                {stories.length === 0 ? <p className="rounded-xl p-4 text-sm" style={{ background: J.paperHi, color: J.mute, border: `1px dashed ${J.hair}` }}>{t('stories_more_coming')}</p> : <div className="grid grid-cols-2 gap-3">{stories.map((s) => {
              const status = statuses[s.id];
              const accent = ACCENTS[(s.tema - 1) % ACCENTS.length];
              const data = storyProgress[s.id];
              return (
                <StoryCard
                  key={s.id}
                  story={s}
                  index={s.historia - 1}
                  status={status}
                  accent={accent}
                  data={data}
                  onClick={() => status !== 'bloqueada' && setActiveStoryId(s.id)}
                />
              );
            })}</div>}
              </section>;
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
            fontSize: '0.75rem',
            color: J.mute,
            textAlign: 'center',
          }}>
            {t('stories_more_coming')}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tarjeta de historia con estado ─────────────────────────────────────────
function StoryCard({ story, index, status, accent, data, onClick }) {
  const { t, i18n } = useTranslation();
  const isLocked = status === 'bloqueada';
  const isDone = status === 'completada';
  // Título localizado (tituloTr {es,en,...}); cae al titulo legado si falta.
  const storyTitle = loc(story.tituloTr, baseLang(i18n.language)) || story.titulo;
  const cover = story.id === 't1-h1' ? firstStoryCover : mangaCoverFor(story.id) || backgroundByStoryId(story.id);
  const labels = {
    es: ['Historia', 'Completada', 'Disponible', 'Bloqueada'], en: ['Story', 'Completed', 'Available', 'Locked'],
    fr: ['Histoire', 'Terminée', 'Disponible', 'Verrouillée'], de: ['Geschichte', 'Abgeschlossen', 'Verfügbar', 'Gesperrt'],
    it: ['Storia', 'Completata', 'Disponibile', 'Bloccata'], pt: ['História', 'Concluída', 'Disponível', 'Bloqueada'],
  }[baseLang(i18n.language)] || ['Story', 'Completed', 'Available', 'Locked'];

  const pct = data && data.maxPuntuacion > 0
    ? Math.round((data.mejorPuntuacion / data.maxPuntuacion) * 100)
    : 0;

  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className="story-map-card w-full text-left"
      style={{
        background: J.paperHi, overflow: 'hidden', borderRadius: 18,
        border: `1px solid ${J.hair}`,
        cursor: isLocked ? 'default' : 'pointer',
      }}
    >
      <div className="story-map-cover" style={{ position:'relative', minHeight: 138, background: accent.icon, overflow:'hidden' }}>
        {cover && <img src={cover} alt="" loading="lazy" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', filter: isLocked ? 'saturate(.6) brightness(.7)' : 'none' }} />}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg, rgba(18,25,22,.12), rgba(18,25,22,.72))' }} />
        <span style={{ position:'absolute', top:10, left:10, color:'#fff', background:'rgba(20,25,20,.72)', padding:'5px 10px', borderRadius:99, fontSize:11, fontWeight:700 }}>{labels[0]} {index + 1}</span>
        <span style={{ position:'absolute', bottom:10, left:12, color:'#fff', fontWeight:700, fontSize:12 }}>{isLocked ? '🔒 ' + labels[3] : isDone ? '✓ ' + labels[1] : '▶ ' + labels[2]}</span>
      </div>

      <div className="min-w-0 p-4">
        <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1 mb-0.5">
          <span className="font-semibold text-sm" style={{ color: isLocked ? J.mute : J.ink, overflowWrap: 'anywhere' }}>
            {storyTitle}
          </span>
          <span className="text-[0.625rem] font-bold flex-shrink-0"
            style={{ color: isLocked ? J.mute : accent.text, letterSpacing: '0.05em' }}>
            T{story.tema}·H{story.historia}
          </span>
        </div>
        <p className="font-cn text-xs truncate" style={{ color: J.mute }}>
          {story.subtitulo}
        </p>
        {!isLocked && <p className="text-xs mt-2" style={{ color: J.inkSoft, lineHeight: 1.45 }}>{trField(story.resumen, story.resumenTr, baseLang(i18n.language))}</p>}

        {/* Mejor puntuación si está completada */}
        {isDone && data && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full overflow-hidden" style={{ background: J.hair }}>
              <div className="h-full rounded-full"
                style={{ width: `${pct}%`, background: J.jade }} />
            </div>
            <span className="text-[0.6875rem] font-bold flex-shrink-0" style={{ color: J.jade }}>
              {data.mejorPuntuacion}/{data.maxPuntuacion}
            </span>
          </div>
        )}

        {/* Hint si está bloqueada */}
        {isLocked && (
          <p className="text-[0.6875rem] mt-1" style={{ color: J.mute }}>
            {t('stories_locked_hint', 'Completa la anterior para desbloquear')}
          </p>
        )}
      </div>
      <style>{`.story-map-card { transition:transform .2s ease, box-shadow .2s ease; } .story-map-card:not(:disabled):hover { transform:translateY(-3px); box-shadow:0 10px 25px rgba(0,0,0,.13); } .story-map-card:focus-visible { outline:3px solid ${J.jade}; outline-offset:3px; } .reduce-motion .story-map-card { transition:none; } @media (min-width:768px) { .story-map-card { display:grid; grid-template-columns: minmax(140px, 34%) 1fr; } .story-map-cover { min-height:150px !important; } } @media (max-width:420px) { .story-map-cover { min-height:110px !important; } }`}</style>
    </button>
  );
}
