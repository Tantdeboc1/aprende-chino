const languages = ['es', 'en', 'fr', 'de', 'it', 'pt'];
const tr = (line) => Object.fromEntries(line.split('|').map((value, i) => [languages[i], value]));
const choice = (prompt, options, answer, extra = {}) => ({ prompt: tr(prompt), options, answer, ...extra });
const order = (prompt, tokens, answers) => ({ prompt: tr(prompt), tokens, answers });

export const practiceLabels = {
  title: tr('Practica lo aprendido|Practice what you learned|Mets tes acquis en pratique|Übe das Gelernte|Metti in pratica ciò che hai imparato|Pratica o que aprendeste'),
  start: tr('Empezar|Start|Commencer|Starten|Inizia|Começar'),
  next: tr('Continuar|Continue|Continuer|Weiter|Continua|Continuar'),
  retry: tr('Volver a practicar|Practice again|Réessayer|Erneut üben|Riprova|Praticar de novo'),
  check: tr('Comprobar|Check|Vérifier|Prüfen|Verifica|Verificar'),
  undo: tr('Deshacer|Undo|Annuler|Rückgängig|Annulla|Desfazer'),
  correct: tr('¡Correcto!|Correct!|Bravo !|Richtig!|Esatto!|Correto!'),
  answer: tr('Respuesta correcta|Correct answer|Bonne réponse|Richtige Antwort|Risposta corretta|Resposta correta'),
  listen: tr('Reproducir audio|Play audio|Écouter|Audio abspielen|Ascolta|Ouvir'),
  transcript: tr('Ver transcripción|Show transcript|Voir la transcription|Transkript anzeigen|Mostra la trascrizione|Ver transcrição'),
  result: tr('Respuestas correctas|Correct answers|Bonnes réponses|Richtige Antworten|Risposte corrette|Respostas corretas'),
  north: tr('Norte|North|Nord|Norden|Nord|Norte'),
};

