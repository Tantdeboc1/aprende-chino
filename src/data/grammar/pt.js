// src/data/grammar/pt.js
// AUTO-GENERADO por scripts/split-i18n-data.mjs — no editar a mano.
// Fuente: src/data/grammarData.js (estructura multilingüe).
//
// Este archivo solo contiene los textos en pt. El loader dinámico carga
// el archivo del idioma activo para minimizar el chunk descargado por el cliente.

const data = {
  "1": {
    intro: "Nesta lição aprendes a cumprimentar, perguntar como está alguém e responder. O mandarim diz muito com poucas palavras — atenção aos tons.",
    patterns: [
      {
        id: "p1",
        pattern: "你好吗？",
        pinyin: "Nǐ hǎo ma?",
        translation: "Estás bem? / Como estás?",
        explanation: "A partícula 吗 (ma) no fim de qualquer frase afirmativa transforma-a numa pergunta de sim/não. Não altera a ordem das palavras — é a forma mais simples de perguntar em chinês.",
        examples: [
          {
            zh: "你好吗？",
            pinyin: "Nǐ hǎo ma?",
            translation: "Estás bem?"
          },
          {
            zh: "他好吗？",
            pinyin: "Tā hǎo ma?",
            translation: "Está ele bem?"
          },
          {
            zh: "你妈妈好吗？",
            pinyin: "Nǐ māma hǎo ma?",
            translation: "A tua mãe está bem?"
          }
        ]
      },
      {
        id: "p2",
        pattern: "很 + adjetivo",
        pinyin: "hěn + adj.",
        translation: "Muito + adjetivo",
        explanation: "Em chinês, os adjetivos predicativos normalmente precisam de 很 (hěn) antes. Embora 很 possa significar \"muito\", ao ligar sujeito e adjetivo funciona como cópula neutra.",
        examples: [
          {
            zh: "我很好。",
            pinyin: "Wǒ hěn hǎo.",
            translation: "Estou bem."
          },
          {
            zh: "她很忙。",
            pinyin: "Tā hěn máng.",
            translation: "Ela está muito ocupada."
          },
          {
            zh: "天气很好。",
            pinyin: "Tiānqì hěn hǎo.",
            translation: "O tempo está muito bom."
          }
        ]
      },
      {
        id: "p3",
        pattern: "不 + adjetivo / verbo",
        pinyin: "bù + adj. / v.",
        translation: "Não + adjetivo / verbo",
        explanation: "不 (bù) é o negador geral do chinês. Vai antes do adjetivo ou verbo que nega. Atenção: 不 passa ao 2.º tom (bú) antes de uma sílaba de 4.º tom.",
        examples: [
          {
            zh: "我不好。",
            pinyin: "Wǒ bù hǎo.",
            translation: "Não estou bem."
          },
          {
            zh: "他不忙。",
            pinyin: "Tā bù máng.",
            translation: "Ele não está ocupado."
          },
          {
            zh: "我不累。",
            pinyin: "Wǒ bù lèi.",
            translation: "Não estou cansado/a."
          }
        ]
      },
      {
        id: "p4",
        pattern: "最近怎么样？",
        pinyin: "Zuìjìn zěnmeyàng?",
        translation: "Como tens estado ultimamente?",
        explanation: "怎么样 (zěnmeyàng) significa \"como?\" ou \"que tal?\" e serve para perguntar pelo estado geral. Mais aberto do que 好吗, permite respostas mais elaboradas.",
        examples: [
          {
            zh: "你最近怎么样？",
            pinyin: "Nǐ zuìjìn zěnmeyàng?",
            translation: "Como tens estado ultimamente?"
          },
          {
            zh: "工作怎么样？",
            pinyin: "Gōngzuò zěnmeyàng?",
            translation: "Que tal o trabalho?"
          },
          {
            zh: "最近不太好。",
            pinyin: "Zuìjìn bù tài hǎo.",
            translation: "Ultimamente não muito bem."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Estrutura básica da frase",
        formula: "主语 (sujeto) + 很 + 形容词 (adjetivo)",
        example: "我 很 好。",
        examplePinyin: "Wǒ hěn hǎo.",
        exampleTranslation: "Estou bem.",
        note: "O chinês não tem o verbo \"ser\" para adjetivos — 很 desempenha esse papel de ligação."
      },
      {
        id: "s2",
        title: "Pergunta de sim/não",
        formula: "Frase afirmativa + 吗?",
        example: "你好 → 你好吗？",
        examplePinyin: "Nǐ hǎo → Nǐ hǎo ma?",
        exampleTranslation: "Estás bem → Estás bem?",
        note: "Basta acrescentar 吗 no fim. A ordem das palavras não muda."
      },
      {
        id: "s3",
        title: "Negação simples",
        formula: "主语 + 不 + 形容词/动词",
        example: "我 不 好。",
        examplePinyin: "Wǒ bù hǎo.",
        exampleTranslation: "Não estou bem.",
        note: "不 vai sempre imediatamente antes do elemento que nega."
      }
    ],
    tip: "💡 Os chineses não dizem 我很好吗 — a pergunta é sempre 你好吗, dirigida ao outro. Responde-se 我很好 (sem 吗)."
  },
  "2": {
    intro: "Nesta lição aprendes a apresentar-te, dizer a tua nacionalidade e perguntar a dos outros. O verbo-chave é 是 (shì), equivalente a \"ser\" de identidade.",
    patterns: [
      {
        id: "p1",
        pattern: "你是哪国人？",
        pinyin: "Nǐ shì nǎ guó rén?",
        translation: "De que país és? (lit. \"És pessoa de que país?\")",
        explanation: "哪 (nǎ) é \"qual?\", 国 \"país\" e 人 \"pessoa\". Em chinês a nacionalidade exprime-se literalmente como \"pessoa do país X\". 哪国 pode ser substituído pelo nome do país.",
        examples: [
          {
            zh: "你是哪国人？",
            pinyin: "Nǐ shì nǎ guó rén?",
            translation: "De que país és?"
          },
          {
            zh: "你是中国人吗？",
            pinyin: "Nǐ shì Zhōngguó rén ma?",
            translation: "És chinês/a?"
          },
          {
            zh: "他是哪国人？",
            pinyin: "Tā shì nǎ guó rén?",
            translation: "De que país é ele?"
          }
        ]
      },
      {
        id: "p2",
        pattern: "我是 + nacionalidad + 人",
        pinyin: "Wǒ shì + país + rén",
        translation: "Sou + nacionalidade",
        explanation: "Para dizer a nacionalidade: sujeito + 是 + nome do país + 人. O padrão é fixo e muito produtivo — funciona com qualquer país.",
        examples: [
          {
            zh: "我是西班牙人。",
            pinyin: "Wǒ shì Xībānyá rén.",
            translation: "Sou espanhol/a."
          },
          {
            zh: "我是中国人。",
            pinyin: "Wǒ shì Zhōngguó rén.",
            translation: "Sou chinês/a."
          },
          {
            zh: "他是法国人。",
            pinyin: "Tā shì Fǎguó rén.",
            translation: "Ele é francês."
          }
        ]
      },
      {
        id: "p3",
        pattern: "A 也 是 B",
        pinyin: "A yě shì B",
        translation: "A também é B",
        explanation: "也 (yě) significa \"também\" e vai sempre antes do verbo ou adjetivo, nunca no fim. Regra fixa em chinês.",
        examples: [
          {
            zh: "我也是学生。",
            pinyin: "Wǒ yě shì xuésheng.",
            translation: "Eu também sou estudante."
          },
          {
            zh: "她也是中国人。",
            pinyin: "Tā yě shì Zhōngguó rén.",
            translation: "Ela também é chinesa."
          },
          {
            zh: "他也很忙。",
            pinyin: "Tā yě hěn máng.",
            translation: "Ele também está muito ocupado."
          }
        ]
      },
      {
        id: "p4",
        pattern: "不是",
        pinyin: "bù shì",
        translation: "Não é / Não sou",
        explanation: "A negação de 是 é sempre 不是, nunca 没是. 没 (méi) usa-se para negar 有 (ter/haver), mas 是 nega-se sempre com 不.",
        examples: [
          {
            zh: "我不是日本人。",
            pinyin: "Wǒ bú shì Rìběn rén.",
            translation: "Não sou japonês/a."
          },
          {
            zh: "他不是老师。",
            pinyin: "Tā bú shì lǎoshī.",
            translation: "Ele não é professor."
          },
          {
            zh: "这不是我的书。",
            pinyin: "Zhè bú shì wǒ de shū.",
            translation: "Este não é o meu livro."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Verbo 是 (ser de identidade)",
        formula: "主语 + 是 + 名词",
        example: "我 是 学生。",
        examplePinyin: "Wǒ shì xuésheng.",
        exampleTranslation: "Sou estudante.",
        note: "是 só se usa para identidade e classificação, não para descrição (aí usa-se 很 + adjetivo)."
      },
      {
        id: "s2",
        title: "Pergunta com pronome interrogativo",
        formula: "主语 + 是 + 疑问词 (哪/什么/谁...)?",
        example: "你是哪国人？",
        examplePinyin: "Nǐ shì nǎ guó rén?",
        exampleTranslation: "De que país és?",
        note: "Com pronomes interrogativos (哪, 什么, 谁...) NÃO se acrescenta 吗. O pronome já marca a pergunta."
      },
      {
        id: "s3",
        title: "Posição de 也 (também)",
        formula: "主语 + 也 + 动词/形容词",
        example: "我 也 是 西班牙人。",
        examplePinyin: "Wǒ yě shì Xībānyá rén.",
        exampleTranslation: "Eu também sou espanhol/a.",
        note: "也 vai sempre antes do verbo, nunca no fim. Erro frequente: *我是西班牙人也 ❌"
      }
    ],
    tip: "💡 Diferença-chave: 你是哪国人 usa 哪 (qual) e NÃO leva 吗 no fim. Com 哪/什么/谁 o pronome interrogativo já marca a pergunta."
  },
  "3": {
    intro: "Nesta lição falas da família: quantas pessoas há e quem são. O verbo 有 (yǒu) é fundamental — significa \"ter\" e \"haver/existir\".",
    patterns: [
      {
        id: "p1",
        pattern: "你家有几口人？",
        pinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
        translation: "Quantas pessoas há na tua família?",
        explanation: "几 (jǐ) pergunta por números pequenos (normalmente menos de 10). 口 (kǒu) é o classificador específico para membros da família — literalmente \"boca\". Em chinês os classificadores (量词) são obrigatórios com números.",
        examples: [
          {
            zh: "你家有几口人？",
            pinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
            translation: "Quantas na tua família?"
          },
          {
            zh: "我家有四口人。",
            pinyin: "Wǒ jiā yǒu sì kǒu rén.",
            translation: "Na minha família há quatro pessoas."
          },
          {
            zh: "他家有几口人？",
            pinyin: "Tā jiā yǒu jǐ kǒu rén?",
            translation: "Quantas na família dele?"
          }
        ]
      },
      {
        id: "p2",
        pattern: "有 / 没有",
        pinyin: "yǒu / méiyǒu",
        translation: "Ter / Não ter · Há / Não há",
        explanation: "有 (yǒu) é o único verbo em chinês que se nega com 没 em vez de 不. Nunca 不有 — sempre 没有. Exceção importante.",
        examples: [
          {
            zh: "我有一个妹妹。",
            pinyin: "Wǒ yǒu yī gè mèimei.",
            translation: "Tenho uma irmã mais nova."
          },
          {
            zh: "我没有兄弟。",
            pinyin: "Wǒ méiyǒu xiōngdì.",
            translation: "Não tenho irmãos."
          },
          {
            zh: "家里有人吗？",
            pinyin: "Jiā lǐ yǒu rén ma?",
            translation: "Há alguém em casa?"
          }
        ]
      },
      {
        id: "p3",
        pattern: "两 vs 二",
        pinyin: "liǎng vs èr",
        translation: "Dois (com classificador) vs. Dois (número cardinal)",
        explanation: "O chinês tem duas palavras para \"2\": 二 (èr) é o número em si (contar, telefones, andares…), 两 (liǎng) usa-se antes de classificadores. Com pessoas é sempre 两个人, nunca 二个人.",
        examples: [
          {
            zh: "我家有两口人。",
            pinyin: "Wǒ jiā yǒu liǎng kǒu rén.",
            translation: "Na minha família há duas pessoas."
          },
          {
            zh: "两个学生",
            pinyin: "liǎng gè xuésheng",
            translation: "dois estudantes"
          },
          {
            zh: "第二课",
            pinyin: "dì èr kè",
            translation: "lição número dois"
          }
        ]
      },
      {
        id: "p4",
        pattern: "个 — el clasificador comodín",
        pinyin: "gè",
        translation: "Classificador geral para pessoas e objetos",
        explanation: "个 (gè) é o classificador mais versátil do chinês. Quando não sabes qual usar, 个 costuma servir. Pessoas, objetos, ideias abstratas… Em registo informal, vale para quase tudo.",
        examples: [
          {
            zh: "一个人",
            pinyin: "yī gè rén",
            translation: "uma pessoa"
          },
          {
            zh: "三个孩子",
            pinyin: "sān gè háizi",
            translation: "três crianças"
          },
          {
            zh: "两个问题",
            pinyin: "liǎng gè wèntí",
            translation: "duas perguntas"
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Estrutura com 有 (ter/haver)",
        formula: "主语 + 有 + 数量词 + 名词",
        example: "我 有 两 个 哥哥。",
        examplePinyin: "Wǒ yǒu liǎng gè gēge.",
        exampleTranslation: "Tenho dois irmãos mais velhos.",
        note: "Ordem: sujeito + 有 + número + classificador + substantivo. O classificador vai sempre entre o número e o substantivo."
      },
      {
        id: "s2",
        title: "Negação de 有",
        formula: "主语 + 没有 + 名词",
        example: "我 没有 兄弟姐妹。",
        examplePinyin: "Wǒ méiyǒu xiōngdì jiěmèi.",
        exampleTranslation: "Não tenho irmãos nem irmãs.",
        note: "⚠️ Regra especial: 有 é o único verbo que se nega com 没, não com 不. 不有 não existe em chinês padrão."
      },
      {
        id: "s3",
        title: "Pergunta com 几 (quantos?)",
        formula: "主语 + 有 + 几 + 量词 + 名词？",
        example: "你 有 几 个 兄弟？",
        examplePinyin: "Nǐ yǒu jǐ gè xiōngdì?",
        exampleTranslation: "Quantos irmãos tens?",
        note: "几 usa-se para números pequenos esperados. Para grandes ou desconhecidos usa-se 多少 (duōshao), sem classificador."
      }
    ],
    tip: "💡 Regra de ouro: 有 → 没有 (nunca 不有). É a exceção mais importante do chinês básico. Todos os outros verbos negam-se com 不."
  },
  "4": {
    intro: "Nesta lição aprendes a falar do tempo: horas, dias e horários. O chinês tem um sistema muito lógico para dizer as horas, e os marcadores temporais vão sempre antes do verbo.",
    patterns: [
      {
        id: "p1",
        pattern: "几点？",
        pinyin: "Jǐ diǎn?",
        translation: "Que horas são? / A que horas?",
        explanation: "点 (diǎn) significa \"ponto/hora no relógio\". 几点 é a pergunta padrão. Para dizer as horas: número + 点 (+ 分 fēn para os minutos). Muito lógico: 三点半 = três e meia.",
        examples: [
          {
            zh: "现在几点？",
            pinyin: "Xiànzài jǐ diǎn?",
            translation: "Que horas são agora?"
          },
          {
            zh: "你几点有课？",
            pinyin: "Nǐ jǐ diǎn yǒu kè?",
            translation: "A que horas tens aula?"
          },
          {
            zh: "八点半",
            pinyin: "bā diǎn bàn",
            translation: "oito e meia"
          }
        ]
      },
      {
        id: "p2",
        pattern: "明天 / 今天 / 昨天",
        pinyin: "míngtiān / jīntiān / zuótiān",
        translation: "Amanhã / Hoje / Ontem",
        explanation: "Os marcadores de tempo em chinês vão no início da frase (antes do sujeito) ou logo a seguir ao sujeito, mas SEMPRE antes do verbo. Nunca no fim. Diferença estrutural-chave.",
        examples: [
          {
            zh: "明天我有课。",
            pinyin: "Míngtiān wǒ yǒu kè.",
            translation: "Amanhã tenho aula."
          },
          {
            zh: "我今天很忙。",
            pinyin: "Wǒ jīntiān hěn máng.",
            translation: "Hoje estou muito ocupado/a."
          },
          {
            zh: "昨天他没有课。",
            pinyin: "Zuótiān tā méiyǒu kè.",
            translation: "Ontem ele não tinha aula."
          }
        ]
      },
      {
        id: "p3",
        pattern: "有课 / 没有课",
        pinyin: "yǒu kè / méiyǒu kè",
        translation: "Ter aula / Não ter aula",
        explanation: "课 (kè) significa \"aula/lição\". 有课 é a expressão padrão para \"ter aula\". Combina com marcadores temporais: 明天上午八点我有课 (Amanhã às 8 da manhã tenho aula).",
        examples: [
          {
            zh: "你明天有课吗？",
            pinyin: "Nǐ míngtiān yǒu kè ma?",
            translation: "Tens aula amanhã?"
          },
          {
            zh: "我下午没有课。",
            pinyin: "Wǒ xiàwǔ méiyǒu kè.",
            translation: "À tarde não tenho aula."
          },
          {
            zh: "今天有几节课？",
            pinyin: "Jīntiān yǒu jǐ jié kè?",
            translation: "Quantas aulas há hoje?"
          }
        ]
      },
      {
        id: "p4",
        pattern: "上午 / 下午 / 晚上",
        pinyin: "shàngwǔ / xiàwǔ / wǎnshang",
        translation: "De manhã / De tarde / À noite",
        explanation: "Para especificar a parte do dia, estes marcadores vão antes da hora: 下午三点 (três da tarde). O chinês distingue manhã cedo (早上), manhã (上午), tarde (下午) e noite (晚上).",
        examples: [
          {
            zh: "上午九点有课。",
            pinyin: "Shàngwǔ jiǔ diǎn yǒu kè.",
            translation: "Às 9 da manhã há aula."
          },
          {
            zh: "下午两点半",
            pinyin: "xiàwǔ liǎng diǎn bàn",
            translation: "duas e meia da tarde"
          },
          {
            zh: "晚上我不忙。",
            pinyin: "Wǎnshang wǒ bù máng.",
            translation: "À noite não estou ocupado/a."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Ordem temporal em chinês",
        formula: "tempo → sujeito → verbo",
        example: "明天 我 有课。",
        examplePinyin: "Míngtiān wǒ yǒu kè.",
        exampleTranslation: "Amanhã tenho aula.",
        note: "Em chinês o tempo vai no início, não no fim. Do mais geral ao mais específico: ano → mês → dia → hora → ação."
      },
      {
        id: "s2",
        title: "Dizer as horas",
        formula: "(parte do dia +) número + 点 (+ 分)",
        example: "下午 三 点 二十 分。",
        examplePinyin: "Xiàwǔ sān diǎn èrshí fēn.",
        exampleTranslation: "Três e vinte da tarde.",
        note: "半 (bàn) = e meia. 一刻 (yī kè) = e um quarto. Para 0X minutos: 零 + minutos (零五分 = e cinco)."
      },
      {
        id: "s3",
        title: "Pergunta sobre horário",
        formula: "主语 + 几点 + 动词？",
        example: "你 几点 有课？",
        examplePinyin: "Nǐ jǐ diǎn yǒu kè?",
        exampleTranslation: "A que horas tens aula?",
        note: "几点 funciona como complemento de tempo. Em chinês: sujeito + hora + verbo (não \"verbo + às + hora\")."
      }
    ],
    tip: "💡 Regra do tempo em chinês: sempre do geral ao específico. Primeiro o ano, depois o mês, o dia, a hora. Como as moradas postais chinesas que começam pelo país e acabam no número da porta."
  },
  "5": {
    intro: "Nesta lição falas de datas, aniversários e festas. Aprendes a felicitar com 祝… (zhù…), a perguntar a idade com 多大 (duō dà) e a expressar o signo do zodíaco com 属 (shǔ). A ordem da data é sempre ano → mês → dia.",
    patterns: [
      {
        id: "p1",
        pattern: "祝你 + deseo",
        pinyin: "Zhù nǐ + …",
        translation: "Desejo-te / Que tenhas…!",
        explanation: "祝 (zhù) introduz um desejo ou felicitação. Segue-se o destinatário (你, 您, 大家…) e o desejo. Padrão fixo para aniversários, ano novo, festas, etc.",
        examples: [
          {
            zh: "祝你生日快乐！",
            pinyin: "Zhù nǐ shēngrì kuàilè!",
            translation: "Feliz aniversário!"
          },
          {
            zh: "祝大家新年快乐！",
            pinyin: "Zhù dàjiā xīnnián kuàilè!",
            translation: "Feliz ano novo a todos!"
          },
          {
            zh: "祝你身体健康。",
            pinyin: "Zhù nǐ shēntǐ jiànkāng.",
            translation: "Desejo-te boa saúde."
          }
        ]
      },
      {
        id: "p2",
        pattern: "今天几月几号？",
        pinyin: "Jīntiān jǐ yuè jǐ hào?",
        translation: "Que data é hoje? (lit. que mês, que dia?)",
        explanation: "Para perguntar/dar datas: número + 月 (mês) + número + 号 (dia). 号 oral; 日 (rì) escrito/formal. Ordem chinesa: ano → mês → dia, inversa ao português.",
        examples: [
          {
            zh: "今天五月十二号。",
            pinyin: "Jīntiān wǔ yuè shí'èr hào.",
            translation: "Hoje é 12 de maio."
          },
          {
            zh: "你的生日是几月几号？",
            pinyin: "Nǐ de shēngrì shì jǐ yuè jǐ hào?",
            translation: "Quando é o teu aniversário?"
          },
          {
            zh: "我的生日是八月二十二号。",
            pinyin: "Wǒ de shēngrì shì bā yuè èrshí'èr hào.",
            translation: "O meu aniversário é a 22 de agosto."
          }
        ]
      },
      {
        id: "p3",
        pattern: "你今年多大？",
        pinyin: "Nǐ jīnnián duō dà?",
        translation: "Quantos anos tens este ano?",
        explanation: "多大 (duō dà) literalmente \"quão grande?\" usa-se para perguntar a idade de adultos/jovens. A crianças pequenas 几岁 (jǐ suì), a idosos 多大年纪 (duō dà niánjì). Responde-se número + 岁: 我今年二十岁。",
        examples: [
          {
            zh: "你今年多大？",
            pinyin: "Nǐ jīnnián duō dà?",
            translation: "Quantos anos tens este ano?"
          },
          {
            zh: "我今年二十一岁。",
            pinyin: "Wǒ jīnnián èrshíyī suì.",
            translation: "Este ano tenho 21 anos."
          },
          {
            zh: "他多大？",
            pinyin: "Tā duō dà?",
            translation: "Quantos anos tem ele?"
          }
        ]
      },
      {
        id: "p4",
        pattern: "我属 + animal",
        pinyin: "Wǒ shǔ + …",
        translation: "Sou do ano do…",
        explanation: "属 (shǔ) introduz o animal do zodíaco chinês do ano de nascimento. Cada ano lunar corresponde a um dos 12 animais (rato, boi, tigre, coelho, dragão, cobra, cavalo, cabra, macaco, galo, cão, porco).",
        examples: [
          {
            zh: "我属龙。",
            pinyin: "Wǒ shǔ lóng.",
            translation: "Sou do ano do dragão."
          },
          {
            zh: "你属什么？",
            pinyin: "Nǐ shǔ shénme?",
            translation: "De que signo do zodíaco és?"
          },
          {
            zh: "她属马。",
            pinyin: "Tā shǔ mǎ.",
            translation: "Ela é do ano do cavalo."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Ordem da data",
        formula: "年 + 月 + 日/号",
        example: "二〇二六 年 六 月 五 号",
        examplePinyin: "èr-líng-èr-liù nián liù yuè wǔ hào",
        exampleTranslation: "5 de junho de 2026",
        note: "Sempre do geral ao específico: ano → mês → dia. Os anos lêem-se algarismo a algarismo."
      },
      {
        id: "s2",
        title: "Felicitação com 祝",
        formula: "祝 + destinatário + desejo",
        example: "祝 你 生日 快乐！",
        examplePinyin: "Zhù nǐ shēngrì kuàilè!",
        exampleTranslation: "Feliz aniversário!",
        note: "O destinatário vem logo a seguir a 祝. Podes encadear desejos: 祝你身体健康，工作顺利。"
      },
      {
        id: "s3",
        title: "Perguntar a idade",
        formula: "主语 + (今年) + 多大/几岁？",
        example: "你 今年 多大？",
        examplePinyin: "Nǐ jīnnián duō dà?",
        exampleTranslation: "Quantos anos tens este ano?",
        note: "几岁 → crianças · 多大 → jovens/adultos · 多大年纪 → idosos. É uma questão de cortesia adaptar a pergunta à idade."
      }
    ],
    tip: "💡 Quando alguém diz 生日快乐, uma resposta natural é 谢谢！ (xièxie). Numa festa chinesa (聚会) é comum o brinde 干杯 (gānbēi, lit. \"copo seco\") — espera-se que se beba até ao fim."
  },
  "6": {
    intro: "Nesta lição aprendes a falar de lugares e localizações. As palavras direcionais (东/南/西/北 + 边) vão depois do lugar de referência. Usamos 在 (zài) para indicar onde está algo e 跟 (gēn) para acompanhar.",
    patterns: [
      {
        id: "p1",
        pattern: "A 在 B 的 + dirección/lado",
        pinyin: "A zài B de + fāngwèi",
        translation: "A está + direção/lado + de B",
        explanation: "Em chinês a referência espacial é inversa: primeiro o lugar de referência (B), depois a posição (北边, 旁边, 里边…). Literalmente: \"A em B norte-lado está\".",
        examples: [
          {
            zh: "图书馆在食堂北边。",
            pinyin: "Túshūguǎn zài shítáng běibiān.",
            translation: "A biblioteca fica a norte do refeitório."
          },
          {
            zh: "银行在学校旁边。",
            pinyin: "Yínháng zài xuéxiào pángbiān.",
            translation: "O banco fica ao lado da escola."
          },
          {
            zh: "我家在医院对面。",
            pinyin: "Wǒ jiā zài yīyuàn duìmiàn.",
            translation: "A minha casa fica em frente ao hospital."
          }
        ]
      },
      {
        id: "p2",
        pattern: "… 边 — los sufijos de dirección",
        pinyin: "… biān",
        translation: "Lado / parte",
        explanation: "边 (biān) ou 面 (miàn) são sufixos que transformam uma direção em substantivo locativo. 北 → 北边 (lado norte), 里 → 里边 (dentro), 上 → 上边 (em cima). Sem o sufixo, essas palavras não funcionam como localização autónoma.",
        examples: [
          {
            zh: "宿舍在西边。",
            pinyin: "Sùshè zài xībiān.",
            translation: "O dormitório fica a oeste."
          },
          {
            zh: "书在桌子上边。",
            pinyin: "Shū zài zhuōzi shàngbiān.",
            translation: "O livro está em cima da mesa."
          },
          {
            zh: "猫在椅子下边。",
            pinyin: "Māo zài yǐzi xiàbiān.",
            translation: "O gato está debaixo da cadeira."
          }
        ]
      },
      {
        id: "p3",
        pattern: "跟 + persona + 一起 + verbo",
        pinyin: "gēn + … + yīqǐ + V",
        translation: "Com … (fazer algo em conjunto)",
        explanation: "跟 (gēn) significa \"com\" e indica acompanhamento. Combina-se frequentemente com 一起 (yīqǐ, \"juntos\"). Vai sempre antes do verbo.",
        examples: [
          {
            zh: "我跟同学一起去食堂。",
            pinyin: "Wǒ gēn tóngxué yīqǐ qù shítáng.",
            translation: "Vou ao refeitório com o meu colega."
          },
          {
            zh: "你跟我来。",
            pinyin: "Nǐ gēn wǒ lái.",
            translation: "Vem comigo."
          },
          {
            zh: "她跟老师学汉语。",
            pinyin: "Tā gēn lǎoshī xué Hànyǔ.",
            translation: "Ela aprende chinês com o professor."
          }
        ]
      },
      {
        id: "p4",
        pattern: "别 + verbo",
        pinyin: "bié + V",
        translation: "Não (imperativo) / Não faças…",
        explanation: "别 (bié) é a forma curta de 不要 (bú yào), usada para imperativos negativos: \"não faças…\". 别…了 suaviza (别看了 = \"deixa lá\").",
        examples: [
          {
            zh: "别着急。",
            pinyin: "Bié zháojí.",
            translation: "Não te preocupes."
          },
          {
            zh: "别客气。",
            pinyin: "Bié kèqi.",
            translation: "Não te incomodes / De nada."
          },
          {
            zh: "别去那儿。",
            pinyin: "Bié qù nàr.",
            translation: "Não vás lá."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Verbo 在 de localização",
        formula: "主语 + 在 + 地点",
        example: "我 在 图书馆。",
        examplePinyin: "Wǒ zài túshūguǎn.",
        exampleTranslation: "Estou na biblioteca.",
        note: "在 também funciona como preposição: 我在图书馆看书 = \"leio na biblioteca\". Nesse caso vai antes do verbo principal."
      },
      {
        id: "s2",
        title: "Localização relativa",
        formula: "A + 在 + B + 方位词 (北边/旁边/里边…)",
        example: "银行 在 食堂 旁边。",
        examplePinyin: "Yínháng zài shítáng pángbiān.",
        exampleTranslation: "O banco fica ao lado do refeitório.",
        note: "A referência (B) vem antes do sufixo posicional, ao contrário do português. Sem o sufixo (旁边, 北边…) a frase fica incompleta."
      },
      {
        id: "s3",
        title: "Acompanhamento com 跟",
        formula: "主语 + 跟 + 同伴 + (一起) + 动词",
        example: "我 跟 朋友 一起 去。",
        examplePinyin: "Wǒ gēn péngyou yīqǐ qù.",
        exampleTranslation: "Vou com o meu amigo.",
        note: "一起 reforça \"juntos\". Pode omitir-se, mas soa mais natural com ele."
      }
    ],
    tip: "💡 Memoriza a ordem dos pontos cardeais em chinês: 东南西北 (este-sul-oeste-norte). Em português dizemos \"norte-sul-este-oeste\"; em chinês começa-se pelo este (onde nasce o sol)."
  },
  "7": {
    intro: "Nesta lição aprendes a comprar: perguntar preços, regatear e pagar. Usamos 多少钱 (duōshao qián) para preços, classificadores específicos para roupa e fruta (件, 条, 斤…) e os verbos 想 (xiǎng) e 可以 (kěyǐ).",
    patterns: [
      {
        id: "p1",
        pattern: "… 多少钱？",
        pinyin: "… duōshao qián?",
        translation: "Quanto custa…?",
        explanation: "多少 (duōshao) pergunta quantidades grandes ou desconhecidas e não precisa de classificador, ao contrário de 几 (jǐ). Para preços usa-se sempre 多少钱. Podes acrescentar a unidade: 多少钱一斤？",
        examples: [
          {
            zh: "苹果多少钱一斤？",
            pinyin: "Píngguǒ duōshao qián yī jīn?",
            translation: "Quanto custa um jin de maçãs?"
          },
          {
            zh: "这件衬衫多少钱？",
            pinyin: "Zhè jiàn chènshān duōshao qián?",
            translation: "Quanto custa esta camisa?"
          },
          {
            zh: "一共多少钱？",
            pinyin: "Yīgòng duōshao qián?",
            translation: "Quanto é no total?"
          }
        ]
      },
      {
        id: "p2",
        pattern: "想 + verbo",
        pinyin: "xiǎng + V",
        translation: "Querer / Ter vontade de…",
        explanation: "想 (xiǎng) como auxiliar exprime desejo: \"gostaria / quero fazer algo\". Mais suave que 要 (yào). Nega-se com 不想.",
        examples: [
          {
            zh: "我想买点儿苹果。",
            pinyin: "Wǒ xiǎng mǎi diǎnr píngguǒ.",
            translation: "Quero comprar algumas maçãs."
          },
          {
            zh: "你想喝什么？",
            pinyin: "Nǐ xiǎng hē shénme?",
            translation: "O que queres beber?"
          },
          {
            zh: "我不想去。",
            pinyin: "Wǒ bù xiǎng qù.",
            translation: "Não quero ir."
          }
        ]
      },
      {
        id: "p3",
        pattern: "可以 + verbo？",
        pinyin: "kěyǐ + V?",
        translation: "Posso / Pode-se…?",
        explanation: "可以 (kěyǐ) é um auxiliar que pede ou concede permissão. Resposta afirmativa: 可以 / 当然可以 (claro); negativa: 不可以. Não confundir com 能 (capacidade física) nem 会 (saber aprendido).",
        examples: [
          {
            zh: "可以尝一下吗？",
            pinyin: "Kěyǐ cháng yīxià ma?",
            translation: "Posso provar?"
          },
          {
            zh: "当然可以。",
            pinyin: "Dāngrán kěyǐ.",
            translation: "Claro que sim."
          },
          {
            zh: "这儿可以刷卡吗？",
            pinyin: "Zhèr kěyǐ shuākǎ ma?",
            translation: "Aqui pode-se pagar com cartão?"
          }
        ]
      },
      {
        id: "p4",
        pattern: "Clasificadores de objetos",
        pinyin: "件 / 条 / 斤 / 块",
        translation: "Peças, peças compridas, jin, yuanes coloquiais",
        explanation: "Cada substantivo tem o seu classificador: 件 (jiàn) para roupa de cima e eventos; 条 (tiáo) para objetos compridos e finos (calças, saias, ruas); 斤 (jīn) para peso (~500 g); 块 (kuài) para dinheiro coloquial. Formal: 元 (yuán).",
        examples: [
          {
            zh: "一件衬衫",
            pinyin: "yī jiàn chènshān",
            translation: "uma camisa"
          },
          {
            zh: "两条牛仔裤",
            pinyin: "liǎng tiáo niúzǎikù",
            translation: "duas calças de ganga"
          },
          {
            zh: "三斤苹果",
            pinyin: "sān jīn píngguǒ",
            translation: "três jin de maçãs (~1,5 kg)"
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Perguntar o preço",
        formula: "produto + 多少钱 (+ unidade)?",
        example: "苹果 多少钱 一 斤？",
        examplePinyin: "Píngguǒ duōshao qián yī jīn?",
        exampleTranslation: "Quanto custa um jin de maçãs?",
        note: "A unidade vai no fim. Para indicar preço: número + 块/元 + (一斤/一件…). Ex.: 五块一斤 = 5 yuanes o jin."
      },
      {
        id: "s2",
        title: "Pedir permissão",
        formula: "可以 + 动词 + 吗？",
        example: "可以 试 一下 吗？",
        examplePinyin: "Kěyǐ shì yīxià ma?",
        exampleTranslation: "Posso experimentar?",
        note: "一下 (yīxià) depois do verbo suaviza a ação: \"um momento, um bocadinho\". Muito comum em pedidos educados."
      },
      {
        id: "s3",
        title: "Demonstrativo + classificador + substantivo",
        formula: "这/那 + 量词 + 名词",
        example: "这 件 衣服",
        examplePinyin: "zhè jiàn yīfu",
        exampleTranslation: "esta peça de roupa",
        note: "Com 这/那/哪 o classificador nunca pode faltar. Erro frequente: *这衣服 ❌ — deve ser 这件衣服 ✅."
      }
    ],
    tip: "💡 Sistema monetário: 1 元 (yuán, formal) = 1 块 (kuài, coloquial) = 10 角 (jiǎo) = 10 毛 (máo) = 100 分 (fēn). Na fala usa-se 块 e 毛; em faturas e bancos, 元 e 角."
  },
  "8": {
    intro: "Nesta lição falas de saúde: sintomas, ir ao médico e aceitar/recusar tratamentos. Aprendes os modais 应该 (yīnggāi, dever) e 能 (néng, poder), a conjunção 还是 (háishi) para perguntas de escolha, e a diferença entre 有点儿 e (一)点儿.",
    patterns: [
      {
        id: "p1",
        pattern: "哪儿 + 不舒服 / 疼？",
        pinyin: "Nǎr bù shūfu / téng?",
        translation: "Onde te dói / onde te sentes mal?",
        explanation: "Para descrever uma dor: parte do corpo + 疼 (doer) ou + 不舒服 (não estar bem). Na pergunta, 哪儿 substitui a parte do corpo. Não é preciso 吗 porque já há pronome interrogativo.",
        examples: [
          {
            zh: "你哪儿不舒服？",
            pinyin: "Nǐ nǎr bù shūfu?",
            translation: "O que se passa? / Onde te sentes mal?"
          },
          {
            zh: "我头疼。",
            pinyin: "Wǒ tóu téng.",
            translation: "Doí-me a cabeça."
          },
          {
            zh: "嗓子有点儿疼。",
            pinyin: "Sǎngzi yǒu diǎnr téng.",
            translation: "Doí-me um pouco a garganta."
          }
        ]
      },
      {
        id: "p2",
        pattern: "应该 / 不应该 + verbo",
        pinyin: "yīnggāi / bù yīnggāi + V",
        translation: "Dever / Não dever fazer…",
        explanation: "应该 (yīnggāi) exprime obrigação ou conselho moral/lógico. Mais suave que 必须 (bìxū, \"tem de\"). Negativo: 不应该 = \"não devias\".",
        examples: [
          {
            zh: "你应该去医院。",
            pinyin: "Nǐ yīnggāi qù yīyuàn.",
            translation: "Devias ir ao hospital."
          },
          {
            zh: "你应该多休息。",
            pinyin: "Nǐ yīnggāi duō xiūxi.",
            translation: "Devias descansar mais."
          },
          {
            zh: "不应该吃太多。",
            pinyin: "Bù yīnggāi chī tài duō.",
            translation: "Não devias comer demasiado."
          }
        ]
      },
      {
        id: "p3",
        pattern: "A 还是 B？",
        pinyin: "A háishi B?",
        translation: "A ou B?",
        explanation: "还是 (háishi) é a conjunção para perguntas de escolha. Não se usa 或者 (huòzhě, \"ou\") em perguntas — isso é para frases afirmativas. Estrutura: opção 1 + 还是 + opção 2.",
        examples: [
          {
            zh: "你喝茶还是咖啡？",
            pinyin: "Nǐ hē chá háishi kāfēi?",
            translation: "Chá ou café?"
          },
          {
            zh: "今天去还是明天去？",
            pinyin: "Jīntiān qù háishi míngtiān qù?",
            translation: "Vais hoje ou amanhã?"
          },
          {
            zh: "吃中药还是西药？",
            pinyin: "Chī zhōngyào háishi xīyào?",
            translation: "Medicina chinesa ou ocidental?"
          }
        ]
      },
      {
        id: "p4",
        pattern: "有点儿 + adjetivo  vs.  adjetivo + (一)点儿",
        pinyin: "yǒu diǎnr + adj.  vs.  adj. + (yī)diǎnr",
        translation: "Um pouco (negativo) vs. um pouco (comparativo)",
        explanation: "Diferença importante: 有点儿 + adjetivo vai ANTES, com nuance negativa/incómoda. (一)点儿 vai DEPOIS do adjetivo, em comparações ou pedidos (\"um pouco mais X\").",
        examples: [
          {
            zh: "我有点儿累。",
            pinyin: "Wǒ yǒu diǎnr lèi.",
            translation: "Estou um pouco cansado/a. (queixa)"
          },
          {
            zh: "便宜点儿吧！",
            pinyin: "Piányi diǎnr ba!",
            translation: "Um pouco mais barato!"
          },
          {
            zh: "今天有点儿冷。",
            pinyin: "Jīntiān yǒu diǎnr lěng.",
            translation: "Hoje está um pouco frio."
          }
        ]
      }
    ],
    structures: [
      {
        id: "s1",
        title: "Descrever um sintoma",
        formula: "主语 + 部位 + 疼 / 不舒服",
        example: "我 嗓子 疼。",
        examplePinyin: "Wǒ sǎngzi téng.",
        exampleTranslation: "Doí-me a garganta.",
        note: "A parte do corpo funciona como sujeito secundário (\"duplo sujeito\"). Em português \"dói-me X\", em chinês \"eu, X dói\"."
      },
      {
        id: "s2",
        title: "Modais para conselho / capacidade",
        formula: "应该 + V (conselho) · 能 + V (capacidade/possibilidade)",
        example: "你 应该 多 喝 水，今天 不能 上课。",
        examplePinyin: "Nǐ yīnggāi duō hē shuǐ, jīntiān bù néng shàngkè.",
        exampleTranslation: "Devias beber mais água, hoje não podes ir à aula.",
        note: "能 indica capacidade ou possibilidade nesse momento. 会 indica saber aprendido. 可以 indica permissão. Não são intercambiáveis."
      },
      {
        id: "s3",
        title: "Pergunta de escolha com 还是",
        formula: "… A + 还是 + B？",
        example: "你 想 打针 还是 吃药？",
        examplePinyin: "Nǐ xiǎng dǎzhēn háishi chī yào?",
        exampleTranslation: "Preferes uma injecção ou comprimidos?",
        note: "Em perguntas de escolha NÃO se acrescenta 吗 no fim. 还是 já marca a pergunta."
      }
    ],
    tip: "💡 A medicina tradicional chinesa (中医, zhōngyī) continua muito presente nos hospitais chineses: o médico pode receitar 西药 (medicina ocidental), 中药 (ervas chinesas) ou 针灸 (acupuntura). Combiná-las é comum."
  }
};

export default data;
