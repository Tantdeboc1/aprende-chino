// src/data/completeSentenceData.js
// Datos para "Completa la frase" — frase con hueco, elige el carácter correcto
// Cada entrada tiene: sentence (con ___ como hueco), answer, options, lesson, translations

const completeSentenceData = [
  // === Lección 1 ===
  {
    lesson: 1,
    sentence: '你___吗？',
    answer: '好',
    options: ['好', '大', '人', '我'],
    translations: { es: '¿Estás ___?', en: 'Are you ___?', fr: 'Tu vas ___?', de: 'Geht es dir ___?', it: 'Stai ___?', pt: 'Você está ___?' },
    hint: 'hǎo',
  },
  {
    lesson: 1,
    sentence: '___很忙。',
    answer: '我',
    options: ['我', '你', '他', '她'],
    translations: { es: '___ estoy muy ocupado.', en: '___ am very busy.', fr: '___ suis très occupé.', de: '___ bin sehr beschäftigt.', it: '___ sono molto occupato.', pt: '___ estou muito ocupado.' },
    hint: 'wǒ',
  },
  {
    lesson: 1,
    sentence: '他___老师。',
    answer: '是',
    options: ['是', '不', '很', '也'],
    translations: { es: 'Él ___ profesor.', en: 'He ___ a teacher.', fr: 'Il ___ professeur.', de: 'Er ___ Lehrer.', it: 'Lui ___ professore.', pt: 'Ele ___ professor.' },
    hint: 'shì',
  },
  {
    lesson: 1,
    sentence: '你好___？',
    answer: '吗',
    options: ['吗', '呢', '的', '了'],
    translations: { es: '¿Estás bien___?', en: 'Are you well___?', fr: 'Tu vas bien___?', de: 'Geht es dir gut___?', it: 'Stai bene___?', pt: 'Você está bem___?' },
    hint: 'ma',
  },
  {
    lesson: 1,
    sentence: '她___是学生。',
    answer: '也',
    options: ['也', '不', '很', '都'],
    translations: { es: 'Ella ___ es estudiante.', en: 'She ___ is a student.', fr: 'Elle ___ est étudiante.', de: 'Sie ___ ist Studentin.', it: 'Anche lei ___ studentessa.', pt: 'Ela ___ é estudante.' },
    hint: 'yě',
  },
  {
    lesson: 1,
    sentence: '我___忙。',
    answer: '不',
    options: ['不', '很', '也', '是'],
    translations: { es: 'Yo ___ estoy ocupado.', en: 'I am ___ busy.', fr: 'Je ne suis ___ occupé.', de: 'Ich bin ___ beschäftigt.', it: '___ sono occupato.', pt: '___ estou ocupado.' },
    hint: 'bù',
  },

  // === Lección 2 ===
  {
    lesson: 2,
    sentence: '你是___国人？',
    answer: '哪',
    options: ['哪', '那', '这', '什'],
    translations: { es: '¿De ___ país eres?', en: '___ country are you from?', fr: 'De ___ pays es-tu?', de: 'Aus ___ Land kommst du?', it: 'Di ___ paese sei?', pt: 'De ___ país você é?' },
    hint: 'nǎ',
  },
  {
    lesson: 2,
    sentence: '我是中国___。',
    answer: '人',
    options: ['人', '大', '国', '的'],
    translations: { es: 'Soy chino/a___.', en: 'I am Chinese___.', fr: 'Je suis Chinois___.', de: 'Ich bin Chinese___.', it: 'Sono cinese___.', pt: 'Sou chinês/a___.' },
    hint: 'rén',
  },
  {
    lesson: 2,
    sentence: '她叫___名字？',
    answer: '什么',
    options: ['什么', '哪个', '怎么', '多少'],
    translations: { es: '¿___ se llama ella?', en: '___ is her name?', fr: '___ est son nom?', de: '___ ist ihr Name?', it: '___ si chiama lei?', pt: '___ é o nome dela?' },
    hint: 'shénme',
  },
  {
    lesson: 2,
    sentence: '他说___语。',
    answer: '汉',
    options: ['汉', '中', '英', '法'],
    translations: { es: 'Él habla ___.', en: 'He speaks ___.', fr: 'Il parle ___.', de: 'Er spricht ___.', it: 'Lui parla ___.', pt: 'Ele fala ___.' },
    hint: 'hàn',
  },
  {
    lesson: 2,
    sentence: '___认识他吗？',
    answer: '你',
    options: ['你', '我', '她', '们'],
    translations: { es: '¿___ lo conoces?', en: 'Do ___ know him?', fr: '___ le connais?', de: 'Kennst ___ ihn?', it: '___ lo conosci?', pt: '___ o conhece?' },
    hint: 'nǐ',
  },

  // === Lección 3 ===
  {
    lesson: 3,
    sentence: '你家有___口人？',
    answer: '几',
    options: ['几', '多', '什', '哪'],
    translations: { es: '¿___ personas hay en tu familia?', en: 'How ___ people are in your family?', fr: '___ de personnes dans ta famille?', de: '___ viele Personen sind in deiner Familie?', it: '___ persone ci sono nella tua famiglia?', pt: '___ pessoas há na sua família?' },
    hint: 'jǐ',
  },
  {
    lesson: 3,
    sentence: '我___有一个姐姐。',
    answer: '还',
    options: ['还', '也', '都', '很'],
    translations: { es: '___ tengo una hermana mayor.', en: 'I ___ have an older sister.', fr: "J'ai ___ une grande soeur.", de: 'Ich habe ___ eine ältere Schwester.', it: 'Ho ___ una sorella maggiore.', pt: '___ tenho uma irmã mais velha.' },
    hint: 'hái',
  },
  {
    lesson: 3,
    sentence: '他有两个___子。',
    answer: '儿',
    options: ['儿', '女', '孩', '人'],
    translations: { es: 'Él tiene dos ___.', en: 'He has two ___.', fr: 'Il a deux ___.', de: 'Er hat zwei ___.', it: 'Ha due ___.', pt: 'Ele tem dois ___.' },
    hint: 'ér',
  },
  {
    lesson: 3,
    sentence: '这是我___。',
    answer: '的',
    options: ['的', '了', '吗', '呢'],
    translations: { es: 'Esto es ___ mío.', en: 'This is ___.', fr: "C'est ___ moi.", de: 'Das ist ___.', it: 'Questo è ___.', pt: 'Isto é ___ meu.' },
    hint: 'de',
  },

  // === Lección 4 ===
  {
    lesson: 4,
    sentence: '现在___点？',
    answer: '几',
    options: ['几', '多', '什', '哪'],
    translations: { es: '¿Qué ___ es?', en: 'What ___ is it?', fr: 'Quelle ___ est-il?', de: 'Wie viel ___ ist es?', it: 'Che ___ è?', pt: 'Que ___ são?' },
    hint: 'jǐ',
  },
  {
    lesson: 4,
    sentence: '我___天有课。',
    answer: '明',
    options: ['明', '今', '昨', '每'],
    translations: { es: '___ tengo clase.', en: 'I have class ___.', fr: "J'ai cours ___.", de: '___ habe ich Unterricht.', it: '___ ho lezione.', pt: '___ tenho aula.' },
    hint: 'míng',
  },
  {
    lesson: 4,
    sentence: '下午三___上课。',
    answer: '点',
    options: ['点', '时', '分', '刻'],
    translations: { es: 'La clase es a las tres ___ de la tarde.', en: "Class is at three ___ in the afternoon.", fr: 'Le cours est à trois ___ de l\'après-midi.', de: 'Der Unterricht ist um drei ___ nachmittags.', it: 'La lezione è alle tre ___ del pomeriggio.', pt: 'A aula é às três ___ da tarde.' },
    hint: 'diǎn',
  },
  {
    lesson: 4,
    sentence: '你___期几有课？',
    answer: '星',
    options: ['星', '月', '日', '年'],
    translations: { es: '¿Qué día de la ___mana tienes clase?', en: 'What day of the ___ do you have class?', fr: 'Quel jour de la ___maine as-tu cours?', de: 'An welchem ___tag hast du Unterricht?', it: 'Che giorno della ___mana hai lezione?', pt: 'Que dia da ___mana você tem aula?' },
    hint: 'xīng',
  },
];

export default completeSentenceData;
