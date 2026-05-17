// src/data/dialogueOrderData.js
// Datos para "Ordena el diálogo" — mini-diálogos desordenados
// Cada entrada: lines (array en orden correcto), lesson, translations

const dialogueOrderData = [
  // === Lección 1 ===
  {
    lesson: 1,
    lines: [
      { speaker: 'A', text: '你好！', pinyin: 'Nǐ hǎo!' },
      { speaker: 'B', text: '你好！你好吗？', pinyin: 'Nǐ hǎo! Nǐ hǎo ma?' },
      { speaker: 'A', text: '我很好，谢谢！你呢？', pinyin: 'Wǒ hěn hǎo, xièxie! Nǐ ne?' },
      { speaker: 'B', text: '我也很好。', pinyin: 'Wǒ yě hěn hǎo.' },
    ],
    translations: {
      es: ['¡Hola!', '¡Hola! ¿Cómo estás?', 'Estoy bien, ¡gracias! ¿Y tú?', 'Yo también estoy bien.'],
      en: ['Hello!', 'Hello! How are you?', "I'm fine, thanks! And you?", "I'm fine too."],
      fr: ['Bonjour !', 'Bonjour ! Comment vas-tu ?', 'Je vais bien, merci ! Et toi ?', 'Moi aussi, je vais bien.'],
      de: ['Hallo!', 'Hallo! Wie geht es dir?', 'Mir geht es gut, danke! Und dir?', 'Mir geht es auch gut.'],
      it: ['Ciao!', 'Ciao! Come stai?', 'Sto bene, grazie! E tu?', 'Anch\'io sto bene.'],
      pt: ['Olá!', 'Olá! Como está?', 'Estou bem, obrigado! E você?', 'Eu também estou bem.'],
    },
  },
  {
    lesson: 1,
    lines: [
      { speaker: 'A', text: '你忙吗？', pinyin: 'Nǐ máng ma?' },
      { speaker: 'B', text: '我很忙。你呢？', pinyin: 'Wǒ hěn máng. Nǐ ne?' },
      { speaker: 'A', text: '我不忙。', pinyin: 'Wǒ bù máng.' },
      { speaker: 'B', text: '太好了！', pinyin: 'Tài hǎo le!' },
    ],
    translations: {
      es: ['¿Estás ocupado?', 'Estoy muy ocupado. ¿Y tú?', 'No estoy ocupado.', '¡Qué bien!'],
      en: ['Are you busy?', "I'm very busy. And you?", "I'm not busy.", 'Great!'],
      fr: ['Tu es occupé ?', 'Je suis très occupé. Et toi ?', 'Je ne suis pas occupé.', 'Super !'],
      de: ['Bist du beschäftigt?', 'Ich bin sehr beschäftigt. Und du?', 'Ich bin nicht beschäftigt.', 'Super!'],
      it: ['Sei occupato?', 'Sono molto occupato. E tu?', 'Non sono occupato.', 'Ottimo!'],
      pt: ['Está ocupado?', 'Estou muito ocupado. E você?', 'Não estou ocupado.', 'Ótimo!'],
    },
  },
  {
    lesson: 1,
    lines: [
      { speaker: 'A', text: '他是谁？', pinyin: 'Tā shì shéi?' },
      { speaker: 'B', text: '他是我的老师。', pinyin: 'Tā shì wǒ de lǎoshī.' },
      { speaker: 'A', text: '他叫什么名字？', pinyin: 'Tā jiào shénme míngzi?' },
      { speaker: 'B', text: '他姓王。', pinyin: 'Tā xìng Wáng.' },
    ],
    translations: {
      es: ['¿Quién es él?', 'Es mi profesor.', '¿Cómo se llama?', 'Se apellida Wang.'],
      en: ['Who is he?', 'He is my teacher.', 'What is his name?', 'His surname is Wang.'],
      fr: ['Qui est-il ?', "C'est mon professeur.", 'Comment s\'appelle-t-il ?', 'Il s\'appelle Wang.'],
      de: ['Wer ist er?', 'Er ist mein Lehrer.', 'Wie heißt er?', 'Sein Nachname ist Wang.'],
      it: ['Chi è lui?', 'È il mio professore.', 'Come si chiama?', 'Si chiama Wang.'],
      pt: ['Quem é ele?', 'É meu professor.', 'Como ele se chama?', 'O sobrenome dele é Wang.'],
    },
  },

  // === Lección 2 ===
  {
    lesson: 2,
    lines: [
      { speaker: 'A', text: '你是哪国人？', pinyin: 'Nǐ shì nǎ guó rén?' },
      { speaker: 'B', text: '我是西班牙人。你呢？', pinyin: 'Wǒ shì Xībānyá rén. Nǐ ne?' },
      { speaker: 'A', text: '我是中国人。', pinyin: 'Wǒ shì Zhōngguó rén.' },
      { speaker: 'B', text: '你说汉语说得很好！', pinyin: 'Nǐ shuō Hànyǔ shuō de hěn hǎo!' },
    ],
    translations: {
      es: ['¿De qué país eres?', 'Soy español. ¿Y tú?', 'Soy chino.', '¡Hablas chino muy bien!'],
      en: ['What country are you from?', "I'm Spanish. And you?", "I'm Chinese.", 'You speak Chinese very well!'],
      fr: ['De quel pays es-tu ?', 'Je suis Espagnol. Et toi ?', 'Je suis Chinois.', 'Tu parles très bien chinois !'],
      de: ['Aus welchem Land kommst du?', 'Ich bin Spanier. Und du?', 'Ich bin Chinese.', 'Du sprichst sehr gut Chinesisch!'],
      it: ['Di che paese sei?', 'Sono spagnolo. E tu?', 'Sono cinese.', 'Parli cinese molto bene!'],
      pt: ['De que país você é?', 'Sou espanhol. E você?', 'Sou chinês.', 'Você fala chinês muito bem!'],
    },
  },
  {
    lesson: 2,
    lines: [
      { speaker: 'A', text: '你会说英语吗？', pinyin: 'Nǐ huì shuō Yīngyǔ ma?' },
      { speaker: 'B', text: '会，我会说一点儿。', pinyin: 'Huì, wǒ huì shuō yìdiǎnr.' },
      { speaker: 'A', text: '你学了多长时间？', pinyin: 'Nǐ xué le duō cháng shíjiān?' },
      { speaker: 'B', text: '两年了。', pinyin: 'Liǎng nián le.' },
    ],
    translations: {
      es: ['¿Sabes hablar inglés?', 'Sí, sé hablar un poco.', '¿Cuánto tiempo has estudiado?', 'Dos años.'],
      en: ['Can you speak English?', 'Yes, I can speak a little.', 'How long have you studied?', 'Two years.'],
      fr: ['Tu parles anglais ?', 'Oui, un peu.', "Depuis combien de temps ?", 'Deux ans.'],
      de: ['Sprichst du Englisch?', 'Ja, ein bisschen.', 'Wie lange hast du gelernt?', 'Zwei Jahre.'],
      it: ['Parli inglese?', 'Sì, un po\'.', 'Da quanto tempo studi?', 'Due anni.'],
      pt: ['Você fala inglês?', 'Sim, falo um pouco.', 'Há quanto tempo estuda?', 'Dois anos.'],
    },
  },

  // === Lección 3 ===
  {
    lesson: 3,
    lines: [
      { speaker: 'A', text: '你家有几口人？', pinyin: 'Nǐ jiā yǒu jǐ kǒu rén?' },
      { speaker: 'B', text: '我家有四口人。', pinyin: 'Wǒ jiā yǒu sì kǒu rén.' },
      { speaker: 'A', text: '他们是谁？', pinyin: 'Tāmen shì shéi?' },
      { speaker: 'B', text: '爸爸、妈妈、姐姐和我。', pinyin: 'Bàba, māma, jiějie hé wǒ.' },
    ],
    translations: {
      es: ['¿Cuántas personas hay en tu familia?', 'Somos cuatro.', '¿Quiénes son?', 'Papá, mamá, mi hermana y yo.'],
      en: ['How many people in your family?', 'There are four.', 'Who are they?', 'Dad, mom, my sister and me.'],
      fr: ['Combien de personnes dans ta famille ?', 'Nous sommes quatre.', 'Qui sont-ils ?', 'Papa, maman, ma soeur et moi.'],
      de: ['Wie viele Personen in deiner Familie?', 'Wir sind vier.', 'Wer sind sie?', 'Papa, Mama, meine Schwester und ich.'],
      it: ['Quante persone nella tua famiglia?', 'Siamo quattro.', 'Chi sono?', 'Papà, mamma, mia sorella e io.'],
      pt: ['Quantas pessoas na sua família?', 'Somos quatro.', 'Quem são?', 'Pai, mãe, minha irmã e eu.'],
    },
  },
  {
    lesson: 3,
    lines: [
      { speaker: 'A', text: '你有兄弟姐妹吗？', pinyin: 'Nǐ yǒu xiōngdì jiěmèi ma?' },
      { speaker: 'B', text: '我有一个弟弟。', pinyin: 'Wǒ yǒu yí ge dìdi.' },
      { speaker: 'A', text: '他多大了？', pinyin: 'Tā duō dà le?' },
      { speaker: 'B', text: '他十五岁。', pinyin: 'Tā shíwǔ suì.' },
    ],
    translations: {
      es: ['¿Tienes hermanos?', 'Tengo un hermano menor.', '¿Cuántos años tiene?', 'Tiene quince años.'],
      en: ['Do you have siblings?', 'I have a younger brother.', 'How old is he?', "He's fifteen."],
      fr: ['Tu as des frères et soeurs ?', "J'ai un petit frère.", 'Quel âge a-t-il ?', 'Il a quinze ans.'],
      de: ['Hast du Geschwister?', 'Ich habe einen jüngeren Bruder.', 'Wie alt ist er?', 'Er ist fünfzehn.'],
      it: ['Hai fratelli o sorelle?', 'Ho un fratello minore.', 'Quanti anni ha?', 'Ha quindici anni.'],
      pt: ['Você tem irmãos?', 'Tenho um irmão mais novo.', 'Quantos anos ele tem?', 'Ele tem quinze anos.'],
    },
  },

  // === Lección 4 ===
  {
    lesson: 4,
    lines: [
      { speaker: 'A', text: '现在几点？', pinyin: 'Xiànzài jǐ diǎn?' },
      { speaker: 'B', text: '现在下午两点半。', pinyin: 'Xiànzài xiàwǔ liǎng diǎn bàn.' },
      { speaker: 'A', text: '你几点上课？', pinyin: 'Nǐ jǐ diǎn shàng kè?' },
      { speaker: 'B', text: '三点上课。', pinyin: 'Sān diǎn shàng kè.' },
    ],
    translations: {
      es: ['¿Qué hora es?', 'Son las dos y media de la tarde.', '¿A qué hora tienes clase?', 'A las tres.'],
      en: ['What time is it?', "It's half past two in the afternoon.", 'What time is your class?', 'At three.'],
      fr: ['Quelle heure est-il ?', 'Il est deux heures et demie.', 'À quelle heure as-tu cours ?', 'À trois heures.'],
      de: ['Wie spät ist es?', 'Es ist halb drei nachmittags.', 'Wann hast du Unterricht?', 'Um drei Uhr.'],
      it: ['Che ora è?', 'Sono le due e mezza.', 'A che ora hai lezione?', 'Alle tre.'],
      pt: ['Que horas são?', 'São duas e meia da tarde.', 'A que horas é a aula?', 'Às três.'],
    },
  },
  {
    lesson: 4,
    lines: [
      { speaker: 'A', text: '你明天有课吗？', pinyin: 'Nǐ míngtiān yǒu kè ma?' },
      { speaker: 'B', text: '有，上午有两节课。', pinyin: 'Yǒu, shàngwǔ yǒu liǎng jié kè.' },
      { speaker: 'A', text: '下午呢？', pinyin: 'Xiàwǔ ne?' },
      { speaker: 'B', text: '下午没有课。', pinyin: 'Xiàwǔ méiyǒu kè.' },
    ],
    translations: {
      es: ['¿Tienes clase mañana?', 'Sí, tengo dos clases por la mañana.', '¿Y por la tarde?', 'Por la tarde no tengo clase.'],
      en: ['Do you have class tomorrow?', 'Yes, two classes in the morning.', 'And in the afternoon?', 'No class in the afternoon.'],
      fr: ['Tu as cours demain ?', 'Oui, deux cours le matin.', "Et l'après-midi ?", "Pas de cours l'après-midi."],
      de: ['Hast du morgen Unterricht?', 'Ja, zwei Stunden am Vormittag.', 'Und nachmittags?', 'Nachmittags keinen Unterricht.'],
      it: ['Hai lezione domani?', 'Sì, due lezioni di mattina.', 'E il pomeriggio?', 'Il pomeriggio non ho lezione.'],
      pt: ['Tem aula amanhã?', 'Sim, duas aulas de manhã.', 'E à tarde?', 'À tarde não tenho aula.'],
    },
  },
];

export default dialogueOrderData;
