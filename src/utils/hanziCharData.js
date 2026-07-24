// src/utils/hanziCharData.js
// Loader de datos de trazos para HanziWriter, auto-alojado.
//
// Por defecto HanziWriter descarga cada carácter desde cdn.jsdelivr.net en
// tiempo de ejecución. Eso ata el feature de trazos (el núcleo de la app) a un
// tercero y NO funciona offline (el service worker no cachea ese CDN). Aquí los
// servimos desde nuestro propio dominio: public/hanzi-data/<char>.json, que
// genera scripts/copy-hanzi-data.mjs en predev/prebuild a partir del paquete
// hanzi-writer-data (solo los caracteres que la app usa, ~2 MB). Ventajas:
//   - funciona offline (el SW los cachea al primer uso, ver vite.config.js)
//   - sin dependencia de terceros: privacidad, disponibilidad y CSP más estricta
//
// Se pasa como `charDataLoader` a cada HanziWriter.create(...). La firma que
// espera HanziWriter es (char, onComplete, onError); onComplete recibe el JSON.
import { assetUrl } from './assets.js';

export function hanziCharDataLoader(char, onComplete, onError) {
  fetch(assetUrl(`hanzi-data/${encodeURIComponent(char)}.json`))
    .then((res) => {
      if (!res.ok) throw new Error(`hanzi-data ${res.status} para "${char}"`);
      return res.json();
    })
    .then(onComplete)
    .catch(onError);
}

// Ejecuta una operación de HanziWriter que necesita los datos del carácter
// (animateCharacter, quiz, showCharacter, showOutline, hideCharacter…) tragándose
// el fallo "Failed to load character data. Call setCharacter and try again." que
// lanza cuando los trazos no llegaron a cargar. `onLoadCharDataError` solo evita
// que escape el fallo de la CARGA inicial; estas llamadas posteriores fallan por
// su cuenta de DOS formas y ambas saturaban Sentry si no se atrapan aquí:
//   - throw SÍNCRONO, si la carga ya había fallado antes de llamar (_withData),
//   - promesa RECHAZADA, si falla mientras la operación está en curso.
// Devuelve la promesa (ya con .catch) o undefined si lanzó en síncrono.
export function runWriterOp(op) {
  try {
    const p = op();
    return p && typeof p.then === 'function' ? p.catch(() => {}) : p;
  } catch {
    return undefined;
  }
}
