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
    return <div className="min-h-screen grid place-items-center bg-[#f4ecdc] text-[#5b5446]">{t('info_loading')}</div>;
  }

  const regions = data?.regions ?? [];
  const landmarks = data?.landmarks ?? [];

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
          {/* Header */}
          <section className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
            <h1 className="text-3xl font-bold text-[#1c1813] mb-2">🧭 {t('info_geography_regions_title')}</h1>
            <p className="text-[#5b5446]">{t('info_geography_regions_description')}</p>
          </section>

          {/* Regions */}
          <section className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
            <h2 className="text-2xl font-bold text-[#1c1813] mb-4">{t('info_regions_title')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {regions.map((region, idx) => (
                <div key={idx} className="bg-[#f8f1de] rounded-xl p-4 hover:shadow-lg transition border border-[rgba(28,24,19,0.18)]">
                  <h3 className="font-bold text-[#1c1813] text-lg mb-2">{region.name}</h3>
                  <p className="text-[#5b5446]">{region.highlights}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Landmarks */}
          <section className="bg-[#fbf5e6] rounded-2xl shadow-sm p-6 md:p-8 border border-[rgba(28,24,19,0.10)]">
            <h2 className="text-2xl font-bold text-[#1c1813] mb-4">{t('info_landmarks_title')}</h2>
            <div className="space-y-4">
              {landmarks.map((landmark, idx) => (
                <div key={idx} className="bg-[#f8f1de] rounded-xl p-4 hover:shadow-lg transition border border-[rgba(28,24,19,0.18)]">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#1c1813] text-lg">{landmark.name}</h3>
                    <span className="bg-[#cfe1d3] text-[#2f6b4a] text-xs px-2 py-1 rounded">{landmark.region}</span>
                  </div>
                  <p className="text-[#5b5446]">{landmark.note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
