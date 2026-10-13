import { useScrollMemory } from '@/hooks/useScrollMemory.js';
import { loadSkillSessions } from '@/utils/skillProgress.js';
import { PRACTICE_CATEGORY_KEY, PRACTICE_ACTIVITIES, loadPracticeFavorites, savePracticeFavorites, recommendPractice, rememberPracticeCategory, practiceScrollPositions } from '@/utils/practiceNavigation.js';
// src/components/MiniGames.jsx
import { useMemo, useState } from "react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";
import { J } from '@/styles/tokens';
import ProfileBadge from "@/components/ui/ProfileBadge.jsx";
import { loadMinigameScores } from "@/utils/minigameScores.js";
import { getLevelMastery, loadLevelExamResult, UNLOCK_MASTERY_PCT } from "@/utils/levelExam.js";
import { useLocalSnapshot } from "@/hooks/useLocalSnapshot.js";
import { useAuth } from '@/context/AuthContext.jsx';

const GAME_STYLES = {
  red:    { bg: J.redBg,   fg: J.redDeep,  border: J.red },
  green:  { bg: J.jadeBg,  fg: J.jadeDeep, border: J.jade },
  blue:   { bg: J.jadeBg,  fg: J.jadeDeep, border: J.jadeMid },
  yellow: { bg: J.sandBg,  fg: J.sandDeep, border: J.sand },
  purple: { bg: J.sandBg2, fg: J.sandDeep, border: J.sand },
};

function Badge({ text, color }) {
  return (
    <span className="text-[0.6875rem] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: color.bg, color: color.fg, border: `1px solid ${color.border}` }}>
      {text}
    </span>
  );
}

// Secciones por destreza (marco MCER / 听说读写) + base lingüística + examen.
// El orden sigue el clásico chino 听-说-读-写. Cada juego declara en qué
// `categorias` aparece (puede estar en varias). Las claves de categoría son
// internas; los títulos visibles salen de i18n.
// Los tres juegos que vivían tras el hub "Desafíos Diarios". El hub se
// eliminó: tenían su propia pantalla intermedia para nada, y el nombre
// chocaba con los objetivos diarios del Home. Solo el de caracteres es
// realmente diario (elige uno por fecha, 5 intentos); los otros dos son
// contrarrelojes que se pueden repetir cuando se quiera.
const DAILY_GAMES = [
  { id: 'daily-characters', cn: '日', daily: true,  titleKey: 'daily_character_challenge_title', descKey: 'daily_character_challenge_description' },
  { id: 'daily-tones',      cn: '声', daily: false, titleKey: 'daily_tones_challenge_title',     descKey: 'daily_tones_challenge_description' },
  { id: 'daily-radicals',   cn: '部', daily: false, titleKey: 'daily_radicals_challenge_title',  descKey: 'daily_radicals_challenge_description' },
];

const SECTIONS = [
  { cat: 'oral_comp', cn: '听', titleKey: 'minigames_section_listening', titleDefault: 'Comprensión oral' },
  { cat: 'oral_exp',  cn: '说', titleKey: 'minigames_section_speaking',  titleDefault: 'Expresión oral' },
  { cat: 'lectura',   cn: '读', titleKey: 'minigames_section_reading',   titleDefault: 'Comprensión escrita' },
  { cat: 'escritura', cn: '写', titleKey: 'minigames_section_writing',   titleDefault: 'Expresión escrita' },
  { cat: 'base',      cn: '基', titleKey: 'minigames_section_base',      titleDefault: 'Base lingüística' },
  { cat: 'examen',    cn: '试', titleKey: 'minigames_section_exam',      titleDefault: 'Examen' },
];

