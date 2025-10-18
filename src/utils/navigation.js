// src/utils/navigation.js
import { useMemo } from 'react';
import Menu from '@/components/menu';
import Dictionary from '@/components/Dictionary.jsx';
import InfoIndex from "@/components/info/index.jsx";
import LearnMenu from "@/components/learn/LearnMenu.jsx";
import DailyIndex from "@/components/daily/DailyIndex.jsx";
import WritingMenu from "@/components/learn/Writing/index.jsx";
import HanziWriting from '@/components/learn/Writing/HanziWriting.jsx';
import RadicalsWriting from '@/components/learn/Writing/RadicalsWriting.jsx';
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
    goBack
  }
) {

  const { CurrentComponent, componentProps } = useMemo(() => {
    let Component = null;
    let props = {};

    // === RUTAS PRINCIPALES ===
    if (screen === 'menu') {
      Component = Menu;
      props = {
        userName,
        navigateTo,
        dailyComplete: false,
        onWritingClick: () => navigateTo('learn', 'writing')
      };
    }

    if (screen === 'dictionary') {
      Component = Dictionary;
      props = {
        goBack,
        characters,
        speakChinese: speak,
        searchTerm,
        setSearchTerm
      };
    }

    if (screen === 'info') {
      Component = InfoIndex;
      props = {
        goBack: () => setScreen('menu')
      };
    }

    // === APRENDIZAJE - MENÚS PRINCIPALES ===
    if (screen === 'learn' && learnSection === null) {
      Component = LearnMenu;
      props = {
        goBack: () => setScreen('menu'),
        setLearnSection,
        setToneSection
      };
    }

    if (screen === 'daily' && dailySection === null) {
      Component = DailyIndex;
      props = {
        goBack: () => setScreen('menu'),
        setDailySection
      };
    }

    // === ESCRITURA ===
    if (screen === 'learn' && learnSection === 'writing' && writingSection === null) {
      Component = WritingMenu;
      props = {
        goBack: () => setLearnSection(null),
        setWritingSection
      };
    }

    if (screen === 'learn' && learnSection === 'writing' && writingSection === 'hanzi') {
      Component = HanziWriting;
      props = {
        goBack: () => setWritingSection(null),
        characters,
        speakChinese: speak
      };
    }

    if (screen === 'learn' && learnSection === 'writing' && writingSection === 'radicals') {
      Component = RadicalsWriting;
      props = {
        goBack: () => setWritingSection(null),
        radicals,
        speakChinese: speak
      };
    }

    // === RADICALES ===
    if (screen === 'learn' && learnSection === 'radicals' && radicalSection === null) {
      Component = RadicalsIndex;
      props = {
        goBack: () => setLearnSection(null),
        setRadicalSection,
        radicals
      };
    }

    if (screen === 'learn' && learnSection === 'radicals' && radicalSection === 'theory') {
      Component = RadicalsTheory;
      props = {
        goBack: () => setRadicalSection(null),
        radicals
      };
    }

    if (screen === 'learn' && learnSection === 'radicals' && radicalSection === 'quiz1') {
      Component = RadicalsQuiz;
      props = {
        goBack: () => setRadicalSection(null),
        radicals
      };
    }

    if (screen === 'learn' && learnSection === 'radicals' && radicalSection === 'quiz2') {
      Component = RadicalsQuiz2;
      props = {
        goBack: () => setRadicalSection(null),
        radicals
      };
    }

    // === CARACTERES ===
    if (screen === 'learn' && learnSection === 'characters' && characterSection === null) {
      Component = CharactersIndex;
      props = {
        goBack: () => setLearnSection(null),
        setCharacterSection,
        setCurrentLesson: () => {}
      };
    }

    if (screen === 'learn' && learnSection === 'characters' && characterSection === 'lessons') {
      Component = Progressive;
      props = {
        goBack: () => setCharacterSection(null),
        characters,
        speakChinese: speak
      };
    }

    if (screen === 'learn' && learnSection === 'characters' && characterSection === 'quiz') {
      Component = Quiz;
      props = {
        goBack: () => setCharacterSection(null),
        characters,
        speakChinese: speak
      };
    }

    if (screen === 'learn' && learnSection === 'characters' && characterSection === 'matching') {
      Component = Matching;
      props = {
        goBack: () => setCharacterSection(null),
        characters
      };
    }

    // === TONOS ===
    if (screen === 'learn' && learnSection === 'tones' && toneSection === null) {
      Component = TonesIndex;
      props = {
        goBack: () => setLearnSection(null),
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
        goBack: () => setDailySection(null)
      };
    }

    if (screen === 'daily' && dailySection === 'radicals') {
      Component = RadicalsDaily;
      props = {
        goBack: () => setDailySection(null),
        radicals
      };
    }

    if (screen === 'daily' && dailySection === 'tones') {
      Component = TonesDaily;
      props = {
        goBack: () => setDailySection(null),
        speakChinese: speak
      };
    }

    return { CurrentComponent: Component, componentProps: props };

  }, [
    screen, learnSection, writingSection, radicalSection,
    characterSection, toneSection, dailySection,
    userName, characters, radicals, speak, navigateTo,
    setLearnSection, setCharacterSection, setToneSection,
    setRadicalSection, setWritingSection, setDailySection,
    setScreen, searchTerm, setSearchTerm, goBack
  ]);

  return { CurrentComponent, componentProps };
}
