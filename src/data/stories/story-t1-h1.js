// src/data/stories/story-t1-h1.js
// Tema 1 — Saludos y presentaciones · Historia 1: Primer encuentro
// El usuario conoce a 东奥. Presentaciones básicas.
//
// El español es el idioma base (`traduccion`, `resumen`, `opciones`, `pregunta`).
// Las traducciones viven en campos paralelos `*Tr: { en, fr, de, it, pt }` y las
// resuelve trField() (src/utils/loc.js) según el idioma activo, con fallback al
// español. Los campos `chino`, `pinyin` y `frase` son neutros (no se traducen).

export const storyT1H1 = {
  id: 't1-h1',
  tema: 1,
  historia: 1,
  titulo: 'Primer encuentro',
  tituloTr: { es: 'Primer encuentro', en: 'First meeting', fr: 'Première rencontre', de: 'Erste Begegnung', it: 'Primo incontro', pt: 'Primeiro encontro' },
  subtitulo: '初次见面',
  resumen: 'El usuario llega al campus y conoce a 东奥, un estudiante chino algo despistado.',
  resumenTr: {
    en: 'You arrive on campus and meet 东奥, a somewhat absent-minded Chinese student.',
    fr: 'Tu arrives sur le campus et rencontres 东奥, un étudiant chinois un peu tête en l’air.',
    de: 'Du kommst auf dem Campus an und triffst 东奥, einen etwas zerstreuten chinesischen Studenten.',
    it: 'Arrivi al campus e conosci 东奥, uno studente cinese un po’ distratto.',
    pt: 'Você chega ao campus e conhece 东奥, um estudante chinês um pouco distraído.',
  },
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
      traduccionTr: { en: 'Hello!', fr: 'Bonjour !', de: 'Hallo!', it: 'Ciao!', pt: 'Olá!' },
    },
    {
      id: 's2',
      personaje: 'user',
      expresion: 'normal',
      chino: '你好！',
      pinyin: 'Nǐ hǎo!',
      traduccion: '¡Hola!',
      traduccionTr: { en: 'Hello!', fr: 'Bonjour !', de: 'Hallo!', it: 'Ciao!', pt: 'Olá!' },
    },
    {
      id: 's3',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '请问，你叫什么名字？',
      pinyin: 'Qǐngwèn, nǐ jiào shénme míngzi?',
      traduccion: 'Perdona, ¿cómo te llamas?',
      traduccionTr: {
        en: 'Excuse me, what’s your name?',
        fr: 'Excuse-moi, comment tu t’appelles ?',
        de: 'Entschuldigung, wie heißt du?',
        it: 'Scusa, come ti chiami?',
        pt: 'Com licença, como você se chama?',
      },
    },
    {
      id: 's4',
      personaje: 'user',
      expresion: 'normal',
      chino: '我叫{userName}。你呢？',
      pinyin: 'Wǒ jiào {userName}. Nǐ ne?',
      traduccion: 'Me llamo {userName}. ¿Y tú?',
      traduccionTr: {
        en: 'My name is {userName}. And you?',
        fr: 'Je m’appelle {userName}. Et toi ?',
        de: 'Ich heiße {userName}. Und du?',
        it: 'Mi chiamo {userName}. E tu?',
        pt: 'Meu nome é {userName}. E você?',
      },
    },
    {
      id: 's5',
      personaje: 'dong-ao',
      expresion: 'sorprendido',
      chino: '我姓东，叫东奥！',
      pinyin: 'Wǒ xìng Dōng, jiào Dōng Ào!',
      traduccion: 'Mi apellido es Dōng, me llamo ¡Dōng Ào!',
      traduccionTr: {
        en: 'My surname is Dōng, I’m called Dōng Ào!',
        fr: 'Mon nom de famille est Dōng, je m’appelle Dōng Ào !',
        de: 'Mein Nachname ist Dōng, ich heiße Dōng Ào!',
        it: 'Il mio cognome è Dōng, mi chiamo Dōng Ào!',
        pt: 'Meu sobrenome é Dōng, me chamo Dōng Ào!',
      },
    },
    {
      id: 's6',
      personaje: 'user',
      expresion: 'normal',
      chino: '认识你很高兴。',
      pinyin: 'Rènshi nǐ hěn gāoxìng.',
      traduccion: 'Encantado de conocerte.',
      traduccionTr: {
        en: 'Nice to meet you.',
        fr: 'Enchanté de te rencontrer.',
        de: 'Schön, dich kennenzulernen.',
        it: 'Piacere di conoscerti.',
        pt: 'Prazer em conhecer você.',
      },
    },
    {
      id: 's7',
      personaje: 'dong-ao',
      expresion: 'normal',
      chino: '我也很高兴！',
      pinyin: 'Wǒ yě hěn gāoxìng!',
      traduccion: '¡Yo también, encantado!',
      traduccionTr: {
        en: 'Me too, nice to meet you!',
        fr: 'Moi aussi, enchanté !',
        de: 'Ich auch, freut mich!',
        it: 'Anch’io, piacere!',
        pt: 'Eu também, prazer!',
      },
    },
  ],

  ejercicios: {
    // Bloque 1 — TRADUCCIÓN · 5 frases del diálogo
    traduccion: [
      {
        chino: '你好！',
        pinyin: 'Nǐ hǎo!',
        opciones: ['¡Hola!', '¿Qué tal?', 'Adiós', 'Gracias'],
        opcionesTr: {
          en: ['Hello!', 'How are you?', 'Goodbye', 'Thank you'],
          fr: ['Bonjour !', 'Comment ça va ?', 'Au revoir', 'Merci'],
          de: ['Hallo!', 'Wie geht’s?', 'Auf Wiedersehen', 'Danke'],
          it: ['Ciao!', 'Come va?', 'Arrivederci', 'Grazie'],
          pt: ['Olá!', 'Tudo bem?', 'Adeus', 'Obrigado'],
        },
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
        opcionesTr: {
          en: ['What’s your name?', 'Where are you from?', 'How are you?', 'How old are you?'],
          fr: ['Comment tu t’appelles ?', 'D’où viens-tu ?', 'Comment vas-tu ?', 'Quel âge as-tu ?'],
          de: ['Wie heißt du?', 'Woher kommst du?', 'Wie geht’s dir?', 'Wie alt bist du?'],
          it: ['Come ti chiami?', 'Di dove sei?', 'Come stai?', 'Quanti anni hai?'],
          pt: ['Como você se chama?', 'De onde você é?', 'Como você está?', 'Quantos anos você tem?'],
        },
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
        opcionesTr: {
          en: ['My surname is Dōng.', 'My name is Dōng.', 'I live in Dōng.', 'I’m from Dōng.'],
          fr: ['Mon nom de famille est Dōng.', 'Je m’appelle Dōng.', 'J’habite à Dōng.', 'Je viens de Dōng.'],
          de: ['Mein Nachname ist Dōng.', 'Ich heiße Dōng.', 'Ich wohne in Dōng.', 'Ich komme aus Dōng.'],
          it: ['Il mio cognome è Dōng.', 'Mi chiamo Dōng.', 'Vivo a Dōng.', 'Vengo da Dōng.'],
          pt: ['Meu sobrenome é Dōng.', 'Meu nome é Dōng.', 'Moro em Dōng.', 'Sou de Dōng.'],
        },
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
        opcionesTr: {
          en: ['Nice to meet you.', 'Good morning, how are you?', 'See you soon.', 'Excuse me, what’s your name?'],
          fr: ['Enchanté de te rencontrer.', 'Bonjour, comment ça va ?', 'À bientôt.', 'Excuse-moi, comment tu t’appelles ?'],
          de: ['Schön, dich kennenzulernen.', 'Guten Morgen, wie geht’s?', 'Bis bald.', 'Entschuldigung, wie heißt du?'],
          it: ['Piacere di conoscerti.', 'Buongiorno, come va?', 'A presto.', 'Scusa, come ti chiami?'],
          pt: ['Prazer em conhecer você.', 'Bom dia, tudo bem?', 'Até logo.', 'Com licença, como você se chama?'],
        },
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
        opcionesTr: {
          en: ['Me too, nice to meet you!', 'I’m not well.', 'I am a student.', 'I don’t know you.'],
          fr: ['Moi aussi, enchanté !', 'Je ne vais pas bien.', 'Je suis étudiant.', 'Je ne te connais pas.'],
          de: ['Ich auch, freut mich!', 'Mir geht es nicht gut.', 'Ich bin Student.', 'Ich kenne dich nicht.'],
          it: ['Anch’io, piacere!', 'Non sto bene.', 'Sono uno studente.', 'Non ti conosco.'],
          pt: ['Eu também, prazer!', 'Não estou bem.', 'Sou estudante.', 'Não conheço você.'],
        },
        correcta: 0,
      },
    ],

    // Bloque 2 — COMPLETAR LA FRASE · 4 huecos sobre vocabulario objetivo
    completar: [
      {
        frase: '我 ___ 东奥。',
        pinyin: 'Wǒ ___ Dōng Ào.',
        traduccion: 'Me llamo Dōng Ào.',
        traduccionTr: {
          en: 'My name is Dōng Ào.',
          fr: 'Je m’appelle Dōng Ào.',
          de: 'Ich heiße Dōng Ào.',
          it: 'Mi chiamo Dōng Ào.',
          pt: 'Meu nome é Dōng Ào.',
        },
        opciones: ['叫', '是', '姓', '认识'],
        correcta: 0,
      },
      {
        frase: '你 ___ 什么名字？',
        pinyin: 'Nǐ ___ shénme míngzi?',
        traduccion: '¿Cómo te llamas?',
        traduccionTr: {
          en: 'What’s your name?',
          fr: 'Comment tu t’appelles ?',
          de: 'Wie heißt du?',
          it: 'Come ti chiami?',
          pt: 'Como você se chama?',
        },
        opciones: ['叫', '高兴', '也', '请问'],
        correcta: 0,
      },
      {
        frase: '认识你很 ___ 。',
        pinyin: 'Rènshi nǐ hěn ___ .',
        traduccion: 'Encantado de conocerte.',
        traduccionTr: {
          en: 'Nice to meet you.',
          fr: 'Enchanté de te rencontrer.',
          de: 'Schön, dich kennenzulernen.',
          it: 'Piacere di conoscerti.',
          pt: 'Prazer em conhecer você.',
        },
        opciones: ['高兴', '名字', '认识', '姓'],
        correcta: 0,
      },
      {
        frase: '我 ___ 很高兴。',
        pinyin: 'Wǒ ___ hěn gāoxìng.',
        traduccion: 'Yo también estoy encantado.',
        traduccionTr: {
          en: 'I’m glad too.',
          fr: 'Moi aussi, je suis ravi.',
          de: 'Ich freue mich auch.',
          it: 'Anch’io sono contento.',
          pt: 'Eu também estou contente.',
        },
        opciones: ['也', '叫', '姓', '请问'],
        correcta: 0,
      },
    ],

    // Bloque 3 — COMPRENSIÓN · 3 preguntas sobre la historia
    comprension: [
      {
        pregunta: '¿Cómo se llama el estudiante chino?',
        preguntaTr: {
          en: 'What is the Chinese student’s name?',
          fr: 'Comment s’appelle l’étudiant chinois ?',
          de: 'Wie heißt der chinesische Student?',
          it: 'Come si chiama lo studente cinese?',
          pt: 'Como se chama o estudante chinês?',
        },
        opciones: ['东奥', '晓敏', '马可', '小明'],
        correcta: 0,
      },
      {
        pregunta: '¿Qué dice 东奥 cuando se presenta?',
        preguntaTr: {
          en: 'What does 东奥 say when he introduces himself?',
          fr: 'Que dit 东奥 quand il se présente ?',
          de: 'Was sagt 东奥, als er sich vorstellt?',
          it: 'Cosa dice 东奥 quando si presenta?',
          pt: 'O que 东奥 diz ao se apresentar?',
        },
        opciones: [
          'Su apellido y su nombre',
          'Sólo su nombre',
          'Sólo su edad',
          'Su país de origen',
        ],
        opcionesTr: {
          en: ['His surname and his given name', 'Only his name', 'Only his age', 'His country of origin'],
          fr: ['Son nom et son prénom', 'Seulement son prénom', 'Seulement son âge', 'Son pays d’origine'],
          de: ['Seinen Nachnamen und Vornamen', 'Nur seinen Namen', 'Nur sein Alter', 'Sein Herkunftsland'],
          it: ['Il cognome e il nome', 'Solo il nome', 'Solo l’età', 'Il paese d’origine'],
          pt: ['O sobrenome e o nome', 'Só o nome', 'Só a idade', 'O país de origem'],
        },
        correcta: 0,
      },
      {
        pregunta: '¿Cómo termina la conversación?',
        preguntaTr: {
          en: 'How does the conversation end?',
          fr: 'Comment se termine la conversation ?',
          de: 'Wie endet das Gespräch?',
          it: 'Come finisce la conversazione?',
          pt: 'Como termina a conversa?',
        },
        opciones: [
          'Los dos están encantados de conocerse',
          '东奥 se enfada y se va',
          'El usuario no entiende y se va',
          'Hablan sobre su familia',
        ],
        opcionesTr: {
          en: ['They are both glad to meet each other', '东奥 gets angry and leaves', 'The user doesn’t understand and leaves', 'They talk about their family'],
          fr: ['Tous les deux sont ravis de se rencontrer', '东奥 se fâche et s’en va', 'L’utilisateur ne comprend pas et s’en va', 'Ils parlent de leur famille'],
          de: ['Beide freuen sich, sich kennenzulernen', '东奥 wird wütend und geht', 'Der Nutzer versteht nicht und geht', 'Sie sprechen über ihre Familie'],
          it: ['Sono entrambi felici di conoscersi', '东奥 si arrabbia e se ne va', 'L’utente non capisce e se ne va', 'Parlano della loro famiglia'],
          pt: ['Os dois ficam felizes em se conhecer', '东奥 fica bravo e vai embora', 'O usuário não entende e vai embora', 'Eles falam sobre a família'],
        },
        correcta: 0,
      },
    ],
  },
};
