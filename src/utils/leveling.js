// src/utils/leveling.js
// Sistema de niveles, títulos y logros

// ── Niveles ──────────────────────────────────────────────────────────────────
const LEVELS = [
  // Beginner journey (1-5)
  { level: 1,  xp: 0,      title: { es: 'Curioso',          en: 'Curious',          fr: 'Curieux',           de: 'Neugierig',          it: 'Curioso',           pt: 'Curioso'          }, zh: '好奇者',   icon: '🥒' },
  { level: 2,  xp: 50,     title: { es: 'Principiante',     en: 'Beginner',         fr: 'Débutant',          de: 'Anfänger',           it: 'Principiante',      pt: 'Principiante'     }, zh: '初学者',   icon: '🌱' },
  { level: 3,  xp: 150,    title: { es: 'Aprendiz',         en: 'Apprentice',       fr: 'Apprenti',          de: 'Lehrling',           it: 'Apprendista',       pt: 'Aprendiz'         }, zh: '学徒',     icon: '📖' },
  { level: 4,  xp: 300,    title: { es: 'Estudiante',       en: 'Student',          fr: 'Étudiant',          de: 'Student',            it: 'Studente',          pt: 'Estudante'        }, zh: '学生',     icon: '✏️' },
  { level: 5,  xp: 500,    title: { es: 'Practicante',      en: 'Practitioner',     fr: 'Pratiquant',        de: 'Übender',            it: 'Praticante',        pt: 'Praticante'       }, zh: '练习者',   icon: '⚡' },

  // Intermediate (6-10)
  { level: 6,  xp: 800,    title: { es: 'Conocedor',        en: 'Connoisseur',      fr: 'Connaisseur',       de: 'Kenner',             it: 'Conoscitore',       pt: 'Conhecedor'       }, zh: '知者',     icon: '🧠' },
  { level: 7,  xp: 1200,   title: { es: 'Erudito',          en: 'Scholar',          fr: 'Érudit',            de: 'Gelehrter',          it: 'Erudito',           pt: 'Erudito'          }, zh: '学者',     icon: '🎓' },
  { level: 8,  xp: 1800,   title: { es: 'Experto',          en: 'Expert',           fr: 'Expert',            de: 'Experte',            it: 'Esperto',           pt: 'Especialista'     }, zh: '专家',     icon: '💎' },
  { level: 9,  xp: 2500,   title: { es: 'Estratega',        en: 'Strategist',       fr: 'Stratège',          de: 'Stratege',           it: 'Stratega',          pt: 'Estrategista'     }, zh: '策略家',   icon: '♟️' },
  { level: 10, xp: 3500,   title: { es: 'Maestro',          en: 'Master',           fr: 'Maître',            de: 'Meister',            it: 'Maestro',           pt: 'Mestre'           }, zh: '大师',     icon: '🐉' },

  // Advanced (11-15)
  { level: 11, xp: 5000,   title: { es: 'Sabio',            en: 'Sage',             fr: 'Sage',              de: 'Weiser',             it: 'Saggio',            pt: 'Sábio'            }, zh: '圣人',     icon: '👑' },
  { level: 12, xp: 7000,   title: { es: 'Profesor',         en: 'Professor',        fr: 'Professeur',        de: 'Professor',          it: 'Professore',        pt: 'Professor'        }, zh: '教授',     icon: '📜' },
  { level: 13, xp: 9500,   title: { es: 'Guardián de Caracteres', en: 'Guardian of Characters', fr: 'Gardien des Caractères', de: 'Hüter der Zeichen', it: 'Guardiano dei Caratteri', pt: 'Guardião dos Caracteres' }, zh: '字守者', icon: '🛡️' },
  { level: 14, xp: 12500,  title: { es: 'Inmortal',         en: 'Immortal',         fr: 'Immortel',          de: 'Unsterblicher',      it: 'Immortale',         pt: 'Imortal'          }, zh: '不朽者',   icon: '✨' },
  { level: 15, xp: 16000,  title: { es: 'Dragón',           en: 'Dragon',           fr: 'Dragon',            de: 'Drache',             it: 'Drago',             pt: 'Dragão'           }, zh: '龙',       icon: '🐲' },

  // Elite (16-20)
  { level: 16, xp: 20000,  title: { es: 'Fénix',            en: 'Phoenix',          fr: 'Phénix',            de: 'Phönix',             it: 'Fenice',            pt: 'Fênix'            }, zh: '凤凰',     icon: '🔥' },
  { level: 17, xp: 25000,  title: { es: 'Emperador de Tonos', en: 'Emperor of Tones', fr: 'Empereur des Tons', de: 'Kaiser der Töne',   it: 'Imperatore dei Toni', pt: 'Imperador dos Tons' }, zh: '声调帝', icon: '👑' },
  { level: 18, xp: 31000,  title: { es: 'Erudito de Jade',  en: 'Jade Scholar',     fr: 'Érudit de Jade',    de: 'Jade-Gelehrter',     it: 'Erudito di Giada',  pt: 'Erudito de Jade'  }, zh: '玉学者',   icon: '💚' },
  { level: 19, xp: 38000,  title: { es: 'Escriba Celestial', en: 'Celestial Scribe', fr: 'Scribe Céleste',   de: 'Himmlischer Schreiber', it: 'Scriba Celeste',  pt: 'Escriba Celestial' }, zh: '天书人', icon: '🌌' },
  { level: 20, xp: 46000,  title: { es: 'Iluminado',        en: 'Enlightened',      fr: 'Éclairé',           de: 'Erleuchteter',       it: 'Illuminato',        pt: 'Iluminado'        }, zh: '觉者',     icon: '☀️' },

  // Legendary (21-25)
  { level: 21, xp: 55000,  title: { es: 'Guardián de Pergaminos', en: 'Keeper of Scrolls', fr: 'Gardien des Rouleaux', de: 'Hüter der Schriftrollen', it: 'Custode dei Rotoli', pt: 'Guardião dos Pergaminhos' }, zh: '卷守者', icon: '📜' },
  { level: 22, xp: 65000,  title: { es: 'Oráculo',          en: 'Oracle',           fr: 'Oracle',            de: 'Orakel',             it: 'Oracolo',           pt: 'Oráculo'          }, zh: '神谕者',   icon: '🔮' },
  { level: 23, xp: 77000,  title: { es: 'Sabio Mítico',     en: 'Mythical Sage',    fr: 'Sage Mythique',     de: 'Mythischer Weiser',  it: 'Saggio Mitico',     pt: 'Sábio Mítico'     }, zh: '神圣贤者', icon: '🌠' },
  { level: 24, xp: 90000,  title: { es: 'Trascendente',     en: 'Transcendent',     fr: 'Transcendant',      de: 'Transzendenter',     it: 'Trascendente',      pt: 'Transcendente'    }, zh: '超越者',   icon: '🌀' },
  { level: 25, xp: 105000, title: { es: 'Erudito Cósmico',  en: 'Cosmic Scholar',   fr: 'Érudit Cosmique',   de: 'Kosmischer Gelehrter', it: 'Erudito Cosmico', pt: 'Erudito Cósmico'  }, zh: '宇宙学者', icon: '🌌' },

  // Ultimate (26-30)
  { level: 26, xp: 122000, title: { es: 'Maestro Eterno',   en: 'Eternal Master',   fr: 'Maître Éternel',    de: 'Ewiger Meister',     it: 'Maestro Eterno',    pt: 'Mestre Eterno'    }, zh: '永恒大师', icon: '♾️' },
  { level: 27, xp: 141000, title: { es: 'Arquitecto de Palabras', en: 'Architect of Words', fr: 'Architecte des Mots', de: 'Architekt der Wörter', it: 'Architetto delle Parole', pt: 'Arquiteto das Palavras' }, zh: '字建师', icon: '🏛️' },
  { level: 28, xp: 163000, title: { es: 'Soberano del Hanzi', en: 'Sovereign of Hanzi', fr: 'Souverain du Hanzi', de: 'Souverän des Hanzi', it: 'Sovrano degli Hanzi', pt: 'Soberano do Hanzi' }, zh: '汉字王', icon: '⚜️' },
  { level: 29, xp: 188000, title: { es: 'Sabio Supremo',    en: 'Supreme Sage',     fr: 'Sage Suprême',      de: 'Höchster Weiser',    it: 'Saggio Supremo',    pt: 'Sábio Supremo'    }, zh: '至圣',     icon: '🏆' },
  { level: 30, xp: 216000, title: { es: 'Sabio Inmortal',   en: 'Immortal Sage',    fr: 'Sage Immortel',     de: 'Unsterblicher Weiser', it: 'Saggio Immortale', pt: 'Sábio Imortal'    }, zh: '仙人',     icon: '🌟' },
];

