// src/components/LevelExam.jsx
// Examen Final del nivel (certificación HSK-1).
//  - Bloqueado hasta dominar UNLOCK_MASTERY_PCT % del vocabulario.
//  - Cronometrado (estilo HSK) y con tipos de pregunta mixtos
//    (carácter→significado y significado→carácter).
//  - Aprobar (>= PASS_PCT) marca el nivel como superado.
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import ConfettiCelebration from '@/components/ui/ConfettiCelebration.jsx';
import { shuffle } from '@/utils/arrayUtils.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import {
  getLevelMastery, isLevelExamUnlocked, saveLevelExamResult, loadLevelExamResult,
  UNLOCK_MASTERY_PCT, PASS_PCT,
} from '@/utils/levelExam.js';

const TOTAL_QUESTIONS = 30;
const TOTAL_TIME = 300; // 5 minutos

function buildExam(pool, count) {
  const picked = shuffle([...pool]).slice(0, count);
  return picked.map((correct, i) => {
    const distractors = shuffle(pool.filter(c => c.char !== correct.char)).slice(0, 3);
    const opts = shuffle([correct, ...distractors]);
    // Alternamos los dos tipos para evaluar reconocimiento en ambos sentidos.
    if (i % 2 === 0) {
      return {
        type: 'char2meaning',
        prompt: correct.char,
        sub: correct.pinyin,
        correctKey: correct.char,
        options: opts.map(c => ({ key: c.char, label: c.meaning, cn: false })),
      };
    }
    return {
      type: 'meaning2char',
      prompt: correct.meaning,
      sub: null,
      correctKey: correct.char,
      options: opts.map(c => ({ key: c.char, label: c.char, cn: true })),
    };
  });
}

