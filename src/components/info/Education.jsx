import { assetUrl } from '../../utils/assets';
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container.jsx";

export default function Education({ goBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(assetUrl('data/info.json'));
        const json = await res.json();
        if (!alive) return;
        setData(json);
      } catch (e) {
        setError("No se pudo cargar /data/info.json");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  if (loading) return <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-300">Cargando…</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <Container>
        <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white mb-6">
          <ArrowLeft className="mr-2" /> Información
        </button>

        {error && <div className="bg-red-900 text-red-200 border border-red-700 rounded-md p-3 mb-4">{error}</div>}

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-2">🏫 Educación y Vida Estudiantil</h1>
          <p className="text-gray-300 mb-6">Sistema educativo y rasgos distintivos.</p>
          
          {data?.education?.topics && (
            <div className="space-y-4">
              {data.education.topics.map((t, i) => (
                <div key={i} className="rounded-xl border border-gray-600 p-4 hover:shadow-lg transition bg-gray-700">
                  <div className="text-lg font-semibold text-white">{t.title}</div>
                  <div className="text-gray-300">{t.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}