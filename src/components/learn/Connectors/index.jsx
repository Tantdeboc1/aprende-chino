import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CONNECTORS, CONNECTOR_CATEGORIES } from '@/data/connectors.js';
import { shuffle } from '@/utils/arrayUtils.js';
import FundamentalsMenu from '../FundamentalsMenu.jsx';
import { J } from '@/styles/tokens';

const btn = 'rounded-xl border border-[var(--hair)] bg-[var(--paper-hi2)] px-4 py-3 text-[var(--ink)]';

function makeQuestions(mode, entries) {
  return shuffle(entries).slice(0, 10).map(entry => {
    if (mode === 'order') {
      const parts = entry.parts.map((text, id) => ({ id, text }));
      let choices = shuffle(parts);
      if (choices.every((part, i) => part.id === i)) choices = [...choices.slice(1), choices[0]];
      return { entry, choices };
    }
    const answer = mode === 'fill' ? entry.answer : entry.category;
    const distractors = mode === 'fill' ? entry.distractors : shuffle(CONNECTOR_CATEGORIES.filter(c => c !== answer)).slice(0, 3);
    return { entry, answer, choices: shuffle([answer, ...distractors]) };
  });
}

export default function Connectors({ goBack, speakChinese }) {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState('menu');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [ordered, setOrdered] = useState([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [checked, setChecked] = useState(false);
  const languageIndex = ['es', 'en', 'fr', 'de', 'it', 'pt'].indexOf((i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]);
  const language = languageIndex < 0 ? 1 : languageIndex;
  const categoryName = key => t(`connectors_category_${key}`);
  const filtered = useMemo(() => CONNECTORS.filter(item => (category === 'all' || item.category === category) && (level === 'all' || item.level === level)), [category, level]);
  useEffect(() => {
    const onPop = () => {
      if (window.location.hash === '#/exercise' && history.state?.connectorNavigation) {
        setView(history.state.connectorView || 'menu');
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const enterView = nextView => {
    if (window.location.hash === '#/exercise') {
      history.replaceState({ ...history.state, connectorNavigation: true, connectorView: 'menu' }, '', window.location.href);
      history.pushState({ ...history.state, connectorView: nextView }, '', window.location.href);
    }
    setView(nextView);
  };
  const back = () => {
    if (view === 'menu') goBack();
    else if (window.location.hash === '#/exercise' && history.state?.connectorNavigation) history.back();
    else setView('menu');
  };
  const start = mode => {
    setQuestions(makeQuestions(mode, filtered)); setIndex(0); setScore(0);
    setSelected(null); setOrdered([]); setChecked(false); setFinished(false);
    if (view === 'menu') enterView(mode); else setView(mode);
  };
  const items = [
    { key:'study', cn:'读', label:t('connectors_study'), description:t('connectors_study_desc'), onClick:()=>enterView('study'), bg:J.sandBg, fg:J.sandDeep },
    { key:'fill', cn:'填', label:t('connectors_fill'), description:t('connectors_fill_desc'), onClick:()=>start('fill'), bg:J.jadeBg, fg:J.jadeDeep },
    { key:'order', cn:'排', label:t('connectors_order'), description:t('connectors_order_desc'), onClick:()=>start('order'), bg:J.redBg, fg:J.redDeep },
    { key:'relation', cn:'义', label:t('connectors_relation'), description:t('connectors_relation_desc'), onClick:()=>start('relation'), bg:J.sandBg, fg:J.sandDeep },
  ];
  if (view === 'menu') return <FundamentalsMenu backLabel={t('radicals_back_to_learn')} onBack={goBack} title="连接词" pinyin="Liánjiēcí" subtitle={t('connectors_title')} items={items}>
    <p className="mt-5 text-sm text-[var(--mute)]">{t('connectors_catalog_summary', { count: CONNECTORS.length })}</p>
    <p className="mt-2 text-sm text-[var(--mute)]">{t('connectors_menu_hint')}</p>
    <div className="mt-3 flex flex-wrap gap-3">
      <label className="text-sm text-[var(--ink)]">{t('connectors_function')} <select className={btn} value={category} onChange={e=>setCategory(e.target.value)}><option value="all">{t('connectors_all')}</option>{CONNECTOR_CATEGORIES.map(c=><option key={c} value={c}>{categoryName(c)}</option>)}</select></label>
      <label className="text-sm text-[var(--ink)]">{t('connectors_level')} <select className={btn} value={level} onChange={e=>setLevel(e.target.value)}><option value="all">{t('connectors_all')}</option><option value="basic">{t('connectors_basic')}</option><option value="advanced">{t('connectors_advanced')}</option></select></label>
    </div>
    {filtered.length === 0 && <p role="status" className="mt-3 text-sm text-[var(--red)]">{t('connectors_empty')}</p>}
  </FundamentalsMenu>;

  const top = <button onClick={back} className="mb-5 flex items-center gap-2 text-sm font-semibold text-[var(--ink-soft)]"><ArrowLeft size={17}/>{t('connectors_back')}</button>;
  if (view === 'study') return <main className="min-h-screen bg-[var(--paper)] px-5 py-5 pb-24"><div className="mx-auto max-w-3xl">
    {top}<h1 className="text-2xl font-bold text-[var(--ink)]">{t('connectors_study')}</h1><p className="mt-2 text-sm text-[var(--mute)]">{t('connectors_study_hint')}</p>
    <div className="mt-5 space-y-4">{filtered.map(item=><article key={item.id} className="rounded-2xl border border-[var(--hair)] bg-[var(--paper-hi)] p-5">
      <div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-cn text-2xl font-bold text-[var(--ink)]">{item.pattern}</h2><p className="mt-1 text-sm text-[var(--jade)]">{item.pinyin}</p></div><span className="rounded-full bg-[var(--paper-hi2)] px-3 py-1 text-xs text-[var(--mute)]">{categoryName(item.category)} · {t(`connectors_${item.level}`)}</span></div>
      <p className="mt-3 font-semibold text-[var(--ink)]">{item.meaning[language]}</p><p className="mt-2 text-sm text-[var(--ink-soft)]"><strong>{t('connectors_usage')}:</strong> {item.explanation[language]}</p><div className="mt-4 rounded-xl bg-[var(--paper-hi2)] p-4"><div className="flex items-center justify-between gap-3"><p lang="zh" className="font-cn text-lg text-[var(--ink)]">{item.zh}</p><button className="shrink-0 text-[var(--jade)]" onClick={()=>speakChinese?.(item.zh)} aria-label={`${t('connectors_listen')}: ${item.zh}`}><Volume2 size={20}/></button></div><p className="mt-1 text-sm text-[var(--mute)]">{item.py}</p><p className="mt-2 text-sm text-[var(--ink-soft)]">{item.translation[language]}</p></div>
    </article>)}</div>{filtered.length === 0 && <p className="mt-5 text-[var(--mute)]">{t('connectors_empty')}</p>}
  </div></main>;

  const question = questions[index];
  const correct = view === 'order' ? ordered.every((part, i) => part.id === i) : selected === question?.answer;
  const check = () => { if (checked) return; setChecked(true); if (correct) setScore(s=>s+1); };
  const next = () => { if (index + 1 === questions.length) setFinished(true); else { setIndex(i=>i+1); setSelected(null); setOrdered([]); setChecked(false); } };
  return <main className="min-h-screen bg-[var(--paper)] px-5 py-5 pb-24"><div className="mx-auto max-w-2xl">{top}
    <h1 className="text-2xl font-bold text-[var(--ink)]">{t(`connectors_${view}`)}</h1>
    {questions.length === 0 ? <p className="mt-5 text-[var(--mute)]">{t('connectors_empty')}</p> : finished ? <div className="mt-6 rounded-2xl border border-[var(--hair)] bg-[var(--paper-hi)] p-6 text-center"><h2 className="text-xl font-bold text-[var(--ink)]">{t('connectors_finished')}</h2><p className="my-4 text-3xl font-bold text-[var(--jade)]">{score} / {questions.length}</p><button className={btn} onClick={()=>start(view)}>{t('connectors_retry')}</button></div> : <>
      <p className="mt-3 text-sm text-[var(--mute)]">{index+1} / {questions.length}</p><div className="mt-3 h-2 rounded-full bg-[var(--paper-hi2)]"><div className="h-2 rounded-full bg-[var(--jade)]" style={{width:`${100*(index+1)/questions.length}%`}} /></div>
      <section className="mt-5 rounded-2xl border border-[var(--hair)] bg-[var(--paper-hi)] p-5"><p className="text-sm text-[var(--mute)]">{t(`connectors_prompt_${view}`)}</p>
        <p lang="zh" className="font-cn my-5 text-xl font-semibold leading-relaxed text-[var(--ink)]">{view === 'fill' ? question.entry.blank : view === 'relation' ? question.entry.pattern : question.entry.translation[language]}</p>
        {view === 'relation' && <p className="mb-4 text-sm text-[var(--mute)]">{question.entry.meaning[language]}</p>}
        {view === 'order' ? <><div className="mb-4 min-h-14 rounded-xl border border-dashed border-[var(--hair)] p-3 text-[var(--ink)]" aria-live="polite">{ordered.map(p=>p.text).join('') || t('connectors_order_placeholder')}</div><div className="flex flex-wrap gap-2">{question.choices.map(part=><button key={part.id} className={btn} disabled={checked || ordered.some(p=>p.id===part.id)} onClick={()=>setOrdered([...ordered,part])}>{part.text}</button>)}</div><button className="mt-4 text-sm text-[var(--jade)]" disabled={checked || !ordered.length} onClick={()=>setOrdered(ordered.slice(0,-1))}>{t('connectors_undo')}</button></> : <div className="grid gap-2">{question.choices.map(choice=><button key={choice} className={`${btn} text-left ${selected===choice?'ring-2 ring-[var(--jade)]':''}`} disabled={checked} onClick={()=>setSelected(choice)}>{view === 'relation' ? categoryName(choice) : choice}</button>)}</div>}
        {checked && <div role="status" className="mt-4 rounded-xl bg-[var(--paper-hi2)] p-3 text-sm text-[var(--ink)]"><strong>{t(correct ? 'connectors_correct' : 'connectors_incorrect')}</strong>{!correct && <p className="mt-1">{t('connectors_solution')}: {view === 'order' ? question.entry.parts.join('') : view === 'relation' ? categoryName(question.answer) : question.answer}</p>}<p className="mt-2 font-cn">{question.entry.zh}</p><p className="mt-1 text-[var(--mute)]">{question.entry.translation[language]}</p><p className="mt-2"><strong>{t('connectors_usage')}:</strong> {question.entry.explanation[language]}</p></div>}
      </section><button className="mt-4 w-full rounded-xl bg-[var(--jade)] px-4 py-3 font-semibold text-[var(--on-accent)] disabled:opacity-50" disabled={!checked && (view === 'order' ? ordered.length !== question.choices.length : selected === null)} onClick={checked ? next : check}>{t(checked ? (index+1===questions.length ? 'connectors_results' : 'connectors_next') : 'connectors_check')}</button>
    </>}
  </div></main>;
}
