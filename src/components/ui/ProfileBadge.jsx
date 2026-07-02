// src/components/ui/ProfileBadge.jsx
// Avatar circular pequeño + badge de nivel. Clickable: dispara un evento
// global 'open-profile' que App.jsx escucha para navegar al Perfil.
// Diseñado para insertarse en headers (Dictionary, MiniGames, Review, etc.).

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { loadUserProfile, resolveAvatarSrc } from '@/utils/userProfile.js';
import { getAvatarById, DEFAULT_AVATAR_ID } from '@/data/avatars.js';
import { getStreak } from '@/utils/streak.js';
import { getLevelInfo } from '@/utils/leveling.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useLocalSnapshot } from '@/hooks/useLocalSnapshot.js';

export default function ProfileBadge({
  size = 40,
  showLevel = true,
  variant = 'light',   // 'light' = sobre fondos claros, 'dark' = sobre fondos oscuros/jade
}) {
  const { t } = useTranslation();
  const { mode, user } = useAuth();
  // useLocalSnapshot relee perfil y racha si llega un sync remoto.
  const profile = useLocalSnapshot(loadUserProfile);
  const avatar  = useMemo(
    () => getAvatarById(profile.avatarId) || getAvatarById(DEFAULT_AVATAR_ID),
    [profile.avatarId]
  );
  const effective = resolveAvatarSrc(profile, mode, user?.photoURL, avatar.src);
  const streak    = useLocalSnapshot(getStreak);
  const levelInfo = useMemo(() => getLevelInfo(streak.totalXP || 0), [streak.totalXP]);

  const handleClick = () => {
    try { window.dispatchEvent(new CustomEvent('open-profile')); } catch {}
  };

  const borderColor = variant === 'dark' ? J.butter : J.jade;
  const levelBg     = variant === 'dark' ? J.butter : J.jade;
  const levelFg     = variant === 'dark' ? J.jadeDeep : J.paperHi;
  const shadow      = variant === 'dark'
    ? '0 3px 10px -2px rgba(0,0,0,0.45)'
    : '0 3px 10px -3px rgba(0,0,0,0.25)';

  return (
    <button
      onClick={handleClick}
      aria-label={t('profile_open_aria')}
      style={{
        position: 'relative',
        background: 'transparent',
        border: 0, padding: 0,
        cursor: 'pointer',
        width: size + 8, height: size + 14, // espacio para el badge nivel
        flexShrink: 0,
      }}
    >
      <span style={{
        display: 'block',
        width: size, height: size,
        borderRadius: '50%',
        background: J.paperHi,
        border: `2px solid ${borderColor}`,
        overflow: 'hidden',
        boxShadow: shadow,
        margin: '0 auto',
      }}>
        <img
          src={effective.src}
          alt={avatar.label || 'Avatar'}
          draggable={false}
          referrerPolicy="no-referrer"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </span>
      {showLevel && (
        <span style={{
          position: 'absolute',
          bottom: 0, left: '50%', transform: 'translateX(-50%)',
          background: levelBg, color: levelFg,
          fontSize: 10, fontWeight: 800,
          padding: '2px 7px', borderRadius: 99,
          letterSpacing: '0.04em',
          border: variant === 'dark' ? `1.5px solid ${J.jadeDeep}` : `1.5px solid ${J.paperHi}`,
          whiteSpace: 'nowrap',
        }}>
          Lv.{levelInfo.level}
        </span>
      )}
    </button>
  );
}
