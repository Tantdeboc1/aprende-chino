import SkillProgress from '@/components/SkillProgress.jsx';
// src/components/ProfileScreen.jsx
// Pantalla de "perfil del usuario": stats y gamificación. Aquí muestra lo
// que motiva (nivel, XP, racha, progreso). La configuración real vive en
// SettingsScreen; el engranaje arriba a la derecha lleva allí.
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { JTopBar, JMark, JCard, JSection } from '@/components/jade';
import { getLessonStats } from '@/utils/progress.js';
import { getSRSStats } from '@/utils/srs.js';
import { getStreak } from '@/utils/streak.js';
import { getLevelInfo, getEquippedTitle } from '@/utils/leveling.js';
import { getAvatarById, DEFAULT_AVATAR_ID } from '@/data/avatars.js';
import { loadUserProfile, resolveAvatarSrc } from '@/utils/userProfile.js';
import { computeBadges } from '@/utils/badges.js';
import { loc, baseLang } from '@/utils/loc.js';
import { useIncomingRequestCount } from '@/hooks/useIncomingRequestCount.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useLocalSnapshot } from '@/hooks/useLocalSnapshot.js';
import { APP_NAME, APP_URL } from '@/utils/appInfo.js';

function ProfileRow({ l, v, tag, accent, first }) {
  return (
    <div
      className="flex items-baseline justify-between gap-3"
      style={{
        padding: '14px 18px',
        borderTop: first ? 0 : `1px solid ${J.hair}`,
      }}
    >
      <span style={{ fontSize: '0.875rem', color: J.ink, fontWeight: 500 }}>{l}</span>
      <div className="flex items-baseline gap-2">
        {tag && (
          <span style={{ fontSize: '0.6875rem', color: J.mute, fontWeight: 600, letterSpacing: '0.02em' }}>{tag}</span>
        )}
        <span style={{
          fontSize: '0.875rem', fontWeight: 800, letterSpacing: '-0.01em',
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

export default function ProfileScreen({ userName, progress, allCharacters, onOpenSettings, onOpenFriends, onPractice }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language; // loc() ya normaliza los códigos regionales
  const { mode, user } = useAuth();
  // useLocalSnapshot relee perfil y racha si llega un sync remoto.
  const profile = useLocalSnapshot(loadUserProfile);
  const [shareNote, setShareNote] = useState(null); // feedback fugaz para el botón compartir
  // Invitaciones pendientes: el badge que antes vivía en la pestaña Amigos.
  const incomingCount = useIncomingRequestCount();

  // Memoizado como el resto de estadísticas derivadas de esta pantalla: sin
  // esto, cualquier estado ajeno (compartir, abrir una insignia) recalculaba
  // el escaneo del SRS sobre todos los caracteres.
  const srsStats = useMemo(() => getSRSStats(progress, allCharacters), [progress, allCharacters]);
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

  // XP de los últimos 7 días (mismo dato que ya alimenta el ranking semanal
  // de amigos, streak.xpByDay) — solo falta pintarlo. Intl.DateTimeFormat da
  // la inicial del día en el idioma activo sin añadir claves i18n nuevas.
  const weeklyXp = useMemo(() => {
    const byDay = streak.xpByDay || {};
    const fmt = new Intl.DateTimeFormat(lang, { weekday: 'narrow' });
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return { key, xp: byDay[key] || 0, isToday: i === 6, label: fmt.format(d) };
    });
  }, [streak.xpByDay, lang]);
  const weeklyXpMax = Math.max(streak.dailyGoal || 120, ...weeklyXp.map(d => d.xp), 1);

  const totalStudyMin = useMemo(() => {
    const sessions = progress?.__sessions || [];
    const ms = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    return Math.round(ms / 60000);
  }, [progress]);

  const answerStats = useMemo(() => {
    let correct = 0, total = 0;
    for (const [key, lesson] of Object.entries(progress || {})) {
      if (!key.startsWith('lesson_') || !lesson || typeof lesson !== 'object') continue;
      for (const [char, word] of Object.entries(lesson)) {
        if (char.startsWith('__') || !word || typeof word !== 'object') continue;
        correct += word.correct || 0;
        total += (word.correct || 0) + (word.incorrect || 0);
      }
    }
    return { total, accuracy: total ? Math.round(correct / total * 100) : null };
  }, [progress]);
  const accuracy = answerStats.accuracy;

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
  const earnedBadges = badges.filter(b => b.earned);
  const earnedCount = earnedBadges.length;
  const [showAllBadges, setShowAllBadges] = useState(false);
  const nextBadge = badges.filter(b => !b.earned).sort((a, b) => b.progressPct - a.progressPct)[0];
  const visibleBadges = showAllBadges ? badges : earnedBadges.slice(-3);
  const studiedDays = weeklyXp.filter(d => d.xp > 0 || (streak.activityDates || []).includes(d.key)).length;
  const goalDays = weeklyXp.filter(d => d.xp >= (streak.dailyGoal || 120)).length;
  const todayXP = weeklyXp[6]?.xp || 0;
  const dailyGoal = streak.dailyGoal || 120;
  const goalPct = Math.min(100, Math.round(todayXP / dailyGoal * 100));
  // Insignia abierta: su requisito se muestra bajo la rejilla (ver más abajo).
  const [openBadge, setOpenBadge] = useState(null);
  const openBadgeDef = badges.find(b => b.id === openBadge) || null;

  // Compartir: Web Share API si está disponible (móviles), si no copia al
  // portapapeles. Mensaje incluye nick, nivel, racha y URL de la app.
  const handleShare = async () => {
    const lines = [
      t('profile_share_learning', { name: userName || t('settings_default_user') }),
      t('profile_share_level', { level: levelInfo.level, xp: (streak.totalXP || 0).toLocaleString() }),
    ];
    if (streak.currentStreak > 0) {
      lines.push(t('profile_share_streak', { count: streak.currentStreak }));
    }
    // La URL va SOLO en el campo `url` de navigator.share (si también fuera en
    // `text`, WhatsApp/Telegram la muestran dos veces). El fallback de
    // portapapeles no tiene campo url aparte → ahí sí va en el texto.
    const message = lines.join('\n');
    try {
      if (navigator.share) {
        await navigator.share({ title: APP_NAME, text: message, url: APP_URL });
      } else {
        await navigator.clipboard.writeText(`${message}\n\n${APP_URL}`);
        setShareNote('copied');
        setTimeout(() => setShareNote(null), 2000);
      }
    } catch (e) {
      // El usuario canceló el diálogo de share o el clipboard falló — ignorar.
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: J.paper, paddingBottom: 90 }}>
      <div className="profile-shell">
        <JTopBar left={<JMark />} right={<button onClick={onOpenSettings} aria-label={t('nav_settings')} className="profile-settings-button"><GearIcon /></button>} />
        <div className="j-rise profile-content">
        {/* ─── Cabecera con avatar + nombre ──────────────────────────────── */}
        <div style={{ marginTop: 8, marginBottom: 18, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
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
              alt={t('avatar_' + currentAvatar.id, currentAvatar.label)}
              draggable={false}
              referrerPolicy="no-referrer"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: '1.625rem', lineHeight: 1.1, letterSpacing: '-0.025em', color: J.ink }}>
              {userName || t('settings_default_user')}<span style={{ color: J.red }}>.</span>
            </h1>
            <div style={{ marginTop: 6, fontSize: '0.84375rem', color: J.inkSoft, fontWeight: 500 }}>
              <span style={{ marginRight: 6 }}>{equipped.icon}</span>
              {loc(equipped.title, baseLang(i18n.language))} · <span className="font-cn">{equipped.zh}</span>
            </div>
            {mode === 'google' && user?.email && (
              <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: J.mute, fontWeight: 500, wordBreak: 'break-all' }}>
                {user.email}
              </p>
            )}
          </div>
          <button onClick={onOpenSettings} className="profile-edit-button">{t('profile_edit')}</button>
        </div>


          <div className="grid grid-cols-3 gap-3 mb-6" aria-label={t('profile_summary')}>
            {[
              { label: t('settings_level_current'), value: levelInfo.level },
              { label: t('settings_progress_chars_mastered'), value: totalMastered },
              { label: t('settings_streak_current'), value: streak.currentStreak },
            ].map(item => <div key={item.label} className="profile-summary-card"><span className="block text-xs" style={{ color: J.inkSoft }}>{item.label}</span><strong className="block text-2xl mt-2" style={{ color: J.ink }}>{item.value}</strong></div>)}
          </div>
          <div className="profile-columns">
            <div className="min-w-0">
              <SkillProgress progress={progress} onPractice={onPractice} />
              <details className="mt-5 profile-details"><summary className="font-semibold cursor-pointer">{t('profile_detailed_stats')}</summary>
        {/* ─── Progreso general ─────────────────────────────────────────── */}
        <JSection label={t('settings_progress')} cn="进步" />
        <JCard padding="0">
          <ProfileRow l={t('settings_progress_chars_learned')} v={srsStats.learned} tag={t('settings_progress_hsk_tag')} first />
          <ProfileRow l={t('settings_progress_study_time')} v={totalStudyMin > 0 ? `${Math.floor(totalStudyMin / 60)}h ${totalStudyMin % 60}m` : '0m'} tag={t('settings_progress_pace_tag')} />
          <ProfileRow l={t('settings_progress_accuracy')} v={accuracy === null ? '—' : `${accuracy}%`} tag={accuracy === null ? t('profile_no_answers') : accuracy >= 80 ? t('settings_progress_accuracy_good') : t('settings_progress_accuracy_meh')} accent="jade" />
          <ProfileRow l={t('settings_progress_chars_mastered')} v={totalMastered} tag={t('settings_progress_record_tag')} accent="red" />
        </JCard>


                <JSection label={t('settings_section_level')} cn="等级" />
                <JCard padding="18px"><p className="font-bold" style={{ color: J.ink }}>{t('settings_xp_total')}: {(streak.totalXP || 0).toLocaleString()}</p>
                  {levelInfo.isMaxLevel ? <p className="text-sm mt-2">{t('settings_max_level')}</p> : <>
                    <div role="progressbar" aria-label={t('settings_section_level')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={levelInfo.progress} className="h-2 rounded-full mt-3 overflow-hidden" style={{ background: J.hair }}><div style={{ width: levelInfo.progress + '%', height: '100%', background: J.jade }} /></div>
                    <p className="text-xs mt-2">{t('settings_xp_to_next', { xp: levelInfo.xpForNext - levelInfo.xpInLevel })}</p>
                  </>}
                </JCard>
              </details>
            </div>
            <div className="min-w-0">
              <JSection label={t('profile_today_goal')} cn="今日" />
              <JCard padding="18px"><p className="font-bold" style={{ color: J.ink }}>{todayXP} / {dailyGoal} XP</p>
                <div role="progressbar" aria-label={t('profile_today_goal')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={goalPct} className="h-2 rounded-full mt-3 overflow-hidden" style={{ background: J.hair }}><div style={{ width: goalPct + '%', height: '100%', background: J.jade }} /></div>
                <p className="text-xs mt-2" style={{ color: J.inkSoft }}>{t(goalPct === 100 ? 'profile_goal_done' : 'profile_goal_remaining', { xp: Math.max(0, dailyGoal - todayXP) })}</p>
              </JCard>
        {/* ─── XP semanal ──────────────────────────────────────────────── */}
        <JSection label={t('profile_weekly_activity')} cn="周XP" />
        <JCard padding="16px 18px 12px">
          <p className="font-bold mb-1" style={{ color: J.ink }}>{t('profile_studied_days', { count: studiedDays })}</p>
          <p className="text-xs mb-5" style={{ color: J.inkSoft }}>{t('profile_goal_days', { count: goalDays })}</p>
          <div className="flex items-end justify-between" style={{ height: 100, gap: 6 }}>
            {weeklyXp.map((d) => {
              const barH = Math.max(4, Math.round((d.xp / weeklyXpMax) * 76));
              const hitGoal = d.xp >= (streak.dailyGoal || 120);
              return (
                <div key={d.key} aria-label={`${new Date(d.key + 'T12:00:00').toLocaleDateString(lang, { weekday: 'long' })}: ${d.xp} XP`} className="flex flex-col items-center" style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '0.625rem', fontWeight: 700, color: hitGoal ? J.jadeDeep : J.mute, marginBottom: 4, height: 14 }}>
                    {d.xp > 0 ? d.xp : ''}
                  </span>
                  <div style={{
                    width: '100%', maxWidth: 26, height: barH, borderRadius: 6,
                    background: hitGoal ? J.jade : (d.xp > 0 ? J.jadeMid : J.hairS),
                    outline: d.isToday ? `2px solid ${J.jadeDeep}` : 'none',
                    outlineOffset: 1,
                    transition: 'height 400ms ease',
                  }} />
                  <span style={{ marginTop: 6, fontSize: '0.6875rem', fontWeight: d.isToday ? 800 : 600, color: d.isToday ? J.ink : J.mute }}>
                    {d.label}
                  </span>
                </div>
              );
            })}
          </div>
          <p style={{ margin: '10px 0 0', fontSize: '0.6875rem', color: J.mute, textAlign: 'center' }}>
            {t('profile_weekly_xp_hint', 'XP ganado cada día — en verde, los días que llegaste a tu meta.')}
          </p>
        </JCard>


              <details className="profile-details mt-4"><summary className="text-sm font-semibold cursor-pointer">{t('settings_streak_last_30')}</summary>
                <div className="grid grid-cols-10 gap-1 mt-3" aria-label={t('settings_streak_last_30')}>
                  {days.map((d, i) => <span key={i} className="aspect-square rounded" aria-label={t(d === 'on' ? 'profile_day_active' : 'profile_day_rest')} style={{ background: d === 'on' ? J.jade : J.hair }} />)}
                </div>
                <p className="text-xs mt-3">{t('settings_streak_record')}: {streak.longestStreak || 0}</p>
              </details>
        {/* ─── Insignias ──────────────────────────────────────────────── */}
        <div className="flex items-baseline justify-between" style={{ marginTop: 20, marginBottom: 6 }}>
          <JSection label={t('profile_badges', 'Insignias')} cn="徽章" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: J.mute }}>
            {earnedCount} / {badges.length}
          </span>
        </div>
        <JCard padding="14px 14px 16px">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold" style={{ color: J.inkSoft }}>{t('profile_featured_badges')}</span>
            <button className="text-xs font-bold underline underline-offset-4" style={{ color: J.jade }} onClick={() => { setShowAllBadges(!showAllBadges); setOpenBadge(null); }}>{t(showAllBadges ? 'profile_show_less' : 'profile_show_all')}</button>
          </div>
          {!visibleBadges.length && <p className="text-sm mb-3" style={{ color: J.inkSoft }}>{t('profile_badges_empty')}</p>}
          {nextBadge && !showAllBadges && <div className="rounded-xl p-4 mb-4" style={{ background: J.paper, border: `1px solid ${J.hair}` }}>
            <p className="text-xs font-semibold" style={{ color: J.mute }}>{t('profile_next_badge')}</p>
            <p className="font-bold mt-1" style={{ color: J.ink }}>{nextBadge.icon} {loc(nextBadge.title, lang)}</p>
            <p className="text-xs mt-1" style={{ color: J.inkSoft }}>{loc(nextBadge.desc, lang)}</p>
            <div role="progressbar" aria-label={loc(nextBadge.title, lang)} aria-valuemin={0} aria-valuemax={100} aria-valuenow={nextBadge.progressPct} className="h-1.5 rounded-full mt-3 overflow-hidden" style={{ background: J.hair }}><div style={{ width: nextBadge.progressPct + '%', height: '100%', background: J.jade }} /></div>
            <p className="text-xs mt-1" style={{ color: J.mute }}>{nextBadge.progressPct}%</p>
          </div>}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(74px, 1fr))',
            gap: 10,
          }}>
            {visibleBadges.map(b => {
              const bTitle = loc(b.title, lang);
              const open = openBadge === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setOpenBadge(open ? null : b.id)}
                  aria-expanded={open}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '10px 6px', borderRadius: 12,
                    background: b.earned ? J.jadeBg : J.paper,
                    border: `1px solid ${open ? J.sand : (b.earned ? J.jadeMid : J.hair)}`,
                    opacity: b.earned ? 1 : 0.55,
                    transition: 'all 200ms ease',
                    textAlign: 'center', cursor: 'pointer',
                  }}
                >
                  <span style={{ fontSize: '1.625rem', filter: b.earned ? 'none' : 'grayscale(1)' }}>
                    {b.icon}
                  </span>
                  <span style={{
                    fontSize: '0.65625rem', fontWeight: 700, lineHeight: 1.2,
                    color: b.earned ? J.jadeDeep : J.muteStrong,
                  }}>
                    {bTitle}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Qué hay que hacer para ganarla. Antes solo estaba en un title=,
              invisible con el dedo: en móvil no había forma de saberlo. */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${J.hair}` }}>
            {openBadgeDef ? (
              <p style={{ fontSize: '0.8125rem', color: J.inkSoft, lineHeight: 1.5 }}>
                <strong style={{ color: J.ink }}>{loc(openBadgeDef.title, lang)}</strong>
                {' — '}{loc(openBadgeDef.desc, lang)}
                {openBadgeDef.earned && <span style={{ color: J.jade, fontWeight: 700 }}> ✓</span>}
              </p>
            ) : (
              <p style={{ fontSize: '0.75rem', color: J.mute }}>
                {t('profile_badges_hint', 'Toca una insignia para ver cómo se consigue')}
              </p>
            )}
          </div>
        </JCard>


        {/* ─── Amigos ────────────────────────────────────────────────────
            Amigos dejó de tener pestaña propia al pasar la barra de 7 a 5;
            se entra desde aquí, que es donde vive el resto de lo social. */}
        <button
          onClick={onOpenFriends}
          style={{
            width: '100%', marginBottom: 18,
            padding: '14px 16px', borderRadius: 14,
            border: `1px solid ${incomingCount > 0 ? J.red : J.hair}`,
            background: incomingCount > 0 ? J.redBg : J.paperHi,
            cursor: 'pointer', textAlign: 'left',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <span className="font-cn" style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: J.jadeBg, color: J.jadeDeep, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
          }}>友</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontWeight: 700, fontSize: '0.875rem', color: J.ink }}>
              {t('nav_friends', 'Amigos')}
            </span>
            <span style={{ display: 'block', fontSize: '0.75rem', color: J.mute, marginTop: 2 }}>
              {incomingCount > 0
                ? t('profile_friends_pending', '{{count}} invitaciones te esperan', { count: incomingCount })
                : t('profile_friends_hint', 'Compara tu progreso y compite en el ranking')}
            </span>
          </span>
          {incomingCount > 0 && (
            <span style={{
              minWidth: 20, height: 20, padding: '0 6px', borderRadius: 99,
              background: J.red, color: '#fff', fontSize: '0.6875rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>{incomingCount > 9 ? '9+' : incomingCount}</span>
          )}
          <span style={{ color: J.mute, fontWeight: 700, flexShrink: 0 }}>→</span>
        </button>


        {/* ─── Compartir perfil ───────────────────────────────────────── */}
        <button
          onClick={handleShare}
          style={{
            width: '100%', marginTop: 18,
            padding: '14px 18px', borderRadius: 14, border: `1px solid ${J.hair}`,
            background: J.paperHi, color: J.inkSoft,
            fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',

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
        </div>
      </div>
    </div>
  );
}
