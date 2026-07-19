// src/components/stories/StoryResults.jsx
// Pantalla final tras los ejercicios: muestra puntuación + valoración.

import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { loc, baseLang } from '@/utils/loc.js';
import { useCountUp } from '@/hooks/useCountUp.js';

// El prefijo CJK se mantiene fijo; el texto y la descripción son i18n.
function getValoracion(pct, t) {
  if (pct >= 95) return { cn: '完美!', titulo: t('story_grade_perfect', '¡Perfecto!'), color: J.butter, descr: t('story_grade_perfect_desc', 'Lo bordaste.') };
  if (pct >= 80) return { cn: '很好!', titulo: t('story_grade_good', '¡Muy bien!'),    color: J.jade,   descr: t('story_grade_good_desc', 'Casi sin fallos.') };
  if (pct >= 60) return { cn: '不错',  titulo: t('story_grade_ok', 'No está mal'),      color: J.sand,   descr: t('story_grade_ok_desc', 'Vas bien, sigue practicando.') };
  return                  { cn: '加油!', titulo: t('story_grade_low', '¡Tú puedes!'),   color: J.red,    descr: t('story_grade_low_desc', 'Repasa el diálogo y prueba otra vez.') };
}

export default function StoryResults({ story, score, total, xpGanado = 0, isFirstTime = false, onRetry, onExit }) {
  const { t, i18n } = useTranslation();
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const v = getValoracion(pct, t);
  const storyTitle = loc(story.tituloTr, baseLang(i18n.language)) || story.titulo;
  // Números animados: puntuación grande y XP (con pop al asentarse).
  const scoreAnim = useCountUp(score);
  const xpAnim = useCountUp(xpGanado, { duration: 500, delay: 500 });

  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px 20px 110px',
    }}>
      <div style={{
        maxWidth: 420, width: '100%',
        background: 'rgba(20,16,12,0.84)',
        border: `1px solid ${J.hairS}`,
        borderRadius: 24, padding: '28px 24px',
        color: J.onAccent, textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.6875rem', letterSpacing: '0.18em', color: J.butter, fontWeight: 700, margin: 0 }}>
          {t('story_results_completed', 'HISTORIA COMPLETADA')}
        </p>
        <h2 className="font-cn" style={{ fontSize: '1.375rem', fontWeight: 700, margin: '6px 0 0' }}>
          {story.subtitulo}
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', margin: '2px 0 18px' }}>
          {storyTitle}
        </p>

        {/* Puntuación grande */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 18, padding: '18px 14px',
        }}>
          <p style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', margin: 0, textTransform: 'uppercase' }}>
            {t('story_results_score_label', 'Puntuación')}
          </p>
          <p className={scoreAnim.done ? 'j-pop' : ''} style={{ fontSize: '2.625rem', fontWeight: 800, margin: '4px 0 0', color: v.color, lineHeight: 1 }}>
            {scoreAnim.value}<span style={{ fontSize: '1.375rem', color: 'rgba(255,255,255,0.5)' }}> / {total}</span>
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)', margin: '4px 0 0' }}>
            {t('story_results_accuracy', '{{pct}}% de aciertos', { pct })}
          </p>
        </div>

        {/* Valoración */}
        <div style={{ marginTop: 18 }}>
          <p className="font-cn" style={{ fontSize: '1.125rem', fontWeight: 700, color: v.color, margin: 0 }}>
            {v.cn} · {v.titulo}
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>
            {v.descr}
          </p>
        </div>

        {/* XP ganado */}
        {xpGanado > 0 && (
          <div style={{
            marginTop: 14,
            background: 'rgba(240,200,98,0.12)',
            border: `1px solid rgba(240,200,98,0.35)`,
            borderRadius: 14,
            padding: '10px 14px',
          }}>
            <p style={{ fontSize: '0.6875rem', letterSpacing: '0.14em', color: 'rgba(240,200,98,0.85)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
              {isFirstTime ? t('story_results_reward', 'Recompensa') : t('story_results_improvement', 'Mejora')}
            </p>
            <p className={xpAnim.done ? 'j-pop' : ''} style={{ fontSize: '1.25rem', fontWeight: 800, color: J.butter, margin: '2px 0 0' }}>
              +{xpAnim.value} XP
            </p>
          </div>
        )}
        {xpGanado === 0 && !isFirstTime && (
          <p style={{ marginTop: 14, fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
            {t('story_results_more_xp_hint', 'Para ganar más XP, supera tu mejor puntuación.')}
          </p>
        )}

        {/* Acciones */}
        <div style={{ marginTop: 22, display: 'grid', gap: 8 }}>
          <button
            onClick={onExit}
            style={{
              background: J.jade, color: J.onAccent, border: 0,
              borderRadius: 14, padding: '13px 18px',
              fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
            }}
          >
            {t('stories_back_to_map', 'Volver al mapa')}
          </button>
          <button
            onClick={onRetry}
            style={{
              background: 'rgba(255,255,255,0.08)', color: J.onAccent,
              border: `1px solid rgba(255,255,255,0.18)`,
              borderRadius: 14, padding: '11px 18px',
              fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            {t('story_results_retry', 'Repetir historia')}
          </button>
        </div>
      </div>
    </div>
  );
}
