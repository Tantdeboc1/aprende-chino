// === src/utils/tts.js (MP3 primero, TTS como respaldo universal) ===
import { playAudioSmart } from './audio';

/**
 * Normaliza pinyin con diacríticos a formato con número (ej. nǐ -> ni3, lǜ -> lv4)
 * Si ya viene con número, solo cambia ü -> v
 */
function toNumberedPinyin(s) {
  if (!s || typeof s !== 'string') return '';
  s = s.trim().toLowerCase();
  const m = s.match(/^([a-züv]+)([1-4])$/i);
  if (m) return m[1].replace(/ü/g, 'v') + m[2];

  const toneMap = {
    'ā':'a1','á':'a2','ǎ':'a3','à':'a4',
    'ē':'e1','é':'e2','ě':'e3','è':'e4',
    'ī':'i1','í':'i2','ǐ':'i3','ì':'i4',
    'ō':'o1','ó':'o2','ǒ':'o3','ò':'o4',
    'ū':'u1','ú':'u2','ǔ':'u3','ù':'u4',
    'ǖ':'v1','ǘ':'v2','ǚ':'v3','ǜ':'v4',
    'ü':'v'
  };
  let base = '', tone = 0;
  for (const ch of s) {
    const rep = toneMap[ch];
    if (rep) {
      if (rep.length === 2) { base += rep[0]; tone = Number(rep[1]); }
      else { base += rep; }
    } else base += ch;
  }
  return tone ? (base + tone) : base;
}

/**
 * Intenta reproducir usando MP3 (manifest en /public/audio/pronunciation) y
 * si no encuentra nada, usa Web Speech TTS como respaldo.
 */
export async function speakChinese(keyOrObj, opts = {}) {
  const { onStart, onEnd, onError } = opts || {};
  const category = opts.category || 'pronunciation';

  let key = '';
  let fallbackText = '';
  if (typeof keyOrObj === 'string') {
    key = keyOrObj;
    fallbackText = keyOrObj;
  } else if (keyOrObj && typeof keyOrObj === 'object') {
    key = keyOrObj.pinyin || keyOrObj.hanzi || '';
    fallbackText = keyOrObj.hanzi || keyOrObj.pinyin || '';
  }

  // Normaliza a sílabas numeradas si parece pinyin
  if (key && /^[a-zA-ZüÜvV\s-]+\d?$/.test(key)) {
    const parts = key.split(/\s+|-/).filter(Boolean).map(toNumberedPinyin);
    try {
      onStart && onStart();
      let anyPlayed = false;
      for (const syl of parts) {
        // genera variantes (ni3, ni-3, ni_3, ni)
        const variants = new Set([syl, syl.replace(/(\d)$/, '-$1'), syl.replace(/(\d)$/, '_$1'), syl.replace(/\d$/, '')]);
        let played = false;
        for (const variant of variants) {
          const ok = await playAudioSmart(category, variant, null);
          if (ok) { played = true; anyPlayed = true; break; }
        }
        if (!played) await playAudioSmart(category, syl, syl);
      }
      if (!anyPlayed) await playAudioSmart(category, key, fallbackText || key);
      onEnd && onEnd();
      return;
    } catch (e) {
      onError && onError(e);
    }
  }

  // Si no es pinyin (hanzi u otra cosa)
  try {
    onStart && onStart();
    const ok = await playAudioSmart(category, key || fallbackText, null);
    if (!ok) await playAudioSmart(category, key || fallbackText, fallbackText || key);
    onEnd && onEnd();
  } catch (e) {
    onError && onError(e);
  }
}

export function cancelSpeak() {
  try { window.speechSynthesis?.cancel?.(); } catch {}
}