// ── Logros que desbloquean títulos extra ──────────────────────────────────────
const ACHIEVEMENTS = [
  // ── Quiz completion ─────────────────────────────────────────────────────────
  {
    id: 'first_quiz',
    condition: 'complete_quiz',
    threshold: 1,
    title: { es: 'Primer paso',    en: 'First step',     fr: 'Premier pas',    de: 'Erster Schritt',   it: 'Primo passo',     pt: 'Primeiro passo' },
    zh: '第一步',
    icon: '👣',
    desc:  { es: 'Completa tu primer quiz', en: 'Complete your first quiz', fr: 'Termine ton premier quiz', de: 'Schließe dein erstes Quiz ab', it: 'Completa il tuo primo quiz', pt: 'Complete seu primeiro quiz' },
  },
  {
    id: 'quiz_10',
    condition: 'complete_quiz',
    threshold: 10,
    title: { es: 'Dedicado',       en: 'Dedicated',      fr: 'Dévoué',         de: 'Engagiert',        it: 'Dedicato',        pt: 'Dedicado' },
    zh: '专注者',
    icon: '📝',
    desc:  { es: 'Completa 10 quizzes', en: 'Complete 10 quizzes', fr: 'Termine 10 quiz', de: '10 Quiz abschließen', it: 'Completa 10 quiz', pt: 'Complete 10 quizzes' },
  },
  {
    id: 'quiz_50',
    condition: 'complete_quiz',
    threshold: 50,
    title: { es: 'Veterano',       en: 'Veteran',        fr: 'Vétéran',        de: 'Veteran',          it: 'Veterano',        pt: 'Veterano' },
    zh: '老手',
    icon: '🎖️',
    desc:  { es: 'Completa 50 quizzes', en: 'Complete 50 quizzes', fr: 'Termine 50 quiz', de: '50 Quiz abschließen', it: 'Completa 50 quiz', pt: 'Complete 50 quizzes' },
  },
  {
    id: 'quiz_100',
    condition: 'complete_quiz',
    threshold: 100,
    title: { es: 'Centurión',      en: 'Centurion',      fr: 'Centurion',      de: 'Zenturio',         it: 'Centurione',      pt: 'Centurião' },
    zh: '百战者',
    icon: '🏅',
    desc:  { es: 'Completa 100 quizzes', en: 'Complete 100 quizzes', fr: 'Termine 100 quiz', de: '100 Quiz abschließen', it: 'Completa 100 quiz', pt: 'Complete 100 quizzes' },
  },

  // ── Streak ──────────────────────────────────────────────────────────────────
  {
    id: 'streak_3',
    condition: 'streak',
    threshold: 3,
    title: { es: 'En racha',       en: 'On a roll',      fr: 'En série',       de: 'In Fahrt',         it: 'In serie',        pt: 'Em sequência' },
    zh: '连续者',
    icon: '🔥',
    desc:  { es: '3 días de racha', en: '3 day streak', fr: '3 jours de série', de: '3 Tage Serie', it: '3 giorni di serie', pt: '3 dias de sequência' },
  },
  {
    id: 'streak_7',
    condition: 'streak',
    threshold: 7,
    title: { es: 'Constante',      en: 'Consistent',     fr: 'Constant',       de: 'Beständig',       it: 'Costante',        pt: 'Constante' },
    zh: '坚持者',
    icon: '🔥',
    desc:  { es: '7 días de racha', en: '7 day streak', fr: '7 jours de série', de: '7 Tage Serie', it: '7 giorni di serie', pt: '7 dias de sequência' },
  },
  {
    id: 'streak_14',
    condition: 'streak',
    threshold: 14,
    title: { es: 'Perseverante',   en: 'Perseverant',    fr: 'Persévérant',    de: 'Ausdauernd',      it: 'Perseverante',    pt: 'Perseverante' },
    zh: '毅力者',
    icon: '💪',
    desc:  { es: '14 días de racha', en: '14 day streak', fr: '14 jours de série', de: '14 Tage Serie', it: '14 giorni di serie', pt: '14 dias de sequência' },
  },
  {
    id: 'streak_30',
    condition: 'streak',
    threshold: 30,
    title: { es: 'Imparable',      en: 'Unstoppable',    fr: 'Inarrêtable',    de: 'Unaufhaltsam',    it: 'Inarrestabile',   pt: 'Imparável' },
    zh: '不可阻挡',
    icon: '💪',
    desc:  { es: '30 días de racha', en: '30 day streak', fr: '30 jours de série', de: '30 Tage Serie', it: '30 giorni di serie', pt: '30 dias de sequência' },
  },
  {
    id: 'streak_60',
    condition: 'streak',
    threshold: 60,
    title: { es: 'Inquebrantable', en: 'Unbreakable',    fr: 'Incassable',     de: 'Unzerbrechlich',  it: 'Infrangibile',    pt: 'Inquebrantável' },
    zh: '钢铁意志',
    icon: '🛡️',
    desc:  { es: '60 días de racha', en: '60 day streak', fr: '60 jours de série', de: '60 Tage Serie', it: '60 giorni di serie', pt: '60 dias de sequência' },
  },
  {
    id: 'streak_100',
    condition: 'streak',
    threshold: 100,
    title: { es: 'Leyenda Viviente', en: 'Living Legend',  fr: 'Légende Vivante', de: 'Lebende Legende', it: 'Leggenda Vivente', pt: 'Lenda Viva' },
    zh: '活传奇',
    icon: '🌟',
    desc:  { es: '100 días de racha', en: '100 day streak', fr: '100 jours de série', de: '100 Tage Serie', it: '100 giorni di serie', pt: '100 dias de sequência' },
  },

  // ── Perfect scores ──────────────────────────────────────────────────────────
  {
    id: 'perfect_exam',
    condition: 'perfect_score',
    threshold: 1,
    title: { es: 'Sin fallos',     en: 'Flawless',       fr: 'Sans faute',     de: 'Fehlerlos',       it: 'Senza errori',    pt: 'Sem falhas' },
    zh: '完美',
    icon: '💯',
    desc:  { es: '100% en un examen', en: '100% on an exam', fr: '100% à un examen', de: '100% bei einer Prüfung', it: '100% in un esame', pt: '100% num exame' },
  },
  {
    id: 'perfect_5',
    condition: 'perfect_score',
    threshold: 5,
    title: { es: 'Perfeccionista',  en: 'Perfectionist',  fr: 'Perfectionniste', de: 'Perfektionist',   it: 'Perfezionista',   pt: 'Perfeccionista' },
    zh: '完美主义者',
    icon: '🎯',
    desc:  { es: '5 puntuaciones perfectas', en: '5 perfect scores', fr: '5 scores parfaits', de: '5 perfekte Ergebnisse', it: '5 punteggi perfetti', pt: '5 pontuações perfeitas' },
  },
  {
    id: 'perfect_20',
    condition: 'perfect_score',
    threshold: 20,
    title: { es: 'Impecable',      en: 'Impeccable',     fr: 'Impeccable',     de: 'Makellos',        it: 'Impeccabile',     pt: 'Impecável' },
    zh: '无瑕',
    icon: '✨',
    desc:  { es: '20 puntuaciones perfectas', en: '20 perfect scores', fr: '20 scores parfaits', de: '20 perfekte Ergebnisse', it: '20 punteggi perfetti', pt: '20 pontuações perfeitas' },
  },

  // ── Words mastered ──────────────────────────────────────────────────────────
  {
    id: 'master_10',
    condition: 'words_mastered',
    threshold: 10,
    title: { es: 'Vocabulario Inicial', en: 'First Words',  fr: 'Premiers Mots',  de: 'Erste Wörter',    it: 'Prime Parole',    pt: 'Primeiras Palavras' },
    zh: '十字通',
    icon: '📚',
    desc:  { es: 'Domina 10 palabras', en: 'Master 10 words', fr: 'Maîtrise 10 mots', de: '10 Wörter meistern', it: 'Padroneggia 10 parole', pt: 'Domine 10 palavras' },
  },
  {
    id: 'master_50',
    condition: 'words_mastered',
    threshold: 50,
    title: { es: 'Políglota',      en: 'Polyglot',       fr: 'Polyglotte',     de: 'Polyglott',       it: 'Poliglotta',      pt: 'Poliglota' },
    zh: '多语者',
    icon: '🌍',
    desc:  { es: 'Domina 50 palabras', en: 'Master 50 words', fr: 'Maîtrise 50 mots', de: '50 Wörter meistern', it: 'Padroneggia 50 parole', pt: 'Domine 50 palavras' },
  },
  {
    id: 'master_100',
    condition: 'words_mastered',
    threshold: 100,
    title: { es: 'Maestro del Léxico', en: 'Lexicon Master', fr: 'Maître du Lexique', de: 'Lexikon-Meister', it: 'Maestro del Lessico', pt: 'Mestre do Léxico' },
    zh: '百字王',
    icon: '👑',
    desc:  { es: 'Domina 100 palabras', en: 'Master 100 words', fr: 'Maîtrise 100 mots', de: '100 Wörter meistern', it: 'Padroneggia 100 parole', pt: 'Domine 100 palavras' },
  },

  // ── Time race ───────────────────────────────────────────────────────────────
  {
    id: 'speed_demon',
    condition: 'time_race_score',
    threshold: 80,
    title: { es: 'Velocista',      en: 'Speed demon',    fr: 'Véloce',         de: 'Blitzschnell',    it: 'Velocista',       pt: 'Velocista' },
    zh: '飞速',
    icon: '⚡',
    desc:  { es: '80+ puntos en Carrera Contrarreloj', en: '80+ points in Time Race', fr: '80+ points en Course', de: '80+ Punkte im Zeitrennen', it: '80+ punti nella Corsa', pt: '80+ pontos na Corrida' },
  },

  // ── Lessons ─────────────────────────────────────────────────────────────────
  {
    id: 'all_lessons',
    condition: 'lessons_seen',
    threshold: 4,
    title: { es: 'Explorador',     en: 'Explorer',       fr: 'Explorateur',    de: 'Entdecker',       it: 'Esploratore',     pt: 'Explorador' },
    zh: '探索者',
    icon: '🗺️',
    desc:  { es: 'Visita las 4 lecciones', en: 'Visit all 4 lessons', fr: 'Visite les 4 leçons', de: 'Alle 4 Lektionen besuchen', it: 'Visita tutte le 4 lezioni', pt: 'Visite as 4 lições' },
  },

  // ── Daily goals ─────────────────────────────────────────────────────────────
  {
    id: 'daily_goal_7',
    condition: 'daily_goals_completed',
    threshold: 7,
    title: { es: 'Disciplinado',   en: 'Disciplined',    fr: 'Discipliné',     de: 'Diszipliniert',   it: 'Disciplinato',    pt: 'Disciplinado' },
    zh: '自律者',
    icon: '🎯',
    desc:  { es: 'Cumple el objetivo diario 7 veces', en: 'Complete daily goal 7 times', fr: 'Atteins l\'objectif quotidien 7 fois', de: 'Tagesziel 7 Mal erreichen', it: 'Raggiungi l\'obiettivo quotidiano 7 volte', pt: 'Cumpra a meta diária 7 vezes' },
  },
  {
    id: 'daily_goal_30',
    condition: 'daily_goals_completed',
    threshold: 30,
    title: { es: 'Metódico',       en: 'Methodical',     fr: 'Méthodique',     de: 'Methodisch',      it: 'Metodico',        pt: 'Metódico' },
    zh: '有条不紊',
    icon: '📅',
    desc:  { es: 'Cumple el objetivo diario 30 veces', en: 'Complete daily goal 30 times', fr: 'Atteins l\'objectif quotidien 30 fois', de: 'Tagesziel 30 Mal erreichen', it: 'Raggiungi l\'obiettivo quotidiano 30 volte', pt: 'Cumpra a meta diária 30 vezes' },
  },
  {
    id: 'daily_goal_100',
    condition: 'daily_goals_completed',
    threshold: 100,
    title: { es: 'Máquina Imparable', en: 'Unstoppable Machine', fr: 'Machine Inarrêtable', de: 'Unaufhaltsame Maschine', it: 'Macchina Inarrestabile', pt: 'Máquina Imparável' },
    zh: '不停机器',
    icon: '⚙️',
    desc:  { es: 'Cumple el objetivo diario 100 veces', en: 'Complete daily goal 100 times', fr: 'Atteins l\'objectif quotidien 100 fois', de: 'Tagesziel 100 Mal erreichen', it: 'Raggiungi l\'obiettivo quotidiano 100 volte', pt: 'Cumpra a meta diária 100 vezes' },
  },
];