export default function LevelExam({ goBack, allCharacters = [], progress }) {
  const { t } = useTranslation();
  const pool = allCharacters.filter(c => c.char && c.meaning && !c.isSupplementary);
  const mastery = getLevelMastery(progress, allCharacters);
  const unlocked = isLevelExamUnlocked(progress, allCharacters);
  const prevResult = loadLevelExamResult();

  const [phase, setPhase] = useState('ready'); // 'ready' | 'playing' | 'finished'
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | 'correct' | 'incorrect'
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timeRef = useRef(TOTAL_TIME);
  const [outcome, setOutcome] = useState(null); // { pct, passedThisAttempt, result }

  const startExam = useCallback(() => {
    const count = Math.min(TOTAL_QUESTIONS, pool.length);
    setQuestions(buildExam(pool, count));
    setQIndex(0); setScore(0); setWrong(0);
    setSelected(null); setFeedback(null);
    setTimeLeft(TOTAL_TIME); timeRef.current = TOTAL_TIME;
    setOutcome(null);
    setPhase('playing');
  }, [pool]);

  // Temporizador
  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        timeRef.current = next;
        if (next <= 0) { clearInterval(id); finish(score, wrong); }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, score, wrong]);

  const finish = useCallback((finalCorrect, finalWrong) => {
    const answered = finalCorrect + finalWrong;
    // Las no respondidas (por tiempo) cuentan como falladas sobre el total.
    const total = questions.length || TOTAL_QUESTIONS;
    const res = saveLevelExamResult({ correct: finalCorrect, total });
    setOutcome({ ...res, total, answered });
    setPhase('finished');
  }, [questions.length]);

  const handleAnswer = (optKey) => {
    if (feedback) return;
    setSelected(optKey);
    const isCorrect = optKey === questions[qIndex].correctKey;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) hapticSuccess(); else hapticError();
    const nextScore = score + (isCorrect ? 1 : 0);
    const nextWrong = wrong + (isCorrect ? 0 : 1);
    if (isCorrect) setScore(nextScore); else setWrong(nextWrong);

    setTimeout(() => {
      if (timeRef.current <= 0) return;
      const nextIdx = qIndex + 1;
      if (nextIdx >= questions.length) {
        finish(nextScore, nextWrong);
      } else {
        setQIndex(nextIdx); setSelected(null); setFeedback(null);
      }
    }, 650);
  };

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const BackBtn = () => (
    <button onClick={goBack} aria-label={t('exam_back_button', 'Volver')}
      className="flex items-center gap-1.5 text-sm mb-4 transition-colors"
      style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}>
      <span style={{ fontSize: 16 }}>←</span>{t('exam_back_to_hub', 'Volver')}
    </button>
  );

  // ── BLOQUEADO ────────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <div className="min-h-screen p-4" style={{ background: J.paper }}>
        <div className="max-w-lg mx-auto">
          <BackBtn />
          <div className="rounded-2xl p-8 text-center" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
            <div className="font-cn mx-auto mb-4 flex items-center justify-center"
              style={{ width: 72, height: 72, borderRadius: 18, fontSize: 40, background: J.sandBg, color: J.sand }}>关</div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: J.ink }}>
              {t('level_exam_locked_title', 'Examen Final bloqueado')}
            </h1>
            <p className="text-sm mb-6" style={{ color: J.inkSoft }}>
              {t('level_exam_locked_desc', `Domina el ${UNLOCK_MASTERY_PCT}% del vocabulario HSK-1 para desbloquear el examen de certificación.`)}
            </p>
            <div className="h-3 rounded-full overflow-hidden mb-2" style={{ background: J.hair }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.round((mastery.pct / UNLOCK_MASTERY_PCT) * 100))}%`, background: J.jade }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: J.jadeDeep }}>
              {mastery.mastered} / {mastery.total} {t('level_exam_mastered', 'dominadas')} · {mastery.pct}%
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── INTRO ────────────────────────────────────────────────────────────────
  if (phase === 'ready') {
    return (
      <div className="min-h-screen p-4" style={{ background: J.paper }}>
        <div className="max-w-lg mx-auto">
          <BackBtn />
          <div className="rounded-2xl p-8 text-center" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
            <div className="font-cn mx-auto mb-4 flex items-center justify-center"
              style={{ width: 72, height: 72, borderRadius: 18, fontSize: 40, background: J.redBg, color: J.red }}>试</div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: J.ink }}>
              {t('level_exam_title', 'Examen Final · HSK 1')}
            </h1>
            <p className="text-sm mb-6" style={{ color: J.inkSoft }}>
              {t('level_exam_subtitle', 'Certificación cronometrada del nivel')}
            </p>

            {prevResult?.passed && (
              <div className="rounded-xl p-3 mb-4 flex items-center justify-center gap-2"
                style={{ background: J.jadeBg, color: J.jadeDeep }}>
                <span>✅</span>
                <span className="text-sm font-semibold">
                  {t('level_exam_already_passed', 'Nivel superado')} · {t('level_exam_best', 'mejor')}: {prevResult.bestPct}%
                </span>
              </div>
            )}

            <ul className="text-sm text-left mx-auto mb-6 space-y-1.5" style={{ color: J.inkSoft, maxWidth: 320 }}>
              <li>⏱️ {t('level_exam_rule_time', `Tiempo límite: ${Math.round(TOTAL_TIME / 60)} minutos.`)}</li>
              <li>📝 {t('level_exam_rule_count', `${Math.min(TOTAL_QUESTIONS, pool.length)} preguntas mezclando lectura y significado.`)}</li>
              <li>🎯 {t('level_exam_rule_pass', `Apruebas con ${PASS_PCT}% o más.`)}</li>
            </ul>

            <button onClick={startExam}
              className="w-full py-3 rounded-xl font-bold text-sm transition-colors"
              style={{ background: J.red, color: J.paperHi, border: 0, cursor: 'pointer' }}>
              {t('level_exam_start', 'Empezar examen')} →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTADO ──────────────────────────────────────────────────────────────
  if (phase === 'finished' && outcome) {
    const passed = outcome.passedThisAttempt;
    return (
      <>
        {passed && <ConfettiCelebration />}
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: J.paper }}>
          <div className="rounded-2xl p-8 max-w-sm w-full text-center"
            style={{ background: J.paperHi, border: `1px solid ${J.hair}`, boxShadow: `0 8px 24px -8px ${J.hairS}` }}>
            <div className="font-cn mx-auto mb-4 flex items-center justify-center"
              style={{ width: 72, height: 72, borderRadius: 18, fontSize: 40, fontWeight: 700,
                background: passed ? J.jadeBg : J.redBg, color: passed ? J.jade : J.red }}>
              {passed ? '证' : '试'}
            </div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: J.ink }}>
              {passed ? t('level_exam_passed_title', '¡Nivel superado!') : t('level_exam_failed_title', 'Aún no')}
            </h2>
            <p className="text-sm mb-6" style={{ color: J.inkSoft }}>
              {passed
                ? t('level_exam_passed_sub', 'Has certificado el HSK-1')
                : t('level_exam_failed_sub', `Necesitas ${PASS_PCT}% para aprobar`)}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl p-3" style={{ background: J.jadeBg }}>
                <p className="text-2xl font-bold" style={{ color: J.jade }}>{score}</p>
                <p className="text-xs mt-0.5" style={{ color: J.jadeDeep }}>{t('global_exam_correct_label', 'Aciertos')}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: J.redBg }}>
                <p className="text-2xl font-bold" style={{ color: J.red }}>{outcome.total - score}</p>
                <p className="text-xs mt-0.5" style={{ color: J.redDeep }}>{t('global_exam_errors_label', 'Fallos')}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: passed ? J.jadeBg : J.sandBg }}>
                <p className="text-2xl font-bold" style={{ color: passed ? J.jade : J.sand }}>{outcome.pct}%</p>
                <p className="text-xs mt-0.5" style={{ color: J.mute }}>{t('global_exam_accuracy_label', 'Nota')}</p>
              </div>
            </div>

            {outcome.result?.bestPct > outcome.pct && (
              <p className="text-xs mb-4" style={{ color: J.mute }}>
                {t('level_exam_best', 'mejor')}: {outcome.result.bestPct}%
              </p>
            )}

            <div className="flex gap-3">
              <button onClick={startExam}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-colors"
                style={{ background: J.red, color: J.paperHi, border: 0, cursor: 'pointer' }}>
                {t('level_exam_retry', 'Repetir')}
              </button>
              <button onClick={goBack}
                className="flex-1 py-3 rounded-xl font-medium text-sm transition-colors"
                style={{ background: J.paperHi, color: J.inkSoft, border: `1px solid ${J.hair}`, cursor: 'pointer' }}>
                {t('exam_back_button', 'Volver')}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ── EXAMEN EN CURSO ──────────────────────────────────────────────────────
  const q = questions[qIndex];
  if (!q) return null;
  const lowTime = timeLeft <= 30;

  return (
    <div className="min-h-screen p-4 pb-10" style={{ background: J.paper }}>
      <div className="max-w-lg mx-auto">
        {/* HUD */}
        <div className="flex items-center justify-between mb-3 pt-1">
          <button onClick={goBack} aria-label={t('exam_back_button', 'Salir')} className="p-1"
            style={{ color: J.mute, background: 'none', border: 0, cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span style={{ color: J.jade }}>★ {score}</span>
            <span style={{ color: J.mute }}>{qIndex + 1}/{questions.length}</span>
          </div>
          <span className="text-sm font-bold tabular-nums" style={{ color: lowTime ? J.red : J.inkSoft }}>
            {fmtTime(timeLeft)}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="h-1.5 rounded-full overflow-hidden mb-6" style={{ background: J.hair }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(qIndex / questions.length) * 100}%`, background: J.red }} />
        </div>

        {/* Pregunta */}
        <div className="rounded-2xl p-6 mb-5 text-center" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
          <p className="text-xs uppercase tracking-wide mb-3" style={{ color: J.mute }}>
            {q.type === 'char2meaning'
              ? t('level_exam_q_meaning', '¿Qué significa?')
              : t('level_exam_q_char', '¿Qué carácter es?')}
          </p>
          <p className={q.type === 'char2meaning' ? 'font-cn font-bold' : 'font-semibold'}
            style={{ fontSize: q.type === 'char2meaning' ? 56 : 22, color: J.ink, lineHeight: 1.2 }}>
            {q.prompt}
          </p>
          {q.sub && <p className="text-sm mt-1" style={{ color: J.mute }}>{q.sub}</p>}
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-1 gap-3">
          {q.options.map((opt) => {
            let bg = J.paperHi, border = J.hair, color = J.ink;
            if (feedback) {
              if (opt.key === q.correctKey) { bg = J.jadeBg; border = J.jade; color = J.jadeDeep; }
              else if (opt.key === selected) { bg = J.redBg; border = J.red; color = J.redDeep; }
              else { color = J.mute2; }
            }
            return (
              <button key={opt.key} onClick={() => handleAnswer(opt.key)} disabled={!!feedback}
                className={`rounded-xl px-4 py-3 text-left transition-colors ${opt.cn ? 'font-cn' : ''}`}
                style={{ background: bg, border: `2px solid ${border}`, color,
                  fontSize: opt.cn ? 28 : 15, fontWeight: 600, cursor: feedback ? 'default' : 'pointer' }}>
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
