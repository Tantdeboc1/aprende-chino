import { assetUrl } from '../../utils/assets';
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

export default function History({ goBack }) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(assetUrl(`data/info.json`));
        const json = await res.json();
        if (!alive) return;
        setData(json?.history ?? {});
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

  const timeline = data?.timeline ?? [];
  const glossary = data?.glossary ?? [];
  const reading = data?.suggestedReading ?? [];
  const overview = data?.overview ?? "";

  return (
    <div className="min-h-screen bg-[#f4ecdc] p-4">
      <Container>
        <button onClick={goBack} className="flex items-center text-[#5b5446] hover:text-[#1c1813] mb-6">
          <ArrowLeft className="mr-2" /> {t('info_back_to_info')}
        </button>

        {error && (
          <div className="bg-[#f0d6cf] text-[#8b1f1a] border border-[#c8392f] rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <section className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
            <h1 className="text-3xl font-bold text-[#1c1813] mb-2">🏯 {t('info_history_title')}</h1>
            <p className="text-[#5b5446] mb-4">{t('info_history_subtitle')}</p>
            {overview && <p className="text-[#1c1813] leading-relaxed">{overview}</p>}
          </section>

          <section className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
            <h2 className="text-2xl font-bold text-[#1c1813] mb-2">{t('info_timeline_title')}</h2>
            <p className="text-[#5b5446] mb-4">{t('info_timeline_subtitle')}</p>
            {timeline.length === 0 ? (
              <div className="text-[#928a76]">{t('info_no_timeline_items')}</div>
            ) : (
              <div className="space-y-4">
                {timeline.map((it, i) => (
                  <div key={i} className="rounded-xl border border-[rgba(28,24,19,0.18)] p-4 hover:shadow-lg transition bg-[#f8f1de]">
                    <div className="text-sm text-[#928a76]">{it.years}</div>
                    <div className="text-lg md:text-xl font-semibold text-[#1c1813]">{it.title}</div>
                    <p className="text-[#5b5446]">{it.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
            <h2 className="text-2xl font-bold text-[#1c1813] mb-2">{t('info_glossary_title')}</h2>
            <p className="text-[#5b5446] mb-4">{t('info_glossary_subtitle')}</p>
            {glossary.length === 0 ? (
              <div className="text-[#928a76]">{t('info_no_glossary_terms')}</div>
            ) : (
              <ul className="space-y-3">
                {glossary.map((g, i) => (
                  <li key={i} className="rounded-xl border border-[rgba(28,24,19,0.18)] p-4 hover:shadow-lg transition bg-[#f8f1de]">
                    <div className="font-semibold text-[#1c1813]">{g.term}</div>
                    <div className="text-[#5b5446]">{g.desc}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
            <h2 className="text-2xl font-bold text-[#1c1813] mb-2">{t('info_suggested_reading_title')}</h2>
            <p className="text-[#5b5446] mb-4">{t('info_suggested_reading_subtitle')}</p>
            {reading.length === 0 ? (
              <div className="text-[#928a76]">{t('info_no_recommendations')}</div>
            ) : (
              <ul className="list-disc pl-6 space-y-2 text-[#1c1813]">
                {reading.map((r, i) => (
                  <li key={i}>
                    <span className="font-semibold">{r.title}</span>
                    {r.note && <span className="text-[#928a76]"> — {r.note}</span>}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </Container>
    </div>
  );
}
