// src/styles/lessonColors.js
// Paleta única por lección. Importa esto en cualquier sitio que necesite
// colorear chips/cards de lecciones, en lugar de duplicar el objeto.
//
// Patrón visual: cada bloque de 4 temas repite la secuencia rojo · arena · arena · jade,
// que es la usada en HomeScreen para las cards de lección.

const RED   = { bg: 'bg-[#c8392f]', border: 'border-[#c8392f]', text: 'text-[#c8392f]' };
const SAND  = { bg: 'bg-[#b88a3e]', border: 'border-[#b88a3e]', text: 'text-[#b88a3e]' };
const JADE  = { bg: 'bg-[#2f6b4a]', border: 'border-[#2f6b4a]', text: 'text-[#2f6b4a]' };

// Color por número de lección. Para lecciones nuevas, basta con seguir la rotación.
export const LESSON_COLORS = {
  1: RED,
  2: SAND,
  3: SAND,
  4: JADE,
  5: RED,
  6: SAND,
  7: SAND,
  8: JADE,
};

// Color por defecto cuando la lección no está mapeada
export const DEFAULT_LESSON_COLOR = RED;

// Helper: nunca devuelve undefined
export function lessonColor(n) {
  return LESSON_COLORS[n] || DEFAULT_LESSON_COLOR;
}

// Lista de números de lección que existen actualmente.
// Usar en los selectores de filtro para evitar hardcodear [1,2,3,4,5,6,7,8].
export const LESSON_NUMBERS = Object.keys(LESSON_COLORS).map(Number).sort((a, b) => a - b);
