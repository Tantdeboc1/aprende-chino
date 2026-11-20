const languages = ['es', 'en', 'fr', 'de', 'it', 'pt'];
const text = (line) => Object.fromEntries(line.split('|').map((value, i) => [languages[i], value]));

// The examples and explanatory rules live in topicWorkshop so the introduction
// and grammar tab teach the same patterns.
export const lessonIntroductions = {
  1: {
    overview: text('Este tema te prepara para una conversación breve: saludar, preguntar cómo está alguien y responder. Verás cómo cambia una frase al añadir 吗 al final y qué pregunta usar para que la otra persona te cuente cómo le va.|This unit prepares you for a short conversation: say hello, ask how someone is, and reply. You’ll see what changes when you add 吗 at the end and how to ask an open question about how someone is doing.|Cette unité te prépare à un échange bref : saluer, demander comment quelqu’un va et répondre. Tu verras ce qui change quand on ajoute 吗 à la fin et comment poser une question ouverte.|In dieser Lektion lernst du, jemanden zu begrüßen, nach dem Befinden zu fragen und zu antworten. Du siehst, was 吗 am Satzende ändert und wie du offen nach dem Befinden fragst.|Questa unità ti prepara a una breve conversazione: salutare, chiedere come sta qualcuno e rispondere. Vedrai che cosa cambia aggiungendo 吗 alla fine e come fare una domanda aperta.|Nesta unidade, aprendes a cumprimentar, perguntar como alguém está e responder. Vais ver o que muda quando acrescentas 吗 no fim e como fazer uma pergunta aberta.'),
    goals: [
      text('Saludar y hacer una pregunta con 吗.|Greet someone and ask a question with 吗.|Saluer et poser une question avec 吗.|Jemanden begrüßen und mit 吗 fragen.|Salutare e fare una domanda con 吗.|Cumprimentar e fazer uma pergunta com 吗.'),
      text('Decir cómo estás con 很 o 不.|Say how you are using 很 or 不.|Dire comment tu vas avec 很 ou 不.|Mit 很 oder 不 sagen, wie es dir geht.|Dire come stai con 很 o 不.|Dizer como estás com 很 ou 不.'),
      text('Preguntar cómo le va a alguien con 怎么样.|Ask how someone is doing with 怎么样.|Demander comment quelqu’un va avec 怎么样.|Mit 怎么样 nach dem Befinden fragen.|Chiedere come sta qualcuno con 怎么样.|Perguntar como alguém está com 怎么样.'),
    ],
  },
  2: {
    overview: text('Este tema te enseña a presentarte y a conocer a otras personas. Al saludar ya usaste 你 y 我. Ahora los combinarás con dos verbos: 叫 para el nombre y 是 para decir, por ejemplo, de qué país eres. También aprenderás a preguntar por la nacionalidad sin tener que adivinarla.|This unit teaches you to introduce yourself and get to know others. You’ve used 你 and 我 in greetings. Now you’ll combine them with 叫 for names and 是 to say, for instance, where you’re from. You’ll also learn to ask about nationality without guessing.|Cette unité t’apprend à te présenter et à faire connaissance. Tu as déjà utilisé 你 et 我 pour saluer. Tu vas les combiner avec 叫 pour le prénom et 是 pour dire, par exemple, d’où tu viens. Tu apprendras aussi à demander la nationalité.|In dieser Lektion lernst du, dich vorzustellen und andere kennenzulernen. 你 und 我 kennst du schon aus der Begrüßung. Jetzt kombinierst du sie mit 叫 für den Namen und 是 etwa für die Herkunft. Du lernst auch, nach der Nationalität zu fragen.|Questa unità ti insegna a presentarti e a conoscere altre persone. Hai già usato 你 e 我 nei saluti. Ora li combinerai con 叫 per dire il nome e con 是, per esempio, per dire di dove sei. Imparerai anche a chiedere la nazionalità.|Nesta unidade, aprendes a apresentar-te e a conhecer outras pessoas. Já usaste 你 e 我 nas saudações. Agora vais combiná-los com 叫 para dizer o nome e com 是, por exemplo, para dizer de onde és. Também vais aprender a perguntar pela nacionalidade.'),
    goals: [
      text('Dar tu nombre y decir de dónde eres.|Give your name and say where you’re from.|Donner ton prénom et dire d’où tu viens.|Deinen Namen und deine Herkunft angeben.|Dire come ti chiami e di dove sei.|Dizer como te chamas e de onde és.'),
      text('Preguntar de qué país es alguien con 哪国人.|Ask where someone is from with 哪国人.|Demander la nationalité avec 哪国人.|Mit 哪国人 nach der Herkunft fragen.|Chiedere di che paese è qualcuno con 哪国人.|Perguntar de que país é alguém com 哪国人.'),
      text('Añadir o negar información con 也 y 不是.|Add or negate information with 也 and 不是.|Ajouter ou nier une information avec 也 et 不是.|Mit 也 und 不是 etwas hinzufügen oder verneinen.|Aggiungere o negare informazioni con 也 e 不是.|Acrescentar ou negar informação com 也 e 不是.'),
    ],
  },
  3: {
    overview: text('Aquí aprenderás a hablar de tu familia: quién la forma, cuántas personas hay y si tienes hermanos. En chino, al contar personas, el número suele ir acompañado de un clasificador. Verás cuándo usar 口 para la familia y cómo cambia 有 al negar.|Here you’ll learn to talk about your family: who is in it, how many people there are, and whether you have siblings. In Chinese, a classifier usually accompanies numbers when counting people. You’ll see when to use 口 for family and how to negate 有.|Tu vas apprendre à parler de ta famille : qui en fait partie, combien vous êtes et si tu as des frères ou sœurs. En chinois, un classificateur accompagne généralement le nombre. Tu verras quand employer 口 pour la famille et comment nier 有.|Hier lernst du, über deine Familie zu sprechen: Wer gehört dazu, wie viele seid ihr und hast du Geschwister? Beim Zählen steht im Chinesischen meist ein Zählwort. Du lernst 口 für Familienmitglieder und die Verneinung von 有.|Qui impari a parlare della tua famiglia: chi ne fa parte, quante persone ci sono e se hai fratelli o sorelle. In cinese il numero di solito si accompagna a un classificatore. Vedrai quando usare 口 per la famiglia e come negare 有.|Aqui vais aprender a falar da tua família: quem faz parte dela, quantas pessoas são e se tens irmãos. Em chinês, o número costuma ser acompanhado por um classificador. Vais ver quando usar 口 para a família e como negar 有.'),
    goals: [
      text('Preguntar y decir cuántos sois con 几口人 y 两口人.|Ask and say how many people are in a family with 几口人 and 两口人.|Demander et dire combien vous êtes avec 几口人 et 两口人.|Mit 几口人 und 两口人 nach der Familiengröße fragen und antworten.|Chiedere e dire in quanti siete con 几口人 e 两口人.|Perguntar e dizer quantos são com 几口人 e 两口人.'),
      text('Decir si tienes hermanos con 有 o 没有.|Say whether you have siblings with 有 or 没有.|Dire si tu as des frères ou sœurs avec 有 ou 没有.|Mit 有 oder 没有 sagen, ob du Geschwister hast.|Dire se hai fratelli o sorelle con 有 o 没有.|Dizer se tens irmãos com 有 ou 没有.'),
      text('Distinguir 口 de 个 al contar personas.|Distinguish 口 from 个 when counting people.|Distinguer 口 de 个 pour compter les personnes.|Beim Zählen von Personen 口 und 个 unterscheiden.|Distinguere 口 da 个 quando conti persone.|Distinguir 口 de 个 ao contar pessoas.'),
    ],
  },
  4: {
    overview: text('En este tema pasarás de contar a hablar de horarios. Una hora como 三点 tiene sentido por sí sola, pero 下午 indica que hablamos de la tarde. Cuando dices qué vas a hacer, juntarás el día, la parte del día y la hora antes de la acción.|In this unit, you’ll go from counting to talking about schedules. 三点 means three o’clock, and 下午 tells you it’s in the afternoon. To say what you’ll do, put the day, time of day, and hour before the action.|Dans cette unité, tu passes des nombres aux horaires. 三点 signifie trois heures et 下午 précise qu’il s’agit de l’après-midi. Pour annoncer une action, place le jour, le moment de la journée et l’heure avant le verbe.|In dieser Lektion geht es von Zahlen zu Uhrzeiten und Terminen. 三点 heißt drei Uhr, und 下午 macht daraus drei Uhr nachmittags. Bei einer geplanten Handlung stehen Tag, Tageszeit und Uhrzeit vor dem Verb.|In questa unità passi dai numeri agli orari. 三点 significa le tre, mentre 下午 specifica che sono le tre del pomeriggio. Per dire che cosa farai, metti giorno, parte della giornata e ora prima dell’azione.|Nesta unidade, passas dos números aos horários. 三点 significa três horas e 下午 indica que é de tarde. Para dizer o que vais fazer, coloca o dia, a parte do dia e a hora antes da ação.'),
    goals: [
      text('Preguntar y decir la hora, incluida la media hora.|Ask and tell the time, including half past.|Demander et donner l’heure, y compris la demi-heure.|Nach der Uhrzeit fragen und auch halbe Stunden angeben.|Chiedere e dire l’ora, compresa la mezz’ora.|Perguntar e dizer as horas, incluindo a meia hora.'),
      text('Ordenar el día, la parte del día y la hora.|Put the day, time of day, and hour in order.|Placer le jour, le moment de la journée et l’heure dans l’ordre.|Tag, Tageszeit und Uhrzeit in die richtige Reihenfolge bringen.|Ordinare giorno, parte della giornata e ora.|Ordenar o dia, a parte do dia e a hora.'),
      text('Decir cuándo tienes clase y cuándo no.|Say when you have class and when you don’t.|Dire quand tu as cours et quand tu n’en as pas.|Sagen, wann du Unterricht hast und wann nicht.|Dire quando hai lezione e quando no.|Dizer quando tens aula e quando não tens.'),
    ],
  },
  5: {
    overview: text('Ya sabes hablar de horas y horarios. Ahora ampliarás esa idea a días del mes, cumpleaños y edad. En chino la fecha va de lo más amplio a lo más concreto: año, mes y día. Verás cómo preguntar por una fecha y qué decir cuando llega un cumpleaños.|You already know how to talk about times and schedules. Now you’ll extend that to dates, birthdays, and age. Chinese dates go from the largest unit to the smallest: year, month, day. You’ll learn how to ask for a date and what to say on someone’s birthday.|Tu sais déjà parler de l’heure et des horaires. Ici, tu passes aux dates, aux anniversaires et à l’âge. En chinois, la date va de la plus grande unité à la plus petite : année, mois, jour. Tu apprendras à demander une date et à souhaiter un anniversaire.|Du kannst schon über Uhrzeiten und Termine sprechen. Jetzt kommen Datum, Geburtstag und Alter dazu. Im Chinesischen beginnt das Datum mit der größten Einheit: Jahr, Monat, Tag. Du lernst, nach dem Datum zu fragen und zum Geburtstag zu gratulieren.|Sai già parlare di orari. Ora passerai alle date, ai compleanni e all’età. In cinese la data va dall’unità più grande alla più piccola: anno, mese, giorno. Imparerai a chiedere una data e a fare gli auguri.|Já sabes falar de horas e horários. Agora vais passar às datas, aos aniversários e à idade. Em chinês, a data vai da unidade maior para a menor: ano, mês e dia. Vais aprender a perguntar pela data e a dar os parabéns.'),
    goals: [
      text('Preguntar y expresar fechas con 月, 日 y 号.|Ask for and give dates using 月, 日, and 号.|Demander et donner des dates avec 月, 日 et 号.|Mit 月, 日 und 号 nach dem Datum fragen und es angeben.|Chiedere e dire la data con 月, 日 e 号.|Perguntar e dizer datas com 月, 日 e 号.'),
      text('Preguntar la edad y responder con 岁.|Ask someone’s age and reply with 岁.|Demander l’âge et répondre avec 岁.|Nach dem Alter fragen und mit 岁 antworten.|Chiedere l’età e rispondere con 岁.|Perguntar a idade e responder com 岁.'),
      text('Felicitar un cumpleaños con 祝你生日快乐.|Wish someone a happy birthday with 祝你生日快乐.|Souhaiter un anniversaire avec 祝你生日快乐.|Mit 祝你生日快乐 zum Geburtstag gratulieren.|Fare gli auguri con 祝你生日快乐.|Dar os parabéns com 祝你生日快乐.'),
    ],
  },
  7: {
    overview: text('En este tema usarás lo que sabes de números y clasificadores para hacer una compra. Aprenderás a preguntar cuánto cuesta algo, decir qué artículo y cuántas unidades quieres, y pedir permiso para probártelo. Cada paso pide información distinta.|In this unit, you’ll use numbers and classifiers to shop. You’ll learn to ask the price, say which item and how many you want, and ask permission to try something on. Each step needs different information.|Dans cette unité, tu utilises les nombres et les classificateurs pour faire des achats. Tu apprendras à demander le prix, à préciser l’article et la quantité et à demander si tu peux l’essayer.|Hier verwendest du Zahlen und Zählwörter beim Einkaufen. Du lernst, nach dem Preis zu fragen, Artikel und Menge anzugeben und zu fragen, ob du etwas anprobieren darfst.|In questa unità userai numeri e classificatori per fare acquisti. Imparerai a chiedere il prezzo, dire quale articolo vuoi e in che quantità, e chiedere di provarlo.|Nesta unidade, vais usar números e classificadores para fazer compras. Vais aprender a perguntar o preço, indicar o artigo e a quantidade, e pedir para o experimentar.'),
    goals: [
      text('Preguntar y dar un precio con 多少钱 y 块.|Ask and give a price with 多少钱 and 块.|Demander et donner un prix avec 多少钱 et 块.|Mit 多少钱 und 块 nach dem Preis fragen und ihn nennen.|Chiedere e dire il prezzo con 多少钱 e 块.|Perguntar e indicar o preço com 多少钱 e 块.'),
      text('Elegir 件 o 条 según la prenda.|Choose 件 or 条 for the garment.|Choisir 件 ou 条 selon le vêtement.|Je nach Kleidungsstück 件 oder 条 wählen.|Scegliere 件 o 条 in base al capo.|Escolher 件 ou 条 de acordo com a peça de roupa.'),
      text('Expresar lo que quieres con 想 y pedir permiso con 可以.|Say what you want with 想 and ask permission with 可以.|Dire ce que tu veux avec 想 et demander la permission avec 可以.|Mit 想 einen Wunsch äußern und mit 可以 um Erlaubnis bitten.|Dire che cosa vuoi con 想 e chiedere il permesso con 可以.|Dizer o que queres com 想 e pedir autorização com 可以.'),
    ],
  },
  8: {
    overview: text('Este tema te ayuda a entender un intercambio sencillo sobre salud. Empezarás por decir qué parte del cuerpo te duele y cuánto. Después verás cómo cambia la respuesta cuando te preguntan si te duele algo o cuando te ofrecen dos alternativas.|This unit helps you follow a simple conversation about health. You’ll start by saying which part of your body hurts and how much. Then you’ll see how your reply changes when asked whether something hurts or when given two alternatives.|Cette unité t’aide à comprendre un échange simple sur la santé. Tu commenceras par dire où tu as mal et à quel point. Puis tu verras comment répondre différemment à une question fermée ou à une question qui propose deux choix.|Diese Lektion hilft dir, ein einfaches Gespräch über Gesundheit zu verstehen. Du sagst zuerst, wo und wie stark es wehtut. Dann lernst du, eine Ja-Nein-Frage oder eine Frage mit zwei Möglichkeiten zu beantworten.|Questa unità ti aiuta a seguire un semplice scambio sulla salute. Inizierai dicendo dove ti fa male e quanto. Poi vedrai come rispondere a una domanda chiusa o a una domanda che offre due alternative.|Nesta unidade, aprendes a acompanhar uma conversa simples sobre saúde. Começas por dizer onde te dói e quanto. Depois vais ver como responder a uma pergunta de sim ou não e a uma pergunta com duas alternativas.'),
    goals: [
      text('Preguntar dónde duele y nombrar un síntoma.|Ask where it hurts and name a symptom.|Demander où ça fait mal et nommer un symptôme.|Fragen, wo es wehtut, und ein Symptom nennen.|Chiedere dove fa male e nominare un sintomo.|Perguntar onde dói e indicar um sintoma.'),
      text('Distinguir preguntas con 还是 y con 吗.|Distinguish questions with 还是 from questions with 吗.|Distinguer les questions avec 还是 et celles avec 吗.|Fragen mit 还是 und 吗 unterscheiden.|Distinguere le domande con 还是 da quelle con 吗.|Distinguir perguntas com 还是 e com 吗.'),
      text('Distinguir 有点儿 de 一点儿 para decir «un poco».|Distinguish 有点儿 and 一点儿 when saying “a little.”|Distinguer 有点儿 et 一点儿 pour dire « un peu ».|有点儿 und 一点儿 für „ein bisschen“ unterscheiden.|Distinguere 有点儿 e 一点儿 per dire «un po’».|Distinguir 有点儿 e 一点儿 para dizer «um pouco».'),
    ],
  },
};

