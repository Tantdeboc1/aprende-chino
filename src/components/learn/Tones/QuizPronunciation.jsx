import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { playAudioSmart } from "../../../utils/audio";
import { useTranslation } from "react-i18next";

/**
 * Quiz de pronunciación (consonantes y vocales)
 * - Botón grande "Escuchar" (no se muestra pinyin/hanzi)
 * - 10 preguntas, 4 opciones
 * - Intenta reproducir MP3 reales buscando variantes comunes en tu manifest.
 * - Si no encuentra MP3, hace fallback a TTS para no dejar en silencio.
 */

const DATA = {
  consonants: ["b","p","m","f","d","t","n","l","g","k","h","j","q","x","zh","ch","sh","r","z","c","s"],
  vowels: ["a","o","e","i","u","ü"],
};

const MAX_Q = 10;

// Utilidad
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(a){ return a.map(x=>[Math.random(),x]).sort((u,v)=>u[0]-v[0]).map(x=>x[1]); }

/**
 * Para cada objetivo (ej. "b" o "a") generamos una lista de candidatos de audio
 * que es probable que existan en tus mp3 (ba1, bai1, bei1, bao1, ban1, …).
 * También probamos variantes sin tono (ba, bai, …) por si tus ficheros no incluyen número.
 */
function candidatesForAudio(target){
  const toneNums = ["1","2","3","4"];
  const withTones = (bases) => bases.flatMap(b => [b+"1", b+"2", b+"3", b+"4"]);

  // Palatales y retroflejas con sílaba típica
  const plains = {
    zh: ["zhi","zhu","zhao","zhe"],
    ch: ["chi","chu","chao","che"],
    sh: ["shi","shu","shao","she"],
    r:  ["ri","ru","ran","ren"],
    z:  ["zi","zu","zao","ze"],
    c:  ["ci","cu","cao","ce"],
    s:  ["si","su","sao","se"],
    j:  ["ji","ju","jia","jie","jin","jing","jiong"],
    q:  ["qi","qu","qia","qie","qin","qing","qiong"],
    x:  ["xi","xu","xia","xie","xin","xing","xiong"],
    g:  ["ge","gu","ga","gai","gei","gan","gang","gong"],
    k:  ["ke","ku","ka","kai","kei","kan","kang","kong"],
    h:  ["he","hu","ha","hai","hei","han","hang","hong"],
    b:  ["ba","bo","bai","bei","ban","bang","bing","bu"],
    p:  ["pa","po","pai","pei","pan","pang","ping","pu"],
    m:  ["ma","mo","mai","mei","man","mang","ming","mu"],
    f:  ["fa","fo","fei","fan","fang","feng","fu"],
    d:  ["da","de","di","du","dai","dei","dan","dang","dong"],
    t:  ["ta","te","ti","tu","tai","tei","tan","tang","tong"],
    n:  ["na","ne","ni","nu","nai","nei","nan","nang","nong","nü","nue","niu"],
    l:  ["la","le","li","lu","lai","lei","lan","lang","long","lü","lüe","liu"],
  };

  if (plains[target]) {
    const bases = plains[target];
    return [...withTones(bases), ...bases]; // prueba con y sin tono
  }

  // Vocales
  if (target === "a") {
    const bases = ["a","ba","ma","la"];
    return [...withTones(bases), ...bases];
  }
  if (target === "o") {
    const bases = ["o","bo","mo","wo"];
    return [...withTones(bases), ...bases];
  }
  if (target === "e") {
    const bases = ["e","me","de","he"];
    return [...withTones(bases), ...bases];
  }
  if (target === "i") {
    const bases = ["yi","li","mi","ni","di"];
    return [...withTones(bases), ...bases];
  }
  if (target === "u") {
    const bases = ["wu","lu","mu","tu","gu"];
    return [...withTones(bases), ...bases];
  }
  if (target === "ü") {
    // En ficheros suele usarse 'v' para 'ü'
    const bases = ["yu","yue","yuan","yin","yun","ying","lv","nü","lü"];
    // convertir a variantes con 'v'
    const normalized = bases.map(b => b.replace("ü","v").replace("lü","lv").replace("nü","nv"));
    return [...withTones(normalized), ...normalized];
  }

  // fallback genérico: intenta la propia letra y algunas sílabas comunes
  const bases = [target, target+"a", target+"o", target+"e", target+"i", target+"u"];
  return [...withTones(bases), ...bases];
}