// ── Persistencia ─────────────────────────────────────────────────────────────
const LEVEL_KEY = 'aprende-chino-leveling-v1';

const DEFAULT_STATE = {
  selectedTitle: null,          // id del título equipado (null = usa el de nivel)
  unlockedAchievements: [],     // ids de logros desbloqueados
  // Contadores para condiciones de logros
  counters: {
    complete_quiz: 0,
    perfect_score: 0,
    time_race_score: 0,
    lessons_seen: [],           // array de lesson nums vistos
    daily_goals_completed: 0,
  },
};

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(LEVEL_KEY) || '{}');
    return {
      ...DEFAULT_STATE,
      ...stored,
      unlockedAchievements: Array.isArray(stored.unlockedAchievements) ? stored.unlockedAchievements : [],
      counters: { ...DEFAULT_STATE.counters, ...(stored.counters || {}) },
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(LEVEL_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('No se pudo guardar leveling:', e);
  }
}

// ── API pública ──────────────────────────────────────────────────────────────

/**
 * Calcula el nivel actual a partir del XP total.
 * @param {number} totalXP
 * @returns {{ level, title, zh, icon, xpCurrent, xpForNext, xpInLevel, progress }}
 */
export function getLevelInfo(totalXP) {
  let current = LEVELS[0];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].xp) {
      current = LEVELS[i];
      break;
    }
  }

  const next = LEVELS.find(l => l.level === current.level + 1);
  const xpInLevel = totalXP - current.xp;
  const xpForNext = next ? next.xp - current.xp : 0;
  const progress = next ? Math.min(100, Math.round((xpInLevel / xpForNext) * 100)) : 100;

  return {
    level: current.level,
    title: current.title,
    zh: current.zh,
    icon: current.icon,
    xpCurrent: totalXP,
    xpInLevel,
    xpForNext,
    progress,
    isMaxLevel: !next,
  };
}

