import { assetUrl } from '../../utils/assets';
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";

export default function LanguageFacts({ goBack }) {
  const [facts, setFacts] = useState([]);
  const [toneExamples, setToneExamples] = useState([]);
  const [simplified, setSimplified] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(assetUrl('data/info.json'));
        const json = await res.json();
        if (!alive) return;
        setFacts(json?.language?.facts ?? []);
        setToneExamples(json?.language?.toneExamples ?? []);
        setSimplified(json?.language?.scripts?.simplifiedExamples ?? []);
      } catch (e) {
        setError("No se pudo cargar /data/info.json");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300">Cargando…</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <Container>
        <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft className="mr-2" /> Información
        </button>

        {error && <div className="bg-red-900 text-red-200 border border-red-700 rounded-md p-3 mb-4">{error}</div>}

        <div className="grid gap-6">
          {/* Bloque 1: datos rápidos */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">🈶 Curiosidades del Idioma</h2>
            <p className="text-gray-300 mb-4">Puntos clave sobre el mandarín estándar.</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              {facts.map((f, i) => (
                <li key={i}>
                  <span className="font-semibold text-white">{f.title}: </span>
                  <span className="text-gray-300">{f.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bloque 2: ejemplos de tonos */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">📣 Ejemplos de Tonos</h2>
            <p className="text-gray-300 mb-4">El contorno tonal cambia el significado.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {toneExamples.map((t, i) => (
                <div key={i} className="rounded-xl border border-gray-600 p-4 text-center hover:shadow-lg transition bg-gray-700">
                  <div className="text-4xl mb-2 text-white">{t.char}</div>
                  <div className="text-gray-300 font-semibold">{t.pinyin}</div>
                  <div className="text-gray-400">{t.meaning}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bloque 3: tradicional vs simplificado */}
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-2">字形 Tradicional vs 简体 Simplificado</h2>
            <p className="text-gray-300 mb-4">Algunos pares frecuentes.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {simplified.map((p, i) => (
                <div key={i} className="rounded-xl border border-gray-600 p-4 text-center hover:shadow-lg transition bg-gray-700">
                  <div className="text-3xl text-white">{p.trad} → {p.simp}</div>
                  <div className="text-gray-400">{p.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}