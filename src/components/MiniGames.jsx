import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

export default function MiniGames({ goBack, navigateTo }) {
  const { t } = useTranslation();

  const games = [
    {
      id: 'sov-game',
      title: t('minigames_sov_title'),
      description: t('minigames_sov_description'),
      icon: '🔤',
      color: 'red',
      active: true,
    },
    {
      id: 'time-race',
      title: t('minigames_flashcards_title'),
      description: t('minigames_flashcards_description'),
      icon: '⏱️',
      color: 'green',
      active: true,
    },
    {
      id: 'pinyin-connection',
      title: t('minigames_pinyin_connection_title'),
      description: t('minigames_pinyin_connection_description'),
      icon: '🎵',
      color: 'blue',
      active: true,
    },
  ];

  const handleGameClick = (gameId) => {
    if (gameId === 'sov-game') {
      navigateTo('sov-game');
    } else if (gameId === 'time-race') {
      navigateTo('time-race');
    } else if (gameId === 'pinyin-connection') {
      navigateTo('pinyin-connection');
    } else {
      console.log('Navegando a:', gameId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <Container>
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            {t('dictionary_back_to_menu')}
          </button>
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">小游戏</h2>
          <p className="text-lg sm:text-xl text-gray-300">{t('minigames_title')}</p>
          <p className="text-gray-400 mt-2">{t('minigames_subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {games.map((game) => (
            <Button
              key={game.id}
              variant="card"
              onClick={() => handleGameClick(game.id)}
              className="bg-gray-800 border border-gray-700 hover:border-gray-600"
            >
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{game.icon}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{game.title}</h3>
              <p className="text-gray-300 text-sm sm:text-base">{game.description}</p>
            </Button>
          ))}
        </div>
      </Container>
    </div>
  );
}
