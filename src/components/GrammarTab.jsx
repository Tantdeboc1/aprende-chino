// src/components/GrammarTab.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { loadGrammarData } from '@/utils/loadContent.js';
import SpeakButton from '@/components/ui/SpeakButton.jsx';

function PatternCard({ pattern }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
      {/* div con rol de botón (no <button>): dentro va el SpeakButton y un
          <button> no puede contener otro <button> (HTML inválido — React 19
          lo señala como futuro error de hidratación). */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(!open); } }}
        className="w-full flex items-start gap-3 p-4 text-left"
        style={{ cursor: 'pointer' }}
      >
        <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-cn"
          style={{ background: J.jadeBg, color: J.jadeDeep, fontWeight: 700, fontSize: '0.8125rem' }}>
          结
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-base leading-tight flex items-center gap-2" style={{ color: J.ink }}>
              {pattern.pattern}
              <SpeakButton text={pattern.pattern} />
            </span>
            <svg
              className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
              style={{ color: J.mute }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          <p className="text-sm mt-0.5" style={{ color: J.jade }}>{pattern.pinyin}</p>
          <p className="text-sm mt-0.5 italic" style={{ color: J.inkSoft }}>"{pattern.translation}"</p>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 pt-3 space-y-3" style={{ borderTop: `1px solid ${J.hair}` }}>
          <p className="text-sm leading-relaxed" style={{ color: J.inkSoft }}>{pattern.explanation}</p>
          {pattern.examples?.length > 0 && (
            <div className="space-y-2">
              {pattern.examples.map((ex, i) => (
                <div key={i} className="rounded-lg p-3" style={{ background: J.paper }}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-base font-medium" style={{ color: J.ink }}>{ex.zh}</p>
                    <SpeakButton text={ex.zh} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: J.jade }}>{ex.pinyin}</p>
                  <p className="text-xs mt-0.5 italic" style={{ color: J.mute }}>{ex.translation ?? ex.es}</p>
                </div>
              ))}
            </div>
          )}
          {pattern.practice?.questions?.length > 0 && (
            <PatternPractice practice={pattern.practice} ruleExplanation={pattern.explanation} />
          )}
        </div>
      )}
    </div>
  );
}

