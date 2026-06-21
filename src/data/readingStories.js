// src/data/readingStories.js
// Historias de comprensión lectora — 2 por tema (temas 1-8)
// Vocabulario: exclusivamente de vocabulario_chino_temas1-4.pdf y
// vocabulario_chino_temas5-8.pdf. Solo se añade vocabulario HSK1 básico
// de estructura (的, 了, 是, 在, 有, 也, 都, 很, 不, 和, 吗, 呢, 吧)
// cuando es estrictamente necesario para que la frase tenga sentido.
// Personajes: 东奥, 晓敏, 马可
//
// Campos en lenguaje natural (tituloTr, traduccion, pregunta y opciones que
// no son hanzi) son objetos { es, en, it, fr, de, pt }. Las opciones en hanzi
// se dejan como string porque son neutras al idioma. Usa `loc()` para resolver
// el valor según el idioma activo.

// Resuelve un campo que puede ser un string neutro (p. ej. hanzi) o un objeto
// { es, en, it, fr, de, pt }. Cae a inglés y luego a español si falta el idioma.
export function loc(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.en || value.es || Object.values(value)[0] || '';
}

// Opciones reutilizadas
const SI = { es: 'Sí', en: 'Yes', it: 'Sì', fr: 'Oui', de: 'Ja', pt: 'Sim' };
const NO = { es: 'No', en: 'No', it: 'No', fr: 'Non', de: 'Nein', pt: 'Não' };

