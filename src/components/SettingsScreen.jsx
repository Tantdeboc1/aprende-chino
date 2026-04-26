// src/components/SettingsScreen.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLessonStats } from '@/utils/progress.js';
import { getSRSStats } from '@/utils/srs.js';

const LESSONS_META = [
  { num: 1, titleEs: 'Lección 1', titleZh: '你最近怎么样', color: 'text-red-400',    bar: 'bg-red-500'    },
  { num: 2, titleEs: 'Lección 2', titleZh: '你是哪国人？',  color: 'text-orange-400', bar: 'bg-orange-500' },
  { num: 3, titleEs: 'Lección 3', titleZh: '你家有几口人？',color: 'text-yellow-400', bar: 'bg-yellow-400' },
  { num: 4, titleEs: 'Lección 4', titleZh: '你明天几点有课？',color:'text-green-400',  bar: 'bg-green-500'  },
];

const LANGUAGES = [
  { code: 'es', name: 'Español',  flag: '🇪🇸' },
  { code: 'en', name: 'English',  flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch',  flag: '🇩🇪' },
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
          <div className="p-3 grid grid-cols-2 gap-2">
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
            {/* En repaso */}
            <div className="px-3 py-3 text-center">
              <p className="text-2xl font-bold text-purple-400">{srsStats.learned}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t('settings_srs_in_srs')}</p>
            </div>
            {/* Maduras */}
            <div className="px-3 py-3 text-center">
              <p className="text-2xl font-bold text-green-400">{srsStats.mature}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t('settings_srs_mature')}</p>
            </div>
            {/* Pendientes hoy */}
            <div className="px-3 py-3 text-center">
              <p className={`text-2xl font-bold ${srsStats.due > 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                {srsStats.due}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">{t('settings_srs_due')}</p>
            </div>
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
            <span className="text-sm text-gray-400">v0.5</span>
          </Row>
          <Row label={t('settings_words_included')} border={false}>
            <span className="text-sm text-gray-400">{totalWords}</span>
          </Row>
        </Section>

      </div>
    </div>
  );
}
