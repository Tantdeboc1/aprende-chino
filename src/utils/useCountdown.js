// src/utils/useCountdown.js
// Cuenta atrás compartida por los juegos cronometrados (TimeRace,
// PinyinConnection, LevelExam). Encapsula el patrón que cada uno duplicaba:
//
//  - El interval solo depende de `running`: si dependiera de timeLeft se
//    destruiría y recrearía en cada tick, y el retraso de re-programación
//    acumulaba deriva (el minuto duraba de más).
//  - `timeLeftRef` es el espejo síncrono del valor, para leerlo dentro de
//    setTimeout/closures sin arrastrar estado obsoleto.
//  - `onExpire` se dispara desde un efecto al llegar a 0 (por tick o por
//    penalización), nunca desde dentro del updater de setState: un setState
//    ajeno dentro de un updater es un efecto colateral que StrictMode
//    ejecuta dos veces en desarrollo (doble guardado de resultados/XP).
//    El callback se lee de un ref, así siempre ve el render más reciente.
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * @param {number} initialSeconds  duración de la partida
 * @param {{ running: boolean, onExpire?: () => void }} options
 *   running   — el reloj solo corre mientras sea true
 *   onExpire  — se llama UNA vez al llegar a 0 (se espera que pare el juego,
 *               es decir, que haga `running` false)
 * @returns {{
 *   timeLeft: number,
 *   timeLeftRef: { current: number },
 *   reset: (seconds?: number) => void,
 *   penalize: (seconds: number) => void,
 * }}
 */
export function useCountdown(initialSeconds, { running, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const timeLeftRef = useRef(initialSeconds);

  const onExpireRef = useRef(onExpire);
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  // Vuelve a poner el reloj (nueva partida). Acepta otra duración por si el
  // juego la hace configurable.
  const reset = useCallback((seconds = initialSeconds) => {
    timeLeftRef.current = seconds;
    setTimeLeft(seconds);
  }, [initialSeconds]);

  // Resta segundos (penalización por fallo). Nunca baja de 0.
  const penalize = useCallback((seconds) => {
    setTimeLeft(t => {
      const next = Math.max(0, t - seconds);
      timeLeftRef.current = next;
      return next;
    });
  }, []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setTimeLeft(t => {
        const next = Math.max(0, t - 1);
        timeLeftRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (running && timeLeft <= 0) onExpireRef.current?.();
  }, [running, timeLeft]);

  return { timeLeft, timeLeftRef, reset, penalize };
}
