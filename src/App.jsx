// === src/App.jsx (VERSIÓN COMPLETA CON LAYOUT) ===
import { assetUrl } from './utils/assets';
import { useState, useEffect, useMemo } from "react";
import Welcome from './components/welcome';
import Menu from './components/menu';
import Dictionary from './components/Dictionary.jsx';
import LearnMenu from './components/learn/LearnMenu.jsx';
import CharactersIndex from './components/learn/Characters/index.jsx';
import Quiz from './components/learn/Characters/Quiz.jsx';
import Matching from './components/learn/Characters/Matching.jsx';
import Progressive from './components/learn/Characters/Progressive.jsx';
import TonesIndex from './components/learn/Tones/index.jsx';
import InfoIndex from "./components/info/index.jsx";
import Daily from './components/Daily.jsx';
import SpecialSyllables from './components/learn/Tones/SpecialSyllables.jsx';
import QuizTone from './components/learn/Tones/QuizTone.jsx';
import QuizPronunciation from './components/learn/Tones/QuizPronunciation.jsx';
import { playAudioSmart } from './utils/audio';
import Layout from "@/components/ui/Layout.jsx";

const ArrowLeft = ({className = ""}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" x2="5" y1="12" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </svg>
);

export default function App() {
  // 🔥 FORZAR MODO OSCURO SIEMPRE
  useEffect(() => {
    // Forzar la clase 'dark' en el elemento html
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    
    // Prevenir que el sistema operativo cambie el tema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      document.documentElement.classList.add('dark');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Global data
  const [appData, setAppData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation
  const [screen, setScreen] = useState('welcome');
  const [userName, setUserName] = useState('');
  const [inputName, setInputName] = useState('');

  // Learn subnavigation
  const [learnSection, setLearnSection] = useState(null);
  const [characterSection, setCharacterSection] = useState(null);
  const [toneSection, setToneSection] = useState(null);

  // Dictionary / Info
  const [searchTerm, setSearchTerm] = useState('');
  const [infoSection, setInfoSection] = useState(null);

  // Audio state
  const [isSpeaking, setIsSpeaking] = useState(false);

  const navigateTo = (screenName) => {
    setScreen(screenName);
    setLearnSection(null);
    setCharacterSection(null);
    setToneSection(null);
    setInfoSection(null);
  };

  // 🔥 FUNCIONES PARA EL LAYOUT
  const handleHeaderDictionaryClick = () => {
    setScreen('dictionary');
  };

  // Load data (HSK1, tones, etc.)
  useEffect(() => {
    // Helpers para enriquecer el dataset de caracteres sin modificar el JSON original
    const toNumberedFromMarked = (s) => {
      if (!s) return '';
      const parts = String(s).split(/\s+/).filter(Boolean);
      return parts.map(normalizeSyllableToNumbered).join(' ');
    };
    const toPlain = (s) => {
      return String(s || '')
        .toLowerCase()
        .replace(/Ǭ/g, 'v')
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        .replace(/[1-4]/g, '')
        .trim();
    };
    const toneFromNumeric = (s) => {
      const m = String(s || '').trim().match(/([1-4])$/);
      return m ? Number(m[1]) : 0;
    };
    const audioKeysFromNumeric = (s) => {
      const key = String(s || '').toLowerCase().replace(/\s+/g, '_');
      const m = key.match(/^([a-zv_]+?)([1-4])$/);
      if (!m) return [key];
      const base = m[1];
      const t = m[2];
      return [
        `${base}${t}`,
        `${base}-${t}`,
        `${base}_${t}`,
        base
      ];
    };
    const enrichCharacters = (arr) => {
      if (!Array.isArray(arr)) return [];
      return arr.map((it) => {
        const p = it.pinyin || '';
        const pNum = toNumberedFromMarked(p);
        const pPlain = toPlain(pNum || p);
        const tone = toneFromNumeric(pNum);
        const audioKeys = audioKeysFromNumeric(pNum || pPlain);
        return {
          ...it,
          pinyinNumeric: pNum,
          pinyinPlain: pPlain,
          tone,
          audioKeys
        };
      });
    };

    async function loadData() {
      try {
        setIsLoading(true);
        const res = await fetch(assetUrl('data/hsk1-data.json'));
        if (!res.ok) throw new Error('No se pudo cargar hsk1-data.json');
        const data = await res.json();
        // Unificar y enriquecer personajes HSK1 sin romper compatibilidad
        const baseChars = Array.isArray(data?.characters)
          ? data.characters
          : (Array.isArray(data?.hsk1?.characters) ? data.hsk1.characters : []);
        const charactersEnriched = enrichCharacters(baseChars);
        setAppData({ ...data, characters: charactersEnriched });
      } catch (e) {
        console.error('Error al cargar datos:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const characters = appData ? (appData.characters || appData.hsk1?.characters || []) : [];
  const vowels = appData ? (appData.vowels || []) : [];
  const consonants = appData ? (appData.consonants || []) : [];
  const specialSyllables = appData ? (appData.specialSyllables || []) : [];

  // Hanzi -> Pinyin map COMPLETO (incluye specialSyllables, vowels, consonants)
  const hanziToPinyin = useMemo(() => {
    const map = new Map();
    
    // 1. Mapear CHARACTERS (汉字)
    const charsArray = characters || [];
    charsArray.forEach((ch) => {
      const hanzi = ch.char || ch.hanzi;
      const pinyin = ch.pinyin;
      if (hanzi && pinyin) {
        map.set(hanzi, pinyin);
      }
    });
    
    // 2. Mapear SPECIAL SYLLABLES (音节 especiales)
    const specialArray = specialSyllables || [];
    specialArray.forEach((syllable) => {
      const pinyinKey = syllable.pinyin;
      if (pinyinKey) {
        map.set(pinyinKey, pinyinKey);
      }
    });
    
    // 3. Mapear VOWELS (元音)
    const vowelsArray = vowels || [];
    vowelsArray.forEach((vowel) => {
      const vowelChar = vowel.char;
      if (vowelChar) {
        map.set(vowelChar, vowelChar);
      }
    });
    
    // 4. Mapear CONSONANTS (辅音)  
    const consonantsArray = consonants || [];
    consonantsArray.forEach((consonant) => {
      const consonantPinyin = consonant.pinyin;
      if (consonantPinyin) {
        map.set(consonantPinyin, consonantPinyin);
      }
    });

    console.log('✅ Mapa hanziToPinyin construido con', map.size, 'entradas');
    
    return map;
  }, [characters, specialSyllables, vowels, consonants]);

  // Convierte una sílaba con diacríticos a número (ni3, lv4, zhi1...)
  function normalizeSyllableToNumbered(sylRaw) {
    if (!sylRaw) return '';
    let syl = sylRaw.toLowerCase().trim();

    // Si ya tiene número de tono, normalizamos ü->v y devolvemos
    const mNum = syl.match(/^([a-züv]+)([1-4])$/i);
    if (mNum) {
      return mNum[1].replace(/ü/g, 'v') + mNum[2];
    }

    // Tabla de vocales con tono
    const toneMap = {
      'ā':'a1','á':'a2','ǎ':'a3','à':'a4',
      'ē':'e1','é':'e2','ě':'e3','è':'e4',
      'ī':'i1','í':'i2','ǐ':'i3','ì':'i4',
      'ō':'o1','ó':'o2','ǒ':'o3','ò':'o4',
      'ū':'u1','ú':'u2','ǔ':'u3','ù':'u4',
      'ǖ':'v1','ǘ':'v2','ǚ':'v3','ǜ':'v4',
      'ü':'v'
    };

    let base = '';
    let tone = 0;
    for (const ch of syl) {
      if (toneMap[ch]) {
        const rep = toneMap[ch];
        if (rep.length === 2) {
          base += rep[0];
          tone = Number(rep[1]);
        } else {
          base += rep;
        }
      } else {
        base += ch;
      }
    }
    if (!tone) return base;
    return base + tone;
  }

  // Genera variantes de nombre de archivo para maximizar acierto
  function candidatesForAudioKey(syl) {
    const base = syl.replace(/ü/g, 'v');
    const m = base.match(/^([a-zv]+)([1-4])$/);
    const forms = new Set();

    if (m) {
      const stem = m[1];
      const tone = m[2];
      forms.add(`${stem}${tone}`);
      forms.add(`${stem}-${tone}`);
      forms.add(`${stem}_${tone}`);
      forms.add(stem);
    } else {
      forms.add(base);
      for (const t of ['1','2','3','4']) {
        forms.add(`${base}${t}`);
        forms.add(`${base}-${t}`);
        forms.add(`${base}_${t}`);
      }
    }
    return Array.from(forms);
  }

  // 📣 FUNCIÓN SPEAK CORREGIDA - BUSCA PINYIN NORMALIZADO EN MANIFEST
  const speak = async (keyOrText, opts = {}) => {
    // 🔥 PROTECCIÓN: Si ya está hablando, no hacer nada
    if (isSpeaking) {
      console.log('🔇 Ya está hablando, ignorando nueva petición');
      return;
    }

    const category = opts.category || 'pronunciation';

    try {
      setIsSpeaking(true);

      // 1) Determinar el texto a pronunciar y SI es hanzi
      let textToSpeak = '';
      let isHanziInput = false;
      
      if (typeof keyOrText === 'string') {
        isHanziInput = /^[\u4e00-\u9fff]+$/.test(keyOrText);
        if (isHanziInput) {
          // Es un carácter Hanzi - buscar en el mapa
          const chars = Array.from(keyOrText);
          const mapped = chars.map(ch => hanziToPinyin.get(ch)).filter(Boolean);
          textToSpeak = mapped.join(' ');
          
          // Si no encontramos pinyin, usar el hanzi original para TTS
          if (!textToSpeak) {
            textToSpeak = keyOrText;
          }
        } else {
          // Es pinyin o texto - usar directamente
          textToSpeak = keyOrText;
        }
      } else if (keyOrText && typeof keyOrText === 'object') {
        textToSpeak = keyOrText.pinyin || keyOrText.hanzi || '';
        isHanziInput = /^[\u4e00-\u9fff]+$/.test(textToSpeak);
      }

      if (!textToSpeak) {
        console.log('❌ Texto vacío, no se puede reproducir');
        return;
      }

      console.log('🔊 Procesando:', { 
        input: keyOrText, 
        output: textToSpeak, 
        isHanziInput 
      });

      // 2) Procesar sílabas
      const syls = textToSpeak
        .replace(/[,.;:!?，。；：！？]/g, ' ')
        .split(/\s+|-/)
        .map(s => s.trim())
        .filter(Boolean);

      // 3) Reproducir cada sílaba
      for (const syl of syls) {
        let played = false;
        
        // 🔥 CORRECCIÓN CLAVE: Normalizar la sílaba para buscar en manifest
        const normalizedSyl = normalizeSyllableToNumbered(syl);
        console.log('🔡 Sílaba normalizada:', { original: syl, normalized: normalizedSyl });
        
        // Probar variantes de MP3 con la sílaba NORMALIZADA
        const allCandidates = candidatesForAudioKey(normalizedSyl);
        console.log('🔍 Candidatos a probar:', allCandidates);
        
        for (const key of allCandidates) {
          try {
            console.log('🔊 Probando key en manifest:', key);
            const ok = await playAudioSmart(category, key, null);
            if (ok) { 
              played = true; 
              console.log('✅ MP3 reproducido con éxito para:', key);
              break; 
            }
          } catch (error) {
            console.error('Error reproduciendo MP3:', error);
          }
        }
        
        // Si no se encontró MP3, usar TTS con la sílaba ORIGINAL
        if (!played) {
          console.log('🎯 Ningún MP3 funcionó, usando TTS para:', syl);
          try {
            await playAudioSmart(category, syl, syl);
          } catch (error) {
            console.error('Error con TTS:', error);
          }
        }
      }

    } catch (error) {
      console.error('❌ Error grave en función speak:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleWelcome = () => {
    if (inputName.trim()) {
      setUserName(inputName.trim());
      setScreen('menu');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📖</div>
          <h1 className="text-2xl font-semibold text-gray-700">Cargando datos...</h1>
        </div>
      </div>
    );
  }

  // --- Screens ---
  if (screen === 'welcome') {
    return (
      <Welcome
        inputName={inputName}
        setInputName={setInputName}
        handleWelcome={handleWelcome}
      />
    );
  }

  if (screen === 'menu') {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <Menu
            userName={userName}
            navigateTo={navigateTo}
            dailyComplete={false}
          />
        </div>
      </Layout>
    );
  }

  if (screen === 'learn' && learnSection === null) {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <LearnMenu
            goBack={() => setScreen('menu')}
            setLearnSection={setLearnSection}
            setToneSection={setToneSection}
          />
        </div>
      </Layout>
    );
  }

  if (screen === 'learn' && learnSection === 'characters' && characterSection === null) {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <CharactersIndex
            goBack={() => setLearnSection(null)}
            setCharacterSection={setCharacterSection}
            setCurrentLesson={() => {}}
          />
        </div>
      </Layout>
    );
  }

  if (screen === 'learn' && learnSection === 'characters' && characterSection === 'lessons') {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <Progressive
            goBack={() => setCharacterSection(null)}
            characters={characters}
            speakChinese={speak}
          />
        </div>
      </Layout>
    );
  }

  if (screen === 'learn' && learnSection === 'characters' && characterSection === 'quiz') {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <Quiz
            goBack={() => setCharacterSection(null)}
            characters={characters}
            speakChinese={speak}
          />
        </div>
      </Layout>
    );
  }

  if (screen === 'learn' && learnSection === 'characters' && characterSection === 'matching') {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <Matching
            goBack={() => setCharacterSection(null)}
            characters={characters}
          />
        </div>
      </Layout>
    );
  }

  if (screen === 'learn' && learnSection === 'tones' && toneSection === null) {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <TonesIndex
            goBack={() => setLearnSection(null)}
            toneSection={toneSection}
            setToneSection={setToneSection}
            speakChinese={speak}
          />
        </div>
      </Layout>
    );
  }

  if (screen === 'learn' && learnSection === 'tones' && toneSection === 'quizTone') {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <QuizTone goBack={() => setToneSection(null)} speakChinese={speak} />
        </div>
      </Layout>
    );
  }

  if (screen === 'learn' && learnSection === 'tones' && toneSection === 'quizPronunciation') {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <QuizPronunciation goBack={() => setToneSection(null)} speakChinese={speak} />
        </div>
      </Layout>
    );
  }

  if (screen === 'learn' && learnSection === 'tones' && toneSection === 'specialSyllables') {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <SpecialSyllables goBack={() => setToneSection(null)} speakChinese={speak} />
        </div>
      </Layout>
    );
  }

  if (screen === 'dictionary') {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <Dictionary
            goBack={() => setScreen('menu')}
            characters={characters}
            speakChinese={speak}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </Layout>
    );
  }

  if (screen === 'info') {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <InfoIndex goBack={() => setScreen('menu')} />
        </div>
      </Layout>
    );
  }

  if (screen === 'daily') {
    return (
      <Layout 
        onDictionaryClick={handleHeaderDictionaryClick}
        onNavigate={navigateTo}
      >
        <div className="p-4">
          <Daily goBack={() => setScreen('menu')} />
        </div>
      </Layout>
    );
  }

  return null;
}
