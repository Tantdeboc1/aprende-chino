// src/utils/speechRecognition.js
// Wrapper fino sobre Web Speech API (SpeechRecognition).
//
// Soporte de navegadores (a fecha de 2026):
//   ✓ Chrome / Edge / Opera (vía webkitSpeechRecognition)
//   ✓ Safari iOS/macOS (vía SpeechRecognition)
//   ✗ Firefox (no soportado — el llamador debe avisar al usuario)
//
// La API requiere conexión a internet en la mayoría de implementaciones
// (Chrome envía el audio a servidores de Google).

const SpeechRecognitionClass =
  typeof window !== 'undefined'
    ? (window.SpeechRecognition || window.webkitSpeechRecognition)
    : null;

/** ¿Está disponible el reconocimiento de voz en este navegador? */
export function isSpeechRecognitionSupported() {
  return SpeechRecognitionClass != null;
}

/** Códigos de error tipados para que el UI muestre mensajes precisos. */
export const SpeechErrorCode = {
  UNSUPPORTED:   'unsupported',     // el navegador no soporta Web Speech
  NO_PERMISSION: 'no-permission',   // el usuario rechazó el micrófono
  NO_SPEECH:     'no-speech',       // no se detectó voz dentro del timeout
  NETWORK:       'network',         // el servicio de Google no responde
  ABORTED:       'aborted',         // el llamador canceló
  UNKNOWN:       'unknown',
};

/**
 * Reconoce una frase hablada. Devuelve una promesa con el transcript.
 *
 * @param {object} opts
 * @param {string}  [opts.lang='zh-CN']  Idioma esperado.
 * @param {number}  [opts.maxAlternatives=3]  Cuántas alternativas pedir.
 * @param {number}  [opts.timeoutMs=8000]  Timeout total antes de abortar.
 * @returns {Promise<{ transcript: string, alternatives: string[], confidence: number }>}
 *          La promesa se rechaza con `{ code, message }` si algo falla.
 *          Códigos posibles: ver `SpeechErrorCode`.
 */
export function recognize({ lang = 'zh-CN', maxAlternatives = 3, timeoutMs = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!SpeechRecognitionClass) {
      reject({ code: SpeechErrorCode.UNSUPPORTED, message: 'Speech Recognition no soportado' });
      return;
    }

    const rec = new SpeechRecognitionClass();
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = false;
    rec.maxAlternatives = maxAlternatives;

    let timer = null;
    let settled = false;
    const cleanup = () => {
      if (timer) { clearTimeout(timer); timer = null; }
    };

    rec.onresult = (event) => {
      if (settled) return;
      settled = true;
      cleanup();
      const result = event.results[0];
      const alternatives = [];
      for (let i = 0; i < result.length; i++) {
        alternatives.push(result[i].transcript);
      }
      resolve({
        transcript: alternatives[0] || '',
        alternatives,
        confidence: result[0]?.confidence ?? 0,
      });
    };

    rec.onerror = (event) => {
      if (settled) return;
      settled = true;
      cleanup();
      // Mapear los códigos que dispara la API a los nuestros
      let code = SpeechErrorCode.UNKNOWN;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        code = SpeechErrorCode.NO_PERMISSION;
      } else if (event.error === 'no-speech') {
        code = SpeechErrorCode.NO_SPEECH;
      } else if (event.error === 'network') {
        code = SpeechErrorCode.NETWORK;
      } else if (event.error === 'aborted') {
        code = SpeechErrorCode.ABORTED;
      }
      reject({ code, message: event.error || 'unknown' });
    };

    rec.onend = () => {
      // Si terminó sin disparar onresult ni onerror, fue un "no se detectó voz"
      if (settled) return;
      settled = true;
      cleanup();
      reject({ code: SpeechErrorCode.NO_SPEECH, message: 'no se detectó voz' });
    };

    // Timeout de seguridad: algunas implementaciones se cuelgan
    timer = setTimeout(() => {
      if (settled) return;
      try { rec.abort(); } catch (_) {}
      settled = true;
      reject({ code: SpeechErrorCode.NO_SPEECH, message: 'timeout' });
    }, timeoutMs);

    try {
      rec.start();
    } catch (err) {
      // start() puede tirar si ya hay un reconocimiento en curso
      settled = true;
      cleanup();
      reject({ code: SpeechErrorCode.UNKNOWN, message: err?.message || String(err) });
    }
  });
}
