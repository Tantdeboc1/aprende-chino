// src/components/minigames/PronunciationPractice.jsx
// Mini-juego: pronuncia la frase en chino. Usa Web Speech API para reconocer
// la voz del usuario y compara con la frase esperada (algoritmo Levenshtein
// sobre caracteres CJK).
//
// Requiere permiso de micrófono y un navegador con SpeechRecognition
// (Chrome/Edge/Safari; Firefox no soportado a 2026).

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { translationPhrases } from '@/data/translationPhrases.js';
import { shuffle } from '@/utils/arrayUtils.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import { playSound } from '@/utils/gameAudio.js';
import { addXP } from '@/utils/streak.js';
import { updateChallengeProgress } from '@/utils/dailyChallenges.js';
import {
  recognize, isSpeechRecognitionSupported, SpeechErrorCode,
} from '@/utils/speechRecognition.js';
import { scorePronunciation } from '@/utils/pronunciationScore.js';
import { speakChineseEnhanced } from '@/utils/tts-enhanced.js';
import { LESSON_COLORS, LESSON_NUMBERS, DEFAULT_LESSON_COLOR } from '@/styles/lessonColors.js';
import { useLessonFilter } from '@/utils/lessonFilter.js';
import { useGamePhase } from '@/utils/useGamePhase.js';
import GameIntro from './GameIntro.jsx';
import GameResults from './GameResults.jsx';

const ROUNDS = 6;

function pickRounds(lessonFilter) {
  const pool = lessonFilter !== null
    ? translationPhrases.filter(p => p.lesson === lessonFilter)
    : translationPhrases;
  return shuffle([...pool]).slice(0, ROUNDS);
}

// Mensajes de error en idioma actual con fallback
function errorMessage(code, t) {
  switch (code) {
    case SpeechErrorCode.NO_PERMISSION:
      return t('pronunciation_err_permission', 'Necesito permiso del micrófono para escucharte.');
    case SpeechErrorCode.NO_SPEECH:
      return t('pronunciation_err_no_speech', 'No oí nada. Pulsa el botón y habla más alto.');
    case SpeechErrorCode.NETWORK:
      return t('pronunciation_err_network', 'Sin conexión al servicio de reconocimiento. Comprueba tu internet.');
    case SpeechErrorCode.UNSUPPORTED:
      return t('pronunciation_err_unsupported', 'Tu navegador no soporta reconocimiento de voz. Prueba con Chrome o Edge.');
    default:
      return t('pronunciation_err_unknown', 'Algo falló. Inténtalo otra vez.');
  }
}

