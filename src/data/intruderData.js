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

  // === Lección 5 — Cumpleaños, fiestas, horóscopo ===
  {
    lesson: 5,
    items: ['生日', '聚会', '礼物', '医院'],
    intruder: '医院',
    category: { es: 'Cumpleaños y fiestas', en: 'Birthdays and parties', fr: 'Anniversaires et fêtes', de: 'Geburtstage und Feiern', it: 'Compleanni e feste', pt: 'Aniversários e festas' },
    hint: { es: 'Tres se relacionan con celebrar', en: 'Three are linked to celebrating', fr: 'Trois sont liés à la fête', de: 'Drei haben mit Feiern zu tun', it: 'Tre sono legati al festeggiare', pt: 'Três estão ligados a comemorar' },
  },
  {
    lesson: 5,
    items: ['唱', '跳', '吃', '红'],
    intruder: '红',
    category: { es: 'Verbos de acción', en: 'Action verbs', fr: 'Verbes d\'action', de: 'Aktionsverben', it: 'Verbi di azione', pt: 'Verbos de ação' },
    hint: { es: 'Tres son acciones, uno es un color', en: 'Three are actions, one is a colour', fr: 'Trois sont des actions, un est une couleur', de: 'Drei sind Handlungen, eines eine Farbe', it: 'Tre sono azioni, uno è un colore', pt: 'Três são ações, uma é uma cor' },
  },
  {
    lesson: 5,
    items: ['龙', '马', '羊', '人'],
    intruder: '人',
    category: { es: 'Animales del horóscopo', en: 'Zodiac animals', fr: 'Animaux du zodiaque', de: 'Tierkreistiere', it: 'Animali dello zodiaco', pt: 'Animais do zodíaco' },
    hint: { es: 'Tres son del horóscopo chino', en: 'Three are zodiac animals', fr: 'Trois sont du zodiaque chinois', de: 'Drei gehören zum chinesischen Tierkreis', it: 'Tre sono dello zodiaco cinese', pt: 'Três são do zodíaco chinês' },
  },
  {
    lesson: 5,
    items: ['星期一', '星期三', '星期日', '月'],
    intruder: '月',
    category: { es: 'Días de la semana', en: 'Days of the week', fr: 'Jours de la semaine', de: 'Wochentage', it: 'Giorni della settimana', pt: 'Dias da semana' },
    hint: { es: 'Tres son días, uno es "mes"', en: 'Three are days, one is "month"', fr: 'Trois sont des jours, un est « mois »', de: 'Drei sind Tage, eines ist „Monat"', it: 'Tre sono giorni, uno è "mese"', pt: 'Três são dias, um é "mês"' },
  },

  // === Lección 6 — Lugares y direcciones ===
  {
    lesson: 6,
    items: ['北', '南', '东', '里'],
    intruder: '里',
    category: { es: 'Puntos cardinales', en: 'Cardinal points', fr: 'Points cardinaux', de: 'Himmelsrichtungen', it: 'Punti cardinali', pt: 'Pontos cardeais' },
    hint: { es: 'Tres son direcciones cardinales', en: 'Three are cardinal directions', fr: 'Trois sont des points cardinaux', de: 'Drei sind Himmelsrichtungen', it: 'Tre sono direzioni cardinali', pt: 'Três são direções cardeais' },
  },
  {
    lesson: 6,
    items: ['图书馆', '食堂', '宿舍', '苹果'],
    intruder: '苹果',
    category: { es: 'Lugares del campus', en: 'Campus places', fr: 'Lieux du campus', de: 'Orte auf dem Campus', it: 'Luoghi del campus', pt: 'Lugares do campus' },
    hint: { es: 'Tres son lugares de la universidad', en: 'Three are university places', fr: 'Trois sont des lieux universitaires', de: 'Drei sind Orte an der Uni', it: 'Tre sono luoghi universitari', pt: 'Três são lugares da universidade' },
  },
  {
    lesson: 6,
    items: ['旁边', '对面', '里边', '现在'],
    intruder: '现在',
    category: { es: 'Posiciones espaciales', en: 'Spatial positions', fr: 'Positions spatiales', de: 'Räumliche Positionen', it: 'Posizioni spaziali', pt: 'Posições espaciais' },
    hint: { es: 'Tres indican ubicación', en: 'Three indicate location', fr: 'Trois indiquent un emplacement', de: 'Drei zeigen einen Ort an', it: 'Tre indicano posizione', pt: 'Três indicam localização' },
  },
  {
    lesson: 6,
    items: ['银行', '医院', '超市', '老师'],
    intruder: '老师',
    category: { es: 'Edificios públicos', en: 'Public buildings', fr: 'Bâtiments publics', de: 'Öffentliche Gebäude', it: 'Edifici pubblici', pt: 'Edifícios públicos' },
    hint: { es: 'Tres son sitios de la ciudad', en: 'Three are city places', fr: 'Trois sont des lieux de la ville', de: 'Drei sind Orte in der Stadt', it: 'Tre sono luoghi cittadini', pt: 'Três são lugares da cidade' },
  },

  // === Lección 7 — Compras, dinero, ropa ===
  {
    lesson: 7,
    items: ['苹果', '草莓', '葡萄', '衬衫'],
    intruder: '衬衫',
    category: { es: 'Frutas', en: 'Fruits', fr: 'Fruits', de: 'Obst', it: 'Frutta', pt: 'Frutas' },
    hint: { es: 'Tres son frutas', en: 'Three are fruits', fr: 'Trois sont des fruits', de: 'Drei sind Obstsorten', it: 'Tre sono frutta', pt: 'Três são frutas' },
  },
  {
    lesson: 7,
    items: ['衬衫', '牛仔裤', '裙子', '钱'],
    intruder: '钱',
    category: { es: 'Prendas de ropa', en: 'Clothing items', fr: 'Vêtements', de: 'Kleidungsstücke', it: 'Capi di abbigliamento', pt: 'Peças de roupa' },
    hint: { es: 'Tres son ropa', en: 'Three are clothes', fr: 'Trois sont des vêtements', de: 'Drei sind Kleidungsstücke', it: 'Tre sono vestiti', pt: 'Três são roupas' },
  },
  {
    lesson: 7,
    items: ['块', '元', '毛', '斤'],
    intruder: '斤',
    category: { es: 'Unidades de dinero', en: 'Money units', fr: 'Unités monétaires', de: 'Geldeinheiten', it: 'Unità monetarie', pt: 'Unidades monetárias' },
    hint: { es: 'Tres son monedas, uno es peso', en: 'Three are money, one is weight', fr: 'Trois sont de la monnaie, un est un poids', de: 'Drei sind Geld, eines ist Gewicht', it: 'Tre sono soldi, uno è peso', pt: 'Três são dinheiro, um é peso' },
  },
  {
    lesson: 7,
    items: ['红色', '黑色', '绿色', '一点儿'],
    intruder: '一点儿',
    category: { es: 'Colores', en: 'Colours', fr: 'Couleurs', de: 'Farben', it: 'Colori', pt: 'Cores' },
    hint: { es: 'Tres son colores', en: 'Three are colours', fr: 'Trois sont des couleurs', de: 'Drei sind Farben', it: 'Tre sono colori', pt: 'Três são cores' },
  },

  // === Lección 8 — Salud y cuerpo ===
  {
    lesson: 8,
    items: ['头', '嗓子', '眼睛', '床'],
    intruder: '床',
    category: { es: 'Partes del cuerpo', en: 'Body parts', fr: 'Parties du corps', de: 'Körperteile', it: 'Parti del corpo', pt: 'Partes do corpo' },
    hint: { es: 'Tres son partes del cuerpo', en: 'Three are body parts', fr: 'Trois sont des parties du corps', de: 'Drei sind Körperteile', it: 'Tre sono parti del corpo', pt: 'Três são partes do corpo' },
  },
  {
    lesson: 8,
    items: ['医院', '药', '医生', '快乐'],
    intruder: '快乐',
    category: { es: 'Mundo médico', en: 'Medical world', fr: 'Monde médical', de: 'Medizinische Welt', it: 'Mondo medico', pt: 'Mundo médico' },
    hint: { es: 'Tres están en un hospital', en: 'Three belong in a hospital', fr: 'Trois sont à l\'hôpital', de: 'Drei findest du im Krankenhaus', it: 'Tre stanno in ospedale', pt: 'Três estão no hospital' },
  },
  {
    lesson: 8,
    items: ['疼', '不舒服', '发烧', '便宜'],
    intruder: '便宜',
    category: { es: 'Síntomas', en: 'Symptoms', fr: 'Symptômes', de: 'Symptome', it: 'Sintomi', pt: 'Sintomas' },
    hint: { es: 'Tres describen molestias', en: 'Three describe discomfort', fr: 'Trois décrivent un malaise', de: 'Drei beschreiben Beschwerden', it: 'Tre descrivono malesseri', pt: 'Três descrevem mal-estar' },
  },
  {
    lesson: 8,
    items: ['睡觉', '起床', '休息', '唱歌'],
    intruder: '唱歌',
    category: { es: 'Rutinas de descanso', en: 'Rest routines', fr: 'Routines de repos', de: 'Erholungsroutinen', it: 'Routine di riposo', pt: 'Rotinas de descanso' },
    hint: { es: 'Tres tienen que ver con descansar', en: 'Three are about resting', fr: 'Trois concernent le repos', de: 'Drei haben mit Ausruhen zu tun', it: 'Tre riguardano il riposo', pt: 'Três têm a ver com descansar' },
  },
];

export default intruderData;
