// src/components/minigames/DictationGame.jsx
// Dictado (comprensión auditiva): suena el audio de una palabra y hay que
// elegir el carácter correcto entre 4. Entrena la destreza inversa a los
// demás juegos — reconocer de oído, no de vista.
import ConfettiCelebration from "@/components/ui/ConfettiCelebration.jsx";
import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, RefreshCw, Volume2 } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import Button from "@/components/ui/Button.jsx";
import { useTranslation } from "react-i18next";
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import { shuffle as shuffleArray } from '@/utils/arrayUtils.js';

const TOTAL_ROUNDS = 10;

export default function DictationGame({ goBack, characters = [], speak, onTrackResult }) {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState('ready'); // 'ready' | 'playing' | 'finished'
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState(null);      // 'correct' | 'incorrect' | null
  const [selected, setSelected] = useState(null);
  // Evita doble audio si el usuario pulsa replay mientras suena.
  const speakingRef = useRef(false);

  const playAudio = useCallback(async (charObj) => {
    if (!charObj || speakingRef.current) return;
    speakingRef.current = true;
    try {
      // Pasamos pinyin numérico + hanzi: tts-enhanced intenta el mp3 y cae
      // a TTS del navegador si no existe.
      await speak?.({ pinyin: charObj.pinyinNumeric, hanzi: charObj.char });
    } finally {
      speakingRef.current = false;
    }
  }, [speak]);

  const generateQuestion = useCallback(() => {
    if (characters.length < 4) return null;
    const shuffled = shuffleArray(characters);
    const correct = shuffled[0];
    // Distractores con carácter distinto (y a poder ser pinyin distinto,
    // para que no haya dos opciones que suenen igual).
    const distractors = [];
    const seenChars = new Set([correct.char]);
    const seenSounds = new Set([correct.pinyinNumeric]);
    for (const c of shuffled.slice(1)) {
      if (seenChars.has(c.char) || seenSounds.has(c.pinyinNumeric)) continue;
      seenChars.add(c.char);
      seenSounds.add(c.pinyinNumeric);
      distractors.push(c);
      if (distractors.length === 3) break;
    }
    if (distractors.length < 3) return null;
    return {
      correct,
      options: shuffleArray([correct, ...distractors]),
    };
  }, [characters]);

  const nextRound = useCallback(() => {
    const q = generateQuestion();
    if (!q) { setGameState('finished'); return; }
    setQuestion(q);
    setFeedback(null);
    setSelected(null);
    // Reproducir el audio al entrar en la ronda (pequeño delay para que
    // el cambio de pantalla no se coma el inicio del sonido).
    setTimeout(() => playAudio(q.correct), 350);
  }, [generateQuestion, playAudio]);

  const startGame = () => {
    setScore(0);
    setRound(1);
    setGameState('playing');
    nextRound();
  };

  const handleAnswer = (option) => {
    if (feedback) return;
    setSelected(option.char);
    const isCorrect = option.char === question.correct.char;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
      hapticSuccess();
    } else {
      setFeedback('incorrect');
      hapticError();
    }
    onTrackResult?.(question.correct, isCorrect);

    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        setGameState('finished');
      } else {
        setRound(r => r + 1);
        nextRound();
      }
    }, 1100);
  };

  // Cancela cualquier timeout de audio pendiente al desmontar.
  useEffect(() => () => { speakingRef.current = true; }, []);

  // ── Pantalla de inicio ──────────────────────────────────────────────
  if (gameState === 'ready') {
    return (
      <div className="min-h-screen bg-[#f4ecdc] p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button onClick={goBack} className="flex items-center text-[#5b5446] hover:text-[#1c1813] transition mb-4">
              <ArrowLeft className="mr-2" />
              {t('minigames_back_to_minigames')}
            </button>
            <h1 className="text-3xl font-bold text-[#1c1813] text-center">
              {t('minigames_dictation_title', 'Dictado')}
            </h1>
            <p className="text-[#928a76] text-center">
              {t('minigames_dictation_subtitle', 'Escucha y elige el carácter correcto')}
            </p>
          </div>
          <div className="bg-[#fbf5e6] rounded-xl p-6 border border-[rgba(28,24,19,0.10)] mb-6">
            <h2 className="text-xl font-bold text-[#1c1813] mb-4">{t('quiz_instructions_title')}</h2>
            <div className="space-y-3 text-[#5b5446]">
              <div className="flex items-start">
                <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p>{t('minigames_dictation_instructions_1', 'Escucharás la pronunciación de una palabra en chino.')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p>{t('minigames_dictation_instructions_2', 'Elige entre 4 opciones el carácter que corresponde al sonido.')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p>{t('minigames_dictation_instructions_3', 'Puedes repetir el audio tantas veces como quieras con el botón 🔊.')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>{t('minigames_dictation_instructions_4', 'Son 10 rondas. ¡Afina el oído con los tonos!')}</p>
              </div>
            </div>
          </div>
          <button onClick={startGame} className="w-full bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-bold py-4 px-6 rounded-xl transition text-lg">
            {t('minigames_start_game_button')}
          </button>
        </div>
      </div>
    );
  }

  // ── Pantalla final ──────────────────────────────────────────────────
  if (gameState === 'finished') {
    const pct = Math.round((score / TOTAL_ROUNDS) * 100);
    return (
      <>
        {pct >= 70 && <ConfettiCelebration />}
        <div className="min-h-screen bg-[#f4ecdc] p-4 flex items-center justify-center">
          <Container>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-[#b88a3e] mb-4">
                {pct >= 70
                  ? t('minigames_dictation_good_ear', '¡Buen oído!')
                  : t('minigames_dictation_keep_training', 'Sigue entrenando el oído')}
              </h2>
              <p className="text-xl text-[#5b5446] mb-2">{t('minigames_final_score_message')}</p>
              <p className="text-6xl font-bold text-[#1c1813] mb-8">{score} / {TOTAL_ROUNDS}</p>
              <div className="flex justify-center gap-4">
                <Button onClick={startGame} variant="action">
                  <RefreshCw className="inline-block mr-2"/> {t('minigames_play_again_button')}
                </Button>
                <button onClick={goBack} className="bg-[#f8f1de] hover:bg-[#bdb39a] text-[#1c1813] font-semibold py-3 px-6 rounded-lg transition flex items-center gap-2">
                  <ArrowLeft size={18}/> {t('radicals_back_button')}
                </button>
              </div>
            </div>
          </Container>
        </div>
      </>
    );
  }

  // ── Pantalla de juego ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4ecdc] p-4">
      <Container>
        <div className="mb-6">
          <button onClick={goBack} className="flex items-center text-[#5b5446] hover:text-[#1c1813]">
            <ArrowLeft className="mr-2" />
            {t('minigames_back_to_minigames')}
          </button>
        </div>

        {/* HUD */}
        <div className="mb-6 flex justify-between items-center text-[#1c1813] font-bold text-xl">
          <div>{t('minigames_score_label_hud')} <span className="text-[#b88a3e]">{score}</span></div>
          <div className="text-[#5b5446] text-base font-semibold">{round} / {TOTAL_ROUNDS}</div>
        </div>

        {question && (
          <div className="text-center">
            {/* Botón grande de audio — el protagonista de la pantalla */}
            <button
              onClick={() => playAudio(question.correct)}
              aria-label={t('minigames_dictation_replay', 'Repetir audio')}
              className="mx-auto mb-8 flex items-center justify-center rounded-full transition active:scale-95"
              style={{
                width: 130, height: 130,
                background: '#2f6b4a', color: '#f0c862',
                border: 0, cursor: 'pointer',
                boxShadow: '0 8px 24px -8px rgba(31,74,51,0.55)',
              }}
            >
              <Volume2 size={56} />
            </button>
            <p className="text-[#928a76] text-sm mb-6 -mt-4">
              {t('minigames_dictation_tap_to_replay', 'Toca para volver a escuchar')}
            </p>

            {/* Opciones: 4 caracteres grandes */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
              {question.options.map((opt) => {
                let cls = "bg-[#f8f1de] hover:bg-[#bdb39a]";
                if (feedback) {
                  if (opt.char === question.correct.char) cls = "bg-[#2f6b4a] text-[#fbf5e6] animate-pulse";
                  else if (opt.char === selected) cls = "bg-[#c8392f] text-[#fbf5e6]";
                }
                return (
                  <Button
                    key={opt.char}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!feedback}
                    className={`h-28 flex flex-col items-center justify-center gap-1 ${cls}`}
                  >
                    <span className="font-cn text-4xl font-bold">{opt.char}</span>
                    {/* Al resolver, muestra el pinyin como feedback didáctico */}
                    {feedback && <span className="text-xs opacity-80">{opt.pinyin}</span>}
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
