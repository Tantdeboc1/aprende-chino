import { assetUrl } from '../../utils/assets';
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

export default function MusicCinema({ goBack }) {
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
          <h1 className="text-3xl font-bold text-white mb-2">🎶 {t('info_music_cinema_title')}</h1>
          <p className="text-gray-300 mb-6">{t('info_music_cinema_description')}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t('info_music_title')}</h2>
              {data?.musicCinema?.music?.map((item, i) => (
                <div key={i} className="rounded-xl border border-gray-600 p-4 mb-3 hover:shadow-lg transition bg-gray-700">
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="text-sm text-gray-400">{item.type} · {item.year}</div>
                  <div className="text-gray-300">{item.note}</div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">{t('info_cinema_title')}</h2>
              {data?.musicCinema?.cinema?.map((item, i) => (
                <div key={i} className="rounded-xl border border-gray-600 p-4 mb-3 hover:shadow-lg transition bg-gray-700">
                  <div className="font-semibold text-white">{item.title}</div>
                  <div className="text-sm text-gray-400">{item.year}</div>
                  <div className="text-gray-300">{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
