// src/components/stories/StoryPlayer.jsx
// Motor principal del diálogo: avanza escenas, muestra el personaje hablante
// y la caja de diálogo. Al terminar llama a onFinish (los ejercicios y la
// pantalla de resultados se conectarán en Fase 2).

import { useMemo, useState, useEffect } from 'react';
import { J } from '@/styles/tokens';
import { getCharacter } from '@/data/characters.js';
import CharacterDisplay from './CharacterDisplay.jsx';
import DialogueBox from './DialogueBox.jsx';
import SceneBackground from './SceneBackground.jsx';
import ExerciseBlock from './ExerciseBlock.jsx';
import StoryResults from './StoryResults.jsx';
import { STORAGE_KEYS } from '@/utils/storageKeys.js';

const LS_DIFFICULTY = STORAGE_KEYS.STORY_DIFFICULTY;
const DIFFICULTIES = [
  { id: 'facil',   label: 'Fácil',   desc: 'Chino + pinyin siempre visibles' },
  { id: 'normal',  label: 'Normal',  desc: 'Pinyin se revela al tocar' },
  { id: 'dificil', label: 'Difícil', desc: 'Solo chino, sin pinyin' },
];

function loadDifficulty() {
  try { return localStorage.getItem(LS_DIFFICULTY) || 'normal'; } catch { return 'normal'; }
}
function saveDifficulty(d) {
  try { localStorage.setItem(LS_DIFFICULTY, d); } catch {}
}

// Sustituye {userName} dentro de cualquier campo de texto de la escena.
function interpolate(text, userName) {
  if (!text) return text;
  return text.replace(/\{userName\}/g, userName || 'Tú');
}

