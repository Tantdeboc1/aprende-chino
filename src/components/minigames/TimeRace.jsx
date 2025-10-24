import ConfettiCelebration from "@/components/ui/ConfettiCelebration.jsx";import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, RefreshCw, Play, Clock } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import Button from "@/components/ui/Button.jsx";
import { useTranslation } from "react-i18next";

// --- Helpers ---
// Función para barajar un array
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// --- Componente Principal ---
export default function TimeRace({ goBack, characters = [] }) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'finished'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
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
      options: shuffleArray(options),
    });
    setFeedback(null);
    setSelectedAnswer(null);
  }, [characters]);

  // Iniciar el juego
  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateQuestion();
  };


  // Manejar la respuesta del jugador
  const handleAnswer = (selectedMeaning) => {
    if (feedback) return; // Evita múltiples clics

    setSelectedAnswer(selectedMeaning);

    if (selectedMeaning === currentQuestion.correctMeaning) {
      setScore(s => s + 10); // +10 puntos por acierto
      setFeedback('correct');
    } else {
      setTimeLeft(t => Math.max(0, t - 2)); // Penalización de 2 segundos
      setFeedback('incorrect');
    }

    // Pasa a la siguiente pregunta después de un breve feedback visual
    setTimeout(() => {
      if (timeLeft > 0) {
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
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // --- Renderizado ---

  // Pantalla de Inicio (estilo Quiz)
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white transition mb-4">
              <ArrowLeft className="mr-2" />
              {t('minigames_back_to_minigames')}
            </button>
            <h1 className="text-3xl font-bold text-white text-center">{t('minigames_time_race_title')}</h1>
            <p className="text-gray-400 text-center">{t('minigames_guess_the_meaning_subtitle')}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('quiz_instructions_title')}</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p dangerouslySetInnerHTML={{ __html: t('minigames_time_race_instructions_1') }} />
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p dangerouslySetInnerHTML={{ __html: t('minigames_time_race_instructions_2') }} />
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p dangerouslySetInnerHTML={{ __html: t('minigames_time_race_instructions_3') }} />
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>{t('minigames_time_race_instructions_4')}</p>
              </div>
            </div>
          </div>
          <button onClick={startGame} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg">
            ⏱️ {t('minigames_start_game_button')}
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
        <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
          <Container>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-yellow-400 mb-4">{t('minigames_time_up_message')}</h2>
              <p className="text-xl text-gray-300 mb-2">{t('minigames_final_score_message')}</p>
              <p className="text-6xl font-bold text-white mb-8">{score}</p>
              <div className="flex justify-center gap-4">
                <Button onClick={startGame} variant="primary"><RefreshCw className="inline-block mr-2"/> {t('minigames_play_again_button')}</Button>
                <Button onClick={goBack} variant="secondary"><ArrowLeft className="inline-block mr-2"/> {t('radicals_back_button')}</Button>
              </div>
            </div>
          </Container>
        </div>
      </>
    );
  }

  // Pantalla de Juego
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <Container>
        <div className="mb-6">
          <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white">
            <ArrowLeft className="mr-2" />
            {t('minigames_back_to_minigames')}
          </button>
        </div>
        {/* HUD: Puntuación y Tiempo */}
        <div className="mb-6 flex justify-between items-center text-white font-bold text-xl">
          <div>{t('minigames_score_label_hud')} <span className="text-yellow-400">{score}</span></div>
          <div className="flex items-center gap-2">
            <Clock size={20}/>
            <span>{timeLeft}</span>
          </div>
        </div>

        {currentQuestion && (
          <div className="text-center">
            {/* Tarjeta del Carácter */}
            <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl w-full max-w-md mx-auto h-48 flex items-center justify-center mb-8">
              <span className="text-8xl font-bold text-white">{currentQuestion.character}</span>
            </div>

            {/* Opciones de Respuesta */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {currentQuestion.options.map((option, i) => {
                let buttonClass = "bg-gray-700 hover:bg-gray-600";
                if (feedback) {
                  if (option === currentQuestion.correctMeaning) {
                    buttonClass = "bg-green-600 animate-pulse"; // Correcta siempre en verde
                  } else if (option === selectedAnswer) {
                    buttonClass = "bg-red-600"; // La seleccionada incorrecta en rojo
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

