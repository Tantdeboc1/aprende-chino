// src/components/learn/Characters/index.jsx
import { ArrowLeft } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function CharactersIndex({
  goBack,
  setCharacterSection,
  setCurrentLesson,
}) {
  const { t } = useTranslation();
  const handleQuizClick = () => {
    setCharacterSection('quiz');
  };

  const handleMatchingClick = () => {
    setCharacterSection('matching');
  };

  return (
    <div className="min-h-screen bg-[#f4ecdc] p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="mb-6">
          <button onClick={goBack} className="flex items-center text-[#5b5446] hover:text-[#1c1813]">
            <ArrowLeft className="mr-2" />
            {t('characters_back_to_learn')}
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#1c1813] mb-2">汉字</h2>
          <p className="text-xl text-[#5b5446]">Hànzì - {t('characters_title')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <button onClick={() => { setCharacterSection('lessons'); setCurrentLesson?.(0); }} className="bg-[#fbf5e6] rounded-xl shadow-lg p-8 hover:shadow-sm transition transform hover:-translate-y-1 border border-[rgba(28,24,19,0.10)]">
            <div className="text-5xl mb-4"></div>
            <h3 className="text-2xl font-bold text-[#1c1813] mb-2">课程</h3>
            <p className="text-lg text-[#5b5446] mb-1">Kèchéng</p>
            <p className="text-[#928a76]">{t('characters_lessons_title')}</p>
          </button>

          <button onClick={handleQuizClick} className="bg-[#fbf5e6] rounded-xl shadow-lg p-8 hover:shadow-sm transition transform hover:-translate-y-1 border border-[rgba(28,24,19,0.10)]">
            <div className="text-5xl mb-4">❓</div>
            <h3 className="text-2xl font-bold text-[#1c1813] mb-2">测验</h3>
            <p className="text-lg text-[#5b5446] mb-1">Cèyàn</p>
            <p className="text-[#928a76]">{t('characters_quiz_title')}</p>
          </button>

          <button onClick={handleMatchingClick} className="bg-[#fbf5e6] rounded-xl shadow-lg p-8 hover:shadow-sm transition transform hover:-translate-y-1 border border-[rgba(28,24,19,0.10)]">
            <div className="text-5xl mb-4"></div>
            <h3 className="text-2xl font-bold text-[#1c1813] mb-2">配对</h3>
            <p className="text-lg text-[#5b5446] mb-1">Pèiduì</p>
            <p className="text-[#928a76]">{t('characters_matching_title')}</p>
          </button>
        </div>
      </div>
    </div>
  );
}
