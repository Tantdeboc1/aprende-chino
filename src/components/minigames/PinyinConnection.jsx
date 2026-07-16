import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";
import { J } from '@/styles/tokens';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import { shuffle as shuffleArray } from '@/utils/arrayUtils.js';
import { shouldShowIntro } from '@/utils/gameIntroPrefs.js';
import { useGamePhase } from '@/utils/useGamePhase.js';
import { useCountdown } from '@/utils/useCountdown.js';
import { useKeyAnswers } from '@/utils/useKeyAnswers.js';
import GameIntro from './GameIntro.jsx';
import GameResults from './GameResults.jsx';

// --- Componente Principal ---
export default function PinyinConnection({ goBack, characters = [], onTrackResult }) {
  const { t } = useTranslation();
  // autoSkip:false → la intro se salta desde el efecto de abajo, que llama a
  // startGame() (genera la primera pregunta además de cambiar de fase).
  const { isIntro, isPlaying, isFinished, start, finish } = useGamePhase('pinyin-connection', { autoSkip: false });
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  // Cuenta atrás compartida: interval estable, espejo en ref y fin de partida
  // al llegar a 0 (por tick o por penalización). Ver useCountdown.js.
  const { timeLeft, timeLeftRef, reset: resetClock, penalize } =
    useCountdown(60, { running: isPlaying, onExpire: finish });
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Generar una nueva pregunta
  const generateQuestion = useCallback(() => {
    if (characters.length < 4) return;

    const shuffled = shuffleArray(characters);
    const correctChar = shuffled[0];
    const options = shuffled.slice(1, 4).map(c => c.pinyin);
    options.push(correctChar.pinyin);

    setCurrentQuestion({
      character: correctChar.char,
      correctPinyin: correctChar.pinyin,
      charObj: correctChar,
      options: shuffleArray(options),
    });
    setFeedback(null);
    setSelectedAnswer(null);
  }, [characters]);

  // Iniciar el juego
  const startGame = useCallback(() => {
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    resetClock();
    start();
    generateQuestion();
  }, [generateQuestion, start, resetClock]);

  // Saltar la explicación si el usuario marcó "no volver a mostrar"
  useEffect(() => {
    if (!shouldShowIntro('pinyin-connection')) startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manejar respuesta
  const handleAnswer = (selectedPinyin) => {
    if (feedback) return;

    setSelectedAnswer(selectedPinyin);

    const isCorrect = selectedPinyin === currentQuestion.correctPinyin;
    if (isCorrect) {
      setScore(s => s + 10);
      setCorrectCount(c => c + 1);
      setFeedback('correct');
      hapticSuccess();
    } else {
      penalize(2);
      setWrongCount(w => w + 1);
      setFeedback('incorrect');
      hapticError();
    }
    onTrackResult?.(currentQuestion.charObj, isCorrect);

    const capturedTime = timeLeftRef.current;
    setTimeout(() => {
      if (capturedTime > 0) {
        generateQuestion();
      }
    }, 800);
  };

  // Accesibilidad: teclas 1-4 responden (avanza solo, sin Enter).
  useKeyAnswers({
    count: currentQuestion?.options.length || 0,
    onSelect: isPlaying && currentQuestion && !feedback
      ? (i) => handleAnswer(currentQuestion.options[i]) : null,
  });

  // --- Renderizado ---

  if (isIntro) {
    return (
      <GameIntro
        gameId="pinyin-connection"
        cn="音"
        title={t('minigames_pinyin_connection_title')}
        subtitle={t('minigames_pinyin_connection_subtitle')}
        steps={[
          t('minigames_pinyin_connection_instructions_1'),
          t('minigames_pinyin_connection_instructions_2'),
          t('minigames_pinyin_connection_instructions_3'),
          t('minigames_pinyin_connection_instructions_4'),
        ]}
        onStart={startGame}
        onBack={goBack}
      />
    );
  }

  if (isFinished) {
    return (
      <GameResults
        gameId="pinyin-connection"
        title={t('minigames_time_up_message')}
        subtitle={t('minigames_pinyin_connection_title')}
        correct={correctCount}
        wrong={wrongCount}
        score={score}
        onPlayAgain={startGame}
        onBack={goBack}
      />
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ background: J.paper }}>
      <Container>
        <div className="mb-6">
          <button onClick={goBack} className="flex items-center transition-colors"
            style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer' }}>
            <ArrowLeft className="mr-2" />
            {t('minigames_back_to_minigames')}
          </button>
        </div>
        <div className="mb-6 flex justify-between items-center font-bold text-xl" style={{ color: J.ink }}>
          <div>{t('minigames_score_label_hud')} <span style={{ color: J.sand }}>{score}</span></div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span style={{ color: J.jade }}>★ {correctCount}</span>
            <span style={{ color: J.red }}>✕ {wrongCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={20}/>
            <span>{timeLeft}</span>
          </div>
        </div>

        {currentQuestion && (
          <div className="text-center">
            <div className="rounded-2xl w-full max-w-md mx-auto h-48 flex items-center justify-center mb-8"
              style={{ background: J.paperHi, border: `2px solid ${J.hair}` }}>
              <span className="text-8xl font-bold font-cn" style={{ color: J.ink }}>{currentQuestion.character}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              {currentQuestion.options.map((option, i) => {
                let bg = J.paperHi, border = J.hair, color = J.ink, animCls = '';
                if (feedback) {
                  if (option === currentQuestion.correctPinyin) {
                    bg = J.jadeBg; border = J.jade; color = J.jadeDeep; animCls = 'j-pop';
                  } else if (option === selectedAnswer) {
                    bg = J.redBg; border = J.red; color = J.redDeep; animCls = 'j-shake';
                  } else {
                    color = J.mute2;
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    disabled={!!feedback}
                    className={`p-3 rounded-xl font-semibold text-lg transition-colors h-24 flex items-center justify-center text-center leading-tight ${animCls}`}
                    style={{
                      background: bg, border: `2px solid ${border}`, color,
                      cursor: feedback ? 'default' : 'pointer',
                    }}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
