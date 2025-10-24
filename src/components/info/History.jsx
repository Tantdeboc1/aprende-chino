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
        const lang = i18n.language || 'es';
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
    return <div className="min-h-screen grid place-items-center bg-gray-900 text-gray-300">{t('info_loading')}</div>;
  }

  const timeline = data?.timeline ?? [];
  const glossary = data?.glossary ?? [];
  const reading = data?.suggestedReading ?? [];
  const overview = data?.overview ?? "";

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <Container>
        <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft className="mr-2" /> {t('info_back_to_info')}
        </button>

        {error && (
          <div className="bg-red-900 text-red-200 border border-red-700 rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          <section className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-2">🏯 {t('info_history_title')}</h1>
            <p className="text-gray-300 mb-4">{t('info_history_subtitle')}</p>
            {overview && <p className="text-white leading-relaxed">{overview}</p>}
          </section>

          <section className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">{t('info_timeline_title')}</h2>
            <p className="text-gray-300 mb-4">{t('info_timeline_subtitle')}</p>
            {timeline.length === 0 ? (
              <div className="text-gray-400">{t('info_no_timeline_items')}</div>
            ) : (
              <div className="space-y-4">
                {timeline.map((it, i) => (
                  <div key={i} className="rounded-xl border border-gray-600 p-4 hover:shadow-lg transition bg-gray-700">
                    <div className="text-sm text-gray-400">{it.years}</div>
                    <div className="text-lg md:text-xl font-semibold text-white">{it.title}</div>
                    <p className="text-gray-300">{it.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">{t('info_glossary_title')}</h2>
            <p className="text-gray-300 mb-4">{t('info_glossary_subtitle')}</p>
            {glossary.length === 0 ? (
              <div className="text-gray-400">{t('info_no_glossary_terms')}</div>
            ) : (
              <ul className="space-y-3">
                {glossary.map((g, i) => (
                  <li key={i} className="rounded-xl border border-gray-600 p-4 hover:shadow-lg transition bg-gray-700">
                    <div className="font-semibold text-white">{g.term}</div>
                    <div className="text-gray-300">{g.desc}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">{t('info_suggested_reading_title')}</h2>
            <p className="text-gray-300 mb-4">{t('info_suggested_reading_subtitle')}</p>
            {reading.length === 0 ? (
              <div className="text-gray-400">{t('info_no_recommendations')}</div>
            ) : (
              <ul className="list-disc pl-6 space-y-2 text-white">
                {reading.map((r, i) => (
                  <li key={i}>
                    <span className="font-semibold">{r.title}</span>
                    {r.note && <span className="text-gray-400"> — {r.note}</span>}
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
