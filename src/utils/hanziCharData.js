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
