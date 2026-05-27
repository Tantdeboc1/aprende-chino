// src/components/stories/Avatars.jsx
//
// Estrategia híbrida:
//   1. Si existe un PNG en /src/assets/avatares/story/ para el personaje,
//      se usa la imagen (preferente).
//   2. Si no existe, se cae al avatar SVG chibi dibujado a mano (fallback).
//
// Convención de ficheros (en assets/avatares/story/, formato .webp preferente, .png también soportado):
//   - dong-ao   → personaje 东奥
//   - xiao-min  → personaje 晓敏
//   - ma-ke     → personaje 马可
//   - user-m    → protagonista hombre
//   - user-f    → protagonista mujer
//   - user-nb   → protagonista no binario
//
// Para el "user", el PNG concreto se elige según `profile.gender`.

import { loadUserProfile } from '@/utils/userProfile.js';

// Vite carga todos los PNGs disponibles. Si la carpeta está vacía o falta
// alguno, simplemente no aparecerán en el mapa y caeremos al SVG.
// Aceptamos webp (preferente para tamaño) y png como fallback.
const STORY_IMAGES = import.meta.glob(
  '/src/assets/avatares/story/*.{webp,png}',
  { eager: true, query: '?url', import: 'default' }
);

// Busca primero el .webp, luego el .png con el mismo nombre base.
function imageByBaseName(baseName) {
  for (const ext of ['webp', 'png']) {
    const target = `/${baseName}.${ext}`;
    const entry = Object.entries(STORY_IMAGES).find(([path]) => path.endsWith(target));
    if (entry) return entry[1];
  }
  return null;
}

/**
 * Devuelve la URL del PNG asignado a un personaje, o null si no existe.
 * Para 'user' se mira el género del perfil para elegir entre user-m/f/nb.
 */
export function getCharacterPng(characterId) {
  if (characterId === 'user') {
    const { gender } = loadUserProfile();
    const baseName =
      gender === 'f'  ? 'user-f'  :
      gender === 'nb' ? 'user-nb' :
                        'user-m';
    // Si no hay imagen para ese género concreto, probar fallbacks
    return imageByBaseName(baseName)
        || imageByBaseName('user-m')
        || imageByBaseName('user-f')
        || imageByBaseName('user-nb');
  }
  return imageByBaseName(characterId);
}

// ────────────────────────────────────────────────────────────────────────────
// FALLBACK SVG — los chibi dibujados a mano. Se usan solo si el PNG no existe.
// (Mantenemos esto para que el sistema no se rompa antes de generar las imágenes.)
// ────────────────────────────────────────────────────────────────────────────

function Body({ skin, shirt, shirtHi }) {
  return (
    <g>
      <rect x="90" y="178" width="20" height="14" rx="4" fill={skin} />
      <path d="M88,190 Q100,196 112,190 L112,194 Q100,200 88,194 Z" fill="rgba(0,0,0,0.20)" />
      <path d="M60,200 Q60,195 80,192 L120,192 Q140,195 140,200 L138,300 Q100,310 62,300 Z" fill={shirt} />
      <path d="M80,192 Q100,210 120,192 L120,212 Q100,224 80,212 Z" fill={shirtHi} />
      <circle cx="100" cy="218" r="2.2" fill="rgba(255,255,255,0.6)" />
      <circle cx="100" cy="238" r="2.2" fill="rgba(255,255,255,0.6)" />
      <path d="M60,200 Q48,232 50,278 L66,278 Q66,236 78,210 Z" fill={shirt} />
      <path d="M140,200 Q152,232 150,278 L134,278 Q134,236 122,210 Z" fill={shirt} />
      <circle cx="56" cy="288" r="11" fill={skin} />
      <circle cx="144" cy="288" r="11" fill={skin} />
    </g>
  );
}

function Face({ skin }) {
  return (
    <path d="M100,30 Q165,30 168,108 Q168,170 100,182 Q32,170 32,108 Q35,30 100,30 Z" fill={skin} />
  );
}

function Cheeks({ color }) {
  return (
    <g>
      <ellipse cx="62" cy="142" rx="11" ry="6" fill={color} opacity="0.75" />
      <ellipse cx="138" cy="142" rx="11" ry="6" fill={color} opacity="0.75" />
    </g>
  );
}

function Eyes({ surprised, eyeColor = '#2a1808' }) {
  const yC = surprised ? 118 : 122;
  const rx = surprised ? 16 : 14;
  const ry = surprised ? 21 : 18;
  const irisR = surprised ? 10.5 : 10;
  const pupilR = surprised ? 5 : 5.5;
  return (
    <g>
      <ellipse cx="75" cy={yC + 2} rx={rx + 1.5} ry={ry + 1.5} fill="rgba(0,0,0,0.12)" />
      <ellipse cx="125" cy={yC + 2} rx={rx + 1.5} ry={ry + 1.5} fill="rgba(0,0,0,0.12)" />
      <ellipse cx="75" cy={yC} rx={rx} ry={ry} fill="#ffffff" />
      <ellipse cx="125" cy={yC} rx={rx} ry={ry} fill="#ffffff" />
      <circle cx="75" cy={yC + 2} r={irisR} fill={eyeColor} />
      <circle cx="125" cy={yC + 2} r={irisR} fill={eyeColor} />
      <circle cx="75" cy={yC + 3} r={pupilR} fill="#0a0604" />
      <circle cx="125" cy={yC + 3} r={pupilR} fill="#0a0604" />
      <circle cx="79" cy={yC - 5} r="3.5" fill="#ffffff" />
      <circle cx="129" cy={yC - 5} r="3.5" fill="#ffffff" />
    </g>
  );
}

