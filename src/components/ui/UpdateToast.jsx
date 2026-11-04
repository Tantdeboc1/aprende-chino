// src/components/ui/UpdateToast.jsx
// Toast discreto "Nueva versión disponible → Actualizar". Aparece cuando el
// SW nuevo queda en espera (modo 'prompt'); si el usuario lo ignora, la
// versión nueva entra igualmente en el próximo arranque (comportamiento previo).
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { onNeedRefresh } from '@/utils/pwaUpdate.js';
import { loadReleaseNotes } from '@/utils/releaseNotes.js';

export default function UpdateToast() {
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [notes, setNotes] = useState(null);
  const [notesStatus, setNotesStatus] = useState('idle');
  const updateRef = useRef(null);

  useEffect(() => onNeedRefresh((updateFn) => {
    updateRef.current = updateFn;
    setVisible(true);
  }), []);

  useEffect(() => {
    if (!detailsOpen) return undefined;
    let active = true;
    setNotesStatus('loading');
    loadReleaseNotes(i18n.resolvedLanguage || i18n.language)
      .then(result => { if (active) { setNotes(result); setNotesStatus('ready'); } })
      .catch(() => { if (active) { setNotes(null); setNotesStatus('error'); } });
    return () => { active = false; };
  }, [detailsOpen, i18n.resolvedLanguage, i18n.language]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 rounded-2xl px-4 py-4 animate-slide-up"
      style={{
        // Encima de la bottom nav (que ocupa ~70px) y por debajo de modales (z-60).
        bottom: 84, zIndex: 55, width: 'min(440px, calc(100vw - 32px))', maxHeight: 'min(70vh, 540px)', overflowY: 'auto',
        background: J.ink, color: J.paperHi, boxShadow: J.shadowLg,
        border: `1px solid ${J.jade}`,
      }}
    >
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="flex-shrink-0 rounded-full" style={{ width: 10, height: 10, background: J.jade }} />
        <span className="flex-1 text-base font-medium">{t('update_available', 'Hay una versión nueva')}</span>
        <button
        onClick={() => updateRef.current?.()}
        className="text-base font-bold px-4 py-2 rounded-xl flex-shrink-0"
        style={{ background: J.jade, color: J.onAccent, border: 0, cursor: 'pointer' }}
      >
        {t('update_reload', 'Actualizar')}
        </button>
        <button
        onClick={() => setVisible(false)}
        aria-label={t('common_close', 'Cerrar')}
        className="text-base font-bold flex-shrink-0"
        style={{ background: 'none', color: J.mute2, border: 0, cursor: 'pointer', padding: 2 }}
      >
        ✕
        </button>
      </div>
      <button type="button" aria-expanded={detailsOpen} aria-controls="update-release-notes" onClick={() => setDetailsOpen(open => !open)}
        className="mt-3 text-sm font-semibold underline underline-offset-4" style={{ color: J.paperHi }}>
        {t(detailsOpen ? 'update_hide_notes' : 'update_view_notes')}
      </button>
      {detailsOpen && <div id="update-release-notes" className="mt-3 text-sm leading-relaxed">
        {notesStatus === 'loading' && <p>{t('update_notes_loading')}</p>}
        {notesStatus === 'error' && <p>{t('update_notes_unavailable')}</p>}
        {notesStatus === 'ready' && notes && <>
          <p className="font-bold">{t('update_notes_published', { version: notes.version })}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">{notes.notes.map((note, index) => <li key={`${index}-${note}`}>{note}</li>)}</ul>
        </>}
      </div>}
    </div>
  );
}
