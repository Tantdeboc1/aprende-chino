// src/components/SettingsScreen.jsx
// Configuración (no stats). Perfil editable, idioma, música, cuenta y
// datos. Las estadísticas y la racha viven en ProfileScreen.
import { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { JTopBar, JMark, JCard, JSection } from '@/components/jade';
import { AVATARS, getAvatarById, isAvatarUnlocked, DEFAULT_AVATAR_ID } from '@/data/avatars.js';
import { loadUserProfile, updateUserProfile, GENDERS, resolveAvatarSrc } from '@/utils/userProfile.js';
import { getStreak, setDailyGoal, DAILY_GOAL_PRESETS } from '@/utils/streak.js';
import { getLevelInfo } from '@/utils/leveling.js';
import { introsEnabled, setIntrosEnabled } from '@/utils/gameIntroPrefs.js';
import { useMusic } from '@/context/MusicContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { APP_VERSION } from '@/utils/version.js';
import { getThemePref, setThemePref } from '@/utils/theme.js';
import { downloadBackup, restoreBackup } from '@/utils/backup.js';
import { getSoundPrefs, setSoundPrefs } from '@/utils/soundPrefs.js';
import { assetUrl } from '@/utils/assets';
import { APP_NAME } from '@/utils/appInfo.js';

const LANGUAGES = [
  { code: 'es', name: 'Español',   cn: '西' },
  { code: 'en', name: 'English',   cn: '英' },
  { code: 'fr', name: 'Français',  cn: '法' },
  { code: 'de', name: 'Deutsch',   cn: '德' },
  { code: 'it', name: 'Italiano',  cn: '意' },
  { code: 'pt', name: 'Português', cn: '葡' },
];

// ─── Toggle reutilizable (mismo estilo que música/intros) ────────────────────
function PrefToggle({ label, hint, value, onChange, first = false }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: '14px 18px', borderTop: first ? 'none' : `1px solid ${J.hair}` }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 14, color: J.ink, fontWeight: 600 }}>{label}</p>
        {hint && <p style={{ margin: 0, fontSize: 11, color: J.mute }}>{hint}</p>}
      </div>
      <button
        onClick={onChange}
        aria-pressed={value}
        style={{
          flexShrink: 0, width: 48, height: 28, borderRadius: 99, border: 0,
          cursor: 'pointer', position: 'relative', marginLeft: 12,
          background: value ? J.jade : J.hairS,
          transition: 'background 200ms ease',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: value ? 23 : 3,
          width: 22, height: 22, borderRadius: '50%', background: J.paperHi,
          transition: 'left 200ms ease', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}

// ─── Picker de avatar con tabs por género ───────────────────────────────────
function AvatarPicker({ currentId, gender, onSelect, onClose }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState(gender || 'all');
  // Nivel del usuario para el gating de avatares desbloqueables.
  const userLevel = useMemo(() => getLevelInfo(getStreak().totalXP || 0).level, []);

  const filtered = useMemo(() => {
    if (tab === 'all') return AVATARS;
    return AVATARS.filter(a => a.gender === tab);
  }, [tab]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        overflow: 'hidden',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        onWheel={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 520,
          background: J.paperHi,
          borderRadius: '22px 22px 0 0',
          padding: '18px 18px 28px',
          maxHeight: '85vh',
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{
          width: 40, height: 4, borderRadius: 99,
          background: J.hairS, margin: '0 auto 14px',
        }} />

        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: J.ink }}>{t('avatar_picker_title')}</h3>
          <button
            onClick={onClose}
            aria-label={t('aria_close', 'Cerrar')}
            style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              color: J.mute, fontSize: 24, lineHeight: 1, padding: 4,
            }}
          >×</button>
        </div>

        <div className="flex gap-2" style={{ marginBottom: 14 }}>
          {[
            { id: 'all', label: t('avatar_picker_all'), cn: '全部' },
            ...GENDERS.map(g => ({ id: g.id, label: t(g.i18nKey), cn: g.cn })),
          ].map(tabOpt => {
            const on = tab === tabOpt.id;
            return (
              <button
                key={tabOpt.id}
                onClick={() => setTab(tabOpt.id)}
                style={{
                  background: on ? J.ink : J.paper,
                  color: on ? J.paperHi : J.inkSoft,
                  border: 0, borderRadius: 99,
                  padding: '7px 14px', fontSize: 12.5, fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <span className="font-cn" style={{ marginRight: 6, fontSize: 13 }}>{tabOpt.cn}</span>
                {tabOpt.label}
              </button>
            );
          })}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
          gap: 10,
        }}>
          {filtered.map(av => {
            const selected = av.id === currentId;
            // El avatar equipado nunca se bloquea, aunque su nivel sea mayor
            // (usuarios que lo eligieron antes de existir el gating).
            const locked = !selected && !isAvatarUnlocked(av, userLevel);
            return (
              <button
                key={av.id}
                onClick={() => { if (!locked) onSelect(av.id); }}
                aria-disabled={locked}
                style={{
                  background: selected ? J.jade : J.paper,
                  border: `2px solid ${selected ? J.jadeDeep : J.hair}`,
                  borderRadius: 14,
                  padding: 6,
                  cursor: locked ? 'default' : 'pointer',
                  transition: 'transform 150ms ease, background 200ms ease',
                  transform: selected ? 'scale(1.04)' : 'scale(1)',
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                }}
                title={locked ? t('avatar_locked_level', 'Se desbloquea al nivel {{level}}', { level: av.minLevel }) : t('avatar_' + av.id, av.label)}
              >
                <img
                  src={av.src}
                  alt={av.label}
                  draggable={false}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', borderRadius: 10,
                    display: 'block',
                    filter: locked ? 'grayscale(1) brightness(0.75)' : 'none',
                    opacity: locked ? 0.6 : 1,
                  }}
                />
                {locked && (
                  <span style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 2,
                    color: '#fff', fontSize: 16,
                    textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                  }}>
                    🔒
                    <span style={{ fontSize: 10.5, fontWeight: 800 }}>
                      {t('avatar_locked_badge', 'Nv. {{level}}', { level: av.minLevel })}
                    </span>
                  </span>
                )}
                {selected && (
                  <span style={{
                    position: 'absolute', top: 4, right: 4,
                    background: J.butter, color: J.jadeDeep,
                    fontSize: 11, fontWeight: 800,
                    width: 20, height: 20, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                  }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function SettingsScreen({ userName, onUserNameChange, onProgressChange, allCharacters, onBack }) {
  const { t, i18n } = useTranslation();
  const music = useMusic();
  const { mode, user, signOut, migrateGuestToGoogle, pushSnapshot, deleteAccount } = useAuth();
  const [migrating, setMigrating] = useState(false);
  const [nameInput, setNameInput] = useState(userName || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [profile, setProfile] = useState(() => loadUserProfile());
  const [showPicker, setShowPicker] = useState(false);
  const [dailyGoal, setDailyGoalState] = useState(() => getStreak().dailyGoal || 120);
  const [showIntros, setShowIntros] = useState(() => introsEnabled());
  const [theme, setTheme] = useState(() => getThemePref());

  const handleThemeChange = (pref) => {
    setThemePref(pref); // aplica la clase .dark al instante
    setTheme(pref);
  };

  const handleIntrosToggle = () => {
    const next = !showIntros;
    setIntrosEnabled(next); // al activar limpia también los "no volver a mostrar"
    setShowIntros(next);
  };

  const handleDailyGoalChange = (xp) => {
    setDailyGoal(xp);
    setDailyGoalState(xp);
    pushSnapshot(); // la meta vive en streak data, que ya sincroniza
  };

  const handleNameBlur = () => {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== userName) onUserNameChange(trimmed);
  };

  const handleReset = () => {
    onProgressChange({});
    setShowResetConfirm(false);
  };

  // ── Sonido: efectos, vibración y velocidad de la voz ────────────────
  const [soundPrefs, setSoundPrefsState] = useState(() => getSoundPrefs());
  const patchSound = (patch) => setSoundPrefsState(setSoundPrefs(patch));

  // ── Eliminar cuenta (modo Google): doble confirmación ───────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleDeleteAccount = async () => {
    if (deleting) return;
    setDeleting(true);
    try { await deleteAccount(); } // al terminar, signOut → App vuelve a LoginScreen
    finally { setDeleting(false); setShowDeleteConfirm(false); }
  };

  // ── Exportar / importar progreso (backup local en JSON) ─────────────
  const importInputRef = useRef(null);
  const [importMsg, setImportMsg] = useState(null); // { ok: bool, text: string }

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite re-seleccionar el mismo archivo
    if (!file) return;
    try {
      const text = await file.text();
      restoreBackup(text);
      // En modo Google subimos el snapshot importado (si no, el pull de la
      // nube en el próximo arranque pisaría lo importado).
      if (mode === 'google') { try { await pushSnapshot(); } catch { /* noop */ } }
      setImportMsg({ ok: true, text: t('settings_import_ok', 'Progreso importado. Recargando…') });
      setTimeout(() => window.location.reload(), 900);
    } catch {
      setImportMsg({ ok: false, text: t('settings_import_error', 'Archivo no válido: usa un backup exportado desde la app.') });
    }
  };

  // Tras cualquier cambio de perfil, sincroniza con Firestore (no-op en
  // modo invitado). Sin esto, el género/avatar solo viajaba a la nube
  // cuando además cambiaba el progreso.
  const applyProfilePatch = (patch) => {
    setProfile(updateUserProfile(patch));
    pushSnapshot();
  };

  const handleGenderChange = (g) => applyProfilePatch({ gender: g });

  const handleAvatarChange = (avatarId) => {
    // Elegir un avatar de forma explícita significa "quiero este avatar":
    // desactivamos el uso de la foto de Google para que el cambio se vea de
    // inmediato. Si no, resolveAvatarSrc seguiría priorizando la foto de
    // Google (useGooglePhoto arranca en true) y el avatar nunca aparecería.
    applyProfilePatch({ avatarId, useGooglePhoto: false });
    setShowPicker(false);
  };

  const totalWords = allCharacters.filter(c => !c.isSupplementary).length;
  const currentAvatar = getAvatarById(profile.avatarId) || getAvatarById(DEFAULT_AVATAR_ID);
  const effectiveAvatar = resolveAvatarSrc(profile, mode, user?.photoURL, currentAvatar.src);

  return (
    <div style={{ minHeight: '100vh', background: J.paper, paddingBottom: 90 }}>
      <JTopBar
        left={
          onBack ? (
            <button
              onClick={onBack}
              style={{
                background: J.paperHi, border: `1px solid ${J.hair}`,
                borderRadius: 99, padding: '6px 12px',
                fontSize: 13, color: J.ink, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              ← {t('nav_profile', 'Perfil')}
            </button>
          ) : (
            <JMark />
          )
        }
        right={
          <span style={{ fontSize: 13, color: J.inkSoft, fontWeight: 700 }}>
            {t('nav_settings')}
          </span>
        }
      />

      <div className="j-rise" style={{ padding: '6px 20px 24px' }}>

        {/* ─── Perfil (nick + género + avatar) ─────────────────────────── */}
        <JSection label={t('settings_section_profile')} cn="个人资料" />
        <JCard padding="0">
          {/* Nick */}
          <div style={{ padding: '14px 18px' }}>
            <p style={{ fontSize: 11, color: J.mute, fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em' }}>{t('settings_label_nick')}</p>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
              style={{
                width: '100%', padding: '10px 14px', background: J.paper,
                border: `1px solid ${J.border}`, borderRadius: 12,
                fontSize: 14, color: J.ink, outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = J.jade}
              onBlurCapture={e => e.target.style.borderColor = J.hair}
            />
          </div>

          {/* Género */}
          <div style={{ padding: '14px 18px', borderTop: `1px solid ${J.hair}` }}>
            <p style={{ fontSize: 11, color: J.mute, fontWeight: 600, marginBottom: 8, letterSpacing: '0.04em' }}>{t('settings_label_gender')}</p>
            <div className="flex flex-wrap gap-2">
              {GENDERS.map(g => {
                const on = profile.gender === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => handleGenderChange(g.id)}
                    className="flex items-center gap-2"
                    style={{
                      padding: '8px 14px', borderRadius: 99, border: 0, cursor: 'pointer',
                      background: on ? J.ink : J.paper,
                      color: on ? J.paperHi : J.inkSoft,
                      fontSize: 12.5, fontWeight: 700,
                    }}
                  >
                    <span className="font-cn" style={{ fontSize: 14 }}>{g.cn}</span>
                    {t(g.i18nKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Avatar */}
          <div style={{ padding: '14px 18px', borderTop: `1px solid ${J.hair}` }}>
            <p style={{ fontSize: 11, color: J.mute, fontWeight: 600, marginBottom: 8, letterSpacing: '0.04em' }}>{t('settings_label_avatar')}</p>
            <button
              onClick={() => setShowPicker(true)}
              className="flex items-center gap-3 w-full"
              style={{
                background: J.paper, border: `1px solid ${J.hair}`,
                borderRadius: 12, padding: '10px 14px',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <img
                src={effectiveAvatar.src}
                alt={t('avatar_' + currentAvatar.id, currentAvatar.label)}
                referrerPolicy="no-referrer"
                style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 10, display: 'block' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13.5, color: J.ink, fontWeight: 700 }}>
                  {effectiveAvatar.isGoogle ? t('settings_avatar_google_label', 'Foto de Google') : t('avatar_' + currentAvatar.id, currentAvatar.label)}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: J.mute }}>{t('settings_avatar_change_hint')}</p>
              </div>
              <span style={{ color: J.mute, fontWeight: 700 }}>→</span>
            </button>
          </div>

          {/* Toggle: usar foto de Google */}
          {mode === 'google' && user?.photoURL && (
            <div className="flex items-center justify-between" style={{ padding: '14px 18px', borderTop: `1px solid ${J.hair}` }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, color: J.ink, fontWeight: 600 }}>
                  {t('settings_use_google_photo', 'Usar foto de Google')}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: J.mute }}>
                  {t('settings_use_google_photo_hint', 'Si la desactivas se mostrará el avatar elegido')}
                </p>
              </div>
              <button
                onClick={() => applyProfilePatch({ useGooglePhoto: !(profile.useGooglePhoto !== false) })}
                aria-pressed={profile.useGooglePhoto !== false}
                style={{
                  flexShrink: 0, width: 48, height: 28, borderRadius: 99, border: 0,
                  cursor: 'pointer', position: 'relative',
                  background: profile.useGooglePhoto !== false ? J.jade : J.hairS,
                  transition: 'background 200ms ease',
                }}
              >
                <span style={{
                  position: 'absolute', top: 3, left: profile.useGooglePhoto !== false ? 23 : 3,
                  width: 22, height: 22, borderRadius: '50%', background: J.paperHi,
                  transition: 'left 200ms ease', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }} />
              </button>
            </div>
          )}
        </JCard>

        {/* ─── Meta diaria ─────────────────────────────────────────────── */}
        <JSection label={t('settings_daily_goal', 'Meta diaria')} cn="目标" />
        <JCard padding="14px 18px">
          <div className="flex flex-wrap gap-2">
            {DAILY_GOAL_PRESETS.map(p => {
              const on = dailyGoal === p.xp;
              return (
                <button
                  key={p.id}
                  onClick={() => handleDailyGoalChange(p.xp)}
                  className="flex items-center gap-2"
                  style={{
                    padding: '8px 14px', borderRadius: 99, border: 0, cursor: 'pointer',
                    background: on ? J.ink : J.paper,
                    color: on ? J.paperHi : J.inkSoft,
                    fontSize: 12.5, fontWeight: 700,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{p.icon}</span>
                  {t(`settings_goal_${p.id}`)}
                  <span style={{ opacity: 0.7, fontWeight: 600 }}>{p.xp} XP</span>
                </button>
              );
            })}
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 11, color: J.mute }}>
            {t('settings_daily_goal_hint', 'XP que necesitas cada día para mantener tu objetivo. Una historia perfecta da 120 XP.')}
          </p>
        </JCard>

        {/* ─── Minijuegos ──────────────────────────────────────────────── */}
        <JSection label={t('settings_section_games', 'Minijuegos')} cn="游戏" />
        <JCard padding="0">
          <div className="flex items-center justify-between" style={{ padding: '14px 18px' }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 14, color: J.ink, fontWeight: 600 }}>
                {t('settings_game_intros_label', 'Explicaciones de los juegos')}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: J.mute }}>
                {t('settings_game_intros_hint', 'Mostrar las instrucciones antes de cada minijuego. Al activarlo se restauran también las ocultadas con "No volver a mostrar".')}
              </p>
            </div>
            <button
              onClick={handleIntrosToggle}
              aria-pressed={showIntros}
              style={{
                flexShrink: 0, width: 48, height: 28, borderRadius: 99, border: 0,
                cursor: 'pointer', position: 'relative', marginLeft: 12,
                background: showIntros ? J.jade : J.hairS,
                transition: 'background 200ms ease',
              }}
            >
              <span style={{
                position: 'absolute', top: 3, left: showIntros ? 23 : 3,
                width: 22, height: 22, borderRadius: '50%', background: J.paperHi,
                transition: 'left 200ms ease', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>
        </JCard>

        {/* ─── Idioma ──────────────────────────────────────────────────── */}
        <JSection label={t('settings_language')} cn="语言" />
        <JCard padding="14px 18px">
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => {
              const on = i18n.language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className="flex items-center gap-2"
                  style={{
                    padding: '7px 14px', borderRadius: 99, border: 0, cursor: 'pointer',
                    background: on ? J.ink : J.paper,
                    color: on ? J.paperHi : J.inkSoft,
                    fontSize: 12.5, fontWeight: 700,
                  }}
                >
                  <span className="font-cn" style={{ fontSize: 14 }}>{lang.cn}</span>
                  {lang.name}
                </button>
              );
            })}
          </div>
        </JCard>

        {/* ─── Apariencia (tema claro/oscuro) ──────────────────────────── */}
        <JSection label={t('settings_appearance', 'Apariencia')} cn="外观" />
        <JCard padding="14px 18px">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'light',  icon: '☀️', label: t('theme_light', 'Claro') },
              { id: 'dark',   icon: '🌙', label: t('theme_dark', 'Oscuro') },
              { id: 'system', icon: '🖥️', label: t('theme_system', 'Sistema') },
            ].map(opt => {
              const on = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleThemeChange(opt.id)}
                  className="flex items-center gap-2"
                  style={{
                    padding: '8px 14px', borderRadius: 99, border: 0, cursor: 'pointer',
                    background: on ? J.ink : J.paper,
                    color: on ? J.paperHi : J.inkSoft,
                    fontSize: 12.5, fontWeight: 700,
                  }}
                >
                  <span style={{ fontSize: 14 }}>{opt.icon}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 11, color: J.mute }}>
            {t('settings_appearance_hint', '«Sistema» sigue el modo claro/oscuro de tu dispositivo.')}
          </p>
        </JCard>

        {/* ─── Música ──────────────────────────────────────────────────── */}
        {music && (
          <>
            <JSection label={t('settings_music_title')} cn="音乐" />
            <JCard padding="0">
              <div className="flex items-center justify-between" style={{ padding: '14px 18px' }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, color: J.ink, fontWeight: 600 }}>{t('settings_music_label')}</p>
                  <p style={{ margin: 0, fontSize: 11, color: J.mute }}>{t('settings_music_credit')}</p>
                </div>
                <button
                  onClick={() => music.toggle()}
                  aria-pressed={music.enabled}
                  style={{
                    flexShrink: 0, width: 48, height: 28, borderRadius: 99, border: 0,
                    cursor: 'pointer', position: 'relative',
                    background: music.enabled ? J.jade : J.hairS,
                    transition: 'background 200ms ease',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: 3, left: music.enabled ? 23 : 3,
                    width: 22, height: 22, borderRadius: '50%', background: J.paperHi,
                    transition: 'left 200ms ease', boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }} />
                </button>
              </div>

              <div style={{ padding: '14px 18px', borderTop: `1px solid ${J.hair}` }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                  <p style={{ margin: 0, fontSize: 11, color: J.mute, fontWeight: 600, letterSpacing: '0.04em' }}>{t('settings_volume')}</p>
                  <span style={{ fontSize: 12, color: J.inkSoft, fontWeight: 700 }}>{Math.round(music.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0" max="1" step="0.05"
                  value={music.volume}
                  onChange={e => music.setVolume(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: J.jade, cursor: 'pointer' }}
                />
              </div>
            </JCard>
          </>
        )}

        {/* ─── Sonido (efectos, vibración, velocidad de voz) ───────────── */}
        <JSection label={t('settings_sound_title', 'Sonido y vibración')} cn="音效" />
        <JCard padding="0">
          <PrefToggle
            first
            label={t('settings_effects_label', 'Efectos de sonido')}
            hint={t('settings_effects_hint', 'Sonidos de acierto y error en los ejercicios.')}
            value={soundPrefs.effects}
            onChange={() => patchSound({ effects: !soundPrefs.effects })}
          />
          <PrefToggle
            label={t('settings_haptics_label', 'Vibración')}
            hint={t('settings_haptics_hint', 'Vibración al responder (según dispositivo).')}
            value={soundPrefs.haptics}
            onChange={() => patchSound({ haptics: !soundPrefs.haptics })}
          />
          <div style={{ padding: '14px 18px', borderTop: `1px solid ${J.hair}` }}>
            <p style={{ margin: '0 0 8px', fontSize: 14, color: J.ink, fontWeight: 600 }}>
              {t('settings_voice_rate_label', 'Velocidad de la voz')}
            </p>
            <div className="flex gap-2">
              {[
                { rate: 0.8, label: t('settings_voice_rate_slow', 'Lenta') },
                { rate: 1.0, label: t('settings_voice_rate_normal', 'Normal') },
              ].map(opt => {
                const on = soundPrefs.voiceRate === opt.rate;
                return (
                  <button
                    key={opt.rate}
                    onClick={() => patchSound({ voiceRate: opt.rate })}
                    style={{
                      padding: '7px 16px', borderRadius: 99, border: 0, cursor: 'pointer',
                      background: on ? J.ink : J.paper,
                      color: on ? J.paperHi : J.inkSoft,
                      fontSize: 12.5, fontWeight: 700,
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p style={{ margin: '8px 0 0', fontSize: 11, color: J.mute }}>
              {t('settings_voice_rate_hint', 'Afecta a la pronunciación leída por voz (TTS).')}
            </p>
          </div>
        </JCard>

        {/* ─── Cuenta ─────────────────────────────────────────────────── */}
        <JSection label={t('settings_section_account', 'Cuenta')} cn="账户" />
        <JCard padding="14px 18px">
          {mode === 'google' && (
            <>
              {user?.email && (
                <p style={{
                  margin: '0 0 10px', fontSize: 12.5, color: J.mute,
                  fontWeight: 600, textAlign: 'center', wordBreak: 'break-all',
                }}>
                  {user.email}
                </p>
              )}
              <button
                onClick={signOut}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 14,
                  border: `1px solid ${J.sandBg}`, background: 'transparent',
                  color: J.sandDeep, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}
              >
                {t('settings_sign_out', 'Cerrar sesión')}
              </button>

              {/* Eliminar cuenta y todos los datos (requisito de Google Play).
                  Doble confirmación: primero desplegar, luego confirmar. */}
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    width: '100%', marginTop: 10, padding: '10px 16px', borderRadius: 14,
                    border: 0, background: 'transparent',
                    color: J.mute, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {t('settings_delete_account', 'Eliminar cuenta y datos')}
                </button>
              ) : (
                <div className="space-y-3" style={{ marginTop: 12 }}>
                  <p style={{ fontSize: 13, color: J.redDeep, textAlign: 'center', fontWeight: 600, lineHeight: 1.45 }}>
                    {t('settings_delete_account_confirm',
                      'Se borrará tu progreso de la nube, tus amistades y tu cuenta. Esto no se puede deshacer. ¿Seguro?')}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deleting}
                      style={{
                        flex: 1, padding: '12px', borderRadius: 99, border: `1px solid ${J.hair}`,
                        background: J.paperHi, color: J.ink, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      {t('settings_cancel')}
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleting}
                      style={{
                        flex: 1, padding: '12px', borderRadius: 99, border: 0,
                        background: J.red, color: J.onAccent, fontSize: 14, fontWeight: 700,
                        cursor: deleting ? 'default' : 'pointer', opacity: deleting ? 0.6 : 1,
                        boxShadow: '0 4px 12px -4px rgba(200,57,47,0.5)',
                      }}
                    >
                      {deleting
                        ? t('settings_delete_account_busy', 'Borrando…')
                        : t('settings_delete_account_do', 'Borrar todo')}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          {mode === 'guest' && (
            <>
              <p style={{
                margin: '0 0 12px', fontSize: 12.5, color: J.inkSoft,
                fontWeight: 500, textAlign: 'center', lineHeight: 1.45,
              }}>
                {t(
                  'settings_guest_explanation',
                  'Estás como invitado. Guarda tu progreso en la nube para no perderlo y poder seguir desde otro dispositivo.',
                )}
              </p>
              <button
                onClick={async () => {
                  if (migrating) return;
                  setMigrating(true);
                  try { await migrateGuestToGoogle(); }
                  finally { setMigrating(false); }
                }}
                disabled={migrating}
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: 14, border: 0,
                  background: J.jade, color: J.onAccent,
                  fontSize: 14, fontWeight: 700, cursor: migrating ? 'default' : 'pointer',
                  opacity: migrating ? 0.6 : 1,
                  boxShadow: '0 4px 12px -4px rgba(31,74,51,0.4)',
                }}
              >
                {migrating
                  ? t('settings_save_cloud_busy', 'Conectando…')
                  : t('settings_save_cloud', 'Guardar progreso en la nube')}
              </button>
            </>
          )}
        </JCard>

        {/* ─── Datos ────────────────────────────────────────────────────── */}
        <JSection label={t('settings_data')} cn="数据" />
        <JCard padding="14px 18px">
          {/* Backup local: exportar/importar el progreso a un archivo JSON.
              Clave para invitados (sin nube): si borran datos del navegador
              lo pierden todo. */}
          <div className="flex gap-2" style={{ marginBottom: 12 }}>
            <button
              onClick={downloadBackup}
              style={{
                flex: 1, padding: '12px 10px', borderRadius: 14,
                border: `1px solid ${J.hair}`, background: J.paperHi,
                color: J.ink, fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
              }}
            >
              ⬇ {t('settings_export', 'Exportar progreso')}
            </button>
            <button
              onClick={() => importInputRef.current?.click()}
              style={{
                flex: 1, padding: '12px 10px', borderRadius: 14,
                border: `1px solid ${J.hair}`, background: J.paperHi,
                color: J.ink, fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
              }}
            >
              ⬆ {t('settings_import', 'Importar progreso')}
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              style={{ display: 'none' }}
            />
          </div>
          {importMsg && (
            <p role="status" style={{
              fontSize: 12.5, textAlign: 'center', marginBottom: 12,
              color: importMsg.ok ? J.jadeDeep : J.redDeep, fontWeight: 600,
            }}>
              {importMsg.text}
            </p>
          )}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 14,
                border: `1px solid ${J.sandBg}`, background: 'transparent',
                color: J.sandDeep, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {t('settings_reset')}
            </button>
          ) : (
            <div className="space-y-3">
              <p style={{ fontSize: 14, color: J.ink, textAlign: 'center' }}>{t('settings_reset_confirm')}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 99, border: `1px solid ${J.hair}`,
                    background: J.paperHi, color: J.ink, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  {t('settings_cancel')}
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 99, border: 0,
                    background: J.red, color: J.onAccent, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 12px -4px rgba(200,57,47,0.5)',
                  }}
                >
                  {t('settings_confirm_reset')}
                </button>
              </div>
            </div>
          )}
        </JCard>

        {/* ─── Acerca de (footer compacto) ────────────────────────────── */}
        <p style={{
          marginTop: 18, textAlign: 'center', fontSize: 11.5,
          color: J.mute, fontWeight: 500, letterSpacing: '0.02em',
        }}>
          {APP_NAME} · {APP_VERSION} · {t('settings_words_included')}: {totalWords}
          {' · '}
          <a
            href={assetUrl('privacidad.html')}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: J.mute, textDecoration: 'underline' }}
          >
            {t('settings_privacy_link', 'Privacidad')}
          </a>
        </p>
      </div>

      {showPicker && (
        <AvatarPicker
          currentId={profile.avatarId}
          gender={profile.gender}
          onSelect={handleAvatarChange}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
