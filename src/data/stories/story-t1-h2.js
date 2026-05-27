// src/data/stories/story-t1-h2.js
// Tema 1 — Saludos y presentaciones · Historia 2: Una amiga estudiosa
// 东奥 le presenta al usuario a su amiga 晓敏. Toque cómico al final
// cuando 东奥 demuestra que no se acuerda del apellido de su propia amiga.

export const storyT1H2 = {
  id: 't1-h2',
  tema: 1,
  historia: 2,
  titulo: 'Una amiga estudiosa',
  subtitulo: '一个好朋友',
  resumen: '东奥 presenta al usuario a 晓敏, una estudiante china muy aplicada. Pero hay un detalle que 东奥 no recuerda…',
  escenario: 'campus',
  personajes: ['user', 'dong-ao', 'xiao-min'],
  vocabularioObjetivo: ['你好', '叫', '姓', '名字', '认识', '高兴', '也', '请问', '朋友', '这', '是'],

  escenas: [
    {
      id: 's1',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '{userName}，你好！',
      pinyin: '{userName}, nǐ hǎo!',
      traduccion: '¡Hola, {userName}!',
    },
    {
      id: 's2',
      personaje: 'user',
      expresion: 'normal',
      chino: '东奥，你好！',
      pinyin: 'Dōng Ào, nǐ hǎo!',
      traduccion: '¡Hola, Dōng Ào!',
    },
    {
      id: 's3',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '这是我的朋友，晓敏。',
      pinyin: 'Zhè shì wǒ de péngyou, Xiǎo Mǐn.',
      traduccion: 'Esta es mi amiga, Xiǎo Mǐn.',
    },
    {
      id: 's4',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '你好！我叫晓敏。',
      pinyin: 'Nǐ hǎo! Wǒ jiào Xiǎo Mǐn.',
      traduccion: '¡Hola! Me llamo Xiǎo Mǐn.',
    },
    {
      id: 's5',
      personaje: 'user',
      expresion: 'normal',
      chino: '你好晓敏！我叫{userName}。',
      pinyin: 'Nǐ hǎo Xiǎo Mǐn! Wǒ jiào {userName}.',
      traduccion: '¡Hola Xiǎo Mǐn! Me llamo {userName}.',
    },
    {
      id: 's6',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '认识你很高兴！',
      pinyin: 'Rènshi nǐ hěn gāoxìng!',
      traduccion: '¡Encantada de conocerte!',
    },
    {
      id: 's7',
      personaje: 'user',
      expresion: 'normal',
      chino: '我也很高兴。',
      pinyin: 'Wǒ yě hěn gāoxìng.',
      traduccion: 'Yo también, encantado.',
    },
    {
      id: 's8',
      personaje: 'dong-ao',
      expresion: 'sorprendido',
      chino: '晓敏，请问，你姓什么？',
      pinyin: 'Xiǎo Mǐn, qǐngwèn, nǐ xìng shénme?',
      traduccion: 'Xiǎo Mǐn… perdona, ¿cuál es tu apellido?',
    },
    {
      id: 's9',
      personaje: 'xiao-min',
      expresion: 'sorprendido',
      chino: '东奥！我姓林！',
      pinyin: 'Dōng Ào! Wǒ xìng Lín!',
      traduccion: '¡Dōng Ào! ¡Mi apellido es Lín!',
    },
    {
      id: 's10',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '对不起，晓敏…',
      pinyin: 'Duìbuqǐ, Xiǎo Mǐn…',
      traduccion: 'Perdón, Xiǎo Mǐn…',
    },
  ],

  ejercicios: {
    // Bloque 1 — TRADUCCIÓN
    traduccion: [
      {
        chino: '这是我的朋友。',
        pinyin: 'Zhè shì wǒ de péngyou.',
        opciones: [
          'Esta es mi amiga.',
          'Yo tengo una amiga.',
          '¿Es ella tu amiga?',
          'Tu amiga es estudiante.',
        ],
        correcta: 0,
      },
      {
        chino: '我叫晓敏。',
        pinyin: 'Wǒ jiào Xiǎo Mǐn.',
        opciones: [
          'Me llamo Xiǎo Mǐn.',
          'Mi apellido es Xiǎo Mǐn.',
          'Soy Xiǎo Mǐn de China.',
          'No conozco a Xiǎo Mǐn.',
        ],
        correcta: 0,
      },
      {
        chino: '认识你很高兴！',
        pinyin: 'Rènshi nǐ hěn gāoxìng!',
        opciones: [
          '¡Encantada de conocerte!',
          'Buenos días a todos.',
          'No te conozco bien.',
          '¿Cómo te llamas?',
        ],
        correcta: 0,
      },
      {
        chino: '请问，你姓什么？',
        pinyin: 'Qǐngwèn, nǐ xìng shénme?',
        opciones: [
          'Perdona, ¿cuál es tu apellido?',
          'Perdona, ¿cómo te llamas?',
          'Perdona, ¿de dónde eres?',
          'Perdona, ¿qué edad tienes?',
        ],
        correcta: 0,
      },
      {
        chino: '我姓林。',
        pinyin: 'Wǒ xìng Lín.',
        opciones: [
          'Mi apellido es Lín.',
          'Me llamo Lín.',
          'Vivo cerca de Lín.',
          'Conozco a Lín.',
        ],
        correcta: 0,
      },
    ],

    // Bloque 2 — COMPLETAR
    completar: [
      {
        frase: '这 ___ 我的朋友。',
        pinyin: 'Zhè ___ wǒ de péngyou.',
        traduccion: 'Esta es mi amiga.',
        opciones: ['是', '叫', '姓', '也'],
        correcta: 0,
      },
      {
        frase: '我 ___ 林。',
        pinyin: 'Wǒ ___ Lín.',
        traduccion: 'Mi apellido es Lín.',
        opciones: ['姓', '叫', '是', '请'],
        correcta: 0,
      },
      {
        frase: '___ 你很高兴！',
        pinyin: '___ nǐ hěn gāoxìng!',
        traduccion: '¡Encantada de conocerte!',
        opciones: ['认识', '名字', '朋友', '请问'],
        correcta: 0,
      },
      {
        frase: '我 ___ 很高兴。',
        pinyin: 'Wǒ ___ hěn gāoxìng.',
        traduccion: 'Yo también estoy encantado.',
        opciones: ['也', '是', '姓', '叫'],
        correcta: 0,
      },
    ],

    // Bloque 3 — COMPRENSIÓN
    comprension: [
      {
        pregunta: '¿Quién presenta a 晓敏 al usuario?',
        opciones: ['东奥', '马可', 'El usuario', 'Nadie'],
        correcta: 0,
      },
      {
        pregunta: '¿Cuál es el apellido de 晓敏?',
        opciones: ['林', '东', '马', '王'],
        correcta: 0,
      },
      {
        pregunta: '¿Por qué se sorprende 晓敏 al final?',
        opciones: [
          '东奥 no recuerda su apellido',
          'El usuario habla muy bien chino',
          '东奥 se va sin despedirse',
          'No le gusta el usuario',
        ],
        correcta: 0,
      },
    ],
  },
};
