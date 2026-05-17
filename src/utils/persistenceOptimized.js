/**
 * Sistema de persistencia optimizado: localStorage + IndexedDB
 * Usa localStorage para datos pequeños, IndexedDB para datos grandes
 */

const DB_NAME = 'aprende-chino-db';
const STORE_NAME = 'progress';
const LS_KEY = 'aprende-chino-progress';
const THRESHOLD = 10000; // Threshold en bytes para usar IndexedDB

let db = null;

/**
 * Inicializa IndexedDB
 */
const initDB = async () => {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      console.log('[DB] IndexedDB inicializado');
      resolve(db);
    };

    request.onerror = () => {
      console.warn('[DB] Fallo inicializar IndexedDB, usando localStorage');
      resolve(null);
    };
  });
};

/**
 * Guarda datos optimizados
 */
export const saveProgressOptimized = async (progress) => {
  const data = typeof progress === 'string' ? progress : JSON.stringify(progress);
  const size = new Blob([data]).size;

  console.log(`[Persistence] Guardando ${size} bytes`);

  if (size < THRESHOLD) {
    // Usar localStorage para datos pequeños (más rápido)
    try {
      localStorage.setItem(LS_KEY, data);
      console.log('[Persistence] Guardado en localStorage');
      return true;
    } catch (error) {
      console.error('[Persistence] Error localStorage:', error);
      return false;
    }
  } else {
    // Usar IndexedDB para datos grandes
    try {
      const database = await initDB();
      if (!database) {
        // Fallback a localStorage si IndexedDB falla
        localStorage.setItem(LS_KEY, data);
        return true;
      }

      return new Promise((resolve) => {
        const tx = database.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.put({ id: 'main', data: progress, timestamp: Date.now() });

        request.onsuccess = () => {
          console.log('[Persistence] Guardado en IndexedDB');
          resolve(true);
        };

        request.onerror = () => {
          console.error('[Persistence] Error IndexedDB, usando localStorage');
          localStorage.setItem(LS_KEY, data);
          resolve(true);
        };
      });
    } catch (error) {
      console.error('[Persistence] Error grave:', error);
      localStorage.setItem(LS_KEY, data);
      return false;
    }
  }
};

/**
 * Carga datos optimizados
 */
export const loadProgressOptimized = async () => {
  try {
    // Intentar cargar desde localStorage primero (más rápido)
    const lsData = localStorage.getItem(LS_KEY);
    if (lsData) {
      console.log('[Persistence] Datos cargados desde localStorage');
      return JSON.parse(lsData);
    }

    // Si no hay en localStorage, intentar IndexedDB
    const database = await initDB();
    if (!database) {
      console.log('[Persistence] No hay datos persistentes');
      return null;
    }

    return new Promise((resolve) => {
      const tx = database.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get('main');

      request.onsuccess = () => {
        if (request.result) {
          console.log('[Persistence] Datos cargados desde IndexedDB');
          resolve(request.result.data);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('[Persistence] Error cargando IndexedDB');
        resolve(null);
      };
    });
  } catch (error) {
    console.error('[Persistence] Error cargando datos:', error);
    return null;
  }
};

/**
 * Limpia ambos storages
 */
export const clearAllProgress = async () => {
  try {
    localStorage.removeItem(LS_KEY);

    const database = await initDB();
    if (database) {
      const tx = database.transaction([STORE_NAME], 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.clear();
    }

    console.log('[Persistence] Datos limpiados');
    return true;
  } catch (error) {
    console.error('[Persistence] Error limpiando datos:', error);
    return false;
  }
};

/**
 * Obtiene estadísticas de almacenamiento
 */
export const getStorageStats = async () => {
  try {
    const lsData = localStorage.getItem(LS_KEY);
    const lsSize = lsData ? new Blob([lsData]).size : 0;

    const database = await initDB();
    let idbSize = 0;

    if (database) {
      const tx = database.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get('main');

      idbSize = await new Promise((resolve) => {
        request.onsuccess = () => {
          const size = request.result
            ? new Blob([JSON.stringify(request.result.data)]).size
            : 0;
          resolve(size);
        };
        request.onerror = () => resolve(0);
      });
    }

    return {
      localStorage: lsSize,
      indexedDB: idbSize,
      total: lsSize + idbSize,
      formatted: {
        localStorage: `${(lsSize / 1024).toFixed(2)} KB`,
        indexedDB: `${(idbSize / 1024).toFixed(2)} KB`,
        total: `${((lsSize + idbSize) / 1024).toFixed(2)} KB`
      }
    };
  } catch (error) {
    console.error('[Persistence] Error obteniendo stats:', error);
    return null;
  }
};

/**
 * Exporta datos de progreso (para backup)
 */
export const exportProgress = async () => {
  const progress = await loadProgressOptimized();
  if (!progress) return null;

  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    data: progress
  };
};

/**
 * Importa datos de progreso (desde backup)
 */
export const importProgress = async (backupData) => {
  if (!backupData || !backupData.data) {
    throw new Error('Datos de backup inválidos');
  }

  await saveProgressOptimized(backupData.data);
  console.log('[Persistence] Datos importados exitosamente');
  return true;
};
