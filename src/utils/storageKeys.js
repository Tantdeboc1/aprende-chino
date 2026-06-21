// src/utils/storageKeys.js
// Registro único de claves de localStorage.
//
// Antes cada módulo definía su propia string ('aprende-chino-progress-v1', …)
// y userStore.js las volvía a listar para sincronizar con la nube y borrar la
// sesión. Un typo en cualquiera de esas copias rompía silenciosamente el
// guardado/borrado de ese subsistema. Con un único origen de verdad eso ya no
// puede pasar: todos importan de aquí.
export const STORAGE_KEYS = {
  // Núcleo de usuario (sincronizados por userStore con la nube)
  USERNAME:         'aprende-chino-username',
  PROFILE:          'aprende-chino-profile',
  PROGRESS:         'aprende-chino-progress-v1',
  STREAK:           'aprende-chino-streak-v1',
  LEVELING:         'aprende-chino-leveling-v1',
  STORY_PROGRESS:   'aprende-chino-story-progress',
  STORY_DIFFICULTY: 'aprende-chino-story-difficulty',
  CHALLENGES:       'aprende-chino-challenges-v1',
  READING_PROGRESS: 'aprende-chino-reading-progress',
  FAVORITES:        'aprende-chino-favorites',
  DAILY_PROGRESS:   'dailyProgress_v1',
  LEVEL_EXAM:       'aprende-chino-level-exam-v1',

  // Solo locales (no se suben a la nube)
  DAILY_INDEX:      'dailyIndex_v1',
  AUTH_MODE:        'aprende-chino-auth-mode',
  GAME_INTRO_PREFS: 'gameIntroPrefs',
  MUSIC_SETTINGS:   'music-settings',

  // Prefijo para la caché de datos versionada (se concatena con el nombre)
  DATACACHE_PREFIX: 'aprende-chino-datacache:',
};

// Claves de usuario que userStore sincroniza con la nube y borra al cerrar
// sesión, además de las tres principales (username/profile/progress).
export const SYNCED_EXTRA_KEYS = [
  STORAGE_KEYS.STREAK,
  STORAGE_KEYS.LEVELING,
  STORAGE_KEYS.STORY_PROGRESS,
  STORAGE_KEYS.STORY_DIFFICULTY,
  STORAGE_KEYS.CHALLENGES,
  STORAGE_KEYS.READING_PROGRESS,
  STORAGE_KEYS.FAVORITES,
  STORAGE_KEYS.DAILY_PROGRESS,
  STORAGE_KEYS.LEVEL_EXAM,
];
