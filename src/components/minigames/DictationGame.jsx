// src/components/minigames/DictationGame.jsx
// Dictado (comprensión auditiva): suena el audio de una palabra y hay que
// elegir el carácter correcto entre 4. Entrena la destreza inversa a los
// demás juegos — reconocer de oído, no de vista.
import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, Volume2 } from "lucide-react";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from "react-i18next";
import { J } from '@/styles/tokens';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import { shuffle as shuffleArray } from '@/utils/arrayUtils.js';
import { shouldShowIntro } from '@/utils/gameIntroPrefs.js';
import { useGamePhase } from '@/utils/useGamePhase.js';
import { useKeyAnswers } from '@/utils/useKeyAnswers.js';
import GameIntro from './GameIntro.jsx';
import GameResults from './GameResults.jsx';

const TOTAL_ROUNDS = 10;

export default function DictationGame({ goBack, characters = [], speak, onTrackResult }) {
  const { t } = useTranslation();
  // autoSkip:false → la intro se salta desde el efecto de abajo, que llama a
  // startGame() (genera la primera ronda además de cambiar de fase).
  const { isIntro, isFinished, start, finish } = useGamePhase('dictation-game', { autoSkip: false });
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
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
    if (!q) { finish(); return; }
    setQuestion(q);
    setFeedback(null);
    setSelected(null);
    // Reproducir el audio al entrar en la ronda (pequeño delay para que
    // el cambio de pantalla no se coma el inicio del sonido).
    setTimeout(() => playAudio(q.correct), 350);
  }, [generateQuestion, playAudio, finish]);

  const startGame = useCallback(() => {
    setScore(0);
    setWrongCount(0);
    setRound(1);
    start();
    nextRound();
  }, [nextRound, start]);

  // Saltar la explicación si el usuario marcó "no volver a mostrar"
  useEffect(() => {
    if (!shouldShowIntro('dictation-game')) startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (option) => {
    if (feedback) return;
    setSelected(option.char);
    const isCorrect = option.char === question.correct.char;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
      hapticSuccess();
    } else {
      setWrongCount(w => w + 1);
      setFeedback('incorrect');
      hapticError();
    }
    onTrackResult?.(question.correct, isCorrect);

    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        finish();
      } else {
        setRound(r => r + 1);
        nextRound();
      }
    }, 1100);
  };

  // Accesibilidad: teclas 1-4 eligen el carácter (avanza solo, sin Enter).
  useKeyAnswers({
    count: question?.options.length || 0,
    onSelect: !isIntro && !isFinished && question && !feedback
      ? (i) => handleAnswer(question.options[i]) : null,
  });

  // Cancela cualquier timeout de audio pendiente al desmontar.
  useEffect(() => () => { speakingRef.current = true; }, []);

  // ── Pantalla de explicación ─────────────────────────────────────────
  if (isIntro) {
    return (
      <GameIntro
        gameId="dictation-game"
        cn="听"
        title={t('minigames_dictation_title', 'Dictado')}
        subtitle={t('minigames_dictation_subtitle', 'Escucha y elige el carácter correcto')}
        steps={[
          t('minigames_dictation_instructions_1', 'Escucharás la pronunciación de una palabra en chino.'),
          t('minigames_dictation_instructions_2', 'Elige entre 4 opciones el carácter que corresponde al sonido.'),
          t('minigames_dictation_instructions_3', 'Puedes repetir el audio tantas veces como quieras con el botón 🔊.'),
          t('minigames_dictation_instructions_4', 'Son 10 rondas. ¡Afina el oído con los tonos!'),
        ]}
        onStart={startGame}
        onBack={goBack}
      />
    );
  }

  // ── Pantalla final ──────────────────────────────────────────────────
  if (isFinished) {
    const pct = Math.round((score / TOTAL_ROUNDS) * 100);
    return (
      <GameResults
        gameId="dictation-game"
        title={pct >= 70
          ? t('minigames_dictation_good_ear', '¡Buen oído!')
          : t('minigames_dictation_keep_training', 'Sigue entrenando el oído')}
        subtitle={t('minigames_dictation_title', 'Dictado')}
        correct={score}
        wrong={wrongCount}
        onPlayAgain={startGame}
        onBack={goBack}
      />
    );
  }

  // ── Pantalla de juego ───────────────────────────────────────────────
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

        {/* HUD */}
        <div className="mb-6 flex justify-between items-center font-bold text-xl" style={{ color: J.ink }}>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span style={{ color: J.jade }}>★ {score}</span>
            <span style={{ color: J.red }}>✕ {wrongCount}</span>
          </div>
          <div className="text-base font-semibold" style={{ color: J.inkSoft }}>{round} / {TOTAL_ROUNDS}</div>
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
                background: J.jade, color: J.butter,
                border: 0, cursor: 'pointer',
                boxShadow: '0 8px 24px -8px rgba(31,74,51,0.55)',
              }}
            >
              <Volume2 size={56} />
            </button>
            <p className="text-sm mb-6 -mt-4" style={{ color: J.mute }}>
              {t('minigames_dictation_tap_to_replay', 'Toca para volver a escuchar')}
            </p>

            {/* Opciones: 4 caracteres grandes */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
              {question.options.map((opt) => {
                let bg = J.paperHi, border = J.hair, color = J.ink, animCls = '';
                if (feedback) {
                  if (opt.char === question.correct.char) {
                    bg = J.jadeBg; border = J.jade; color = J.jadeDeep; animCls = 'j-pop';
                  } else if (opt.char === selected) {
                    bg = J.redBg; border = J.red; color = J.redDeep; animCls = 'j-shake';
                  } else {
                    color = J.mute2;
                  }
                }
                return (
                  <button
                    key={opt.char}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!feedback}
                    className={`h-28 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${animCls}`}
                    style={{
                      background: bg, border: `2px solid ${border}`, color,
                      cursor: feedback ? 'default' : 'pointer',
                    }}
                  >
                    <span className="font-cn text-4xl font-bold">{opt.char}</span>
                    {/* Al resolver, muestra el pinyin como feedback didáctico */}
                    {feedback && <span className="text-xs opacity-80">{opt.pinyin}</span>}
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
