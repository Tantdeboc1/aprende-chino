// src/components/Dictionary.jsx
import { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card.jsx";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import CharacterSheet from "@/components/ui/CharacterSheet.jsx";
import ProfileBadge from "@/components/ui/ProfileBadge.jsx";

const LESSON_COLORS = {
  1: { bg: J.redBg, fg: J.redDeep, border: J.red },
  2: { bg: J.sandBg, fg: J.sandDeep, border: J.sand },
  3: { bg: J.sandBg2, fg: J.sandDeep, border: J.sand },
  4: { bg: J.jadeBg, fg: J.jadeDeep, border: J.jade },
};

const FAV_KEY = 'aprende-chino-favorites';

function loadFavorites() {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); }
  catch { return new Set(); }
}

// ─── Dot de estado SRS ───────────────────────────────────────────────────────
function SRSDot({ srsData, t }) {
  const base = "w-2 h-2 rounded-full inline-block";
  if (!srsData || srsData.nextReview === null) {
    return <span title={t('dictionary_uninitiated_label')} className={base} style={{ background: J.mute2 }} />;
  }
  const now = Date.now();
  if (srsData.nextReview <= now) {
    return <span title={t('dictionary_pending_label')} className={`${base} animate-pulse`} style={{ background: J.sand }} />;
  }
  if (srsData.interval >= 21) {
    return <span title={t('dictionary_mastered_tooltip')} className={base} style={{ background: J.jade }} />;
  }
  return <span title={t('dictionary_learning_label')} className={base} style={{ background: J.jadeMid }} />;
}

