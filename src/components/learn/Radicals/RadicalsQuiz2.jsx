// src/components/learn/Radicals/RadicalsQuiz2.jsx
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function RadicalsQuiz2({ goBack, radicals }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  // Generar preguntas del quiz
  useEffect(() => {
    if (radicals.length > 0) {
      const generatedQuestions = generateQuestions();
      setQuizQuestions(generatedQuestions);
    }
  }, [radicals]);

  const generateQuestions = () => {
    const questions = [];
    const usedRadicals = new Set();

    for (let i = 0; i < 10; i++) {
      // Seleccionar un radical aleatorio que no se haya usado
      let availableRadicals = radicals.filter(r => !usedRadicals.has(r.radical) && r.meaning);
      if (availableRadicals.length === 0) break;

      const correctRadical = availableRadicals[Math.floor(Math.random() * availableRadicals.length)];
      usedRadicals.add(correctRadical.radical);

      // Generar opciones incorrectas (otros significados de radicales)
      const otherMeanings = radicals
        .filter(r => r.radical !== correctRadical.radical && r.meaning && !usedRadicals.has(r.radical))
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(r => r.meaning);

      const allOptions = [correctRadical.meaning, ...otherMeanings]
        .sort(() => Math.random() - 0.5);

      questions.push({
        id: i,
        radical: correctRadical.radical,
        pinyin: correctRadical.pinyin,
        correctAnswer: correctRadical.meaning,
        options: allOptions
      });
    }

    return questions;
  };

  const handleAnswerSelect = (answer) => {
    if (isAnswered) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    const newQuestions = generateQuestions();
    setQuizQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-300 hover:text-white transition mb-4"
            >
              <ArrowLeft className="mr-2" />
              Volver a Radicales
            </button>
            <h1 className="text-3xl font-bold text-white text-center">Quiz de Radicales</h1>
            <p className="text-gray-400 text-center">Significados</p>
          </div>

          {/* Instrucciones */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Instrucciones</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p>Se te mostrará un radical chino</p>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p>Identifica cuál es su significado correcto</p>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p>Selecciona la respuesta correcta entre las 4 opciones</p>
              </div>
              <div className="flex items-start">
                <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>Completa 10 preguntas para finalizar el quiz</p>
              </div>
            </div>
          </div>

          {/* Botón empezar */}
          <button
            onClick={startQuiz}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            📚 Empezar Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-300 hover:text-white transition mb-4"
            >
              <ArrowLeft className="mr-2" />
              Volver a Radicales
            </button>
          </div>

          {/* Resultados */}
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <div className="text-6xl mb-4">🎓</div>
            <h2 className="text-3xl font-bold text-white mb-4">Quiz Completado</h2>

            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-white mb-2">
                {score}/10
              </div>
              <div className="text-gray-400">
                {score >= 8 ? "¡Dominas los radicales! 🏆" :
                 score >= 6 ? "¡Buen conocimiento! 👍" :
                 "Sigue estudiando 💪"}
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleRestartQuiz}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                🔄 Reintentar
              </button>
              <button
                onClick={goBack}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                ↩️ Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-white">Cargando preguntas...</h2>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center text-gray-300 hover:text-white transition mb-4"
          >
            <ArrowLeft className="mr-2" />
            Volver a Radicales
          </button>

          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-white">Significados de Radicales</h1>
            <div className="text-gray-400">
              {currentQuestion + 1}/10
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-6 text-center">
          <h3 className="text-lg text-gray-400 mb-4">¿Qué significa este radical?</h3>

          {/* Radical objetivo */}
          <div className="text-8xl font-bold text-white mb-4 py-4">
            {currentQ.radical}
          </div>

          {/* Pinyin del radical */}
          {currentQ.pinyin && (
            <div className="text-xl text-gray-400 mb-6">
              {currentQ.pinyin}
            </div>
          )}

          <h4 className="text-lg text-gray-400 mb-6">Selecciona el significado correcto:</h4>

          {/* Opciones de respuesta */}
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isCorrect = option === currentQ.correctAnswer;
              const isSelected = selectedAnswer === option;

              let buttonClass = "bg-gray-700 hover:bg-gray-600 border-gray-600 text-left";

              if (isAnswered) {
                if (isCorrect) {
                  buttonClass = "bg-green-600 border-green-500 text-left";
                } else if (isSelected && !isCorrect) {
                  buttonClass = "bg-red-600 border-red-500 text-left";
                } else {
                  buttonClass = "bg-gray-700 border-gray-600 opacity-50 text-left";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`${buttonClass} border-2 rounded-xl p-4 text-lg font-semibold text-white transition disabled:cursor-not-allowed w-full text-center`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón siguiente */}
        {isAnswered && (
          <button
            onClick={handleNextQuestion}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            {currentQuestion < 9 ? "Siguiente Pregunta →" : "Ver Resultados"}
          </button>
        )}
      </div>
    </div>
  );
}
