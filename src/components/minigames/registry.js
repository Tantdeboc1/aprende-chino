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

import { lazy, memo } from 'react';

// Cada juego va envuelto en memo(): sus props ya llegan estables desde
// navigation.js (goBack, onTrackResult, speak… memoizados), así el juego NO se
// re-renderiza cuando App re-renderiza por un cambio de `progress` a mitad de
// partida. lazy() se conserva para el code-splitting por juego.
const SOVGame              = memo(lazy(() => import('./SOVGame.jsx')));
const TimeRace             = memo(lazy(() => import('./TimeRace.jsx')));
const PinyinConnection     = memo(lazy(() => import('./PinyinConnection.jsx')));
const TranslationGame      = memo(lazy(() => import('./TranslationGame.jsx')));
const CompleteSentence     = memo(lazy(() => import('./CompleteSentence.jsx')));
const DialogueOrder        = memo(lazy(() => import('./DialogueOrder.jsx')));
const FindIntruder         = memo(lazy(() => import('./FindIntruder.jsx')));
const PronunciationPractice = memo(lazy(() => import('./PronunciationPractice.jsx')));
const DictationGame         = memo(lazy(() => import('./DictationGame.jsx')));
const ToneEar               = memo(lazy(() => import('./ToneEar.jsx')));
const EchoSpeaking          = memo(lazy(() => import('./EchoSpeaking.jsx')));
const ReadingComprehension  = memo(lazy(() => import('./ReadingComprehension.jsx')));
const CefrExam              = memo(lazy(() => import('./CefrExam.jsx')));

/** Mini-juegos disponibles, en el orden lógico. */
export const MINIGAMES = [
  {
    id: 'sov-game',
    component: SOVGame,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      selectedLesson: ctx.selectedLesson,
      speakChinese: ctx.speak,
    }),
  },
  {
    id: 'time-race',
    component: TimeRace,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      characters: ctx.characters,
      onTrackResult: ctx.onTrackResult,
    }),
  },
  {
    id: 'pinyin-connection',
    component: PinyinConnection,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      characters: ctx.characters,
      onTrackResult: ctx.onTrackResult,
    }),
  },
  {
    id: 'translation-game',
    component: TranslationGame,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'complete-sentence',
    component: CompleteSentence,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'dialogue-order',
    component: DialogueOrder,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'find-intruder',
    component: FindIntruder,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'pronunciation-practice',
    component: PronunciationPractice,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'dictation-game',
    component: DictationGame,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      characters: ctx.characters,
      speak: ctx.speak,
      onTrackResult: ctx.onTrackResult,
    }),
  },
  {
    id: 'echo-speaking',
    component: EchoSpeaking,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      selectedLesson: ctx.selectedLesson,
    }),
  },
  {
    id: 'tones-ear',
    component: ToneEar,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      characters: ctx.characters,
      speak: ctx.speak,
      onTrackResult: ctx.onTrackResult,
    }),
  },
  {
    id: 'reading-comprehension',
    component: ReadingComprehension,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
      speak: ctx.speak,
      characters: ctx.allCharacters,
    }),
  },
  {
    id: 'cefr-exam',
    component: CefrExam,
    buildProps: (ctx) => ({
      goBack: ctx.goBackMinigames,
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
