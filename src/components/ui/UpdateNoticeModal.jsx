import { useCallback, useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { STORAGE_KEYS } from '@/utils/storageKeys.js';
import { loadReleaseNotes } from '@/utils/releaseNotes.js';
import { APP_VERSION } from '@/utils/version.js';

const LAST_VERSION_KEY = 'hanyupath:last-seen-app-version';
const LAST_NOTES_KEY = 'hanyupath:last-seen-release-notes';
const RETURNING_USER_KEYS = [
  STORAGE_KEYS.USERNAME,
  STORAGE_KEYS.PROFILE,
  STORAGE_KEYS.PROGRESS,
  STORAGE_KEYS.STREAK,
  STORAGE_KEYS.LEVELING,
  STORAGE_KEYS.SKILL_PROGRESS,
  STORAGE_KEYS.TOUR,
];

function hasPreviousInstallation() {
  try {
    return Boolean(navigator.serviceWorker?.controller) ||
      RETURNING_USER_KEYS.some(key => localStorage.getItem(key) !== null);
  } catch {
    return false;
  }
}

export default function UpdateNoticeModal() {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [notes, setNotes] = useState(null);
  const [notesStatus, setNotesStatus] = useState('idle');
  const [notesChanged, setNotesChanged] = useState(true);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(LAST_VERSION_KEY, APP_VERSION);
      if (notes) localStorage.setItem(LAST_NOTES_KEY, JSON.stringify(notes.notes));
    } catch { /* notice state is best-effort when storage is unavailable */ }
    setVisible(false);
  }, [notes]);

  useEffect(() => {
    let previousVersion = null;
    try {
      previousVersion = localStorage.getItem(LAST_VERSION_KEY);
    } catch {
      return;
    }

    if (previousVersion === APP_VERSION) return;

    const isReturningUser = previousVersion !== null || hasPreviousInstallation();
    if (isReturningUser) {
      setVisible(true);
    } else {
      try { localStorage.setItem(LAST_VERSION_KEY, APP_VERSION); } catch { /* notice is optional */ }
    }
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    let active = true;
    setNotesStatus('loading');
    loadReleaseNotes(i18n.resolvedLanguage || i18n.language)
      .then(result => {
        if (!active) return;
        const fingerprint = JSON.stringify(result.notes);
        let previousFingerprint = null;
        try { previousFingerprint = localStorage.getItem(LAST_NOTES_KEY); } catch { /* optional */ }
        setNotesChanged(previousFingerprint !== fingerprint);
        setNotes(result);
        setNotesStatus('ready');
      })
      .catch(() => {
        if (active) {
          setNotes(null);
          setNotesStatus('error');
        }
      });
    return () => { active = false; };
  }, [visible, i18n.resolvedLanguage, i18n.language]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKeyDown = event => {
      if (event.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 100, background: 'rgba(18, 30, 22, 0.62)' }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-notice-title"
        className="w-full max-w-lg rounded-3xl p-6 sm:p-7"
        style={{ background: J.paperHi, color: J.ink, border: `1px solid ${J.hair}`, boxShadow: J.shadowLg, maxHeight: 'min(82vh, 680px)', overflowY: 'auto' }}
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: J.jadeBg, color: J.jadeDeep }}>
            <CheckCircle2 size={25} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id="update-notice-title" className="text-xl font-bold" style={{ color: J.ink }}>
              {t('update_installed_title')}
            </h2>
            <p className="mt-1 text-sm" style={{ color: J.inkSoft }}>
              {t('update_installed_body', { version: APP_VERSION })}
            </p>
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t('common_close', 'Cerrar')}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
            style={{ background: J.paper, color: J.inkSoft, border: `1px solid ${J.hair}`, cursor: 'pointer' }}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 border-t pt-5" style={{ borderColor: J.hair }}>
          {notesStatus === 'loading' && <p className="text-sm" style={{ color: J.inkSoft }}>{t('update_notes_loading')}</p>}
          {notesStatus === 'error' && <p className="text-sm" style={{ color: J.inkSoft }}>{t('update_notes_unavailable')}</p>}
          {notesStatus === 'ready' && notesChanged && notes && <>
            <h3 className="mb-3 text-base font-bold" style={{ color: J.jadeDeep }}>{t('update_notes_heading')}</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed" style={{ color: J.inkSoft }}>
              {notes.notes.map((note, index) => <li key={`${index}-${note}`}>{note}</li>)}
            </ul>
          </>}
          {notesStatus === 'ready' && !notesChanged && <p className="text-sm" style={{ color: J.inkSoft }}>
            {t('update_maintenance_summary')}
          </p>}
        </div>

        <button
          type="button"
          onClick={dismiss}
          autoFocus
          className="mt-6 w-full rounded-xl px-4 py-3 font-bold"
          style={{ background: J.jade, color: J.onAccent, border: 0, cursor: 'pointer' }}
        >
          {t('common_close', 'Cerrar')}
        </button>
      </section>
    </div>
  );
}