export default function MiniGames({ goBack, navigateTo, progress, allCharacters = [] }) {
  const { t } = useTranslation();
  const { pushSnapshot } = useAuth();
  const [category, setCategory] = useState(() => {
    try { const saved = sessionStorage.getItem(PRACTICE_CATEGORY_KEY); return SECTIONS.some(s => s.cat === saved) ? saved : null; }
    catch { return null; }
  });
  const selectCategory = (cat) => {
    setCategory(cat);
    rememberPracticeCategory(cat);
  };

  useScrollMemory('practice:' + (category || 'all'), { positions: practiceScrollPositions });
  const favorites = useLocalSnapshot(loadPracticeFavorites);
  const [favoriteLimit, setFavoriteLimit] = useState(false);
  const toggleFavorite = (id) => {
    if (!favorites.includes(id) && favorites.length >= 3) { setFavoriteLimit(true); return; }
    const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    savePracticeFavorites(next); setFavoriteLimit(false);
    pushSnapshot();
  };
  const sessions = useLocalSnapshot(loadSkillSessions);
  const recommendation = useMemo(() => recommendPractice(sessions), [sessions]);

  // Certificación HSK 1: vivía en el Home, pero su sitio natural es la sección
  // Examen, junto al MCER y al examen global. Se desbloquea al dominar
  // UNLOCK_MASTERY_PCT del vocabulario, así que la tarjeta muestra el candado
  // y el avance (el resto de juegos no tienen estado bloqueado).
  const examMastery  = useMemo(() => getLevelMastery(progress, allCharacters), [progress, allCharacters]);
  const examUnlocked = examMastery.pct >= UNLOCK_MASTERY_PCT;
  const examResult   = useLocalSnapshot(loadLevelExamResult, [progress]);
  // Una sola lectura de localStorage por render en vez de una por juego
  // (getBestScore por id volvía a parsear el mismo JSON cada vez).
  const scores = useMemo(() => loadMinigameScores(), []);

  const games = useMemo(() => [
    {
      id: 'sov-game',
      title: t('minigames_sov_title'),
      description: t('minigames_sov_description'),
      cn: '序',
      color: 'red',
      badges: [t('badge_medium'), t('badge_grammar')],
      categorias: ['escritura'],
    },
    {
      id: 'time-race',
      title: t('minigames_time_race_title'),
      description: t('minigames_flashcards_description'),
      cn: '速',
      color: 'green',
      badges: [t('badge_90s'), t('badge_easy'), t('badge_speed')],
      categorias: ['base'],
    },
    {
      id: 'pinyin-connection',
      title: t('minigames_pinyin_connection_title'),
      description: t('minigames_pinyin_connection_description'),
      cn: '音',
      color: 'blue',
      badges: [t('badge_medium'), t('badge_pronunciation')],
      categorias: ['base'],
    },
    {
      id: 'cefr-exam',
      title: t('cefr_card_title', 'Examen MCER · A1'),
      description: t('cefr_card_description', 'Certifica tu A1 por destrezas: 听 oír · 读 leer · 写 escribir'),
      cn: '证',
      color: 'green',
      badges: ['A1', t('badge_skills', '听读写'), '🎓'],
      categorias: ['examen'],
    },
    {
      id: 'global-exam',
      title: t('minigames_global_exam_title'),
      description: t('minigames_global_exam_description'),
      cn: '考',
      color: 'yellow',
      badges: [t('badge_90s'), t('badge_hard'), t('badge_hsk1')],
      // Las pruebas de nivel se reúnen en Exámenes.
      categorias: ['examen'],
    },
    {
      id: 'translation-game',
      title: t('minigames_translation_title'),
      description: t('minigames_translation_description'),
      cn: '译',
      color: 'purple',
      badges: [t('badge_hard'), t('badge_construction')],
      categorias: ['escritura'],
    },
    {
      id: 'complete-sentence',
      title: t('minigames_complete_title'),
      description: t('minigames_complete_description'),
      cn: '填',
      color: 'green',
      badges: [t('badge_easy'), t('badge_grammar')],
      categorias: ['escritura'],
    },
    {
      id: 'dialogue-order',
      title: t('minigames_dialogue_title'),
      description: t('minigames_dialogue_description'),
      cn: '话',
      color: 'blue',
      badges: [t('badge_medium'), t('badge_grammar')],
      categorias: ['lectura'],
    },
    {
      id: 'find-intruder',
      title: t('minigames_intruder_title'),
      description: t('minigames_intruder_description'),
      cn: '找',
      color: 'red',
      badges: [t('badge_easy'), t('badge_vocabulary')],
      categorias: ['base'],
    },
    {
      id: 'pronunciation-practice',
      title: t('minigames_pronunciation_title', 'Pronunciación'),
      description: t('minigames_pronunciation_description', 'Di la frase en voz alta y comprueba si te entienden'),
      cn: '念',
      color: 'green',
      badges: [t('badge_medium', 'Media'), t('badge_pronunciation', 'Pronunciación'), '🎙️'],
      categorias: ['oral_exp'],
    },
    {
      id: 'echo-speaking',
      title: t('echo_title', 'Repite la frase'),
      description: t('echo_description', 'Escucha una frase y repítela de oído, sin verla'),
      cn: '跟',
      color: 'red',
      badges: [t('badge_hard', 'Difícil'), t('badge_pronunciation', 'Pronunciación'), '🎧'],
      categorias: ['oral_exp'],
    },
    {
      id: 'dictation-game',
      title: t('minigames_dictation_title', 'Dictado'),
      description: t('minigames_dictation_description', 'Escucha el audio y elige el carácter correcto'),
      cn: '默',
      color: 'yellow',
      badges: [t('badge_medium', 'Media'), t('badge_listening', 'Oído'), '🔊'],
      categorias: ['oral_comp'],
    },
    {
      id: 'tones-ear',
      title: t('tones_ear_title', 'Tonos al oído'),
      description: t('tones_ear_description', 'Escucha una sílaba e identifica el tono que has oído'),
      cn: '调',
      color: 'blue',
      badges: [t('badge_medium', 'Media'), t('badge_listening', 'Oído'), '🎵'],
      categorias: ['oral_comp'],
    },
    {
      id: 'reading-comprehension',
      title: t('minigames_reading_title', 'Comprensión lectora'),
      description: t('minigames_reading_description', 'Lee una historia corta en chino y responde preguntas sobre ella'),
      cn: '阅',
      color: 'green',
      badges: [t('badge_medium'), t('badge_reading', 'Lectura'), '📖'],
      categorias: ['lectura'],
    },
  ], [t]);

  const catalog = [...games, ...DAILY_GAMES.map(g => ({ ...g, title: t(g.titleKey), description: t(g.descKey), color: 'yellow', categorias: ['base'], badges: g.daily ? [t('badge_daily', 'Diario')] : [] }))];
  const openActivity = (id) => { rememberPracticeCategory(PRACTICE_ACTIVITIES[id]?.[0]); navigateTo(id); };
  const renderGame = (game) => {
    const c = GAME_STYLES[game.color];
    const best = scores[game.id]?.best;
    const favorite = favorites.includes(game.id);
    return <div key={game.id} className="rounded-2xl overflow-hidden" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
      <button onClick={() => openActivity(game.id)} className="w-full p-5 text-left flex gap-4 items-start" style={{ cursor: 'pointer', color: J.ink }}>
        <span aria-hidden="true" className="font-cn rounded-xl w-12 h-12 flex items-center justify-center text-2xl shrink-0" style={{ background: c.bg, color: c.fg }}>{game.cn}</span>
        <span className="flex-1 min-w-0">
          <span className="block font-bold">{game.title}</span>
          <span className="block text-xs mt-1 mb-3" style={{ color: J.inkSoft }}>{game.description}</span>
          <span className="flex flex-wrap gap-1.5">{game.badges.map((b, i) => <Badge key={i} text={b} color={c} />)}</span>
          {typeof best === 'number' && <span className="block text-xs mt-2">{t('minigames_best_score', 'Mejor')} {best}%</span>}
        </span><span aria-hidden="true">→</span>
      </button>
      <button onClick={() => toggleFavorite(game.id)} aria-pressed={favorite}
        aria-label={t(favorite ? 'practice_remove_favorite' : 'practice_add_favorite', { activity: game.title })}
        className="w-full text-left px-5 py-3 text-xs font-semibold" style={{ color: J.inkSoft, borderTop: `1px solid ${J.hair}`, cursor: 'pointer' }}>
        <span aria-hidden="true">{favorite ? '★' : '☆'} </span>{t(favorite ? 'practice_favorite_saved' : 'practice_favorite_save')}
      </button>
    </div>;
  };

  return (
    <div className="min-h-screen p-4 pb-24" style={{ background: J.paper }}>
      <Container>
        <div className="mb-6 flex items-start justify-between">
          <button
            onClick={() => category ? selectCategory(null) : goBack()}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}
          >
            <span>←</span> {category ? t('practice_all_categories') : t('intro_back_home')}
          </button>
          <ProfileBadge variant="light" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-cn mb-1" style={{ color: J.ink }}>
            {t('nav_practice')}
          </h1>
          <p className="text-lg" style={{ color: J.inkSoft }}>{t('practice_choose')}</p>
          <p className="text-sm mt-1" style={{ color: J.mute }}>{t('minigames_subtitle')}</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 j-rise">
          {favoriteLimit && <p role="status" className="text-sm" style={{ color: J.inkSoft }}>{t('practice_favorite_limit')}</p>}
          {!category && <>
            <section className="rounded-2xl p-5" style={{ background: J.jadeBg, color: J.jadeDeep }}>
              <h2 className="font-bold">{t('practice_recommended')}</h2>
              <p className="text-sm mt-2">{t(recommendation.personalized ? 'practice_reason_errors' : 'practice_reason_start', { activity: t(PRACTICE_ACTIVITIES[recommendation.id][1]), pct: recommendation.pct })}</p>
              <button onClick={() => openActivity(recommendation.id)} className="mt-3 font-bold underline underline-offset-4">{t(PRACTICE_ACTIVITIES[recommendation.id][1])} →</button>
            </section>
            <section><h2 className="font-bold mb-3" style={{ color: J.ink }}>{t('practice_favorites')}</h2>
              {favorites.length ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{favorites.map(id => catalog.find(g => g.id === id)).filter(Boolean).map(renderGame)}</div>
                : <p className="text-sm" style={{ color: J.inkSoft }}>{t('practice_favorites_empty')}</p>}
            </section>
          </>}

          {/* Historias: dejó de tener pestaña propia al pasar la barra de 7 a
              5, y vive aquí porque también es práctica. Va la primera por ser
              la actividad más guiada de todas. */}
          {!category && <section>
            <div className="flex items-center gap-2.5 mb-3 px-1">
              <span className="font-cn text-2xl leading-none" style={{ color: J.red }}>故</span>
              <h3 className="text-lg font-bold" style={{ color: J.ink }}>{t('nav_stories')}</h3>
            </div>
            <button
              onClick={() => navigateTo('stories')}
              className="w-full rounded-2xl p-5 text-left flex gap-4 items-start transition-all duration-200 active:scale-[0.98]"
              style={{ background: J.paperHi, border: `1px solid ${J.hair}`, cursor: 'pointer' }}
            >
              <div className="font-cn rounded-xl w-14 h-14 flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: J.redBg, color: J.redDeep, fontWeight: 700 }}>
                事
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold leading-tight mb-1" style={{ color: J.ink }}>
                  {t('minigames_stories_card_title', 'Historias interactivas')}
                </h4>
                <p className="text-xs leading-snug" style={{ color: J.inkSoft }}>
                  {t('minigames_stories_card_description', 'Vive diálogos reales en chino y responde por el camino')}
                </p>
              </div>
              <span style={{ color: J.mute, fontWeight: 700, flexShrink: 0, marginTop: 4 }}>→</span>
            </button>
          </section>}

          {!category && <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SECTIONS.map(section => <button key={section.cat} aria-label={t('practice_' + section.cat)} onClick={() => selectCategory(section.cat)}
              className="rounded-2xl p-5 text-left transition-transform active:scale-[0.98]"
              style={{ background: J.paperHi, border: `1px solid ${J.hair}`, color: J.ink, cursor: 'pointer' }}>
              <span aria-hidden="true" className="font-cn block text-3xl mb-3" style={{ color: J.jade }}>{section.cn}</span>
              <span className="block font-bold">{t('practice_' + section.cat)}</span>
              <span className="block text-xs mt-2" style={{ color: J.mute }}>{t('practice_' + section.cat + '_hint')}</span>
            </button>)}
          </div>}
          {SECTIONS.filter(section => section.cat === category).map((section) => {
            const sectionGames = games.filter((g) => g.categorias.includes(section.cat));
            if (sectionGames.length === 0) return null;
            return (
              <section key={section.cat}>
                <div className="flex items-center gap-2.5 mb-3 px-1">
                  <span className="font-cn text-2xl leading-none" style={{ color: J.red }}>{section.cn}</span>
                  <h3 className="text-lg font-bold" style={{ color: J.ink }}>
                    {t(section.titleKey, section.titleDefault)}
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Los tres juegos que vivían tras el hub "Desafíos Diarios"
                      (ver DAILY_GAMES arriba). Antes se entraba desde el
                      carácter del día del Home, que ahora es solo informativo. */}
                  {section.cat === 'base' && catalog.filter(g => g.id.startsWith('daily-')).map(renderGame)}
                  {/* Certificación de nivel: primera del bloque Examen. */}
                  {section.cat === 'examen' && (
                    <button
                      onClick={() => navigateTo('level-exam')}
                      className="rounded-2xl p-5 text-left flex gap-4 items-start transition-all duration-200 active:scale-[0.98]"
                      style={{
                        background: J.paperHi, cursor: 'pointer',
                        border: `1px solid ${examResult?.passed ? J.jade : examUnlocked ? J.red : J.hair}`,
                      }}
                    >
                      <div className="font-cn rounded-xl w-14 h-14 flex items-center justify-center text-2xl flex-shrink-0"
                        style={{
                          fontWeight: 700,
                          background: examResult?.passed ? J.jadeBg : examUnlocked ? J.redBg : J.sandBg,
                          color: examResult?.passed ? J.jade : examUnlocked ? J.red : J.sand,
                        }}>
                        {examResult?.passed ? '证' : examUnlocked ? '试' : '关'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold leading-tight mb-1" style={{ color: J.ink }}>
                          {t('level_exam_title', 'Examen Final · HSK 1')}
                        </h4>
                        <p className="text-xs leading-snug" style={{ color: J.inkSoft }}>
                          {examResult?.passed
                            ? `${t('level_exam_already_passed', 'Nivel superado')} · ${t('level_exam_best', 'mejor')} ${examResult.bestPct}%`
                            : examUnlocked
                              ? t('level_exam_ready_hint', '¡Desbloqueado! Certifícate ahora')
                              : `${t('level_exam_locked_hint', 'Domina el vocabulario para desbloquear')} · ${examMastery.pct}/${UNLOCK_MASTERY_PCT}%`}
                        </p>
                        {!examUnlocked && (
                          <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: J.hair }}>
                            <div className="h-full rounded-full" style={{
                              width: `${Math.min(100, Math.round((examMastery.pct / UNLOCK_MASTERY_PCT) * 100))}%`,
                              background: J.sand,
                            }} />
                          </div>
                        )}
                      </div>
                      <span style={{ color: J.mute, fontWeight: 700, flexShrink: 0, marginTop: 4 }}>→</span>
                    </button>
                  )}
                  {sectionGames.map(renderGame)}                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
