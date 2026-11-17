import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Eye, EyeOff, Lightbulb, Volume2 } from 'lucide-react';
import { J, resolveColor } from '@/styles/tokens';
import { shuffle } from '@/utils/arrayUtils.js';
import { useLessonFilter } from '@/utils/lessonFilter.js';
import { hanziCharDataLoader, runWriterOp } from '@/utils/hanziCharData.js';
import { useMistakeReview } from '@/hooks/useMistakeReview.js';
import GameResults from './GameResults.jsx';

const ROUNDS = 10;
const HANZI_MODE = 'meaning-to-hanzi';
const MEANING_MODE = 'hanzi-to-meaning';

function normalizeMeaning(value) {
  return String(value || '')
    .replace(/[ñÑ]/g, '\uE000')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/\uE000/g, 'ñ')
    .replace(/[¿?¡!.,:()[\]{}"'’‘]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function meaningAnswers(value) {
  return String(value || '').split(/[;；]|\s+\/\s+/).map(normalizeMeaning).filter(Boolean);
}

function StrokeWriter({ character, onComplete }) {
  const { t } = useTranslation();
  const targetRef = useRef(null);
  const writerRef = useRef(null);
  const activeStrokeRef = useRef(0);
  const completeRef = useRef(onComplete);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  completeRef.current = onComplete;

  useEffect(() => {
    let mounted = true;
    let writer = null;
    activeStrokeRef.current = 0;
    setReady(false);
    setLoadError(false);

    const createWriter = async () => {
      try {
        const HanziWriter = await import('hanzi-writer');
        if (!mounted || !targetRef.current) return;
        targetRef.current.innerHTML = '';
        writer = HanziWriter.default.create(targetRef.current, character, {
          charDataLoader: hanziCharDataLoader,
          width: 220,
          height: 220,
          padding: 16,
          strokeColor: resolveColor(J.ink),
          outlineColor: resolveColor(J.hair),
          highlightColor: resolveColor(J.red),
          strokeAnimationSpeed: 1.6,
          strokeHighlightSpeed: 2,
          showCharacter: false,
          showOutline: false,
          onLoadCharDataSuccess: () => {
            if (mounted) setReady(true);
          },
          onLoadCharDataError: () => {
            if (mounted) setLoadError(true);
          },
        });
        writerRef.current = writer;
        runWriterOp(() => writer.quiz({
          showHintAfterMisses: 2,
          highlightColor: resolveColor(J.red),
          onCorrectStroke: ({ strokeNum }) => { activeStrokeRef.current = strokeNum + 1; },
          onComplete: () => completeRef.current?.(),
        }));
      } catch {
        if (mounted) setLoadError(true);
      }
    };

    createWriter();
    return () => {
      mounted = false;
      writer?.cancelQuiz?.();
      if (writerRef.current === writer) writerRef.current = null;
      if (targetRef.current) targetRef.current.innerHTML = '';
    };
  }, [character]);

  const showNextStroke = () => {
    const writer = writerRef.current;
    if (!writer || !ready) return;
    runWriterOp(() => writer.highlightStroke(activeStrokeRef.current));
  };

  return (
    <div className="w-full max-w-xs mx-auto rounded-2xl p-3" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
      <div ref={targetRef} className="mx-auto" style={{
        width: 220,
        height: 220,
        touchAction: 'none',
        border: `1px solid ${J.hair}`,
        borderRadius: 14,
        backgroundColor: J.paper,
        backgroundImage: `linear-gradient(to right, transparent calc(50% - 0.5px), ${J.hair} calc(50% - 0.5px), ${J.hair} calc(50% + 0.5px), transparent calc(50% + 0.5px)), linear-gradient(to bottom, transparent calc(50% - 0.5px), ${J.hair} calc(50% - 0.5px), ${J.hair} calc(50% + 0.5px), transparent calc(50% + 0.5px))`,
      }} />
      {loadError ? (
        <p role="status" className="text-center text-xs px-2 pb-2" style={{ color: J.redDeep }}>
          {t('vocab_write_unavailable')}
        </p>
      ) : !ready ? (
        <p role="status" className="text-center text-xs px-2 pb-2" style={{ color: J.mute }}>
          {t('vocab_write_loading')}
        </p>
      ) : (
        <button onClick={showNextStroke} className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold"
          style={{ background: J.redBg, color: J.redDeep, border: 0, cursor: 'pointer' }}>
          <Lightbulb size={16} /> {t('vocab_write_stroke_hint')}
        </button>
      )}
    </div>
  );
}

export default function VocabularyWriting({
  goBack,
  allCharacters = [],
  selectedLesson = null,
  showSupplementary = false,
  speak,
  onTrackResult,
}) {
  const { t } = useTranslation();
  const [lessonFilter, setLessonFilter] = useLessonFilter(selectedLesson);
  const [mode, setMode] = useState(HANZI_MODE);
  const [phase, setPhase] = useState('setup');
  const [rounds, setRounds] = useState([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [showPinyin, setShowPinyin] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const inputRef = useRef(null);
  const { mistakes, recordMistake, clearMistakes } = useMistakeReview();

  const lessons = useMemo(() => [...new Set(allCharacters
    .filter(word => showSupplementary || !word.isSupplementary)
    .map(word => word.lesson)
    .filter(Number.isFinite))].sort((a, b) => a - b), [allCharacters, showSupplementary]);

  const wordPool = useMemo(() => {
    const seen = new Set();
    return allCharacters.filter(word => {
      if (!word?.char || !word.meaning || (!showSupplementary && word.isSupplementary)) return false;
      if (lessonFilter !== null && word.lesson !== lessonFilter) return false;
      const key = `${word.char}|${normalizeMeaning(word.meaning)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allCharacters, lessonFilter, showSupplementary]);

  const current = rounds[roundIndex];
  const wordCharacters = useMemo(() => current ? Array.from(current.char) : [], [current]);

  const startGame = () => {
    if (wordPool.length === 0) return;
    const nextRounds = shuffle([...wordPool]).slice(0, ROUNDS);
    setRounds(nextRounds);
    setRoundIndex(0);
    setCorrectCount(0);
    setCharacterIndex(0);
    setAnswer('');
    setShowPinyin(false);
    setFeedback(null);
    clearMistakes();
    setPhase('playing');
  };

  const resolveCurrent = (isCorrect, chosen = '') => {
    if (!current || feedback) return;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setCorrectCount(count => count + 1);
    else recordMistake({ word: current, chosen });
    onTrackResult?.(current, isCorrect);
  };

  const checkMeaning = () => {
    if (!answer.trim()) return;
    const accepted = meaningAnswers(current.meaning);
    const isCorrect = accepted.includes(normalizeMeaning(answer));
    resolveCurrent(isCorrect, answer.trim());
  };

  const revealAnswer = () => resolveCurrent(false, t('vocab_write_unknown'));

  const advance = () => {
    if (roundIndex + 1 >= rounds.length) {
      setPhase('results');
      return;
    }
    setRoundIndex(index => index + 1);
    setCharacterIndex(0);
    setAnswer('');
    setShowPinyin(false);
    setFeedback(null);
  };

  const handleCharacterComplete = () => {
    if (characterIndex + 1 >= wordCharacters.length) {
      resolveCurrent(true);
    } else {
      setCharacterIndex(index => index + 1);
    }
  };

  if (phase === 'results') {
    return <GameResults
      gameId="vocabulary-writing"
      title={t('vocab_write_title')}
      subtitle={t(mode === HANZI_MODE ? 'vocab_write_mode_to_hanzi' : 'vocab_write_mode_to_meaning')}
      correct={correctCount}
      wrong={rounds.length - correctCount}
      mistakes={mistakes}
      onPlayAgain={startGame}
      onBack={goBack}
    />;
  }

  if (phase === 'setup') {
    const modeOptions = [
      { id: HANZI_MODE, cn: '汉', title: t('vocab_write_mode_to_hanzi'), detail: t('vocab_write_mode_to_hanzi_help') },
      { id: MEANING_MODE, cn: '文', title: t('vocab_write_mode_to_meaning'), detail: t('vocab_write_mode_to_meaning_help') },
    ];
    return (
      <div className="min-h-screen p-4 pb-24" style={{ background: J.paper }}>
        <div className="max-w-lg mx-auto pt-3">
          <button onClick={goBack} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer' }}>
            <ArrowLeft size={17} /> {t('minigames_back_to_minigames')}
          </button>
          <div className="text-center mb-6">
            <div className="font-cn mx-auto mb-3 flex items-center justify-center" style={{ width: 66, height: 66, borderRadius: 18, background: J.redBg, color: J.redDeep, fontSize: '2rem', fontWeight: 700 }}>卡</div>
            <h1 className="text-2xl font-bold" style={{ color: J.ink }}>{t('vocab_write_title')}</h1>
            <p className="text-sm mt-1" style={{ color: J.inkSoft }}>{t('vocab_write_description')}</p>
          </div>

          <p className="text-sm font-bold mb-2" style={{ color: J.ink }}>{t('vocab_write_choose_direction')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {modeOptions.map(option => {
              const selected = mode === option.id;
              return <button key={option.id} onClick={() => setMode(option.id)} aria-pressed={selected}
                className="text-left rounded-2xl p-4 transition-colors"
                style={{ background: selected ? J.redBg : J.paperHi, border: `2px solid ${selected ? J.red : J.hair}`, color: J.ink, cursor: 'pointer' }}>
                <span className="flex items-center gap-3 mb-2">
                  <span className="font-cn flex items-center justify-center rounded-xl text-xl font-bold" style={{ width: 40, height: 40, background: selected ? J.red : J.paper, color: selected ? J.onAccent : J.redDeep }}>{option.cn}</span>
                  <span className="font-bold">{option.title}</span>
                  {selected && <Check size={18} className="ml-auto" style={{ color: J.redDeep }} />}
                </span>
                <span className="block text-xs leading-relaxed" style={{ color: J.inkSoft }}>{option.detail}</span>
              </button>;
            })}
          </div>

          <div className="rounded-2xl p-4 mb-5" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
            <p className="text-sm font-bold mb-3" style={{ color: J.ink }}>{t('vocab_write_select_lesson')}</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setLessonFilter(null)} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: lessonFilter === null ? J.red : J.paper, color: lessonFilter === null ? J.onAccent : J.inkSoft, border: `1px solid ${lessonFilter === null ? J.red : J.hair}` }}>
                {t('vocab_write_all_lessons')}
              </button>
              {lessons.map(lesson => <button key={lesson} onClick={() => setLessonFilter(lesson)} className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{ background: lessonFilter === lesson ? J.red : J.paper, color: lessonFilter === lesson ? J.onAccent : J.inkSoft, border: `1px solid ${lessonFilter === lesson ? J.red : J.hair}` }}>
                L{lesson}
              </button>)}
            </div>
          </div>

          <p className="text-xs leading-relaxed mb-5 px-1" style={{ color: J.inkSoft }}>{t('vocab_write_instructions')}</p>
          {wordPool.length === 0 && <p role="status" className="text-sm mb-3" style={{ color: J.redDeep }}>{t('vocab_write_no_words')}</p>}
          <button onClick={startGame} disabled={wordPool.length === 0} className="w-full py-3.5 rounded-xl font-bold"
            style={{ background: wordPool.length ? J.red : J.hair, color: wordPool.length ? J.onAccent : J.mute, border: 0, cursor: wordPool.length ? 'pointer' : 'not-allowed' }}>
            {t('vocab_write_start', { count: Math.min(ROUNDS, wordPool.length) })}
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  const progress = ((roundIndex + (feedback ? 1 : 0)) / rounds.length) * 100;
  const isWriting = mode === HANZI_MODE;

  return (
    <div className="min-h-screen p-4 pb-24" style={{ background: J.paper }}>
      <div className="max-w-lg mx-auto">
        <header className="rounded-2xl p-4 mb-4" style={{ background: J.paperHi, border: `1px solid ${J.hair}`, borderLeft: `4px solid ${J.red}` }}>
          <button onClick={goBack} className="flex items-center gap-1.5 text-xs mb-3" style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer' }}>
            <ArrowLeft size={15} /> {t('minigames_back_to_minigames')}
          </button>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="font-bold" style={{ color: J.ink }}>{t('vocab_write_title')}</h1>
              <p className="text-xs mt-0.5" style={{ color: J.inkSoft }}>{t(isWriting ? 'vocab_write_mode_to_hanzi' : 'vocab_write_mode_to_meaning')}</p>
            </div>
            <span className="text-sm font-bold" style={{ color: J.redDeep }}>{roundIndex + 1}/{rounds.length}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: J.paperHi2 }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: J.red }} />
          </div>
        </header>

        <section className="rounded-2xl p-5 mb-4 text-center" style={{ background: J.paperHi, border: `1px solid ${J.hair}`, borderLeft: `4px solid ${J.red}` }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: J.mute }}>
            {t(isWriting ? 'vocab_write_prompt_meaning' : 'vocab_write_prompt_hanzi')}
          </p>
          {isWriting ? (
            <p className="text-2xl font-bold" style={{ color: J.ink }}>{current.meaning}</p>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <p className="font-cn text-5xl font-bold" style={{ color: J.ink }}>{current.char}</p>
              {speak && <button onClick={() => speak({ hanzi: current.char, pinyin: current.pinyin, pinyinNumeric: current.pinyinNumeric })}
                aria-label={t('vocab_write_listen')} className="rounded-full w-10 h-10 flex items-center justify-center" style={{ background: J.jadeBg, color: J.jadeDeep, border: 0, cursor: 'pointer' }}>
                <Volume2 size={18} />
              </button>}
            </div>
          )}
          <div className="mt-3">
            <button onClick={() => setShowPinyin(value => !value)} className="inline-flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: J.redDeep, background: 'none', border: 0, cursor: 'pointer' }}>
              {showPinyin ? <EyeOff size={14} /> : <Eye size={14} />}
              {t(showPinyin ? 'vocab_write_hide_pinyin' : 'vocab_write_show_pinyin')}
            </button>
            {showPinyin && <p className="text-lg mt-1" style={{ color: J.red }}>{current.pinyin}</p>}
          </div>
        </section>

        {isWriting && !feedback && (
          <section className="mb-4">
            <div className="flex justify-center items-center gap-2 mb-3" aria-label={`${characterIndex + 1}/${wordCharacters.length}`}>
              {wordCharacters.map((character, index) => <span key={`${index}-${character}`} className="font-cn w-9 h-9 rounded-lg flex items-center justify-center text-xl font-bold"
                style={{ background: index < characterIndex ? J.jadeBg : index === characterIndex ? J.redBg : J.paperHi, color: index < characterIndex ? J.jadeDeep : index === characterIndex ? J.redDeep : J.mute, border: `1px solid ${index === characterIndex ? J.red : J.hair}` }}>
                {index < characterIndex ? character : index === characterIndex ? '·' : '·'}
              </span>)}
            </div>
            <p className="text-center text-xs mb-2" style={{ color: J.inkSoft }}>{t('vocab_write_char_progress', { current: characterIndex + 1, total: wordCharacters.length })}</p>
            <StrokeWriter key={`${current.char}-${characterIndex}`} character={wordCharacters[characterIndex]} onComplete={handleCharacterComplete} />
          </section>
        )}

        {!isWriting && !feedback && (
          <section className="rounded-2xl p-4 mb-4" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
            <label htmlFor="vocabulary-meaning-answer" className="block text-sm font-semibold mb-2" style={{ color: J.ink }}>{t('vocab_write_answer_label')}</label>
            <input ref={inputRef} id="vocabulary-meaning-answer" value={answer} onChange={event => setAnswer(event.target.value)}
              onKeyDown={event => { if (event.key === 'Enter') checkMeaning(); }}
              placeholder={t('vocab_write_answer_placeholder')} autoComplete="off" autoCorrect="off" spellCheck={false}
              className="w-full rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[var(--red)]"
              style={{ background: J.paper, color: J.ink, border: `1px solid ${J.border}` }} />
            <button onClick={checkMeaning} disabled={!answer.trim()} className="w-full mt-3 rounded-xl py-3 font-bold"
              style={{ background: answer.trim() ? J.red : J.hair, color: answer.trim() ? J.onAccent : J.mute, border: 0, cursor: answer.trim() ? 'pointer' : 'not-allowed' }}>
              {t('vocab_write_check')}
            </button>
          </section>
        )}

        {!feedback && <button onClick={revealAnswer} className="w-full py-2.5 text-sm font-semibold rounded-xl"
          style={{ background: 'transparent', color: J.inkSoft, border: `1px solid ${J.hair}`, cursor: 'pointer' }}>
          {t('vocab_write_unknown')}
        </button>}

        {feedback && (
          <section role="status" className="rounded-2xl p-4" style={{ background: feedback === 'correct' ? J.jadeBg : J.redBg, border: `1px solid ${feedback === 'correct' ? J.jade : J.red}` }}>
            <p className="font-bold mb-1" style={{ color: feedback === 'correct' ? J.jadeDeep : J.redDeep }}>{t(feedback === 'correct' ? 'vocab_write_correct' : 'vocab_write_incorrect')}</p>
            <p className="font-cn text-3xl font-bold" style={{ color: J.ink }}>{current.char}</p>
            <p className="text-sm mt-1" style={{ color: J.ink }}>{current.pinyin} · {current.meaning}</p>
            {speak && <button onClick={() => speak({ hanzi: current.char, pinyin: current.pinyin, pinyinNumeric: current.pinyinNumeric })} className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold" style={{ color: J.jadeDeep, background: 'none', border: 0, cursor: 'pointer' }}><Volume2 size={14} /> {t('vocab_write_listen')}</button>}
            <button onClick={advance} className="w-full mt-4 rounded-xl py-3 font-bold" style={{ background: J.jade, color: J.onAccent, border: 0, cursor: 'pointer' }}>
              {t(roundIndex + 1 >= rounds.length ? 'vocab_write_results' : 'vocab_write_next')}
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
