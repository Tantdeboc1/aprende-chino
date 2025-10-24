// src/components/learn/Characters/Matching.jsx
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function pickN(arr, n) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) {
    const i = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

export default function Matching({
  goBack,
  characters = []
}) {
  const { t } = useTranslation();
  const [pairs, setPairs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [incorrectPair, setIncorrectPair] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const init = () => {
    const sample = pickN(characters, Math.min(6, Math.floor(characters.length / 2) || 6));
    const chars = sample.map((c, i) => ({ id: `char-${i}`, type: 'char', content: c.char, match: i, data: c }));
    const meanings = sample.map((c, i) => ({ id: `meaning-${i}`, type: 'meaning', content: c.meaning, match: i, data: c }));
    const all = [...chars, ...meanings].sort(() => Math.random() - 0.5);
    setPairs(all);
    setSelected([]);
    setMatched([]);
    setIncorrectPair(null);
    setShowInstructions(false);
  };

  useEffect(() => {
    if (characters.length >= 6) {
      // Solo inicializar si el usuario ya pasó las instrucciones
      if (!showInstructions) {
        init();
      }
    }
  }, [characters, showInstructions]);

  const handleClick = (item) => {
    if (matched.includes(item.match)) return;

    if (selected.length === 0) {
      setSelected([item]);
      setIncorrectPair(null);
    } else if (selected.length === 1) {
      const first = selected[0];
      if (first.id === item.id) {
        setSelected([]);
        return;
      }

      if (first.match === item.match && first.type !== item.type) {
        // Correcto
        setMatched(m => [...m, item.match]);
        setSelected([]);
        setIncorrectPair(null);
      } else {
        // Incorrecto - mostrar en rojo
        setIncorrectPair({ firstId: first.id, secondId: item.id });
        setTimeout(() => {
          setSelected([]);
          setIncorrectPair(null);
        }, 1000);
      }
    }
  };

  const getCardState = (item) => {
    const isMatched = matched.includes(item.match);
    const isSelected = selected.some(s => s.id === item.id);

    if (isMatched) return 'matched';
    if (incorrectPair && (item.id === incorrectPair.firstId || item.id === incorrectPair.secondId)) {
      return 'incorrect';
    }
    if (isSelected) return 'selected';
    return 'default';
  };

  const done = matched.length && (matched.length === pairs.filter(p => p.type === 'char').length);

  // Pantalla de instrucciones
  if (showInstructions) {
    return (
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-gray-300 hover:text-white transition mb-4"
            >
              ← {t('quiz_back_button')}
            </button>
            <h1 className="text-3xl font-bold text-white text-center">{t('matching_title')}</h1>
            <p className="text-gray-400 text-center">{t('matching_subtitle')}</p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">{t('quiz_instructions_title')}</h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p>{t('matching_instructions_1')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p>{t('matching_instructions_2')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p dangerouslySetInnerHTML={{ __html: t('matching_instructions_3', { 1: '<span class="text-green-400">', '/1': '</span>' }) }} />
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p dangerouslySetInnerHTML={{ __html: t('matching_instructions_4', { 1: '<span class="text-red-400">', '/1': '</span>' }) }} />
              </div>
              <div className="flex items-start">
                <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">5</div>
                <p>{t('matching_instructions_5')}</p>
              </div>
            </div>
          </div>

          <button
            onClick={init}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            🎯 {t('matching_start_button')}
          </button>
        </div>
      </div>
    );
  }

  return (
          <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-5xl mx-auto pt-6">
        <div className="mb-4 flex justify-between items-center">
          <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white transition text-sm">
            ← {t('quiz_back_button')}
          </button>
          <div className="text-center">
            <span className="text-gray-300 font-semibold text-base">
              {t('matching_pairs_header')} {matched.length}/{pairs.length / 2 || 0}
            </span>
            <div className="w-24 bg-gray-700 rounded-full h-1.5 mt-1 mx-auto">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(matched.length / (pairs.length / 2)) * 100 || 0}%` }}
              />
            </div>
          </div>
          <button
            onClick={init}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg transition text-sm"
          >
            {t('matching_reset_button')}
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
          {done ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎊</div>
              <h2 className="text-2xl font-bold text-white mb-2">{t('matching_completed_title')}</h2>
              <p className="text-gray-300 text-lg mb-6">{t('matching_completed_subtitle')}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={init}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition text-base"
                >
                  {t('quiz_play_again_button')}
                </button>
                <button
                  onClick={goBack}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition text-base"
                >
                  {t('quiz_back_button')}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* Columna Caracteres */}
              <div className="space-y-3">
                <h4 className="text-center font-bold text-gray-300 mb-4 text-lg">{t('matching_characters_header')}</h4>
                {pairs.filter(p => p.type === 'char').map((item) => {
                  const state = getCardState(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleClick(item)}
                      disabled={state === 'matched'}
                      className={`
                        w-full p-4 rounded-lg font-semibold transition-all duration-200 min-h-[90px] flex items-center justify-center
                        ${state === 'matched'
                          ? 'bg-green-600 text-white cursor-not-allowed'
                          : state === 'selected'
                          ? 'bg-blue-500 text-white transform scale-105 shadow-lg'
                          : state === 'incorrect'
                          ? 'bg-red-500 text-white animate-pulse shadow-lg'
                          : 'bg-gray-700 hover:bg-gray-600 text-white hover:shadow-md'
                        }
                      `}
                    >
                      <div className="text-4xl font-bold">{item.content}</div>
                    </button>
                  );
                })}
              </div>

              {/* Columna Significados */}
              <div className="space-y-3">
                <h4 className="text-center font-bold text-gray-300 mb-4 text-lg">{t('matching_meanings_header')}</h4>
                {pairs.filter(p => p.type === 'meaning').map((item) => {
                  const state = getCardState(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleClick(item)}
                      disabled={state === 'matched'}
                      className={`
                        w-full p-4 rounded-lg font-semibold transition-all duration-200 min-h-[90px] flex items-center justify-center
                        ${state === 'matched'
                          ? 'bg-green-600 text-white cursor-not-allowed'
                          : state === 'selected'
                          ? 'bg-blue-500 text-white transform scale-105 shadow-lg'
                          : state === 'incorrect'
                          ? 'bg-red-500 text-white animate-pulse shadow-lg'
                          : 'bg-gray-700 hover:bg-gray-600 text-white hover:shadow-md'
                        }
                      `}
                    >
                      <div className="text-base text-center leading-relaxed">{item.content}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
