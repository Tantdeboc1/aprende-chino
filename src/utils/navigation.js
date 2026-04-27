// src/utils/navigation.js
import { useMemo, lazy } from 'react';
import { markWordResult, markWordSeen } from './progress.js';
import Menu from '@/components/menu';
import Dictionary from '@/components/Dictionary.jsx';
import InfoIndex from "@/components/info/index.jsx";
import MiniGames from '@/components/MiniGames.jsx';
import LearnMenu from "@/components/learn/LearnMenu.jsx";
import DailyIndex from "@/components/daily/DailyIndex.jsx";
import WritingMenu from "@/components/learn/Writing/index.jsx";
const HanziWriting = lazy(() => import('@/components/learn/Writing/HanziWriting.jsx'));
const RadicalsWriting = lazy(() => import('@/components/learn/Writing/RadicalsWriting.jsx'));
import RadicalsIndex from "@/components/learn/Radicals/index.jsx";
import RadicalsTheory from "@/components/learn/Radicals/RadicalsTheory.jsx";
import RadicalsQuiz from "@/components/learn/Radicals/RadicalsQuiz.jsx";
import RadicalsQuiz2 from "@/components/learn/Radicals/RadicalsQuiz2.jsx";
import CharactersIndex from "@/components/learn/Characters/index.jsx";
import Progressive from "@/components/learn/Characters/Progressive.jsx";
import Quiz from "@/components/learn/Characters/Quiz.jsx";
import Matching from "@/components/learn/Characters/Matching.jsx";
import TonesIndex from "@/components/learn/Tones/index.jsx";
import QuizTone from "@/components/learn/Tones/QuizTone.jsx";
import QuizPronunciation from "@/components/learn/Tones/QuizPronunciation.jsx";
import SpecialSyllables from "@/components/learn/Tones/SpecialSyllables.jsx";
import CharactersDaily from "@/components/daily/CharactersDaily.jsx";
import RadicalsDaily from "@/components/daily/RadicalsDaily.jsx";
import TonesDaily from "@/components/daily/TonesDaily.jsx";
const TimeRace = lazy(() => import('@/components/minigames/TimeRace.jsx'));
const PinyinConnection = lazy(() => import('@/components/minigames/PinyinConnection.jsx'));
const SOVGame = lazy(() => import('@/components/minigames/SOVGame.jsx'));