export const introductionExamples = {
  1: ['你最近怎么样？我很好。', 'Nǐ zuìjìn zěnmeyàng? Wǒ hěn hǎo.', text('¿Qué tal últimamente? Estoy bien.|How have you been lately? I’m well.|Comment vas-tu ces derniers temps ? Je vais bien.|Wie geht es dir in letzter Zeit? Mir geht es gut.|Come stai ultimamente? Sto bene.|Como tens estado ultimamente? Estou bem.')],
  2: ['我叫安娜。我是西班牙人。', 'Wǒ jiào Ānnà. Wǒ shì Xībānyárén.', text('Me llamo Ana. Soy de España.|My name is Ana. I’m from Spain.|Je m’appelle Ana. Je viens d’Espagne.|Ich heiße Ana. Ich komme aus Spanien.|Mi chiamo Ana. Vengo dalla Spagna.|Chamo-me Ana. Sou de Espanha.')],
  3: ['你家有几口人？我家有两口人。', 'Nǐ jiā yǒu jǐ kǒu rén? Wǒ jiā yǒu liǎng kǒu rén.', text('¿Cuántas personas hay en tu familia? Somos dos.|How many people are in your family? There are two of us.|Combien êtes-vous dans ta famille ? Nous sommes deux.|Wie viele Personen seid ihr in deiner Familie? Wir sind zu zweit.|Quante persone ci sono nella tua famiglia? Siamo in due.|Quantas pessoas há na tua família? Somos duas.')],
  4: ['我明天上午八点去学校。', 'Wǒ míngtiān shàngwǔ bā diǎn qù xuéxiào.', text('Mañana voy a la escuela a las ocho de la mañana.|Tomorrow I go to school at eight in the morning.|Demain, je vais à l’école à huit heures du matin.|Morgen gehe ich um acht Uhr zur Schule.|Domani vado a scuola alle otto del mattino.|Amanhã vou para a escola às oito da manhã.')],
  5: ['今天几月几号？五月十号。', 'Jīntiān jǐ yuè jǐ hào? Wǔ yuè shí hào.', text('¿A qué fecha estamos hoy? Diez de mayo.|What’s today’s date? May 10.|Quelle est la date aujourd’hui ? Le 10 mai.|Welches Datum haben wir heute? Den 10. Mai.|Che data è oggi? Il 10 maggio.|Que dia é hoje? Dez de maio.')],
  7: ['这件衣服多少钱？八十块。', 'Zhè jiàn yīfu duōshao qián? Bāshí kuài.', text('¿Cuánto cuesta esta prenda? Ochenta yuanes.|How much is this garment? Eighty yuan.|Combien coûte ce vêtement ? Quatre-vingts yuans.|Wie viel kostet dieses Kleidungsstück? Achtzig Yuan.|Quanto costa questo capo? Ottanta yuan.|Quanto custa esta peça de roupa? Oitenta yuan.')],
  8: ['你头疼还是肚子疼？我有点儿头疼。', 'Nǐ tóuténg háishi dùzi téng? Wǒ yǒudiǎnr tóuténg.', text('¿Te duele la cabeza o la barriga? Me duele un poco la cabeza.|Do you have a headache or a stomachache? I have a slight headache.|Tu as mal à la tête ou au ventre ? J’ai un peu mal à la tête.|Hast du Kopf- oder Bauchschmerzen? Ich habe ein bisschen Kopfschmerzen.|Hai mal di testa o di pancia? Ho un leggero mal di testa.|Dói-te a cabeça ou a barriga? Dói-me um pouco a cabeça.')],
};

