// src/components/ProfileScreen.jsx
// Pantalla de "perfil del usuario": stats y gamificación. Aquí muestra lo
// que motiva (nivel, XP, racha, progreso). La configuración real vive en
// SettingsScreen; el engranaje arriba a la derecha lleva allí.
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { JTopBar, JMark, JLabel, JCard, JSection } from '@/components/jade';
import { getLessonStats } from '@/utils/progress.js';
import { getSRSStats } from '@/utils/srs.js';
import { getStreak } from '@/utils/streak.js';
import { getLevelInfo, getEquippedTitle } from '@/utils/leveling.js';
import { getAvatarById, DEFAULT_AVATAR_ID } from '@/data/avatars.js';
import { loadUserProfile, resolveAvatarSrc } from '@/utils/userProfile.js';
import { computeBadges } from '@/utils/badges.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useLocalSnapshot } from '@/hooks/useLocalSnapshot.js';

// URL pública de la app — se incluye en el texto compartido para que quien
// lo reciba pueda abrirla. Si en el futuro tenéis dominio propio, cambiad aquí.
const APP_URL = 'https://aprende-chino-hsk1.vercel.app/';

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

// Engranaje SVG inline — sin dependencias extra.
function GearIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

export default function ProfileScreen({ userName, progress, allCharacters, onOpenSettings }) {
  const { t, i18n } = useTranslation();
  const { mode, user } = useAuth();
  // useLocalSnapshot relee perfil y racha si llega un sync remoto.
  const profile = useLocalSnapshot(loadUserProfile);
  const [shareNote, setShareNote] = useState(null); // feedback fugaz para el botón compartir

  const srsStats = getSRSStats(progress, allCharacters);
  const streak = useLocalSnapshot(getStreak);
  const levelInfo = useMemo(() => getLevelInfo(streak.totalXP || 0), [streak.totalXP]);
  const equipped = useMemo(() => getEquippedTitle(streak.totalXP || 0), [streak.totalXP]);

  const currentAvatar = getAvatarById(profile.avatarId) || getAvatarById(DEFAULT_AVATAR_ID);
  const effectiveAvatar = resolveAvatarSrc(profile, mode, user?.photoURL, currentAvatar.src);

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
    // Lecciones presentes en los datos (8 hoy; si se añaden más, esto
    // las recoge solo en lugar de un rango hardcodeado).
    const lessons = [...new Set(allCharacters.map(c => c.lesson).filter(Boolean))];
    let total = 0;
    for (const n of lessons) {
      total += getLessonStats(progress, n, allCharacters).mastered;
    }
    return total;
  }, [progress, allCharacters]);

  // Catálogo evaluado: cada item tiene `earned` (boolean) según los datos.
  // useLocalSnapshot: los badges también leen localStorage (racha, historias…).
  const badges = useLocalSnapshot(
    () => computeBadges(progress, allCharacters),
    [progress, allCharacters],
  );
  const earnedCount = badges.filter(b => b.earned).length;

  // Compartir: Web Share API si está disponible (móviles), si no copia al
  // portapapeles. Mensaje incluye nick, nivel, racha y URL de la app.
  const handleShare = async () => {
    const lines = [
      `${userName || t('settings_default_user')} está aprendiendo chino 🇨🇳`,
      `Nivel ${levelInfo.level} · ${(streak.totalXP || 0).toLocaleString()} XP`,
    ];
    if (streak.currentStreak > 0) {
      lines.push(`🔥 ${streak.currentStreak} ${t('settings_day', { count: streak.currentStreak })} de racha`);
    }
    const text = `${lines.join('\n')}\n\n${APP_URL}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Aprende Chino', text, url: APP_URL });
      } else {
        await navigator.clipboard.writeText(text);
        setShareNote('copied');
        setTimeout(() => setShareNote(null), 2000);
      }
    } catch (e) {
      // El usuario canceló el diálogo de share o el clipboard falló — ignorar.
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: J.paper, paddingBottom: 90 }}>
      <JTopBar
        left={<JMark />}
        right={
          <button
            onClick={onOpenSettings}
            aria-label={t('nav_settings')}
            style={{
              background: 'transparent', border: 0, padding: 6, borderRadius: 10,
              color: J.inkSoft, cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}
          >
            <GearIcon />
          </button>
        }
      />

      <div className="j-rise" style={{ padding: '6px 20px 24px' }}>

        {/* ─── Cabecera con avatar + nombre ──────────────────────────────── */}
        <div style={{ marginTop: 8, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{
            background: J.paperHi,
            border: `3px solid ${J.jade}`,
            borderRadius: '50%',
            width: 88, height: 88,
            overflow: 'hidden',
            flexShrink: 0,
            display: 'block',
            boxShadow: '0 4px 12px -3px rgba(0,0,0,0.20)',
          }}>
            <img
              src={effectiveAvatar.src}
              alt={currentAvatar.label}
              draggable={false}
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 26, lineHeight: 1.1, letterSpacing: '-0.025em', color: J.ink }}>
              {userName || t('settings_default_user')}<span style={{ color: J.red }}>.</span>
            </h1>
            <div style={{ marginTop: 6, fontSize: 13.5, color: J.inkSoft, fontWeight: 500 }}>
              <span style={{ marginRight: 6 }}>{equipped.icon}</span>
              {equipped.title?.[i18n.language] || equipped.title?.es} · <span className="font-cn">{equipped.zh}</span>
            </div>
            {mode === 'google' && user?.email && (
              <p style={{ margin: '4px 0 0', fontSize: 12, color: J.mute, fontWeight: 500, wordBreak: 'break-all' }}>
                {user.email}
              </p>
            )}
          </div>
        </div>

        {/* ─── Nivel y XP ────────────────────────────────────────────────── */}
        <JSection label={t('settings_section_level')} cn="等级" />
        <div style={{
          background: J.jade, color: J.onAccent,
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
                <div style={{ fontSize: 22, fontWeight: 800, color: J.onAccent, marginTop: 4, letterSpacing: '-0.02em' }}>
                  {(streak.totalXP || 0).toLocaleString()}
                </div>
              </div>
            </div>

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

        {/* ─── Streak hero ─────────────────────────────────────────────── */}
        {streak.currentStreak > 0 && (
          <div style={{
            background: J.red, color: J.onAccent, borderRadius: 22,
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
                  <div style={{ fontSize: 24, fontWeight: 800, color: J.onAccent, marginTop: 6, letterSpacing: '-0.02em' }}>
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

        {/* ─── Insignias ──────────────────────────────────────────────── */}
        <div className="flex items-baseline justify-between" style={{ marginTop: 20, marginBottom: 6 }}>
          <JSection label={t('profile_badges', 'Insignias')} cn="徽章" />
          <span style={{ fontSize: 12, fontWeight: 700, color: J.mute }}>
            {earnedCount} / {badges.length}
          </span>
        </div>
        <JCard padding="14px 14px 16px">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))',
            gap: 10,
          }}>
            {badges.map(b => (
              <div
                key={b.id}
                title={`${b.title} — ${b.desc}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                  padding: '10px 6px', borderRadius: 12,
                  background: b.earned ? J.jadeBg : J.paper,
                  border: `1px solid ${b.earned ? J.jadeMid : J.hair}`,
                  opacity: b.earned ? 1 : 0.55,
                  transition: 'all 200ms ease',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 26, filter: b.earned ? 'none' : 'grayscale(1)' }}>
                  {b.icon}
                </span>
                <span style={{
                  fontSize: 10.5, fontWeight: 700, lineHeight: 1.2,
                  color: b.earned ? J.jadeDeep : J.muteStrong,
                }}>
                  {b.title}
                </span>
              </div>
            ))}
          </div>
        </JCard>

        {/* ─── Compartir perfil ───────────────────────────────────────── */}
        <button
          onClick={handleShare}
          style={{
            width: '100%', marginTop: 18,
            padding: '14px 18px', borderRadius: 14, border: 0,
            background: J.red, color: J.onAccent,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px -4px rgba(200,57,47,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          {shareNote === 'copied'
            ? t('profile_share_copied', '¡Copiado al portapapeles!')
            : t('profile_share', 'Compartir mi perfil')}
        </button>

      </div>
    </div>
  );
}
