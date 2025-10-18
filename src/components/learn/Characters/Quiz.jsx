// src/components/learn/Characters/Quiz.jsx
import { useEffect, useState } from "react";

function pickN(arr, n) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

export default function Quiz({
  goBack,
  characters = [],
  speakChinese
}) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const initQuiz = () => {
    if (!Array.isArray(characters) || characters.length < 4) return;
    const pool = [...characters];
    const qs = [];
    for (let i = 0; i < 10; i++) {
      const correct = pool[Math.floor(Math.random() * pool.length)];
      const wrongPool = pool.filter(c => c.char !== correct.char);
      const options = pickN(wrongPool, 3).concat(correct).sort(() => Math.random() - 0.5);
      qs.push({ correct, options });
    }
    setQuestions(qs);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setShowInstructions(false);
  };

  useEffect(() => {
    if (!showInstructions) {
      initQuiz();
    }
  }, [characters, showInstructions]);

  // Pantalla de instrucciones
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-300 hover:text-white transition mb-4"
            >
              ← Volver a Caracteres
            </button>
            <h1 className="text-3xl font-bold text-white text-center">Quiz de Caracteres</h1>
            <p className="text-gray-400 text-center">Identifica el significado de los caracteres</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Instrucciones</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p>Observa el carácter chino mostrado en pantalla</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p>Selecciona el significado correcto entre las 4 opciones</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p>Las respuestas correctas se volverán <span className="text-green-400">verdes</span></p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>Los errores se mostrarán en <span className="text-red-400">rojo</span></p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">5</div>
                <p>Completa 10 preguntas para finalizar el quiz</p>
              </div>
            </div>
          </div>

          <button
            onClick={initQuiz}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            🎯 Comenzar Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4 flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-700">
          <p className="text-gray-300 mb-6">No hay suficientes datos para el quiz.</p>
          <button onClick={goBack} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition">
            Volver
          </button>
        </div>
      </div>
    );
  }

  const question = questions[index];

  const handleAnswer = (opt) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    if (opt.char === question.correct.char) setScore(s => s + 1);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      return setIndex(i => i + 1);
    }
    setIndex(i => i + 1);
    setSelected(null);
    setShowResult(false);
  };

  if (index >= questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-700">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">¡Quiz Completado!</h2>
          <p className="text-5xl font-bold text-red-400 mb-6">{score}/{questions.length}</p>
          <p className="text-gray-300 mb-6">
            {score >= 8 ? '¡Excelente trabajo!' : score >= 6 ? '¡Bien hecho!' : '¡Sigue practicando!'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowInstructions(true)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Jugar otra vez
            </button>
            <button
              onClick={goBack}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={goBack}
            className="flex items-center text-gray-300 hover:text-white text-sm"
          >
            ← Volver a Caracteres
          </button>

          <div className="text-center">
            <span className="text-gray-300 font-semibold text-base block">
              {index + 1}/{questions.length} | Puntos: {score}
            </span>
            {/* Barra de progreso */}
            <div className="w-32 bg-gray-700 rounded-full h-1.5 mt-1 mx-auto">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Botón de reiniciar */}
          <button
            onClick={() => setShowInstructions(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg transition text-sm"
          >
            Reiniciar
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <p className="text-gray-300 mb-4">¿Qué significa este carácter?</p>
            <div className="text-9xl font-bold text-white mb-2">{question.correct.char}</div>
            <p className="text-2xl text-gray-400">{question.correct.pinyin}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-lg text-lg font-semibold transition ${
                  showResult
                    ? option.char === question.correct.char
                      ? 'bg-green-500 text-white'
                      : option === selected
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-700 text-gray-400'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {option.meaning}
              </button>
            ))}
          </div>

          {showResult && (
            <button
              onClick={next}
              className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
            >
              {index + 1 >= questions.length ? 'Ver Resultado' : 'Siguiente'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
