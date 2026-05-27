// src/data/stories/story-t2-h1.js
// Tema 2 — Nacionalidades y comida · Historia 1: ¿De dónde eres?
// El usuario conoce a 马可, un estudiante italiano. Hablan de sus
// nacionalidades y de por qué estudian chino.

export const storyT2H1 = {
  id: 't2-h1',
  tema: 2,
  historia: 1,
  titulo: '¿De dónde eres?',
  subtitulo: '你是哪国人？',
  resumen: 'El usuario conoce a 马可, un estudiante italiano. Hablan de sus nacionalidades y descubren que tienen algo en común.',
  escenario: 'campus',
  personajes: ['user', 'ma-ke'],
  vocabularioObjetivo: ['是', '哪', '国', '人', '朋友', '学习', '汉语', '喜欢', '美国', '中国', '西班牙', '意大利'],

  escenas: [
    {
      id: 's1',
      personaje: 'ma-ke',
      expresion: 'normal',
      chino: '你好！我叫马可。',
      pinyin: 'Nǐ hǎo! Wǒ jiào Mǎ Kě.',
      traduccion: '¡Hola! Me llamo Mǎ Kě.',
    },
    {
      id: 's2',
      personaje: 'user',
      expresion: 'normal',
      chino: '你好马可！我叫{userName}。',
      pinyin: 'Nǐ hǎo Mǎ Kě! Wǒ jiào {userName}.',
      traduccion: '¡Hola Mǎ Kě! Me llamo {userName}.',
    },
    {
      id: 's3',
      personaje: 'ma-ke',
      expresion: 'normal',
      chino: '请问，你是哪国人？',
      pinyin: 'Qǐngwèn, nǐ shì nǎ guó rén?',
      traduccion: 'Perdona, ¿de qué país eres?',
    },
    {
      id: 's4',
      personaje: 'user',
      expresion: 'normal',
      chino: '我是西班牙人。你呢？',
      pinyin: 'Wǒ shì Xībānyá rén. Nǐ ne?',
      traduccion: 'Soy español. ¿Y tú?',
    },
    {
      id: 's5',
      personaje: 'ma-ke',
      expresion: 'normal',
      chino: '我是意大利人。',
      pinyin: 'Wǒ shì Yìdàlì rén.',
      traduccion: 'Soy italiano.',
    },
    {
      id: 's6',
      personaje: 'user',
      expresion: 'normal',
      chino: '你也学习汉语吗？',
      pinyin: 'Nǐ yě xuéxí Hànyǔ ma?',
      traduccion: '¿Tú también estudias chino?',
    },
    {
      id: 's7',
      personaje: 'ma-ke',
      expresion: 'normal',
      chino: '是的，我很喜欢汉语。',
      pinyin: 'Shì de, wǒ hěn xǐhuan Hànyǔ.',
      traduccion: 'Sí, me gusta mucho el chino.',
    },
    {
      id: 's8',
      personaje: 'user',
      expresion: 'normal',
      chino: '我也是！我们是朋友。',
      pinyin: 'Wǒ yě shì! Wǒmen shì péngyou.',
      traduccion: '¡Yo también! Somos amigos.',
    },
    {
      id: 's9',
      personaje: 'ma-ke',
      expresion: 'sorprendido',
      chino: '好！认识你很高兴！',
      pinyin: 'Hǎo! Rènshi nǐ hěn gāoxìng!',
      traduccion: '¡Genial! ¡Encantado de conocerte!',
    },
  ],

  ejercicios: {
    // Bloque 1 — TRADUCCIÓN
    traduccion: [
      {
        chino: '你是哪国人？',
        pinyin: 'Nǐ shì nǎ guó rén?',
        opciones: [
          '¿De qué país eres?',
          '¿Cómo te llamas?',
          '¿Qué estudias?',
          '¿Cuántos años tienes?',
        ],
        correcta: 0,
      },
      {
        chino: '我是西班牙人。',
        pinyin: 'Wǒ shì Xībānyá rén.',
        opciones: [
          'Soy español.',
          'Soy italiano.',
          'Estoy en España.',
          'Voy a España.',
        ],
        correcta: 0,
      },
      {
        chino: '我是意大利人。',
        pinyin: 'Wǒ shì Yìdàlì rén.',
        opciones: [
          'Soy italiano.',
          'Soy chino.',
          'Vivo en Italia.',
          'Hablo italiano.',
        ],
        correcta: 0,
      },
      {
        chino: '我很喜欢汉语。',
        pinyin: 'Wǒ hěn xǐhuan Hànyǔ.',
        opciones: [
          'Me gusta mucho el chino.',
          'Estudio chino todos los días.',
          'El chino es muy difícil.',
          'No entiendo el chino.',
        ],
        correcta: 0,
      },
      {
        chino: '我们是朋友。',
        pinyin: 'Wǒmen shì péngyou.',
        opciones: [
          'Somos amigos.',
          'Soy tu amigo.',
          '¿Eres mi amigo?',
          'Tengo muchos amigos.',
        ],
        correcta: 0,
      },
    ],

    // Bloque 2 — COMPLETAR
    completar: [
      {
        frase: '我 ___ 西班牙人。',
        pinyin: 'Wǒ ___ Xībānyá rén.',
        traduccion: 'Soy español.',
        opciones: ['是', '叫', '姓', '也'],
        correcta: 0,
      },
      {
        frase: '你是 ___ 国人？',
        pinyin: 'Nǐ shì ___ guó rén?',
        traduccion: '¿De qué país eres?',
        opciones: ['哪', '是', '什么', '请'],
        correcta: 0,
      },
      {
        frase: '我很 ___ 汉语。',
        pinyin: 'Wǒ hěn ___ Hànyǔ.',
        traduccion: 'Me gusta mucho el chino.',
        opciones: ['喜欢', '是', '学习', '认识'],
        correcta: 0,
      },
      {
        frase: '你也 ___ 汉语吗？',
        pinyin: 'Nǐ yě ___ Hànyǔ ma?',
        traduccion: '¿Tú también estudias chino?',
        opciones: ['学习', '喜欢', '是', '叫'],
        correcta: 0,
      },
    ],

    // Bloque 3 — COMPRENSIÓN
    comprension: [
      {
        pregunta: '¿De dónde es 马可?',
        opciones: ['Italia', 'España', 'Francia', 'China'],
        correcta: 0,
      },
      {
        pregunta: '¿Qué idioma estudia 马可?',
        opciones: ['Chino', 'Español', 'Italiano', 'Inglés'],
        correcta: 0,
      },
      {
        pregunta: '¿Qué tienen en común el usuario y 马可?',
        opciones: [
          'Los dos estudian chino y les gusta',
          'Los dos son chinos',
          'Los dos viven en Italia',
          'No tienen nada en común',
        ],
        correcta: 0,
      },
    ],
  },
};
