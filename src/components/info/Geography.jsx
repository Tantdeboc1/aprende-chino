import { assetUrl } from '../../utils/assets';
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

export default function Geography({ goBack }) {
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
        setData(json?.geography ?? {});
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

  const regions = data?.regions ?? [];
  const landmarks = data?.landmarks ?? [];

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
          {/* Header */}
          <section className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-2">🧭 {t('info_geography_regions_title')}</h1>
            <p className="text-gray-300">{t('info_geography_regions_description')}</p>
          </section>

          {/* Regions */}
          <section className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">{t('info_regions_title')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {regions.map((region, idx) => (
                <div key={idx} className="bg-gray-700 rounded-xl p-4 hover:shadow-lg transition border border-gray-600">
                  <h3 className="font-bold text-white text-lg mb-2">{region.name}</h3>
                  <p className="text-gray-300">{region.highlights}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Landmarks */}
          <section className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">{t('info_landmarks_title')}</h2>
            <div className="space-y-4">
              {landmarks.map((landmark, idx) => (
                <div key={idx} className="bg-gray-700 rounded-xl p-4 hover:shadow-lg transition border border-gray-600">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white text-lg">{landmark.name}</h3>
                    <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 rounded">{landmark.region}</span>
                  </div>
                  <p className="text-gray-300">{landmark.note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
