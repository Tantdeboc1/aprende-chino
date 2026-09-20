import { assetUrl } from './utils/assets';
import { hanziCharDataLoader } from './utils/hanziCharData.js';
import { useState, useEffect, useMemo, useCallback, Suspense, useRef } from "react";
import { lazyWithRetry } from './utils/lazyWithRetry.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
const ExamMode = lazyWithRetry(() => import('./components/ExamMode.jsx'));
const GlobalExam = lazyWithRetry(() => import('./components/GlobalExam.jsx'));
const LevelExam = lazyWithRetry(() => import('./components/LevelExam.jsx'));
import HomeScreen from './components/HomeScreen.jsx';
// WelcomeFlow solo se ve la primera vez (sin perfil) — lazy ahorra ~10 kB
// del bundle inicial a usuarios recurrentes, que son la inmensa mayoría.
const WelcomeFlow = lazyWithRetry(() => import('./components/WelcomeFlow.jsx'));
const LessonDetail = lazyWithRetry(() => import('./components/LessonDetail.jsx'));
const SettingsScreen = lazyWithRetry(() => import('./components/SettingsScreen.jsx'));
const ProfileScreen = lazyWithRetry(() => import('./components/ProfileScreen.jsx'));
const FriendsScreen = lazyWithRetry(() => import('./components/FriendsScreen.jsx'));
const ReviewSession = lazyWithRetry(() => import('./components/ReviewSession.jsx'));
import SplashScreen from './components/SplashScreen.jsx';
const StoriesPage = lazyWithRetry(() => import('./components/stories/StoriesPage.jsx'));
const ChinaMap = lazyWithRetry(() => import('./components/china/ChinaMap.jsx'));
const LoginScreen = lazyWithRetry(() => import('./components/LoginScreen.jsx'));
import Layout from './components/ui/Layout.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useTranslation } from 'react-i18next';
import { baseLang } from './utils/loc.js';
import { wordTypeLabel } from './utils/wordType.js';
import { useLocalDataRev } from './hooks/useLocalSnapshot.js';
import { J, resolveColor } from '@/styles/tokens';
import { loadProgress, saveProgress } from './utils/progress.js';
import { getDueCount } from './utils/srs.js';
import { armTour } from './utils/tour.js';
import { STORAGE_KEYS } from './utils/storageKeys.js';
import { fetchJsonCached } from './utils/dataCache.js';
import { initAudioForIOS } from './utils/audio';
import { useNavigation } from './utils/navigation.js';
import { MINIGAME_IDS } from './components/minigames/registry.js';
import { sanitizeUserName } from './utils/nameModeration.js';

// ── Loader animado (reemplaza el spinner estático en Suspense) ────────────────
function AnimatedLoader() {
  const { t } = useTranslation();
  const hostWrapRef = useRef(null);

  useEffect(() => {
    if (!hostWrapRef.current) return;
    let cancelled = false;
    let writer = null;
    // Host imperativo (ver HomeScreen): HanziWriter inyecta su SVG aquí, fuera
    // del árbol que React gestiona, para evitar el 'removeChild' al desmontar
    // (este loader aparece/desaparece en cada navegación a una pantalla lazy).
    const host = document.createElement('div');
    hostWrapRef.current.appendChild(host);

    (async () => {
      try {
        const HanziWriter = (await import('hanzi-writer')).default;
        if (cancelled) return;
        writer = HanziWriter.create(host, '路', {
          charDataLoader: hanziCharDataLoader,
          width: 80, height: 80, padding: 5,
          strokeColor: resolveColor(J.jade), radicalColor: resolveColor(J.red),
          drawingWidth: 3, showCharacter: false, showOutline: true,
          outlineColor: resolveColor(J.mute2),
          // Sin este handler, un fallo al cargar los datos de trazos (404,
          // corte de red…) se propaga como unhandled rejection y satura Sentry.
          // Es un adorno del loader: si falla, lo dejamos vacío en silencio.
          onLoadCharDataError: () => {},
        });
        const loop = () => {
          if (cancelled) return;
          writer.animateCharacter({ onComplete: () => { if (!cancelled) setTimeout(loop, 400); } });
        };
        loop();
      } catch (_) {}
    })();

    return () => {
      cancelled = true;
      try { writer?.pauseAnimation?.(); } catch { /* noop */ }
      try { host.remove(); } catch { /* noop */ }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: J.paper }}>
      <div className="relative" style={{ width: 80, height: 80 }}>
        <div ref={hostWrapRef} style={{ width: 80, height: 80 }} />
        <div className="absolute rounded-full animate-spin"
          style={{ width: 92, height: 92, top: -6, left: -6, border: `2px solid ${J.hair}`, borderTopColor: J.jade }} />
      </div>
      <p style={{ color: J.mute, fontSize: '0.6875rem', letterSpacing: '0.14em', textTransform: 'uppercase' }} className="animate-pulse">
        {t('common_loading', 'Cargando…')}
      </p>
    </div>
  );
}

// ── Persistencia ──────────────────────────────────────────────────────────────
const LS_USERNAME = STORAGE_KEYS.USERNAME;
function loadUserName() {
  const raw = localStorage.getItem(LS_USERNAME) || '';
  const safe = sanitizeUserName(raw, '');
  if (raw !== safe) saveUserName(safe);
  return safe;
}
function saveUserName(n) {
  const safe = sanitizeUserName(n, '');
  if (safe) localStorage.setItem(LS_USERNAME, safe);
  else localStorage.removeItem(LS_USERNAME);
}

