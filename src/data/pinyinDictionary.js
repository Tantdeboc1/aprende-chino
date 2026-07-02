// src/data/pinyinDictionary.js
// Diccionario pinyin → candidatos hanzi (neutro al idioma) + helpers del IME
// del minijuego "Traduce la Frase". Separado de translationPhrases.js para que
// el cliente no arrastre las frases multilingües (que van troceadas por idioma).

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
