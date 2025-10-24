// src/components/daily/TonosDaily.jsx
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Clock, Volume2 } from "lucide-react";
import { useTranslation } from "react-i18next";

// Mismo banco de tonos que el QuizTone
const TONE_BANK = [
  { base: "ma", label: "ma" },
  { base: "ba", label: "ba" },
  { base: "da", label: "da" },
  { base: "di", label: "di" },
  { base: "ji", label: "ji" },
  { base: "qi", label: "qi" },
  { base: "li", label: "li" },
  { base: "ni", label: "ni" },
  { base: "shi", label: "shi" },
  { base: "zhu", label: "zhu" },
  { base: "guo", label: "guo" },
  { base: "hao", label: "hao" },
];

const TOTAL_QUESTIONS = 10;
const TIME_LIMIT = 120; // 2 minutos en segundos
const TONE_OPTIONS = [
  { num: 1, label: "Primer tono ˉ" },
  { num: 2, label: "Segundo tono ˊ" },
  { num: 3, label: "Tercer tono ˇ" },
  { num: 4, label: "Cuarto tono ˋ" },
];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildQuiz(n = TOTAL_QUESTIONS) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const item = rand(TONE_BANK);
    const tone = 1 + Math.floor(Math.random() * 4);
    const pinyinToSpeak = `${item.base}${tone}`;
    out.push({
      base: item.base,
      tone,
      pinyinToSpeak
    });
  }
  return out;
}

export default function TonesDaily({ goBack, speakChinese }) {
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

  // Inicializar quiz
  const initQuiz = () => {
    setQuestions(buildQuiz(TOTAL_QUESTIONS));
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

  const handleAnswerSelect = (toneNum) => {
    if (isAnswered || quizFinished) return;

    setSelectedAnswer(toneNum);
    setIsAnswered(true);

    if (toneNum === questions[currentQuestion].tone) {
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

  const listen = () => {
    if (!questions[currentQuestion]) return;
    console.log('🔊 TonesDaily - Reproduciendo:', questions[currentQuestion].pinyinToSpeak);
    if (typeof speakChinese === 'function') {
      speakChinese(questions[currentQuestion].pinyinToSpeak, { category: 'pronunciation' });
    }
  };

  // Pantalla de inicio
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-300 hover:text-white transition mb-4"
            >
              <ArrowLeft className="mr-2" />
              {t('daily_back_to_challenges')}
            </button>
            <h1 className="text-3xl font-bold text-white text-center">{t('daily_tones_challenge_title')}</h1>
            <p className="text-gray-400 text-center">{t('tones_quiz_auditory_identification')}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('quiz_instructions_title')}</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p>{t('daily_tones_challenge_instructions_1')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p>{t('daily_tones_challenge_instructions_2')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p><strong>{t('daily_tones_challenge_instructions_3')}</strong></p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>{t('daily_tones_challenge_instructions_4')}</p>
              </div>
            </div>
          </div>

          <button
            onClick={initQuiz}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            🎵 {t('daily_start_challenge_button')}
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
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-300 hover:text-white transition mb-4"
            >
              <ArrowLeft className="mr-2" />
              {t('daily_back_to_challenges')}
            </button>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-3xl font-bold text-white mb-4">{t('daily_challenge_completed_title')}</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">{score}/10</div>
                <div className="text-gray-400 text-sm">{t('daily_correct_questions_label')}</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-gray-400 text-sm">{t('daily_time_used_label')}</div>
              </div>
            </div>

            <div className="text-gray-400 mb-6">
              {score === 10 ? t('daily_score_perfect') :
               score >= 7 ? t('daily_score_excellent') :
               score >= 5 ? t('daily_score_good_try') :
               t('daily_score_keep_practicing')}
            </div>

            <div className="flex space-x-4 justify-center">
              <button
                onClick={handleRestart}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                🔄 {t('radicals_retry_button')}
              </button>
              <button
                onClick={goBack}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-white">{t('radicals_loading_questions')}</h2>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

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
            {t('daily_back_to_challenges')}
          </button>

          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-white">{t('daily_tones_challenge_title')}</h1>
            <div className="flex items-center space-x-4">
              <div className="text-gray-400">
                {currentQuestion + 1}/10
              </div>
              <div className="flex items-center bg-red-600 text-white px-3 py-1 rounded-lg">
                <Clock className="w-4 h-4 mr-2" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Pregunta */}
        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-6 text-center">
          <h3 className="text-lg text-gray-400 mb-4">{t('tones_what_tone_do_you_hear')}</h3>

          {/* Botón de escuchar */}
          <button
            onClick={listen}
            className="mx-auto mb-8 px-8 py-5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xl font-bold shadow-lg transition transform hover:scale-105 flex items-center"
          >
            <Volume2 className="mr-3 w-6 h-6" />
            🔊 {t('tones_listen_button')}
          </button>

          <h4 className="text-lg text-gray-400 mb-6">{t('radicals_select_correct_radical')}</h4>

          {/* Opciones de respuesta */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {TONE_OPTIONS.map(opt => {
              const isCorrect = isAnswered && opt.num === currentQ.tone;
              const isWrong = isAnswered && selectedAnswer === opt.num && selectedAnswer !== currentQ.tone;

              let buttonClass = "bg-gray-700 hover:bg-gray-600 border-gray-600";

              if (isAnswered) {
                if (isCorrect) {
                  buttonClass = "bg-green-500 border-green-500";
                } else if (isWrong) {
                  buttonClass = "bg-red-500 border-red-500";
                } else {
                  buttonClass = "bg-gray-600 border-gray-600 opacity-50";
                }
              }

              return (
                <button
                  key={opt.num}
                  onClick={() => handleAnswerSelect(opt.num)}
                  disabled={isAnswered}
                  className={`${buttonClass} border-2 rounded-xl p-4 text-lg font-semibold text-white transition disabled:cursor-not-allowed`}
                >
                  {t(`tones_tone_option_${opt.num}`)}
                </button>
              );
            })}
          </div>

          {/* Feedback y siguiente */}
          {isAnswered && (
            <div className="mt-6">
              <p className="text-lg mb-3">
                {selectedAnswer === currentQ.tone ? (
                  <span className="text-green-400 font-bold">{t('tones_quiz_correct')}</span>
                ) : (
                  <span className="text-red-400 font-bold">{t('tones_quiz_incorrect', { tone: currentQ.tone })}</span>
                )}
              </p>
              <button
                onClick={handleNextQuestion}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
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
