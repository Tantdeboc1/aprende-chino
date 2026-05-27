// src/components/stories/CharacterDisplay.jsx
// Muestra el personaje activo centrado, con halo de color, pop-in al cambiar,
// y respiración continua. Tiene dos variantes:
//   - 'dialogue' (por defecto): grande, opacidad total, halo visible
//   - 'decor': más pequeño, semi-transparente, sin halo — para ejercicios
//
// El "user" comparte un PNG por género (user-m / user-f / user-nb), no el
// avatar elegido en Ajustes, para mantener coherencia visual en la historia.

import { useEffect, useMemo, useState } from 'react';
import { AVATARS, getCharacterPng } from './Avatars.jsx';

const VARIANTS = {
  dialogue: {
    maxWidth: 460,
    opacity: 1,
    haloOpacity: 0.55,
    haloBlur: 38,
    haloScale: 1.05,
    shadowY: 18,
    shadowAlpha: 0.5,
  },
  decor: {
    maxWidth: 260,
    opacity: 0.78,
    haloOpacity: 0.25,
    haloBlur: 26,
    haloScale: 0.9,
    shadowY: 10,
    shadowAlpha: 0.35,
  },
};

export default function CharacterDisplay({
  character,
  expresion = 'normal',
  variant = 'dialogue',
}) {
  const [entered, setEntered] = useState(false);

  const png = useMemo(() => getCharacterPng(character?.id), [character?.id]);

  // Pop-in cada vez que cambia el personaje
  useEffect(() => {
    setEntered(false);
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [character?.id]);

  if (!character) return null;

  const Avatar = AVATARS[character.id];
  if (!Avatar && !png) return null;

  const v = VARIANTS[variant] || VARIANTS.dialogue;
  // Color del halo: tomamos la paleta del personaje (shirt suele ser el
  // color identificativo); fallback al amarillo cálido de la app.
  const haloColor =
    character.color ||
    character.acento ||
    character.palette?.shirt ||
    '#f0c862';

  // Transform: arranca un pelín pequeño y ligeramente rotado, vuelve a tamaño/posición normal
  const transform = entered
    ? 'scale(1) rotate(0deg) translateY(0)'
    : 'scale(0.92) rotate(-1.5deg) translateY(8px)';

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: v.maxWidth,
        margin: '0 auto',
        opacity: entered ? v.opacity : 0,
        transform,
        transition:
          'transform 540ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 360ms ease-out',
      }}
    >
      {/* Halo radial detrás del personaje */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '6% -8% 6% -8%',
          background: `radial-gradient(ellipse at center, ${haloColor}cc 0%, ${haloColor}55 35%, transparent 70%)`,
          filter: `blur(${v.haloBlur}px)`,
          opacity: entered ? v.haloOpacity : 0,
          transform: `scale(${entered ? v.haloScale : 0.7})`,
          transition: 'opacity 700ms ease-out, transform 700ms ease-out',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Personaje */}
      <div
        className="story-breathe"
        style={{
          position: 'relative',
          zIndex: 1,
          filter: `drop-shadow(0 ${v.shadowY}px ${v.shadowY * 1.5}px rgba(0,0,0,${v.shadowAlpha}))`,
        }}
      >
        {png ? (
          <img
            src={png}
            alt=""
            draggable={false}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        ) : (
          <svg
            viewBox="0 0 200 320"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <Avatar expresion={expresion} />
          </svg>
        )}
      </div>

      <style>{`
        @keyframes story-breathe {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        .story-breathe {
          animation: story-breathe 3.8s ease-in-out infinite;
          transform-origin: center bottom;
        }
      `}</style>
    </div>
  );
}
