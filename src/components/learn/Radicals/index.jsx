// src/components/learn/Radicals/index.jsx
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from 'react-i18next';

export default function RadicalsIndex({ goBack, setRadicalSection, radicals }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen p-4">
      <Container>
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-[#5b5446] hover:text-[#1c1813]"
          >
            <ArrowLeft className="mr-2" />
            {t('radicals_back_to_learn')}
          </button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#1c1813] mb-2">部首</h2>
          <p className="text-xl text-[#5b5446]">Bùshǒu - {t('radicals_title')}</p>
        </div>

        {/* TRES botones principales - TEORÍA + 2 QUIZZES */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Teoría */}
          <Button
            variant="card"
            onClick={() => setRadicalSection("theory")}
            className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] hover:border-[#2f6b4a] h-48"
          >
            <div className="text-5xl mb-4"></div>
            <h3 className="text-2xl font-bold text-[#1c1813] mb-2">{t('radicals_theory_title')}</h3>
            <p className="text-lg text-[#5b5446]">{t('radicals_theory_description')}</p>
          </Button>

          {/* Quiz 1 - Identificación Visual */}
          <Button
            variant="card"
            onClick={() => setRadicalSection("quiz1")}
            className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] hover:border-[#2f6b4a] h-48"
          >
            <div className="text-5xl mb-4">👁️</div>
            <h3 className="text-2xl font-bold text-[#1c1813] mb-2">{t('radicals_quiz1_title')}</h3>
            <p className="text-md text-[#5b5446]">{t('radicals_quiz1_description')}</p>
          </Button>

          {/* Quiz 2 - Significados */}
          <Button
            variant="card"
            onClick={() => setRadicalSection("quiz2")}
            className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] hover:border-[#c8392f] h-48"
          >
            <div className="text-5xl mb-4"></div>
            <h3 className="text-2xl font-bold text-[#1c1813] mb-2">{t('radicals_quiz2_title')}</h3>
            <p className="text-md text-[#5b5446]">{t('radicals_quiz2_description')}</p>
          </Button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#fbf5e6] rounded-lg p-4 text-center border border-[rgba(28,24,19,0.10)]">
              <div className="text-2xl font-bold text-[#1c1813]">{radicals.length}</div>
              <div className="text-[#928a76] text-sm">Radicales</div>
            </div>
            <div className="bg-[#fbf5e6] rounded-lg p-4 text-center border border-[rgba(28,24,19,0.10)]">
              <div className="text-2xl font-bold text-[#1c1813]">
                {radicals.reduce((acc, curr) => acc + (curr.examples?.length || 0), 0)}
              </div>
              <div className="text-[#928a76] text-sm">Ejemplos</div>
            </div>
            <div className="bg-[#fbf5e6] rounded-lg p-4 text-center border border-[rgba(28,24,19,0.10)]">
              <div className="text-2xl font-bold text-[#1c1813]">
                {new Set(radicals.map(r => r.strokeCount)).size}
              </div>
              <div className="text-[#928a76] text-sm">Traços</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
