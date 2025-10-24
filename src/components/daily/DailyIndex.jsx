// src/components/DailyIndex.jsx
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

export default function DailyIndex({ goBack, setDailySection }) {
  const { t } = useTranslation();

  const challenges = [
    {
      id: 'characters',
      title: t('daily_character_challenge_title'),
      description: t('daily_character_challenge_description'),
      time: t('daily_character_challenge_time'),
      emoji: '🏃',
      color: 'blue'
    },
    {
      id: 'tones',
      title: t('daily_tones_challenge_title'),
      description: t('daily_tones_challenge_description'),
      time: t('daily_tones_challenge_time'),
      emoji: '🎵',
      color: 'green'
    },
    {
      id: 'radicals',
      title: t('daily_radicals_challenge_title'),
      description: t('daily_radicals_challenge_description'),
      time: t('daily_radicals_challenge_time'),
      emoji: '🧩',
      color: 'purple'
    }
  ];

  const getBorderColor = (color) => {
    const colors = {
      blue: 'hover:border-blue-500',
      green: 'hover:border-green-500',
      purple: 'hover:border-purple-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen p-4">
      <Container>
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            {t('daily_back_to_menu')}
          </button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">{t('daily_challenges_title')}</h2>
          <p className="text-xl text-gray-300">{t('daily_challenges_subtitle')}</p>
        </div>

        {/* Grid de desafíos */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {challenges.map((challenge) => (
            <Button
              key={challenge.id}
              variant="card"
              onClick={() => {
                console.log('🟡 Click en:', challenge.id);
                setDailySection(challenge.id);
              }}
              className={`bg-gray-800 border border-gray-700 ${getBorderColor(challenge.color)} h-48`}
            >
              <div className="text-5xl mb-4">{challenge.emoji}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {challenge.title}
              </h3>
              <p className="text-lg text-gray-300 mb-2">{challenge.description}</p>
              <p className="text-sm text-gray-400">{challenge.time}</p>
            </Button>
          ))}
        </div>
      </Container>
    </div>
  );
}