/**
 * Devuelve el título actualmente equipado (o el de nivel si no hay selección).
 */
export function getEquippedTitle(totalXP) {
  const state = loadState();
  const levelInfo = getLevelInfo(totalXP);

  if (state.selectedTitle) {
    // Buscar en logros desbloqueados
    const achievement = ACHIEVEMENTS.find(a => a.id === state.selectedTitle);
    if (achievement && state.unlockedAchievements.includes(achievement.id)) {
      return { title: achievement.title, zh: achievement.zh, icon: achievement.icon, source: 'achievement' };
    }
    // Buscar en títulos de nivel (formato: "level_N")
    const levelMatch = state.selectedTitle.match(/^level_(\d+)$/);
    if (levelMatch) {
      const lvl = LEVELS.find(l => l.level === parseInt(levelMatch[1]));
      if (lvl && totalXP >= lvl.xp) {
        return { title: lvl.title, zh: lvl.zh, icon: lvl.icon, source: 'level' };
      }
    }
  }

  // Default: título del nivel actual
  return { title: levelInfo.title, zh: levelInfo.zh, icon: levelInfo.icon, source: 'level' };
}

/**
 * Devuelve todos los títulos disponibles (desbloqueados).
 */
export function getAvailableTitles(totalXP) {
  const state = loadState();
  const titles = [];

  // Títulos de nivel
  for (const lvl of LEVELS) {
    if (totalXP >= lvl.xp) {
      titles.push({
        id: `level_${lvl.level}`,
        title: lvl.title,
        zh: lvl.zh,
        icon: lvl.icon,
        source: 'level',
        level: lvl.level,
      });
    }
  }

  // Títulos de logros
  for (const ach of ACHIEVEMENTS) {
    if (state.unlockedAchievements.includes(ach.id)) {
      titles.push({
        id: ach.id,
        title: ach.title,
        zh: ach.zh,
        icon: ach.icon,
        source: 'achievement',
        desc: ach.desc,
      });
    }
  }

  return titles;
}

