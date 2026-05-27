import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { JTopBar, JMark, JLabel, JCard, JSection } from '@/components/jade';
import { getLessonStats } from '@/utils/progress.js';
import { getSRSStats } from '@/utils/srs.js';
import { getStreak } from '@/utils/streak.js';
import { getLevelInfo, getEquippedTitle } from '@/utils/leveling.js';
import { AVATARS, getAvatarById, DEFAULT_AVATAR_ID } from '@/data/avatars.js';
import { loadUserProfile, updateUserProfile, GENDERS } from '@/utils/userProfile.js';

const LANGUAGES = [
  { code: 'es', name: 'Español',   cn: '西' },
  { code: 'en', name: 'English',   cn: '英' },
  { code: 'fr', name: 'Français',  cn: '法' },
  { code: 'de', name: 'Deutsch',   cn: '德' },
  { code: 'it', name: 'Italiano',  cn: '意' },
  { code: 'pt', name: 'Português', cn: '葡' },
];

function ProfileRow({ l, v, tag, accent, first }) {
  return (
    <div
      className="flex items-baseline justify-between gap-3"
      style={{
        padding: '14px 18px',
        borderTop: first ? 0 : `1px solid ${J.hair}`,
      }}
    >
      <span style={{ fontSize: 14, color: J.ink, fontWeight: 500 }}>{l}</span>
      <div className="flex items-baseline gap-2">
        {tag && (
          <span style={{ fontSize: 11, color: J.mute, fontWeight: 600, letterSpacing: '0.02em' }}>{tag}</span>
        )}
        <span style={{
          fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em',
          color: accent === 'red' ? J.red : accent === 'jade' ? J.jade : J.ink,
        }}>{v}</span>
      </div>
    </div>
  );
}

