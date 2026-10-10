// Classifiers and quantity forms collected from the app's lesson materials.
// Keep source distinctions such as time vs. money on 分 in the examples.
const T = (es, en, fr, de, it, pt) => ({ es, en, fr, de, it, pt });
const E = (before, answer, after, phrase, pinyin, meaning) => ({ before, answer, after, phrase, pinyin, meaning });

export const classifierText = (value, language = 'es', replacements = {}) => {
  const lang = String(language || 'es').split('-')[0];
  const translated = value?.[lang] || value?.es || '';
  return translated.replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key] ?? `{{${key}}}`);
};

export const classifierUi = {
  homeTitle: T('Clasificadores', 'Classifiers', 'Classificateurs', 'Zählwörter', 'Classificatori', 'Classificadores'),
  homeDescription: T('Repasa los clasificadores y unidades de las lecciones.', 'Review the classifiers and units from your lessons.', 'Révise les classificateurs et unités des leçons.', 'Wiederhole die Zählwörter und Maßeinheiten aus den Lektionen.', 'Ripassa i classificatori e le unità delle lezioni.', 'Revê os classificadores e unidades das lições.'),
  backHome: T('Inicio', 'Home', 'Accueil', 'Startseite', 'Home', 'Início'),
  pageTitle: T('Clasificadores', 'Classifiers', 'Classificateurs', 'Zählwörter', 'Classificatori', 'Classificadores'),
  pageSubtitle: T('量词 · clasificadores y unidades', '量词 · classifiers and units', '量词 · classificateurs et unités', '量词 · Zählwörter und Maßeinheiten', '量词 · classificatori e unità', '量词 · classificadores e unidades'),
  ruleTitle: T('Patrones y usos', 'Patterns and uses', 'Structures et usages', 'Muster und Verwendung', 'Strutture e usi', 'Padrões e usos'),
  rule: T(
    'Muchos van entre el número y el nombre: 两张照片 (dos fotos). También siguen a 这/那: 这本书 (este libro). En las lecciones hay además unidades de hora, duración, peso y dinero, y formas que van detrás de un verbo, como 看一下.',
    'Many go between a number and a noun: 两张照片 (two photos). They also follow 这/那: 这本书 (this book). The lessons also include units for time, duration, weight and money, plus forms after a verb, such as 看一下.',
    'Beaucoup se placent entre le nombre et le nom : 两张照片 (deux photos). Ils suivent aussi 这/那 : 这本书 (ce livre). Les leçons comprennent également des unités de temps, de durée, de poids et d’argent, ainsi que des formes après un verbe, comme 看一下.',
    'Viele stehen zwischen Zahl und Nomen: 两张照片 (zwei Fotos). Sie folgen auch auf 这/那: 这本书 (dieses Buch). Die Lektionen enthalten außerdem Einheiten für Uhrzeit, Dauer, Gewicht und Geld sowie Formen nach einem Verb, etwa 看一下.',
    'Molti si mettono tra numero e nome: 两张照片 (due foto). Seguono anche 这/那: 这本书 (questo libro). Le lezioni includono inoltre unità di ora, durata, peso e denaro, e forme dopo un verbo, come 看一下.',
    'Muitos ficam entre o número e o nome: 两张照片 (duas fotografias). Também vêm depois de 这/那: 这本书 (este livro). As lições incluem ainda unidades de hora, duração, peso e dinheiro, além de formas depois de um verbo, como 看一下.'
  ),
  examplesTitle: T('Fichas de estudio · {{count}} formas', 'Study cards · {{count}} forms', 'Fiches d’étude · {{count}} formes', 'Lernkarten · {{count}} Formen', 'Schede di studio · {{count}} forme', 'Cartões de estudo · {{count}} formas'),
  examplesHint: T('Toca el altavoz para escuchar cada expresión.', 'Tap the speaker to hear each phrase.', 'Appuie sur le haut-parleur pour écouter chaque expression.', 'Tippe auf den Lautsprecher, um die Ausdrücke anzuhören.', 'Tocca l’altoparlante per ascoltare ogni espressione.', 'Toca no altifalante para ouvir cada expressão.'),
  practiceTitle: T('Practicar', 'Practice', 'S’entraîner', 'Üben', 'Esercitati', 'Praticar'),
  practiceDescription: T('Elige qué formas quieres incluir en la sesión.', 'Choose which forms to include in your session.', 'Choisis les formes à inclure dans la séance.', 'Wähle aus, welche Formen du üben möchtest.', 'Scegli quali forme includere nella sessione.', 'Escolhe as formas que queres incluir na sessão.'),
  all: T('Todos', 'All', 'Tous', 'Alle', 'Tutti', 'Todos'),
  practiceCount: T('Practicar {{count}} formas', 'Practice {{count}} forms', 'Réviser {{count}} formes', '{{count}} Formen üben', 'Esercitati su {{count}} forme', 'Praticar {{count}} formas'),
  questionInstruction: T('Elige la forma que completa la expresión.', 'Choose the form that completes the phrase.', 'Choisis la forme qui complète l’expression.', 'Wähle die Form, die den Ausdruck vervollständigt.', 'Scegli la forma che completa l’espressione.', 'Escolhe a forma que completa a expressão.'),
  questionProgress: T('Pregunta {{current}} de {{total}}', 'Question {{current}} of {{total}}', 'Question {{current}} sur {{total}}', 'Frage {{current}} von {{total}}', 'Domanda {{current}} di {{total}}', 'Pergunta {{current}} de {{total}}'),
  correct: T('¡Correcto!', 'Correct!', 'Correct !', 'Richtig!', 'Corretto!', 'Correto!'),
  tryAgain: T('Casi. La expresión que practicamos es:', 'Not quite. The phrase we are practising is:', 'Pas tout à fait. Voici l’expression étudiée :', 'Fast. Der geübte Ausdruck lautet:', 'Quasi. L’espressione che stiamo studiando è:', 'Quase. A expressão que estamos a praticar é:'),
  next: T('Siguiente', 'Next', 'Suivant', 'Weiter', 'Avanti', 'Seguinte'),
  results: T('Ver resultado', 'See results', 'Voir le résultat', 'Ergebnis ansehen', 'Vedi il risultato', 'Ver resultado'),
  score: T('Has acertado {{correct}} de {{total}}.', 'You got {{correct}} out of {{total}} correct.', 'Tu as {{correct}} bonnes réponses sur {{total}}.', 'Du hast {{correct}} von {{total}} richtig.', 'Hai risposto correttamente a {{correct}} domande su {{total}}.', 'Acertaste {{correct}} em {{total}}.'),
  again: T('Repetir sesión', 'Try again', 'Recommencer', 'Noch einmal üben', 'Riprova', 'Repetir sessão'),
  backToStudy: T('Volver a las fichas', 'Back to study cards', 'Retour aux fiches', 'Zurück zu den Lernkarten', 'Torna alle schede', 'Voltar aos cartões'),
  note: T(
    'La lista reúne las formas marcadas como clasificadores en el vocabulario de las lecciones. Algunas acompañan nombres; otras expresan edad, hora, duración, peso o dinero. 杯 depende de qué se cuenta: 一杯水 es una bebida servida en taza o vaso; para el recipiente se dice 一个杯子.',
    'This list gathers the forms marked as classifiers in the lesson vocabulary. Some go with nouns; others express age, clock time, duration, weight or money. 杯 depends on what is being counted: 一杯水 is a serving of water in a cup or glass; for the container itself, say 一个杯子.',
    'Cette liste rassemble les formes marquées comme classificateurs dans le vocabulaire des leçons. Certaines accompagnent un nom ; d’autres expriment l’âge, l’heure, une durée, un poids ou une somme d’argent. 杯 dépend de ce que l’on compte : 一杯水 est une boisson servie dans une tasse ou un verre ; pour le récipient, on dit 一个杯子.',
    'Diese Liste enthält die Formen, die im Lektionenwortschatz als Zählwörter markiert sind. Einige stehen bei Nomen, andere geben Alter, Uhrzeit, Dauer, Gewicht oder Geld an. 杯 hängt davon ab, was gezählt wird: 一杯水 ist eine Portion Wasser in einer Tasse oder einem Glas; für das Gefäß sagt man 一个杯子.',
    'L’elenco raccoglie le forme indicate come classificatori nel vocabolario delle lezioni. Alcune accompagnano i nomi; altre esprimono età, ora, durata, peso o denaro. 杯 dipende da cosa si conta: 一杯水 è una bevanda servita in tazza o bicchiere; per il recipiente si dice 一个杯子.',
    'A lista reúne as formas marcadas como classificadores no vocabulário das lições. Algumas acompanham nomes; outras indicam idade, hora, duração, peso ou dinheiro. 杯 depende do que se conta: 一杯水 é uma bebida servida numa chávena ou copo; para o recipiente diz-se 一个杯子.'
  ),
  usagesTitle: T('Uso', 'Use', 'Usage', 'Verwendung', 'Uso', 'Uso'),
};