/**
 * Establece el título equipado.
 */
export function setEquippedTitle(titleId) {
  const state = loadState();
  state.selectedTitle = titleId;
  saveState(state);
}

/**
 * Registra un evento y comprueba si se desbloquean logros nuevos.
 * @returns {Array} array de logros recién desbloqueados (puede estar vacío)
 */
export function trackAchievement(eventType, value) {
  const state = loadState();
  const newlyUnlocked = [];

  // Actualizar contadores
  switch (eventType) {
    case 'complete_quiz':
      state.counters.complete_quiz = (state.counters.complete_quiz || 0) + 1;
      break;
    case 'perfect_score':
      state.counters.perfect_score = (state.counters.perfect_score || 0) + 1;
      break;
    case 'time_race_score':
      state.counters.time_race_score = Math.max(state.counters.time_race_score || 0, value || 0);
      break;
    case 'lesson_seen': {
      const seen = Array.isArray(state.counters.lessons_seen) ? state.counters.lessons_seen : [];
      if (value && !seen.includes(value)) {
        seen.push(value);
        state.counters.lessons_seen = seen;
      }
      break;
    }
    case 'daily_goal_completed':
      state.counters.daily_goals_completed = (state.counters.daily_goals_completed || 0) + 1;
      break;
    default:
      break;
  }

  // Comprobar logros
  for (const ach of ACHIEVEMENTS) {
    if (state.unlockedAchievements.includes(ach.id)) continue;

    let met = false;
    switch (ach.condition) {
      case 'complete_quiz':
        met = (state.counters.complete_quiz || 0) >= ach.threshold;
        break;
      case 'streak':
        met = (value || 0) >= ach.threshold && eventType === 'streak';
        break;
      case 'perfect_score':
        met = (state.counters.perfect_score || 0) >= ach.threshold;
        break;
      case 'words_mastered':
        met = (value || 0) >= ach.threshold && eventType === 'words_mastered';
        break;
      case 'time_race_score':
        met = (state.counters.time_race_score || 0) >= ach.threshold;
        break;
      case 'lessons_seen': {
        const seen = Array.isArray(state.counters.lessons_seen) ? state.counters.lessons_seen : [];
        met = seen.length >= ach.threshold;
        break;
      }
      case 'daily_goals_completed':
        met = (state.counters.daily_goals_completed || 0) >= ach.threshold;
        break;
    }

    if (met) {
      state.unlockedAchievements.push(ach.id);
      newlyUnlocked.push(ach);
    }
  }

  saveState(state);

  // Dispatch event for UI notifications
  if (newlyUnlocked.length) {
    try {
      window.dispatchEvent(new CustomEvent('achievement-unlocked', {
        detail: { achievements: newlyUnlocked }
      }));
    } catch { /* SSR safety */ }
  }

  return newlyUnlocked;
}

/**
 * Comprueba si subió de nivel comparando XP anterior vs actual.
 * @returns {object|null} info del nuevo nivel si subió, null si no
 */
export function checkLevelUp(prevXP, currentXP) {
  const prevLevel = getLevelInfo(prevXP);
  const currLevel = getLevelInfo(currentXP);
  if (currLevel.level > prevLevel.level) {
    return currLevel;
  }
  return null;
}

/**
 * Devuelve todos los logros con su estado.
 */
export function getAllAchievements() {
  const state = loadState();
  return ACHIEVEMENTS.map(ach => ({
    ...ach,
    unlocked: state.unlockedAchievements.includes(ach.id),
  }));
}

export { LEVELS, ACHIEVEMENTS };
