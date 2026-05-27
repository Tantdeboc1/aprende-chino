// src/data/stories/story-t3-h2.js
// Tema 3 — La familia · Historia 2: La familia de 晓敏
// 晓敏 habla de su familia: madre médico, padre profesor.

export const storyT3H2 = {
  id: 't3-h2',
  tema: 3,
  historia: 2,
  titulo: 'La familia de 晓敏',
  subtitulo: '晓敏的家人',
  resumen: '晓敏 habla al usuario sobre su familia. Sus padres tienen trabajos muy importantes — ahora entiendes por qué es tan aplicada.',
  escenario: 'casa',
  personajes: ['user', 'xiao-min'],
  vocabularioObjetivo: ['家', '有', '人', '工作', '医生', '老师', '哥哥', '爸爸', '妈妈', '岁', '大学'],

  escenas: [
    {
      id: 's1',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '我家有四口人。',
      pinyin: 'Wǒ jiā yǒu sì kǒu rén.',
      traduccion: 'En mi familia somos cuatro.',
    },
    {
      id: 's2',
      personaje: 'user',
      expresion: 'normal',
      chino: '你爸爸妈妈做什么工作？',
      pinyin: 'Nǐ bàba māma zuò shénme gōngzuò?',
      traduccion: '¿En qué trabajan tus padres?',
    },
    {
      id: 's3',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '我妈妈是医生。',
      pinyin: 'Wǒ māma shì yīshēng.',
      traduccion: 'Mi madre es médica.',
    },
    {
      id: 's4',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '我爸爸是大学老师。',
      pinyin: 'Wǒ bàba shì dàxué lǎoshī.',
      traduccion: 'Mi padre es profesor de universidad.',
    },
    {
      id: 's5',
      personaje: 'user',
      expresion: 'sorprendido',
      chino: '哇！你家人都很聪明！',
      pinyin: 'Wā! Nǐ jiā rén dōu hěn cōngmíng!',
      traduccion: '¡Vaya! ¡Tu familia es muy inteligente!',
    },
    {
      id: 's6',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '我也有一个哥哥。他二十二岁。',
      pinyin: 'Wǒ yě yǒu yí gè gēge. Tā èrshí\'èr suì.',
      traduccion: 'También tengo un hermano mayor. Tiene 22 años.',
    },
    {
      id: 's7',
      personaje: 'user',
      expresion: 'normal',
      chino: '他做什么工作？',
      pinyin: 'Tā zuò shénme gōngzuò?',
      traduccion: '¿En qué trabaja?',
    },
    {
      id: 's8',
      personaje: 'xiao-min',
      expresion: 'normal',
      chino: '他是大学学生，学习汉语和英语。',
      pinyin: 'Tā shì dàxué xuéshēng, xuéxí Hànyǔ hé Yīngyǔ.',
      traduccion: 'Es estudiante universitario, estudia chino e inglés.',
    },
  ],

  ejercicios: {
    traduccion: [
      {
        chino: '我家有四口人。',
        pinyin: 'Wǒ jiā yǒu sì kǒu rén.',
        opciones: [
          'En mi familia somos cuatro.',
          'En mi familia somos diez.',
          'Tengo cuatro hermanos.',
          'Vivo con cuatro amigos.',
        ],
        correcta: 0,
      },
      {
        chino: '你爸爸妈妈做什么工作？',
        pinyin: 'Nǐ bàba māma zuò shénme gōngzuò?',
        opciones: [
          '¿En qué trabajan tus padres?',
          '¿Dónde viven tus padres?',
          '¿Cómo se llaman tus padres?',
          '¿Cuántos años tienen tus padres?',
        ],
        correcta: 0,
      },
      {
        chino: '我妈妈是医生。',
        pinyin: 'Wǒ māma shì yīshēng.',
        opciones: [
          'Mi madre es médica.',
          'Mi madre es profesora.',
          'Mi madre está enferma.',
          'Mi madre es estudiante.',
        ],
        correcta: 0,
      },
      {
        chino: '我爸爸是大学老师。',
        pinyin: 'Wǒ bàba shì dàxué lǎoshī.',
        opciones: [
          'Mi padre es profesor de universidad.',
          'Mi padre es estudiante de universidad.',
          'Mi padre fue a la universidad.',
          'Mi padre enseña en el colegio.',
        ],
        correcta: 0,
      },
      {
        chino: '他二十二岁。',
        pinyin: 'Tā èrshí\'èr suì.',
        opciones: [
          'Tiene 22 años.',
          'Tiene 12 años.',
          'Vive en el 22.',
          'Estudia 22 horas.',
        ],
        correcta: 0,
      },
    ],

    completar: [
      {
        frase: '我妈妈是 ___ 。',
        pinyin: 'Wǒ māma shì ___ .',
        traduccion: 'Mi madre es médica.',
        opciones: ['医生', '老师', '学生', '朋友'],
        correcta: 0,
      },
      {
        frase: '我爸爸是大学 ___ 。',
        pinyin: 'Wǒ bàba shì dàxué ___ .',
        traduccion: 'Mi padre es profesor de universidad.',
        opciones: ['老师', '学生', '医生', '工作'],
        correcta: 0,
      },
      {
        frase: '我也 ___ 一个哥哥。',
        pinyin: 'Wǒ yě ___ yí gè gēge.',
        traduccion: 'También tengo un hermano mayor.',
        opciones: ['有', '是', '叫', '看'],
        correcta: 0,
      },
      {
        frase: '他做什么 ___ ？',
        pinyin: 'Tā zuò shénme ___ ?',
        traduccion: '¿En qué trabaja?',
        opciones: ['工作', '学习', '人', '家'],
        correcta: 0,
      },
    ],

    comprension: [
      {
        pregunta: '¿En qué trabaja la madre de 晓敏?',
        opciones: ['Médica', 'Profesora', 'Cocinera', 'Estudiante'],
        correcta: 0,
      },
      {
        pregunta: '¿En qué trabaja el padre de 晓敏?',
        opciones: [
          'Profesor de universidad',
          'Médico',
          'Estudiante',
          'Cocinero',
        ],
        correcta: 0,
      },
      {
        pregunta: '¿Qué hace el hermano mayor de 晓敏?',
        opciones: [
          'Estudia en la universidad',
          'Trabaja como médico',
          'Es profesor',
          'No tiene hermano mayor',
        ],
        correcta: 0,
      },
    ],
  },
};
