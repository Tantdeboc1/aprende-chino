// src/components/minigames/ToneEar.jsx
// Tonos al oído (comprensión auditiva): suena una sílaba y hay que identificar
// su TONO (1-4), no el carácter. Entrena justo lo que más cuesta en chino:
// distinguir los tonos de oído. Hermano del Dictado, pero un nivel más
// abstracto — aquí el carácter es secundario; lo que importa es la melodía.
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

// Los 4 tonos del mandarín: número, marca diacrítica y nombre chino. El campo
// `name` se traduce vía i18n; el símbolo y el hanzi son universales.
const TONES = [
  { tone: 1, mark: 'ˉ', zh: '一声', key: 'tone_first',  def: '1er tono' },
  { tone: 2, mark: 'ˊ', zh: '二声', key: 'tone_second', def: '2º tono' },
  { tone: 3, mark: 'ˇ', zh: '三声', key: 'tone_third',  def: '3er tono' },
  { tone: 4, mark: 'ˋ', zh: '四声', key: 'tone_fourth', def: '4º tono' },
];

// Solo sílabas únicas con tono claro 1-4: el carácter debe ser monosílabo
// (pinyin numérico sin espacios) para que "el tono" no sea ambiguo, y dejamos
// fuera el tono neutro (0).
function isSingleToned(c) {
  const pn = String(c?.pinyinNumeric || '').trim();
  return pn.length > 0 && !/\s/.test(pn) && c.tone >= 1 && c.tone <= 4;
}

export default function ToneEar({ goBack, characters = [], speak, onTrackResult }) {
  const { t } = useTranslation();
  // autoSkip:false → la intro se salta desde el efecto de abajo, que llama a
  // startGame() (genera la primera ronda además de cambiar de fase).
  const { isIntro, isFinished, start, finish } = useGamePhase('tones-ear', { autoSkip: false });
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [question, setQuestion] = useState(null);   // { char }
  const [feedback, setFeedback] = useState(null);    // 'correct' | 'incorrect' | null
  const [selected, setSelected] = useState(null);    // tono elegido
  const speakingRef = useRef(false);

  const playAudio = useCallback(async (charObj) => {
    if (!charObj || speakingRef.current) return;
    speakingRef.current = true;
    try {
      await speak?.({ pinyin: charObj.pinyinNumeric, hanzi: charObj.char });
    } finally {
      speakingRef.current = false;
    }
  }, [speak]);

  const generateQuestion = useCallback(() => {
    const pool = characters.filter(isSingleToned);
    if (pool.length === 0) return null;
    return { char: shuffleArray(pool)[0] };
  }, [characters]);

  const nextRound = useCallback(() => {
    const q = generateQuestion();
    if (!q) { finish(); return; }
    setQuestion(q);
    setFeedback(null);
    setSelected(null);
    setTimeout(() => playAudio(q.char), 350);
  }, [generateQuestion, playAudio, finish]);

  const startGame = useCallback(() => {
    setScore(0);
    setWrongCount(0);
    setRound(1);
    start();
    nextRound();
  }, [nextRound, start]);

  useEffect(() => {
    if (!shouldShowIntro('tones-ear')) startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (toneOpt) => {
    if (feedback) return;
    setSelected(toneOpt.tone);
    const isCorrect = toneOpt.tone === question.char.tone;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
      hapticSuccess();
    } else {
      setWrongCount(w => w + 1);
      setFeedback('incorrect');
      hapticError();
    }
    onTrackResult?.(question.char, isCorrect);

    setTimeout(() => {
      if (round >= TOTAL_ROUNDS) {
        finish();
      } else {
        setRound(r => r + 1);
        nextRound();
      }
    }, 1200);
  };

  // Accesibilidad: teclas 1-4 = tono 1..4 (avanza solo, sin Enter).
  useKeyAnswers({
    count: TONES.length,
    onSelect: !isIntro && !isFinished && question && !feedback
      ? (i) => handleAnswer(TONES[i]) : null,
  });

  // Cancela cualquier audio pendiente al desmontar.
  useEffect(() => () => { speakingRef.current = true; }, []);

  // ── Pantalla de explicación ─────────────────────────────────────────
  if (isIntro) {
    return (
      <GameIntro
        gameId="tones-ear"
        cn="听"
        title={t('tones_ear_title', 'Tonos al oído')}
        subtitle={t('tones_ear_subtitle', 'Escucha y reconoce el tono')}
        steps={[
          t('tones_ear_instructions_1', 'Escucharás una sílaba en chino.'),
          t('tones_ear_instructions_2', 'Elige cuál de los 4 tonos has oído (1.º ˉ, 2.º ˊ, 3.º ˇ, 4.º ˋ).'),
          t('tones_ear_instructions_3', 'Puedes repetir el audio las veces que quieras con el botón 🔊.'),
          t('tones_ear_instructions_4', 'Son 10 rondas. ¡Afina el oído para los tonos!'),
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
        gameId="tones-ear"
        title={pct >= 70
          ? t('tones_ear_good_ear', '¡Oído fino!')
          : t('tones_ear_keep_training', 'Sigue entrenando los tonos')}
        subtitle={t('tones_ear_title', 'Tonos al oído')}
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
            {/* Botón grande de audio — protagonista de la pantalla */}
            <button
              onClick={() => playAudio(question.char)}
              aria-label={t('tones_ear_replay', 'Repetir audio')}
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
              {t('tones_ear_which_tone', '¿Qué tono has oído?')}
            </p>

            {/* Opciones: los 4 tonos */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto">
              {TONES.map((opt) => {
                let bg = J.paperHi, border = J.hair, color = J.ink, pulse = '';
                if (feedback) {
                  if (opt.tone === question.char.tone) {
                    bg = J.jadeBg; border = J.jade; color = J.jadeDeep; pulse = 'animate-pulse';
                  } else if (opt.tone === selected) {
                    bg = J.redBg; border = J.red; color = J.redDeep;
                  } else {
                    color = J.mute2;
                  }
                }
                return (
                  <button
                    key={opt.tone}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!feedback}
                    className={`h-28 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${pulse}`}
                    style={{
                      background: bg, border: `2px solid ${border}`, color,
                      cursor: feedback ? 'default' : 'pointer',
                    }}
                  >
                    <span className="text-4xl font-bold leading-none">{opt.tone}<span className="text-2xl ml-0.5 align-top">{opt.mark}</span></span>
                    <span className="font-cn text-sm opacity-80">{opt.zh}</span>
                  </button>
                );
              })}
            </div>

            {/* Al resolver, muestra el carácter y su pinyin como refuerzo */}
            {feedback && (
              <div className="mt-6 flex items-center justify-center gap-3" style={{ color: J.inkSoft }}>
                <span className="font-cn text-3xl font-bold" style={{ color: J.ink }}>{question.char.char}</span>
                <span className="text-lg">{question.char.pinyin}</span>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
