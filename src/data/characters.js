// src/data/characters.js
// Definición de personajes para Story Mode.
// Los SVGs se renderizan en CharacterDisplay.jsx; aquí solo paletas, datos
// y descriptores de rasgos (los componentes leen los rasgos y dibujan).

export const CHARACTERS = {
  'user': {
    id: 'user',
    nombre: null,        // se rellena dinámicamente con el nombre del perfil
    pinyin: null,
    perfil: 'Estudiante extranjero/a',
    palette: {
      skin: '#f4d4b8',
      hair: '#3a2a1f',
      hairHi: '#5a3f2d',
      shirt: '#2f6b4a',  // jade
      shirtHi: '#3d7d59',
      cheek: '#f0a8a8',
    },
    rasgos: {
      pelo: 'medio',     // medio | corto | largo | rizado
      ojos: 'normales',
      accesorio: null,
    },
  },
  'dong-ao': {
    id: 'dong-ao',
    nombre: '东奥',
    pinyin: 'Dōng Ào',
    perfil: 'Estudiante chino, despistado y gracioso.',
    palette: {
      skin: '#f7dcbf',
      hair: '#1a1410',
      hairHi: '#3a2a20',
      shirt: '#c8392f',  // red
      shirtHi: '#d85a4e',
      cheek: '#f7b8b8',
    },
    rasgos: {
      pelo: 'despeinado',
      ojos: 'grandes',
      accesorio: null,
    },
  },
  'xiao-min': {
    id: 'xiao-min',
    nombre: '晓敏',
    pinyin: 'Xiǎo Mǐn',
    perfil: 'Estudiante china, estudiosa y aplicada.',
    palette: {
      skin: '#f9dcc1',
      hair: '#221813',
      hairHi: '#3f2c22',
      shirt: '#b88a3e',  // sand
      shirtHi: '#cda156',
      cheek: '#f4b8b8',
    },
    rasgos: {
      pelo: 'coleta',
      ojos: 'serenos',
      accesorio: 'gafas',
    },
  },
  'ma-ke': {
    id: 'ma-ke',
    nombre: '马可',
    pinyin: 'Mǎ Kě',
    perfil: 'Estudiante italiano, secundario recurrente.',
    palette: {
      skin: '#f2c8a0',
      hair: '#4a2a18',
      hairHi: '#6a3f24',
      shirt: '#1f4a33',  // jade deep
      shirtHi: '#2f6b4a',
      cheek: '#f0a8a8',
    },
    rasgos: {
      pelo: 'rizado',
      ojos: 'normales',
      accesorio: null,
    },
  },
};

// Resuelve un personaje (puede inyectar el nombre del usuario).
export function getCharacter(id, userName = '') {
  const base = CHARACTERS[id];
  if (!base) return null;
  if (id === 'user') {
    return { ...base, nombre: userName || 'Tú', pinyin: '' };
  }
  return base;
}
