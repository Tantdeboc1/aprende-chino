// src/data/stories/story-t3-h1.js
// Tema 3 — La familia · Historia 1: Las fotos de 东奥
// 东奥 enseña al usuario fotos de su familia en el móvil.

export const storyT3H1 = {
  id: 't3-h1',
  tema: 3,
  historia: 1,
  titulo: 'Las fotos de 东奥',
  subtitulo: '东奥的家人',
  resumen: '东奥 enseña al usuario las fotos de su familia en el móvil. Su hermana mayor sale especialmente bien…',
  escenario: 'casa',
  personajes: ['user', 'dong-ao'],
  vocabularioObjetivo: ['家', '有', '几', '口', '照片', '哥哥', '姐姐', '妹妹', '爸爸', '妈妈', '岁', '漂亮'],

  escenas: [
    {
      id: 's1',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '{userName}，你看！我家的照片。',
      pinyin: '{userName}, nǐ kàn! Wǒ jiā de zhàopiàn.',
      traduccion: '{userName}, ¡mira! Fotos de mi familia.',
    },
    {
      id: 's2',
      personaje: 'user',
      expresion: 'normal',
      chino: '你家有几口人？',
      pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?',
      traduccion: '¿Cuántas personas hay en tu familia?',
    },
    {
      id: 's3',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '我家有五口人。',
      pinyin: 'Wǒ jiā yǒu wǔ kǒu rén.',
      traduccion: 'En mi familia somos cinco.',
    },
    {
      id: 's4',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '爸爸，妈妈，姐姐，妹妹和我。',
      pinyin: 'Bàba, māma, jiějie, mèimei hé wǒ.',
      traduccion: 'Papá, mamá, mi hermana mayor, mi hermana pequeña y yo.',
    },
    {
      id: 's5',
      personaje: 'user',
      expresion: 'normal',
      chino: '你姐姐很漂亮！她几岁？',
      pinyin: 'Nǐ jiějie hěn piàoliang! Tā jǐ suì?',
      traduccion: '¡Tu hermana mayor es muy guapa! ¿Cuántos años tiene?',
    },
    {
      id: 's6',
      personaje: 'dong-ao',
      expresion: 'sorprendido',
      chino: '什么？！',
      pinyin: 'Shénme?!',
      traduccion: '¡¿Qué?!',
    },
    {
      id: 's7',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '她二十五岁。她有男朋友。',
      pinyin: 'Tā èrshíwǔ suì. Tā yǒu nán péngyou.',
      traduccion: 'Tiene 25 años. Tiene novio.',
    },
    {
      id: 's8',
      personaje: 'user',
      expresion: 'normal',
      chino: '哦…对不起。你妹妹呢？',
      pinyin: 'Ò… duìbuqǐ. Nǐ mèimei ne?',
      traduccion: 'Ah… perdón. ¿Y tu hermana pequeña?',
    },
    {
      id: 's9',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '我妹妹十岁。她也很漂亮。',
      pinyin: 'Wǒ mèimei shí suì. Tā yě hěn piàoliang.',
      traduccion: 'Mi hermana pequeña tiene 10 años. También es muy guapa.',
    },
  ],

  ejercicios: {
    // Bloque 1 — TRADUCCIÓN
    traduccion: [
      {
        chino: '你家有几口人？',
        pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?',
        opciones: [
          '¿Cuántas personas hay en tu familia?',
          '¿Dónde vive tu familia?',
          '¿Tienes una familia grande?',
          '¿Cómo se llama tu familia?',
        ],
        correcta: 0,
      },
      {
        chino: '我家有五口人。',
        pinyin: 'Wǒ jiā yǒu wǔ kǒu rén.',
        opciones: [
          'En mi familia somos cinco.',
          'Tengo cinco hermanos.',
          'Mi familia vive en cinco casas.',
          'Tengo cinco fotos.',
        ],
        correcta: 0,
      },
      {
        chino: '你姐姐很漂亮！',
        pinyin: 'Nǐ jiějie hěn piàoliang!',
        opciones: [
          '¡Tu hermana mayor es muy guapa!',
          'Tu hermana mayor es alta.',
          'Tu hermana mayor es simpática.',
          'Tu hermana mayor es trabajadora.',
        ],
        correcta: 0,
      },
      {
        chino: '她二十五岁。',
        pinyin: 'Tā èrshíwǔ suì.',
        opciones: [
          'Tiene 25 años.',
          'Tiene 15 años.',
          'Vive en el 25.',
          'Trabaja desde las 25.',
        ],
        correcta: 0,
      },
      {
        chino: '我妹妹十岁。',
        pinyin: 'Wǒ mèimei shí suì.',
        opciones: [
          'Mi hermana pequeña tiene 10 años.',
          'Mi hermana mayor tiene 10 años.',
          'Soy 10 años más joven.',
          'Tengo diez hermanos.',
        ],
        correcta: 0,
      },
    ],

    // Bloque 2 — COMPLETAR
    completar: [
      {
        frase: '你家 ___ 几口人？',
        pinyin: 'Nǐ jiā ___ jǐ kǒu rén?',
        traduccion: '¿Cuántas personas hay en tu familia?',
        opciones: ['有', '是', '叫', '看'],
        correcta: 0,
      },
      {
        frase: '我家有五 ___ 人。',
        pinyin: 'Wǒ jiā yǒu wǔ ___ rén.',
        traduccion: 'En mi familia somos cinco.',
        opciones: ['口', '个', '岁', '家'],
        correcta: 0,
      },
      {
        frase: '你姐姐很 ___ ！',
        pinyin: 'Nǐ jiějie hěn ___ !',
        traduccion: '¡Tu hermana mayor es muy guapa!',
        opciones: ['漂亮', '高兴', '好吃', '喜欢'],
        correcta: 0,
      },
      {
        frase: '她二十五 ___ 。',
        pinyin: 'Tā èrshíwǔ ___ .',
        traduccion: 'Tiene 25 años.',
        opciones: ['岁', '口', '人', '家'],
        correcta: 0,
      },
    ],

    // Bloque 3 — COMPRENSIÓN
    comprension: [
      {
        pregunta: '¿Cuántas personas hay en la familia de 东奥?',
        opciones: ['5', '3', '4', '6'],
        correcta: 0,
      },
      {
        pregunta: '¿Por qué se sorprende 东奥?',
        opciones: [
          'El usuario llama guapa a su hermana mayor',
          'No le gusta hablar de su familia',
          'Olvidó la edad de su hermana',
          'No tiene fotos en el móvil',
        ],
        correcta: 0,
      },
      {
        pregunta: '¿Cuántos años tiene la hermana pequeña?',
        opciones: ['10', '25', '15', '5'],
        correcta: 0,
      },
    ],
  },
};
