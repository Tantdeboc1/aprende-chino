// src/utils/navigation.js
import { useMemo, useCallback, useRef, lazy } from 'react';
import { markWordResult, markWordSeen } from './progress.js';
import { updateChallengeProgress } from './dailyChallenges.js';
import { initSRSCard, updateSRS } from './srs.js';
import { addXP } from './streak.js';

// ── Lazy-loaded components — cada uno genera su propio chunk ────────────────
const Dictionary       = lazy(() => import('@/components/Dictionary.jsx'));
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
// Los mini-juegos viven en un registro centralizado — añadir uno nuevo se
// hace solo allí y aquí no hay que tocar nada.
import { findMinigame } from '@/components/minigames/registry.js';

export function useNavigation(
  screen,
  learnSection,
  writingSection,
  radicalSection,
  characterSection,
  toneSection,
  dailySection,
  {
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
    getProgress,
    onProgressChange,
  }
) {

  // Lee el progreso más reciente sin capturarlo en la closure (getProgress lo
  // resuelve desde una ref en App). Así estos callbacks son ESTABLES y no
  // recrean los props ni re-renderizan la pantalla activa cada vez que cambia
  // `progress` al responder un ejercicio. Fallback defensivo por si no llega.
  const readProgress = getProgress || (() => progress);
  const readProgressRef = useRef(readProgress);
  readProgressRef.current = readProgress;

  // Callbacks de feedback: actualizan el progreso al responder ejercicios.
  // Estables (useCallback []) para que React.memo pueda saltarse re-renders.
  const onTrackResult = useCallback((charObj, isCorrect) => {
    if (!charObj?.lesson || !charObj?.char || !onProgressChange) return;
    let updated = markWordResult(readProgressRef.current(), charObj.lesson, charObj.char, isCorrect);
    if (isCorrect) {
      // XP por acierto en el estudio "serio" (Quiz de caracteres y los
      // minijuegos que reportan por aquí sin dar XP propio).
      addXP(2);
      updateChallengeProgress('correct_answers', 1);
    } else {
      // Penalizar el SRS: iniciar tarjeta si no existe, luego resetear intervalo
      updated = initSRSCard(updated, charObj.char);
      updated = updateSRS(updated, charObj.char, 0); // quality 0 = resetea a 1 día
    }
    onProgressChange(updated);
  }, [onProgressChange]);
  const onTrackSeen = useCallback((charObj) => {
    if (!charObj?.lesson || !charObj?.char || !onProgressChange) return;
    onProgressChange(markWordSeen(readProgressRef.current(), charObj.lesson, charObj.char));
  }, [onProgressChange]);

  // Botón "atrás" estable para los minijuegos (vuelve al listado). Evita que
  // cada recomputación fabrique un goBack nuevo que rompería el React.memo.
  const goBackMinigames = useCallback(() => { navigateTo('minigames'); }, [navigateTo]);

  const { CurrentComponent, componentProps } = useMemo(() => {
    let Component = null;
    let props = {};

    // Si estamos en modo hub, el botón atrás vuelve al hub
    const hubOr = (fallback) => hubMode ? goBackToHub : fallback;

    // === RUTAS PRINCIPALES ===
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


    // === MINI-JUEGOS ===
    if (screen === 'minigames') {
      Component = MiniGames;
      props = {
        goBack: hubOr(goBack || (() => setScreen('home'))),
        navigateTo
      };
    }

    // Mini-juegos — todos los IDs vienen del registro centralizado. Cada
    // entrada define su propio buildProps con los props específicos.
    const minigame = findMinigame(screen);
    if (minigame) {
      Component = minigame.component;
      props = minigame.buildProps({
        navigateTo,
        goBackMinigames,
        selectedLesson,
        characters,
        allCharacters,
        onTrackResult,
        speak,
      });
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
    // Al salir de un juego se vuelve al hub (DailyIndex): la pantalla sigue en
    // 'daily' y solo se limpia la sección. Coincide con la etiqueta "Volver a
    // Desafíos" del botón de cada juego.
    const backToDailyHub = () => setDailySection(null);
    if (screen === 'daily' && dailySection === 'characters') {
      Component = CharactersDaily;
      props = {
        goBack: backToDailyHub
      };
    }

    if (screen === 'daily' && dailySection === 'radicals') {
      Component = RadicalsDaily;
      props = {
        goBack: backToDailyHub,
        radicals
      };
    }

    if (screen === 'daily' && dailySection === 'tones') {
      Component = TonesDaily;
      props = {
        goBack: backToDailyHub,
        speakChinese: speak
      };
    }

    return { CurrentComponent: Component, componentProps: props };

  }, [
    screen, learnSection, writingSection, radicalSection,
    characterSection, toneSection, dailySection,
    characters, allCharacters, radicals, speak, navigateTo,
    setLearnSection, setCharacterSection, setToneSection, setRadicalSection,
    setWritingSection, setDailySection, setScreen,
    searchTerm, setSearchTerm,
    selectedLesson, setSelectedLesson, showSupplementary, setShowSupplementary,
    lessonsData, goBack, hubMode, goBackToHub,
    progress, onProgressChange,
    onTrackResult, onTrackSeen, goBackMinigames,
  ]);

  return { CurrentComponent, componentProps };
}
