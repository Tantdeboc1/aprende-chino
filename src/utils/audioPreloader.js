import { assetUrl } from './assets';

/**
 * Precarga inteligente de archivos de audio
 * Carga solo metadata para reducir consumo de datos
 */

const audioCache = new Map();
const preloadQueue = new Set();

/**
 * Precarga archivos de audio por clave
 * @param {string[]} audioKeys - Array de claves de audio (ej: ['ma1', 'ba3'])
 * @param {Object} options - {strategy: 'metadata' | 'full'}
 */
export const preloadAudio = (audioKeys, options = { strategy: 'metadata' }) => {
  if (!audioKeys || audioKeys.length === 0) return;

  audioKeys.forEach(key => {
    // Evitar duplicados
    if (audioCache.has(key) || preloadQueue.has(key)) return;

    preloadQueue.add(key);

    try {
      const audio = new Audio();
      audio.preload = options.strategy === 'full' ? 'auto' : 'metadata';
      audio.crossOrigin = 'anonymous';

      // Construir URL - intentar diferentes extensiones
      const url = assetUrl(`audio/${key}.mp3`);

      audio.oncanplaythrough = () => {
        audioCache.set(key, audio);
        preloadQueue.delete(key);
        console.log(`[Audio] Precargado: ${key}`);
      };

      audio.onerror = () => {
        preloadQueue.delete(key);
        console.warn(`[Audio] Fallo al precargar: ${key}`);
      };

      audio.src = url;
      audio.load();
    } catch (error) {
      preloadQueue.delete(key);
      console.error(`[Audio] Error preloading ${key}:`, error);
    }
  });
};

/**
 * Obtiene audio precargado del cache
 * @param {string} key - Clave de audio
 * @returns {Audio|null}
 */
export const getCachedAudio = (key) => {
  return audioCache.get(key) || null;
};

/**
 * Limpia el cache de audio (para liberar memoria)
 * @param {string[]} keysToKeep - Claves que NO deben eliminarse
 */
export const clearAudioCache = (keysToKeep = []) => {
  for (const [key, audio] of audioCache.entries()) {
    if (!keysToKeep.includes(key)) {
      audio.src = '';
      audio.pause();
      audioCache.delete(key);
    }
  }
};

/**
 * Obtiene estadísticas del cache
 * @returns {Object} {cached, queued, totalSize}
 */
export const getAudioCacheStats = () => {
  return {
    cached: audioCache.size,
    queued: preloadQueue.size,
    totalSize: audioCache.size + preloadQueue.size
  };
};

/**
 * Preload batch intelligente basado en contexto
 */
export const preloadLessonAudio = (lessonCharacters) => {
  const audioKeys = [];
  lessonCharacters.forEach(char => {
    if (char.audioKeys && Array.isArray(char.audioKeys)) {
      audioKeys.push(...char.audioKeys);
    }
  });

  // Priorizar: preload con metadata, no full download
  preloadAudio([...new Set(audioKeys)], { strategy: 'metadata' });
};

/**
 * Preload de próxima lección (background)
 */
export const preloadNextLessonAudio = (nextLessonCharacters, priority = false) => {
  const timeout = priority ? 100 : 3000; // Esperar 3s si no es prioritario
  setTimeout(() => {
    preloadLessonAudio(nextLessonCharacters);
  }, timeout);
};
