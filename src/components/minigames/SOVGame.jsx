// src/components/minigames/SOVGame.jsx
// Minijuego: Ordena las palabras para formar la frase correcta
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import sovData from '@/data/sovData.js';
import { shuffle } from '@/utils/arrayUtils.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import { useLessonFilter } from '@/utils/lessonFilter.js';
import { shouldShowIntro } from '@/utils/gameIntroPrefs.js';
import GameIntro from './GameIntro.jsx';
import GameResults from './GameResults.jsx';

// Filtra frases por lección y prepara estado inicial
function buildRound(lessonFilter) {
  const pool = lessonFilter !== null
    ? sovData.filter(d => d.lesson === lessonFilter)
    : sovData;
  // Selecciona hasta 8 frases aleatorias
  const selected = shuffle(pool).slice(0, 8);
  return selected.map(d => ({
    ...d,
    shuffled: shuffle(d.words),
  }));
}

import { LESSON_COLORS, DEFAULT_LESSON_COLOR as DEFAULT_COLOR, LESSON_NUMBERS } from '@/styles/lessonColors.js';


// ── Feedback de sonido via Web Audio API ────────────────────────────────────
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'correct') {
      // Dos tonos ascendentes: un "ding" agradable
      [523.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.25);
      });
    } else {
      // Tono grave descendente: "bong" de error
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Web Audio no disponible — ignorar
  }
}

