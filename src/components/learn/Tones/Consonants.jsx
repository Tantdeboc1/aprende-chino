import { assetUrl } from '../../../utils/assets';
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Consonants({ goBack, speakChinese }) {
  const { t } = useTranslation();
  const [rawConsonants, setRawConsonants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(assetUrl('data/hsk1-data.json'));
        const json = await res.json();
        if (mounted) {
          setRawConsonants(json?.consonants ?? []);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(t('tones_consonants_error'));
          setLoading(false);
        }
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const consonants = useMemo(() => {
    const list = (rawConsonants || []).map((it) => {
      if (typeof it === "string") return { pinyin: it, sound: "" };
      return { pinyin: it?.pinyin, sound: it?.sound ?? "" };
    }).filter(it => !!it.pinyin);

    // añade y / w si faltan
    const have = new Set(list.map(x => x.pinyin));
    if (!have.has("y")) list.push({ pinyin: "y", sound: "" });
    if (!have.has("w")) list.push({ pinyin: "w", sound: "" });

    return list.sort((a, b) => a.pinyin.localeCompare(b.pinyin));
  }, [rawConsonants]);

  // 🔥 CORRECCIÓN: Enviar consonante + vocal + tono para que exista en manifest
  const playConsonant = (consonantPinyin) => {
    // Crear una sílaba válida según la consonante
    let syllable = '';

    // Mapeo de consonantes a sílabas válidas que existen en tu manifest
    const consonantToSyllable = {
      'b': 'ba1',   // 巴
      'p': 'pa1',   // 啪
      'm': 'ma1',   // 妈
      'f': 'fa1',   // 发
      'd': 'da1',   // 搭
      't': 'ta1',   // 他
      'n': 'na1',   // 拿
      'l': 'la1',   // 拉
      'g': 'ga1',   // 嘎
      'k': 'ka1',   // 咔
      'h': 'ha1',   // 哈
      'j': 'ji1',   // 加
      'q': 'qi1',   // 掐
      'x': 'xi1',   // 虾
      'zh': 'zha1', // 扎
      'ch': 'cha1', // 叉
      'sh': 'sha1', // 沙
      'r': 're1',   // 热
      'z': 'za1',   // 咂
      'c': 'ca1',   // 擦
      's': 'sa1',   // 撒
      'y': 'yi1',   // 衣
      'w': 'wu1',   // 屋
    };

    syllable = consonantToSyllable[consonantPinyin] || consonantPinyin;


    if (speakChinese) {
      speakChinese(syllable, { category: 'pronunciation' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 grid place-items-center">
        <div className="text-gray-300">{t('tones_loading_consonants')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-8">
        <div className="mb-6">
          <button onClick={() => goBack && goBack()} className="flex items-center text-gray-300 hover:text-white">
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
            <h2 className="text-3xl font-bold text-white mb-1">{t('tones_pinyin_consonants_title')}</h2>
            <p className="text-gray-300">{t('tones_click_to_listen_example')}</p>
          </div>

          {consonants.length === 0 ? (
            <div className="text-center text-gray-400">{t('tones_no_consonant_data')}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {consonants.map((cons, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => playConsonant(cons.pinyin)}
                    className="bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl p-6 hover:shadow-lg transition text-center border border-gray-600"
                    title={t('tones_listen_example_tooltip')}
                  >
                    <div className="text-5xl font-bold text-white mb-2">{cons.pinyin}</div>
                    <div className="text-gray-300 text-sm">{cons.sound}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