// ── Historial del navegador (hash routing) ────────────────────────────────────
// Cada pantalla se refleja en location.hash y el botón atrás del sistema
// (hardware back en Android, gesto atrás) navega dentro de la app en vez de
// cerrarla. También habilita deep links básicos (#/lesson/3, #/stories…).
// El estado interno de los ejercicios (sub-secciones) no se codifica en la URL:
// volver a #/exercise tras recargar muestra el menú de ejercicios.
const HASH_SCREENS = new Set([
  'home', 'review', 'stories', 'dictionary', 'minigames', 'friends',
  'profile', 'settings', 'intro-detail', 'exam', 'global-exam',
  // 'daily' (hub de retos) faltaba: al no entrar en el historial, el botón
  // atrás del sistema cerraba la app en vez de volver al Home.
  'level-exam', 'exercise', 'chinaMap', 'daily',
]);

function screenToHash(screen, selectedLesson) {
  if (screen === 'lesson-detail') return `#/lesson/${selectedLesson}`;
  if (HASH_SCREENS.has(screen) || MINIGAME_IDS.has(screen)) return `#/${screen}`;
  return null; // welcome y pantallas gate no entran al historial
}

function parseHash(hash) {
  const m = String(hash || '').match(/^#\/(.+)$/);
  if (!m) return null;
  const path = m[1];
  const lesson = path.match(/^lesson\/(\d{1,2})$/);
  if (lesson) return { screen: 'lesson-detail', lesson: Number(lesson[1]) };
  // Invitación de amistad compartida: #/friends/add/ABC-DEF. Abre Amigos con
  // el código ya resuelto, para no obligar a teclearlo a mano. No envía nada
  // por su cuenta: la pantalla sigue pidiendo confirmación.
  const friendAdd = path.match(/^friends\/add\/([A-Za-z0-9-]{6,7})$/);
  if (friendAdd) return { screen: 'friends', friendCode: friendAdd[1] };
  if (HASH_SCREENS.has(path) || MINIGAME_IDS.has(path)) return { screen: path };
  return null;
}

export default function App() {
  // El tema (claro/oscuro/sistema) lo aplica initTheme() en main.jsx antes
  // del primer render; aquí ya no forzamos nada para no pisar la preferencia.

  // Idioma activo (para localizar los significados del vocabulario)
  const { t, i18n } = useTranslation();
  const lang = baseLang(i18n.language);

  // Datos globales
  const [radicalsDataRaw, setRadicalsData] = useState([]);
  const [allCharactersRaw, setAllCharacters] = useState([]);
  const [lessonsDataRaw, setLessonsData]   = useState([]);

  // Significados y abreviaturas gramaticales localizados: el dato base guarda
  // el español en `meaning` (+ `meaningTr {en,fr,de,it,pt}`) y la abreviatura
  // en `type`. Aquí resolvemos ambos al idioma activo en UN solo punto, de modo
  // que TODOS los consumidores (diccionario, exámenes, minijuegos, repaso…)
  // reciben ya el texto correcto sin cambios. `wordTypeLabel` además normaliza
  // el `type` (p. ej. "VO"→"VO.") también en español. Reactivo a `lang`.
  const allCharacters = useMemo(() => {
    return allCharactersRaw.map(c => {
      const meaning = (lang !== 'es' && c.meaningTr?.[lang]) ? c.meaningTr[lang] : c.meaning;
      return { ...c, meaning, type: wordTypeLabel(c.type, lang) };
    });
  }, [allCharactersRaw, lang]);

  // Radicales localizados (mismo patrón): significado, explicación y frecuencia.
  const radicalsData = useMemo(() => {
    if (lang === 'es') return radicalsDataRaw;
    return radicalsDataRaw.map(r => ({
      ...r,
      meaning: r.meaningTr?.[lang] || r.meaning,
      explanation: r.explanationTr?.[lang] || r.explanation,
      frequency: r.frequencyTr?.[lang] || r.frequency,
    }));
  }, [radicalsDataRaw, lang]);

  // Lecciones con el título localizado (los consumidores siguen leyendo titleEs).
  const lessonsData = useMemo(() => {
    if (lang === 'es') return lessonsDataRaw;
    return lessonsDataRaw.map(l => {
      const tr = l.titleTr?.[lang];
      return tr ? { ...l, titleEs: tr } : l;
    });
  }, [lessonsDataRaw, lang]);

  // Splash
  const [splashProgress, setSplashProgress] = useState(0);
  const [splashDone, setSplashDone]         = useState(false);

  // Usuario
  const [userName, setUserName] = useState(loadUserName);
  const [lastLesson, setLastLesson] = useState(() => {
    const n = Number(localStorage.getItem(STORAGE_KEYS.LAST_LESSON));
    return Number.isInteger(n) && n >= 1 && n <= 8 ? n : null;
  });

  const handleSetUserName = (name) => {
    setUserName(name);
    saveUserName(name);
    // En modo Google empujamos al instante porque WelcomeFlow ya guardó
    // el avatar y el género en localStorage justo antes de llamar aquí.
    if (mode === 'google') pushSnapshot();
  };

  // Auth — gate antes del WelcomeFlow y trigger de sync a Firestore.
  // localRev cambia cuando localStorage se hidrata desde fuera (login inicial
  // o sync de otro dispositivo) → reaccionamos para releer.
  const { mode, user, pushSnapshot } = useAuth();
  const localRev = useLocalDataRev();

  // Espejos en ref de valores volátiles: permiten que los callbacks que se
  // pasan hacia abajo (speak, navigateTo, handleProgressChange…) sean estables
  // con useCallback([]) sin capturar valores obsoletos. Así un cambio de
  // `progress`/`mode`/`screen` no recrea esos callbacks ni cascada re-renders
  // de la pantalla activa (p. ej. un minijuego a mitad de partida).
  const modeRef = useRef(mode);
  const pushSnapshotRef = useRef(pushSnapshot);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { pushSnapshotRef.current = pushSnapshot; }, [pushSnapshot]);

  // Progreso
  const [progress, setProgress] = useState(() => loadProgress());
  const progressRef = useRef(progress);
  useEffect(() => { progressRef.current = progress; }, [progress]);
  const getProgress = useCallback(() => progressRef.current, []);
  // Debounce del push remoto para no llamar a Firestore en cada tecla.
  const pushTimerRef = useRef(null);
  const handleProgressChange = useCallback((updated) => {
    progressRef.current = updated; // sincronía inmediata para getProgress()
    setProgress(updated);
    const saved = saveProgress(updated);
    window.dispatchEvent(new CustomEvent('progress-save-status', { detail: saved ? (modeRef.current === 'google' ? 'syncing' : 'saved') : 'error' }));
    if (modeRef.current === 'google') {
      clearTimeout(pushTimerRef.current);
      if (saved) pushTimerRef.current = setTimeout(async () => {
        const synced = await pushSnapshotRef.current();
        window.dispatchEvent(new CustomEvent('progress-save-status', { detail: synced ? 'synced' : 'offline' }));
      }, 1500);
    }
  }, []);
  useEffect(() => {
    const retrySync = async () => {
      if (modeRef.current !== 'google') return;
      window.dispatchEvent(new CustomEvent('progress-save-status', { detail: 'syncing' }));
      const synced = await pushSnapshotRef.current();
      window.dispatchEvent(new CustomEvent('progress-save-status', { detail: synced ? 'synced' : 'offline' }));
    };
    window.addEventListener('online', retrySync);
    return () => window.removeEventListener('online', retrySync);
  }, []);

  // Deep link inicial (#/lesson/3, #/stories…): solo si ya hay perfil creado.
  const [initialNav] = useState(() => (loadUserName() ? parseHash(window.location.hash) : null));

  // Pantalla activa
  // 'welcome' | 'home' | 'lesson-detail' | 'intro-detail' | 'exam' | 'exercise' | 'dictionary' | 'minigames' | 'settings'
  const [screen, setScreen] = useState(() => initialNav?.screen || (loadUserName() ? 'home' : 'welcome'));

  // Código de amigo llegado por enlace compartido. Se consume una sola vez:
  // FriendsScreen avisa al usarlo para que un "atrás" no lo vuelva a disparar.
  const [pendingFriendCode, setPendingFriendCode] = useState(() => initialNav?.friendCode || null);

  // Cuando entramos por Google o llega un cambio remoto desde otro
  // dispositivo, AuthContext hidrata localStorage. Reflejamos los cambios
  // en los useState locales para que el render lo pinte.
  useEffect(() => {
    if (mode !== 'google' || !user?.uid) return;
    const remoteName = loadUserName();
    setUserName(remoteName);
    // Conserva la identidad si el contenido no cambió: cada bump de localRev
    // (p. ej. el eco de nuestro propio push) creaba un objeto nuevo que
    // invalidaba todos los useMemo dependientes de `progress` (Home entera).
    setProgress(prev => {
      const next = loadProgress();
      return JSON.stringify(prev) === JSON.stringify(next) ? prev : next;
    });
    const recent = Number(localStorage.getItem(STORAGE_KEYS.LAST_LESSON));
    setLastLesson(Number.isInteger(recent) && recent >= 1 && recent <= 8 ? recent : null);
    // Solo forzamos 'welcome' si aún no se eligió pantalla; respetamos la
    // navegación actual cuando llega un sync remoto a media sesión.
    setScreen(s => (s === 'welcome' && remoteName) ? 'home' : s);
  }, [mode, user?.uid, localRev]);

  // Tras cerrar sesión (mode → null), AuthContext borró localStorage.
  // Reseteamos el estado en memoria para que el siguiente usuario
  // (Google o invitado) no vea los datos del anterior.
  useEffect(() => {
    if (mode !== null) return;
    clearTimeout(pushTimerRef.current);
    const name = loadUserName();
    setUserName(name);
    setProgress(loadProgress());
    setLastLesson(null);
    // Tras signOut el nombre quedó borrado → 'welcome'. Usuarios antiguos
    // (con nombre pero sin modo elegido aún) conservan su 'home'.
    setScreen(name ? 'home' : 'welcome');
  }, [mode]);

  // No dejar un push pendiente al desmontar.
  useEffect(() => () => clearTimeout(pushTimerRef.current), []);
  // Pantalla anterior (para volver desde ejercicios)
  const [prevScreen, setPrevScreen] = useState('home');
  // Espejos en ref para que navigateTo/handleBottomNav/goBackToLesson sean
  // estables (no dependan de screen/prevScreen en sus closures).
  const screenRef = useRef(screen);
  const prevScreenRef = useRef(prevScreen);
  useEffect(() => { screenRef.current = screen; }, [screen]);
  useEffect(() => { prevScreenRef.current = prevScreen; }, [prevScreen]);
  // Pantalla desde la que se entró al hub de Destrezas (home, lesson-detail…).
  // prevScreen es un único slot: al entrar a un minijuego se pisa con
  // 'minigames' (para que el minijuego vuelva al hub), así que al volver del
  // minijuego AL hub hace falta esta copia aparte para restaurar el origen
  // real y que el propio botón "Volver" del hub no acabe apuntando al
  // minijuego que se acaba de abandonar.
  const hubOriginRef = useRef('home');

  // Lección seleccionada (para lesson-detail y ejercicios)
  const [selectedLesson, setSelectedLesson] = useState(initialNav?.lesson ?? 1);
  // Pestaña activa en LessonDetail (para restaurarla al volver)
  const [lessonDetailTab, setLessonDetailTab] = useState('vocab');

  // Sub-navegación de ejercicios (reutiliza navigation.js)
  const [learnSection,     setLearnSection]     = useState(null);
  const [characterSection, setCharacterSection] = useState(null);
  const [toneSection,      setToneSection]      = useState(null);
  const [radicalSection,   setRadicalSection]   = useState(null);
  const [writingSection,   setWritingSection]   = useState(null);
  const [dailySection,     setDailySection]     = useState(null);
  const [searchTerm,       setSearchTerm]       = useState('');
  const [showSupplementary, setShowSupplementary] = useState(true);

  // Sincroniza pantalla → location.hash. La primera vez usa replaceState para
  // no crear una entrada extra al arrancar; después, cada cambio de pantalla
  // crea una entrada (pushState) para que "atrás" recorra la navegación.
  //
  // Siembra de Home: si la app ARRANCA en una pantalla interna (deep link o
  // recarga en #/minigames, #/lesson/3…), esa sería la única entrada del
  // historial y el primer "atrás" del sistema sacaría al usuario de la app.
  // Para evitarlo, en la primera sincronización dejamos #/home como entrada
  // base (replaceState) y la pantalla real encima (pushState): "atrás" lleva
  // a Home en vez de salir. Solo desde Home el atrás sale de la app (el
  // comportamiento estándar de Android).
  const isFirstHashSyncRef = useRef(true);
  useEffect(() => {
    const target = screenToHash(screen, selectedLesson);
    if (!target) return;
    const first = isFirstHashSyncRef.current;
    isFirstHashSyncRef.current = false;
    if (window.location.hash === target) {
      // Deep link/recarga: el hash ya es el destino. Sembrar Home debajo.
      if (first && target !== '#/home') {
        history.replaceState(null, '', '#/home');
        history.pushState(null, '', target);
      }
      return; // (resto de casos: cambio venido de popstate)
    }
    if (first) {
      if (target !== '#/home') {
        history.replaceState(null, '', '#/home');
        history.pushState(null, '', target);
      } else {
        history.replaceState(null, '', target);
      }
    } else {
      history.pushState(null, '', target);
    }
  }, [screen, selectedLesson]);

  // Botón atrás del navegador/sistema → restaura la pantalla del hash.
  useEffect(() => {
    const onPop = () => {
      const parsed = parseHash(window.location.hash);
      if (!parsed || !loadUserName()) return;
      // Mismo reset de sub-secciones que la navegación normal: al volver a
      // #/exercise no hay estado en la URL, así que se muestra su menú.
      setLearnSection(null); setCharacterSection(null); setToneSection(null);
      setRadicalSection(null); setWritingSection(null); setDailySection(null);
      if (parsed.lesson != null) setSelectedLesson(parsed.lesson);
      if (parsed.friendCode) setPendingFriendCode(parsed.friendCode);
      setScreen(parsed.screen);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Audio — el estado "inicializado" vive en audioInitializedRef (ver más abajo),
  // no en useState: nadie lo renderiza y así `speak` puede ser estable.

  // ProfileBadge → 'open-profile' (avatar de la top bar → stats)
  // Engranaje dentro de ProfileScreen → 'open-settings' (configuración).
  // "Ver otra vez" el tutorial → 'open-home': el recorrido tiene que empezar
  // en el Home, que es donde viven sus dos últimos pasos.
  useEffect(() => {
    const toProfile = () => {
      setPrevScreen(prev => prev || 'home');
      setScreen('profile');
    };
    const toSettings = () => {
      setPrevScreen(prev => prev || 'home');
      setScreen('settings');
    };
    const toHome = () => {
      setPrevScreen('home');
      setScreen('home');
    };
    window.addEventListener('open-profile', toProfile);
    window.addEventListener('open-settings', toSettings);
    window.addEventListener('open-home', toHome);
    return () => {
      window.removeEventListener('open-profile', toProfile);
      window.removeEventListener('open-settings', toSettings);
      window.removeEventListener('open-home', toHome);
    };
  }, []);

  // StoryPlayer dispara story-mode-enter/exit para ocultar la bottom nav
  const [inStoryMode, setInStoryMode] = useState(false);
  useEffect(() => {
    const enter = () => setInStoryMode(true);
    const exit  = () => setInStoryMode(false);
    window.addEventListener('story-mode-enter', enter);
    window.addEventListener('story-mode-exit',  exit);
    return () => {
      window.removeEventListener('story-mode-enter', enter);
      window.removeEventListener('story-mode-exit',  exit);
    };
  }, []);

  const audioInitializedRef = useRef(false);
  const initializeAudio = useCallback(async () => {
    if (!audioInitializedRef.current) {
      try { await initAudioForIOS(); audioInitializedRef.current = true; }
      catch (e) { console.error('Error audio:', e); }
    }
  }, []);

  // Guard con ref (no con estado): dos taps rápidos veían ambos el estado
  // sin actualizar (el setState aún no había re-renderizado) y solapaban
  // dos audios. La ref se actualiza síncronamente y cierra esa ventana.
  const speakingRef = useRef(false);
  // `speak` es estable (useCallback []) para no recrear los props de la pantalla
  // activa en cada re-render de App; lee su estado vía refs.
  const speak = useCallback(async (keyOrText, opts = {}) => {
    await initializeAudio();
    if (speakingRef.current) return;
    speakingRef.current = true;
    try {
      const { speakChineseEnhanced } = await import('./utils/tts-enhanced.js');
      await speakChineseEnhanced(keyOrText, { category: opts.category || 'pronunciation' });
    } catch (e) { console.error('Error speak:', e); }
    finally { speakingRef.current = false; }
  }, [initializeAudio]);

  // Cargar datos
  useEffect(() => {
    const toneFromNumeric = (s) => {
      const m = String(s || '').trim().match(/([1-4])/);
      return m ? Number(m[1]) : 0;
    };
    const audioKeysFromNumeric = (s) => {
      const firstSyl = String(s || '').toLowerCase().split(/\s+/)[0];
      const key = firstSyl.replace(/[^a-z0-9v]/g, '');
      const m = key.match(/^([a-zv]+?)([1-4])$/);
      if (!m) return [key];
      return [`${m[1]}${m[2]}`, `${m[1]}-${m[2]}`, `${m[1]}_${m[2]}`, m[1]];
    };

    async function loadData() {
      try {
        setSplashProgress(10);
        const VOWELS = "aeiouvü";
        const TONE_MAP = {
          'a':['ā','á','ǎ','à'],'e':['ē','é','ě','è'],'i':['ī','í','ǐ','ì'],
          'o':['ō','ó','ǒ','ò'],'u':['ū','ú','ǔ','ù'],'ü':['ǖ','ǘ','ǚ','ǜ'],'v':['ǖ','ǘ','ǚ','ǜ']
        };
        const convertSyllable = (syl) => {
          if (!syl) return '';
          const match = String(syl).toLowerCase().match(/^([a-züv]+)([1-4])$/);
          if (!match) return syl.replace(/[0-5]/g, '');
          let base = match[1].replace('v', 'ü');
          const tone = parseInt(match[2]) - 1;
          let vi = -1;
          if (base.includes('a') || base.includes('e')) {
            vi = base.indexOf('a') !== -1 ? base.indexOf('a') : base.indexOf('e');
          } else if (base.includes('ou')) { vi = base.indexOf('o'); }
          else { for (let i = base.length - 1; i >= 0; i--) { if (VOWELS.includes(base[i])) { vi = i; break; } } }
          if (vi !== -1 && TONE_MAP[base[vi]]) {
            return base.substring(0, vi) + TONE_MAP[base[vi]][tone] + base.substring(vi + 1);
          }
          return base;
        };
        const fromNumericToMarked = (p) => {
          if (!p) return '';
          return p.split(' ').map(word => {
            const syls = []; const re = /[a-züv]+[1-4]?/gi; let m;
            while ((m = re.exec(word)) !== null) syls.push(convertSyllable(m[0]));
            return syls.join('');
          }).join(' ');
        };

        setSplashProgress(25);
        // Ambos catálogos son independientes: iniciar sus lecturas a la vez
        // evita que la primera visita espere una descarga después de la otra.
        // fetchJsonCached sirve las visitas posteriores desde Cache API.
        const [data, radicalsDataRaw] = await Promise.all([
          fetchJsonCached('libro-data', assetUrl('data/libro-data.json')),
          fetchJsonCached('radicals-data', assetUrl('data/radicals-data.json')),
        ]);
        setSplashProgress(55);

        const enriched = [];
        for (const lesson of data.lessons) {
          for (const word of lesson.words) {
            const pNum = word.pinyin || '';
            enriched.push({
              char: word.char, radical: word.radical || '—', meaning: word.meaning,
              meaningTr: word.meaningTr || null,
              type: word.type || '', examples: word.examples || [], tags: [],
              pinyin: fromNumericToMarked(pNum), pinyinNumeric: pNum,
              pinyinPlain: pNum.replace(/[1-4]/g, '').replace(/\s+/g, ''),
              tone: toneFromNumeric(pNum), audioKeys: audioKeysFromNumeric(pNum),
              isSupplementary: !!word.isSupplementary,
              lesson: lesson.lesson, lessonTitle: lesson.titleEs,
            });
          }
        }

        const lessonsMeta = data.lessons.map(l => ({ lesson: l.lesson, titleZh: l.titleZh, titleEs: l.titleEs, titleTr: l.titleTr || null }));
        setSplashProgress(70);

        setSplashProgress(88);
        const radicalsEnriched = Object.entries(radicalsDataRaw.radicals).map(([radical, details]) => ({ radical, ...details }));

        setAllCharacters(enriched);
        setLessonsData(lessonsMeta);
        setRadicalsData(radicalsEnriched);
        setSplashProgress(100);
      } catch (e) {
        console.error('Error al cargar datos:', e);
        setSplashProgress(100); // completar splash aunque haya error
      }
    }
    loadData();
  }, []);

  const characters = useMemo(() => {
    let chars = allCharacters;
    if (selectedLesson !== null) chars = chars.filter(c => c.lesson === selectedLesson);
    if (!showSupplementary) chars = chars.filter(c => !c.isSupplementary);
    return chars;
  }, [allCharacters, selectedLesson, showSupplementary]);

  // Navegar al detalle de lección
  const goToLesson = (num) => {
    setSelectedLesson(num);
    setLastLesson(num);
    try { localStorage.setItem(STORAGE_KEYS.LAST_LESSON, String(num)); } catch { /* la lección sigue accesible en esta sesión */ }
    if (mode === 'google') pushSnapshot();
    setLessonDetailTab('vocab'); // reset pestaña al entrar a una lección nueva
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    setScreen('lesson-detail');
  };

  // Navegar a intro
  const goToIntro = () => {
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    setScreen('intro-detail');
  };

  // Repasos vencidos → punto rojo en la pestaña Repaso. La tarjeta que había
  // en el Home desapareció; el aviso vive ahora en la barra, visible desde
  // cualquier pantalla en vez de solo al abrir el Home.
  const dueCount = useMemo(
    () => getDueCount(progress, allCharacters),
    [progress, allCharacters]
  );

  // Navegar desde bottom nav
  const handleBottomNav = useCallback((key) => {
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    setPrevScreen(screenRef.current);
    if (key === 'home')            setScreen('home');
    else if (key === 'review')     setScreen('review');
    // 'practice' es la pestaña; aterriza en Destrezas, que ahora también
    // enlaza Historias. 'stories' sigue existiendo como destino directo.
    else if (key === 'practice')   { hubOriginRef.current = screenRef.current; setScreen('minigames'); }
    else if (key === 'stories')    setScreen('stories');
    else if (key === 'dictionary') setScreen('dictionary');
    else if (key === 'minigames')  { hubOriginRef.current = screenRef.current; setScreen('minigames'); }
    else if (key === 'friends')    setScreen('friends');
    else if (key === 'profile')    setScreen('profile');
    else if (key === 'settings')   setScreen('settings');
  }, []);

  // Iniciar ejercicio desde LessonDetail
  const handleStartExercise = (exerciseKey) => {
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    setPrevScreen('lesson-detail');
    if (exerciseKey === 'exam') { setScreen('exam'); return; }
    if (exerciseKey === 'learn')          { setScreen('exercise'); setLearnSection('characters'); setCharacterSection('lessons'); }
    else if (exerciseKey === 'quiz')      { setScreen('exercise'); setLearnSection('characters'); setCharacterSection('quiz'); }
    else if (exerciseKey === 'matching')  { setScreen('exercise'); setLearnSection('characters'); setCharacterSection('matching'); }
    else if (exerciseKey === 'writing')   { setScreen('exercise'); setLearnSection('writing'); setWritingSection('hanzi'); }
    else if (exerciseKey === 'minigames') { hubOriginRef.current = 'lesson-detail'; setScreen('minigames'); }
  };

  // Iniciar ejercicio desde intro
  const handleStartIntroExercise = (exerciseKey) => {
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    setPrevScreen('intro-detail');
    if (exerciseKey === 'radicals')            { setScreen('exercise'); setLearnSection('radicals'); }
    else if (exerciseKey === 'tones')          { setScreen('exercise'); setLearnSection('tones'); }
    else if (exerciseKey === 'writing')        { setScreen('exercise'); setLearnSection('writing'); setWritingSection('radicals'); }
  };

  // navigation.js maneja ejercicios (reutilizamos la lógica existente)
  // Si hay dailySection activo, navegar a 'daily'; si no, a 'learn'
  const navScreen = screen === 'exercise'
    ? (dailySection !== null ? 'daily' : 'learn')
    : screen === 'dictionary' ? 'dictionary'
    : screen === 'minigames' ? 'minigames'
    : screen === 'global-exam' ? 'global-exam'
    // Cualquier mini-juego del registro pasa su id tal cual.
    : MINIGAME_IDS.has(screen) ? screen
    : null;

  // Volver a la pantalla anterior (lesson-detail, intro-detail, home, etc.)
  const goBackToLesson = useCallback(() => {
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    setScreen(prevScreenRef.current || 'home');
  }, []);

  const navigateTo = useCallback((key) => {
    // Cualquier mini-juego del registro: vuelve al listado de minijuegos al salir.
    if (MINIGAME_IDS.has(key)) {
      setPrevScreen('minigames');
      setScreen(key);
      return;
    }
    if (key === 'global-exam') { setPrevScreen(screenRef.current); setScreen('global-exam'); }
    // Certificación HSK 1: ahora se entra desde Destrezas → Examen.
    else if (key === 'level-exam') { setPrevScreen(screenRef.current); setScreen('level-exam'); }
    // Retos de práctica: ya no hay hub, cada juego se abre desde su tarjeta
    // en Destrezas ('daily-characters', 'daily-tones', 'daily-radicals').
    else if (key.startsWith('daily-')) {
      setPrevScreen(screenRef.current);
      setDailySection(key.slice('daily-'.length));
      setScreen('daily');
    }
    // Vuelta al hub de Destrezas desde dentro de un minijuego: restaurar el
    // origen real (home/lesson-detail…), no screenRef.current — en este punto
    // screenRef.current sigue siendo el minijuego que se está abandonando, y
    // usarlo dejaría el botón "Volver" del hub apuntando de vuelta a él.
    else if (key === 'minigames') { setPrevScreen(hubOriginRef.current); setScreen('minigames'); }
    else if (key === 'dictionary') { setPrevScreen(screenRef.current); setScreen('dictionary'); }
    else handleBottomNav(key);
  }, [handleBottomNav]);

  const { CurrentComponent, componentProps } = useNavigation(
    navScreen || screen, learnSection, writingSection, radicalSection,
    characterSection, toneSection, dailySection,
    {
      userName, characters, allCharacters, radicals: radicalsData, speak, navigateTo,
      setLearnSection, setCharacterSection, setToneSection, setRadicalSection,
      setWritingSection, setDailySection, setScreen,
      searchTerm, setSearchTerm,
      selectedLesson, setSelectedLesson,
      showSupplementary, setShowSupplementary,
      lessonsData,
      goBack: goBackToLesson,
      hubMode: false, goBackToHub: goBackToLesson,
      progress, getProgress, onProgressChange: handleProgressChange,
    }
  );

  // ── SPLASH ───────────────────────────────────────────────────────────────────
  if (!splashDone) {
    return <SplashScreen progress={splashProgress} onComplete={() => setSplashDone(true)} />;
  }

  // ── LOGIN ────────────────────────────────────────────────────────────────────
  // Mientras Firebase resuelve la sesión, mostramos el loader animado.
  if (mode === 'loading') {
    return <AnimatedLoader />;
  }
  // Sin modo elegido aún → puerta de entrada.
  if (mode === null) {
    return <LoginScreen />;
  }

  // ── WELCOME ──────────────────────────────────────────────────────────────────
  if (screen === 'welcome') {
    return (
      <WelcomeFlow
        onComplete={(name) => {
          handleSetUserName(name);
          // Único punto donde se arma el tutorial: quien ya tiene nombre no
          // vuelve a pasar por aquí, así que a los usuarios existentes nunca
          // se les muestra.
          armTour();
          setScreen('home');
        }}
      />
    );
  }

  // ── HOME ─────────────────────────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <Layout activeScreen="home" onNavigate={handleBottomNav} reviewDue={dueCount}>
        <HomeScreen
          userName={userName}
          progress={progress}
          allCharacters={allCharacters}
          onSelectLesson={goToLesson}
          onSelectIntro={goToIntro}
          lastLesson={lastLesson}
          onOpenProfile={() => { setPrevScreen('home'); setScreen('profile'); }}
          onOpenChinaMap={() => { setPrevScreen('home'); setScreen('chinaMap'); }}
        />
      </Layout>
    );
  }

  // ── EXPLORA CHINA (mapa de provincias) ───────────────────────────────────────
  if (screen === 'chinaMap') {
    return (
      <Layout activeScreen="home" onNavigate={handleBottomNav} reviewDue={dueCount}>
        <ErrorBoundary>
          <Suspense fallback={<AnimatedLoader />}>
            <ChinaMap goBack={() => setScreen(prevScreen || 'home')} speakChinese={speak} />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    );
  }

  // ── REVIEW (SRS) ─────────────────────────────────────────────────────────────
  if (screen === 'review') {
    return (
      <Layout activeScreen="review" onNavigate={handleBottomNav} reviewDue={dueCount}>
        <ErrorBoundary>
          <Suspense fallback={<AnimatedLoader />}>
            <ReviewSession
              allCharacters={allCharacters}
              progress={progress}
              onProgressChange={handleProgressChange}
              goBack={() => setScreen(prevScreen || 'home')}
              speakChinese={speak}
            />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    );
  }

  // ── LESSON DETAIL ─────────────────────────────────────────────────────────────
  if (screen === 'lesson-detail') {
    const activeLessonData = lessonsData.find(l => l.lesson === selectedLesson);
    return (
      <Layout activeScreen="home" onNavigate={handleBottomNav} reviewDue={dueCount}>
        <ErrorBoundary>
          <Suspense fallback={<AnimatedLoader />}>
            <LessonDetail
              lessonNum={selectedLesson}
              lessonData={activeLessonData}
              characters={allCharacters}
              progress={progress}
              onProgressChange={handleProgressChange}
              goBack={() => setScreen('home')}
              onStartExercise={handleStartExercise}
              speakChinese={speak}
              defaultTab={lessonDetailTab}
              onTabChange={setLessonDetailTab}
            />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    );
  }

  // ── INTRO DETAIL ─────────────────────────────────────────────────────────────
  if (screen === 'intro-detail') {
    const introItems = [
      { key: 'radicals', cn: '部', title: t('intro_radicals_title'), desc: t('intro_radicals_desc'), bg: J.sandBg, fg: J.sandDeep, action: () => handleStartIntroExercise('radicals') },
      { key: 'tones',    cn: '声', title: t('intro_tones_title'),    desc: t('intro_tones_desc'),    bg: J.redBg,  fg: J.redDeep,  action: () => handleStartIntroExercise('tones')    },
      { key: 'writing',  cn: '写', title: t('intro_writing_title'),  desc: t('intro_writing_desc'),  bg: J.jadeBg, fg: J.jadeDeep, action: () => handleStartIntroExercise('writing')  },
    ];
    return (
      <Layout activeScreen="home" onNavigate={handleBottomNav} reviewDue={dueCount}>
        <div style={{ minHeight: '100vh', background: J.paper, paddingBottom: 90 }}>
          <div style={{ padding: '14px 20px 8px' }}>
            <button onClick={() => setScreen('home')}
              style={{ background: J.paperHi, border: 0, borderRadius: 14, padding: '6px 12px',
                       fontSize: '0.8125rem', color: J.inkSoft, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
              ← {t('intro_back_home')}
            </button>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: '1.75rem', letterSpacing: '-0.025em', color: J.ink }}>
              {t('home_section_basics')}<span style={{ color: J.red }}>.</span>
            </h1>
            <p style={{ color: J.inkSoft, fontSize: '0.84375rem', marginTop: 4 }}>入门 · {t('lesson_intro_subtitle')}</p>
          </div>
          <div style={{ padding: '12px 20px 24px' }} className="space-y-2.5">
            {introItems.map(item => (
              <button
                key={item.key}
                onClick={item.action}
                className="w-full flex items-center gap-3.5 text-left"
                style={{ background: J.paperHi, border: `1px solid ${J.hair}`, borderRadius: 18, padding: '14px 16px', cursor: 'pointer' }}
              >
                <div className="font-cn flex items-center justify-center flex-shrink-0"
                  style={{ width: 44, height: 44, borderRadius: 12, background: item.bg, color: item.fg, fontSize: '1.375rem', fontWeight: 700 }}>
                  {item.cn}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontWeight: 700, fontSize: '0.875rem', color: J.ink }}>{item.title}</p>
                  <p style={{ color: J.inkSoft, fontSize: '0.75rem', marginTop: 2 }}>{item.desc}</p>
                </div>
                <span style={{ fontSize: '0.875rem', color: J.mute, fontWeight: 700 }}>→</span>
              </button>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // ── EXAM ─────────────────────────────────────────────────────────────────────
  if (screen === 'exam') {
    const activeLessonData = lessonsData.find(l => l.lesson === selectedLesson);
    const examChars = allCharacters.filter(c => c.lesson === selectedLesson && !c.isSupplementary);
    return (
      <ErrorBoundary>
        <Suspense fallback={<AnimatedLoader />}>
          <ExamMode
            characters={examChars}
            lessonNum={selectedLesson}
            lessonData={activeLessonData}
            progress={progress}
            onProgressChange={handleProgressChange}
            goBack={() => setScreen('lesson-detail')}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // ── GLOBAL EXAM ──────────────────────────────────────────────────────────────
  if (screen === 'global-exam') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<AnimatedLoader />}>
          <GlobalExam
            allCharacters={allCharacters}
            progress={progress}
            onProgressChange={handleProgressChange}
            goBack={() => setScreen(prevScreen || 'home')}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (screen === 'level-exam') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<AnimatedLoader />}>
          <LevelExam
            allCharacters={allCharacters}
            progress={progress}
            goBack={() => setScreen(prevScreen || 'home')}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // ── STORIES ──────────────────────────────────────────────────────────────────
  if (screen === 'stories') {
    return (
      <Layout activeScreen="stories" onNavigate={handleBottomNav} reviewDue={dueCount} hideNav={inStoryMode}>
        <ErrorBoundary>
          <Suspense fallback={<AnimatedLoader />}>
            <StoriesPage
              userName={userName}
              speak={speak}
              onExit={() => setScreen('home')}
              progress={progress}
              onProgressChange={handleProgressChange}
              allCharacters={allCharacters}
            />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    );
  }

  // ── PROFILE (stats y gamificación) ──────────────────────────────────────────
  if (screen === 'profile') {
    return (
      <Layout activeScreen="profile" onNavigate={handleBottomNav} reviewDue={dueCount}>
        <ErrorBoundary>
          <Suspense fallback={<AnimatedLoader />}>
            <ProfileScreen
              userName={userName}
              progress={progress}
              allCharacters={allCharacters}
              onOpenSettings={() => { setPrevScreen('profile'); setScreen('settings'); }}
              onOpenFriends={() => { setPrevScreen('profile'); setScreen('friends'); }}
            />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    );
  }

  // ── FRIENDS (amistades) ──────────────────────────────────────────────────────
  if (screen === 'friends') {
    return (
      <Layout activeScreen="friends" onNavigate={handleBottomNav} reviewDue={dueCount}>
        <ErrorBoundary>
          <Suspense fallback={<AnimatedLoader />}>
            <FriendsScreen
              userName={userName}
              onBack={() => setScreen(prevScreen === 'profile' ? 'profile' : 'home')}
              initialCode={pendingFriendCode}
              onCodeConsumed={() => setPendingFriendCode(null)}
            />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    );
  }

  // ── SETTINGS ─────────────────────────────────────────────────────────────────
  if (screen === 'settings') {
    return (
      <Layout activeScreen="settings" onNavigate={handleBottomNav} reviewDue={dueCount}>
        <ErrorBoundary>
          <Suspense fallback={<AnimatedLoader />}>
            <SettingsScreen
              userName={userName}
              onUserNameChange={handleSetUserName}
              progress={progress}
              onProgressChange={handleProgressChange}
              allCharacters={allCharacters}
              onBack={prevScreen === 'profile' ? () => setScreen('profile') : undefined}
            />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    );
  }

  // ── EXERCISE / NAVIGATION ───────────────────────────────────────────────────
  if (screen === 'exercise' || screen === 'dictionary' || screen === 'minigames' ||
      screen === 'daily' || MINIGAME_IDS.has(screen)) {
    // Pasamos la screen tal cual (BottomNav resuelve qué tab resalta,
    // incluidos los ids de minijuegos). 'exercise' oculta la nav igualmente.
    const navScreen = screen === 'exercise' ? 'home' : screen;
    const hideNav = screen === 'exercise';
    if (!CurrentComponent) {
      return (
        <Layout activeScreen={navScreen} onNavigate={handleBottomNav} reviewDue={dueCount} hideNav={hideNav}>
          <div className="min-h-screen flex items-center justify-center">
            <p style={{ color: J.mute }}>{t('fallback_section_unavailable', 'Sección no disponible.')}</p>
          </div>
        </Layout>
      );
    }
    return (
      <Layout activeScreen={navScreen} onNavigate={handleBottomNav} reviewDue={dueCount} hideNav={hideNav}>
        <ErrorBoundary>
          <Suspense fallback={<AnimatedLoader />}>
            <CurrentComponent {...componentProps} />
          </Suspense>
        </ErrorBoundary>
      </Layout>
    );
  }

  // ── FALLBACK ─────────────────────────────────────────────────────────────────
  return (
    <Layout activeScreen="home" onNavigate={handleBottomNav} reviewDue={dueCount}>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[var(--mute)]">{t('fallback_unknown_screen', 'Pantalla desconocida:')} {screen}</p>
      </div>
    </Layout>
  );
}
