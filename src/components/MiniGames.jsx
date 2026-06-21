// src/components/MiniGames.jsx
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";
import { J } from '@/styles/tokens';
import ProfileBadge from "@/components/ui/ProfileBadge.jsx";

const GAME_STYLES = {
  red:    { bg: J.redBg,   fg: J.redDeep,  border: J.red },
  green:  { bg: J.jadeBg,  fg: J.jadeDeep, border: J.jade },
  blue:   { bg: J.jadeBg,  fg: J.jadeDeep, border: J.jadeMid },
  yellow: { bg: J.sandBg,  fg: J.sandDeep, border: J.sand },
  purple: { bg: J.sandBg2, fg: J.sandDeep, border: J.sand },
};

function Badge({ text, color }) {
  return (
    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: color.bg, color: color.fg, border: `1px solid ${color.border}` }}>
      {text}
    </span>
  );
}

// Secciones por destreza (marco MCER / 听说读写) + base lingüística + examen.
// El orden sigue el clásico chino 听-说-读-写. Cada juego declara en qué
// `categorias` aparece (puede estar en varias). Las claves de categoría son
// internas; los títulos visibles salen de i18n.
const SECTIONS = [
  { cat: 'oral_comp', cn: '听', titleKey: 'minigames_section_listening', titleDefault: 'Comprensión oral' },
  { cat: 'oral_exp',  cn: '说', titleKey: 'minigames_section_speaking',  titleDefault: 'Expresión oral' },
  { cat: 'lectura',   cn: '读', titleKey: 'minigames_section_reading',   titleDefault: 'Comprensión escrita' },
  { cat: 'escritura', cn: '写', titleKey: 'minigames_section_writing',   titleDefault: 'Expresión escrita' },
  { cat: 'base',      cn: '基', titleKey: 'minigames_section_base',      titleDefault: 'Base lingüística' },
  { cat: 'examen',    cn: '试', titleKey: 'minigames_section_exam',      titleDefault: 'Examen' },
];

export default function MiniGames({ goBack, navigateTo }) {
  const { t } = useTranslation();

  const games = [
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
      id: 'global-exam',
      title: t('minigames_global_exam_title'),
      description: t('minigames_global_exam_description'),
      cn: '试',
      color: 'yellow',
      badges: [t('badge_90s'), t('badge_hard'), t('badge_hsk1')],
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
      categorias: ['lectura', 'escritura'],
    },
    {
      id: 'find-intruder',
      title: t('minigames_intruder_title'),
      description: t('minigames_intruder_description'),
      cn: '找',
      color: 'red',
      badges: [t('badge_easy'), t('badge_vocabulary')],
      categorias: ['lectura', 'base'],
    },
    {
      id: 'pronunciation-practice',
      title: t('minigames_pronunciation_title', 'Pronunciación'),
      description: t('minigames_pronunciation_description', 'Di la frase en voz alta y comprueba si te entienden'),
      cn: '说',
      color: 'green',
      badges: [t('badge_medium', 'Media'), t('badge_pronunciation', 'Pronunciación'), '🎙️'],
      categorias: ['oral_exp'],
    },
    {
      id: 'dictation-game',
      title: t('minigames_dictation_title', 'Dictado'),
      description: t('minigames_dictation_description', 'Escucha el audio y elige el carácter correcto'),
      cn: '听',
      color: 'yellow',
      badges: [t('badge_medium', 'Media'), t('badge_listening', 'Oído'), '🔊'],
      categorias: ['oral_comp'],
    },
    {
      id: 'reading-comprehension',
      title: t('minigames_reading_title', 'Comprensión lectora'),
      description: t('minigames_reading_description', 'Lee una historia corta en chino y responde preguntas sobre ella'),
      cn: '读',
      color: 'green',
      badges: [t('badge_medium'), t('badge_reading', 'Lectura'), '📖'],
      categorias: ['lectura'],
    },
  ];

  return (
    <div className="min-h-screen p-4 pb-24" style={{ background: J.paper }}>
      <Container>
        <div className="mb-6 flex items-start justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}
          >
            <span>←</span> {t('dictionary_back_to_menu')}
          </button>
          <ProfileBadge variant="light" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold font-cn mb-1" style={{ color: J.ink }}>
            小游戏
          </h2>
          <p className="text-lg" style={{ color: J.inkSoft }}>{t('minigames_practice_by_skill', 'Practica por destrezas')}</p>
          <p className="text-sm mt-1" style={{ color: J.mute }}>{t('minigames_subtitle')}</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {SECTIONS.map((section) => {
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
                  {sectionGames.map((game) => {
                    const c = GAME_STYLES[game.color];
                    return (
                      <button
                        key={`${section.cat}-${game.id}`}
                        onClick={() => navigateTo(game.id)}
                        className="rounded-2xl p-5 text-left flex gap-4 items-start transition-all duration-200 active:scale-[0.98]"
                        style={{
                          background: J.paperHi, border: `1px solid ${J.hair}`,
                          cursor: 'pointer',
                        }}
                      >
                        <div className="font-cn rounded-xl w-14 h-14 flex items-center justify-center text-2xl flex-shrink-0"
                          style={{ background: c.bg, color: c.fg, fontWeight: 700 }}>
                          {game.cn}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold mb-1 leading-tight" style={{ color: J.ink }}>{game.title}</h3>
                          <p className="text-xs leading-snug mb-3" style={{ color: J.inkSoft }}>{game.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {game.badges.map((b, i) => (
                              <Badge key={i} text={b} color={c} />
                            ))}
                          </div>
                        </div>
                        <span style={{ color: J.mute, fontWeight: 700, flexShrink: 0, marginTop: 4 }}>→</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
