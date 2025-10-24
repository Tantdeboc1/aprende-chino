import { assetUrl } from '../../../utils/assets';
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * CORREGIDO: Ahora envía pinyin directamente en lugar de hanzi
 * para que el sistema de audio encuentre los MP3s
 */

export default function Vowels({ goBack, speakChinese }) {
  const { t } = useTranslation();
  const [vowels, setVowels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(assetUrl('data/hsk1-data.json'));
        const json = await res.json();
        if (mounted) {
          setVowels(json?.vowels ?? []);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(t('tones_vowels_error'));
          setLoading(false);
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // 🔥 CORRECCIÓN: Usar sílabas completas que SÍ existen en el manifest
  const say = (vowelChar, toneIndex) => {
    const tone = toneIndex + 1;
    let pinyin = '';

    // Mapeo de vocales a sílabas que existen en el manifest
    // Usamos sílabas simples que destacan la vocal
    const vowelToSyllable = {
      'a': 'a',      // a1, a2, a3, a4 SÍ existen en manifest
      'e': 'e',      // e1, e2, e3, e4 SÍ existen en manifest
      'i': 'yi',     // yi1, yi2, yi3, yi4 existen (i aislada)
      'o': 'wo',     // wo1, wo2, wo3, wo4 existen (o no existe sola)
      'u': 'wu',     // wu1, wu2, wu3, wu4 existen (u aislada)
      'ü': 'yu'      // yu1, yu2, yu3, yu4 existen (ü aislada = yu en pinyin)
    };

    const syllableBase = vowelToSyllable[vowelChar] || vowelChar;
    pinyin = `${syllableBase}${tone}`;

    console.log('🔊 Vocales - Reproduciendo:', { vowel: vowelChar, tone, syllable: pinyin });

    if (speakChinese) {
      speakChinese(pinyin, { category: 'pronunciation' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 grid place-items-center">
        <div className="text-gray-300">{t('tones_loading_vowels')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-8">
        <div className="mb-6">
          <button onClick={() => goBack()} className="flex items-center text-gray-300 hover:text-white">
            <ArrowLeft className="mr-2" />
            {t('tones_back_to_tones')}
          </button>
        </div>

        {error && (
          <div className="bg-red-900 text-red-200 border border-red-700 rounded-md p-3 mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{t('tones_vowels_with_tones_title')}</h2>
            <p className="text-gray-300">{t('tones_click_to_listen_each_tone')}</p>
          </div>

          {vowels.length === 0 ? (
            <div className="text-center text-gray-400">{t('tones_no_vowel_data')}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vowels.map((vowel, idx) => {
                const v = vowel.char; // 'a','o','e','i','u','ü'
                return (
                  <div key={idx} className="bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl p-6 hover:shadow-lg transition border border-gray-600">
                    <div className="text-center mb-4">
                      {/* Botón grande: 1º tono */}
                      <button
                        onClick={() => say(v, 0)}
                        className="text-5xl font-bold text-white mb-2 hover:scale-110 transition"
                        title={t('tones_listen_tooltip', { tone: 1 })}
                      >
                        {vowel.char}
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                        <span className="text-gray-300">{t('tones_first_tone')}</span>
                        <button onClick={() => say(v, 0)} className="text-3xl font-bold text-white hover:opacity-80">
                          {vowel.tone1}
                        </button>
                      </div>
                      <div className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                        <span className="text-gray-300">{t('tones_second_tone')}</span>
                        <button onClick={() => say(v, 1)} className="text-3xl font-bold text-white hover:opacity-80">
                          {vowel.tone2}
                        </button>
                      </div>
                      <div className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                        <span className="text-gray-300">{t('tones_third_tone')}</span>
                        <button onClick={() => say(v, 2)} className="text-3xl font-bold text-white hover:opacity-80">
                          {vowel.tone3}
                        </button>
                      </div>
                      <div className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                        <span className="text-gray-300">{t('tones_fourth_tone')}</span>
                        <button onClick={() => say(v, 3)} className="text-3xl font-bold text-white hover:opacity-80">
                          {vowel.tone4}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
