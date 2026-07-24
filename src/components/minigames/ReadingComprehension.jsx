// src/components/minigames/ReadingComprehension.jsx
// Minijuego: Comprensión lectora — lectura del texto (con audio TTS y
// tap-to-define por palabra), elección de tipo de ejercicio y corrección.
import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { loc } from '@/utils/loc.js';
import { loadReadingStories } from '@/utils/loadContent.js';
import { cancelSpeak } from '@/utils/tts-enhanced.js';
import { hapticSuccess, hapticError } from '@/utils/haptic.js';
import { playSound } from '@/utils/gameAudio.js';
import { addXP } from '@/utils/streak.js';
import { updateChallengeProgress } from '@/utils/dailyChallenges.js';
import { loadReadingProgress, recordReadingResult } from '@/utils/readingProgress.js';
import { useKeyAnswers } from '@/utils/useKeyAnswers.js';
import TappableHanzi from './TappableHanzi.jsx';
import GameResults from './GameResults.jsx';

const TEMAS = [1, 2, 3, 4, 5, 6, 7, 8];

// Divide el texto en "eventos" (frases) por la puntuación de fin de oración.
function splitEvents(hanzi) {
  return (hanzi.match(/[^。！？]+[。！？]?/g) || []).map(s => s.trim()).filter(Boolean);
}

