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
      emoji: '',
      color: 'green'
    },
    {
      id: 'radicals',
      title: t('daily_radicals_challenge_title'),
      description: t('daily_radicals_challenge_description'),
      time: t('daily_radicals_challenge_time'),
      emoji: '',
      color: 'purple'
    }
  ];

  const getBorderColor = (color) => {
    const colors = {
      blue: 'hover:border-[var(--jade)]',
      green: 'hover:border-[var(--jade)]',
      purple: 'hover:border-[var(--red)]'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen p-4">
      <Container>
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)]"
          >
            <ArrowLeft className="mr-2" />
            {t('daily_back_to_menu')}
          </button>
        </div>

        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--ink)] mb-2">{t('daily_challenges_title')}</h2>
          <p className="text-lg sm:text-xl text-[var(--ink-soft)]">{t('daily_challenges_subtitle')}</p>
        </div>

        {/* Grid de desafíos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {challenges.map((challenge) => (
            <Button
              key={challenge.id}
              variant="card"
              onClick={() => {
                setDailySection(challenge.id);
              }}
              className={`bg-[var(--paper-hi)] border border-[rgba(28,24,19,0.10)] ${getBorderColor(challenge.color)}`}
            >
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{challenge.emoji}</div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--ink)] mb-2">
                {challenge.title}
              </h3>
              <p className="text-base sm:text-lg text-[var(--ink-soft)] mb-2">{challenge.description}</p>
              <p className="text-sm text-[var(--mute)]">{challenge.time}</p>
            </Button>
          ))}
        </div>
      </Container>
    </div>
  );
}
