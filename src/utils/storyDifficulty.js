// src/utils/storyDifficulty.js
// Lectura compartida del nivel de dificultad para el modo Story.
// La fuente de verdad es localStorage (StoryPlayer la persiste).

const LS_KEY = 'aprende-chino-story-difficulty';

export function getStoryDifficulty() {
  try { return localStorage.getItem(LS_KEY) || 'normal'; }
  catch { return 'normal'; }
}

// ¿Debe mostrarse el pinyin en ejercicios para esta dificultad?
//   facil   → siempre visible
//   normal  → visible (en diálogo es revelable, pero en ejercicios mostrar
//             siempre rompía la idea; en ejercicios sí lo mostramos por
//             ser un quiz, pero se puede ocultar pasando false a este map).
//   dificil → nunca
export function shouldShowExercisePinyin(diff = getStoryDifficulty()) {
  if (diff === 'dificil') return false;
  if (diff === 'normal')  return false; // en ejercicios, normal = solo hanzi
  return true;                          // facil = pinyin visible
}
