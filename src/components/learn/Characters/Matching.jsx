// src/components/learn/Characters/Matching.jsx
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

export default function Matching({
  goBack,
  characters = []
}) {
  const [pairs, setPairs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [incorrectPair, setIncorrectPair] = useState(null);

  const init = () => {
    const sample = pickN(characters, Math.min(6, Math.floor(characters.length / 2) || 6));
    const chars = sample.map((c, i) => ({ id: `char-${i}`, type: 'char', content: c.char, match: i, data: c }));
    const meanings = sample.map((c, i) => ({ id: `meaning-${i}`, type: 'meaning', content: c.meaning, match: i, data: c }));
    const all = [...chars, ...meanings].sort(() => Math.random() - 0.5);
    setPairs(all);
    setSelected([]);
    setMatched([]);
    setIncorrectPair(null);
  };

  useEffect(() => {
    if (characters.length >= 6) init();
  }, [characters]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 p-4">
      <div className="max-w-5xl mx-auto pt-6">
        <div className="mb-4 flex justify-between items-center">
          <button onClick={goBack} className="flex items-center text-gray-300 hover:text-white transition text-sm">
            ← Volver a Caracteres
          </button>
          <div className="text-center">
            <span className="text-gray-300 font-semibold text-base">
              Parejas: {matched.length}/{pairs.length / 2 || 0}
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
            Reiniciar
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-700">
          {done ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎊</div>
              <h2 className="text-2xl font-bold text-white mb-2">¡Perfecto!</h2>
              <p className="text-gray-300 text-lg mb-6">Has relacionado todas las parejas correctamente</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={init}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition text-base"
                >
                  Jugar de nuevo
                </button>
                <button
                  onClick={goBack}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition text-base"
                >
                  Volver
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* Columna Caracteres */}
              <div className="space-y-3">
                <h4 className="text-center font-bold text-gray-300 mb-4 text-lg">Caracteres 汉字</h4>
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
                <h4 className="text-center font-bold text-gray-300 mb-4 text-lg">Significados</h4>
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