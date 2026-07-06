// src/components/minigames/TappableHanzi.jsx
// Renderiza texto en hanzi segmentándolo en palabras (máxima coincidencia con
// el diccionario de la app) y permite tocar una palabra para ver su ficha
// (pinyin, tipo y significado). Las palabras desconocidas y la puntuación se
// muestran como texto normal, no interactivo.
import { useState, useMemo } from 'react';
import { J } from '@/styles/tokens';

// Segmentación voraz de izquierda a derecha por máxima longitud: en cada
// posición intenta encajar la palabra más larga presente en el diccionario.
function segment(text, dict, maxLen) {
  const out = [];
  let i = 0;
  while (i < text.length) {
    let matched = null;
    const max = Math.min(maxLen, text.length - i);
    for (let len = max; len >= 2; len--) {
      const sub = text.substr(i, len);
      if (dict.has(sub)) { matched = sub; break; }
    }
    // Palabras de un solo carácter también son "tappables" si están en el dict.
    if (!matched && dict.has(text[i])) matched = text[i];
    if (matched) {
      out.push({ text: matched, known: true });
      i += matched.length;
    } else {
      out.push({ text: text[i], known: false });
      i += 1;
    }
  }
  return out;
}

export default function TappableHanzi({ text, dict, maxLen = 4, className, style, t }) {
  const [sel, setSel] = useState(null);
  const tokens = useMemo(() => segment(text, dict, maxLen), [text, dict, maxLen]);

  return (
    <>
      <p className={className} style={style}>
        {tokens.map((tok, idx) =>
          tok.known ? (
            <span
              key={idx}
              onClick={(e) => { e.stopPropagation(); setSel(dict.get(tok.text)); }}
              style={{ cursor: 'pointer', borderBottom: `1.5px dotted ${J.jadeMid}` }}
            >
              {tok.text}
            </span>
          ) : (
            <span key={idx}>{tok.text}</span>
          )
        )}
      </p>

      {sel && (
        <div
          onClick={() => setSel(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(28,24,19,0.45)',
            // Centrado en pantalla (antes salía como bottom-sheet pegado abajo).
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl px-5 pt-5 pb-5"
            style={{ background: J.paperHi, border: `1px solid ${J.hair}`, borderTop: `3px solid ${J.jade}`, boxShadow: J.shadowLg }}
          >
            <div className="flex items-start gap-4">
              {/* Ancho automático + nowrap: las palabras de 2+ hanzi se leen en
                  horizontal, como se escriben (antes el ancho fijo las partía
                  en vertical). La fuente se reduce en palabras largas. */}
              <div
                className="font-cn flex items-center justify-center flex-shrink-0 rounded-2xl"
                style={{
                  minWidth: 64, height: 64, padding: '0 14px',
                  whiteSpace: 'nowrap',
                  background: J.jadeBg, color: J.jadeDeep,
                  fontSize: sel.char.length > 2 ? 24 : 34, fontWeight: 700,
                }}
              >
                {sel.char}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-lg font-bold" style={{ color: J.jade }}>{sel.pinyin}</p>
                {sel.type && <p className="text-xs mb-1" style={{ color: J.mute }}>{sel.type}</p>}
                <p className="text-base" style={{ color: J.ink }}>{sel.meaning}</p>
              </div>
            </div>
            <button
              onClick={() => setSel(null)}
              className="w-full mt-5 py-3 rounded-xl font-bold text-sm"
              style={{ background: J.paperHi2, color: J.inkSoft, border: `1px solid ${J.hair}`, cursor: 'pointer' }}
            >
              {t ? t('reading_close', 'Cerrar') : 'Cerrar'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
