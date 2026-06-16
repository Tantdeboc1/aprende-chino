// src/components/learn/Writing/HanziWriting.jsx
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";
import { markWritingPractice, getWritingCount } from '@/utils/progress.js';

export default function HanziWriting({ goBack, characters, speakChinese, progress, onProgressChange }) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('view');
  const writerRef = useRef(null);
  const writerInstanceRef = useRef(null);
  const isMountedRef = useRef(true);

  // HanziWriter solo soporta caracteres individuales — filtrar palabras multi-carácter
  const writableChars = characters.filter(c => c.char && c.char.length === 1);

  const currentCharacter = writableChars[currentIndex];
  // Clave primitiva estable: writableChars se recrea con .filter() en cada
  // render, así que currentCharacter es un objeto nuevo cada vez. Usar el
  // carácter como dependencia evita que el useEffect destruya y recree el
  // writer en cada render (lo que cancelaba el quiz a medias).
  const charKey = currentCharacter?.char || currentCharacter?.hanzi;

  // Efecto principal - CON CLEANUP AGGRESIVO
  useEffect(() => {
    isMountedRef.current = true;

    const initWriter = async () => {
      if (!currentCharacter || !writerRef.current || !isMountedRef.current) return;


      try {
        // LIMPIAR COMPLETAMENTE - método más agresivo
        if (writerInstanceRef.current) {
          try {
            writerInstanceRef.current._target.innerHTML = '';
            writerInstanceRef.current = null;
          } catch (e) {
          }
        }

        // Limpiar el contenedor manualmente
        writerRef.current.innerHTML = '';

        const HanziWriter = await import('hanzi-writer');

        const options = {
          width: 200,
          height: 200,
          padding: 10,
          strokeColor: '#ef4444',
          strokeAnimationSpeed: 1.5,
          delayBetweenStrokes: 600,
          radicalColor: '#3b82f6',
          showOutline: true,
        };

        // Configurar según la pestaña
        if (activeTab === 'view') {
          options.showCharacter = true;
        } else {
          options.showCharacter = false;
          options.highlightOnComplete = true;
          options.highlightColor = '#10b981';
        }

        // Crear NUEVA instancia
        writerInstanceRef.current = HanziWriter.default.create(
          writerRef.current,
          currentCharacter.char || currentCharacter.hanzi,
          options
        );


      } catch (error) {
        // No rompemos la UI si hanzi-writer falla (carácter sin datos, red
        // caída al cargar el módulo…), pero lo dejamos en consola para poder
        // diagnosticarlo en vez de tragarlo en silencio.
        console.warn('[HanziWriting] no se pudo inicializar el writer:', error);
      }
    };

    // Pequeño delay para asegurar que el DOM está listo
    const timer = setTimeout(() => {
      initWriter();
    }, 100);

    // Cleanup MUY agresivo
    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);

      if (writerInstanceRef.current) {
        try {
          writerInstanceRef.current._target.innerHTML = '';
          writerInstanceRef.current = null;
        } catch (e) {
          // Ignorar errores de cleanup
        }
      }
    };
  }, [charKey, activeTab]);

  const animateCharacter = () => {
    if (writerInstanceRef.current && activeTab === 'view') {
      setIsPlaying(true);
      writerInstanceRef.current.animateCharacter({
      });
    }
  };

  const startPractice = () => {
    if (writerInstanceRef.current && activeTab === 'practice') {
      setIsPlaying(true);
      writerInstanceRef.current.quiz({
        onComplete: () => {
          setIsPlaying(false);
          // Registrar práctica completada
          if (onProgressChange) {
            const char = currentCharacter.char || currentCharacter.hanzi;
            onProgressChange(markWritingPractice(progress || {}, char));
          }
          setTimeout(() => {
            if (writerInstanceRef.current) writerInstanceRef.current.showOutline();
          }, 1000);
        },
        onMistake: () => {
        }
      });
    }
  };

  const resetPractice = () => {
    if (writerInstanceRef.current && activeTab === 'practice') {
      writerInstanceRef.current.cancelQuiz();
      writerInstanceRef.current.showOutline();
      setIsPlaying(false);
    }
  };

  const nextCharacter = () => {
    if (currentIndex < writableChars.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const prevCharacter = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsPlaying(false);
  };

  if (!currentCharacter) {
    return (
      <div className="min-h-screen p-4">
        <Container>
          <div className="text-center text-[#1c1813]">{t('writing_no_characters_available')}</div>
        </Container>
      </div>
    );
  }

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

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1c1813] mb-2">
            {currentCharacter.char || currentCharacter.hanzi}
          </h2>
          <p className="text-xl text-[#5b5446] mb-1">
            {currentCharacter.pinyin} - {currentCharacter.meaning}
          </p>
          <div className="flex items-center justify-center gap-3 text-sm">
            <p className="text-[#928a76]">{currentIndex + 1} de {writableChars.length}</p>
            {(() => {
              const count = getWritingCount(progress, currentCharacter.char || currentCharacter.hanzi);
              return count > 0 ? (
                <span className="bg-[#cfe1d3]/40 text-[#2f6b4a] border border-[#2f6b4a]/ px-2 py-0.5 rounded-full text-xs font-semibold">
                  practicado {count}×
                </span>
              ) : null;
            })()}
          </div>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-[rgba(28,24,19,0.18)] mb-6">
          <button
            onClick={() => handleTabChange('view')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'view'
                ? 'text-[#c8392f] border-b-2 border-[#c8392f]'
                : 'text-[#928a76] hover:text-[#5b5446]'
            }`}
          >
            {t('writing_view_order_tab')}
          </button>
          <button
            onClick={() => handleTabChange('practice')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'practice'
                ? 'text-[#2f6b4a] border-b-2 border-[#2f6b4a]'
                : 'text-[#928a76] hover:text-[#5b5446]'
            }`}
          >
            {t('writing_practice_tab')}
          </button>
        </div>

        {/* Área de escritura - CON FONDO TRANSPARENTE */}
        <div className="bg-white dark:bg-[#fbf5e6] rounded-2xl p-8 shadow-lg mb-6">
          <div
            ref={writerRef}
            className="mx-auto mb-6 flex justify-center items-center"
            style={{
              width: '220px',
              height: '220px',
              // FONDO TRANSPARENTE para evitar blancos
              backgroundColor: 'transparent'
            }}
          >
            {/* Este texto debería desaparecer cuando HanziWriter carga */}
          </div>

          {/* Botones según la pestaña activa */}
          {activeTab === 'view' ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={animateCharacter}
                disabled={isPlaying}
                className="bg-[#c8392f] hover:bg-[#8b1f1a] disabled:bg-[#928a76] text-[#fbf5e6] px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {isPlaying ? t('writing_animating_button') : t('writing_view_stroke_order_button')}
              </button>

              <button
                onClick={() => speakChinese({ hanzi: currentCharacter.char || currentCharacter.hanzi, pinyin: currentCharacter.pinyin })}
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
                className="bg-[#2f6b4a] hover:bg-[#1f4a33] disabled:bg-[#928a76] text-[#fbf5e6] px-6 py-3 rounded-lg font-semibold transition-colors"
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
                onClick={() => speakChinese({ hanzi: currentCharacter.char || currentCharacter.hanzi, pinyin: currentCharacter.pinyin })}
                className="bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {t('writing_pronounce_button')}
              </button>
            </div>
          )}
        </div>

        {/* Navegación */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevCharacter}
            disabled={currentIndex === 0}
            className="bg-[#bdb39a] hover:bg-[#f8f1de] disabled:bg-[#fbf5e6] text-[#1c1813] px-6 py-2 rounded-lg transition-colors"
          >
            ← {t('writing_previous_button')}
          </button>

          <button
            onClick={nextCharacter}
            disabled={currentIndex === writableChars.length - 1}
            className="bg-[#bdb39a] hover:bg-[#f8f1de] disabled:bg-gray
-800 text-[#1c1813] px-6 py-2 rounded-lg transition-colors"
          >
            {t('writing_next_button')} →
          </button>
        </div>
      </Container>
    </div>
  );
}
