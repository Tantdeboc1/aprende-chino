// src/components/Dictionary.jsx
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Volume2, Star } from "lucide-react";
import Card from "@/components/ui/Card.jsx";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from 'react-i18next';
import CharacterSheet from "@/components/ui/CharacterSheet.jsx";

const LESSON_COLORS = {
  1: { active: 'bg-red-600 text-white border-red-600',    inactive: 'bg-gray-800 text-red-400 border-red-800 hover:border-red-600' },
  2: { active: 'bg-orange-600 text-white border-orange-600', inactive: 'bg-gray-800 text-orange-400 border-orange-800 hover:border-orange-600' },
  3: { active: 'bg-yellow-600 text-white border-yellow-600', inactive: 'bg-gray-800 text-yellow-400 border-yellow-800 hover:border-yellow-600' },
  4: { active: 'bg-green-700 text-white border-green-700',  inactive: 'bg-gray-800 text-green-400 border-green-800 hover:border-green-700' },
};

const LESSON_BADGE = {
  1: 'bg-red-900 text-red-300 border border-red-700',
  2: 'bg-orange-900 text-orange-300 border border-orange-700',
  3: 'bg-yellow-900 text-yellow-300 border border-yellow-700',
  4: 'bg-green-900 text-green-300 border border-green-700',
};

const FAV_KEY = 'aprende-chino-favorites';

function loadFavorites() {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]')); }
  catch { return new Set(); }
}

