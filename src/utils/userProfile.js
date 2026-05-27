// src/utils/userProfile.js
// Perfil del usuario: género y avatar elegido. El nick sigue gestionado
// por App.jsx (clave `aprende-chino-username`) — solo extendemos aquí
// los datos nuevos para no romper compatibilidad.

import { DEFAULT_AVATAR_ID } from '@/data/avatars.js';

const LS_KEY = 'aprende-chino-profile';

// gender: 'm' | 'f' | 'nb' | null (sin elegir)
const DEFAULT_PROFILE = {
  gender: null,
  avatarId: DEFAULT_AVATAR_ID,
};

// Cada id mapea a una clave i18n. `cn` queda hardcoded como decoración.
export const GENDERS = [
  { id: 'm',  i18nKey: 'gender_male',      cn: '男' },
  { id: 'f',  i18nKey: 'gender_female',    cn: '女' },
  { id: 'nb', i18nKey: 'gender_nonbinary', cn: '其他' },
];

export function loadUserProfile() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

export function saveUserProfile(profile) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(profile));
  } catch {}
}

export function updateUserProfile(patch) {
  const current = loadUserProfile();
  const next = { ...current, ...patch };
  saveUserProfile(next);
  return next;
}
