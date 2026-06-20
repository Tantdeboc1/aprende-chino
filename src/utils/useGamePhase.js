// src/utils/useGamePhase.js
// Ciclo de vida compartido por todos los minijuegos: intro → playing → finished.
//
// Antes, cada juego duplicaba este patrón de dos formas distintas:
//   - los de filtro por lección con dos booleanos (`started` + `done`),
//   - los de temporizador con una máquina de estados `'ready'|'playing'|'finished'`.
// Este hook unifica ambas en una sola máquina de 3 fases, testeable de forma
// aislada, y centraliza la decisión de saltar la explicación (shouldShowIntro).
//
// Uso típico:
//   const game = useGamePhase('find-intruder');
//   if (game.isIntro)    return <GameIntro  onStart={game.start} ... />;
//   if (game.isFinished) return <GameResults onPlayAgain={replay} ... />;
//   ...pantalla de juego...
//
// Donde un juego tenga el setup acoplado al arranque (los de temporizador:
// `startGame` resetea marcadores Y genera la primera pregunta), pasa
// `autoSkip: false` para que el hook NO salte la intro por su cuenta: así el
// componente conserva su efecto de arranque, que llama a `start()` además de
// hacer el setup. Con `autoSkip: true` (por defecto) el hook arranca ya en
// 'playing' cuando el usuario ocultó la explicación.
import { useState, useCallback } from 'react';
import { shouldShowIntro } from './gameIntroPrefs.js';

export const GAME_PHASE = {
  INTRO: 'intro',
  PLAYING: 'playing',
  FINISHED: 'finished',
};

/**
 * Calcula la fase inicial de un minijuego.
 * @param {string} gameId         id del juego (para shouldShowIntro)
 * @param {boolean} autoSkip      si true, arranca en 'playing' cuando la intro
 *                                está oculta; si false, siempre arranca en 'intro'
 *                                (el componente decide cuándo empezar).
 * @returns {'intro'|'playing'}
 */
export function initialGamePhase(gameId, autoSkip = true) {
  if (autoSkip && !shouldShowIntro(gameId)) return GAME_PHASE.PLAYING;
  return GAME_PHASE.INTRO;
}

/**
 * Hook con la máquina de fases del minijuego.
 * @param {string} gameId
 * @param {{ autoSkip?: boolean }} [options]
 * @returns {{
 *   phase: string,
 *   isIntro: boolean, isPlaying: boolean, isFinished: boolean,
 *   start: () => void, finish: () => void, restart: () => void,
 *   setPhase: (p: string) => void,
 * }}
 */
export function useGamePhase(gameId, { autoSkip = true } = {}) {
  const [phase, setPhase] = useState(() => initialGamePhase(gameId, autoSkip));

  const start = useCallback(() => setPhase(GAME_PHASE.PLAYING), []);
  const finish = useCallback(() => setPhase(GAME_PHASE.FINISHED), []);
  // `restart` es semánticamente distinto de `start` (volver a jugar tras los
  // resultados, no arrancar desde la intro), aunque la fase destino sea la misma.
  const restart = useCallback(() => setPhase(GAME_PHASE.PLAYING), []);

  return {
    phase,
    isIntro: phase === GAME_PHASE.INTRO,
    isPlaying: phase === GAME_PHASE.PLAYING,
    isFinished: phase === GAME_PHASE.FINISHED,
    start,
    finish,
    restart,
    setPhase,
  };
}
