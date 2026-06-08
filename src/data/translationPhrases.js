// src/data/translationPhrases.js
// Pool de frases para el minijuego "Traduce la Frase"
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

// ── Diccionario pinyin → candidatos hanzi ────────────────────────────────────
// Clave: pinyin sin tonos, todo en minúsculas, sin espacios
// Valor: array de objetos { hanzi, pinyin (con tono marcado) }
// Sirve al IME del minijuego "Traduce la Frase" para sugerir hanzi.

export const pinyinDictionary = {
  // ───── Pronombres y básicos ─────
  ni:        [{ hanzi: "你", pinyin: "nǐ" }, { hanzi: "您", pinyin: "nín" }],
  nin:       [{ hanzi: "您", pinyin: "nín" }],
  wo:        [{ hanzi: "我", pinyin: "wǒ" }],
  ta:        [{ hanzi: "他", pinyin: "tā" }, { hanzi: "她", pinyin: "tā" }, { hanzi: "它", pinyin: "tā" }],
  women:     [{ hanzi: "我们", pinyin: "wǒmen" }],
  nimen:     [{ hanzi: "你们", pinyin: "nǐmen" }],
  tamen:     [{ hanzi: "他们", pinyin: "tāmen" }, { hanzi: "她们", pinyin: "tāmen" }],
  zanmen:    [{ hanzi: "咱们", pinyin: "zánmen" }],
  dajia:     [{ hanzi: "大家", pinyin: "dàjiā" }],
  // `men:` ahora se define más abajo junto con 门; aquí solo 们 era incompleto.

  // ───── Verbo "ser" y otros ─────
  shi:       [{ hanzi: "是", pinyin: "shì" }, { hanzi: "时", pinyin: "shí" }, { hanzi: "十", pinyin: "shí" }, { hanzi: "事", pinyin: "shì" }, { hanzi: "试", pinyin: "shì" }],
  bushi:     [{ hanzi: "不是", pinyin: "bú shì" }],
  you:       [{ hanzi: "有", pinyin: "yǒu" }, { hanzi: "又", pinyin: "yòu" }, { hanzi: "右", pinyin: "yòu" }, { hanzi: "友", pinyin: "yǒu" }],
  meiyou:    [{ hanzi: "没有", pinyin: "méiyǒu" }],
  zai:       [{ hanzi: "在", pinyin: "zài" }, { hanzi: "再", pinyin: "zài" }],

  // ───── Saludos / cortesía ─────
  hao:       [{ hanzi: "好", pinyin: "hǎo" }, { hanzi: "号", pinyin: "hào" }],
  nihao:     [{ hanzi: "你好", pinyin: "nǐ hǎo" }],
  zaijian:   [{ hanzi: "再见", pinyin: "zàijiàn" }],
  xiexie:    [{ hanzi: "谢谢", pinyin: "xièxie" }],
  buyong:    [{ hanzi: "不用", pinyin: "búyòng" }],
  qing:      [{ hanzi: "请", pinyin: "qǐng" }, { hanzi: "清", pinyin: "qīng" }],
  qingwen:   [{ hanzi: "请问", pinyin: "qǐngwèn" }],
  duibuqi:   [{ hanzi: "对不起", pinyin: "duìbuqǐ" }],
  meiguanxi: [{ hanzi: "没关系", pinyin: "méi guānxi" }],
  buhaoyisi: [{ hanzi: "不好意思", pinyin: "bù hǎoyìsi" }],
  huanying:  [{ hanzi: "欢迎", pinyin: "huānyíng" }],
  bukeqi:    [{ hanzi: "不客气", pinyin: "bú kèqi" }],
  keqi:      [{ hanzi: "客气", pinyin: "kèqi" }],
  zhu:       [{ hanzi: "祝", pinyin: "zhù" }, { hanzi: "住", pinyin: "zhù" }],

  // ───── Cómo, qué, dónde, quién ─────
  shenme:    [{ hanzi: "什么", pinyin: "shénme" }],
  shen:      [{ hanzi: "什", pinyin: "shén" }, { hanzi: "身", pinyin: "shēn" }, { hanzi: "深", pinyin: "shēn" }],
  me:        [{ hanzi: "么", pinyin: "me" }, { hanzi: "没", pinyin: "méi" }, { hanzi: "美", pinyin: "měi" }],
  zenme:     [{ hanzi: "怎么", pinyin: "zěnme" }],
  zenmeyang: [{ hanzi: "怎么样", pinyin: "zěnmeyàng" }],
  zen:       [{ hanzi: "怎", pinyin: "zěn" }],
  na:        [{ hanzi: "哪", pinyin: "nǎ" }, { hanzi: "那", pinyin: "nà" }, { hanzi: "拿", pinyin: "ná" }],
  nar:       [{ hanzi: "哪儿", pinyin: "nǎr" }, { hanzi: "那儿", pinyin: "nàr" }],
  nali:      [{ hanzi: "哪里", pinyin: "nǎlǐ" }],
  zher:      [{ hanzi: "这儿", pinyin: "zhèr" }],
  zheli:     [{ hanzi: "这里", pinyin: "zhèlǐ" }],
  shei:      [{ hanzi: "谁", pinyin: "shéi" }],
  ji:        [{ hanzi: "几", pinyin: "jǐ" }, { hanzi: "机", pinyin: "jī" }, { hanzi: "鸡", pinyin: "jī" }, { hanzi: "极", pinyin: "jí" }],
  jidian:    [{ hanzi: "几点", pinyin: "jǐ diǎn" }],
  duoshao:   [{ hanzi: "多少", pinyin: "duōshao" }],
  duoda:     [{ hanzi: "多大", pinyin: "duō dà" }],
  weishenme: [{ hanzi: "为什么", pinyin: "wèi shénme" }],

  // ───── Adverbios / partículas ─────
  hen:       [{ hanzi: "很", pinyin: "hěn" }],
  ye:        [{ hanzi: "也", pinyin: "yě" }, { hanzi: "夜", pinyin: "yè" }, { hanzi: "业", pinyin: "yè" }],
  dou:       [{ hanzi: "都", pinyin: "dōu" }, { hanzi: "豆", pinyin: "dòu" }],
  bu:        [{ hanzi: "不", pinyin: "bù" }, { hanzi: "布", pinyin: "bù" }],
  butai:     [{ hanzi: "不太", pinyin: "bú tài" }],
  tai:       [{ hanzi: "太", pinyin: "tài" }],
  hai:       [{ hanzi: "还", pinyin: "hái" }, { hanzi: "海", pinyin: "hǎi" }],
  haishi:    [{ hanzi: "还是", pinyin: "háishi" }],
  jiu:       [{ hanzi: "就", pinyin: "jiù" }, { hanzi: "九", pinyin: "jiǔ" }, { hanzi: "酒", pinyin: "jiǔ" }],
  cai:       [{ hanzi: "才", pinyin: "cái" }, { hanzi: "菜", pinyin: "cài" }],
  zhen:      [{ hanzi: "真", pinyin: "zhēn" }, { hanzi: "针", pinyin: "zhēn" }],
  dangran:   [{ hanzi: "当然", pinyin: "dāngrán" }],
  changchang: [{ hanzi: "常常", pinyin: "chángcháng" }],
  yixia:     [{ hanzi: "一下", pinyin: "yī xià" }],
  yidianr:   [{ hanzi: "一点儿", pinyin: "yīdiǎnr" }],
  youdianr:  [{ hanzi: "有点儿", pinyin: "yǒudiǎnr" }],
  xian:      [{ hanzi: "先", pinyin: "xiān" }, { hanzi: "现", pinyin: "xiàn" }],
  bie:       [{ hanzi: "别", pinyin: "bié" }],

  // ───── Auxiliares / preposiciones ─────
  xiang:     [{ hanzi: "想", pinyin: "xiǎng" }, { hanzi: "向", pinyin: "xiàng" }],
  hui:       [{ hanzi: "会", pinyin: "huì" }, { hanzi: "回", pinyin: "huí" }],
  neng:      [{ hanzi: "能", pinyin: "néng" }],
  keyi:      [{ hanzi: "可以", pinyin: "kěyǐ" }],
  yinggai:   [{ hanzi: "应该", pinyin: "yīnggāi" }],
  gai:       [{ hanzi: "该", pinyin: "gāi" }],
  gen:       [{ hanzi: "跟", pinyin: "gēn" }, { hanzi: "根", pinyin: "gēn" }],
  gei:       [{ hanzi: "给", pinyin: "gěi" }],
  he:        [{ hanzi: "和", pinyin: "hé" }, { hanzi: "喝", pinyin: "hē" }, { hanzi: "盒", pinyin: "hé" }],
  cong:      [{ hanzi: "从", pinyin: "cóng" }],

  // ───── Verbos comunes ─────
  jiao:      [{ hanzi: "叫", pinyin: "jiào" }, { hanzi: "教", pinyin: "jiāo" }, { hanzi: "饺", pinyin: "jiǎo" }],
  qu:        [{ hanzi: "去", pinyin: "qù" }],
  lai:       [{ hanzi: "来", pinyin: "lái" }],
  kan:       [{ hanzi: "看", pinyin: "kàn" }],
  shuo:      [{ hanzi: "说", pinyin: "shuō" }],
  shuoyu:    [{ hanzi: "说语", pinyin: "shuō yǔ" }],
  xie:       [{ hanzi: "写", pinyin: "xiě" }, { hanzi: "些", pinyin: "xiē" }, { hanzi: "血", pinyin: "xiě" }],
  du:        [{ hanzi: "读", pinyin: "dú" }, { hanzi: "度", pinyin: "dù" }],
  ting:      [{ hanzi: "听", pinyin: "tīng" }, { hanzi: "厅", pinyin: "tīng" }],
  ai:        [{ hanzi: "爱", pinyin: "ài" }],
  xihuan:    [{ hanzi: "喜欢", pinyin: "xǐhuān" }],
  renshi:    [{ hanzi: "认识", pinyin: "rènshi" }],
  chi:       [{ hanzi: "吃", pinyin: "chī" }],
  he2:       [{ hanzi: "喝", pinyin: "hē" }],
  zuo:       [{ hanzi: "做", pinyin: "zuò" }, { hanzi: "坐", pinyin: "zuò" }, { hanzi: "左", pinyin: "zuǒ" }, { hanzi: "作", pinyin: "zuò" }],
  zou:       [{ hanzi: "走", pinyin: "zǒu" }],
  pao:       [{ hanzi: "跑", pinyin: "pǎo" }],
  xue:       [{ hanzi: "学", pinyin: "xué" }, { hanzi: "雪", pinyin: "xuě" }],
  xuesheng:  [{ hanzi: "学生", pinyin: "xuésheng" }],
  xuexiao:   [{ hanzi: "学校", pinyin: "xuéxiào" }],
  lianxi:    [{ hanzi: "练习", pinyin: "liànxí" }],
  lian:      [{ hanzi: "练", pinyin: "liàn" }, { hanzi: "连", pinyin: "lián" }, { hanzi: "脸", pinyin: "liǎn" }],
  jian:      [{ hanzi: "件", pinyin: "jiàn" }, { hanzi: "见", pinyin: "jiàn" }, { hanzi: "间", pinyin: "jiān" }],
  jianmian:  [{ hanzi: "见面", pinyin: "jiànmiàn" }],
  jieshao:   [{ hanzi: "介绍", pinyin: "jièshào" }],
  jingxi:    [{ hanzi: "经", pinyin: "jīng" }],
  deng:      [{ hanzi: "等", pinyin: "děng" }],
  zhidao:    [{ hanzi: "知道", pinyin: "zhīdào" }],
  zhuyi:     [{ hanzi: "注意", pinyin: "zhùyì" }],
  song:      [{ hanzi: "送", pinyin: "sòng" }],
  mai:       [{ hanzi: "买", pinyin: "mǎi" }, { hanzi: "卖", pinyin: "mài" }],
  mai2:      [{ hanzi: "卖", pinyin: "mài" }],
  zhao:      [{ hanzi: "找", pinyin: "zhǎo" }, { hanzi: "着", pinyin: "zháo" }],
  shi2:      [{ hanzi: "试", pinyin: "shì" }],
  shua:      [{ hanzi: "刷", pinyin: "shuā" }],
  shuaka:    [{ hanzi: "刷卡", pinyin: "shuākǎ" }],
  cang:      [{ hanzi: "尝", pinyin: "cháng" }],
  guo:       [{ hanzi: "过", pinyin: "guò" }, { hanzi: "国", pinyin: "guó" }, { hanzi: "果", pinyin: "guǒ" }],
  chuan:     [{ hanzi: "穿", pinyin: "chuān" }, { hanzi: "床", pinyin: "chuáng" }],
  shu:       [{ hanzi: "书", pinyin: "shū" }, { hanzi: "舒", pinyin: "shū" }, { hanzi: "属", pinyin: "shǔ" }, { hanzi: "树", pinyin: "shù" }],
  shufu:     [{ hanzi: "舒服", pinyin: "shūfu" }],
  shu2:      [{ hanzi: "属", pinyin: "shǔ" }],
  xiuxi:     [{ hanzi: "休息", pinyin: "xiūxi" }],
  shuijiao:  [{ hanzi: "睡觉", pinyin: "shuìjiào" }],
  shui:      [{ hanzi: "睡", pinyin: "shuì" }, { hanzi: "水", pinyin: "shuǐ" }],
  qichuang:  [{ hanzi: "起床", pinyin: "qǐchuáng" }],
  yundong:   [{ hanzi: "运动", pinyin: "yùndòng" }],
  shangke:   [{ hanzi: "上课", pinyin: "shàngkè" }],
  kanbing:   [{ hanzi: "看病", pinyin: "kànbìng" }],
  fashao:    [{ hanzi: "发烧", pinyin: "fāshāo" }],
  fayan:     [{ hanzi: "发炎", pinyin: "fāyán" }],
  ganmao:    [{ hanzi: "感冒", pinyin: "gǎnmào" }],
  dazhen:    [{ hanzi: "打针", pinyin: "dǎzhēn" }],
  yanxie:    [{ hanzi: "验血", pinyin: "yànxiě" }],
  liang:     [{ hanzi: "量", pinyin: "liáng" }, { hanzi: "两", pinyin: "liǎng" }, { hanzi: "亮", pinyin: "liàng" }],
  gua:       [{ hanzi: "挂", pinyin: "guà" }],
  canjia:    [{ hanzi: "参加", pinyin: "cānjiā" }],
  chusheng:  [{ hanzi: "出生", pinyin: "chūshēng" }],
  changge:   [{ hanzi: "唱歌", pinyin: "chànggē" }],
  chang:     [{ hanzi: "唱", pinyin: "chàng" }, { hanzi: "常", pinyin: "cháng" }, { hanzi: "长", pinyin: "cháng" }, { hanzi: "场", pinyin: "chǎng" }],
  ge:        [{ hanzi: "个", pinyin: "gè" }, { hanzi: "歌", pinyin: "gē" }, { hanzi: "哥", pinyin: "gē" }, { hanzi: "各", pinyin: "gè" }, { hanzi: "给", pinyin: "gěi" }],
  tiaowu:    [{ hanzi: "跳舞", pinyin: "tiàowǔ" }],
  tiao:      [{ hanzi: "跳", pinyin: "tiào" }, { hanzi: "条", pinyin: "tiáo" }],
  wu:        [{ hanzi: "舞", pinyin: "wǔ" }, { hanzi: "五", pinyin: "wǔ" }, { hanzi: "午", pinyin: "wǔ" }, { hanzi: "无", pinyin: "wú" }],
  ganbei:    [{ hanzi: "干杯", pinyin: "gānbēi" }],

  // ───── Personas / familia ─────
  laoshi:    [{ hanzi: "老师", pinyin: "lǎoshī" }],
  tongxue:   [{ hanzi: "同学", pinyin: "tóngxué" }],
  pengyou:   [{ hanzi: "朋友", pinyin: "péngyou" }],
  jia:       [{ hanzi: "家", pinyin: "jiā" }, { hanzi: "假", pinyin: "jiǎ" }],
  jiaren:    [{ hanzi: "家人", pinyin: "jiārén" }],
  baba:      [{ hanzi: "爸爸", pinyin: "bàba" }],
  mama:      [{ hanzi: "妈妈", pinyin: "māma" }],
  fumu:      [{ hanzi: "父母", pinyin: "fùmǔ" }],
  gege:      [{ hanzi: "哥哥", pinyin: "gēge" }],
  didi:      [{ hanzi: "弟弟", pinyin: "dìdi" }],
  jiejie:    [{ hanzi: "姐姐", pinyin: "jiějie" }],
  meimei:    [{ hanzi: "妹妹", pinyin: "mèimei" }],
  xiongdijiemei: [{ hanzi: "兄弟姐妹", pinyin: "xiōngdì jiěmèi" }],
  ren:       [{ hanzi: "人", pinyin: "rén" }, { hanzi: "认", pinyin: "rèn" }],
  kou:       [{ hanzi: "口", pinyin: "kǒu" }],
  yisheng:   [{ hanzi: "医生", pinyin: "yīshēng" }],
  daifu:     [{ hanzi: "大夫", pinyin: "dàifu" }],
  xiaojie:   [{ hanzi: "小姐", pinyin: "xiǎojiě" }],
  xiansheng: [{ hanzi: "先生", pinyin: "xiānsheng" }],
  laoban:    [{ hanzi: "老板", pinyin: "lǎobǎn" }],
  shouhuoyuan: [{ hanzi: "售货员", pinyin: "shòuhuòyuán" }],

  // ───── Nombres y nacionalidades ─────
  mading:    [{ hanzi: "马丁", pinyin: "Mǎdīng" }],
  zhongguo:  [{ hanzi: "中国", pinyin: "Zhōngguó" }],
  zhongguoren: [{ hanzi: "中国人", pinyin: "Zhōngguó rén" }],
  xibanya:   [{ hanzi: "西班牙", pinyin: "Xībānyá" }],
  xibanyaren: [{ hanzi: "西班牙人", pinyin: "Xībānyá rén" }],
  faguo:     [{ hanzi: "法国", pinyin: "Fǎguó" }],
  faguoren:  [{ hanzi: "法国人", pinyin: "Fǎguó rén" }],
  yingguo:   [{ hanzi: "英国", pinyin: "Yīngguó" }],
  hanyu:     [{ hanzi: "汉语", pinyin: "Hànyǔ" }],
  yingyu:    [{ hanzi: "英语", pinyin: "Yīngyǔ" }],
  zhongwen:  [{ hanzi: "中文", pinyin: "Zhōngwén" }],
  yuyan:     [{ hanzi: "语言", pinyin: "yǔyán" }],
  guo2:      [{ hanzi: "国", pinyin: "guó" }],
  linqiang:  [{ hanzi: "林强", pinyin: "Lín Qiáng" }],

  // ───── Beijing y otros ─────
  beijing:   [{ hanzi: "北京", pinyin: "Běijīng" }],
  bei:       [{ hanzi: "北", pinyin: "běi" }, { hanzi: "杯", pinyin: "bēi" }, { hanzi: "被", pinyin: "bèi" }],
  beibian:   [{ hanzi: "北边", pinyin: "běibiān" }],
  nan:       [{ hanzi: "南", pinyin: "nán" }, { hanzi: "难", pinyin: "nán" }, { hanzi: "男", pinyin: "nán" }],
  dong:      [{ hanzi: "东", pinyin: "dōng" }, { hanzi: "懂", pinyin: "dǒng" }],
  dongbian:  [{ hanzi: "东边", pinyin: "dōngbiān" }],
  xi:        [{ hanzi: "西", pinyin: "xī" }, { hanzi: "喜", pinyin: "xǐ" }, { hanzi: "习", pinyin: "xí" }, { hanzi: "息", pinyin: "xī" }],
  xibian:    [{ hanzi: "西边", pinyin: "xībiān" }],
  zuobian:   [{ hanzi: "左边", pinyin: "zuǒbiān" }],
  youbian:   [{ hanzi: "右边", pinyin: "yòubiān" }],
  pangbian:  [{ hanzi: "旁边", pinyin: "pángbiān" }],
  qianbian:  [{ hanzi: "前边", pinyin: "qiánbiān" }],
  houbian:   [{ hanzi: "后边", pinyin: "hòubiān" }],
  shangbian: [{ hanzi: "上边", pinyin: "shàngbiān" }],
  xiabian:   [{ hanzi: "下边", pinyin: "xiàbiān" }],
  libian:    [{ hanzi: "里边", pinyin: "lǐbiān" }],
  waibian:   [{ hanzi: "外边", pinyin: "wàibiān" }],
  duimian:   [{ hanzi: "对面", pinyin: "duìmiàn" }],
  bian:      [{ hanzi: "边", pinyin: "biān" }],
  li:        [{ hanzi: "里", pinyin: "lǐ" }, { hanzi: "礼", pinyin: "lǐ" }, { hanzi: "理", pinyin: "lǐ" }],
  liwu:      [{ hanzi: "礼物", pinyin: "lǐwù" }],

  // ───── Lugares ─────
  tushuguan: [{ hanzi: "图书馆", pinyin: "túshūguǎn" }],
  shitang:   [{ hanzi: "食堂", pinyin: "shítáng" }],
  sushe:     [{ hanzi: "宿舍", pinyin: "sùshè" }],
  jiaoshi:   [{ hanzi: "教室", pinyin: "jiàoshì" }],
  jiaoxuelou: [{ hanzi: "教学楼", pinyin: "jiàoxué lóu" }],
  bangonglou: [{ hanzi: "办公楼", pinyin: "bàngōng lóu" }],
  tiyuguan:  [{ hanzi: "体育馆", pinyin: "tǐyùguǎn" }],
  yiyuan:    [{ hanzi: "医院", pinyin: "yīyuàn" }],
  yinhang:   [{ hanzi: "银行", pinyin: "yínháng" }],
  chaoshi:   [{ hanzi: "超市", pinyin: "chāoshì" }],
  fanguan:   [{ hanzi: "饭馆", pinyin: "fànguǎn" }],
  jiedao:    [{ hanzi: "街道", pinyin: "jiēdào" }],
  jie:       [{ hanzi: "街", pinyin: "jiē" }, { hanzi: "接", pinyin: "jiē" }],
  malu:      [{ hanzi: "马路", pinyin: "mǎlù" }],
  lu:        [{ hanzi: "路", pinyin: "lù" }, { hanzi: "录", pinyin: "lù" }],
  hutong:    [{ hanzi: "胡同", pinyin: "hútòng" }],
  men:       [{ hanzi: "门", pinyin: "mén" }, { hanzi: "们", pinyin: "men" }],
  menkou:    [{ hanzi: "门口", pinyin: "ménkǒu" }],
  xiaomen:   [{ hanzi: "校门", pinyin: "xiàomén" }],
  ditu:      [{ hanzi: "地图", pinyin: "dìtú" }],
  difang:    [{ hanzi: "地方", pinyin: "dìfang" }],
  zhongyao:  [{ hanzi: "中药", pinyin: "zhōngyào" }],
  xiyao:     [{ hanzi: "西药", pinyin: "xīyào" }],
  yao:       [{ hanzi: "药", pinyin: "yào" }, { hanzi: "要", pinyin: "yào" }],
  yao2:      [{ hanzi: "要", pinyin: "yào" }],
  zhongyi:   [{ hanzi: "中医", pinyin: "zhōngyī" }],
  neike:     [{ hanzi: "内科", pinyin: "nèikē" }],
  waike:     [{ hanzi: "外科", pinyin: "wàikē" }],
  jizhen:    [{ hanzi: "急诊", pinyin: "jízhěn" }],
  ke:        [{ hanzi: "课", pinyin: "kè" }, { hanzi: "可", pinyin: "kě" }, { hanzi: "客", pinyin: "kè" }, { hanzi: "科", pinyin: "kē" }],

  // ───── Comida / fruta ─────
  baozi:     [{ hanzi: "包子", pinyin: "bāozi" }],
  jiaozi:    [{ hanzi: "饺子", pinyin: "jiǎozi" }],
  fan:       [{ hanzi: "饭", pinyin: "fàn" }],
  chifan:    [{ hanzi: "吃饭", pinyin: "chīfàn" }],
  shoumian:  [{ hanzi: "寿面", pinyin: "shòumiàn" }],
  dangao:    [{ hanzi: "蛋糕", pinyin: "dàngāo" }],
  qiaokeli:  [{ hanzi: "巧克力", pinyin: "qiǎokèlì" }],
  pingguo:   [{ hanzi: "苹果", pinyin: "píngguǒ" }],
  caomei:    [{ hanzi: "草莓", pinyin: "cǎoméi" }],
  putao:     [{ hanzi: "葡萄", pinyin: "pútao" }],
  xiangjiao: [{ hanzi: "香蕉", pinyin: "xiāngjiāo" }],
  chengzi:   [{ hanzi: "橙子", pinyin: "chéngzi" }],
  yingtao:   [{ hanzi: "樱桃", pinyin: "yīngtáo" }],
  shuiguo:   [{ hanzi: "水果", pinyin: "shuǐguǒ" }],
  he3:       [{ hanzi: "盒", pinyin: "hé" }],
  shui2:     [{ hanzi: "水", pinyin: "shuǐ" }],

  // ───── Ropa / colores ─────
  yifu:      [{ hanzi: "衣服", pinyin: "yīfu" }],
  chenshan:  [{ hanzi: "衬衫", pinyin: "chènshān" }],
  niuzaiku:  [{ hanzi: "牛仔裤", pinyin: "niúzǎikù" }],
  yurongfu:  [{ hanzi: "羽绒服", pinyin: "yǔróngfú" }],
  qunzi:     [{ hanzi: "裙子", pinyin: "qúnzi" }],
  txu:       [{ hanzi: "T恤", pinyin: "T xù" }],
  heise:     [{ hanzi: "黑色", pinyin: "hēisè" }],
  baise:     [{ hanzi: "白色", pinyin: "báisè" }],
  hongse:    [{ hanzi: "红色", pinyin: "hóngsè" }],
  lvse:      [{ hanzi: "绿色", pinyin: "lǜsè" }],
  hei:       [{ hanzi: "黑", pinyin: "hēi" }],
  bai:       [{ hanzi: "白", pinyin: "bái" }],
  hong:      [{ hanzi: "红", pinyin: "hóng" }],
  lv:        [{ hanzi: "绿", pinyin: "lǜ" }, { hanzi: "驴", pinyin: "lǘ" }, { hanzi: "旅", pinyin: "lǚ" }],
  se:        [{ hanzi: "色", pinyin: "sè" }],
  heshi:     [{ hanzi: "合适", pinyin: "héshì" }],

  // ───── Dinero / compras ─────
  qian:      [{ hanzi: "钱", pinyin: "qián" }, { hanzi: "前", pinyin: "qián" }, { hanzi: "千", pinyin: "qiān" }],
  duoshaoqian: [{ hanzi: "多少钱", pinyin: "duōshao qián" }],
  kuai:      [{ hanzi: "块", pinyin: "kuài" }, { hanzi: "快", pinyin: "kuài" }],
  yuan:      [{ hanzi: "元", pinyin: "yuán" }, { hanzi: "员", pinyin: "yuán" }, { hanzi: "原", pinyin: "yuán" }],
  jiao2:     [{ hanzi: "角", pinyin: "jiǎo" }],
  // `mao:` se define más abajo junto con 猫; aquí solo 毛 era incompleto.
  fen:       [{ hanzi: "分", pinyin: "fēn" }],
  jin:       [{ hanzi: "斤", pinyin: "jīn" }, { hanzi: "今", pinyin: "jīn" }],
  bai2:      [{ hanzi: "百", pinyin: "bǎi" }],
  qian2:     [{ hanzi: "千", pinyin: "qiān" }],
  ling:      [{ hanzi: "零", pinyin: "líng" }],
  gui:       [{ hanzi: "贵", pinyin: "guì" }, { hanzi: "桂", pinyin: "guì" }],
  guixing:   [{ hanzi: "贵姓", pinyin: "guìxìng" }],
  pianyi:    [{ hanzi: "便宜", pinyin: "piányi" }],
  dazhe:     [{ hanzi: "打折", pinyin: "dǎzhé" }],
  bucuo:     [{ hanzi: "不错", pinyin: "búcuò" }],
  cuo:       [{ hanzi: "错", pinyin: "cuò" }],
  xie2:      [{ hanzi: "些", pinyin: "xiē" }],
  ka:        [{ hanzi: "卡", pinyin: "kǎ" }],
  meiwenti:  [{ hanzi: "没问题", pinyin: "méi wèntí" }],
  wenti:     [{ hanzi: "问题", pinyin: "wèntí" }],
  yigong:    [{ hanzi: "一共", pinyin: "yīgòng" }],
  duo:       [{ hanzi: "多", pinyin: "duō" }],
  shao:      [{ hanzi: "少", pinyin: "shǎo" }, { hanzi: "烧", pinyin: "shāo" }],

  // ───── Tiempo / fechas ─────
  jinnian:   [{ hanzi: "今年", pinyin: "jīnnián" }],
  jintian:   [{ hanzi: "今天", pinyin: "jīntiān" }],
  zuotian:   [{ hanzi: "昨天", pinyin: "zuótiān" }],
  mingtian:  [{ hanzi: "明天", pinyin: "míngtiān" }],
  qiantian:  [{ hanzi: "前天", pinyin: "qiántiān" }],
  houtian:   [{ hanzi: "后天", pinyin: "hòutiān" }],
  shangwu:   [{ hanzi: "上午", pinyin: "shàngwǔ" }],
  zhongwu:   [{ hanzi: "中午", pinyin: "zhōngwǔ" }],
  xiawu:     [{ hanzi: "下午", pinyin: "xiàwǔ" }],
  wanshang:  [{ hanzi: "晚上", pinyin: "wǎnshang" }],
  zaoshang:  [{ hanzi: "早上", pinyin: "zǎoshang" }],
  xianzai:   [{ hanzi: "现在", pinyin: "xiànzài" }],
  shijian:   [{ hanzi: "时间", pinyin: "shíjiān" }],
  yihuir:    [{ hanzi: "一会儿", pinyin: "yīhuìr" }],
  dian:      [{ hanzi: "点", pinyin: "diǎn" }, { hanzi: "电", pinyin: "diàn" }, { hanzi: "店", pinyin: "diàn" }],
  fen2:      [{ hanzi: "分", pinyin: "fēn" }],
  ban:       [{ hanzi: "半", pinyin: "bàn" }, { hanzi: "班", pinyin: "bān" }, { hanzi: "办", pinyin: "bàn" }],
  cha:       [{ hanzi: "差", pinyin: "chà" }, { hanzi: "茶", pinyin: "chá" }],
  ri:        [{ hanzi: "日", pinyin: "rì" }],
  yue:       [{ hanzi: "月", pinyin: "yuè" }, { hanzi: "乐", pinyin: "lè" }],
  nian:      [{ hanzi: "年", pinyin: "nián" }],
  xingqi:    [{ hanzi: "星期", pinyin: "xīngqī" }],
  xingqiri:  [{ hanzi: "星期日", pinyin: "xīngqīrì" }],
  xingqitian:[{ hanzi: "星期天", pinyin: "xīngqītiān" }],
  shir:      [{ hanzi: "事儿", pinyin: "shìr" }],
  shengri:   [{ hanzi: "生日", pinyin: "shēngrì" }],
  shengrikuaile: [{ hanzi: "生日快乐", pinyin: "shēngrì kuàilè" }],
  kuaile:    [{ hanzi: "快乐", pinyin: "kuàilè" }],
  juhui:     [{ hanzi: "聚会", pinyin: "jùhuì" }],
  yinyuehui: [{ hanzi: "音乐会", pinyin: "yīnyuèhuì" }],

  // ───── Animales / horóscopo ─────
  long:      [{ hanzi: "龙", pinyin: "lóng" }],
  ma:        [{ hanzi: "马", pinyin: "mǎ" }, { hanzi: "吗", pinyin: "ma" }, { hanzi: "妈", pinyin: "mā" }],
  yang:      [{ hanzi: "羊", pinyin: "yáng" }, { hanzi: "样", pinyin: "yàng" }],
  niu:       [{ hanzi: "牛", pinyin: "niú" }],
  laohu:     [{ hanzi: "老虎", pinyin: "lǎohǔ" }],
  laoshu:    [{ hanzi: "老鼠", pinyin: "lǎoshǔ" }],
  she:       [{ hanzi: "蛇", pinyin: "shé" }],
  hou:       [{ hanzi: "猴", pinyin: "hóu" }, { hanzi: "后", pinyin: "hòu" }],
  ji2:       [{ hanzi: "鸡", pinyin: "jī" }],
  gou:       [{ hanzi: "狗", pinyin: "gǒu" }],
  xiaogou:   [{ hanzi: "小狗", pinyin: "xiǎogǒu" }],
  mao:       [{ hanzi: "猫", pinyin: "māo" }, { hanzi: "毛", pinyin: "máo" }],

  // ───── Cuerpo / salud ─────
  tou:       [{ hanzi: "头", pinyin: "tóu" }],
  teng:      [{ hanzi: "疼", pinyin: "téng" }],
  sangzi:    [{ hanzi: "嗓子", pinyin: "sǎngzi" }],
  yanjing:   [{ hanzi: "眼睛", pinyin: "yǎnjing" }],
  ya:        [{ hanzi: "牙", pinyin: "yá" }, { hanzi: "呀", pinyin: "ya" }, { hanzi: "亚", pinyin: "yà" }],
  wei:       [{ hanzi: "胃", pinyin: "wèi" }, { hanzi: "为", pinyin: "wèi" }],
  bozi:      [{ hanzi: "脖子", pinyin: "bózi" }],
  gebo:      [{ hanzi: "胳膊", pinyin: "gēbo" }],
  yao3:      [{ hanzi: "腰", pinyin: "yāo" }],
  tui:       [{ hanzi: "腿", pinyin: "tuǐ" }],
  shenti:    [{ hanzi: "身体", pinyin: "shēntǐ" }],
  quanshen:  [{ hanzi: "全身", pinyin: "quánshēn" }],
  quan:      [{ hanzi: "全", pinyin: "quán" }],
  tiwen:     [{ hanzi: "体温", pinyin: "tǐwēn" }],
  ti:        [{ hanzi: "体", pinyin: "tǐ" }],
  bing:      [{ hanzi: "病", pinyin: "bìng" }],
  ladu:      [{ hanzi: "拉肚子", pinyin: "lā dùzi" }],
  zhen2:     [{ hanzi: "针", pinyin: "zhēn" }],
  xie3:      [{ hanzi: "血", pinyin: "xiě" }],
  tushi:     [{ hanzi: "透视", pinyin: "tòushì" }],
  zhenjiu:   [{ hanzi: "针灸", pinyin: "zhēnjiǔ" }],
  dabian:    [{ hanzi: "大便", pinyin: "dàbiàn" }],
  xiaobian:  [{ hanzi: "小便", pinyin: "xiǎobiàn" }],
  ceng:      [{ hanzi: "层", pinyin: "céng" }],
  nei:       [{ hanzi: "内", pinyin: "nèi" }],

  // ───── Adjetivos generales ─────
  da:        [{ hanzi: "大", pinyin: "dà" }, { hanzi: "答", pinyin: "dá" }],
  xiao:      [{ hanzi: "小", pinyin: "xiǎo" }, { hanzi: "笑", pinyin: "xiào" }, { hanzi: "校", pinyin: "xiào" }],
  mang:      [{ hanzi: "忙", pinyin: "máng" }],
  lei:       [{ hanzi: "累", pinyin: "lèi" }],
  re:        [{ hanzi: "热", pinyin: "rè" }],
  leng:      [{ hanzi: "冷", pinyin: "lěng" }],
  hao2:      [{ hanzi: "号", pinyin: "hào" }],
  haochi:    [{ hanzi: "好吃", pinyin: "hǎochī" }],
  piaoliang: [{ hanzi: "漂亮", pinyin: "piàoliang" }],
  piao:      [{ hanzi: "漂", pinyin: "piào" }, { hanzi: "票", pinyin: "piào" }],
  liang2:    [{ hanzi: "亮", pinyin: "liàng" }],
  gaoxing:   [{ hanzi: "高兴", pinyin: "gāoxìng" }],
  gao:       [{ hanzi: "高", pinyin: "gāo" }, { hanzi: "搞", pinyin: "gǎo" }],
  xing:      [{ hanzi: "兴", pinyin: "xìng" }, { hanzi: "姓", pinyin: "xìng" }, { hanzi: "行", pinyin: "xíng" }, { hanzi: "星", pinyin: "xīng" }],
  xin:       [{ hanzi: "新", pinyin: "xīn" }, { hanzi: "心", pinyin: "xīn" }, { hanzi: "信", pinyin: "xìn" }],
  lao:       [{ hanzi: "老", pinyin: "lǎo" }],
  zhaoji:    [{ hanzi: "着急", pinyin: "zháojí" }],
  kexi:      [{ hanzi: "可惜", pinyin: "kěxī" }],

  // ───── Trabajo / clase ─────
  gongzuo:   [{ hanzi: "工作", pinyin: "gōngzuò" }],
  ban2:      [{ hanzi: "班", pinyin: "bān" }],
  banji:     [{ hanzi: "班级", pinyin: "bānjí" }],
  bangong:   [{ hanzi: "办公", pinyin: "bàngōng" }],
  jiaoxue:   [{ hanzi: "教学", pinyin: "jiàoxué" }],
  mingzi:    [{ hanzi: "名字", pinyin: "míngzi" }],

  // ───── Tiempo meteo ─────
  tianqi:    [{ hanzi: "天气", pinyin: "tiānqì" }],
  qi2:       [{ hanzi: "气", pinyin: "qì" }, { hanzi: "起", pinyin: "qǐ" }, { hanzi: "期", pinyin: "qī" }, { hanzi: "七", pinyin: "qī" }],
  tian:      [{ hanzi: "天", pinyin: "tiān" }],

  // ───── Números ─────
  ling2:     [{ hanzi: "零", pinyin: "líng" }],
  yi:        [{ hanzi: "一", pinyin: "yī" }, { hanzi: "以", pinyin: "yǐ" }, { hanzi: "已", pinyin: "yǐ" }],
  er:        [{ hanzi: "二", pinyin: "èr" }, { hanzi: "儿", pinyin: "ér" }, { hanzi: "而", pinyin: "ér" }],
  san:       [{ hanzi: "三", pinyin: "sān" }, { hanzi: "散", pinyin: "sàn" }],
  si:        [{ hanzi: "四", pinyin: "sì" }, { hanzi: "死", pinyin: "sǐ" }, { hanzi: "思", pinyin: "sī" }],
  wu2:       [{ hanzi: "五", pinyin: "wǔ" }],
  liu:       [{ hanzi: "六", pinyin: "liù" }],
  qi3:       [{ hanzi: "七", pinyin: "qī" }],
  ba:        [{ hanzi: "八", pinyin: "bā" }, { hanzi: "爸", pinyin: "bà" }, { hanzi: "吧", pinyin: "ba" }, { hanzi: "把", pinyin: "bǎ" }],
  jiu2:      [{ hanzi: "九", pinyin: "jiǔ" }],
  shi3:      [{ hanzi: "十", pinyin: "shí" }],
  bai3:      [{ hanzi: "百", pinyin: "bǎi" }],
  qian3:     [{ hanzi: "千", pinyin: "qiān" }],
  wan:       [{ hanzi: "万", pinyin: "wàn" }, { hanzi: "晚", pinyin: "wǎn" }, { hanzi: "完", pinyin: "wán" }],

  // ───── Conjunciones ─────
  keshi:     [{ hanzi: "可是", pinyin: "kěshì" }],
  ranhou:    [{ hanzi: "然后", pinyin: "ránhòu" }],
  haishuo:   [{ hanzi: "还是", pinyin: "háishi" }],

  // ───── Partículas finales ─────
  ma2:       [{ hanzi: "吗", pinyin: "ma" }],
  ne:        [{ hanzi: "呢", pinyin: "ne" }, { hanzi: "嗯", pinyin: "ǹg" }],
  ba2:       [{ hanzi: "吧", pinyin: "ba" }],
  le:        [{ hanzi: "了", pinyin: "le" }, { hanzi: "乐", pinyin: "lè" }],
  a:         [{ hanzi: "啊", pinyin: "a" }],
  de:        [{ hanzi: "的", pinyin: "de" }, { hanzi: "得", pinyin: "de" }, { hanzi: "地", pinyin: "de" }],

  // ───── Demostrativos ─────
  zhe:       [{ hanzi: "这", pinyin: "zhè" }, { hanzi: "者", pinyin: "zhě" }],
  nei2:      [{ hanzi: "那", pinyin: "nèi" }],

  // ───── 一些combinaciones útiles ─────
  yibian:    [{ hanzi: "一遍", pinyin: "yī biàn" }],
  yiqi:      [{ hanzi: "一起", pinyin: "yīqǐ" }],
  yiyang:    [{ hanzi: "一样", pinyin: "yīyàng" }],
  yikuair:   [{ hanzi: "一块儿", pinyin: "yīkuàir" }],

  // ───── Otras formas habituales ─────
  jia2:      [{ hanzi: "假", pinyin: "jiǎ" }, { hanzi: "加", pinyin: "jiā" }, { hanzi: "价", pinyin: "jià" }],
  jie2:      [{ hanzi: "节", pinyin: "jié" }, { hanzi: "结", pinyin: "jié" }],
  zi:        [{ hanzi: "子", pinyin: "zi" }, { hanzi: "字", pinyin: "zì" }, { hanzi: "自", pinyin: "zì" }],
  feng:      [{ hanzi: "风", pinyin: "fēng" }, { hanzi: "封", pinyin: "fēng" }],
  fu:        [{ hanzi: "父", pinyin: "fù" }, { hanzi: "夫", pinyin: "fū" }, { hanzi: "服", pinyin: "fú" }, { hanzi: "幅", pinyin: "fú" }],
  mu:        [{ hanzi: "母", pinyin: "mǔ" }, { hanzi: "木", pinyin: "mù" }, { hanzi: "目", pinyin: "mù" }],
  gong:      [{ hanzi: "工", pinyin: "gōng" }, { hanzi: "公", pinyin: "gōng" }, { hanzi: "共", pinyin: "gòng" }],
  bao:       [{ hanzi: "包", pinyin: "bāo" }, { hanzi: "宝", pinyin: "bǎo" }, { hanzi: "报", pinyin: "bào" }],
  lou:       [{ hanzi: "楼", pinyin: "lóu" }],

  // ───── Puntuación ─────
  "，":      [{ hanzi: "，", pinyin: "，" }],
  "？":      [{ hanzi: "？", pinyin: "？" }],
  "。":      [{ hanzi: "。", pinyin: "。" }],
  "！":      [{ hanzi: "！", pinyin: "！" }],
};

