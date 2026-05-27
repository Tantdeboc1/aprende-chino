import ConfettiCelebration from "@/components/ui/ConfettiCelebration.jsx";import { useState, useEffect, useCallback, useRef } from "react";
import { ArrowLeft, RefreshCw, Play, Clock } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import Button from "@/components/ui/Button.jsx";
import { useTranslation } from "react-i18next";
import { hapticSuccess, hapticError } from '@/utils/haptic.js';

// --- Helpers ---
// Función para barajar un array
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// --- Componente Principal ---
export default function TimeRace({ goBack, characters = [], onTrackResult }) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'finished'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const timeLeftRef = useRef(60);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect', or null
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Función para generar una nueva pregunta
  const generateQuestion = useCallback(() => {
    if (characters.length < 4) return;

    const shuffled = shuffleArray(characters);
    const correctChar = shuffled[0];
    const options = shuffled.slice(1, 4).map(c => c.meaning);
    options.push(correctChar.meaning);

    setCurrentQuestion({
      character: correctChar.char,
      correctMeaning: correctChar.meaning,
      charObj: correctChar,
      options: shuffleArray(options),
    });
    setFeedback(null);
    setSelectedAnswer(null);
  }, [characters]);

  // Iniciar el juego
  const startGame = () => {
    setScore(0);
    setTimeLeft(60); timeLeftRef.current = 60;
    setGameState('playing');
    generateQuestion();
  };


  // Manejar la respuesta del jugador
  const handleAnswer = (selectedMeaning) => {
    if (feedback) return; // Evita múltiples clics

    setSelectedAnswer(selectedMeaning);

    const isCorrect = selectedMeaning === currentQuestion.correctMeaning;
    if (isCorrect) {
      setScore(s => s + 10); // +10 puntos por acierto
      setFeedback('correct');
      hapticSuccess();
    } else {
      setTimeLeft(t => { const next = Math.max(0, t - 2); timeLeftRef.current = next; return next; }); // Penalización de 2 segundos
      setFeedback('incorrect');
      hapticError();
    }
    onTrackResult?.(currentQuestion.charObj, isCorrect);

    // Pasa a la siguiente pregunta después de un breve feedback visual
    const capturedTime = timeLeftRef.current;
    setTimeout(() => {
      if (capturedTime > 0) {
        generateQuestion();
      }
    }, 800);
  };

  // Temporizador del juego
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('finished');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => { const next = t - 1; timeLeftRef.current = next; return next; });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // --- Renderizado ---

  // Pantalla de Inicio (estilo Quiz)
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-[#f4ecdc] p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button onClick={goBack} className="flex items-center text-[#5b5446] hover:text-[#1c1813] transition mb-4">
              <ArrowLeft className="mr-2" />
              {t('minigames_back_to_minigames')}
            </button>
            <h1 className="text-3xl font-bold text-[#1c1813] text-center">{t('minigames_time_race_title')}</h1>
            <p className="text-[#928a76] text-center">{t('minigames_guess_the_meaning_subtitle')}</p>
          </div>
          <div className="bg-[#fbf5e6] rounded-xl p-6 border border-[rgba(28,24,19,0.10)] mb-6">
            <h2 className="text-xl font-bold text-[#1c1813] mb-4">{t('quiz_instructions_title')}</h2>
            <div className="space-y-3 text-[#5b5446]">
              <div className="flex items-start">
                <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p dangerouslySetInnerHTML={{ __html: t('minigames_time_race_instructions_1') }} />
              </div>
              <div className="flex items-start">
                <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p dangerouslySetInnerHTML={{ __html: t('minigames_time_race_instructions_2') }} />
              </div>
              <div className="flex items-start">
                <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p dangerouslySetInnerHTML={{ __html: t('minigames_time_race_instructions_3') }} />
              </div>
              <div className="flex items-start">
                <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>{t('minigames_time_race_instructions_4')}</p>
              </div>
            </div>
          </div>
          <button onClick={startGame} className="w-full bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-bold py-4 px-6 rounded-xl transition text-lg">
            ️ {t('minigames_start_game_button')}
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de Fin de Juego
  if (gameState === 'finished') {
    return (
      <>
        {score > 0 && <ConfettiCelebration />}
        <div className="min-h-screen bg-[#f4ecdc] p-4 flex items-center justify-center">
          <Container>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-[#b88a3e] mb-4">{t('minigames_time_up_message')}</h2>
              <p className="text-xl text-[#5b5446] mb-2">{t('minigames_final_score_message')}</p>
              <p className="text-6xl font-bold text-[#1c1813] mb-8">{score}</p>
              <div className="flex justify-center gap-4">
                <Button onClick={startGame} variant="action"><RefreshCw className="inline-block mr-2"/> {t('minigames_play_again_button')}</Button>
                <button onClick={goBack} className="bg-[#f8f1de] hover:bg-[#bdb39a] text-[#1c1813] font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2"><ArrowLeft size={18}/> {t('radicals_back_button')}</button>
              </div>
            </div>
          </Container>
        </div>
      </>
    );
  }

  // Pantalla de Juego
  return (
    <div className="min-h-screen bg-[#f4ecdc] p-4">
      <Container>
        <div className="mb-6">
          <button onClick={goBack} className="flex items-center text-[#5b5446] hover:text-[#1c1813]">
            <ArrowLeft className="mr-2" />
            {t('minigames_back_to_minigames')}
          </button>
        </div>
        {/* HUD: Puntuación y Tiempo */}
        <div className="mb-6 flex justify-between items-center text-[#1c1813] font-bold text-xl">
          <div>{t('minigames_score_label_hud')} <span className="text-[#b88a3e]">{score}</span></div>
          <div className="flex items-center gap-2">
            <Clock size={20}/>
            <span>{timeLeft}</span>
          </div>
        </div>

        {currentQuestion && (
          <div className="text-center">
            {/* Tarjeta del Carácter */}
            <div className="bg-[#fbf5e6] border-2 border-[rgba(28,24,19,0.10)] rounded-2xl w-full max-w-md mx-auto h-36 sm:h-48 flex items-center justify-center mb-6 sm:mb-8">
              <span className="text-6xl sm:text-8xl font-bold text-[#1c1813]">{currentQuestion.character}</span>
            </div>

            {/* Opciones de Respuesta */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
              {currentQuestion.options.map((option, i) => {
                let buttonClass = "bg-[#f8f1de] hover:bg-[#bdb39a]";
                if (feedback) {
                  if (option === currentQuestion.correctMeaning) {
                    buttonClass = "bg-[#2f6b4a] animate-pulse"; // Correcta siempre en verde
                  } else if (option === selectedAnswer) {
                    buttonClass = "bg-[#c8392f]"; // La seleccionada incorrecta en rojo
                  }
                }

                return (
                  <Button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    className={`text-lg py-4 h-24 flex items-center justify-center ${buttonClass}`}
                    disabled={!!feedback}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

