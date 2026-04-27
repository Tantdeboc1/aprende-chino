import { assetUrl } from './utils/assets';
import { useState, useEffect, useMemo, Suspense } from "react";
import ExamMode from './components/ExamMode.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import LessonDetail from './components/LessonDetail.jsx';
import SettingsScreen from './components/SettingsScreen.jsx';
import ReviewSession from './components/ReviewSession.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import Layout from "@/components/ui/Layout.jsx";
import { loadProgress, saveProgress } from './utils/progress.js';
import { initAudioForIOS } from './utils/audio';
import { useNavigation } from './utils/navigation.js';

// ── Persistencia ──────────────────────────────────────────────────────────────
const LS_USERNAME = 'aprende-chino-username';
function loadUserName() { return localStorage.getItem(LS_USERNAME) || ''; }
function saveUserName(n) { if (n) localStorage.setItem(LS_USERNAME, n); else localStorage.removeItem(LS_USERNAME); }

export default function App() {
  // Forzar modo oscuro
  useEffect(() => {
    const force = () => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.body.classList.add('bg-gray-900', 'text-white');
      document.body.style.backgroundColor = '#111827';
    };
    force();
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', force);
    const iv = setInterval(force, 1000);
    return () => { mq.removeEventListener('change', force); clearInterval(iv); };
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
              isSupplementary: word.isSupplementary || false,
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
    : null;

  // Volver a la pantalla anterior (lesson-detail, intro-detail, home, etc.)
  const goBackToLesson = () => {
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    setScreen(prevScreen || 'home');
  };

  const navigateTo = (key) => {
    if (key === 'sov-game') setScreen('sov-game');
    else if (key === 'time-race') setScreen('time-race');
    else if (key === 'pinyin-connection') setScreen('pinyin-connection');
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-700">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img src="https://flagcdn.com/w160/cn.png" alt="China" className="w-24 h-16 object-cover rounded-sm shadow-lg" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">学中文</h1>
            <p className="text-gray-400">Aprende Chino · HSK 1</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="¿Cómo te llamas?"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && nameInput.trim()) {
                  handleSetUserName(nameInput.trim());
                  setScreen('home');
                }
              }}
              className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-lg bg-gray-700 text-white placeholder-gray-400"
            />
            <button
              onClick={() => {
                if (nameInput.trim()) {
                  handleSetUserName(nameInput.trim());
                  setScreen('home');
                }
              }}
              disabled={!nameInput.trim()}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition"
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
        />
      </Layout>
    );
  }

  // ── REVIEW (SRS) ─────────────────────────────────────────────────────────────
  if (screen === 'review') {
    return (
      <ReviewSession
        allCharacters={allCharacters}
        progress={progress}
        onProgressChange={handleProgressChange}
        goBack={() => setScreen(prevScreen || 'home')}
        speakChinese={speak}
      />
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
    return (
      <Layout activeScreen="home" onNavigate={handleBottomNav}>
        <div className="min-h-screen bg-gray-900 pb-24">
          <div className="bg-gray-800 border-b border-gray-700 border-l-4 border-l-purple-500 px-4 pt-10 pb-4">
            <button onClick={() => setScreen('home')} className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-3 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              Inicio
            </button>
            <h1 className="text-xl font-bold text-white">Introducción</h1>
            <p className="text-purple-400 text-sm mt-0.5">入门 · Fundamentos del chino</p>
          </div>

          <div className="px-4 pt-5 space-y-3 pb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Secciones</p>
            {[
              { key: 'radicals', icon: '🔠', title: 'Radicales', desc: 'Las piezas base de los caracteres chinos', action: () => handleStartIntroExercise('radicals') },
              { key: 'tones',    icon: '🎵', title: 'Tonos',     desc: 'Los 4 tonos del mandarín',                action: () => handleStartIntroExercise('tones')    },
              { key: 'writing',  icon: '✍️', title: 'Escritura', desc: 'Práctica de trazos',                      action: () => handleStartIntroExercise('writing')  },
            ].map(item => (
              <button
                key={item.key}
                onClick={item.action}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3 hover:border-purple-500/50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-900/50 flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                </div>
                <svg className="text-gray-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
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
      screen === 'sov-game' || screen === 'time-race' || screen === 'pinyin-connection') {
    if (!CurrentComponent) {
      return (
        <Layout activeScreen={screen} onNavigate={handleBottomNav}>
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-gray-400">Sección no disponible.</p>
          </div>
        </Layout>
      );
    }
    return (
      <Layout activeScreen={screen} onNavigate={handleBottomNav}>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <p className="text-gray-500 text-sm animate-pulse">Cargando...</p>
          </div>
        }>
          <CurrentComponent {...componentProps} />
        </Suspense>
      </Layout>
    );
  }

  // ── FALLBACK ─────────────────────────────────────────────────────────────────
  return (
    <Layout activeScreen="home" onNavigate={handleBottomNav}>
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Pantalla desconocida: {screen}</p>
      </div>
    </Layout>
  );
}
