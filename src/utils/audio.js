// src/utils/audio.js (VERSIÓN COMPLETA CON FIX PARA iOS)
import { speakChinese } from "./tts";

// ---- Carga perezosa del manifiesto ----
let manifestSet = null;
let manifestLoaded = false;
async function loadManifest() {
  if (manifestLoaded) return manifestSet;
  const base = import.meta.env.BASE_URL || "/";
  try {
    const res = await fetch(`${base}audio/manifest.txt`);
    const text = await res.text();
    const names = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    manifestSet = new Set(names);
  } catch {
    manifestSet = new Set();
  } finally {
    manifestLoaded = true;
  }
  return manifestSet;
}

// ---- Sistema de Audio CON FIX PARA iOS ----
class AudioCompressor {
  constructor() {
    this.audioContext = null;
    this.compressor = null;
    this.gainNode = null;
    this.volumeCache = new Map();
    this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    this.audioContextUnlocked = false;
  }

  // 🔥 NUEVO: Método para desbloquear audio en iOS
  async unlockAudioContext() {
    if (this.audioContextUnlocked || !this.isIOS) return;

    if (!this.audioContext) {
      await this.init();
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      console.log('🔓 Desbloqueando AudioContext para iOS...');
      try {
        await this.audioContext.resume();

        // Reproducir un buffer silencioso para activar completamente el audio
        const buffer = this.audioContext.createBuffer(1, 1, 22050);
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);

        this.audioContextUnlocked = true;
        console.log('✅ AudioContext desbloqueado para iOS');
      } catch (error) {
        console.warn('⚠️ Error desbloqueando AudioContext:', error);
      }
    }
  }

  async init() {
    if (this.audioContext) return;

    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // ✅ COMPRESIÓN EQUILIBRADA
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.value = -25;
      this.compressor.knee.value = 15;
      this.compressor.ratio.value = 6;
      this.compressor.attack.value = 0.003;
      this.compressor.release.value = 0.2;

      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = 0.8;

      this.compressor.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      console.log('🎵 AudioContext creado, estado:', this.audioContext.state);
    } catch (error) {
      console.warn('⚠️ AudioContext no disponible, usando audio normal');
    }
  }

  async playCompressedAudio(src, audioKey) {
    await this.init();

    // 🔥 EN iOS, USAR SIEMPRE AUDIO NORMAL (MÁS COMPATIBLE)
    if (this.isIOS) {
      console.log('📱 iOS detectado - usando Audio() directo');
      return this.playNormalAudio(src, audioKey);
    }

    // 🔥 CRÍTICO PARA iOS: Desbloquear antes de reproducir
    if (this.isIOS && !this.audioContextUnlocked) {
      await this.unlockAudioContext();
    }

    if (!this.audioContext || !this.compressor) {
      return this.playNormalAudio(src, audioKey);
    }

    // 🔥 Si el contexto está suspendido, intentar reanudar
    if (this.audioContext.state === 'suspended') {
      console.log('⏸️ AudioContext suspendido, intentando reanudar...');
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('⚠️ No se pudo reanudar AudioContext, usando audio normal');
        return this.playNormalAudio(src, audioKey);
      }
    }

    try {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      const volume = this.analyzeVolume(audioBuffer);
      this.volumeCache.set(audioKey, volume);

      console.log('🔊', audioKey, '-> Volumen:', volume.toFixed(3));

      let volumeMultiplier = this.calculateVolumeMultiplier(volume);

      this.gainNode.gain.value = volumeMultiplier;

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.compressor);

      source.start(0);

      return new Promise((resolve) => {
        source.onended = () => resolve(true);
        setTimeout(() => resolve(true), 5000);
      });
    } catch (error) {
      console.warn('❌ Error con compresor, usando audio normal:', error);
      return this.playNormalAudio(src, audioKey);
    }
  }

  analyzeVolume(audioBuffer) {
    const data = audioBuffer.getChannelData(0);

    let peak = 0;
    let sumSquares = 0;
    const samplesToAnalyze = Math.min(44100, data.length);

    for (let i = 0; i < samplesToAnalyze; i++) {
      const absValue = Math.abs(data[i]);
      peak = Math.max(peak, absValue);
      sumSquares += data[i] * data[i];
    }

    const rms = Math.sqrt(sumSquares / samplesToAnalyze);

    return (peak * 0.5) + (rms * 0.5);
  }

  calculateVolumeMultiplier(volume) {
    if (volume > 0.25) {
      console.log('🔇🔇 ARCHIVO MUY ALTO - Reducción fuerte');
      return 0.25;
    } else if (volume > 0.18) {
      console.log('🔇 Archivo alto - Reducción media-fuerte');
      return 0.40;
    } else if (volume > 0.12) {
      console.log('🔈 Archivo medio-alto - Reducción media');
      return 0.60;
    } else if (volume > 0.07) {
      console.log('🔉 Archivo normal');
      return 0.85;
    } else if (volume > 0.03) {
      return 1.0;
    } else {
      console.log('🔊 Archivo muy bajo - Pequeño boost');
      return 1.1;
    }
  }

  playNormalAudio(src, audioKey) {
    return new Promise((resolve, reject) => {
      console.log('🎵 Intentando reproducir audio normal:', src);

      const audio = new Audio();

      // 🔥 CONFIGURAR ANTES DE ASIGNAR SRC
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';

      const cachedVolume = this.volumeCache.get(audioKey);
      if (cachedVolume !== undefined) {
        const multiplier = this.calculateVolumeMultiplier(cachedVolume);
        audio.volume = Math.min(0.8, multiplier * 0.8);
        console.log('🎚️ Fallback con volumen:', audioKey, '->', audio.volume.toFixed(2));
      } else {
        audio.volume = 0.8; // 🔥 VOLUMEN MÁS ALTO PARA iOS
      }

      let hasEnded = false;

      audio.onended = () => {
        console.log('✅ Audio terminado:', audioKey);
        hasEnded = true;
        resolve(true);
      };

      audio.onerror = (e) => {
        console.error('❌ Error reproduciendo audio:', src, e);
        reject(new Error(`No se pudo reproducir ${src}`));
      };

      audio.oncanplaythrough = () => {
        console.log('📥 Audio cargado y listo:', audioKey);
      };

      // 🔥 ASIGNAR SRC Y REPRODUCIR
      audio.src = src;
      audio.load(); // Forzar carga

      // 🔥 ESPERAR UN POCO ANTES DE REPRODUCIR (CRÍTICO EN iOS)
      setTimeout(() => {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('▶️ Audio reproduciéndose:', audioKey);
              // Timeout de seguridad
              setTimeout(() => {
                if (!hasEnded) {
                  console.log('⏱️ Timeout - considerando audio terminado');
                  resolve(true);
                }
              }, 5000);
            })
            .catch(error => {
              console.error('❌ Error en play():', error.name, error.message);
              reject(error);
            });
        } else {
          // Navegadores antiguos
          setTimeout(() => resolve(true), 2000);
        }
      }, 50); // Pequeño delay para iOS
    });
  }
}

