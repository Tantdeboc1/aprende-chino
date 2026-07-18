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
            className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)]"
          >
            <ArrowLeft className="mr-2" />
            {t('radicals_back_to_learn')}
          </button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[var(--ink)] mb-2">部首</h2>
          <p className="text-xl text-[var(--ink-soft)]">Bùshǒu - {t('radicals_title')}</p>
        </div>

        {/* TRES botones principales - TEORÍA + 2 QUIZZES */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Teoría */}
          <Button
            variant="card"
            onClick={() => setRadicalSection("theory")}
            className="bg-[var(--paper-hi)] border border-[rgba(28,24,19,0.10)] hover:border-[var(--jade)] h-48"
          >
            <div className="text-5xl mb-4"></div>
            <h3 className="text-2xl font-bold text-[var(--ink)] mb-2">{t('radicals_theory_title')}</h3>
            <p className="text-lg text-[var(--ink-soft)]">{t('radicals_theory_description')}</p>
          </Button>

          {/* Quiz 1 - Identificación Visual */}
          <Button
            variant="card"
            onClick={() => setRadicalSection("quiz1")}
            className="bg-[var(--paper-hi)] border border-[rgba(28,24,19,0.10)] hover:border-[var(--jade)] h-48"
          >
            <div className="text-5xl mb-4">👁️</div>
            <h3 className="text-2xl font-bold text-[var(--ink)] mb-2">{t('radicals_quiz1_title')}</h3>
            <p className="text-md text-[var(--ink-soft)]">{t('radicals_quiz1_description')}</p>
          </Button>

          {/* Quiz 2 - Significados */}
          <Button
            variant="card"
            onClick={() => setRadicalSection("quiz2")}
            className="bg-[var(--paper-hi)] border border-[rgba(28,24,19,0.10)] hover:border-[var(--red)] h-48"
          >
            <div className="text-5xl mb-4"></div>
            <h3 className="text-2xl font-bold text-[var(--ink)] mb-2">{t('radicals_quiz2_title')}</h3>
            <p className="text-md text-[var(--ink-soft)]">{t('radicals_quiz2_description')}</p>
          </Button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--paper-hi)] rounded-lg p-4 text-center border border-[rgba(28,24,19,0.10)]">
              <div className="text-2xl font-bold text-[var(--ink)]">{radicals.length}</div>
              <div className="text-[var(--mute)] text-sm">{t('radicals_stat_radicals')}</div>
            </div>
            <div className="bg-[var(--paper-hi)] rounded-lg p-4 text-center border border-[rgba(28,24,19,0.10)]">
              <div className="text-2xl font-bold text-[var(--ink)]">
                {radicals.reduce((acc, curr) => acc + (curr.examples?.length || 0), 0)}
              </div>
              <div className="text-[var(--mute)] text-sm">{t('radicals_stat_examples')}</div>
            </div>
            <div className="bg-[var(--paper-hi)] rounded-lg p-4 text-center border border-[rgba(28,24,19,0.10)]">
              <div className="text-2xl font-bold text-[var(--ink)]">
                {new Set(radicals.map(r => r.strokeCount)).size}
              </div>
              <div className="text-[var(--mute)] text-sm">{t('radicals_stat_strokes')}</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