export default function StoryPlayer({ story, userName, speak, onExit, onFinish, resultMeta }) {
  const [difficulty, setDifficulty] = useState(loadDifficulty);
  const [phase, setPhase] = useState('intro'); // intro | dialogue | exercises | results
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState({ score: 0, total: 0 });

  // Asegurar persistencia
  useEffect(() => { saveDifficulty(difficulty); }, [difficulty]);

  // Avisa a App.jsx de que entramos/salimos del modo historia para ocultar la
  // bottom nav (rompía inmersión y se solapaba con el cuadro de diálogo).
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('story-mode-enter'));
    return () => window.dispatchEvent(new CustomEvent('story-mode-exit'));
  }, []);

  const escenas = story?.escenas || [];
  const escena  = escenas[idx];
  const total   = escenas.length;

  const speaker = useMemo(
    () => (escena ? getCharacter(escena.personaje, userName) : null),
    [escena, userName]
  );

  const handleAdvance = () => {
    if (idx < total - 1) {
      setIdx(idx + 1);
    } else {
      // Si hay ejercicios definidos, pasar al bloque de ejercicios.
      // Si no, ir directo a resultados con 0/0.
      const hasExercises =
        (story.ejercicios?.traduccion?.length || 0) +
        (story.ejercicios?.completar?.length || 0) +
        (story.ejercicios?.comprension?.length || 0) > 0;
      setPhase(hasExercises ? 'exercises' : 'results');
    }
  };

  const handleExercisesDone = (s, t) => {
    setScore({ score: s, total: t });
    setPhase('results');
    onFinish?.({ score: s, total: t });
  };

  const handleRetry = () => {
    setIdx(0);
    setScore({ score: 0, total: 0 });
    setPhase('intro');
  };

  // ── INTRO ───────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div style={shellStyle}>
        <SceneBackground escenario={story.escenario} storyId={story.id} />
        <TopBar onExit={onExit} title={story.titulo} subtitle={story.subtitulo} />

        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 20px 110px',
        }}>
          <div style={{
            background: 'rgba(20,16,12,0.78)',
            borderRadius: 22,
            padding: '24px 22px',
            border: `1px solid ${J.hairS}`,
            maxWidth: 420,
            width: '100%',
            color: J.onAccent,
          }}>
            <p style={{ fontSize: 11, letterSpacing: '0.16em', color: J.butter, fontWeight: 700, margin: 0 }}>
              TEMA {story.tema} · HISTORIA {story.historia}
            </p>
            <h2 className="font-cn" style={{ fontSize: 28, fontWeight: 700, margin: '6px 0 2px' }}>
              {story.subtitulo}
            </h2>
            <p style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>{story.titulo}</p>

            <p style={{ marginTop: 14, fontSize: 13.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.55 }}>
              {story.resumen}
            </p>

            {/* Personajes */}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', textTransform: 'uppercase' }}>
                Personajes
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {story.personajes.map((id) => {
                  const c = getCharacter(id, userName);
                  return (
                    <span key={id} style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: `1px solid rgba(255,255,255,0.12)`,
                      borderRadius: 999,
                      padding: '4px 10px',
                      fontSize: 12,
                      color: J.onAccent,
                    }}>
                      <span className="font-cn">{c?.nombre}</span>
                      {c?.pinyin ? <span style={{ opacity: 0.6, marginLeft: 6 }}>{c.pinyin}</span> : null}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Selector dificultad */}
            <div style={{ marginTop: 18 }}>
              <p style={{ fontSize: 11, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px', textTransform: 'uppercase' }}>
                Pinyin
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
                {DIFFICULTIES.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDifficulty(d.id)}
                    title={d.desc}
                    style={{
                      background: difficulty === d.id ? J.jade : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${difficulty === d.id ? J.jadeDeep : 'rgba(255,255,255,0.12)'}`,
                      color: J.onAccent,
                      borderRadius: 12,
                      padding: '8px 6px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p style={{ marginTop: 6, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                {DIFFICULTIES.find(d => d.id === difficulty)?.desc}
              </p>
            </div>

            {/* Start */}
            <button
              onClick={() => setPhase('dialogue')}
              style={{
                marginTop: 20,
                width: '100%',
                background: J.red,
                color: J.onAccent,
                border: 0,
                borderRadius: 14,
                padding: '14px 18px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 6px 18px -8px rgba(200,57,47,0.7)',
              }}
            >
              开始 · Empezar historia →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── EXERCISES ──────────────────────────────────────────────────────────────
  if (phase === 'exercises') {
    // Presentador = primer personaje no-user de la historia (el "anfitrión"
    // que te pregunta). Lo mostramos decorativo detrás del cuadro.
    const presentadorId = (story.personajes || []).find(id => id !== 'user');
    const presentador = presentadorId ? getCharacter(presentadorId, userName) : null;
    return (
      <div style={shellStyle}>
        <SceneBackground escenario={story.escenario} storyId={story.id} />
        <TopBar onExit={onExit} title={story.titulo} subtitle="Ejercicios" />
        <ExerciseBlock
          ejercicios={story.ejercicios}
          onComplete={handleExercisesDone}
          presentador={presentador}
        />
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <div style={shellStyle}>
        <SceneBackground escenario={story.escenario} storyId={story.id} />
        <TopBar onExit={onExit} title={story.titulo} subtitle={story.subtitulo} />
        <StoryResults
          story={story}
          score={score.score}
          total={score.total}
          xpGanado={resultMeta?.xpGanado || 0}
          isFirstTime={resultMeta?.isFirstTime || false}
          onRetry={handleRetry}
          onExit={onExit}
        />
      </div>
    );
  }

  // ── DIALOGUE ────────────────────────────────────────────────────────────────
  return (
    <div style={shellStyle}>
      <SceneBackground escenario={story.escenario} storyId={story.id} />
      <TopBar onExit={onExit} title={story.titulo} subtitle={story.subtitulo} progress={(idx + 1) / total} />

      {/* Mitad superior: personaje (centrado, ocupa todo el ancho disponible) */}
      <div style={{
        flex: '1 1 auto',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '20px 16px 8px',
        minHeight: 0,
      }}>
        <div style={{ width: '90%', maxWidth: 460 }}>
          <CharacterDisplay
            key={`${escena.id}-${escena.personaje}`}
            character={speaker}
            expresion={escena.expresion}
            variant="dialogue"
          />
        </div>
      </div>

      {/* Mitad inferior: diálogo */}
      <div style={{ padding: '8px 16px 24px', flexShrink: 0 }}>
        <DialogueBox
          key={escena.id}
          speakerName={`${speaker?.nombre || ''}${speaker?.pinyin ? '  ·  ' + speaker.pinyin : ''}`}
          chino={interpolate(escena.chino, userName)}
          pinyin={interpolate(escena.pinyin, userName)}
          traduccion={interpolate(escena.traduccion, userName)}
          dificultad={difficulty}
          onAdvance={handleAdvance}
          isLast={idx === total - 1}
          speak={speak}
        />
      </div>
    </div>
  );
}

// ── UI helpers ───────────────────────────────────────────────────────────────
const shellStyle = {
  position: 'relative',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: '#1a1410',
  color: '#fbf5e6',
  overflow: 'hidden',
  isolation: 'isolate', // crea stacking context para que SceneBackground (z-index:-1) quede detrás
};

function TopBar({ onExit, title, subtitle, progress }) {
  // Cápsula semitransparente alrededor del bloque título+subtítulo para que
  // sea legible sobre fondos claros (cielos, paredes). Antes era texto blanco
  // suelto y desaparecía sobre el cielo de t1-h1/t1-h2.
  return (
    <div style={{
      padding: '14px 16px 10px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexShrink: 0,
      position: 'relative',
      zIndex: 5,
    }}>
      <button onClick={onExit} style={{
        background: 'rgba(20,16,12,0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        border: '1px solid rgba(255,255,255,0.18)',
        color: J.onAccent,
        borderRadius: 999,
        padding: '7px 14px',
        fontSize: 12.5,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
      }}>
        ← Salir
      </button>
      <div style={{
        flex: 1,
        minWidth: 0,
        background: 'rgba(20,16,12,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        borderRadius: 12,
        padding: '6px 12px',
        border: '1px solid rgba(255,255,255,0.10)',
      }}>
        <p style={{
          margin: 0, fontSize: 13, fontWeight: 700, color: J.onAccent, lineHeight: 1.2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{title}</p>
        {subtitle && (
          <p className="font-cn" style={{
            margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{subtitle}</p>
        )}
      </div>
      {typeof progress === 'number' && (
        <div style={{
          width: 70, height: 5,
          background: 'rgba(20,16,12,0.55)',
          borderRadius: 99, overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.10)',
        }}>
          <div style={{
            width: `${Math.round(progress * 100)}%`,
            height: '100%',
            background: J.butter,
            transition: 'width 360ms ease-out',
          }} />
        </div>
      )}
    </div>
  );
}
