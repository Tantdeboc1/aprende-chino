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

  if (loading) return <div className="min-h-screen grid place-items-center bg-[#f4ecdc] text-[#5b5446]">{t('info_loading')}</div>;

  return (
    <div className="min-h-screen bg-[#f4ecdc] p-4">
      <Container>
        <button onClick={goBack} className="flex items-center text-[#5b5446] hover:text-[#1c1813] mb-6">
          <ArrowLeft className="mr-2" /> {t('info_back_to_info')}
        </button>

        {error && <div className="bg-[#f0d6cf] text-[#8b1f1a] border border-[#c8392f] rounded-md p-3 mb-4">{error}</div>}

        <div className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
          <h1 className="text-3xl font-bold text-[#1c1813] mb-2">🎶 {t('info_music_cinema_title')}</h1>
          <p className="text-[#5b5446] mb-6">{t('info_music_cinema_description')}</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-[#1c1813] mb-4">{t('info_music_title')}</h2>
              {data?.musicCinema?.music?.map((item, i) => (
                <div key={i} className="rounded-xl border border-[rgba(28,24,19,0.18)] p-4 mb-3 hover:shadow-lg transition bg-[#f8f1de]">
                  <div className="font-semibold text-[#1c1813]">{item.title}</div>
                  <div className="text-sm text-[#928a76]">{item.type} · {item.year}</div>
                  <div className="text-[#5b5446]">{item.note}</div>
                </div>
              ))}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#1c1813] mb-4">{t('info_cinema_title')}</h2>
              {data?.musicCinema?.cinema?.map((item, i) => (
                <div key={i} className="rounded-xl border border-[rgba(28,24,19,0.18)] p-4 mb-3 hover:shadow-lg transition bg-[#f8f1de]">
                  <div className="font-semibold text-[#1c1813]">{item.title}</div>
                  <div className="text-sm text-[#928a76]">{item.year}</div>
                  <div className="text-[#5b5446]">{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