function buildQuiz() {
  const quiz = [];
  const all = [...DATA.consonants, ...DATA.vowels];
  for (let i = 0; i < MAX_Q; i++) {
    const correct = pick(all);
    const isVowel = DATA.vowels.includes(correct);
    const pool = isVowel ? DATA.vowels : DATA.consonants;
    let opts = [correct];
    while (opts.length < 4) {
      const c = pick(pool);
      if (!opts.includes(c)) opts.push(c);
    }
    quiz.push({ correct, options: shuffle(opts), isVowel });
  }
  return quiz;
}

export default function QuizPronunciation({ goBack }) {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const initQuiz = () => {
    setQuestions(buildQuiz());
    setIdx(0);
    setScore(0);
    setSelected(null);
    setShowResult(false);
    setPlaying(false);
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
              {t('tones_back_to_pronunciation')}
            </button>
            <h1 className="text-3xl font-bold text-white text-center">{t('tones_pronunciation_quiz_title')}</h1>
            <p className="text-gray-400 text-center">{t('tones_quiz_auditory_identification')}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('quiz_instructions_title')}</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p>{t('tones_pronunciation_quiz_instructions_1')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p>{t('tones_pronunciation_quiz_instructions_2')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p><strong>{t('tones_pronunciation_quiz_instructions_3')}</strong></p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>{t('tones_pronunciation_quiz_instructions_4')}</p>
              </div>
            </div>
          </div>

          <button
            onClick={initQuiz}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            🎵 {t('radicals_start_quiz_button')}
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) return null;
  const q = questions[idx];

  const listen = async () => {
    if (playing) return;
    setPlaying(true);
    const candidates = candidatesForAudio(q.correct);
    let played = false;
    for (const key of candidates) {
      // intenta MP3; si no, sigue probando
      const ok = await playAudioSmart("pronunciation", key, /*fallback*/ null);
      if (ok) { played = true; break; }
    }
    if (!played) {
      // Último recurso: TTS del "correct" (no ideal, pero evita silencio total)
      await playAudioSmart("pronunciation", q.correct, q.correct);
    }
    setPlaying(false);
  };

  const answer = (opt) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    if (opt === q.correct) setScore(s => s + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) { setIdx(idx + 1); return; }
    setIdx(idx + 1);
    setSelected(null);
    setShowResult(false);
  };

  // Fin del quiz
  if (idx >= questions.length) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-700">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">{t('tones_quiz_completed_pronunciation_title')}</h2>
          <p className="text-5xl font-bold text-red-400 mb-6">{score}/{questions.length}</p>
          <div className="flex gap-3">
            <button
              onClick={initQuiz}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
            >{t('tones_play_again_button')}</button>
            <button onClick={goBack} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition">{t('radicals_back_button')}</button>
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
            {t('tones_back_to_pronunciation')}
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
          <h2 className="text-2xl font-bold text-white mb-4">{t('tones_what_sound_do_you_hear')}</h2>
          <p className="text-gray-300 mb-6">{t('tones_pronunciation_quiz_prompt')}</p>

          <button onClick={listen} disabled={playing} className="mx-auto mb-8 px-8 py-5 rounded-xl bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white text-xl font-bold shadow-lg transition">
            🔊 {t('tones_listen_button')}
          </button>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {q.options.map(opt => {
              const isCorrect = showResult && opt === q.correct;
              const isWrong = showResult && selected === opt && opt !== q.correct;
              const base = "p-4 rounded-lg text-lg font-semibold transition";
              let cls = "bg-gray-700 hover:bg-gray-600 text-white";
              if (showResult) {
                if (isCorrect) cls = "bg-green-500 text-white";
                else if (isWrong) cls = "bg-red-500 text-white";
                else cls = "bg-gray-600 text-gray-400";
              }
              return (
                <button key={opt} onClick={() => answer(opt)} disabled={showResult} className={base + ' ' + cls}>
                  {opt}
                </button>
              );
            })}
          </div>

          {showResult && (
            <button onClick={next} className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition">
              {idx + 1 >= questions.length ? t('radicals_view_results_button') : t('radicals_next_question_button')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
