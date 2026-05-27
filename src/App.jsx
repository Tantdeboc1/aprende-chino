import { assetUrl } from './utils/assets';
import { useState, useEffect, useMemo, Suspense, lazy, useRef } from "react";
import ErrorBoundary from './components/ErrorBoundary.jsx';
import ExamMode from './components/ExamMode.jsx';
const GlobalExam = lazy(() => import('./components/GlobalExam.jsx'));
import HomeScreen from './components/HomeScreen.jsx';
import LessonDetail from './components/LessonDetail.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';
import ReviewSession from './components/ReviewSession.jsx';
import SplashScreen from './components/SplashScreen.jsx';
const StoriesPage = lazy(() => import('./components/stories/StoriesPage.jsx'));
import Layout from './components/ui/Layout.jsx';
import { J } from '@/styles/tokens';
import { loadProgress, saveProgress } from './utils/progress.js';
import { initAudioForIOS } from './utils/audio';
import { useNavigation } from './utils/navigation.js';

// ── Loader animado (reemplaza el spinner estático en Suspense) ────────────────
function AnimatedLoader() {
  const canvasRef = useRef(null);
  const writerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let writer = null;

    async function init() {
      try {
        const HanziWriter = (await import('hanzi-writer')).default;
        if (cancelled || !canvasRef.current) return;
        writer = HanziWriter.create(canvasRef.current, '学', {
          width: 80, height: 80, padding: 5,
          strokeColor: J.jade, radicalColor: J.red,
          drawingWidth: 3, showCharacter: false, showOutline: true,
          outlineColor: J.mute2,
        });
        writerRef.current = writer;
        function loop() {
          if (cancelled) return;
          writer.animateCharacter({ onComplete: () => { if (!cancelled) setTimeout(loop, 400); } });
        }
        loop();
      } catch (_) {}
    }
    init();
    return () => { cancelled = true; writerRef.current = null; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: J.paper }}>
      <div className="relative">
        <canvas ref={canvasRef} width={80} height={80} />
        <div className="absolute rounded-full animate-spin"
          style={{ width: 92, height: 92, top: -6, left: -6, border: `2px solid ${J.hair}`, borderTopColor: J.jade }} />
      </div>
      <p style={{ color: J.mute, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }} className="animate-pulse">
        Cargando...
      </p>
    </div>
  );
}

// ── Persistencia ──────────────────────────────────────────────────────────────
const LS_USERNAME = 'aprende-chino-username';
function loadUserName() { return localStorage.getItem(LS_USERNAME) || ''; }
function saveUserName(n) { if (n) localStorage.setItem(LS_USERNAME, n); else localStorage.removeItem(LS_USERNAME); }

