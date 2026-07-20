// src/components/ui/BottomNav.jsx
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { MINIGAME_IDS } from '@/components/minigames/registry.js';
import { useIncomingRequestCount } from '@/hooks/useIncomingRequestCount.js';

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const DictIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const GamesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 0 0-5.997.142 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 0 1 5.997.142 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375M6.003 5.125A3 3 0 0 0 6.401 6.5M3.477 10.896a4 4 0 0 1 .585-.396m15.876 0a4 4 0 0 1 .585.396M6 18a4 4 0 0 1-1.967-.516m15.934 0A4 4 0 0 1 18 18"/>
  </svg>
);

const ReviewIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 4v6h6"/>
    <path d="M23 20v-6h-6"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
  </svg>
);

const StoriesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <path d="M9 7h6M9 11h4"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const FriendsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default function BottomNav({ activeScreen, onNavigate }) {
  const { t } = useTranslation();
  // Invitaciones de amistad recibidas → badge en "Amigos" (0 para invitados).
  const incomingCount = useIncomingRequestCount();

  const items = [
    { key: 'home',       label: t('nav_home'),       Icon: HomeIcon },
    { key: 'review',     label: t('nav_review'),     Icon: ReviewIcon },
    { key: 'stories',    label: t('nav_stories'),    Icon: StoriesIcon },
    { key: 'dictionary', label: t('nav_dictionary'), Icon: DictIcon },
    { key: 'minigames',  label: t('nav_games'),      Icon: GamesIcon },
    { key: 'friends',    label: t('nav_friends', 'Amigos'), Icon: FriendsIcon },
    { key: 'profile',    label: t('nav_profile', 'Perfil'), Icon: ProfileIcon },
  ];

  const isActive = (key) => {
    if (key === 'home') return activeScreen === 'home' || activeScreen === 'lesson-detail';
    if (key === 'minigames') return activeScreen === 'minigames' || activeScreen === 'global-exam' || MINIGAME_IDS.has(activeScreen);
    return activeScreen === key;
  };

  // Cultural color logic: review gets sand accent, rest get jade (red reserved for achievement)
  const activeAccent = (key) => {
    if (key === 'review') return { color: J.sand, bg: J.sandBg };
    if (key === 'stories') return { color: J.red, bg: J.redBg };
    return { color: J.jade, bg: J.jadeBg };
  };

  return (
    <nav
      aria-label={t('nav_primary_label', 'Navegación principal')}
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{
        background: `color-mix(in srgb, ${J.paperHi} 95%, transparent)`,
        borderTop: `1px solid ${J.hair}`,
      }}
    >
      {/* Tamaños FIJOS en px (no rem): la barra es chrome de navegación y con 7
          pestañas no cabría si escalara con el ajuste de tamaño de texto. El
          contenido de lectura sí escala; aquí priorizamos que la nav siga
          usable a cualquier escala. */}
      <div className="w-full max-w-lg mx-auto flex justify-around items-end" style={{ paddingTop: 4, paddingBottom: 12, paddingLeft: 2, paddingRight: 2 }}>
        {items.map((item) => {
          const { key, label, Icon } = item;
          const active  = isActive(key);
          const accent  = activeAccent(key);
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center transition-all duration-200 active:scale-95"
              style={{ background: 'none', border: 0, cursor: 'pointer', gap: 2, paddingLeft: 6, paddingRight: 6, paddingTop: 4, paddingBottom: 4, minWidth: 46 }}
            >
              <span
                className="flex items-center justify-center rounded-full transition-all duration-200"
                style={{ background: active ? accent.bg : 'transparent', position: 'relative', width: 44, height: 28 }}
              >
                <span style={{ color: active ? accent.color : J.mute2, transition: 'color 200ms' }}>
                  <Icon />
                </span>
                {key === 'friends' && incomingCount > 0 && (
                  <span
                    aria-label={t('friends_incoming', 'Invitaciones recibidas')}
                    style={{
                      position: 'absolute', top: -3, right: 2,
                      minWidth: 15, height: 15, padding: '0 3px',
                      borderRadius: 99, background: J.red, color: '#fff',
                      fontSize: '0.59375rem', fontWeight: 800, lineHeight: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 0 0 2px ${J.paperHi}`,
                    }}
                  >
                    {incomingCount > 9 ? '9+' : incomingCount}
                  </span>
                )}
              </span>
              <span
                className="font-semibold leading-none transition-colors duration-200"
                style={{ color: active ? accent.color : J.mute2, fontSize: 10 }}
              >
                {label}
              </span>
              {/* Siempre montado: escala 0→1 con rebote al activarse (si fuera
                  render condicional aparecería de golpe, sin transición). */}
              <span
                className="rounded-full"
                style={{
                  width: 4, height: 4, marginTop: 2,
                  background: accent.color,
                  transform: active ? 'scale(1)' : 'scale(0)',
                  transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
