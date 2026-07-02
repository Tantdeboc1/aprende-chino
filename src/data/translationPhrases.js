// src/data/translationPhrases.js
// Pool de frases para el minijuego "Traduce la Frase" — FUENTE multilingüe.
// El cliente NO importa este archivo en runtime: scripts/split-i18n-data.mjs
// genera src/data/phrases/{lang}.js (translations resuelto a string) y
// loadTranslationPhrases() de loadContent.js carga solo el idioma activo.
// El diccionario pinyin→hanzi del IME vive en src/data/pinyinDictionary.js.
// Organizadas por lección (1-8), 10 frases por lección.
// Fuente: vocabulario y patrones de los temas 1-8 del libro
// "El Nuevo Libro de Chino Práctico (3ª Edición)" y ampliaciones.

export const translationPhrases = [
  // ════════════════════════════════════════════════════════════════════════
  // LECCIÓN 1 — Saludos y presentaciones
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 101, lesson: 1, hanzi: "你好！", pinyin: "Nǐ hǎo!",
    translations: { es: "¡Hola!", en: "Hello!", fr: "Bonjour !", de: "Hallo!", it: "Ciao!", pt: "Olá!" },
  },
  {
    id: 102, lesson: 1, hanzi: "你最近怎么样？", pinyin: "Nǐ zuìjìn zěnmeyàng?",
    translations: {
      es: "¿Cómo has estado últimamente?",
      en: "How have you been lately?",
      fr: "Comment vas-tu ces derniers temps ?",
      de: "Wie geht es dir in letzter Zeit?",
      it: "Come stai ultimamente?",
      pt: "Como tens estado ultimamente?",
    },
  },
  {
    id: 103, lesson: 1, hanzi: "我很好，谢谢。", pinyin: "Wǒ hěn hǎo, xièxie.",
    translations: {
      es: "Estoy muy bien, gracias.",
      en: "I'm very well, thank you.",
      fr: "Je vais très bien, merci.",
      de: "Mir geht es sehr gut, danke.",
      it: "Sto molto bene, grazie.",
      pt: "Estou muito bem, obrigado.",
    },
  },
  {
    id: 104, lesson: 1, hanzi: "你叫什么名字？", pinyin: "Nǐ jiào shénme míngzi?",
    translations: {
      es: "¿Cómo te llamas?",
      en: "What's your name?",
      fr: "Comment t'appelles-tu ?",
      de: "Wie heißt du?",
      it: "Come ti chiami?",
      pt: "Como te chamas?",
    },
  },
  {
    id: 105, lesson: 1, hanzi: "我叫马丁。", pinyin: "Wǒ jiào Mǎdīng.",
    translations: {
      es: "Me llamo Martín.",
      en: "My name is Martin.",
      fr: "Je m'appelle Martin.",
      de: "Ich heiße Martin.",
      it: "Mi chiamo Martin.",
      pt: "Chamo-me Martín.",
    },
  },
  {
    id: 106, lesson: 1, hanzi: "老师，您贵姓？", pinyin: "Lǎoshī, nín guìxìng?",
    translations: {
      es: "Profesor/a, ¿cuál es su apellido?",
      en: "Teacher, what is your surname?",
      fr: "Professeur, quel est votre nom de famille ?",
      de: "Lehrer/in, wie ist Ihr Nachname?",
      it: "Professore/ssa, qual è il suo cognome?",
      pt: "Professor/a, qual é o seu sobrenome?",
    },
  },
  {
    id: 107, lesson: 1, hanzi: "认识你很高兴。", pinyin: "Rènshi nǐ hěn gāoxìng.",
    translations: {
      es: "Encantado/a de conocerte.",
      en: "Nice to meet you.",
      fr: "Enchanté/e de te rencontrer.",
      de: "Schön, dich kennenzulernen.",
      it: "Piacere di conoscerti.",
      pt: "Prazer em conhecer-te.",
    },
  },
  {
    id: 108, lesson: 1, hanzi: "老师好！", pinyin: "Lǎoshī hǎo!",
    translations: {
      es: "¡Hola, profesor/a!",
      en: "Hello, teacher!",
      fr: "Bonjour, professeur !",
      de: "Hallo, Lehrer/in!",
      it: "Salve, professore/ssa!",
      pt: "Olá, professor/a!",
    },
  },
  {
    id: 109, lesson: 1, hanzi: "我不太忙。", pinyin: "Wǒ bú tài máng.",
    translations: {
      es: "No estoy muy ocupado/a.",
      en: "I'm not very busy.",
      fr: "Je ne suis pas très occupé/e.",
      de: "Ich bin nicht sehr beschäftigt.",
      it: "Non sono molto occupato/a.",
      pt: "Não estou muito ocupado/a.",
    },
  },
  {
    id: 110, lesson: 1, hanzi: "他也很好。", pinyin: "Tā yě hěn hǎo.",
    translations: {
      es: "Él también está muy bien.",
      en: "He is also very well.",
      fr: "Lui aussi va très bien.",
      de: "Ihm geht es auch sehr gut.",
      it: "Anche lui sta molto bene.",
      pt: "Ele também está muito bem.",
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // LECCIÓN 2 — Nacionalidades, idiomas, comida
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 201, lesson: 2, hanzi: "你是哪国人？", pinyin: "Nǐ shì nǎ guó rén?",
    translations: {
      es: "¿De qué país eres?",
      en: "What country are you from?",
      fr: "De quel pays es-tu ?",
      de: "Aus welchem Land kommst du?",
      it: "Di che paese sei?",
      pt: "De que país és?",
    },
  },
  {
    id: 202, lesson: 2, hanzi: "我是西班牙人。", pinyin: "Wǒ shì Xībānyá rén.",
    translations: {
      es: "Soy español/a.",
      en: "I am Spanish.",
      fr: "Je suis espagnol/e.",
      de: "Ich bin Spanier/in.",
      it: "Sono spagnolo/a.",
      pt: "Sou espanhol/a.",
    },
  },
  {
    id: 203, lesson: 2, hanzi: "你说汉语吗？", pinyin: "Nǐ shuō Hànyǔ ma?",
    translations: {
      es: "¿Hablas chino?",
      en: "Do you speak Chinese?",
      fr: "Tu parles chinois ?",
      de: "Sprichst du Chinesisch?",
      it: "Parli cinese?",
      pt: "Falas chinês?",
    },
  },
  {
    id: 204, lesson: 2, hanzi: "我会说一点儿。", pinyin: "Wǒ huì shuō yīdiǎnr.",
    translations: {
      es: "Sé hablar un poco.",
      en: "I can speak a little.",
      fr: "Je sais parler un peu.",
      de: "Ich kann ein bisschen sprechen.",
      it: "So parlare un po'.",
      pt: "Sei falar um pouco.",
    },
  },
  {
    id: 205, lesson: 2, hanzi: "他喜欢吃饺子。", pinyin: "Tā xǐhuān chī jiǎozi.",
    translations: {
      es: "A él le gusta comer empanadillas.",
      en: "He likes to eat dumplings.",
      fr: "Il aime manger des raviolis.",
      de: "Er isst gern Teigtaschen.",
      it: "Gli piace mangiare ravioli.",
      pt: "Ele gosta de comer bolinhos.",
    },
  },
  {
    id: 206, lesson: 2, hanzi: "北京人喜欢吃什么？", pinyin: "Běijīng rén xǐhuān chī shénme?",
    translations: {
      es: "¿Qué les gusta comer a los pekineses?",
      en: "What do people from Beijing like to eat?",
      fr: "Qu'est-ce que les Pékinois aiment manger ?",
      de: "Was essen die Pekinger gern?",
      it: "Cosa piace mangiare ai pechinesi?",
      pt: "O que os pequineses gostam de comer?",
    },
  },
  {
    id: 207, lesson: 2, hanzi: "包子和饺子都很好吃。", pinyin: "Bāozi hé jiǎozi dōu hěn hǎochī.",
    translations: {
      es: "Los bollos al vapor y las empanadillas están deliciosos.",
      en: "Steamed buns and dumplings are delicious.",
      fr: "Les brioches vapeur et les raviolis sont délicieux.",
      de: "Dampfbrötchen und Teigtaschen sind köstlich.",
      it: "I panini al vapore e i ravioli sono deliziosi.",
      pt: "Os pães cozidos no vapor e os bolinhos são deliciosos.",
    },
  },
  {
    id: 208, lesson: 2, hanzi: "我也是学生。", pinyin: "Wǒ yě shì xuésheng.",
    translations: {
      es: "Yo también soy estudiante.",
      en: "I am also a student.",
      fr: "Moi aussi je suis étudiant/e.",
      de: "Ich bin auch Student/in.",
      it: "Anch'io sono studente/ssa.",
      pt: "Eu também sou estudante.",
    },
  },
  {
    id: 209, lesson: 2, hanzi: "她不是法国人。", pinyin: "Tā bú shì Fǎguó rén.",
    translations: {
      es: "Ella no es francesa.",
      en: "She is not French.",
      fr: "Elle n'est pas française.",
      de: "Sie ist keine Französin.",
      it: "Lei non è francese.",
      pt: "Ela não é francesa.",
    },
  },
  {
    id: 210, lesson: 2, hanzi: "你认识他吗？", pinyin: "Nǐ rènshi tā ma?",
    translations: {
      es: "¿Lo conoces?",
      en: "Do you know him?",
      fr: "Tu le connais ?",
      de: "Kennst du ihn?",
      it: "Lo conosci?",
      pt: "Conhece-lo?",
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // LECCIÓN 3 — Familia
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 301, lesson: 3, hanzi: "你家有几口人？", pinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
    translations: {
      es: "¿Cuántas personas hay en tu familia?",
      en: "How many people are in your family?",
      fr: "Combien de personnes y a-t-il dans ta famille ?",
      de: "Wie viele Personen gibt es in deiner Familie?",
      it: "Quante persone ci sono nella tua famiglia?",
      pt: "Quantas pessoas há na tua família?",
    },
  },
  {
    id: 302, lesson: 3, hanzi: "我家有四口人。", pinyin: "Wǒ jiā yǒu sì kǒu rén.",
    translations: {
      es: "En mi familia hay cuatro personas.",
      en: "There are four people in my family.",
      fr: "Dans ma famille, il y a quatre personnes.",
      de: "In meiner Familie sind vier Personen.",
      it: "Nella mia famiglia ci sono quattro persone.",
      pt: "Na minha família há quatro pessoas.",
    },
  },
  {
    id: 303, lesson: 3, hanzi: "他有一个妹妹。", pinyin: "Tā yǒu yī gè mèimei.",
    translations: {
      es: "Él tiene una hermana menor.",
      en: "He has a younger sister.",
      fr: "Il a une petite sœur.",
      de: "Er hat eine jüngere Schwester.",
      it: "Lui ha una sorella minore.",
      pt: "Ele tem uma irmã mais nova.",
    },
  },
  {
    id: 304, lesson: 3, hanzi: "我没有哥哥。", pinyin: "Wǒ méiyǒu gēge.",
    translations: {
      es: "No tengo hermano mayor.",
      en: "I don't have an older brother.",
      fr: "Je n'ai pas de grand frère.",
      de: "Ich habe keinen älteren Bruder.",
      it: "Non ho un fratello maggiore.",
      pt: "Não tenho irmão mais velho.",
    },
  },
  {
    id: 305, lesson: 3, hanzi: "她的爸爸是医生。", pinyin: "Tā de bàba shì yīshēng.",
    translations: {
      es: "El padre de ella es médico.",
      en: "Her father is a doctor.",
      fr: "Son père est médecin.",
      de: "Ihr Vater ist Arzt.",
      it: "Suo padre è medico.",
      pt: "O pai dela é médico.",
    },
  },
  {
    id: 306, lesson: 3, hanzi: "你爸爸妈妈做什么工作？", pinyin: "Nǐ bàba māma zuò shénme gōngzuò?",
    translations: {
      es: "¿En qué trabajan tus padres?",
      en: "What do your parents do for work?",
      fr: "Quel est le travail de tes parents ?",
      de: "Was arbeiten deine Eltern?",
      it: "Che lavoro fanno i tuoi genitori?",
      pt: "Em que trabalham os teus pais?",
    },
    alt: ["你爸爸妈妈做什么工作？", "你父母做什么工作？"],
  },
  {
    id: 307, lesson: 3, hanzi: "我爱我的家人。", pinyin: "Wǒ ài wǒ de jiārén.",
    translations: {
      es: "Quiero a mi familia.",
      en: "I love my family.",
      fr: "J'aime ma famille.",
      de: "Ich liebe meine Familie.",
      it: "Amo la mia famiglia.",
      pt: "Amo a minha família.",
    },
  },
  {
    id: 308, lesson: 3, hanzi: "小狗也是一口人吗？", pinyin: "Xiǎogǒu yě shì yī kǒu rén ma?",
    translations: {
      es: "¿El perrito también es un miembro de la familia?",
      en: "Is the puppy also a family member?",
      fr: "Le petit chien est-il aussi un membre de la famille ?",
      de: "Ist der kleine Hund auch ein Familienmitglied?",
      it: "Anche il cagnolino è un membro della famiglia?",
      pt: "O cachorrinho também é um membro da família?",
    },
  },
  {
    id: 309, lesson: 3, hanzi: "你们家真漂亮！", pinyin: "Nǐmen jiā zhēn piàoliang!",
    translations: {
      es: "¡Vuestra casa es realmente bonita!",
      en: "Your house is really beautiful!",
      fr: "Votre maison est vraiment jolie !",
      de: "Euer Haus ist wirklich schön!",
      it: "La vostra casa è davvero bella!",
      pt: "A vossa casa é realmente bonita!",
    },
  },
  {
    id: 310, lesson: 3, hanzi: "我有两个弟弟。", pinyin: "Wǒ yǒu liǎng gè dìdi.",
    translations: {
      es: "Tengo dos hermanos menores.",
      en: "I have two younger brothers.",
      fr: "J'ai deux petits frères.",
      de: "Ich habe zwei jüngere Brüder.",
      it: "Ho due fratelli minori.",
      pt: "Tenho dois irmãos mais novos.",
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // LECCIÓN 4 — Tiempo, horarios y planes
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 401, lesson: 4, hanzi: "现在几点了？", pinyin: "Xiànzài jǐ diǎn le?",
    translations: {
      es: "¿Qué hora es ahora?",
      en: "What time is it now?",
      fr: "Quelle heure est-il maintenant ?",
      de: "Wie spät ist es jetzt?",
      it: "Che ora è adesso?",
      pt: "Que horas são agora?",
    },
  },
  {
    id: 402, lesson: 4, hanzi: "我八点上课。", pinyin: "Wǒ bā diǎn shàngkè.",
    translations: {
      es: "Tengo clase a las ocho.",
      en: "I have class at eight.",
      fr: "J'ai cours à huit heures.",
      de: "Ich habe um acht Uhr Unterricht.",
      it: "Ho lezione alle otto.",
      pt: "Tenho aula às oito.",
    },
  },
  {
    id: 403, lesson: 4, hanzi: "你明天几点有课？", pinyin: "Nǐ míngtiān jǐ diǎn yǒu kè?",
    translations: {
      es: "¿A qué hora tienes clase mañana?",
      en: "What time do you have class tomorrow?",
      fr: "À quelle heure as-tu cours demain ?",
      de: "Wann hast du morgen Unterricht?",
      it: "A che ora hai lezione domani?",
      pt: "A que horas tens aula amanhã?",
    },
  },
  {
    id: 404, lesson: 4, hanzi: "下午两点见面。", pinyin: "Xiàwǔ liǎng diǎn jiànmiàn.",
    translations: {
      es: "Nos vemos a las dos de la tarde.",
      en: "We meet at two in the afternoon.",
      fr: "On se voit à deux heures de l'après-midi.",
      de: "Wir treffen uns um zwei Uhr nachmittags.",
      it: "Ci vediamo alle due del pomeriggio.",
      pt: "Vemo-nos às duas da tarde.",
    },
  },
  {
    id: 405, lesson: 4, hanzi: "晚上她还有英语课。", pinyin: "Wǎnshang tā hái yǒu Yīngyǔ kè.",
    translations: {
      es: "Por la noche ella aún tiene clase de inglés.",
      en: "In the evening she still has English class.",
      fr: "Le soir, elle a encore cours d'anglais.",
      de: "Abends hat sie noch Englischunterricht.",
      it: "La sera ha ancora lezione di inglese.",
      pt: "À noite ela ainda tem aula de inglês.",
    },
  },
  {
    id: 406, lesson: 4, hanzi: "你明天晚上有没有时间？", pinyin: "Nǐ míngtiān wǎnshang yǒu méiyǒu shíjiān?",
    translations: {
      es: "¿Tienes tiempo mañana por la noche?",
      en: "Do you have time tomorrow evening?",
      fr: "As-tu du temps demain soir ?",
      de: "Hast du morgen Abend Zeit?",
      it: "Hai tempo domani sera?",
      pt: "Tens tempo amanhã à noite?",
    },
  },
  {
    id: 407, lesson: 4, hanzi: "今天天气很好。", pinyin: "Jīntiān tiānqì hěn hǎo.",
    translations: {
      es: "Hoy hace muy buen tiempo.",
      en: "The weather is very nice today.",
      fr: "Il fait très beau aujourd'hui.",
      de: "Das Wetter ist heute sehr schön.",
      it: "Oggi il tempo è molto bello.",
      pt: "Hoje o tempo está muito bom.",
    },
  },
  {
    id: 408, lesson: 4, hanzi: "我们一起练习口语吧。", pinyin: "Wǒmen yīqǐ liànxí kǒuyǔ ba.",
    translations: {
      es: "Vamos a practicar juntos la expresión oral.",
      en: "Let's practice speaking together.",
      fr: "Pratiquons ensemble l'expression orale.",
      de: "Lass uns zusammen das Sprechen üben.",
      it: "Esercitiamoci insieme nell'espressione orale.",
      pt: "Vamos praticar juntos a expressão oral.",
    },
  },
  {
    id: 409, lesson: 4, hanzi: "你们班一共有多少个人？", pinyin: "Nǐmen bān yīgòng yǒu duōshǎo gè rén?",
    translations: {
      es: "¿En total cuántas personas hay en tu clase?",
      en: "In total, how many people are in your class?",
      fr: "Au total, combien de personnes dans ta classe ?",
      de: "Wie viele Personen sind insgesamt in deiner Klasse?",
      it: "In totale, quante persone ci sono nella tua classe?",
      pt: "No total, quantas pessoas há na tua turma?",
    },
  },
  {
    id: 410, lesson: 4, hanzi: "差五分七点。", pinyin: "Chà wǔ fēn qī diǎn.",
    translations: {
      es: "Son las siete menos cinco minutos.",
      en: "It's five minutes to seven.",
      fr: "Il est sept heures moins cinq.",
      de: "Es ist fünf vor sieben.",
      it: "Sono le sette meno cinque.",
      pt: "São sete menos cinco minutos.",
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // LECCIÓN 5 — Cumpleaños, fiestas y horóscopo
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 501, lesson: 5, hanzi: "祝你生日快乐！", pinyin: "Zhù nǐ shēngrì kuàilè!",
    translations: {
      es: "¡Feliz cumpleaños!",
      en: "Happy birthday!",
      fr: "Joyeux anniversaire !",
      de: "Alles Gute zum Geburtstag!",
      it: "Buon compleanno!",
      pt: "Feliz aniversário!",
    },
  },
  {
    id: 502, lesson: 5, hanzi: "今天是我的生日。", pinyin: "Jīntiān shì wǒ de shēngrì.",
    translations: {
      es: "Hoy es mi cumpleaños.",
      en: "Today is my birthday.",
      fr: "C'est mon anniversaire aujourd'hui.",
      de: "Heute ist mein Geburtstag.",
      it: "Oggi è il mio compleanno.",
      pt: "Hoje é o meu aniversário.",
    },
  },
  {
    id: 503, lesson: 5, hanzi: "你今年多大？", pinyin: "Nǐ jīnnián duō dà?",
    translations: {
      es: "¿Cuántos años tienes este año?",
      en: "How old are you this year?",
      fr: "Quel âge as-tu cette année ?",
      de: "Wie alt bist du dieses Jahr?",
      it: "Quanti anni hai quest'anno?",
      pt: "Quantos anos tens este ano?",
    },
  },
  {
    id: 504, lesson: 5, hanzi: "我属龙。", pinyin: "Wǒ shǔ lóng.",
    translations: {
      es: "Soy del año del dragón.",
      en: "I'm in the year of the dragon.",
      fr: "Je suis du signe du dragon.",
      de: "Ich bin im Jahr des Drachen geboren.",
      it: "Sono dell'anno del drago.",
      pt: "Sou do ano do dragão.",
    },
  },
  {
    id: 505, lesson: 5, hanzi: "晚上有一个聚会。", pinyin: "Wǎnshang yǒu yī gè jùhuì.",
    translations: {
      es: "Esta noche hay una fiesta.",
      en: "There's a party tonight.",
      fr: "Il y a une fête ce soir.",
      de: "Heute Abend gibt es eine Feier.",
      it: "Stasera c'è una festa.",
      pt: "Esta noite há uma festa.",
    },
  },
  {
    id: 506, lesson: 5, hanzi: "我送你一个礼物。", pinyin: "Wǒ sòng nǐ yī gè lǐwù.",
    translations: {
      es: "Te regalo un regalo.",
      en: "I'm giving you a gift.",
      fr: "Je t'offre un cadeau.",
      de: "Ich schenke dir ein Geschenk.",
      it: "Ti regalo un regalo.",
      pt: "Ofereço-te um presente.",
    },
  },
  {
    id: 507, lesson: 5, hanzi: "我们一起唱歌吧！", pinyin: "Wǒmen yīqǐ chànggē ba!",
    translations: {
      es: "¡Cantemos juntos!",
      en: "Let's sing together!",
      fr: "Chantons ensemble !",
      de: "Lass uns zusammen singen!",
      it: "Cantiamo insieme!",
      pt: "Vamos cantar juntos!",
    },
  },
  {
    id: 508, lesson: 5, hanzi: "大家干杯！", pinyin: "Dàjiā gānbēi!",
    translations: {
      es: "¡Todos, brindemos!",
      en: "Everyone, cheers!",
      fr: "Tout le monde, santé !",
      de: "Alle zusammen, prost!",
      it: "Tutti, cin cin!",
      pt: "Pessoal, saúde!",
    },
  },
  {
    id: 509, lesson: 5, hanzi: "我的生日是八月二十二号。", pinyin: "Wǒ de shēngrì shì bā yuè èrshí'èr hào.",
    translations: {
      es: "Mi cumpleaños es el 22 de agosto.",
      en: "My birthday is August 22nd.",
      fr: "Mon anniversaire est le 22 août.",
      de: "Mein Geburtstag ist am 22. August.",
      it: "Il mio compleanno è il 22 agosto.",
      pt: "O meu aniversário é a 22 de agosto.",
    },
  },
  {
    id: 510, lesson: 5, hanzi: "不好意思，我不会跳舞。", pinyin: "Bù hǎoyìsi, wǒ bú huì tiàowǔ.",
    translations: {
      es: "Lo siento, no sé bailar.",
      en: "Sorry, I don't know how to dance.",
      fr: "Désolé/e, je ne sais pas danser.",
      de: "Entschuldigung, ich kann nicht tanzen.",
      it: "Mi dispiace, non so ballare.",
      pt: "Desculpa, não sei dançar.",
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // LECCIÓN 6 — Lugares y direcciones
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 601, lesson: 6, hanzi: "请问图书馆在哪儿？", pinyin: "Qǐngwèn túshūguǎn zài nǎr?",
    translations: {
      es: "Disculpa, ¿dónde está la biblioteca?",
      en: "Excuse me, where is the library?",
      fr: "Excusez-moi, où est la bibliothèque ?",
      de: "Entschuldigung, wo ist die Bibliothek?",
      it: "Scusi, dov'è la biblioteca?",
      pt: "Com licença, onde fica a biblioteca?",
    },
  },
  {
    id: 602, lesson: 6, hanzi: "图书馆在食堂北边。", pinyin: "Túshūguǎn zài shítáng běibiān.",
    translations: {
      es: "La biblioteca está al norte del comedor.",
      en: "The library is north of the canteen.",
      fr: "La bibliothèque est au nord de la cantine.",
      de: "Die Bibliothek ist nördlich der Mensa.",
      it: "La biblioteca è a nord della mensa.",
      pt: "A biblioteca fica ao norte do refeitório.",
    },
  },
  {
    id: 603, lesson: 6, hanzi: "银行在超市旁边。", pinyin: "Yínháng zài chāoshì pángbiān.",
    translations: {
      es: "El banco está al lado del supermercado.",
      en: "The bank is next to the supermarket.",
      fr: "La banque est à côté du supermarché.",
      de: "Die Bank ist neben dem Supermarkt.",
      it: "La banca è accanto al supermercato.",
      pt: "O banco fica ao lado do supermercado.",
    },
  },
  {
    id: 604, lesson: 6, hanzi: "我家在医院对面。", pinyin: "Wǒ jiā zài yīyuàn duìmiàn.",
    translations: {
      es: "Mi casa está enfrente del hospital.",
      en: "My house is across from the hospital.",
      fr: "Ma maison est en face de l'hôpital.",
      de: "Mein Haus ist gegenüber dem Krankenhaus.",
      it: "Casa mia è di fronte all'ospedale.",
      pt: "A minha casa fica em frente ao hospital.",
    },
  },
  {
    id: 605, lesson: 6, hanzi: "别着急，我跟你一起去。", pinyin: "Bié zháojí, wǒ gēn nǐ yīqǐ qù.",
    translations: {
      es: "No te preocupes, voy contigo.",
      en: "Don't worry, I'll go with you.",
      fr: "Ne t'inquiète pas, je viens avec toi.",
      de: "Mach dir keine Sorgen, ich komme mit dir.",
      it: "Non preoccuparti, vengo con te.",
      pt: "Não te preocupes, vou contigo.",
    },
  },
  {
    id: 606, lesson: 6, hanzi: "我们先去食堂吃饭。", pinyin: "Wǒmen xiān qù shítáng chī fàn.",
    translations: {
      es: "Primero vamos al comedor a comer.",
      en: "Let's go to the canteen to eat first.",
      fr: "On va d'abord à la cantine manger.",
      de: "Wir gehen zuerst zum Essen in die Mensa.",
      it: "Andiamo prima alla mensa a mangiare.",
      pt: "Primeiro vamos ao refeitório comer.",
    },
  },
  {
    id: 607, lesson: 6, hanzi: "宿舍里有很多同学。", pinyin: "Sùshè lǐ yǒu hěn duō tóngxué.",
    translations: {
      es: "En el dormitorio hay muchos compañeros.",
      en: "There are many classmates in the dorm.",
      fr: "Il y a beaucoup de camarades dans le dortoir.",
      de: "Im Wohnheim sind viele Kommilitonen.",
      it: "Nel dormitorio ci sono molti compagni.",
      pt: "No dormitório há muitos colegas.",
    },
  },
  {
    id: 608, lesson: 6, hanzi: "体育馆在学校东边。", pinyin: "Tǐyùguǎn zài xuéxiào dōngbiān.",
    translations: {
      es: "El gimnasio está al este de la escuela.",
      en: "The gym is to the east of the school.",
      fr: "Le gymnase est à l'est de l'école.",
      de: "Die Turnhalle ist östlich der Schule.",
      it: "La palestra è a est della scuola.",
      pt: "O ginásio fica a leste da escola.",
    },
  },
  {
    id: 609, lesson: 6, hanzi: "这条街上有很多饭馆。", pinyin: "Zhè tiáo jiē shàng yǒu hěn duō fànguǎn.",
    translations: {
      es: "En esta calle hay muchos restaurantes.",
      en: "There are many restaurants on this street.",
      fr: "Il y a beaucoup de restaurants dans cette rue.",
      de: "In dieser Straße gibt es viele Restaurants.",
      it: "In questa strada ci sono molti ristoranti.",
      pt: "Nesta rua há muitos restaurantes.",
    },
  },
  {
    id: 610, lesson: 6, hanzi: "学校门口有一个银行。", pinyin: "Xuéxiào ménkǒu yǒu yī gè yínháng.",
    translations: {
      es: "En la puerta de la escuela hay un banco.",
      en: "There's a bank at the school gate.",
      fr: "Il y a une banque devant l'école.",
      de: "Am Schultor gibt es eine Bank.",
      it: "All'ingresso della scuola c'è una banca.",
      pt: "À porta da escola há um banco.",
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // LECCIÓN 7 — Compras, dinero y ropa
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 701, lesson: 7, hanzi: "苹果多少钱一斤？", pinyin: "Píngguǒ duōshao qián yī jīn?",
    translations: {
      es: "¿Cuánto cuesta un jin de manzanas?",
      en: "How much is one jin of apples?",
      fr: "Combien coûte un jin de pommes ?",
      de: "Wie viel kostet ein Jin Äpfel?",
      it: "Quanto costa un jin di mele?",
      pt: "Quanto custa um jin de maçãs?",
    },
  },
  {
    id: 702, lesson: 7, hanzi: "五块钱一斤。", pinyin: "Wǔ kuài qián yī jīn.",
    translations: {
      es: "Cinco yuanes el jin.",
      en: "Five yuan per jin.",
      fr: "Cinq yuans le jin.",
      de: "Fünf Yuan pro Jin.",
      it: "Cinque yuan al jin.",
      pt: "Cinco yuanes o jin.",
    },
  },
  {
    id: 703, lesson: 7, hanzi: "太贵了，便宜点儿吧。", pinyin: "Tài guì le, piányi diǎnr ba.",
    translations: {
      es: "Es muy caro, un poco más barato.",
      en: "Too expensive, make it a bit cheaper.",
      fr: "C'est trop cher, un peu moins cher.",
      de: "Zu teuer, etwas billiger bitte.",
      it: "È troppo caro, un po' meno.",
      pt: "É caro demais, um pouco mais barato.",
    },
  },
  {
    id: 704, lesson: 7, hanzi: "我想买一件衬衫。", pinyin: "Wǒ xiǎng mǎi yī jiàn chènshān.",
    translations: {
      es: "Quiero comprar una camisa.",
      en: "I want to buy a shirt.",
      fr: "Je veux acheter une chemise.",
      de: "Ich möchte ein Hemd kaufen.",
      it: "Voglio comprare una camicia.",
      pt: "Quero comprar uma camisa.",
    },
  },
  {
    id: 705, lesson: 7, hanzi: "这件衣服可以试一下吗？", pinyin: "Zhè jiàn yīfu kěyǐ shì yīxià ma?",
    translations: {
      es: "¿Puedo probarme esta prenda?",
      en: "Can I try on this piece of clothing?",
      fr: "Je peux essayer ce vêtement ?",
      de: "Darf ich dieses Kleidungsstück anprobieren?",
      it: "Posso provare questo vestito?",
      pt: "Posso experimentar esta peça?",
    },
  },
  {
    id: 706, lesson: 7, hanzi: "这儿可以刷卡吗？", pinyin: "Zhèr kěyǐ shuākǎ ma?",
    translations: {
      es: "¿Aquí se puede pagar con tarjeta?",
      en: "Can I pay by card here?",
      fr: "On peut payer par carte ici ?",
      de: "Kann man hier mit Karte zahlen?",
      it: "Si può pagare con la carta qui?",
      pt: "Aqui pode-se pagar com cartão?",
    },
  },
  {
    id: 707, lesson: 7, hanzi: "我喜欢黑色的衣服。", pinyin: "Wǒ xǐhuān hēisè de yīfu.",
    translations: {
      es: "Me gusta la ropa negra.",
      en: "I like black clothes.",
      fr: "J'aime les vêtements noirs.",
      de: "Ich mag schwarze Kleidung.",
      it: "Mi piacciono i vestiti neri.",
      pt: "Gosto de roupa preta.",
    },
  },
  {
    id: 708, lesson: 7, hanzi: "一共多少钱？", pinyin: "Yīgòng duōshao qián?",
    translations: {
      es: "¿Cuánto es en total?",
      en: "How much is it in total?",
      fr: "Ça fait combien en tout ?",
      de: "Wie viel macht das insgesamt?",
      it: "Quanto è in totale?",
      pt: "Quanto é no total?",
    },
  },
  {
    id: 709, lesson: 7, hanzi: "这条牛仔裤很合适。", pinyin: "Zhè tiáo niúzǎikù hěn héshì.",
    translations: {
      es: "Estos vaqueros me quedan bien.",
      en: "These jeans fit me well.",
      fr: "Ce jean me va bien.",
      de: "Diese Jeans passt mir gut.",
      it: "Questi jeans mi stanno bene.",
      pt: "Estas calças de ganga assentam-me bem.",
    },
  },
  {
    id: 710, lesson: 7, hanzi: "草莓怎么卖？", pinyin: "Cǎoméi zěnme mài?",
    translations: {
      es: "¿A cómo se venden las fresas?",
      en: "How are the strawberries sold?",
      fr: "Comment se vendent les fraises ?",
      de: "Wie werden die Erdbeeren verkauft?",
      it: "Come si vendono le fragole?",
      pt: "Como se vendem os morangos?",
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // LECCIÓN 8 — Salud y médico
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 801, lesson: 8, hanzi: "你哪儿不舒服？", pinyin: "Nǐ nǎr bù shūfu?",
    translations: {
      es: "¿Dónde te encuentras mal?",
      en: "Where does it hurt?",
      fr: "Où as-tu mal ?",
      de: "Wo tut es weh?",
      it: "Dove ti senti male?",
      pt: "Onde te dói?",
    },
  },
  {
    id: 802, lesson: 8, hanzi: "我头疼。", pinyin: "Wǒ tóu téng.",
    translations: {
      es: "Me duele la cabeza.",
      en: "I have a headache.",
      fr: "J'ai mal à la tête.",
      de: "Ich habe Kopfschmerzen.",
      it: "Ho mal di testa.",
      pt: "Doí-me a cabeça.",
    },
  },
  {
    id: 803, lesson: 8, hanzi: "你应该多休息。", pinyin: "Nǐ yīnggāi duō xiūxi.",
    translations: {
      es: "Deberías descansar más.",
      en: "You should rest more.",
      fr: "Tu devrais te reposer davantage.",
      de: "Du solltest dich mehr ausruhen.",
      it: "Dovresti riposare di più.",
      pt: "Devias descansar mais.",
    },
  },
  {
    id: 804, lesson: 8, hanzi: "今天我不能上课。", pinyin: "Jīntiān wǒ bù néng shàngkè.",
    translations: {
      es: "Hoy no puedo ir a clase.",
      en: "I can't go to class today.",
      fr: "Aujourd'hui je ne peux pas aller en cours.",
      de: "Heute kann ich nicht zum Unterricht.",
      it: "Oggi non posso andare a lezione.",
      pt: "Hoje não posso ir à aula.",
    },
  },
  {
    id: 805, lesson: 8, hanzi: "你想吃中药还是西药？", pinyin: "Nǐ xiǎng chī zhōngyào háishi xīyào?",
    translations: {
      es: "¿Quieres tomar medicina china u occidental?",
      en: "Do you want Chinese or Western medicine?",
      fr: "Tu préfères des médicaments chinois ou occidentaux ?",
      de: "Möchtest du chinesische oder westliche Medizin?",
      it: "Vuoi medicina cinese o occidentale?",
      pt: "Queres medicina chinesa ou ocidental?",
    },
  },
  {
    id: 806, lesson: 8, hanzi: "今天有点儿冷。", pinyin: "Jīntiān yǒu diǎnr lěng.",
    translations: {
      es: "Hoy hace algo de frío.",
      en: "It's a bit cold today.",
      fr: "Il fait un peu froid aujourd'hui.",
      de: "Heute ist es etwas kalt.",
      it: "Oggi fa un po' freddo.",
      pt: "Hoje está um pouco frio.",
    },
  },
  {
    id: 807, lesson: 8, hanzi: "我嗓子有点儿疼。", pinyin: "Wǒ sǎngzi yǒu diǎnr téng.",
    translations: {
      es: "Me duele un poco la garganta.",
      en: "My throat hurts a bit.",
      fr: "J'ai un peu mal à la gorge.",
      de: "Mein Hals tut etwas weh.",
      it: "Mi fa un po' male la gola.",
      pt: "Doí-me um pouco a garganta.",
    },
  },
  {
    id: 808, lesson: 8, hanzi: "多喝水，多休息。", pinyin: "Duō hē shuǐ, duō xiūxi.",
    translations: {
      es: "Bebe mucha agua y descansa mucho.",
      en: "Drink a lot of water, rest a lot.",
      fr: "Bois beaucoup d'eau, repose-toi bien.",
      de: "Viel Wasser trinken, viel ausruhen.",
      it: "Bevi molta acqua, riposa molto.",
      pt: "Bebe muita água, descansa muito.",
    },
  },
  {
    id: 809, lesson: 8, hanzi: "我去医院看病。", pinyin: "Wǒ qù yīyuàn kànbìng.",
    translations: {
      es: "Voy al hospital a ver al médico.",
      en: "I'm going to the hospital to see the doctor.",
      fr: "Je vais à l'hôpital voir le médecin.",
      de: "Ich gehe ins Krankenhaus zum Arzt.",
      it: "Vado in ospedale a farmi visitare.",
      pt: "Vou ao hospital ver o médico.",
    },
  },
  {
    id: 810, lesson: 8, hanzi: "你发烧吗？", pinyin: "Nǐ fāshāo ma?",
    translations: {
      es: "¿Tienes fiebre?",
      en: "Do you have a fever?",
      fr: "Tu as de la fièvre ?",
      de: "Hast du Fieber?",
      it: "Hai la febbre?",
      pt: "Tens febre?",
    },
  },
];
