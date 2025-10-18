// src/components/learn/Writing/index.jsx
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Container from "@/components/ui/Container.jsx";

export default function WritingMenu({ goBack, setWritingSection }) {
  return (
    <div className="min-h-screen p-4">
      <Container>
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            Aprender
          </button>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">书写</h2>
          <p className="text-xl text-gray-300">Shūxiě - Escritura</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Hanzi Completo */}
          <Button
            variant="card"
            onClick={() => setWritingSection("hanzi")}
            className="bg-gray-800 border border-gray-700 hover:border-gray-600"
          >
            <div className="text-5xl mb-4">🈷️</div>
            <h3 className="text-2xl font-bold text-white mb-2">汉字</h3>
            <p className="text-lg text-gray-300 mb-1">Hànzì</p>
            <p className="text-gray-400">Caracteres Completos</p>
          </Button>

          {/* Radicales Básicos */}
          <Button
            variant="card"
            onClick={() => setWritingSection("radicals")}
            className="bg-gray-800 border border-gray-700 hover:border-gray-600"
          >
            <div className="text-5xl mb-4">🔠</div>
            <h3 className="text-2xl font-bold text-white mb-2">部首</h3>
            <p className="text-lg text-gray-300 mb-1">Bùshǒu</p>
            <p className="text-gray-400">Radicales Básicos</p>
          </Button>
        </div>
      </Container>
    </div>
  );
}