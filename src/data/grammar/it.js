// src/data/grammar/it.js
// AUTO-GENERADO por scripts/split-i18n-data.mjs — no editar a mano.
// Fuente: src/data/grammarData.js (estructura multilingüe).
//
// Este archivo solo contiene los textos en it. El loader dinámico carga
// el archivo del idioma activo para minimizar el chunk descargado por el cliente.

const data = {
  "1": {
    intro: "In questa lezione impari a salutare, chiedere come sta qualcuno e rispondere. Il mandarino dice molto con poche parole — attenzione ai toni.",
    patterns: [
      {
        id: "p1",
        pattern: "你好吗？",
        pinyin: "Nǐ hǎo ma?",
        translation: "Stai bene? / Come stai?",
        explanation: "La particella 吗 (ma) alla fine di una frase affermativa la trasforma in domanda sì/no. Non cambia l'ordine delle parole — è il modo più semplice di chiedere in cinese.",
        examples: [
          {
            zh: "你好吗？",
            pinyin: "Nǐ hǎo ma?",
            translation: "Stai bene?"
          },
          {
            zh: "他好吗？",
            pinyin: "Tā hǎo ma?",
            translation: "Sta bene lui?"
          },
          {
            zh: "你妈妈好吗？",
            pinyin: "Nǐ māma hǎo ma?",
            translation: "Sta bene tua mamma?"
          }
        ]
      },
      {
        id: "p2",
        pattern: "很 + adjetivo",
        pinyin: "hěn + adj.",
        translation: "Molto + aggettivo",
        explanation: "In cinese gli aggettivi predicativi richiedono di solito 很 (hěn) davanti. Anche se 很 può significare \"molto\", legando soggetto e aggettivo fa da copula neutra.",
        examples: [
          {
            zh: "我很好。",
            pinyin: "Wǒ hěn hǎo.",
            translation: "Sto bene."
          },
          {
            zh: "她很忙。",
            pinyin: "Tā hěn máng.",
            translation: "Lei è molto occupata."
          },
          {
            zh: "天气很好。",
            pinyin: "Tiānqì hěn hǎo.",
            translation: "Il tempo è molto bello."
          }
        ]
      },
      {
        id: "p3",
        pattern: "不 + adjetivo / verbo",
        pinyin: "bù + adj. / v.",
        translation: "Non + aggettivo / verbo",
        explanation: "不 (bù) è il negatore generale del cinese. Va prima dell'aggettivo o verbo negato. Attenzione: 不 passa al 2° tono (bú) davanti a una sillaba di 4° tono.",
        examples: [
          {
            zh: "我不好。",
            pinyin: "Wǒ bù hǎo.",
            translation: "Non sto bene."
          },
          {
            zh: "他不忙。",
            pinyin: "Tā bù máng.",
            translation: "Lui non è occupato."
          },
          {
            zh: "我不累。",
            pinyin: "Wǒ bù lèi.",
            translation: "Non sono stanco/a."
          }
        ]
      },
      {
        id: "p4",
        pattern: "最近怎么样？",
        pinyin: "Zuìjìn zěnmeyàng?",
        translation: "Come stai ultimamente?",
        explanation: "怎么样 (zěnmeyàng) significa \"come?\" o \"che ne dici?\" e chiede dello stato generale. Più aperto di 好吗, ammette risposte più articolate.",
        examples: [
          {
            zh: "你最近怎么样？",
            pinyin: "Nǐ zuìjìn zěnmeyàng?",
            translation: "Come stai ultimamente?"
          },
          {
            zh: "工作怎么样？",
            pinyin: "Gōngzuò zěnmeyàng?",
            translation: "Come va il lavoro?"
          },
          {
            zh: "最近不太好。",
            pinyin: "Zuìjìn bù tài hǎo.",
            translation: "Ultimamente non molto bene."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Struttura base della frase",
        formula: "主语 (sujeto) + 很 + 形容词 (adjetivo)",
        example: "我 很 好。",
        examplePinyin: "Wǒ hěn hǎo.",
        exampleTranslation: "Sto bene.",
        note: "Il cinese non ha il verbo \"essere\" per gli aggettivi — 很 fa da elemento di collegamento."
      },
      {
        id: "s2",
        title: "Domanda sì/no",
        formula: "Frase affermativa + 吗?",
        example: "你好 → 你好吗？",
        examplePinyin: "Nǐ hǎo → Nǐ hǎo ma?",
        exampleTranslation: "Stai bene → Stai bene?",
        note: "Basta aggiungere 吗 alla fine. L'ordine delle parole non cambia."
      },
      {
        id: "s3",
        title: "Negazione semplice",
        formula: "主语 + 不 + 形容词/动词",
        example: "我 不 好。",
        examplePinyin: "Wǒ bù hǎo.",
        exampleTranslation: "Non sto bene.",
        note: "不 va sempre subito prima dell'elemento negato."
      }
    ],
    tip: "💡 I cinesi non dicono 我很好吗 — la domanda è sempre 你好吗, rivolta all'altro. Si risponde 我很好 (senza 吗)."
  },
  "2": {
    intro: "In questa lezione impari a presentarti, dire la tua nazionalità e chiedere quella altrui. Verbo chiave: 是 (shì), equivalente di \"essere\" d'identità.",
    patterns: [
      {
        id: "p1",
        pattern: "你是哪国人？",
        pinyin: "Nǐ shì nǎ guó rén?",
        translation: "Di che paese sei? (lett. \"Sei una persona di che paese?\")",
        explanation: "哪 (nǎ) significa \"quale?\", 国 \"paese\" e 人 \"persona\". In cinese la nazionalità si esprime letteralmente come \"persona del paese X\". 哪国 può essere sostituito dal nome del paese.",
        examples: [
          {
            zh: "你是哪国人？",
            pinyin: "Nǐ shì nǎ guó rén?",
            translation: "Di che paese sei?"
          },
          {
            zh: "你是中国人吗？",
            pinyin: "Nǐ shì Zhōngguó rén ma?",
            translation: "Sei cinese?"
          },
          {
            zh: "他是哪国人？",
            pinyin: "Tā shì nǎ guó rén?",
            translation: "Di che paese è lui?"
          }
        ]
      },
      {
        id: "p2",
        pattern: "我是 + nacionalidad + 人",
        pinyin: "Wǒ shì + país + rén",
        translation: "Sono + nazionalità",
        explanation: "Per dire la nazionalità: soggetto + 是 + nome del paese + 人. Schema fisso e molto produttivo — funziona con qualsiasi paese.",
        examples: [
          {
            zh: "我是西班牙人。",
            pinyin: "Wǒ shì Xībānyá rén.",
            translation: "Sono spagnolo/a."
          },
          {
            zh: "我是中国人。",
            pinyin: "Wǒ shì Zhōngguó rén.",
            translation: "Sono cinese."
          },
          {
            zh: "他是法国人。",
            pinyin: "Tā shì Fǎguó rén.",
            translation: "Lui è francese."
          }
        ]
      },
      {
        id: "p3",
        pattern: "A 也 是 B",
        pinyin: "A yě shì B",
        translation: "Anche A è B",
        explanation: "也 (yě) significa \"anche\" e va sempre prima del verbo o aggettivo, mai alla fine. Regola fissa in cinese.",
        examples: [
          {
            zh: "我也是学生。",
            pinyin: "Wǒ yě shì xuésheng.",
            translation: "Anch'io sono studente/ssa."
          },
          {
            zh: "她也是中国人。",
            pinyin: "Tā yě shì Zhōngguó rén.",
            translation: "Anche lei è cinese."
          },
          {
            zh: "他也很忙。",
            pinyin: "Tā yě hěn máng.",
            translation: "Anche lui è molto occupato."
          }
        ]
      },
      {
        id: "p4",
        pattern: "不是",
        pinyin: "bù shì",
        translation: "Non è / Non sono",
        explanation: "La negazione di 是 è sempre 不是, mai 没是. 没 (méi) si usa per negare 有 (avere/esserci), ma 是 si nega sempre con 不.",
        examples: [
          {
            zh: "我不是日本人。",
            pinyin: "Wǒ bú shì Rìběn rén.",
            translation: "Non sono giapponese."
          },
          {
            zh: "他不是老师。",
            pinyin: "Tā bú shì lǎoshī.",
            translation: "Lui non è insegnante."
          },
          {
            zh: "这不是我的书。",
            pinyin: "Zhè bú shì wǒ de shū.",
            translation: "Questo non è il mio libro."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Verbo 是 (essere — identità)",
        formula: "主语 + 是 + 名词",
        example: "我 是 学生。",
        examplePinyin: "Wǒ shì xuésheng.",
        exampleTranslation: "Sono studente/ssa.",
        note: "是 si usa solo per identità e classificazione, non per descrizione (lì si usa 很 + aggettivo)."
      },
      {
        id: "s2",
        title: "Domanda con pronome interrogativo",
        formula: "主语 + 是 + 疑问词 (哪/什么/谁...)?",
        example: "你是哪国人？",
        examplePinyin: "Nǐ shì nǎ guó rén?",
        exampleTranslation: "Di che paese sei?",
        note: "Con pronomi interrogativi (哪, 什么, 谁...) NON si aggiunge 吗. Il pronome stesso segna la domanda."
      },
      {
        id: "s3",
        title: "Posizione di 也 (anche)",
        formula: "主语 + 也 + 动词/形容词",
        example: "我 也 是 西班牙人。",
        examplePinyin: "Wǒ yě shì Xībānyá rén.",
        exampleTranslation: "Anch'io sono spagnolo/a.",
        note: "也 va sempre prima del verbo, mai alla fine. Errore frequente: *我是西班牙人也 ❌"
      }
    ],
    tip: "💡 Differenza chiave: 你是哪国人 usa 哪 (quale) e NON prende 吗 alla fine. Con 哪/什么/谁 il pronome interrogativo basta."
  },
  "3": {
    intro: "In questa lezione si parla della famiglia: quante persone e chi sono. Il verbo 有 (yǒu) è fondamentale — significa \"avere\" e \"esserci\".",
    patterns: [
      {
        id: "p1",
        pattern: "你家有几口人？",
        pinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
        translation: "Quante persone ci sono nella tua famiglia?",
        explanation: "几 (jǐ) chiede numeri piccoli (di solito meno di 10). 口 (kǒu) è il classificatore specifico per i membri della famiglia — letteralmente \"bocca\". In cinese i classificatori (量词) sono obbligatori coi numeri.",
        examples: [
          {
            zh: "你家有几口人？",
            pinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
            translation: "Quante nella tua famiglia?"
          },
          {
            zh: "我家有四口人。",
            pinyin: "Wǒ jiā yǒu sì kǒu rén.",
            translation: "Nella mia famiglia ci sono quattro persone."
          },
          {
            zh: "他家有几口人？",
            pinyin: "Tā jiā yǒu jǐ kǒu rén?",
            translation: "Quante nella sua famiglia?"
          }
        ]
      },
      {
        id: "p2",
        pattern: "有 / 没有",
        pinyin: "yǒu / méiyǒu",
        translation: "Avere / Non avere · C'è / Non c'è",
        explanation: "有 (yǒu) è l'unico verbo in cinese che si nega con 没 anziché con 不. Mai 不有 — sempre 没有. Eccezione importante.",
        examples: [
          {
            zh: "我有一个妹妹。",
            pinyin: "Wǒ yǒu yī gè mèimei.",
            translation: "Ho una sorella minore."
          },
          {
            zh: "我没有兄弟。",
            pinyin: "Wǒ méiyǒu xiōngdì.",
            translation: "Non ho fratelli."
          },
          {
            zh: "家里有人吗？",
            pinyin: "Jiā lǐ yǒu rén ma?",
            translation: "C'è qualcuno in casa?"
          }
        ]
      },
      {
        id: "p3",
        pattern: "两 vs 二",
        pinyin: "liǎng vs èr",
        translation: "Due (con classificatore) vs. Due (numero cardinale)",
        explanation: "Il cinese ha due parole per \"2\": 二 (èr) è il numero (contare, telefoni, piani…), 两 (liǎng) si usa prima di un classificatore. Con persone sempre 两个人, mai 二个人.",
        examples: [
          {
            zh: "我家有两口人。",
            pinyin: "Wǒ jiā yǒu liǎng kǒu rén.",
            translation: "Nella mia famiglia ci sono due persone."
          },
          {
            zh: "两个学生",
            pinyin: "liǎng gè xuésheng",
            translation: "due studenti"
          },
          {
            zh: "第二课",
            pinyin: "dì èr kè",
            translation: "lezione numero due"
          }
        ]
      },
      {
        id: "p4",
        pattern: "个 — el clasificador comodín",
        pinyin: "gè",
        translation: "Classificatore generale per persone e oggetti",
        explanation: "个 (gè) è il classificatore più versatile del cinese. Quando non sai quale usare, 个 funziona spesso. Persone, oggetti, idee astratte… Informale, va quasi sempre bene.",
        examples: [
          {
            zh: "一个人",
            pinyin: "yī gè rén",
            translation: "una persona"
          },
          {
            zh: "三个孩子",
            pinyin: "sān gè háizi",
            translation: "tre bambini"
          },
          {
            zh: "两个问题",
            pinyin: "liǎng gè wèntí",
            translation: "due domande"
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Struttura con 有 (avere/esserci)",
        formula: "主语 + 有 + 数量词 + 名词",
        example: "我 有 两 个 哥哥。",
        examplePinyin: "Wǒ yǒu liǎng gè gēge.",
        exampleTranslation: "Ho due fratelli maggiori.",
        note: "Ordine: soggetto + 有 + numero + classificatore + sostantivo. Il classificatore va sempre tra numero e sostantivo."
      },
      {
        id: "s2",
        title: "Negazione di 有",
        formula: "主语 + 没有 + 名词",
        example: "我 没有 兄弟姐妹。",
        examplePinyin: "Wǒ méiyǒu xiōngdì jiěmèi.",
        exampleTranslation: "Non ho fratelli né sorelle.",
        note: "⚠️ Regola speciale: 有 è l'unico verbo che si nega con 没, non con 不. 不有 non esiste in cinese standard."
      },
      {
        id: "s3",
        title: "Domanda con 几 (quanti?)",
        formula: "主语 + 有 + 几 + 量词 + 名词？",
        example: "你 有 几 个 兄弟？",
        examplePinyin: "Nǐ yǒu jǐ gè xiōngdì?",
        exampleTranslation: "Quanti fratelli hai?",
        note: "几 si usa per numeri piccoli attesi. Per quantità grandi o sconosciute si usa 多少 (duōshao), che non vuole classificatore."
      }
    ],
    tip: "💡 Regola d'oro: 有 → 没有 (mai 不有). È l'eccezione più importante del cinese di base. Tutti gli altri verbi si negano con 不."
  },
  "4": {
    intro: "In questa lezione si parla del tempo: ore, giorni e orari. Il cinese ha un sistema molto logico per dire l'ora e i marcatori temporali precedono sempre il verbo.",
    patterns: [
      {
        id: "p1",
        pattern: "几点？",
        pinyin: "Jǐ diǎn?",
        translation: "Che ora è? / A che ora?",
        explanation: "点 (diǎn) significa \"punto/ora\". 几点 è la domanda standard. Per dire l'ora: numero + 点 (+ 分 fēn per i minuti). Molto logico: 三点半 = le tre e mezza.",
        examples: [
          {
            zh: "现在几点？",
            pinyin: "Xiànzài jǐ diǎn?",
            translation: "Che ora è adesso?"
          },
          {
            zh: "你几点有课？",
            pinyin: "Nǐ jǐ diǎn yǒu kè?",
            translation: "A che ora hai lezione?"
          },
          {
            zh: "八点半",
            pinyin: "bā diǎn bàn",
            translation: "le otto e mezza"
          }
        ]
      },
      {
        id: "p2",
        pattern: "明天 / 今天 / 昨天",
        pinyin: "míngtiān / jīntiān / zuótiān",
        translation: "Domani / Oggi / Ieri",
        explanation: "I marcatori temporali in cinese vanno all'inizio (prima del soggetto) o subito dopo il soggetto, ma SEMPRE prima del verbo. Mai alla fine. Differenza strutturale chiave.",
        examples: [
          {
            zh: "明天我有课。",
            pinyin: "Míngtiān wǒ yǒu kè.",
            translation: "Domani ho lezione."
          },
          {
            zh: "我今天很忙。",
            pinyin: "Wǒ jīntiān hěn máng.",
            translation: "Oggi sono molto occupato/a."
          },
          {
            zh: "昨天他没有课。",
            pinyin: "Zuótiān tā méiyǒu kè.",
            translation: "Ieri non aveva lezione."
          }
        ]
      },
      {
        id: "p3",
        pattern: "有课 / 没有课",
        pinyin: "yǒu kè / méiyǒu kè",
        translation: "Avere lezione / Non avere lezione",
        explanation: "课 (kè) significa \"lezione\". 有课 è l'espressione standard per \"avere lezione\". Si combina bene con marcatori temporali: 明天上午八点我有课 (Domani alle 8 ho lezione).",
        examples: [
          {
            zh: "你明天有课吗？",
            pinyin: "Nǐ míngtiān yǒu kè ma?",
            translation: "Hai lezione domani?"
          },
          {
            zh: "我下午没有课。",
            pinyin: "Wǒ xiàwǔ méiyǒu kè.",
            translation: "Il pomeriggio non ho lezione."
          },
          {
            zh: "今天有几节课？",
            pinyin: "Jīntiān yǒu jǐ jié kè?",
            translation: "Quante lezioni oggi?"
          }
        ]
      },
      {
        id: "p4",
        pattern: "上午 / 下午 / 晚上",
        pinyin: "shàngwǔ / xiàwǔ / wǎnshang",
        translation: "Di mattina / Di pomeriggio / Di sera",
        explanation: "Per specificare il momento del giorno, questi marcatori vanno prima dell'ora: 下午三点 (le tre del pomeriggio). Il cinese distingue mattina presto (早上), mattina (上午), pomeriggio (下午) e sera (晚上).",
        examples: [
          {
            zh: "上午九点有课。",
            pinyin: "Shàngwǔ jiǔ diǎn yǒu kè.",
            translation: "Alle 9 di mattina c'è lezione."
          },
          {
            zh: "下午两点半",
            pinyin: "xiàwǔ liǎng diǎn bàn",
            translation: "le due e mezza del pomeriggio"
          },
          {
            zh: "晚上我不忙。",
            pinyin: "Wǎnshang wǒ bù máng.",
            translation: "La sera non sono occupato/a."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Ordine temporale in cinese",
        formula: "tempo → soggetto → verbo",
        example: "明天 我 有课。",
        examplePinyin: "Míngtiān wǒ yǒu kè.",
        exampleTranslation: "Domani ho lezione.",
        note: "In cinese il tempo va all'inizio, non alla fine. Dal generale al particolare: anno → mese → giorno → ora → azione."
      },
      {
        id: "s2",
        title: "Dire l'ora",
        formula: "(parte del giorno +) numero + 点 (+ 分)",
        example: "下午 三 点 二十 分。",
        examplePinyin: "Xiàwǔ sān diǎn èrshí fēn.",
        exampleTranslation: "Le tre e venti del pomeriggio.",
        note: "半 (bàn) = e mezza. 一刻 (yī kè) = e un quarto. Per 0X minuti: 零 + minuti (零五分 = e cinque)."
      },
      {
        id: "s3",
        title: "Domanda sull'orario",
        formula: "主语 + 几点 + 动词？",
        example: "你 几点 有课？",
        examplePinyin: "Nǐ jǐ diǎn yǒu kè?",
        exampleTranslation: "A che ora hai lezione?",
        note: "几点 funge da complemento di tempo. In cinese: soggetto + ora + verbo (non \"verbo + alle + ora\")."
      }
    ],
    tip: "💡 Regola del tempo in cinese: sempre dal generale al particolare. Prima l'anno, poi il mese, il giorno, l'ora. Come gli indirizzi postali cinesi che partono dal paese e finiscono al numero civico."
  },
  "5": {
    intro: "In questa lezione si parla di date, compleanni e feste. Impari a fare auguri con 祝… (zhù…), chiedere l'età con 多大 (duō dà) ed esprimere il segno zodiacale con 属 (shǔ). L'ordine della data è sempre anno → mese → giorno.",
    patterns: [
      {
        id: "p1",
        pattern: "祝你 + deseo",
        pinyin: "Zhù nǐ + …",
        translation: "Ti auguro / Possa tu avere…!",
        explanation: "祝 (zhù) introduce un augurio. Segue il destinatario (你, 您, 大家…) e poi l'augurio. Schema fisso per compleanni, Capodanno, feste, ecc.",
        examples: [
          {
            zh: "祝你生日快乐！",
            pinyin: "Zhù nǐ shēngrì kuàilè!",
            translation: "Buon compleanno!"
          },
          {
            zh: "祝大家新年快乐！",
            pinyin: "Zhù dàjiā xīnnián kuàilè!",
            translation: "Buon anno a tutti!"
          },
          {
            zh: "祝你身体健康。",
            pinyin: "Zhù nǐ shēntǐ jiànkāng.",
            translation: "Ti auguro buona salute."
          }
        ]
      },
      {
        id: "p2",
        pattern: "今天几月几号？",
        pinyin: "Jīntiān jǐ yuè jǐ hào?",
        translation: "Che data è oggi? (lett. che mese, che giorno?)",
        explanation: "Per chiedere/dare date: numero + 月 (mese) + numero + 号 (giorno). 号 nel parlato, 日 (rì) nello scritto/formale. Ordine cinese: anno → mese → giorno, inverso all'italiano.",
        examples: [
          {
            zh: "今天五月十二号。",
            pinyin: "Jīntiān wǔ yuè shí'èr hào.",
            translation: "Oggi è il 12 maggio."
          },
          {
            zh: "你的生日是几月几号？",
            pinyin: "Nǐ de shēngrì shì jǐ yuè jǐ hào?",
            translation: "Quand'è il tuo compleanno?"
          },
          {
            zh: "我的生日是八月二十二号。",
            pinyin: "Wǒ de shēngrì shì bā yuè èrshí'èr hào.",
            translation: "Il mio compleanno è il 22 agosto."
          }
        ]
      },
      {
        id: "p3",
        pattern: "你今年多大？",
        pinyin: "Nǐ jīnnián duō dà?",
        translation: "Quanti anni hai quest'anno?",
        explanation: "多大 (duō dà) letteralmente \"quanto grande?\" si usa per l'età di adulti/adolescenti. Bambini: 几岁 (jǐ suì), anziani: 多大年纪 (duō dà niánjì). Si risponde numero + 岁: 我今年二十岁。",
        examples: [
          {
            zh: "你今年多大？",
            pinyin: "Nǐ jīnnián duō dà?",
            translation: "Quanti anni hai quest'anno?"
          },
          {
            zh: "我今年二十一岁。",
            pinyin: "Wǒ jīnnián èrshíyī suì.",
            translation: "Quest'anno ho 21 anni."
          },
          {
            zh: "他多大？",
            pinyin: "Tā duō dà?",
            translation: "Quanti anni ha lui?"
          }
        ]
      },
      {
        id: "p4",
        pattern: "我属 + animal",
        pinyin: "Wǒ shǔ + …",
        translation: "Sono dell'anno del…",
        explanation: "属 (shǔ) introduce l'animale dello zodiaco cinese dell'anno di nascita. Ogni anno lunare corrisponde a uno dei 12 animali (topo, bue, tigre, coniglio, drago, serpente, cavallo, capra, scimmia, gallo, cane, maiale).",
        examples: [
          {
            zh: "我属龙。",
            pinyin: "Wǒ shǔ lóng.",
            translation: "Sono dell'anno del drago."
          },
          {
            zh: "你属什么？",
            pinyin: "Nǐ shǔ shénme?",
            translation: "Di che segno cinese sei?"
          },
          {
            zh: "她属马。",
            pinyin: "Tā shǔ mǎ.",
            translation: "Lei è dell'anno del cavallo."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Ordine della data",
        formula: "年 + 月 + 日/号",
        example: "二〇二六 年 六 月 五 号",
        examplePinyin: "èr-líng-èr-liù nián liù yuè wǔ hào",
        exampleTranslation: "5 giugno 2026",
        note: "Sempre dal generale al particolare: anno → mese → giorno. Gli anni si leggono cifra per cifra."
      },
      {
        id: "s2",
        title: "Auguri con 祝",
        formula: "祝 + destinatario + augurio",
        example: "祝 你 生日 快乐！",
        examplePinyin: "Zhù nǐ shēngrì kuàilè!",
        exampleTranslation: "Buon compleanno!",
        note: "Il destinatario va subito dopo 祝. Si possono concatenare auguri: 祝你身体健康，工作顺利。"
      },
      {
        id: "s3",
        title: "Chiedere l'età",
        formula: "主语 + (今年) + 多大/几岁？",
        example: "你 今年 多大？",
        examplePinyin: "Nǐ jīnnián duō dà?",
        exampleTranslation: "Quanti anni hai quest'anno?",
        note: "几岁 → bambini · 多大 → giovani/adulti · 多大年纪 → anziani. È buona educazione adattare la domanda all'età."
      }
    ],
    tip: "💡 Quando qualcuno dice 生日快乐, una risposta naturale è 谢谢！ (xièxie). Alle feste cinesi (聚会) è comune il brindisi 干杯 (gānbēi, lett. \"bicchiere vuoto\") — si vuota il bicchiere."
  },
  "6": {
    intro: "In questa lezione si parla di luoghi e posizioni. Le parole direzionali (东/南/西/北 + 边) seguono il luogo di riferimento. 在 (zài) indica dove sta qualcosa, 跟 (gēn) indica compagnia.",
    patterns: [
      {
        id: "p1",
        pattern: "A 在 B 的 + dirección/lado",
        pinyin: "A zài B de + fāngwèi",
        translation: "A è + direzione/lato + di B",
        explanation: "In cinese il riferimento spaziale è invertito: prima il luogo di riferimento (B), poi la posizione (北边, 旁边, 里边…). Letteralmente: \"A in B nord-lato sta\".",
        examples: [
          {
            zh: "图书馆在食堂北边。",
            pinyin: "Túshūguǎn zài shítáng běibiān.",
            translation: "La biblioteca è a nord della mensa."
          },
          {
            zh: "银行在学校旁边。",
            pinyin: "Yínháng zài xuéxiào pángbiān.",
            translation: "La banca è accanto alla scuola."
          },
          {
            zh: "我家在医院对面。",
            pinyin: "Wǒ jiā zài yīyuàn duìmiàn.",
            translation: "Casa mia è di fronte all'ospedale."
          }
        ]
      },
      {
        id: "p2",
        pattern: "… 边 — los sufijos de dirección",
        pinyin: "… biān",
        translation: "Lato / parte",
        explanation: "边 (biān) o 面 (miàn) sono suffissi che trasformano una direzione in sostantivo di luogo. 北 → 北边 (lato nord), 里 → 里边 (dentro), 上 → 上边 (sopra). Senza suffisso non funzionano come luogo a sé.",
        examples: [
          {
            zh: "宿舍在西边。",
            pinyin: "Sùshè zài xībiān.",
            translation: "Il dormitorio è a ovest."
          },
          {
            zh: "书在桌子上边。",
            pinyin: "Shū zài zhuōzi shàngbiān.",
            translation: "Il libro è sopra il tavolo."
          },
          {
            zh: "猫在椅子下边。",
            pinyin: "Māo zài yǐzi xiàbiān.",
            translation: "Il gatto è sotto la sedia."
          }
        ]
      },
      {
        id: "p3",
        pattern: "跟 + persona + 一起 + verbo",
        pinyin: "gēn + … + yīqǐ + V",
        translation: "Con … (fare qualcosa insieme)",
        explanation: "跟 (gēn) significa \"con\" e indica compagnia. Si combina spesso con 一起 (yīqǐ, \"insieme\"). Va sempre prima del verbo.",
        examples: [
          {
            zh: "我跟同学一起去食堂。",
            pinyin: "Wǒ gēn tóngxué yīqǐ qù shítáng.",
            translation: "Vado in mensa con il mio compagno."
          },
          {
            zh: "你跟我来。",
            pinyin: "Nǐ gēn wǒ lái.",
            translation: "Vieni con me."
          },
          {
            zh: "她跟老师学汉语。",
            pinyin: "Tā gēn lǎoshī xué Hànyǔ.",
            translation: "Lei impara il cinese con l'insegnante."
          }
        ]
      },
      {
        id: "p4",
        pattern: "别 + verbo",
        pinyin: "bié + V",
        translation: "Non (imperativo) / Non fare…",
        explanation: "别 (bié) è la forma breve di 不要 (bú yào), per imperativi negativi: \"non fare…\". 别…了 ammorbidisce (别看了 = \"lascia stare\").",
        examples: [
          {
            zh: "别着急。",
            pinyin: "Bié zháojí.",
            translation: "Non preoccuparti."
          },
          {
            zh: "别客气。",
            pinyin: "Bié kèqi.",
            translation: "Non fare complimenti / Prego."
          },
          {
            zh: "别去那儿。",
            pinyin: "Bié qù nàr.",
            translation: "Non andare lì."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Verbo 在 di luogo",
        formula: "主语 + 在 + 地点",
        example: "我 在 图书馆。",
        examplePinyin: "Wǒ zài túshūguǎn.",
        exampleTranslation: "Sono in biblioteca.",
        note: "在 funge anche da preposizione: 我在图书馆看书 = \"leggo in biblioteca\". In tal caso precede il verbo principale."
      },
      {
        id: "s2",
        title: "Localizzazione relativa",
        formula: "A + 在 + B + 方位词 (北边/旁边/里边…)",
        example: "银行 在 食堂 旁边。",
        examplePinyin: "Yínháng zài shítáng pángbiān.",
        exampleTranslation: "La banca è accanto alla mensa.",
        note: "Il riferimento (B) precede il suffisso di posizione, al contrario dell'italiano. Senza il suffisso (旁边, 北边…) la frase è incompleta."
      },
      {
        id: "s3",
        title: "Compagnia con 跟",
        formula: "主语 + 跟 + 同伴 + (一起) + 动词",
        example: "我 跟 朋友 一起 去。",
        examplePinyin: "Wǒ gēn péngyou yīqǐ qù.",
        exampleTranslation: "Vado con il mio amico.",
        note: "一起 rafforza \"insieme\". Si può omettere, ma suona più naturale."
      }
    ],
    tip: "💡 Memorizza l'ordine dei punti cardinali: 东南西北 (est-sud-ovest-nord). In italiano si dice \"nord-sud-est-ovest\"; in cinese si parte dall'est (dove sorge il sole)."
  },
  "7": {
    intro: "In questa lezione impari a fare acquisti: chiedere prezzi, contrattare e pagare. Si usa 多少钱 (duōshao qián) per i prezzi, classificatori specifici per abiti e frutta (件, 条, 斤…) e i verbi 想 (xiǎng) e 可以 (kěyǐ).",
    patterns: [
      {
        id: "p1",
        pattern: "… 多少钱？",
        pinyin: "… duōshao qián?",
        translation: "Quanto costa…?",
        explanation: "多少 (duōshao) chiede quantità grandi o sconosciute e non vuole classificatore, a differenza di 几 (jǐ). Per i prezzi: 多少钱. Si può aggiungere l'unità: 多少钱一斤？",
        examples: [
          {
            zh: "苹果多少钱一斤？",
            pinyin: "Píngguǒ duōshao qián yī jīn?",
            translation: "Quanto costa un jin di mele?"
          },
          {
            zh: "这件衬衫多少钱？",
            pinyin: "Zhè jiàn chènshān duōshao qián?",
            translation: "Quanto costa questa camicia?"
          },
          {
            zh: "一共多少钱？",
            pinyin: "Yīgòng duōshao qián?",
            translation: "Quanto in totale?"
          }
        ]
      },
      {
        id: "p2",
        pattern: "想 + verbo",
        pinyin: "xiǎng + V",
        translation: "Volere / Aver voglia di…",
        explanation: "想 (xiǎng) come modale esprime desiderio: \"vorrei / voglio fare qualcosa\". Più morbido di 要 (yào). Si nega con 不想.",
        examples: [
          {
            zh: "我想买点儿苹果。",
            pinyin: "Wǒ xiǎng mǎi diǎnr píngguǒ.",
            translation: "Voglio comprare delle mele."
          },
          {
            zh: "你想喝什么？",
            pinyin: "Nǐ xiǎng hē shénme?",
            translation: "Cosa vuoi bere?"
          },
          {
            zh: "我不想去。",
            pinyin: "Wǒ bù xiǎng qù.",
            translation: "Non voglio andare."
          }
        ]
      },
      {
        id: "p3",
        pattern: "可以 + verbo？",
        pinyin: "kěyǐ + V?",
        translation: "Posso / Si può…?",
        explanation: "可以 (kěyǐ) è un modale di permesso. Risposta affermativa: 可以 / 当然可以 (certo); negativa: 不可以. Da non confondere con 能 (capacità fisica) o 会 (saper fare appreso).",
        examples: [
          {
            zh: "可以尝一下吗？",
            pinyin: "Kěyǐ cháng yīxià ma?",
            translation: "Posso assaggiare?"
          },
          {
            zh: "当然可以。",
            pinyin: "Dāngrán kěyǐ.",
            translation: "Certo che sì."
          },
          {
            zh: "这儿可以刷卡吗？",
            pinyin: "Zhèr kěyǐ shuākǎ ma?",
            translation: "Si può pagare con la carta qui?"
          }
        ]
      },
      {
        id: "p4",
        pattern: "Clasificadores de objetos",
        pinyin: "件 / 条 / 斤 / 块",
        translation: "Pezzi, capi lunghi, jin, yuan colloquiali",
        explanation: "Ogni sostantivo ha il suo classificatore: 件 (jiàn) per capi superiori ed eventi; 条 (tiáo) per oggetti lunghi e sottili (pantaloni, gonne, strade); 斤 (jīn) per peso (~500 g); 块 (kuài) per denaro colloquiale. Formale: 元 (yuán).",
        examples: [
          {
            zh: "一件衬衫",
            pinyin: "yī jiàn chènshān",
            translation: "una camicia"
          },
          {
            zh: "两条牛仔裤",
            pinyin: "liǎng tiáo niúzǎikù",
            translation: "due jeans"
          },
          {
            zh: "三斤苹果",
            pinyin: "sān jīn píngguǒ",
            translation: "tre jin di mele (~1,5 kg)"
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Chiedere il prezzo",
        formula: "prodotto + 多少钱 (+ unità)?",
        example: "苹果 多少钱 一 斤？",
        examplePinyin: "Píngguǒ duōshao qián yī jīn?",
        exampleTranslation: "Quanto costa un jin di mele?",
        note: "L'unità va alla fine. Per dire un prezzo: numero + 块/元 + (一斤/一件…). Es.: 五块一斤 = 5 yuan al jin."
      },
      {
        id: "s2",
        title: "Chiedere il permesso",
        formula: "可以 + 动词 + 吗？",
        example: "可以 试 一下 吗？",
        examplePinyin: "Kěyǐ shì yīxià ma?",
        exampleTranslation: "Posso provarlo?",
        note: "一下 (yīxià) dopo il verbo ammorbidisce l'azione: \"un attimo, un po'\". Comune nelle richieste cortesi."
      },
      {
        id: "s3",
        title: "Dimostrativo + classificatore + sostantivo",
        formula: "这/那 + 量词 + 名词",
        example: "这 件 衣服",
        examplePinyin: "zhè jiàn yīfu",
        exampleTranslation: "questo vestito",
        note: "Con 这/那/哪 il classificatore non è mai opzionale. Errore frequente: *这衣服 ❌ — corretto: 这件衣服 ✅."
      }
    ],
    tip: "💡 Sistema monetario: 1 元 (yuán, formale) = 1 块 (kuài, colloquiale) = 10 角 (jiǎo) = 10 毛 (máo) = 100 分 (fēn). Parlato: 块 e 毛; fatture e banche: 元 e 角."
  },
  "8": {
    intro: "In questa lezione si parla di salute: sintomi, andare dal medico, accettare/rifiutare cure. Impari i modali 应该 (yīnggāi, dovere) e 能 (néng, potere), la congiunzione 还是 (háishi) per domande di scelta, e la differenza tra 有点儿 e (一)点儿.",
    patterns: [
      {
        id: "p1",
        pattern: "哪儿 + 不舒服 / 疼？",
        pinyin: "Nǎr bù shūfu / téng?",
        translation: "Dove ti fa male / dove ti senti male?",
        explanation: "Per descrivere un dolore: parte del corpo + 疼 (téng, fare male) o + 不舒服 (stare male). Nella domanda 哪儿 sostituisce la parte del corpo. Non serve 吗 perché c'è già il pronome interrogativo.",
        examples: [
          {
            zh: "你哪儿不舒服？",
            pinyin: "Nǐ nǎr bù shūfu?",
            translation: "Cosa c'è? / Dove ti senti male?"
          },
          {
            zh: "我头疼。",
            pinyin: "Wǒ tóu téng.",
            translation: "Ho mal di testa."
          },
          {
            zh: "嗓子有点儿疼。",
            pinyin: "Sǎngzi yǒu diǎnr téng.",
            translation: "Mi fa un po' male la gola."
          }
        ]
      },
      {
        id: "p2",
        pattern: "应该 / 不应该 + verbo",
        pinyin: "yīnggāi / bù yīnggāi + V",
        translation: "Dovere / Non dovere fare…",
        explanation: "应该 (yīnggāi) esprime obbligo o consiglio morale/logico. Più morbido di 必须 (bìxū, \"si deve\"). Negativo: 不应该 = \"non dovresti\".",
        examples: [
          {
            zh: "你应该去医院。",
            pinyin: "Nǐ yīnggāi qù yīyuàn.",
            translation: "Dovresti andare in ospedale."
          },
          {
            zh: "你应该多休息。",
            pinyin: "Nǐ yīnggāi duō xiūxi.",
            translation: "Dovresti riposare di più."
          },
          {
            zh: "不应该吃太多。",
            pinyin: "Bù yīnggāi chī tài duō.",
            translation: "Non dovresti mangiare troppo."
          }
        ]
      },
      {
        id: "p3",
        pattern: "A 还是 B？",
        pinyin: "A háishi B?",
        translation: "A o B?",
        explanation: "还是 (háishi) è la congiunzione per le domande di scelta. Non si usa 或者 (huòzhě, \"o\") nelle domande — quello è per le affermative. Schema: opzione 1 + 还是 + opzione 2.",
        examples: [
          {
            zh: "你喝茶还是咖啡？",
            pinyin: "Nǐ hē chá háishi kāfēi?",
            translation: "Tè o caffè?"
          },
          {
            zh: "今天去还是明天去？",
            pinyin: "Jīntiān qù háishi míngtiān qù?",
            translation: "Vai oggi o domani?"
          },
          {
            zh: "吃中药还是西药？",
            pinyin: "Chī zhōngyào háishi xīyào?",
            translation: "Medicina cinese o occidentale?"
          }
        ]
      },
      {
        id: "p4",
        pattern: "有点儿 + adjetivo  vs.  adjetivo + (一)点儿",
        pinyin: "yǒu diǎnr + adj.  vs.  adj. + (yī)diǎnr",
        translation: "Un po' (negativo) vs. un po' (comparativo)",
        explanation: "Differenza importante: 有点儿 + aggettivo va PRIMA, con sfumatura negativa/scomoda. (一)点儿 va DOPO l'aggettivo, in comparazioni o richieste (\"un po' più X\").",
        examples: [
          {
            zh: "我有点儿累。",
            pinyin: "Wǒ yǒu diǎnr lèi.",
            translation: "Sono un po' stanco/a. (lamento)"
          },
          {
            zh: "便宜点儿吧！",
            pinyin: "Piányi diǎnr ba!",
            translation: "Un po' meno!"
          },
          {
            zh: "今天有点儿冷。",
            pinyin: "Jīntiān yǒu diǎnr lěng.",
            translation: "Oggi fa un po' freddo."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Descrivere un sintomo",
        formula: "主语 + 部位 + 疼 / 不舒服",
        example: "我 嗓子 疼。",
        examplePinyin: "Wǒ sǎngzi téng.",
        exampleTranslation: "Mi fa male la gola.",
        note: "La parte del corpo funge da soggetto secondario (\"doppio soggetto\"). In italiano \"mi fa male X\", in cinese \"io, X fa male\"."
      },
      {
        id: "s2",
        title: "Modali per consiglio / capacità",
        formula: "应该 + V (consiglio) · 能 + V (capacità/possibilità)",
        example: "你 应该 多 喝 水，今天 不能 上课。",
        examplePinyin: "Nǐ yīnggāi duō hē shuǐ, jīntiān bù néng shàngkè.",
        exampleTranslation: "Dovresti bere più acqua, oggi non puoi andare a lezione.",
        note: "能 indica capacità o possibilità nel momento. 会 indica saper fare appreso. 可以 indica permesso. Non sono intercambiabili."
      },
      {
        id: "s3",
        title: "Domanda di scelta con 还是",
        formula: "… A + 还是 + B？",
        example: "你 想 打针 还是 吃药？",
        examplePinyin: "Nǐ xiǎng dǎzhēn háishi chī yào?",
        exampleTranslation: "Preferisci una puntura o pastiglie?",
        note: "Nelle domande di scelta NON si aggiunge 吗 alla fine. 还是 basta."
      }
    ],
    tip: "💡 La medicina tradizionale cinese (中医, zhōngyī) è ancora molto presente negli ospedali: il medico può prescrivere 西药 (medicina occidentale), 中药 (erbe cinesi) o 针灸 (agopuntura). Combinarle è normale."
  }
};

export default data;
