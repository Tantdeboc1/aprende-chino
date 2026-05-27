// src/data/stories/story-t1-h1.js
// Tema 1 — Saludos y presentaciones · Historia 1: Primer encuentro
// El usuario conoce a 东奥. Presentaciones básicas.

export const storyT1H1 = {
  id: 't1-h1',
  tema: 1,
  historia: 1,
  titulo: 'Primer encuentro',
  subtitulo: '初次见面',
  resumen: 'El usuario llega al campus y conoce a 东奥, un estudiante chino algo despistado.',
  escenario: 'campus',  // ver SceneBackground.jsx
  personajes: ['user', 'dong-ao'],
  vocabularioObjetivo: ['你好', '叫', '姓', '名字', '认识', '高兴', '我', '你', '请问', '也'],

  escenas: [
    {
      id: 's1',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '你好！',
      pinyin: 'Nǐ hǎo!',
      traduccion: '¡Hola!',
    },
    {
      id: 's2',
      personaje: 'user',
      expresion: 'normal',
      chino: '你好！',
      pinyin: 'Nǐ hǎo!',
      traduccion: '¡Hola!',
    },
    {
      id: 's3',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '请问，你叫什么名字？',
      pinyin: 'Qǐngwèn, nǐ jiào shénme míngzi?',
      traduccion: 'Perdona, ¿cómo te llamas?',
    },
    {
      id: 's4',
      personaje: 'user',
      expresion: 'normal',
      chino: '我叫{userName}。你呢？',
      pinyin: 'Wǒ jiào {userName}. Nǐ ne?',
      traduccion: 'Me llamo {userName}. ¿Y tú?',
    },
    {
      id: 's5',
      personaje: 'dong-ao',
      expresion: 'sorprendido',
      chino: '我姓东，叫东奥！',
      pinyin: 'Wǒ xìng Dōng, jiào Dōng Ào!',
      traduccion: 'Mi apellido es Dōng, me llamo ¡Dōng Ào!',
    },
    {
      id: 's6',
      personaje: 'user',
      expresion: 'normal',
      chino: '认识你很高兴。',
      pinyin: 'Rènshi nǐ hěn gāoxìng.',
      traduccion: 'Encantado de conocerte.',
    },
    {
      id: 's7',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '我也很高兴！',
      pinyin: 'Wǒ yě hěn gāoxìng!',
      traduccion: '¡Yo también, encantado!',
    },
  ],

  ejercicios: {
    // Bloque 1 — TRADUCCIÓN · 5 frases del diálogo
    traduccion: [
      {
        chino: '你好！',
        pinyin: 'Nǐ hǎo!',
        opciones: ['¡Hola!', '¿Qué tal?', 'Adiós', 'Gracias'],
        correcta: 0,
      },
      {
        chino: '你叫什么名字？',
        pinyin: 'Nǐ jiào shénme míngzi?',
        opciones: [
          '¿Cómo te llamas?',
          '¿De dónde eres?',
          '¿Cómo estás?',
          '¿Qué edad tienes?',
        ],
        correcta: 0,
      },
      {
        chino: '我姓东。',
        pinyin: 'Wǒ xìng Dōng.',
        opciones: [
          'Mi apellido es Dōng.',
          'Me llamo Dōng.',
          'Vivo en Dōng.',
          'Soy de Dōng.',
        ],
        correcta: 0,
      },
      {
        chino: '认识你很高兴。',
        pinyin: 'Rènshi nǐ hěn gāoxìng.',
        opciones: [
          'Encantado de conocerte.',
          'Buenos días, ¿qué tal?',
          'Hasta pronto.',
          'Perdona, ¿cómo te llamas?',
        ],
        correcta: 0,
      },
      {
        chino: '我也很高兴！',
        pinyin: 'Wǒ yě hěn gāoxìng!',
        opciones: [
          '¡Yo también, encantado!',
          'No estoy bien.',
          'Yo soy estudiante.',
          'No te conozco.',
        ],
        correcta: 0,
      },
    ],

    // Bloque 2 — COMPLETAR LA FRASE · 4 huecos sobre vocabulario objetivo
    completar: [
      {
        frase: '我 ___ 东奥。',
        pinyin: 'Wǒ ___ Dōng Ào.',
        traduccion: 'Me llamo Dōng Ào.',
        opciones: ['叫', '是', '姓', '认识'],
        correcta: 0,
      },
      {
        frase: '你 ___ 什么名字？',
        pinyin: 'Nǐ ___ shénme míngzi?',
        traduccion: '¿Cómo te llamas?',
        opciones: ['叫', '高兴', '也', '请问'],
        correcta: 0,
      },
      {
        frase: '认识你很 ___ 。',
        pinyin: 'Rènshi nǐ hěn ___ .',
        traduccion: 'Encantado de conocerte.',
        opciones: ['高兴', '名字', '认识', '姓'],
        correcta: 0,
      },
      {
        frase: '我 ___ 很高兴。',
        pinyin: 'Wǒ ___ hěn gāoxìng.',
        traduccion: 'Yo también estoy encantado.',
        opciones: ['也', '叫', '姓', '请问'],
        correcta: 0,
      },
    ],

    // Bloque 3 — COMPRENSIÓN · 3 preguntas sobre la historia
    comprension: [
      {
        pregunta: '¿Cómo se llama el estudiante chino?',
        opciones: ['东奥', '晓敏', '马可', '小明'],
        correcta: 0,
      },
      {
        pregunta: '¿Qué dice 东奥 cuando se presenta?',
        opciones: [
          'Su apellido y su nombre',
          'Sólo su nombre',
          'Sólo su edad',
          'Su país de origen',
        ],
        correcta: 0,
      },
      {
        pregunta: '¿Cómo termina la conversación?',
        opciones: [
          'Los dos están encantados de conocerse',
          '东奥 se enfada y se va',
          'El usuario no entiende y se va',
          'Hablan sobre su familia',
        ],
        correcta: 0,
      },
    ],
  },
};
