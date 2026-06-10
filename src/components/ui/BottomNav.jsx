// src/components/ui/BottomNav.jsx
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { MINIGAME_IDS } from '@/components/minigames/registry.js';

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
    <line x1="6" x2="10" y1="11" y2="11"/>
    <line x1="8" x2="8" y1="9" y2="13"/>
    <line x1="15" x2="15.01" y1="12" y2="12"/>
    <line x1="18" x2="18.01" y1="10" y2="10"/>
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.604 9.416 2 14.456 2 16a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4c0-1.545-.604-6.584-.693-7.258A4 4 0 0 0 17.32 5z"/>
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

export default function BottomNav({ activeScreen, onNavigate }) {
  const { t } = useTranslation();

  const items = [
    { key: 'home',       label: t('nav_home'),       Icon: HomeIcon },
    { key: 'review',     label: t('nav_review'),     Icon: ReviewIcon },
    { key: 'stories',    label: t('nav_stories'),    Icon: StoriesIcon },
    { key: 'dictionary', label: t('nav_dictionary'), Icon: DictIcon },
    { key: 'minigames',  label: t('nav_games'),      Icon: GamesIcon },
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
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{
        background: `${J.paperHi}f2`,
        borderTop: `1px solid ${J.hair}`,
      }}
    >
      <div className="max-w-lg mx-auto flex justify-around items-end pt-1 pb-3">
        {items.map((item) => {
          const { key, label, Icon } = item;
          const active  = isActive(key);
          const accent  = activeAccent(key);
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="flex flex-col items-center gap-0.5 px-2 py-1 min-w-[56px] transition-all duration-200 active:scale-95"
              style={{ background: 'none', border: 0, cursor: 'pointer' }}
            >
              <span
                className="flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200"
                style={{ background: active ? accent.bg : 'transparent' }}
              >
                <span style={{ color: active ? accent.color : J.mute2, transition: 'color 200ms' }}>
                  <Icon />
                </span>
              </span>
              <span
                className="text-[10px] font-semibold leading-none transition-colors duration-200"
                style={{ color: active ? accent.color : J.mute2 }}
              >
                {label}
              </span>
              {active && (
                <span
                  className="w-1 h-1 rounded-full mt-0.5"
                  style={{ background: accent.color }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
