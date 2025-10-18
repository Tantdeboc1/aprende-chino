// src/components/learn/Writing/HanziWriting.jsx
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";

export default function HanziWriting({ goBack, characters, speakChinese }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState('view');
  const writerRef = useRef(null);
  const writerInstanceRef = useRef(null);
  const isMountedRef = useRef(true);

  const currentCharacter = characters[currentIndex];

  // Efecto principal - CON CLEANUP AGGRESIVO
  useEffect(() => {
    isMountedRef.current = true;

    const initWriter = async () => {
      if (!currentCharacter || !writerRef.current || !isMountedRef.current) return;

      console.log('🔄 Inicializando HanziWriter para:', currentCharacter.char);

      try {
        // LIMPIAR COMPLETAMENTE - método más agresivo
        if (writerInstanceRef.current) {
          try {
            writerInstanceRef.current._target.innerHTML = '';
            writerInstanceRef.current = null;
          } catch (e) {
            console.log('Error en cleanup:', e);
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

        console.log('✅ HanziWriter inicializado correctamente');

      } catch (error) {
        console.error('❌ Error inicializando HanziWriter:', error);
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
          console.log('🧹 Limpiando instancia anterior');
          writerInstanceRef.current._target.innerHTML = '';
          writerInstanceRef.current = null;
        } catch (e) {
          // Ignorar errores de cleanup
        }
      }
    };
  }, [currentCharacter, activeTab]);

  const animateCharacter = () => {
    if (writerInstanceRef.current && activeTab === 'view') {
      setIsPlaying(true);
      writerInstanceRef.current.animateCharacter({
        onComplete: () => setIsPlaying(false)
      });
    }
  };

  const startPractice = () => {
    if (writerInstanceRef.current && activeTab === 'practice') {
      setIsPlaying(true);
      writerInstanceRef.current.quiz({
        onComplete: () => {
          setIsPlaying(false);
          setTimeout(() => {
            if (writerInstanceRef.current) {
              writerInstanceRef.current.showOutline();
            }
          }, 1000);
        },
        onMistake: () => {
          console.log('Error - intenta de nuevo');
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
    if (currentIndex < characters.length - 1) {
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
          <div className="text-center text-white">No hay caracteres disponibles</div>
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
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            Escritura
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {currentCharacter.char || currentCharacter.hanzi}
          </h2>
          <p className="text-xl text-gray-300 mb-1">
            {currentCharacter.pinyin} - {currentCharacter.meaning}
          </p>
          <p className="text-gray-400">
            {currentIndex + 1} de {characters.length}
          </p>
        </div>

        {/* Pestañas */}
        <div className="flex border-b border-gray-600 mb-6">
          <button
            onClick={() => handleTabChange('view')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'view'
                ? 'text-red-500 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            🎯 Ver Orden
          </button>
          <button
            onClick={() => handleTabChange('practice')}
            className={`flex-1 py-3 font-semibold transition-colors ${
              activeTab === 'practice'
                ? 'text-green-500 border-b-2 border-green-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            ✍️ Practicar
          </button>
        </div>

        {/* Área de escritura - CON FONDO TRANSPARENTE */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-6">
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
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {isPlaying ? 'Animando...' : 'Ver Orden de Trazos'}
              </button>

              <button
                onClick={() => speakChinese(currentCharacter.char || currentCharacter.hanzi)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🔊 Pronunciar
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={startPractice}
                disabled={isPlaying}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                {isPlaying ? 'Practicando...' : 'Comenzar Práctica'}
              </button>

              <button
                onClick={resetPractice}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Reiniciar
              </button>

              <button
                onClick={() => speakChinese(currentCharacter.char || currentCharacter.hanzi)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                🔊 Pronunciar
              </button>
            </div>
          )}
        </div>

        {/* Navegación */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevCharacter}
            disabled={currentIndex === 0}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors"
          >
            ← Anterior
          </button>

          <button
            onClick={nextCharacter}
            disabled={currentIndex === characters.length - 1}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Siguiente →
          </button>
        </div>
      </Container>
    </div>
  );
}
