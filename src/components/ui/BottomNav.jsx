// src/components/ui/BottomNav.jsx
import { useTranslation } from 'react-i18next';

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

const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

export default function BottomNav({ activeScreen, onNavigate }) {
  const { t } = useTranslation();

  const items = [
    { key: 'home',       label: t('nav_home'),       Icon: HomeIcon },
    { key: 'review',     label: t('nav_review'),     Icon: ReviewIcon },
    { key: 'dictionary', label: t('nav_dictionary'), Icon: DictIcon },
    { key: 'minigames',  label: t('nav_games'),      Icon: GamesIcon },
    { key: 'settings',   label: t('nav_settings'),   Icon: SettingsIcon },
  ];

  const isActive = (key) => {
    if (key === 'home') return activeScreen === 'home' || activeScreen === 'lesson-detail';
    if (key === 'minigames') return ['minigames','sov-game','time-race','pinyin-connection','translation-game','global-exam'].includes(activeScreen);
    return activeScreen === key;
  };

  const activeAccent = (key) => {
    if (key === 'review') return { text: 'text-orange-400', dot: 'bg-orange-400', pill: 'bg-orange-900/50' };
    return { text: 'text-red-400', dot: 'bg-red-500', pill: 'bg-red-900/40' };
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700/60">
      <div className="max-w-lg mx-auto flex justify-around items-end pt-1 pb-3">
        {items.map(({ key, label, Icon }) => {
          const active  = isActive(key);
          const accent  = activeAccent(key);
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="flex flex-col items-center gap-0.5 px-2 py-1 min-w-[56px] transition-all duration-200 active:scale-95"
            >
              <span className={`flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200 ${active ? accent.pill : 'bg-transparent'}`}>
                <span className={`transition-colors duration-200 ${active ? accent.text : 'text-gray-500'}`}>
                  <Icon />
                </span>
              </span>
              <span className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${active ? accent.text : 'text-gray-500'}`}>
                {label}
              </span>
              {active && <span className={`w-1 h-1 rounded-full mt-0.5 ${accent.dot}`} />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
