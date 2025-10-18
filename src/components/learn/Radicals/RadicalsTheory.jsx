// src/components/learn/Radicals/RadicalsTheory.jsx
import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";

export default function RadicalsTheory({ goBack, radicals }) {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={goBack}
            className="flex items-center text-gray-300 hover:text-white transition"
          >
            <ArrowLeft className="mr-2" />
            Volver a Radicales
          </button>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Teoría de Radicales</h1>
            <p className="text-gray-400">Aprende los componentes básicos del chino</p>
          </div>

          <div className="w-32"></div>
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar radical, carácter, pinyin o significado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          <p className="text-center text-gray-500 text-sm mt-2">
            {filteredRadicals.length} radicales encontrados
          </p>
        </div>

        {/* Información introductoria */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">¿Qué son los radicales?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Definición</h3>
              <p className="mb-4">
                Los radicales (部首 bùshǒu) son componentes básicos de los caracteres chinos.
                Cada carácter está compuesto por uno o más radicales que aportan pistas sobre
                su significado o pronunciación.
              </p>
              <h3 className="text-lg font-semibold text-white mb-2">Importancia</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Ayudan a memorizar caracteres
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Facilitan la búsqueda en diccionarios
                </li>
                <li className="flex items-start">
                  <span className="text-green-400 mr-2">•</span>
                  Revelan relaciones entre caracteres
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Ejemplo práctico</h3>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <div className="text-4xl font-bold text-white">女</div>
                  <div className="text-gray-400">+</div>
                  <div className="text-4xl font-bold text-white">子</div>
                  <div className="text-gray-400">=</div>
                  <div className="text-4xl font-bold text-blue-400">好</div>
                </div>
                <p className="text-sm text-center">
                  <span className="text-gray-400">女 (mujer)</span> + <span className="text-gray-400">子 (hijo)</span> = <span className="text-blue-400">好 (bueno)</span>
                </p>
                <p className="text-xs text-gray-500 text-center mt-2">
                  "Una mujer con un hijo se considera algo bueno"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de radicales */}
        <div className="space-y-8">
          {sortedGroups.map(([groupName, groupRadicals]) => (
            <div key={groupName} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                {groupName}
                <span className="ml-2 text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                  {groupRadicals.length} radical{groupRadicals.length !== 1 ? 'es' : ''}
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupRadicals.map((radical, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition cursor-pointer border border-gray-600"
                    onClick={() => setSelectedRadical(selectedRadical?.radical === radical.radical ? null : radical)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl font-bold text-white">
                        {radical.radical}
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {radical.pinyin && (
                          <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                            {radical.pinyin}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                          {radical.examples?.length || 0} ejemplos
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-400 mb-3">
                      {radical.meaning}
                    </div>

                    {/* Ejemplos de caracteres */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {radical.examples?.slice(0, 6).map((exampleChar, charIndex) => (
                        <div
                          key={charIndex}
                          className="bg-gray-800 rounded px-2 py-1 text-xs border border-gray-600"
                          title={exampleChar}
                        >
                          <span className="text-white font-semibold">{exampleChar}</span>
                        </div>
                      ))}
                    </div>

                    {/* Explicación del radical */}
                    {radical.explanation && (
                      <div className="text-xs text-gray-500 mb-3">
                        {radical.explanation}
                      </div>
                    )}

                    {/* Detalles expandidos - AHORA FUNCIONA */}
                    {selectedRadical?.radical === radical.radical && (
                      <div className="mt-4 pt-4 border-t border-gray-600">
                        <h4 className="text-sm font-semibold text-white mb-2">
                          Caracteres que usan este radical ({radical.examples?.length || 0}):
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {radical.examples?.map((exampleChar, charIndex) => (
                            <div key={charIndex} className="flex items-center space-x-3 text-sm">
                              <span className="text-lg font-bold text-white">{exampleChar}</span>
                              <span className="text-gray-400 text-xs">
                                (más información en el diccionario)
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Información adicional del radical */}
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          {radical.frequency && (
                            <div className="text-gray-400">
                              Frecuencia: <span className="text-white">{radical.frequency}</span>
                            </div>
                          )}
                          {radical.variants && radical.variants.length > 0 && (
                            <div className="text-gray-400">
                              Variantes: <span className="text-white">{radical.variants.join(', ')}</span>
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
            <h3 className="text-xl font-bold text-white mb-2">No se encontraron radicales</h3>
            <p className="text-gray-400">
              No hay radicales que coincidan con "{searchTerm}". Intenta con otro término.
            </p>
          </div>
        )}

        {/* Resumen final */}
        <div className="bg-blue-900/20 rounded-xl p-6 mt-8 border border-blue-700/30">
          <h3 className="text-xl font-bold text-white mb-3">💡 Consejo de estudio</h3>
          <p className="text-blue-200">
            Estudia 3-5 radicales por día y trata de identificar los caracteres que los contienen.
            Con el tiempo, podrás descomponer caracteres complejos en partes reconocibles.
          </p>
        </div>

        {/* Navegación inferior */}
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={goBack}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Volver
          </button>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            ↑ Volver arriba
          </button>
        </div>
      </div>
    </div>
  );
}
