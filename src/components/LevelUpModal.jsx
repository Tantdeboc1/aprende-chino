// src/components/LevelUpModal.jsx
// Overlay celebratorio cuando el usuario sube de nivel.
// - Avatar del perfil dentro de un anillo butter pulsante
// - Número de nivel grande + título nuevo (es + zh + icono)
// - Confeti CSS cayendo
// - Botón "Continuar" para cerrar

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { loadUserProfile } from '@/utils/userProfile.js';
import { loc, baseLang } from '@/utils/loc.js';
import { getAvatarById, getAvatarUnlocksAtLevel, getNextAvatarUnlock, DEFAULT_AVATAR_ID } from '@/data/avatars.js';
import { useExitAnimation } from '@/hooks/useExitAnimation.js';

// Genera N puntos de confeti con posiciones, colores y delays aleatorios
function makeConfetti(n = 40) {
  const palette = [J.butter, J.red, J.jade, '#f7c98a', '#cda156'];
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.6,
    duration: 2.2 + Math.random() * 1.8,
    color: palette[i % palette.length],
    size: 6 + Math.random() * 6,
    rotate: Math.random() * 360,
    drift: -30 + Math.random() * 60,
  }));
}

export default function LevelUpModal({ levelUp, onClose }) {
  const { t, i18n } = useTranslation();
  const [entered, setEntered] = useState(false);
  // Cierre animado: la tarjeta se encoge y el overlay se funde antes de
  // desmontar (la entrada ya era animada; la salida era un corte seco).
  const { closing, requestClose } = useExitAnimation(onClose, 220);
  const profile = useMemo(() => loadUserProfile(), []);
  const avatar = useMemo(
    () => getAvatarById(profile.avatarId) || getAvatarById(DEFAULT_AVATAR_ID),
    [profile.avatarId]
  );
  // En pantallas pequeñas (≈móviles de gama baja) menos partículas: 50 capas
  // compuestas + halo + anillo giratorio podían dar tirones justo en la
  // celebración. En pantallas grandes se mantiene la densidad original.
  const confetti = useMemo(
    () => makeConfetti(window.innerWidth < 480 ? 28 : 50),
    []
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!levelUp) return null;

  const titleLoc = loc(levelUp.title, baseLang(i18n.language));
  // Recompensa tangible: avatares que se desbloquean justo en este nivel,
  // o el próximo desbloqueo como zanahoria.
  const unlockedAvatars = getAvatarUnlocksAtLevel(levelUp.level);
  const nextUnlock = unlockedAvatars.length === 0 ? getNextAvatarUnlock(levelUp.level) : null;

  return createPortal(
    <div
      onClick={requestClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15, 10, 5, 0.82)',
        // blur(4px): visualmente casi idéntico sobre un fondo tan oscuro y
        // la mitad de coste GPU que 8px (es la pantalla más cargada de la app).
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
        overflow: 'hidden',
        transition: 'opacity 220ms ease',
        opacity: closing ? 0 : 1,
      }}
    >
      {/* Confeti */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {confetti.map(c => (
          <span
            key={c.id}
            style={{
              position: 'absolute',
              left: `${c.left}%`,
              top: '-20px',
              width: c.size, height: c.size,
              background: c.color,
              borderRadius: c.id % 3 === 0 ? '50%' : 2,
              transform: `rotate(${c.rotate}deg)`,
              animation: `lu-fall ${c.duration}s ${c.delay}s cubic-bezier(.25,.46,.45,.94) infinite`,
              ['--drift']: `${c.drift}px`,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: 380, width: '100%',
          background: `linear-gradient(160deg, ${J.paperHi} 0%, ${J.paper} 100%)`,
          borderRadius: 26,
          padding: '28px 26px 24px',
          textAlign: 'center',
          boxShadow: '0 24px 70px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(240,200,98,0.4)',
          transform: (entered && !closing) ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
          opacity: (entered && !closing) ? 1 : 0,
          transition: closing
            ? 'transform 220ms cubic-bezier(0.4,0,1,1), opacity 200ms ease-in'
            : 'transform 520ms cubic-bezier(0.22,1,0.36,1), opacity 380ms ease-out',
        }}
      >
        {/* Etiqueta arriba */}
        <p style={{
          margin: 0, fontSize: 11, fontWeight: 800,
          letterSpacing: '0.22em', color: J.red,
          textTransform: 'uppercase',
        }}>
          {t('levelup_title')}
        </p>
        <p className="font-cn" style={{ margin: '2px 0 18px', fontSize: 13, color: J.mute, letterSpacing: '0.1em' }}>
          升级了
        </p>

        {/* Avatar con anillo pulsante */}
        <div style={{
          position: 'relative',
          width: 130, height: 130, margin: '0 auto 14px',
        }}>
          {/* Anillo exterior pulsante */}
          <div style={{
            position: 'absolute', inset: -8,
            borderRadius: '50%',
            background: `conic-gradient(${J.butter}, ${J.red}, ${J.jade}, ${J.butter})`,
            animation: 'lu-spin 4s linear infinite',
            filter: 'blur(2px)', opacity: 0.85,
          }} />
          {/* Halo */}
          <div style={{
            position: 'absolute', inset: -22,
            borderRadius: '50%',
            background: `radial-gradient(circle, color-mix(in srgb, ${J.butter} 25%, transparent) 0%, transparent 70%)`,
            animation: 'lu-pulse 1.6s ease-in-out infinite',
          }} />
          {/* Avatar */}
          <div style={{
            position: 'relative',
            width: '100%', height: '100%',
            borderRadius: '50%',
            background: J.paperHi,
            border: `4px solid ${J.butter}`,
            overflow: 'hidden',
            boxShadow: '0 8px 20px -6px rgba(0,0,0,0.45)',
            animation: 'lu-bounce 700ms cubic-bezier(0.34,1.56,0.64,1) 120ms both',
          }}>
            <img
              src={avatar.src}
              alt={t('avatar_' + avatar.id, avatar.label || 'Avatar')}
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        </div>

        {/* Nivel grande */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ margin: 0, fontSize: 11, color: J.mute, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {t('levelup_level')}
          </p>
          <p style={{
            margin: '2px 0 0',
            fontSize: 64, fontWeight: 900,
            color: J.jade, letterSpacing: '-0.04em', lineHeight: 0.9,
            animation: 'lu-drop 600ms cubic-bezier(0.22,1,0.36,1) 200ms both',
          }}>
            {levelUp.level}
          </p>
        </div>

        {/* Título nuevo */}
        <div style={{
          background: J.jade, color: J.onAccent,
          borderRadius: 14, padding: '10px 14px',
          marginTop: 14,
          animation: 'lu-fade 500ms ease-out 400ms both',
        }}>
          <div style={{ fontSize: 11, letterSpacing: '0.16em', color: J.butter, fontWeight: 700, textTransform: 'uppercase' }}>
            {t('levelup_new_title')}
          </div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 24 }}>{levelUp.icon}</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: J.onAccent }}>
              {titleLoc}
            </span>
          </div>
          <div className="font-cn" style={{ marginTop: 2, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
            {levelUp.zh}
          </div>
        </div>

        {/* Avatar desbloqueado en este nivel / próximo desbloqueo */}
        {unlockedAvatars.length > 0 && (
          <div style={{
            marginTop: 12, borderRadius: 14, padding: '10px 14px',
            background: J.paperHi, border: `1px solid ${J.butter}`,
            animation: 'lu-fade 500ms ease-out 550ms both',
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', color: J.sandDeep, fontWeight: 800, textTransform: 'uppercase' }}>
              {t('levelup_avatar_unlocked', '¡Avatar desbloqueado!')}
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 10 }}>
              {unlockedAvatars.map(av => (
                <img
                  key={av.id}
                  src={av.src}
                  alt={av.label}
                  draggable={false}
                  style={{
                    width: 52, height: 52, borderRadius: '50%',
                    objectFit: 'cover', border: `3px solid ${J.butter}`,
                    boxShadow: '0 4px 12px -4px rgba(0,0,0,0.4)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
        {nextUnlock && (
          <p style={{
            marginTop: 12, marginBottom: 0, fontSize: 12.5, color: J.mute, fontWeight: 600,
            animation: 'lu-fade 500ms ease-out 550ms both',
          }}>
            🔒 {t('levelup_next_avatar', 'Próximo avatar al nivel {{level}}', { level: nextUnlock.level })}
          </p>
        )}

        {/* Botón */}
        <button
          onClick={requestClose}
          style={{
            marginTop: 20, width: '100%',
            background: J.red, color: J.onAccent,
            border: 0, borderRadius: 14,
            padding: '14px 18px',
            fontSize: 15, fontWeight: 800, letterSpacing: '0.02em',
            cursor: 'pointer',
            boxShadow: '0 8px 20px -6px rgba(200,57,47,0.6)',
          }}
        >
          {t('levelup_continue')} →
        </button>
      </div>

      <style>{`
        @keyframes lu-fall {
          0%   { transform: translateY(-20px) rotate(0deg) translateX(0); opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg) translateX(var(--drift)); opacity: 0.85; }
        }
        @keyframes lu-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes lu-pulse {
          0%, 100% { transform: scale(1);   opacity: 0.55; }
          50%      { transform: scale(1.18); opacity: 0.85; }
        }
        @keyframes lu-bounce {
          0%   { transform: scale(0.3); opacity: 0; }
          60%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes lu-drop {
          0%   { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0);     opacity: 1; }
        }
        @keyframes lu-fade {
          0%   { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0);   opacity: 1; }
        }
      `}</style>
    </div>,
    document.body
  );
}
