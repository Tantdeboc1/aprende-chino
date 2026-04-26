// src/data/culturalData.js
// Notas culturales por lección — tarjetas expandibles en CulturalTab
// Estructura: { lessonNum: [ { id, emoji, title, content } ] }

const culturalData = {
  1: [
    {
      id: 'l1_c1',
      emoji: '🙏',
      title: 'Saludos en China',
      content:
        '你好 (nǐ hǎo) es el saludo estándar, pero en el día a día los chinos usan más "¿Has comido?" (你吃饭了吗？nǐ chīfàn le ma) como forma coloquial de saludar. Preguntar por el bienestar ajeno es señal de cortesía y cuidado social.',
    },
    {
      id: 'l1_c2',
      emoji: '🎋',
      title: 'El concepto de "面子" (Mianzi)',
      content:
        'La 面子 (miànzi, "cara social") es fundamental en la cultura china. Evitar avergonzar a alguien públicamente es una norma no escrita básica. En conversaciones cotidianas, se prefieren respuestas indirectas o evasivas si la respuesta directa pudiera causar vergüenza.',
    },
    {
      id: 'l1_c3',
      emoji: '🍵',
      title: 'El té como ritual de bienvenida',
      content:
        'Ofrecer té es la forma tradicional de dar la bienvenida a alguien en China. Rechazar el té puede interpretarse como descortés. La cultura del té (茶文化, chá wénhuà) es milenaria y cada región tiene sus propias variedades: té verde de Hangzhou, pu-erh de Yunnan, oolong de Fujian…',
    },
    {
      id: 'l1_c4',
      emoji: '🤝',
      title: 'Formas de despedirse',
      content:
        '再见 (zàijiàn) es el equivalente a "adiós", pero en contextos informales se usa 拜拜 (bāibāi, del inglés "bye-bye"). En entornos formales o con personas mayores, se añade respeto con 您慢走 (nín màn zǒu, "vaya despacio, tenga cuidado").',
    },
  ],

  2: [
    {
      id: 'l2_c1',
      emoji: '🌏',
      title: 'China y su diversidad étnica',
      content:
        'China tiene 56 grupos étnicos oficiales. El mayoritario, el Han (汉族, Hàn zú), representa el 91% de la población. Los otros 55 grupos tienen sus propias lenguas, costumbres y tradiciones. El mandarín (普通话, pǔtōnghuà) es la lengua oficial y vehicular del país.',
    },
    {
      id: 'l2_c2',
      emoji: '📛',
      title: 'Los nombres chinos',
      content:
        'En China el apellido va primero. Por ejemplo, 王明 (Wáng Míng): 王 es el apellido y 明 el nombre. Los nombres suelen tener uno o dos caracteres con significado positivo (fuerza, belleza, sabiduría…). Al dirigirse a alguien por su nombre completo, el apellido siempre precede al nombre propio.',
    },
    {
      id: 'l2_c3',
      emoji: '🏫',
      title: 'La importancia de la educación',
      content:
        'La educación es un valor central en China, influenciado por el confucianismo. El examen imperial (科举, kējǔ) duró más de mil años y marcó la meritocracia. Hoy el 高考 (gāokǎo), examen nacional universitario, es uno de los más competitivos del mundo y determina en gran medida el futuro de los jóvenes.',
    },
    {
      id: 'l2_c4',
      emoji: '🗺️',
      title: 'Regiones y dialectos',
      content:
        'Aunque el mandarín es la lengua oficial, China tiene decenas de dialectos: cantonés (广东话), shanghainés (沪语), min del sur (闽南语)… Pueden ser mutuamente ininteligibles. La escritura china unificada es lo que ha mantenido cohesionada la comunicación a lo largo de la historia.',
    },
  ],

  3: [
    {
      id: 'l3_c1',
      emoji: '👨‍👩‍👧‍👦',
      title: 'La familia en la cultura china',
      content:
        'La familia (家庭, jiātíng) es el núcleo de la sociedad china. El confucianismo establece la piedad filial (孝, xiào) como virtud suprema: respetar y cuidar a los padres y ancianos es una obligación moral profunda. Las decisiones importantes se suelen tomar en consenso familiar.',
    },
    {
      id: 'l3_c2',
      emoji: '👶',
      title: 'La política del hijo único y sus consecuencias',
      content:
        'Vigente de 1980 a 2015, la política del hijo único limitó la mayoría de familias urbanas a un solo descendiente. Esto generó la "generación de los pequeños emperadores" y un desequilibrio de género. Desde 2021 se permite tener hasta tres hijos para frenar el envejecimiento de la población.',
    },
    {
      id: 'l3_c3',
      emoji: '🏡',
      title: 'El sistema de parentesco en chino',
      content:
        'El chino tiene palabras distintas para cada familiar según su posición exacta: 爷爷 (yéye, abuelo paterno), 外公 (wàigōng, abuelo materno), 哥哥 (gēge, hermano mayor), 弟弟 (dìdi, hermano menor)… Esta precisión refleja la importancia del orden jerárquico en la familia tradicional china.',
    },
    {
      id: 'l3_c4',
      emoji: '🎉',
      title: 'Celebraciones familiares',
      content:
        'Las reuniones familiares más importantes del año son el Año Nuevo Chino (春节, Chūnjié) y el Festival del Medio Otoño (中秋节, Zhōngqiū Jié). Durante la Primavera China (春运, chūnyùn), cientos de millones de personas viajan para reencontrarse con su familia en lo que es la mayor migración humana periódica del mundo.',
    },
  ],

  4: [
    {
      id: 'l4_c1',
      emoji: '⏰',
      title: 'La puntualidad y el tiempo en China',
      content:
        'En contextos formales (reuniones de negocios, exámenes, eventos oficiales) la puntualidad es muy valorada. En contextos sociales es algo más flexible. El dicho 时间就是金钱 (shíjiān jiù shì jīnqián, "el tiempo es oro") refleja el ritmo frenético de las ciudades chinas modernas.',
    },
    {
      id: 'l4_c2',
      emoji: '📚',
      title: 'El sistema educativo chino',
      content:
        'La jornada escolar en China es larga: los estudiantes pueden tener clases desde las 7h hasta las 17h, más deberes. La cultura del estudio es muy intensa. Las academias extraescolares (补习班, bǔxí bān) son muy comunes, especialmente en matemáticas, inglés y chino. El 高考 determina las oportunidades universitarias.',
    },
    {
      id: 'l4_c3',
      emoji: '🌙',
      title: 'El calendario lunar chino',
      content:
        'China usa simultáneamente el calendario gregoriano (para la vida cotidiana y oficial) y el calendario lunar (农历, nónglì, para festividades tradicionales). El Año Nuevo Chino cae siempre entre el 21 de enero y el 20 de febrero. Cada año está asociado a uno de los 12 animales del zodiaco chino.',
    },
    {
      id: 'l4_c4',
      emoji: '🚆',
      title: 'El ritmo de vida en las ciudades chinas',
      content:
        'Ciudades como Pekín, Shanghái o Shenzhen tienen un ritmo de vida muy acelerado. La cultura laboral conocida como 996 (9h a 22h, 6 días a la semana) es habitual en tecnología. El metro de Shanghái es el más extenso del mundo. La digitalización es total: se paga con móvil (WeChat Pay / Alipay) en casi todos los comercios.',
    },
  ],
};

export default culturalData;
