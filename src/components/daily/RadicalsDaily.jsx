// src/components/daily/RadicalsDaily.jsx
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const TOTAL_QUESTIONS = 10;
const TIME_LIMIT = 150; // 2.5 minutos en segundos

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function RadicalsDaily({ goBack, radicals }) {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const timerRef = useRef(null);

  // Generar preguntas del quiz
  const generateQuestions = () => {
    const questions = [];
    const usedRadicals = new Set();

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      // Seleccionar un radical aleatorio que no se haya usado como RESPUESTA CORRECTA
      let availableRadicals = radicals.filter(r => !usedRadicals.has(r.radical));
      if (availableRadicals.length === 0) {
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

      // Generar opciones incorrectas
      const allPossibleDistractors = radicals
        .filter(r => r.radical !== correctRadical.radical)
        .sort(() => Math.random() - 0.5);

      const otherRadicals = allPossibleDistractors
        .slice(0, Math.min(3, allPossibleDistractors.length))
        .map(r => r.radical);

      // Completar opciones si es necesario
      const neededDistractors = 3 - otherRadicals.length;
      if (neededDistractors > 0) {
        const extraDistractors = allPossibleDistractors
          .slice(3, 3 + neededDistractors)
          .map(r => r.radical);
        otherRadicals.push(...extraDistractors);
      }

      // Garantizar opciones únicas
      const uniqueOptions = [...new Set([correctRadical.radical, ...otherRadicals])];

      while (uniqueOptions.length < 4) {
        const randomRadical = radicals[Math.floor(Math.random() * radicals.length)].radical;
        if (!uniqueOptions.includes(randomRadical)) {
          uniqueOptions.push(randomRadical);
        }
      }

      const allOptions = uniqueOptions.sort(() => Math.random() - 0.5);

      questions.push({
        id: i,
        targetChar: targetChar,
        correctAnswer: correctRadical.radical,
        options: allOptions,
      });
    }

    return questions;
  };

  // Inicializar quiz
  const initQuiz = () => {
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(TIME_LIMIT);
    setQuizFinished(false);
    setQuizStarted(true);
  };

  // Efecto del temporizador
  useEffect(() => {
    if (!quizStarted || quizFinished) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [quizStarted, quizFinished]);

  const handleAnswerSelect = (answer) => {
    if (isAnswered || quizFinished) return;

    setSelectedAnswer(answer);
    setIsAnswered(true);

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      clearInterval(timerRef.current);
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    clearInterval(timerRef.current);
    initQuiz();
  };

  // Pantalla de inicio
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbf5e6] to-[#f4ecdc] p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-[#5b5446] hover:text-[#1c1813] transition mb-4"
            >
              <ArrowLeft className="mr-2" />
              {t('daily_back_to_challenges')}
            </button>
            <h1 className="text-3xl font-bold text-[#1c1813] text-center">{t('daily_radicals_challenge_title')}</h1>
            <p className="text-[#928a76] text-center">{t('radicals_quiz_identification_title')}</p>
          </div>

          <div className="bg-[#fbf5e6] rounded-xl p-6 border border-[rgba(28,24,19,0.10)] mb-6">
            <h2 className="text-xl font-bold text-[#1c1813] mb-4">{t('quiz_instructions_title')}</h2>
            <div className="space-y-3 text-[#5b5446]">
              <div className="flex items-start">
                <div className="bg-[#c8392f] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p>{t('daily_radicals_challenge_instructions_1')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[#c8392f] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p>{t('daily_radicals_challenge_instructions_2')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[#c8392f] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p><strong>{t('daily_radicals_challenge_instructions_3')}</strong></p>
              </div>
              <div className="flex items-start">
                <div className="bg-[#c8392f] text-[#fbf5e6] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>{t('daily_radicals_challenge_instructions_4')}</p>
              </div>
            </div>
          </div>

          <button
            onClick={initQuiz}
            className="w-full bg-[#c8392f] hover:bg-[#8b1f1a] text-[#fbf5e6] font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            {t('daily_start_challenge_button')}
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de resultados
  if (quizFinished) {
    const timeUsed = TIME_LIMIT - timeLeft;
    const minutes = Math.floor(timeUsed / 60);
    const seconds = timeUsed % 60;

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbf5e6] to-[#f4ecdc] p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-[#5b5446] hover:text-[#1c1813] transition mb-4"
            >
              <ArrowLeft className="mr-2" />
              {t('daily_back_to_challenges')}
            </button>
          </div>

          <div className="bg-[#fbf5e6] rounded-xl p-8 border border-[rgba(28,24,19,0.10)] text-center">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-3xl font-bold text-[#1c1813] mb-4">{t('daily_challenge_completed_title')}</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#f8f1de] rounded-lg p-4">
                <div className="text-2xl font-bold text-[#1c1813]">{score}/10</div>
                <div className="text-[#928a76] text-sm">{t('daily_correct_questions_label')}</div>
              </div>
              <div className="bg-[#f8f1de] rounded-lg p-4">
                <div className="text-2xl font-bold text-[#1c1813]">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-[#928a76] text-sm">{t('daily_time_used_label')}</div>
              </div>
            </div>

            <div className="text-[#928a76] mb-6">
              {score === 10 ? t('daily_score_perfect') :
               score >= 7 ? t('daily_score_excellent') :
               score >= 5 ? t('daily_score_good_try') :
               t('daily_score_keep_practicing')}
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleRestart}
                className="bg-[#c8392f] hover:bg-[#8b1f1a] text-[#fbf5e6] font-semibold py-3 px-6 rounded-lg transition"
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

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fbf5e6] to-[#f4ecdc] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4"></div>
          <h2 className="text-xl font-bold text-[#1c1813]">{t('radicals_loading_questions')}</h2>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

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
            {t('daily_back_to_challenges')}
          </button>

          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-[#1c1813]">{t('daily_radicals_challenge_title')}</h1>
            <div className="flex items-center space-x-4">
              <div className="text-[#928a76]">
                {currentQuestion + 1}/10
              </div>
              <div className="flex items-center bg-[#c8392f] text-[#fbf5e6] px-3 py-1 rounded-lg">
                <Clock className="w-4 h-4 mr-2" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-[#f8f1de] rounded-full h-2">
            <div
              className="bg-[#c8392f] h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="bg-[#fbf5e6] rounded-xl p-8 border border-[rgba(28,24,19,0.10)] mb-6 text-center">
          <h3 className="text-lg text-[#928a76] mb-4">{t('radicals_question_header')}</h3>

          {/* Carácter objetivo */}
          <div className="text-8xl font-bold text-[#1c1813] mb-8 py-4">
            {currentQ.targetChar}
          </div>

          <h4 className="text-lg text-[#928a76] mb-6">{t('radicals_select_correct_radical')}</h4>

          {/* Opciones de respuesta */}
          <div className="grid grid-cols-2 gap-4">
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

          {/* Feedback y siguiente */}
          {isAnswered && (
            <div className="mt-6">
              <p className="text-lg mb-3">
                {selectedAnswer === currentQ.correctAnswer ? (
                  <span className="text-[#2f6b4a] font-bold">✓ {t('tones_quiz_correct')} {currentQ.radicalMeaning}</span>
                ) : (
                  <span className="text-[#c8392f] font-bold">✗ {t('tones_quiz_incorrect', { tone: '' })} {currentQ.correctAnswer} - {currentQ.radicalMeaning}</span>
                )}
              </p>
              <button
                onClick={handleNextQuestion}
                className="w-full bg-[#c8392f] hover:bg-[#8b1f1a] text-[#fbf5e6] font-semibold py-3 rounded-lg transition"
              >
                {currentQuestion < 9 ? t('radicals_next_question_button') : t('radicals_view_results_button')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
