// src/data/intruderData.js
// Datos para "Encuentra el intruso" — 4 caracteres, uno no pertenece al grupo
// category: razón por la que los 3 van juntos

const intruderData = [
  // === Lección 1 — Pronombres, saludos, básicos ===
  {
    lesson: 1,
    items: ['我', '你', '他', '大'],
    intruder: '大',
    category: { es: 'Pronombres personales', en: 'Personal pronouns', fr: 'Pronoms personnels', de: 'Personalpronomen', it: 'Pronomi personali', pt: 'Pronomes pessoais' },
    hint: { es: 'Tres son pronombres', en: 'Three are pronouns', fr: 'Trois sont des pronoms', de: 'Drei sind Pronomen', it: 'Tre sono pronomi', pt: 'Três são pronomes' },
  },
  {
    lesson: 1,
    items: ['好', '忙', '高', '是'],
    intruder: '是',
    category: { es: 'Adjetivos', en: 'Adjectives', fr: 'Adjectifs', de: 'Adjektive', it: 'Aggettivi', pt: 'Adjetivos' },
    hint: { es: 'Tres describen cualidades', en: 'Three describe qualities', fr: 'Trois décrivent des qualités', de: 'Drei beschreiben Eigenschaften', it: 'Tre descrivono qualità', pt: 'Três descrevem qualidades' },
  },
  {
    lesson: 1,
    items: ['她', '他', '我', '吗'],
    intruder: '吗',
    category: { es: 'Pronombres', en: 'Pronouns', fr: 'Pronoms', de: 'Pronomen', it: 'Pronomi', pt: 'Pronomes' },
    hint: { es: 'Tres se refieren a personas', en: 'Three refer to people', fr: 'Trois désignent des personnes', de: 'Drei beziehen sich auf Personen', it: 'Tre si riferiscono a persone', pt: 'Três referem-se a pessoas' },
  },
  {
    lesson: 1,
    items: ['老师', '学生', '同学', '很'],
    intruder: '很',
    category: { es: 'Personas/roles', en: 'People/roles', fr: 'Personnes/rôles', de: 'Personen/Rollen', it: 'Persone/ruoli', pt: 'Pessoas/funções' },
    hint: { es: 'Tres son personas', en: 'Three are people', fr: 'Trois sont des personnes', de: 'Drei sind Personen', it: 'Tre sono persone', pt: 'Três são pessoas' },
  },

  // === Lección 2 — Países, idiomas, nacionalidades ===
  {
    lesson: 2,
    items: ['中国', '英国', '法国', '汉语'],
    intruder: '汉语',
    category: { es: 'Países', en: 'Countries', fr: 'Pays', de: 'Länder', it: 'Paesi', pt: 'Países' },
    hint: { es: 'Tres son países', en: 'Three are countries', fr: 'Trois sont des pays', de: 'Drei sind Länder', it: 'Tre sono paesi', pt: 'Três são países' },
  },
  {
    lesson: 2,
    items: ['说', '读', '写', '国'],
    intruder: '国',
    category: { es: 'Verbos de comunicación', en: 'Communication verbs', fr: 'Verbes de communication', de: 'Kommunikationsverben', it: 'Verbi di comunicazione', pt: 'Verbos de comunicação' },
    hint: { es: 'Tres son acciones del idioma', en: 'Three are language actions', fr: 'Trois sont des actions de langue', de: 'Drei sind Sprachhandlungen', it: 'Tre sono azioni linguistiche', pt: 'Três são ações de linguagem' },
  },
  {
    lesson: 2,
    items: ['哪', '什么', '谁', '和'],
    intruder: '和',
    category: { es: 'Palabras interrogativas', en: 'Question words', fr: 'Mots interrogatifs', de: 'Fragewörter', it: 'Parole interrogative', pt: 'Palavras interrogativas' },
    hint: { es: 'Tres sirven para preguntar', en: 'Three are used to ask questions', fr: 'Trois servent à poser des questions', de: 'Drei dienen zum Fragen', it: 'Tre servono per chiedere', pt: 'Três servem para perguntar' },
  },

  // === Lección 3 — Familia, números ===
  {
    lesson: 3,
    items: ['爸爸', '妈妈', '姐姐', '朋友'],
    intruder: '朋友',
    category: { es: 'Familia directa', en: 'Family members', fr: 'Famille', de: 'Familienmitglieder', it: 'Famiglia', pt: 'Família' },
    hint: { es: 'Tres son familia', en: 'Three are family', fr: 'Trois font partie de la famille', de: 'Drei gehören zur Familie', it: 'Tre sono famiglia', pt: 'Três são família' },
  },
  {
    lesson: 3,
    items: ['一', '二', '三', '个'],
    intruder: '个',
    category: { es: 'Números', en: 'Numbers', fr: 'Nombres', de: 'Zahlen', it: 'Numeri', pt: 'Números' },
    hint: { es: 'Tres son números', en: 'Three are numbers', fr: 'Trois sont des nombres', de: 'Drei sind Zahlen', it: 'Tre sono numeri', pt: 'Três são numeri' },
  },
  {
    lesson: 3,
    items: ['弟弟', '哥哥', '妹妹', '名字'],
    intruder: '名字',
    category: { es: 'Hermanos', en: 'Siblings', fr: 'Frères et soeurs', de: 'Geschwister', it: 'Fratelli', pt: 'Irmãos' },
    hint: { es: 'Tres son hermanos', en: 'Three are siblings', fr: 'Trois sont des frères et soeurs', de: 'Drei sind Geschwister', it: 'Tre sono fratelli', pt: 'Três são irmãos' },
  },

  // === Lección 4 — Tiempo, horarios ===
  {
    lesson: 4,
    items: ['上午', '下午', '晚上', '学校'],
    intruder: '学校',
    category: { es: 'Momentos del día', en: 'Times of day', fr: 'Moments de la journée', de: 'Tageszeiten', it: 'Momenti del giorno', pt: 'Momentos do dia' },
    hint: { es: 'Tres son periodos del día', en: 'Three are time periods', fr: 'Trois sont des périodes de la journée', de: 'Drei sind Tagesabschnitte', it: 'Tre sono periodi del giorno', pt: 'Três são períodos do dia' },
  },
  {
    lesson: 4,
    items: ['今天', '明天', '昨天', '点'],
    intruder: '点',
    category: { es: 'Días relativos', en: 'Relative days', fr: 'Jours relatifs', de: 'Relative Tage', it: 'Giorni relativi', pt: 'Dias relativos' },
    hint: { es: 'Tres son referencias de día', en: 'Three refer to specific days', fr: 'Trois désignent des jours', de: 'Drei beziehen sich auf Tage', it: 'Tre si riferiscono a giorni', pt: 'Três referem-se a dias' },
  },
  {
    lesson: 4,
    items: ['星期一', '星期二', '星期三', '分钟'],
    intruder: '分钟',
    category: { es: 'Días de la semana', en: 'Days of the week', fr: 'Jours de la semaine', de: 'Wochentage', it: 'Giorni della settimana', pt: 'Dias da semana' },
    hint: { es: 'Tres son días de la semana', en: 'Three are days of the week', fr: 'Trois sont des jours de la semaine', de: 'Drei sind Wochentage', it: 'Tre sono giorni della settimana', pt: 'Três são dias da semana' },
  },
  {
    lesson: 4,
    items: ['课', '书', '作业', '年'],
    intruder: '年',
    category: { es: 'Cosas de la escuela', en: 'School items', fr: 'Choses de l\'école', de: 'Schulsachen', it: 'Cose di scuola', pt: 'Coisas da escola' },
    hint: { es: 'Tres son del ámbito escolar', en: 'Three are school-related', fr: 'Trois sont liés à l\'école', de: 'Drei gehören zur Schule', it: 'Tre sono legati alla scuola', pt: 'Três são da escola' },
  },
];

export default intruderData;