export const introductionStories = {
  1: {
    storyId: 't1-h2', sceneId: 's2',
    question: text('¿A quién saluda el personaje? ¿Qué palabra usa para decir «hola»?|Who is the character greeting? Which word means “hello”?|Qui le personnage salue-t-il ? Quel mot veut dire « bonjour » ?|Wen begrüßt die Figur? Welches Wort bedeutet „Hallo“?|Chi saluta il personaggio? Quale parola significa «ciao»?|Quem é que a personagem cumprimenta? Que palavra significa «olá»?'),
    connection: text('Aquí 你好 sirve para saludar. Puedes añadir 吗 para preguntar 你好吗？ Después practicarás cómo responder y cómo preguntar qué tal le va a alguien con 怎么样。|Here, 你好 is a greeting. You can add 吗 to ask 你好吗？ Then you’ll practice answering and using 怎么样 to ask how someone is doing.|Ici, 你好 sert à saluer. Tu peux ajouter 吗 pour demander 你好吗？ Tu apprendras ensuite à répondre et à demander comment quelqu’un va avec 怎么样.|Hier ist 你好 eine Begrüßung. Mit 吗 wird daraus die Frage 你好吗？ Danach übst du, darauf zu antworten und mit 怎么样 nach dem Befinden zu fragen.|Qui 你好 serve per salutare. Puoi aggiungere 吗 per chiedere 你好吗？ Poi ti eserciterai a rispondere e a chiedere come va con 怎么样.|Aqui, 你好 serve para cumprimentar. Podes acrescentar 吗 para perguntar 你好吗？ Depois vais praticar como responder e perguntar como alguém está com 怎么样.'),
  },
  2: {
    storyId: 't2-h1', sceneId: 's3',
    question: text('¿Qué quiere saber 马可 sobre la otra persona?|What does 马可 want to know about the other person?|Qu’est-ce que 马可 veut savoir sur l’autre personne ?|Was möchte 马可 über die andere Person wissen?|Che cosa vuole sapere 马可 dell’altra persona?|O que quer 马可 saber sobre a outra pessoa?'),
    connection: text('哪国人 pregunta de qué país es alguien. En la historia, la respuesta empieza por 我是. En la práctica usarás 是 para decir de dónde eres y 叫 para decir tu nombre.|哪国人 asks what country someone is from. In the story, the reply starts with 我是. In practice, you’ll use 是 to say where you’re from and 叫 to give your name.|哪国人 sert à demander de quel pays vient quelqu’un. Dans l’histoire, la réponse commence par 我是. Tu utiliseras 是 pour dire d’où tu viens et 叫 pour donner ton prénom.|Mit 哪国人 fragst du nach dem Herkunftsland. In der Geschichte beginnt die Antwort mit 我是. Du übst, mit 是 deine Herkunft und mit 叫 deinen Namen anzugeben.|哪国人 serve a chiedere di che paese è una persona. Nella storia la risposta inizia con 我是. Ti eserciterai a usare 是 per dire di dove sei e 叫 per dire come ti chiami.|哪国人 serve para perguntar de que país é alguém. Na história, a resposta começa com 我是. Vais usar 是 para dizer de onde és e 叫 para dizer como te chamas.'),
  },
  3: {
    storyId: 't3-h2', sceneId: 's1',
    question: text('¿Cuántas personas hay en la familia? Localiza el número en la frase.|How many people are in the family? Find the number in the sentence.|Combien de personnes y a-t-il dans la famille ? Repère le nombre dans la phrase.|Wie viele Personen gehören zur Familie? Finde die Zahl im Satz.|Quante persone ci sono in famiglia? Trova il numero nella frase.|Quantas pessoas há na família? Identifica o número na frase.'),
    connection: text('En 四口人, 四 dice cuántos son y 口 sirve para contar a los miembros de la familia. Practicarás cómo hacer esa misma pregunta y cómo decir si tienes hermanos.|In 四口人, 四 gives the number and 口 is the classifier for family members. You’ll practice asking how many people are in a family and saying whether you have siblings.|Dans 四口人, 四 donne le nombre et 口 sert à compter les membres de la famille. Tu apprendras à poser la question et à dire si tu as des frères ou sœurs.|In 四口人 gibt 四 die Zahl an, und 口 ist das Zählwort für Familienmitglieder. Du übst, nach der Familiengröße zu fragen und zu sagen, ob du Geschwister hast.|In 四口人, 四 indica il numero e 口 è il classificatore per i membri della famiglia. Ti eserciterai a fare la stessa domanda e a dire se hai fratelli o sorelle.|Em 四口人, 四 indica o número e 口 serve para contar os membros da família. Vais praticar como fazer essa pergunta e dizer se tens irmãos.'),
  },
  4: {
    storyId: 't4-h2', sceneId: 's2',
    question: text('¿En qué parte del día tiene clase? ¿Qué palabra te da la pista?|What time of day is the class? Which word tells you?|À quel moment de la journée a lieu le cours ? Quel mot te donne l’indice ?|Zu welcher Tageszeit findet der Unterricht statt? Welches Wort verrät es dir?|In quale parte della giornata c’è lezione? Quale parola te lo fa capire?|Em que parte do dia é a aula? Que palavra te dá a pista?'),
    connection: text('上午 indica que la clase es por la mañana. En el diálogo también se pregunta 几点 para saber la hora exacta. Practicarás cómo juntar el día, la parte del día y la hora en una sola frase.|上午 puts the class in the morning. The dialogue also uses 几点 to ask for the exact time. You’ll practice putting the day, time of day, and hour together in one sentence.|上午 indique que le cours a lieu le matin. Dans le dialogue, on demande aussi 几点 pour connaître l’heure exacte. Tu apprendras à réunir le jour, le moment de la journée et l’heure dans une seule phrase.|上午 zeigt, dass der Unterricht am Vormittag stattfindet. Im Dialog wird mit 几点 nach der genauen Uhrzeit gefragt. Du übst, Tag, Tageszeit und Uhrzeit in einem Satz zu nennen.|上午 indica che la lezione è di mattina. Nel dialogo si usa anche 几点 per chiedere l’ora esatta. Ti eserciterai a mettere insieme giorno, parte della giornata e ora in una sola frase.|上午 indica que a aula é de manhã. No diálogo também aparece 几点 para perguntar a hora exata. Vais praticar como juntar o dia, a parte do dia e a hora numa só frase.'),
  },
  5: {
    storyId: 't5-h1', sceneId: 's2',
    question: text('¿En qué ocasión dirías esta frase? Busca «cumpleaños» en chino.|When would you say this? Find the Chinese word for “birthday.”|À quelle occasion dirais-tu cette phrase ? Repère le mot chinois pour « anniversaire ».|Bei welcher Gelegenheit würdest du das sagen? Finde das chinesische Wort für „Geburtstag“.|In quale occasione diresti questa frase? Trova la parola cinese per «compleanno».|Em que ocasião dirias esta frase? Procura a palavra chinesa para «aniversário».'),
    connection: text('生日 significa «cumpleaños» y 祝你 introduce el deseo. Ya sabes cómo felicitar en esta escena. Ahora practicarás también cómo preguntar por la fecha y decir la edad.|生日 means “birthday” and 祝你 introduces the wish. This scene shows you how to wish someone a happy birthday. You’ll also practice asking for a date and giving your age.|生日 veut dire « anniversaire » et 祝你 introduit le souhait. Cette scène montre comment souhaiter un bon anniversaire. Tu apprendras aussi à demander la date et à dire ton âge.|生日 bedeutet „Geburtstag“, und 祝你 leitet den Wunsch ein. Die Szene zeigt, wie du zum Geburtstag gratulierst. Du übst auch, nach dem Datum zu fragen und dein Alter zu nennen.|生日 significa «compleanno» e 祝你 introduce l’augurio. La scena ti mostra come fare gli auguri. Ti eserciterai anche a chiedere la data e a dire la tua età.|生日 significa «aniversário» e 祝你 introduz o desejo. A cena mostra como dar os parabéns. Também vais praticar como perguntar a data e dizer a idade.'),
  },
  6: {
    storyId: 't6-h2', sceneId: 's2',
    question: text('¿Qué lugar buscamos y cuál nos sirve de referencia?|Which place are we looking for, and which place helps us locate it?|Quel lieu cherchons-nous et quel lieu nous sert de repère ?|Welchen Ort suchen wir, und welcher Ort hilft uns, ihn zu finden?|Quale luogo stiamo cercando e quale ci fa da punto di riferimento?|Que lugar procuramos e qual nos serve de referência?'),
  },
  7: {
    storyId: 't7-h2', sceneId: 's1',
    question: text('¿Qué quiere comprar 马可 y cuántas prendas pide?|What does 马可 want to buy, and how many items does he ask for?|Qu’est-ce que 马可 veut acheter, et combien de pièces demande-t-il ?|Was möchte 马可 kaufen, und wie viele Kleidungsstücke möchte er?|Che cosa vuole comprare 马可 e quanti capi chiede?|O que quer 马可 comprar e quantas peças pede?'),
    connection: text('想买 expresa lo que quiere comprar. En 一件衣服, 一 indica la cantidad y 件 es el clasificador. En la práctica podrás precisar qué prenda quieres, preguntar el precio y pedir probártela.|想买 expresses what he wants to buy. In 一件衣服, 一 gives the quantity and 件 is the classifier. You’ll practice saying which garment you want, asking the price, and asking to try it on.|想买 exprime ce qu’il veut acheter. Dans 一件衣服, 一 indique la quantité et 件 sert de classificateur. Tu apprendras à préciser le vêtement, à demander le prix et à demander à l’essayer.|想买 drückt aus, was er kaufen möchte. In 一件衣服 gibt 一 die Menge an, und 件 ist das Zählwort. Du übst, das Kleidungsstück zu nennen, nach dem Preis zu fragen und um eine Anprobe zu bitten.|想买 esprime che cosa vuole comprare. In 一件衣服, 一 indica la quantità e 件 è il classificatore. Ti eserciterai a indicare il capo, chiedere il prezzo e chiedere di provarlo.|想买 indica o que quer comprar. Em 一件衣服, 一 indica a quantidade e 件 é o classificador. Vais praticar como indicar a peça, perguntar o preço e pedir para a experimentar.'),
  },
  8: {
    storyId: 't8-h2', sceneId: 's2',
    question: text('¿Qué le duele a 马可? ¿Dice que le duele mucho o un poco?|What hurts, and does 马可 say it hurts a lot or a little?|Où 马可 a-t-il mal ? Dit-il qu’il a très mal ou un peu mal ?|Wo hat 马可 Schmerzen? Sagt er, dass es sehr oder nur ein bisschen wehtut?|Dove ha male 马可? Dice che gli fa molto male o solo un po’?|Onde dói a 马可? Diz que dói muito ou um pouco?'),
    connection: text('嗓子 indica la garganta y 有点儿疼 expresa que duele un poco. En la práctica usarás el mismo patrón con otras partes del cuerpo y responderás a preguntas sobre los síntomas.|嗓子 means “throat,” and 有点儿疼 means it hurts a little. You’ll practice the same pattern with other parts of the body and answer questions about symptoms.|嗓子 signifie « gorge » et 有点儿疼 veut dire qu’elle fait un peu mal. Tu réutiliseras cette structure avec d’autres parties du corps et répondras à des questions sur les symptômes.|嗓子 bedeutet „Hals“, und 有点儿疼 heißt, dass es ein bisschen wehtut. Du übst das Muster mit anderen Körperteilen und beantwortest Fragen zu Beschwerden.|嗓子 significa «gola» e 有点儿疼 indica che fa un po’ male. Ti eserciterai a usare la stessa struttura con altre parti del corpo e a rispondere a domande sui sintomi.|嗓子 significa «garganta» e 有点儿疼 indica que dói um pouco. Vais praticar a mesma estrutura com outras partes do corpo e responder a perguntas sobre sintomas.'),
  },
};

