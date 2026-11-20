import { PracticeCard, PracticeOption, PracticeNext, PracticeProgress, PracticeFeedback } from '@/components/ui/PracticeControls.jsx';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SpeakButton from '@/components/ui/SpeakButton.jsx';
import { practiceLabels, topicPractice } from '@/data/topicPractice.js';
import { topicWorkshop, workshopLabels } from '@/data/topicWorkshop.js';
import { loc } from '@/utils/loc.js';
import { J } from '@/styles/tokens';

const buttonStyle = { background: J.paper, color: J.ink, border: `1px solid ${J.hair}` };
const buttonClass = 'rounded-lg px-3 py-2 min-h-11 disabled:opacity-60';
const normalize = (value) => value.normalize('NFKC').replace(/[\p{P}\s]/gu, '');

function loadGuidedProgress(key) {
  if (!key) return null;
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (Number.isInteger(saved?.index) && saved.index >= 0 && saved.index <= 6 &&
        Number.isInteger(saved.score) && saved.score >= 0 && saved.score <= saved.index &&
        Array.isArray(saved.missed) && saved.missed.every((i) => Number.isInteger(i) && i >= 0 && i < saved.index)) return saved;
  } catch { /* Storage may be unavailable. */ }
  return null;
}

export default function TopicPractice({ lesson, guided = false, title, description, startLabel }) {
  const { i18n } = useTranslation();
  const local = (value) => loc(value, i18n.language);
  const label = (key) => local(practiceLabels[key] ?? workshopLabels[key]);
  const original = topicPractice[lesson];
  const storageKey = guided ? `hanyupath-guided-study-${lesson}-v1` : null;
  const [saved] = useState(() => loadGuidedProgress(storageKey));
  const [review, setReview] = useState(null);
  const [missed, setMissed] = useState([]);
  const [written, setWritten] = useState('');
  const [index, setIndex] = useState(-1);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState([]);
  const [result, setResult] = useState(null);
  const questionHeading = useRef(null);
  const nextButton = useRef(null);
  useEffect(() => {
    if (index < 0) return;
    if (result === null) questionHeading.current?.focus();
    else nextButton.current?.focus();
  }, [index, result]);
  if (!original) return null;
  const workshopTasks = topicWorkshop[lesson].flatMap((item) => item.tasks);
  const fullSession = guided ? workshopTasks : [...original, ...workshopTasks];
  const questions = review ?? fullSession;

  const question = questions[index];
  const finished = index === questions.length;
  const answered = result !== null;
  function saveGuidedProgress(checkpoint) {
    if (!storageKey) return;
    try { localStorage.setItem(storageKey, JSON.stringify(checkpoint)); } catch { /* Storage may be unavailable. */ }
  }
  function start(subset = null) {
    setReview(subset);
    setMissed([]);
    setWritten('');
    setScore(0);
    setIndex(0);
    setPicked([]);
    setResult(null);
  }
  function submit(correct) {
    if (answered) return;
    setResult(correct);
    if (correct) setScore(score + 1);
    else setMissed([...missed, question]);
  }
  function next() {
    if (!review) saveGuidedProgress({ index: index + 1, score, missed: missed.map((item) => fullSession.indexOf(item)) });
    setIndex(index + 1);
    setPicked([]);
    setResult(null);
    setWritten('');
  }

  function begin() {
    if (index < 0 && saved) {
      setIndex(saved.index);
      setScore(saved.score);
      setMissed(saved.missed.map((i) => fullSession[i]));
      return;
    }
    saveGuidedProgress({ index: 0, score: 0, missed: [] });
    start();
  }
  const BeginButton = guided ? PracticeNext : PracticeOption;

  return (
    <PracticeCard title={title || label('title')}>
      {!question ? (
        <>
          {finished ? <p ref={questionHeading} tabIndex={-1} role="status">{label('result')}: {score}/{questions.length}</p>
            : <p className="text-sm">{description || `${fullSession.length} ${label('length')}`}</p>}
          {finished && missed.length > 0 && <PracticeNext onClick={() => start(missed)}>{label('review')} ({missed.length})</PracticeNext>}
          <BeginButton onClick={begin}>
            {finished ? label('retry') : saved ? label('resume') : startLabel || label('start')}
          </BeginButton>
        </>
      ) : (
        <div key={index} className="space-y-3">
          <PracticeProgress question={index + 1} total={questions.length} completed={index + Number(answered)} />
          <p ref={questionHeading} tabIndex={-1} className="text-sm">{local(question.prompt)}</p>
          {question.text && (
            <div className="space-y-2">
              {question.text.split('\n').map((line, i) => (
                <div key={i}>
                  <p className="font-cn text-lg" lang="zh-Hans">{line}</p>
                  {question.pinyin && <p className="text-sm text-[var(--ink-soft)]" lang="zh-Latn-pinyin">{question.pinyin.split('\n')[i]}</p>}
                </div>
              ))}
              {question.hint && <p className="text-sm text-[var(--ink-soft)]">{question.hint}</p>}
            </div>
          )}
          {question.audio && (
            <div className="flex flex-wrap items-start gap-3">
              <SpeakButton text={question.audio} title={label('listen')} />
              <details className="text-sm">
                <summary className="cursor-pointer">{label('transcript')}</summary>
                <p lang="zh-Hans" className="font-cn">{question.audio}</p>
                {question.audioPinyin && <p lang="zh-Latn-pinyin">{question.audioPinyin}</p>}
              </details>
            </div>
          )}
          {!answered && question.rule && (question.forms || question.tokens) && (
            <details className="text-sm">
              <summary className="cursor-pointer">{label('hint')}</summary>
              <p>{local(question.rule)}</p>
            </details>
          )}
          {question.forms ? (
            <form className="space-y-2" onSubmit={(event) => {
              event.preventDefault();
              if (normalize(written)) submit(question.forms.some((form) => normalize(form) === normalize(written)));
            }}>
              <label className="block text-sm">
                {label('write')}
                <input className="block w-full rounded-lg border border-[var(--hair)] bg-[var(--paper)] p-3 font-cn text-lg"
                  lang="zh-Hans" value={written} spellCheck={false} autoComplete="off" disabled={answered}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault();
                  }}
                  onChange={(event) => setWritten(event.target.value)} />
              </label>
              {!answered && <details className="text-sm">
                <summary className="cursor-pointer">{label('tiles')}</summary>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[...new Set([...normalize(question.forms[0])])].sort().map((char) => (
                    <button key={char} type="button" lang="zh-Hans" className={buttonClass} style={buttonStyle}
                      onClick={() => setWritten((value) => value + char)}>{char}</button>
                  ))}
                  <button type="button" className={buttonClass} style={buttonStyle} disabled={!written}
                    onClick={() => setWritten((value) => [...value].slice(0, -1).join(''))}>{label('undo')}</button>
                </div>
              </details>}
              {!answered && <div className="flex flex-wrap gap-2">
                <button type="submit" className={buttonClass} style={buttonStyle} disabled={!normalize(written)}>{label('check')}</button>
                <button type="button" className={buttonClass} style={buttonStyle} onClick={() => submit(false)}>{label('model')}</button>
              </div>}
            </form>
          ) : question.tokens ? (
            <>
              <p className="font-cn min-h-9 rounded-lg p-2" lang="zh-Hans" aria-live="polite" style={{ background: J.paper }}>{picked.map((i) => question.tokens[i]).join(' ')}</p>
              <div className="flex flex-wrap gap-2">
                {question.tokens.map((token, i) => (
                  <button key={i} type="button" lang="zh-Hans" className={buttonClass} style={buttonStyle} disabled={answered || picked.includes(i)} onClick={() => setPicked([...picked, i])}>{token}</button>
                ))}
              </div>
              {!answered && <div className="flex flex-wrap gap-2">
                <button type="button" className={buttonClass} style={buttonStyle} disabled={!picked.length} onClick={() => setPicked(picked.slice(0, -1))}>{label('undo')}</button>
                <button type="button" className={buttonClass} style={buttonStyle} disabled={picked.length !== question.tokens.length}
                  onClick={() => submit(question.answers.some((answer) => answer.every((i, position) => i === picked[position])))}>{label('check')}</button>
              </div>}
            </>
          ) : (
            <>
              <div className={question.map ? 'grid grid-cols-3 gap-1 rounded-lg p-2 text-sm' : 'flex flex-wrap gap-2'} style={question.map ? { background: J.jadeBg } : undefined}>
                {question.map && <span lang="zh-Hans" className="col-start-2 row-start-2 place-self-center font-cn">学校</span>}
                {question.options.map((option, i) => (
                  <PracticeOption key={i} disabled={answered} state={!answered ? 'idle' : i === question.answer ? 'correct' : picked[0] === i ? 'incorrect' : 'muted'}
                    className={question.map ? ['col-start-2 row-start-1', 'col-start-1 row-start-2', 'col-start-3 row-start-2', 'col-start-2 row-start-3'][i] : undefined}
                    lang={typeof option === 'string' && /\p{Script=Han}/u.test(option) ? 'zh-Hans' : undefined}
                    onClick={() => { setPicked([i]); submit(i === question.answer); }}>{local(option)}</PracticeOption>
                ))}
              </div>
            </>
          )}
          <PracticeFeedback correct={result}>
                {result ? label('correct') : <>{label(question.forms ? 'modelLabel' : 'answer')}: {question.forms?.[0] ?? (question.tokens
                  ? question.answers[0].map((i) => question.tokens[i]).join('')
                  : local(question.options[question.answer]))}</>}
                {question.rule && <p className="mt-1">{local(question.rule)}</p>}
          </PracticeFeedback>
          {answered && <PracticeNext ref={nextButton} onClick={next}>{label('next')}</PracticeNext>}
        </div>
      )}
    </PracticeCard>
  );
}
