// src/data/translationPhrases.js
// 15 frases para el minijuego "Traduce la Frase"
// Fuente: Corrección Frases de Traducción.pdf

export const translationPhrases = [
  {
    id: 1,
    es: "Profesor/a, ¿cuál es su apellido?",
    hanzi: "老师，您贵姓？",
    pinyin: "Lǎoshī, nín guìxìng?",
  },
  {
    id: 2,
    es: "¿De qué país eres?",
    hanzi: "你是哪国人？",
    pinyin: "Nǐ shì nǎ guó rén?",
  },
  {
    id: 3,
    es: "Soy español/a.",
    hanzi: "我是西班牙人。",
    pinyin: "Wǒ shì Xībānyá rén.",
  },
  {
    id: 4,
    es: "¿Qué les gusta comer a los pekineses?",
    hanzi: "北京人喜欢吃什么？",
    pinyin: "Běijīng rén xǐhuān chī shénme?",
  },
  {
    id: 5,
    es: "Los bollos al vapor y las empanadillas están deliciosos.",
    hanzi: "包子和饺子都很好吃。",
    pinyin: "Bāozi hé jiǎozi dōu hěn hǎochī.",
  },
  {
    id: 6,
    es: "¿Cuántas personas hay en vuestra familia?",
    hanzi: "你们家有几口人？",
    pinyin: "Nǐmen jiā yǒu jǐ kǒu rén?",
  },
  {
    id: 7,
    es: "¿En qué trabajan tus padres?",
    hanzi: "你爸爸妈妈做什么工作？",
    pinyin: "Nǐ bàba māma zuò shénme gōngzuò?",
  },
  {
    id: 8,
    es: "¿El perrito también es un miembro de la familia?",
    hanzi: "小狗也是一口人吗？",
    pinyin: "Xiǎogǒu yě shì yī kǒu rén ma?",
  },
  {
    id: 9,
    es: "¡Vuestra casa es realmente bonita!",
    hanzi: "你们家真漂亮！",
    pinyin: "Nǐmen jiā zhēn piàoliang!",
  },
  {
    id: 10,
    es: "Por la noche ella también tiene clase de inglés.",
    hanzi: "晚上她还有英语课。",
    pinyin: "Wǎnshang tā hái yǒu Yīngyǔ kè.",
  },
  {
    id: 11,
    es: "¿Tienes tiempo mañana por la noche?",
    hanzi: "你明天晚上有没有时间？",
    pinyin: "Nǐ míngtiān wǎnshang yǒu méiyǒu shíjiān?",
  },
  {
    id: 12,
    es: "Vamos a practicar juntos la expresión oral.",
    hanzi: "我们一起练习口语吧。",
    pinyin: "Wǒmen yīqǐ liànxí kǒuyǔ ba.",
  },
  {
    id: 13,
    es: "¿Qué hora es?",
    hanzi: "现在几点了？",
    pinyin: "Xiànzài jǐ diǎn le?",
  },
  {
    id: 14,
    es: "Son las siete menos cinco minutos.",
    hanzi: "差五分七点。",
    pinyin: "Chà wǔ fēn qī diǎn.",
  },
  {
    id: 15,
    es: "¿En total cuántas personas hay en tu clase?",
    hanzi: "你们班一共有多少个人？",
    pinyin: "Nǐmen bān yīgòng yǒu duōshǎo gè rén?",
  },
];

// ── Diccionario pinyin → candidatos hanzi ────────────────────────────────────
// Clave: pinyin sin tonos, todo en minúsculas, sin espacios
// Valor: array de objetos { hanzi, pinyin (con tono marcado) }
// Ordenados por relevancia para el vocabulario de estas 15 frases.
// También se incluyen candidatos comunes fuera de las frases para que el IME
// sea más natural (el usuario puede que escriba algo y ver varias opciones).

