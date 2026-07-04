// src/components/HomeScreen.jsx
import { useEffect, useRef, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { J, resolveColor } from '@/styles/tokens';
import { hanziCharDataLoader } from '@/utils/hanziCharData.js';
import { getLessonStats } from '@/utils/progress.js';
import { getDueCount, getSRSStats, getLeechCards } from '@/utils/srs.js';
import { getStreak } from '@/utils/streak.js';
import { getLevelInfo, getEquippedTitle } from '@/utils/leveling.js';
import { getLevelMastery, isLevelExamUnlocked, loadLevelExamResult, UNLOCK_MASTERY_PCT } from '@/utils/levelExam.js';
import StreakPanel from '@/components/ui/StreakPanel.jsx';
import DailyChallenges from '@/components/ui/DailyChallenges.jsx';
import { loadUserProfile, resolveAvatarSrc } from '@/utils/userProfile.js';
import { getAvatarById, DEFAULT_AVATAR_ID } from '@/data/avatars.js';
import { useAuth } from '@/context/AuthContext.jsx';
import { useLocalSnapshot } from '@/hooks/useLocalSnapshot.js';
import { loc, baseLang } from '@/utils/loc.js';


// ── Carácter del día con HanziWriter ──────────────────────────────────────────
function DailyCharacter({ allCharacters }) {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading');

  const daily = useMemo(() => {
    const pool = allCharacters.filter(c => !c.isSupplementary && c.char);
    if (!pool.length) return null;
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return pool[dayOfYear % pool.length];
  }, [allCharacters]);

  useEffect(() => {
    if (!daily || !containerRef.current) return;
    setStatus('loading');
    let cancelled = false;

    // Host imperativo: HanziWriter inyecta su SVG en este div, que NO está
    // gestionado por React (lo creamos y lo quitamos nosotros). Así React solo
    // gestiona el contenedor externo y nunca intenta borrar el SVG de HanziWriter
    // al desmontar — eso provocaba el 'removeChild: node is not a child' de React 19.
    const host = document.createElement('div');
    containerRef.current.appendChild(host);
    let writer = null;

    // HanziWriter solo soporta 1 carácter — usar el primero si hay varios
    const singleChar = daily.char.length > 1 ? daily.char[0] : daily.char;

    import('hanzi-writer').then(({ default: HanziWriter }) => {
      if (cancelled) return;
      try {
        writer = HanziWriter.create(host, singleChar, {
          charDataLoader: hanziCharDataLoader,
          width: 100,
          height: 100,
          padding: 8,
          strokeColor: resolveColor(J.onAccent),
          radicalColor: resolveColor(J.butter),
          outlineColor: resolveColor(J.jadeDeep),
          drawingWidth: 5,
          strokeAnimationSpeed: 0.8,
          delayBetweenStrokes: 150,
          showCharacter: false,
          showOutline: true,
          onLoadCharDataSuccess: () => {
            if (!cancelled) { setStatus('ready'); writer.loopCharacterAnimation(); }
          },
          onLoadCharDataError: () => { if (!cancelled) setStatus('error'); },
        });
      } catch { if (!cancelled) setStatus('error'); }
    }).catch(() => { if (!cancelled) setStatus('error'); });

    return () => {
      cancelled = true;
      try { writer?.pauseAnimation?.(); } catch { /* noop */ }
      try { host.remove(); } catch { /* noop */ }
    };
  }, [daily]);

  if (!daily) return null;

  return (
    <div className="rounded-2xl p-4 flex items-center gap-4"
      style={{ background: J.jade, border: `1px solid ${J.jadeDeep}` }}>
      <div className="relative flex-shrink-0">
        <div
          ref={containerRef}
          className="w-[100px] h-[100px] rounded-xl"
          style={{ background: `color-mix(in srgb, ${J.jadeDeep} 56%, transparent)`, border: `1px solid ${J.jadeDeep}` }}
        />
        {status === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl"
            style={{ background: `color-mix(in srgb, ${J.jadeDeep} 69%, transparent)` }}>
            <div className="w-5 h-5 rounded-full animate-spin"
              style={{ border: `2px solid ${J.butter}`, borderTopColor: 'transparent' }} />
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl">
            <span className="text-4xl font-bold font-cn" style={{ color: J.onAccent }}>{daily.char}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: J.butter }}>{t('daily_character_of_day')}</p>
        <p className="text-2xl font-bold font-cn leading-tight" style={{ color: J.onAccent }}>{daily.char}</p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{daily.pinyin}</p>
        <p className="text-xs mt-1 leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>{daily.meanings?.[baseLang(i18n.language)] || daily.meaning}</p>
        {daily.radical && daily.radical !== '—' && (
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {t('home_radical_label')} <span style={{ color: 'rgba(255,255,255,0.7)' }}>{daily.radical}</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ── Lección color mapping (Jade Pop cultural) ─────────────────────────────────
const LESSONS = [
  {
    key: 'intro',
    num: null,
    color: { border: J.sand, bar: J.sand, text: J.sandDeep, icon: J.sandBg },
    titleKey: 'lesson_intro_title',
    titleZh: '入门',
    subtitleKey: 'lesson_intro_subtitle',
  },
  {
    key: 'lesson-1',
    num: 1,
    color: { border: J.red, bar: J.red, text: J.redDeep, icon: J.redBg },
    titleKey: 'lesson_1_title',
    titleZh: '你最近怎么样',
    subtitleKey: 'lesson_1_subtitle',
  },
  {
    key: 'lesson-2',
    num: 2,
    color: { border: J.sand, bar: J.sand, text: J.sandDeep, icon: J.sandBg },
    titleKey: 'lesson_2_title',
    titleZh: '你是哪国人？',
    subtitleKey: 'lesson_2_subtitle',
  },
  {
    key: 'lesson-3',
    num: 3,
    color: { border: J.sand, bar: J.sand, text: J.sandDeep, icon: J.sandBg2 },
    titleKey: 'lesson_3_title',
    titleZh: '你家有几口人？',
    subtitleKey: 'lesson_3_subtitle',
  },
  {
    key: 'lesson-4',
    num: 4,
    color: { border: J.jade, bar: J.jade, text: J.jadeDeep, icon: J.jadeBg },
    titleKey: 'lesson_4_title',
    titleZh: '你明天几点有课？',
    subtitleKey: 'lesson_4_subtitle',
  },
  {
    key: 'lesson-5',
    num: 5,
    color: { border: J.red, bar: J.red, text: J.redDeep, icon: J.redBg },
    titleKey: 'lesson_5_title',
    titleZh: '祝你生日快乐',
    subtitleKey: 'lesson_5_subtitle',
  },
  {
    key: 'lesson-6',
    num: 6,
    color: { border: J.sand, bar: J.sand, text: J.sandDeep, icon: J.sandBg },
    titleKey: 'lesson_6_title',
    titleZh: '图书馆在食堂北边',
    subtitleKey: 'lesson_6_subtitle',
  },
  {
    key: 'lesson-7',
    num: 7,
    color: { border: J.sand, bar: J.sand, text: J.sandDeep, icon: J.sandBg2 || J.sandBg },
    titleKey: 'lesson_7_title',
    titleZh: '苹果多少钱一斤',
    subtitleKey: 'lesson_7_subtitle',
  },
  {
    key: 'lesson-8',
    num: 8,
    color: { border: J.jade, bar: J.jade, text: J.jadeDeep, icon: J.jadeBg },
    titleKey: 'lesson_8_title',
    titleZh: '我全身都不舒服',
    subtitleKey: 'lesson_8_subtitle',
  },
];

function LessonCard({ lesson, progress, allCharacters, onClick, t }) {
  const stats = useMemo(() => {
    if (lesson.num === null) return null;
    return getLessonStats(progress, lesson.num, allCharacters);
  }, [progress, lesson.num, allCharacters]);

  const pct = stats && stats.total > 0 ? Math.round((stats.seen / stats.total) * 100) : 0;
  const masteredPct = stats && stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl p-4 flex items-center gap-3 transition-all text-left active:scale-[0.99]"
      style={{
        background: J.paperHi, border: `1px solid ${J.hair}`,
        borderLeftWidth: 4, borderLeftColor: lesson.color.border,
        cursor: 'pointer',
      }}
    >
      {/* Icono */}
      <div className="font-cn w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
        style={{ background: lesson.color.icon, color: lesson.color.text, fontWeight: 700 }}>
        {lesson.num === null ? '入' : lesson.num}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="font-semibold text-sm truncate" style={{ color: J.ink }}>{t(lesson.titleKey)}</span>
          {stats && (
            <span className="text-xs font-bold flex-shrink-0"
              style={{ color: masteredPct === 100 ? J.jade : lesson.color.text }}>
              {masteredPct === 100 ? '★' : `${pct}%`}
            </span>
          )}
        </div>
        <p className="text-xs truncate" style={{ color: J.mute }}>{t(lesson.subtitleKey)}</p>
        {stats && stats.total > 0 && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="h-2 flex-1 rounded-full overflow-hidden" style={{ background: J.hair }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: lesson.color.bar }}
                />
              </div>
              <span className="ml-2 text-[11px] font-bold flex-shrink-0"
                style={{ color: masteredPct === 100 ? J.jade : lesson.color.text }}>
                {masteredPct === 100 ? '★' : `${pct}%`}
              </span>
            </div>
            {masteredPct > 0 && masteredPct < 100 && (
              <div className="h-1 rounded-full overflow-hidden" style={{ background: J.hair }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${masteredPct}%`, background: lesson.color.bar, opacity: 0.4 }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Flecha */}
      <span style={{ color: J.mute, fontWeight: 700 }}>→</span>
    </button>
  );
}

export default function HomeScreen({ userName, progress, allCharacters, onSelectLesson, onSelectIntro, onStartReview, onOpenProfile, onStartLevelExam, onOpenChinaMap }) {
  const { t, i18n } = useTranslation();
  const examMastery  = useMemo(() => getLevelMastery(progress, allCharacters), [progress, allCharacters]);
  const examUnlocked = useMemo(() => isLevelExamUnlocked(progress, allCharacters), [progress, allCharacters]);
  // Se relee cuando cambia progress (aprobar el examen actualiza ambos).
  const examResult   = useLocalSnapshot(loadLevelExamResult, [progress]);
  const totalMastered = useMemo(() => {
    let total = 0;
    for (let i = 1; i <= 4; i++) {
      const stats = getLessonStats(progress, i, allCharacters);
      total += stats.mastered;
    }
    return total;
  }, [progress, allCharacters]);

  const totalWords  = useMemo(() => allCharacters.filter(c => !c.isSupplementary).length, [allCharacters]);
  const dueCount    = useMemo(() => getDueCount(progress, allCharacters), [progress, allCharacters]);
  const srsStats    = useMemo(() => getSRSStats(progress, allCharacters),  [progress, allCharacters]);
  const leechCount  = useMemo(() => getLeechCards(progress, allCharacters).length, [progress, allCharacters]);
  const streak      = useLocalSnapshot(getStreak);
  const levelInfo   = useMemo(() => getLevelInfo(streak.totalXP || 0), [streak.totalXP]);
  const equipped    = useMemo(() => getEquippedTitle(streak.totalXP || 0), [streak.totalXP]);
  const { mode, user } = useAuth();
  // useLocalSnapshot: si llega un sync remoto, el perfil se relee.
  const profile     = useLocalSnapshot(loadUserProfile);
  const avatar      = useMemo(
    () => getAvatarById(profile.avatarId) || getAvatarById(DEFAULT_AVATAR_ID),
    [profile.avatarId]
  );
  // Prioriza la foto de Google (igual que ProfileBadge y Ajustes).
  const effectiveAvatar = resolveAvatarSrc(profile, mode, user?.photoURL, avatar.src);

  return (
    <div className="min-h-screen pb-24" style={{ background: J.paper }}>
      {/* Header */}
      <div style={{
        background: J.jade, color: J.onAccent,
        borderLeft: `4px solid ${J.jadeDeep}`,
        padding: '40px 16px 16px',
      }}>
        <div className="flex items-center gap-2">
          <div className="font-cn w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: J.red, color: J.onAccent, fontWeight: 700, fontSize: 14 }}>
            学
          </div>
          <span className="font-bold text-base" style={{ color: J.onAccent }}>{t('app_brand')}</span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          {/* Avatar circular del perfil — clickable para abrir Ajustes */}
          <button
            onClick={onOpenProfile}
            aria-label={t('profile_edit_aria')}
            disabled={!onOpenProfile}
            style={{
              background: J.paperHi,
              border: `2.5px solid ${J.butter}`,
              borderRadius: '50%',
              width: 60, height: 60,
              padding: 0,
              cursor: onOpenProfile ? 'pointer' : 'default',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 12px -3px rgba(0,0,0,0.30)',
            }}
          >
            <img
              src={effectiveAvatar.src}
              alt={avatar.label || 'Avatar'}
              referrerPolicy="no-referrer"
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold" style={{ color: J.onAccent }}>
              {t('home_greeting', { name: userName || t('home_default_username') })}
            </h1>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('home_subtitle')}</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.2)', color: J.butter }}>
                {equipped.icon} {loc(equipped.title, baseLang(i18n.language))} · {equipped.zh}
              </span>
            </div>
          </div>
        </div>
        {/* Barra XP al siguiente nivel */}
        {!levelInfo.isMaxLevel && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Lv.{levelInfo.level}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progress}%`, background: J.butter }}
              />
            </div>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Lv.{levelInfo.level + 1}</span>
          </div>
        )}
        {levelInfo.isMaxLevel && (
          <div className="mt-3">
            <span className="text-xs font-bold" style={{ color: J.butter }}>★ {t('level_max_reached')}</span>
          </div>
        )}

        {/* Stats rápidas */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1 rounded-lg px-2 py-2 text-center" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <p className="font-bold text-lg" style={{ color: J.onAccent }}>{totalMastered}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{t('home_mastered')}</p>
          </div>
          <div className="flex-1 rounded-lg px-2 py-2 text-center" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <p className="font-bold text-lg" style={{ color: J.onAccent }}>
              {totalWords > 0 ? Math.round((totalMastered / totalWords) * 100) : 0}%
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{t('home_completed')}</p>
          </div>
          <div className="flex-1 rounded-lg px-2 py-2 text-center"
            style={{ background: streak.currentStreak > 0 ? 'rgba(240,200,98,0.2)' : 'rgba(0,0,0,0.15)' }}>
            <p className="font-bold text-lg" style={{ color: streak.currentStreak > 0 ? J.butter : J.paperHi }}>
              {streak.currentStreak > 0 ? `★${streak.currentStreak}` : '—'}
            </p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{t('home_streak')}</p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="px-4 pt-5 space-y-6 j-rise">

        {/* Carácter del día */}
        <DailyCharacter allCharacters={allCharacters} />

        {/* Panel de racha + XP */}
        <StreakPanel streak={streak} />

        {/* Retos diarios */}
        <DailyChallenges />

        {/* Tarjeta SRS — solo si hay repasos pendientes o palabras aprendidas */}
        {srsStats.learned > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: J.mute }}>
              {t('home_section_review', 'Repaso')}
            </p>
            <button
              onClick={onStartReview}
              className="w-full rounded-xl p-4 flex items-center gap-3 transition-all text-left"
              style={{
                background: dueCount > 0 ? J.redBg : J.paperHi,
                border: `1px solid ${dueCount > 0 ? J.red : J.hair}`,
                cursor: 'pointer',
              }}
            >
              <div className="font-cn w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl"
                style={{
                  background: dueCount > 0 ? J.red : J.paperHi,
                  color: dueCount > 0 ? J.paperHi : J.mute,
                  fontWeight: 700, border: dueCount > 0 ? 'none' : `1px solid ${J.hair}`,
                }}>
                复
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm" style={{ color: J.ink }}>{t('home_srs_title', 'Repasar ahora')}</span>
                  {dueCount > 0 && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: J.red, color: J.onAccent }}>{dueCount}</span>
                  )}
                </div>
                <p className="text-xs" style={{ color: J.mute }}>
                  {dueCount > 0
                    ? t('home_srs_due', '{{count}} tarjetas pendientes de repaso', { count: dueCount })
                    : t('home_srs_ok', '¡Al día! {{learned}} palabras aprendidas', { learned: srsStats.learned })
                  }
                </p>
                {/* Leeches: palabras que has fallado varias veces seguidas.
                    Aparecen en el mismo repaso, no requieren acción aparte,
                    pero las mostramos para que el usuario sepa lo que tiene en danger zone. */}
                {leechCount > 0 && (
                  <p className="text-xs mt-1 font-medium" style={{ color: J.redDeep }}>
                    🐛 {t('home_srs_leeches', '{{count}} palabras rebeldes te esperan', { count: leechCount })}
                  </p>
                )}
              </div>
              <span style={{ color: J.mute, fontWeight: 700 }}>→</span>
            </button>
          </div>
        )}

        {/* Introducción */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: J.mute }}>
            {t('home_section_basics')}
          </p>
          <LessonCard
            lesson={LESSONS[0]}
            progress={progress}
            allCharacters={allCharacters}
            onClick={onSelectIntro}
            t={t}
          />
        </div>

        {/* Lecciones */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: J.mute }}>
            {t('home_section_lessons')}
          </p>
          <div className="space-y-3">
            {LESSONS.slice(1).map(lesson => (
              <LessonCard
                key={lesson.key}
                lesson={lesson}
                progress={progress}
                allCharacters={allCharacters}
                onClick={() => onSelectLesson(lesson.num)}
                t={t}
              />
            ))}
          </div>
        </div>

        {/* Examen Final del nivel (certificación) */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: J.mute }}>
            {t('home_section_certification', 'Certificación')}
          </p>
          <button
            onClick={onStartLevelExam}
            className="w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-transform active:scale-[0.99]"
            style={{
              background: J.paperHi,
              border: `1px solid ${examResult?.passed ? J.jade : examUnlocked ? J.red : J.hair}`,
              cursor: 'pointer',
            }}
          >
            <div className="font-cn flex items-center justify-center flex-shrink-0"
              style={{
                width: 48, height: 48, borderRadius: 14, fontSize: 26, fontWeight: 700,
                background: examResult?.passed ? J.jadeBg : examUnlocked ? J.redBg : J.sandBg,
                color: examResult?.passed ? J.jade : examUnlocked ? J.red : J.sand,
              }}>
              {examResult?.passed ? '证' : examUnlocked ? '试' : '关'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm" style={{ color: J.ink }}>
                {t('level_exam_title', 'Examen Final · HSK 1')}
              </p>
              <p className="text-xs mt-0.5" style={{ color: J.inkSoft }}>
                {examResult?.passed
                  ? `${t('level_exam_already_passed', 'Nivel superado')} · ${t('level_exam_best', 'mejor')} ${examResult.bestPct}%`
                  : examUnlocked
                    ? t('level_exam_ready_hint', '¡Desbloqueado! Certifícate ahora')
                    : `${t('level_exam_locked_hint', 'Domina el vocabulario para desbloquear')} · ${examMastery.pct}/${UNLOCK_MASTERY_PCT}%`}
              </p>
              {!examUnlocked && (
                <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background: J.hair }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.round((examMastery.pct / UNLOCK_MASTERY_PCT) * 100))}%`, background: J.sand }} />
                </div>
              )}
            </div>
            <span style={{ color: J.mute, fontSize: 18 }}>→</span>
          </button>
        </div>

        {/* Explora China (mapa de provincias) */}
        {onOpenChinaMap && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: J.mute }}>
              {t('home_section_explore', 'Cultura')}
            </p>
            <button
              onClick={onOpenChinaMap}
              className="w-full rounded-2xl p-4 flex items-center gap-4 text-left transition-transform active:scale-[0.99]"
              style={{ background: J.paperHi, border: `1px solid ${J.hair}`, cursor: 'pointer' }}
            >
              <div className="font-cn flex items-center justify-center flex-shrink-0"
                style={{ width: 48, height: 48, borderRadius: 14, fontSize: 26, fontWeight: 700, background: J.jadeBg, color: J.jade }}>
                图
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: J.ink }}>
                  {t('china_title', 'Explora China')} 🗺️
                </p>
                <p className="text-xs mt-0.5" style={{ color: J.inkSoft }}>
                  {t('china_home_hint', 'Gastronomía, dialectos y turismo por provincia')}
                </p>
              </div>
              <span style={{ color: J.mute, fontSize: 18 }}>→</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
