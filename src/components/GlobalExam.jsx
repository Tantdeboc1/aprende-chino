// src/components/GlobalExam.jsx
// Modo examen cronometrado global — mezcla todas las lecciones HSK1
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ConfettiCelebration from '@/components/ui/ConfettiCelebration.jsx';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN(arr, n) {
  return shuffle([...arr]).slice(0, n);
}

function buildQuestion(pool) {
  if (pool.length < 4) return null;
  const sh = shuffle(pool);
  const correct = sh[0];
  const distractors = sh.slice(1, 4).map(c => c.meaning);
  const options = shuffle([correct.meaning, ...distractors]);
  return { correct, options };
}

const TOTAL_TIME = 90; // segundos
const QUESTIONS_PER_ROUND = 20;

export default function GlobalExam({ goBack, allCharacters, onProgressChange, progress }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState('ready'); // 'ready' | 'playing' | 'finished'
  const [questions, setQuestions]   = useState([]);
  const [qIndex, setQIndex]         = useState(0);
  const [score, setScore]           = useState(0);
  const [wrong, setWrong]           = useState(0);
  const [timeLeft, setTimeLeft]     = useState(TOTAL_TIME);
  const timeRef                     = useRef(TOTAL_TIME);
  const [selected, setSelected]     = useState(null);
  const [feedback, setFeedback]     = useState(null); // null | 'correct' | 'incorrect'
  const [showConfetti, setShowConfetti] = useState(false);

  const pool = allCharacters.filter(c => !c.isSupplementary);

  const startGame = useCallback(() => {
    const qs = [];
    for (let i = 0; i < QUESTIONS_PER_ROUND; i++) {
      const q = buildQuestion(pool);
      if (q) qs.push(q);
    }
    setQuestions(qs);
    setQIndex(0);
    setScore(0);
    setWrong(0);
    setTimeLeft(TOTAL_TIME);
    timeRef.current = TOTAL_TIME;
    setSelected(null);
    setFeedback(null);
    setPhase('playing');
  }, [pool]);

  // Temporizador
  useEffect(() => {
    if (phase !== 'playing') return;
    if (timeLeft <= 0) { setPhase('finished'); return; }

    const id = setInterval(() => {
      setTimeLeft(t => {
        const next = t - 1;
        timeRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, timeLeft]);

  const handleAnswer = (opt) => {
    if (feedback) return;
    setSelected(opt);
    const isCorrect = opt === questions[qIndex].correct.meaning;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);
    else setWrong(w => w + 1);

    const capturedTime = timeRef.current;
    setTimeout(() => {
      if (capturedTime <= 0) return;
      const nextIdx = qIndex + 1;
      if (nextIdx >= questions.length) {
        setPhase('finished');
      } else {
        setQIndex(nextIdx);
        setSelected(null);
        setFeedback(null);
      }
    }, 700);
  };

  // Pantalla de bienvenida
  if (phase === 'ready') {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-lg mx-auto pt-8">
          <button onClick={goBack} className="flex items-center text-gray-400 hover:text-white text-sm mb-6 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5"><path d="M15 18l-6-6 6-6"/></svg>
            Volver
          </button>

          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold text-white mb-2">Examen HSK 1</h1>
            <p className="text-gray-400">Modo examen cronometrado — todas las lecciones</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
              <p className="text-gray-300 text-sm">{QUESTIONS_PER_ROUND} preguntas de vocabulario mezclando las {pool.length} palabras HSK1.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
              <p className="text-gray-300 text-sm">Tienes <strong className="text-white">{TOTAL_TIME} segundos</strong> para responder todas las preguntas.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
              <p className="text-gray-300 text-sm">Se muestra el carácter chino — elige el significado correcto.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
              <p className="text-gray-300 text-sm">Objetivo: <strong className="text-white">&gt;80%</strong> de aciertos para nivel HSK1.</p>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold py-4 rounded-xl text-lg transition-colors"
          >
            🏁 Iniciar examen
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de resultados
  if (phase === 'finished') {
    const total = score + wrong;
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const passed = pct >= 80;
    return (
      <>
        {passed && <ConfettiCelebration />}
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
            <div className="text-6xl mb-4">{pct === 100 ? '🥇' : passed ? '🏆' : '💪'}</div>
            <h2 className="text-2xl font-bold text-white mb-1">Examen completado</h2>
            <p className="text-gray-400 text-sm mb-6">
              {passed ? '¡Nivel HSK1 alcanzado!' : 'Sigue practicando para alcanzar el HSK1'}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-700/50 rounded-xl p-3">
                <p className="text-2xl font-bold text-green-400">{score}</p>
                <p className="text-xs text-gray-400 mt-0.5">Correctas</p>
              </div>
              <div className="bg-gray-700/50 rounded-xl p-3">
                <p className="text-2xl font-bold text-red-400">{wrong}</p>
                <p className="text-xs text-gray-400 mt-0.5">Errores</p>
              </div>
              <div className={`rounded-xl p-3 ${passed ? 'bg-green-900/40' : 'bg-gray-700/50'}`}>
                <p className={`text-2xl font-bold ${passed ? 'text-yellow-400' : 'text-white'}`}>{pct}%</p>
                <p className="text-xs text-gray-400 mt-0.5">Acierto</p>
              </div>
            </div>

            {/* Barra de resultado */}
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all duration-700 ${passed ? 'bg-green-500' : 'bg-yellow-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-6">
              <span>0%</span>
              <span className={passed ? 'text-green-400' : 'text-gray-400'}>80% mínimo</span>
              <span>100%</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold text-sm transition-colors"
              >
                🔄 Repetir
              </button>
              <button
                onClick={goBack}
                className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium text-sm transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Juego
  const question = questions[qIndex];
  if (!question) return null;
  const progressPct = ((qIndex) / questions.length) * 100;
  const timePct = (timeLeft / TOTAL_TIME) * 100;
  const timeColor = timeLeft > 30 ? 'bg-green-500' : timeLeft > 15 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-lg mx-auto">
        {/* HUD */}
        <div className="flex items-center justify-between mb-3 pt-4">
          <button onClick={goBack} className="text-gray-500 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span className="text-green-400">✓ {score}</span>
            <span className="text-gray-500">{qIndex + 1}/{questions.length}</span>
            <span className="text-red-400">✗ {wrong}</span>
          </div>
          <div className={`text-lg font-bold ${timeLeft <= 15 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
            {timeLeft}s
          </div>
        </div>

        {/* Barra de tiempo */}
        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-1">
          <div className={`h-full ${timeColor} rounded-full transition-all duration-1000`} style={{ width: `${timePct}%` }} />
        </div>

        {/* Barra de pregunta */}
        <div className="h-1 bg-gray-700/50 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-yellow-500/60 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>

        {/* Carácter */}
        <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl flex items-center justify-center mb-6" style={{ height: '180px' }}>
          <div className="text-center">
            <div className="text-8xl font-bold text-white mb-1">{question.correct.char}</div>
            <div className="text-gray-400 text-base">{question.correct.pinyin}</div>
          </div>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-2 gap-3">
          {question.options.map((opt, i) => {
            let cls = 'bg-gray-700 hover:bg-gray-600 text-white';
            if (feedback) {
              if (opt === question.correct.meaning)   cls = 'bg-green-600 text-white';
              else if (opt === selected)              cls = 'bg-red-600 text-white';
              else                                   cls = 'bg-gray-700 text-gray-500';
            }
            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={!!feedback}
                className={`p-4 rounded-xl font-medium text-sm transition-colors h-16 flex items-center justify-center text-center leading-tight ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
