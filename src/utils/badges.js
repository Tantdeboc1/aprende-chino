// src/utils/badges.js
// Insignias: medallas que se desbloquean según el progreso del usuario.
// Las condiciones se evalúan en cliente a partir de los datos que ya
// tenemos (progress, streak, leveling). Sin estado persistente extra —
// si los datos están, la insignia aparece como ganada.
import { getSRSStats } from './srs.js';
import { getLessonStats } from './progress.js';
import { getStreak } from './streak.js';
import { getLevelInfo } from './leveling.js';

// Cada entrada: `when(ctx)` decide si está ganada. El orden del array es
// el orden de visualización en la rejilla del Perfil.
//
// `title` y `desc` llevan los 6 idiomas inline (mismo patrón que ACHIEVEMENTS
// en leveling.js) en vez de pasar por i18next: son datos, no cadenas de UI, y
// así viven junto a la condición que describen. Se resuelven con loc().
export const BADGE_DEFS = [
  {
    id: 'first-step', icon: '🌱',
    title: { es: 'Primer paso', en: 'First step', fr: 'Premier pas', de: 'Erster Schritt', it: 'Primo passo', pt: 'Primeiro passo' },
    desc:  { es: 'Aprende tu primer carácter', en: 'Learn your first character', fr: 'Apprends ton premier caractère', de: 'Lerne dein erstes Zeichen', it: 'Impara il tuo primo carattere', pt: 'Aprende o teu primeiro caractere' },
    when: c => c.srsStats.learned >= 1,
  },
  {
    id: 'apprentice', icon: '📖',
    title: { es: 'Aprendiz', en: 'Apprentice', fr: 'Apprenti', de: 'Lehrling', it: 'Apprendista', pt: 'Aprendiz' },
    desc:  { es: 'Aprende 25 caracteres', en: 'Learn 25 characters', fr: 'Apprends 25 caractères', de: 'Lerne 25 Zeichen', it: 'Impara 25 caratteri', pt: 'Aprende 25 caracteres' },
    when: c => c.srsStats.learned >= 25,
  },
  {
    id: 'scholar', icon: '🎓',
    title: { es: 'Estudioso', en: 'Scholar', fr: 'Érudit', de: 'Gelehrter', it: 'Studioso', pt: 'Estudioso' },
    desc:  { es: 'Aprende 100 caracteres', en: 'Learn 100 characters', fr: 'Apprends 100 caractères', de: 'Lerne 100 Zeichen', it: 'Impara 100 caratteri', pt: 'Aprende 100 caracteres' },
    when: c => c.srsStats.learned >= 100,
  },
  {
    id: 'mature-50', icon: '🌳',
    title: { es: 'Memoria sólida', en: 'Solid memory', fr: 'Mémoire solide', de: 'Festes Gedächtnis', it: 'Memoria solida', pt: 'Memória sólida' },
    desc:  { es: '50 caracteres en memoria a largo plazo', en: '50 characters in long-term memory', fr: '50 caractères en mémoire à long terme', de: '50 Zeichen im Langzeitgedächtnis', it: '50 caratteri nella memoria a lungo termine', pt: '50 caracteres na memória de longo prazo' },
    when: c => c.srsStats.mature >= 50,
  },
  {
    id: 'centurion', icon: '💯',
    title: { es: 'Centenario', en: 'Centurion', fr: 'Centurion', de: 'Zenturio', it: 'Centurione', pt: 'Centenário' },
    desc:  { es: 'Domina 100 caracteres', en: 'Master 100 characters', fr: 'Maîtrise 100 caractères', de: 'Beherrsche 100 Zeichen', it: 'Padroneggia 100 caratteri', pt: 'Domina 100 caracteres' },
    when: c => c.totalMastered >= 100,
  },
  {
    id: 'streak-3', icon: '🌶️',
    title: { es: '3 días seguidos', en: '3 days in a row', fr: '3 jours d’affilée', de: '3 Tage am Stück', it: '3 giorni di fila', pt: '3 dias seguidos' },
    desc:  { es: 'Mantén una racha de 3 días', en: 'Keep a 3-day streak', fr: 'Garde une série de 3 jours', de: 'Halte eine 3-Tage-Serie', it: 'Mantieni una serie di 3 giorni', pt: 'Mantém uma sequência de 3 dias' },
    when: c => (c.streak.longestStreak || c.streak.currentStreak || 0) >= 3,
  },
  {
    id: 'streak-7', icon: '🔥',
    title: { es: 'Una semana', en: 'One week', fr: 'Une semaine', de: 'Eine Woche', it: 'Una settimana', pt: 'Uma semana' },
    desc:  { es: 'Mantén una racha de 7 días', en: 'Keep a 7-day streak', fr: 'Garde une série de 7 jours', de: 'Halte eine 7-Tage-Serie', it: 'Mantieni una serie di 7 giorni', pt: 'Mantém uma sequência de 7 dias' },
    when: c => (c.streak.longestStreak || c.streak.currentStreak || 0) >= 7,
  },
  {
    id: 'streak-30', icon: '⚡',
    title: { es: 'Imparable', en: 'Unstoppable', fr: 'Inarrêtable', de: 'Unaufhaltsam', it: 'Inarrestabile', pt: 'Imparável' },
    desc:  { es: 'Mantén una racha de 30 días', en: 'Keep a 30-day streak', fr: 'Garde une série de 30 jours', de: 'Halte eine 30-Tage-Serie', it: 'Mantieni una serie di 30 giorni', pt: 'Mantém uma sequência de 30 dias' },
    when: c => (c.streak.longestStreak || c.streak.currentStreak || 0) >= 30,
  },
  {
    id: 'perfectionist', icon: '🎯',
    title: { es: 'Perfeccionista', en: 'Perfectionist', fr: 'Perfectionniste', de: 'Perfektionist', it: 'Perfezionista', pt: 'Perfecionista' },
    desc:  { es: '90 % de acierto con 50+ respuestas', en: '90% accuracy over 50+ answers', fr: '90 % de réussite sur 50+ réponses', de: '90 % Treffer bei 50+ Antworten', it: '90% di risposte esatte su 50+', pt: '90% de acerto com 50+ respostas' },
    when: c => c.totalAnswers >= 50 && c.accuracy >= 90,
  },
  {
    id: 'four-seasons', icon: '🌸',
    title: { es: 'Cuatro estaciones', en: 'Four seasons', fr: 'Quatre saisons', de: 'Vier Jahreszeiten', it: 'Quattro stagioni', pt: 'Quatro estações' },
    desc:  { es: 'Llega al 50 % en 4 lecciones', en: 'Reach 50% in 4 lessons', fr: 'Atteins 50 % dans 4 leçons', de: 'Erreiche 50 % in 4 Lektionen', it: 'Raggiungi il 50% in 4 lezioni', pt: 'Chega aos 50% em 4 lições' },
    when: c => c.lessonsHalfDone >= 4,
  },
  {
    id: 'level-5', icon: '⭐',
    title: { es: 'Nivel 5', en: 'Level 5', fr: 'Niveau 5', de: 'Level 5', it: 'Livello 5', pt: 'Nível 5' },
    desc:  { es: 'Alcanza el nivel 5', en: 'Reach level 5', fr: 'Atteins le niveau 5', de: 'Erreiche Level 5', it: 'Raggiungi il livello 5', pt: 'Alcança o nível 5' },
    when: c => c.levelInfo.level >= 5,
  },
  {
    id: 'level-10', icon: '🌟',
    title: { es: 'Nivel 10', en: 'Level 10', fr: 'Niveau 10', de: 'Level 10', it: 'Livello 10', pt: 'Nível 10' },
    desc:  { es: 'Alcanza el nivel 10', en: 'Reach level 10', fr: 'Atteins le niveau 10', de: 'Erreiche Level 10', it: 'Raggiungi il livello 10', pt: 'Alcança o nível 10' },
    when: c => c.levelInfo.level >= 10,
  },
  {
    id: 'writer', icon: '✍️',
    title: { es: 'Calígrafo', en: 'Calligrapher', fr: 'Calligraphe', de: 'Kalligraf', it: 'Calligrafo', pt: 'Calígrafo' },
    desc:  { es: 'Practica la escritura 50 veces', en: 'Practise writing 50 times', fr: 'Pratique l’écriture 50 fois', de: 'Übe 50-mal das Schreiben', it: 'Esercitati nella scrittura 50 volte', pt: 'Pratica a escrita 50 vezes' },
    when: c => c.writingCount >= 50,
  },
];

