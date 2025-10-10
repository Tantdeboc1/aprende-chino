// src/components/Dictionary.jsx
import { useMemo } from "react";
import { ArrowLeft, Volume2, Search } from "lucide-react"; // Añade Search aquí
import Card from "@/components/ui/Card.jsx";
import Container from "@/components/ui/Container.jsx";
import Button from "@/components/ui/Button.jsx";

export default function Dictionary({
  goBack,
  characters = [],
  speakChinese,
  searchTerm,
  setSearchTerm,
}) {
  const filteredChars = useMemo(() => {
    const q = (searchTerm || "").toLowerCase().trim();
    if (!q) return characters;
    return characters.filter((c) => {
      const ch = String(c.char || "");
      const py = String(c.pinyin || "").toLowerCase();
      const me = String(c.meaning || "").toLowerCase();
      const rad = String(c.radical || "").toLowerCase();
      return ch.includes(q) || py.includes(q) || me.includes(q) || rad.includes(q);
    });
  }, [characters, searchTerm]);

  const handleSpeak = (char) => {
    console.log('🎯 Dictionary: Botón Escuchar clickeado', { char });
    if (typeof speakChinese === 'function') {
      speakChinese(char);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 p-4">
      <Container size="lg">
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2" />
            Menú
          </button>

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">词典 HSK-1</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">Cídiǎn HSK-1</p>

          {/* Input con icono de lupa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por carácter, pinyin, significado o radical..."
              value={searchTerm || ""}
              onChange={(e) => setSearchTerm?.(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChars.map((char, idx) => (
            <Card key={idx} className="text-center hover:shadow-xl transition bg-white dark:bg-gray-800">
              <div className="text-7xl text-center mb-4 text-gray-800 dark:text-white">{char.char}</div>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Radical:</span>
                  <span className="text-3xl text-gray-800 dark:text-white">{char.radical}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Pinyin:</span>
                  <span className="text-xl text-gray-700 dark:text-gray-300">{char.pinyin}</span>
                </div>
                <div className="pb-2 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">Pronunciación:</span>
                    <Button
                      onClick={() => handleSpeak(char.char)}
                      className="!w-auto !px-2 !py-1 !bg-green-500 !hover:bg-green-600 !text-white !text-xs"
                    >
                      Escuchar
                    </Button>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-gray-800 dark:text-white font-semibold text-center text-lg">{char.meaning}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredChars.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p className="text-xl">No se encontraron caracteres</p>
          </div>
        )}
      </Container>
    </div>
  );
}