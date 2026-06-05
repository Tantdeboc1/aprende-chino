import { assetUrl } from '../../utils/assets';
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

export default function LanguageFacts({ goBack }) {
  const { t, i18n } = useTranslation();
  const [facts, setFacts] = useState([]);
  const [toneExamples, setToneExamples] = useState([]);
  const [simplified, setSimplified] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(assetUrl(`data/info.json`));
        const json = await res.json();
        if (!alive) return;
        setFacts(json?.language?.facts ?? []);
        setToneExamples(json?.language?.toneExamples ?? []);
        setSimplified(json?.language?.scripts?.simplifiedExamples ?? []);
      } catch (e) {
        setError(t('info_error_loading'));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [i18n.language, t]);

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-[#f4ecdc] text-[#5b5446]">{t('info_loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f4ecdc] p-4">
      <Container>
        <button onClick={goBack} className="flex items-center text-[#5b5446] hover:text-[#1c1813] mb-6">
          <ArrowLeft className="mr-2" /> {t('info_back_to_info')}
        </button>

        {error && <div className="bg-[#f0d6cf] text-[#8b1f1a] border border-[#c8392f] rounded-md p-3 mb-4">{error}</div>}

        <div className="grid gap-6">
          {/* Bloque 1: datos rápidos */}
          <div className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
            <h2 className="text-2xl font-bold text-[#1c1813] mb-2">{t('info_language_curiosities_title')}</h2>
            <p className="text-[#5b5446] mb-4">{t('info_language_curiosities_description')}</p>
            <ul className="list-disc pl-6 space-y-2 text-[#5b5446]">
              {facts.map((f, i) => (
                <li key={i}>
                  <span className="font-semibold text-[#1c1813]">{f.title}: </span>
                  <span className="text-[#5b5446]">{f.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bloque 2: ejemplos de tonos */}
          <div className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
            <h2 className="text-2xl font-bold text-[#1c1813] mb-2">📣 {t('info_tone_examples_title')}</h2>
            <p className="text-[#5b5446] mb-4">{t('info_tone_examples_subtitle')}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {toneExamples.map((t, i) => (
                <div key={i} className="rounded-xl border border-[rgba(28,24,19,0.18)] p-4 text-center hover:shadow-lg transition bg-[#f8f1de]">
                  <div className="text-4xl mb-2 text-[#1c1813]">{t.char}</div>
                  <div className="text-[#5b5446] font-semibold">{t.pinyin}</div>
                  <div className="text-[#928a76]">{t.meaning}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bloque 3: tradicional vs simplificado */}
          <div className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
            <h2 className="text-2xl font-bold text-[#1c1813] mb-2">{t('info_scripts_title')}</h2>
            <p className="text-[#5b5446] mb-4">{t('info_scripts_subtitle')}</p>
            <div className="grid md:grid-cols-3 gap-4">
              {simplified.map((p, i) => (
                <div key={i} className="rounded-xl border border-[rgba(28,24,19,0.18)] p-4 text-center hover:shadow-lg transition bg-[#f8f1de]">
                  <div className="text-3xl text-[#1c1813]">{p.trad} → {p.simp}</div>
                  <div className="text-[#928a76]">{p.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
