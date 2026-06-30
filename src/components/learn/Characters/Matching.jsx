// src/components/learn/Characters/Matching.jsx
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { shuffle } from "@/utils/arrayUtils.js";

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
  characters = [],
  onTrackSeen,
}) {
  const { t } = useTranslation();
  const [pairs, setPairs] = useState([]);
  const [selected, setSelected] = useState([]);
  const [matched, setMatched] = useState([]);
  const [incorrectPair, setIncorrectPair] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const incorrectTimerRef = useRef(null);
  useEffect(() => () => { if (incorrectTimerRef.current) clearTimeout(incorrectTimerRef.current); }, []);

  const init = () => {
    const sample = pickN(characters, Math.min(6, Math.floor(characters.length / 2) || 6));
    const chars = sample.map((c, i) => ({ id: `char-${i}`, type: 'char', content: c.char, match: i, data: c }));
    const meanings = sample.map((c, i) => ({ id: `meaning-${i}`, type: 'meaning', content: c.meaning, match: i, data: c }));
    const all = shuffle([...chars, ...meanings]);
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
        const matchedChar = first.type === 'char' ? first.data : item.data;
        onTrackSeen?.(matchedChar);
      } else {
        // Incorrecto - mostrar en rojo
        setIncorrectPair({ firstId: first.id, secondId: item.id });
        if (incorrectTimerRef.current) clearTimeout(incorrectTimerRef.current);
        incorrectTimerRef.current = setTimeout(() => {
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
      <div className="min-h-screen bg-[var(--paper)] p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition mb-4"
            >
              ← {t('quiz_back_button')}
            </button>
            <h1 className="text-3xl font-bold text-[var(--ink)] text-center">{t('matching_title')}</h1>
            <p className="text-[var(--mute)] text-center">{t('matching_subtitle')}</p>
          </div>

          <div className="bg-[var(--paper-hi)] rounded-xl p-6 border border-[rgba(28,24,19,0.10)] mb-6">
            <h2 className="text-xl font-bold text-[var(--ink)] mb-4">{t('quiz_instructions_title')}</h2>
            <div className="space-y-3 text-[var(--ink-soft)]">
              <div className="flex items-start">
                <div className="bg-[var(--jade)] text-[var(--on-accent)] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">1</div>
                <p>{t('matching_instructions_1')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[var(--jade)] text-[var(--on-accent)] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">2</div>
                <p>{t('matching_instructions_2')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[var(--jade)] text-[var(--on-accent)] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">3</div>
                <p>{t('matching_instructions_3').replace(/<\/?1>/g, '')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[var(--jade)] text-[var(--on-accent)] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">4</div>
                <p>{t('matching_instructions_4').replace(/<\/?1>/g, '')}</p>
              </div>
              <div className="flex items-start">
                <div className="bg-[var(--jade)] text-[var(--on-accent)] rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1">5</div>
                <p>{t('matching_instructions_5')}</p>
              </div>
            </div>
          </div>

          <button
            onClick={init}
            className="w-full bg-[var(--jade)] hover:bg-[var(--jade-deep)] text-[var(--on-accent)] font-bold py-4 px-6 rounded-xl transition text-lg"
          >
            {t('matching_start_button')}
          </button>
        </div>
      </div>
    );
  }

  return (
          <div className="min-h-screen bg-[var(--paper)] p-4">
      <div className="max-w-5xl mx-auto pt-6">
        <div className="mb-4 flex justify-between items-center">
          <button onClick={goBack} className="flex items-center text-[var(--ink-soft)] hover:text-[var(--ink)] transition text-sm">
            ← {t('quiz_back_button')}
          </button>
          <div className="text-center">
            <span className="text-[var(--ink-soft)] font-semibold text-base">
              {t('matching_pairs_header')} {matched.length}/{pairs.length / 2 || 0}
            </span>
            <div className="w-24 bg-[var(--paper-hi2)] rounded-full h-1.5 mt-1 mx-auto">
              <div
                className="bg-[var(--jade)] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(matched.length / (pairs.length / 2)) * 100 || 0}%` }}
              />
            </div>
          </div>
          <button
            onClick={init}
            className="bg-[var(--jade)] hover:bg-[var(--jade-deep)] text-[var(--on-accent)] font-semibold py-1.5 px-3 rounded-lg transition text-sm"
          >
            {t('matching_reset_button')}
          </button>
        </div>

        <div className="bg-[var(--paper-hi)] rounded-xl shadow-sm p-6 border border-[rgba(28,24,19,0.10)]">
          {done ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4"></div>
              <h2 className="text-2xl font-bold text-[var(--ink)] mb-2">{t('matching_completed_title')}</h2>
              <p className="text-[var(--ink-soft)] text-lg mb-6">{t('matching_completed_subtitle')}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={init}
                  className="bg-[var(--jade)] hover:bg-[var(--jade-deep)] text-[var(--on-accent)] font-semibold py-2 px-6 rounded-lg transition text-base"
                >
                  {t('quiz_play_again_button')}
                </button>
                <button
                  onClick={goBack}
                  className="bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] text-[var(--ink)] font-semibold py-2 px-6 rounded-lg transition text-base border border-[rgba(28,24,19,0.10)]"
                >
                  {t('quiz_back_button')}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {/* Columna Caracteres */}
              <div className="space-y-3">
                <h4 className="text-center font-bold text-[var(--ink-soft)] mb-4 text-lg">{t('matching_characters_header')}</h4>
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
                          ? 'bg-[var(--jade)] text-[var(--on-accent)] cursor-not-allowed opacity-70'
                          : state === 'selected'
                          ? 'bg-[var(--jade)] text-[var(--on-accent)] transform scale-105 shadow-md'
                          : state === 'incorrect'
                          ? 'bg-[var(--red)] text-[var(--on-accent)] animate-pulse shadow-md'
                          : 'bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] text-[var(--ink)] hover:shadow-md'
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
                <h4 className="text-center font-bold text-[var(--ink-soft)] mb-4 text-lg">{t('matching_meanings_header')}</h4>
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
                          ? 'bg-[var(--jade)] text-[var(--on-accent)] cursor-not-allowed opacity-70'
                          : state === 'selected'
                          ? 'bg-[var(--jade)] text-[var(--on-accent)] transform scale-105 shadow-md'
                          : state === 'incorrect'
                          ? 'bg-[var(--red)] text-[var(--on-accent)] animate-pulse shadow-md'
                          : 'bg-[var(--paper-hi2)] hover:bg-[var(--mute2)] text-[var(--ink)] hover:shadow-md'
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