export function useNavigation(
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
    allCharacters,
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
    selectedLesson,
    setSelectedLesson,
    showSupplementary,
    setShowSupplementary,
    lessonsData,
    goBack,
    hubMode,
    goBackToHub,
    progress,
    onProgressChange,
  }
) {

  const { CurrentComponent, componentProps } = useMemo(() => {
    let Component = null;
    let props = {};

    // Si estamos en modo hub, el botón atrás vuelve al hub
    const hubOr = (fallback) => hubMode ? goBackToHub : fallback;

    // Callbacks de feedback visual: actualizan el progreso al responder ejercicios
    const onTrackResult = (charObj, isCorrect) => {
      if (!charObj?.lesson || !charObj?.char || !onProgressChange) return;
      const updated = markWordResult(progress, charObj.lesson, charObj.char, isCorrect);
      onProgressChange(updated);
    };
    const onTrackSeen = (charObj) => {
      if (!charObj?.lesson || !charObj?.char || !onProgressChange) return;
      const updated = markWordSeen(progress, charObj.lesson, charObj.char);
      onProgressChange(updated);
    };

    // === RUTAS PRINCIPALES ===
    if (screen === 'menu') {
      Component = Menu;
      props = {
        userName,
        navigateTo: (key) => {
          if (key === 'learn' && selectedLesson !== null) {
            setScreen('lesson-hub');
          } else {
            navigateTo(key);
          }
        },
        dailyComplete: false,
        selectedLesson,
        setSelectedLesson,
        lessonsData,
        onChangeLessons: () => setScreen('lesson-select'),
      };
    }

    if (screen === 'dictionary') {
      Component = Dictionary;
      props = {
        goBack,
        characters: allCharacters,
        speakChinese: speak,
        searchTerm,
        setSearchTerm,
        selectedLesson,
        setSelectedLesson,
        showSupplementary,
        setShowSupplementary,
        lessonsData,
      };
    }

    if (screen === 'info') {
      Component = InfoIndex;
      props = { goBack: () => setScreen('menu') };
    }

    // === MINI-JUEGOS ===
    if (screen === 'minigames') {
      Component = MiniGames;
      props = {
        goBack: hubOr(goBack || (() => setScreen('home'))),
        navigateTo
      };
    }

    if (screen === 'sov-game') {
      Component = SOVGame;
      props = {
        goBack: () => { navigateTo('minigames'); },
        selectedLesson,
      };
    }

    if (screen === 'time-race') {
      Component = TimeRace;
      props = {
        goBack: () => { navigateTo('minigames'); },
        characters,
        onTrackResult,
      };
    }

    if (screen === 'pinyin-connection') {
      Component = PinyinConnection;
      props = {
        goBack: () => { navigateTo('minigames'); },
        characters,
        onTrackResult,
      };
    }

    // === APRENDIZAJE - MENÚS PRINCIPALES ===
    if (screen === 'learn' && learnSection === null) {
      Component = LearnMenu;
      props = {
        goBack: hubOr(goBack),
        setLearnSection,
        setToneSection
      };
    }

    if (screen === 'daily' && dailySection === null) {
      Component = DailyIndex;
      props = {
        goBack: hubOr(goBack),
        setDailySection
      };
    }

    // === ESCRITURA ===
    if (screen === 'learn' && learnSection === 'writing' && writingSection === null) {
      Component = WritingMenu;
      props = {
        goBack: hubOr(goBack),
        setWritingSection
      };
    }

    if (screen === 'learn' && learnSection === 'writing' && writingSection === 'hanzi') {
      Component = HanziWriting;
      props = {
        goBack: hubOr(() => setWritingSection(null)),
        characters,
        speakChinese: speak
      };
    }

    if (screen === 'learn' && learnSection === 'writing' && writingSection === 'radicals') {
      Component = RadicalsWriting;
      props = {
        goBack: hubOr(() => setWritingSection(null)),
        radicals,
        speakChinese: speak
      };
    }

    // === RADICALES ===
    if (screen === 'learn' && learnSection === 'radicals' && radicalSection === null) {
      Component = RadicalsIndex;
      props = {
        goBack: hubOr(goBack),
        setRadicalSection,
        radicals
      };
    }

    if (screen === 'learn' && learnSection === 'radicals' && radicalSection === 'theory') {
      Component = RadicalsTheory;
      props = {
        goBack: hubOr(() => setRadicalSection(null)),
        radicals
      };
    }

    if (screen === 'learn' && learnSection === 'radicals' && radicalSection === 'quiz1') {
      Component = RadicalsQuiz;
      props = {
        goBack: hubOr(() => setRadicalSection(null)),
        radicals
      };
    }

    if (screen === 'learn' && learnSection === 'radicals' && radicalSection === 'quiz2') {
      Component = RadicalsQuiz2;
      props = {
        goBack: hubOr(() => setRadicalSection(null)),
        radicals
      };
    }

    // === CARACTERES ===
    if (screen === 'learn' && learnSection === 'characters' && characterSection === null) {
      Component = CharactersIndex;
      props = {
        goBack: hubOr(goBack),
        setCharacterSection,
        setCurrentLesson: () => {}
      };
    }

    if (screen === 'learn' && learnSection === 'characters' && characterSection === 'lessons') {
      Component = Progressive;
      props = {
        goBack: goBack,
        characters,
        speakChinese: speak,
        onTrackSeen,
      };
    }

    if (screen === 'learn' && learnSection === 'characters' && characterSection === 'quiz') {
      Component = Quiz;
      props = {
        goBack: goBack,
        characters,
        speakChinese: speak,
        onTrackResult,
      };
    }

    if (screen === 'learn' && learnSection === 'characters' && characterSection === 'matching') {
      Component = Matching;
      props = {
        goBack: goBack,
        characters,
        onTrackSeen,
      };
    }

    // === TONOS ===
    if (screen === 'learn' && learnSection === 'tones' && toneSection === null) {
      Component = TonesIndex;
      props = {
        goBack: hubOr(goBack),
        toneSection,
        setToneSection,
        speakChinese: speak
      };
    }

    if (screen === 'learn' && learnSection === 'tones' && toneSection === 'quizTone') {
      Component = QuizTone;
      props = {
        goBack: () => setToneSection(null),
        speakChinese: speak
      };
    }

    if (screen === 'learn' && learnSection === 'tones' && toneSection === 'quizPronunciation') {
      Component = QuizPronunciation;
      props = {
        goBack: () => setToneSection(null),
        speakChinese: speak
      };
    }

    if (screen === 'learn' && learnSection === 'tones' && toneSection === 'specialSyllables') {
      Component = SpecialSyllables;
      props = {
        goBack: () => setToneSection(null),
        speakChinese: speak
      };
    }

    // === DESAFÍOS DIARIOS ===
    if (screen === 'daily' && dailySection === 'characters') {
      Component = CharactersDaily;
      props = {
        goBack: goBack
      };
    }

    if (screen === 'daily' && dailySection === 'radicals') {
      Component = RadicalsDaily;
      props = {
        goBack: goBack,
        radicals
      };
    }

    if (screen === 'daily' && dailySection === 'tones') {
      Component = TonesDaily;
      props = {
        goBack: goBack,
        speakChinese: speak
      };
    }

    return { CurrentComponent: Component, componentProps: props };

  }, [
    screen, learnSection, writingSection, radicalSection,
    characterSection, toneSection, dailySection,
    userName, characters, allCharacters, radicals, speak, navigateTo,
    setLearnSection, setCharacterSection, setToneSection, setRadicalSection,
    setWritingSection, setDailySection, setScreen,
    searchTerm, setSearchTerm,
    selectedLesson, setSelectedLesson, showSupplementary, setShowSupplementary,
    lessonsData, goBack, hubMode, goBackToHub,
    progress, onProgressChange,
  ]);

  return { CurrentComponent, componentProps };
}
