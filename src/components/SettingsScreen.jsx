// src/components/SettingsScreen.jsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getLessonStats } from '@/utils/progress.js';
import { getSRSStats } from '@/utils/srs.js';
import { getStreak } from '@/utils/streak.js';
import { getLevelInfo, getEquippedTitle, getAvailableTitles, setEquippedTitle, getAllAchievements } from '@/utils/leveling.js';
import { useMusic } from '@/context/MusicContext.jsx';

const LESSONS_META = [
  { num: 1, titleKey: 'lesson_1_title', titleZh: '你最近怎么样', color: 'text-red-400',    bar: 'bg-red-500'    },
  { num: 2, titleKey: 'lesson_2_title', titleZh: '你是哪国人？',  color: 'text-orange-400', bar: 'bg-orange-500' },
  { num: 3, titleKey: 'lesson_3_title', titleZh: '你家有几口人？',color: 'text-yellow-400', bar: 'bg-yellow-400' },
  { num: 4, titleKey: 'lesson_4_title', titleZh: '你明天几点有课？',color:'text-green-400',  bar: 'bg-green-500'  },
];

const LANGUAGES = [
  { code: 'es', name: 'Español',   flag: '🇪🇸' },
  { code: 'en', name: 'English',   flag: '🇬🇧' },
  { code: 'fr', name: 'Français',  flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch',   flag: '🇩🇪' },
  { code: 'it', name: 'Italiano',  flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">{title}</p>
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

function Row({ label, children, border = true }) {
  return (
    <div className={`px-4 py-3 flex items-center justify-between gap-3 ${border ? 'border-b border-gray-700/60 last:border-0' : ''}`}>
      <span className="text-sm text-gray-300">{label}</span>
      {children}
    </div>
  );
}

// ── Heatmap de actividad (últimas 15 semanas) ────────────────────────────────
function ActivityHeatmap({ activityDates, t }) {
  const dateSet = useMemo(() => new Set(activityDates), [activityDates]);

  // Generar las últimas 15 semanas (columnas) × 7 días (filas)
  const weeks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // Retroceder al domingo más reciente
    const endSunday = new Date(today);
    endSunday.setDate(today.getDate() + (6 - today.getDay())); // próximo sábado
    const cells = [];
    for (let w = 14; w >= 0; w--) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(endSunday);
        date.setDate(endSunday.getDate() - w * 7 - (6 - d));
        const str = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        week.push({ str, future: date > today });
      }
      cells.push(week);
    }
    return cells;
  }, []);

  return (
    <div className="px-4 py-3">
      <p className="text-xs text-gray-400 mb-2">{t('settings_heatmap_title')}</p>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                title={day.str}
                className={`w-3.5 h-3.5 rounded-sm ${
                  day.future
                    ? 'bg-transparent'
                    : dateSet.has(day.str)
                    ? 'bg-purple-500'
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <div className="w-3 h-3 rounded-sm bg-gray-700" />
        <span className="text-xs text-gray-600 mr-2">{t('settings_heatmap_inactive')}</span>
        <div className="w-3 h-3 rounded-sm bg-purple-500" />
        <span className="text-xs text-gray-600">{t('settings_heatmap_active')}</span>
      </div>
    </div>
  );
}

// ── Gráfico de distribución de intervalos ────────────────────────────────────
function IntervalChart({ progress, allCharacters }) {
  const { t } = useTranslation();
  const buckets = useMemo(() => {
    const srs = progress?.__srs || {};
    const counts = { '1d': 0, '6d': 0, '15d': 0, '30d+': 0 };
    for (const c of allCharacters) {
      if (c.isSupplementary) continue;
      const d = srs[c.char];
      if (!d || d.nextReview === null) continue;
      if (d.interval <= 1)       counts['1d']++;
      else if (d.interval <= 6)  counts['6d']++;
      else if (d.interval <= 14) counts['15d']++;
      else                       counts['30d+']++;
    }
    return [
      { label: t('settings_interval_1d'),  key: '1d',   count: counts['1d'],   color: 'bg-blue-500'   },
      { label: t('settings_interval_6d'),  key: '6d',   count: counts['6d'],   color: 'bg-teal-500'   },
      { label: t('settings_interval_15d'), key: '15d',  count: counts['15d'],  color: 'bg-green-500'  },
      { label: t('settings_interval_30d'), key: '30d+', count: counts['30d+'], color: 'bg-purple-500' },
    ];
  }, [progress, allCharacters, t]);

  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div className="px-4 py-3 border-t border-gray-700/60">
      <p className="text-xs text-gray-400 mb-3">{t('settings_interval_chart_title')}</p>
      <div className="space-y-2">
        {buckets.map(b => (
          <div key={b.key} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-12 text-right flex-shrink-0">{b.label}</span>
            <div className="flex-1 h-5 bg-gray-700 rounded overflow-hidden">
              <div
                className={`h-full ${b.color} rounded transition-all duration-500`}
                style={{ width: `${(b.count / maxCount) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-300 w-6 text-right flex-shrink-0">{b.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Previsión de repasos 7 días ──────────────────────────────────────────────
function ReviewForecast({ progress, allCharacters, t }) {
  const forecast = useMemo(() => {
    const srs = progress?.__srs || {};
    const now = Date.now();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const dayStart = now + i * 86400000;
      const dayEnd   = dayStart + 86400000;
      let count = 0;
      for (const c of allCharacters) {
        if (c.isSupplementary) continue;
        const d = srs[c.char];
        if (!d || d.nextReview === null) continue;
        if (d.nextReview >= dayStart && d.nextReview < dayEnd) count++;
        // Día 0: incluir también atrasados
        if (i === 0 && d.nextReview < now) count++;
      }
      const date = new Date(dayStart);
      const dayNames = [t('settings_day_sun'),t('settings_day_mon'),t('settings_day_tue'),t('settings_day_wed'),t('settings_day_thu'),t('settings_day_fri'),t('settings_day_sat')];
      const label = i === 0 ? t('settings_day_today') : i === 1 ? t('settings_day_tomorrow') : dayNames[date.getDay()];
      days.push({ label, count });
    }
    return days;
  }, [progress, allCharacters]);

  const maxCount = Math.max(...forecast.map(d => d.count), 1);

  return (
    <div className="px-4 py-3 border-t border-gray-700/60">
      <p className="text-xs text-gray-400 mb-3">{t('settings_forecast_title')}</p>
      <div className="flex items-end gap-1.5 h-20">
        {forecast.map((day, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-gray-400">{day.count > 0 ? day.count : ''}</span>
            <div className="w-full bg-gray-700 rounded-t overflow-hidden flex flex-col justify-end" style={{ height: '48px' }}>
              <div
                className={`w-full rounded-t transition-all duration-500 ${i === 0 ? 'bg-yellow-500' : 'bg-purple-500'}`}
                style={{ height: `${(day.count / maxCount) * 100}%`, minHeight: day.count > 0 ? '4px' : '0' }}
              />
            </div>
            <span className="text-xs text-gray-500">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsScreen({ userName, onUserNameChange, progress, onProgressChange, allCharacters }) {
  const { t, i18n } = useTranslation();
  const [nameInput, setNameInput] = useState(userName || '');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { enabled: musicEnabled, volume: musicVolume, toggle: toggleMusic, setVolume: setMusicVolume } = useMusic();

  const handleNameBlur = () => {
    const trimmed = nameInput.trim();
    if (trimmed && trimmed !== userName) onUserNameChange(trimmed);
  };

  const handleReset = () => {
    onProgressChange({});
    setShowResetConfirm(false);
  };

  const totalWords    = allCharacters.filter(c => !c.isSupplementary).length;
  const totalMastered = LESSONS_META.reduce((acc, l) => acc + getLessonStats(progress, l.num, allCharacters).mastered, 0);
  const totalSeen     = LESSONS_META.reduce((acc, l) => acc + getLessonStats(progress, l.num, allCharacters).seen,     0);
  const globalPct     = totalWords > 0 ? Math.round((totalMastered / totalWords) * 100) : 0;
  const srsStats      = getSRSStats(progress, allCharacters);
  const streak        = getStreak();
  const levelInfo     = getLevelInfo(streak.totalXP || 0);
  const equipped      = getEquippedTitle(streak.totalXP || 0);
  const availableTitles = getAvailableTitles(streak.totalXP || 0);
  const achievements  = getAllAchievements();
  const [titleRefresh, setTitleRefresh] = useState(0);

  const handleSelectTitle = (titleId) => {
    setEquippedTitle(titleId);
    setTitleRefresh(r => r + 1); // force re-read
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-24">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 pt-10 pb-5">
        <h1 className="text-xl font-bold text-white">{t('settings_title')}</h1>
        <p className="text-gray-400 text-sm mt-0.5">{t('settings_subtitle')}</p>
      </div>

      <div className="px-4 pt-5">

        {/* Perfil */}
        <Section title={t('settings_profile')}>
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500 mb-1.5">{t('settings_name_label')}</p>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={e => { if (e.key === 'Enter') { e.target.blur(); } }}
              placeholder={t('settings_name_label')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm focus:border-red-500 focus:outline-none placeholder-gray-500"
            />
          </div>
        </Section>

        {/* Nivel y Títulos */}
        <Section title={t('settings_level_title')}>
          {/* Info de nivel actual */}
          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-purple-900/40 flex items-center justify-center text-2xl">
                {equipped.icon}
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">
                  {t('settings_level_current', { level: levelInfo.level })} — {equipped.title?.[i18n.language] || equipped.title?.es} {equipped.zh}
                </p>
                <p className="text-gray-400 text-xs">
                  {streak.totalXP || 0} XP {t('settings_level_total')}
                </p>
              </div>
            </div>
            {!levelInfo.isMaxLevel && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Lv.{levelInfo.level}</span>
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${levelInfo.progress}%` }} />
                </div>
                <span className="text-xs text-gray-500">Lv.{levelInfo.level + 1}</span>
                <span className="text-xs text-gray-400 ml-1">{levelInfo.xpInLevel}/{levelInfo.xpForNext}</span>
              </div>
            )}
            {levelInfo.isMaxLevel && (
              <p className="text-xs text-purple-400 font-bold">👑 {t('level_max_reached')}</p>
            )}
          </div>

          {/* Selector de título */}
          <div className="px-4 py-3 border-t border-gray-700/60">
            <p className="text-xs text-gray-500 mb-2">{t('settings_title_selector')}</p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {availableTitles.map(ti => {
                const isEquipped = (equipped.icon === ti.icon && equipped.zh === ti.zh);
                return (
                  <button
                    key={ti.id}
                    onClick={() => handleSelectTitle(ti.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                      isEquipped
                        ? 'bg-purple-900/40 border border-purple-600/50'
                        : 'bg-gray-700/50 border border-gray-700 hover:border-gray-500'
                    }`}
                  >
                    <span className="text-lg">{ti.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-white font-medium">
                        {ti.title?.[i18n.language] || ti.title?.es}
                      </span>
                      <span className="text-xs text-gray-400 ml-1">{ti.zh}</span>
                    </div>
                    {isEquipped && <span className="text-xs text-purple-400 font-bold">{t('settings_title_equipped')}</span>}
                    {ti.source === 'achievement' && <span className="text-xs text-yellow-500">★</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logros */}
          <div className="px-4 py-3 border-t border-gray-700/60">
            <p className="text-xs text-gray-500 mb-2">{t('settings_achievements_title')}</p>
            <div className="space-y-1.5">
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                    ach.unlocked ? 'bg-gray-700/50' : 'bg-gray-800/50 opacity-40'
                  }`}
                >
                  <span className="text-lg">{ach.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">
                      {ach.title?.[i18n.language] || ach.title?.es} <span className="text-gray-500 text-xs">{ach.zh}</span>
                    </p>
                    <p className="text-xs text-gray-400">{ach.desc?.[i18n.language] || ach.desc?.es}</p>
                  </div>
                  {ach.unlocked ? (
                    <span className="text-xs text-green-400 font-bold">✓</span>
                  ) : (
                    <span className="text-xs text-gray-600">🔒</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Música */}
        <Section title={t('settings_music_title')}>
          <Row label={t('settings_music_label')}>
            <button
              onClick={() => toggleMusic()}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                musicEnabled ? 'bg-red-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  musicEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </Row>
          <div className="px-4 py-3 border-t border-gray-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">{t('settings_volume')}</span>
              <span className="text-sm font-bold text-white">{Math.round(musicVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={musicVolume}
              onChange={e => setMusicVolume(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none bg-gray-700 accent-red-500 cursor-pointer"
            />
            <p className="text-xs text-gray-600 mt-2">{t('settings_music_credit')}</p>
          </div>
        </Section>

        {/* Idioma */}
        <Section title={t('settings_language')}>
          <div className="p-3 grid grid-cols-3 gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  i18n.language === lang.code
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Progreso */}
        <Section title={t('settings_progress')}>
          {/* Resumen global */}
          <div className="px-4 py-3 border-b border-gray-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">{t('settings_global_progress')}</span>
              <span className="text-sm font-bold text-white">{globalPct}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-1">
              <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${globalPct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{totalMastered} {t('settings_mastered')} · {totalSeen - totalMastered} {t('settings_seen')}</span>
              <span>{totalWords} {t('settings_words_hsk1')}</span>
            </div>
          </div>

          {/* Por lección */}
          {LESSONS_META.map(l => {
            const stats = getLessonStats(progress, l.num, allCharacters);
            const pct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;
            return (
              <div key={l.num} className="px-4 py-2.5 border-b border-gray-700/60 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <span className="text-sm text-white font-medium">{t(l.titleKey)}</span>
                    <span className={`text-xs ml-2 ${l.color}`}>{l.titleZh}</span>
                  </div>
                  <span className={`text-xs font-bold ${l.color}`}>{pct}%</span>
                </div>
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full ${l.bar} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{stats.mastered}/{stats.total} {t('settings_mastered')}</p>
              </div>
            );
          })}
        </Section>

        {/* Estadísticas SRS */}
        <Section title={t('settings_srs_title')}>
          {/* Barra de progreso SRS */}
          <div className="px-4 py-3 border-b border-gray-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">{t('settings_srs_learned')}</span>
              <span className="text-sm font-bold text-white">{srsStats.learned} / {srsStats.total}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: srsStats.total > 0 ? `${Math.round((srsStats.learned / srsStats.total) * 100)}%` : '0%' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {srsStats.total > 0 ? Math.round((srsStats.learned / srsStats.total) * 100) : 0}% {t('settings_srs_of_total')}
            </p>
          </div>

          {/* Tres estadísticas */}
          <div className="grid grid-cols-3 divide-x divide-gray-700/60">
            <div className="px-3 py-3 text-center">
              <p className="text-2xl font-bold text-purple-400">{srsStats.learned}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t('settings_srs_in_srs')}</p>
            </div>
            <div className="px-3 py-3 text-center">
              <p className="text-2xl font-bold text-green-400">{srsStats.mature}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t('settings_srs_mature')}</p>
            </div>
            <div className="px-3 py-3 text-center">
              <p className={`text-2xl font-bold ${srsStats.due > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                {srsStats.due}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t('settings_srs_due')}</p>
            </div>
          </div>

          {/* Racha */}
          {(streak.currentStreak > 0 || streak.longestStreak > 0) && (
            <div className="flex divide-x divide-gray-700/60 border-t border-gray-700/60">
              <div className="flex-1 px-3 py-2.5 text-center">
                <p className="text-xl font-bold text-orange-400">🔥 {streak.currentStreak}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t('settings_streak_current')}</p>
              </div>
              <div className="flex-1 px-3 py-2.5 text-center">
                <p className="text-xl font-bold text-yellow-400">⭐ {streak.longestStreak}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t('settings_streak_best')}</p>
              </div>
            </div>
          )}

          {/* Distribución de intervalos */}
          <IntervalChart progress={progress} allCharacters={allCharacters} />

          {/* Previsión 7 días */}
          <ReviewForecast t={t} progress={progress} allCharacters={allCharacters} />

          {/* Heatmap de actividad */}
          <div className="border-t border-gray-700/60">
            <ActivityHeatmap t={t} activityDates={streak.activityDates} />
          </div>

          {/* Nota explicativa */}
          <div className="px-4 pb-3 pt-1 border-t border-gray-700/60">
            <p className="text-xs text-gray-600 leading-relaxed">{t('settings_srs_mature_note')}</p>
          </div>
        </Section>

        {/* Danger zone */}
        <Section title={t('settings_data')}>
          <div className="px-4 py-3">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 px-4 rounded-lg border border-red-800 text-red-400 text-sm font-medium hover:bg-red-900/30 transition-colors"
              >
                {t('settings_reset')}
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-300 text-center">{t('settings_reset_confirm')}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-600 transition-colors"
                  >
                    {t('settings_cancel')}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-colors"
                  >
                    {t('settings_confirm_reset')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Acerca de */}
        <Section title={t('settings_about')}>
          <Row label="App">
            <span className="text-sm text-gray-400">{t('settings_app_name')}</span>
          </Row>
          <Row label={t('settings_based_on')}>
            <span className="text-xs text-gray-400 text-right leading-tight max-w-[180px]">{t('settings_book_name')}</span>
          </Row>
          <Row label={t('settings_version')}>
            <span className="text-sm text-gray-400">v0.6</span>
          </Row>
          <Row label={t('settings_words_included')} border={false}>
            <span className="text-sm text-gray-400">{totalWords}</span>
          </Row>
        </Section>

      </div>
    </div>
  );
}
