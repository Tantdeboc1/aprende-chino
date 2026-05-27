// src/components/info/index.jsx
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import History from "./History.jsx";
import LanguageFacts from "./LanguageFacts.jsx";
import HSK from "./HSK.jsx";
import Cuisine from "./Cuisine.jsx";
import Traditions from "./Traditions.jsx";
import ModernChina from "./ModernChina.jsx";
import Geography from "./Geography.jsx";
import MusicCinema from "./MusicCinema.jsx";
import Philosophy from "./Philosophy.jsx";
import Education from "./Education.jsx";
import Button from "@/components/ui/Button.jsx";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

export default function InfoIndex({ goBack }) {
  const { t } = useTranslation();
  const [infoSection, setInfoSection] = useState(null);

  if (infoSection === null) {
    const sections = [
      { key: "history", title: t('info_history_title'), emoji: "🏯", description: t('info_history_description') },
      { key: "language", title: t('info_language_curiosities_title'), emoji: "", description: t('info_language_curiosities_description') },
      { key: "hsk", title: t('info_hsk_exams_title'), emoji: "", description: t('info_hsk_exams_description') },
      { key: "cuisine", title: t('info_cuisine_culture_title'), emoji: "", description: t('info_cuisine_culture_description') },
      { key: "traditions", title: t('info_traditions_festivities_title'), emoji: "🎎", description: t('info_traditions_festivities_description') },
      { key: "modernChina", title: t('info_modern_china_title'), emoji: "🏙️", description: t('info_modern_china_description') },
      { key: "geography", title: t('info_geography_regions_title'), emoji: "🧭", description: t('info_geography_regions_description') },
      { key: "musicCinema", title: t('info_music_cinema_title'), emoji: "🎶", description: t('info_music_cinema_description') },
      { key: "philosophy", title: t('info_philosophy_thought_title'), emoji: "🧘‍♂️", description: t('info_philosophy_thought_description') },
      { key: "education", title: t('info_education_student_life_title'), emoji: "🏫", description: t('info_education_student_life_description') }
    ];

    return (
      <div className="min-h-screen p-4">
        <Container>
          <div className="mb-6">
            <button onClick={goBack} className="flex items-center text-[#5b5446] hover:text-[#1c1813]">
              <ArrowLeft className="mr-2" /> {t('daily_back_to_menu')}
            </button>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1c1813] mb-2">中国信息</h1>
            <p className="text-lg sm:text-xl text-[#5b5446]">{t('info_title_main')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sections.map((s) => (
              <Button
                key={s.key}
                variant="card"
                onClick={() => setInfoSection(s.key)}
                className="min-h-[140px] sm:min-h-[180px] text-left hover:shadow-sm transition bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]"
              >
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{s.emoji}</div>
                <h2 className="text-lg sm:text-xl font-bold text-[#1c1813] mb-1">{s.title}</h2>
                <p className="text-[#928a76] text-sm">{s.description}</p>
              </Button>
            ))}
          </div>
        </Container>
      </div>
    );
  }

  switch (infoSection) {
    case "history":       return <History       goBack={() => setInfoSection(null)} />;
    case "language":      return <LanguageFacts goBack={() => setInfoSection(null)} />;
    case "hsk":           return <HSK           goBack={() => setInfoSection(null)} />;
    case "cuisine":       return <Cuisine       goBack={() => setInfoSection(null)} />;
    case "traditions":    return <Traditions    goBack={() => setInfoSection(null)} />;
    case "modernChina":   return <ModernChina   goBack={() => setInfoSection(null)} />;
    case "geography":     return <Geography     goBack={() => setInfoSection(null)} />;
    case "musicCinema":   return <MusicCinema   goBack={() => setInfoSection(null)} />;
    case "philosophy":    return <Philosophy    goBack={() => setInfoSection(null)} />;
    case "education":     return <Education     goBack={() => setInfoSection(null)} />;
    default:              return null;
  }
}
