// src/context/MusicContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { STORAGE_KEYS } from '@/utils/storageKeys.js';
import { assetUrl } from '@/utils/assets.js';

const LS_KEY = STORAGE_KEYS.MUSIC_SETTINGS;

function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    return {
      enabled: s.enabled ?? false,   // off por defecto hasta interacción del usuario
      volume:  s.volume  ?? 0.4,
    };
  } catch { return { enabled: false, volume: 0.4 }; }
}

function saveSettings(settings) {
  localStorage.setItem(LS_KEY, JSON.stringify(settings));
}

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const audioRef                    = useRef(null);
  const [enabled, setEnabled]       = useState(() => loadSettings().enabled);
  const [volume, setVolumeState]    = useState(() => loadSettings().volume);
  const [ready, setReady]           = useState(false);   // el audio se ha cargado

  // Inicializar el elemento Audio una sola vez
  useEffect(() => {
    // assetUrl → respeta el base (/aprende-chino/ en Pages); con ruta absoluta
    // '/music/...' daba 404 en producción.
    // preload:'none' → NO descargar el MP3 hasta que el usuario active la música
    // (está off por defecto). Evita una petición inútil que además se abortaba
    // al desmontar/recargar (ECONNRESET/ERR_ABORTED) y gasta datos a todos.
    // OJO: preload='none' se fija ANTES de asignar src. Con la URL en el
    // constructor (new Audio(url)) el navegador ya empieza a descargar antes de
    // poder desactivar el preload → por eso seguía bajando el MP3.
    const audio        = new Audio();
    audio.preload      = 'none';
    audio.loop         = true;
    audio.volume       = loadSettings().volume;
    audio.src          = assetUrl('music/background.mp3');
    audioRef.current   = audio;

    audio.addEventListener('canplaythrough', () => setReady(true), { once: true });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Reaccionar a cambios de enabled/volume
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    if (enabled) {
      audio.play().catch(() => {
        // Autoplay bloqueado — se intentará en la próxima interacción
      });
    } else {
      audio.pause();
    }
  }, [enabled, volume, ready]);

  // Intentar play tras la primera interacción del usuario (política de autoplay)
  useEffect(() => {
    if (!enabled) return;
    const tryPlay = () => {
      audioRef.current?.play().catch(() => {});
    };
    window.addEventListener('pointerdown', tryPlay, { once: true });
    return () => window.removeEventListener('pointerdown', tryPlay);
  }, [enabled]);

  const toggle = (val) => {
    const next = val !== undefined ? val : !enabled;
    setEnabled(next);
    saveSettings({ enabled: next, volume });
  };

  const setVolume = (val) => {
    const v = Math.min(1, Math.max(0, val));
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
    saveSettings({ enabled, volume: v });
  };

  return (
    <MusicContext.Provider value={{ enabled, volume, toggle, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}
