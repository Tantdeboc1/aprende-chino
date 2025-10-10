// === daily-logic.js ===
// Utilities for Daily challenge rotation, hints, and persistence

export const MAX_ATTEMPTS = 5;
const STORAGE_KEY = "dailyProgress_v1";

// Deterministic pick for a given date (rotates daily)
export function pickDailyChar(dictionary, date = new Date()) {
  if (!Array.isArray(dictionary) || dictionary.length === 0) return null;
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const key = day.toISOString().slice(0, 10);
  const idx = Math.abs(hashString(key)) % dictionary.length;
  return { ...dictionary[idx], index: idx, dateKey: key };
}

// Simple hash
function hashString(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return h;
}

// Persistence helpers
export function loadDailyState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { dateKey: null, attempts: 0, complete: false };
    const parsed = JSON.parse(raw);
    // harden against corrupt states
    return {
      dateKey: parsed.dateKey ?? null,
      attempts: Number.isFinite(parsed.attempts) ? Math.max(0, Math.min(MAX_ATTEMPTS, parsed.attempts)) : 0,
      complete: !!parsed.complete
    };
  } catch {
    return { dateKey: null, attempts: 0, complete: false };
  }
}

export function saveDailyState(partial) {
  try {
    const current = loadDailyState();
    const merged = { ...current, ...partial };
    // clamp attempts
    if (typeof merged.attempts === "number") {
      merged.attempts = Math.max(0, Math.min(MAX_ATTEMPTS, merged.attempts));
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
}

// Hints generator: always returns up to 5 hints, even if fields are missing
export function getHint(attempt, charData) {
  if (!charData) return null;
  const { pinyin, meaning, radical } = charData;
  const safePinyin = typeof pinyin === "string" && pinyin.length > 0 ? pinyin : null;
  const safeMeaning = typeof meaning === "string" && meaning.length > 0 ? meaning : null;
  const safeRadical = typeof radical === "string" && radical.length > 0 ? radical : null;

  const baseHints = [
    { label: "Pista 1", content: safePinyin ? `El pinyin empieza por: “${safePinyin[0]}…”` : "Es un carácter muy común en HSK1." },
    { label: "Pista 2", content: safeMeaning ? `El significado empieza por: “${safeMeaning[0].toUpperCase()}…”` : "Su significado es muy básico (piensa en pronombres, números, direcciones...)." },
    { label: "Pista 3", content: safeRadical ? `Radical: ${safeRadical}` : "El radical es sencillo." },
    { label: "Pista 4", content: "Lo verías en frases muy cortas del nivel inicial." },
    { label: "Pista 5", content: "¡Última pista! Seguro que lo has visto en saludos o expresiones básicas." }
  ];
  const idx = Math.min(Math.max(1, attempt), baseHints.length) - 1;
  return baseHints[idx];
}

// Normalize input (strip diacritics)
export function normalize(s) {
  return (s || "").trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

// Compare guess to charData
export function isCorrect(guess, charData) {
  const g = normalize(guess);
  const pinyinOk = charData.pinyin && normalize(charData.pinyin) === g;
  const meaningOk = charData.meaning && normalize(charData.meaning) === g;
  return pinyinOk || meaningOk;
}