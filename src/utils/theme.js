// src/utils/theme.js
// Gestor del tema visual (claro / oscuro / sistema). El tema se aplica
// poniendo o quitando la clase `dark` en <html>; los colores reales viven en
// variables CSS (src/index.css), así que toda la app cambia sin tocar JS.
//
// La preferencia es LOCAL del dispositivo (no se sincroniza con la nube): el
// modo de visualización depende de la pantalla/momento, no de la cuenta.
import { STORAGE_KEYS } from '@/utils/storageKeys.js';

const KEY = STORAGE_KEYS.THEME;
export const THEMES = ['light', 'dark', 'system'];

// Colores de la barra de estado del navegador/PWA por tema (meta theme-color).
// Claro = jade (igual que antes, no cambiamos el look); oscuro = carbón.
const THEME_COLOR = { light: '#2f6b4a', dark: '#15120d' };

function systemPrefersDark() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function getThemePref() {
  try {
    const v = localStorage.getItem(KEY);
    return THEMES.includes(v) ? v : 'light';
  } catch {
    return 'light';
  }
}

// Resuelve la preferencia a un tema concreto ('light' | 'dark').
export function resolveTheme(pref = getThemePref()) {
  return pref === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : pref;
}

// Aplica el tema al documento (clase .dark + meta theme-color).
export function applyTheme(pref = getThemePref()) {
  const theme = resolveTheme(pref);
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLOR[theme]);
  return theme;
}

export function setThemePref(pref) {
  try { localStorage.setItem(KEY, pref); } catch {}
  return applyTheme(pref);
}

// Arranque: aplica el tema guardado y, si es 'system', reacciona a los cambios
// del sistema operativo en vivo. Devuelve la función de limpieza del listener.
export function initTheme() {
  applyTheme();
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (getThemePref() === 'system') applyTheme('system'); };
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }
  return () => {};
}
