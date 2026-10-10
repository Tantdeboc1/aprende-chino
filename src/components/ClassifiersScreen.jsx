import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, RotateCcw, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SpeakButton from '@/components/ui/SpeakButton.jsx';
import { J } from '@/styles/tokens';
import { baseLang } from '@/utils/loc.js';
import { classifierText, classifierUi, classifiers, filterClassifiers } from '@/data/classifierData.js';
import { useScrollMemory } from '@/hooks/useScrollMemory.js';

const ALL_IDS = classifiers.map(item => item.id);

function shuffled(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function ClassifiersScreen({ goBack, initialState, onStateChange, onActivityChange }) {
  const { i18n } = useTranslation();
  const lang = baseLang(i18n.language);
  const text = (key, replacements) => classifierText(classifierUi[key], lang, replacements);
  const [mode, setMode] = useState(initialState?.mode || 'study');
  const [query, setQuery] = useState(initialState?.query || '');
  const [selectedIds, setSelectedIds] = useState(() => new Set(initialState?.selectedIds || ALL_IDS));
  const [session, setSession] = useState(initialState?.session || null);
  const [questionIndex, setQuestionIndex] = useState(initialState?.questionIndex || 0);
  const [chosenId, setChosenId] = useState(initialState?.chosenId ?? null);
  const [score, setScore] = useState(initialState?.score || 0);
  const [inActivity, setInActivity] = useState(Boolean(initialState?.session && history.state?.classifierActivity));
  const sessionRef = useRef(session);
  const scrollPositions = useRef(initialState?.scrollPositions || new Map());
  const visibleClassifiers = filterClassifiers(query, lang);
  useScrollMemory(inActivity ? 'activity' : `${mode}:${query}`, { positions: scrollPositions.current });

  useEffect(() => {
    sessionRef.current = session;
    onStateChange?.({ mode, query, selectedIds: [...selectedIds], session, questionIndex, chosenId, score, scrollPositions: scrollPositions.current });
  }, [mode, query, selectedIds, session, questionIndex, chosenId, score, onStateChange]);

  useEffect(() => {
    onActivityChange?.(inActivity);
    return () => onActivityChange?.(false);
  }, [inActivity, onActivityChange]);

  useEffect(() => {
    const onPop = () => {
      if (window.location.hash === '#/classifiers') {
        setInActivity(Boolean(history.state?.classifierActivity && sessionRef.current));
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const enterActivity = () => {
    if (!history.state?.classifierActivity) {
      history.pushState({ ...history.state, classifierActivity: true }, '', window.location.href);
    }
    setInActivity(true);
  };

  const leaveActivity = () => {
    if (history.state?.classifierActivity) history.back();
    else setInActivity(false);
  };

  const startPractice = () => {
    if (selectedIds.size === 0) return;
    const questions = classifiers
      .filter(item => selectedIds.has(item.id))
      .flatMap(item => item.examples.map(example => {
        const distractors = shuffled(classifiers.filter(option => option.id !== item.id)).slice(0, 3);
        return {
          ...example,
          classifierId: item.id,
          options: shuffled([item, ...distractors]).map(option => option.id),
        };
      }));
    setSession(shuffled(questions));
    setQuestionIndex(0);
    setChosenId(null);
    setScore(0);
    scrollPositions.current.set('activity', 0);
    if (inActivity) window.scrollTo({ top: 0, behavior: 'instant' });
    enterActivity();
  };

  const toggleSelection = (id) => {
    setSelectedIds(current => {
      if (id === 'all') return current.size === ALL_IDS.length ? new Set() : new Set(ALL_IDS);
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const chooseAnswer = (id) => {
    if (chosenId !== null) return;
    setChosenId(id);
    if (id === session[questionIndex].classifierId) setScore(value => value + 1);
  };

  const nextQuestion = () => {
    setQuestionIndex(index => index + 1);
    setChosenId(null);
  };

  const current = session?.[questionIndex];
  const finished = Boolean(session && questionIndex >= session.length);
  const answerIsCorrect = chosenId !== null && chosenId === current?.classifierId;

  return (
    <div className="min-h-screen pb-24" style={{ background: J.paper }}>
      <header style={{ background: J.jade, borderLeft: `4px solid ${J.jadeDeep}`, padding: '20px 16px' }}>
        <div className="mx-auto max-w-3xl">
          <button
            onClick={inActivity ? leaveActivity : goBack}
            className="mb-4 inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold"
            style={{ color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.12)', border: 0, cursor: 'pointer', padding: '8px 11px' }}
          >
            <ArrowLeft size={16} /> {inActivity ? text('backToSelection') : text('backHome')}
          </button>
          <div className="flex items-end gap-3">
            <span className="font-cn flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl font-bold" style={{ color: J.jadeDeep, background: J.butter }}>量</span>
            <div>
              <h1 className="text-2xl font-bold leading-tight" style={{ color: J.onAccent }}>{text('pageTitle')}</h1>
              <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{text('pageSubtitle')}</p>
            </div>
          </div>
        </div>
      </header>

      {!inActivity && (
        <div className="sticky top-0 z-20 border-b px-4 py-3" style={{ background: J.paper, borderColor: J.hair }}>
          <div className="mx-auto max-w-3xl space-y-3">
            <div role="group" aria-label={text('modesLabel')} className="grid grid-cols-2 gap-1 rounded-xl p-1" style={{ background: J.hair }}>
              {['study', 'practice'].map(value => (
                <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className="min-h-11 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: mode === value ? J.jade : 'transparent', color: mode === value ? J.onAccent : J.inkSoft }}>
                  {value === 'study' ? text('study') : text('practiceTitle')}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-xl border px-3" style={{ background: J.paperHi, borderColor: J.hair }}>
              <Search size={18} aria-hidden="true" style={{ color: J.mute }} />
              <input type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label={text('searchLabel')} placeholder={text('searchPlaceholder')} className="min-h-11 min-w-0 flex-1 bg-transparent py-2 text-base outline-none" style={{ color: J.ink }} />
              {query && <button type="button" onClick={() => setQuery('')} aria-label={text('clearSearch')} className="flex h-11 w-11 items-center justify-center"><X size={18} /></button>}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-5">
        {inActivity && session ? (
          finished ? (
            <section className="rounded-2xl p-6 text-center" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl font-cn text-3xl font-bold" style={{ color: J.jadeDeep, background: J.jadeBg }}>学</div>
              <h2 className="text-xl font-bold" style={{ color: J.ink }}>{text('results')}</h2>
              <p className="mt-2 text-sm" style={{ color: J.inkSoft }}>{text('score', { correct: score, total: session.length })}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button onClick={startPractice} className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold" style={{ background: J.jade, color: J.onAccent, border: 0, cursor: 'pointer' }}>
                  <RotateCcw size={16} /> {text('again')}
                </button>
                <button onClick={leaveActivity} className="rounded-xl px-4 py-3 text-sm font-bold" style={{ background: J.paper, color: J.inkSoft, border: `1px solid ${J.hair}`, cursor: 'pointer' }}>
                  {text('backToSelection')}
                </button>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl p-4 sm:p-6" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: J.mute }}>{text('questionProgress', { current: questionIndex + 1, total: session.length })}</p>
                <div className="h-2 w-28 overflow-hidden rounded-full" style={{ background: J.hair }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${((questionIndex + 1) / session.length) * 100}%`, background: J.jade }} />
                </div>
              </div>
              <p className="mb-3 text-sm font-semibold" style={{ color: J.inkSoft }}>{text('questionInstruction')}</p>
              <div className="mb-5 flex items-center justify-center gap-1 font-cn text-4xl font-bold" style={{ color: J.ink }}>
                <span>{current.before}</span>
                <span className="inline-flex min-w-12 justify-center rounded-lg px-2" style={{ background: chosenId === null ? J.sandBg : answerIsCorrect ? J.jadeBg : J.redBg, color: chosenId === null ? J.sandDeep : answerIsCorrect ? J.jadeDeep : J.redDeep }}>
                  {chosenId === null ? '＿' : current.answer}
                </span>
                <span>{current.after}</span>
                {chosenId !== null && <SpeakButton text={current.phrase} size="md" className="ml-2" />}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {current.options.map(id => classifiers.find(option => option.id === id)).map(item => {
                  const wasChosen = chosenId === item.id;
                  const isAnswer = chosenId !== null && current.classifierId === item.id;
                  const background = isAnswer ? J.jadeBg : wasChosen ? J.redBg : J.paper;
                  const color = isAnswer ? J.jadeDeep : wasChosen ? J.redDeep : J.ink;
                  const border = isAnswer ? J.jadeMid : wasChosen ? J.red : J.hair;
                  return (
                    <button key={item.id} onClick={() => chooseAnswer(item.id)} disabled={chosenId !== null} className="flex items-center justify-center gap-2 rounded-xl py-3 transition-transform active:scale-[0.98] disabled:cursor-default" style={{ background, color, border: `1px solid ${border}` }}>
                      <span className="font-cn text-xl font-bold">{item.short || item.character}</span>
                      <span className="text-xs font-semibold">{item.pinyin}</span>
                    </button>
                  );
                })}
              </div>
              {chosenId !== null && (
                <div className="mt-4 rounded-xl p-3" style={{ background: answerIsCorrect ? J.jadeBg : J.redBg }}>
                  <p className="text-sm font-bold" style={{ color: answerIsCorrect ? J.jadeDeep : J.redDeep }}>{answerIsCorrect ? text('correct') : text('tryAgain')}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2">
                    <span className="font-cn text-lg font-bold" style={{ color: J.ink }}>{current.phrase}</span>
                    <span className="text-xs" style={{ color: J.inkSoft }}>{current.pinyin} · {classifierText(current.meaning, lang)}</span>
                  </div>
                </div>
              )}
              {chosenId !== null && (
                <button onClick={questionIndex + 1 === session.length ? () => setQuestionIndex(session.length) : nextQuestion} className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-bold" style={{ color: J.onAccent, background: J.jade, border: 0, cursor: 'pointer' }}>
                  {questionIndex + 1 === session.length ? text('results') : text('next')}
                </button>
              )}
            </section>
          )
        ) : (
          <>
            {mode === 'study' && <>
            <section className="rounded-2xl p-4 sm:p-5" style={{ background: J.jadeBg, border: `1px solid ${J.jadeMid}` }}>
              <h2 className="text-sm font-bold uppercase tracking-wide" style={{ color: J.jadeDeep }}>{text('ruleTitle')}</h2>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: J.inkSoft }}>{text('rule')}</p>
              <div className="mt-3 inline-flex rounded-lg px-3 py-2 font-cn text-lg font-bold" style={{ color: J.jadeDeep, background: J.paperHi }}>数词 + 量词 + 名词</div>
            </section>

            <section>
              <div className="mb-3">
                <h2 className="text-lg font-bold" style={{ color: J.ink }}>{text('examplesTitle', { count: visibleClassifiers.length })}</h2>
                <p className="mt-0.5 text-xs" style={{ color: J.mute }}>{text('examplesHint')}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {visibleClassifiers.map(item => (
                  <article key={item.id} className="rounded-2xl p-4" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
                    <div className="flex items-start gap-3">
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl font-cn" style={{ background: J.sandBg, color: J.sandDeep }}>
                        <span className={`font-bold leading-none ${item.short || item.character.length <= 2 ? 'text-3xl' : 'text-xl'}`}>{item.short || item.character}</span>
                      </div>
                      <div className="min-w-0 pt-1">
                        <p className="font-cn text-xl font-bold" style={{ color: J.ink }}>{item.character} <span className="font-sans text-sm font-semibold" style={{ color: J.jade }}>{item.pinyin}</span></p>
                        <p className="mt-0.5 text-xs leading-relaxed" style={{ color: J.inkSoft }}>{text('usagesTitle')}: {classifierText(item.use, lang)}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {item.examples.map(example => (
                        <div key={example.phrase} className="flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: J.paper, border: `1px solid ${J.hair}` }}>
                          <div className="min-w-0 flex-1">
                            <p className="font-cn text-lg font-bold leading-snug" style={{ color: J.ink }}>{example.phrase}</p>
                            <p className="text-xs" style={{ color: J.jade }}>{example.pinyin}</p>
                            <p className="text-xs" style={{ color: J.mute }}>{classifierText(example.meaning, lang)}</p>
                          </div>
                          <SpeakButton text={example.phrase} />
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <p className="rounded-xl px-4 py-3 text-xs leading-relaxed" style={{ background: J.sandBg, color: J.sandDeep }}>{text('note')}</p>
            </>}

            {mode === 'practice' && (
            <section className="rounded-2xl p-4 sm:p-5" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
              <h2 className="text-lg font-bold" style={{ color: J.ink }}>{text('practiceTitle')}</h2>
              <p className="mt-1 text-sm" style={{ color: J.inkSoft }}>{text('practiceDescription')}</p>
              {session && questionIndex < session.length && <button type="button" onClick={enterActivity} className="mt-3 min-h-11 w-full rounded-xl border px-3 py-2 text-sm font-bold" style={{ borderColor: J.jadeMid, color: J.jadeDeep, background: J.jadeBg }}>{text('resume', { current: questionIndex + 1, total: session.length })}</button>}
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" aria-pressed={selectedIds.size === ALL_IDS.length} onClick={() => toggleSelection('all')} className="rounded-full px-3 py-2 text-xs font-bold" style={{ background: selectedIds.size === ALL_IDS.length ? J.ink : J.paper, color: selectedIds.size === ALL_IDS.length ? J.paperHi : J.inkSoft, border: `1px solid ${selectedIds.size === ALL_IDS.length ? J.ink : J.hair}`, cursor: 'pointer' }}>{text('all')}</button>
                {query && visibleClassifiers.length > 0 && <button type="button" onClick={() => setSelectedIds(new Set(visibleClassifiers.map(item => item.id)))} className="min-h-11 rounded-full border px-3 py-2 text-xs font-bold" style={{ borderColor: J.jadeMid, color: J.jadeDeep }}>{text('onlyResults')}</button>}
                {visibleClassifiers.map(item => {
                  const selected = selectedIds.has(item.id);
                  return <button key={item.id} type="button" aria-pressed={selected} onClick={() => toggleSelection(item.id)} className="rounded-full px-3 py-2 text-xs font-bold" style={{ background: selected ? J.jadeBg : J.paper, color: selected ? J.jadeDeep : J.inkSoft, border: `1px solid ${selected ? J.jadeMid : J.hair}`, cursor: 'pointer' }}>{item.short || item.character} · {item.pinyin}</button>;
                })}
              </div>
              <button onClick={startPractice} disabled={selectedIds.size === 0} className="mt-4 w-full rounded-xl px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-45" style={{ color: J.onAccent, background: J.jade, border: 0, cursor: selectedIds.size ? 'pointer' : 'not-allowed' }}>
                {text('practiceCount', { count: selectedIds.size })}
              </button>
            </section>
            )}
            {visibleClassifiers.length === 0 && <p role="status" className="rounded-xl border px-4 py-5 text-sm" style={{ borderColor: J.hair, color: J.inkSoft }}>{text('noResults')}</p>}
          </>
        )}
      </div>
    </div>
  );
}