export const READING_STORIES = [

  // ─── TEMA 1 ────────────────────────────────────────────────────────────────
  {
    id: 'rc-t1-1',
    tema: 1,
    titulo: '初次见面',
    tituloTr: { es: 'Primer encuentro', en: 'First meeting', it: 'Primo incontro', fr: 'Première rencontre', de: 'Erstes Treffen', pt: 'Primeiro encontro' },
    hanzi: '他叫东奥。她叫晓敏。他们认识了。东奥很高兴，晓敏也很高兴。',
    pinyin: 'Tā jiào Dōng Ào. Tā jiào Xiǎo Mǐn. Tāmen rènshi le. Dōng Ào hěn gāoxìng, Xiǎo Mǐn yě hěn gāoxìng.',
    traduccion: {
      es: 'Él se llama Dōng Ào. Ella se llama Xiǎo Mǐn. Se conocieron. Dōng Ào está muy contento, Xiǎo Mǐn también está muy contenta.',
      en: 'His name is Dōng Ào. Her name is Xiǎo Mǐn. They met. Dōng Ào is very happy, and Xiǎo Mǐn is very happy too.',
      it: 'Lui si chiama Dōng Ào. Lei si chiama Xiǎo Mǐn. Si sono conosciuti. Dōng Ào è molto contento, e anche Xiǎo Mǐn è molto contenta.',
      fr: "Il s'appelle Dōng Ào. Elle s'appelle Xiǎo Mǐn. Ils ont fait connaissance. Dōng Ào est très content, et Xiǎo Mǐn est très contente aussi.",
      de: 'Er heißt Dōng Ào. Sie heißt Xiǎo Mǐn. Sie haben sich kennengelernt. Dōng Ào ist sehr froh, und Xiǎo Mǐn ist auch sehr froh.',
      pt: 'Ele chama-se Dōng Ào. Ela chama-se Xiǎo Mǐn. Conheceram-se. Dōng Ào está muito contente, e Xiǎo Mǐn também está muito contente.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Cómo se llama el chico?', en: "What is the boy's name?", it: 'Come si chiama il ragazzo?', fr: "Comment s'appelle le garçon ?", de: 'Wie heißt der Junge?', pt: 'Como se chama o rapaz?' },
        opciones: ['东奥', '晓敏', '马可', '宋华'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Cómo está Dōng Ào después de conocer a Xiǎo Mǐn?', en: 'How does Dōng Ào feel after meeting Xiǎo Mǐn?', it: 'Come si sente Dōng Ào dopo aver conosciuto Xiǎo Mǐn?', fr: 'Comment se sent Dōng Ào après avoir rencontré Xiǎo Mǐn ?', de: 'Wie fühlt sich Dōng Ào, nachdem er Xiǎo Mǐn kennengelernt hat?', pt: 'Como se sente Dōng Ào depois de conhecer Xiǎo Mǐn?' },
        opciones: ['很高兴', '很忙', '很累', '太忙'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿晓敏 también está contenta?', en: 'Is 晓敏 happy too?', it: 'Anche 晓敏 è contenta?', fr: '晓敏 est-elle contente aussi ?', de: 'Ist 晓敏 auch froh?', pt: '晓敏 também está contente?' },
        opciones: [
          SI,
          NO,
          { es: 'No se sabe', en: "It's not said", it: 'Non si sa', fr: 'On ne sait pas', de: 'Man weiß es nicht', pt: 'Não se sabe' },
          { es: 'Está cansada', en: 'She is tired', it: 'È stanca', fr: 'Elle est fatiguée', de: 'Sie ist müde', pt: 'Está cansada' },
        ],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: '东奥 es un chico.', en: '东奥 is a boy.', it: '东奥 è un ragazzo.', fr: '东奥 est un garçon.', de: '东奥 ist ein Junge.', pt: '东奥 é um rapaz.' }, correcta: true },
      { afirmacion: { es: '晓敏 está triste.', en: '晓敏 is sad.', it: '晓敏 è triste.', fr: '晓敏 est triste.', de: '晓敏 ist traurig.', pt: '晓敏 está triste.' }, correcta: false },
      { afirmacion: { es: '东奥 y 晓敏 se conocen.', en: '东奥 and 晓敏 know each other.', it: '东奥 e 晓敏 si conoscono.', fr: '东奥 et 晓敏 se connaissent.', de: '东奥 und 晓敏 kennen sich.', pt: '东奥 e 晓敏 conhecem-se.' }, correcta: true },
    ],
    cloze: [
      { texto: '他叫＿＿。', opciones: ['东奥', '晓敏', '马可', '老师'], correcta: 0 },
      { texto: '她叫＿＿。', opciones: ['晓敏', '东奥', '马可', '贝贝'], correcta: 0 },
      { texto: '东奥很＿＿。', opciones: ['高兴', '忙', '累', '饿'], correcta: 0 },
    ],
  },

  {
    id: 'rc-t1-2',
    tema: 1,
    titulo: '你好，请问',
    tituloTr: { es: '¡Hola! Perdona...', en: 'Hello! Excuse me...', it: 'Ciao! Scusa...', fr: 'Bonjour ! Excuse-moi...', de: 'Hallo! Entschuldige...', pt: 'Olá! Desculpa...' },
    hanzi: '马可请问：你叫什么名字？东奥说：我叫东奥，你呢？马可说：我叫马可。认识你很高兴！东奥也很高兴。',
    pinyin: 'Mǎ Kě qǐngwèn: nǐ jiào shénme míngzi? Dōng Ào shuō: wǒ jiào Dōng Ào, nǐ ne? Mǎ Kě shuō: wǒ jiào Mǎ Kě. Rènshi nǐ hěn gāoxìng! Dōng Ào yě hěn gāoxìng.',
    traduccion: {
      es: 'Mǎ Kě pregunta: ¿Cómo te llamas? Dōng Ào dice: Me llamo Dōng Ào, ¿y tú? Mǎ Kě dice: Me llamo Mǎ Kě. ¡Encantado de conocerte! Dōng Ào también está muy contento.',
      en: 'Mǎ Kě asks: What is your name? Dōng Ào says: My name is Dōng Ào, and you? Mǎ Kě says: My name is Mǎ Kě. Nice to meet you! Dōng Ào is very happy too.',
      it: 'Mǎ Kě chiede: Come ti chiami? Dōng Ào dice: Mi chiamo Dōng Ào, e tu? Mǎ Kě dice: Mi chiamo Mǎ Kě. Piacere di conoscerti! Anche Dōng Ào è molto contento.',
      fr: "Mǎ Kě demande : Comment t'appelles-tu ? Dōng Ào dit : Je m'appelle Dōng Ào, et toi ? Mǎ Kě dit : Je m'appelle Mǎ Kě. Enchanté de te connaître ! Dōng Ào est très content lui aussi.",
      de: 'Mǎ Kě fragt: Wie heißt du? Dōng Ào sagt: Ich heiße Dōng Ào, und du? Mǎ Kě sagt: Ich heiße Mǎ Kě. Schön, dich kennenzulernen! Dōng Ào ist auch sehr froh.',
      pt: 'Mǎ Kě pergunta: Como te chamas? Dōng Ào diz: Chamo-me Dōng Ào, e tu? Mǎ Kě diz: Chamo-me Mǎ Kě. Prazer em conhecer-te! Dōng Ào também está muito contente.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Quién hace la pregunta primero?', en: 'Who asks the question first?', it: 'Chi fa la domanda per primo?', fr: 'Qui pose la question en premier ?', de: 'Wer stellt die Frage zuerst?', pt: 'Quem faz a pergunta primeiro?' },
        opciones: [
          '马可', '东奥', '晓敏',
          { es: 'Los dos a la vez', en: 'Both at the same time', it: 'Tutti e due insieme', fr: 'Les deux en même temps', de: 'Beide gleichzeitig', pt: 'Os dois ao mesmo tempo' },
        ],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Cómo se llama el estudiante italiano?', en: 'What is the Italian student called?', it: 'Come si chiama lo studente italiano?', fr: "Comment s'appelle l'étudiant italien ?", de: 'Wie heißt der italienische Student?', pt: 'Como se chama o estudante italiano?' },
        opciones: ['马可', '东奥', '晓敏', '宋华'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué dice 马可 al final?', en: 'What does 马可 say at the end?', it: 'Cosa dice 马可 alla fine?', fr: 'Que dit 马可 à la fin ?', de: 'Was sagt 马可 am Ende?', pt: 'O que diz 马可 no final?' },
        opciones: ['认识你很高兴', '再见', '你好', '谢谢'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: '马可 pregunta el nombre de 东奥.', en: '马可 asks 东奥 his name.', it: '马可 chiede il nome di 东奥.', fr: '马可 demande le nom de 东奥.', de: '马可 fragt 东奥 nach seinem Namen.', pt: '马可 pergunta o nome de 东奥.' }, correcta: true },
      { afirmacion: { es: 'El estudiante italiano se llama 东奥.', en: 'The Italian student is called 东奥.', it: 'Lo studente italiano si chiama 东奥.', fr: "L'étudiant italien s'appelle 东奥.", de: 'Der italienische Student heißt 东奥.', pt: 'O estudante italiano chama-se 东奥.' }, correcta: false },
      { afirmacion: { es: '东奥 está contento.', en: '东奥 is happy.', it: '东奥 è contento.', fr: '东奥 est content.', de: '东奥 ist froh.', pt: '东奥 está contente.' }, correcta: true },
    ],
    cloze: [
      { texto: '你叫什么＿＿？', opciones: ['名字', '高兴', '认识', '再见'], correcta: 0 },
      { texto: '马可说：我叫＿＿。', opciones: ['马可', '东奥', '晓敏', '老师'], correcta: 0 },
      { texto: '认识你很＿＿！', opciones: ['高兴', '忙', '累', '谢谢'], correcta: 0 },
    ],
  },

  // ─── TEMA 2 ────────────────────────────────────────────────────────────────
  {
    id: 'rc-t2-1',
    tema: 2,
    titulo: '早上好',
    tituloTr: { es: 'Buenos días', en: 'Good morning', it: 'Buongiorno', fr: 'Bonjour', de: 'Guten Morgen', pt: 'Bom dia' },
    hanzi: '早上，老师说：你们早上好！同学们说：老师早上好！晓敏是中国人。马可是哪国人？马可是美国人吗？不是，他是意大利人。',
    pinyin: 'Zǎoshang, lǎoshī shuō: nǐmen zǎoshang hǎo! Tóngxuémen shuō: lǎoshī zǎoshang hǎo! Xiǎo Mǐn shì Zhōngguórén. Mǎ Kě shì nǎ guó rén? Mǎ Kě shì Měiguórén ma? Bú shì, tā shì Yìdàlìrén.',
    traduccion: {
      es: 'Por la mañana, el profesor dice: ¡Buenos días a todos! Los compañeros dicen: ¡Buenos días, profesor! Xiǎo Mǐn es china. ¿De qué país es Mǎ Kě? ¿Es Mǎ Kě americano? No, él es italiano.',
      en: 'In the morning, the teacher says: Good morning, everyone! The classmates say: Good morning, teacher! Xiǎo Mǐn is Chinese. What country is Mǎ Kě from? Is Mǎ Kě American? No, he is Italian.',
      it: 'Di mattina, il professore dice: Buongiorno a tutti! I compagni dicono: Buongiorno, professore! Xiǎo Mǐn è cinese. Di che paese è Mǎ Kě? Mǎ Kě è americano? No, è italiano.',
      fr: 'Le matin, le professeur dit : Bonjour à tous ! Les camarades disent : Bonjour, professeur ! Xiǎo Mǐn est chinoise. De quel pays vient Mǎ Kě ? Mǎ Kě est-il américain ? Non, il est italien.',
      de: 'Am Morgen sagt der Lehrer: Guten Morgen, alle zusammen! Die Mitschüler sagen: Guten Morgen, Herr Lehrer! Xiǎo Mǐn ist Chinesin. Aus welchem Land kommt Mǎ Kě? Ist Mǎ Kě Amerikaner? Nein, er ist Italiener.',
      pt: 'De manhã, o professor diz: Bom dia a todos! Os colegas dizem: Bom dia, professor! Xiǎo Mǐn é chinesa. De que país é Mǎ Kě? Mǎ Kě é americano? Não, ele é italiano.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Quién dice "你们早上好"?', en: 'Who says "你们早上好"?', it: 'Chi dice "你们早上好"?', fr: 'Qui dit « 你们早上好 » ?', de: 'Wer sagt „你们早上好"?', pt: 'Quem diz "你们早上好"?' },
        opciones: ['老师', '晓敏', '马可', '东奥'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿De qué país es 晓敏?', en: 'What country is 晓敏 from?', it: 'Di che paese è 晓敏?', fr: 'De quel pays vient 晓敏 ?', de: 'Aus welchem Land kommt 晓敏?', pt: 'De que país é 晓敏?' },
        opciones: ['中国', '美国', '意大利', '英国'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Es 马可 americano?', en: 'Is 马可 American?', it: '马可 è americano?', fr: '马可 est-il américain ?', de: 'Ist 马可 Amerikaner?', pt: '马可 é americano?' },
        opciones: [
          { es: 'No, es italiano', en: 'No, he is Italian', it: 'No, è italiano', fr: 'Non, il est italien', de: 'Nein, er ist Italiener', pt: 'Não, é italiano' },
          SI,
          { es: 'No se dice', en: "It's not said", it: 'Non si dice', fr: "Ce n'est pas dit", de: 'Wird nicht gesagt', pt: 'Não se diz' },
          { es: 'Es chino', en: 'He is Chinese', it: 'È cinese', fr: 'Il est chinois', de: 'Er ist Chinese', pt: 'É chinês' },
        ],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: '晓敏 es china.', en: '晓敏 is Chinese.', it: '晓敏 è cinese.', fr: '晓敏 est chinoise.', de: '晓敏 ist Chinesin.', pt: '晓敏 é chinesa.' }, correcta: true },
      { afirmacion: { es: '马可 es americano.', en: '马可 is American.', it: '马可 è americano.', fr: '马可 est américain.', de: '马可 ist Amerikaner.', pt: '马可 é americano.' }, correcta: false },
      { afirmacion: { es: 'El profesor saluda por la mañana.', en: 'The teacher greets in the morning.', it: 'Il professore saluta di mattina.', fr: 'Le professeur salue le matin.', de: 'Der Lehrer grüßt am Morgen.', pt: 'O professor cumprimenta de manhã.' }, correcta: true },
    ],
    cloze: [
      { texto: '晓敏是＿＿人。', opciones: ['中国', '美国', '意大利', '英国'], correcta: 0 },
      { texto: '马可是＿＿人。', opciones: ['意大利', '美国', '中国', '英国'], correcta: 0 },
      { texto: '老师说：你们＿＿好！', opciones: ['早上', '晚上', '中午', '再见'], correcta: 0 },
    ],
  },

  {
    id: 'rc-t2-2',
    tema: 2,
    titulo: '吃饭',
    tituloTr: { es: 'A comer', en: "Let's eat", it: 'A tavola', fr: 'À table', de: 'Zum Essen', pt: 'A comer' },
    hanzi: '东奥喜欢吃饺子和包子。晓敏喜欢吃米饭。马可不喜欢吃饺子，他喜欢吃面条儿。他们都很高兴。',
    pinyin: 'Dōng Ào xǐhuan chī jiǎozi hé bāozi. Xiǎo Mǐn xǐhuan chī mǐfàn. Mǎ Kě bù xǐhuan chī jiǎozi, tā xǐhuan chī miàntiáor. Tāmen dōu hěn gāoxìng.',
    traduccion: {
      es: 'A Dōng Ào le gustan los jiaozi y los baozi. A Xiǎo Mǐn le gusta el arroz. A Mǎ Kě no le gustan los jiaozi, le gustan los tallarines. Todos están muy contentos.',
      en: 'Dōng Ào likes jiaozi and baozi. Xiǎo Mǐn likes rice. Mǎ Kě does not like jiaozi, he likes noodles. Everyone is very happy.',
      it: 'A Dōng Ào piacciono i jiaozi e i baozi. A Xiǎo Mǐn piace il riso. A Mǎ Kě non piacciono i jiaozi, gli piacciono i noodle. Sono tutti molto contenti.',
      fr: "Dōng Ào aime les jiaozi et les baozi. Xiǎo Mǐn aime le riz. Mǎ Kě n'aime pas les jiaozi, il aime les nouilles. Tout le monde est très content.",
      de: 'Dōng Ào mag Jiaozi und Baozi. Xiǎo Mǐn mag Reis. Mǎ Kě mag keine Jiaozi, er mag Nudeln. Alle sind sehr froh.',
      pt: 'O Dōng Ào gosta de jiaozi e baozi. A Xiǎo Mǐn gosta de arroz. O Mǎ Kě não gosta de jiaozi, gosta de noodles. Estão todos muito contentes.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Qué le gusta comer a 东奥?', en: 'What does 东奥 like to eat?', it: 'Cosa piace mangiare a 东奥?', fr: "Qu'est-ce que 东奥 aime manger ?", de: 'Was isst 东奥 gern?', pt: 'O que é que 东奥 gosta de comer?' },
        opciones: ['饺子和包子', '米饭', '面条儿', '点心'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿A quién no le gustan los 饺子?', en: 'Who does not like 饺子?', it: 'A chi non piacciono i 饺子?', fr: "Qui n'aime pas les 饺子 ?", de: 'Wer mag keine 饺子?', pt: 'Quem não gosta de 饺子?' },
        opciones: [
          '马可', '东奥', '晓敏',
          { es: 'Al profesor', en: 'The teacher', it: 'Al professore', fr: 'Au professeur', de: 'Der Lehrer', pt: 'Ao professor' },
        ],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Cómo están todos al final?', en: 'How is everyone at the end?', it: 'Come stanno tutti alla fine?', fr: 'Comment vont-ils tous à la fin ?', de: 'Wie geht es allen am Ende?', pt: 'Como estão todos no final?' },
        opciones: ['很高兴', '很忙', '很累', '很饿'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: 'A 东奥 le gustan los jiaozi.', en: '东奥 likes jiaozi.', it: 'A 东奥 piacciono i jiaozi.', fr: '东奥 aime les jiaozi.', de: '东奥 mag Jiaozi.', pt: 'O 东奥 gosta de jiaozi.' }, correcta: true },
      { afirmacion: { es: '晓敏 come tallarines.', en: '晓敏 eats noodles.', it: '晓敏 mangia i noodle.', fr: '晓敏 mange des nouilles.', de: '晓敏 isst Nudeln.', pt: 'A 晓敏 come noodles.' }, correcta: false },
      { afirmacion: { es: 'A 马可 no le gustan los jiaozi.', en: '马可 does not like jiaozi.', it: 'A 马可 non piacciono i jiaozi.', fr: "马可 n'aime pas les jiaozi.", de: '马可 mag keine Jiaozi.', pt: 'O 马可 não gosta de jiaozi.' }, correcta: true },
    ],
    cloze: [
      { texto: '东奥喜欢吃饺子和＿＿。', opciones: ['包子', '米饭', '面条儿', '点心'], correcta: 0 },
      { texto: '晓敏喜欢吃＿＿。', opciones: ['米饭', '饺子', '包子', '面条儿'], correcta: 0 },
      { texto: '马可喜欢吃＿＿。', opciones: ['面条儿', '饺子', '包子', '米饭'], correcta: 0 },
    ],
  },

  // ─── TEMA 3 ────────────────────────────────────────────────────────────────
  {
    id: 'rc-t3-1',
    tema: 3,
    titulo: '我家',
    tituloTr: { es: 'Mi familia', en: 'My family', it: 'La mia famiglia', fr: 'Ma famille', de: 'Meine Familie', pt: 'A minha família' },
    hanzi: '东奥家有五口人：爸爸、妈妈、哥哥、姐姐和东奥。晓敏家有三口人。马可没有哥哥，他有一个妹妹。',
    pinyin: 'Dōng Ào jiā yǒu wǔ kǒu rén: bàba, māma, gēge, jiějie hé Dōng Ào. Xiǎo Mǐn jiā yǒu sān kǒu rén. Mǎ Kě méiyǒu gēge, tā yǒu yī gè mèimei.',
    traduccion: {
      es: 'La familia de Dōng Ào tiene cinco personas: papá, mamá, hermano mayor, hermana mayor y Dōng Ào. La familia de Xiǎo Mǐn tiene tres personas. Mǎ Kě no tiene hermano mayor, tiene una hermana menor.',
      en: "Dōng Ào's family has five people: dad, mum, older brother, older sister and Dōng Ào. Xiǎo Mǐn's family has three people. Mǎ Kě does not have an older brother, he has a younger sister.",
      it: 'La famiglia di Dōng Ào ha cinque persone: papà, mamma, fratello maggiore, sorella maggiore e Dōng Ào. La famiglia di Xiǎo Mǐn ha tre persone. Mǎ Kě non ha un fratello maggiore, ha una sorella minore.',
      fr: "La famille de Dōng Ào compte cinq personnes : papa, maman, le grand frère, la grande sœur et Dōng Ào. La famille de Xiǎo Mǐn compte trois personnes. Mǎ Kě n'a pas de grand frère, il a une petite sœur.",
      de: 'Dōng Àos Familie hat fünf Personen: Papa, Mama, älterer Bruder, ältere Schwester und Dōng Ào. Xiǎo Mǐns Familie hat drei Personen. Mǎ Kě hat keinen älteren Bruder, er hat eine jüngere Schwester.',
      pt: 'A família do Dōng Ào tem cinco pessoas: pai, mãe, irmão mais velho, irmã mais velha e Dōng Ào. A família da Xiǎo Mǐn tem três pessoas. O Mǎ Kě não tem irmão mais velho, tem uma irmã mais nova.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Cuántas personas hay en la familia de 东奥?', en: "How many people are in 东奥's family?", it: 'Quante persone ci sono nella famiglia di 东奥?', fr: 'Combien de personnes y a-t-il dans la famille de 东奥 ?', de: 'Wie viele Personen hat 东奥s Familie?', pt: 'Quantas pessoas há na família de 东奥?' },
        opciones: ['五口人', '三口人', '两口人', '四口人'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué tiene 马可?', en: 'What does 马可 have?', it: 'Che cosa ha 马可?', fr: "Qu'est-ce que 马可 a ?", de: 'Was hat 马可?', pt: 'O que tem 马可?' },
        opciones: ['一个妹妹', '一个哥哥', '一个姐姐', '一个弟弟'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Cuántas personas hay en la familia de 晓敏?', en: "How many people are in 晓敏's family?", it: 'Quante persone ci sono nella famiglia di 晓敏?', fr: 'Combien de personnes y a-t-il dans la famille de 晓敏 ?', de: 'Wie viele Personen hat 晓敏s Familie?', pt: 'Quantas pessoas há na família de 晓敏?' },
        opciones: ['三口人', '五口人', '四口人', '两口人'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: 'La familia de 东奥 tiene cinco personas.', en: "东奥's family has five people.", it: 'La famiglia di 东奥 ha cinque persone.', fr: 'La famille de 东奥 compte cinq personnes.', de: '东奥s Familie hat fünf Personen.', pt: 'A família do 东奥 tem cinco pessoas.' }, correcta: true },
      { afirmacion: { es: '马可 tiene un hermano mayor.', en: '马可 has an older brother.', it: '马可 ha un fratello maggiore.', fr: '马可 a un grand frère.', de: '马可 hat einen älteren Bruder.', pt: 'O 马可 tem um irmão mais velho.' }, correcta: false },
      { afirmacion: { es: '马可 tiene una hermana menor.', en: '马可 has a younger sister.', it: '马可 ha una sorella minore.', fr: '马可 a une petite sœur.', de: '马可 hat eine jüngere Schwester.', pt: 'O 马可 tem uma irmã mais nova.' }, correcta: true },
    ],
    cloze: [
      { texto: '东奥家有＿＿口人。', opciones: ['五', '三', '两', '四'], correcta: 0 },
      { texto: '马可有一个＿＿。', opciones: ['妹妹', '哥哥', '姐姐', '弟弟'], correcta: 0 },
      { texto: '晓敏家有＿＿口人。', opciones: ['三', '五', '四', '两'], correcta: 0 },
    ],
  },

  {
    id: 'rc-t3-2',
    tema: 3,
    titulo: '照片',
    tituloTr: { es: 'La foto', en: 'The photo', it: 'La foto', fr: 'La photo', de: 'Das Foto', pt: 'A foto' },
    hanzi: '晓敏有一张照片。照片里有她的爸爸、妈妈和她的狗贝贝。贝贝真漂亮！晓敏今年二十岁。她学钢琴，也学汉语。',
    pinyin: 'Xiǎo Mǐn yǒu yī zhāng zhàopiàn. Zhàopiàn lǐ yǒu tā de bàba, māma hé tā de gǒu Bèibei. Bèibei zhēn piàoliang! Xiǎo Mǐn jīnnián èrshí suì. Tā xué gāngqín, yě xué Hànyǔ.',
    traduccion: {
      es: 'Xiǎo Mǐn tiene una foto. En la foto están su papá, su mamá y su perro Bèibei. ¡Bèibei es muy bonito! Xiǎo Mǐn tiene veinte años este año. Estudia piano y también chino.',
      en: 'Xiǎo Mǐn has a photo. In the photo are her dad, her mum and her dog Bèibei. Bèibei is very cute! Xiǎo Mǐn is twenty years old this year. She studies piano and also Chinese.',
      it: "Xiǎo Mǐn ha una foto. Nella foto ci sono suo papà, sua mamma e il suo cane Bèibei. Bèibei è molto carino! Xiǎo Mǐn quest'anno ha vent'anni. Studia pianoforte e anche cinese.",
      fr: 'Xiǎo Mǐn a une photo. Sur la photo, il y a son papa, sa maman et son chien Bèibei. Bèibei est très mignon ! Xiǎo Mǐn a vingt ans cette année. Elle étudie le piano et aussi le chinois.',
      de: 'Xiǎo Mǐn hat ein Foto. Auf dem Foto sind ihr Papa, ihre Mama und ihr Hund Bèibei. Bèibei ist sehr niedlich! Xiǎo Mǐn ist dieses Jahr zwanzig Jahre alt. Sie lernt Klavier und auch Chinesisch.',
      pt: 'A Xiǎo Mǐn tem uma foto. Na foto estão o pai, a mãe e o seu cão Bèibei. O Bèibei é muito giro! A Xiǎo Mǐn tem vinte anos este ano. Estuda piano e também chinês.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Quién es 贝贝?', en: 'Who is 贝贝?', it: 'Chi è 贝贝?', fr: 'Qui est 贝贝 ?', de: 'Wer ist 贝贝?', pt: 'Quem é 贝贝?' },
        opciones: [
          { es: 'El perro de 晓敏', en: "晓敏's dog", it: 'Il cane di 晓敏', fr: 'Le chien de 晓敏', de: '晓敏s Hund', pt: 'O cão da 晓敏' },
          { es: 'El hermano de 晓敏', en: "晓敏's brother", it: 'Il fratello di 晓敏', fr: 'Le frère de 晓敏', de: '晓敏s Bruder', pt: 'O irmão da 晓敏' },
          { es: 'Un amigo', en: 'A friend', it: 'Un amico', fr: 'Un ami', de: 'Ein Freund', pt: 'Um amigo' },
          { es: 'El gato de 晓敏', en: "晓敏's cat", it: 'Il gatto di 晓敏', fr: 'Le chat de 晓敏', de: '晓敏s Katze', pt: 'O gato da 晓敏' },
        ],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Cuántos años tiene 晓敏 este año?', en: 'How old is 晓敏 this year?', it: "Quanti anni ha 晓敏 quest'anno?", fr: 'Quel âge a 晓敏 cette année ?', de: 'Wie alt ist 晓敏 dieses Jahr?', pt: 'Quantos anos tem 晓敏 este ano?' },
        opciones: ['二十岁', '十八岁', '二十二岁', '十九岁'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué estudia 晓敏?', en: 'What does 晓敏 study?', it: 'Cosa studia 晓敏?', fr: "Qu'est-ce que 晓敏 étudie ?", de: 'Was lernt 晓敏?', pt: 'O que estuda 晓敏?' },
        opciones: ['钢琴和汉语', '英语和钢琴', '汉字和音乐', '历史和文化'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: '贝贝 es el perro de 晓敏.', en: '贝贝 is 晓敏\'s dog.', it: '贝贝 è il cane di 晓敏.', fr: '贝贝 est le chien de 晓敏.', de: '贝贝 ist 晓敏s Hund.', pt: 'O 贝贝 é o cão da 晓敏.' }, correcta: true },
      { afirmacion: { es: '晓敏 tiene treinta años.', en: '晓敏 is thirty years old.', it: '晓敏 ha trent\'anni.', fr: '晓敏 a trente ans.', de: '晓敏 ist dreißig Jahre alt.', pt: 'A 晓敏 tem trinta anos.' }, correcta: false },
      { afirmacion: { es: '晓敏 estudia chino.', en: '晓敏 studies Chinese.', it: '晓敏 studia cinese.', fr: '晓敏 étudie le chinois.', de: '晓敏 lernt Chinesisch.', pt: 'A 晓敏 estuda chinês.' }, correcta: true },
    ],
    cloze: [
      { texto: '晓敏有一张＿＿。', opciones: ['照片', '钢琴', '汉语', '历史'], correcta: 0 },
      { texto: '晓敏今年＿＿岁。', opciones: ['二十', '十八', '二十二', '十九'], correcta: 0 },
      { texto: '她学钢琴，也学＿＿。', opciones: ['汉语', '英语', '音乐', '历史'], correcta: 0 },
    ],
  },

  // ─── TEMA 4 ────────────────────────────────────────────────────────────────
  {
    id: 'rc-t4-1',
    tema: 4,
    titulo: '明天有课',
    tituloTr: { es: 'Mañana hay clase', en: 'There is class tomorrow', it: "Domani c'è lezione", fr: 'Demain il y a cours', de: 'Morgen gibt es Unterricht', pt: 'Amanhã há aula' },
    hanzi: '明天上午八点东奥有汉语课。下午两点有口语练习。东奥说：我们一起去看电影吧！晓敏说：好，几点？东奥说：下午五点，行吗？晓敏说：行！',
    pinyin: 'Míngtiān shàngwǔ bā diǎn Dōng Ào yǒu Hànyǔ kè. Xiàwǔ liǎng diǎn yǒu kǒuyǔ liànxí. Dōng Ào shuō: wǒmen yīqǐ qù kàn diànyǐng ba! Xiǎo Mǐn shuō: hǎo, jǐ diǎn? Dōng Ào shuō: xiàwǔ wǔ diǎn, xíng ma? Xiǎo Mǐn shuō: xíng!',
    traduccion: {
      es: 'Mañana por la mañana a las ocho Dōng Ào tiene clase de chino. A las dos de la tarde tiene práctica de conversación. Dōng Ào dice: ¡Vamos juntos a ver una película! Xiǎo Mǐn dice: Bien, ¿a qué hora? Dōng Ào dice: A las cinco de la tarde, ¿te va bien? Xiǎo Mǐn dice: ¡Sí!',
      en: "Tomorrow morning at eight Dōng Ào has a Chinese class. At two in the afternoon he has speaking practice. Dōng Ào says: Let's go see a film together! Xiǎo Mǐn says: OK, at what time? Dōng Ào says: At five in the afternoon, does that work for you? Xiǎo Mǐn says: Yes!",
      it: 'Domani mattina alle otto Dōng Ào ha lezione di cinese. Alle due del pomeriggio ha pratica di conversazione. Dōng Ào dice: Andiamo insieme a vedere un film! Xiǎo Mǐn dice: Va bene, a che ora? Dōng Ào dice: Alle cinque del pomeriggio, ti va bene? Xiǎo Mǐn dice: Sì!',
      fr: "Demain matin à huit heures, Dōng Ào a un cours de chinois. À deux heures de l'après-midi, il a une pratique de conversation. Dōng Ào dit : Allons voir un film ensemble ! Xiǎo Mǐn dit : D'accord, à quelle heure ? Dōng Ào dit : À cinq heures de l'après-midi, ça te va ? Xiǎo Mǐn dit : Oui !",
      de: 'Morgen früh um acht hat Dōng Ào Chinesischunterricht. Um zwei Uhr nachmittags hat er Sprechübung. Dōng Ào sagt: Lass uns zusammen einen Film ansehen! Xiǎo Mǐn sagt: Gut, um wie viel Uhr? Dōng Ào sagt: Um fünf Uhr nachmittags, passt dir das? Xiǎo Mǐn sagt: Ja!',
      pt: 'Amanhã de manhã às oito o Dōng Ào tem aula de chinês. Às duas da tarde tem prática de conversação. O Dōng Ào diz: Vamos juntos ver um filme! A Xiǎo Mǐn diz: Está bem, a que horas? O Dōng Ào diz: Às cinco da tarde, dá-te jeito? A Xiǎo Mǐn diz: Sim!',
    },
    preguntas: [
      {
        pregunta: { es: '¿A qué hora tiene 东奥 la clase de chino mañana?', en: "What time is 东奥's Chinese class tomorrow?", it: 'A che ora ha 东奥 la lezione di cinese domani?', fr: 'À quelle heure 东奥 a-t-il son cours de chinois demain ?', de: 'Um wie viel Uhr hat 东奥 morgen Chinesischunterricht?', pt: 'A que horas tem 东奥 a aula de chinês amanhã?' },
        opciones: ['上午八点', '下午两点', '下午五点', '上午十点'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué quiere hacer 东奥 por la tarde?', en: 'What does 东奥 want to do in the afternoon?', it: 'Cosa vuole fare 东奥 nel pomeriggio?', fr: "Que veut faire 东奥 l'après-midi ?", de: 'Was möchte 东奥 am Nachmittag machen?', pt: 'O que quer fazer 东奥 à tarde?' },
        opciones: ['看电影', '练习口语', '学钢琴', '回家'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Acepta 晓敏 la propuesta?', en: 'Does 晓敏 accept the proposal?', it: '晓敏 accetta la proposta?', fr: '晓敏 accepte-t-elle la proposition ?', de: 'Nimmt 晓敏 den Vorschlag an?', pt: '晓敏 aceita a proposta?' },
        opciones: [
          SI,
          NO,
          { es: 'No lo sabe', en: "She doesn't know", it: 'Non lo sa', fr: 'Elle ne sait pas', de: 'Sie weiß es nicht', pt: 'Não sabe' },
          { es: 'Tiene clase', en: 'She has class', it: 'Ha lezione', fr: 'Elle a cours', de: 'Sie hat Unterricht', pt: 'Tem aula' },
        ],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: '东奥 tiene clase de chino a las ocho de la mañana.', en: '东奥 has Chinese class at eight in the morning.', it: '东奥 ha lezione di cinese alle otto del mattino.', fr: '东奥 a cours de chinois à huit heures du matin.', de: '东奥 hat um acht Uhr morgens Chinesischunterricht.', pt: 'O 东奥 tem aula de chinês às oito da manhã.' }, correcta: true },
      { afirmacion: { es: 'Van a ver una película por la mañana.', en: 'They are going to watch a film in the morning.', it: 'Vanno a vedere un film di mattina.', fr: 'Ils vont voir un film le matin.', de: 'Sie sehen am Morgen einen Film.', pt: 'Vão ver um filme de manhã.' }, correcta: false },
      { afirmacion: { es: '晓敏 acepta ir al cine.', en: '晓敏 agrees to go to the cinema.', it: '晓敏 accetta di andare al cinema.', fr: '晓敏 accepte d\'aller au cinéma.', de: '晓敏 ist einverstanden, ins Kino zu gehen.', pt: 'A 晓敏 aceita ir ao cinema.' }, correcta: true },
    ],
    cloze: [
      { texto: '明天上午＿＿点东奥有汉语课。', opciones: ['八', '两', '五', '十'], correcta: 0 },
      { texto: '我们一起去看＿＿吧！', opciones: ['电影', '钢琴', '口语', '朋友'], correcta: 0 },
      { texto: '下午五点，＿＿吗？', opciones: ['行', '好', '是', '对'], correcta: 0 },
    ],
  },

  {
    id: 'rc-t4-2',
    tema: 4,
    titulo: '我们班',
    tituloTr: { es: 'Nuestra clase', en: 'Our class', it: 'La nostra classe', fr: 'Notre classe', de: 'Unsere Klasse', pt: 'A nossa turma' },
    hanzi: '我们班有二十个学生。十二个男生，八个女生。男生多，女生少。晓敏说：我们班的汉语课很有意思！马可说：对了，现在几点？东奥说：现在差五分八点，我们去上课吧！',
    pinyin: 'Wǒmen bān yǒu èrshí gè xuésheng. Shí èr gè nánshēng, bā gè nǚshēng. Nánshēng duō, nǚshēng shǎo. Xiǎo Mǐn shuō: wǒmen bān de Hànyǔ kè hěn yǒu yìsi! Mǎ Kě shuō: duì le, xiànzài jǐ diǎn? Dōng Ào shuō: xiànzài chà wǔ fēn bā diǎn, wǒmen qù shàngkè ba!',
    traduccion: {
      es: 'Nuestra clase tiene veinte estudiantes. Doce chicos y ocho chicas. Hay más chicos que chicas. Xiǎo Mǐn dice: ¡La clase de chino es muy interesante! Mǎ Kě dice: Por cierto, ¿qué hora es ahora? Dōng Ào dice: Son las ocho menos cinco, ¡vamos a clase!',
      en: "Our class has twenty students. Twelve boys and eight girls. There are more boys than girls. Xiǎo Mǐn says: The Chinese class is very interesting! Mǎ Kě says: By the way, what time is it now? Dōng Ào says: It's five to eight, let's go to class!",
      it: 'La nostra classe ha venti studenti. Dodici ragazzi e otto ragazze. Ci sono più ragazzi che ragazze. Xiǎo Mǐn dice: La lezione di cinese è molto interessante! Mǎ Kě dice: A proposito, che ore sono adesso? Dōng Ào dice: Sono le otto meno cinque, andiamo a lezione!',
      fr: "Notre classe compte vingt étudiants. Douze garçons et huit filles. Il y a plus de garçons que de filles. Xiǎo Mǐn dit : Le cours de chinois est très intéressant ! Mǎ Kě dit : Au fait, quelle heure est-il maintenant ? Dōng Ào dit : Il est huit heures moins cinq, allons en cours !",
      de: 'Unsere Klasse hat zwanzig Schüler. Zwölf Jungen und acht Mädchen. Es gibt mehr Jungen als Mädchen. Xiǎo Mǐn sagt: Der Chinesischunterricht ist sehr interessant! Mǎ Kě sagt: Übrigens, wie spät ist es jetzt? Dōng Ào sagt: Es ist fünf vor acht, gehen wir zum Unterricht!',
      pt: 'A nossa turma tem vinte alunos. Doze rapazes e oito raparigas. Há mais rapazes do que raparigas. A Xiǎo Mǐn diz: A aula de chinês é muito interessante! O Mǎ Kě diz: A propósito, que horas são agora? O Dōng Ào diz: São oito menos cinco, vamos para a aula!',
    },
    preguntas: [
      {
        pregunta: { es: '¿Cuántos estudiantes hay en la clase?', en: 'How many students are in the class?', it: 'Quanti studenti ci sono nella classe?', fr: "Combien d'étudiants y a-t-il dans la classe ?", de: 'Wie viele Schüler sind in der Klasse?', pt: 'Quantos alunos há na turma?' },
        opciones: ['二十个', '十二个', '八个', '十个'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué dice 晓敏 sobre la clase de chino?', en: 'What does 晓敏 say about the Chinese class?', it: 'Cosa dice 晓敏 della lezione di cinese?', fr: 'Que dit 晓敏 à propos du cours de chinois ?', de: 'Was sagt 晓敏 über den Chinesischunterricht?', pt: 'O que diz 晓敏 sobre a aula de chinês?' },
        opciones: ['很有意思', '很难', '很容易', '很无聊'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué hora es cuando hablan?', en: 'What time is it when they talk?', it: 'Che ore sono quando parlano?', fr: "Quelle heure est-il quand ils parlent ?", de: 'Wie spät ist es, als sie sprechen?', pt: 'Que horas são quando falam?' },
        opciones: ['差五分八点', '八点半', '七点', '九点'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: 'La clase tiene veinte estudiantes.', en: 'The class has twenty students.', it: 'La classe ha venti studenti.', fr: 'La classe compte vingt étudiants.', de: 'Die Klasse hat zwanzig Schüler.', pt: 'A turma tem vinte alunos.' }, correcta: true },
      { afirmacion: { es: 'Hay más chicas que chicos.', en: 'There are more girls than boys.', it: 'Ci sono più ragazze che ragazzi.', fr: 'Il y a plus de filles que de garçons.', de: 'Es gibt mehr Mädchen als Jungen.', pt: 'Há mais raparigas do que rapazes.' }, correcta: false },
      { afirmacion: { es: 'La clase de chino es interesante.', en: 'The Chinese class is interesting.', it: 'La lezione di cinese è interessante.', fr: 'Le cours de chinois est intéressant.', de: 'Der Chinesischunterricht ist interessant.', pt: 'A aula de chinês é interessante.' }, correcta: true },
    ],
    cloze: [
      { texto: '我们班有＿＿个学生。', opciones: ['二十', '十二', '八', '十'], correcta: 0 },
      { texto: '我们班的汉语课很＿＿！', opciones: ['有意思', '难', '容易', '无聊'], correcta: 0 },
      { texto: '现在差五分＿＿点。', opciones: ['八', '七', '九', '六'], correcta: 0 },
    ],
  },

  // ─── TEMA 5 ────────────────────────────────────────────────────────────────
  {
    id: 'rc-t5-1',
    tema: 5,
    titulo: '生日聚会',
    tituloTr: { es: 'Fiesta de cumpleaños', en: 'Birthday party', it: 'Festa di compleanno', fr: "Fête d'anniversaire", de: 'Geburtstagsfeier', pt: 'Festa de aniversário' },
    hanzi: '今天是东奥的生日。晓敏和马可参加了他的生日聚会。晓敏送给东奥一盒巧克力。马可送给他一个蛋糕。大家唱歌，很快乐！',
    pinyin: 'Jīntiān shì Dōng Ào de shēngrì. Xiǎo Mǐn hé Mǎ Kě cānjiā le tā de shēngrì jùhuì. Xiǎo Mǐn sòng gěi Dōng Ào yī hé qiǎokèlì. Mǎ Kě sòng gěi tā yī gè dàngāo. Dàjiā chàng gē, hěn kuàilè!',
    traduccion: {
      es: 'Hoy es el cumpleaños de Dōng Ào. Xiǎo Mǐn y Mǎ Kě asistieron a su fiesta de cumpleaños. Xiǎo Mǐn le regaló a Dōng Ào una caja de chocolate. Mǎ Kě le regaló una tarta. ¡Todos cantaron y estuvieron muy felices!',
      en: "Today is Dōng Ào's birthday. Xiǎo Mǐn and Mǎ Kě went to his birthday party. Xiǎo Mǐn gave Dōng Ào a box of chocolate. Mǎ Kě gave him a cake. Everyone sang and was very happy!",
      it: 'Oggi è il compleanno di Dōng Ào. Xiǎo Mǐn e Mǎ Kě sono andati alla sua festa di compleanno. Xiǎo Mǐn ha regalato a Dōng Ào una scatola di cioccolatini. Mǎ Kě gli ha regalato una torta. Tutti hanno cantato ed erano molto felici!',
      fr: "Aujourd'hui, c'est l'anniversaire de Dōng Ào. Xiǎo Mǐn et Mǎ Kě sont allés à sa fête d'anniversaire. Xiǎo Mǐn a offert à Dōng Ào une boîte de chocolats. Mǎ Kě lui a offert un gâteau. Tout le monde a chanté et était très heureux !",
      de: 'Heute ist Dōng Àos Geburtstag. Xiǎo Mǐn und Mǎ Kě sind zu seiner Geburtstagsfeier gegangen. Xiǎo Mǐn schenkte Dōng Ào eine Schachtel Pralinen. Mǎ Kě schenkte ihm einen Kuchen. Alle sangen und waren sehr glücklich!',
      pt: 'Hoje é o aniversário do Dōng Ào. A Xiǎo Mǐn e o Mǎ Kě foram à sua festa de aniversário. A Xiǎo Mǐn deu ao Dōng Ào uma caixa de chocolates. O Mǎ Kě deu-lhe um bolo. Toda a gente cantou e ficou muito feliz!',
    },
    preguntas: [
      {
        pregunta: { es: '¿De quién es el cumpleaños?', en: 'Whose birthday is it?', it: 'Di chi è il compleanno?', fr: "C'est l'anniversaire de qui ?", de: 'Wessen Geburtstag ist es?', pt: 'De quem é o aniversário?' },
        opciones: [
          '东奥', '晓敏', '马可',
          { es: 'Del profesor', en: "The teacher's", it: 'Del professore', fr: 'Du professeur', de: 'Des Lehrers', pt: 'Do professor' },
        ],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué regalo le dio 晓敏 a 东奥?', en: 'What gift did 晓敏 give 东奥?', it: 'Che regalo ha fatto 晓敏 a 东奥?', fr: 'Quel cadeau 晓敏 a-t-elle offert à 东奥 ?', de: 'Welches Geschenk gab 晓敏 dem 东奥?', pt: 'Que presente deu 晓敏 a 东奥?' },
        opciones: ['一盒巧克力', '一个蛋糕', '一盒点心', '一本书'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué hacen todos en la fiesta?', en: 'What does everyone do at the party?', it: 'Cosa fanno tutti alla festa?', fr: 'Que font-ils tous à la fête ?', de: 'Was machen alle auf der Feier?', pt: 'O que fazem todos na festa?' },
        opciones: ['唱歌', '跳舞', '看电影', '吃饭'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: 'Hoy es el cumpleaños de 东奥.', en: "Today is 东奥's birthday.", it: 'Oggi è il compleanno di 东奥.', fr: "Aujourd'hui c'est l'anniversaire de 东奥.", de: 'Heute ist 东奥s Geburtstag.', pt: 'Hoje é o aniversário do 东奥.' }, correcta: true },
      { afirmacion: { es: '晓敏 le regala un pastel a 东奥.', en: '晓敏 gives 东奥 a cake.', it: '晓敏 regala una torta a 东奥.', fr: '晓敏 offre un gâteau à 东奥.', de: '晓敏 schenkt 东奥 einen Kuchen.', pt: 'A 晓敏 dá um bolo ao 东奥.' }, correcta: false },
      { afirmacion: { es: 'Todos cantan en la fiesta.', en: 'Everyone sings at the party.', it: 'Tutti cantano alla festa.', fr: 'Tout le monde chante à la fête.', de: 'Alle singen auf der Feier.', pt: 'Todos cantam na festa.' }, correcta: true },
    ],
    cloze: [
      { texto: '今天是东奥的＿＿。', opciones: ['生日', '蛋糕', '巧克力', '聚会'], correcta: 0 },
      { texto: '晓敏送给东奥一盒＿＿。', opciones: ['巧克力', '蛋糕', '点心', '茶'], correcta: 0 },
      { texto: '大家＿＿，很快乐！', opciones: ['唱歌', '跳舞', '看电影', '吃饭'], correcta: 0 },
    ],
  },

  {
    id: 'rc-t5-2',
    tema: 5,
    titulo: '祝你生日快乐',
    tituloTr: { es: 'Feliz cumpleaños', en: 'Happy birthday', it: 'Buon compleanno', fr: 'Joyeux anniversaire', de: 'Alles Gute zum Geburtstag', pt: 'Feliz aniversário' },
    hanzi: '马可今年二十一岁。他的生日是八月十五号，星期日。东奥和晓敏昨天给他介绍了一个新朋友。马可很高兴。他们一起喝茶，干杯！',
    pinyin: 'Mǎ Kě jīnnián èrshí yī suì. Tā de shēngrì shì bā yuè shí wǔ hào, xīngqīrì. Dōng Ào hé Xiǎo Mǐn zuótiān gěi tā jièshào le yī gè xīn péngyou. Mǎ Kě hěn gāoxìng. Tāmen yīqǐ hē chá, gānbēi!',
    traduccion: {
      es: 'Mǎ Kě tiene veintiún años este año. Su cumpleaños es el 15 de agosto, domingo. Ayer Dōng Ào y Xiǎo Mǐn le presentaron a un nuevo amigo. Mǎ Kě está muy contento. ¡Tomaron té juntos y brindaron!',
      en: 'Mǎ Kě is twenty-one years old this year. His birthday is on 15 August, a Sunday. Yesterday Dōng Ào and Xiǎo Mǐn introduced a new friend to him. Mǎ Kě is very happy. They drank tea together and made a toast!',
      it: "Mǎ Kě quest'anno ha ventun anni. Il suo compleanno è il 15 agosto, domenica. Ieri Dōng Ào e Xiǎo Mǐn gli hanno presentato un nuovo amico. Mǎ Kě è molto contento. Hanno bevuto il tè insieme e hanno brindato!",
      fr: "Mǎ Kě a vingt et un ans cette année. Son anniversaire est le 15 août, un dimanche. Hier, Dōng Ào et Xiǎo Mǐn lui ont présenté un nouvel ami. Mǎ Kě est très content. Ils ont bu du thé ensemble et ont porté un toast !",
      de: 'Mǎ Kě ist dieses Jahr einundzwanzig Jahre alt. Sein Geburtstag ist am 15. August, einem Sonntag. Gestern stellten ihm Dōng Ào und Xiǎo Mǐn einen neuen Freund vor. Mǎ Kě ist sehr froh. Sie tranken zusammen Tee und stießen an!',
      pt: 'O Mǎ Kě tem vinte e um anos este ano. O aniversário dele é a 15 de agosto, domingo. Ontem o Dōng Ào e a Xiǎo Mǐn apresentaram-lhe um novo amigo. O Mǎ Kě está muito contente. Beberam chá juntos e fizeram um brinde!',
    },
    preguntas: [
      {
        pregunta: { es: '¿Cuántos años tiene 马可 este año?', en: 'How old is 马可 this year?', it: "Quanti anni ha 马可 quest'anno?", fr: 'Quel âge a 马可 cette année ?', de: 'Wie alt ist 马可 dieses Jahr?', pt: 'Quantos anos tem 马可 este ano?' },
        opciones: ['二十一岁', '二十岁', '十八岁', '二十二岁'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Cuándo es el cumpleaños de 马可?', en: "When is 马可's birthday?", it: 'Quando è il compleanno di 马可?', fr: "Quand est l'anniversaire de 马可 ?", de: 'Wann ist 马可s Geburtstag?', pt: 'Quando é o aniversário de 马可?' },
        opciones: ['八月十五号', '八月十二号', '七月十五号', '九月五号'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué beben juntos?', en: 'What do they drink together?', it: 'Cosa bevono insieme?', fr: 'Que boivent-ils ensemble ?', de: 'Was trinken sie zusammen?', pt: 'O que bebem juntos?' },
        opciones: ['茶', '咖啡', '可乐', '牛奶'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: '马可 tiene veintiún años.', en: '马可 is twenty-one years old.', it: '马可 ha ventun anni.', fr: '马可 a vingt et un ans.', de: '马可 ist einundzwanzig Jahre alt.', pt: 'O 马可 tem vinte e um anos.' }, correcta: true },
      { afirmacion: { es: 'El cumpleaños de 马可 es en julio.', en: "马可's birthday is in July.", it: 'Il compleanno di 马可 è a luglio.', fr: "L'anniversaire de 马可 est en juillet.", de: '马可s Geburtstag ist im Juli.', pt: 'O aniversário do 马可 é em julho.' }, correcta: false },
      { afirmacion: { es: 'Tomaron té juntos.', en: 'They drank tea together.', it: 'Hanno bevuto il tè insieme.', fr: 'Ils ont bu du thé ensemble.', de: 'Sie tranken zusammen Tee.', pt: 'Beberam chá juntos.' }, correcta: true },
    ],
    cloze: [
      { texto: '马可今年＿＿岁。', opciones: ['二十一', '二十', '十八', '二十二'], correcta: 0 },
      { texto: '他的生日是＿＿十五号。', opciones: ['八月', '七月', '九月', '五月'], correcta: 0 },
      { texto: '他们一起喝＿＿，干杯！', opciones: ['茶', '咖啡', '可乐', '牛奶'], correcta: 0 },
    ],
  },

  // ─── TEMA 6 ────────────────────────────────────────────────────────────────
  {
    id: 'rc-t6-1',
    tema: 6,
    titulo: '学校在哪儿',
    tituloTr: { es: '¿Dónde está la escuela?', en: 'Where is the school?', it: "Dov'è la scuola?", fr: "Où est l'école ?", de: 'Wo ist die Schule?', pt: 'Onde fica a escola?' },
    hanzi: '晓敏问马可：图书馆在哪儿？马可说：图书馆在食堂北边。宿舍在图书馆西边。银行在校门右边。晓敏说：谢谢！马可说：不客气。',
    pinyin: 'Xiǎo Mǐn wèn Mǎ Kě: túshūguǎn zài nǎr? Mǎ Kě shuō: túshūguǎn zài shítáng běibiān. Sùshè zài túshūguǎn xībiān. Yínháng zài xiàomén yòubiān. Xiǎo Mǐn shuō: xièxie! Mǎ Kě shuō: bú kèqi.',
    traduccion: {
      es: 'Xiǎo Mǐn le pregunta a Mǎ Kě: ¿Dónde está la biblioteca? Mǎ Kě dice: La biblioteca está al norte del comedor. Los dormitorios están al oeste de la biblioteca. El banco está a la derecha de la entrada del campus. Xiǎo Mǐn dice: ¡Gracias! Mǎ Kě dice: De nada.',
      en: "Xiǎo Mǐn asks Mǎ Kě: Where is the library? Mǎ Kě says: The library is north of the canteen. The dormitories are west of the library. The bank is to the right of the campus entrance. Xiǎo Mǐn says: Thank you! Mǎ Kě says: You're welcome.",
      it: "Xiǎo Mǐn chiede a Mǎ Kě: Dov'è la biblioteca? Mǎ Kě dice: La biblioteca è a nord della mensa. I dormitori sono a ovest della biblioteca. La banca è a destra dell'ingresso del campus. Xiǎo Mǐn dice: Grazie! Mǎ Kě dice: Prego.",
      fr: "Xiǎo Mǐn demande à Mǎ Kě : Où est la bibliothèque ? Mǎ Kě dit : La bibliothèque est au nord de la cantine. Les dortoirs sont à l'ouest de la bibliothèque. La banque est à droite de l'entrée du campus. Xiǎo Mǐn dit : Merci ! Mǎ Kě dit : De rien.",
      de: 'Xiǎo Mǐn fragt Mǎ Kě: Wo ist die Bibliothek? Mǎ Kě sagt: Die Bibliothek ist nördlich der Mensa. Die Wohnheime sind westlich der Bibliothek. Die Bank ist rechts vom Campuseingang. Xiǎo Mǐn sagt: Danke! Mǎ Kě sagt: Gern geschehen.',
      pt: 'A Xiǎo Mǐn pergunta ao Mǎ Kě: Onde fica a biblioteca? O Mǎ Kě diz: A biblioteca fica a norte da cantina. Os dormitórios ficam a oeste da biblioteca. O banco fica à direita da entrada do campus. A Xiǎo Mǐn diz: Obrigada! O Mǎ Kě diz: De nada.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Dónde está la 图书馆?', en: 'Where is the 图书馆?', it: "Dov'è la 图书馆?", fr: 'Où est la 图书馆 ?', de: 'Wo ist die 图书馆?', pt: 'Onde fica a 图书馆?' },
        opciones: ['在食堂北边', '在食堂西边', '在校门右边', '在宿舍东边'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Dónde está el 银行?', en: 'Where is the 银行?', it: "Dov'è la 银行?", fr: 'Où est la 银行 ?', de: 'Wo ist die 银行?', pt: 'Onde fica o 银行?' },
        opciones: ['在校门右边', '在图书馆西边', '在食堂北边', '在宿舍旁边'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Quién hace las preguntas?', en: 'Who asks the questions?', it: 'Chi fa le domande?', fr: 'Qui pose les questions ?', de: 'Wer stellt die Fragen?', pt: 'Quem faz as perguntas?' },
        opciones: [
          '晓敏', '马可', '东奥',
          { es: 'El profesor', en: 'The teacher', it: 'Il professore', fr: 'Le professeur', de: 'Der Lehrer', pt: 'O professor' },
        ],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: 'La biblioteca está al norte del comedor.', en: 'The library is north of the canteen.', it: 'La biblioteca è a nord della mensa.', fr: 'La bibliothèque est au nord de la cantine.', de: 'Die Bibliothek ist nördlich der Mensa.', pt: 'A biblioteca fica a norte da cantina.' }, correcta: true },
      { afirmacion: { es: 'El banco está a la izquierda de la entrada.', en: 'The bank is to the left of the entrance.', it: "La banca è a sinistra dell'ingresso.", fr: "La banque est à gauche de l'entrée.", de: 'Die Bank ist links vom Eingang.', pt: 'O banco fica à esquerda da entrada.' }, correcta: false },
      { afirmacion: { es: '晓敏 da las gracias.', en: '晓敏 says thank you.', it: '晓敏 ringrazia.', fr: '晓敏 remercie.', de: '晓敏 bedankt sich.', pt: 'A 晓敏 agradece.' }, correcta: true },
    ],
    cloze: [
      { texto: '图书馆在食堂＿＿边。', opciones: ['北', '南', '东', '西'], correcta: 0 },
      { texto: '银行在校门＿＿边。', opciones: ['右', '左', '北', '西'], correcta: 0 },
      { texto: '宿舍在图书馆＿＿边。', opciones: ['西', '东', '北', '南'], correcta: 0 },
    ],
  },

  {
    id: 'rc-t6-2',
    tema: 6,
    titulo: '去饭馆',
    tituloTr: { es: 'Vamos al restaurante', en: 'Going to the restaurant', it: 'Andiamo al ristorante', fr: 'Allons au restaurant', de: 'Gehen wir ins Restaurant', pt: 'Vamos ao restaurante' },
    hanzi: '东奥知道一个好饭馆。饭馆在超市对面，马路旁边。晓敏问：怎么去？东奥说：先过马路，饭馆就在前边。马可说：我们先去，别着急！',
    pinyin: 'Dōng Ào zhīdào yī gè hǎo fànguǎn. Fànguǎn zài chāoshì duìmiàn, mǎlù pángbiān. Xiǎo Mǐn wèn: zěnme qù? Dōng Ào shuō: xiān guò mǎlù, fànguǎn jiù zài qiánbiān. Mǎ Kě shuō: wǒmen xiān qù, bié zháojí!',
    traduccion: {
      es: 'Dōng Ào conoce un buen restaurante. El restaurante está enfrente del supermercado, al lado de la calle. Xiǎo Mǐn pregunta: ¿Cómo se llega? Dōng Ào dice: Primero cruzas la calle, el restaurante está justo delante. Mǎ Kě dice: ¡Vamos ya, no os preocupéis!',
      en: "Dōng Ào knows a good restaurant. The restaurant is across from the supermarket, next to the street. Xiǎo Mǐn asks: How do we get there? Dōng Ào says: First you cross the street, the restaurant is right ahead. Mǎ Kě says: Let's go now, don't worry!",
      it: "Dōng Ào conosce un buon ristorante. Il ristorante è di fronte al supermercato, accanto alla strada. Xiǎo Mǐn chiede: Come ci si arriva? Dōng Ào dice: Prima attraversi la strada, il ristorante è proprio davanti. Mǎ Kě dice: Andiamo subito, non preoccupatevi!",
      fr: "Dōng Ào connaît un bon restaurant. Le restaurant est en face du supermarché, à côté de la rue. Xiǎo Mǐn demande : Comment y va-t-on ? Dōng Ào dit : D'abord tu traverses la rue, le restaurant est juste devant. Mǎ Kě dit : Allons-y maintenant, ne vous inquiétez pas !",
      de: 'Dōng Ào kennt ein gutes Restaurant. Das Restaurant ist gegenüber dem Supermarkt, neben der Straße. Xiǎo Mǐn fragt: Wie kommt man dorthin? Dōng Ào sagt: Zuerst überquerst du die Straße, das Restaurant ist gleich vorne. Mǎ Kě sagt: Gehen wir jetzt, keine Sorge!',
      pt: 'O Dōng Ào conhece um bom restaurante. O restaurante fica em frente ao supermercado, ao lado da rua. A Xiǎo Mǐn pergunta: Como se chega lá? O Dōng Ào diz: Primeiro atravessas a rua, o restaurante fica logo à frente. O Mǎ Kě diz: Vamos já, não se preocupem!',
    },
    preguntas: [
      {
        pregunta: { es: '¿Dónde está el 饭馆?', en: 'Where is the 饭馆?', it: "Dov'è il 饭馆?", fr: 'Où est le 饭馆 ?', de: 'Wo ist das 饭馆?', pt: 'Onde fica o 饭馆?' },
        opciones: ['在超市对面', '在图书馆旁边', '在银行右边', '在校门前边'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué hay que hacer primero para llegar?', en: 'What do you have to do first to get there?', it: "Cosa bisogna fare prima per arrivarci?", fr: "Que faut-il faire d'abord pour y arriver ?", de: 'Was muss man zuerst tun, um dorthin zu kommen?', pt: 'O que é preciso fazer primeiro para chegar lá?' },
        opciones: ['过马路', '去超市', '回宿舍', '问老师'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué dice 马可?', en: 'What does 马可 say?', it: 'Cosa dice 马可?', fr: 'Que dit 马可 ?', de: 'Was sagt 马可?', pt: 'O que diz 马可?' },
        opciones: ['别着急', '不知道', '在哪儿', '谢谢'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: 'El restaurante está enfrente del supermercado.', en: 'The restaurant is across from the supermarket.', it: 'Il ristorante è di fronte al supermercato.', fr: 'Le restaurant est en face du supermarché.', de: 'Das Restaurant ist gegenüber dem Supermarkt.', pt: 'O restaurante fica em frente ao supermercado.' }, correcta: true },
      { afirmacion: { es: 'Hay que cruzar la calle para llegar.', en: 'You have to cross the street to get there.', it: 'Bisogna attraversare la strada per arrivarci.', fr: 'Il faut traverser la rue pour y arriver.', de: 'Man muss die Straße überqueren, um dorthin zu kommen.', pt: 'É preciso atravessar a rua para chegar lá.' }, correcta: true },
      { afirmacion: { es: '马可 dice que hay que preocuparse.', en: '马可 says you should worry.', it: '马可 dice di preoccuparsi.', fr: '马可 dit qu\'il faut s\'inquiéter.', de: '马可 sagt, man solle sich Sorgen machen.', pt: 'O 马可 diz que é preciso preocupar-se.' }, correcta: false },
    ],
    cloze: [
      { texto: '饭馆在超市＿＿。', opciones: ['对面', '旁边', '前边', '右边'], correcta: 0 },
      { texto: '先过＿＿，饭馆就在前边。', opciones: ['马路', '超市', '学校', '银行'], correcta: 0 },
      { texto: '我们先去，别＿＿！', opciones: ['着急', '知道', '高兴', '谢谢'], correcta: 0 },
    ],
  },

  // ─── TEMA 7 ────────────────────────────────────────────────────────────────
  {
    id: 'rc-t7-1',
    tema: 7,
    titulo: '买苹果',
    tituloTr: { es: 'Comprar manzanas', en: 'Buying apples', it: 'Comprare le mele', fr: 'Acheter des pommes', de: 'Äpfel kaufen', pt: 'Comprar maçãs' },
    hanzi: '晓敏想买苹果。她问老板：苹果多少钱一斤？老板说：五块钱一斤。晓敏说：有点儿贵。可以便宜一点儿吗？老板说：好，四块五。晓敏说：好，我要两斤。',
    pinyin: 'Xiǎo Mǐn xiǎng mǎi píngguǒ. Tā wèn lǎobǎn: píngguǒ duōshao qián yī jīn? Lǎobǎn shuō: wǔ kuài qián yī jīn. Xiǎo Mǐn shuō: yǒu diǎnr guì. Kěyǐ piányí yīdiǎnr ma? Lǎobǎn shuō: hǎo, sì kuài wǔ. Xiǎo Mǐn shuō: hǎo, wǒ yào liǎng jīn.',
    traduccion: {
      es: 'Xiǎo Mǐn quiere comprar manzanas. Le pregunta al tendero: ¿Cuánto cuesta el jin de manzanas? El tendero dice: Cinco kuai el jin. Xiǎo Mǐn dice: Es un poco caro. ¿Puede ser un poco más barato? El tendero dice: Bueno, cuatro con cincuenta. Xiǎo Mǐn dice: Bien, quiero dos jines.',
      en: "Xiǎo Mǐn wants to buy apples. She asks the shopkeeper: How much is a jin of apples? The shopkeeper says: Five kuai a jin. Xiǎo Mǐn says: That's a bit expensive. Can it be a bit cheaper? The shopkeeper says: OK, four fifty. Xiǎo Mǐn says: Fine, I want two jin.",
      it: "Xiǎo Mǐn vuole comprare delle mele. Chiede al negoziante: Quanto costa un jin di mele? Il negoziante dice: Cinque kuai al jin. Xiǎo Mǐn dice: È un po' caro. Può costare un po' meno? Il negoziante dice: Va bene, quattro e cinquanta. Xiǎo Mǐn dice: Bene, ne voglio due jin.",
      fr: "Xiǎo Mǐn veut acheter des pommes. Elle demande au marchand : Combien coûte le jin de pommes ? Le marchand dit : Cinq kuai le jin. Xiǎo Mǐn dit : C'est un peu cher. Ça peut être un peu moins cher ? Le marchand dit : D'accord, quatre cinquante. Xiǎo Mǐn dit : Bien, j'en veux deux jin.",
      de: 'Xiǎo Mǐn möchte Äpfel kaufen. Sie fragt den Verkäufer: Wie viel kostet ein Jin Äpfel? Der Verkäufer sagt: Fünf Kuai pro Jin. Xiǎo Mǐn sagt: Das ist etwas teuer. Geht es etwas billiger? Der Verkäufer sagt: Gut, vier fünfzig. Xiǎo Mǐn sagt: In Ordnung, ich möchte zwei Jin.',
      pt: 'A Xiǎo Mǐn quer comprar maçãs. Pergunta ao vendedor: Quanto custa o jin de maçãs? O vendedor diz: Cinco kuai o jin. A Xiǎo Mǐn diz: É um pouco caro. Pode ser um pouco mais barato? O vendedor diz: Está bem, quatro e cinquenta. A Xiǎo Mǐn diz: Bem, quero dois jin.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Qué quiere comprar 晓敏?', en: 'What does 晓敏 want to buy?', it: 'Cosa vuole comprare 晓敏?', fr: "Qu'est-ce que 晓敏 veut acheter ?", de: 'Was möchte 晓敏 kaufen?', pt: 'O que quer comprar 晓敏?' },
        opciones: ['苹果', '草莓', '点心', '饺子'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Cuánto cuesta el jin al principio?', en: 'How much does a jin cost at first?', it: "Quanto costa un jin all'inizio?", fr: 'Combien coûte le jin au début ?', de: 'Wie viel kostet ein Jin am Anfang?', pt: 'Quanto custa o jin no início?' },
        opciones: ['五块钱', '四块五', '三块钱', '六块钱'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Cuántos jines compra 晓敏?', en: 'How many jin does 晓敏 buy?', it: 'Quanti jin compra 晓敏?', fr: 'Combien de jin 晓敏 achète-t-elle ?', de: 'Wie viele Jin kauft 晓敏?', pt: 'Quantos jin compra 晓敏?' },
        opciones: ['两斤', '一斤', '三斤', '五斤'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: '晓敏 quiere comprar manzanas.', en: '晓敏 wants to buy apples.', it: '晓敏 vuole comprare delle mele.', fr: '晓敏 veut acheter des pommes.', de: '晓敏 möchte Äpfel kaufen.', pt: 'A 晓敏 quer comprar maçãs.' }, correcta: true },
      { afirmacion: { es: 'Al final el jin cuesta cinco kuai.', en: 'In the end a jin costs five kuai.', it: 'Alla fine un jin costa cinque kuai.', fr: 'À la fin le jin coûte cinq kuai.', de: 'Am Ende kostet ein Jin fünf Kuai.', pt: 'No final o jin custa cinco kuai.' }, correcta: false },
      { afirmacion: { es: '晓敏 compra dos jin.', en: '晓敏 buys two jin.', it: '晓敏 compra due jin.', fr: '晓敏 achète deux jin.', de: '晓敏 kauft zwei Jin.', pt: 'A 晓敏 compra dois jin.' }, correcta: true },
    ],
    cloze: [
      { texto: '晓敏想买＿＿。', opciones: ['苹果', '草莓', '点心', '饺子'], correcta: 0 },
      { texto: '苹果多少钱一＿＿？', opciones: ['斤', '块', '个', '杯'], correcta: 0 },
      { texto: '我要＿＿斤。', opciones: ['两', '一', '三', '五'], correcta: 0 },
    ],
  },

  {
    id: 'rc-t7-2',
    tema: 7,
    titulo: '买衣服',
    tituloTr: { es: 'Comprar ropa', en: 'Buying clothes', it: 'Comprare i vestiti', fr: 'Acheter des vêtements', de: 'Kleidung kaufen', pt: 'Comprar roupa' },
    hanzi: '东奥想买一件衬衫。售货员说：这件黑色衬衫不错，可以试一下。东奥试了，很合适。多少钱？两百块。可以打折吗？可以，打八折，一百六十块。东奥说：好，我刷卡。',
    pinyin: 'Dōng Ào xiǎng mǎi yī jiàn chènshān. Shòuhuòyuán shuō: zhè jiàn hēisè chènshān bùcuò, kěyǐ shì yīxià. Dōng Ào shì le, hěn héshì. Duōshao qián? Liǎng bǎi kuài. Kěyǐ dǎzhé ma? Kěyǐ, dǎ bā zhé, yī bǎi liùshí kuài. Dōng Ào shuō: hǎo, wǒ shuākǎ.',
    traduccion: {
      es: 'Dōng Ào quiere comprar una camisa. La vendedora dice: Esta camisa negra está muy bien, puede probársela. Dōng Ào se la prueba, le queda muy bien. ¿Cuánto cuesta? Doscientos kuai. ¿Pueden hacer descuento? Sí, el veinte por ciento de descuento, ciento sesenta kuai. Dōng Ào dice: Bien, pago con tarjeta.',
      en: "Dōng Ào wants to buy a shirt. The shop assistant says: This black shirt is very nice, you can try it on. Dōng Ào tries it on, it fits very well. How much is it? Two hundred kuai. Can you give a discount? Yes, twenty percent off, one hundred and sixty kuai. Dōng Ào says: OK, I'll pay by card.",
      it: 'Dōng Ào vuole comprare una camicia. La commessa dice: Questa camicia nera è bella, può provarla. Dōng Ào la prova, gli sta molto bene. Quanto costa? Duecento kuai. Si può avere uno sconto? Sì, il venti per cento di sconto, centosessanta kuai. Dōng Ào dice: Va bene, pago con la carta.',
      fr: "Dōng Ào veut acheter une chemise. La vendeuse dit : Cette chemise noire est très bien, vous pouvez l'essayer. Dōng Ào l'essaie, elle lui va très bien. Combien coûte-t-elle ? Deux cents kuai. Pouvez-vous faire une réduction ? Oui, vingt pour cent de réduction, cent soixante kuai. Dōng Ào dit : D'accord, je paie par carte.",
      de: 'Dōng Ào möchte ein Hemd kaufen. Die Verkäuferin sagt: Dieses schwarze Hemd ist sehr schön, Sie können es anprobieren. Dōng Ào probiert es an, es passt sehr gut. Wie viel kostet es? Zweihundert Kuai. Können Sie einen Rabatt geben? Ja, zwanzig Prozent Rabatt, hundertsechzig Kuai. Dōng Ào sagt: Gut, ich zahle mit Karte.',
      pt: 'O Dōng Ào quer comprar uma camisa. A vendedora diz: Esta camisa preta é muito bonita, pode experimentá-la. O Dōng Ào experimenta-a, fica-lhe muito bem. Quanto custa? Duzentos kuai. Pode dar desconto? Sim, vinte por cento de desconto, cento e sessenta kuai. O Dōng Ào diz: Está bem, pago com cartão.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Qué quiere comprar 东奥?', en: 'What does 东奥 want to buy?', it: 'Cosa vuole comprare 东奥?', fr: "Qu'est-ce que 东奥 veut acheter ?", de: 'Was möchte 东奥 kaufen?', pt: 'O que quer comprar 东奥?' },
        opciones: ['一件衬衫', '一条牛仔裤', '一件羽绒服', '一件T恤'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿De qué color es la camisa?', en: 'What colour is the shirt?', it: 'Di che colore è la camicia?', fr: 'De quelle couleur est la chemise ?', de: 'Welche Farbe hat das Hemd?', pt: 'De que cor é a camisa?' },
        opciones: ['黑色', '绿色', '白色', '红色'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Cómo paga 东奥?', en: 'How does 东奥 pay?', it: 'Come paga 东奥?', fr: 'Comment 东奥 paie-t-il ?', de: 'Wie bezahlt 东奥?', pt: 'Como paga 东奥?' },
        opciones: ['刷卡', '现金', '不买', '打折'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: '东奥 quiere comprar una camisa.', en: '东奥 wants to buy a shirt.', it: '东奥 vuole comprare una camicia.', fr: '东奥 veut acheter une chemise.', de: '东奥 möchte ein Hemd kaufen.', pt: 'O 东奥 quer comprar uma camisa.' }, correcta: true },
      { afirmacion: { es: 'La camisa es blanca.', en: 'The shirt is white.', it: 'La camicia è bianca.', fr: 'La chemise est blanche.', de: 'Das Hemd ist weiß.', pt: 'A camisa é branca.' }, correcta: false },
      { afirmacion: { es: '东奥 paga con tarjeta.', en: '东奥 pays by card.', it: '东奥 paga con la carta.', fr: '东奥 paie par carte.', de: '东奥 zahlt mit Karte.', pt: 'O 东奥 paga com cartão.' }, correcta: true },
    ],
    cloze: [
      { texto: '东奥想买一件＿＿。', opciones: ['衬衫', '牛仔裤', '羽绒服', 'T恤'], correcta: 0 },
      { texto: '这件＿＿衬衫不错。', opciones: ['黑色', '绿色', '白色', '红色'], correcta: 0 },
      { texto: '好，我＿＿。', opciones: ['刷卡', '现金', '打折', '试一下'], correcta: 0 },
    ],
  },

  // ─── TEMA 8 ────────────────────────────────────────────────────────────────
  {
    id: 'rc-t8-1',
    tema: 8,
    titulo: '身体不舒服',
    tituloTr: { es: 'Me encuentro mal', en: 'I feel unwell', it: 'Non mi sento bene', fr: 'Je ne me sens pas bien', de: 'Mir geht es nicht gut', pt: 'Sinto-me mal' },
    hanzi: '今天东奥头疼，嗓子也疼。他有点儿发烧。晓敏说：你应该去医院看病。东奥说：好，可是我现在很累，不想去。晓敏说：别着急，我跟你一起去。',
    pinyin: 'Jīntiān Dōng Ào tóu téng, sǎngzi yě téng. Tā yǒu diǎnr fāshāo. Xiǎo Mǐn shuō: nǐ yīnggāi qù yīyuàn kànbìng. Dōng Ào shuō: hǎo, kěshì wǒ xiànzài hěn lèi, bù xiǎng qù. Xiǎo Mǐn shuō: bié zháojí, wǒ gēn nǐ yīqǐ qù.',
    traduccion: {
      es: 'Hoy a Dōng Ào le duele la cabeza y también la garganta. Tiene un poco de fiebre. Xiǎo Mǐn dice: Deberías ir al hospital a que te vean. Dōng Ào dice: Bueno, pero ahora estoy muy cansado y no quiero ir. Xiǎo Mǐn dice: No te preocupes, voy contigo.',
      en: "Today Dōng Ào has a headache and a sore throat too. He has a slight fever. Xiǎo Mǐn says: You should go to the hospital to be seen. Dōng Ào says: OK, but right now I'm very tired and don't want to go. Xiǎo Mǐn says: Don't worry, I'll go with you.",
      it: "Oggi a Dōng Ào fa male la testa e anche la gola. Ha un po' di febbre. Xiǎo Mǐn dice: Dovresti andare in ospedale a farti vedere. Dōng Ào dice: Va bene, ma adesso sono molto stanco e non voglio andarci. Xiǎo Mǐn dice: Non preoccuparti, vengo con te.",
      fr: "Aujourd'hui, Dōng Ào a mal à la tête et aussi à la gorge. Il a un peu de fièvre. Xiǎo Mǐn dit : Tu devrais aller à l'hôpital pour te faire examiner. Dōng Ào dit : D'accord, mais là je suis très fatigué et je ne veux pas y aller. Xiǎo Mǐn dit : Ne t'inquiète pas, je viens avec toi.",
      de: 'Heute hat Dōng Ào Kopfschmerzen und auch Halsschmerzen. Er hat etwas Fieber. Xiǎo Mǐn sagt: Du solltest ins Krankenhaus gehen, um dich untersuchen zu lassen. Dōng Ào sagt: Gut, aber gerade bin ich sehr müde und will nicht gehen. Xiǎo Mǐn sagt: Keine Sorge, ich gehe mit dir.',
      pt: 'Hoje o Dōng Ào tem dor de cabeça e também dor de garganta. Tem um pouco de febre. A Xiǎo Mǐn diz: Devias ir ao hospital para te verem. O Dōng Ào diz: Está bem, mas agora estou muito cansado e não quero ir. A Xiǎo Mǐn diz: Não te preocupes, vou contigo.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Qué le duele a 东奥?', en: 'What hurts 东奥?', it: 'Cosa fa male a 东奥?', fr: "Qu'est-ce qui fait mal à 东奥 ?", de: 'Was tut 东奥 weh?', pt: 'O que dói a 东奥?' },
        opciones: ['头和嗓子', '嗓子和胃', '头和腿', '眼睛和头'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué le recomienda 晓敏?', en: 'What does 晓敏 recommend?', it: 'Cosa consiglia 晓敏?', fr: 'Que recommande 晓敏 ?', de: 'Was empfiehlt 晓敏?', pt: 'O que recomenda 晓敏?' },
        opciones: ['去医院看病', '多休息', '吃药', '不去上课'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué decide 晓敏 al final?', en: 'What does 晓敏 decide in the end?', it: 'Cosa decide 晓敏 alla fine?', fr: 'Que décide 晓敏 à la fin ?', de: 'Was beschließt 晓敏 am Ende?', pt: 'O que decide 晓敏 no final?' },
        opciones: ['跟东奥一起去医院', '回宿舍', '去上课', '打电话'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: 'A 东奥 le duele la cabeza.', en: '东奥 has a headache.', it: 'A 东奥 fa male la testa.', fr: '东奥 a mal à la tête.', de: '东奥 hat Kopfschmerzen.', pt: 'O 东奥 tem dor de cabeça.' }, correcta: true },
      { afirmacion: { es: '东奥 no tiene fiebre.', en: '东奥 does not have a fever.', it: '东奥 non ha la febbre.', fr: "东奥 n'a pas de fièvre.", de: '东奥 hat kein Fieber.', pt: 'O 东奥 não tem febre.' }, correcta: false },
      { afirmacion: { es: '晓敏 va al hospital con 东奥.', en: '晓敏 goes to the hospital with 东奥.', it: '晓敏 va in ospedale con 东奥.', fr: "晓敏 va à l'hôpital avec 东奥.", de: '晓敏 geht mit 东奥 ins Krankenhaus.', pt: 'A 晓敏 vai ao hospital com o 东奥.' }, correcta: true },
    ],
    cloze: [
      { texto: '今天东奥＿＿疼。', opciones: ['头', '手', '脚', '眼睛'], correcta: 0 },
      { texto: '他有点儿＿＿。', opciones: ['发烧', '高兴', '累', '忙'], correcta: 0 },
      { texto: '你应该去医院＿＿。', opciones: ['看病', '上课', '吃饭', '回家'], correcta: 0 },
    ],
  },

  {
    id: 'rc-t8-2',
    tema: 8,
    titulo: '看病',
    tituloTr: { es: 'En el médico', en: 'At the doctor', it: 'Dal medico', fr: 'Chez le médecin', de: 'Beim Arzt', pt: 'No médico' },
    hanzi: '东奥去医院看病。大夫说：你哪儿不舒服？东奥说：全身都不舒服，嗓子发炎了。大夫量了体温：三十八度四。大夫说：不用打针，多喝水，多休息，吃点儿中药。',
    pinyin: 'Dōng Ào qù yīyuàn kànbìng. Dàifu shuō: nǐ nǎr bù shūfu? Dōng Ào shuō: quánshēn dōu bù shūfu, sǎngzi fāyán le. Dàifu liáng le tǐwēn: sānshí bā dù sì. Dàifu shuō: bùyòng dǎzhēn, duō hē shuǐ, duō xiūxi, chī diǎnr zhōngyào.',
    traduccion: {
      es: 'Dōng Ào va al hospital. El médico dice: ¿Qué le duele? Dōng Ào dice: Me encuentro mal por todo el cuerpo, tengo la garganta inflamada. El médico le tomó la temperatura: 38,4 grados. El médico dice: No hace falta inyección, beba mucha agua, descanse mucho y tome un poco de medicina tradicional china.',
      en: "Dōng Ào goes to the hospital. The doctor says: What's wrong? Dōng Ào says: I feel unwell all over, my throat is inflamed. The doctor took his temperature: 38.4 degrees. The doctor says: You don't need an injection, drink plenty of water, rest a lot and take some traditional Chinese medicine.",
      it: "Dōng Ào va in ospedale. Il medico dice: Cosa le fa male? Dōng Ào dice: Mi sento male in tutto il corpo, ho la gola infiammata. Il medico gli ha misurato la temperatura: 38,4 gradi. Il medico dice: Non serve l'iniezione, beva molta acqua, riposi molto e prenda un po' di medicina tradizionale cinese.",
      fr: "Dōng Ào va à l'hôpital. Le médecin dit : Où avez-vous mal ? Dōng Ào dit : Je me sens mal dans tout le corps, j'ai la gorge enflammée. Le médecin a pris sa température : 38,4 degrés. Le médecin dit : Pas besoin de piqûre, buvez beaucoup d'eau, reposez-vous bien et prenez un peu de médecine traditionnelle chinoise.",
      de: 'Dōng Ào geht ins Krankenhaus. Der Arzt sagt: Wo tut es weh? Dōng Ào sagt: Mir geht es am ganzen Körper schlecht, mein Hals ist entzündet. Der Arzt maß seine Temperatur: 38,4 Grad. Der Arzt sagt: Eine Spritze ist nicht nötig, trinken Sie viel Wasser, ruhen Sie sich gut aus und nehmen Sie etwas traditionelle chinesische Medizin.',
      pt: 'O Dōng Ào vai ao hospital. O médico diz: O que lhe dói? O Dōng Ào diz: Sinto-me mal no corpo todo, tenho a garganta inflamada. O médico mediu-lhe a temperatura: 38,4 graus. O médico diz: Não precisa de injeção, beba muita água, descanse bastante e tome um pouco de medicina tradicional chinesa.',
    },
    preguntas: [
      {
        pregunta: { es: '¿Qué tiene 东奥 en la garganta?', en: 'What does 东奥 have in his throat?', it: 'Cosa ha 东奥 alla gola?', fr: "Qu'est-ce que 东奥 a à la gorge ?", de: 'Was hat 东奥 im Hals?', pt: 'O que tem 东奥 na garganta?' },
        opciones: ['发炎', '发烧', '疼', '没问题'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Cuál es la temperatura de 东奥?', en: "What is 东奥's temperature?", it: 'Qual è la temperatura di 东奥?', fr: 'Quelle est la température de 东奥 ?', de: 'Wie hoch ist 东奥s Temperatur?', pt: 'Qual é a temperatura de 东奥?' },
        opciones: ['三十八度四', '三十七度', '三十九度', '三十八度'],
        correcta: 0,
      },
      {
        pregunta: { es: '¿Qué le dice el médico que NO necesita?', en: 'What does the doctor say he does NOT need?', it: 'Cosa dice il medico che NON gli serve?', fr: "Que dit le médecin qu'il n'a PAS besoin ?", de: 'Was sagt der Arzt, dass er NICHT braucht?', pt: 'O que diz o médico que ele NÃO precisa?' },
        opciones: ['打针', '喝水', '休息', '吃药'],
        correcta: 0,
      },
    ],
    vf: [
      { afirmacion: { es: '东奥 tiene la garganta inflamada.', en: "东奥's throat is inflamed.", it: '东奥 ha la gola infiammata.', fr: '东奥 a la gorge enflammée.', de: '东奥s Hals ist entzündet.', pt: 'O 东奥 tem a garganta inflamada.' }, correcta: true },
      { afirmacion: { es: 'El médico dice que necesita una inyección.', en: 'The doctor says he needs an injection.', it: "Il medico dice che gli serve un'iniezione.", fr: "Le médecin dit qu'il a besoin d'une piqûre.", de: 'Der Arzt sagt, er braucht eine Spritze.', pt: 'O médico diz que ele precisa de uma injeção.' }, correcta: false },
      { afirmacion: { es: 'El médico recomienda beber mucha agua.', en: 'The doctor recommends drinking lots of water.', it: 'Il medico consiglia di bere molta acqua.', fr: "Le médecin recommande de boire beaucoup d'eau.", de: 'Der Arzt empfiehlt, viel Wasser zu trinken.', pt: 'O médico recomenda beber muita água.' }, correcta: true },
    ],
    cloze: [
      { texto: '东奥去医院＿＿。', opciones: ['看病', '上课', '买东西', '吃饭'], correcta: 0 },
      { texto: '大夫量了＿＿：三十八度四。', opciones: ['体温', '身体', '嗓子', '时间'], correcta: 0 },
      { texto: '多喝水，多＿＿。', opciones: ['休息', '打针', '上课', '工作'], correcta: 0 },
    ],
  },
];

// Helpers
export function getStoriesByTema(tema) {
  return READING_STORIES.filter(s => s.tema === tema);
}

export function getStoryById(id) {
  return READING_STORIES.find(s => s.id === id) || null;
}