export default function Dictionary({
  goBack,
  characters = [],
  speakChinese,
  searchTerm,
  setSearchTerm,
  selectedLesson,
  setSelectedLesson,
  showSupplementary,
  setShowSupplementary,
  lessonsData = [],
  progress,
}) {
  const { t } = useTranslation();

  // ── Favoritos ────────────────────────────────────────────────────────────
  const [favorites, setFavorites] = useState(loadFavorites);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedChar, setSelectedChar] = useState(null);

  const toggleFavorite = (char) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(char)) next.delete(char); else next.add(char);
      localStorage.setItem(FAV_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  // ── Normalización ─────────────────────────────────────────────────────────
  const mapUmlautToV   = (s) => (s || "").replace(/ü|ü/gi, "v");
  const normalizeBase  = (s) => mapUmlautToV(String(s || "")).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
  const normToneAgnost = (s) => normalizeBase(s).replace(/[\s_-]/g, "").replace(/[1-4]/g, "");

  // ── Búsqueda con debounce ─────────────────────────────────────────────────
  const [rawQuery, setRawQuery]         = useState(searchTerm || "");
  const [debouncedQuery, setDebounced]  = useState(rawQuery);

  useEffect(() => { setRawQuery(searchTerm || ""); }, [searchTerm]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(rawQuery);
      if (typeof setSearchTerm === 'function') setSearchTerm(rawQuery);
    }, 300);
    return () => clearTimeout(t);
  }, [rawQuery, setSearchTerm]);

  // ── Filtrado ──────────────────────────────────────────────────────────────
  const filteredChars = useMemo(() => {
    let list = characters;

    if (selectedLesson !== null && selectedLesson !== undefined) {
      list = list.filter(c => c.lesson === selectedLesson);
    }
    if (!showSupplementary) list = list.filter(c => !c.isSupplementary);
    if (showFavorites)      list = list.filter(c => favorites.has(c.char));

    const qRaw  = (debouncedQuery || '').trim();
    const qNorm = normToneAgnost(qRaw);
    if (!qNorm) return list;

    const pinyinLike = /^[a-zA-Züǖǘǚǜv\s_\-0-9]+$/.test(qRaw);
    return list.filter(c => {
      if (pinyinLike && normToneAgnost(c.pinyin).startsWith(qNorm)) return true;
      return String(c.char || "").includes(qRaw)
        || normalizeBase(c.meaning).includes(qNorm)
        || normalizeBase(c.radical).includes(qNorm);
    });
  }, [characters, debouncedQuery, selectedLesson, showSupplementary, showFavorites, favorites]);

  const totalMain = characters.filter(c =>
    (selectedLesson === null || c.lesson === selectedLesson) && !c.isSupplementary
  ).length;
  const totalSupp = characters.filter(c =>
    (selectedLesson === null || c.lesson === selectedLesson) && c.isSupplementary
  ).length;

  const handleSpeak = (char) => {
    if (typeof speakChinese === 'function') speakChinese({ hanzi: char.char, pinyin: char.pinyin });
  };

  return (
    <div className="min-h-screen p-4" style={{ background: J.paper }}>
      <Container size="lg">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <button onClick={goBack} className="flex items-center" style={{ color: J.inkSoft, fontWeight: 600, fontSize: 14, background: 'none', border: 0, cursor: 'pointer' }}>
              <span style={{ marginRight: 8, fontSize: 16 }}>←</span>
              {t('dictionary_back_to_menu')}
            </button>
            <ProfileBadge variant="light" />
          </div>

          <h2 className="text-3xl font-bold mb-1" style={{ color: J.ink }}>
            {t('dictionary_title')}<span style={{ color: J.red }}>.</span>
          </h2>
          <p className="mb-4 text-sm" style={{ color: J.inkSoft }}>
            {filteredChars.length} palabra{filteredChars.length !== 1 ? 's' : ''}
            {selectedLesson ? ` · ${t('dictionary_filter_lesson', { num: selectedLesson })}` : ` · ${t('dictionary_filter_all_lessons')}`}
            {showFavorites && ` · ${t('dictionary_filter_favorites_label')}`}
          </p>

          {/* Filtros por lección */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => { typeof setSelectedLesson === 'function' && setSelectedLesson(null); setShowFavorites(false); }}
              style={{
                padding: '6px 12px', borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${selectedLesson === null && !showFavorites ? J.ink : J.hair}`,
                background: selectedLesson === null && !showFavorites ? J.ink : J.paperHi,
                color: selectedLesson === null && !showFavorites ? J.paperHi : J.inkSoft,
              }}
            >
              {t('dictionary_filter_all')}
            </button>
            {lessonsData.map(l => {
              const colors = LESSON_COLORS[l.lesson] || LESSON_COLORS[1];
              const isActive = selectedLesson === l.lesson && !showFavorites;
              return (
                <button
                  key={l.lesson}
                  onClick={() => { typeof setSelectedLesson === 'function' && setSelectedLesson(isActive ? null : l.lesson); setShowFavorites(false); }}
                  style={{
                    padding: '6px 12px', borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    border: `1px solid ${isActive ? colors.border : J.hair}`,
                    background: isActive ? colors.bg : J.paperHi,
                    color: isActive ? colors.fg : J.inkSoft,
                  }}
                  title={l.titleEs}
                >
                  {t('dictionary_filter_lesson', { num: l.lesson })}
                </button>
              );
            })}
            {/* Botón Favoritos */}
            <button
              onClick={() => { setShowFavorites(f => !f); typeof setSelectedLesson === 'function' && setSelectedLesson(null); }}
              className="flex items-center gap-1.5"
              style={{
                padding: '6px 12px', borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${showFavorites ? J.sand : J.hair}`,
                background: showFavorites ? J.sandBg : J.paperHi,
                color: showFavorites ? J.sandDeep : J.inkSoft,
              }}
            >
              <span className="font-cn" style={{ fontSize: 14 }}>收</span>
              Favoritos ({favorites.size})
            </button>
          </div>

          {/* Toggle suplementarias */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => typeof setShowSupplementary === 'function' && setShowSupplementary(!showSupplementary)}
              className="flex items-center gap-2"
              style={{
                padding: '6px 12px', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                border: `1px solid ${showSupplementary ? J.jade : J.hair}`,
                background: showSupplementary ? J.jadeBg : J.paperHi,
                color: showSupplementary ? J.jadeDeep : J.inkSoft,
              }}
            >
              <span className="font-cn" style={{ fontSize: 14 }}>补</span>
              Vocabulario extra ({totalSupp})
            </button>
            <span style={{ color: J.mute, fontSize: 12 }}>{totalMain} palabras principales</span>
          </div>

          {/* Buscador */}
          <div className="relative">
            <span className="font-cn absolute left-3 top-1/2 -translate-y-1/2" style={{ color: J.jade, fontSize: 20, fontWeight: 700 }}>找</span>
            <input
              type="text"
              placeholder={t('dictionary_search_placeholder')}
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-lg placeholder-[#6e6757]"
              style={{
                border: `2px solid ${J.border}`, background: J.paperHi, color: J.ink,
                outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = J.jade}
              onBlur={e => e.target.style.borderColor = J.hair}
            />
          </div>
        </div>

        {/* Leyenda SRS */}
        <div className="flex items-center gap-4 mb-4 text-xs" style={{ color: J.mute }}>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: J.jade }} /> {t('dictionary_mastered_label')}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: J.sand }} /> {t('dictionary_pending_label')}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: J.jadeMid }} /> {t('dictionary_learning_label')}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ background: J.mute2 }} /> {t('dictionary_uninitiated_label')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChars.map((char, idx) => {
            const srsData = progress?.__srs?.[char.char] || null;
            const isFav   = favorites.has(char.char);

            return (
              <Card
                key={idx}
                onClick={() => setSelectedChar(char)}
                className="hover:shadow-sm transition cursor-pointer relative active:scale-[0.98]"
                style={{
                  background: J.paperHi, border: `1px solid ${J.hair}`,
                  borderRadius: 18, padding: '1.5rem',
                }}
              >
                {/* Cabecera: lección + tipo + SRS dot + favorito */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {char.lesson && (() => {
                      const c = LESSON_COLORS[char.lesson] || LESSON_COLORS[1];
                      return (
                        <span style={{
                          fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
                          background: c.bg, color: c.fg, border: `1px solid ${c.border}`,
                        }}>
                          L{char.lesson}
                        </span>
                      );
                    })()}
                    {char.isSupplementary && (
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
                        background: J.sandBg, color: J.sandDeep, border: `1px solid ${J.sand}`,
                      }}>extra</span>
                    )}
                    <SRSDot t={t} srsData={srsData} />
                  </div>
                  <div className="flex items-center gap-2">
                    {char.type && <span className="text-xs italic" style={{ color: J.mute }}>{char.type}</span>}
                    {/* Botón favorito — CJK 收 en vez de Star */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(char.char); }}
                      className="font-cn"
                      style={{
                        background: 'none', border: 0, cursor: 'pointer', fontSize: 16, fontWeight: 700,
                        color: isFav ? J.red : J.mute2,
                      }}
                      title={isFav ? t('dictionary_remove_favorite') : t('dictionary_add_favorite')}
                    >
                      收
                    </button>
                  </div>
                </div>

                {/* Carácter principal */}
                <div className="text-6xl text-center mb-3 font-cn" style={{ color: J.ink }}>{char.char}</div>

                <div className="space-y-2.5">
                  {/* Pinyin + audio */}
                  <div className="flex justify-between items-center pb-2" style={{ borderBottom: `1px solid ${J.hair}` }}>
                    <span className="text-sm font-semibold" style={{ color: J.mute }}>{t('dictionary_pinyin')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg" style={{ color: J.ink }}>{char.pinyin}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSpeak(char); }}
                        aria-label={`Escuchar ${char.char}`}
                        className="font-cn rounded-full"
                        style={{
                          padding: '4px 8px', background: J.jadeBg, color: J.jadeDeep,
                          border: 0, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                        }}
                      >
                        声
                      </button>
                    </div>
                  </div>

                  {/* Significado */}
                  <div className="pb-2" style={{ borderBottom: `1px solid ${J.hair}` }}>
                    <p className="font-semibold text-center text-base leading-snug" style={{ color: J.ink }}>{char.meaning}</p>
                  </div>

                  {/* Radical */}
                  {char.radical && char.radical !== '—' && (
                    <div className="flex justify-between items-center pb-2" style={{ borderBottom: `1px solid ${J.hair}` }}>
                      <span className="text-xs" style={{ color: J.mute }}>{t('dictionary_radical')}</span>
                      <span className="text-2xl font-cn" style={{ color: J.ink }}>{char.radical}</span>
                    </div>
                  )}

                  {/* Ejemplos */}
                  {char.examples?.length > 0 && (
                    <div className="pt-1">
                      <p className="text-xs mb-1" style={{ color: J.mute }}>Ejemplos:</p>
                      <div className="flex flex-wrap gap-1">
                        {char.examples.map((ex, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-md" style={{ background: J.paper, color: J.ink }}>{ex}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {filteredChars.length === 0 && (
          <div className="text-center mt-8">
            {showFavorites && favorites.size === 0
              ? <p className="text-xl" style={{ color: J.mute }}>{t('dictionary_no_favorites')}</p>
              : <p className="text-xl" style={{ color: J.mute }}>{t('dictionary_no_results')}</p>
            }
          </div>
        )}
      </Container>

      {/* Bottom-sheet con trazos animados */}
      {selectedChar && (
        <CharacterSheet
          char={selectedChar}
          onClose={() => setSelectedChar(null)}
          onSpeak={handleSpeak}
          onToggleFavorite={toggleFavorite}
          isFav={favorites.has(selectedChar.char)}
          progress={progress}
        />
      )}
    </div>
  );
}