export function defaultLessonTab(lesson) {
  return Number(lesson) === 6 || Object.hasOwn(lessonIntroductions, lesson) ? 'intro' : 'study';
}

const worked = (hanzi, pinyin, meaning) => [hanzi, pinyin, text(meaning)];

export const lessonActivities = {
  1: {
    title: text('Un encuentro después de clase|Running into a classmate|Une rencontre après le cours|Eine Begegnung nach dem Unterricht|Un incontro dopo lezione|Um encontro depois da aula'),
    intro: text('Saluda, pregunta cómo le va a tu compañero y prepara tu respuesta.|Say hello, ask how your classmate is doing, and prepare your reply.|Salue ton camarade, demande-lui comment il va et prépare ta réponse.|Grüße jemanden aus dem Kurs, frage nach dem Befinden und formuliere deine Antwort.|Saluta chi incontri a lezione, chiedi come sta e prepara la tua risposta.|Cumprimenta alguém da turma, pergunta como está e prepara a tua resposta.'),
    start: text('Empezar la conversación|Start the conversation|Commencer la conversation|Gespräch beginnen|Inizia la conversazione|Começar a conversa'),
  },
  2: {
    title: text('Conoce a alguien de tu clase|Meet someone in your class|Fais connaissance en classe|Jemanden im Kurs kennenlernen|Conosci qualcuno a lezione|Conhece alguém da tua turma'),
    intro: text('Preséntate, pregunta de dónde es la otra persona y di qué tenéis en común.|Introduce yourself, ask where the other person is from, and say what you have in common.|Présente-toi, demande d’où vient l’autre personne et dis ce que vous avez en commun.|Stell dich vor, frage nach der Herkunft und sage, was ihr gemeinsam habt.|Presentati, chiedi di dove viene l’altra persona e di’ che cosa avete in comune.|Apresenta-te, pergunta de onde é a outra pessoa e diz o que têm em comum.'),
    start: text('Preparar mi presentación|Prepare my introduction|Préparer ma présentation|Meine Vorstellung vorbereiten|Prepara la mia presentazione|Preparar a minha apresentação'),
  },
  3: {
    title: text('Una foto de familia|A family photo|Une photo de famille|Ein Familienfoto|Una foto di famiglia|Uma fotografia de família'),
    intro: text('Imagina que enseñas una foto de familia. Di cuántos sois y si tienes hermanos o hermanas.|Imagine showing a family photo. Say how many people are in your family and whether you have siblings.|Imagine que tu montres une photo de famille. Dis combien vous êtes et si tu as des frères ou sœurs.|Stell dir vor, du zeigst ein Familienfoto. Sage, wie viele Personen zu deiner Familie gehören und ob du Geschwister hast.|Immagina di mostrare una foto di famiglia. Di’ in quanti siete e se hai fratelli o sorelle.|Imagina que mostras uma fotografia de família. Diz quantas pessoas são e se tens irmãos ou irmãs.'),
    start: text('Hablar de mi familia|Talk about my family|Parler de ma famille|Über meine Familie sprechen|Parla della mia famiglia|Falar da minha família'),
  },
  4: {
    title: text('Busca un hueco en la agenda|Find a time in your schedule|Trouve un créneau dans ton agenda|Einen Termin finden|Trova un momento libero|Encontra uma hora livre'),
    intro: text('Lee la hora, ordena las referencias de tiempo y explica cuándo tienes clase.|Read the time, put the time expressions in order, and say when you have class.|Lis l’heure, mets les repères temporels dans l’ordre et dis quand tu as cours.|Lies die Uhrzeit, ordne die Zeitangaben und sage, wann du Unterricht hast.|Leggi l’ora, ordina le indicazioni di tempo e di’ quando hai lezione.|Lê as horas, ordena as referências de tempo e diz quando tens aulas.'),
    start: text('Preparar el horario|Work out the schedule|Préparer l’emploi du temps|Zeitplan erstellen|Prepara l’orario|Preparar o horário'),
  },
  5: {
    title: text('Prepara un cumpleaños|Plan a birthday|Prépare un anniversaire|Einen Geburtstag vorbereiten|Prepara un compleanno|Prepara um aniversário'),
    intro: text('Confirma la fecha, pregunta la edad y escribe una felicitación.|Confirm the date, ask the person’s age, and write a birthday greeting.|Confirme la date, demande l’âge et écris un message d’anniversaire.|Bestätige das Datum, frage nach dem Alter und schreibe einen Geburtstagsgruß.|Conferma la data, chiedi l’età e scrivi un augurio.|Confirma a data, pergunta a idade e escreve uma mensagem de parabéns.'),
    start: text('Preparar la felicitación|Prepare the birthday greeting|Préparer le message d’anniversaire|Geburtstagsgruß vorbereiten|Prepara gli auguri|Preparar os parabéns'),
  },
  6: {
    title: text('Un paseo por el barrio|A walk around the neighborhood|Une promenade dans le quartier|Ein Spaziergang durchs Viertel|Un giro nel quartiere|Um passeio pelo bairro'),
    start: text('Empezar con un plano|Start with a map|Commencer avec un plan|Mit einem Plan beginnen|Inizia con una mappa|Começar com um mapa'),
  },
  7: {
    title: text('Una compra en la tienda de ropa|Shopping for clothes|Un achat en boutique|Im Bekleidungsgeschäft|Un acquisto in un negozio di abbigliamento|Uma compra na loja de roupa'),
    intro: text('Pregunta el precio, di qué prenda quieres y pide probártela antes de comprar.|Ask the price, say which garment you want, and ask to try it on before buying.|Demande le prix, indique le vêtement que tu veux et demande à l’essayer avant d’acheter.|Frage nach dem Preis, nenne das Kleidungsstück und bitte darum, es vor dem Kauf anzuprobieren.|Chiedi il prezzo, indica il capo che vuoi e chiedi di provarlo prima di comprarlo.|Pergunta o preço, indica a peça que queres e pede para a experimentar antes de comprar.'),
    start: text('Entrar en la tienda|Enter the shop|Entrer dans la boutique|Den Laden betreten|Entra in negozio|Entrar na loja'),
  },
  8: {
    title: text('Una conversación en la consulta|A conversation at the clinic|Un échange en consultation|Ein Gespräch in der Sprechstunde|Una conversazione durante la visita|Uma conversa na consulta'),
    intro: text('Pregunta dónde duele, distingue las opciones y explica si el dolor es leve.|Ask where it hurts, tell the options apart, and explain if the pain is mild.|Demande où ça fait mal, distingue les options et précise si la douleur est légère.|Frage, wo es wehtut, unterscheide die Möglichkeiten und sage, ob der Schmerz leicht ist.|Chiedi dove fa male, distingui le opzioni e spiega se il dolore è lieve.|Pergunta onde dói, distingue as opções e explica se a dor é ligeira.'),
    start: text('Practicar la consulta|Practice the consultation|S’entraîner à la consultation|Das Gespräch üben|Esercitati con la visita|Praticar a consulta'),
  },
};