// Instancia global del compresor
const audioCompressor = new AudioCompressor();

// 🔥 NUEVO: Función para inicializar audio desde un evento de usuario
export async function initAudioForIOS() {
  await audioCompressor.unlockAudioContext();
}

// ---- Mapeo de tonos ----
const toneMap = {
  // Vocal A
  'ā':'a1', 'á':'a2', 'ǎ':'a3', 'à':'a4',
  // Vocal E
  'ē':'e1', 'é':'e2', 'ě':'e3', 'è':'e4',
  // Vocal I
  'ī':'i1', 'í':'i2', 'ǐ':'i3', 'ì':'i4',
  // Vocal O
  'ō':'o1', 'ó':'o2', 'ǒ':'o3', 'ò':'o4',
  // Vocal U
  'ū':'u1', 'ú':'u2', 'ǔ':'u3', 'ù':'u4',
  // Vocal Ü (v)
  'ǖ':'v1', 'ǘ':'v2', 'ǚ':'v3', 'ǜ':'v4',
  'ü':'v',
};

function toneMarkedToNumber(pinyin) {
  if (!pinyin) return { base: "", tone: 0 };
  let tone = 0;
  let out = "";
  for (const ch of pinyin) {
    if (toneMap[ch]) {
      out += toneMap[ch][0];
      tone = Number(toneMap[ch].slice(1));
    } else {
      out += ch;
    }
  }
  out = out.toLowerCase().replace("ü", "v").replace(/\s+/g, "_").trim();
  return { base: out, tone };
}

function variantsFor(key) {
  key = (key || "").toLowerCase().trim();

  const m = key.match(/^([a-züv_]+)([1-4])$/i);
  if (m) {
    const base = m[1].replace("ü", "v");
    const t = m[2];
    return [
      `${base}${t}`,
      `${base}-${t}`,
      `${base}_${t}`,
      base,
      base.replace(/_/g, "")
    ];
  }

  const t = toneMarkedToNumber(key);
  const base = t.base;
  const tone = t.tone;
  const out = [base, base.replace(/_/g, "")];
  if (tone) {
    out.unshift(`${base}${tone}`, `${base}-${tone}`, `${base}_${tone}`);
  }
  return Array.from(new Set(out));
}

let isInTTSCAll = false;

export async function playAudioSmart(category, keyOrObj, fallbackText) {
  if (isInTTSCAll) return false;

  const base = import.meta.env.BASE_URL || "/";
  const key = typeof keyOrObj === "string"
    ? keyOrObj
    : (keyOrObj?.pinyin || keyOrObj?.hanzi || "");

  const set = await loadManifest();
  const variants = variantsFor(key);

  for (const name of variants) {
    const candidate = `audio/${category}/${name}.mp3`;

    if (set.has(name)) {
      try {
        await audioCompressor.playCompressedAudio(`${base}${candidate}`, name);
        return true;
      } catch (error) {
        console.error('❌ Error reproduciendo MP3:', candidate, error);
      }
    }
  }

  if (fallbackText || key) {
    isInTTSCAll = true;
    try {
      const textToSpeak = fallbackText || key;
      speakChinese(textToSpeak);
      await new Promise(resolve => setTimeout(resolve, 100));
    } finally {
      setTimeout(() => {
        isInTTSCAll = false;
      }, 500);
    }
  }

  return false;
}

export async function pickBaseWithAllTones(candidates) {
  const set = await loadManifest();
  const bases = candidates && candidates.length ? candidates :
    ["ma","ba","da","li","qi","guo","zhu","shu","guang","hao","jian","xiao","zhao","shui","zhong"];

  for (const b of bases) {
    if (set.has(`${b}1`) && set.has(`${b}2`) && set.has(`${b}3`) && set.has(`${b}4`)) {
      return b;
    }
  }

  for (const b of bases) {
    const count = [1,2,3,4].filter(t => set.has(`${b}${t}`)).length;
    if (count >= 2) return b;
  }

  return bases[0];
}