// ─── Picker de avatar con tabs por género ───────────────────────────────────
function AvatarPicker({ currentId, gender, onSelect, onClose }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState(gender || 'all');

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
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 520,
          background: J.paperHi,
          borderRadius: '22px 22px 0 0',
          padding: '18px 18px 28px',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {/* Asa */}
        <div style={{
          width: 40, height: 4, borderRadius: 99,
          background: J.hairS, margin: '0 auto 14px',
        }} />

        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: J.ink }}>{t('avatar_picker_title')}</h3>
          <button onClick={onClose} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            color: J.mute, fontSize: 24, lineHeight: 1, padding: 4,
          }}>×</button>
        </div>

        {/* Tabs */}
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

        {/* Grid de avatares */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))',
          gap: 10,
        }}>
          {filtered.map(av => {
            const selected = av.id === currentId;
            return (
              <button
                key={av.id}
                onClick={() => onSelect(av.id)}
                style={{
                  background: selected ? J.jade : J.paper,
                  border: `2px solid ${selected ? J.jadeDeep : J.hair}`,
                  borderRadius: 14,
                  padding: 6,
                  cursor: 'pointer',
                  transition: 'transform 150ms ease, background 200ms ease',
                  transform: selected ? 'scale(1.04)' : 'scale(1)',
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  overflow: 'hidden',
                }}
                title={av.label}
              >
                <img
                  src={av.src}
                  alt={av.label}
                  draggable={false}
                  style={{
                    width: '100%', height: '100%',
                    objectFit: 'cover', borderRadius: 10,
                    display: 'block',
                  }}
                />
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

export default function SettingsScreen({ userName, onUserNameChange, progress, onProgressChange, allCharacters }) {
  const { t, i18n } = useTranslation();
  const [nameInput, setNameInput] = useState(userName || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [profile, setProfile] = useState(() => loadUserProfile());
  const [showPicker, setShowPicker] = useState(false);

  const handleNameBlur = () => {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== userName) onUserNameChange(trimmed);
  };

  const handleReset = () => {
    onProgressChange({});
    setShowResetConfirm(false);
  };

  const handleGenderChange = (g) => {
    setProfile(updateUserProfile({ gender: g }));
  };

  const handleAvatarChange = (avatarId) => {
    setProfile(updateUserProfile({ avatarId }));
    setShowPicker(false);
  };

  const totalWords = allCharacters.filter(c => !c.isSupplementary).length;
  const srsStats = getSRSStats(progress, allCharacters);
  const streak = getStreak();
  const levelInfo = useMemo(() => getLevelInfo(streak.totalXP || 0), [streak.totalXP]);
  const equipped = useMemo(() => getEquippedTitle(streak.totalXP || 0), [streak.totalXP]);

  const currentAvatar = getAvatarById(profile.avatarId) || getAvatarById(DEFAULT_AVATAR_ID);

  const days = useMemo(() => {
    const dateSet = new Set(streak.activityDates || []);
    return Array.from({ length: 30 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return dateSet.has(str) ? 'on' : 'off';
    });
  }, [streak.activityDates]);

  const totalStudyMin = useMemo(() => {
    const sessions = progress?.__sessions || [];
    const ms = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    return Math.round(ms / 60000);
  }, [progress]);

  const accuracy = useMemo(() => {
    const srs = progress?.__srs || {};
    let correct = 0, total = 0;
    for (const d of Object.values(srs)) {
      if (d.reviews) { total += d.reviews; correct += d.correct || 0; }
    }
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  }, [progress]);

  const totalMastered = useMemo(() => {
    let total = 0;
    for (let i = 1; i <= 4; i++) {
      total += getLessonStats(progress, i, allCharacters).mastered;
    }
    return total;
  }, [progress, allCharacters]);

  return (
    <div style={{ minHeight: '100vh', background: J.paper, paddingBottom: 90 }}>
      <JTopBar
        left={<JMark />}
        right={
          <button style={{ background: 'transparent', border: 0, fontSize: 13, color: J.inkSoft, fontWeight: 600, cursor: 'pointer' }}>
            {t('nav_settings')}
          </button>
        }
      />

      <div style={{ padding: '6px 20px 24px' }}>

        {/* ─── Cabecera con avatar + nombre ──────────────────────────────── */}
        <div style={{ marginTop: 8, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setShowPicker(true)}
            aria-label={t('profile_edit_aria')}
            style={{
              background: J.paperHi,
              border: `3px solid ${J.jade}`,
              borderRadius: '50%',
              width: 88, height: 88,
              padding: 0,
              cursor: 'pointer',
              overflow: 'hidden',
              flexShrink: 0,
              position: 'relative',
              boxShadow: '0 4px 12px -3px rgba(0,0,0,0.20)',
            }}
          >
            <img
              src={currentAvatar.src}
              alt={currentAvatar.label}
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* lápiz pequeño en esquina */}
            <span style={{
              position: 'absolute', bottom: -2, right: -2,
              background: J.red, color: J.paperHi,
              width: 26, height: 26, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12,
              border: `2px solid ${J.paper}`,
            }}>✎</span>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.025em', color: J.ink }}>
              {userName || t('settings_default_user')}<span style={{ color: J.red }}>.</span>
            </h1>
            <div style={{ marginTop: 6, fontSize: 13.5, color: J.inkSoft, fontWeight: 500 }}>
              <span style={{ marginRight: 6 }}>{equipped.icon}</span>
              {equipped.title?.[i18n.language] || equipped.title?.es} · <span className="font-cn">{equipped.zh}</span>
            </div>
          </div>
        </div>

        {/* ─── Nivel y XP ────────────────────────────────────────────────── */}
        <JSection label={t('settings_section_level')} cn="等级" />
        <div style={{
          background: J.jade, color: J.paperHi,
          borderRadius: 18, padding: '18px 20px',
          marginBottom: 4,
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 6px 16px -6px rgba(31,74,51,0.5)',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: J.jadeDeep, opacity: 0.45 }} />
          <div style={{ position: 'relative' }}>
            <div className="flex items-end justify-between">
              <div>
                <JLabel color={J.butter}>{t('settings_level_current')}</JLabel>
                <div className="flex items-baseline gap-2" style={{ marginTop: 4 }}>
                  <span style={{ fontSize: 56, fontWeight: 800, color: J.butter, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                    {levelInfo.level}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
                    Lv.
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                  {t('settings_xp_total')}
                </span>
                <div style={{ fontSize: 22, fontWeight: 800, color: J.paperHi, marginTop: 4, letterSpacing: '-0.02em' }}>
                  {(streak.totalXP || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Barra de progreso al siguiente nivel */}
            {!levelInfo.isMaxLevel ? (
              <div style={{ marginTop: 14 }}>
                <div className="flex items-center gap-2" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                    Lv.{levelInfo.level}
                  </span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.30)' }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${levelInfo.progress}%`, background: J.butter }} />
                  </div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                    Lv.{levelInfo.level + 1}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', textAlign: 'center' }}>
                  {t('settings_xp_to_next', { xp: levelInfo.xpForNext - levelInfo.xpInLevel })}
                </div>
              </div>
            ) : (
              <div style={{ marginTop: 14, fontSize: 13, color: J.butter, fontWeight: 800, textAlign: 'center' }}>
                ★ {t('settings_max_level')}
              </div>
            )}
          </div>
        </div>

        {/* ─── Streak hero (si tiene racha activa) ─────────────────────── */}
        {streak.currentStreak > 0 && (
          <div style={{
            background: J.red, color: J.paperHi, borderRadius: 22,
            padding: '20px 22px 18px', position: 'relative', overflow: 'hidden',
            marginTop: 14, marginBottom: 18, boxShadow: '0 8px 24px rgba(200,57,47,0.30)',
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: J.redDeep, opacity: 0.5 }} />
            <div style={{ position: 'relative' }}>
              <div className="flex justify-between items-start">
                <div>
                  <JLabel color={J.butter}>{t('settings_streak_current')} · 连续</JLabel>
                  <div className="flex items-baseline gap-2" style={{ marginTop: 8 }}>
                    <span style={{ fontSize: 64, fontWeight: 800, color: J.butter, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                      {streak.currentStreak}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{t('settings_day', { count: streak.currentStreak })}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>
                    {t('settings_streak_record')}
                  </span>
                  <div style={{ fontSize: 24, fontWeight: 800, color: J.paperHi, marginTop: 6, letterSpacing: '-0.02em' }}>
                    {streak.longestStreak || streak.currentStreak}
                  </div>
                </div>
              </div>

              <div className="grid gap-1" style={{ marginTop: 18, gridTemplateColumns: 'repeat(15, 1fr)' }}>
                {days.map((d, i) => (
                  <div key={i} style={{
                    aspectRatio: '1 / 1', borderRadius: 4,
                    background: d === 'on' ? J.butter : 'rgba(255,255,255,0.12)',
                  }} />
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, letterSpacing: '0.04em' }}>
                {t('settings_streak_last_30')}
              </div>
            </div>
          </div>
        )}

        {/* ─── Progreso general ─────────────────────────────────────────── */}
        <JSection label={t('settings_progress')} cn="进步" />
        <JCard padding="0">
          <ProfileRow l={t('settings_progress_chars_learned')} v={srsStats.learned} tag={t('settings_progress_hsk_tag')} first />
          <ProfileRow l={t('settings_progress_study_time')} v={totalStudyMin > 0 ? `${Math.floor(totalStudyMin / 60)}h ${totalStudyMin % 60}m` : '0m'} tag={t('settings_progress_pace_tag')} />
          <ProfileRow l={t('settings_progress_accuracy')} v={`${accuracy}%`} tag={accuracy >= 80 ? t('settings_progress_accuracy_good') : t('settings_progress_accuracy_meh')} accent="jade" />
          <ProfileRow l={t('settings_progress_chars_mastered')} v={totalMastered} tag={t('settings_progress_record_tag')} accent="red" />
        </JCard>

        {/* ─── Perfil (nick + género) ───────────────────────────────────── */}
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
                border: `1px solid ${J.hair}`, borderRadius: 12,
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

          {/* Avatar (botón abre picker) */}
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
                src={currentAvatar.src}
                alt={currentAvatar.label}
                style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 10, display: 'block' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13.5, color: J.ink, fontWeight: 700 }}>{currentAvatar.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: J.mute }}>{t('settings_avatar_change_hint')}</p>
              </div>
              <span style={{ color: J.mute, fontWeight: 700 }}>→</span>
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

        {/* ─── Datos ────────────────────────────────────────────────────── */}
        <JSection label={t('settings_data')} cn="数据" />
        <JCard padding="14px 18px">
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
                    background: J.red, color: J.paperHi, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 4px 12px -4px rgba(200,57,47,0.5)',
                  }}
                >
                  {t('settings_confirm_reset')}
                </button>
              </div>
            </div>
          )}
        </JCard>

        {/* ─── Acerca de ───────────────────────────────────────────────── */}
        <JSection label={t('settings_about')} cn="关于" />
        <JCard padding="0">
          <ProfileRow l={t('settings_app_label')} v="Aprende Chino" first />
          <ProfileRow l={t('settings_version')} v="v0.7" />
          <ProfileRow l={t('settings_words_included')} v={totalWords} />
        </JCard>
      </div>

      {/* Picker de avatares */}
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
