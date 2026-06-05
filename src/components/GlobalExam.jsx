// src/components/GlobalExam.jsx
// Modo examen cronometrado global — mezcla todas las lecciones HSK1
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import ConfettiCelebration from '@/components/ui/ConfettiCelebration.jsx';
import { shuffle } from '@/utils/arrayUtils.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';

const TOTAL_TIME = 90; // segundos
const QUESTIONS_PER_ROUND = 20;

export default function GlobalExam({ goBack, allCharacters }) {
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

  const pool = allCharacters.filter(c => !c.isSupplementary);

  const startGame = useCallback(() => {
    const count = Math.min(QUESTIONS_PER_ROUND, pool.length);
    const picked = shuffle([...pool]).slice(0, count);
    const qs = picked.map(correct => {
      const distractors = shuffle(pool.filter(c => c.char !== correct.char))
        .slice(0, 3)
        .map(c => c.meaning);
      const options = shuffle([correct.meaning, ...distractors]);
      return { correct, options };
    });
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

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        timeRef.current = next;
        if (next <= 0) {
          clearInterval(id);
          setPhase('finished');
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  const handleAnswer = (opt) => {
    if (feedback) return;
    setSelected(opt);
    const isCorrect = opt === questions[qIndex].correct.meaning;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) hapticSuccess(); else hapticError();
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
      <div className="min-h-screen p-4 pb-28" style={{ background: J.paper }}>
        <div className="max-w-lg mx-auto pt-6">
          <button onClick={goBack} className="flex items-center text-sm mb-6 transition-colors"
            style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}>
            <span className="mr-1.5">←</span> {t('exam_back_button')}
          </button>

          <div className="text-center mb-8">
            <div className="font-cn mx-auto mb-4 flex items-center justify-center"
              style={{ width: 64, height: 64, borderRadius: 16, background: J.sandBg, color: J.sand, fontSize: 36, fontWeight: 700 }}>
              试
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: J.ink }}>{t('global_exam_title')}</h1>
            <p style={{ color: J.inkSoft }}>{t('global_exam_subtitle')}</p>
          </div>

          <div className="rounded-xl p-5 mb-6 space-y-3" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
            {[
              t('global_exam_info_1', { questions: QUESTIONS_PER_ROUND, words: pool.length }),
              t('global_exam_info_2', { seconds: TOTAL_TIME }),
              t('global_exam_info_3'),
              t('global_exam_info_4'),
            ].map((info, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="font-cn rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                  style={{ background: J.sand, color: J.paperHi }}>
                  {['一','二','三','四'][i]}
                </div>
                <p className="text-sm" style={{ color: J.inkSoft }}>{info}</p>
              </div>
            ))}
          </div>

          <button
            onClick={startGame}
            className="w-full font-bold py-4 rounded-xl text-lg transition-colors"
            style={{ background: J.red, color: J.paperHi, border: 0, cursor: 'pointer' }}
          >
            {t('global_exam_start_button')}
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
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: J.paper }}>
          <div className="rounded-2xl p-8 max-w-sm w-full text-center"
            style={{ background: J.paperHi, border: `1px solid ${J.hair}`, boxShadow: `0 8px 24px -8px ${J.hairS}` }}>
            <div className="font-cn mx-auto mb-4 flex items-center justify-center"
              style={{
                width: 64, height: 64, borderRadius: 16, fontSize: 36, fontWeight: 700,
                background: passed ? J.jadeBg : J.sandBg,
                color: passed ? J.jade : J.sand,
              }}>
              {pct === 100 ? '优' : passed ? '良' : '练'}
            </div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: J.ink }}>{t('global_exam_completed_title')}</h2>
            <p className="text-sm mb-6" style={{ color: J.inkSoft }}>
              {passed ? t('global_exam_passed') : t('global_exam_keep_practicing')}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl p-3" style={{ background: J.jadeBg }}>
                <p className="text-2xl font-bold" style={{ color: J.jade }}>{score}</p>
                <p className="text-xs mt-0.5" style={{ color: J.jadeDeep }}>{t('global_exam_correct_label')}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: J.redBg }}>
                <p className="text-2xl font-bold" style={{ color: J.red }}>{wrong}</p>
                <p className="text-xs mt-0.5" style={{ color: J.redDeep }}>{t('global_exam_errors_label')}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: passed ? J.jadeBg : J.sandBg }}>
                <p className="text-2xl font-bold" style={{ color: passed ? J.jade : J.sand }}>{pct}%</p>
                <p className="text-xs mt-0.5" style={{ color: J.mute }}>{t('global_exam_accuracy_label')}</p>
              </div>
            </div>

            {/* Barra de resultado */}
            <div className="h-3 rounded-full overflow-hidden mb-1" style={{ background: J.hair }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: passed ? J.jade : J.sand }}
              />
            </div>
            <div className="flex justify-between text-xs mb-6" style={{ color: J.mute }}>
              <span>0%</span>
              <span style={{ color: passed ? J.jade : J.mute }}>{t('global_exam_min_score')}</span>
              <span>100%</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 py-3 rounded-xl font-bold text-sm transition-colors"
                style={{ background: J.red, color: J.paperHi, border: 0, cursor: 'pointer' }}
              >
                {t('global_exam_repeat_button')}
              </button>
              <button
                onClick={goBack}
                className="flex-1 py-3 rounded-xl font-medium text-sm transition-colors"
                style={{ background: J.paperHi, color: J.inkSoft, border: `1px solid ${J.hair}`, cursor: 'pointer' }}
              >
                {t('exam_back_button')}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Juego en curso
  const question = questions[qIndex];
  if (!question) return null;
  const progressPct = ((qIndex) / questions.length) * 100;
  const timePct = (timeLeft / TOTAL_TIME) * 100;
  const timeColor = timeLeft > 30 ? J.jade : timeLeft > 15 ? J.sand : J.red;

  return (
    <div className="min-h-screen px-4 pb-28 pt-4" style={{ background: J.paper }}>
      <div className="max-w-lg mx-auto">
        {/* HUD */}
        <div className="flex items-center justify-between mb-3 pt-2">
          <button onClick={goBack} className="p-1 transition-colors"
            style={{ color: J.mute, background: 'none', border: 0, cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <span style={{ color: J.jade }}>★ {score}</span>
            <span style={{ color: J.mute }}>{qIndex + 1}/{questions.length}</span>
            <span style={{ color: J.red }}>✕ {wrong}</span>
          </div>
          <div className={`text-lg font-bold ${timeLeft <= 15 ? 'animate-pulse' : ''}`}
            style={{ color: timeLeft <= 15 ? J.red : J.ink }}>
            {timeLeft}s
          </div>
        </div>

        {/* Barra de tiempo */}
        <div className="h-1.5 rounded-full overflow-hidden mb-1" style={{ background: J.hair }}>
          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${timePct}%`, background: timeColor }} />
        </div>

        {/* Barra de pregunta */}
        <div className="h-1 rounded-full overflow-hidden mb-4" style={{ background: J.hair }}>
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%`, background: J.sand }} />
        </div>

        {/* Carácter */}
        <div className="rounded-2xl flex items-center justify-center mb-4 py-8 sm:py-12"
          style={{ background: J.paperHi, border: `2px solid ${J.hair}` }}>
          <div className="text-center">
            <div className="text-7xl sm:text-8xl font-bold font-cn mb-1" style={{ color: J.ink }}>{question.correct.char}</div>
            <div className="text-sm sm:text-base" style={{ color: J.jade }}>{question.correct.pinyin}</div>
          </div>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {question.options.map((opt, i) => {
            let bg = J.paperHi;
            let border = J.hair;
            let color = J.ink;

            if (feedback) {
              if (opt === question.correct.meaning) {
                bg = J.jadeBg; border = J.jade; color = J.jadeDeep;
              } else if (opt === selected) {
                bg = J.redBg; border = J.red; color = J.redDeep;
              } else {
                color = J.mute2;
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={!!feedback}
                className="p-3 rounded-xl font-medium text-sm transition-colors min-h-[60px] sm:min-h-[68px] flex items-center justify-center text-center leading-tight"
                style={{
                  background: bg, border: `2px solid ${border}`, color,
                  cursor: feedback ? 'default' : 'pointer',
                }}
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
