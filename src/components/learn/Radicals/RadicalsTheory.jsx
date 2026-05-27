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
    <div className="min-h-screen bg-gradient-to-br from-[#fbf5e6] to-[#f4ecdc] p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={goBack}
            className="flex items-center text-[#5b5446] hover:text-[#1c1813] transition"
          >
            <ArrowLeft className="mr-2" />
            {t('radicals_back_to_radicals')}
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1c1813]">{t('radicals_theory_title_long')}</h1>
            <p className="text-[#928a76]">{t('radicals_theory_subtitle')}</p>
          </div>

          <div className="w-32"></div>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#928a76] w-5 h-5" />
            <input
              type="text"
              placeholder={t('radicals_search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#f8f1de] border border-[rgba(28,24,19,0.18)] rounded-lg py-3 pl-10 pr-4 text-[#1c1813] placeholder-[#928a76] focus:outline-none focus:border-[#2f6b4a] focus:ring-1 focus:ring-[#2f6b4a]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#928a76] hover:text-[#1c1813]"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-center text-[#928a76] text-sm mt-2">
            {t('radicals_found_count', { count: filteredRadicals.length })}
          </p>
        </div>

        {/* Información introductoria */}
        <div className="bg-[#fbf5e6] rounded-xl p-6 mb-8 border border-[rgba(28,24,19,0.10)]">
          <h2 className="text-2xl font-bold text-[#1c1813] mb-4">{t('radicals_what_are_radicals')}</h2>
          <div className="grid md:grid-cols-2 gap-6 text-[#5b5446]">
            <div>
              <h3 className="text-lg font-semibold text-[#1c1813] mb-2">{t('radicals_definition_title')}</h3>
              <p className="mb-4">
                {t('radicals_definition_text')}
              </p>
              <h3 className="text-lg font-semibold text-[#1c1813] mb-2">{t('radicals_importance_title')}</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-[#2f6b4a] mr-2">•</span>
                  {t('radicals_importance_point1')}
                </li>
                <li className="flex items-start">
                  <span className="text-[#2f6b4a] mr-2">•</span>
                  {t('radicals_importance_point2')}
                </li>
                <li className="flex items-start">
                  <span className="text-[#2f6b4a] mr-2">•</span>
                  {t('radicals_importance_point3')}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1c1813] mb-2">{t('radicals_example_title')}</h3>
              <div className="bg-[#f8f1de] rounded-lg p-4">
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <div className="text-4xl font-bold text-[#1c1813]">女</div>
                  <div className="text-[#928a76]">+</div>
                  <div className="text-4xl font-bold text-[#1c1813]">子</div>
                  <div className="text-[#928a76]">=</div>
                  <div className="text-4xl font-bold text-[#2f6b4a]">好</div>
                </div>
                <p className="text-sm text-center">
                  <span className="text-[#928a76]">女 (mujer)</span> + <span className="text-[#928a76]">子 (hijo)</span> = <span className="text-[#2f6b4a]">好 (bueno)</span>
                </p>
                <p className="text-xs text-[#928a76] text-center mt-2">
                  {t('radicals_example_explanation')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de radicales */}
        <div className="space-y-8">
          {sortedGroups.map(([groupName, groupRadicals]) => (
            <div key={groupName} className="bg-[#fbf5e6] rounded-xl p-6 border border-[rgba(28,24,19,0.10)]">
              <h3 className="text-xl font-bold text-[#1c1813] mb-4 flex items-center">
                <span className="w-3 h-3 bg-[#2f6b4a] rounded-full mr-3"></span>
                {t('radicals_stroke_group', { count: groupName.replace('Trazo ', '') })}
                <span className="ml-2 text-sm text-[#928a76] bg-[#f8f1de] px-2 py-1 rounded">
                  {groupRadicals.length} {groupRadicals.length !== 1 ? 'radicales' : 'radical'}
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupRadicals.map((radical, index) => (
                  <div
                    key={radical.radical}
                    className="bg-[#f8f1de] rounded-lg p-4 hover:bg-[#bdb39a] transition cursor-pointer border border-[rgba(28,24,19,0.18)]"
                    onClick={() => setSelectedRadical(selectedRadical?.radical === radical.radical ? null : radical)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl font-bold text-[#1c1813]">
                        {radical.radical}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {radical.pinyin && (
                          <div className="text-xs text-[#928a76] bg-[#fbf5e6] px-2 py-1 rounded">
                            {radical.pinyin}
                          </div>
                        )}
                        <div className="text-xs text-[#928a76] bg-[#fbf5e6] px-2 py-1 rounded">
                          {t('radicals_example_count', { count: radical.examples?.length || 0 })}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-[#928a76] mb-3">
                      {radical.meaning}
                    </div>

                    {/* Ejemplos de caracteres */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {radical.examples?.slice(0, 6).map((exampleChar, charIndex) => (
                        <div
                          key={charIndex}
                          className="bg-[#fbf5e6] rounded px-2 py-1 text-xs border border-[rgba(28,24,19,0.18)]"
                          title={exampleChar}
                        >
                          <span className="text-[#1c1813] font-semibold">{exampleChar}</span>
                        </div>
                      ))}
                    </div>

                    {/* Explicación del radical */}
                    {radical.explanation && (
                      <div className="text-xs text-[#928a76] mb-3">
                        {radical.explanation}
                      </div>
                    )}

                    {/* Detalles expandidos - AHORA FUNCIONA */}
                    {selectedRadical?.radical === radical.radical && (
                      <div className="mt-4 pt-4 border-t border-[rgba(28,24,19,0.18)]">
                        <h4 className="text-sm font-semibold text-[#1c1813] mb-2">
                          {t('radicals_characters_using_radical', { count: radical.examples?.length || 0 })}
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {radical.examples?.map((exampleChar, charIndex) => (
                            <div key={charIndex} className="flex items-center space-x-3 text-sm">
                              <span className="text-lg font-bold text-[#1c1813]">{exampleChar}</span>
                              <span className="text-[#928a76] text-xs">
                                {t('radicals_more_info_in_dictionary')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Información adicional del radical */}
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          {radical.frequency && (
                            <div className="text-[#928a76]">
                              {t('radicals_frequency')} <span className="text-[#1c1813]">{radical.frequency}</span>
                            </div>
                          )}
                          {radical.variants && radical.variants.length > 0 && (
                            <div className="text-[#928a76]">
                              {t('radicals_variants')} <span className="text-[#1c1813]">{radical.variants.join(', ')}</span>
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
            <h3 className="text-xl font-bold text-[#1c1813] mb-2">{t('radicals_no_radicals_found_title')}</h3>
            <p className="text-[#928a76]">
              {t('radicals_no_radicals_found_text', { searchTerm })}
            </p>
          </div>
        )}

        {/* Resumen final */}
        <div className="bg-[#cfe1d3]/20 rounded-xl p-6 mt-8 border border-[#2f6b4a]/30">
          <h3 className="text-xl font-bold text-[#1c1813] mb-3">{t('radicals_study_tip_title')}</h3>
          <p className="text-[#2f6b4a]">
            {t('radicals_study_tip_text')}
          </p>
        </div>

        {/* Navegación inferior */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={goBack}
            className="bg-[#f8f1de] hover:bg-[#bdb39a] text-[#1c1813] font-semibold py-2 px-6 rounded-lg transition"
          >
            {t('radicals_back_button')}
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-semibold py-2 px-6 rounded-lg transition"
          >
            ↑ {t('radicals_back_to_top_button')}
          </button>
        </div>
      </div>
    </div>
  );
}