export const classifiers = [
  {
    id: 'ben', character: '本', pinyin: 'běn',
    use: T('libros y volúmenes', 'books and volumes', 'les livres et les ouvrages', 'Bücher und Bände', 'libri e volumi', 'livros e volumes'),
    examples: [
      E('一', '本', '书', '一本书', 'yì běn shū', T('un libro', 'a book', 'un livre', 'ein Buch', 'un libro', 'um livro')),
      E('两', '本', '词典', '两本词典', 'liǎng běn cídiǎn', T('dos diccionarios', 'two dictionaries', 'deux dictionnaires', 'zwei Wörterbücher', 'due dizionari', 'dois dicionários')),
    ],
  },
  {
    id: 'bei', character: '杯', pinyin: 'bēi',
    use: T('porciones de bebida servidas en taza o vaso', 'servings of a drink in a cup or glass', 'des portions de boisson servies dans une tasse ou un verre', 'Portionen eines Getränks in Tasse oder Glas', 'porzioni di bevanda servite in tazza o bicchiere', 'porções de bebida servidas em chávena ou copo'),
    examples: [
      E('一', '杯', '水', '一杯水', 'yì bēi shuǐ', T('una taza o un vaso de agua', 'a cup or glass of water', 'une tasse ou un verre d’eau', 'eine Tasse oder ein Glas Wasser', 'una tazza o un bicchiere d’acqua', 'uma chávena ou um copo de água')),
      E('一', '杯', '咖啡', '一杯咖啡', 'yì bēi kāfēi', T('una taza de café', 'a cup of coffee', 'une tasse de café', 'eine Tasse Kaffee', 'una tazza di caffè', 'uma chávena de café')),
    ],
  },
  {
    id: 'zhang', character: '张', pinyin: 'zhāng',
    use: T('objetos planos, como fotos y hojas de papel', 'flat things such as photos and sheets of paper', 'les objets plats comme les photos et les feuilles de papier', 'flache Dinge wie Fotos und Papierblätter', 'oggetti piatti, come foto e fogli di carta', 'objetos planos, como fotografias e folhas de papel'),
    examples: [
      E('一', '张', '照片', '一张照片', 'yì zhāng zhàopiàn', T('una foto', 'a photo', 'une photo', 'ein Foto', 'una foto', 'uma fotografia')),
      E('两', '张', '照片', '两张照片', 'liǎng zhāng zhàopiàn', T('dos fotos', 'two photos', 'deux photos', 'zwei Fotos', 'due foto', 'duas fotografias')),
    ],
  },
  {
    id: 'liang', character: '辆', pinyin: 'liàng',
    use: T('vehículos, como coches y bicicletas', 'vehicles such as cars and bicycles', 'les véhicules comme les voitures et les vélos', 'Fahrzeuge wie Autos und Fahrräder', 'veicoli, come auto e biciclette', 'veículos, como carros e bicicletas'),
    examples: [
      E('一', '辆', '车', '一辆车', 'yí liàng chē', T('un coche', 'a car', 'une voiture', 'ein Auto', 'un’auto', 'um carro')),
      E('两', '辆', '自行车', '两辆自行车', 'liǎng liàng zìxíngchē', T('dos bicicletas', 'two bicycles', 'deux vélos', 'zwei Fahrräder', 'due biciclette', 'duas bicicletas')),
    ],
  },
  {
    id: 'kou', character: '口', pinyin: 'kǒu',
    use: T('personas que forman parte de una familia', 'members of a family', 'les membres d’une famille', 'Familienmitglieder', 'i membri di una famiglia', 'membros de uma família'),
    examples: [
      E('几', '口', '人', '几口人', 'jǐ kǒu rén', T('cuántas personas (en una familia)', 'how many people (in a family)', 'combien de personnes (dans une famille)', 'wie viele Personen (in einer Familie)', 'quante persone (in una famiglia)', 'quantas pessoas (numa família)')),
      E('六', '口', '人', '六口人', 'liù kǒu rén', T('seis personas en la familia', 'six people in the family', 'six personnes dans la famille', 'sechs Personen in der Familie', 'sei persone in famiglia', 'seis pessoas na família')),
    ],
  },
  {
    id: 'ge', character: '个', pinyin: 'gè',
    use: T('personas y muchos objetos; clasificador general', 'people and many objects; the general classifier', 'les personnes et beaucoup d’objets ; classificateur général', 'Personen und viele Dinge; das allgemeine Zählwort', 'persone e molti oggetti; classificatore generale', 'pessoas e muitos objetos; classificador geral'),
    examples: [
      E('两', '个', '人', '两个人', 'liǎng gè rén', T('dos personas', 'two people', 'deux personnes', 'zwei Personen', 'due persone', 'duas pessoas')),
      E('一', '个', '学生', '一个学生', 'yí gè xuésheng', T('un estudiante', 'one student', 'un étudiant', 'ein Schüler', 'uno studente', 'um estudante')),
    ],
  },
  {
    id: 'sui', character: '岁', pinyin: 'suì',
    use: T('edad en años', 'age in years', 'l’âge en années', 'das Alter in Jahren', 'l’età in anni', 'idade em anos'),
    examples: [
      E('五', '岁', '', '五岁', 'wǔ suì', T('cinco años (de edad)', 'five years old', 'cinq ans', 'fünf Jahre alt', 'cinque anni', 'cinco anos')),
      E('二十', '岁', '', '二十岁', 'èrshí suì', T('veinte años (de edad)', 'twenty years old', 'vingt ans', 'zwanzig Jahre alt', 'vent’anni', 'vinte anos')),
    ],
  },
  {
    id: 'dian-time', character: '点（钟）', short: '点', pinyin: 'diǎn (zhōng)',
    use: T('la hora del día', 'the hour of the day', 'l’heure de la journée', 'die Uhrzeit', 'l’ora del giorno', 'a hora do dia'),
    examples: [
      E('两', '点', '钟', '两点钟', 'liǎng diǎn zhōng', T('las dos en punto', 'two o’clock', 'deux heures', 'zwei Uhr', 'le due', 'duas horas')),
      E('八', '点', '半', '八点半', 'bā diǎn bàn', T('las ocho y media', 'half past eight', 'huit heures et demie', 'halb neun', 'le otto e mezza', 'oito e meia')),
    ],
  },
  {
    id: 'fen', character: '分', pinyin: 'fēn',
    use: T('minutos y la fracción más pequeña de una unidad monetaria', 'minutes and the smallest fraction of a currency unit', 'les minutes et la plus petite subdivision d’une unité monétaire', 'Minuten und die kleinste Untereinheit einer Währung', 'minuti e la più piccola frazione di un’unità monetaria', 'minutos e a menor fração de uma unidade monetária'),
    examples: [
      E('十点十', '分', '', '十点十分', 'shí diǎn shí fēn', T('las diez y diez', 'ten ten', 'dix heures dix', 'zehn Uhr zehn', 'le dieci e dieci', 'dez e dez')),
      E('三元五角五', '分', '', '三元五角五分', 'sān yuán wǔ jiǎo wǔ fēn', T('tres yuanes con cincuenta y cinco céntimos', 'three yuan and fifty-five fen', 'trois yuans et cinquante-cinq fen', 'drei Yuan und fünfundfünfzig Fen', 'tre yuan e cinquantacinque fen', 'três yuans e cinquenta e cinco fen')),
    ],
  },
  {
    id: 'yixia', character: '一下', pinyin: 'yíxià',
    use: T('después de un verbo, indica una acción breve o suaviza una petición', 'after a verb, marks a brief action or softens a request', 'après un verbe, indique une action brève ou adoucit une demande', 'nach einem Verb: eine kurze Handlung oder eine höflichere Bitte', 'dopo un verbo, indica un’azione breve o attenua una richiesta', 'depois de um verbo, indica uma ação breve ou suaviza um pedido'),
    examples: [
      E('看', '一下', '', '看一下', 'kàn yíxià', T('echar un vistazo', 'take a quick look', 'jeter un coup d’œil', 'kurz ansehen', 'dare un’occhiata', 'dar uma olhadela')),
      E('问', '一下', '', '问一下', 'wèn yíxià', T('preguntar un momento / hacer una consulta', 'ask briefly', 'poser rapidement une question', 'kurz nachfragen', 'chiedere un momento', 'perguntar rapidamente')),
    ],
  },
  {
    id: 'yihuir', character: '一会儿', pinyin: 'yíhuìr',
    use: T('un rato; aparece con acciones que duran un momento', 'a little while; used with actions lasting briefly', 'un moment ; accompagne des actions de courte durée', 'eine Weile; steht bei kurz andauernden Handlungen', 'un po’; si usa con azioni di breve durata', 'um bocadinho; usa-se com ações de curta duração'),
    examples: [
      E('等', '一会儿', '', '等一会儿', 'děng yíhuìr', T('esperar un rato', 'wait a little while', 'attendre un moment', 'eine Weile warten', 'aspettare un po’', 'esperar um bocadinho')),
      E('休息', '一会儿', '', '休息一会儿', 'xiūxi yíhuìr', T('descansar un rato', 'rest for a little while', 'se reposer un moment', 'eine Weile ausruhen', 'riposare un po’', 'descansar um bocadinho')),
    ],
  },
  {
    id: 'tiao', character: '条', pinyin: 'tiáo',
    use: T('cosas largas o estrechas, como calles, dragones o perros', 'long or narrow things, such as roads, dragons or dogs', 'les choses longues ou étroites, comme les rues, les dragons ou les chiens', 'lange oder schmale Dinge wie Straßen, Drachen oder Hunde', 'cose lunghe o strette, come strade, draghi o cani', 'coisas compridas ou estreitas, como ruas, dragões ou cães'),
    examples: [
      E('一', '条', '马路', '一条马路', 'yì tiáo mǎlù', T('una calle', 'a road', 'une route', 'eine Straße', 'una strada', 'uma estrada')),
      E('一', '条', '狗', '一条狗', 'yì tiáo gǒu', T('un perro', 'a dog', 'un chien', 'ein Hund', 'un cane', 'um cão')),
    ],
  },
  {
    id: 'dianer', character: '（一）点儿', short: '点儿', pinyin: '(yì) diǎnr',
    use: T('una pequeña cantidad; 一 puede omitirse en expresiones como 吃点儿', 'a small amount; 一 can be omitted in phrases like 吃点儿', 'une petite quantité ; 一 peut être omis dans des expressions comme 吃点儿', 'eine kleine Menge; 一 kann in Wendungen wie 吃点儿 entfallen', 'una piccola quantità; 一 può essere omesso in espressioni come 吃点儿', 'uma pequena quantidade; 一 pode ser omitido em expressões como 吃点儿'),
    examples: [
      E('吃', '点儿', '饺子', '吃点儿饺子', 'chī diǎnr jiǎozi', T('comer unos dumplings', 'eat some dumplings', 'manger quelques raviolis chinois', 'ein paar Jiaozi essen', 'mangiare qualche raviolo cinese', 'comer alguns dumplings')),
      E('看', '点儿', '书', '看点儿书', 'kàn diǎnr shū', T('leer un poco', 'read a little', 'lire un peu', 'ein wenig lesen', 'leggere un po’', 'ler um pouco')),
    ],
  },
  {
    id: 'jin', character: '斤', pinyin: 'jīn',
    use: T('peso: una 斤 equivale a 500 gramos', 'weight: one 斤 is 500 grams', 'le poids : une 斤 équivaut à 500 grammes', 'Gewicht: ein 斤 entspricht 500 Gramm', 'peso: una 斤 equivale a 500 grammi', 'peso: uma 斤 equivale a 500 gramas'),
    examples: [
      E('一', '斤', '', '一斤', 'yì jīn', T('medio kilo', '500 grams', '500 grammes', '500 Gramm', '500 grammi', '500 gramas')),
      E('十', '斤', '苹果', '十斤苹果', 'shí jīn píngguǒ', T('cinco kilos de manzanas', 'five kilograms of apples', 'cinq kilos de pommes', 'fünf Kilogramm Äpfel', 'cinque chili di mele', 'cinco quilos de maçãs')),
    ],
  },
  {
    id: 'kuai', character: '块（钱）', short: '块', pinyin: 'kuài (qián)',
    use: T('unidad coloquial de dinero, equivalente a un yuan', 'colloquial unit of money, equivalent to one yuan', 'unité d’argent familière, équivalente à un yuan', 'umgangssprachliche Geldeinheit, entspricht einem Yuan', 'unità colloquiale di denaro, equivalente a uno yuan', 'unidade coloquial de dinheiro, equivalente a um yuan'),
    examples: [
      E('五', '块', '钱', '五块钱', 'wǔ kuài qián', T('cinco yuanes', 'five yuan', 'cinq yuans', 'fünf Yuan', 'cinque yuan', 'cinco yuans')),
      E('五', '块', '钱一斤', '五块钱一斤', 'wǔ kuài qián yì jīn', T('cinco yuanes por 500 gramos', 'five yuan per 500 grams', 'cinq yuans les 500 grammes', 'fünf Yuan pro 500 Gramm', 'cinque yuan per 500 grammi', 'cinco yuans por 500 gramas')),
    ],
  },
  {
    id: 'jian', character: '件', pinyin: 'jiàn',
    use: T('prendas de ropa y algunos asuntos o artículos', 'items of clothing and some matters or objects', 'les vêtements et certains objets ou affaires', 'Kleidungsstücke und einige Dinge oder Angelegenheiten', 'capi d’abbigliamento e alcuni oggetti o fatti', 'peças de roupa e alguns objetos ou assuntos'),
    examples: [
      E('两', '件', '衣服', '两件衣服', 'liǎng jiàn yīfu', T('dos prendas de ropa', 'two items of clothing', 'deux vêtements', 'zwei Kleidungsstücke', 'due capi d’abbigliamento', 'duas peças de roupa')),
      E('这', '件', '衣服', '这件衣服', 'zhè jiàn yīfu', T('esta prenda de ropa', 'this item of clothing', 'ce vêtement', 'dieses Kleidungsstück', 'questo capo d’abbigliamento', 'esta peça de roupa')),
    ],
  },
  {
    id: 'xie', character: '些', pinyin: 'xiē',
    use: T('una cantidad pequeña o indefinida de cosas; algunos/as', 'a small or unspecified number of things; some', 'une petite quantité ou un nombre indéfini de choses ; quelques', 'eine kleine oder unbestimmte Anzahl; einige', 'una quantità piccola o indefinita di cose; alcuni/e', 'uma quantidade pequena ou indefinida de coisas; alguns/algumas'),
    examples: [
      E('一', '些', '学生', '一些学生', 'yìxiē xuésheng', T('algunos estudiantes', 'some students', 'quelques élèves', 'einige Schüler', 'alcuni studenti', 'alguns estudantes')),
      E('这', '些', '苹果', '这些苹果', 'zhèxiē píngguǒ', T('estas manzanas', 'these apples', 'ces pommes', 'diese Äpfel', 'queste mele', 'estas maçãs')),
    ],
  },
  {
    id: 'yuan', character: '元', pinyin: 'yuán',
    use: T('unidad básica oficial del renminbi', 'the official base unit of the renminbi', 'l’unité de base officielle du renminbi', 'die offizielle Grundeinheit des Renminbi', 'l’unità base ufficiale del renminbi', 'a unidade base oficial do renminbi'),
    examples: [
      E('一百二十九', '元', '', '一百二十九元', 'yìbǎi èrshíjiǔ yuán', T('129 yuanes', '129 yuan', '129 yuans', '129 Yuan', '129 yuan', '129 yuans')),
      E('十', '元', '', '十元', 'shí yuán', T('10 yuanes', '10 yuan', '10 yuans', '10 Yuan', '10 yuan', '10 yuans')),
    ],
  },
  {
    id: 'jiao', character: '角', pinyin: 'jiǎo',
    use: T('una décima parte de un yuan; también se dice 毛', 'one tenth of a yuan; also called 毛', 'un dixième de yuan ; se dit aussi 毛', 'ein Zehntel Yuan; auch 毛 genannt', 'un decimo di yuan; si dice anche 毛', 'um décimo de yuan; também chamado 毛'),
    examples: [
      E('八十元六', '角', '', '八十元六角', 'bāshí yuán liù jiǎo', T('80 yuanes con 6 jiao', '80 yuan and 6 jiao', '80 yuans et 6 jiao', '80 Yuan und 6 Jiao', '80 yuan e 6 jiao', '80 yuans e 6 jiao')),
      E('五元三', '角', '', '五元三角', 'wǔ yuán sān jiǎo', T('cinco yuanes con tres jiao', 'five yuan and three jiao', 'cinq yuans et trois jiao', 'fünf Yuan und drei Jiao', 'cinque yuan e tre jiao', 'cinco yuans e três jiao')),
    ],
  },
  {
    id: 'mao', character: '毛', pinyin: 'máo',
    use: T('nombre coloquial de 角: una décima parte de un yuan', 'colloquial name for 角: one tenth of a yuan', 'nom familier de 角 : un dixième de yuan', 'umgangssprachliche Bezeichnung für 角: ein Zehntel Yuan', 'nome colloquiale di 角: un decimo di yuan', 'nome coloquial de 角: um décimo de yuan'),
    examples: [
      E('五', '毛', '钱', '五毛钱', 'wǔ máo qián', T('cinco mao, es decir, medio yuan', 'five mao, or half a yuan', 'cinq mao, soit un demi-yuan', 'fünf Mao, also ein halber Yuan', 'cinque mao, cioè mezzo yuan', 'cinco mao, ou meio yuan')),
      E('一', '毛', '钱', '一毛钱', 'yì máo qián', T('un mao, una décima de yuan', 'one mao, one tenth of a yuan', 'un mao, un dixième de yuan', 'ein Mao, ein Zehntel Yuan', 'uno mao, un decimo di yuan', 'um mao, um décimo de yuan')),
    ],
  },
  {
    id: 'ceng', character: '层', pinyin: 'céng',
    use: T('pisos de un edificio o capas', 'building floors or layers', 'les étages d’un bâtiment ou les couches', 'Stockwerke oder Schichten', 'piani di un edificio o strati', 'andares de um edifício ou camadas'),
    examples: [
      E('一', '层', '', '一层', 'yì céng', T('primer piso / una planta', 'first floor / one story', 'premier étage / un niveau', 'erstes Stockwerk / ein Geschoss', 'primo piano / un livello', 'primeiro andar / um piso')),
      E('十', '层', '', '十层', 'shí céng', T('décimo piso / diez plantas', 'tenth floor / ten stories', 'dixième étage / dix niveaux', 'zehntes Stockwerk / zehn Geschosse', 'decimo piano / dieci piani', 'décimo andar / dez pisos')),
    ],
  },
  {
    id: 'du', character: '度', pinyin: 'dù',
    use: T('grados, por ejemplo al indicar la temperatura', 'degrees, for example when giving a temperature', 'les degrés, par exemple pour indiquer la température', 'Grad, zum Beispiel bei Temperaturangaben', 'gradi, per esempio per indicare la temperatura', 'graus, por exemplo ao indicar a temperatura'),
    examples: [
      E('37', '度', '', '37度', 'sānshíqī dù', T('37 grados', '37 degrees', '37 degrés', '37 Grad', '37 gradi', '37 graus')),
      E('38', '度', '4', '38度4', 'sānshíbā dù sì', T('38,4 grados', '38.4 degrees', '38,4 degrés', '38,4 Grad', '38,4 gradi', '38,4 graus')),
    ],
  },
];
