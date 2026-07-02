// src/hooks/useLocalSnapshot.js
// Estado derivado de localStorage con invalidación explícita.
//
// Problema que resuelve: varios componentes leen datos de localStorage
// (perfil, racha, retos…) con `useMemo(() => loadX(), [remoteRev])`, usando
// un contador "ajeno" como dependencia para forzar la relectura cuando
// AuthContext hidrata localStorage desde Firestore. Funciona, pero es
// implícito y dispara una advertencia de exhaustive-deps en cada uso.
//
// Este módulo formaliza el patrón como store externo (useSyncExternalStore):
//   - bumpLocalDataRev(): anuncia que localStorage cambió "desde fuera" del
//     render (sync remoto, login, reclamar una recompensa…). Lo llama
//     AuthContext y cualquier flujo que escriba datos que otros componentes
//     montados leen.
//   - useLocalDataRev(): revisión actual; útil como dependencia de efectos
//     (App.jsx re-hidrata sus useState cuando cambia).
//   - useLocalSnapshot(loader, deps): relee `loader()` cuando cambia la
//     revisión (o las deps extra) y memoiza el resultado.

import { useMemo, useSyncExternalStore } from 'react';

let rev = 0;
const listeners = new Set();

export function bumpLocalDataRev() {
  rev++;
  // Copia defensiva: un listener puede desuscribirse durante la iteración.
  for (const l of [...listeners]) l();
}

const subscribe = (cb) => { listeners.add(cb); return () => listeners.delete(cb); };
const getRev = () => rev;

export function useLocalDataRev() {
  return useSyncExternalStore(subscribe, getRev);
}

export function useLocalSnapshot(loader, deps = []) {
  const currentRev = useLocalDataRev();
  // La revisión invalida el memo aunque el loader no la referencie: ese es el
  // contrato del store (el loader lee localStorage; la rev señala que cambió).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(loader, [currentRev, ...deps]);
}
