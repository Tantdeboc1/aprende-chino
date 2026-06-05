// src/components/learn/Radicals/RadicalsQuiz.jsx (VERSIÓN CORREGIDA)
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { shuffle } from "@/utils/arrayUtils.js";

export default function RadicalsQuiz({ goBack, radicals }) {
  const { t } = useTranslation();
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

      // GENERAR OPCIONES INCORRECTAS - VERSIÓN MEJORADA
      const allPossibleDistractors = shuffle(
        radicals.filter(r => r.radical !== correctRadical.radical) // Solo excluir la correcta
      );

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

      // GARANTIZAR que no hay opciones duplicadas
      const uniqueOptions = [...new Set([correctRadical.radical, ...otherRadicals])];

      // Si aún no tenemos 4 opciones únicas, completar con radicales aleatorios
      while (uniqueOptions.length < 4) {
        const randomRadical = radicals[Math.floor(Math.random() * radicals.length)].radical;
        if (!uniqueOptions.includes(randomRadical)) {
          uniqueOptions.push(randomRadical);
        }
      }

      const allOptions = shuffle(uniqueOptions);

      questions.push({
        id: i,
        targetChar: targetChar,
        correctAnswer: correctRadical.radical,
        options: allOptions,
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
      <div className="min-h-screen bg-gradient-to-br from-[#fbf5e6] to-[#f4ecdc] p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={goBack}
                          className="flex items-center text-[#5b5446] hover:text-[#1c1813] transition mb-4"
          >
            <ArrowLeft className="mr-2" />
            {t('radicals_back_to_radicals')}
          </button>
          <h1 className="text-3xl font-bold text-[#1c1813] text-center">{t('radicals_title')}</h1>
          <p className="text-[#928a76] text-center">{t('radicals_quiz_identification_title')}</p>
        </div>

        {/* Instrucciones */}
        <div className="bg-[#fbf5e6] rounded-xl p-6 border border-[rgba(28,24,19,0.10)] mb-6">
          <h2 className="text-xl font-bold text-[#1c1813] mb-4">{t('quiz_instructions_title')}</h2>
          <div className="space-y-3 text-[#5b5446]">
            <div className="flex items-start">
              <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
              <p>{t('radicals_quiz_instructions_1')}</p>
            </div>
            <div className="flex items-start">
              <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
              <p>{t('radicals_quiz_instructions_2')}</p>
            </div>
            <div className="flex items-start">
              <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
              <p>{t('radicals_quiz_instructions_3')}</p>
            </div>
            <div className="flex items-start">
              <div className="bg-[#2f6b4a] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
              <p>{t('radicals_quiz_instructions_4')}</p>
            </div>
          </div>
        </div>

        {/* Botón empezar */}
        <button
          onClick={startQuiz}
          className="w-full bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-bold py-4 px-6 rounded-xl transition text-lg"
        >
          {t('radicals_start_quiz_button')}
        </button>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbf5e6] to-[#f4ecdc] p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={goBack}
                          className="flex items-center text-[#5b5446] hover:text-[#1c1813] transition mb-4"
          >
            <ArrowLeft className="mr-2" />
            {t('radicals_back_to_radicals')}
          </button>
        </div>

        {/* Resultados */}
        <div className="bg-[#fbf5e6] rounded-xl p-8 border border-[rgba(28,24,19,0.10)] text-center">
          <div className="text-6xl mb-4"></div>
          <h2 className="text-3xl font-bold text-[#1c1813] mb-4">{t('radicals_quiz_completed_title')}</h2>

          <div className="bg-[#f8f1de] rounded-lg p-6 mb-6">
            <div className="text-4xl font-bold text-[#1c1813] mb-2">
              {score}/10
            </div>
            <div className="text-[#928a76]">
              {score >= 8 ? t('radicals_quiz_score_excellent') :
               score >= 6 ? t('radicals_quiz_score_good') :
               t('radicals_quiz_score_practice')}
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={handleRestartQuiz}
              className="bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-semibold py-3 px-6 rounded-lg transition"
            >
              {t('radicals_retry_button')}
            </button>
            <button
              onClick={goBack}
              className="bg-[#f8f1de] hover:bg-[#bdb39a] text-[#1c1813] font-semibold py-3 px-6 rounded-lg transition"
            >
              ↩️ {t('radicals_back_button')}
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbf5e6] to-[#f4ecdc] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4"></div>
          <h2 className="text-xl font-bold text-[#1c1813]">{t('radicals_loading_questions')}</h2>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf5e6] to-[#f4ecdc] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center text-[#5b5446] hover:text-[#1c1813] transition mb-4"
          >
            <ArrowLeft className="mr-2" />
            {t('radicals_back_to_radicals')}
          </button>

          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-[#1c1813]">{t('radicals_identify_radicals_title')}</h1>
            <div className="text-[#928a76]">
              {currentQuestion + 1}/10
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-[#f8f1de] rounded-full h-2">
            <div
              className="bg-[#2f6b4a] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="bg-[#fbf5e6] rounded-xl p-4 sm:p-8 border border-[rgba(28,24,19,0.10)] mb-6 text-center">
          <h3 className="text-lg text-[#928a76] mb-4">{t('radicals_question_header')}</h3>

          {/* Carácter objetivo */}
          <div className="text-6xl sm:text-8xl font-bold text-[#1c1813] mb-4 sm:mb-8 py-2 sm:py-4">
            {currentQ.targetChar}
          </div>

          <h4 className="text-lg text-[#928a76] mb-4 sm:mb-6">{t('radicals_select_correct_radical')}</h4>

          {/* Opciones de respuesta */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {currentQ.options.map((option, index) => {
              const isCorrect = option === currentQ.correctAnswer;
              const isSelected = selectedAnswer === option;

              let buttonClass = "bg-[#f8f1de] hover:bg-[#bdb39a] border-[rgba(28,24,19,0.18)]";

              if (isAnswered) {
                if (isCorrect) {
                  buttonClass = "bg-[#2f6b4a] border-[#2f6b4a]";
                } else if (isSelected && !isCorrect) {
                  buttonClass = "bg-[#c8392f] border-[#c8392f]";
                } else {
                  buttonClass = "bg-[#f8f1de] border-[rgba(28,24,19,0.18)] opacity-50";
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`${buttonClass} border-2 rounded-xl p-6 text-4xl font-bold text-[#1c1813] transition disabled:cursor-not-allowed`}
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
            className="w-full bg-[#2f6b4a] hover:bg-[#1f4a33] text-[#fbf5e6] font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            {currentQuestion < 9 ? t('radicals_next_question_button') : t('radicals_view_results_button')}
          </button>
        )}
      </div>
    </div>
  );
}
