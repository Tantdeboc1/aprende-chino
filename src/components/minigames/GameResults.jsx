// src/components/minigames/GameResults.jsx
// Pantalla de resultados compartida por los minijuegos, con el mismo estilo
// que la de GlobalExam: aciertos en verde, fallos en rojo y precisión.
import { useEffect } from 'react';
import ConfettiCelebration from '@/components/ui/ConfettiCelebration.jsx';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { recordMinigameScore } from '@/utils/minigameScores.js';
import { useCountUp } from '@/hooks/useCountUp.js';

export default function GameResults({ gameId, title, subtitle, correct, wrong, score, scoreLabel, onPlayAgain, onBack }) {
  const { t } = useTranslation();
  // Con aciertos/fallos la precisión sale de ellos; si el juego solo tiene
  // una nota 0-100 (p. ej. pronunciación), esa nota hace de precisión.
  const hasCounts = typeof correct === 'number' && typeof wrong === 'number';
  const total = hasCounts ? correct + wrong : 0;
  const pct = hasCounts
    ? (total > 0 ? Math.round((correct / total) * 100) : 0)
    : Math.round(score || 0);
  const good = pct >= 70;

  // Punto único donde TODOS los minijuegos terminan: si el juego declara su
  // `gameId`, guardamos aquí su mejor puntuación (recordMinigameScore toma el
  // máximo, así que repetir o el doble-render de StrictMode es inofensivo).
  useEffect(() => {
    if (gameId) recordMinigameScore(gameId, pct);
  }, [gameId, pct]);
  const celebrate = hasCounts ? correct > 0 : good;

  // Números animados (0 → valor) con un pop al asentarse el principal.
  const scoreAnim   = useCountUp(typeof score === 'number' ? score : 0);
  const correctAnim = useCountUp(hasCounts ? correct : 0, { duration: 500 });
  const wrongAnim   = useCountUp(hasCounts ? wrong : 0, { duration: 500 });
  const pctAnim     = useCountUp(pct, { duration: 700 });

  return (
    <>
      {celebrate && <ConfettiCelebration />}
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: J.paper }}>
        <div
          className="rounded-2xl p-8 max-w-sm w-full text-center"
          style={{ background: J.paperHi, border: `1px solid ${J.hair}`, boxShadow: `0 8px 24px -8px ${J.hairS}` }}
        >
          <div
            className="font-cn mx-auto mb-4 flex items-center justify-center"
            style={{
              width: 64, height: 64, borderRadius: 16, fontSize: 36, fontWeight: 700,
              background: good ? J.jadeBg : J.sandBg,
              color: good ? J.jade : J.sand,
            }}
          >
            {pct === 100 ? '优' : good ? '良' : '练'}
          </div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: J.ink }}>{title}</h2>
          {subtitle && <p className="text-sm mb-6" style={{ color: J.inkSoft }}>{subtitle}</p>}

          {typeof score === 'number' && (
            <div className="mb-6">
              <p className="text-sm" style={{ color: J.inkSoft }}>{scoreLabel || t('minigames_final_score_message')}</p>
              <p className={`text-5xl font-bold ${scoreAnim.done ? 'j-pop' : ''}`} style={{ color: J.ink }}>{scoreAnim.value}</p>
            </div>
          )}

          {hasCounts ? (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl p-3" style={{ background: J.jadeBg }}>
                <p className="text-2xl font-bold" style={{ color: J.jade }}>{correctAnim.value}</p>
                <p className="text-xs mt-0.5" style={{ color: J.jadeDeep }}>{t('global_exam_correct_label')}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: J.redBg }}>
                <p className="text-2xl font-bold" style={{ color: J.red }}>{wrongAnim.value}</p>
                <p className="text-xs mt-0.5" style={{ color: J.redDeep }}>{t('global_exam_errors_label')}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background: good ? J.jadeBg : J.sandBg }}>
                <p className={`text-2xl font-bold ${pctAnim.done ? 'j-pop' : ''}`} style={{ color: good ? J.jade : J.sand }}>{pctAnim.value}%</p>
                <p className="text-xs mt-0.5" style={{ color: J.mute }}>{t('global_exam_accuracy_label')}</p>
              </div>
            </div>
          ) : (
            <div className="h-3 rounded-full overflow-hidden mb-6" style={{ background: J.hair }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: good ? J.jade : J.sand }}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              // Envolvemos en arrow para NO pasar el evento de clic como
              // argumento: varios juegos usan handlers con parámetros
              // (p. ej. initGame(filter)) y recibir el evento los rompía.
              onClick={() => onPlayAgain?.()}
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-colors"
              style={{ background: J.red, color: J.onAccent, border: 0, cursor: 'pointer' }}
            >
              {t('minigames_play_again_button')}
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-xl font-medium text-sm transition-colors"
              style={{ background: J.paperHi, color: J.inkSoft, border: `1px solid ${J.hair}`, cursor: 'pointer' }}
            >
              {t('exam_back_button')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
