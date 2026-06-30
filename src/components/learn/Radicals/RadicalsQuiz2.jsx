// src/components/learn/Radicals/RadicalsQuiz2.jsx
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { shuffle } from "@/utils/arrayUtils.js";

export default function RadicalsQuiz2({ goBack, radicals }) {
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
      // Seleccionar un radical aleatorio que no se haya usado
      let availableRadicals = radicals.filter(r => !usedRadicals.has(r.radical) && r.meaning);
      if (availableRadicals.length === 0) break;

      const correctRadical = availableRadicals[Math.floor(Math.random() * availableRadicals.length)];
      usedRadicals.add(correctRadical.radical);

      // Generar opciones incorrectas (otros significados de radicales)
      const otherMeanings = shuffle(
        radicals.filter(r => r.radical !== correctRadical.radical && r.meaning && !usedRadicals.has(r.radical))
      )
        .slice(0, 3)
        .map(r => r.meaning);

      const allOptions = shuffle([correctRadical.meaning, ...otherMeanings]);

      questions.push({
        id: i,
        radical: correctRadical.radical,
        pinyin: correctRadical.pinyin,
        correctAnswer: correctRadical.meaning,
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
      <div className="min-h-screen bg-gradient-to-br from-[var(--paper-hi)] to-[var(--paper)] p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={goBack}
                          className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition mb-4"
          >
            <ArrowLeft className="mr-2" />
            {t('radicals_back_to_radicals')}
          </button>
          <h1 className="text-3xl font-bold text-[var(--ink)] text-center">{t('radicals_title')}</h1>
          <p className="text-[var(--mute)] text-center">{t('radicals_quiz_meanings_title')}</p>
        </div>

        {/* Instrucciones */}
        <div className="bg-[var(--paper-hi)] rounded-xl p-6 border border-[rgba(28,24,19,0.10)] mb-6">
          <h2 className="text-xl font-bold text-[var(--ink)] mb-4">{t('quiz_instructions_title')}</h2>
          <div className="space-y-3 text-[var(--ink-soft)]">
            <div className="flex items-start">
              <div className="bg-[var(--red)] text-[var(--on-accent)] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
              <p>{t('radicals_quiz_meaning_instructions_1')}</p>
            </div>
            <div className="flex items-start">
              <div className="bg-[var(--red)] text-[var(--on-accent)] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
              <p>{t('radicals_quiz_meaning_instructions_2')}</p>
            </div>
            <div className="flex items-start">
              <div className="bg-[var(--red)] text-[var(--on-accent)] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
              <p>{t('radicals_quiz_instructions_3')}</p>
            </div>
            <div className="flex items-start">
              <div className="bg-[var(--red)] text-[var(--on-accent)] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
              <p>{t('radicals_quiz_instructions_4')}</p>
            </div>
          </div>
        </div>

        {/* Botón empezar */}
        <button
          onClick={startQuiz}
          className="w-full bg-[var(--red)] hover:bg-[var(--red-deep)] text-[var(--on-accent)] font-bold py-4 px-6 rounded-xl transition text-lg"
        >
          {t('radicals_start_quiz_button')}
        </button>
        </div>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--paper-hi)] to-[var(--paper)] p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition mb-4"
            >
              <ArrowLeft className="mr-2" />
              {t('radicals_back_to_radicals')}
            </button>
          </div>

          {/* Resultados */}
          <div className="bg-[var(--paper-hi)] rounded-xl p-8 border border-[rgba(28,24,19,0.10)] text-center">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-3xl font-bold text-[var(--ink)] mb-4">{t('radicals_quiz_completed_title')}</h2>

            <div className="bg-[var(--paper-hi2)] rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-[var(--ink)] mb-2">
                {score}/10
              </div>
              <div className="text-[var(--mute)]">
                {score >= 8 ? t('radicals_quiz_meanings_completed_excellent') :
                 score >= 6 ? t('radicals_quiz_meanings_completed_good') :
                 t('radicals_quiz_meanings_completed_practice')}
              </div>
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleRestartQuiz}
                className="bg-[var(--red)] hover:bg-[var(--red-deep)] text-[var(--on-accent)] font-semibold py-3 px-6 rounded-lg transition"
              >
                {t('radicals_retry_button')}
              </button>
              <button
                onClick={goBack}
                className="bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] text-[var(--ink)] font-semibold py-3 px-6 rounded-lg transition"
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
      <div className="min-h-screen bg-gradient-to-br from-[var(--paper-hi)] to-[var(--paper)] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4"></div>
          <h2 className="text-xl font-bold text-[var(--ink)]">{t('radicals_loading_questions')}</h2>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--paper-hi)] to-[var(--paper)] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition mb-4"
          >
            <ArrowLeft className="mr-2" />
            {t('radicals_back_to_radicals')}
          </button>

          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-[var(--ink)]">{t('radicals_meanings_of_radicals_title')}</h1>
            <div className="text-[var(--mute)]">
              {currentQuestion + 1}/10
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-[var(--paper-hi2)] rounded-full h-2">
            <div
              className="bg-[var(--red)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="bg-[var(--paper-hi)] rounded-xl p-8 border border-[rgba(28,24,19,0.10)] mb-6 text-center">
          <h3 className="text-lg text-[var(--mute)] mb-4">{t('radicals_meaning_question_header')}</h3>

          {/* Radical objetivo */}
          <div className="text-8xl font-bold text-[var(--ink)] mb-4 py-4">
            {currentQ.radical}
          </div>

          {/* Pinyin del radical */}
          {currentQ.pinyin && (
            <div className="text-xl text-[var(--mute)] mb-6">
              {currentQ.pinyin}
            </div>
          )}

          <h4 className="text-lg text-[var(--mute)] mb-6">{t('radicals_select_correct_meaning')}</h4>

          {/* Opciones de respuesta */}
          <div className="space-y-3">
            {currentQ.options.map((option) => {
              const isCorrect = option === currentQ.correctAnswer;
              const isSelected = selectedAnswer === option;

              let buttonClass = "bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] border-[rgba(28,24,19,0.18)] text-left";

              if (isAnswered) {
                if (isCorrect) {
                  buttonClass = "bg-[var(--jade)] border-[var(--jade)] text-left";
                } else if (isSelected && !isCorrect) {
                  buttonClass = "bg-[var(--red)] border-[var(--red)] text-left";
                } else {
                  buttonClass = "bg-[var(--paper-hi2)] border-[rgba(28,24,19,0.18)] opacity-50 text-left";
                }
              }

              return (
                <button
                  key={`opt-${option}`}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={isAnswered}
                  className={`${buttonClass} border-2 rounded-xl p-4 text-lg font-semibold text-[var(--ink)] transition disabled:cursor-not-allowed w-full text-center`}
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
            className="w-full bg-[var(--red)] hover:bg-[var(--red-deep)] text-[var(--on-accent)] font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            {currentQuestion < 9 ? t('radicals_next_question_button') : t('radicals_view_results_button')}
          </button>
        )}
      </div>
    </div>
  );
}
