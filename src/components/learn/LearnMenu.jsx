// src/components/learn/LearnMenu.jsx
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from 'react-i18next';

export default function LearnMenu({ goBack, setLearnSection, setToneSection }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen p-4">
      <Container>
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            {t('learn_back_to_menu')}
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">学习</h2>
          <p className="text-xl text-gray-300">Xuéxí - {t('learn_title')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Caracteres */}
          <Button
            variant="card"
            onClick={() => {
              setLearnSection("characters");
              if (setToneSection) setToneSection(null);
            }}
            className="bg-gray-800 border border-gray-700 hover:border-gray-600"
          >
            <div className="text-5xl mb-4">🈶</div>
            <h3 className="text-2xl font-bold text-white mb-2">汉字</h3>
            <p className="text-lg text-gray-300 mb-1">Hànzì</p>
            <p className="text-gray-400">{t('learn_characters_title')}</p>
          </Button>

          {/* Escritura - NUEVO */}
          <Button
            variant="card"
            onClick={() => {
              setLearnSection("writing");
              if (setToneSection) setToneSection(null);
            }}
            className="bg-gray-800 border border-gray-700 hover:border-gray-600"
          >
            <div className="text-5xl mb-4">✍️</div>
            <h3 className="text-2xl font-bold text-white mb-2">书写</h3>
            <p className="text-lg text-gray-300 mb-1">Shūxiě</p>
            <p className="text-gray-400">{t('learn_writing_title')}</p>
          </Button>

          {/* Radicales */}
          <Button
            variant="card"
            onClick={() => {
              setLearnSection("radicals");
              if (setToneSection) setToneSection(null);
            }}
            className="bg-gray-800 border border-gray-700 hover:border-gray-600"
          >
            <div className="text-5xl mb-4">🔠</div>
            <h3 className="text-2xl font-bold text-white mb-2">部首</h3>
            <p className="text-lg text-gray-300 mb-1">Bùshǒu</p>
            <p className="text-gray-400">{t('learn_radicals_title')}</p>
          </Button>

          {/* Tonos */}
          <Button
            variant="card"
            onClick={() => {
              setLearnSection("tones");
              if (setToneSection) setToneSection(null);
            }}
            className="bg-gray-800 border border-gray-700 hover:border-gray-600"
          >
            <div className="text-5xl mb-4">🎵</div>
            <h3 className="text-2xl font-bold text-white mb-2">声调</h3>
            <p className="text-lg text-gray-300 mb-1">Shēngdiào</p>
            <p className="text-gray-400">{t('learn_tones_title')}</p>
          </Button>
        </div>

        {/* 🔥 ELIMINADO: La sección "¿Por qué aprender radicales?" */}
      </Container>
    </div>
  );
}
