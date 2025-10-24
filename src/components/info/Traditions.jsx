import { assetUrl } from '../../utils/assets';
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

export default function Traditions({ goBack }) {
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
        setData(json);
      } catch (e) {
        setError(t('info_error_loading'));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [i18n.language, t]);

  if (loading) return <div className="min-h-screen grid place-items-center bg-gray-900 text-gray-300">{t('info_loading')}</div>;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <Container>
        <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft className="mr-2" /> {t('info_back_to_info')}
        </button>

        {error && <div className="bg-red-900 text-red-200 border border-red-700 rounded-md p-3 mb-4">{error}</div>}

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-2">🎎 {t('info_traditions_festivities_title')}</h1>
          <p className="text-gray-300 mb-6">{t('info_traditions_festivities_description')}</p>

          {data?.traditions?.festivals && (
            <div className="space-y-4 mb-6">
              {data.traditions.festivals.map((f, i) => (
                <div key={i} className="rounded-xl border border-gray-600 p-4 hover:shadow-lg transition bg-gray-700">
                  <div className="text-lg font-semibold text-white">{f.name}</div>
                  <div className="text-sm text-gray-400">{f.when}</div>
                  <div className="text-gray-300">{f.customs}</div>
                </div>
              ))}
            </div>
          )}
          {data?.traditions?.etiquette && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t('info_etiquette_title')}</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                {data.traditions.etiquette.map((e, i) => (
                  <li key={i}>
                    <span className="font-semibold text-white">{e.title}:</span> {e.desc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
