// src/data/stories/story-t4-h2.js
// Tema 4 — Horarios y planes · Historia 2: El horario de 马可
// 马可 pregunta a 晓敏 por su horario de clases. Hablan de asignaturas
// y de cuándo coinciden.

export const storyT4H2 = {
  id: 't4-h2',
  tema: 4,
  historia: 2,
  titulo: 'El horario de 马可',
  subtitulo: '马可的时间表',
  resumen: '马可 está perdido con el horario nuevo. 晓敏 le ayuda a organizarse y descubren que tienen una clase juntos.',
  escenario: 'aula',
  personajes: ['ma-ke', 'xiao-min'],
  vocabularioObjetivo: ['明天', '点', '上午', '下午', '时间', '课', '现在', '汉语', '英语'],

  escenas: [
    {
      id: 's1',
      personaje: 'ma-ke',
      expresion: 'normal',
      chino: '晓敏，你明天有课吗？',
      pinyin: 'Xiǎo Mǐn, nǐ míngtiān yǒu kè ma?',
      traduccion: 'Xiǎo Mǐn, ¿mañana tienes clase?',
    },
    {
      id: 's2',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '有。我上午有汉语课。',
      pinyin: 'Yǒu. Wǒ shàngwǔ yǒu Hànyǔ kè.',
      traduccion: 'Sí. Por la mañana tengo clase de chino.',
    },
    {
      id: 's3',
      personaje: 'ma-ke',
      expresion: 'normal',
      chino: '几点？',
      pinyin: 'Jǐ diǎn?',
      traduccion: '¿A qué hora?',
    },
    {
      id: 's4',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '九点。下午我有英语课。',
      pinyin: 'Jiǔ diǎn. Xiàwǔ wǒ yǒu Yīngyǔ kè.',
      traduccion: 'A las 9. Por la tarde tengo clase de inglés.',
    },
    {
      id: 's5',
      personaje: 'ma-ke',
      expresion: 'sorprendido',
      chino: '我明天也有汉语课！',
      pinyin: 'Wǒ míngtiān yě yǒu Hànyǔ kè!',
      traduccion: '¡Yo también tengo clase de chino mañana!',
    },
    {
      id: 's6',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '几点上课？',
      pinyin: 'Jǐ diǎn shàngkè?',
      traduccion: '¿A qué hora empieza la clase?',
    },
    {
      id: 's7',
      personaje: 'ma-ke',
      expresion: 'normal',
      chino: '上午九点！我们一起去！',
      pinyin: 'Shàngwǔ jiǔ diǎn! Wǒmen yìqǐ qù!',
      traduccion: '¡A las 9 de la mañana! ¡Vamos juntos!',
    },
    {
      id: 's8',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '好！明天九点见！',
      pinyin: 'Hǎo! Míngtiān jiǔ diǎn jiàn!',
      traduccion: '¡Vale! ¡Nos vemos mañana a las 9!',
    },
  ],

  ejercicios: {
    traduccion: [
      {
        chino: '你明天有课吗？',
        pinyin: 'Nǐ míngtiān yǒu kè ma?',
        opciones: [
          '¿Mañana tienes clase?',
          '¿Tienes clase hoy?',
          '¿Te gusta la clase?',
          '¿Dónde es la clase?',
        ],
        correcta: 0,
      },
      {
        chino: '我上午有汉语课。',
        pinyin: 'Wǒ shàngwǔ yǒu Hànyǔ kè.',
        opciones: [
          'Por la mañana tengo clase de chino.',
          'Por la tarde tengo clase de chino.',
          'No tengo clase de chino.',
          'Estudio chino solo.',
        ],
        correcta: 0,
      },
      {
        chino: '下午我有英语课。',
        pinyin: 'Xiàwǔ wǒ yǒu Yīngyǔ kè.',
        opciones: [
          'Por la tarde tengo clase de inglés.',
          'Por la mañana tengo clase de inglés.',
          'No me gusta el inglés.',
          'Estudio inglés en casa.',
        ],
        correcta: 0,
      },
      {
        chino: '我们一起去！',
        pinyin: 'Wǒmen yìqǐ qù!',
        opciones: [
          '¡Vamos juntos!',
          '¡Ven conmigo!',
          '¡Voy solo!',
          '¡No vayas!',
        ],
        correcta: 0,
      },
      {
        chino: '明天九点见！',
        pinyin: 'Míngtiān jiǔ diǎn jiàn!',
        opciones: [
          '¡Nos vemos mañana a las 9!',
          '¡Nos vemos hoy a las 9!',
          '¡Nos vemos pronto!',
          '¡Hasta luego!',
        ],
        correcta: 0,
      },
    ],

    completar: [
      {
        frase: '你明天 ___ 课吗？',
        pinyin: 'Nǐ míngtiān ___ kè ma?',
        traduccion: '¿Mañana tienes clase?',
        opciones: ['有', '是', '叫', '去'],
        correcta: 0,
      },
      {
        frase: '___ 我有汉语课。',
        pinyin: '___ wǒ yǒu Hànyǔ kè.',
        traduccion: 'Por la mañana tengo clase de chino.',
        opciones: ['上午', '晚上', '明天', '一起'],
        correcta: 0,
      },
      {
        frase: '我们一起 ___ ！',
        pinyin: 'Wǒmen yìqǐ ___ !',
        traduccion: '¡Vamos juntos!',
        opciones: ['去', '是', '点', '课'],
        correcta: 0,
      },
      {
        frase: '明天九 ___ 见！',
        pinyin: 'Míngtiān jiǔ ___ jiàn!',
        traduccion: '¡Nos vemos mañana a las 9!',
        opciones: ['点', '课', '岁', '人'],
        correcta: 0,
      },
    ],

    comprension: [
      {
        pregunta: '¿A qué hora es la clase de chino de 晓敏?',
        opciones: ['A las 9', 'A las 10', 'A las 11', 'A las 12'],
        correcta: 0,
      },
      {
        pregunta: '¿Qué clase tiene 晓敏 por la tarde?',
        opciones: ['Inglés', 'Chino', 'Matemáticas', 'Historia'],
        correcta: 0,
      },
      {
        pregunta: '¿Qué descubren al final?',
        opciones: [
          'Tienen la misma clase de chino',
          'Viven en el mismo edificio',
          'Son del mismo país',
          'No tienen clases mañana',
        ],
        correcta: 0,
      },
    ],
  },
};