export const introductionWorkshops = {
  1: {
    examples: [
      worked('你好吗？', 'Nǐ hǎo ma?', '¿Estás bien?|Are you well?|Tu vas bien ?|Geht es dir gut?|Stai bene?|Estás bem?'),
      worked('我很好。', 'Wǒ hěn hǎo.', 'Estoy bien.|I’m well.|Je vais bien.|Mir geht es gut.|Sto bene.|Estou bem.'),
      worked('你最近怎么样？', 'Nǐ zuìjìn zěnmeyàng?', '¿Qué tal últimamente?|How have you been lately?|Comment vas-tu ces derniers temps ?|Wie geht es dir in letzter Zeit?|Come stai ultimamente?|Como tens estado ultimamente?'),
    ],
  },
  2: {
    examples: [
      introductionExamples[2],
      worked('你是哪国人？', 'Nǐ shì nǎ guó rén?', '¿De qué país eres?|What country are you from?|De quel pays viens-tu ?|Aus welchem Land kommst du?|Di che paese sei?|De que país és?'),
      worked('我也是学生。', 'Wǒ yě shì xuésheng.', 'Yo también soy estudiante.|I’m a student too.|Moi aussi, je suis élève.|Ich gehe auch zur Schule.|Anch’io sono studente.|Também sou estudante.'),
    ],
  },
  3: {
    examples: [
      introductionExamples[3],
      worked('我没有弟弟。', 'Wǒ méiyǒu dìdi.', 'No tengo hermano menor.|I don’t have a younger brother.|Je n’ai pas de petit frère.|Ich habe keinen jüngeren Bruder.|Non ho un fratello minore.|Não tenho irmão mais novo.'),
      worked('三个学生', 'sān ge xuésheng', 'Tres estudiantes.|Three students.|Trois élèves.|Drei Schüler.|Tre studenti.|Três estudantes.'),
    ],
  },
  4: {
    examples: [
      worked('三点半', 'sān diǎn bàn', 'Las tres y media.|Half past three.|Trois heures et demie.|Halb vier.|Le tre e mezza.|Três e meia.'),
      introductionExamples[4],
      worked('我明天没有课。', 'Wǒ míngtiān méiyǒu kè.', 'Mañana no tengo clase.|I don’t have class tomorrow.|Je n’ai pas cours demain.|Ich habe morgen keinen Unterricht.|Domani non ho lezione.|Amanhã não tenho aula.'),
    ],
  },
  5: {
    examples: [
      introductionExamples[5],
      worked('我今年二十岁。', 'Wǒ jīnnián èrshí suì.', 'Este año tengo veinte años.|I’m twenty this year.|J’ai vingt ans cette année.|Ich bin dieses Jahr zwanzig.|Quest’anno ho vent’anni.|Este ano tenho vinte anos.'),
      worked('祝你生日快乐！', 'Zhù nǐ shēngrì kuàilè!', '¡Feliz cumpleaños!|Happy birthday!|Joyeux anniversaire !|Alles Gute zum Geburtstag!|Buon compleanno!|Parabéns!'),
    ],
  },
  7: {
    examples: [
      introductionExamples[7],
      worked('我想买一条裤子。', 'Wǒ xiǎng mǎi yì tiáo kùzi.', 'Quiero comprar un pantalón.|I want to buy a pair of pants.|Je veux acheter un pantalon.|Ich möchte eine Hose kaufen.|Vorrei comprare un paio di pantaloni.|Quero comprar umas calças.'),
      worked('我可以试试吗？', 'Wǒ kěyǐ shìshi ma?', '¿Puedo probármelo?|Can I try it on?|Puis-je l’essayer ?|Kann ich es anprobieren?|Posso provarlo?|Posso experimentá-lo?'),
    ],
  },
  8: {
    examples: [
      worked('你哪儿疼？', 'Nǐ nǎr téng?', '¿Dónde te duele?|Where does it hurt?|Où as-tu mal ?|Wo tut es weh?|Dove ti fa male?|Onde te dói?'),
      introductionExamples[8],
      worked('我喝一点儿水。', 'Wǒ hē yìdiǎnr shuǐ.', 'Bebo un poco de agua.|I drink a little water.|Je bois un peu d’eau.|Ich trinke ein bisschen Wasser.|Bevo un po’ d’acqua.|Bebo um pouco de água.'),
    ],
  },
};
