// src/components/stories/StoryResults.jsx
// Pantalla final tras los ejercicios: muestra puntuación + valoración.

import { J } from '@/styles/tokens';

function getValoracion(pct) {
  if (pct >= 95) return { titulo: '完美! · ¡Perfecto!',     color: J.butter, descr: 'Lo bordaste.' };
  if (pct >= 80) return { titulo: '很好! · ¡Muy bien!',      color: J.jade,   descr: 'Casi sin fallos.' };
  if (pct >= 60) return { titulo: '不错 · No está mal',       color: J.sand,   descr: 'Vas bien, sigue practicando.' };
  return                  { titulo: '加油! · ¡Tú puedes!',   color: J.red,    descr: 'Repasa el diálogo y prueba otra vez.' };
}

export default function StoryResults({ story, score, total, xpGanado = 0, isFirstTime = false, onRetry, onExit }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const v = getValoracion(pct);

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
        <p style={{ fontSize: 11, letterSpacing: '0.18em', color: J.butter, fontWeight: 700, margin: 0 }}>
          HISTORIA COMPLETADA
        </p>
        <h2 className="font-cn" style={{ fontSize: 22, fontWeight: 700, margin: '6px 0 0' }}>
          {story.subtitulo}
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: '2px 0 18px' }}>
          {story.titulo}
        </p>

        {/* Puntuación grande */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 18, padding: '18px 14px',
        }}>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', margin: 0, textTransform: 'uppercase' }}>
            Puntuación
          </p>
          <p style={{ fontSize: 42, fontWeight: 800, margin: '4px 0 0', color: v.color, lineHeight: 1 }}>
            {score}<span style={{ fontSize: 22, color: 'rgba(255,255,255,0.5)' }}> / {total}</span>
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: '4px 0 0' }}>
            {pct}% de aciertos
          </p>
        </div>

        {/* Valoración */}
        <div style={{ marginTop: 18 }}>
          <p className="font-cn" style={{ fontSize: 18, fontWeight: 700, color: v.color, margin: 0 }}>
            {v.titulo}
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>
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
            <p style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(240,200,98,0.85)', fontWeight: 700, margin: 0, textTransform: 'uppercase' }}>
              {isFirstTime ? 'Recompensa' : 'Mejora'}
            </p>
            <p style={{ fontSize: 20, fontWeight: 800, color: J.butter, margin: '2px 0 0' }}>
              +{xpGanado} XP
            </p>
          </div>
        )}
        {xpGanado === 0 && !isFirstTime && (
          <p style={{ marginTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            Para ganar más XP, supera tu mejor puntuación.
          </p>
        )}

        {/* Acciones */}
        <div style={{ marginTop: 22, display: 'grid', gap: 8 }}>
          <button
            onClick={onExit}
            style={{
              background: J.jade, color: J.onAccent, border: 0,
              borderRadius: 14, padding: '13px 18px',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Volver al mapa
          </button>
          <button
            onClick={onRetry}
            style={{
              background: 'rgba(255,255,255,0.08)', color: J.onAccent,
              border: `1px solid rgba(255,255,255,0.18)`,
              borderRadius: 14, padding: '11px 18px',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Repetir historia
          </button>
        </div>
      </div>
    </div>
  );
}
