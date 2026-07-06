// src/components/minigames/CefrExam.jsx
// Examen estilo MCER (A1) por destrezas: 听 comprensión oral · 读 comprensión
// escrita · 写 expresión escrita. Reutiliza el TTS (speak), el catálogo de
// caracteres y los datos de "completa la frase". Da un veredicto Apto/No apto
// A1 con desglose por destreza y guarda el mejor resultado (cefrExam.js).
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { shuffle } from '@/utils/arrayUtils.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import { useKeyAnswers } from '@/utils/useKeyAnswers.js';
import ConfettiCelebration from '@/components/ui/ConfettiCelebration.jsx';
import completeSentenceData from '@/data/completeSentenceData.js';
import { buildMeaningQuestions } from '@/utils/quizEngine.js';
import {
  CEFR_SKILLS, CEFR_LEVEL, CEFR_PASS_PCT,
  saveCefrResult, loadCefrResult, isCefrPass,
} from '@/utils/cefrExam.js';

const PER_SKILL = 5; // preguntas por destreza → 15 en total

// ─── Generación de preguntas ────────────────────────────────────────────────
function buildQuestions(allCharacters, lang) {
  const pool = allCharacters.filter(c => !c.isSupplementary);
  const out = [];

  // 听 — escucha el carácter, elige el significado.
  for (const q of buildMeaningQuestions(pool, PER_SKILL)) {
    out.push({ skill: 'listening', char: q.correct.char, pinyin: q.correct.pinyin, answer: q.answer, options: q.options });
  }

  // 读 — lee el carácter (+pinyin), elige el significado.
  for (const q of buildMeaningQuestions(pool, PER_SKILL)) {
    out.push({ skill: 'reading', char: q.correct.char, pinyin: q.correct.pinyin, answer: q.answer, options: q.options });
  }

  // 写 — completa la frase con el carácter correcto.
  for (const s of shuffle([...completeSentenceData]).slice(0, PER_SKILL)) {
    out.push({
      skill: 'writing',
      sentence: s.sentence,
      translation: s.translations?.[lang] || s.translations?.es || '',
      answer: s.answer,
      options: shuffle([...s.options]),
    });
  }

  return out;
}

const SKILL_META = Object.fromEntries(CEFR_SKILLS.map(s => [s.id, s]));

// ─── Sub-vistas ─────────────────────────────────────────────────────────────
function SkillBar({ label, cn, correct, total }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const ok = pct >= 40;
  return (
    <div style={{ marginBottom: 12 }}>
      <div className="flex items-baseline justify-between" style={{ marginBottom: 5 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: J.ink }}>
          <span className="font-cn" style={{ color: J.red, marginRight: 6 }}>{cn}</span>{label}
        </span>
        <span style={{ fontSize: 12, fontWeight: 800, color: ok ? J.jade : J.sand }}>
          {correct}/{total} · {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: J.hair }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: ok ? J.jade : J.sand }} />
      </div>
    </div>
  );
}