// ── Selector de historia ──────────────────────────────────────────────────────
function StorySelector({ onSelect }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'es').split('-')[0];
  const [temaFiltro, setTemaFiltro] = useState(null);
  const progreso = loadReadingProgress();

  // Historias del idioma activo (chunk por idioma, ver loadContent.js).
  const [stories, setStories] = useState(null);
  useEffect(() => {
    let alive = true;
    loadReadingStories(lang)
      .then(data => { if (alive) setStories(data); })
      // Corte de red al descargar el chunk del idioma: se deja en null. Lo
      // tragamos para no saturar Sentry con un rejection sin manejar.
      .catch(err => console.warn('[ReadingComprehension] no se pudo cargar', lang, err));
    return () => { alive = false; };
  }, [lang]);

  const historias = temaFiltro
    ? (stories || []).filter(s => s.tema === temaFiltro)
    : (stories || []);

  return (
    <div className="min-h-screen pb-8" style={{ background: J.paper }}>
      {/* Cabecera */}
      <div className="px-4 pt-10 pb-4" style={{ background: J.paperHi, borderBottom: `1px solid ${J.hair}` }}>
        <h1 className="text-xl font-bold mb-0.5" style={{ color: J.ink }}>阅读理解</h1>
        <p className="text-sm" style={{ color: J.inkSoft }}>{t('reading_header_subtitle', 'Lee el texto y responde las preguntas')}</p>

        {/* Filtro por tema */}
        <div className="flex gap-2 flex-wrap mt-3">
          <button
            onClick={() => setTemaFiltro(null)}
            className="px-3 py-1 rounded-lg text-xs font-semibold border transition-colors"
            style={{
              background: temaFiltro === null ? J.red : J.paperHi,
              color: temaFiltro === null ? J.paperHi : J.inkSoft,
              border: temaFiltro === null ? `1px solid ${J.red}` : `1px solid ${J.hair}`,
            }}
          >
            {t('reading_filter_all', 'Todos')}
          </button>
          {TEMAS.map(tema => (
            <button
              key={tema}
              onClick={() => setTemaFiltro(tema)}
              className="px-3 py-1 rounded-lg text-xs font-semibold border transition-colors"
              style={{
                background: temaFiltro === tema ? J.red : J.paperHi,
                color: temaFiltro === tema ? J.paperHi : J.inkSoft,
                border: temaFiltro === tema ? `1px solid ${J.red}` : `1px solid ${J.hair}`,
              }}
            >
              T{tema}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de historias */}
      <div className="px-4 pt-4 space-y-3 max-w-lg mx-auto">
        {historias.map(story => {
          const p = progreso[story.id];
          return (
            <button
              key={story.id}
              onClick={() => onSelect(story)}
              className="w-full text-left rounded-2xl p-4 flex items-start gap-3 transition-all active:scale-[0.98]"
              style={{ background: J.paperHi, border: `1px solid ${p?.completada ? J.jade : J.hair}` }}
            >
              <div
                className="font-cn flex items-center justify-center flex-shrink-0 text-lg font-bold rounded-xl"
                style={{ width: 44, height: 44, background: J.redBg, color: J.red }}
              >
                T{story.tema}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: J.ink }}>{story.titulo}</p>
                <p className="text-xs mt-0.5" style={{ color: J.inkSoft }}>{loc(story.tituloTr, lang)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <p className="text-xs" style={{ color: J.mute }}>
                    {t('reading_questions_count', '{{count}} preguntas', { count: story.preguntas.length })}
                  </p>
                  {p?.completada && (
                    <span className="text-[0.6875rem] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: J.jadeBg, color: J.jadeDeep }}>
                      ✓ {p.mejorPuntuacion}/{p.maxPuntuacion}
                    </span>
                  )}
                </div>
              </div>
              <span style={{ color: J.mute, fontWeight: 700, marginTop: 4 }}>→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Cabecera reutilizable con botón Volver ───────────────────────────────────
function ExerciseHeader({ title, subtitle, onBack, t, accent }) {
  return (
    <div className="px-4 pt-10 pb-4" style={{ background: J.paperHi, borderBottom: `1px solid ${J.hair}`, borderLeft: accent ? `4px solid ${accent}` : undefined }}>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm mb-3"
        style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}
      >
        ← {t('reading_back', 'Volver')}
      </button>
      <h1 className="text-xl font-bold" style={{ color: J.ink }}>{title}</h1>
      {subtitle && <p className="text-sm" style={{ color: J.inkSoft }}>{subtitle}</p>}
    </div>
  );
}

// ── Selector de tipo de ejercicio ────────────────────────────────────────────
function ExerciseChooser({ story, onChoose, onBack, t, lang }) {
  const tipos = [
    { id: 'test',  cn: '问', label: t('reading_ex_test', 'Test de preguntas'), ready: true },
    { id: 'orden', cn: '序', label: t('reading_ex_order', 'Ordenar el texto'), ready: true },
    { id: 'vf',    cn: '判', label: t('reading_ex_truefalse', 'Verdadero o falso'), ready: (story.vf?.length || 0) > 0 },
    { id: 'hueco', cn: '填', label: t('reading_ex_cloze', 'Rellenar huecos'), ready: (story.cloze?.length || 0) > 0 },
  ];
  return (
    <div className="min-h-screen pb-8" style={{ background: J.paper }}>
      <ExerciseHeader
        title={story.titulo}
        subtitle={`${loc(story.tituloTr, lang)} · ${t('reading_topic', 'Tema')} ${story.tema}`}
        onBack={onBack}
        t={t}
      />
      <div className="px-4 pt-5 max-w-lg mx-auto">
        <p className="text-sm font-semibold mb-3" style={{ color: J.inkSoft }}>
          {t('reading_choose_exercise', '¿Qué quieres practicar?')}
        </p>
        <div className="space-y-2.5">
          {tipos.map(tp => (
            <button
              key={tp.id}
              onClick={() => tp.ready && onChoose(tp.id)}
              disabled={!tp.ready}
              className="w-full text-left rounded-2xl p-4 flex items-center gap-3 transition-all active:scale-[0.98]"
              style={{
                background: J.paperHi,
                border: `1px solid ${J.hair}`,
                cursor: tp.ready ? 'pointer' : 'default',
                opacity: tp.ready ? 1 : 0.55,
              }}
            >
              <div className="font-cn flex items-center justify-center flex-shrink-0 text-xl font-bold rounded-xl"
                style={{ width: 44, height: 44, background: tp.ready ? J.jadeBg : J.paperHi2, color: tp.ready ? J.jadeDeep : J.mute }}>
                {tp.cn}
              </div>
              <span className="flex-1 font-bold text-sm" style={{ color: J.ink }}>{tp.label}</span>
              {tp.ready
                ? <span style={{ color: J.mute, fontWeight: 700 }}>→</span>
                : <span className="text-[0.6875rem] font-bold px-2 py-0.5 rounded-full" style={{ background: J.sandBg, color: J.sandDeep }}>{t('reading_coming_soon', 'Pronto')}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Ejercicio: Test de preguntas (opción múltiple) ───────────────────────────
function TestExercise({ story, dict, maxLen, onBack, onFinish, t, lang }) {
  const [preguntaIdx, setPreguntaIdx] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [correctas, setCorrectas] = useState(0);

  const pregunta = story.preguntas[preguntaIdx];
  const total = story.preguntas.length;

  // Baraja las opciones (evita que la correcta esté siempre en la posición A).
  const opcionesBarajadas = useMemo(() => {
    const arr = pregunta.opciones.map((opcion, i) => ({ opcion, correcta: i === pregunta.correcta }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [pregunta]);

  const opcionCorrecta = opcionesBarajadas.find(o => o.correcta)?.opcion;

  const handleRespuesta = (idx) => {
    if (resultado) return;
    setSeleccionada(idx);
    const ok = opcionesBarajadas[idx].correcta;
    setResultado(ok ? 'correct' : 'incorrect');
    if (ok) {
      setCorrectas(c => c + 1);
      addXP(10);
      updateChallengeProgress('correct_answers', 1);
      hapticSuccess();
      playSound('correct');
    } else {
      hapticError();
      playSound('incorrect');
    }
  };

  const handleSiguiente = () => {
    if (preguntaIdx + 1 >= total) {
      updateChallengeProgress('complete_quizzes', 1);
      updateChallengeProgress('play_different_games', 'ReadingComprehension');
      onFinish(correctas + (resultado === 'correct' ? 1 : 0), total);
      return;
    }
    setPreguntaIdx(i => i + 1);
    setSeleccionada(null);
    setResultado(null);
  };

  // Accesibilidad: teclas 1-4 responden, Enter pasa de pregunta.
  useKeyAnswers({
    count: opcionesBarajadas.length,
    onSelect: !resultado ? handleRespuesta : null,
    onNext: resultado ? handleSiguiente : null,
  });

  return (
    <div className="min-h-screen pb-8" style={{ background: J.paper }}>
      <div className="px-4 pt-10 pb-4" style={{ background: J.paperHi, borderBottom: `1px solid ${J.hair}`, borderLeft: `4px solid ${J.red}` }}>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm"
            style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}
          >
            ← {t('reading_back', 'Volver')}
          </button>
          <span className="text-sm font-semibold" style={{ color: J.mute }}>{preguntaIdx + 1}/{total}</span>
        </div>
        <h1 className="text-base font-bold" style={{ color: J.ink }}>{story.titulo}</h1>
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: J.hair }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${((preguntaIdx + (resultado ? 1 : 0)) / total) * 100}%`, background: J.red }} />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-4">
        {/* Texto de referencia (con tap-to-define) */}
        <div className="rounded-xl px-4 py-3" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
          <p className="text-xs font-semibold mb-1" style={{ color: J.mute }}>{t('reading_text_label', 'Texto')}</p>
          <TappableHanzi
            text={story.hanzi}
            dict={dict}
            maxLen={maxLen}
            t={t}
            className="font-cn text-sm leading-relaxed"
            style={{ color: J.inkSoft, fontFamily: J.cnSerif }}
          />
        </div>

        {/* Pregunta */}
        <div className="rounded-xl px-4 py-3" style={{ background: J.redBg, border: `1px solid ${J.red}` }}>
          <p className="text-sm font-bold" style={{ color: J.redDeep }}>{loc(pregunta.pregunta, lang)}</p>
        </div>

        {/* Opciones */}
        <div className="space-y-2.5">
          {opcionesBarajadas.map(({ opcion, correcta }, idx) => {
            const esCorrecta = correcta;
            const esSeleccionada = idx === seleccionada;
            let bg = J.paperHi, border = J.hair, color = J.ink;
            if (resultado) {
              if (esCorrecta) { bg = J.jadeBg; border = J.jade; color = J.jadeDeep; }
              else if (esSeleccionada) { bg = J.redBg; border = J.red; color = J.redDeep; }
            }
            return (
              <button
                key={idx}
                onClick={() => handleRespuesta(idx)}
                disabled={!!resultado}
                className={`w-full text-left rounded-xl px-4 py-3 text-sm font-medium transition-all active:scale-[0.98] ${resultado && esCorrecta ? 'j-pop' : resultado && esSeleccionada ? 'j-shake' : ''}`}
                style={{ background: bg, border: `1px solid ${border}`, color, cursor: resultado ? 'default' : 'pointer' }}
              >
                <span className="font-bold mr-2" style={{ color: J.mute }}>{['A', 'B', 'C', 'D'][idx]}.</span>
                {loc(opcion, lang)}
              </button>
            );
          })}
        </div>

        {/* Feedback (aria-live para lectores de pantalla) */}
        <div aria-live="polite" role="status">
          {resultado === 'correct' && (
            <div className="rounded-xl p-3 flex items-center gap-2 animate-fade-in" style={{ background: J.jadeBg, border: `1px solid ${J.jade}` }}>
              <span className="text-xl">✓</span>
              <p className="text-sm font-bold" style={{ color: J.jadeDeep }}>{t('reading_correct', '¡Correcto!')}</p>
            </div>
          )}
          {resultado === 'incorrect' && (
            <div className="rounded-xl p-3 animate-fade-in" style={{ background: J.redBg, border: `1px solid ${J.red}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">✗</span>
                <p className="text-sm font-bold" style={{ color: J.redDeep }}>{t('reading_incorrect', 'Incorrecto')}</p>
              </div>
              <p className="text-xs" style={{ color: J.inkSoft }}>
                {t('reading_correct_answer_is', 'La respuesta correcta es:')} <strong>{loc(opcionCorrecta, lang)}</strong>
              </p>
            </div>
          )}
        </div>

        {resultado && (
          <button
            onClick={handleSiguiente}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{
              background: resultado === 'correct' ? J.jade : J.paperHi2,
              color: resultado === 'correct' ? J.paperHi : J.inkSoft,
              border: resultado === 'correct' ? 0 : `1px solid ${J.hair}`,
              cursor: 'pointer',
            }}
          >
            {preguntaIdx + 1 >= total ? t('reading_see_results', 'Ver resultados') : `${t('reading_next', 'Siguiente')} →`}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Ejercicio: Ordenar el texto (eventos) ────────────────────────────────────
function OrderEventsExercise({ story, onBack, onFinish, t }) {
  const eventos = useMemo(() => splitEvents(story.hanzi), [story]);
  const barajados = useMemo(() => {
    const arr = eventos.map((texto, orig) => ({ texto, orig }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Evita que el barajado coincida por casualidad con el orden original.
    if (arr.length > 1 && arr.every((it, i) => it.orig === i)) {
      [arr[0], arr[1]] = [arr[1], arr[0]];
    }
    return arr;
  }, [eventos]);

  const [orden, setOrden] = useState([]);       // items colocados, en orden
  const [comprobado, setComprobado] = useState(false);
  const total = eventos.length;

  const colocados = new Set(orden.map(o => o.orig));
  const disponibles = barajados.filter(b => !colocados.has(b.orig));
  const aciertos = orden.filter((item, idx) => item.orig === idx).length;

  const add = (item) => { if (!comprobado) setOrden(o => [...o, item]); };
  const removeAt = (idx) => { if (!comprobado) setOrden(o => o.filter((_, i) => i !== idx)); };
  const reset = () => { setOrden([]); setComprobado(false); };

  const comprobar = () => {
    setComprobado(true);
    if (aciertos === total) { hapticSuccess(); playSound('correct'); }
    else { hapticError(); playSound('incorrect'); }
    addXP(aciertos * 5);
    updateChallengeProgress('complete_quizzes', 1);
    updateChallengeProgress('play_different_games', 'ReadingComprehension');
  };

  return (
    <div className="min-h-screen pb-8" style={{ background: J.paper }}>
      <ExerciseHeader title={story.titulo} subtitle={t('reading_order_instructions', 'Toca las frases en el orden correcto')} onBack={onBack} t={t} accent={J.jade} />

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-4">
        {/* Respuesta en construcción */}
        <div className="rounded-xl p-3 min-h-[60px] space-y-2" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
          {orden.length === 0 && (
            <p className="text-xs text-center py-3" style={{ color: J.mute }}>
              {t('reading_order_instructions', 'Toca las frases en el orden correcto')}
            </p>
          )}
          {orden.map((item, idx) => {
            let bg = J.paperHi2, border = J.hair, color = J.ink;
            if (comprobado) {
              const ok = item.orig === idx;
              bg = ok ? J.jadeBg : J.redBg;
              border = ok ? J.jade : J.red;
              color = ok ? J.jadeDeep : J.redDeep;
            }
            return (
              <button
                key={idx}
                onClick={() => removeAt(idx)}
                disabled={comprobado}
                className={`w-full text-left rounded-lg px-3 py-2 flex items-start gap-2 ${comprobado ? (item.orig === idx ? 'j-pop' : 'j-shake') : ''}`}
                style={{ background: bg, border: `1px solid ${border}`, color, cursor: comprobado ? 'default' : 'pointer' }}
              >
                <span className="font-bold text-xs mt-0.5" style={{ color: J.mute }}>{idx + 1}.</span>
                <span className="font-cn text-sm flex-1" style={{ fontFamily: J.cnSerif }}>{item.texto}</span>
                {comprobado && <span>{item.orig === idx ? '✓' : '✗'}</span>}
              </button>
            );
          })}
        </div>

        {/* Frases disponibles */}
        {!comprobado && disponibles.length > 0 && (
          <div className="space-y-2">
            {disponibles.map((item) => (
              <button
                key={item.orig}
                onClick={() => add(item)}
                className="w-full text-left rounded-lg px-3 py-2.5 font-cn text-sm transition-all active:scale-[0.98]"
                style={{ background: J.paperHi, border: `1px solid ${J.hair}`, color: J.ink, fontFamily: J.cnSerif, cursor: 'pointer' }}
              >
                {item.texto}
              </button>
            ))}
          </div>
        )}

        {/* Acciones */}
        {!comprobado && orden.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex-1 py-3 rounded-xl font-bold text-sm"
              style={{ background: J.paperHi, color: J.inkSoft, border: `1px solid ${J.hair}`, cursor: 'pointer' }}
            >
              {t('reading_reset', 'Reiniciar')}
            </button>
            <button
              onClick={comprobar}
              disabled={orden.length !== total}
              className="flex-1 py-3 rounded-xl font-bold text-sm"
              style={{
                background: orden.length === total ? J.red : J.paperHi2,
                color: orden.length === total ? J.paperHi : J.mute,
                border: 0, cursor: orden.length === total ? 'pointer' : 'default',
              }}
            >
              {t('reading_check', 'Comprobar')}
            </button>
          </div>
        )}

        {comprobado && (
          <button
            onClick={() => onFinish(aciertos, total)}
            className="w-full py-3.5 rounded-xl font-bold text-sm"
            style={{ background: aciertos === total ? J.jade : J.paperHi2, color: aciertos === total ? J.paperHi : J.inkSoft, border: aciertos === total ? 0 : `1px solid ${J.hair}`, cursor: 'pointer' }}
          >
            {t('reading_see_results', 'Ver resultados')}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Ejercicio: Verdadero o falso ─────────────────────────────────────────────
function TrueFalseExercise({ story, dict, maxLen, onBack, onFinish, t, lang }) {
  const items = story.vf || [];
  const [idx, setIdx] = useState(0);
  const [elegido, setElegido] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [correctas, setCorrectas] = useState(0);

  const item = items[idx];
  const total = items.length;

  const responder = (val) => {
    if (resultado) return;
    setElegido(val);
    const ok = val === item.correcta;
    setResultado(ok ? 'correct' : 'incorrect');
    if (ok) {
      setCorrectas(c => c + 1);
      addXP(10);
      updateChallengeProgress('correct_answers', 1);
      hapticSuccess();
      playSound('correct');
    } else {
      hapticError();
      playSound('incorrect');
    }
  };

  const siguiente = () => {
    if (idx + 1 >= total) {
      updateChallengeProgress('complete_quizzes', 1);
      updateChallengeProgress('play_different_games', 'ReadingComprehension');
      onFinish(correctas + (resultado === 'correct' ? 1 : 0), total);
      return;
    }
    setIdx(i => i + 1);
    setElegido(null);
    setResultado(null);
  };

  // Accesibilidad: 1 = Verdadero, 2 = Falso; Enter pasa de afirmación.
  useKeyAnswers({
    count: 2,
    onSelect: !resultado ? (i) => responder(i === 0) : null,
    onNext: resultado ? siguiente : null,
  });

  const botonVF = (val, label) => {
    let bg = J.paperHi, border = J.hair, color = J.ink;
    if (resultado) {
      if (val === item.correcta) { bg = J.jadeBg; border = J.jade; color = J.jadeDeep; }
      else if (val === elegido) { bg = J.redBg; border = J.red; color = J.redDeep; }
    }
    return (
      <button
        onClick={() => responder(val)}
        disabled={!!resultado}
        className={`flex-1 py-4 rounded-xl font-bold text-base transition-all active:scale-[0.98] ${resultado && val === item.correcta ? 'j-pop' : resultado && val === elegido ? 'j-shake' : ''}`}
        style={{ background: bg, border: `1px solid ${border}`, color, cursor: resultado ? 'default' : 'pointer' }}
      >
        {val ? '✓' : '✗'} {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen pb-8" style={{ background: J.paper }}>
      <div className="px-4 pt-10 pb-4" style={{ background: J.paperHi, borderBottom: `1px solid ${J.hair}`, borderLeft: `4px solid ${J.red}` }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm" style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}>
            ← {t('reading_back', 'Volver')}
          </button>
          <span className="text-sm font-semibold" style={{ color: J.mute }}>{idx + 1}/{total}</span>
        </div>
        <h1 className="text-base font-bold" style={{ color: J.ink }}>{story.titulo}</h1>
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: J.hair }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((idx + (resultado ? 1 : 0)) / total) * 100}%`, background: J.red }} />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-4">
        <div className="rounded-xl px-4 py-3" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
          <p className="text-xs font-semibold mb-1" style={{ color: J.mute }}>{t('reading_text_label', 'Texto')}</p>
          <TappableHanzi text={story.hanzi} dict={dict} maxLen={maxLen} t={t} className="font-cn text-sm leading-relaxed" style={{ color: J.inkSoft, fontFamily: J.cnSerif }} />
        </div>

        <div className="rounded-xl px-4 py-4" style={{ background: J.redBg, border: `1px solid ${J.red}` }}>
          <p className="text-base font-bold" style={{ color: J.redDeep }}>{loc(item.afirmacion, lang)}</p>
        </div>

        <div className="flex gap-2.5">
          {botonVF(true, t('reading_true', 'Verdadero'))}
          {botonVF(false, t('reading_false', 'Falso'))}
        </div>

        <div aria-live="polite" role="status">
          {resultado === 'correct' && (
            <div className="rounded-xl p-3 flex items-center gap-2 animate-fade-in" style={{ background: J.jadeBg, border: `1px solid ${J.jade}` }}>
              <span className="text-xl">✓</span>
              <p className="text-sm font-bold" style={{ color: J.jadeDeep }}>{t('reading_correct', '¡Correcto!')}</p>
            </div>
          )}
          {resultado === 'incorrect' && (
            <div className="rounded-xl p-3 flex items-center gap-2 animate-fade-in" style={{ background: J.redBg, border: `1px solid ${J.red}` }}>
              <span className="text-xl">✗</span>
              <p className="text-sm font-bold" style={{ color: J.redDeep }}>{t('reading_incorrect', 'Incorrecto')}</p>
            </div>
          )}
        </div>

        {resultado && (
          <button
            onClick={siguiente}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: resultado === 'correct' ? J.jade : J.paperHi2, color: resultado === 'correct' ? J.paperHi : J.inkSoft, border: resultado === 'correct' ? 0 : `1px solid ${J.hair}`, cursor: 'pointer' }}
          >
            {idx + 1 >= total ? t('reading_see_results', 'Ver resultados') : `${t('reading_next', 'Siguiente')} →`}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Ejercicio: Rellenar huecos (cloze) ───────────────────────────────────────
function ClozeExercise({ story, onBack, onFinish, t }) {
  const items = story.cloze || [];
  const [idx, setIdx] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [correctas, setCorrectas] = useState(0);

  const item = items[idx];
  const total = items.length;

  // Baraja las opciones (son hanzi, neutras al idioma).
  const opciones = useMemo(() => {
    const arr = item.opciones.map((op, i) => ({ op, correcta: i === item.correcta }));
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [item]);

  const responder = (i) => {
    if (resultado) return;
    setSeleccionada(i);
    const ok = opciones[i].correcta;
    setResultado(ok ? 'correct' : 'incorrect');
    if (ok) {
      setCorrectas(c => c + 1);
      addXP(10);
      updateChallengeProgress('correct_answers', 1);
      hapticSuccess();
      playSound('correct');
    } else {
      hapticError();
      playSound('incorrect');
    }
  };

  const siguiente = () => {
    if (idx + 1 >= total) {
      updateChallengeProgress('complete_quizzes', 1);
      updateChallengeProgress('play_different_games', 'ReadingComprehension');
      onFinish(correctas + (resultado === 'correct' ? 1 : 0), total);
      return;
    }
    setIdx(i => i + 1);
    setSeleccionada(null);
    setResultado(null);
  };

  // Accesibilidad: teclas 1-4 responden, Enter pasa de frase.
  useKeyAnswers({
    count: opciones.length,
    onSelect: !resultado ? responder : null,
    onNext: resultado ? siguiente : null,
  });

  const correcta = opciones.find(o => o.correcta)?.op;
  const fraseRellena = resultado
    ? item.texto.replace('＿＿', correcta)
    : item.texto;

  return (
    <div className="min-h-screen pb-8" style={{ background: J.paper }}>
      <div className="px-4 pt-10 pb-4" style={{ background: J.paperHi, borderBottom: `1px solid ${J.hair}`, borderLeft: `4px solid ${J.red}` }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm" style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}>
            ← {t('reading_back', 'Volver')}
          </button>
          <span className="text-sm font-semibold" style={{ color: J.mute }}>{idx + 1}/{total}</span>
        </div>
        <h1 className="text-base font-bold" style={{ color: J.ink }}>{story.titulo}</h1>
        <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: J.hair }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((idx + (resultado ? 1 : 0)) / total) * 100}%`, background: J.red }} />
        </div>
      </div>

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-4">
        {/* Frase con hueco */}
        <div className="rounded-2xl px-4 py-6" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
          <p className="font-cn text-2xl leading-loose text-center" style={{ color: J.ink, fontFamily: J.cnSerif }}>
            {fraseRellena}
          </p>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-2 gap-2.5">
          {opciones.map(({ op, correcta: esCorrecta }, i) => {
            const esSeleccionada = i === seleccionada;
            let bg = J.paperHi, border = J.hair, color = J.ink;
            if (resultado) {
              if (esCorrecta) { bg = J.jadeBg; border = J.jade; color = J.jadeDeep; }
              else if (esSeleccionada) { bg = J.redBg; border = J.red; color = J.redDeep; }
            }
            return (
              <button
                key={i}
                onClick={() => responder(i)}
                disabled={!!resultado}
                className={`py-3 rounded-xl font-cn text-lg font-bold transition-all active:scale-[0.98] ${resultado && esCorrecta ? 'j-pop' : resultado && esSeleccionada ? 'j-shake' : ''}`}
                style={{ background: bg, border: `1px solid ${border}`, color, cursor: resultado ? 'default' : 'pointer' }}
              >
                {op}
              </button>
            );
          })}
        </div>

        <div aria-live="polite" role="status">
          {resultado === 'correct' && (
            <div className="rounded-xl p-3 flex items-center gap-2 animate-fade-in" style={{ background: J.jadeBg, border: `1px solid ${J.jade}` }}>
              <span className="text-xl">✓</span>
              <p className="text-sm font-bold" style={{ color: J.jadeDeep }}>{t('reading_correct', '¡Correcto!')}</p>
            </div>
          )}
          {resultado === 'incorrect' && (
            <div className="rounded-xl p-3 animate-fade-in" style={{ background: J.redBg, border: `1px solid ${J.red}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">✗</span>
                <p className="text-sm font-bold" style={{ color: J.redDeep }}>{t('reading_incorrect', 'Incorrecto')}</p>
              </div>
              <p className="text-xs" style={{ color: J.inkSoft }}>
                {t('reading_correct_answer_is', 'La respuesta correcta es:')} <strong className="font-cn">{correcta}</strong>
              </p>
            </div>
          )}
        </div>

        {resultado && (
          <button
            onClick={siguiente}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98]"
            style={{ background: resultado === 'correct' ? J.jade : J.paperHi2, color: resultado === 'correct' ? J.paperHi : J.inkSoft, border: resultado === 'correct' ? 0 : `1px solid ${J.hair}`, cursor: 'pointer' }}
          >
            {idx + 1 >= total ? t('reading_see_results', 'Ver resultados') : `${t('reading_next', 'Siguiente')} →`}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Pantalla de lectura ──────────────────────────────────────────────────────
function StoryReader({ story, dict, maxLen, onBack, onContinue, speak }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'es').split('-')[0];
  const [mostrarPinyin, setMostrarPinyin] = useState(false);
  const [mostrarTraduccion, setMostrarTraduccion] = useState(false);
  const [hablando, setHablando] = useState(false);

  useEffect(() => () => cancelSpeak(), []);

  const handleEscuchar = async () => {
    if (!speak || hablando) return;
    setHablando(true);
    try { await speak(story.hanzi); } finally { setHablando(false); }
  };

  return (
    <div className="min-h-screen pb-8" style={{ background: J.paper }}>
      <ExerciseHeader
        title={story.titulo}
        subtitle={`${loc(story.tituloTr, lang)} · ${t('reading_topic', 'Tema')} ${story.tema}`}
        onBack={onBack}
        t={t}
      />

      <div className="px-4 pt-5 max-w-lg mx-auto space-y-4">
        {/* Texto en hanzi (con tap-to-define) */}
        <div className="rounded-2xl p-5" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
          <TappableHanzi
            text={story.hanzi}
            dict={dict}
            maxLen={maxLen}
            t={t}
            className="font-cn text-2xl leading-loose text-center"
            style={{ color: J.ink, fontFamily: J.cnSerif }}
          />
          <p className="text-[0.6875rem] text-center mt-2" style={{ color: J.mute }}>
            {t('reading_tap_hint', 'Toca una palabra para ver su significado')}
          </p>
          {speak && (
            <button
              onClick={handleEscuchar}
              disabled={hablando}
              className="mt-3 mx-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              style={{
                background: hablando ? J.jade : J.jadeBg,
                color: hablando ? J.paperHi : J.jadeDeep,
                border: `1px solid ${J.jade}`,
                cursor: hablando ? 'default' : 'pointer',
              }}
            >
              <span className={hablando ? 'animate-pulse' : ''}>🔊</span>
              {hablando ? t('reading_listening', 'Reproduciendo…') : t('reading_listen', 'Escuchar')}
            </button>
          )}
        </div>

        {/* Ayudas opcionales */}
        {mostrarPinyin && (
          <div className="rounded-xl px-4 py-3" style={{ background: J.sandBg, border: `1px solid ${J.sand}` }}>
            <p className="text-xs font-semibold mb-1" style={{ color: J.sandDeep }}>{t('reading_pinyin_label', 'Pinyin')}</p>
            <p className="text-sm leading-relaxed" style={{ color: J.ink }}>{story.pinyin}</p>
          </div>
        )}
        {mostrarTraduccion && (
          <div className="rounded-xl px-4 py-3" style={{ background: J.jadeBg, border: `1px solid ${J.jade}` }}>
            <p className="text-xs font-semibold mb-1" style={{ color: J.jadeDeep }}>{t('reading_translation_label', 'Traducción')}</p>
            <p className="text-sm leading-relaxed" style={{ color: J.ink }}>{loc(story.traduccion, lang)}</p>
          </div>
        )}

        {/* Botones de ayuda */}
        <div className="flex gap-2">
          <button
            onClick={() => setMostrarPinyin(p => !p)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{
              background: mostrarPinyin ? J.sandBg : J.paperHi,
              color: mostrarPinyin ? J.sandDeep : J.inkSoft,
              border: `1px solid ${mostrarPinyin ? J.sand : J.hair}`,
            }}
          >
            {mostrarPinyin ? t('reading_hide_pinyin', 'Ocultar pinyin') : `🔤 ${t('reading_show_pinyin', 'Ver pinyin')}`}
          </button>
          <button
            onClick={() => setMostrarTraduccion(v => !v)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            style={{
              background: mostrarTraduccion ? J.jadeBg : J.paperHi,
              color: mostrarTraduccion ? J.jadeDeep : J.inkSoft,
              border: `1px solid ${mostrarTraduccion ? J.jade : J.hair}`,
            }}
          >
            {mostrarTraduccion ? t('reading_hide_translation', 'Ocultar traducción') : `🌐 ${t('reading_show_translation', 'Ver traducción')}`}
          </button>
        </div>

        {/* Continuar */}
        <button
          onClick={onContinue}
          className="w-full py-3.5 rounded-xl font-bold text-base transition-all active:scale-[0.98]"
          style={{ background: J.red, color: J.onAccent, border: 0, cursor: 'pointer' }}
        >
          {t('reading_answer_questions', 'Responder preguntas')} →
        </button>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function ReadingComprehension({ goBack, speak, characters }) {
  const { t, i18n } = useTranslation();
  const lang = (i18n.language || 'es').split('-')[0];
  const [historiaActiva, setHistoriaActiva] = useState(null);
  const [fase, setFase] = useState('selector'); // 'selector' | 'lectura' | 'tipo' | 'test' | 'orden' | 'resultado'
  const [resultados, setResultados] = useState({ correctas: 0, total: 0 });

  // Diccionario para el tap-to-define (a partir del vocabulario de la app).
  const { dict, maxLen } = useMemo(() => {
    const m = new Map();
    let max = 1;
    for (const c of (characters || [])) {
      if (!c || !c.char) continue;
      if (!m.has(c.char)) m.set(c.char, { char: c.char, pinyin: c.pinyin, meaning: c.meaning, type: c.type });
      if (c.char.length > max) max = c.char.length;
    }
    return { dict: m, maxLen: max };
  }, [characters]);

  const handleSeleccionar = (story) => { setHistoriaActiva(story); setFase('lectura'); };

  const handleFinish = (correctas, total) => {
    if (historiaActiva) recordReadingResult(historiaActiva.id, correctas, total);
    setResultados({ correctas, total });
    setFase('resultado');
  };

  const handleVolver = () => {
    setHistoriaActiva(null);
    setFase('selector');
    setResultados({ correctas: 0, total: 0 });
  };

  if (fase === 'selector') {
    return (
      <div>
        <div className="px-4 pt-10 pb-2" style={{ background: J.paperHi, borderBottom: `1px solid ${J.hair}` }}>
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-sm mb-3"
            style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}
          >
            ← {t('reading_back_to_minigames', 'Minijuegos')}
          </button>
        </div>
        <StorySelector onSelect={handleSeleccionar} />
      </div>
    );
  }

  if (historiaActiva && fase === 'lectura') {
    return (
      <StoryReader
        story={historiaActiva}
        dict={dict}
        maxLen={maxLen}
        speak={speak}
        onBack={handleVolver}
        onContinue={() => setFase('tipo')}
      />
    );
  }

  if (historiaActiva && fase === 'tipo') {
    return (
      <ExerciseChooser
        story={historiaActiva}
        t={t}
        lang={lang}
        onBack={() => setFase('lectura')}
        onChoose={(tipo) => setFase(tipo)}
      />
    );
  }

  if (historiaActiva && fase === 'test') {
    return (
      <TestExercise
        story={historiaActiva}
        dict={dict}
        maxLen={maxLen}
        t={t}
        lang={lang}
        onBack={() => setFase('tipo')}
        onFinish={handleFinish}
      />
    );
  }

  if (historiaActiva && fase === 'orden') {
    return (
      <OrderEventsExercise
        story={historiaActiva}
        t={t}
        onBack={() => setFase('tipo')}
        onFinish={handleFinish}
      />
    );
  }

  if (historiaActiva && fase === 'vf') {
    return (
      <TrueFalseExercise
        story={historiaActiva}
        dict={dict}
        maxLen={maxLen}
        t={t}
        lang={lang}
        onBack={() => setFase('tipo')}
        onFinish={handleFinish}
      />
    );
  }

  if (historiaActiva && fase === 'hueco') {
    return (
      <ClozeExercise
        story={historiaActiva}
        t={t}
        onBack={() => setFase('tipo')}
        onFinish={handleFinish}
      />
    );
  }

  if (fase === 'resultado') {
    return (
      <GameResults
        gameId="reading-comprehension"
        title="阅读理解"
        subtitle={historiaActiva?.titulo}
        correct={resultados.correctas}
        wrong={resultados.total - resultados.correctas}
        onPlayAgain={() => setFase('tipo')}
        onBack={handleVolver}
      />
    );
  }

  return null;
}
