// src/components/minigames/minigames.smoke.test.jsx
// Smoke de los 13 minijuegos del registro: montar, arrancar y comprobar que la
// pantalla de juego aparece sin errores de React ni excepciones.
//
// Cubre la clase de bug más visible para el usuario (un juego que revienta al
// montar o al pulsar "empezar") sin acoplarse al contenido concreto de cada uno,
// que cambia a menudo. Las aserciones finas de un juego van en su propio archivo.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@/i18n'; // los juegos usan useTranslation

import SOVGame from './SOVGame.jsx';
import TimeRace from './TimeRace.jsx';
import PinyinConnection from './PinyinConnection.jsx';
import TranslationGame from './TranslationGame.jsx';
import CompleteSentence from './CompleteSentence.jsx';
import DialogueOrder from './DialogueOrder.jsx';
import FindIntruder from './FindIntruder.jsx';
import PronunciationPractice from './PronunciationPractice.jsx';
import DictationGame from './DictationGame.jsx';
import EchoSpeaking from './EchoSpeaking.jsx';
import ToneEar from './ToneEar.jsx';
import ReadingComprehension from './ReadingComprehension.jsx';
import CefrExam from './CefrExam.jsx';
import { MINIGAMES } from './registry.js';

// El micrófono no existe en jsdom: los dos juegos de habla comprueban el
// soporte al montar y caen a su rama "no disponible" si no se simula.
vi.mock('@/utils/speechRecognition.js', () => ({
  isSpeechRecognitionSupported: () => true,
  recognize: () => new Promise(() => {}), // nunca resuelve: no hay usuario hablando
  SpeechErrorCode: { NOT_SUPPORTED: 'not-supported', NO_SPEECH: 'no-speech', ABORTED: 'aborted' },
}));

// TTS real usa speechSynthesis + fetch de audio; ninguno existe en jsdom.
vi.mock('@/utils/tts-enhanced.js', () => ({
  speakChineseEnhanced: vi.fn(() => Promise.resolve()),
  cancelSpeak: vi.fn(),
  looksLikePinyin: () => false,
}));

const CHARS = [
  { char: '我', pinyin: 'wǒ', meaning: 'yo', lesson: 1, type: 'Pr.', examples: [] },
  { char: '你', pinyin: 'nǐ', meaning: 'tú', lesson: 1, type: 'Pr.', examples: [] },
  { char: '他', pinyin: 'tā', meaning: 'él', lesson: 1, type: 'Pr.', examples: [] },
  { char: '好', pinyin: 'hǎo', meaning: 'bueno', lesson: 1, type: 'Adj.', examples: [] },
  { char: '是', pinyin: 'shì', meaning: 'ser', lesson: 1, type: 'V.', examples: [] },
  { char: '不', pinyin: 'bù', meaning: 'no', lesson: 1, type: 'Adv.', examples: [] },
  { char: '人', pinyin: 'rén', meaning: 'persona', lesson: 2, type: 'S.', examples: [] },
  { char: '大', pinyin: 'dà', meaning: 'grande', lesson: 2, type: 'Adj.', examples: [] },
  { char: '小', pinyin: 'xiǎo', meaning: 'pequeño', lesson: 2, type: 'Adj.', examples: [] },
  { char: '中', pinyin: 'zhōng', meaning: 'centro', lesson: 2, type: 'S.', examples: [] },
  { char: '国', pinyin: 'guó', meaning: 'país', lesson: 2, type: 'S.', examples: [] },
  { char: '学', pinyin: 'xué', meaning: 'estudiar', lesson: 2, type: 'V.', examples: [] },
  { char: '书', pinyin: 'shū', meaning: 'libro', lesson: 2, type: 'S.', examples: [] },
  { char: '水', pinyin: 'shuǐ', meaning: 'agua', lesson: 2, type: 'S.', examples: [] },
  { char: '天', pinyin: 'tiān', meaning: 'día', lesson: 2, type: 'S.', examples: [] },
  { char: '年', pinyin: 'nián', meaning: 'año', lesson: 2, type: 'S.', examples: [] },
];

const noop = () => {};