export default function SOVGame({ goBack, selectedLesson, speakChinese }) {
  const { t, i18n } = useTranslation();
  const [started, setStarted] = useState(() => !shouldShowIntro('sov-game'));

  // Estado de la ronda
  const [rounds, setRounds]           = useState([]);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [placed, setPlaced]           = useState([]);    // palabras en la zona de respuesta
  const [available, setAvailable]     = useState([]);    // palabras disponibles (chips)
  const [result, setResult]           = useState(null);  // null | 'correct' | 'incorrect'
  const [showHint, setShowHint]       = useState(false);
  const [score, setScore]             = useState(0);
  const [done, setDone]               = useState(false);
  const [lessonFilter, setLessonFilter] = useLessonFilter(selectedLesson);

  // Inicializar ronda
  const initRound = useCallback((filter) => {
    const r = buildRound(filter);
    setRounds(r);
    setCurrentIdx(0);
    setScore(0);
    setDone(false);
    setPlaced([]);
    setAvailable(r.length > 0 ? r[0].shuffled.map((w, i) => ({ word: w, id: i })) : []);
    setResult(null);
    setShowHint(false);
  }, []);

  useEffect(() => {
    initRound(lessonFilter);
  }, [lessonFilter, initRound]);

  const current = rounds[currentIdx];
  const accent  = LESSON_COLORS[current?.lesson] || DEFAULT_COLOR;

  // Los datos traen translations/hints por idioma; resolvemos según el idioma
  // activo con fallback a español.
  const lang = i18n.language?.split('-')[0];
  const currentTranslation = current?.translations?.[lang] || current?.translations?.es || current?.translation || '';
  const currentHint        = current?.hints?.[lang] || current?.hints?.es || current?.hint || '';

  // Mover chip de disponibles → zona respuesta
  const handlePickWord = (item) => {
    if (result) return;
    setAvailable(prev => prev.filter(x => x.id !== item.id));
    setPlaced(prev => [...prev, item]);
  };

  // Mover chip de zona respuesta → disponibles
  const handleRemoveWord = (item) => {
    if (result) return;
    setPlaced(prev => prev.filter(x => x.id !== item.id));
    setAvailable(prev => [...prev, item]);
  };

  // Comprobar respuesta
  const handleCheck = () => {
    if (placed.length === 0) return;
    const answer = placed.map(x => x.word).join('');
    const correct = answer === current.sentence;
    setResult(correct ? 'correct' : 'incorrect');
    if (correct) {
      setScore(s => s + 1);
    } else {
      // Reproducir audio de la frase correcta al fallar
      speakChinese?.({ hanzi: current.sentence, pinyin: '' });
    }
    playSound(correct ? 'correct' : 'incorrect');
    if (correct) hapticSuccess(); else hapticError();
  };

  // Siguiente pregunta
  const handleNext = () => {
    const next = currentIdx + 1;
    if (next >= rounds.length) {
      setDone(true);
      return;
    }
    setCurrentIdx(next);
    setPlaced([]);
    setAvailable(rounds[next].shuffled.map((w, i) => ({ word: w, id: i })));
    setResult(null);
    setShowHint(false);
  };

  // Reintentar misma pregunta
  const handleRetry = () => {
    setPlaced([]);
    setAvailable(current.shuffled.map((w, i) => ({ word: w, id: i })));
    setResult(null);
    setShowHint(false);
  };

  // ── Pantalla de explicación ─────────────────────────────────────────────────
  if (!started) {
    return (
      <GameIntro
        gameId="sov-game"
        cn="序"
        title={t('sov_title')}
        subtitle={t('sov_subtitle')}
        steps={[
          t('sov_intro_1', 'Lee la traducción y ordena las palabras chinas para formar la frase correcta.'),
          t('sov_intro_2', 'Toca una palabra para añadirla a tu respuesta; tócala de nuevo para quitarla.'),
          t('sov_intro_3', 'Si te atascas, usa el botón "Pista" para ver una ayuda de gramática.'),
          t('sov_intro_4', 'Son 8 frases por ronda. Puedes filtrar por lección.'),
        ]}
        onStart={() => setStarted(true)}
        onBack={goBack}
      />
    );
  }

  // ── Pantalla de resultados finales ──────────────────────────────────────────
  if (done) {
    return (
      <GameResults
        title={t('sov_results_title')}
        subtitle={t('sov_results_subtitle')}
        correct={score}
        wrong={rounds.length - score}
        onPlayAgain={() => initRound(lessonFilter)}
        onBack={goBack}
      />
    );
  }

  // ── Pantalla de carga / sin datos ───────────────────────────────────────────
  if (rounds.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4ecdc] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-4xl"></p>
        <p className="text-[#928a76] text-center">{t('sov_no_data')}</p>
        <button
          onClick={() => setLessonFilter(null)}
          className="px-4 py-2 rounded-lg bg-[#f8f1de] text-[#5b5446] text-sm hover:bg-[#bdb39a] transition-colors"
        >
          {t('sov_all_lessons')}
        </button>
      </div>
    );
  }
  if (!current) {
    return (
      <div className="min-h-screen bg-[#f4ecdc] flex items-center justify-center">
        <p className="text-[#928a76]">{t('minigames_loading')}</p>
      </div>
    );
  }

  // ── Juego principal ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4ecdc] pb-8">

      {/* Header */}
      <div className={`bg-[#fbf5e6] border-b border-[rgba(28,24,19,0.10)] border-l-4 ${accent.border} px-4 pt-10 pb-4`}>
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-[#928a76] hover:text-[#1c1813] text-sm mb-3 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
          {t('sov_back')}
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[#1c1813]">{t('sov_title')}</h1>
            <p className="text-sm text-[#928a76]">{t('sov_subtitle')}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${accent.text}`}>{score}</p>
            <p className="text-xs text-[#928a76]">{currentIdx + 1}/{rounds.length}</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-3 h-1.5 bg-[#f8f1de] rounded-full overflow-hidden">
          <div
            className={`h-full ${accent.bg} rounded-full transition-all duration-500`}
            style={{ width: `${((currentIdx + (result ? 1 : 0)) / rounds.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-5">

        {/* Filtro de lección */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setLessonFilter(null)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              lessonFilter === null
                ? 'bg-[#c8392f] text-[#fbf5e6] border-transparent'
                : 'bg-[#fbf5e6] text-[#928a76] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'
            }`}
          >
            {t('sov_all_lessons')}
          </button>
          {LESSON_NUMBERS.map(n => (
            <button
              key={n}
              onClick={() => setLessonFilter(n)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                lessonFilter === n
                  ? `${LESSON_COLORS[n].bg} text-[#fbf5e6] border-transparent`
                  : 'bg-[#fbf5e6] text-[#928a76] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'
              }`}
            >
              L{n}
            </button>
          ))}
        </div>

        {/* Traducción */}
        <div className="bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] rounded-xl p-4">
          <p className="text-xs text-[#928a76] mb-1">{t('sov_translate_label')}</p>
          <p className="text-[#1c1813] font-semibold text-base leading-snug">{currentTranslation}</p>

          {showHint && (
            <div className="mt-2 pt-2 border-t border-[rgba(28,24,19,0.10)]">
              <p className="text-xs text-[#928a76] mb-0.5">{t('sov_hint_label')}</p>
              <p className="text-[#b88a3e] text-sm">{currentHint}</p>
            </div>
          )}
        </div>

        {/* Zona de respuesta */}
        <div>
          <p className="text-xs text-[#928a76] mb-2">{t('sov_answer_zone')}</p>
          <div
            className={`min-h-[52px] rounded-xl border-2 p-3 flex flex-wrap gap-2 transition-colors ${
              result === 'correct'   ? 'border-[#2f6b4a] bg-[#cfe1d3]/20' :
              result === 'incorrect' ? 'border-[#c8392f] bg-[#f0d6cf]/20'     :
              placed.length > 0     ? `${accent.border} bg-[#fbf5e6]`     :
                                      'border-[rgba(28,24,19,0.18)] bg-[#fbf5e6]/50 border-dashed'
            }`}
          >
            {placed.length === 0 && (
              <p className="text-[#928a76] text-sm self-center">{t('sov_drop_here')}</p>
            )}
            {placed.map(item => (
              <button
                key={item.id}
                onClick={() => handleRemoveWord(item)}
                disabled={!!result}
                className={`px-4 py-2 rounded-lg text-[#1c1813] font-bold text-lg transition-all
                  ${result === 'correct'   ? 'bg-[#2f6b4a] cursor-default' :
                    result === 'incorrect' ? 'bg-[#c8392f] cursor-default'   :
                                            `${accent.bg} hover:opacity-80 active:scale-95`}
                `}
              >
                {item.word}
              </button>
            ))}
          </div>
        </div>

        {/* Chips disponibles */}
        <div>
          <p className="text-xs text-[#928a76] mb-2">{t('sov_words_label')}</p>
          <div className="flex flex-wrap gap-2">
            {available.map(item => (
              <button
                key={item.id}
                onClick={() => handlePickWord(item)}
                disabled={!!result}
                className="px-4 py-2 rounded-lg bg-[#f8f1de] hover:bg-[#bdb39a] active:scale-95 text-[#1c1813] font-bold text-lg transition-all border border-[rgba(28,24,19,0.18)] hover:border-[rgba(28,24,19,0.18)]"
              >
                {item.word}
              </button>
            ))}
            {available.length === 0 && !result && (
              <p className="text-xs text-[#928a76] italic">{t('sov_all_placed')}</p>
            )}
          </div>
        </div>

        {/* Feedback de resultado */}
        {result === 'correct' && (
          <div className="bg-[#cfe1d3]/30 border border-[#2f6b4a] rounded-xl p-3 flex items-center gap-3">
            <span className="text-2xl"></span>
            <div>
              <p className="text-[#2f6b4a] font-bold text-sm">{t('sov_correct')}</p>
              <p className="text-[#5b5446] text-sm">{current.sentence}</p>
            </div>
          </div>
        )}
        {result === 'incorrect' && (
          <div className="bg-[#f0d6cf]/30 border border-[#c8392f] rounded-xl p-3">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl"></span>
              <p className="text-[#c8392f] font-bold text-sm">{t('sov_incorrect')}</p>
            </div>
            <p className="text-xs text-[#928a76]">{t('sov_correct_answer')}</p>
            <p className="text-[#1c1813] font-bold text-base mt-0.5">{current.sentence}</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3">
          {!result && (
            <>
              {!showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex-1 py-3 rounded-xl border border-[rgba(28,24,19,0.18)] text-[#928a76] hover:text-[#1c1813] hover:border-[rgba(28,24,19,0.18)] text-sm font-medium transition-colors"
                >
                  {t('sov_hint_button')}
                </button>
              )}
              <button
                onClick={handleCheck}
                disabled={placed.length === 0}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors
                  ${placed.length > 0
                    ? `${accent.bg} hover:opacity-90 text-[#1c1813]`
                    : 'bg-[#f8f1de] text-[#928a76] cursor-not-allowed'
                  }`}
              >
                {t('sov_check_button')}
              </button>
            </>
          )}

          {result === 'correct' && (
            <button
              onClick={handleNext}
              className="flex-1 py-3 rounded-xl bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-bold text-sm transition-colors"
            >
              {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')} →
            </button>
          )}

          {result === 'incorrect' && (
            <div className="flex gap-3 flex-1">
              <button
                onClick={handleRetry}
                className="flex-1 py-3 rounded-xl border border-[rgba(28,24,19,0.18)] text-[#928a76] hover:text-[#1c1813] text-sm font-medium transition-colors"
              >
                {t('sov_retry_button')}
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-3 rounded-xl bg-[#f8f1de] hover:bg-[#bdb39a] text-[#5b5446] font-bold text-sm transition-colors"
              >
                {currentIdx + 1 >= rounds.length ? t('sov_see_results') : t('sov_next_button')}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