function Mouth({ surprised }) {
  if (surprised) {
    return (
      <g>
        <ellipse cx="100" cy="158" rx="8" ry="11" fill="#2a0e08" />
        <ellipse cx="100" cy="161" rx="6" ry="6" fill="#9a3838" />
      </g>
    );
  }
  return (
    <path d="M86,154 Q100,164 114,154" stroke="#2a0e08" strokeWidth="2.6"
      strokeLinecap="round" fill="none" />
  );
}

function Eyebrows({ surprised }) {
  if (surprised) {
    return (
      <g stroke="#1c1813" strokeWidth="2.8" strokeLinecap="round" fill="none">
        <path d="M58,88 Q75,78 92,88" />
        <path d="M108,88 Q125,78 142,88" />
      </g>
    );
  }
  return (
    <g stroke="#1c1813" strokeWidth="2.6" strokeLinecap="round" fill="none">
      <path d="M58,96 Q75,90 92,96" />
      <path d="M108,96 Q125,90 142,96" />
    </g>
  );
}

function Nose() {
  return <ellipse cx="100" cy="140" rx="1.6" ry="2.4" fill="rgba(0,0,0,0.28)" />;
}

function HairBase({ hair }) {
  // capucha simple que cubre el cráneo siguiendo la redondez
  return (
    <path
      d="M 24,128 Q 6,76 30,20 Q 68,-2 100,6 Q 132,-2 170,20 Q 194,76 176,128
         Q 158,106 132,84 Q 114,72 100,72 Q 86,72 68,84 Q 42,106 24,128 Z"
      fill={hair}
    />
  );
}

function FallbackUser({ expresion }) {
  const skin = '#f4d4b8', cheek = '#f0a8a8', hair = '#3a2a1f';
  const shirt = '#2f6b4a', shirtHi = '#3d7d59';
  const surprised = expresion === 'sorprendido';
  return (
    <g>
      <Body skin={skin} shirt={shirt} shirtHi={shirtHi} />
      <Face skin={skin} />
      <Cheeks color={cheek} />
      <Nose />
      <Mouth surprised={surprised} />
      <Eyes surprised={surprised} eyeColor="#3a2418" />
      <Eyebrows surprised={surprised} />
      <HairBase hair={hair} />
    </g>
  );
}

function FallbackDongAo({ expresion }) {
  const skin = '#f7dcbf', cheek = '#f7b8b8', hair = '#1a1410';
  const shirt = '#c8392f', shirtHi = '#d85a4e';
  const surprised = expresion === 'sorprendido';
  return (
    <g>
      <Body skin={skin} shirt={shirt} shirtHi={shirtHi} />
      <Face skin={skin} />
      <Cheeks color={cheek} />
      <Nose />
      <Mouth surprised={surprised} />
      <Eyes surprised={surprised} eyeColor="#1a0e08" />
      <Eyebrows surprised={surprised} />
      <HairBase hair={hair} />
    </g>
  );
}

function FallbackXiaoMin({ expresion }) {
  const skin = '#f9dcc1', cheek = '#f4b8b8', hair = '#221813';
  const shirt = '#b88a3e', shirtHi = '#cda156';
  const surprised = expresion === 'sorprendido';
  return (
    <g>
      <Body skin={skin} shirt={shirt} shirtHi={shirtHi} />
      <Face skin={skin} />
      <Cheeks color={cheek} />
      <Nose />
      <Mouth surprised={surprised} />
      <Eyes surprised={surprised} eyeColor="#2a1810" />
      <Eyebrows surprised={surprised} />
      <HairBase hair={hair} />
      {/* gafas */}
      <g stroke="#1c1813" strokeWidth="2.4" fill="rgba(255,255,255,0.10)">
        <circle cx="75" cy="122" r="22" />
        <circle cx="125" cy="122" r="22" />
        <line x1="97" y1="122" x2="103" y2="122" />
      </g>
    </g>
  );
}

function FallbackMaKe({ expresion }) {
  const skin = '#f2c8a0', cheek = '#f0a8a8', hair = '#4a2a18';
  const shirt = '#1f4a33', shirtHi = '#2f6b4a';
  const surprised = expresion === 'sorprendido';
  return (
    <g>
      <Body skin={skin} shirt={shirt} shirtHi={shirtHi} />
      <Face skin={skin} />
      <Cheeks color={cheek} />
      <Nose />
      <Mouth surprised={surprised} />
      <Eyes surprised={surprised} eyeColor="#3a2418" />
      <Eyebrows surprised={surprised} />
      <HairBase hair={hair} />
    </g>
  );
}

export const AVATARS = {
  'user':     FallbackUser,
  'dong-ao':  FallbackDongAo,
  'xiao-min': FallbackXiaoMin,
  'ma-ke':    FallbackMaKe,
};