export const pinyinDictionary = {
  // 老师
  laoshi:   [{ hanzi: "老师", pinyin: "lǎoshī" }, { hanzi: "老实", pinyin: "lǎoshí" }],
  // 您
  nin:      [{ hanzi: "您", pinyin: "nín" }, { hanzi: "您好", pinyin: "nínhǎo" }],
  // 贵姓
  guixing:  [{ hanzi: "贵姓", pinyin: "guìxìng" }],
  gui:      [{ hanzi: "贵", pinyin: "guì" }, { hanzi: "贵姓", pinyin: "guìxìng" }],
  xing:     [{ hanzi: "姓", pinyin: "xìng" }, { hanzi: "行", pinyin: "xíng" }, { hanzi: "星", pinyin: "xīng" }],
  // 你
  ni:       [{ hanzi: "你", pinyin: "nǐ" }, { hanzi: "泥", pinyin: "ní" }],
  // 是
  shi:      [{ hanzi: "是", pinyin: "shì" }, { hanzi: "时", pinyin: "shí" }, { hanzi: "十", pinyin: "shí" }, { hanzi: "事", pinyin: "shì" }],
  // 哪
  na:       [{ hanzi: "哪", pinyin: "nǎ" }, { hanzi: "那", pinyin: "nà" }, { hanzi: "拿", pinyin: "ná" }],
  nei:      [{ hanzi: "哪", pinyin: "něi" }, { hanzi: "内", pinyin: "nèi" }],
  // 国
  guo:      [{ hanzi: "国", pinyin: "guó" }, { hanzi: "过", pinyin: "guò" }, { hanzi: "果", pinyin: "guǒ" }],
  // 人
  ren:      [{ hanzi: "人", pinyin: "rén" }, { hanzi: "认", pinyin: "rèn" }],
  // 我
  wo:       [{ hanzi: "我", pinyin: "wǒ" }, { hanzi: "握", pinyin: "wò" }],
  // 西班牙
  xibanya:  [{ hanzi: "西班牙", pinyin: "Xībānyá" }],
  xi:       [{ hanzi: "西", pinyin: "xī" }, { hanzi: "喜", pinyin: "xǐ" }, { hanzi: "系", pinyin: "xì" }, { hanzi: "习", pinyin: "xí" }],
  ban:      [{ hanzi: "班", pinyin: "bān" }, { hanzi: "办", pinyin: "bàn" }, { hanzi: "半", pinyin: "bàn" }],
  ya:       [{ hanzi: "牙", pinyin: "yá" }, { hanzi: "呀", pinyin: "ya" }, { hanzi: "亚", pinyin: "yà" }],
  // 北京
  beijing:  [{ hanzi: "北京", pinyin: "Běijīng" }],
  bei:      [{ hanzi: "北", pinyin: "běi" }, { hanzi: "被", pinyin: "bèi" }, { hanzi: "杯", pinyin: "bēi" }],
  jing:     [{ hanzi: "京", pinyin: "jīng" }, { hanzi: "经", pinyin: "jīng" }, { hanzi: "晶", pinyin: "jīng" }],
  // 喜欢
  xihuan:   [{ hanzi: "喜欢", pinyin: "xǐhuān" }],
  huan:     [{ hanzi: "欢", pinyin: "huān" }, { hanzi: "换", pinyin: "huàn" }, { hanzi: "还", pinyin: "huán" }],
  // 吃
  chi:      [{ hanzi: "吃", pinyin: "chī" }, { hanzi: "迟", pinyin: "chí" }],
  // 什么
  shenme:   [{ hanzi: "什么", pinyin: "shénme" }],
  shen:     [{ hanzi: "什", pinyin: "shén" }, { hanzi: "身", pinyin: "shēn" }, { hanzi: "深", pinyin: "shēn" }],
  me:       [{ hanzi: "么", pinyin: "me" }, { hanzi: "没", pinyin: "méi" }],
  // 包子
  baozi:    [{ hanzi: "包子", pinyin: "bāozi" }],
  bao:      [{ hanzi: "包", pinyin: "bāo" }, { hanzi: "报", pinyin: "bào" }, { hanzi: "宝", pinyin: "bǎo" }],
  zi:       [{ hanzi: "子", pinyin: "zi" }, { hanzi: "字", pinyin: "zì" }, { hanzi: "自", pinyin: "zì" }],
  // 和
  he:       [{ hanzi: "和", pinyin: "hé" }, { hanzi: "喝", pinyin: "hē" }, { hanzi: "河", pinyin: "hé" }],
  // 饺子
  jiaozi:   [{ hanzi: "饺子", pinyin: "jiǎozi" }],
  jiao:     [{ hanzi: "饺", pinyin: "jiǎo" }, { hanzi: "叫", pinyin: "jiào" }, { hanzi: "教", pinyin: "jiào" }],
  // 都
  dou:      [{ hanzi: "都", pinyin: "dōu" }, { hanzi: "豆", pinyin: "dòu" }],
  // 很
  hen:      [{ hanzi: "很", pinyin: "hěn" }, { hanzi: "恨", pinyin: "hèn" }],
  // 好吃
  haochi:   [{ hanzi: "好吃", pinyin: "hǎochī" }],
  hao:      [{ hanzi: "好", pinyin: "hǎo" }, { hanzi: "号", pinyin: "hào" }],
  // 你们
  nimen:    [{ hanzi: "你们", pinyin: "nǐmen" }],
  // 家
  jia:      [{ hanzi: "家", pinyin: "jiā" }, { hanzi: "假", pinyin: "jiǎ" }, { hanzi: "价", pinyin: "jià" }],
  // 有
  you:      [{ hanzi: "有", pinyin: "yǒu" }, { hanzi: "又", pinyin: "yòu" }, { hanzi: "右", pinyin: "yòu" }],
  // 几
  ji:       [{ hanzi: "几", pinyin: "jǐ" }, { hanzi: "机", pinyin: "jī" }, { hanzi: "鸡", pinyin: "jī" }],
  // 口
  kou:      [{ hanzi: "口", pinyin: "kǒu" }, { hanzi: "扣", pinyin: "kòu" }],
  // 爸爸
  baba:     [{ hanzi: "爸爸", pinyin: "bàba" }],
  ba:       [{ hanzi: "爸", pinyin: "bà" }, { hanzi: "吧", pinyin: "ba" }, { hanzi: "八", pinyin: "bā" }],
  // 妈妈
  mama:     [{ hanzi: "妈妈", pinyin: "māma" }],
  ma:       [{ hanzi: "妈", pinyin: "mā" }, { hanzi: "吗", pinyin: "ma" }, { hanzi: "马", pinyin: "mǎ" }],
  // 做
  zuo:      [{ hanzi: "做", pinyin: "zuò" }, { hanzi: "坐", pinyin: "zuò" }, { hanzi: "左", pinyin: "zuǒ" }],
  // 工作
  gongzuo:  [{ hanzi: "工作", pinyin: "gōngzuò" }],
  gong:     [{ hanzi: "工", pinyin: "gōng" }, { hanzi: "共", pinyin: "gòng" }, { hanzi: "公", pinyin: "gōng" }],
  zuo2:     [{ hanzi: "作", pinyin: "zuò" }, { hanzi: "做", pinyin: "zuò" }],
  // 小狗
  xiaogou:  [{ hanzi: "小狗", pinyin: "xiǎogǒu" }],
  xiao:     [{ hanzi: "小", pinyin: "xiǎo" }, { hanzi: "校", pinyin: "xiào" }, { hanzi: "笑", pinyin: "xiào" }],
  gou:      [{ hanzi: "狗", pinyin: "gǒu" }, { hanzi: "够", pinyin: "gòu" }],
  // 也
  ye:       [{ hanzi: "也", pinyin: "yě" }, { hanzi: "业", pinyin: "yè" }, { hanzi: "夜", pinyin: "yè" }],
  // 一
  yi:       [{ hanzi: "一", pinyin: "yī" }, { hanzi: "已", pinyin: "yǐ" }, { hanzi: "以", pinyin: "yǐ" }],
  // 吗
  // (ya incluido arriba en ma)
  // 真
  zhen:     [{ hanzi: "真", pinyin: "zhēn" }, { hanzi: "珍", pinyin: "zhēn" }],
  // 漂亮
  piaoliang: [{ hanzi: "漂亮", pinyin: "piàoliang" }],
  piao:     [{ hanzi: "漂", pinyin: "piào" }, { hanzi: "票", pinyin: "piào" }],
  liang:    [{ hanzi: "亮", pinyin: "liàng" }, { hanzi: "两", pinyin: "liǎng" }, { hanzi: "量", pinyin: "liàng" }],
  // 晚上
  wanshang: [{ hanzi: "晚上", pinyin: "wǎnshang" }],
  wan:      [{ hanzi: "晚", pinyin: "wǎn" }, { hanzi: "万", pinyin: "wàn" }, { hanzi: "完", pinyin: "wán" }],
  shang:    [{ hanzi: "上", pinyin: "shàng" }, { hanzi: "商", pinyin: "shāng" }],
  // 她
  ta:       [{ hanzi: "她", pinyin: "tā" }, { hanzi: "他", pinyin: "tā" }, { hanzi: "它", pinyin: "tā" }],
  // 还
  hai:      [{ hanzi: "还", pinyin: "hái" }, { hanzi: "海", pinyin: "hǎi" }, { hanzi: "害", pinyin: "hài" }],
  // 英语
  yingyu:   [{ hanzi: "英语", pinyin: "Yīngyǔ" }],
  ying:     [{ hanzi: "英", pinyin: "yīng" }, { hanzi: "应", pinyin: "yīng" }],
  yu:       [{ hanzi: "语", pinyin: "yǔ" }, { hanzi: "鱼", pinyin: "yú" }, { hanzi: "于", pinyin: "yú" }],
  // 课
  ke:       [{ hanzi: "课", pinyin: "kè" }, { hanzi: "可", pinyin: "kě" }, { hanzi: "客", pinyin: "kè" }],
  // 明天
  mingtian: [{ hanzi: "明天", pinyin: "míngtiān" }],
  ming:     [{ hanzi: "明", pinyin: "míng" }, { hanzi: "名", pinyin: "míng" }, { hanzi: "命", pinyin: "mìng" }],
  tian:     [{ hanzi: "天", pinyin: "tiān" }, { hanzi: "田", pinyin: "tián" }],
  // 没有
  meiyou:   [{ hanzi: "没有", pinyin: "méiyǒu" }],
  mei:      [{ hanzi: "没", pinyin: "méi" }, { hanzi: "每", pinyin: "měi" }, { hanzi: "美", pinyin: "měi" }],
  // 时间
  shijian:  [{ hanzi: "时间", pinyin: "shíjiān" }],
  jian:     [{ hanzi: "间", pinyin: "jiān" }, { hanzi: "见", pinyin: "jiàn" }, { hanzi: "简", pinyin: "jiǎn" }],
  // 我们
  women:    [{ hanzi: "我们", pinyin: "wǒmen" }],
  men:      [{ hanzi: "们", pinyin: "men" }],
  // 一起
  yiqi:     [{ hanzi: "一起", pinyin: "yīqǐ" }],
  qi:       [{ hanzi: "起", pinyin: "qǐ" }, { hanzi: "气", pinyin: "qì" }, { hanzi: "期", pinyin: "qī" }],
  // 练习
  lianxi:   [{ hanzi: "练习", pinyin: "liànxí" }],
  lian:     [{ hanzi: "练", pinyin: "liàn" }, { hanzi: "连", pinyin: "lián" }, { hanzi: "脸", pinyin: "liǎn" }],
  // 口语
  kouyu:    [{ hanzi: "口语", pinyin: "kǒuyǔ" }],
  // 吧
  // (ya incluido en ba)
  // 现在
  xianzai:  [{ hanzi: "现在", pinyin: "xiànzài" }],
  xian:     [{ hanzi: "现", pinyin: "xiàn" }, { hanzi: "先", pinyin: "xiān" }, { hanzi: "县", pinyin: "xiàn" }],
  zai:      [{ hanzi: "在", pinyin: "zài" }, { hanzi: "再", pinyin: "zài" }, { hanzi: "载", pinyin: "zài" }],
  // 几点
  jidian:   [{ hanzi: "几点", pinyin: "jǐdiǎn" }],
  dian:     [{ hanzi: "点", pinyin: "diǎn" }, { hanzi: "店", pinyin: "diàn" }, { hanzi: "电", pinyin: "diàn" }],
  // 了
  le:       [{ hanzi: "了", pinyin: "le" }, { hanzi: "乐", pinyin: "lè" }],
  // 差
  cha:      [{ hanzi: "差", pinyin: "chà" }, { hanzi: "茶", pinyin: "chá" }],
  // 五
  wu:       [{ hanzi: "五", pinyin: "wǔ" }, { hanzi: "无", pinyin: "wú" }, { hanzi: "午", pinyin: "wǔ" }],
  // 分
  fen:      [{ hanzi: "分", pinyin: "fēn" }, { hanzi: "份", pinyin: "fèn" }],
  // 七
  // (qi ya definido arriba — añadimos variante)
  qi2:      [{ hanzi: "七", pinyin: "qī" }, { hanzi: "起", pinyin: "qǐ" }],
  // 你们班
  nimenshan: [{ hanzi: "你们班", pinyin: "nǐmenbān" }],
  // 一共
  yigong:   [{ hanzi: "一共", pinyin: "yīgòng" }],
  // 多少
  duoshao:  [{ hanzi: "多少", pinyin: "duōshǎo" }],
  duo:      [{ hanzi: "多", pinyin: "duō" }, { hanzi: "朵", pinyin: "duǒ" }],
  shao:     [{ hanzi: "少", pinyin: "shǎo" }, { hanzi: "烧", pinyin: "shāo" }],
  // 个
  ge:       [{ hanzi: "个", pinyin: "gè" }, { hanzi: "各", pinyin: "gè" }, { hanzi: "哥", pinyin: "gē" }],
  // punctuation helpers — el usuario puede querer añadir puntuación
  "，":     [{ hanzi: "，", pinyin: "，" }],
  "？":     [{ hanzi: "？", pinyin: "？" }],
  "。":     [{ hanzi: "。", pinyin: "。" }],
  "！":     [{ hanzi: "！", pinyin: "！" }],
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
    .replace(/[^a-z]/g, '');               // elimina todo lo que no sea letra
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

  return results.slice(0, 6); // máximo 6 candidatos
}
