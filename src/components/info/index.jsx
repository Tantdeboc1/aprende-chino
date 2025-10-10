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

export default function InfoIndex({ goBack }) {
  const [infoSection, setInfoSection] = useState(null);

  if (infoSection === null) {
    const sections = [
      { key: "history", title: "Historia de China", emoji: "🏯", description: "5.000 años de civilización" },
      { key: "language", title: "Curiosidades del idioma", emoji: "🈶", description: "Caracteres, tonos y más" },
      { key: "hsk", title: "Exámenes HSK", emoji: "🧠", description: "Certificación oficial" },
      { key: "cuisine", title: "Gastronomía y cultura", emoji: "🍜", description: "Comida tradicional china" },
      { key: "traditions", title: "Tradiciones y festividades", emoji: "🎎", description: "Fiestas y costumbres" },
      { key: "modernChina", title: "China moderna", emoji: "🏙️", description: "China contemporánea" },
      { key: "geography", title: "Geografía y regiones", emoji: "🧭", description: "Ríos, montañas y ciudades" },
      { key: "musicCinema", title: "Música y cine", emoji: "🎶", description: "Arte y entretenimiento" },
      { key: "philosophy", title: "Filosofía y pensamiento", emoji: "🧘‍♂️", description: "Confucionismo, Taoísmo" },
      { key: "education", title: "Educación y vida estudiantil", emoji: "🏫", description: "Sistema educativo chino" }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 p-4">
        <Container>
          <div className="mb-6">
            <button onClick={goBack} className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
              <ArrowLeft className="mr-2" /> Volver al Menú
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">中国信息</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Zhōngguó xìnxī - Información sobre China</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((s) => (
              <Button
                key={s.key}
                variant="card"
                onClick={() => setInfoSection(s.key)}
                className="min-h-[180px] text-left hover:shadow-xl transition bg-white dark:bg-gray-800"
              >
                <div className="text-5xl mb-3">{s.emoji}</div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">{s.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{s.description}</p>
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