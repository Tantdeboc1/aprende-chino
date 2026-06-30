// src/components/minigames/registry.js
// Registro único de mini-juegos. Cada entrada describe:
//   id          → la "screen" que activa el juego (debe coincidir con el id
//                  usado en MiniGames.jsx para navegar a él).
//   component   → el componente del juego, ya cargado con React.lazy().
//   buildProps  → función que, recibiendo el contexto de navegación
//                 (goBack, selectedLesson, characters, onTrackResult, speak),
//                 devuelve los props específicos que ese juego espera.
//
// Añadir un mini-juego nuevo: añadir una entrada aquí y un objeto en
// MiniGames.jsx (`games` array). Eso es TODO. No hay que tocar App.jsx
// ni navigation.js: ambos derivan su comportamiento de este registro.

import { lazy } from 'react';

const SOVGame              = lazy(() => import('./SOVGame.jsx'));
const TimeRace             = lazy(() => import('./TimeRace.jsx'));
const PinyinConnection     = lazy(() => import('./PinyinConnection.jsx'));
const TranslationGame      = lazy(() => import('./TranslationGame.jsx'));
const CompleteSentence     = lazy(() => import('./CompleteSentence.jsx'));
const DialogueOrder        = lazy(() => import('./DialogueOrder.jsx'));
const FindIntruder         = lazy(() => import('./FindIntruder.jsx'));
const PronunciationPractice = lazy(() => import('./PronunciationPractice.jsx'));
const DictationGame         = lazy(() => import('./DictationGame.jsx'));
const ToneEar               = lazy(() => import('./ToneEar.jsx'));
const EchoSpeaking          = lazy(() => import('./EchoSpeaking.jsx'));
const ReadingComprehension  = lazy(() => import('./ReadingComprehension.jsx'));
const CefrExam              = lazy(() => import('./CefrExam.jsx'));

/**
 * Helper para fabricar el `goBack` típico que devuelve al listado de juegos.
 * @param {object} ctx — el contexto de navegación pasado al registro.
 */
function backToMinigames(ctx) {
  return () => { ctx.navigateTo('minigames'); };
}

/** Mini-juegos disponibles, en el orden lógico. */
export const MINIGAMES = [
  {
    id: 'sov-game',
    component: SOVGame,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      selectedLesson: ctx.selectedLesson,
      speakChinese: ctx.speak,
    }),
  },
  {
    id: 'time-race',
    component: TimeRace,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      characters: ctx.characters,
      onTrackResult: ctx.onTrackResult,
    }),
  },
  {
    id: 'pinyin-connection',
    component: PinyinConnection,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      characters: ctx.characters,
      onTrackResult: ctx.onTrackResult,
    }),
  },
  {
    id: 'translation-game',
    component: TranslationGame,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'complete-sentence',
    component: CompleteSentence,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'dialogue-order',
    component: DialogueOrder,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'find-intruder',
    component: FindIntruder,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'pronunciation-practice',
    component: PronunciationPractice,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'dictation-game',
    component: DictationGame,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      characters: ctx.characters,
      speak: ctx.speak,
      onTrackResult: ctx.onTrackResult,
    }),
  },
  {
    id: 'echo-speaking',
    component: EchoSpeaking,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'tones-ear',
    component: ToneEar,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      characters: ctx.characters,
      speak: ctx.speak,
      onTrackResult: ctx.onTrackResult,
    }),
  },
  {
    id: 'reading-comprehension',
    component: ReadingComprehension,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      speak: ctx.speak,
      characters: ctx.allCharacters,
    }),
  },
  {
    id: 'cefr-exam',
    component: CefrExam,
    buildProps: (ctx) => ({
      goBack: backToMinigames(ctx),
      speak: ctx.speak,
      allCharacters: ctx.allCharacters,
    }),
  },
];

/** Set de IDs para lookup O(1) — usado por App.jsx para sus condicionales. */
export const MINIGAME_IDS = new Set(MINIGAMES.map(g => g.id));

/** Devuelve la entrada del registro para un id, o null. */
export function findMinigame(id) {
  return MINIGAMES.find(g => g.id === id) || null;
}