// Función auxiliar: normaliza una cadena de pinyin para buscarla en el diccionario
// Elimina tonos, espacios, guiones y convierte a minúsculas.
export function normalizePinyin(str) {
  return str
    .toLowerCase()
    .normalize('NFD')                       // descompone ā → a + tono
    .replace(/[̀-ͯ]/g, '')        // elimina marcas de tono
    .replace(/ü/g, 'u')                     // ü → u
    .replace(/v/g, 'u')                     // v → u (notación alternativa)
    .replace(/[^a-z]/g, '');                // elimina todo lo que no sea letra
}

// Función auxiliar: devuelve candidatos para un input dado (sin tonos)
// Soporta búsqueda parcial (prefijo).
export function getCandidates(input) {
  if (!input) return [];
  const norm = normalizePinyin(input);
  if (!norm) return [];

  const results = [];

  // 1. Coincidencia exacta primero
  if (pinyinDictionary[norm]) {
    results.push(...pinyinDictionary[norm]);
  }

  // 2. Coincidencias de prefijo
  for (const key of Object.keys(pinyinDictionary)) {
    if (key !== norm && key.startsWith(norm)) {
      for (const candidate of pinyinDictionary[key]) {
        if (!results.find(r => r.hanzi === candidate.hanzi)) {
          results.push(candidate);
        }
      }
    }
  }

  return results.slice(0, 8); // máximo 8 candidatos
}
