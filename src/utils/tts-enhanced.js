// === src/utils/tts-enhanced.js (SISTEMA MEJORADO - SIN CONFLICTOS) ===
import { playAudioSmart } from './audio';
import { getVoiceRate } from './soundPrefs.js';

// Generación de locución: cada speakChineseEnhanced la incrementa al empezar
// y cancelSpeak también. Si mientras suena el bucle de sílabas la generación
// avanza (el usuario navegó o pidió otra palabra), el bucle se corta en la
// siguiente sílaba en vez de seguir sonando encima de la nueva pantalla.
let speakGeneration = 0;

/**
 * ¿Parece pinyin (latino, con tonos numéricos "ni3 hao3" o diacríticos
 * "nǐ hǎo") y no hanzi? El rango À-ɏ (U+00C0–U+024F) cubre todas las
 * vocales con marca de tono de pinyin.
 */
export function looksLikePinyin(s) {
  return typeof s === 'string' && /^[a-zA-Z0-9À-ɏ\s-]+$/.test(s);
}

/**
 * Habla texto usando Web Speech API (TTS del navegador)
 */
function speakWithTTS(text) {
  return new Promise((resolve, reject) => {
    if (!text) {
      resolve();
      return;
    }

    try {
      // Cancelar cualquier síntesis anterior
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; // Chino mandarín
      utterance.rate = getVoiceRate(); // 0.8 lenta (default) | 1.0 normal — ver Ajustes
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Timeout de seguridad (10 s) por si onend/onerror nunca llegan
      // (bug conocido de speechSynthesis en algunos navegadores). Se limpia
      // al terminar: si quedara vivo, resolvería la promesa a los 10 s en
      // mitad de otra locución y liberaría el guard anti-solape de App.speak.
      let safetyTimer = null;
      const settle = (fn, arg) => {
        clearTimeout(safetyTimer);
        fn(arg);
      };

      utterance.onend = () => settle(resolve);
      utterance.onerror = (event) => settle(reject, event);

      window.speechSynthesis.speak(utterance);
      safetyTimer = setTimeout(() => resolve(), 10000);

    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Sistema inteligente que:
 * 1. Intenta reproducir MP3 completo primero
 * 2. Si no existe, divide en sílabas y reproduce cada una
 * 3. Si alguna sílaba no tiene MP3, usa TTS directo para esa sílaba
 * 4. Si nada funciona, usa TTS con hanzi completo
 */
export async function speakChineseEnhanced(keyOrObj, opts = {}) {
  const { onStart, onEnd, onError } = opts || {};
  const category = opts.category || 'pronunciation';
  const gen = ++speakGeneration;
  // ¿Sigue siendo esta la locución vigente? (ni cancelada ni reemplazada)
  const isCurrent = () => gen === speakGeneration;

  let pinyin = '';
  let hanzi = '';

  // Extraer pinyin y hanzi del input
  if (typeof keyOrObj === 'string') {
    pinyin = keyOrObj;
    hanzi = keyOrObj;
  } else if (keyOrObj && typeof keyOrObj === 'object') {
    pinyin = keyOrObj.pinyin || '';
    hanzi = keyOrObj.hanzi || '';
  }

  // Validar que tengamos algo para reproducir
  if (!pinyin && !hanzi) {
    return;
  }

  try {
    onStart && onStart();

    // 🎯 ESTRATEGIA 1: Intentar palabra completa (sin TTS fallback)
    const mp3Found = await playAudioSmart(category, pinyin, null);

    if (mp3Found) {
      onEnd && onEnd();
      return;
    }


    // 🎯 ESTRATEGIA 2: Si es pinyin, intentar sílaba por sílaba.
    // (looksLikePinyin acepta pinyin numérico multi-sílaba "ni3 hao3" y con
    // marcas de tono "nǐ hǎo" — el regex anterior no casaba con ninguno.)
    if (pinyin && looksLikePinyin(pinyin)) {

      // Dividir en sílabas
      const syllables = pinyin.split(/[\s-]+/).filter(Boolean);

      if (syllables.length > 1) {
        let allFound = true;

        for (const syl of syllables) {
          // Cancelado o reemplazado por otra locución: no seguir sonando.
          if (!isCurrent()) { onEnd && onEnd(); return; }
          const sylFound = await playAudioSmart(category, syl, null);

          if (sylFound) {
            // Pequeña pausa entre sílabas
            await new Promise(resolve => setTimeout(resolve, 200));
          } else {
            allFound = false;
          }
        }

        // Solo si TODAS las sílabas sonaron damos la palabra por reproducida.
        // Antes, con una sola sílaba encontrada, se reproducía ADEMÁS el TTS
        // de la palabra completa: el usuario la oía dos veces con voces
        // distintas. Si faltó alguna, el TTS completo (abajo) la cubre.
        if (allFound) {
          onEnd && onEnd();
          return;
        }
      }
    }

    // 🎯 ESTRATEGIA 3: Fallback final - TTS directo con hanzi completo
    if (!isCurrent()) { onEnd && onEnd(); return; }
    await speakWithTTS(hanzi || pinyin);

    onEnd && onEnd();

  } catch (e) {
    onError && onError(e);
  }
}

/**
 * Cancela cualquier síntesis de voz en progreso, incluido el bucle de
 * sílabas de speakChineseEnhanced (la sílaba en curso termina de sonar,
 * pero no empieza ninguna más).
 */
export function cancelSpeak() {
  speakGeneration++;
  try {
    window.speechSynthesis?.cancel?.();
  } catch (e) {
  }
}
