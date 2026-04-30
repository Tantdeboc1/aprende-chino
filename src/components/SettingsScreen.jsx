// src/components/SettingsScreen.jsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getLessonStats } from '@/utils/progress.js';
import { getSRSStats } from '@/utils/srs.js';
import { getStreak } from '@/utils/streak.js';

const LESSONS_META = [
  { num: 1, titleEs: 'Lección 1', titleZh: '你最近怎么样', color: 'text-red-400',    bar: 'bg-red-500'    },
  { num: 2, titleEs: 'Lección 2', titleZh: '你是哪国人？',  color: 'text-orange-400', bar: 'bg-orange-500' },
  { num: 3, titleEs: 'Lección 3', titleZh: '你家有几口人？',color: 'text-yellow-400', bar: 'bg-yellow-400' },
  { num: 4, titleEs: 'Lección 4', titleZh: '你明天几点有课？',color:'text-green-400',  bar: 'bg-green-500'  },
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
        <span className="text-xs text-gray-600 mr-2">Sin actividad</span>
        <div className="w-3 h-3 rounded-sm bg-purple-500" />
        <span className="text-xs text-gray-600">Con actividad</span>
      </div>
    </div>
  );
}

// ── Gráfico de distribución de intervalos ────────────────────────────────────
function IntervalChart({ progress, allCharacters }) {
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
      { label: '1 día',  key: '1d',   count: counts['1d'],   color: 'bg-blue-500'   },
      { label: '6 días', key: '6d',   count: counts['6d'],   color: 'bg-teal-500'   },
      { label: '15 días',key: '15d',  count: counts['15d'],  color: 'bg-green-500'  },
      { label: '30d+',   key: '30d+', count: counts['30d+'], color: 'bg-purple-500' },
    ];
  }, [progress, allCharacters]);

  const maxCount = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div className="px-4 py-3 border-t border-gray-700/60">
      <p className="text-xs text-gray-400 mb-3">Palabras por intervalo</p>
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
                    <span className="text-sm text-white font-medium">{l.titleEs}</span>
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
                <p className="text-xs text-gray-500 mt-0.5">Racha actual</p>
              </div>
              <div className="flex-1 px-3 py-2.5 text-center">
                <p className="text-xl font-bold text-yellow-400">⭐ {streak.longestStreak}</p>
                <p className="text-xs text-gray-500 mt-0.5">Mejor racha</p>
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
