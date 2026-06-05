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

  // === Lección 5 ===
  {
    lesson: 5,
    lines: [
      { speaker: 'A', text: '今天是我的生日。', pinyin: 'Jīntiān shì wǒ de shēngrì.' },
      { speaker: 'B', text: '真的吗？祝你生日快乐！', pinyin: 'Zhēn de ma? Zhù nǐ shēngrì kuàilè!' },
      { speaker: 'A', text: '谢谢！晚上有一个聚会。', pinyin: 'Xièxie! Wǎnshang yǒu yī gè jùhuì.' },
      { speaker: 'B', text: '我也参加，好不好？', pinyin: 'Wǒ yě cānjiā, hǎo bù hǎo?' },
    ],
    translations: {
      es: ['Hoy es mi cumpleaños.', '¿De verdad? ¡Feliz cumpleaños!', 'Gracias. Por la noche hay una fiesta.', 'Yo también voy, ¿vale?'],
      en: ['Today is my birthday.', 'Really? Happy birthday!', 'Thanks! There\'s a party tonight.', 'I\'ll join too, OK?'],
      fr: ['C\'est mon anniversaire aujourd\'hui.', 'Vraiment ? Joyeux anniversaire !', 'Merci ! Il y a une fête ce soir.', 'Je viens aussi, d\'accord ?'],
      de: ['Heute ist mein Geburtstag.', 'Wirklich? Alles Gute zum Geburtstag!', 'Danke! Heute Abend gibt es eine Feier.', 'Ich komme auch, okay?'],
      it: ['Oggi è il mio compleanno.', 'Davvero? Buon compleanno!', 'Grazie! Stasera c\'è una festa.', 'Vengo anch\'io, va bene?'],
      pt: ['Hoje é o meu aniversário.', 'A sério? Feliz aniversário!', 'Obrigado! À noite há uma festa.', 'Eu também vou, está bem?'],
    },
  },
  {
    lesson: 5,
    lines: [
      { speaker: 'A', text: '你属什么？', pinyin: 'Nǐ shǔ shénme?' },
      { speaker: 'B', text: '我属龙。你呢？', pinyin: 'Wǒ shǔ lóng. Nǐ ne?' },
      { speaker: 'A', text: '我属马。', pinyin: 'Wǒ shǔ mǎ.' },
      { speaker: 'B', text: '我们都很年轻！', pinyin: 'Wǒmen dōu hěn niánqīng!' },
    ],
    translations: {
      es: ['¿De qué signo del zodiaco eres?', 'Soy del año del dragón. ¿Y tú?', 'Yo soy del año del caballo.', '¡Los dos somos muy jóvenes!'],
      en: ['What zodiac sign are you?', 'I\'m the dragon. And you?', 'I\'m the horse.', 'We\'re both very young!'],
      fr: ['Quel est ton signe du zodiaque ?', 'Je suis du dragon. Et toi ?', 'Moi je suis du cheval.', 'Nous sommes tous les deux très jeunes !'],
      de: ['Welches Tierkreiszeichen hast du?', 'Ich bin Drache. Und du?', 'Ich bin Pferd.', 'Wir sind beide sehr jung!'],
      it: ['Di che segno cinese sei?', 'Sono del drago. E tu?', 'Io sono del cavallo.', 'Siamo tutti e due molto giovani!'],
      pt: ['De que signo do zodíaco és?', 'Sou do dragão. E tu?', 'Eu sou do cavalo.', 'Somos os dois muito jovens!'],
    },
  },

  // === Lección 6 ===
  {
    lesson: 6,
    lines: [
      { speaker: 'A', text: '请问，图书馆在哪儿？', pinyin: 'Qǐngwèn, túshūguǎn zài nǎr?' },
      { speaker: 'B', text: '在食堂北边。', pinyin: 'Zài shítáng běibiān.' },
      { speaker: 'A', text: '远不远？', pinyin: 'Yuǎn bù yuǎn?' },
      { speaker: 'B', text: '不远，跟我来。', pinyin: 'Bù yuǎn, gēn wǒ lái.' },
    ],
    translations: {
      es: ['Disculpa, ¿dónde está la biblioteca?', 'Al norte del comedor.', '¿Está lejos?', 'No, ven conmigo.'],
      en: ['Excuse me, where is the library?', 'North of the canteen.', 'Is it far?', 'Not far, come with me.'],
      fr: ['Excusez-moi, où est la bibliothèque ?', 'Au nord de la cantine.', 'C\'est loin ?', 'Non, viens avec moi.'],
      de: ['Entschuldigung, wo ist die Bibliothek?', 'Nördlich der Mensa.', 'Ist es weit?', 'Nicht weit, komm mit mir.'],
      it: ['Scusa, dov\'è la biblioteca?', 'A nord della mensa.', 'È lontano?', 'No, vieni con me.'],
      pt: ['Com licença, onde fica a biblioteca?', 'Ao norte do refeitório.', 'É longe?', 'Não, vem comigo.'],
    },
  },
  {
    lesson: 6,
    lines: [
      { speaker: 'A', text: '银行在哪儿？', pinyin: 'Yínháng zài nǎr?' },
      { speaker: 'B', text: '在超市旁边。', pinyin: 'Zài chāoshì pángbiān.' },
      { speaker: 'A', text: '怎么去？', pinyin: 'Zěnme qù?' },
      { speaker: 'B', text: '过马路就到了。', pinyin: 'Guò mǎlù jiù dào le.' },
    ],
    translations: {
      es: ['¿Dónde está el banco?', 'Al lado del supermercado.', '¿Cómo se va?', 'Cruzas la calle y ya estás.'],
      en: ['Where is the bank?', 'Next to the supermarket.', 'How do I get there?', 'Cross the street and you\'re there.'],
      fr: ['Où est la banque ?', 'À côté du supermarché.', 'Comment y aller ?', 'Tu traverses la rue et c\'est là.'],
      de: ['Wo ist die Bank?', 'Neben dem Supermarkt.', 'Wie kommt man dahin?', 'Über die Straße — schon angekommen.'],
      it: ['Dov\'è la banca?', 'Accanto al supermercato.', 'Come ci si arriva?', 'Attraversi la strada e ci sei.'],
      pt: ['Onde fica o banco?', 'Ao lado do supermercado.', 'Como se vai?', 'Atravessas a rua e já estás lá.'],
    },
  },

  // === Lección 7 ===
  {
    lesson: 7,
    lines: [
      { speaker: 'A', text: '老板，苹果多少钱一斤？', pinyin: 'Lǎobǎn, píngguǒ duōshao qián yī jīn?' },
      { speaker: 'B', text: '五块钱一斤。', pinyin: 'Wǔ kuài qián yī jīn.' },
      { speaker: 'A', text: '太贵了，便宜点儿吧。', pinyin: 'Tài guì le, piányi diǎnr ba.' },
      { speaker: 'B', text: '好吧，四块。', pinyin: 'Hǎo ba, sì kuài.' },
    ],
    translations: {
      es: ['Jefe, ¿a cuánto el jin de manzanas?', 'Cinco yuanes el jin.', 'Muy caro, hazme un descuento.', 'Vale, cuatro.'],
      en: ['Boss, how much for one jin of apples?', 'Five yuan per jin.', 'Too expensive, make it cheaper.', 'OK, four.'],
      fr: ['Patron, combien le jin de pommes ?', 'Cinq yuans le jin.', 'C\'est trop cher, fais un effort.', 'D\'accord, quatre.'],
      de: ['Chef, was kostet ein Jin Äpfel?', 'Fünf Yuan pro Jin.', 'Zu teuer, mach\'s billiger.', 'Okay, vier.'],
      it: ['Capo, quanto al jin le mele?', 'Cinque yuan al jin.', 'Troppo caro, falle costare meno.', 'Va bene, quattro.'],
      pt: ['Chefe, quanto custa o jin de maçãs?', 'Cinco yuanes o jin.', 'Caro demais, faça mais barato.', 'Está bem, quatro.'],
    },
  },
  {
    lesson: 7,
    lines: [
      { speaker: 'A', text: '我想买一件衬衫。', pinyin: 'Wǒ xiǎng mǎi yī jiàn chènshān.' },
      { speaker: 'B', text: '这件怎么样？', pinyin: 'Zhè jiàn zěnmeyàng?' },
      { speaker: 'A', text: '可以试一下吗？', pinyin: 'Kěyǐ shì yīxià ma?' },
      { speaker: 'B', text: '当然可以。', pinyin: 'Dāngrán kěyǐ.' },
    ],
    translations: {
      es: ['Quiero comprar una camisa.', '¿Qué tal esta?', '¿Puedo probármela?', 'Por supuesto.'],
      en: ['I want to buy a shirt.', 'How about this one?', 'Can I try it on?', 'Of course.'],
      fr: ['Je veux acheter une chemise.', 'Celle-ci, ça te plaît ?', 'Je peux l\'essayer ?', 'Bien sûr.'],
      de: ['Ich möchte ein Hemd kaufen.', 'Wie ist dieses?', 'Darf ich es anprobieren?', 'Natürlich.'],
      it: ['Voglio comprare una camicia.', 'Questa come ti sembra?', 'Posso provarla?', 'Certo.'],
      pt: ['Quero comprar uma camisa.', 'Que tal esta?', 'Posso experimentá-la?', 'Claro que sim.'],
    },
  },

  // === Lección 8 ===
  {
    lesson: 8,
    lines: [
      { speaker: 'A', text: '你怎么了？', pinyin: 'Nǐ zěnme le?' },
      { speaker: 'B', text: '我头疼，全身不舒服。', pinyin: 'Wǒ tóu téng, quánshēn bù shūfu.' },
      { speaker: 'A', text: '你应该去医院。', pinyin: 'Nǐ yīnggāi qù yīyuàn.' },
      { speaker: 'B', text: '好，今天不能上课了。', pinyin: 'Hǎo, jīntiān bù néng shàngkè le.' },
    ],
    translations: {
      es: ['¿Qué te pasa?', 'Me duele la cabeza, no me encuentro nada bien.', 'Deberías ir al hospital.', 'Vale, hoy no podré ir a clase.'],
      en: ['What\'s wrong with you?', 'I have a headache, I feel awful all over.', 'You should go to the hospital.', 'Okay, I can\'t go to class today.'],
      fr: ['Qu\'est-ce qui t\'arrive ?', 'J\'ai mal à la tête, je me sens mal partout.', 'Tu devrais aller à l\'hôpital.', 'D\'accord, je ne peux pas aller en cours aujourd\'hui.'],
      de: ['Was ist mit dir los?', 'Ich habe Kopfschmerzen und fühle mich überall schlecht.', 'Du solltest ins Krankenhaus gehen.', 'Okay, heute kann ich nicht zum Unterricht.'],
      it: ['Cosa hai?', 'Ho mal di testa, mi sento male dappertutto.', 'Dovresti andare in ospedale.', 'Va bene, oggi non posso andare a lezione.'],
      pt: ['O que se passa contigo?', 'Doí-me a cabeça, sinto-me mal em todo o corpo.', 'Devias ir ao hospital.', 'Está bem, hoje não posso ir à aula.'],
    },
  },
  {
    lesson: 8,
    lines: [
      { speaker: 'A', text: '你哪儿不舒服？', pinyin: 'Nǐ nǎr bù shūfu?' },
      { speaker: 'B', text: '我嗓子有点儿疼。', pinyin: 'Wǒ sǎngzi yǒu diǎnr téng.' },
      { speaker: 'A', text: '我给你量一下体温。', pinyin: 'Wǒ gěi nǐ liáng yīxià tǐwēn.' },
      { speaker: 'B', text: '需要打针吗？', pinyin: 'Xūyào dǎzhēn ma?' },
    ],
    translations: {
      es: ['¿Dónde te encuentras mal?', 'Me duele un poco la garganta.', 'Te tomo la temperatura.', '¿Hace falta una inyección?'],
      en: ['Where does it hurt?', 'My throat hurts a little.', 'Let me take your temperature.', 'Do I need an injection?'],
      fr: ['Où as-tu mal ?', 'J\'ai un peu mal à la gorge.', 'Je prends ta température.', 'Faut-il une piqûre ?'],
      de: ['Wo tut es weh?', 'Mein Hals tut etwas weh.', 'Ich messe dir die Temperatur.', 'Brauche ich eine Spritze?'],
      it: ['Dove ti senti male?', 'Mi fa un po\' male la gola.', 'Ti misuro la temperatura.', 'Serve una puntura?'],
      pt: ['Onde te dói?', 'Doí-me um pouco a garganta.', 'Vou medir-te a temperatura.', 'É preciso uma injecção?'],
    },
  },
];

export default dialogueOrderData;
