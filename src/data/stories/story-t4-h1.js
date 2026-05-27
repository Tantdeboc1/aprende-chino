// src/data/stories/story-t4-h1.js
// Tema 4 — Horarios y planes · Historia 1: ¿Quedamos?
// El grupo intenta quedar para ver una película. 东奥 se equivoca de
// hora con un momento cómico.

export const storyT4H1 = {
  id: 't4-h1',
  tema: 4,
  historia: 1,
  titulo: '¿Quedamos?',
  subtitulo: '我们一起去！',
  resumen: 'El grupo intenta quedar para ver una película. Cada uno tiene un horario distinto… y 东奥 propone una hora que no existe.',
  escenario: 'aula',
  personajes: ['user', 'dong-ao', 'xiao-min', 'ma-ke'],
  vocabularioObjetivo: ['明天', '点', '上午', '下午', '晚上', '电影', '一起', '去', '现在', '课'],

  escenas: [
    {
      id: 's1',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '明天我们一起去看电影，好吗？',
      pinyin: 'Míngtiān wǒmen yìqǐ qù kàn diànyǐng, hǎo ma?',
      traduccion: '¿Mañana vamos juntos al cine?',
    },
    {
      id: 's2',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '好！几点？',
      pinyin: 'Hǎo! Jǐ diǎn?',
      traduccion: '¡Vale! ¿A qué hora?',
    },
    {
      id: 's3',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '上午十点，行吗？',
      pinyin: 'Shàngwǔ shí diǎn, xíng ma?',
      traduccion: 'A las 10 de la mañana, ¿vale?',
    },
    {
      id: 's4',
      personaje: 'ma-ke',
      expresion: 'normal',
      chino: '上午我有课。',
      pinyin: 'Shàngwǔ wǒ yǒu kè.',
      traduccion: 'Por la mañana tengo clase.',
    },
    {
      id: 's5',
      personaje: 'user',
      expresion: 'normal',
      chino: '下午怎么样？',
      pinyin: 'Xiàwǔ zěnmeyàng?',
      traduccion: '¿Qué tal por la tarde?',
    },
    {
      id: 's6',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '下午三点，可以。',
      pinyin: 'Xiàwǔ sān diǎn, kěyǐ.',
      traduccion: 'A las 3 de la tarde, vale.',
    },
    {
      id: 's7',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '好！晚上二十五点见！',
      pinyin: 'Hǎo! Wǎnshang èrshíwǔ diǎn jiàn!',
      traduccion: '¡Vale! ¡Nos vemos a las 25 de la noche!',
    },
    {
      id: 's8',
      personaje: 'ma-ke',
      expresion: 'sorprendido',
      chino: '什么？二十五点？！',
      pinyin: 'Shénme? Èrshíwǔ diǎn?!',
      traduccion: '¡¿Qué?! ¡¿Las 25?!',
    },
    {
      id: 's9',
      personaje: 'xiao-min',
      expresion: 'sorprendido',
      chino: '东奥！下午三点！',
      pinyin: 'Dōng Ào! Xiàwǔ sān diǎn!',
      traduccion: '¡Dōng Ào! ¡Las 3 de la tarde!',
    },
    {
      id: 's10',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '哦…对不起！下午三点见！',
      pinyin: 'Ò… duìbuqǐ! Xiàwǔ sān diǎn jiàn!',
      traduccion: 'Ah… ¡perdón! ¡Nos vemos a las 3 de la tarde!',
    },
  ],

  ejercicios: {
    traduccion: [
      {
        chino: '我们一起去看电影。',
        pinyin: 'Wǒmen yìqǐ qù kàn diànyǐng.',
        opciones: [
          'Vamos juntos al cine.',
          'Vimos una película juntos.',
          'Me gusta ver películas.',
          '¿Quieres ver una película?',
        ],
        correcta: 0,
      },
      {
        chino: '几点？',
        pinyin: 'Jǐ diǎn?',
        opciones: [
          '¿A qué hora?',
          '¿Cuántos días?',
          '¿Dónde?',
          '¿Cuántos?',
        ],
        correcta: 0,
      },
      {
        chino: '上午我有课。',
        pinyin: 'Shàngwǔ wǒ yǒu kè.',
        opciones: [
          'Por la mañana tengo clase.',
          'Por la tarde tengo clase.',
          'No tengo clase hoy.',
          'Mi clase es por la mañana.',
        ],
        correcta: 0,
      },
      {
        chino: '下午三点，可以。',
        pinyin: 'Xiàwǔ sān diǎn, kěyǐ.',
        opciones: [
          'A las 3 de la tarde, vale.',
          'A las 3 de la mañana, vale.',
          'Las 3 en punto, sí.',
          'A las 13:00.',
        ],
        correcta: 0,
      },
      {
        chino: '明天我们一起去。',
        pinyin: 'Míngtiān wǒmen yìqǐ qù.',
        opciones: [
          'Mañana vamos juntos.',
          'Ayer fuimos juntos.',
          'Hoy queremos ir.',
          'Mañana voy solo.',
        ],
        correcta: 0,
      },
    ],

    completar: [
      {
        frase: '明天我们 ___ 去看电影。',
        pinyin: 'Míngtiān wǒmen ___ qù kàn diànyǐng.',
        traduccion: 'Mañana vamos juntos al cine.',
        opciones: ['一起', '现在', '上午', '几'],
        correcta: 0,
      },
      {
        frase: '___ 三点，可以。',
        pinyin: '___ sān diǎn, kěyǐ.',
        traduccion: 'A las 3 de la tarde, vale.',
        opciones: ['下午', '晚上', '明天', '几点'],
        correcta: 0,
      },
      {
        frase: '上午我有 ___ 。',
        pinyin: 'Shàngwǔ wǒ yǒu ___ .',
        traduccion: 'Por la mañana tengo clase.',
        opciones: ['课', '点', '电影', '朋友'],
        correcta: 0,
      },
      {
        frase: '几 ___ ？',
        pinyin: 'Jǐ ___ ?',
        traduccion: '¿A qué hora?',
        opciones: ['点', '课', '人', '岁'],
        correcta: 0,
      },
    ],

    comprension: [
      {
        pregunta: '¿A qué van todos juntos?',
        opciones: ['Al cine', 'A clase', 'A comer', 'A casa'],
        correcta: 0,
      },
      {
        pregunta: '¿Por qué 马可 no puede por la mañana?',
        opciones: [
          'Tiene clase',
          'Está enfermo',
          'No le gustan las pelis',
          'No tiene dinero',
        ],
        correcta: 0,
      },
      {
        pregunta: '¿Qué error cómico comete 东奥 al final?',
        opciones: [
          'Dice una hora que no existe (las 25)',
          'Olvida el día',
          'Confunde la película',
          'No avisa a nadie',
        ],
        correcta: 0,
      },
    ],
  },
};
