// src/components/learn/Tones/index.jsx
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Vowels from "./Vowels.jsx";
import Consonants from "./Consonants.jsx";
import { useTranslation } from 'react-i18next';

export default function TonesIndex({ goBack, speakChinese, setToneSection }) {
  const { t } = useTranslation();
  // Estado local SOLO para navegar entre Vowels/Consonants dentro de este componente.
  const [innerSection, setInnerSection] = useState(null);

  if (innerSection === "vowels") {
    return <Vowels goBack={() => setInnerSection(null)} speakChinese={speakChinese} />;
  }

  if (innerSection === "consonants") {
    return <Consonants goBack={() => setInnerSection(null)} speakChinese={speakChinese} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="mb-6">
          <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white">
            <ArrowLeft className="mr-2" />
            {t('tones_back_to_learn')}
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">声调</h2>
          <p className="text-xl text-gray-300">Shēngdiào - {t('tones_title')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => setInnerSection("vowels")}
            className="bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-700"
          >
            <div className="text-5xl mb-4">🗣️</div>
            <h3 className="text-2xl font-bold text-white mb-2">元音</h3>
            <p className="text-lg text-gray-300 mb-1">Yuányīn</p>
            <p className="text-gray-400">{t('tones_vowels_title')}</p>
          </button>

          <button
            onClick={() => setInnerSection("consonants")}
            className="bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-700"
          >
            <div className="text-5xl mb-4">🔊</div>
            <h3 className="text-2xl font-bold text-white mb-2">辅音</h3>
            <p className="text-lg text-gray-300 mb-1">Fǔyīn</p>
            <p className="text-gray-400">{t('tones_consonants_title')}</p>
          </button>

          <button
            onClick={() => setToneSection && setToneSection("specialSyllables")}
            className="bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-700"
          >
             <div className="text-5xl mb-4">🀄</div>
             <h3 className="text-2xl font-bold text-white mb-2">{t('tones_syllables_title')}</h3>
             <p className="text-lg text-gray-300 mb-1">Zhěngtǐ rèn dú yīnjié</p>
             <p className="text-gray-400">{t('tones_syllables_description')}</p>
          </button>


          <button
            onClick={() => setToneSection && setToneSection("quizTone")}
            className="bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-700"
          >
            <div className="text-5xl mb-4">🎧</div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('tones_tone_quiz_title')}</h3>
            <p className="text-lg text-gray-300 mb-1">Tīnglì cèshì</p>
            <p className="text-gray-400">{t('tones_tone_quiz_description')}</p>
          </button>

          <button
              onClick={() => setToneSection && setToneSection("quizPronunciation")}
              className="bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-700"
            >
              <div className="text-5xl mb-4">🎙️</div>
              <h3 className="text-2xl font-bold text-white mb-2">{t('tones_pronunciation_quiz_title')}</h3>
              <p className="text-lg text-gray-300 mb-1">Fāyīn cèshì</p>
              <p className="text-gray-400">{t('tones_pronunciation_quiz_description')}</p>
            </button>

        </div>
      </div>
    </div>
  );
}
