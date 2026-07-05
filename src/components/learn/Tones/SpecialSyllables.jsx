import { assetUrl } from '../../../utils/assets';
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * CORREGIDO: Ahora reproduce directamente el pinyin con tono
 * que existe en el manifest (zhi1, chi1, etc.)
 */

export default function SpecialSyllables({ goBack, speakChinese }) {
  const { t } = useTranslation();
  const [raw, setRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(assetUrl('data/hsk1-data.json'));
        if (!res.ok) throw new Error('No se pudo cargar hsk1-data.json');
        const json = await res.json();
        if (!mounted) return;
        const ss = json?.specialSyllables ?? [];
        setRaw(ss);
        setLoading(false);
      } catch (e) {
        if (!mounted) return;
        setError('tones_syllables_error');
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const items = useMemo(() => {
    const list = (raw || []).map((it) => {
      if (typeof it === "string") return { pinyin: it, sound: "" };
      return { pinyin: it?.pinyin, sound: it?.sound ?? "" };
    }).filter(it => !!it.pinyin);
    return list.sort((a, b) => a.pinyin.localeCompare(b.pinyin));
  }, [raw]);

  // CORRECCIÓN: Reproducir pinyin + tono directamente
  const play = (pin) => {
    // Agregar tono 1 por defecto para que encuentre el archivo
    // En tu manifest tienes: zhi1, chi1, shi1, ri1, zi1, ci1, si1, etc.
    const syllableWithTone = `${pin}1`;


    if (typeof speakChinese === "function") {
      speakChinese(syllableWithTone, { category: 'pronunciation' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--paper)] p-4 grid place-items-center">
        <div className="text-[var(--ink-soft)]">{t('tones_loading_syllables')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-8">
        <div className="mb-6">
          <button onClick={() => goBack && goBack()} className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)]">
            <ArrowLeft className="mr-2" />
            {t('tones_back_to_tones')}
          </button>
        </div>

        {error && (
          <div className="bg-[var(--red-bg)] text-[var(--red-deep)] border border-[var(--red)] rounded-md p-3 mb-4">
            {t(error)}
          </div>
        )}

        <div className="bg-[var(--paper-hi)] rounded-2xl shadow-sm p-8 border border-[rgba(28,24,19,0.10)]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-1">{t('tones_special_syllables_title')}</h2>
            <p className="text-[var(--ink-soft)]">{t('tones_click_to_listen_each_syllable')}</p>
          </div>

          {items.length === 0 ? (
            <div className="text-center text-[var(--mute)]">{t('tones_no_special_syllables_data')}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((it, idx) => (
                <button
                  key={idx}
                  onClick={() => play(it.pinyin)}
                  className="bg-gradient-to-br from-[var(--paper-hi2)] to-gray-600 rounded-xl p-6 hover:shadow-lg transition text-center border border-[rgba(28,24,19,0.18)]"
                  title={t('tones_listen_syllable_tooltip')}
                >
                  <div className="text-4xl font-extrabold text-[var(--ink)] mb-2 select-none">{it.pinyin}</div>
                  <div className="text-[var(--ink-soft)] text-sm">{it.sound}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
