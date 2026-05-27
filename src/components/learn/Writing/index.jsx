// src/components/learn/Writing/index.jsx
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from 'react-i18next';

export default function WritingMenu({ goBack, setWritingSection }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen p-4">
      <Container>
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-[#5b5446] hover:text-[#1c1813]"
          >
            <ArrowLeft className="mr-2" />
            {t('writing_back_to_learn')}
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-[#1c1813] mb-2">书写</h2>
          <p className="text-xl text-[#5b5446]">Shūxiě - {t('writing_title')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Hanzi Completo */}
          <Button
            variant="card"
            onClick={() => setWritingSection("hanzi")}
            className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]"
          >
            <div className="text-5xl mb-4">🈷️</div>
            <h3 className="text-2xl font-bold text-[#1c1813] mb-2">汉字</h3>
            <p className="text-lg text-[#5b5446] mb-1">Hànzì</p>
            <p className="text-[#928a76]">{t('writing_hanzi_title')}</p>
          </Button>

          {/* Radicales Básicos */}
          <Button
            variant="card"
            onClick={() => setWritingSection("radicals")}
            className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]"
          >
            <div className="text-5xl mb-4">🔠</div>
            <h3 className="text-2xl font-bold text-[#1c1813] mb-2">部首</h3>
            <p className="text-lg text-[#5b5446] mb-1">Bùshǒu</p>
            <p className="text-[#928a76]">{t('writing_radicals_title')}</p>
          </Button>
        </div>
      </Container>
    </div>
  );
}
