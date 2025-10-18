// src/components/learn/Radicals/index.jsx
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Container from "@/components/ui/Container.jsx";

export default function RadicalsIndex({ goBack, setRadicalSection, radicals }) {
  return (
    <div className="min-h-screen p-4">
      <Container>
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            Volver a Aprender
          </button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">部首</h2>
          <p className="text-xl text-gray-300">Bùshǒu - Radicales Chinos</p>
        </div>

        {/* TRES botones principales - TEORÍA + 2 QUIZZES */}
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Teoría */}
          <Button
            variant="card"
            onClick={() => setRadicalSection("theory")}
            className="bg-gray-800 border border-gray-700 hover:border-blue-500 h-48"
          >
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-white mb-2">Teoría</h3>
            <p className="text-lg text-gray-300">Aprende los conceptos</p>
          </Button>

          {/* Quiz 1 - Identificación Visual */}
          <Button
            variant="card"
            onClick={() => setRadicalSection("quiz1")}
            className="bg-gray-800 border border-gray-700 hover:border-green-500 h-48"
          >
            <div className="text-5xl mb-4">👁️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Identificar</h3>
            <p className="text-lg text-gray-300">Encuentra radicales</p>
          </Button>

          {/* Quiz 2 - Significados */}
          <Button
            variant="card"
            onClick={() => setRadicalSection("quiz2")}
            className="bg-gray-800 border border-gray-700 hover:border-purple-500 h-48"
          >
            <div className="text-5xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-white mb-2">Significados</h3>
            <p className="text-lg text-gray-300">Aprende significados</p>
          </Button>
        </div>

        {/* Estadísticas rápidas */}
        <div className="max-w-3xl mx-auto mt-12">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-white">{radicals.length}</div>
              <div className="text-gray-400 text-sm">Radicales</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {radicals.reduce((acc, curr) => acc + (curr.examples?.length || 0), 0)}
              </div>
              <div className="text-gray-400 text-sm">Ejemplos</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
              <div className="text-2xl font-bold text-white">
                {new Set(radicals.map(r => r.strokeCount)).size}
              </div>
              <div className="text-gray-400 text-sm">Traços</div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
