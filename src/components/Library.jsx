import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { libraryBooks } from '@/data/libraryBooks.js';
import { baseLang, loc } from '@/utils/loc.js';

export default function Library() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage || i18n.language;
  const [selectedEdition, setSelectedEdition] = useState(null);
  const edition = selectedEdition ?? (baseLang(language) === 'es' ? 'es' : 'en');
  const market = edition === 'es' ? 'Amazon.es' : 'Amazon.com';

  return (
    <div className="mx-auto max-w-[1080px] px-5 pt-8 pb-16 text-[var(--ink)]">
      <h1 className="text-3xl font-extrabold sm:text-5xl">{t('nav_library')}</h1>
      <p className="mt-3 text-[var(--ink-soft)]">{t('library_intro')}</p>
      <label className="mt-6 block text-sm font-semibold">
        {t('library_language')}
        <select
          value={edition}
          onChange={(event) => setSelectedEdition(event.target.value)}
          className="ml-3 min-h-11 rounded-xl border border-[var(--hair)] bg-[var(--paper-hi)] px-3 text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-[var(--jade)]"
        >
          <option value="es" lang="es">Español</option>
          <option value="en" lang="en">English</option>
        </select>
      </label>
      <div className="library-grid mt-7">
        {libraryBooks[edition].map((book) => (
          <article className="library-card border border-[var(--hair)] bg-[var(--paper-hi)]" key={book.links.paperback}>
            <div className="library-cover-wrap">
              <img className="library-cover" src={book.cover} alt="" loading="lazy" />
            </div>
            <div className="library-card-content">
              <p className="text-xs font-bold tracking-wider text-[var(--jade-deep)]">{book.level}</p>
              <h2 lang={edition} className="mt-2 text-xl leading-tight font-extrabold">{book.title}</h2>
              <p className="mt-3 mb-4 text-sm leading-relaxed text-[var(--ink-soft)]">{loc(book.description, language)}</p>
              <div className="mt-auto">
                <p className="mb-2 text-xs text-[var(--ink-soft)]">{market}</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(book.links).map(([format, url]) => (
                    <a
                      key={format}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t(`library_${format}`)} · ${book.title} · ${market}`}
                      className={`inline-flex min-h-11 items-center gap-1 rounded-xl border border-[var(--jade)] px-3 py-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--jade)] ${format === 'paperback' ? 'bg-[var(--jade)] text-[var(--on-accent)]' : 'text-[var(--jade-deep)]'}`}
                    >
                      {t(`library_${format}`)} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
