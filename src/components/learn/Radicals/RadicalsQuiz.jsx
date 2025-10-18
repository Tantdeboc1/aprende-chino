// src/components/learn/Radicals/RadicalsQuiz.jsx (VERSIÓN CORREGIDA)
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";

export default function RadicalsQuiz({ goBack, radicals }) {
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
      // Seleccionar un radical aleatorio que no se haya usado como RESPUESTA CORRECTA
      let availableRadicals = radicals.filter(r => !usedRadicals.has(r.radical));
      if (availableRadicals.length === 0) {
        // Si no hay más radicales únicos, reiniciar el conjunto usado
        usedRadicals.clear();
        availableRadicals = radicals;
      }

      const correctRadical = availableRadicals[Math.floor(Math.random() * availableRadicals.length)];
      usedRadicals.add(correctRadical.radical);

      // Seleccionar un carácter de ejemplo
      const exampleChars = correctRadical.examples || [];
      const targetChar = exampleChars.length > 0
        ? exampleChars[Math.floor(Math.random() * exampleChars.length)]
        : correctRadical.radical;

      // 🔥 GENERAR OPCIONES INCORRECTAS - VERSIÓN MEJORADA
      const allPossibleDistractors = radicals
        .filter(r => r.radical !== correctRadical.radical) // Solo excluir la correcta
        .sort(() => Math.random() - 0.5);

      // Tomar hasta 3 distractores, si hay menos usar los disponibles
      const otherRadicals = allPossibleDistractors
        .slice(0, Math.min(3, allPossibleDistractors.length))
        .map(r => r.radical);

      // Si no hay suficientes distractores, completar con radicales repetidos
      const neededDistractors = 3 - otherRadicals.length;
      if (neededDistractors > 0) {
        const extraDistractors = allPossibleDistractors
          .slice(3, 3 + neededDistractors)
          .map(r => r.radical);
        otherRadicals.push(...extraDistractors);
      }

      // 🔥 GARANTIZAR que no hay opciones duplicadas
      const uniqueOptions = [...new Set([correctRadical.radical, ...otherRadicals])];

      // Si aún no tenemos 4 opciones únicas, completar con radicales aleatorios
      while (uniqueOptions.length < 4) {
        const randomRadical = radicals[Math.floor(Math.random() * radicals.length)].radical;
        if (!uniqueOptions.includes(randomRadical)) {
          uniqueOptions.push(randomRadical);
        }
      }

      const allOptions = uniqueOptions
        .sort(() => Math.random() - 0.5);

      questions.push({
        id: i,
        targetChar: targetChar,
        correctAnswer: correctRadical.radical,
        options: allOptions,
        radicalMeaning: correctRadical.meaning
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
            <p className="text-gray-400 text-center">Identificación Visual</p>
          </div>

          {/* Instrucciones */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Instrucciones</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p>Se te mostrará un carácter chino</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p>Identifica cuál de los radicales mostrados está presente en el carácter</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p>Selecciona la respuesta correcta entre las 4 opciones</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>Completa 10 preguntas para finalizar el quiz</p>
              </div>
            </div>
          </div>

          {/* Botón empezar */}
          <button
            onClick={startQuiz}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            🎯 Empezar Quiz
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
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-4">Quiz Completado</h2>

            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-white mb-2">
                {score}/10
              </div>
              <div className="text-gray-400">
                {score >= 8 ? "¡Excelente! 🏆" :
                 score >= 6 ? "¡Buen trabajo! 👍" :
                 "Sigue practicando 💪"}
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleRestartQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
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
            <h1 className="text-2xl font-bold text-white">Identificar Radicales</h1>
            <div className="text-gray-400">
              {currentQuestion + 1}/10
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-6 text-center">
          <h3 className="text-lg text-gray-400 mb-4">¿Qué radical contiene este carácter?</h3>

          {/* Carácter objetivo */}
          <div className="text-8xl font-bold text-white mb-8 py-4">
            {currentQ.targetChar}
          </div>

          <h4 className="text-lg text-gray-400 mb-6">Selecciona el radical correcto:</h4>

          {/* Opciones de respuesta */}
          <div className="grid grid-cols-2 gap-4">
            {currentQ.options.map((option, index) => {
              const isCorrect = option === currentQ.correctAnswer;
              const isSelected = selectedAnswer === option;

              let buttonClass = "bg-gray-700 hover:bg-gray-600 border-gray-600";

              if (isAnswered) {
                if (isCorrect) {
                  buttonClass = "bg-green-600 border-green-500";
                } else if (isSelected && !isCorrect) {
                  buttonClass = "bg-red-600 border-red-500";
                } else {
                  buttonClass = "bg-gray-700 border-gray-600 opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`${buttonClass} border-2 rounded-xl p-6 text-4xl font-bold text-white transition disabled:cursor-not-allowed`}
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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            {currentQuestion < 9 ? "Siguiente Pregunta →" : "Ver Resultados"}
          </button>
        )}
      </div>
    </div>
  );
}
