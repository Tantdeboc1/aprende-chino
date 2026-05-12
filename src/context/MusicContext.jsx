// src/context/MusicContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const LS_KEY = 'music-settings';

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
    const audio        = new Audio('/music/background.mp3');
    audio.loop         = true;
    audio.volume       = loadSettings().volume;
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
