// src/components/ui/BottomNav.jsx
import { useTranslation } from 'react-i18next';
import { APP_NAME } from '@/utils/appInfo.js';
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

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function BottomNav({ activeScreen, onNavigate, reviewDue = 0, collapsed = false, onToggle }) {
  const { t } = useTranslation();
  // Invitaciones de amistad recibidas → badge en "Perfil", que es desde donde
  // se llega a Amigos (0 para invitados).
  const incomingCount = useIncomingRequestCount();

  // Cinco pestañas (antes siete: la barra iba apretadísima en móvil).
  // 'practice' agrupa Historias y Destrezas —ambas son práctica— y Amigos pasa
  // dentro de Perfil, que es donde vive el resto de lo social. Ninguna pantalla
  // desaparece: 'stories' y 'friends' siguen siendo rutas propias, solo cambia
  // por dónde se llega. Los tamaños siguen fijos en px a propósito (ver abajo).
  const items = [
    { key: 'home',       label: t('nav_home'),       Icon: HomeIcon },
    { key: 'review',     label: t('nav_review'),     Icon: ReviewIcon },
    { key: 'practice',   label: t('nav_practice', 'Practicar'), Icon: GamesIcon },
    { key: 'dictionary', label: t('nav_dictionary'), Icon: DictIcon },
    { key: 'profile',    label: t('nav_profile', 'Perfil'), Icon: ProfileIcon },
  ];

  const isActive = (key) => {
    if (key === 'home') return ['home', 'lesson-detail', 'intro-detail', 'classifiers', 'exam', 'exercise', 'chinaMap'].includes(activeScreen);
    if (key === 'practice') {
      return activeScreen === 'minigames' || activeScreen === 'stories'
        || activeScreen === 'daily' || activeScreen === 'global-exam' || activeScreen === 'level-exam'
        || MINIGAME_IDS.has(activeScreen);
    }
    if (key === 'profile') return ['profile', 'friends', 'settings'].includes(activeScreen);
    return activeScreen === key;
  };

  return (
    <nav aria-label={t('nav_primary_label', 'Navegación principal')} className={`app-navigation${collapsed ? ' is-collapsed' : ''}`}>
      <div className="app-navigation-brand" aria-hidden="true">
        <span className="app-navigation-mark">汉</span>
        <div><strong>{APP_NAME}</strong><span>{t('app_tagline', 'Aprende chino')}</span></div>
      </div>
      <button type="button" className="app-navigation-toggle" onClick={onToggle}
        aria-expanded={!collapsed} aria-controls="app-navigation-items"
        aria-label={t(collapsed ? 'nav_expand' : 'nav_collapse', collapsed ? 'Ampliar menú' : 'Minimizar menú')}
        title={t(collapsed ? 'nav_expand' : 'nav_collapse', collapsed ? 'Ampliar menú' : 'Minimizar menú')}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 3v18" />
          <path d={collapsed ? 'm13 9 3 3-3 3' : 'm16 9-3 3 3 3'} />
        </svg>
        <span>{t('nav_collapse', 'Minimizar menú')}</span>
      </button>
      <div id="app-navigation-items" className="app-navigation-items">
        {items.map((item) => {
          const { key, label, Icon } = item;
          const active  = isActive(key);
          const accent = { color: J.jade, bg: J.jadeBg };
          return (
            <button
              key={key}
              aria-label={label}
              title={label}
              onClick={() => onNavigate(key)}
              aria-current={active ? 'page' : undefined}
              data-tour={`nav-${key}`}
              className={`app-navigation-button${active ? ' is-active' : ''}`}
            >
              <span
                className="app-navigation-icon"
                style={{ background: active ? accent.bg : 'transparent', position: 'relative', width: 44, height: 28 }}
              >
                <span style={{ color: active ? accent.color : J.inkSoft, transition: 'color 200ms' }}>
                  <Icon />
                </span>
                {key === 'profile' && incomingCount > 0 && (
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
                {/* Repasos vencidos: punto sin número. La cifra exacta no
                    aporta nada aquí y un número grande ("47") desanima; el
                    recuento real está dentro de la pantalla de Repaso. */}
                {key === 'review' && reviewDue > 0 && (
                  <span
                    aria-label={t('nav_review_due', 'Tienes repasos pendientes')}
                    style={{
                      position: 'absolute', top: 0, right: 6,
                      width: 9, height: 9, borderRadius: 99,
                      background: J.red,
                      boxShadow: `0 0 0 2px ${J.paperHi}`,
                    }}
                  />
                )}
              </span>
              <span
                className="app-navigation-label"
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
