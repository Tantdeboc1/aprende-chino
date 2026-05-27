// src/data/avatars.js
// Registro de avatares de perfil. Vite resuelve cada import como URL
// estática del bundle. El género ('m' | 'f' | 'nb') sirve para filtrar
// la galería; el usuario siempre puede ver todos.

// ─── Carpeta 1: avatares_HD (nombres descriptivos) ──────────────────────────
import a01 from '@/assets/avatares/avatares_HD/avatar_01_chico_mochila.webp';
import a02 from '@/assets/avatares/avatares_HD/avatar_02_chica_gafas_rojas.webp';
import a03 from '@/assets/avatares/avatares_HD/avatar_03_gamer_auriculares.webp';
import a04 from '@/assets/avatares/avatares_HD/avatar_04_chica_tradicional.webp';
import a05 from '@/assets/avatares/avatares_HD/avatar_05_hombre_traje.webp';
import a06 from '@/assets/avatares/avatares_HD/avatar_06_panda_hoodie.webp';
import a07 from '@/assets/avatares/avatares_HD/avatar_07_chef.webp';
import a08 from '@/assets/avatares/avatares_HD/avatar_08_mascara_kitsune.webp';
import a09 from '@/assets/avatares/avatares_HD/avatar_09_ninja_banda_roja.webp';
import a10 from '@/assets/avatares/avatares_HD/avatar_10_astronauta.webp';

// ─── Carpeta 2: avatares2_HD ────────────────────────────────────────────────
import b01 from '@/assets/avatares/avatares2_HD/avatar2_01.webp';
import b02 from '@/assets/avatares/avatares2_HD/avatar2_02.webp';
import b03 from '@/assets/avatares/avatares2_HD/avatar2_03.webp';
import b04 from '@/assets/avatares/avatares2_HD/avatar2_04.webp';
import b05 from '@/assets/avatares/avatares2_HD/avatar2_05.webp';
import b06 from '@/assets/avatares/avatares2_HD/avatar2_06.webp';
import b07 from '@/assets/avatares/avatares2_HD/avatar2_07.webp';
import b08 from '@/assets/avatares/avatares2_HD/avatar2_08.webp';
import b09 from '@/assets/avatares/avatares2_HD/avatar2_09.webp';
import b10 from '@/assets/avatares/avatares2_HD/avatar2_10.webp';

// gender:  'm' = hombre · 'f' = mujer · 'nb' = no binario
export const AVATARS = [
  { id: 'a01', src: a01, gender: 'm',  label: 'Chico mochila' },
  { id: 'a02', src: a02, gender: 'f',  label: 'Chica gafas rojas' },
  { id: 'a03', src: a03, gender: 'm',  label: 'Gamer' },
  { id: 'a04', src: a04, gender: 'f',  label: 'Chica tradicional' },
  { id: 'a05', src: a05, gender: 'm',  label: 'Hombre traje' },
  { id: 'a06', src: a06, gender: 'f',  label: 'Hoodie panda' },
  { id: 'a07', src: a07, gender: 'm',  label: 'Chef' },
  { id: 'a08', src: a08, gender: 'f',  label: 'Máscara kitsune' },
  { id: 'a09', src: a09, gender: 'm',  label: 'Ninja' },
  { id: 'a10', src: a10, gender: 'nb', label: 'Astronauta' },

  { id: 'b01', src: b01, gender: 'm',  label: 'Pelirrojo rayas' },
  { id: 'b02', src: b02, gender: 'f',  label: 'Rubia gafas rosas' },
  { id: 'b03', src: b03, gender: 'm',  label: 'Rizado hoodie naranja' },
  { id: 'b04', src: b04, gender: 'f',  label: 'Trenza tradicional' },
  { id: 'b05', src: b05, gender: 'm',  label: 'Estudioso chaleco' },
  { id: 'b06', src: b06, gender: 'm',  label: 'Skater gorra' },
  { id: 'b07', src: b07, gender: 'f',  label: 'Moños morados' },
  { id: 'b08', src: b08, gender: 'm',  label: 'Karateca' },
  { id: 'b09', src: b09, gender: 'f',  label: 'Orejas de zorro' },
  { id: 'b10', src: b10, gender: 'm',  label: 'Aviador' },
];

export const AVATARS_BY_ID = Object.fromEntries(AVATARS.map(a => [a.id, a]));

export function getAvatarById(id) {
  return AVATARS_BY_ID[id] || null;
}

// Avatar por defecto si el usuario no ha elegido aún
export const DEFAULT_AVATAR_ID = 'a01';

export function getAvatarsByGender(gender) {
  if (!gender) return AVATARS;
  return AVATARS.filter(a => a.gender === gender);
}
