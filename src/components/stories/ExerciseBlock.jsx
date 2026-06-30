// src/components/stories/ExerciseBlock.jsx
// Orquesta los 3 bloques de ejercicios en orden (traducción → completar →
// comprensión), trackea puntuación y avisa al padre al terminar.

import { useState, useEffect, useRef } from 'react';
import { J } from '@/styles/tokens';
import ExTranslation from './ExTranslation.jsx';
import ExFillBlank from './ExFillBlank.jsx';
import ExComprehension from './ExComprehension.jsx';
import CharacterDisplay from './CharacterDisplay.jsx';

export default function ExerciseBlock({ ejercicios, onComplete, presentador }) {
  const blocks = [
    {
      key: 'traduccion',
      label: 'Traducción',
      sub: '翻译 · Elige la traducción correcta',
      Component: ExTranslation,
      items: ejercicios.traduccion || [],
    },
    {
      key: 'completar',
      label: 'Completa la frase',
      sub: '填空 · Elige el carácter correcto',
      Component: ExFillBlank,
      items: ejercicios.completar || [],
    },
    {
      key: 'comprension',
      label: 'Comprensión',
      sub: '阅读 · ¿Qué pasó en la historia?',
      Component: ExComprehension,
      items: ejercicios.comprension || [],
    },
  ].filter(b => b.items.length > 0);

  const [blockIdx, setBlockIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showingTransition, setShowingTransition] = useState(true);

  const totalQuestions = blocks.reduce((s, b) => s + b.items.length, 0);
  const currentBlock = blocks[blockIdx];
  const currentItem = currentBlock?.items[qIdx];
  const answeredSoFar = blocks.slice(0, blockIdx).reduce((s, b) => s + b.items.length, 0) + qIdx;

  const handleAnswer = (correct) => {
    const newScore = score + (correct ? 1 : 0);
    setScore(newScore);

    if (qIdx + 1 < currentBlock.items.length) {
      setQIdx(qIdx + 1);
    } else if (blockIdx + 1 < blocks.length) {
      setBlockIdx(blockIdx + 1);
      setQIdx(0);
      setShowingTransition(true);
    } else {
      onComplete(newScore, totalQuestions);
    }
  };

  // Sin ejercicios definidos: terminamos con 0/0. Se hace en un efecto (no
  // durante el render) para no llamar al setState del padre en pleno render.
  // El ref evita disparar onComplete más de una vez.
  const completedRef = useRef(false);
  useEffect(() => {
    if (!currentBlock && !completedRef.current) {
      completedRef.current = true;
      onComplete(0, 0);
    }
  }, [currentBlock, onComplete]);

  if (!currentBlock) return null;

  // Pantalla de transición entre bloques (incluye intro)
  if (showingTransition) {
    return (
      <div style={containerStyle}>
        <ProgressBar current={answeredSoFar} total={totalQuestions} />
        <div style={{
          maxWidth: 420, width: '100%', margin: '0 auto',
          background: 'rgba(20,16,12,0.82)', borderRadius: 20,
          border: `1px solid ${J.hairS}`, padding: '28px 24px',
          textAlign: 'center', color: J.onAccent,
        }}>
          <p style={{ fontSize: 11, letterSpacing: '0.18em', color: J.butter, fontWeight: 700, margin: 0 }}>
            BLOQUE {blockIdx + 1} / {blocks.length}
          </p>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '8px 0 4px' }}>
            {currentBlock.label}
          </h2>
          <p className="font-cn" style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
            {currentBlock.sub}
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 12 }}>
            {currentBlock.items.length} pregunta{currentBlock.items.length === 1 ? '' : 's'}
          </p>
          <button
            onClick={() => setShowingTransition(false)}
            style={{
              marginTop: 22, width: '100%',
              background: J.red, color: J.onAccent,
              border: 0, borderRadius: 14,
              padding: '13px 18px', fontSize: 15, fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 6px 18px -8px rgba(200,57,47,0.6)',
            }}
          >
            Empezar →
          </button>
        </div>
      </div>
    );
  }

  const { Component } = currentBlock;
  return (
    <div style={containerStyle}>
      <ProgressBar current={answeredSoFar} total={totalQuestions} />
      <div style={{
        textAlign: 'center', color: 'rgba(255,255,255,0.55)',
        fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
        marginBottom: 10, fontWeight: 700,
      }}>
        {currentBlock.label} · {qIdx + 1} / {currentBlock.items.length}
      </div>

      {/* Presentador decorativo detrás del cuadro de pregunta */}
      {presentador && (
        <div style={{
          position: 'absolute',
          left: 0, right: 0,
          bottom: 18,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <CharacterDisplay
            character={presentador}
            expresion="normal"
            variant="decor"
          />
        </div>
      )}

      {/* Cuadro de pregunta — por encima del personaje */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Component key={`${blockIdx}-${qIdx}`} item={currentItem} onAnswer={handleAnswer} />
      </div>
    </div>
  );
}

const containerStyle = {
  position: 'relative', // contiene al presentador (absolute)
  flex: '1 1 auto',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  padding: '20px 16px 40px',
  overflow: 'hidden',
};

function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div style={{ maxWidth: 460, width: '100%', margin: '0 auto 4px' }}>
      <div style={{
        height: 5, background: 'rgba(255,255,255,0.12)',
        borderRadius: 99, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: J.butter,
          transition: 'width 360ms ease-out',
        }} />
      </div>
    </div>
  );
}
