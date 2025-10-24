import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Quiz de tonos (audio-only)
 * CORREGIDO: Envía pinyin con número de tono directamente (ma1, ma2, etc.)
 */

// 🔥 CORRECCIÓN: Usar bases que existen en el manifest
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

const MAX_Q = 10;
const TONE_OPTIONS = [
  { num: 1, label: "Primer tono ˉ" },
  { num: 2, label: "Segundo tono ˊ" },
  { num: 3, label: "Tercer tono ˇ" },
  { num: 4, label: "Cuarto tono ˋ" },
];

function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildQuiz(n = MAX_Q) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const item = rand(TONE_BANK);
    const tone = 1 + Math.floor(Math.random() * 4);
    // 🔥 CORRECCIÓN: Construir pinyin con tono (ma1, ba2, etc.)
    const pinyinToSpeak = `${item.base}${tone}`;
    out.push({
      base: item.base,
      tone,
      pinyinToSpeak
    });
  }
  return out;
}

export default function QuizTone({ goBack, speakChinese }) {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const initQuiz = () => {
    setQuestions(buildQuiz(MAX_Q));
    setIdx(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setQuizStarted(true);
  };

  // PANTALLA DE INSTRUCCIONES
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-300 hover:text-white transition mb-4"
            >
              <ArrowLeft className="mr-2" />
              {t('tones_back_to_tones')}
            </button>
            <h1 className="text-3xl font-bold text-white text-center">{t('tones_quiz_title')}</h1>
            <p className="text-gray-400 text-center">{t('tones_quiz_auditory_identification')}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('quiz_instructions_title')}</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p>{t('tones_quiz_instructions_1')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p>{t('tones_quiz_instructions_2')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p><strong>{t('tones_quiz_instructions_3')}</strong></p>
              </div>
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>{t('tones_quiz_instructions_4')}</p>
              </div>
            </div>
          </div>

          <button
            onClick={initQuiz}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            🎵 {t('radicals_start_quiz_button')}
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gray-900 p-4 flex items-center justify-center">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-700">
          <p className="text-gray-300 mb-6">{t('tones_quiz_loading')}</p>
          <button onClick={goBack} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition">
            {t('radicals_back_button')}
          </button>
        </div>
      </div>
    );
  }

  const q = questions[idx];

  const listen = () => {
    console.log('🔊 QuizTone - Reproduciendo:', q.pinyinToSpeak);
    if (typeof speakChinese === 'function') {
      speakChinese(q.pinyinToSpeak, { category: 'pronunciation' });
    }
  };

  const answer = (toneNum) => {
    if (showResult) return;
    setSelected(toneNum);
    setShowResult(true);
    if (toneNum === q.tone) setScore(s => s + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) return setIdx(idx + 1);
    setIdx(idx + 1);
    setSelected(null);
    setShowResult(false);
  };

  if (idx >= questions.length) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-700">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">{t('tones_quiz_completed_title')}</h2>
          <p className="text-5xl font-bold text-red-400 mb-6">{score}/{questions.length}</p>
          <p className="text-gray-300 mb-6">
            {score === questions.length ? t('tones_quiz_completed_perfect') :
             score >= questions.length * 0.7 ? t('tones_quiz_completed_very_good') :
             t('tones_quiz_completed_keep_practicing')}
          </p>
          <div className="flex gap-3">
            <button
              onClick={initQuiz}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
            >
              {t('tones_play_again_button')}
            </button>
            <button
              onClick={goBack}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition"
            >
              {t('radicals_back_button')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-6 flex justify-between items-center">
          <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white text-sm">
            <ArrowLeft className="mr-2" />
            {t('tones_back_to_tones')}
          </button>

          <div className="text-center">
            <span className="text-gray-300 font-semibold text-base block">
              {idx + 1}/{questions.length} | {t('quiz_score_label', { score })}
            </span>
            {/* Barra de progreso */}
            <div className="w-32 bg-gray-700 rounded-full h-1.5 mt-1 mx-auto">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Botón de reiniciar */}
          <button
            onClick={initQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg transition text-sm"
          >
            {t('matching_reset_button')}
          </button>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">{t('tones_what_tone_do_you_hear')}</h2>
          <p className="text-gray-300 mb-6">
            {t('tones_quiz_prompt')}
          </p>

          <button
            onClick={listen}
            className="mx-auto mb-8 px-8 py-5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xl font-bold shadow-lg transition transform hover:scale-105"
          >
            🔊 {t('tones_listen_button')}
          </button>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {TONE_OPTIONS.map(opt => {
              const isCorrect = showResult && opt.num === q.tone;
              const isWrong = showResult && selected === opt.num && selected !== q.tone;
              const base = "p-4 rounded-lg text-lg font-semibold transition";
              let cls = "bg-gray-700 hover:bg-gray-600 text-white";
              if (showResult) {
                if (isCorrect) cls = "bg-green-500 text-white";
                else if (isWrong) cls = "bg-red-500 text-white";
                else cls = "bg-gray-600 text-gray-400";
              }
              return (
                <button
                  key={opt.num}
                  onClick={() => answer(opt.num)}
                  disabled={showResult}
                  className={`${base} ${cls}`}
                >
                  {t(`tones_tone_option_${opt.num}`)}
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className="mt-6">
              <p className="text-lg mb-3">
                {selected === q.tone ? (
                  <span className="text-green-400 font-bold">{t('tones_quiz_correct')}</span>
                ) : (
                  <span className="text-red-400 font-bold">{t('tones_quiz_incorrect', { tone: q.tone })}</span>
                )}
              </p>
              <button
                onClick={next}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
              >
                {idx + 1 >= questions.length ? t('radicals_view_results_button') : t('radicals_next_question_button')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