export default function CefrExam({ goBack, speak, allCharacters }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split('-')[0] || 'es';

  const [phase, setPhase] = useState('intro'); // 'intro' | 'playing' | 'results'
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [perSkill, setPerSkill] = useState({});
  const [summary, setSummary] = useState(null); // { result, pct, passedThisAttempt }

  const prevResult = useMemo(() => loadCefrResult(), []);

  const start = useCallback(() => {
    setQuestions(buildQuestions(allCharacters, lang));
    setQIndex(0);
    setSelected(null);
    setLocked(false);
    setPerSkill({});
    setPhase('playing');
  }, [allCharacters, lang]);

  const current = questions[qIndex];

  // 听: reproduce el audio al mostrar la pregunta.
  useEffect(() => {
    if (phase === 'playing' && current?.skill === 'listening' && speak) {
      speak(current.char);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, qIndex]);

  const answer = (opt) => {
    if (locked) return;
    setSelected(opt);
    setLocked(true);
    const ok = opt === current.answer;
    if (ok) hapticSuccess(); else hapticError();

    const sk = current.skill;
    const next = { ...perSkill, [sk]: {
      correct: (perSkill[sk]?.correct || 0) + (ok ? 1 : 0),
      total: (perSkill[sk]?.total || 0) + 1,
    } };
    setPerSkill(next);

    setTimeout(() => {
      if (qIndex + 1 >= questions.length) {
        const correct = Object.values(next).reduce((a, s) => a + s.correct, 0);
        const total = Object.values(next).reduce((a, s) => a + s.total, 0);
        setSummary(saveCefrResult({ perSkill: next, correct, total }));
        setPhase('results');
      } else {
        setQIndex(i => i + 1);
        setSelected(null);
        setLocked(false);
      }
    }, 850);
  };

  // Accesibilidad: teclas 1-4 responden (avanza solo tras el feedback).
  useKeyAnswers({
    count: current?.options.length || 0,
    onSelect: phase === 'playing' && current && !locked
      ? (i) => answer(current.options[i]) : null,
  });

  const skillLabel = (id) => t(SKILL_META[id].i18nKey, SKILL_META[id].def);

  // ─── INTRO ─────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={{ minHeight: '100vh', background: J.paper, padding: '14px 20px 90px' }}>
        <button onClick={goBack}
          style={{ background: J.paperHi, border: 0, borderRadius: 14, padding: '6px 12px',
                   fontSize: 13, color: J.inkSoft, fontWeight: 600, cursor: 'pointer' }}>
          ← {t('minigames_back_to_minigames', 'Volver a Destrezas')}
        </button>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <div className="font-cn" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 76, height: 76, borderRadius: 20, background: J.jade, color: J.butter,
            fontSize: 40, fontWeight: 700, boxShadow: J.shadowMd,
          }}>证</div>
          <h1 style={{ margin: '14px 0 2px', fontSize: 26, fontWeight: 800, color: J.ink, letterSpacing: '-0.02em' }}>
            {t('cefr_title', 'Examen MCER')} · {CEFR_LEVEL}<span style={{ color: J.red }}>.</span>
          </h1>
          <p style={{ fontSize: 13.5, color: J.inkSoft }}>
            {t('cefr_subtitle', 'Certifica tu nivel A1 por destrezas')}
          </p>
        </div>

        {/* Destrezas evaluadas */}
        <div style={{
          marginTop: 18, background: J.paperHi, border: `1px solid ${J.hair}`,
          borderRadius: 18, padding: '14px 16px', boxShadow: J.shadowSm,
        }}>
          {CEFR_SKILLS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3"
              style={{ padding: '10px 0', borderTop: i === 0 ? 0 : `1px solid ${J.hair}` }}>
              <span className="font-cn" style={{
                width: 38, height: 38, borderRadius: 11, background: J.jadeBg, color: J.jadeDeep,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700,
              }}>{s.cn}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: J.ink }}>{skillLabel(s.id)}</p>
                <p style={{ margin: 0, fontSize: 12, color: J.mute }}>{PER_SKILL} {t('cefr_questions', 'preguntas')}</p>
              </div>
            </div>
          ))}
          <p style={{ margin: '10px 2px 0', fontSize: 12, color: J.mute, lineHeight: 1.5 }}>
            {t('cefr_pass_hint', 'Apto con un {{pct}}% global y sin suspender ninguna destreza.', { pct: CEFR_PASS_PCT })}
          </p>
        </div>

        {prevResult && (
          <p style={{ marginTop: 12, textAlign: 'center', fontSize: 12.5, color: J.inkSoft }}>
            {prevResult.passed
              ? `✅ ${t('cefr_already_passed', 'Ya tienes el A1')} · ${t('cefr_best', 'mejor')} ${prevResult.bestPct}%`
              : `${t('cefr_best', 'mejor')}: ${prevResult.bestPct}%`}
          </p>
        )}

        <button onClick={start}
          style={{ width: '100%', marginTop: 18, padding: '15px', borderRadius: 16, border: 0,
                   background: J.red, color: J.onAccent, fontSize: 15, fontWeight: 800, cursor: 'pointer',
                   boxShadow: J.shadowMd }}>
          {t('cefr_start', 'Empezar examen')}
        </button>
      </div>
    );
  }

  // ─── RESULTADOS ────────────────────────────────────────────────────────────
  if (phase === 'results') {
    const pct = summary?.pct ?? 0;
    const apto = isCefrPass(pct, perSkill);
    return (
      <>
        {apto && <ConfettiCelebration />}
        <div style={{ minHeight: '100vh', background: J.paper, padding: '24px 20px 90px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 380, background: J.paperHi, borderRadius: 22,
                        border: `1px solid ${J.hair}`, padding: '26px 22px', textAlign: 'center',
                        boxShadow: J.shadowLg }}>
            <div className="font-cn" style={{
              width: 72, height: 72, borderRadius: 18, margin: '0 auto 12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 38, fontWeight: 700,
              background: apto ? J.jade : J.sandBg, color: apto ? J.butter : J.sandDeep,
            }}>{apto ? '证' : '练'}</div>

            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: J.ink }}>
              {apto ? `${t('cefr_passed', 'Apto')} · ${CEFR_LEVEL}` : t('cefr_failed', 'Sigue practicando')}
            </h2>
            <p style={{ margin: '2px 0 16px', fontSize: 13, color: J.inkSoft }}>
              {apto
                ? t('cefr_passed_sub', '¡Has certificado el nivel A1!')
                : t('cefr_failed_sub', 'Casi. Repasa y vuelve a intentarlo.')}
            </p>

            <div style={{ fontSize: 52, fontWeight: 800, color: apto ? J.jade : J.sand, lineHeight: 1, marginBottom: 18 }}>
              {pct}%
            </div>

            <div style={{ textAlign: 'left', marginBottom: 18 }}>
              {CEFR_SKILLS.map(s => (
                <SkillBar key={s.id} label={skillLabel(s.id)} cn={s.cn}
                  correct={perSkill[s.id]?.correct || 0} total={perSkill[s.id]?.total || 0} />
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={start}
                style={{ flex: 1, padding: '13px', borderRadius: 14, border: 0, background: J.red,
                         color: J.onAccent, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                {t('cefr_retry', 'Repetir')}
              </button>
              <button onClick={goBack}
                style={{ flex: 1, padding: '13px', borderRadius: 14, background: J.paperHi,
                         color: J.inkSoft, border: `1px solid ${J.hair}`, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                {t('exam_back_button', 'Salir')}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── PREGUNTA ──────────────────────────────────────────────────────────────
  if (!current) return null;
  const progress = Math.round((qIndex / questions.length) * 100);

  return (
    <div style={{ minHeight: '100vh', background: J.paper, padding: '14px 20px 90px' }}>
      {/* Barra superior: progreso + destreza actual */}
      <div className="flex items-center gap-3" style={{ marginBottom: 16 }}>
        <button onClick={goBack} aria-label={t('exam_back_button', 'Salir')}
          style={{ background: 'transparent', border: 0, color: J.mute, fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>✕</button>
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: J.hair }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: J.jade }} />
        </div>
        <span className="font-cn" style={{
          fontSize: 13, fontWeight: 800, color: J.jadeDeep, background: J.jadeBg,
          borderRadius: 8, padding: '2px 8px',
        }}>{SKILL_META[current.skill].cn}</span>
      </div>

      <p style={{ textAlign: 'center', fontSize: 12, color: J.mute, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 14 }}>
        {skillLabel(current.skill)} · {qIndex + 1}/{questions.length}
      </p>

      {/* Enunciado según destreza */}
      <div style={{
        background: J.paperHi, border: `1px solid ${J.hair}`, borderRadius: 20,
        padding: '26px 18px', textAlign: 'center', marginBottom: 18, boxShadow: J.shadowSm,
      }}>
        {current.skill === 'listening' && (
          <button onClick={() => speak?.(current.char)}
            style={{ width: 88, height: 88, borderRadius: '50%', border: 0, cursor: 'pointer',
                     background: J.jade, color: J.onAccent, fontSize: 38,
                     display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxShadow: J.shadowMd }}>
            🔊
          </button>
        )}
        {current.skill === 'reading' && (
          <>
            <div className="font-cn" style={{ fontSize: 60, fontWeight: 700, color: J.ink, lineHeight: 1 }}>{current.char}</div>
            <div style={{ fontSize: 16, color: J.inkSoft, marginTop: 8 }}>{current.pinyin}</div>
          </>
        )}
        {current.skill === 'writing' && (
          <>
            <div className="font-cn" style={{ fontSize: 30, fontWeight: 700, color: J.ink, lineHeight: 1.3 }}>
              {current.sentence.replace('___', '￭')}
            </div>
            {current.translation && (
              <div style={{ fontSize: 13.5, color: J.mute, marginTop: 10 }}>{current.translation}</div>
            )}
          </>
        )}
      </div>

      {/* Opciones */}
      <div className="grid grid-cols-1 gap-2.5" style={{ gridTemplateColumns: current.skill === 'writing' ? '1fr 1fr' : '1fr' }}>
        {current.options.map((opt, i) => {
          const isAnswer = opt === current.answer;
          const isPicked = opt === selected;
          let bg = J.paperHi, color = J.ink, border = J.hairS;
          if (locked && isAnswer) { bg = J.jadeBg; color = J.jadeDeep; border = J.jade; }
          else if (locked && isPicked && !isAnswer) { bg = J.redBg; color = J.redDeep; border = J.red; }
          return (
            <button key={i} onClick={() => answer(opt)} disabled={locked}
              className={current.skill === 'writing' ? 'font-cn' : ''}
              style={{
                padding: current.skill === 'writing' ? '16px' : '14px 16px',
                borderRadius: 14, border: `1.5px solid ${border}`, background: bg, color,
                fontSize: current.skill === 'writing' ? 24 : 15,
                fontWeight: 700, cursor: locked ? 'default' : 'pointer',
                transition: 'background 150ms, border-color 150ms', textAlign: 'center',
              }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
