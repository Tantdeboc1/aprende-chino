import { assetUrl } from './utils/assets';
import { useState, useEffect, useMemo } from "react";
import LessonSelector from './components/LessonSelector';
import LessonHub from './components/LessonHub';
import ExamMode from './components/ExamMode.jsx';
import { loadProgress, saveProgress } from './utils/progress.js';
import { initAudioForIOS } from './utils/audio';
import Layout from "@/components/ui/Layout.jsx";
import { useNavigation } from './utils/navigation.js';

// ── Helpers de persistencia ────────────────────────────────────────────────
const LS_USERNAME = 'aprende-chino-username';
const LS_LESSON   = 'aprende-chino-lesson';

function loadUserName() { return localStorage.getItem(LS_USERNAME) || ''; }
function saveUserName(n) { if (n) localStorage.setItem(LS_USERNAME, n); else localStorage.removeItem(LS_USERNAME); }
function loadLesson() {
  const s = localStorage.getItem(LS_LESSON);
  return s !== null && s !== '' ? Number(s) : null;
}
function saveLesson(n) {
  if (n !== null) localStorage.setItem(LS_LESSON, String(n));
  else localStorage.removeItem(LS_LESSON);
}

export default function App() {
  // FORZAR MODO OSCURO SIEMPRE
  useEffect(() => {
    const forceDarkMode = () => {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('bg-gray-900', 'text-white');
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#ffffff';
    };
    forceDarkMode();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    mediaQuery.addEventListener('change', forceDarkMode);
    const interval = setInterval(forceDarkMode, 1000);
    return () => { mediaQuery.removeEventListener('change', forceDarkMode); clearInterval(interval); };
  }, []);

  // Global data
  const [appData, setAppData] = useState(null);
  const [radicalsData, setRadicalsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allCharacters, setAllCharacters] = useState([]);
  const [lessonsData, setLessonsData] = useState([]);

  // Usuario y lección — iniciados desde localStorage
  const [userName, setUserName] = useState(loadUserName);
  const [selectedLesson, setSelectedLessonState] = useState(loadLesson);
  const [showSupplementary, setShowSupplementary] = useState(true);

  // Wrapper que persiste la lección
  const setSelectedLesson = (n) => {
    setSelectedLessonState(n);
    saveLesson(n);
  };

  // Wrapper que persiste el nombre
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

  // Pantalla inicial: si hay nombre y lección → hub; si hay nombre → selector; si no → selector (con input de nombre)
  const [screen, setScreen] = useState(() => {
    const name = loadUserName();
    const lesson = loadLesson();
    if (name && lesson !== null) return 'lesson-hub';
    return 'lesson-select';
  });

  // Hub mode
  const [hubMode, setHubMode] = useState(false);

  // Learn subnavigation
  const [learnSection, setLearnSection] = useState(null);
  const [characterSection, setCharacterSection] = useState(null);
  const [toneSection, setToneSection] = useState(null);
  const [radicalSection, setRadicalSection] = useState(null);
  const [writingSection, setWritingSection] = useState(null);
  const [dailySection, setDailySection] = useState(null);

  // Dictionary
  const [searchTerm, setSearchTerm] = useState('');
  const [infoSection, setInfoSection] = useState(null);

  // Audio
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const goBackToHub = () => {
    setHubMode(false);
    setScreen('lesson-hub');
    setLearnSection(null);
    setCharacterSection(null);
    setToneSection(null);
    setRadicalSection(null);
    setWritingSection(null);
    setDailySection(null);
  };

  const navigateTo = (screenName) => {
    setHubMode(false);
    setScreen(screenName);
    setLearnSection(null);
    setCharacterSection(null);
    setToneSection(null);
    setRadicalSection(null);
    setWritingSection(null);
    setDailySection(null);
    setInfoSection(null);
  };

  const navigateToLearnWithSection = (section) => {
    setScreen('learn');
    setLearnSection(section);
    setCharacterSection(null);
    setToneSection(null);
    setRadicalSection(null);
    setWritingSection(null);
    setDailySection(null);
  };

  const navigateToDailyWithSection = (section) => {
    setScreen('daily');
    setDailySection(section);
    setLearnSection(null);
  };

  const navigateToWriting = () => {
    setScreen('learn');
    setLearnSection('writing');
    setWritingSection(null);
    setCharacterSection(null);
    setToneSection(null);
    setRadicalSection(null);
    setDailySection(null);
  };

  const handleHeaderDictionaryClick = () => setScreen('dictionary');

  const initializeAudio = async () => {
    if (!audioInitialized) {
      try { await initAudioForIOS(); setAudioInitialized(true); }
      catch (e) { console.error('Error audio:', e); }
    }
  };

  // Load data
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

        const res = await fetch(assetUrl('data/libro-data.json'));
        if (!res.ok) throw new Error('No se pudo cargar libro-data.json');
        const data = await res.json();

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

        const radicalsRes = await fetch(assetUrl('data/radicals-data.json'));
        if (!radicalsRes.ok) throw new Error('No se pudo cargar radicals-data.json');
        const radicalsDataRaw = await radicalsRes.json();
        const radicalsEnriched = Object.entries(radicalsDataRaw.radicals).map(([radical, details]) => ({ radical, ...details }));

        setAllCharacters(enriched);
        setLessonsData(lessonsMeta);
        setAppData({ bookTitle: data.bookTitle });
        setRadicalsData(radicalsEnriched);
      } catch (e) {
        console.error('Error al cargar datos:', e);
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

  const radicals = radicalsData;

  const speak = async (keyOrText, opts = {}) => {
    if (!audioInitialized) await initializeAudio();
    if (isSpeaking) return;
    const category = opts.category || 'pronunciation';
    try {
      setIsSpeaking(true);
      const { speakChineseEnhanced } = await import('./utils/tts-enhanced.js');
      await speakChineseEnhanced(keyOrText, { category });
    } catch (e) { console.error('Error speak:', e); }
    finally { setIsSpeaking(false); }
  };

  const { CurrentComponent, componentProps } = useNavigation(
    screen, learnSection, writingSection, radicalSection,
    characterSection, toneSection, dailySection,
    {
      userName, characters, allCharacters, radicals, speak, navigateTo,
      setLearnSection, setCharacterSection, setToneSection, setRadicalSection,
      setWritingSection, setDailySection, setScreen,
      searchTerm, setSearchTerm,
      selectedLesson, setSelectedLesson,
      showSupplementary, setShowSupplementary,
      lessonsData,
      goBack: () => setScreen('menu'),
      hubMode, goBackToHub,
      progress, onProgressChange: handleProgressChange,
    }
  );

  // Desde el hub, lanzar ejercicio → activar hubMode
  const handleStartExercise = (exerciseKey) => {
    setLearnSection(null); setCharacterSection(null); setToneSection(null);
    setRadicalSection(null); setWritingSection(null); setDailySection(null);
    if (exerciseKey === 'exam') { setHubMode(false); setScreen('exam'); return; }
    setHubMode(true);
    if (exerciseKey === 'learn')     { setScreen('learn'); setLearnSection('characters'); setCharacterSection('lessons'); }
    else if (exerciseKey === 'quiz')      { setScreen('learn'); setLearnSection('characters'); setCharacterSection('quiz'); }
    else if (exerciseKey === 'matching')  { setScreen('learn'); setLearnSection('characters'); setCharacterSection('matching'); }
    else if (exerciseKey === 'writing')   { setScreen('learn'); setLearnSection('writing'); }
    else if (exerciseKey === 'daily')     { setScreen('daily'); setDailySection('characters'); }
    else if (exerciseKey === 'minigames') { setScreen('minigames'); }
  };

  // Selección de lección (desde LessonSelector o desde el menú)
  const handleLessonSelect = (lessonNum, nameOverride) => {
    if (nameOverride) handleSetUserName(nameOverride);
    setSelectedLesson(lessonNum);
    setShowSupplementary(true);
    setScreen(lessonNum !== null ? 'lesson-hub' : 'menu');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📖</div>
          <h1 className="text-2xl font-semibold text-white">Cargando...</h1>
        </div>
      </div>
    );
  }

  if (screen === 'lesson-select') {
    return (
      <LessonSelector
        userName={userName}
        onSetUserName={handleSetUserName}
        lessonsData={lessonsData}
        allCharacters={allCharacters}
        onSelect={handleLessonSelect}
      />
    );
  }

  if (screen === 'lesson-hub' && selectedLesson !== null) {
    const activeLessonData = lessonsData.find(l => l.lesson === selectedLesson);
    return (
      <LessonHub
        lessonNum={selectedLesson}
        lessonData={activeLessonData}
        characters={allCharacters}
        progress={progress}
        onProgressChange={handleProgressChange}
        goBack={() => setScreen('menu')}
        onStartExercise={handleStartExercise}
        speakChinese={speak}
      />
    );
  }

  if (screen === 'exam' && selectedLesson !== null) {
    const activeLessonData = lessonsData.find(l => l.lesson === selectedLesson);
    const examChars = allCharacters.filter(c => c.lesson === selectedLesson && !c.isSupplementary);
    return (
      <ExamMode
        characters={examChars}
        lessonNum={selectedLesson}
        lessonData={activeLessonData}
        progress={progress}
        onProgressChange={handleProgressChange}
        goBack={() => setScreen('lesson-hub')}
      />
    );
  }

  if (CurrentComponent) {
    return (
      <Layout
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
        onHomeClick={() => navigateTo('menu')}
        onLearnWithSection={navigateToLearnWithSection}
        onDailyWithSection={navigateToDailyWithSection}
        onWritingClick={navigateToWriting}
      >
        <div className="p-4">
          <CurrentComponent {...componentProps} />
        </div>
      </Layout>
    );
  }

  return null;
}
