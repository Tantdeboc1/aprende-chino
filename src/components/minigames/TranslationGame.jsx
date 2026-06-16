// src/components/minigames/TranslationGame.jsx
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translationPhrases, getCandidates } from '@/data/translationPhrases.js';
import { shuffle } from '@/utils/arrayUtils.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import { LESSON_NUMBERS } from '@/styles/lessonColors.js';
import { useLessonFilter } from '@/utils/lessonFilter.js';
import { shouldShowIntro } from '@/utils/gameIntroPrefs.js';
import GameIntro from './GameIntro.jsx';
import GameResults from './GameResults.jsx';

const ROUNDS = 8;
const ACCENT_COLOR = {
  bg: 'bg-[#c8392f]',
  border: 'border-[#c8392f]',
  text: 'text-[#c8392f]',
  hover: 'hover:bg-[#8b1f1a]',
};

// ── Google IME Handwriting API ──────────────────────────────────────────────
const GOOGLE_IME_URL =
  'https://inputtools.google.com/request?ime=handwriting&app=gws&cs=1&itc=zh-t-i0-handwrit';

async function recognizeStrokes(strokes, width, height) {
  const ink = strokes.map(stroke => [
    stroke.map(p => p.x),
    stroke.map(p => p.y),
    stroke.map(p => p.t),
  ]);
  const payload = {
    device: navigator.userAgent,
    options: 'enable_pre_space',
    requests: [{
      writing_guide: { writing_area_width: width, writing_area_height: height },
      ink,
      language: 'zh-CN',
    }],
  };
  const res = await fetch(`${GOOGLE_IME_URL}&num=8`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  // data[1][0][1] → array of candidate strings
  return data?.[1]?.[0]?.[1] ?? [];
}

// ── Panel de escritura a mano ─────────────────────────────────────────────
function HandwritingPanel({ onCharSelected }) {
  const canvasRef     = useRef(null);
  const strokesRef    = useRef([]);      // trazos completados [{x,y,t}[]]
  const currentRef    = useRef(null);    // trazo en curso
  const isDrawingRef  = useRef(false);
  const timerRef      = useRef(null);

  const [candidates, setCandidates] = useState([]);
  const [status, setStatus]         = useState('idle'); // idle | recognizing | error | success
  const [strokeCount, setStrokeCount] = useState(0);
  const CANVAS_SIZE = 256;

  // ── Dibujo en canvas ────────────────────────────────────────────────────
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const S = CANVAS_SIZE;
    ctx.clearRect(0, 0, S, S);

    // Grid de práctica chino
    ctx.save();
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 4]);
    [[S/2, 0, S/2, S], [0, S/2, S, S/2], [0, 0, S, S], [S, 0, 0, S]].forEach(([x1,y1,x2,y2]) => {
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, S, S);
    ctx.restore();

    // Trazos completados
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const stroke of strokesRef.current) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y);
      ctx.stroke();
    }

    // Trazo en curso (púrpura)
    if (currentRef.current?.length > 1) {
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(currentRef.current[0].x, currentRef.current[0].y);
      for (let i = 1; i < currentRef.current.length; i++) ctx.lineTo(currentRef.current[i].x, currentRef.current[i].y);
      ctx.stroke();
    }
  }, []);

  useEffect(() => { redraw(); }, [redraw]);

  const getPoint = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: Math.round((src.clientX - rect.left) * scaleX),
      y: Math.round((src.clientY - rect.top) * scaleY),
      t: Date.now(),
    };
  };

  // ── Reconocimiento tras pausa ───────────────────────────────────────────
  const triggerRecognize = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (strokesRef.current.length === 0) return;
      setStatus('recognizing');
      try {
        const results = await recognizeStrokes(strokesRef.current, CANVAS_SIZE, CANVAS_SIZE);
        // Filtrar solo caracteres CJK individuales
        const chars = [];
        for (const r of results) {
          for (const ch of r) {
            if (/[一-鿿]/.test(ch) && !chars.includes(ch)) chars.push(ch);
          }
        }
        setCandidates(chars.slice(0, 8));
        setStatus('idle');
      } catch (err) {
        console.warn('IME error:', err);
        setStatus('error');
      }
    }, 800); // 800ms de pausa antes de reconocer
  }, []);

  // ── Pointer handlers ────────────────────────────────────────────────────
  const onDown = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawingRef.current = true;
    currentRef.current = [getPoint(e, canvas)];
    redraw();
  }, [redraw]);

  const onMove = useCallback((e) => {
    e.preventDefault();
    if (!isDrawingRef.current || !currentRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    currentRef.current.push(getPoint(e, canvas));
    redraw();
  }, [redraw]);

  const onUp = useCallback((e) => {
    e.preventDefault();
    if (!isDrawingRef.current || !currentRef.current) return;
    isDrawingRef.current = false;
    if (currentRef.current.length > 0) {
      strokesRef.current = [...strokesRef.current, currentRef.current];
      setStrokeCount(strokesRef.current.length);
    }
    currentRef.current = null;
    redraw();
    triggerRecognize();
  }, [redraw, triggerRecognize]);

  // ── Deshacer último trazo ───────────────────────────────────────────────
  const handleUndo = () => {
    if (strokesRef.current.length === 0) return;
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    redraw();
    if (strokesRef.current.length > 0) triggerRecognize();
    else setCandidates([]);
  };

  // ── Borrar todo ─────────────────────────────────────────────────────────
  const handleClear = () => {
    strokesRef.current = [];
    currentRef.current = null;
    setCandidates([]);
    setStatus('idle');
    setStrokeCount(0);
    clearTimeout(timerRef.current);
    redraw();
  };

  // ── Flash verde al seleccionar ──────────────────────────────────────────
  const flashSuccess = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const S = CANVAS_SIZE;
    ctx.save();
    ctx.fillStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.fillRect(0, 0, S, S);
    ctx.restore();
    setTimeout(() => redraw(), 300);
  };

  // ── Seleccionar candidato ───────────────────────────────────────────────
  const handleSelect = (ch) => {
    setStatus('success');
    flashSuccess();
    setTimeout(() => {
      onCharSelected(ch);
      handleClear();
    }, 300);
  };

  const canvasBorder =
    status === 'success'     ? 'border-[#2f6b4a]' :
    status === 'recognizing' ? 'border-[#c8392f] animate-pulse' :
    strokeCount > 0          ? 'border-[#c8392f]' :
                               'border-[rgba(28,24,19,0.18)]';

  return (
    <div className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] rounded-2xl p-4 space-y-3">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-xs font-semibold text-[#c8392f] uppercase tracking-wide">Dibujar hanzi</p>
          {strokeCount > 0 && (
            <span className="text-xs text-[#928a76]">{strokeCount} trazo{strokeCount !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={handleUndo} disabled={strokeCount === 0}
            className="text-xs px-2 py-1 rounded-lg border border-[rgba(28,24,19,0.18)] text-[#928a76] hover:text-[#1c1813] hover:border-[rgba(28,24,19,0.18)] transition-colors disabled:opacity-30">
            ↩ Deshacer
          </button>
          <button onClick={handleClear} disabled={strokeCount === 0}
            className="text-xs px-2 py-1 rounded-lg border border-[rgba(28,24,19,0.18)] text-[#928a76] hover:text-[#c8392f] hover:border-[#c8392f] transition-colors disabled:opacity-30">
            Borrar
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center" onTouchStart={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className={`rounded-xl border-2 bg-[#f4ecdc] touch-none cursor-crosshair transition-colors duration-300 ${canvasBorder}`}
          style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        />
      </div>

      {/* Estado */}
      {status === 'recognizing' && (
        <p className="text-center text-xs text-[#c8392f] animate-pulse">Reconociendo…</p>
      )}
      {status === 'success' && (
        <p className="text-center text-xs text-[#2f6b4a] font-semibold">✓ Añadido</p>
      )}
      {status === 'error' && (
        <p className="text-center text-xs text-[#c8392f]">Sin conexión. Prueba el modo Pinyin.</p>
      )}
      {status === 'idle' && candidates.length === 0 && strokeCount === 0 && (
        <p className="text-center text-xs text-[#928a76]">Dibuja un carácter y espera los candidatos</p>
      )}

      {/* Candidatos */}
      {candidates.length > 0 && status !== 'success' && (
        <div>
          <p className="text-xs text-[#928a76] mb-2">Toca el carácter correcto:</p>
          <div className="flex flex-wrap gap-2">
            {candidates.map((ch, i) => (
              <button key={i} onClick={() => handleSelect(ch)}
                className={`rounded-xl border-2 font-bold transition-all active:scale-95 text-[#1c1813]
                  ${i === 0
                    ? 'w-14 h-14 text-3xl border-[#c8392f] bg-[#f0d6cf]/60 hover:bg-[#8b1f1a]/70 shadow-lg shadow-[#c8392f]/20'
                    : 'w-12 h-12 text-2xl border-[rgba(28,24,19,0.18)] bg-[#f8f1de] hover:border-[#c8392f] hover:bg-[#f0d6cf]/40'
                  }`}>
                {ch}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sonidos ──────────────────────────────────────────────────────────────────
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'correct') {
      [523.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.25);
      });
    } else {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.35);
    }
  } catch (_) {}
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function TranslationGame({ goBack, selectedLesson }) {
  const { t, i18n } = useTranslation();
  const [started, setStarted] = useState(() => !shouldShowIntro('translation-game'));

  const [rounds, setRounds]           = useState([]);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [built, setBuilt]             = useState([]);
  const [pinyinInput, setPinyinInput] = useState('');
  const [candidates, setCandidates]   = useState([]);
  const [result, setResult]           = useState(null);
  const [score, setScore]             = useState(0);
  const [done, setDone]               = useState(false);
  const [inputMode, setInputMode]     = useState('pinyin'); // 'pinyin' | 'draw'
  const [lessonFilter, setLessonFilter] = useLessonFilter(selectedLesson);
  const inputRef = useRef(null);

  const initGame = useCallback((filter = lessonFilter) => {
    const pool = filter !== null
      ? translationPhrases.filter(p => p.lesson === filter)
      : translationPhrases;
    setRounds(shuffle([...pool]).slice(0, ROUNDS));
    setCurrentIdx(0); setBuilt([]); setPinyinInput('');
    setCandidates([]); setResult(null); setScore(0);
    setDone(false); setInputMode('pinyin');
  }, [lessonFilter]);

  useEffect(() => { initGame(lessonFilter); }, [lessonFilter, initGame]);

  useEffect(() => {
    if (!result && inputMode === 'pinyin') inputRef.current?.focus();
  }, [currentIdx, result, inputMode]);

  useEffect(() => { setInputMode('pinyin'); }, [currentIdx]);

  const current = rounds[currentIdx];

  const blockStatuses = useMemo(() => {
    if (!result || result === 'correct' || !current) return [];
    const solution = current.hanzi.replace(/[。！？.!?]+$/g, '');
    let pos = 0;
    return built.map(block => {
      const clean = block.replace(/[。！？.!?]+$/g, '');
      const ok = [...clean].every((ch, i) => ch === solution[pos + i]);
      pos += clean.length;
      return ok ? 'correct' : 'incorrect';
    });
  }, [result, built, current]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setPinyinInput(val);
    setCandidates(val.trim() ? getCandidates(val.trim()) : []);
  };

  const handleSelectCandidate = (c) => {
    setBuilt(prev => [...prev, c.hanzi]);
    setPinyinInput(''); setCandidates([]);
    inputRef.current?.focus();
  };

  const handleCharDrawn = useCallback((ch) => {
    setBuilt(prev => [...prev, ch]);
  }, []);

  const handleDeleteLast = () => {
    setBuilt(prev => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  const stripPunct = (s) => s.replace(/[。！？.!?]+$/g, '');

  const handleCheck = () => {
    if (!built.length) return;
    const answer = stripPunct(built.join(''));
    const solutions = (current.alt || [current.hanzi]).map(stripPunct);
    const correct = solutions.includes(answer);
    setResult(correct ? 'correct' : 'incorrect');
    if (correct) setScore(s => s + 1);
    playSound(correct ? 'correct' : 'incorrect');
    if (correct) hapticSuccess(); else hapticError();
  };

  const handleNext = () => {
    const next = currentIdx + 1;
    if (next >= rounds.length) { setDone(true); return; }
    setCurrentIdx(next); setBuilt([]); setPinyinInput('');
    setCandidates([]); setResult(null);
  };

  const handleClearBuilt = () => {
    setBuilt([]); setPinyinInput(''); setCandidates([]); setResult(null);
    inputRef.current?.focus();
  };

  // ── Pantalla de explicación ───────────────────────────────────────────────
  if (!started) {
    return (
      <GameIntro
        gameId="translation-game"
        cn="译"
        title={t('translation_title')}
        subtitle={t('translation_subtitle')}
        steps={[
          t('translation_intro_1', 'Lee la frase y tradúcela escribiéndola en caracteres chinos.'),
          t('translation_intro_2', 'Escribe pinyin sin tonos y toca el candidato correcto para añadir cada palabra.'),
          t('translation_intro_3', 'También puedes dibujar los caracteres a mano con el modo "Dibujar".'),
          t('translation_intro_4', 'Son 8 frases por ronda. Puedes filtrar por lección.'),
        ]}
        onStart={() => setStarted(true)}
        onBack={goBack}
      />
    );
  }

  // ── Pantalla final ────────────────────────────────────────────────────────
  if (done) {
    return (
      <GameResults
        title={t('translation_results_title')}
        subtitle={t('translation_results_subtitle')}
        correct={score}
        wrong={rounds.length - score}
        onPlayAgain={() => initGame(lessonFilter)}
        onBack={goBack}
      />
    );
  }

  if (rounds.length === 0 || !current) {
    return <div className="min-h-screen bg-[#f4ecdc] flex items-center justify-center"><p className="text-[#928a76]">{t('minigames_loading')}</p></div>;
  }

  const builtText = built.join('');
  const progress = ((currentIdx + (result ? 1 : 0)) / rounds.length) * 100;

  return (
    <div className="min-h-screen bg-[#f4ecdc] pb-8">

      {/* Header */}
      <div className={`bg-[#fbf5e6] border-b border-[rgba(28,24,19,0.10)] border-l-4 ${ACCENT_COLOR.border} px-4 pt-10 pb-4`}>
        <button onClick={goBack} className="flex items-center gap-1.5 text-[#928a76] hover:text-[#1c1813] text-sm mb-3 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          {t('translation_back')}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#1c1813]">{t('translation_title')}</h1>
            <p className="text-sm text-[#928a76]">{t('translation_subtitle')}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${ACCENT_COLOR.text}`}>{score}</p>
            <p className="text-xs text-[#928a76]">{currentIdx + 1}/{rounds.length}</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-[#f8f1de] rounded-full overflow-hidden">
          <div className={`h-full ${ACCENT_COLOR.bg} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-4">

        {/* Filtro de lección */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setLessonFilter(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              lessonFilter === null
                ? `${ACCENT_COLOR.bg} text-[#fbf5e6] border-transparent`
                : 'bg-[#fbf5e6] text-[#928a76] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'
            }`}
          >
            {t('sov_all_lessons') || 'Todas'}
          </button>
          {LESSON_NUMBERS.map(n => (
            <button
              key={n}
              onClick={() => setLessonFilter(n)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                lessonFilter === n
                  ? `${ACCENT_COLOR.bg} text-[#fbf5e6] border-transparent`
                  : 'bg-[#fbf5e6] text-[#928a76] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'
              }`}
            >
              L{n}
            </button>
          ))}
        </div>

        {/* Frase en el idioma del usuario */}
        <div className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] rounded-xl p-4">
          <p className="text-xs text-[#928a76] mb-1">{t('translation_translate_label')}</p>
          <p className="text-[#1c1813] font-semibold text-base leading-snug">
            {current.translations?.[i18n.language] || current.translations?.es || current.es}
          </p>
        </div>

        {/* Zona de construcción */}
        <div>
          <p className="text-xs text-[#928a76] mb-2">{t('translation_built_zone')}</p>
          <div className={`min-h-[56px] rounded-xl border-2 p-3 flex flex-wrap items-center gap-1.5 transition-colors ${
            result === 'correct'   ? 'border-[#2f6b4a] bg-[#cfe1d3]/20' :
            result === 'incorrect' ? 'border-[#c8392f] bg-[#f0d6cf]/20'     :
            builtText.length > 0  ? `${ACCENT_COLOR.border} bg-[#fbf5e6]` :
                                    'border-[rgba(28,24,19,0.18)] bg-[#fbf5e6]/50 border-dashed'
          }`}>
            {builtText.length === 0 && !result && <p className="text-[#928a76] text-sm">{t('translation_built_placeholder')}</p>}
            {built.map((block, i) => (
              <button key={i} onClick={() => !result && setBuilt(prev => prev.filter((_, idx) => idx !== i))}
                disabled={!!result}
                className={`px-2 py-1 rounded-lg text-xl font-bold transition-all ${
                  result === 'correct' ? 'bg-[#2f6b4a] text-[#fbf5e6] cursor-default' :
                  result === 'incorrect' ? (blockStatuses[i] === 'correct' ? 'bg-[#2f6b4a] text-[#fbf5e6] cursor-default' : 'bg-[#c8392f] text-[#fbf5e6] cursor-default') :
                  `${ACCENT_COLOR.bg} text-[#fbf5e6] hover:opacity-75 active:scale-95`
                }`}>
                {block}
              </button>
            ))}
            {builtText.length > 0 && !result && (
              <button onClick={handleDeleteLast} className="ml-auto text-[#928a76] hover:text-[#c8392f] text-xs px-2 py-1 rounded transition-colors">&#x232B;</button>
            )}
          </div>
        </div>

        {/* Toggle de modo */}
        {!result && (
          <div className="flex gap-2">
            <button onClick={() => setInputMode('pinyin')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${
                inputMode === 'pinyin' ? 'bg-[#f0d6cf]/50 border-[#c8392f] text-[#c8392f]' : 'bg-[#fbf5e6] border-[rgba(28,24,19,0.10)] text-[#928a76] hover:border-[rgba(28,24,19,0.18)]'
              }`}>
              ⌨️ Pinyin IME
            </button>
            <button onClick={() => setInputMode('draw')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all border ${
                inputMode === 'draw' ? 'bg-[#f0d6cf]/50 border-[#c8392f] text-[#c8392f]' : 'bg-[#fbf5e6] border-[rgba(28,24,19,0.10)] text-[#928a76] hover:border-[rgba(28,24,19,0.18)]'
              }`}>
              Dibujar
            </button>
          </div>
        )}

        {/* Pinyin IME */}
        {!result && inputMode === 'pinyin' && (
          <div>
            <input ref={inputRef} type="text" value={pinyinInput} onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && candidates.length > 0) handleSelectCandidate(candidates[0]);
                if (e.key === 'Backspace' && pinyinInput === '' && built.length > 0) handleDeleteLast();
              }}
              placeholder={t('translation_ime_placeholder')}
              className={`w-full px-4 py-3 rounded-xl bg-[#fbf5e6] border ${ACCENT_COLOR.border} text-[#1c1813] placeholder-[#6e6757] focus:outline-none focus:ring-2 focus:ring-[#c8392f] text-base`}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            />
            {candidates.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {candidates.map((c, i) => (
                  <button key={i} onClick={() => handleSelectCandidate(c)}
                    className="flex flex-col items-center px-3 py-2 rounded-xl bg-[#f8f1de] hover:bg-[#bdb39a] border border-[rgba(28,24,19,0.18)] hover:border-[#c8392f] transition-all active:scale-95">
                    <span className="text-[#1c1813] text-xl font-bold leading-none">{c.hanzi}</span>
                    <span className="text-[#c8392f] text-xs mt-0.5">{c.pinyin}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Panel de escritura a mano */}
        {!result && inputMode === 'draw' && (
          <HandwritingPanel onCharSelected={handleCharDrawn} />
        )}

        {/* Feedback */}
        {result === 'correct' && (
          <div className="bg-[#cfe1d3]/30 border border-[#2f6b4a] rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">&#x2705;</span>
            <div>
              <p className="text-[#2f6b4a] font-bold text-sm">{t('translation_correct')}</p>
              <p className="text-[#1c1813] text-lg font-bold leading-tight">{current.hanzi}</p>
              {current.pinyin && <p className="text-[#5a8f72] text-sm mt-0.5">{current.pinyin}</p>}
            </div>
          </div>
        )}
        {result === 'incorrect' && (
          <div className="bg-[#f0d6cf]/30 border border-[#c8392f] rounded-xl p-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">&#x274C;</span>
              <div>
                <p className="text-[#c8392f] font-bold text-sm">{t('translation_incorrect')}</p>
                <p className="text-xs text-[#928a76]">{t('translation_your_answer')}: <span className="text-[#1c1813]">{builtText || '—'}</span></p>
              </div>
            </div>
            <p className="text-xs text-[#928a76] mb-0.5">{t('translation_correct_answer')}</p>
            <p className="text-[#1c1813] font-bold text-lg leading-tight">{current.hanzi}</p>
            {current.pinyin && <p className="text-[#c8392f] text-sm mt-0.5">{current.pinyin}</p>}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          {!result && (
            <>
              {builtText.length > 0 && (
                <button onClick={handleClearBuilt}
                  className="py-3 px-4 rounded-xl border border-[rgba(28,24,19,0.18)] text-[#928a76] hover:text-[#1c1813] hover:border-[rgba(28,24,19,0.18)] text-sm font-medium transition-colors">
                  {t('translation_clear_button')}
                </button>
              )}
              <button onClick={handleCheck} disabled={builtText.length === 0}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${
                  builtText.length > 0 ? `${ACCENT_COLOR.bg} ${ACCENT_COLOR.hover} text-[#fbf5e6]` : 'bg-[#f8f1de] text-[#928a76] cursor-not-allowed'
                }`}>
                {t('translation_check_button')}
              </button>
            </>
          )}
          {result === 'correct' && (
            <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-bold text-sm transition-colors">
              {currentIdx + 1 >= rounds.length ? t('translation_see_results') : t('translation_next_button')} &rarr;
            </button>
          )}
          {result === 'incorrect' && (
            <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-[#f8f1de] hover:bg-[#bdb39a] text-[#5b5446] font-bold text-sm transition-colors">
              {currentIdx + 1 >= rounds.length ? t('translation_see_results') : t('translation_next_button')} &rarr;
            </button>
          )}
        </div>

        {!result && inputMode === 'pinyin' && (
          <p className="text-center text-xs text-[#928a76]">{t('translation_ime_help')}</p>
        )}
        {!result && inputMode === 'draw' && (
          <p className="text-center text-xs text-[#928a76]">{t('translation_draw_help')}</p>
        )}

      </div>
    </div>
  );
}
