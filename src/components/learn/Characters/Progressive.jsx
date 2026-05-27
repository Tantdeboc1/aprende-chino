// src/components/learn/Characters/Progressive.jsx
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Progressive({
  goBack,
  characters = [],
  speakChinese,
  onTrackSeen,
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

  // Marca las palabras del grupo actual como vistas al navegar
  useEffect(() => {
    const chunk = lessons[current] || [];
    chunk.forEach(char => onTrackSeen?.(char));
  }, [current]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#f4ecdc] p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-8">
        <div className="mb-6 flex justify-between items-center">
          <button onClick={goBack} className="flex items-center text-[#5b5446] hover:text-[#1c1813]">
            ← {t('lessons_back_button')}
          </button>
          <span className="text-[#5b5446] font-semibold">Página {current + 1} de {Math.max(1, lessons.length)}</span>
        </div>

        <div className="bg-[#fbf5e6] rounded-2xl shadow-sm p-4 sm:p-8 border border-[rgba(28,24,19,0.10)]">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1813] mb-2">{t('lessons_title')}</h2>
            <p className="text-[#5b5446]">{t('lessons_subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
            {lesson.map((char, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#f8f1de] to-[#e8dcc0] rounded-xl p-4 sm:p-6 hover:shadow-lg transition border border-[rgba(28,24,19,0.18)]">
                <div className="text-5xl sm:text-7xl text-center mb-3 sm:mb-4 text-[#1c1813]">{char.char}</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#5b5446] font-semibold">{t('dictionary_pinyin')}</span>
                    <span className="text-xl text-[#1c1813]">{char.pinyin}</span>
                  </div>
                  {char.radical && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#5b5446] font-semibold">{t('dictionary_radical')}</span>
                      <span className="text-2xl text-[#1c1813]">{char.radical}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-[rgba(28,24,19,0.18)]">
                    <p className="text-[#1c1813] font-semibold text-center text-lg">{char.meaning}</p>
                  </div>
                </div>
                {typeof speakChinese === 'function' && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => speakChinese({ hanzi: char.char, pinyin: char.pinyin })}
                      className="px-4 py-2 rounded bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-semibold"
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
                className="flex-1 bg-[#bdb39a] hover:bg-[#928a76] text-[#1c1813] font-semibold py-3 rounded-lg transition"
              >
                ← {t('lessons_prev_button')}
              </button>
            )}
            {current < lessons.length - 1 && (
              <button
                onClick={() => setCurrent(current + 1)}
                className="flex-1 bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-semibold py-3 rounded-lg transition"
              >
                {t('lessons_next_button')} →
              </button>
            )}
            {current === lessons.length - 1 && (
              <button
                onClick={goBack}
                className="flex-1 bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-semibold py-3 rounded-lg transition"
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
