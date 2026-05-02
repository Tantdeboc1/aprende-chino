// === src/utils/tts-enhanced.js (SISTEMA MEJORADO - SIN CONFLICTOS) ===
import { playAudioSmart } from './audio';

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
      utterance.rate = 0.8; // Velocidad más lenta para mejor comprensión
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = (event) => {
        reject(event);
      };

      window.speechSynthesis.speak(utterance);

      // Timeout de seguridad (10 segundos)
      setTimeout(() => {
        resolve();
      }, 10000);

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


    // 🎯 ESTRATEGIA 2: Si es pinyin, intentar sílaba por sílaba
    if (pinyin && /^[a-zA-ZüÜvV\s-]+\d?$/.test(pinyin)) {

      // Dividir en sílabas
      const syllables = pinyin.split(/[\s-]+/).filter(Boolean);

      if (syllables.length > 1) {
        let hasMP3 = false;

        for (const syl of syllables) {
          const sylFound = await playAudioSmart(category, syl, null);

          if (sylFound) {
            hasMP3 = true;
            // Pequeña pausa entre sílabas
            await new Promise(resolve => setTimeout(resolve, 200));
          } else {
            // No hacer nada aquí, seguimos intentando las demás
          }
        }

        // Si encontramos al menos un MP3, consideramos éxito parcial
        if (hasMP3) {
          // Reproducir TTS completo para que escuchen la palabra correcta
          await speakWithTTS(hanzi);
          onEnd && onEnd();
          return;
        }
      }
    }

    // 🎯 ESTRATEGIA 3: Fallback final - TTS directo con hanzi completo
    await speakWithTTS(hanzi || pinyin);

    onEnd && onEnd();

  } catch (e) {
    onError && onError(e);
  }
}

/**
 * Cancela cualquier síntesis de voz en progreso
 */
export function cancelSpeak() {
  try {
    window.speechSynthesis?.cancel?.();
  } catch (e) {
  }
}
