// src/utils/wordType.js
// Localiza y normaliza las abreviaturas gramaticales del vocabulario
// (`type` de libro-data.json), que venían solo en español y con
// inconsistencias ("VO" vs "VO.", "NP" vs "NP.").
//
// El dato base usa la convención del "Nuevo Libro de Chino Práctico". Cada
// tipo puede ser compuesto ("S./V.", "V./V.aux.", "Num.-Clas."). Resolvemos
// átomo por átomo y reconstruimos, así "S./V." → "N./V." en inglés, etc.
//
// Para español devolvemos las abreviaturas originales del libro (S., V., …)
// ya normalizadas; para el resto, abreviaturas equivalentes localizadas.

// Mapa por átomo canónico (con punto). { es, en, de, fr, it, pt }.
const ABBR = {
  'Pron.':      { es: 'Pron.',    en: 'Pron.',      de: 'Pron.',        fr: 'Pron.',       it: 'Pron.',       pt: 'Pron.' },
  'Adj.':       { es: 'Adj.',     en: 'Adj.',       de: 'Adj.',         fr: 'Adj.',        it: 'Agg.',        pt: 'Adj.' },
  'V.':         { es: 'V.',       en: 'V.',         de: 'V.',           fr: 'V.',          it: 'V.',          pt: 'V.' },
  'Pr.int.':    { es: 'Pr.int.',  en: 'Int.pron.',  de: 'Interr.pron.', fr: 'Pron.int.',   it: 'Pron.int.',   pt: 'Pron.int.' },
  'S.':         { es: 'S.',       en: 'N.',         de: 'Subst.',       fr: 'N.',          it: 'Sost.',       pt: 'Subst.' },
  'Adv.':       { es: 'Adv.',     en: 'Adv.',       de: 'Adv.',         fr: 'Adv.',        it: 'Avv.',        pt: 'Adv.' },
  'Pt.m.':      { es: 'Pt.m.',    en: 'Mod.part.',  de: 'Modalp.',      fr: 'Part.mod.',   it: 'Part.mod.',   pt: 'Part.mod.' },
  'Suf.':       { es: 'Suf.',     en: 'Suff.',      de: 'Suf.',         fr: 'Suf.',        it: 'Suff.',       pt: 'Suf.' },
  'Conj.':      { es: 'Conj.',    en: 'Conj.',      de: 'Konj.',        fr: 'Conj.',       it: 'Cong.',       pt: 'Conj.' },
  'NP.':        { es: 'NP.',      en: 'Prop.n.',    de: 'Eigenn.',      fr: 'N.pr.',       it: 'N.pr.',       pt: 'N.pr.' },
  'Clas.':      { es: 'Clas.',    en: 'Meas.',      de: 'Zählw.',       fr: 'Class.',      it: 'Class.',      pt: 'Class.' },
  'Pt.est.':    { es: 'Pt.est.',  en: 'Struct.part.', de: 'Strukturp.', fr: 'Part.struct.', it: 'Part.strutt.', pt: 'Part.estrut.' },
  'Num.':       { es: 'Num.',     en: 'Num.',       de: 'Num.',         fr: 'Num.',        it: 'Num.',        pt: 'Num.' },
  'VO.':        { es: 'VO.',      en: 'V.-obj.',    de: 'V.-Obj.',      fr: 'V.-obj.',     it: 'V.-ogg.',     pt: 'V.-obj.' },
  'EI':         { es: 'EI',       en: 'Idiom',      de: 'Redew.',       fr: 'Loc.',        it: 'Loc.',        pt: 'Loc.' },
  'Prep.':      { es: 'Prep.',    en: 'Prep.',      de: 'Präp.',        fr: 'Prép.',       it: 'Prep.',       pt: 'Prep.' },
  'V.aux.':     { es: 'V.aux.',   en: 'Aux.v.',     de: 'Hilfsv.',      fr: 'V.aux.',      it: 'V.aus.',      pt: 'V.aux.' },
  'Num.-Clas.': { es: 'Num.-Clas.', en: 'Num.-meas.', de: 'Num.-Zählw.', fr: 'Num.-class.', it: 'Num.-class.', pt: 'Num.-class.' },
};

// Normaliza inconsistencias del dato ("VO" → "VO.", "NP" → "NP.").
function canonAtom(atom) {
  const a = atom.trim();
  if (a === 'VO') return 'VO.';
  if (a === 'NP') return 'NP.';
  return a;
}

/**
 * Devuelve la abreviatura gramatical localizada. Compuestos por "/" se
 * resuelven átomo a átomo ("S./V." → "N./V."). "—" y desconocidos se
 * devuelven tal cual (neutros al idioma). Falta de dato → cadena vacía.
 */
export function wordTypeLabel(type, lang = 'es') {
  if (!type || type === '—') return type || '';
  const l = ABBR['S.'][lang] ? lang : 'es'; // idioma soportado o fallback es
  return type.split('/').map((raw) => {
    const key = canonAtom(raw);
    return ABBR[key]?.[l] ?? raw.trim();
  }).join('/');
}