function PatternPractice({ practice, ruleExplanation }) {
  const { t } = useTranslation();
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const questions = practice.questions;
  const finished = started && questionIndex >= questions.length;
  const answeredCorrectly = selected !== null && selected === questions[questionIndex]?.answerIndex;

  function restart() {
    setStarted(true);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
  }

  function chooseOption(optionIndex) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === questions[questionIndex].answerIndex) {
      setScore(current => current + 1);
    }
  }

  function nextQuestion() {
    setQuestionIndex(current => current + 1);
    setSelected(null);
  }

  return (
    <div className="rounded-xl p-3 space-y-3" style={{ background: J.jadeBg, border: answeredCorrectly ? `2px solid ${J.red}` : `1px solid ${J.hair}` }}>
      {!started ? (
        <button
          type="button"
          onClick={restart}
          className="rounded-lg px-3 py-2 text-sm font-semibold"
          style={{ color: J.jadeDeep, background: J.paperHi, border: `1px solid ${J.hair}` }}
        >
          {t('grammar_practice_start', 'Practice this rule')}
        </button>
      ) : finished ? (
        <div className="flex flex-wrap items-center justify-between gap-2" aria-live="polite">
          <p className="text-sm font-semibold" style={{ color: J.ink }}>
            {t('grammar_practice_result', 'Score: {{score}} / {{total}}', { score, total: questions.length })}
          </p>
          <button
            type="button"
            onClick={restart}
            className="rounded-lg px-3 py-2 text-sm font-semibold"
            style={{ color: J.jadeDeep, background: J.paperHi, border: `1px solid ${J.hair}` }}
          >
            {t('grammar_practice_again', 'Try again')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-semibold" style={{ color: J.jadeDeep }}>
            {t('grammar_practice_progress', 'Question {{current}} of {{total}}', { current: questionIndex + 1, total: questions.length })}
          </p>
          <p className="text-sm font-medium" style={{ color: J.ink }}>{questions[questionIndex].prompt}</p>
          <div className="grid gap-2">
            {questions[questionIndex].options.map((option, optionIndex) => {
              const isAnswer = optionIndex === questions[questionIndex].answerIndex;
              const isSelected = optionIndex === selected;
              const answered = selected !== null;
              return (
                <button
                  key={`${questionIndex}-${optionIndex}`}
                  type="button"
                  disabled={answered}
                  aria-pressed={isSelected}
                  onClick={() => chooseOption(optionIndex)}
                  className="rounded-lg px-3 py-2 text-left text-base font-medium transition-colors disabled:cursor-default"
                  style={{
                    color: answered && isAnswer ? J.jadeDeep : answered && isSelected ? J.redDeep : J.ink,
                    background: answered && isAnswer ? J.jadeBg : answered && isSelected ? J.redBg : J.paperHi,
                    border: `1px solid ${answered && isAnswer ? J.jade : answered && isSelected ? J.red : J.hair}`,
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {selected !== null && (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm font-semibold" style={{ color: selected === questions[questionIndex].answerIndex ? J.jadeDeep : J.redDeep }}>
                {selected === questions[questionIndex].answerIndex
                  ? t('grammar_practice_correct', 'Correct!')
                  : t('grammar_practice_incorrect', 'The correct answer is {{answer}}.', { answer: questions[questionIndex].options[questions[questionIndex].answerIndex] })}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: J.inkSoft }}>
                {questions[questionIndex].explanation ?? ruleExplanation}
              </p>
              <button
                type="button"
                onClick={nextQuestion}
                className="rounded-lg px-3 py-2 text-sm font-semibold"
                style={{ color: J.onAccent, background: J.jadeDeep }}
              >
                {t('grammar_practice_next', 'Next')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StructureCard({ structure }) {
  return (
    <div className="rounded-xl p-4" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
      <h4 className="font-semibold text-sm mb-2" style={{ color: J.ink }}>{structure.title}</h4>
      {/* Formula box */}
      <div className="rounded-lg px-3 py-2 mb-3" style={{ background: J.paper, border: `1px solid ${J.jade}` }}>
        <p className="text-sm font-mono font-bold tracking-wide" style={{ color: J.jadeMid }}>{structure.formula}</p>
      </div>
      <div className="rounded-lg p-3 mb-2" style={{ background: J.paper }}>
        <div className="flex items-start justify-between gap-2">
          <p className="text-base" style={{ color: J.ink }}>{structure.example}</p>
          <SpeakButton text={structure.example} />
        </div>
        <p className="text-xs mt-0.5" style={{ color: J.jade }}>{structure.examplePinyin}</p>
        <p className="text-xs mt-0.5 italic" style={{ color: J.mute }}>{structure.exampleTranslation ?? structure.exampleEs}</p>
      </div>
      {structure.note && (
        <p className="text-xs leading-relaxed" style={{ color: J.mute }}>{structure.note}</p>
      )}
    </div>
  );
}

export default function GrammarTab({ lessonNum }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Cargamos los datos del idioma activo en demanda. El chunk de gramática
  // resultante pesa ~7-8 kB gzip (un solo idioma) en lugar de ~42 kB (los 6).
  const [grammarData, setGrammarData] = useState(null);

  useEffect(() => {
    let alive = true;
    loadGrammarData(lang).then(all => {
      if (!alive) return;
      setGrammarData(all[lessonNum] || null);
    // Corte de red al descargar el chunk del idioma: se queda en "Cargando…".
    // Lo tragamos para que no escape como rejection sin manejar a Sentry.
    }).catch(err => console.warn('[GrammarTab] no se pudo cargar', lang, err));
    return () => { alive = false; };
  }, [lang, lessonNum]);

  if (!grammarData) {
    return (
      <div className="pt-6 text-center text-sm" style={{ color: J.mute }}>
        {t('common_loading', 'Cargando…')}
      </div>
    );
  }

  return (
    <div className="pt-2 space-y-6 pb-4">

      {/* Intro */}
      {grammarData.intro && (
        <div className="rounded-xl p-4" style={{ background: J.paperHi, borderLeft: `4px solid ${J.jade}`, border: `1px solid ${J.hair}`, borderLeftWidth: 4, borderLeftColor: J.jade }}>
          <p className="text-sm leading-relaxed" style={{ color: J.inkSoft }}>{grammarData.intro}</p>
        </div>
      )}

      {/* Patrones gramaticales */}
      {grammarData.patterns?.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color: J.mute }}>
            {t('grammar_section_patterns', 'Key Patterns')}
          </p>
          <div className="space-y-2">
            {grammarData.patterns.map(p => (
              <PatternCard key={p.id} pattern={p} />
            ))}
          </div>
        </div>
      )}

      {/* Estructuras clave */}
      {grammarData.structures?.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-3 px-1" style={{ color: J.mute }}>
            {t('grammar_section_structures', 'Sentence Structures')}
          </p>
          <div className="space-y-3">
            {grammarData.structures.map(s => (
              <StructureCard key={s.id} structure={s} />
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      {grammarData.tip && (
        <div className="rounded-xl p-4" style={{ background: J.sandBg, border: `1px solid ${J.sand}` }}>
          <p className="text-sm leading-relaxed" style={{ color: J.sandDeep }}>{grammarData.tip}</p>
        </div>
      )}

    </div>
  );
}
