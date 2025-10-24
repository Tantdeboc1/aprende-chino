import { useEffect, useMemo, useState } from 'react';
import Container from "@/components/ui/Container.jsx";
import Button from "@/components/ui/Button.jsx";
import Card from "@/components/ui/Card.jsx";
import { useTranslation } from "react-i18next";

// === Self-contained Daily.jsx (MODO OSCURO) ===
const MAX_ATTEMPTS = 5;
const STORAGE_KEY = "dailyProgress_v1";
const INDEX_KEY = "dailyIndex_v1";
const BASE = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';

// Icons
const ArrowLeft = ({className = ""}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" x2="5" y1="12" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

// ---------- helpers ----------
function pad(n){ return n < 10 ? '0'+n : ''+n; }
function localDateKey(d = new Date()){
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${pad(m)}-${pad(day)}`;
}

function hashString(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return h >>> 0;
}

function normalize(s) {
  return (s || '').trim().toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function isCorrect(guess, charData) {
  const g = normalize(guess);
  const pinyinOk = charData?.pinyin && normalize(charData.pinyin) === g;
  const meaningOk = charData?.meaning && normalize(charData.meaning) === g;
  return pinyinOk || meaningOk;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { dateKey: null, attempts: 0, complete: false };
    const parsed = JSON.parse(raw);
    return {
      dateKey: parsed?.dateKey ?? null,
      attempts: Number.isFinite(parsed?.attempts) ? Math.max(0, Math.min(MAX_ATTEMPTS, parsed.attempts)) : 0,
      complete: !!parsed?.complete,
    };
  } catch {
    return { dateKey: null, attempts: 0, complete: false };
  }
}

function saveState(partial) {
  try {
    const current = loadState();
    const merged = { ...current, ...partial };
    if (typeof merged.attempts === "number") {
      merged.attempts = Math.max(0, Math.min(MAX_ATTEMPTS, merged.attempts));
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {}
}

function loadIndex(dateKey) {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return null;
    const all = JSON.parse(raw);
    return (all && typeof all === 'object') ? all[dateKey] ?? null : null;
  } catch { return null; }
}

function saveIndex(dateKey, idx) {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    const all = raw ? JSON.parse(raw) : {};
    all[dateKey] = idx;
    localStorage.setItem(INDEX_KEY, JSON.stringify(all));
  } catch {}
}

function getHint(attempt, charData, t) {
  if (!charData) return null;
  const { pinyin, meaning, radical } = charData;
  const safePinyin = typeof pinyin === "string" && pinyin.length ? pinyin : null;
  const safeMeaning = typeof meaning === "string" && meaning.length ? meaning : null;
  const safeRadical = typeof radical === "string" && radical.length ? radical : null;
  const hints = [
    { label: t('daily_hint_label', { count: 1 }), content: safePinyin ? t('daily_hint_1_pinyin', { char: safePinyin[0] }) : t('daily_hint_1_common') },
    { label: t('daily_hint_label', { count: 2 }), content: safeMeaning ? t('daily_hint_2_meaning', { char: safeMeaning[0].toUpperCase() }) : t('daily_hint_2_basic') },
    { label: t('daily_hint_label', { count: 3 }), content: safeRadical ? t('daily_hint_3_radical', { radical: safeRadical }) : t('daily_hint_3_simple') },
    { label: t('daily_hint_label', { count: 4 }), content: t('daily_hint_4') },
    { label: t('daily_hint_label', { count: 5 }), content: t('daily_hint_5') },
  ];
  const idx = Math.min(Math.max(1, attempt), hints.length) - 1;
  return hints[idx];
}

// ---------- component ----------
function Daily({ goBack }) {
  const { t } = useTranslation();
  // loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dictionary, setDictionary] = useState([]);

  // game
  const [dailyChar, setDailyChar] = useState(null);
  const [dailyIndex, setDailyIndex] = useState(null);
  const [dailyAttempts, setDailyAttempts] = useState(0);
  const [dailyComplete, setDailyComplete] = useState(false);
  const [dateKey, setDateKey] = useState(localDateKey());
  const [guess, setGuess] = useState("");

  // load JSON
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE}data/hsk1-data.json`, { cache: 'no-cache' });
        if (!res.ok) throw new Error('No se pudo cargar /data/hsk1-data.json');
        const data = await res.json();

        const arr = Object.entries(data.characters).map(([char, details]) => ({
          char,
          ...details
        }));

        if (mounted) setDictionary(arr);
      } catch (e) {
        if (mounted) setError(e.message || 'Error al cargar el diccionario');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  // init today
  useEffect(() => {
    if (!dictionary.length) return;
    const today = localDateKey();
    setDateKey(today);

    let idx = loadIndex(today);
    if (typeof idx !== 'number') {
      idx = Math.abs(hashString(today)) % dictionary.length;
      saveIndex(today, idx);
    }
    setDailyIndex(idx);
    setDailyChar(dictionary[idx]);

    const st = loadState();
    if (st.dateKey === today) {
      setDailyAttempts(st.attempts || 0);
      setDailyComplete(!!st.complete);
    } else {
      setDailyAttempts(0);
      setDailyComplete(false);
      saveState({ dateKey: today, attempts: 0, complete: false });
    }
  }, [dictionary]);

  const remaining = useMemo(() => Math.max(0, MAX_ATTEMPTS - dailyAttempts), [dailyAttempts]);
  const isBlocked = dailyComplete || dailyAttempts >= MAX_ATTEMPTS;

  const tryGuess = () => {
    if (!dailyChar || isBlocked) return;
    const next = Math.min(dailyAttempts + 1, MAX_ATTEMPTS);
    setDailyAttempts(next);
    saveState({ attempts: next });

    if (isCorrect(guess, dailyChar)) {
      setDailyComplete(true);
      saveState({ complete: true });
    }
  };

  const resetToday = () => {
    if (!dictionary.length) return;
    let newIdx = Math.floor(Math.random() * dictionary.length);
    if (typeof dailyIndex === 'number' && dictionary.length > 1) {
      while (newIdx === dailyIndex) {
        newIdx = Math.floor(Math.random() * dictionary.length);
      }
    }
    setDailyIndex(newIdx);
    setDailyChar(dictionary[newIdx]);
    saveIndex(localDateKey(), newIdx);

    setDailyAttempts(0);
    setDailyComplete(false);
    setGuess("");
    saveState({ attempts: 0, complete: false });
  };

  const handleBack = () => {
    if (typeof goBack === 'function') {
      goBack();
    } else {
      window.location.href = BASE;
    }
  };

  if (loading) return <p className="text-center text-gray-400 p-6">{t('daily_loading_hsk1')}</p>;
  if (error) return <p className="text-center text-red-400 p-6">{t('daily_error_loading_dictionary')}: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <Container>
        <div className="mb-6">
          <button onClick={handleBack} className="flex items-center text-gray-300 hover:text-white">
            <ArrowLeft className="mr-2" />
            {t('daily_back_to_challenges')}
          </button>
        </div>

        <Card>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">每日挑战</h2>
            <p className="text-xl text-gray-300">Měi rì tiǎozhàn</p>
            <p className="text-gray-400 mt-1">{t('daily_challenge_title')}</p>
          </div>

          {dailyChar ? (
            <div className="text-center">
              <div className="mb-4 flex justify-center items-center gap-2">
                {[...Array(MAX_ATTEMPTS)].map((_, i) => (
                  <div key={i} className={
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold ' +
                    (i < dailyAttempts ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-400')
                  }>
                    {i < dailyAttempts ? '✗' : i + 1}
                  </div>
                ))}
              </div>

              <div className="text-9xl font-bold text-white mb-6">{dailyChar.char}</div>

              {!isBlocked ? (
                <>
                  <p className="text-gray-300 mb-2">{t('daily_guess_meaning_or_pinyin')}</p>
                  <p className="text-sm text-gray-400 mb-6">
                    {remaining === 1 ? t('daily_attempts_left', { count: remaining }) : t('daily_attempts_left_plural', { count: remaining })}
                  </p>

                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && tryGuess()}
                      placeholder={t('daily_your_answer_placeholder')}
                      className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-lg bg-gray-700 text-white placeholder-gray-400"
                      autoFocus
                      disabled={isBlocked}
                    />
                    <Button
                      variant="action"
                      onClick={tryGuess}
                      disabled={isBlocked}
                    >
                      {t('daily_check_button')}
                    </Button>
                  </div>

                  {dailyAttempts > 0 && (
                    <div className="space-y-3">
                      {[...Array(Math.min(dailyAttempts, MAX_ATTEMPTS))].map((_, i) => {
                        const hint = getHint(i + 1, dailyChar, t);
                        return hint ? (
                          <div key={i} className="bg-yellow-900 border-2 border-yellow-700 rounded-lg p-4 text-left">
                            <p className="text-yellow-300 font-semibold">{hint.label}</p>
                            <p className="text-yellow-200">{hint.content}</p>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-6xl mb-2">{dailyComplete ? '✅' : '😔'}</div>
                  <h3 className={'text-2xl font-bold ' + (dailyComplete ? 'text-green-400' : 'text-red-400') }>
                    {dailyComplete ? t('daily_completed_title') : t('daily_out_of_attempts_title')}
                  </h3>
                  {!dailyComplete && (
                    <>
                      <p className="text-gray-300 mb-4">{t('daily_correct_answer_was')}</p>
                      <div className="bg-gray-700 rounded-lg p-6 mb-2">
                        <p className="text-xl text-gray-300 mb-1"><strong>{t('daily_pinyin_label')}</strong> {dailyChar.pinyin}</p>
                        <p className="text-lg text-gray-200 font-semibold"><strong>{t('daily_meaning_label')}</strong> {dailyChar.meaning}</p>
                      </div>
                    </>
                  )}
                  <div className="flex gap-3 justify-center">
                    <button onClick={resetToday} className="bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold py-3 px-6 rounded-lg transition">
                      {t('daily_reset_button')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-400">{t('daily_no_hsk1_data')}</p>
          )}
        </Card>
      </Container>
    </div>
  );
}

export default Daily;