export default function PronunciationPractice({ goBack, selectedLesson }) {
  const { t, i18n } = useTranslation();
  const supported = isSpeechRecognitionSupported();
  const { isIntro, isFinished, start, finish, restart } = useGamePhase('pronunciation-practice');

  const [rounds, setRounds]           = useState([]);
  const [currentIdx, setCurrentIdx]   = useState(0);
  const [status, setStatus]           = useState('idle');   // idle | listening | processing | result | error
  const [scoreInfo, setScoreInfo]     = useState(null);     // { score, level, charMatches, normRecognized, ... }
  const [errorMsg, setErrorMsg]       = useState(null);
  const [totalScore, setTotalScore]   = useState(0);
  const [lessonFilter, setLessonFilter] = useLessonFilter(selectedLesson);

  // Para evitar warnings cuando el componente se desmonta mid-recognition
  const aliveRef = useRef(true);
  useEffect(() => () => { aliveRef.current = false; }, []);

  const startGame = useCallback(() => {
    const r = pickRounds(lessonFilter);
    setRounds(r);
    setCurrentIdx(0);
    setScoreInfo(null);
    setErrorMsg(null);
    setStatus('idle');
    setTotalScore(0);
  }, [lessonFilter]);

  useEffect(() => { startGame(); }, [startGame]);

  const current = rounds[currentIdx];

  const handleListen = async () => {
    if (!current || status === 'listening' || status === 'processing') return;
    setStatus('listening');
    setErrorMsg(null);
    setScoreInfo(null);
    try {
      const { transcript } = await recognize({ lang: 'zh-CN', timeoutMs: 9000 });
      if (!aliveRef.current) return;
      setStatus('processing');
      const info = scorePronunciation(current.hanzi, transcript);
      setScoreInfo(info);
      setStatus('result');
      setTotalScore(prev => prev + info.score);

      // Feedback háptico + sonido + XP
      if (info.level === 'perfect' || info.level === 'good') {
        hapticSuccess(); playSound('correct');
        addXP(info.level === 'perfect' ? 10 : 5);
        updateChallengeProgress('pronunciation', 1);
      } else {
        hapticError(); playSound('incorrect');
      }
    } catch (err) {
      if (!aliveRef.current) return;
      setErrorMsg(errorMessage(err.code, t));
      setStatus('error');
    }
  };

  const handlePlayCorrect = () => {
    if (!current) return;
    try { speakChineseEnhanced(current.hanzi); } catch (_) {}
  };

  const handleNext = () => {
    if (currentIdx + 1 >= rounds.length) {
      finish();
      return;
    }
    setCurrentIdx(i => i + 1);
    setScoreInfo(null);
    setErrorMsg(null);
    setStatus('idle');
  };

  const handleRetry = () => {
    setScoreInfo(null);
    setErrorMsg(null);
    setStatus('idle');
  };

  // ── Soporte no disponible ─────────────────────────────────────────
  if (!supported) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[var(--paper-hi)] border border-[rgba(28,24,19,0.10)] rounded-2xl p-8 max-w-sm w-full">
          <div className="text-5xl mb-3">🎙️</div>
          <h2 className="text-xl font-bold text-[var(--ink)] mb-2">
            {t('pronunciation_unsupported_title', 'No disponible aquí')}
          </h2>
          <p className="text-sm text-[var(--ink-soft)] mb-6 leading-relaxed">
            {t('pronunciation_unsupported_body',
              'Esta actividad necesita el reconocimiento de voz del navegador. Funciona en Chrome, Edge y Safari. Si estás en Firefox, prueba con otro navegador.')}
          </p>
          <button onClick={goBack}
            className="w-full py-3 rounded-xl bg-[var(--red)] hover:bg-[var(--red-deep)] text-[var(--on-accent)] font-bold transition-colors">
            {t('translation_back', 'Volver')}
          </button>
        </div>
      </div>
    );
  }

  // ── Pantalla de explicación ───────────────────────────────────────
  if (isIntro) {
    return (
      <GameIntro
        gameId="pronunciation-practice"
        cn="说"
        title={t('pronunciation_title', 'Pronunciación')}
        subtitle={t('pronunciation_subtitle', 'Lee la frase en voz alta')}
        steps={[
          t('pronunciation_intro_1', 'Lee la frase en chino que aparece en pantalla.'),
          t('pronunciation_intro_2', 'Pulsa el micrófono y dila en voz alta.'),
          t('pronunciation_intro_3', 'Recibirás una nota según lo bien que se te entienda; puedes escuchar la frase correcta.'),
          t('pronunciation_intro_4', 'Son 6 frases por ronda. Necesitas dar permiso de micrófono.'),
        ]}
        onStart={start}
        onBack={goBack}
      />
    );
  }

  // ── Pantalla final ────────────────────────────────────────────────
  if (isFinished) {
    const avg = rounds.length > 0 ? Math.round(totalScore / rounds.length) : 0;
    return (
      <GameResults
        gameId="pronunciation-practice"
        title={t('pronunciation_results_title', 'Resultado')}
        subtitle={t('pronunciation_results_subtitle', 'Tu nota media de pronunciación')}
        score={avg}
        scoreLabel={t('pronunciation_avg_label', 'Nota media')}
        onPlayAgain={() => { restart(); startGame(); }}
        onBack={goBack}
      />
    );
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex items-center justify-center">
        <p className="text-[var(--mute)]">{t('common_loading', 'Cargando…')}</p>
      </div>
    );
  }

  // Renderiza la frase esperada con marca por carácter cuando hay resultado
  const renderExpected = () => {
    if (!scoreInfo) {
      return <span className="text-[var(--ink)]">{current.hanzi}</span>;
    }
    // Usamos las matches sobre la versión normalizada — para colorear los hanzi
    // del original alineamos por orden de carácter saltando puntuación.
    const matches = scoreInfo.charMatches;
    let mi = 0;
    return [...current.hanzi].map((ch, i) => {
      // Si el carácter es puntuación o espacio, no se contó: dibujarlo gris.
      if (/[。，！？、；：（）「」'"".,!?;:()[\]{}\s]/.test(ch)) {
        return <span key={i} className="text-[var(--mute)]">{ch}</span>;
      }
      const ok = matches[mi++];
      return (
        <span
          key={i}
          className="font-bold"
          style={{ color: ok ? '#2f6b4a' : '#c8392f' }}
        >
          {ch}
        </span>
      );
    });
  };

  const progress = ((currentIdx + (status === 'result' ? 1 : 0)) / rounds.length) * 100;
  const accent = LESSON_COLORS[current.lesson] || DEFAULT_LESSON_COLOR;

  return (
    <div className="min-h-screen bg-[var(--paper)] pb-8">
      {/* Header */}
      <div className={`bg-[var(--paper-hi)] border-b border-[rgba(28,24,19,0.10)] border-l-4 ${accent.border} px-4 pt-10 pb-4`}>
        <button onClick={goBack} className="flex items-center gap-1.5 text-[var(--mute)] hover:text-[var(--ink)] text-sm mb-3 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          {t('translation_back', 'Volver')}
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-[var(--ink)]">{t('pronunciation_title', 'Pronunciación')}</h1>
            <p className="text-sm text-[var(--mute)]">{t('pronunciation_subtitle', 'Lee la frase en voz alta')}</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${accent.text}`}>{Math.round(totalScore / Math.max(1, status === 'result' ? currentIdx + 1 : currentIdx))}</p>
            <p className="text-xs text-[var(--mute)]">{currentIdx + 1}/{rounds.length}</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-[var(--paper-hi2)] rounded-full overflow-hidden">
          <div className={`h-full ${accent.bg} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-4">
        {/* Filtro de lección */}
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setLessonFilter(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
              lessonFilter === null
                ? `${accent.bg} text-[var(--on-accent)] border-transparent`
                : 'bg-[var(--paper-hi)] text-[var(--mute)] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'
            }`}
          >
            {t('sov_all_lessons', 'Todas')}
          </button>
          {LESSON_NUMBERS.map(n => (
            <button
              key={n}
              onClick={() => setLessonFilter(n)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                lessonFilter === n
                  ? `${(LESSON_COLORS[n] || DEFAULT_LESSON_COLOR).bg} text-[var(--on-accent)] border-transparent`
                  : 'bg-[var(--paper-hi)] text-[var(--mute)] border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)]'
              }`}
            >
              L{n}
            </button>
          ))}
        </div>

        {/* Frase esperada */}
        <div className="bg-[var(--paper-hi)] border border-[rgba(28,24,19,0.10)] rounded-xl p-5 text-center">
          <p className="text-xs text-[var(--mute)] mb-2">{t('pronunciation_say_this', 'Di esto en voz alta')}</p>
          <p className="text-3xl font-bold leading-snug mb-2">{renderExpected()}</p>
          <p className="text-sm text-[var(--jade-mid)] mb-1">{current.pinyin}</p>
          <p className="text-xs text-[var(--mute)] italic">
            {current.translations?.[i18n.language] || current.translations?.es}
          </p>
          {/* Botón para oír la pronunciación correcta */}
          <button
            onClick={handlePlayCorrect}
            className="mt-3 text-xs px-3 py-1.5 rounded-lg bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] text-[var(--ink-soft)] transition-colors inline-flex items-center gap-1.5"
            aria-label={t('pronunciation_play_correct', 'Oír pronunciación correcta')}
          >
            <span>🔊</span> {t('pronunciation_play_correct', 'Oír pronunciación')}
          </button>
        </div>

        {/* Resultado */}
        {scoreInfo && (
          <div className="bg-[var(--paper-hi)] border border-[rgba(28,24,19,0.10)] rounded-xl p-4">
            <div className="flex items-baseline justify-between mb-2">
              <p className="text-xs text-[var(--mute)]">{t('pronunciation_you_said', 'Has dicho')}</p>
              <p className={`text-xl font-bold ${
                scoreInfo.level === 'perfect' ? 'text-[var(--jade)]' :
                scoreInfo.level === 'good' ? 'text-[var(--jade-mid)]' :
                scoreInfo.level === 'partial' ? 'text-[var(--sand)]' : 'text-[var(--red)]'
              }`}>{scoreInfo.score}</p>
            </div>
            <p className="text-lg text-[var(--ink)] mb-1">{scoreInfo.normRecognized || '—'}</p>
            <p className="text-xs italic" style={{
              color: scoreInfo.level === 'perfect' ? '#2f6b4a' :
                     scoreInfo.level === 'good' ? '#5a8f72' :
                     scoreInfo.level === 'partial' ? '#b88a3e' : '#c8392f'
            }}>
              {scoreInfo.level === 'perfect' && t('pronunciation_level_perfect', '¡Perfecto!')}
              {scoreInfo.level === 'good' && t('pronunciation_level_good', 'Muy bien.')}
              {scoreInfo.level === 'partial' && t('pronunciation_level_partial', 'Casi. Repite con más claridad.')}
              {scoreInfo.level === 'fail' && t('pronunciation_level_fail', 'No coincide. Inténtalo otra vez.')}
            </p>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="bg-[var(--red-bg)] border border-[var(--red)] rounded-xl p-3 text-sm text-[var(--red-deep)]">
            {errorMsg}
          </div>
        )}

        {/* Botón grabar / siguiente */}
        <div className="flex gap-2">
          {status !== 'result' ? (
            <button
              onClick={handleListen}
              disabled={status === 'listening' || status === 'processing'}
              className={`flex-1 py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
                status === 'listening'
                  ? 'bg-[var(--red)] text-[var(--on-accent)] animate-pulse'
                  : 'bg-[var(--jade)] hover:bg-[var(--jade-deep)] text-[var(--on-accent)]'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
              aria-label={t('pronunciation_record', 'Grabar')}
            >
              <span className="text-xl">{status === 'listening' ? '🎙️' : '🎤'}</span>
              {status === 'listening'
                ? t('pronunciation_listening', 'Escuchando…')
                : status === 'processing'
                  ? t('pronunciation_processing', 'Procesando…')
                  : t('pronunciation_record', 'Grabar')}
            </button>
          ) : (
            <>
              <button
                onClick={handleRetry}
                className="flex-1 py-3 rounded-xl bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] text-[var(--ink-soft)] font-medium transition-colors"
              >
                {t('pronunciation_retry', 'Reintentar')}
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-3 rounded-xl bg-[var(--red)] hover:bg-[var(--red-deep)] text-[var(--on-accent)] font-bold transition-colors"
              >
                {currentIdx + 1 >= rounds.length
                  ? t('pronunciation_finish', 'Terminar')
                  : t('pronunciation_next', 'Siguiente →')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
