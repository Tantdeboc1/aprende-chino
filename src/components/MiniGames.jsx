import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

const GAME_COLORS = {
  red:    { border: 'border-red-700/50',    hover: 'hover:border-red-500',    icon: 'bg-red-900/40',    badge: 'bg-red-900/60 text-red-300 border-red-700/60' },
  green:  { border: 'border-green-700/50',  hover: 'hover:border-green-500',  icon: 'bg-green-900/40',  badge: 'bg-green-900/60 text-green-300 border-green-700/60' },
  blue:   { border: 'border-blue-700/50',   hover: 'hover:border-blue-500',   icon: 'bg-blue-900/40',   badge: 'bg-blue-900/60 text-blue-300 border-blue-700/60' },
  yellow: { border: 'border-yellow-700/50', hover: 'hover:border-yellow-500', icon: 'bg-yellow-900/40', badge: 'bg-yellow-900/60 text-yellow-300 border-yellow-700/60' },
  purple: { border: 'border-purple-700/50', hover: 'hover:border-purple-500', icon: 'bg-purple-900/40', badge: 'bg-purple-900/60 text-purple-300 border-purple-700/60' },
};

function Badge({ text, color }) {
  return (
    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
      {text}
    </span>
  );
}

export default function MiniGames({ goBack, navigateTo }) {
  const { t } = useTranslation();

  const games = [
    {
      id: 'sov-game',
      title: t('minigames_sov_title'),
      description: t('minigames_sov_description'),
      icon: '🔤',
      color: 'red',
      badges: [t('badge_medium'), t('badge_grammar')],
    },
    {
      id: 'time-race',
      title: t('minigames_time_race_title'),
      description: t('minigames_flashcards_description'),
      icon: '⏱️',
      color: 'green',
      badges: [t('badge_90s'), t('badge_easy'), t('badge_speed')],
    },
    {
      id: 'pinyin-connection',
      title: t('minigames_pinyin_connection_title'),
      description: t('minigames_pinyin_connection_description'),
      icon: '🎵',
      color: 'blue',
      badges: [t('badge_medium'), t('badge_pronunciation')],
    },
    {
      id: 'global-exam',
      title: t('minigames_global_exam_title'),
      description: t('minigames_global_exam_description'),
      icon: '🏆',
      color: 'yellow',
      badges: [t('badge_90s'), t('badge_hard'), t('badge_hsk1')],
    },
    {
      id: 'translation-game',
      title: t('minigames_translation_title'),
      description: t('minigames_translation_description'),
      icon: '📝',
      color: 'purple',
      badges: [t('badge_hard'), t('badge_construction')],
    },
    {
      id: 'complete-sentence',
      title: t('minigames_complete_title'),
      description: t('minigames_complete_description'),
      icon: '🧩',
      color: 'green',
      badges: [t('badge_easy'), t('badge_grammar')],
    },
    {
      id: 'dialogue-order',
      title: t('minigames_dialogue_title'),
      description: t('minigames_dialogue_description'),
      icon: '🔀',
      color: 'blue',
      badges: [t('badge_medium'), t('badge_grammar')],
    },
    {
      id: 'find-intruder',
      title: t('minigames_intruder_title'),
      description: t('minigames_intruder_description'),
      icon: '🎯',
      color: 'red',
      badges: [t('badge_easy'), t('badge_vocabulary')],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-4 pb-24">
      <Container>
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="mr-2" />
            {t('dictionary_back_to_menu')}
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-1">小游戏</h2>
          <p className="text-lg text-gray-300">{t('minigames_title')}</p>
          <p className="text-gray-500 text-sm mt-1">{t('minigames_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {games.map((game) => {
            const c = GAME_COLORS[game.color];
            return (
              <button
                key={game.id}
                onClick={() => navigateTo(game.id)}
                className={`bg-gray-800 border ${c.border} ${c.hover} rounded-2xl p-5 text-left flex gap-4 items-start transition-all duration-200 active:scale-[0.98] hover:bg-gray-750`}
              >
                <div className={`${c.icon} rounded-xl w-14 h-14 flex items-center justify-center text-3xl flex-shrink-0`}>
                  {game.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white mb-1 leading-tight">{game.title}</h3>
                  <p className="text-gray-400 text-xs leading-snug mb-3">{game.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {game.badges.map((b, i) => (
                      <Badge key={i} text={b} color={c.badge} />
                    ))}
                  </div>
                </div>
                <svg className="text-gray-600 flex-shrink-0 mt-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
