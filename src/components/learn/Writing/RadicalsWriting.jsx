// src/components/learn/Writing/RadicalsWriting.jsx
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";
import { hanziCharDataLoader } from '@/utils/hanziCharData.js';

export default function RadicalsWriting({ goBack, radicals, speakChinese }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('view');
  const writerRef = useRef(null);
  const writerInstanceRef = useRef(null);

  // Filtrar y normalizar radicales
  const validRadicals = radicals
    .filter(radical => {
      const char = radical.radical || radical.char || radical.hanzi;
      return char && char.trim() !== '' && char.length === 1;
    })
    .map(radical => ({
      char: radical.radical || radical.char || radical.hanzi,
      pinyin: radical.pinyin || '',
      meaning: radical.meaning || '',
      examples: Array.isArray(radical.examples) ? radical.examples.join(', ') : '',
      strokeCount: radical.strokeCount || 0,
      frequency: radical.frequency || 'media'
    }));

  const currentRadical = validRadicals[currentIndex];

  // Efecto principal - VERSIÓN SIMPLIFICADA
  useEffect(() => {
    let mounted = true;

    const initWriter = async () => {
      if (!currentRadical || !writerRef.current || !mounted) return;


      try {
        // Limpiar instancia anterior
        if (writerInstanceRef.current) {
          try {
            writerInstanceRef.current._target.innerHTML = '';
          } catch (e) {
            // Ignorar errores de cleanup
          }
          writerInstanceRef.current = null;
        }

        // Limpiar contenedor
        writerRef.current.innerHTML = '';

        const HanziWriter = await import('hanzi-writer');

        // Configuración básica y robusta
        const options = {
          charDataLoader: hanziCharDataLoader,
          width: 200,
          height: 200,
          padding: 5,
          strokeColor: '#10b981',
          radicalColor: '#8b5cf6',
          strokeAnimationSpeed: 2,
          delayBetweenStrokes: 400,
        };

        // Crear instancia
        const writer = HanziWriter.default.create(
          writerRef.current,
          currentRadical.char,
          options
        );

        writerInstanceRef.current = writer;

        // Configurar estado inicial según pestaña
        if (activeTab === 'view') {
          // En modo vista: mostrar carácter completo
          writer.showCharacter();
        } else {
          // En modo práctica: mostrar contorno
          writer.showOutline();
        }


      } catch (error) {
      }
    };

    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(initWriter, 150);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [currentRadical, activeTab]);

  // ANIMACIÓN DE VER ORDEN - VERSIÓN ROBUSTA
  const animateCharacter = async () => {
    if (!writerInstanceRef.current || activeTab !== 'view') return;

    setIsPlaying(true);

    try {
      // 1. Ocultar carácter completo
      writerInstanceRef.current.hideCharacter();

      // 2. Pequeño delay para que se oculte
      await new Promise(resolve => setTimeout(resolve, 200));

      // 3. Mostrar contorno
      writerInstanceRef.current.showOutline();

      // 4. Delay antes de animar
      await new Promise(resolve => setTimeout(resolve, 300));

      // 5. Ejecutar animación
      writerInstanceRef.current.animateCharacter({
        onComplete: () => {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      setIsPlaying(false);
    }
  };

  // MODO PRÁCTICA - VERSIÓN ROBUSTA
  const startPractice = async () => {
    if (!writerInstanceRef.current || activeTab !== 'practice') return;

    setIsPlaying(true);

    try {
      // 1. Resetear a estado inicial
      writerInstanceRef.current.hideCharacter();
      writerInstanceRef.current.showOutline();

      // 2. Pequeño delay para estabilizar
      await new Promise(resolve => setTimeout(resolve, 300));

      // 3. Iniciar quiz
      writerInstanceRef.current.quiz({
        onComplete: () => {
          setIsPlaying(false);
          // Mostrar carácter completo al finalizar
          setTimeout(() => {
            if (writerInstanceRef.current) {
              writerInstanceRef.current.showCharacter();
            }
          }, 500);
        },
        onMistake: () => {
        },
        onStrokeStatusChange: () => {
        }
      });
    } catch (error) {
      setIsPlaying(false);
    }
  };

  const resetPractice = () => {
    if (writerInstanceRef.current && activeTab === 'practice') {
      writerInstanceRef.current.cancelQuiz();
      writerInstanceRef.current.hideCharacter();
      writerInstanceRef.current.showOutline();
      setIsPlaying(false);
    }
  };

  const nextRadical = () => {
    if (currentIndex < validRadicals.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const prevRadical = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsPlaying(false);
  };


  if (validRadicals.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <Container>
          <div className="mb-6">
            <button
              onClick={goBack}
              className="flex items-center text-[#5b5446] hover:text-[#1c1813]"
            >
              <ArrowLeft className="mr-2" />
              {t('writing_back_to_writing')}
            </button>
          </div>
          <div className="text-center text-[#1c1813]">
            <h2 className="text-2xl font-bold mb-4">{t('writing_no_radicals_available')}</h2>
            <p className="text-[#5b5446]">
              {t('writing_no_radicals_description')}
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <Container>
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-[#5b5446] hover:text-[#1c1813]"
          >
            <ArrowLeft className="mr-2" />
            {t('writing_back_to_writing')}
          </button>
        </div>

        {/* Radical Info */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1c1813] mb-2">
            {currentRadical.char}
          </h2>
          <p className="text-xl text-[#5b5446] mb-1">
            {currentRadical.pinyin} - {currentRadical.meaning}
          </p>
          <p className="text-[#928a76]">
            {currentIndex + 1} de {validRadicals.length} • {currentRadical.strokeCount} trazos
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[rgba(28,24,19,0.18)] mb-6">
          <button
            onClick={() => handleTabChange('view')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'view'
                ? 'text-[#2f6b4a] border-b-2 border-[#2f6b4a]'
                : 'text-[#928a76] hover:text-[#5b5446]'
            }`}
          >
            {t('writing_view_order_tab')}
          </button>
          <button
            onClick={() => handleTabChange('practice')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'practice'
                ? 'text-[#c8392f] border-b-2 border-[#c8392f]'
                : 'text-[#928a76] hover:text-[#5b5446]'
            }`}
          >
            {t('writing_practice_tab')}
          </button>
        </div>

        {/* Writing Area */}
        <div className="bg-white dark:bg-[#fbf5e6] rounded-2xl p-8 shadow-lg mb-6">
          <div
            ref={writerRef}
            className="mx-auto mb-6 flex justify-center items-center bg-transparent rounded-lg"
            style={{
              width: '220px',
              height: '220px',
            }}
          />

          {/* Buttons */}
          {activeTab === 'view' ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={animateCharacter}
                disabled={isPlaying}
                className="bg-[#2f6b4a] hover:bg-[#1f4a33] disabled:bg-[#928a76] text-[#fbf5e6] px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {isPlaying ? t('writing_animating_button') : t('writing_view_stroke_order_button')}
              </button>
              <button
                onClick={() => speakChinese({ hanzi: currentRadical.char, pinyin: currentRadical.pinyin })}
                className="bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('writing_pronounce_button')}
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startPractice}
                disabled={isPlaying}
                className="bg-[#c8392f] hover:bg-[#8b1f1a] disabled:bg-[#928a76] text-[#fbf5e6] px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {isPlaying ? t('writing_practicing_button') : t('writing_start_practice_button')}
              </button>
              <button
                onClick={resetPractice}
                className="bg-[#b88a3e] hover:bg-[#b88a3e] text-[#fbf5e6] px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('writing_reset_button')}
              </button>
              <button
                onClick={() => speakChinese({ hanzi: currentRadical.char, pinyin: currentRadical.pinyin })}
                className="bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('writing_pronounce_button')}
              </button>
            </div>
          )}
        </div>

        {/* Radical Info */}
        <div className="bg-[#fbf5e6] rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-[#1c1813] mb-3">{t('writing_radical_info_header')}</h3>
          <div className="grid md:grid-cols-2 gap-4 text-[#5b5446]">
            <div>
              <p><strong>{t('writing_meaning_label')}</strong> {currentRadical.meaning}</p>
              <p><strong>{t('writing_pinyin_label')}</strong> {currentRadical.pinyin}</p>
            </div>
            <div>
              <p><strong>{t('writing_strokes_label')}</strong> {currentRadical.strokeCount}</p>
              <p><strong>{t('writing_frequency_label')}</strong> {currentRadical.frequency}</p>
            </div>
          </div>
          {currentRadical.examples && (
            <div className="mt-4 pt-4 border-t border-[rgba(28,24,19,0.10)]">
              <p className="text-[#1c1813]"><strong>{t('writing_examples_label')}</strong> {currentRadical.examples}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevRadical}
            disabled={currentIndex === 0}
            className="bg-[#bdb39a] hover:bg-[#f8f1de] disabled:bg-[#fbf5e6] text-[#1c1813] px-6 py-2 rounded-lg transition-colors"
          >
            ← {t('writing_previous_button')}
          </button>
          <button
            onClick={nextRadical}
            disabled={currentIndex === validRadicals.length - 1}
            className="bg-[#bdb39a] hover:bg-[#f8f1de] disabled:bg-[#fbf5e6] text-[#1c1813] px-6 py-2 rounded-lg transition-colors"
          >
            {t('writing_next_button')} →
          </button>
        </div>
      </Container>
    </div>
  );
}
