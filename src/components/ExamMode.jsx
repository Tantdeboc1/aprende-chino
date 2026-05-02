// src/components/ExamMode.jsx
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { saveExamResult, getExamHistory } from '@/utils/progress.js';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy, BookOpen, Clock } from 'lucide-react';
import { shuffle } from '@/utils/arrayUtils.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function formatDate(iso, language) {
  try {
    return new Date(iso).toLocaleDateString(language, {
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

function gradeLabel(pct, t) {
  if (pct === 100) return t('exam_grade_perfect');
  if (pct >= 90)  return t('exam_grade_excellent');
  if (pct >= 70)  return t('exam_grade_good');
  if (pct >= 50)  return t('exam_grade_improve');
  return t('exam_grade_keep_practicing');
}

// ── Pantalla de historial ────────────────────────────────────────────────────

function HistoryScreen({ history, lessonNum, onBack, onNewExam, t, language }) {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('exam_back_to_hub')}
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Clock className="w-6 h-6 text-blue-400" />
          <h1 className="text-2xl font-bold text-white">
            {t('exam_history_title', { lesson: lessonNum })}
          </h1>
        </div>

        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>{t('exam_no_history')}</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {history.map((h, i) => {
              const pct = Math.round((h.score / h.total) * 100);
              return (
                <div key={i} className="bg-gray-800 rounded-xl px-5 py-4 flex items-center justify-between border border-gray-700">
                  <div>
                    <p className="text-white font-semibold">
                      {t('exam_results_score', { score: h.score, total: h.total })}
                      <span className={`ml-2 text-sm font-bold ${gradeColor(pct)}`}>({pct}%)</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(h.date, language)}</p>
                    {h.wrongChars?.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {t('exam_wrong_label')} {h.wrongChars.join('  ')}
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
          {t('exam_start_now_button')}
        </button>
      </div>
    </div>
  );
}

// ── Pantalla de resultados ───────────────────────────────────────────────────

function ResultsScreen({ score, total, wrongChars, onRetry, onBack, t }) {
  const pct = Math.round((score / total) * 100);

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Puntuación */}
        <div className="text-center py-10">
          <Trophy className={`w-16 h-16 mx-auto mb-4 ${gradeColor(pct)}`} />
          <p className={`text-6xl font-bold mb-2 ${gradeColor(pct)}`}>{pct}%</p>
          <p className="text-gray-300 text-lg mb-1">{t('exam_results_score', { score, total })}</p>
          <p className="text-gray-400 font-semibold">{gradeLabel(pct, t)}</p>
        </div>

        {/* Repaso de errores */}
        {wrongChars.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              {t('exam_words_to_review', { count: wrongChars.length })}
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
            <p className="text-green-300 font-semibold">{t('exam_no_errors')}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t('exam_retry_button')}
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors"
          >
            {t('exam_back_to_hub')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ExamMode ────────────────────────────────────────────

export default function ExamMode({
  characters,
  lessonNum,
  lessonData,
  progress,
  onProgressChange,
  goBack,
}) {
  const { t, i18n } = useTranslation();
  const language = i18n.language || 'es';

  const [phase, setPhase] = useState('exam'); // 'exam' | 'results' | 'history'
  const [questions, setQuestions] = useState(() => buildQuestions(characters));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'
  const [wrongChars, setWrongChars] = useState([]);
  const [score, setScore] = useState(0);

  const history = getExamHistory(progress, lessonNum);
  const total = questions.length;
  const current = questions[qIndex];

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
    if (feedback) return;
    setSelected(option.char);
    const isCorrect = option.char === current.correct.char;
    setFeedback(isCorrect ? 'correct' : 'wrong');

    const newScore = isCorrect ? score + 1 : score;
    const newWrong = isCorrect ? wrongChars : [...wrongChars, current.correct];

    setTimeout(() => {
      if (qIndex + 1 < total) {
        setScore(newScore);
        setWrongChars(newWrong);
        setQIndex(qIndex + 1);
        setSelected(null);
        setFeedback(null);
      } else {
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
        t={t}
        language={language}
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
        t={t}
      />
    );
  }

  // ── Sin palabras suficientes ──
  if (total === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
        <BookOpen className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-gray-400 text-lg mb-2">{t('exam_not_enough_words')}</p>
        <p className="text-gray-600 text-sm mb-8">{t('exam_need_more_words')}</p>
        <button onClick={goBack} className="px-8 py-3 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition-colors">
          {t('exam_back_button')}
        </button>
      </div>
    );
  }

  // ── Examen en curso ──
  const progress_pct = Math.round(((qIndex + 1) / total) * 100);
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
            {t('exam_exit_button')}
          </button>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={() => setPhase('history')}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" />
                {t('exam_history_button')}
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
          {lessonData?.titleEs || t('exam_lesson_label', { num: lessonNum })}
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

        {/* Marcador en tiempo real */}
        <div className="mt-8 text-center text-sm text-gray-500">
          {t('exam_score_hud', { score, errors: errorCount })}
        </div>

      </div>
    </div>
  );
}
