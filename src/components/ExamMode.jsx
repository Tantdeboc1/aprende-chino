// src/components/ExamMode.jsx
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { saveExamResult, getExamHistory } from '@/utils/progress.js';
import { shuffle } from '@/utils/arrayUtils.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';

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

function gradeStyle(pct) {
  if (pct >= 90) return { color: J.jade, bg: J.jadeBg };
  if (pct >= 70) return { color: J.sand, bg: J.sandBg };
  return { color: J.red, bg: J.redBg };
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
    <div className="min-h-screen p-4" style={{ background: J.paper }}>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm mb-6 transition-colors"
          style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}
        >
          <span>←</span> {t('exam_back_to_hub')}
        </button>

        <div className="flex items-center gap-3 mb-8">
          <span className="font-cn text-2xl" style={{ color: J.jade, fontWeight: 700 }}>历</span>
          <h1 className="text-2xl font-bold" style={{ color: J.ink }}>
            {t('exam_history_title', { lesson: lessonNum })}
          </h1>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16">
            <div className="font-cn mx-auto mb-4" style={{ fontSize: 48, color: J.mute2, opacity: 0.5 }}>试</div>
            <p style={{ color: J.mute }}>{t('exam_no_history')}</p>
          </div>
        ) : (
          <div className="space-y-3 mb-8">
            {history.map((h, i) => {
              const pct = Math.round((h.score / h.total) * 100);
              const g = gradeStyle(pct);
              return (
                <div key={i} className="rounded-xl px-5 py-4 flex items-center justify-between"
                  style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
                  <div>
                    <p className="font-semibold" style={{ color: J.ink }}>
                      {t('exam_results_score', { score: h.score, total: h.total })}
                      <span className="ml-2 text-sm font-bold" style={{ color: g.color }}>({pct}%)</span>
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: J.mute }}>{formatDate(h.date, language)}</p>
                    {h.wrongChars?.length > 0 && (
                      <p className="text-xs mt-1" style={{ color: J.inkSoft }}>
                        {t('exam_wrong_label')} {h.wrongChars.join('  ')}
                      </p>
                    )}
                  </div>
                  <div className="text-2xl font-bold" style={{ color: g.color }}>{pct}%</div>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={onNewExam}
          className="w-full py-4 font-bold rounded-xl transition-colors"
          style={{ background: J.red, color: J.paperHi, border: 0, cursor: 'pointer' }}
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
  const g = gradeStyle(pct);

  return (
    <div className="min-h-screen p-4" style={{ background: J.paper }}>
      <div className="max-w-2xl mx-auto">
        {/* Puntuación */}
        <div className="text-center py-10">
          <div className="font-cn mx-auto mb-4 flex items-center justify-center"
            style={{ width: 64, height: 64, borderRadius: 16, background: g.bg, color: g.color, fontSize: 36, fontWeight: 700 }}>
            {pct >= 90 ? '优' : pct >= 70 ? '良' : '练'}
          </div>
          <p className="text-6xl font-bold mb-2" style={{ color: g.color }}>{pct}%</p>
          <p className="text-lg mb-1" style={{ color: J.inkSoft }}>{t('exam_results_score', { score, total })}</p>
          <p className="font-semibold" style={{ color: J.ink }}>{gradeLabel(pct, t)}</p>
        </div>

        {/* Repaso de errores */}
        {wrongChars.length > 0 && (
          <div className="mb-8">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: J.ink }}>
              <span className="font-cn" style={{ color: J.red, fontWeight: 700 }}>错</span>
              {t('exam_words_to_review', { count: wrongChars.length })}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {wrongChars.map((w, i) => (
                <div key={i} className="rounded-xl p-3 text-center"
                  style={{ background: J.paperHi, border: `1px solid ${J.red}` }}>
                  <div className="text-3xl font-cn mb-1" style={{ color: J.ink }}>{w.char}</div>
                  <div className="text-sm" style={{ color: J.jade }}>{w.pinyin}</div>
                  <div className="text-xs font-semibold mt-1" style={{ color: J.redDeep }}>{w.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {wrongChars.length === 0 && (
          <div className="rounded-xl p-5 mb-8 text-center"
            style={{ background: J.jadeBg, border: `1px solid ${J.jade}` }}>
            <span className="font-cn text-3xl" style={{ color: J.jade, fontWeight: 700 }}>优</span>
            <p className="font-semibold mt-2" style={{ color: J.jadeDeep }}>{t('exam_no_errors')}</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-4 font-bold rounded-xl transition-colors"
            style={{ background: J.paperHi, color: J.ink, border: `1px solid ${J.hair}`, cursor: 'pointer' }}
          >
            <span className="font-cn" style={{ fontWeight: 700 }}>重</span>
            {t('exam_retry_button')}
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-4 font-bold rounded-xl transition-colors"
            style={{ background: J.red, color: J.paperHi, border: 0, cursor: 'pointer' }}
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

  const feedbackTimerRef = useRef(null);
  useEffect(() => () => { if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current); }, []);

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
    if (isCorrect) hapticSuccess(); else hapticError();

    const newScore = isCorrect ? score + 1 : score;
    const newWrong = isCorrect ? wrongChars : [...wrongChars, current.correct];

    feedbackTimerRef.current = setTimeout(() => {
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
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center" style={{ background: J.paper }}>
        <div className="font-cn mb-4" style={{ fontSize: 48, color: J.mute2 }}>书</div>
        <p className="text-lg mb-2" style={{ color: J.inkSoft }}>{t('exam_not_enough_words')}</p>
        <p className="text-sm mb-8" style={{ color: J.mute }}>{t('exam_need_more_words')}</p>
        <button onClick={goBack} className="px-8 py-3 rounded-xl font-semibold transition-colors"
          style={{ background: J.paperHi, color: J.ink, border: `1px solid ${J.hair}`, cursor: 'pointer' }}>
          {t('exam_back_button')}
        </button>
      </div>
    );
  }

  // ── Examen en curso ──
  const progress_pct = Math.round(((qIndex + 1) / total) * 100);
  const errorCount = qIndex - score;

  return (
    <div className="min-h-screen p-4" style={{ background: J.paper }}>
      <div className="max-w-xl mx-auto">

        {/* Cabecera */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm transition-colors"
            style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}
          >
            <span>←</span> {t('exam_exit_button')}
          </button>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={() => setPhase('history')}
                className="flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: J.mute, background: 'none', border: 0, cursor: 'pointer' }}
              >
                <span className="font-cn" style={{ fontWeight: 700 }}>历</span>
                {t('exam_history_button')}
              </button>
            )}
            <span className="text-sm font-semibold" style={{ color: J.inkSoft }}>
              {qIndex + 1} / {total}
            </span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full rounded-full h-2 mb-8" style={{ background: J.hair }}>
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress_pct}%`, background: J.red }}
          />
        </div>

        {/* Lección */}
        <p className="text-xs uppercase tracking-widest text-center mb-2" style={{ color: J.mute }}>
          {lessonData?.titleEs || t('exam_lesson_label', { num: lessonNum })}
        </p>

        {/* Pregunta */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="text-6xl sm:text-8xl font-bold font-cn mb-3" style={{ color: J.ink }}>{current.correct.char}</div>
          <div className="text-lg sm:text-xl" style={{ color: J.jade }}>{current.correct.pinyin}</div>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-2 gap-3">
          {current.options.map((opt, i) => {
            const isSelected = selected === opt.char;
            const isCorrectOpt = opt.char === current.correct.char;

            let bg = J.paperHi;
            let border = J.hair;
            let color = J.ink;

            if (feedback && isSelected && isCorrectOpt) {
              bg = J.jadeBg; border = J.jade; color = J.jadeDeep;
            } else if (feedback && isSelected && !isCorrectOpt) {
              bg = J.redBg; border = J.red; color = J.redDeep;
            } else if (feedback && isCorrectOpt) {
              bg = J.jadeBg; border = J.jade; color = J.jadeDeep;
            } else if (feedback) {
              color = J.mute2;
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={!!feedback}
                className="relative p-4 rounded-xl text-center font-semibold transition-all duration-200"
                style={{
                  background: bg, border: `2px solid ${border}`, color,
                  cursor: feedback ? 'default' : 'pointer',
                }}
              >
                {feedback && isCorrectOpt && (
                  <span className="absolute top-2 right-2 text-xs" style={{ color: J.jade }}>★</span>
                )}
                {feedback && isSelected && !isCorrectOpt && (
                  <span className="absolute top-2 right-2 text-xs" style={{ color: J.red }}>✕</span>
                )}
                <span className="text-sm leading-snug">{opt.meaning}</span>
              </button>
            );
          })}
        </div>

        {/* Marcador en tiempo real */}
        <div className="mt-8 text-center text-sm" style={{ color: J.mute }}>
          {t('exam_score_hud', { score, errors: errorCount })}
        </div>

      </div>
    </div>
  );
}
