import { assetUrl } from '../../utils/assets';
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";

export default function Education({ goBack }) {
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
          <h1 className="text-3xl font-bold text-[#1c1813] mb-2">🏫 {t('info_education_student_life_title')}</h1>
          <p className="text-[#5b5446] mb-6">{t('info_education_student_life_description')}</p>

          {data?.education?.topics && (
            <div className="space-y-4">
              {data.education.topics.map((topic, i) => (
                <div key={i} className="rounded-xl border border-[rgba(28,24,19,0.18)] p-4 hover:shadow-lg transition bg-[#f8f1de]">
                  <div className="text-lg font-semibold text-[#1c1813]">{topic.title}</div>
                  <div className="text-[#5b5446]">{topic.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