// Los mismos props que arma registry.js buildProps, con dobles inertes.
const GAMES = [
  { id: 'sov-game', C: SOVGame, props: { goBack: noop, selectedLesson: null, speakChinese: noop } },
  { id: 'time-race', C: TimeRace, props: { goBack: noop, characters: CHARS, onTrackResult: noop } },
  { id: 'pinyin-connection', C: PinyinConnection, props: { goBack: noop, characters: CHARS, onTrackResult: noop } },
  { id: 'translation-game', C: TranslationGame, props: { goBack: noop, selectedLesson: null } },
  { id: 'complete-sentence', C: CompleteSentence, props: { goBack: noop, selectedLesson: null } },
  { id: 'dialogue-order', C: DialogueOrder, props: { goBack: noop, selectedLesson: null } },
  { id: 'find-intruder', C: FindIntruder, props: { goBack: noop, selectedLesson: null } },
  { id: 'pronunciation-practice', C: PronunciationPractice, props: { goBack: noop, selectedLesson: null } },
  { id: 'dictation-game', C: DictationGame, props: { goBack: noop, characters: CHARS, speak: noop, onTrackResult: noop } },
  { id: 'echo-speaking', C: EchoSpeaking, props: { goBack: noop, selectedLesson: null } },
  { id: 'tones-ear', C: ToneEar, props: { goBack: noop, characters: CHARS, speak: noop, onTrackResult: noop } },
  { id: 'reading-comprehension', C: ReadingComprehension, props: { goBack: noop, speak: noop, characters: CHARS } },
  { id: 'cefr-exam', C: CefrExam, props: { goBack: noop, speak: noop, allCharacters: CHARS } },
];

/** El botón de empezar de GameIntro es el último de la pantalla. */
const startButton = () => screen.getAllByRole('button').at(-1);

let errorSpy;

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  // ConfettiCelebration (CefrExam) usa useMedia de react-use.
  window.matchMedia = window.matchMedia || (() => ({
    matches: false, addEventListener: noop, removeEventListener: noop,
    addListener: noop, removeListener: noop,
  }));
  // Un error de React (prop inválida, key duplicada, update fuera de act) no
  // rompe el render, así que sin esto el smoke pasaría con la consola roja.
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('smoke de los minijuegos', () => {
  it('el registro y esta suite cubren los mismos juegos', () => {
    expect(GAMES.map(g => g.id).sort()).toEqual(MINIGAMES.map(g => g.id).sort());
  });

  it.each(GAMES)('$id monta sin errores', async (game) => {
    const Game = game.C;
    render(<Game {...game.props} />);
    // Algo se ha pintado y hay al menos un control con el que seguir.
    await waitFor(() => expect(screen.getAllByRole('button').length).toBeGreaterThan(0));
    expect(document.body.textContent.trim().length).toBeGreaterThan(0);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  // ReadingComprehension y CefrExam no usan GameIntro (tienen su propia
  // portada), así que el "empezar = último botón" no aplica.
  const withIntro = GAMES.filter(g => !['reading-comprehension', 'cefr-exam'].includes(g.id));

  it.each(withIntro)('$id arranca desde la intro sin errores', async (game) => {
    const Game = game.C;
    render(<Game {...game.props} />);
    // La casilla "no volver a mostrar" solo existe en GameIntro: sirve de
    // marcador inequívoco de en qué fase estamos.
    expect(screen.getByRole('checkbox')).toBeTruthy();

    fireEvent.click(startButton());

    // Las dos condiciones dentro del mismo waitFor: los juegos que cargan sus
    // frases por idioma (useTranslationPhrases → import dinámico) pasan por una
    // pantalla intermedia de carga sin controles, y asertar por separado
    // convierte esa ventana en un test intermitente.
    await waitFor(() => {
      expect(screen.queryByRole('checkbox')).toBeNull();
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it.each(withIntro)('$id respeta "no volver a mostrar" la explicación', async (game) => {
    const Game = game.C;
    const { unmount } = render(<Game {...game.props} />);
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(startButton());
    unmount();

    // Al volver a entrar, el juego salta directo a jugar (sin la casilla) y
    // sigue pintando una pantalla usable.
    render(<Game {...game.props} />);
    await waitFor(() => {
      expect(screen.queryByRole('checkbox')).toBeNull();
      expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    });
    expect(errorSpy).not.toHaveBeenCalled();
  });
});
