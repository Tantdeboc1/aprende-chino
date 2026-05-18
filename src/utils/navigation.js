// src/utils/navigation.js
import { useMemo, lazy } from 'react';
import { markWordResult, markWordSeen } from './progress.js';
import { updateChallengeProgress } from './dailyChallenges.js';
import { initSRSCard, updateSRS } from './srs.js';

// ── Lazy-loaded components — cada uno genera su propio chunk ────────────────
const Menu             = lazy(() => import('@/components/menu'));
const Dictionary       = lazy(() => import('@/components/Dictionary.jsx'));
const InfoIndex        = lazy(() => import('@/components/info/index.jsx'));
const MiniGames        = lazy(() => import('@/components/MiniGames.jsx'));
const LearnMenu        = lazy(() => import('@/components/learn/LearnMenu.jsx'));
const DailyIndex       = lazy(() => import('@/components/daily/DailyIndex.jsx'));
const WritingMenu      = lazy(() => import('@/components/learn/Writing/index.jsx'));
const HanziWriting     = lazy(() => import('@/components/learn/Writing/HanziWriting.jsx'));
const RadicalsWriting  = lazy(() => import('@/components/learn/Writing/RadicalsWriting.jsx'));
const RadicalsIndex    = lazy(() => import('@/components/learn/Radicals/index.jsx'));
const RadicalsTheory   = lazy(() => import('@/components/learn/Radicals/RadicalsTheory.jsx'));
const RadicalsQuiz     = lazy(() => import('@/components/learn/Radicals/RadicalsQuiz.jsx'));
const RadicalsQuiz2    = lazy(() => import('@/components/learn/Radicals/RadicalsQuiz2.jsx'));
const CharactersIndex  = lazy(() => import('@/components/learn/Characters/index.jsx'));
const Progressive      = lazy(() => import('@/components/learn/Characters/Progressive.jsx'));
const Quiz             = lazy(() => import('@/components/learn/Characters/Quiz.jsx'));
const Matching         = lazy(() => import('@/components/learn/Characters/Matching.jsx'));
const TonesIndex       = lazy(() => import('@/components/learn/Tones/index.jsx'));
const QuizTone         = lazy(() => import('@/components/learn/Tones/QuizTone.jsx'));
const QuizPronunciation= lazy(() => import('@/components/learn/Tones/QuizPronunciation.jsx'));
const SpecialSyllables = lazy(() => import('@/components/learn/Tones/SpecialSyllables.jsx'));
const CharactersDaily  = lazy(() => import('@/components/daily/CharactersDaily.jsx'));
const RadicalsDaily    = lazy(() => import('@/components/daily/RadicalsDaily.jsx'));
const TonesDaily       = lazy(() => import('@/components/daily/TonesDaily.jsx'));
const TimeRace         = lazy(() => import('@/components/minigames/TimeRace.jsx'));
const PinyinConnection = lazy(() => import('@/components/minigames/PinyinConnection.jsx'));
const SOVGame          = lazy(() => import('@/components/minigames/SOVGame.jsx'));
const TranslationGame  = lazy(() => import('@/components/minigames/TranslationGame.jsx'));
const CompleteSentence = lazy(() => import('@/components/minigames/CompleteSentence.jsx'));
const DialogueOrder    = lazy(() => import('@/components/minigames/DialogueOrder.jsx'));
const FindIntruder     = lazy(() => import('@/components/minigames/FindIntruder.jsx'));

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
      let updated = markWordResult(progress, charObj.lesson, charObj.char, isCorrect);
      if (isCorrect) {
        updateChallengeProgress('correct_answers', 1);
      } else {
        // Penalizar el SRS: iniciar tarjeta si no existe, luego resetear intervalo
        updated = initSRSCard(updated, charObj.char);
        updated = updateSRS(updated, charObj.char, 0); // quality 0 = resetea a 1 día
      }
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
        progress,
        onProgressChange,
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
        speakChinese: speak,
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

    if (screen === 'translation-game') {
      Component = TranslationGame;
      props = {
        goBack: () => { navigateTo('minigames'); },
      };
    }

    if (screen === 'complete-sentence') {
      Component = CompleteSentence;
      props = {
        goBack: () => { navigateTo('minigames'); },
      };
    }

    if (screen === 'dialogue-order') {
      Component = DialogueOrder;
      props = {
        goBack: () => { navigateTo('minigames'); },
      };
    }

    if (screen === 'find-intruder') {
      Component = FindIntruder;
      props = {
        goBack: () => { navigateTo('minigames'); },
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
        goBack: hubOr(goBack),
        characters,
        speakChinese: speak,
        progress,
        onProgressChange,
      };
    }

    if (screen === 'learn' && learnSection === 'writing' && writingSection === 'radicals') {
      Component = RadicalsWriting;
      props = {
        goBack: hubOr(goBack),
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
