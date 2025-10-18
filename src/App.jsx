import { assetUrl } from './utils/assets';
import { useState, useEffect, useMemo } from "react";
import Welcome from './components/welcome';
import { playAudioSmart, initAudioForIOS } from './utils/audio';
import Layout from "@/components/ui/Layout.jsx";
import { useNavigation } from './utils/navigation.js';

export default function App() {
  // FORZAR MODO OSCURO SIEMPRE
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = () => {
      document.documentElement.classList.add('dark');
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Global data - HSK1 Y RADICALES
  const [appData, setAppData] = useState(null);
  const [radicalsData, setRadicalsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation
  const [screen, setScreen] = useState('welcome');
  const [userName, setUserName] = useState('');
  const [inputName, setInputName] = useState('');

  // Learn subnavigation
  const [learnSection, setLearnSection] = useState(null);
  const [characterSection, setCharacterSection] = useState(null);
  const [toneSection, setToneSection] = useState(null);
  const [radicalSection, setRadicalSection] = useState(null);
  const [writingSection, setWritingSection] = useState(null);

  // Navegación para desafíos diarios
  const [dailySection, setDailySection] = useState(null);

  // Dictionary / Info
  const [searchTerm, setSearchTerm] = useState('');
  const [infoSection, setInfoSection] = useState(null);

  // Audio state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // FUNCIONES DE NAVEGACIÓN
  const navigateTo = (screenName) => {
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
    console.log('🔗 Navegando a learn con sección:', section);
    setScreen('learn');
    setLearnSection(section);
    setCharacterSection(null);
    setToneSection(null);
    setRadicalSection(null);
    setWritingSection(null);
    setDailySection(null);
  };

  const navigateToDailyWithSection = (section) => {
    console.log('🔗 Navegando a daily con sección:', section);
    setScreen('daily');
    setDailySection(section);
    setLearnSection(null);
  };

  const navigateToWriting = () => {
    console.log('🔗 Navegando directamente a escritura');
    setScreen('learn');
    setLearnSection('writing');
    setWritingSection(null);
    setCharacterSection(null);
    setToneSection(null);
    setRadicalSection(null);
    setDailySection(null);
  };

  const handleHeaderDictionaryClick = () => {
    setScreen('dictionary');
  };

  const initializeAudio = async () => {
    if (!audioInitialized) {
      console.log('🎵 Inicializando audio para iOS...');
      try {
        await initAudioForIOS();
        setAudioInitialized(true);
        console.log('✅ Audio inicializado correctamente');
      } catch (error) {
        console.error('❌ Error inicializando audio:', error);
      }
    }
  };

  // Load data (HSK1 Y RADICALES)
  useEffect(() => {
    const toNumberedFromMarked = (s) => {
      if (!s) return '';
      const parts = String(s).split(/\s+/).filter(Boolean);
      return parts.map(normalizeSyllableToNumbered).join(' ');
    };
    const toPlain = (s) => {
      return String(s || '')
        .toLowerCase()
        .replace(/ǚ/g, 'v')
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

        // CARGAR DATOS HSK1
        const res = await fetch(assetUrl('data/hsk1-data.json'));
        if (!res.ok) throw new Error('No se pudo cargar hsk1-data.json');
        const data = await res.json();
        const baseChars = Array.isArray(data?.characters)
          ? data.characters
          : (Array.isArray(data?.hsk1?.characters) ? data.hsk1.characters : []);
        const charactersEnriched = enrichCharacters(baseChars);

        // CARGAR DATOS DE RADICALES
        const radicalsRes = await fetch(assetUrl('data/radicals-data.json'));
        if (!radicalsRes.ok) throw new Error('No se pudo cargar radicals-data.json');
        const radicalsData = await radicalsRes.json();

        setAppData({ ...data, characters: charactersEnriched });
        setRadicalsData(radicalsData.radicals || radicalsData || []);

      } catch (e) {
        console.error('Error al cargar datos:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const characters = appData ? (appData.characters || appData.hsk1?.characters || []) : [];
  const radicals = radicalsData;

  // Hanzi -> Pinyin map COMPLETO
  const hanziToPinyin = useMemo(() => {
    const map = new Map();

    const charsArray = characters || [];
    charsArray.forEach((ch) => {
      const hanzi = ch.char || ch.hanzi;
      const pinyin = ch.pinyin;
      if (hanzi && pinyin) {
        map.set(hanzi, pinyin);
      }
    });

    console.log('✅ Mapa hanziToPinyin construido con', map.size, 'entradas');
    return map;
  }, [characters]);

  function normalizeSyllableToNumbered(sylRaw) {
    if (!sylRaw) return '';
    let syl = sylRaw.toLowerCase().trim();

    const mNum = syl.match(/^([a-züv]+)([1-4])$/i);
    if (mNum) {
      return mNum[1].replace(/ü/g, 'v') + mNum[2];
    }

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

  // FUNCIÓN SPEAK
  const speak = async (keyOrText, opts = {}) => {
    if (!audioInitialized) {
      await initializeAudio();
    }

    if (isSpeaking) {
      console.log('🔇 Ya está hablando, ignorando nueva petición');
      return;
    }

    const category = opts.category || 'pronunciation';

    try {
      setIsSpeaking(true);

      let textToSpeak = '';
      let isHanziInput = false;

      if (typeof keyOrText === 'string') {
        isHanziInput = /^[\u4e00-\u9fff]+$/.test(keyOrText);
        if (isHanziInput) {
          const chars = Array.from(keyOrText);
          const mapped = chars.map(ch => hanziToPinyin.get(ch)).filter(Boolean);
          textToSpeak = mapped.join(' ');

          if (!textToSpeak) {
            textToSpeak = keyOrText;
          }
        } else {
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

      const syls = textToSpeak
        .replace(/[,.;:!?。，；：！？]/g, ' ')
        .split(/\s+|-/)
        .map(s => s.trim())
        .filter(Boolean);

      for (const syl of syls) {
        let played = false;

        const normalizedSyl = normalizeSyllableToNumbered(syl);
        console.log('📡 Sílaba normalizada:', { original: syl, normalized: normalizedSyl });

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

  // HOOK useNavigation
  const { CurrentComponent, componentProps } = useNavigation(
    screen,
    learnSection,
    writingSection,
    radicalSection,
    characterSection,
    toneSection,
    dailySection,
    {
      userName,
      characters,
      radicals,
      speak,
      navigateTo,
      setLearnSection,
      setCharacterSection,
      setToneSection,
      setRadicalSection,
      setWritingSection,
      setDailySection,
      setScreen,
      searchTerm,
      setSearchTerm,
      goBack: () => setScreen('menu')
    }
  );

  const handleWelcome = async () => {
    if (inputName.trim()) {
      await initializeAudio();
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

  // --- LÓGICA PRINCIPAL ---
  if (screen === 'welcome') {
    return (
      <Welcome
        inputName={inputName}
        setInputName={setInputName}
        handleWelcome={handleWelcome}
        onAudioInit={initializeAudio}
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
