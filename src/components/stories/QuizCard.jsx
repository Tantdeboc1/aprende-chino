// src/components/stories/QuizCard.jsx
// Tarjeta base reutilizable para los 3 bloques de ejercicios.
// Muestra: prompt principal (+ opcional subprompt) + 4 opciones.
// Cuando el usuario pulsa una opción → feedback visual (verde/rojo) y avance.

import { useState, useEffect, useMemo } from 'react';
import { J } from '@/styles/tokens';

const FEEDBACK_MS = 1100;

// Fisher–Yates: devuelve [shuffledOptions, nuevoIndiceCorrecto].
// Determinístico para un par (options, correcta) gracias al useMemo en el componente.
function shuffleOptions(options, correcta) {
  const arr = options.map((opt, i) => ({ opt, originalIdx: i }));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  const newCorrecta = arr.findIndex(x => x.originalIdx === correcta);
  return [arr.map(x => x.opt), newCorrecta];
}

export default function QuizCard({
  prompt,              // string o JSX — pregunta principal (puede contener chino)
  subprompt,           // string opcional — pinyin/traducción/contexto
  options,             // array de strings
  correcta,            // índice de la opción correcta
  onAnswer,            // callback(boolean) tras feedback
  variant = 'normal',  // 'chinese' para opciones grandes en chino, 'normal' para texto en español
}) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;

  // Baraja una sola vez por pregunta. Como ExerciseBlock pasa key={blockIdx-qIdx},
  // el componente se desmonta entre preguntas y el useMemo se reinicializa.
  const [shuffledOptions, shuffledCorrecta] = useMemo(
    () => shuffleOptions(options, correcta),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Resetea al cambiar de pregunta (por si no hay remount)
  useEffect(() => { setSelected(null); }, [prompt]);

  useEffect(() => {
    if (!answered) return;
    const t = setTimeout(() => onAnswer(selected === shuffledCorrecta), FEEDBACK_MS);
    return () => clearTimeout(t);
  }, [answered, selected, shuffledCorrecta, onAnswer]);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: 460,
      margin: '0 auto',
      background: 'rgba(20,16,12,0.82)',
      borderRadius: 20,
      border: `1px solid ${J.hairS}`,
      padding: '22px 22px 18px',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      color: J.paperHi,
    }}>
      <div style={{ marginBottom: 16 }}>
        <div className="font-cn" style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.35 }}>
          {prompt}
        </div>
        {subprompt && (
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginTop: 4, fontStyle: 'italic' }}>
            {subprompt}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        {shuffledOptions.map((opt, idx) => {
          const isSelected = selected === idx;
          const isCorrect = idx === shuffledCorrecta;
          let bg = 'rgba(255,255,255,0.06)';
          let border = 'rgba(255,255,255,0.12)';
          let color = J.paperHi;
          if (answered) {
            if (isCorrect) {
              bg = J.jade; border = J.jadeDeep; color = J.paperHi;
            } else if (isSelected) {
              bg = J.red; border = J.redDeep; color = J.paperHi;
            } else {
              bg = 'rgba(255,255,255,0.03)'; color = 'rgba(255,255,255,0.4)';
            }
          }
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={answered}
              className={variant === 'chinese' ? 'font-cn' : ''}
              style={{
                background: bg,
                border: `1.5px solid ${border}`,
                color,
                borderRadius: 12,
                padding: variant === 'chinese' ? '14px 14px' : '12px 14px',
                fontSize: variant === 'chinese' ? 20 : 14,
                fontWeight: 600,
                cursor: answered ? 'default' : 'pointer',
                textAlign: 'left',
                transition: 'background 250ms ease, border 250ms ease, color 250ms ease',
              }}
            >
              {opt}
              {answered && isCorrect && (
                <span style={{ float: 'right', fontWeight: 700 }}>✓</span>
              )}
              {answered && isSelected && !isCorrect && (
                <span style={{ float: 'right', fontWeight: 700 }}>✗</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
