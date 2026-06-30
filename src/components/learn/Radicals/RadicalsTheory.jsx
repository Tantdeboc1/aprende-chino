// src/components/learn/Radicals/RadicalsTheory.jsx
import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RadicalsTheory({ goBack, radicals }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRadical, setSelectedRadical] = useState(null);

  // Filtrar radicales basado en la búsqueda - COMPATIBLE CON TU JSON
  const filteredRadicals = radicals.filter(radical => {
    if (!radical) return false;

    const searchLower = searchTerm.toLowerCase();

    // Buscar en el radical mismo
    if (radical.radical?.toLowerCase().includes(searchLower)) return true;

    // Buscar en el significado
    if (radical.meaning?.toLowerCase().includes(searchLower)) return true;

    // Buscar en pinyin del radical
    if (radical.pinyin?.toLowerCase().includes(searchLower)) return true;

    // Buscar en ejemplos (caracteres)
    if (radical.examples?.some(example =>
      example.toLowerCase().includes(searchLower)
    )) return true;

    return false;
  });

  // Agrupar radicales por número de trazos
  const groupedRadicals = filteredRadicals.reduce((groups, radical) => {
    if (!radical) return groups;

    const groupKey = `Trazo ${radical.strokeCount}`;

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(radical);
    return groups;
  }, {});

  // Ordenar los grupos por número de trazos
  const sortedGroups = Object.entries(groupedRadicals).sort(([keyA], [keyB]) => {
    const numA = parseInt(keyA.replace('Trazo ', ''));
    const numB = parseInt(keyB.replace('Trazo ', ''));
    return numA - numB;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--paper-hi)] to-[var(--paper)] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={goBack}
            className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition"
          >
            <ArrowLeft className="mr-2" />
            {t('radicals_back_to_radicals')}
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-[var(--ink)]">{t('radicals_theory_title_long')}</h1>
            <p className="text-[var(--mute)]">{t('radicals_theory_subtitle')}</p>
          </div>

          <div className="w-32"></div>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--mute)] w-5 h-5" />
            <input
              type="text"
              placeholder={t('radicals_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--paper-hi2)] border border-[rgba(28,24,19,0.32)] rounded-lg py-3 pl-10 pr-4 text-[var(--ink)] placeholder-[var(--mute-strong)] focus:outline-none focus:border-[var(--jade)] focus:ring-1 focus:ring-[var(--jade)]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--mute)] hover:text-[var(--ink)]"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-center text-[var(--mute)] text-sm mt-2">
            {t('radicals_found_count', { count: filteredRadicals.length })}
          </p>
        </div>

        {/* Información introductoria */}
        <div className="bg-[var(--paper-hi)] rounded-xl p-6 mb-8 border border-[rgba(28,24,19,0.10)]">
          <h2 className="text-2xl font-bold text-[var(--ink)] mb-4">{t('radicals_what_are_radicals')}</h2>
          <div className="grid md:grid-cols-2 gap-6 text-[var(--ink-soft)]">
            <div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">{t('radicals_definition_title')}</h3>
              <p className="mb-4">
                {t('radicals_definition_text')}
              </p>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">{t('radicals_importance_title')}</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[var(--jade)] mr-2">•</span>
                  {t('radicals_importance_point1')}
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--jade)] mr-2">•</span>
                  {t('radicals_importance_point2')}
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--jade)] mr-2">•</span>
                  {t('radicals_importance_point3')}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--ink)] mb-2">{t('radicals_example_title')}</h3>
              <div className="bg-[var(--paper-hi2)] rounded-lg p-4">
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <div className="text-4xl font-bold text-[var(--ink)]">女</div>
                  <div className="text-[var(--mute)]">+</div>
                  <div className="text-4xl font-bold text-[var(--ink)]">子</div>
                  <div className="text-[var(--mute)]">=</div>
                  <div className="text-4xl font-bold text-[var(--jade)]">好</div>
                </div>
                <p className="text-sm text-center">
                  <span className="text-[var(--mute)]">女 (mujer)</span> + <span className="text-[var(--mute)]">子 (hijo)</span> = <span className="text-[var(--jade)]">好 (bueno)</span>
                </p>
                <p className="text-xs text-[var(--mute)] text-center mt-2">
                  {t('radicals_example_explanation')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de radicales */}
        <div className="space-y-8">
          {sortedGroups.map(([groupName, groupRadicals]) => (
            <div key={groupName} className="bg-[var(--paper-hi)] rounded-xl p-6 border border-[rgba(28,24,19,0.10)]">
              <h3 className="text-xl font-bold text-[var(--ink)] mb-4 flex items-center">
                <span className="w-3 h-3 bg-[var(--jade)] rounded-full mr-3"></span>
                {t('radicals_stroke_group', { count: groupName.replace('Trazo ', '') })}
                <span className="ml-2 text-sm text-[var(--mute)] bg-[var(--paper-hi2)] px-2 py-1 rounded">
                  {groupRadicals.length} {groupRadicals.length !== 1 ? 'radicales' : 'radical'}
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupRadicals.map((radical) => (
                  <div
                    key={radical.radical}
                    className="bg-[var(--paper-hi2)] rounded-lg p-4 hover:bg-[var(--mute2)] transition cursor-pointer border border-[rgba(28,24,19,0.18)]"
                    onClick={() => setSelectedRadical(selectedRadical?.radical === radical.radical ? null : radical)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl font-bold text-[var(--ink)]">
                        {radical.radical}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {radical.pinyin && (
                          <div className="text-xs text-[var(--mute)] bg-[var(--paper-hi)] px-2 py-1 rounded">
                            {radical.pinyin}
                          </div>
                        )}
                        <div className="text-xs text-[var(--mute)] bg-[var(--paper-hi)] px-2 py-1 rounded">
                          {t('radicals_example_count', { count: radical.examples?.length || 0 })}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-[var(--mute)] mb-3">
                      {radical.meaning}
                    </div>

                    {/* Ejemplos de caracteres */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {radical.examples?.slice(0, 6).map((exampleChar, charIndex) => (
                        <div
                          key={charIndex}
                          className="bg-[var(--paper-hi)] rounded px-2 py-1 text-xs border border-[rgba(28,24,19,0.18)]"
                          title={exampleChar}
                        >
                          <span className="text-[var(--ink)] font-semibold">{exampleChar}</span>
                        </div>
                      ))}
                    </div>

                    {/* Explicación del radical */}
                    {radical.explanation && (
                      <div className="text-xs text-[var(--mute)] mb-3">
                        {radical.explanation}
                      </div>
                    )}

                    {/* Detalles expandidos - AHORA FUNCIONA */}
                    {selectedRadical?.radical === radical.radical && (
                      <div className="mt-4 pt-4 border-t border-[rgba(28,24,19,0.18)]">
                        <h4 className="text-sm font-semibold text-[var(--ink)] mb-2">
                          {t('radicals_characters_using_radical', { count: radical.examples?.length || 0 })}
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {radical.examples?.map((exampleChar, charIndex) => (
                            <div key={charIndex} className="flex items-center space-x-3 text-sm">
                              <span className="text-lg font-bold text-[var(--ink)]">{exampleChar}</span>
                              <span className="text-[var(--mute)] text-xs">
                                {t('radicals_more_info_in_dictionary')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Información adicional del radical */}
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          {radical.frequency && (
                            <div className="text-[var(--mute)]">
                              {t('radicals_frequency')} <span className="text-[var(--ink)]">{radical.frequency}</span>
                            </div>
                          )}
                          {radical.variants && radical.variants.length > 0 && (
                            <div className="text-[var(--mute)]">
                              {t('radicals_variants')} <span className="text-[var(--ink)]">{radical.variants.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {filteredRadicals.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[var(--ink)] mb-2">{t('radicals_no_radicals_found_title')}</h3>
            <p className="text-[var(--mute)]">
              {t('radicals_no_radicals_found_text', { searchTerm })}
            </p>
          </div>
        )}

        {/* Resumen final */}
        <div className="bg-[var(--jade-bg)]/20 rounded-xl p-6 mt-8 border border-[var(--jade)]/30">
          <h3 className="text-xl font-bold text-[var(--ink)] mb-3">{t('radicals_study_tip_title')}</h3>
          <p className="text-[var(--jade)]">
            {t('radicals_study_tip_text')}
          </p>
        </div>

        {/* Navegación inferior */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={goBack}
            className="bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] text-[var(--ink)] font-semibold py-2 px-6 rounded-lg transition"
          >
            {t('radicals_back_button')}
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[var(--jade)] hover:bg-[var(--jade-deep)] text-[var(--on-accent)] font-semibold py-2 px-6 rounded-lg transition"
          >
            ↑ {t('radicals_back_to_top_button')}
          </button>
        </div>
      </div>
    </div>
  );
}
