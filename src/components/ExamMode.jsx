// src/components/ExamMode.jsx
import { useState, useMemo, useCallback } from 'react';
import { saveExamResult, getExamHistory } from '@/utils/progress.js';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy, BookOpen, Clock } from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────────────

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(characters) {
  const pool = characters.filter(c => c.char && c.meaning);
  if (pool.length < 4) return [];
  const ordered = shuffle(pool);
  return ordered.map(correct => {
    const wrong = shuffle(pool.filter(c => c.char !== correct.char)).slice(0, 3);
    const options = shuffle([correct, ...wrong]);
    return { correct, options };
  });
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function gradeColor(pct) {
  if (pct >= 90) return 'text-green-400';
  if (pct >= 70) return 'text-yellow-400';
  return 'text-red-400';
}

function gradeLabel(pct) {
  if (pct === 100) return '¡Perfecto! 🏆';
  if (pct >= 90) return '¡Excelente! ⭐';
  if (pct >= 70) return '¡Bien! 👍';
  if (pct >= 50) return 'Puedes mejorar 📚';
  return 'Sigue practicando 💪';
}

// ── Pantalla de historial ────────────────────────────────────────────────────

function HistoryScreen({ history, lessonNum, onBack, onNewExam }) {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al hub
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">Historial — Lección {lessonNum}</h1>
        </div>

        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Aún no has hecho ningún examen de esta lección.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {history.map((h, i) => {
              const pct = Math.round((h.score / h.total) * 100);
              return (
                <div key={i} className="bg-gray-800 rounded-xl px-5 py-4 flex items-center justify-between border border-gray-700">
                  <div>
                    <p className="text-white font-semibold">
                      {h.score}/{h.total} correctas
                      <span className={`ml-2 text-sm font-bold ${gradeColor(pct)}`}>({pct}%)</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(h.date)}</p>
                    {h.wrongChars?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        Falladas: {h.wrongChars.join('  ')}
                      </p>
                    )}
                  </div>
                  <div className={`text-2xl font-bold ${gradeColor(pct)}`}>{pct}%</div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onNewExam}
          className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors"
        >
          Hacer examen ahora →
        </button>
      </div>
    </div>
  );
}

// ── Pantalla de resultados ───────────────────────────────────────────────────

function ResultsScreen({ score, total, wrongChars, onRetry, onBack }) {
  const pct = Math.round((score / total) * 100);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Puntuación */}
        <div className="text-center py-10">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${gradeColor(pct)}`} />
          <p className={`text-6xl font-bold mb-2 ${gradeColor(pct)}`}>{pct}%</p>
          <p className="text-gray-300 text-lg mb-1">{score} de {total} correctas</p>
          <p className="text-gray-400 font-semibold">{gradeLabel(pct)}</p>
        </div>

        {/* Repaso de errores */}
        {wrongChars.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              Palabras a repasar ({wrongChars.length})
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {wrongChars.map((w, i) => (
                <div key={i} className="bg-gray-800 border border-red-900 rounded-xl p-3 text-center">
                  <div className="text-3xl text-white mb-1">{w.char}</div>
                  <div className="text-sm text-gray-400">{w.pinyin}</div>
                  <div className="text-xs text-red-300 font-semibold mt-1">{w.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {wrongChars.length === 0 && (
          <div className="bg-green-900/40 border border-green-700 rounded-xl p-5 mb-8 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-300 font-semibold">¡Sin errores! Todas las palabras correctas.</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Repetir examen
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors"
          >
            Volver al hub
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ExamMode ────────────────────────────────────────────

export default function ExamMode({
  characters,       // palabras de la lección (sin suplementarias)
  lessonNum,
  lessonData,       // { titleEs, ... }
  progress,
  onProgressChange,
  goBack,           // vuelve al hub
}) {
  const [phase, setPhase] = useState('exam'); // 'exam' | 'results' | 'history'
  const [questions, setQuestions] = useState(() => buildQuestions(characters));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);     // char del option elegido
  const [feedback, setFeedback] = useState(null);     // 'correct' | 'wrong'
  const [wrongChars, setWrongChars] = useState([]);   // objetos completos { char, pinyin, meaning }
  const [score, setScore] = useState(0);

  const history = getExamHistory(progress, lessonNum);
  const total = questions.length;
  const current = questions[qIndex];

  // Reiniciar examen
  const restart = useCallback(() => {
    setQuestions(buildQuestions(characters));
    setQIndex(0);
    setSelected(null);
    setFeedback(null);
    setWrongChars([]);
    setScore(0);
    setPhase('exam');
  }, [characters]);

  const handleSelect = (option) => {
    if (feedback) return; // ya respondió, esperar animación
    setSelected(option.char);
    const isCorrect = option.char === current.correct.char;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    // Calcular nuevos valores ANTES del timeout para evitar closures obsoletas
    const newScore = isCorrect ? score + 1 : score;
    const newWrong = isCorrect ? wrongChars : [...wrongChars, current.correct];

    setTimeout(() => {
      if (qIndex + 1 < total) {
        // Avanzar a la siguiente pregunta
        setScore(newScore);
        setWrongChars(newWrong);
        setQIndex(qIndex + 1);
        setSelected(null);
        setFeedback(null);
      } else {
        // Fin del examen — guardar historial con chars como strings (para display compacto)
        const updated = saveExamResult(progress, lessonNum, {
          score: newScore,
          total,
          wrongChars: newWrong.map(c => c.char),
        });
        onProgressChange(updated);
        setScore(newScore);
        setWrongChars(newWrong);
        setPhase('results');
      }
    }, 900);
  };

  // ── Historial ──
  if (phase === 'history') {
    return (
      <HistoryScreen
        history={history}
        lessonNum={lessonNum}
        onBack={goBack}
        onNewExam={restart}
      />
    );
  }

  // ── Resultados ──
  if (phase === 'results') {
    return (
      <ResultsScreen
        score={score}
        total={total}
        wrongChars={wrongChars}
        onRetry={restart}
        onBack={goBack}
      />
    );
  }

  // ── Sin palabras suficientes ──
  if (total === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
        <BookOpen className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-gray-400 text-lg mb-2">No hay suficientes palabras para el examen.</p>
        <p className="text-gray-600 text-sm mb-8">Necesitas al menos 4 palabras en la lección.</p>
        <button onClick={goBack} className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors">
          Volver
        </button>
      </div>
    );
  }

  // ── Examen en curso ──
  // Barra de progreso: muestra la pregunta actual (1-based) sobre el total
  const progress_pct = Math.round(((qIndex + 1) / total) * 100);
  // Número de errores hasta ahora (respuestas ya evaluadas)
  const errorCount = qIndex - score;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-xl mx-auto">

        {/* Cabecera */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Salir
          </button>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={() => setPhase('history')}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                Historial
              </button>
            )}
            <span className="text-sm text-gray-400 font-semibold">
              {qIndex + 1} / {total}
            </span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
          <div
            className="bg-red-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress_pct}%` }}
          />
        </div>

        {/* Lección */}
        <p className="text-xs text-gray-500 uppercase tracking-widest text-center mb-2">
          {lessonData?.titleEs || `Lección ${lessonNum}`}
        </p>

        {/* Pregunta */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="text-6xl sm:text-8xl font-bold text-white mb-3">{current.correct.char}</div>
          <div className="text-lg sm:text-xl text-gray-400">{current.correct.pinyin}</div>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt, i) => {
            const isSelected = selected === opt.char;
            const isCorrect = opt.char === current.correct.char;
            let cls = 'bg-gray-800 border-gray-700 text-white hover:border-gray-500 hover:bg-gray-700';
            if (feedback && isSelected && isCorrect) cls = 'bg-green-700 border-green-500 text-white';
            else if (feedback && isSelected && !isCorrect) cls = 'bg-red-800 border-red-600 text-white';
            else if (feedback && isCorrect) cls = 'bg-green-900 border-green-600 text-green-300';
            else if (feedback) cls = 'bg-gray-800 border-gray-700 text-gray-500';

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={!!feedback}
                className={`
                  relative p-4 rounded-xl border-2 text-center font-semibold transition-all duration-200
                  ${cls}
                  ${!feedback ? 'cursor-pointer active:scale-95' : 'cursor-default'}
                `}
              >
                {feedback && isCorrect && (
                  <CheckCircle className="w-4 h-4 text-green-400 absolute top-2 right-2" />
                )}
                {feedback && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-red-400 absolute top-2 right-2" />
                )}
                <span className="text-sm leading-snug">{opt.meaning}</span>
              </button>
            );
          })}
        </div>

        {/* Marcador de aciertos en tiempo real */}
        <div className="mt-8 text-center text-sm text-gray-500">
          ✓ {score} correctas · ✗ {errorCount} errores
        </div>

      </div>
    </div>
  );
}
