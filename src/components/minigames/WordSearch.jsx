import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from '@/components/ui/Container.jsx';
import { J } from '@/styles/tokens';
import { buildWordSearch, getWordSearchPool } from '@/utils/wordSearch.js';

const VARIANTS = [
  { size: 5, count: 2 },
  { size: 6, count: 3 },
  { size: 7, count: 4 },
];
function selectionPath(a, b, size) {
  const r = Math.floor(a / size), c = a % size;
  const dr = Math.floor(b / size) - r, dc = b % size - c;
  if (dr !== 0 && dc !== 0) return [];
  return Array.from({ length: Math.max(Math.abs(dr), Math.abs(dc)) + 1 }, (_, i) =>
    (r + i * Math.sign(dr)) * size + c + i * Math.sign(dc));
}

export default function WordSearch({ goBack, characters = [] }) {
  const { t } = useTranslation();
  const [variant, setVariant] = useState(0);
  const [round, setRound] = useState(0);
  const [found, setFound] = useState([]);
  const [selection, setSelection] = useState([]);
  const [message, setMessage] = useState(null);
  const gesture = useRef(null);
  const boardRef = useRef(null);
  const { size, count } = VARIANTS[variant];
  const pool = useMemo(() => getWordSearchPool(characters, size), [characters, size]);
  const board = useMemo(() => buildWordSearch(size, count, round, pool), [size, count, round, pool]);
  const { cells = [], words = [] } = board || {};
  const completed = new Set(found.flatMap(item => item.path));

  function reset(next = variant) {
    gesture.current = null;
    setVariant(next); setFound([]); setSelection([]);
    setMessage(null);
  }
  function resolve(a, b) {
    const path = selectionPath(a, b, size);
    const text = path.map(i => cells[i]).join('');
    const index = words.findIndex(w => w.hanzi === text || Array.from(w.hanzi).reverse().join('') === text);
    if (index < 0) setMessage({ key: 'word_search_invalid' });
    else if (found.some(item => item.index === index)) setMessage({ key: 'word_search_already_found' });
    else {
      const next = [...found, { index, path }];
      setFound(next);
      setMessage(next.length === count ? { key: 'word_search_completed' } : { text: `${words[index].hanzi} · ${words[index].meaning}` });
    }
    gesture.current = null; setSelection([]);
  }
  function atPointer(event) {
    const cell = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-wordsearch-cell]');
    return cell && boardRef.current?.contains(cell) ? Number(cell.dataset.wordsearchCell) : null;
  }
  function pointerDown(event) {
    if (event.button !== 0) return;
    const index = atPointer(event);
    if (index === null) return;
    event.preventDefault();
    if (gesture.current?.waiting) { resolve(gesture.current.start, index); return; }
    gesture.current = { start: index, end: index, waiting: false };
    setSelection([index]);
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event) {
    const current = gesture.current;
    if (!current || current.waiting) return;
    const index = atPointer(event);
    if (index !== null) {
      current.end = index;
      setSelection(selectionPath(current.start, index, size));
    }
  }
  function pointerUp() {
    const current = gesture.current;
    if (!current || current.waiting) return;
    if (current.start === current.end) current.waiting = true;
    else resolve(current.start, current.end);
  }
  function keyboardSelect(index) {
    if (gesture.current?.waiting) resolve(gesture.current.start, index);
    else { gesture.current = { start: index, end: index, waiting: true }; setSelection([index]); }
  }

  return <div className="min-h-screen p-4 pb-24" style={{ background: J.paper }}>
    <Container>
      <button onClick={goBack} className="flex items-center gap-2 mb-6" style={{ color: J.inkSoft, cursor: 'pointer' }}>
        <ArrowLeft size={24} /> {t('minigames_back_to_minigames')}
      </button>
      <h1 className="text-2xl font-bold mb-2" style={{ color: J.ink }}>{t('word_search_title')}</h1>
      <p className="text-sm mb-4" style={{ color: J.inkSoft }}>{t('word_search_round', { count: round + 1 })}</p>
      <label className="block text-sm mb-2" htmlFor="wordsearch-size" style={{ color: J.inkSoft }}>{t('word_search_grid_label')}</label>
      <select id="wordsearch-size" value={variant} onChange={e => { setRound(0); reset(Number(e.target.value)); }}
        className="w-full rounded-xl p-3 mb-4 text-base" style={{ color: J.ink, background: J.paperHi, border: `1px solid ${J.border}` }}>
        {VARIANTS.map((v, i) => <option value={i} key={`${v.size}-${v.count}`}>{v.size}×{v.size} · {t('word_search_words', { count: v.count })}</option>)}
      </select>
      {!board ? <p role="status" style={{ color: J.inkSoft }}>{t('word_search_unavailable')}</p> : <>
      <p className="flex justify-between text-sm mb-3" style={{ color: J.inkSoft }}>
        <span>{t('word_search_progress', { found: found.length, total: count })}</span><span>{t('word_search_no_timer')}</span>
      </p>
      <div ref={boardRef} data-testid="wordsearch-board" aria-label={t('word_search_board', { size })}
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp}
        onPointerCancel={() => { gesture.current = null; setSelection([]); }}
        className="grid rounded-2xl overflow-hidden select-none"
        style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, touchAction: 'none', background: J.paperHi, border: `2px solid ${J.hair}` }}>
        {cells.map((char, i) => <button type="button" key={i} data-wordsearch-cell={i}
          aria-label={t('word_search_cell', { row: Math.floor(i / size) + 1, col: i % size + 1, char })}
          aria-pressed={completed.has(i)}
          onClick={e => { if (e.detail === 0) keyboardSelect(i); }}
          className="font-cn flex items-center justify-center aspect-square min-w-0 p-0"
          style={{ fontSize: size === 7 ? 'clamp(22px, 6vw, 28px)' : 'clamp(26px, 7vw, 32px)', cursor: 'pointer',
            color: completed.has(i) ? J.onAccent : selection.includes(i) ? J.jadeDeep : J.ink,
            background: completed.has(i) ? J.jade : selection.includes(i) ? J.jadeBg : 'transparent',
            boxShadow: `inset -1px -1px ${J.hair}` }}>{char}</button>)}
      </div>
      <p role="status" className="text-sm my-4 min-h-10" style={{ color: J.inkSoft }}>{message?.text || t(message?.key || 'word_search_hint')}</p>
      <div className="grid grid-cols-2 gap-3">
        {words.map((word, i) => <div key={word.hanzi} className="rounded-xl p-3 text-center"
          style={{ background: found.some(item => item.index === i) ? J.jadeBg : J.paperHi, border: `2px solid ${found.some(item => item.index === i) ? J.jade : J.hair}`, color: found.some(item => item.index === i) ? J.jadeDeep : J.ink }}>
          <p data-testid="wordsearch-word" className="font-cn text-2xl font-bold">{word.hanzi}{found.some(item => item.index === i) && ' ✓'}</p>
          <p className="text-sm">{word.pinyin}</p><p className="text-xs mt-1">{word.meaning}</p>
        </div>)}
      </div>
      <button onClick={() => { reset(); setRound(previous => previous + 1); }}
        className="flex items-center justify-center gap-2 w-full rounded-xl p-3 mt-5 font-bold"
        style={{ background: J.red, color: J.onAccent, cursor: 'pointer', minHeight: 48 }}>
        {t('word_search_new')} <ArrowRight size={18} />
      </button>
      </>}
    </Container>
  </div>;
}