export function computeBadges(progress, allCharacters) {
  const srsStats = getSRSStats(progress, allCharacters);
  const streak = getStreak();
  const levelInfo = getLevelInfo(streak.totalXP || 0);

  // Agregados por lección — derivadas de los datos, no de un rango fijo.
  const lessonNums = [...new Set(allCharacters.map(c => c.lesson).filter(Boolean))];
  let totalMastered = 0;
  let lessonsHalfDone = 0;
  for (const n of lessonNums) {
    const s = getLessonStats(progress, n, allCharacters);
    totalMastered += s.mastered;
    if (s.total > 0 && (s.mastered / s.total) >= 0.5) lessonsHalfDone++;
  }

  // Precisión global a partir de los aciertos/fallos por palabra. Antes se
  // leía de progress.__srs (d.reviews / d.correct), campos que updateSRS no
  // escribe nunca: la precisión salía siempre 0 y la insignia 'perfectionist'
  // era inalcanzable. Los contadores reales los lleva markWordResult.
  let correct = 0, totalAnswers = 0;
  for (const [key, lesson] of Object.entries(progress || {})) {
    if (!key.startsWith('lesson_') || !lesson || typeof lesson !== 'object') continue;
    for (const [char, word] of Object.entries(lesson)) {
      if (char.startsWith('__') || !word || typeof word !== 'object') continue;
      correct += word.correct || 0;
      totalAnswers += (word.correct || 0) + (word.incorrect || 0);
    }
  }
  const accuracy = totalAnswers > 0 ? Math.round((correct / totalAnswers) * 100) : 0;

  const writing = progress?.__writing || {};
  const writingCount = Object.values(writing).reduce((a, n) => a + (n || 0), 0);

  const ctx = {
    srsStats, streak, levelInfo, totalMastered, lessonsHalfDone,
    totalAnswers, accuracy, writingCount,
  };

  return BADGE_DEFS.map(b => ({
    id: b.id, icon: b.icon, title: b.title, desc: b.desc,
    earned: !!b.when(ctx),
  }));
}
