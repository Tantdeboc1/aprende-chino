import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { speakChineseEnhanced } from '@/utils/tts-enhanced.js';
import { loc } from '@/utils/loc.js';

// Práctica voluntaria: no graba, no reconoce voz y no otorga puntuación.
export default function ListenRepeat({ phrases, onBack }) {
  const { t, i18n } = useTranslation();
  const [index, setIndex] = useState(0);
  useEffect(() => { setIndex(0); }, [phrases]);
  const current = phrases?.[index];
  return <main className="min-h-screen bg-[var(--paper)] px-5 py-6 pb-24"><div className="mx-auto max-w-xl">
    <button onClick={onBack} className="text-sm font-semibold text-[var(--ink-soft)]">← {t('translation_back')}</button>
    <h1 className="mt-5 text-2xl font-bold text-[var(--ink)]">{t('voice_free_title')}</h1>
    <p className="mt-2 text-sm text-[var(--mute)]">{t('voice_free_description')}</p>
    {!current ? <p className="mt-5 text-[var(--mute)]">{phrases ? t('voice_free_empty') : t('common_loading')}</p> : <>
      <p className="mt-5 text-sm text-[var(--mute)]">{index + 1} / {phrases.length}</p>
      <section className="mt-3 rounded-2xl border border-[var(--hair)] bg-[var(--paper-hi)] p-6 text-center">
        <p lang="zh" className="font-cn text-3xl text-[var(--ink)]">{current.hanzi}</p>
        <p className="mt-3 text-[var(--mute)]">{current.pinyin}</p>
        <p className="mt-3 text-[var(--ink-soft)]">{loc(current.translations, i18n.language)}</p>
        <button onClick={() => speakChineseEnhanced(current.hanzi)} className="mt-5 rounded-xl bg-[var(--jade)] px-5 py-3 font-semibold text-[var(--on-accent)]">🔊 {t('voice_free_listen')}</button>
      </section>
      <div className="mt-4 flex gap-3"><button disabled={index === 0} onClick={() => setIndex(i => i - 1)} className="flex-1 rounded-xl border border-[var(--hair)] bg-[var(--paper-hi2)] p-3 text-[var(--ink)] disabled:opacity-40">{t('voice_free_previous')}</button><button disabled={index === phrases.length - 1} onClick={() => setIndex(i => i + 1)} className="flex-1 rounded-xl border border-[var(--hair)] bg-[var(--paper-hi2)] p-3 text-[var(--ink)] disabled:opacity-40">{t('voice_free_next')}</button></div>
    </>}
  </div></main>;
}