export default function App() {
  // Jade Pop theme — warm cream paper
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.style.backgroundColor = J.paper;
    document.body.style.color = J.ink;
  }, []);

  // Datos globales
  const [appData, setAppData]           = useState(null);
  const [radicalsData, setRadicalsData] = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [allCharacters, setAllCharacters] = useState([]);
  const [lessonsData, setLessonsData]   = useState([]);

  // Splash
  const [splashProgress, setSplashProgress] = useState(0);
  const [splashDone, setSplashDone]         = useState(false);

  // Usuario
  const [userName, setUserName] = useState(loadUserName);
  const [nameInput, setNameInput] = useState('');

  const handleSetUserName = (name) => {
    setUserName(name);
    saveUserName(name);
  };

  // Progreso
  const [progress, setProgress] = useState(() => loadProgress());
  const handleProgressChange = (updated) => {
    setProgress(updated);
    saveProgress(updated);
  };

  // Pantalla activa
  // 'welcome' | 'home' | 'lesson-detail' | 'intro-detail' | 'exam' | 'exercise' | 'dictionary' | 'minigames' | 'settings'
  const [screen, setScreen] = useState(() => loadUserName() ? 'home' : 'welcome');
  // Pantalla anterior (para volver desde ejercicios)
  const [prevScreen, setPrevScreen] = useState('home');

  // Lección seleccionada (para lesson-detail y ejercicios)
  const [selectedLesson, setSelectedLesson] = useState(1);
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

  // Audio
  const [isSpeaking, setIsSpeaking]           = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // ProfileBadge dispara 'open-settings' desde cualquier pantalla
  useEffect(() => {
    const handler = () => {
      setPrevScreen(prev => prev || 'home');
      setScreen('settings');
    };
    window.addEventListener('open-settings', handler);
    return () => window.removeEventListener('open-settings', handler);
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

  const initializeAudio = async () => {
    if (!audioInitialized) {
      try { await initAudioForIOS(); setAudioInitialized(true); }
      catch (e) { console.error('Error audio:', e); }
    }
  };

  const speak = async (keyOrText, opts = {}) => {
    if (!audioInitialized) await initializeAudio();
    if (isSpeaking) return;
    try {
      setIsSpeaking(true);
      const { speakChineseEnhanced } = await import('./utils/tts-enhanced.js');
      await speakChineseEnhanced(keyOrText, { category: opts.category || 'pronunciation' });
    } catch (e) { console.error('Error speak:', e); }
    finally { setIsSpeaking(false); }
  };

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
        setIsLoading(true);
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

        const tick = () => new Promise(r => setTimeout(r, 80));

        setSplashProgress(25); await tick();
        const res = await fetch(assetUrl('data/libro-data.json'));
        if (!res.ok) throw new Error('No se pudo cargar libro-data.json');
        const data = await res.json();
        setSplashProgress(55); await tick();

        const enriched = [];
        for (const lesson of data.lessons) {
          for (const word of lesson.words) {
            const pNum = word.pinyin || '';
            enriched.push({
              char: word.char, radical: word.radical || '—', meaning: word.meaning,
              type: word.type || '', examples: word.examples || [], tags: [],
              pinyin: fromNumericToMarked(pNum), pinyinNumeric: pNum,
              pinyinPlain: pNum.replace(/[1-4]/g, '').replace(/\s+/g, ''),
              tone: toneFromNumeric(pNum), audioKeys: audioKeysFromNumeric(pNum),
              lesson: lesson.lesson, lessonTitle: lesson.titleEs,
            });
          }
        }

        const lessonsMeta = data.lessons.map(l => ({ lesson: l.lesson, titleZh: l.titleZh, titleEs: l.titleEs }));
        setSplashProgress(70); await tick();

        const radicalsRes = await fetch(assetUrl('data/radicals-data.json'));
        if (!radicalsRes.ok) throw new Error('No se pudo cargar radicals-data.json');
        const radicalsDataRaw = await radicalsRes.json();
        setSplashProgress(88); await tick();
        const radicalsEnriched = Object.entries(radicalsDataRaw.radicals).map(([radical, details]) => ({ radical, ...details }));

        setAllCharacters(enriched);
        setLessonsData(lessonsMeta);
        setAppData({ bookTitle: data.bookTitle });
        setRadicalsData(radicalsEnriched);
        setSplashProgress(100);
      } catch (e) {
        console.error('Error al cargar datos:', e);
        setSplashProgress(100); // completar splash aunque haya error
      } finally {
        setIsLoading(false);
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

  // Navegar desde bottom nav
  const handleBottomNav = (key) => {
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    setPrevScreen(screen);
    if (key === 'home')            setScreen('home');
    else if (key === 'review')     setScreen('review');
    else if (key === 'stories')    setScreen('stories');
    else if (key === 'dictionary') setScreen('dictionary');
    else if (key === 'minigames')  setScreen('minigames');
    else if (key === 'settings')   setScreen('settings');
  };

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
    else if (exerciseKey === 'daily')     { setScreen('exercise'); setDailySection('characters'); }
    else if (exerciseKey === 'minigames') { setScreen('minigames'); }
  };

  // Iniciar ejercicio desde intro
  const handleStartIntroExercise = (exerciseKey) => {
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    setPrevScreen('intro-detail');
    if (exerciseKey === 'radicals')            { setScreen('exercise'); setLearnSection('radicals'); }
    else if (exerciseKey === 'tones')          { setScreen('exercise'); setLearnSection('tones'); }
    else if (exerciseKey === 'writing')        { setScreen('exercise'); setLearnSection('writing'); setWritingSection('radicals'); }
    else if (exerciseKey === 'daily-radicals') { setScreen('exercise'); setDailySection('radicals'); }
    else if (exerciseKey === 'daily-tones')    { setScreen('exercise'); setDailySection('tones'); }
  };

  // navigation.js maneja ejercicios (reutilizamos la lógica existente)
  // Si hay dailySection activo, navegar a 'daily'; si no, a 'learn'
  const navScreen = screen === 'exercise'
    ? (dailySection !== null ? 'daily' : 'learn')
    : screen === 'dictionary' ? 'dictionary'
    : screen === 'minigames' ? 'minigames'
    : screen === 'sov-game' ? 'sov-game'
    : screen === 'time-race' ? 'time-race'
    : screen === 'pinyin-connection' ? 'pinyin-connection'
    : screen === 'translation-game' ? 'translation-game'
    : screen === 'global-exam' ? 'global-exam'
    : screen === 'complete-sentence' ? 'complete-sentence'
    : screen === 'dialogue-order' ? 'dialogue-order'
    : screen === 'find-intruder' ? 'find-intruder'
    : null;

  // Volver a la pantalla anterior (lesson-detail, intro-detail, home, etc.)
  const goBackToLesson = () => {
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    setScreen(prevScreen || 'home');
  };

  const navigateTo = (key) => {
    if (key === 'sov-game') { setPrevScreen(screen); setScreen('sov-game'); }
    else if (key === 'time-race') { setPrevScreen(screen); setScreen('time-race'); }
    else if (key === 'pinyin-connection') { setPrevScreen(screen); setScreen('pinyin-connection'); }
    else if (key === 'global-exam') { setPrevScreen(screen); setScreen('global-exam'); }
    else if (key === 'translation-game') { setPrevScreen(screen); setScreen('translation-game'); }
    else if (key === 'complete-sentence') { setPrevScreen('minigames'); setScreen('complete-sentence'); }
    else if (key === 'dialogue-order') { setPrevScreen('minigames'); setScreen('dialogue-order'); }
    else if (key === 'find-intruder') { setPrevScreen('minigames'); setScreen('find-intruder'); }
    else if (key === 'minigames') setScreen('minigames');
    else if (key === 'dictionary') setScreen('dictionary');
    else handleBottomNav(key);
  };

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
      progress, onProgressChange: handleProgressChange,
    }
  );

  // ── SPLASH ───────────────────────────────────────────────────────────────────
  if (!splashDone) {
    return <SplashScreen progress={splashProgress} onComplete={() => setSplashDone(true)} />;
  }

  // ── WELCOME ──────────────────────────────────────────────────────────────────
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: J.paper }}>
        <div className="max-w-sm w-full" style={{ background: J.paperHi, borderRadius: 22, padding: 32, border: `1px solid ${J.hair}` }}>
          <div className="text-center mb-8">
            <div className="font-cn flex justify-center mb-4"
              style={{ width: 64, height: 64, borderRadius: 16, background: J.jade, color: J.butter,
                       fontSize: 36, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              学
            </div>
            <h1 className="font-cn" style={{ fontSize: 32, fontWeight: 700, color: J.ink, margin: '12px 0 4px' }}>
              学中文
            </h1>
            <p style={{ color: J.inkSoft, fontSize: 14 }}>Aprende Chino · HSK 1</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Como te llamas?"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && nameInput.trim()) {
                  handleSetUserName(nameInput.trim());
                  setScreen('home');
                }
              }}
              style={{
                width: '100%', padding: '14px 18px', border: `2px solid ${J.hair}`, borderRadius: 14,
                fontSize: 16, background: J.paper, color: J.ink, outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = J.jade}
              onBlur={e => e.target.style.borderColor = J.hair}
            />
            <button
              onClick={() => {
                if (nameInput.trim()) {
                  handleSetUserName(nameInput.trim());
                  setScreen('home');
                }
              }}
              disabled={!nameInput.trim()}
              style={{
                width: '100%', padding: '14px 22px', borderRadius: 99, border: 0,
                background: nameInput.trim() ? J.jade : J.mute2,
                color: J.paperHi, fontWeight: 700, fontSize: 15,
                cursor: nameInput.trim() ? 'pointer' : 'default',
                boxShadow: nameInput.trim() ? '0 4px 12px -4px rgba(31,74,51,0.4)' : 'none',
              }}
            >
              Comenzar →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── HOME ─────────────────────────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <Layout activeScreen="home" onNavigate={handleBottomNav}>
        <HomeScreen
          userName={userName}
          progress={progress}
          allCharacters={allCharacters}
          onSelectLesson={goToLesson}
          onSelectIntro={goToIntro}
          onStartReview={() => { setPrevScreen('home'); setScreen('review'); }}
          onOpenSettings={() => { setPrevScreen('home'); setScreen('settings'); }}
        />
      </Layout>
    );
  }

  // ── REVIEW (SRS) ─────────────────────────────────────────────────────────────
  if (screen === 'review') {
    return (
      <Layout activeScreen="review" onNavigate={handleBottomNav}>
        <ReviewSession
          allCharacters={allCharacters}
          progress={progress}
          onProgressChange={handleProgressChange}
          goBack={() => setScreen(prevScreen || 'home')}
          speakChinese={speak}
        />
      </Layout>
    );
  }

  // ── LESSON DETAIL ─────────────────────────────────────────────────────────────
  if (screen === 'lesson-detail') {
    const activeLessonData = lessonsData.find(l => l.lesson === selectedLesson);
    return (
      <Layout activeScreen="home" onNavigate={handleBottomNav}>
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
      </Layout>
    );
  }

  // ── INTRO DETAIL ─────────────────────────────────────────────────────────────
  if (screen === 'intro-detail') {
    const introItems = [
      { key: 'radicals', cn: '部', title: 'Radicales', desc: 'Las piezas base de los caracteres chinos', bg: J.sandBg, fg: J.sandDeep, action: () => handleStartIntroExercise('radicals') },
      { key: 'tones',    cn: '声', title: 'Tonos',     desc: 'Los 4 tonos del mandarín',                bg: J.redBg,  fg: J.redDeep,  action: () => handleStartIntroExercise('tones')    },
      { key: 'writing',  cn: '写', title: 'Escritura', desc: 'Practica de trazos',                      bg: J.jadeBg, fg: J.jadeDeep, action: () => handleStartIntroExercise('writing')  },
    ];
    return (
      <Layout activeScreen="home" onNavigate={handleBottomNav}>
        <div style={{ minHeight: '100vh', background: J.paper, paddingBottom: 90 }}>
          <div style={{ padding: '14px 20px 8px' }}>
            <button onClick={() => setScreen('home')}
              style={{ background: J.paperHi, border: 0, borderRadius: 14, padding: '6px 12px',
                       fontSize: 13, color: J.inkSoft, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}>
              ← Inicio
            </button>
            <h1 style={{ margin: 0, fontWeight: 700, fontSize: 28, letterSpacing: '-0.025em', color: J.ink }}>
              Fundamentos<span style={{ color: J.red }}>.</span>
            </h1>
            <p style={{ color: J.inkSoft, fontSize: 13.5, marginTop: 4 }}>入门 · Radicales, tonos y pinyin</p>
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
                  style={{ width: 44, height: 44, borderRadius: 12, background: item.bg, color: item.fg, fontSize: 22, fontWeight: 700 }}>
                  {item.cn}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontWeight: 700, fontSize: 14, color: J.ink }}>{item.title}</p>
                  <p style={{ color: J.inkSoft, fontSize: 12, marginTop: 2 }}>{item.desc}</p>
                </div>
                <span style={{ fontSize: 14, color: J.mute, fontWeight: 700 }}>→</span>
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
      <ExamMode
        characters={examChars}
        lessonNum={selectedLesson}
        lessonData={activeLessonData}
        progress={progress}
        onProgressChange={handleProgressChange}
        goBack={() => setScreen('lesson-detail')}
      />
    );
  }

  // ── GLOBAL EXAM ──────────────────────────────────────────────────────────────
  if (screen === 'global-exam') {
    return (
      <GlobalExam
        allCharacters={allCharacters}
        progress={progress}
        onProgressChange={handleProgressChange}
        goBack={() => setScreen(prevScreen || 'home')}
      />
    );
  }

  // ── STORIES ──────────────────────────────────────────────────────────────────
  if (screen === 'stories') {
    return (
      <Layout activeScreen="stories" onNavigate={handleBottomNav} hideNav={inStoryMode}>
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

  // ── SETTINGS ─────────────────────────────────────────────────────────────────
  if (screen === 'settings') {
    return (
      <Layout activeScreen="settings" onNavigate={handleBottomNav}>
        <SettingsScreen
          userName={userName}
          onUserNameChange={handleSetUserName}
          progress={progress}
          onProgressChange={handleProgressChange}
          allCharacters={allCharacters}
        />
      </Layout>
    );
  }

  // ── EXERCISE / NAVIGATION ───────────────────────────────────────────────────
  if (screen === 'exercise' || screen === 'dictionary' || screen === 'minigames' ||
      screen === 'sov-game' || screen === 'time-race' || screen === 'pinyin-connection' ||
      screen === 'translation-game' || screen === 'complete-sentence' ||
      screen === 'dialogue-order' || screen === 'find-intruder') {
    const navScreen = screen === 'dictionary' ? 'dictionary' : screen === 'minigames' ? 'minigames' : 'home';
    const hideNav = screen === 'exercise';
    if (!CurrentComponent) {
      return (
        <Layout activeScreen={navScreen} onNavigate={handleBottomNav} hideNav={hideNav}>
          <div className="min-h-screen flex items-center justify-center">
            <p style={{ color: J.mute }}>Seccion no disponible.</p>
          </div>
        </Layout>
      );
    }
    return (
      <Layout activeScreen={navScreen} onNavigate={handleBottomNav} hideNav={hideNav}>
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
    <Layout activeScreen="home" onNavigate={handleBottomNav}>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#928a76]">Pantalla desconocida: {screen}</p>
      </div>
    </Layout>
  );
}
