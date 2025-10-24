import { assetUrl } from '../../utils/assets';
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

export default function Cuisine({ goBack }) {
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
          <h1 className="text-3xl font-bold text-white mb-2">🍜 {t('info_cuisine_culture_title')}</h1>
          <p className="text-gray-300 mb-6">{t('info_cuisine_subtitle')}</p>

          {data?.cuisine?.regions && (
            <div className="grid md:grid-cols-2 gap-6">
              {data.cuisine.regions.map((r, i) => (
                <div key={i} className="rounded-2xl border border-gray-600 p-4 hover:shadow-lg transition bg-gray-700">
                  <div className="text-xl font-bold text-white">{r.name}</div>
                  <div className="text-gray-400 mb-2">{r.flavor}</div>
                  <ul className="list-disc pl-6 space-y-1 text-gray-300">
                    {r.dishes.map((d, j) => (
                      <li key={j}>
                        <span className="font-semibold text-white">{d.name}:</span> {d.desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
