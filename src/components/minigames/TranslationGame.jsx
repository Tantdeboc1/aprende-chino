// src/components/minigames/TranslationGame.jsx
// Minijuego: Traduce la frase (español → hanzi via IME de pinyin simulado)
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translationPhrases, getCandidates } from '@/data/translationPhrases.js';
import { shuffle } from '@/utils/arrayUtils.js';

const ROUNDS = 8;
const ACCENT_COLOR = {
  bg: 'bg-purple-600',
  border: 'border-purple-500',
  text: 'text-purple-400',
  hover: 'hover:bg-purple-700',
  bgLight: 'bg-purple-900/20',
};

// ── Sonidos ──────────────────────────────────────────────────────────────────
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'correct') {
      [523.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.25);
      });
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
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

// ── Construir ronda ──────────────────────────────────────────────────────────
function buildRounds() {
  return shuffle([...translationPhrases]).slice(0, ROUNDS);
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function TranslationGame({ goBack }) {
  const { t } = useTranslation();

  const [rounds, setRounds]           = useState([]);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [built, setBuilt]             = useState([]);
  const [pinyinInput, setPinyinInput] = useState('');
  const [candidates, setCandidates]   = useState([]);
  const [result, setResult]           = useState(null); // null | 'correct' | 'incorrect'
  const [score, setScore]             = useState(0);
  const [done, setDone]               = useState(false);
  const inputRef = useRef(null);

  const initGame = useCallback(() => {
    const r = buildRounds();
    setRounds(r);
    setCurrentIdx(0);
    setBuilt([]);
    setPinyinInput('');
    setCandidates([]);
    setResult(null);
    setScore(0);
    setDone(false);
  }, []);

  useEffect(() => { initGame(); }, [initGame]);

  // Enfocar el input al cambiar de pregunta
  useEffect(() => {
    if (!result) inputRef.current?.focus();
  }, [currentIdx, result]);

  const current = rounds[currentIdx];

  // ── Comparación bloque a bloque para colorear en verde/rojo ──────────────
  // IMPORTANTE: este hook debe estar ANTES de cualquier early return.
  const blockStatuses = useMemo(() => {
    if (!result || result === 'correct' || !current) return [];
    const solution = current.hanzi;
    let pos = 0;
    return built.map(block => {
      const allMatch = [...block].every((ch, i) => ch === solution[pos + i]);
      pos += block.length;
      return allMatch ? 'correct' : 'incorrect';
    });
  }, [result, built, current]);

  // ── Actualizar candidatos cuando cambia el input ─────────────────────────
  const handleInputChange = (e) => {
    const val = e.target.value;
    setPinyinInput(val);
    if (!val.trim()) { setCandidates([]); return; }
    setCandidates(getCandidates(val.trim()));
  };

  // ── Seleccionar candidato → añadir al texto construido ─────────────────
  const handleSelectCandidate = (candidate) => {
    setBuilt(prev => [...prev, candidate.hanzi]);
    setPinyinInput('');
    setCandidates([]);
    inputRef.current?.focus();
  };

  // ── Borrar último bloque ─────────────────────────────────────────────────
  const handleDeleteLast = () => {
    setBuilt(prev => prev.slice(0, -1));
    inputRef.current?.focus();
  };

  // ── Comprobar respuesta ───────────────────────────────────────────────────
  const handleCheck = () => {
    if (built.length === 0) return;
    const answer = built.join('');
    const correct = answer === current.hanzi;
    setResult(correct ? 'correct' : 'incorrect');
    if (correct) setScore(s => s + 1);
    playSound(correct ? 'correct' : 'incorrect');
  };

  // ── Siguiente pregunta ────────────────────────────────────────────────────
  const handleNext = () => {
    const next = currentIdx + 1;
    if (next >= rounds.length) { setDone(true); return; }
    setCurrentIdx(next);
    setBuilt([]);
    setPinyinInput('');
    setCandidates([]);
    setResult(null);
  };

  // ── Borrar todo lo construido ─────────────────────────────────────────────
  const handleClearBuilt = () => {
    setBuilt([]);
    setPinyinInput('');
    setCandidates([]);
    setResult(null);
    inputRef.current?.focus();
  };

  // ── Pantalla final ────────────────────────────────────────────────────────
  if (done) {
    const pct = rounds.length > 0 ? Math.round((score / rounds.length) * 100) : 0;
    const emoji = pct === 100 ? '\u{1F3C6}' : pct >= 70 ? '\u{1F44F}' : '\u{1F4AA}';
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="text-6xl mb-4">{emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-1">{t('translation_results_title')}</h2>
          <p className="text-gray-400 mb-6">{t('translation_results_subtitle')}</p>
          <div className="flex justify-center gap-8 mb-8">
            <div>
              <p className="text-4xl font-bold text-white">{score}/{rounds.length}</p>
              <p className="text-xs text-gray-500 mt-1">{t('translation_correct_label')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{pct}%</p>
              <p className="text-xs text-gray-500 mt-1">{t('translation_accuracy_label')}</p>
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={initGame}
              className={`w-full py-3 rounded-xl ${ACCENT_COLOR.bg} ${ACCENT_COLOR.hover} text-white font-bold transition-colors`}
            >
              {t('translation_play_again')}
            </button>
            <button
              onClick={goBack}
              className="w-full py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium transition-colors"
            >
              {t('translation_back')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Cargando ──────────────────────────────────────────────────────────────
  if (rounds.length === 0 || !current) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">{t('minigames_loading')}</p>
      </div>
    );
  }

  const builtText = built.join('');
  const progress = ((currentIdx + (result ? 1 : 0)) / rounds.length) * 100;

  // ── Juego principal ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-900 pb-8">

      {/* Header */}
      <div className={`bg-gray-800 border-b border-gray-700 border-l-4 ${ACCENT_COLOR.border} px-4 pt-10 pb-4`}>
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-3 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          {t('translation_back')}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white">{t('translation_title')}</h1>
            <p className="text-sm text-gray-400">{t('translation_subtitle')}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${ACCENT_COLOR.text}`}>{score}</p>
            <p className="text-xs text-gray-500">{currentIdx + 1}/{rounds.length}</p>
          </div>
        </div>
        {/* Barra de progreso */}
        <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${ACCENT_COLOR.bg} rounded-full transition-all duration-500`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-4">

        {/* Frase en español */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">{t('translation_translate_label')}</p>
          <p className="text-white font-semibold text-base leading-snug">{current.es}</p>
        </div>

        {/* Zona de construcción */}
        <div>
          <p className="text-xs text-gray-500 mb-2">{t('translation_built_zone')}</p>
          <div
            className={`min-h-[56px] rounded-xl border-2 p-3 flex flex-wrap items-center gap-1.5 transition-colors ${
              result === 'correct'   ? 'border-green-500 bg-green-900/20' :
              result === 'incorrect' ? 'border-red-500 bg-red-900/20'     :
              builtText.length > 0  ? `${ACCENT_COLOR.border} bg-gray-800` :
                                      'border-gray-600 bg-gray-800/50 border-dashed'
            }`}
          >
            {builtText.length === 0 && !result && (
              <p className="text-gray-600 text-sm">{t('translation_built_placeholder')}</p>
            )}

            {built.map((block, i) => (
              <button
                key={i}
                onClick={() => !result && setBuilt(prev => prev.filter((_, idx) => idx !== i))}
                disabled={!!result}
                title={result ? '' : t('translation_remove_block')}
                className={`px-2 py-1 rounded-lg text-xl font-bold transition-all
                  ${result === 'correct'
                    ? 'bg-green-700 text-white cursor-default'
                    : result === 'incorrect'
                      ? blockStatuses[i] === 'correct'
                        ? 'bg-green-700 text-white cursor-default'
                        : 'bg-red-700 text-white cursor-default'
                      : `${ACCENT_COLOR.bg} text-white hover:opacity-75 active:scale-95`}
                `}
              >
                {block}
              </button>
            ))}

            {builtText.length > 0 && !result && (
              <button
                onClick={handleDeleteLast}
                className="ml-auto text-gray-500 hover:text-red-400 text-xs px-2 py-1 rounded transition-colors"
                title={t('translation_delete_last')}
              >
                &#x232B;
              </button>
            )}
          </div>
        </div>

        {/* IME: input de pinyin + candidatos */}
        {!result && (
          <div>
            <p className="text-xs text-gray-500 mb-2">{t('translation_ime_label')}</p>
            <input
              ref={inputRef}
              type="text"
              value={pinyinInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && candidates.length > 0) {
                  handleSelectCandidate(candidates[0]);
                }
                if (e.key === 'Backspace' && pinyinInput === '' && built.length > 0) {
                  handleDeleteLast();
                }
              }}
              placeholder={t('translation_ime_placeholder')}
              className={`w-full px-4 py-3 rounded-xl bg-gray-800 border ${ACCENT_COLOR.border} text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base`}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
            />

            {candidates.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {candidates.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectCandidate(c)}
                    className="flex flex-col items-center px-3 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-purple-500 transition-all active:scale-95"
                  >
                    <span className="text-white text-xl font-bold leading-none">{c.hanzi}</span>
                    <span className="text-purple-400 text-xs mt-0.5">{c.pinyin}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback correcto */}
        {result === 'correct' && (
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl">&#x2705;</span>
            <div>
              <p className="text-green-400 font-bold text-sm">{t('translation_correct')}</p>
              <p className="text-gray-100 text-lg font-bold leading-tight">{current.hanzi}</p>
              {current.pinyin && (
                <p className="text-green-300 text-sm mt-0.5">{current.pinyin}</p>
              )}
            </div>
          </div>
        )}

        {/* Feedback incorrecto */}
        {result === 'incorrect' && (
          <div className="bg-red-900/30 border border-red-700 rounded-xl p-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">&#x274C;</span>
              <div>
                <p className="text-red-400 font-bold text-sm">{t('translation_incorrect')}</p>
                <p className="text-xs text-gray-400">
                  {t('translation_your_answer')}: <span className="text-gray-200">{builtText || '—'}</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-0.5">{t('translation_correct_answer')}</p>
            <p className="text-white font-bold text-lg leading-tight">{current.hanzi}</p>
            {current.pinyin && (
              <p className="text-red-300 text-sm mt-0.5">{current.pinyin}</p>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          {!result && (
            <>
              {builtText.length > 0 && (
                <button
                  onClick={handleClearBuilt}
                  className="py-3 px-4 rounded-xl border border-gray-600 text-gray-400 hover:text-white hover:border-gray-500 text-sm font-medium transition-colors"
                >
                  {t('translation_clear_button')}
                </button>
              )}
              <button
                onClick={handleCheck}
                disabled={builtText.length === 0}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors
                  ${builtText.length > 0
                    ? `${ACCENT_COLOR.bg} ${ACCENT_COLOR.hover} text-white`
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {t('translation_check_button')}
              </button>
            </>
          )}

          {result === 'correct' && (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm transition-colors"
            >
              {currentIdx + 1 >= rounds.length ? t('translation_see_results') : t('translation_next_button')} &rarr;
            </button>
          )}

          {result === 'incorrect' && (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold text-sm transition-colors"
            >
              {currentIdx + 1 >= rounds.length ? t('translation_see_results') : t('translation_next_button')} &rarr;
            </button>
          )}
        </div>

        {/* Ayuda rápida */}
        {!result && (
          <p className="text-center text-xs text-gray-600">{t('translation_ime_help')}</p>
        )}

      </div>
    </div>
  );
}
