// src/components/DailyIndex.jsx
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button.jsx";
import Container from "@/components/ui/Container.jsx";

export default function DailyIndex({ goBack, setDailySection }) {
  const challenges = [
    {
      id: 'characters',
      title: '🏃 Desafío Caracteres',
      description: '10 preguntas con sistema de pistas y errores',
      time: 'Sin tiempo límite',
      color: 'blue'
    },
    {
      id: 'tones',
      title: '🎵 Desafío Tonos',
      description: '10 preguntas de identificación auditiva',
      time: '120 segundos',
      color: 'green'
    },
    {
      id: 'radicals',
      title: '🧩 Desafío Radicales',
      description: '10 preguntas de identificación visual',
      time: '150 segundos',
      color: 'purple'
    }
  ];

  const getBorderColor = (color) => {
    const colors = {
      blue: 'hover:border-blue-500',
      green: 'hover:border-green-500',
      purple: 'hover:border-purple-500'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen p-4">
      <Container>
        <div className="mb-6">
          <button
            onClick={goBack}
            className="flex items-center text-gray-300 hover:text-white"
          >
            <ArrowLeft className="mr-2" />
            Volver al Menú
          </button>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-2">Desafíos Diarios</h2>
          <p className="text-xl text-gray-300">Completa los desafíos para mejorar tu chino</p>
        </div>

        {/* Grid de desafíos */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {challenges.map((challenge) => (
            <Button
              key={challenge.id}
              variant="card"
              onClick={() => {
                console.log('🟡 Click en:', challenge.id);
                setDailySection(challenge.id);
              }}
              className={`bg-gray-800 border border-gray-700 ${getBorderColor(challenge.color)} h-48`}
            >
              <div className="text-5xl mb-4">{challenge.title.split(' ')[0]}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {challenge.title.split(' ').slice(1).join(' ')}
              </h3>
              <p className="text-lg text-gray-300 mb-2">{challenge.description}</p>
              <p className="text-sm text-gray-400">{challenge.time}</p>
            </Button>
          ))}
        </div>
      </Container>
    </div>
  );
}
