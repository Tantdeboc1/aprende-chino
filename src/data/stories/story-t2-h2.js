// src/data/stories/story-t2-h2.js
// Tema 2 — Nacionalidades y comida · Historia 2: En la cafetería
// 东奥 y 晓敏 van a comer a la cafetería de la universidad. Hablan de
// comida — qué les gusta y qué no.

export const storyT2H2 = {
  id: 't2-h2',
  tema: 2,
  historia: 2,
  titulo: 'En la cafetería',
  subtitulo: '在食堂',
  resumen: '东奥 y 晓敏 van a comer a la cafetería de la universidad. Charlan sobre qué comida les gusta… aunque tienen gustos opuestos.',
  escenario: 'cafeteria',
  personajes: ['dong-ao', 'xiao-min'],
  vocabularioObjetivo: ['吃', '好吃', '喜欢', '中国菜', '米饭', '面条', '茶', '水', '不'],

  escenas: [
    {
      id: 's1',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '晓敏，你喜欢吃什么？',
      pinyin: 'Xiǎo Mǐn, nǐ xǐhuan chī shénme?',
      traduccion: 'Xiǎo Mǐn, ¿qué te gusta comer?',
    },
    {
      id: 's2',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '我喜欢吃米饭。你呢？',
      pinyin: 'Wǒ xǐhuan chī mǐfàn. Nǐ ne?',
      traduccion: 'Me gusta el arroz. ¿Y tú?',
    },
    {
      id: 's3',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '我喜欢吃面条！很好吃！',
      pinyin: 'Wǒ xǐhuan chī miàntiáo! Hěn hǎochī!',
      traduccion: '¡Me gustan los fideos! ¡Están muy ricos!',
    },
    {
      id: 's4',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '我不太喜欢面条。',
      pinyin: 'Wǒ bù tài xǐhuan miàntiáo.',
      traduccion: 'No me gustan mucho los fideos.',
    },
    {
      id: 's5',
      personaje: 'dong-ao',
      expresion: 'sorprendido',
      chino: '什么？！面条很好吃！',
      pinyin: 'Shénme?! Miàntiáo hěn hǎochī!',
      traduccion: '¡¿Qué?! ¡Los fideos están riquísimos!',
    },
    {
      id: 's6',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '你喝什么？茶还是水？',
      pinyin: 'Nǐ hē shénme? Chá háishì shuǐ?',
      traduccion: '¿Qué bebes? ¿Té o agua?',
    },
    {
      id: 's7',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '我喝茶。中国茶很好喝！',
      pinyin: 'Wǒ hē chá. Zhōngguó chá hěn hǎohē!',
      traduccion: 'Bebo té. ¡El té chino está muy bueno!',
    },
    {
      id: 's8',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '好，我也喝茶。',
      pinyin: 'Hǎo, wǒ yě hē chá.',
      traduccion: 'Vale, yo también bebo té.',
    },
  ],

  ejercicios: {
    // Bloque 1 — TRADUCCIÓN
    traduccion: [
      {
        chino: '你喜欢吃什么？',
        pinyin: 'Nǐ xǐhuan chī shénme?',
        opciones: [
          '¿Qué te gusta comer?',
          '¿Dónde comes?',
          '¿Cuándo comes?',
          '¿Con quién comes?',
        ],
        correcta: 0,
      },
      {
        chino: '我喜欢吃米饭。',
        pinyin: 'Wǒ xǐhuan chī mǐfàn.',
        opciones: [
          'Me gusta comer arroz.',
          'No me gusta el arroz.',
          'Como arroz a veces.',
          'Quiero comer arroz.',
        ],
        correcta: 0,
      },
      {
        chino: '面条很好吃！',
        pinyin: 'Miàntiáo hěn hǎochī!',
        opciones: [
          '¡Los fideos están muy ricos!',
          'Los fideos son baratos.',
          'No me gustan los fideos.',
          'Quiero más fideos.',
        ],
        correcta: 0,
      },
      {
        chino: '我不太喜欢面条。',
        pinyin: 'Wǒ bù tài xǐhuan miàntiáo.',
        opciones: [
          'No me gustan mucho los fideos.',
          'Me encantan los fideos.',
          'Como fideos todos los días.',
          'Los fideos son fáciles.',
        ],
        correcta: 0,
      },
      {
        chino: '中国茶很好喝！',
        pinyin: 'Zhōngguó chá hěn hǎohē!',
        opciones: [
          '¡El té chino está muy bueno!',
          'Quiero té chino.',
          'No bebo té chino.',
          'El té chino es caro.',
        ],
        correcta: 0,
      },
    ],

    // Bloque 2 — COMPLETAR
    completar: [
      {
        frase: '你喜欢 ___ 什么？',
        pinyin: 'Nǐ xǐhuan ___ shénme?',
        traduccion: '¿Qué te gusta comer?',
        opciones: ['吃', '是', '叫', '认识'],
        correcta: 0,
      },
      {
        frase: '面条很 ___ ！',
        pinyin: 'Miàntiáo hěn ___ !',
        traduccion: '¡Los fideos están muy ricos!',
        opciones: ['好吃', '高兴', '喜欢', '朋友'],
        correcta: 0,
      },
      {
        frase: '我 ___ 太喜欢面条。',
        pinyin: 'Wǒ ___ tài xǐhuan miàntiáo.',
        traduccion: 'No me gustan mucho los fideos.',
        opciones: ['不', '也', '是', '很'],
        correcta: 0,
      },
      {
        frase: '中国 ___ 很好喝！',
        pinyin: 'Zhōngguó ___ hěn hǎohē!',
        traduccion: '¡El té chino está muy bueno!',
        opciones: ['茶', '水', '米饭', '面条'],
        correcta: 0,
      },
    ],

    // Bloque 3 — COMPRENSIÓN
    comprension: [
      {
        pregunta: '¿Qué le gusta comer a 晓敏?',
        opciones: ['Arroz', 'Fideos', 'Pan', 'Sopa'],
        correcta: 0,
      },
      {
        pregunta: '¿Qué le gusta comer a 东奥?',
        opciones: ['Fideos', 'Arroz', 'Verduras', 'Carne'],
        correcta: 0,
      },
      {
        pregunta: '¿Qué deciden beber al final?',
        opciones: ['Té', 'Agua', 'Café', 'Zumo'],
        correcta: 0,
      },
    ],
  },
};
