// src/components/learn/Characters/Progressive.jsx
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Progressive({
  goBack,
  characters = [],
  speakChinese,
}) {
  const { t } = useTranslation();
  const chunkSize = 6;
  const lessons = useMemo(() => {
    const arr = [];
    for (let i = 0; i < characters.length; i += chunkSize) {
      arr.push(characters.slice(i, i + chunkSize));
    }
    return arr;
  }, [characters]);

  const [current, setCurrent] = useState(0);
  const lesson = lessons[current] || [];

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-8">
        <div className="mb-6 flex justify-between items-center">
          <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white">
            ← {t('lessons_back_button')}
          </button>
          <span className="text-gray-300 font-semibold">Lección {current + 1} de {Math.max(1, lessons.length)}</span>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{t('lessons_title')}</h2>
            <p className="text-gray-300">{t('lessons_subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {lesson.map((char, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl p-6 hover:shadow-lg transition border border-gray-600">
                <div className="text-7xl text-center mb-4 text-white">{char.char}</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300 font-semibold">{t('dictionary_pinyin')}</span>
                    <span className="text-xl text-white">{char.pinyin}</span>
                  </div>
                  {char.radical && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300 font-semibold">{t('dictionary_radical')}</span>
                      <span className="text-2xl text-white">{char.radical}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-gray-600">
                    <p className="text-white font-semibold text-center text-lg">{char.meaning}</p>
                  </div>
                </div>
                {typeof speakChinese === 'function' && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => speakChinese(char.char)}
                      className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white font-semibold"
                    >
                      {t('dictionary_listen_button')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            {current > 0 && (
              <button
                onClick={() => setCurrent(current - 1)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition"
              >
                ← {t('lessons_prev_button')}
              </button>
            )}
            {current < lessons.length - 1 && (
              <button
                onClick={() => setCurrent(current + 1)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
              >
                {t('lessons_next_button')} →
              </button>
            )}
            {current === lessons.length - 1 && (
              <button
                onClick={goBack}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
              >
                ✓ {t('lessons_complete_button')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