export const topicPractice = {
  1: [
    choice('Escucha. ¿Qué quiere saber la persona?|Listen. What does the speaker want to know?|Écoute. Que veut savoir la personne ?|Hör zu. Was möchte die Person wissen?|Ascolta. Che cosa vuole sapere la persona?|Ouve. O que é que a pessoa quer saber?', [
      tr('Cómo estás|How you are|Comment tu vas|Wie es dir geht|Come stai|Como estás'),
      tr('Cómo te llamas|Your name|Comment tu t’appelles|Wie du heißt|Come ti chiami|Como te chamas'),
      tr('De dónde eres|Where you are from|D’où tu viens|Woher du kommst|Da dove vieni|De onde és'),
    ], 0, { audio: '你好吗？', audioPinyin: 'Nǐ hǎo ma?' }),
    order('Ordena las palabras para preguntar cómo está alguien.|Put the words in order to ask how someone is.|Remets les mots dans l’ordre pour demander à quelqu’un comment il va.|Ordne die Wörter, um zu fragen, wie es jemandem geht.|Riordina le parole per chiedere a qualcuno come sta.|Ordena as palavras para perguntar a alguém como está.', ['吗', '你', '好'], [[1, 2, 0]]),
    choice('Te preguntan 你好吗？ Di que estás bien.|Someone asks 你好吗？ Say you are well.|On te demande 你好吗？ Dis que tu vas bien.|Jemand fragt 你好吗？ Sag, dass es dir gut geht.|Ti chiedono 你好吗？ Di’ che stai bene.|Perguntam-te 你好吗？ Diz que estás bem.', ['你好吗？', '我很好。', '谢谢。'], 1),
  ],
  2: [
    choice('Lee la presentación y elige el nombre y el país.|Read the introduction and pick the name and country.|Lis la présentation et choisis le prénom et le pays.|Lies die Vorstellung und wähle den Namen und das Land.|Leggi la presentazione e scegli il nome e il paese.|Lê a apresentação e escolhe o nome e o país.', [
      tr('Ana, China|Ana, China|Ana, Chine|Ana, China|Ana, Cina|Ana, China'),
      tr('Ana, España|Ana, Spain|Ana, Espagne|Ana, Spanien|Ana, Spagna|Ana, Espanha'),
      tr('Li, España|Li, Spain|Li, Espagne|Li, Spanien|Li, Spagna|Li, Espanha'),
    ], 1, {
      text: '我叫安娜。\n我是西班牙人。',
      pinyin: 'Wǒ jiào Ānnà.\nWǒ shì Xībānyárén.',
      hint: '安娜 (Ānnà) = Ana · 李 (Lǐ) = Li',
      rule: tr('我叫 introduce el nombre, y 我是 introduce aquí la nacionalidad.|我叫 gives the name, and 我是 gives the nationality here.|我叫 introduit le prénom, et 我是 indique ici la nationalité.|我叫 leitet den Namen ein, und 我是 gibt hier die Nationalität an.|我叫 introduce il nome, e 我是 indica qui la nazionalità.|我叫 introduz o nome, e 我是 indica aqui a nacionalidade.'),
    }),
    choice('Completa para decir «Me llamo Ana».|Complete the sentence to say “My name is Ana.”|Complète la phrase pour dire « Je m’appelle Ana ».|Ergänze den Satz: „Ich heiße Ana.“|Completa la frase per dire «Mi chiamo Ana».|Completa a frase para dizer «Chamo-me Ana».', ['叫', '是'], 0, { text: '我___安娜。', rule: tr('叫 indica cómo te llamas.|Use 叫 to give your name.|叫 sert à dire comment tu t’appelles.|Mit 叫 nennst du deinen Namen.|叫 si usa per dire come ti chiami.|叫 usa-se para dizer como te chamas.') }),
    choice('Eres de España. Responde a la pregunta.|You are from Spain. Answer the question.|Tu viens d’Espagne. Réponds à la question.|Du kommst aus Spanien. Antworte auf die Frage.|Vieni dalla Spagna. Rispondi alla domanda.|És de Espanha. Responde à pergunta.', ['我是中国人。', '我不是西班牙人。', '我不是中国人，我是西班牙人。'], 2, { text: '你是中国人吗？', pinyin: 'Nǐ shì Zhōngguórén ma?' }),
  ],
  3: [
    choice('Escucha. ¿Cuántas personas hay en su familia?|Listen. How many people are in the speaker’s family?|Écoute. Combien de personnes y a-t-il dans sa famille ?|Hör zu. Wie viele Personen sind in der Familie?|Ascolta. Quante persone ci sono nella sua famiglia?|Ouve. Quantas pessoas há na sua família?', ['3', '4', '5'], 1, { audio: '我家有四口人。', audioPinyin: 'Wǒ jiā yǒu sì kǒu rén.' }),
    choice('Completa para decir que en tu familia hay dos personas.|Complete the sentence to say there are two people in your family.|Complète la phrase pour dire qu’il y a deux personnes dans ta famille.|Ergänze den Satz: In deiner Familie sind zwei Personen.|Completa la frase per dire che in famiglia siete in due.|Completa a frase para dizer que há duas pessoas na tua família.', ['二', '两'], 1, { text: '我家有___口人。', rule: tr('Usa 两 delante del clasificador 口.|Use 两 before the classifier 口.|On emploie 两 devant le classificateur 口.|Vor dem Zählwort 口 steht 两.|Usa 两 prima del classificatore 口.|Usa 两 antes do classificador 口.') }),
    choice('Pregunta cuántas personas hay en su familia.|Ask how many people are in the other person’s family.|Demande combien de personnes il y a dans sa famille.|Frage, wie viele Personen in der Familie sind.|Chiedi quante persone ci sono nella sua famiglia.|Pergunta quantas pessoas há na família da outra pessoa.', ['你家有几口人？', '你家有四口人吗？', '你家有四口人。'], 0),
  ],
  4: [
    choice('Escucha y elige la hora.|Listen and pick the time.|Écoute et choisis l’heure.|Hör zu und wähle die Uhrzeit.|Ascolta e scegli l’ora.|Ouve e escolhe a hora.', ['03:00', '15:30', '15:00'], 2, { audio: '下午三点', audioPinyin: 'Xiàwǔ sān diǎn' }),
    order('Ordena las palabras para decir que mañana vas a la escuela a las ocho.|Order the words to say you are going to school tomorrow at eight.|Remets les mots dans l’ordre pour dire que tu vas à l’école demain à huit heures.|Ordne die Wörter: Du gehst morgen um acht zur Schule.|Riordina le parole per dire che domani vai a scuola alle otto.|Ordena as palavras para dizer que amanhã vais à escola às oito.', ['去学校', '我', '明天', '八点'], [[1, 2, 3, 0], [2, 3, 1, 0], [2, 1, 3, 0]]),
    choice('Tu agenda marca mañana a las 08:00. Responde.|Your schedule says tomorrow at 08:00. Answer the question.|Ton agenda indique demain à 8 h. Réponds.|In deinem Kalender steht morgen um 08:00 Uhr. Antworte.|La tua agenda indica domani alle 08:00. Rispondi.|A tua agenda indica amanhã às 08:00. Responde.', ['我今天八点去学校。', '我明天八点去学校。', '我明天九点去学校。'], 1, { text: '你明天几点去学校？', pinyin: 'Nǐ míngtiān jǐ diǎn qù xuéxiào?' }),
  ],
  5: [
    choice('Lee y elige la fecha del cumpleaños (día/mes).|Read and pick the birthday (day/month).|Lis et choisis la date d’anniversaire (jour/mois).|Lies und wähle das Geburtsdatum (Tag/Monat).|Leggi e scegli la data del compleanno (giorno/mese).|Lê e escolhe a data do aniversário (dia/mês).', ['05/10', '10/05', '15/05'], 1, { text: '我的生日是五月十日。', pinyin: 'Wǒ de shēngrì shì wǔ yuè shí rì.' }),
    order('Escribe el 10 de mayo de 2026 en el orden chino.|Put May 10, 2026 in Chinese date order.|Écris le 10 mai 2026 dans l’ordre chinois.|Bringe den 10. Mai 2026 in die chinesische Datumsreihenfolge.|Scrivi il 10 maggio 2026 nell’ordine cinese.|Escreve 10 de maio de 2026 pela ordem chinesa.', ['十日', '五月', '二〇二六年'], [[2, 1, 0]]),
    choice('Tu amiga cumple años. Felicítala.|It is your friend’s birthday. Wish her a happy birthday.|C’est l’anniversaire de ton amie. Souhaite-lui un bon anniversaire.|Deine Freundin hat Geburtstag. Gratuliere ihr.|È il compleanno della tua amica. Falle gli auguri.|É o aniversário da tua amiga. Dá-lhe os parabéns.', ['祝你生日快乐！', '你的生日是几月几日？', '你多大？'], 0),
  ],
  6: [
    choice('Escucha y elige la casilla donde va el hospital. La escuela está en el centro.|Listen and pick the square for the hospital. The school is in the center.|Écoute et choisis la case de l’hôpital. L’école est au centre.|Hör zu und wähle das Feld für das Krankenhaus. Die Schule ist in der Mitte.|Ascolta e scegli la casella dell’ospedale. La scuola è al centro.|Ouve e escolhe a casa do hospital. A escola está no centro.', [
      tr('Norte|North|Nord|Norden|Nord|Norte'), tr('Oeste|West|Ouest|Westen|Ovest|Oeste'),
      tr('Este|East|Est|Osten|Est|Este'), tr('Sur|South|Sud|Süden|Sud|Sul'),
    ], 2, { audio: '医院在学校东边。', audioPinyin: 'Yīyuàn zài xuéxiào dōngbiān.', map: true }),
    choice('Completa para decir que el hospital está al este de la escuela.|Complete the sentence to say the hospital is east of the school.|Complète la phrase pour dire que l’hôpital est à l’est de l’école.|Ergänze den Satz: Das Krankenhaus liegt östlich der Schule.|Completa la frase per dire che l’ospedale è a est della scuola.|Completa a frase para dizer que o hospital fica a leste da escola.', ['跟', '在'], 1, { text: '医院___学校东边。' }),
    choice('¿Qué edificio sirve de punto de referencia?|Which building is the reference point?|Quel bâtiment sert de point de repère ?|Welches Gebäude ist der Bezugspunkt?|Quale edificio è il punto di riferimento?|Qual é o edifício que serve de referência?', ['医院', '学校'], 1, { text: '医院在学校东边。', pinyin: 'Yīyuàn zài xuéxiào dōngbiān.', rule: tr('学校东边 significa «al este de la escuela».|学校东边 means “east of the school.”|学校东边 signifie « à l’est de l’école ».|学校东边 bedeutet „östlich der Schule“.|学校东边 significa «a est della scuola».|学校东边 significa «a leste da escola».') }),
  ],
  7: [
    choice('Escucha y elige el precio en yuanes.|Listen and pick the price in yuan.|Écoute et choisis le prix en yuans.|Hör zu und wähle den Preis in Yuan.|Ascolta e scegli il prezzo in yuan.|Ouve e escolhe o preço em yuan.', ['18 ¥', '80 ¥', '88 ¥'], 1, { audio: '这件衣服八十块。', audioPinyin: 'Zhè jiàn yīfu bāshí kuài.' }),
    choice('Elige el clasificador para un par de pantalones.|Pick the classifier for a pair of pants.|Choisis le classificateur pour un pantalon.|Wähle das Zählwort für eine Hose.|Scegli il classificatore per un paio di pantaloni.|Escolhe o classificador para um par de calças.', ['件', '条', '斤'], 1, { text: '我想买一___裤子。', rule: tr('条 se usa con 裤子.|Use 条 with 裤子.|On emploie 条 avec 裤子.|Für 裤子 verwendet man 条.|Con 裤子 si usa 条.|Usa-se 条 com 裤子.') }),
    choice('Elige cómo preguntar el precio y luego decir que te los llevas.|Pick what to say to ask the price and then buy the pants.|Choisis quoi dire pour demander le prix puis acheter le pantalon.|Wähle, wie du nach dem Preis fragst und die Hose dann kaufst.|Scegli come chiedere il prezzo e poi dire che compri i pantaloni.|Escolhe como perguntar o preço e depois dizer que levas as calças.', ['这条裤子多少钱？ / 我买这条。', '我买这条。 / 这条裤子多少钱？', '这条裤子多少钱？ / 我不买。'], 0),
  ],
  8: [
    choice('Escucha y elige los dos síntomas que menciona el médico.|Listen and pick the two symptoms the doctor mentions.|Écoute et choisis les deux symptômes mentionnés par le médecin.|Hör zu und wähle die zwei Symptome, die der Arzt nennt.|Ascolta e scegli i due sintomi citati dal medico.|Ouve e escolhe os dois sintomas que o médico menciona.', [
      tr('Dolor de cabeza y fiebre|Headache and fever|Mal de tête et fièvre|Kopfschmerzen und Fieber|Mal di testa e febbre|Dor de cabeça e febre'),
      tr('Dolor de barriga y fiebre|Stomachache and fever|Mal de ventre et fièvre|Bauchschmerzen und Fieber|Mal di pancia e febbre|Dor de barriga e febre'),
      tr('Dolor de cabeza y de barriga|Headache and stomachache|Mal de tête et de ventre|Kopf- und Bauchschmerzen|Mal di testa e di pancia|Dor de cabeça e de barriga'),
    ], 2, { audio: '你头疼还是肚子疼？', audioPinyin: 'Nǐ tóuténg háishi dùzi téng?' }),
    choice('Completa para decir que te duele un poco la cabeza.|Complete the sentence to say you have a slight headache.|Complète la phrase pour dire que tu as un peu mal à la tête.|Ergänze den Satz: Du hast ein bisschen Kopfschmerzen.|Completa la frase per dire che hai un leggero mal di testa.|Completa a frase para dizer que te dói um pouco a cabeça.', ['一点儿', '有点儿'], 1, { text: '我___头疼。', rule: tr('有点儿 va antes de 头疼 en esta frase.|有点儿 goes before 头疼 in this sentence.|Ici, 有点儿 se place devant 头疼.|Hier steht 有点儿 vor 头疼.|Qui 有点儿 precede 头疼.|Nesta frase, 有点儿 vem antes de 头疼.') }),
    choice('El médico pregunta. Responde que te duele un poco la cabeza.|The doctor asks. Say you have a slight headache.|Le médecin pose la question. Dis que tu as un peu mal à la tête.|Der Arzt fragt. Sag, dass du ein bisschen Kopfschmerzen hast.|Il medico ti fa una domanda. Di’ che hai un leggero mal di testa.|O médico faz a pergunta. Diz que te dói um pouco a cabeça.', ['我有点儿头疼。', '我有点儿肚子疼。', '我不头疼。'], 0, { text: '你头疼还是肚子疼？', pinyin: 'Nǐ tóuténg háishi dùzi téng?' }),
  ],
};
