// src/components/learn/Characters/Quiz.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { shuffle } from "@/utils/arrayUtils.js";
import { useKeyAnswers } from "@/utils/useKeyAnswers.js";

function pickN(arr, n) {
  const copy = [...arr];
  const out  = [];
  while (copy.length && out.length < n) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

// ─── Modos disponibles ────────────────────────────────────────────────────────
const QUIZ_MODES = [
  { id: 'char_to_meaning', icon: '汉→A', label: 'Carácter → Significado' },
  { id: 'meaning_to_char', icon: 'A→汉', label: 'Significado → Carácter' },
  { id: 'pinyin_to_char',  icon: 'pīn→汉', label: 'Pinyin → Carácter' },
];

function buildQuestion(mode, pool) {
  const correct   = pool[Math.floor(Math.random() * pool.length)];
  const wrongPool = pool.filter(c => c.char !== correct.char);
  const options   = shuffle([...pickN(wrongPool, 3), correct]);
  return { correct, options, mode };
}

export default function Quiz({ goBack, characters = [], onTrackResult }) {
  const { t } = useTranslation();
  const [quizMode, setQuizMode]         = useState('char_to_meaning');
  const [questions, setQuestions]       = useState([]);
  const [index, setIndex]               = useState(0);
  const [score, setScore]               = useState(0);
  const [selected, setSelected]         = useState(null);
  const [showResult, setShowResult]     = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const initQuiz = (mode = quizMode) => {
    if (!Array.isArray(characters) || characters.length < 4) return;
    const pool = [...characters];
    const qs   = Array.from({ length: 10 }, () => buildQuestion(mode, pool));
    setQuestions(qs);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setShowInstructions(false);
  };

  useEffect(() => {
    if (!showInstructions) initQuiz(quizMode);
  }, [characters]); // eslint-disable-line

  // Estado derivado (antes de los early-returns, para poder colgar el hook
  // de teclado — los hooks no pueden ir tras un return condicional).
  const inPlay  = !showInstructions && questions.length > 0 && index < questions.length;
  const current = inPlay ? questions[index] : null;

  const handleAnswer = (opt) => {
    if (!current || showResult) return;
    setSelected(opt);
    setShowResult(true);
    const isCorrect = opt.char === current.correct.char;
    if (isCorrect) setScore(s => s + 1);
    onTrackResult?.(current.correct, isCorrect);
  };

  const next = () => {
    setIndex(i => i + 1);
    setSelected(null);
    setShowResult(false);
  };

  // Accesibilidad: teclas 1-4 responden, Enter pasa de pregunta.
  useKeyAnswers({
    count: current?.options.length || 0,
    onSelect: inPlay && !showResult ? (i) => handleAnswer(current.options[i]) : null,
    onNext: inPlay && showResult ? next : null,
  });

  // ── Pantalla de instrucciones + selector de modo ──────────────────────────
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-[var(--paper)] p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button onClick={goBack} className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition mb-4">
              ← {t('quiz_back_button')}
            </button>
            <h1 className="text-3xl font-bold text-[var(--ink)] text-center">{t('quiz_title')}</h1>
            <p className="text-[var(--mute)] text-center">{t('quiz_subtitle')}</p>
          </div>

          {/* Selector de modo */}
          <div className="bg-[var(--paper-hi)] rounded-xl p-5 border border-[rgba(28,24,19,0.10)] mb-4">
            <h2 className="text-sm font-bold text-[var(--mute)] mb-3 uppercase tracking-wide">{t('quiz_question_type_label')}</h2>
            <div className="grid grid-cols-3 gap-2">
              {QUIZ_MODES.map(m => (
                <button
                  key={m.id}
                  onClick={() => setQuizMode(m.id)}
                  className={`p-3 rounded-xl border text-center transition-all active:scale-95 ${
                    quizMode === m.id
                      ? 'bg-[var(--jade)] border-[var(--jade)] text-[var(--on-accent)]'
                      : 'bg-[var(--paper-hi2)] border-[rgba(28,24,19,0.18)] text-[var(--ink-soft)] hover:border-[var(--mute)]'
                  }`}
                >
                  <div className="text-base font-bold mb-1 font-mono">{m.icon}</div>
                  <div className="text-xs leading-tight">{m.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-[var(--paper-hi)] rounded-xl p-6 border border-[rgba(28,24,19,0.10)] mb-6">
            <h2 className="text-xl font-bold text-[var(--ink)] mb-4">{t('quiz_instructions_title')}</h2>
            <div className="space-y-3 text-[var(--ink-soft)]">
              {[1,2,3,4,5].map(n => (
                <div key={n} className="flex items-start">
                  <div className="bg-[var(--jade)] text-[var(--on-accent)] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">{n}</div>
                  <p>{t(`quiz_instructions_${n}`).replace(/<\/?1>/g, '')}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => initQuiz(quizMode)}
            className="w-full bg-[var(--jade)] hover:bg-[var(--jade-deep)] text-[var(--on-accent)] font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            {t('quiz_start_button')}
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[var(--paper)] p-4 flex items-center justify-center">
        <div className="bg-[var(--paper-hi)] rounded-2xl p-8 max-w-md w-full text-center border border-[rgba(28,24,19,0.10)]">
          <p className="text-[var(--ink-soft)] mb-6">{t('dictionary_no_results')}</p>
          <button onClick={goBack} className="w-full bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] text-[var(--ink)] font-semibold py-3 rounded-lg transition">
            {t('quiz_back_button')}
          </button>
        </div>
      </div>
    );
  }

  // ── Resultado final ────────────────────────────────────────────────────────
  if (index >= questions.length) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center p-4">
        <div className="bg-[var(--paper-hi)] rounded-2xl shadow-sm p-8 max-w-md w-full text-center border border-[rgba(28,24,19,0.10)]">
          <div className="text-5xl mb-4 text-[var(--jade)]">完</div>
          <h2 className="text-3xl font-bold text-[var(--ink)] mb-4">{t('quiz_completed_title')}</h2>
          <p className="text-5xl font-bold text-[var(--jade)] mb-6">{score}/{questions.length}</p>
          <p className="text-[var(--ink-soft)] mb-6">
            {score >= 8 ? t('quiz_result_excellent') : score >= 6 ? t('quiz_result_good') : t('quiz_result_keep_going')}
          </p>
          <div className="flex gap-3">
            <button onClick={() => setShowInstructions(true)} className="flex-1 bg-[var(--jade)] hover:bg-[var(--jade-deep)] text-[var(--on-accent)] font-semibold py-3 rounded-lg transition">
              {t('quiz_play_again_button')}
            </button>
            <button onClick={goBack} className="flex-1 bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] text-[var(--ink)] font-semibold py-3 rounded-lg transition border border-[rgba(28,24,19,0.10)]">
              {t('quiz_back_button')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = current;
  const mode     = question.mode;

  // ── Estímulo según modo ────────────────────────────────────────────────────
  const Stimulus = () => {
    if (mode === 'char_to_meaning') return (
      <div className="text-center mb-6">
        <p className="text-[var(--ink-soft)] mb-4">{t('quiz_question_header')}</p>
        <div className="text-7xl sm:text-9xl font-bold text-[var(--ink)] mb-2">{question.correct.char}</div>
        <p className="text-xl text-[var(--mute)]">{question.correct.pinyin}</p>
      </div>
    );
    if (mode === 'meaning_to_char') return (
      <div className="text-center mb-6">
        <p className="text-[var(--mute)] text-sm mb-3">{t('char_quiz_meaning_to_char_prompt')}</p>
        {question.correct.type && (
          <span className="text-xs px-2 py-0.5 rounded bg-[var(--paper-hi2)] text-[var(--mute)] mb-3 inline-block">{question.correct.type}</span>
        )}
        <div className="text-3xl sm:text-4xl font-bold text-[var(--ink)] mt-2">{question.correct.meaning}</div>
      </div>
    );
    // pinyin_to_char
    return (
      <div className="text-center mb-6">
        <p className="text-[var(--mute)] text-sm mb-3">{t('char_quiz_pinyin_to_char_prompt')}</p>
        <div className="text-4xl sm:text-5xl font-bold text-[var(--red)]">{question.correct.pinyin}</div>
      </div>
    );
  };

  // ── Opciones según modo ────────────────────────────────────────────────────
  const optionLabel = (opt) => {
    if (mode === 'char_to_meaning') return opt.meaning;
    return <span className="text-4xl font-bold">{opt.char}</span>;
  };

  const isCorrectOpt = (opt) => opt.char === question.correct.char;

  return (
    <div className="min-h-screen bg-[var(--paper)] p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <button onClick={goBack} className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)] text-sm">
            ← {t('quiz_back_button')}
          </button>
          <div className="text-center">
            <span className="text-[var(--ink-soft)] font-semibold text-base block">
              {index + 1}/{questions.length} · {score} ✓
            </span>
            <div className="w-32 bg-[var(--paper-hi2)] rounded-full h-1.5 mt-1 mx-auto">
              <div
                className="bg-[var(--jade)] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              />
            </div>
            {/* badge de modo */}
            <span className="text-xs text-[var(--mute)] mt-0.5 block font-mono">
              {QUIZ_MODES.find(m => m.id === mode)?.icon}
            </span>
          </div>
          <button
            onClick={() => setShowInstructions(true)}
            className="bg-[var(--jade)] hover:bg-[var(--jade-deep)] text-[var(--on-accent)] font-semibold py-1.5 px-3 rounded-lg transition text-sm"
          >
            {t('char_quiz_change_button')}
          </button>
        </div>

        <div className="bg-[var(--paper-hi)] rounded-2xl shadow-sm p-4 sm:p-8 border border-[rgba(28,24,19,0.10)]">
          {/* Anuncio para lectores de pantalla (el feedback visual es solo color) */}
          <div aria-live="polite" className="sr-only">
            {showResult && (
              selected?.char === question.correct.char
                ? t('quiz_a11y_correct', 'Correcto')
                : `${t('quiz_a11y_incorrect', 'Incorrecto')}. ${question.correct.char} = ${question.correct.meaning}`
            )}
          </div>
          <Stimulus />

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(opt)}
                disabled={showResult}
                className={`p-4 rounded-lg text-lg font-semibold transition flex items-center justify-center min-h-[64px] ${
                  showResult
                    ? isCorrectOpt(opt)
                      ? 'bg-[var(--jade)] text-[var(--on-accent)]'
                      : opt === selected
                      ? 'bg-[var(--red)] text-[var(--on-accent)]'
                      : 'bg-[var(--paper-hi2)] text-[var(--mute)]'
                    : 'bg-[var(--paper-hi2)] hover:bg-[var(--paper-hi2)] hover:border-[var(--mute)] text-[var(--ink)] border border-[rgba(28,24,19,0.10)]'
                }`}
              >
                {optionLabel(opt)}
              </button>
            ))}
          </div>

          {/* Ejemplo de uso en fallo */}
          {showResult && selected?.char !== question.correct.char && question.correct.examples?.length > 0 && (
            <div className="mt-4 p-3 bg-[var(--red-bg)]/20 border border-[var(--red)]/40 rounded-xl text-left">
              <p className="text-xs text-[var(--mute)] mb-1.5">Ejemplo de uso:</p>
              <p className="text-sm text-[var(--ink)] leading-relaxed">{question.correct.examples[0]}</p>
              {question.correct.examples[1] && (
                <p className="text-sm text-[var(--ink-soft)] leading-relaxed mt-1">{question.correct.examples[1]}</p>
              )}
            </div>
          )}

          {showResult && (
            <button
              onClick={next}
              className="w-full mt-4 bg-[var(--jade)] hover:bg-[var(--jade-deep)] text-[var(--on-accent)] font-semibold py-3 rounded-lg transition"
            >
              {index + 1 >= questions.length ? t('quiz_results_button') : t('quiz_next_button')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