// ─── Dot de estado SRS ───────────────────────────────────────────────────────
function SRSDot({ srsData, t }) {
  if (!srsData || srsData.nextReview === null) {
    return <span title={t('dictionary_uninitiated_label')} className="w-2 h-2 rounded-full bg-gray-600 inline-block" />;
  }
  const now = Date.now();
  if (srsData.nextReview <= now) {
    return <span title={t('dictionary_pending_label')} className="w-2 h-2 rounded-full bg-yellow-400 inline-block animate-pulse" />;
  }
  if (srsData.interval >= 21) {
    return <span title={t('dictionary_mastered_tooltip')} className="w-2 h-2 rounded-full bg-green-400 inline-block" />;
  }
  return <span title={t('dictionary_learning_label')} className="w-2 h-2 rounded-full bg-blue-400 inline-block" />;
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
  const { t, i18n } = useTranslation();

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
  const mapUmlautToV   = (s) => (s || "").replace(/ü|ü/gi, "v");
  const normalizeBase  = (s) => mapUmlautToV(String(s || "")).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").trim();
  const normToneAgnost = (s) => normalizeBase(s).replace(/[\s_\-]/g, "").replace(/[1-4]/g, "");

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
      const displayMeaning = c.meanings?.[i18n.language] || c.meaning;
      return String(c.char || "").includes(qRaw)
        || normalizeBase(displayMeaning).includes(qNorm)
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
    <div className="min-h-screen p-4">
      <Container size="lg">
        <div className="mb-6">
          <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white mb-4">
            <ArrowLeft className="mr-2" />
            {t('dictionary_back_to_menu')}
          </button>

          <h2 className="text-3xl font-bold text-white mb-1">{t('dictionary_title')}</h2>
          <p className="text-gray-400 mb-4 text-sm">
            {filteredChars.length === 1 ? t('dictionary_word_count', { count: filteredChars.length }) : t('dictionary_word_count_plural', { count: filteredChars.length })}
            {selectedLesson ? ` · ${t('dictionary_filter_lesson', { num: selectedLesson })}` : ` · ${t('dictionary_filter_all_lessons')}`}
            {showFavorites && ` · ⭐ ${t('dictionary_filter_favorites_label')}`}
          </p>

          {/* Filtros por lección */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => { typeof setSelectedLesson === 'function' && setSelectedLesson(null); setShowFavorites(false); }}
              className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
                selectedLesson === null && !showFavorites
                  ? 'bg-gray-100 text-gray-900 border-gray-100'
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:border-gray-400'
              }`}
            >
              {t('dictionary_filter_all')}
            </button>
            {lessonsData.map(l => {
              const colors  = LESSON_COLORS[l.lesson] || LESSON_COLORS[1];
              const isActive = selectedLesson === l.lesson && !showFavorites;
              return (
                <button
                  key={l.lesson}
                  onClick={() => { typeof setSelectedLesson === 'function' && setSelectedLesson(isActive ? null : l.lesson); setShowFavorites(false); }}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${isActive ? colors.active : colors.inactive}`}
                  title={l.titleZh || l.titleEs}
                >
                  {t('dictionary_filter_lesson', { num: l.lesson })}
                </button>
              );
            })}
            {/* Botón Favoritos */}
            <button
              onClick={() => { setShowFavorites(f => !f); typeof setSelectedLesson === 'function' && setSelectedLesson(null); }}
              className={`px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                showFavorites
                  ? 'bg-yellow-600 text-white border-yellow-500'
                  : 'bg-gray-800 text-yellow-400 border-yellow-800 hover:border-yellow-500'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              {t('dictionary_favorites_button')} ({favorites.size})
            </button>
          </div>

          {/* Toggle suplementarias */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => typeof setShowSupplementary === 'function' && setShowSupplementary(!showSupplementary)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                showSupplementary
                  ? 'bg-purple-800 text-purple-200 border-purple-600'
                  : 'bg-gray-800 text-gray-400 border-gray-600 hover:border-gray-500'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              {t('dictionary_extra_vocab')} ({totalSupp})
            </button>
            <span className="text-gray-500 text-xs">{totalMain} {t('dictionary_main_words')}</span>
          </div>

          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder={t('dictionary_search_placeholder')}
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-lg bg-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Leyenda SRS */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> {t('dictionary_mastered_label')}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" /> {t('dictionary_pending_label')}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" /> {t('dictionary_learning_label')}</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gray-600 inline-block" /> {t('dictionary_uninitiated_label')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChars.map((char, idx) => {
            const srsData = progress?.__srs?.[char.char] || null;
            const isFav   = favorites.has(char.char);

            return (
              <Card
                key={idx}
                onClick={() => setSelectedChar(char)}
                className="hover:shadow-xl hover:border-gray-500 transition cursor-pointer bg-gray-800 border border-gray-700 relative active:scale-[0.98]"
              >
                {/* Cabecera: lección + tipo + SRS dot + favorito */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {char.lesson && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${LESSON_BADGE[char.lesson] || ''}`}>
                        L{char.lesson}
                      </span>
                    )}
                    {char.isSupplementary && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900 text-purple-300 border border-purple-700 font-semibold">extra</span>
                    )}
                    <SRSDot t={t} srsData={srsData} />
                  </div>
                  <div className="flex items-center gap-2">
                    {char.type && <span className="text-xs text-gray-500 italic">{char.type}</span>}
                    {/* Botón favorito */}
                    <button
                      onClick={() => toggleFavorite(char.char)}
                      className={`transition-colors ${isFav ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-400'}`}
                      title={isFav ? t('dictionary_remove_favorite') : t('dictionary_add_favorite')}
                    >
                      <Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Carácter principal */}
                <div className="text-6xl text-center mb-3 text-white">{char.char}</div>

                <div className="space-y-2.5">
                  {/* Pinyin + audio */}
                  <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                    <span className="text-sm text-gray-400 font-semibold">{t('dictionary_pinyin')}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg text-gray-200">{char.pinyin}</span>
                      <button
                        onClick={() => handleSpeak(char)}
                        aria-label={t('dictionary_listen_char', { char: char.char })}
                        className="p-1 rounded-full bg-green-800 hover:bg-green-700 text-green-300 transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Significado */}
                  <div className="pb-2 border-b border-gray-700">
                    <p className="text-white font-semibold text-center text-base leading-snug">{char.meanings?.[i18n.language] || char.meaning}</p>
                  </div>

                  {/* Radical */}
                  {char.radical && char.radical !== '—' && (
                    <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                      <span className="text-xs text-gray-500">{t('dictionary_radical')}</span>
                      <span className="text-2xl text-gray-300">{char.radical}</span>
                    </div>
                  )}

                  {/* Ejemplos */}
                  {char.examples?.length > 0 && (
                    <div className="pt-1">
                      <p className="text-xs text-gray-500 mb-1">{t('dictionary_examples')}:</p>
                      <div className="flex flex-wrap gap-1">
                        {char.examples.map((ex, i) => (
                          <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-md">{ex}</span>
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
          <div className="text-center text-gray-400 mt-8">
            {showFavorites && favorites.size === 0
              ? <p className="text-xl">{t('dictionary_no_favorites')}</p>
              : <p className="text-xl">{t('dictionary_no_results')}</p>
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
