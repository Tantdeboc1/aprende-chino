// src/utils/pronunciationScore.js
// Compara una frase china reconocida con la esperada y produce un score útil
// para feedback visual.
//
// La API Web Speech devuelve solo el transcript, no audio crudo, así que la
// "calidad" la inferimos de cuántos caracteres CJK coinciden. No es una
// puntuación fonética real (no detecta tonos mal pronunciados si Google los
// transcribió "correctamente"), pero es suficientemente útil como feedback.

/**
 * Quita puntuación, espacios y caracteres no relevantes. Conserva CJK,
 * letras latinas y números (por si la frase mezcla idiomas).
 */
function normalize(s) {
  if (!s) return '';
  return s
    // Quita signos de puntuación CJK y ASCII
    .replace(/[。，！？、；：「」『』（）「」【】《》"'"".,!?;:()[\]{}…—–-]/g, '')
    // Quita espacios (Web Speech a veces mete espacios entre hanzi)
    .replace(/\s+/g, '')
    .trim();
}

/**
 * Distancia de Levenshtein entre dos strings (operaciones a nivel de carácter).
 * O(n*m) en tiempo y memoria — bien para las frases cortas de la app.
 */
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,        // inserción
        prev[j] + 1,            // borrado
        prev[j - 1] + cost,     // sustitución
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

/**
 * Marca por carácter cuáles del esperado están presentes en el reconocido.
 * No es estrictamente la "alineación" (no usamos Needleman-Wunsch), pero da
 * un highlight razonable: marca un char como matched si aparece en el resto
 * del transcript a partir del último match.
 */
function perCharMatches(expected, recognized) {
  const result = [];
  let cursor = 0;
  for (const ch of expected) {
    const idx = recognized.indexOf(ch, cursor);
    if (idx >= 0) {
      result.push(true);
      cursor = idx + 1;
    } else {
      result.push(false);
    }
  }
  return result;
}

/**
 * Compara dos frases chinas y devuelve un informe.
 *
 * @param {string} expected     La frase correcta (hanzi)
 * @param {string} recognized   Lo que dijo el usuario (transcript de Web Speech)
 * @returns {{
 *   score: number,                 // 0-100
 *   level: 'perfect'|'good'|'partial'|'fail',
 *   normExpected: string,
 *   normRecognized: string,
 *   charMatches: boolean[],        // por carácter de la frase esperada
 * }}
 */
export function scorePronunciation(expected, recognized) {
  const normExpected = normalize(expected);
  const normRecognized = normalize(recognized);

  if (!normExpected) {
    return { score: 0, level: 'fail', normExpected, normRecognized, charMatches: [] };
  }

  const dist = levenshtein(normExpected, normRecognized);
  const maxLen = Math.max(normExpected.length, normRecognized.length, 1);
  const rawScore = Math.max(0, 1 - dist / maxLen);
  const score = Math.round(rawScore * 100);

  let level = 'fail';
  if (score >= 95) level = 'perfect';
  else if (score >= 75) level = 'good';
  else if (score >= 40) level = 'partial';

  return {
    score,
    level,
    normExpected,
    normRecognized,
    charMatches: perCharMatches(normExpected, normRecognized),
  };
}
