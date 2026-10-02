import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { buildStartingQuestions, startingRecommendation } from '@/utils/startingGuide.js';
import copy from '@/data/startingGuideText.js';

export default function StartingGuide({ characters = [], onFinish, onBack }) {
  const { i18n } = useTranslation();
  const text = copy[i18n.language?.split('-')[0]] || copy.en;
  const questions = useMemo(() => buildStartingQuestions(characters), [characters]);
  const [phase, setPhase] = useState('choose');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(undefined);
  const [result, setResult] = useState(null);
  const current = questions[index];
  const button = { width: '100%', padding: '13px 16px', borderRadius: 14, border: `1px solid ${J.hair}`, background: J.paper, color: J.ink, cursor: 'pointer', textAlign: 'left', marginTop: 10 };
  const primary = { ...button, textAlign: 'center', background: J.jade, color: J.onAccent, fontWeight: 700 };
  const next = () => {
    if (selected === undefined) return;
    const nextAnswers = { ...answers, [current.id]: selected };
    setAnswers(nextAnswers);
    setSelected(undefined);
    if (index + 1 === questions.length) { setResult(startingRecommendation(questions, nextAnswers)); setPhase('result'); }
    else setIndex(i => i + 1);
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: J.paper }}>
      <section aria-label={text.title} className="max-w-sm w-full" style={{ background: J.paperHi, borderRadius: 22, padding: 28, border: `1px solid ${J.hair}`, color: J.ink }}>
        <span className="font-cn text-3xl" style={{ color: J.jade }}>路</span>
        <h2 className="text-xl font-bold mt-3">{phase === 'result' ? text.result : text.title}</h2>
        {phase === 'choose' && <>
          <p className="text-sm mt-2" style={{ color: J.inkSoft }}>{text.hint}</p>
          <button style={button} onClick={() => { setResult({ source: 'beginner', lesson: 1, at: Date.now() }); setPhase('result'); }}><strong className="block">{text.beginner}</strong><span className="text-xs">{text.beginnerHint}</span></button>
          <button style={button} onClick={() => { setIndex(0); setAnswers({}); setSelected(undefined); setPhase('quiz'); }}><strong className="block">{text.experienced}</strong><span className="text-xs">{text.experiencedHint}</span></button>
          <button style={button} onClick={onBack}>{text.back}</button>
        </>}
        {phase === 'quiz' && <>
          <p className="text-sm mt-3">{text.question} {index + 1}/{questions.length}</p>
          <progress aria-label={text.question} value={index} max={questions.length} className="w-full" />
          <p className="text-sm mt-3">{current.skill === 'grammar' ? text.grammar : text.word}</p>
          <p className="font-cn text-3xl my-4">{current.prompt}</p>
          <div role="group" aria-label={current.skill === 'grammar' ? text.grammar : text.word}>
            {[...current.options, null].map(option => <button key={option ?? 'unknown'} style={{ ...button, borderColor: selected === option ? J.jade : J.hair, background: selected === option ? J.jadeBg : J.paper }} aria-pressed={selected === option} onClick={() => setSelected(option)}>{option ?? text.unknown}</button>)}
          </div>
          <button style={{ ...primary, opacity: selected === undefined ? 0.5 : 1 }} disabled={selected === undefined} onClick={next}>{text.next}</button>
        </>}
        {phase === 'result' && <>
          <p className="text-2xl font-bold mt-4" style={{ color: J.jade }}>{text.lesson} {result.lesson}</p>
          <p className="text-sm mt-3" style={{ color: J.inkSoft }}>{result.source === 'beginner' ? text.beginnerResult : text.sampleHint}</p>
          {result.perSkill && <div className="text-sm mt-3 space-y-1"><p>{text.vocabulary}: {result.perSkill.vocabulary.correct}/{result.perSkill.vocabulary.total}</p><p>{text.sentences}: {result.perSkill.grammar.correct}/{result.perSkill.grammar.total}</p></div>}
          <button style={primary} onClick={() => onFinish(result, true)}>{text.start}</button>
          <button style={button} onClick={() => onFinish(result, false)}>{text.explore}</button>
          <button style={button} onClick={() => setPhase('choose')}>{text.back}</button>
        </>}
        {phase !== 'result' && <button style={{ ...button, border: 0, color: J.inkSoft, textAlign: 'center' }} onClick={() => onFinish(null, false)}>{text.skip}</button>}
      </section>
    </div>
  );
}
