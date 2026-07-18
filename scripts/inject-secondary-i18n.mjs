// scripts/inject-secondary-i18n.mjs
// Inyecta traducciones (en, fr, de, it, pt) en los datos "secundarios" que
// seguían solo en español:
//
//  - public/data/hsk1-data.json
//      characters[*].meaningTr   — reutiliza libro-data.json donde el carácter
//                                  coincide; el resto está autorado aquí.
//      consonants[*].soundTr     — descripciones fonéticas por idioma (cada
//                                  idioma usa sus propias palabras de referencia).
//      specialSyllables[*].soundTr — generadas por patrón desde el español.
//  - public/data/radicals-data.json
//      radicals[*].meaningTr / explanationTr / frequencyTr
//  - public/data/libro-data.json
//      lessons[*].titleTr        — títulos de las 8 lecciones.
//
// El español sigue siendo el campo base (meaning/sound/explanation/…); la app
// resuelve el idioma activo con el mismo patrón que ya usa para meaningTr.
//
// Ejecutar:  node scripts/inject-secondary-i18n.mjs
// OJO: tras cambiar los JSON hay que subir APP_VERSION (caché versionada).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HSK_FILE = join(ROOT, 'public', 'data', 'hsk1-data.json');
const RAD_FILE = join(ROOT, 'public', 'data', 'radicals-data.json');
const LIBRO_FILE = join(ROOT, 'public', 'data', 'libro-data.json');

const tr = (en, fr, de, it, pt) => ({ en, fr, de, it, pt });

// ─── 1. Caracteres HSK1 sin equivalente en libro-data (o con acepción distinta) ──
const HSK_TR = {
  '中': tr('center; middle', 'centre; milieu', 'Mitte; Zentrum', 'centro; mezzo', 'centro; meio'),
  '一': tr('one', 'un', 'eins', 'uno', 'um'),
  '二': tr('two', 'deux', 'zwei', 'due', 'dois'),
  '三': tr('three', 'trois', 'drei', 'tre', 'três'),
  '四': tr('four', 'quatre', 'vier', 'quattro', 'quatro'),
  '五': tr('five', 'cinq', 'fünf', 'cinque', 'cinco'),
  '六': tr('six', 'six', 'sechs', 'sei', 'seis'),
  '七': tr('seven', 'sept', 'sieben', 'sette', 'sete'),
  '八': tr('eight', 'huit', 'acht', 'otto', 'oito'),
  '九': tr('nine', 'neuf', 'neun', 'nove', 'nove'),
  '十': tr('ten', 'dix', 'zehn', 'dieci', 'dez'),
  '火': tr('fire', 'feu', 'Feuer', 'fuoco', 'fogo'),
  '山': tr('mountain', 'montagne', 'Berg', 'montagna', 'montanha'),
  '木': tr('tree; wood', 'arbre; bois', 'Baum; Holz', 'albero; legno', 'árvore; madeira'),
  '今': tr('now; today', 'maintenant; aujourd’hui', 'jetzt; heute', 'ora; oggi', 'agora; hoje'),
  '明': tr('bright; clear', 'brillant; clair', 'hell; klar', 'luminoso; chiaro', 'brilhante; claro'),
  '上': tr('up; to go up', 'en haut; monter', 'oben; hinaufgehen', 'sopra; salire', 'em cima; subir'),
  '南': tr('south', 'sud', 'Süden', 'sud', 'sul'),
  '了': tr('(particle of change)', '(particule de changement)', '(Partikel für Veränderung)', '(particella di cambiamento)', '(partícula de mudança)'),
  '它': tr('it (non-human)', 'cela (non humain)', 'es (nicht menschlich)', 'esso (non umano)', 'ele/ela (não humano)'),
  '见': tr('to see; to meet', 'voir; se rencontrer', 'sehen; treffen', 'vedere; incontrarsi', 'ver; encontrar-se'),
  '读': tr('to read; to study', 'lire; étudier', 'lesen; studieren', 'leggere; studiare', 'ler; estudar'),
  '会': tr('can (skill); to be able to', 'savoir (compétence); pouvoir', 'können (Fähigkeit)', 'sapere (abilità); potere', 'saber (habilidade); poder'),
  '用': tr('to use', 'utiliser', 'benutzen', 'usare', 'usar'),
  '住': tr('to live; to reside', 'habiter; résider', 'wohnen', 'abitare; risiedere', 'morar; residir'),
  '走': tr('to walk; to leave', 'marcher; partir', 'gehen; weggehen', 'camminare; andarsene', 'andar; ir embora'),
  '开': tr('to open; to drive', 'ouvrir; conduire', 'öffnen; fahren', 'aprire; guidare', 'abrir; dirigir'),
  '关': tr('to close; to turn off', 'fermer; éteindre', 'schließen; ausschalten', 'chiudere; spegnere', 'fechar; desligar'),
  '对': tr('correct; towards', 'correct; vers', 'richtig; gegenüber', 'corretto; verso', 'correto; para'),
  '让': tr('to let; to allow', 'laisser; permettre', 'lassen; erlauben', 'lasciare; permettere', 'deixar; permitir'),
  '名': tr('name; fame', 'nom; renommée', 'Name; Ruhm', 'nome; fama', 'nome; fama'),
  '字': tr('character; letter', 'caractère; lettre', 'Schriftzeichen; Buchstabe', 'carattere; lettera', 'caractere; letra'),
  '谢': tr('to thank', 'remercier', 'danken', 'ringraziare', 'agradecer'),
  '不好': tr('bad; not good', 'mauvais; pas bien', 'schlecht; nicht gut', 'male; non buono', 'mau; não bom'),
  '高': tr('tall; high', 'grand; haut', 'groß; hoch', 'alto', 'alto'),
  '低': tr('low (height/sound)', 'bas (hauteur/son)', 'niedrig; tief', 'basso (altezza/suono)', 'baixo (altura/som)'),
  '长': tr('long', 'long', 'lang', 'lungo', 'longo'),
  '短': tr('short', 'court', 'kurz', 'corto', 'curto'),
  '远': tr('far', 'loin', 'weit', 'lontano', 'longe'),
  '近': tr('near', 'proche', 'nah', 'vicino', 'perto'),
  '热': tr('hot', 'chaud', 'heiß', 'caldo', 'quente'),
  '旧': tr('old (things)', 'vieux (objets)', 'alt (Sachen)', 'vecchio (oggetti)', 'velho (objetos)'),
  '好喝': tr('tasty (drinks)', 'bon (boisson)', 'lecker (Getränke)', 'buono (da bere)', 'gostoso (bebida)'),
  '中国人': tr('Chinese (person)', 'Chinois(e)', 'Chinese/Chinesin', 'cinese (persona)', 'chinês/chinesa (pessoa)'),
  '北京': tr('Beijing', 'Pékin', 'Peking', 'Pechino', 'Pequim'),
  '上海': tr('Shanghai', 'Shanghai', 'Shanghai', 'Shanghai', 'Xangai'),
  '儿子': tr('son', 'fils', 'Sohn', 'figlio', 'filho'),
  '女士': tr('madam; lady', 'madame', 'Dame; Frau', 'signora', 'senhora'),
  '点': tr('o’clock; hour', 'heure (pile)', 'Uhr (Uhrzeit)', 'in punto; ora', 'hora (em ponto)'),
  '分钟': tr('minute', 'minute', 'Minute', 'minuto', 'minuto'),
  '时候': tr('time; moment', 'moment', 'Zeit; Moment', 'tempo; momento', 'tempo; momento'),
  '中午': tr('noon', 'midi', 'Mittag', 'mezzogiorno', 'meio-dia'),
  '爱': tr('to love; love', 'aimer; amour', 'lieben; Liebe', 'amare; amore', 'amar; amor'),
  '觉得': tr('to think; to feel', 'trouver; penser', 'finden; meinen', 'pensare; sembrare', 'achar; pensar'),
  '非常': tr('very; extremely', 'très; extrêmement', 'sehr; äußerst', 'molto; estremamente', 'muito; extremamente'),
  '一点儿': tr('a little', 'un peu', 'ein bisschen', 'un po’', 'um pouco'),
  '东西': tr('thing; object', 'chose; objet', 'Sache; Ding', 'cosa; oggetto', 'coisa; objeto'),
  '杯子': tr('glass; cup', 'verre; tasse', 'Glas; Tasse', 'bicchiere; tazza', 'copo; xícara'),
  '面条': tr('noodles', 'nouilles', 'Nudeln', 'noodles; tagliolini', 'macarrão'),
  '菜': tr('dish; vegetable', 'plat; légume', 'Gericht; Gemüse', 'piatto; verdura', 'prato; verdura'),
  '商店': tr('shop; store', 'magasin', 'Geschäft; Laden', 'negozio', 'loja'),
  '飞机': tr('airplane', 'avion', 'Flugzeug', 'aereo', 'avião'),
  '出租车': tr('taxi', 'taxi', 'Taxi', 'taxi', 'táxi'),
  '车': tr('car; vehicle', 'voiture; véhicule', 'Auto; Fahrzeug', 'macchina; veicolo', 'carro; veículo'),
  '火车站': tr('train station', 'gare', 'Bahnhof', 'stazione ferroviaria', 'estação de trem'),
  '前面': tr('in front', 'devant', 'vorne', 'davanti', 'na frente'),
  '后面': tr('behind', 'derrière', 'hinten', 'dietro', 'atrás'),
  '里面': tr('inside', 'dedans', 'innen', 'dentro', 'dentro'),
  '外面': tr('outside', 'dehors', 'draußen', 'fuori', 'fora'),
  '中间': tr('middle; between', 'milieu; entre', 'Mitte; zwischen', 'mezzo; tra', 'meio; entre'),
  '桌子': tr('table', 'table', 'Tisch', 'tavolo', 'mesa'),
  '椅子': tr('chair', 'chaise', 'Stuhl', 'sedia', 'cadeira'),
  '本': tr('(measure word for books)', '(classificateur des livres)', '(Zähleinheitswort für Bücher)', '(classificatore per libri)', '(classificador de livros)'),
  '块': tr('piece; yuan (money unit)', 'morceau; yuan (monnaie)', 'Stück; Yuan (Geldeinheit)', 'pezzo; yuan (moneta)', 'pedaço; yuan (unidade monetária)'),
  // Radicales incluidos como "caracteres" en hsk1-data
  '宀': tr('roof; house', 'toit; maison', 'Dach; Haus', 'tetto; casa', 'telhado; casa'),
  '讠': tr('speech', 'parole', 'Sprechen; Rede', 'parola; discorso', 'fala; discurso'),
  '辶': tr('to walk', 'marcher', 'gehen', 'camminare', 'caminhar'),
  '扌': tr('hand', 'main', 'Hand', 'mano', 'mão'),
  '纟': tr('silk', 'soie', 'Seide', 'seta', 'seda'),
  '钅': tr('metal', 'métal', 'Metall', 'metallo', 'metal'),
  '彳': tr('step', 'pas', 'Schritt', 'passo', 'passo'),
  '禾': tr('grain', 'céréale', 'Getreide', 'cereale', 'grão'),
  '目': tr('eye', 'œil', 'Auge', 'occhio', 'olho'),
  '贝': tr('shell', 'coquillage', 'Muschel', 'conchiglia', 'concha'),
  '矢': tr('arrow', 'flèche', 'Pfeil', 'freccia', 'flecha'),
  '糸': tr('fine silk', 'soie fine', 'feine Seide', 'seta fine', 'seda fina'),
  // Overrides: existen en libro-data pero con otra acepción
  '找': tr('to look for', 'chercher', 'suchen', 'cercare', 'procurar'),
  '错': tr('wrong; mistake', 'faux; erreur', 'falsch; Fehler', 'sbagliato; errore', 'errado; erro'),
  '只': tr('(measure word for animals)', '(classificateur des animaux)', '(Zähleinheitswort für Tiere)', '(classificatore per animali)', '(classificador de animais)'),
  '斤': tr('axe; jin (unit of weight)', 'hache; jin (unité de poids)', 'Axt; Jin (Gewichtseinheit)', 'ascia; jin (unità di peso)', 'machado; jin (unidade de peso)'),
  '后': tr('behind; after', 'derrière; après', 'hinten; nach', 'dietro; dopo', 'atrás; depois'),
};

// ─── 2. Consonantes: descripción fonética por idioma ─────────────────────────
const CONS_TR = {
  b: tr('like "b" in "ball" (unaspirated)', 'comme « b » de « bon » (non aspiré)', 'wie „b“ in „Ball“ (unbehaucht)', 'come la "b" di "bene" (non aspirata)', 'como o "b" de "bola" (não aspirado)'),
  p: tr('like "p" in "pay" (aspirated)', '« p » aspiré (avec un souffle)', 'wie „p“ in „Post“ (behaucht)', '"p" aspirata (con soffio d’aria)', '"p" aspirado (com sopro de ar)'),
  m: tr('like "m" in "mother"', 'comme « m » de « mère »', 'wie „m“ in „Mutter“', 'come la "m" di "mamma"', 'como o "m" de "mãe"'),
  f: tr('like "f" in "food"', 'comme « f » de « feu »', 'wie „f“ in „Fisch“', 'come la "f" di "fuoco"', 'como o "f" de "fogo"'),
  d: tr('like "d" in "day"', 'comme « d » de « deux »', 'wie „d“ in „du“', 'come la "d" di "dare"', 'como o "d" de "dia"'),
  t: tr('like "t" in "tea" (aspirated)', '« t » aspiré (avec un souffle)', 'wie „t“ in „Tag“ (behaucht)', '"t" aspirata (con soffio d’aria)', '"t" aspirado (com sopro de ar)'),
  n: tr('like "n" in "night"', 'comme « n » de « nuit »', 'wie „n“ in „Nacht“', 'come la "n" di "notte"', 'como o "n" de "noite"'),
  l: tr('like "l" in "light"', 'comme « l » de « lune »', 'wie „l“ in „Licht“', 'come la "l" di "luna"', 'como o "l" de "lua"'),
  g: tr('like "g" in "go"', 'comme « g » de « gare »', 'wie „g“ in „gut“', 'come la "g" di "gatto"', 'como o "g" de "gato"'),
  k: tr('like "k" in "kite" (aspirated)', '« k » aspiré (avec un souffle)', 'wie „k“ in „kalt“ (behaucht)', '"c" dura aspirata', '"c" duro aspirado'),
  h: tr('like "h" in "hot", slightly raspy', '« h » fortement expiré, un peu râpeux', 'wie „ch“ in „Bach“, aber leichter', 'una "h" soffiata, un po’ aspra', 'como o "rr" de "carro" (leve)'),
  j: tr('like "j" in "jeep" (tongue near the teeth)', 'comme « dj » doux (langue près des dents)', 'wie „dj“, Zunge an den Zähnen', 'come la "g" di "giorno" (dolce)', 'como "dj" suave (língua junto aos dentes)'),
  q: tr('like "ch" in "cheap" (aspirated, soft)', 'comme « tch » doux et aspiré', 'wie „tj“/„tch“, weich und behaucht', 'come la "c" di "cena", aspirata', 'como "tch" suave e aspirado'),
  x: tr('between "s" and "sh", soft', 'entre « s » et « ch », doux', 'zwischen „s“ und „sch“, weich', 'tra "s" e "sc" di "scena", dolce', 'entre "s" e "x" de "xícara", suave'),
  zh: tr('like "j" in "judge" (tongue curled back)', 'comme « dj » avec la langue recourbée', 'wie „dsch“ in „Dschungel“, Zunge zurückgebogen', 'come la "g" di "giorno" con lingua arretrata', 'como "dj" com a língua recurvada'),
  ch: tr('like "ch" in "church" (aspirated, tongue curled back)', 'comme « tch » aspiré, langue recourbée', 'wie „tsch“ in „Tschüss“, behaucht', 'come la "c" di "cena" aspirata, lingua arretrata', 'como "tch" aspirado, língua recurvada'),
  sh: tr('like "sh" in "shirt" (tongue curled back)', 'comme « ch » de « chat », langue recourbée', 'wie „sch“ in „Schule“, Zunge zurückgebogen', 'come "sc" di "scena", lingua arretrata', 'como o "x" de "xícara", língua recurvada'),
  r: tr('like "r" in "run" with tongue curled back', 'proche du « r » anglais, langue recourbée', 'wie englisches „r“, Zunge zurückgebogen', 'come la "r" inglese, lingua arretrata', 'como o "r" inglês, língua recurvada'),
  z: tr('like "ds" in "kids"', 'comme « dz »', 'wie „ds“ in „abends“', 'come la "z" di "zaino" ("ds")', 'como "ds"'),
  c: tr('like "ts" in "cats" (aspirated)', 'comme « ts » aspiré', 'wie „z“ in „Zeit“ (behaucht)', 'come la "z" di "pizza" ("ts" aspirata)', 'como "ts" aspirado'),
  s: tr('like "s" in "sun"', 'comme « s » de « soleil »', 'wie „ss“ in „Wasser“', 'come la "s" di "sole"', 'como o "s" de "sol"'),
  y: tr('semivowel close to initial "i"; e.g. yī (衣)', 'semi-voyelle proche du « i » initial ; ex. yī (衣)', 'Halbvokal, ähnlich einem „i“ am Anfang; z. B. yī (衣)', 'semivocale vicina alla "i" iniziale; es. yī (衣)', 'semivogal próxima do "i" inicial; ex. yī (衣)'),
  w: tr('semivowel close to initial "u"; e.g. wū (屋)', 'semi-voyelle proche du « ou » initial ; ex. wū (屋)', 'Halbvokal, ähnlich einem „u“ am Anfang; z. B. wū (屋)', 'semivocale vicina alla "u" iniziale; es. wū (屋)', 'semivogal próxima do "u" inicial; ex. wū (屋)'),
};

// ─── 3. Sílabas especiales: por patrón del texto español ─────────────────────
function specialSoundTr(es) {
  if (es.includes("no es vocal plena")) {
    return tr("whole-syllable reading; the 'i' is not a full vowel",
      "syllabe à lecture globale ; le « i » n’est pas une vraie voyelle",
      "ganzheitlich gelesene Silbe; das „i“ ist kein voller Vokal",
      "sillaba a lettura globale; la 'i' non è una vocale piena",
      "sílaba de leitura global; o 'i' não é vogal plena");
  }
  if (es.includes("débil")) {
    return tr("whole-syllable reading; weak 'i'",
      "syllabe à lecture globale ; « i » faible",
      "ganzheitlich gelesene Silbe; schwaches „i“",
      "sillaba a lettura globale; 'i' debole",
      "sílaba de leitura global; 'i' fraco");
  }
  let m = es.match(/^inicial '(.+)' \+ '(.+)' \((.+)\)$/);
  if (m) {
    const [, a, b, ex] = m;
    return tr(`initial '${a}' + '${b}' (${ex})`,
      `initiale « ${a} » + « ${b} » (${ex})`,
      `Anlaut „${a}“ + „${b}“ (${ex})`,
      `iniziale '${a}' + '${b}' (${ex})`,
      `inicial '${a}' + '${b}' (${ex})`);
  }
  m = es.match(/^variante con '(.+)' \+ '(.+)' \((.+)\)$/);
  if (m) {
    const [, a, b, ex] = m;
    return tr(`variant with '${a}' + '${b}' (${ex})`,
      `variante avec « ${a} » + « ${b} » (${ex})`,
      `Variante mit „${a}“ + „${b}“ (${ex})`,
      `variante con '${a}' + '${b}' (${ex})`,
      `variante com '${a}' + '${b}' (${ex})`);
  }
  return null;
}

// ─── 4. Radicales: significado + explicación ─────────────────────────────────
const RAD = {
  '一': { m: tr('one, horizontal line', 'un, ligne horizontale', 'Eins, waagerechte Linie', 'uno, linea orizzontale', 'um, linha horizontal'),
    e: tr('The most basic horizontal stroke. It represents the number one or a straight line.', 'Le trait horizontal le plus basique. Il représente le chiffre un ou une ligne droite.', 'Der grundlegendste waagerechte Strich. Er steht für die Zahl Eins oder eine gerade Linie.', 'Il tratto orizzontale più basilare. Rappresenta il numero uno o una linea retta.', 'O traço horizontal mais básico. Representa o número um ou uma linha reta.') },
  '丨': { m: tr('vertical line', 'ligne verticale', 'senkrechte Linie', 'linea verticale', 'linha vertical'),
    e: tr('A vertical stroke. It represents something connecting top and bottom.', 'Trait vertical. Il représente quelque chose qui relie le haut et le bas.', 'Senkrechter Strich. Er stellt etwas dar, das oben und unten verbindet.', 'Tratto verticale. Rappresenta qualcosa che collega l’alto e il basso.', 'Traço vertical. Representa algo que liga a parte de cima à de baixo.') },
  '丶': { m: tr('dot, drop', 'point, goutte', 'Punkt, Tropfen', 'punto, goccia', 'ponto, gota'),
    e: tr('A dot or a drop. Used as an accent or a mark.', 'Un point ou une goutte. Utilisé comme accent ou marque.', 'Ein Punkt oder Tropfen. Wird als Akzent oder Markierung verwendet.', 'Un punto o una goccia. Usato come accento o segno.', 'Um ponto ou gota. Usado como acento ou marca.') },
  '丿': { m: tr('slanted stroke', 'trait incliné', 'schräger Strich', 'tratto inclinato', 'traço inclinado'),
    e: tr('A stroke falling to the left. It represents movement.', 'Trait qui descend vers la gauche. Il représente le mouvement.', 'Ein nach links fallender Strich. Er stellt Bewegung dar.', 'Tratto che scende verso sinistra. Rappresenta il movimento.', 'Traço que cai para a esquerda. Representa movimento.') },
  '乙': { m: tr('second, hook', 'deuxième, crochet', 'Zweiter, Haken', 'secondo, uncino', 'segundo, gancho'),
    e: tr('The second of the Ten Heavenly Stems. Hook-shaped.', 'Le deuxième des Dix Troncs Célestes. En forme de crochet.', 'Der zweite der Zehn Himmelsstämme. Hakenförmig.', 'Il secondo dei Dieci Tronchi Celesti. A forma di uncino.', 'O segundo dos Dez Troncos Celestiais. Em forma de gancho.') },
  '二': { m: tr('two', 'deux', 'zwei', 'due', 'dois'),
    e: tr('Two horizontal lines. It represents the number two.', 'Deux lignes horizontales. Représente le chiffre deux.', 'Zwei waagerechte Linien. Steht für die Zahl Zwei.', 'Due linee orizzontali. Rappresenta il numero due.', 'Duas linhas horizontais. Representa o número dois.') },
  '亠': { m: tr('lid, cover', 'couvercle, chapeau', 'Deckel, Abdeckung', 'coperchio, copertura', 'tampa, cobertura'),
    e: tr('A lid or cover. It appears at the top of characters.', 'Un couvercle. Il apparaît en haut des caractères.', 'Ein Deckel. Er erscheint oben in Schriftzeichen.', 'Un coperchio. Appare nella parte superiore dei caratteri.', 'Uma tampa ou cobertura. Aparece na parte superior dos caracteres.') },
  '人': { m: tr('person, people', 'personne, gens', 'Person, Mensch', 'persona, gente', 'pessoa, gente'),
    e: tr('A standing person seen from the side. One of the most common radicals.', 'Une personne debout vue de côté. L’un des radicaux les plus courants.', 'Eine stehende Person von der Seite. Eines der häufigsten Radikale.', 'Una persona in piedi vista di lato. Uno dei radicali più comuni.', 'Uma pessoa de pé vista de lado. Um dos radicais mais comuns.') },
  '儿': { m: tr('child, legs', 'enfant, jambes', 'Kind, Beine', 'bambino, gambe', 'criança, pernas'),
    e: tr('It represents a child’s legs or a walking person.', 'Représente les jambes d’un enfant ou une personne qui marche.', 'Stellt die Beine eines Kindes oder eine gehende Person dar.', 'Rappresenta le gambe di un bambino o una persona che cammina.', 'Representa as pernas de uma criança ou uma pessoa andando.') },
  '入': { m: tr('to enter', 'entrer', 'eintreten', 'entrare', 'entrar'),
    e: tr('It represents entering a place.', 'Représente l’action d’entrer dans un lieu.', 'Stellt das Betreten eines Ortes dar.', 'Rappresenta l’entrare in un luogo.', 'Representa entrar em um lugar.') },
  '八': { m: tr('eight, to divide', 'huit, diviser', 'acht, teilen', 'otto, dividere', 'oito, dividir'),
    e: tr('Originally it meant to divide. Now it means eight.', 'À l’origine, il représentait la division. Aujourd’hui il signifie huit.', 'Ursprünglich stand es für Teilen. Heute bedeutet es Acht.', 'In origine rappresentava dividere. Ora significa otto.', 'Originalmente representava dividir. Hoje significa oito.') },
  '冂': { m: tr('border, edge', 'frontière, bord', 'Grenze, Rand', 'confine, bordo', 'fronteira, borda'),
    e: tr('It represents borders or territorial boundaries.', 'Représente des frontières ou des limites territoriales.', 'Stellt Grenzen oder Gebietsgrenzen dar.', 'Rappresenta confini o limiti territoriali.', 'Representa fronteiras ou limites territoriais.') },
  '冫': { m: tr('ice, cold', 'glace, froid', 'Eis, Kälte', 'ghiaccio, freddo', 'gelo, frio'),
    e: tr('Two drops of water representing ice or cold.', 'Deux gouttes d’eau représentant la glace ou le froid.', 'Zwei Wassertropfen, die Eis oder Kälte darstellen.', 'Due gocce d’acqua che rappresentano ghiaccio o freddo.', 'Duas gotas d’água representando gelo ou frio.') },
  '几': { m: tr('small table, almost', 'petite table, presque', 'kleiner Tisch, fast', 'tavolino, quasi', 'mesinha, quase'),
    e: tr('It represents a small table or stool.', 'Représente une petite table ou un tabouret.', 'Stellt einen kleinen Tisch oder Hocker dar.', 'Rappresenta un tavolino o uno sgabello.', 'Representa uma mesinha ou um banquinho.') },
  '凵': { m: tr('open container', 'récipient ouvert', 'offener Behälter', 'recipiente aperto', 'recipiente aberto'),
    e: tr('It represents an open container.', 'Représente un récipient ou contenant ouvert.', 'Stellt einen offenen Behälter dar.', 'Rappresenta un recipiente o contenitore aperto.', 'Representa um recipiente ou contêiner aberto.') },
  '刀': { m: tr('knife, to cut', 'couteau, couper', 'Messer, schneiden', 'coltello, tagliare', 'faca, cortar'),
    e: tr('It represents a knife. Used in characters related to cutting.', 'Représente un couteau. Utilisé dans les caractères liés à la coupe.', 'Stellt ein Messer dar. In Zeichen rund ums Schneiden verwendet.', 'Rappresenta un coltello. Usato nei caratteri legati al tagliare.', 'Representa uma faca. Usado em caracteres ligados a cortar.') },
  '力': { m: tr('strength, power', 'force, pouvoir', 'Kraft, Macht', 'forza, potere', 'força, poder'),
    e: tr('It represents a muscle or physical strength.', 'Représente un muscle ou la force physique.', 'Stellt einen Muskel oder Körperkraft dar.', 'Rappresenta un muscolo o la forza fisica.', 'Representa um músculo ou a força física.') },
  '勹': { m: tr('to wrap, to contain', 'envelopper, contenir', 'einwickeln, umhüllen', 'avvolgere, contenere', 'embrulhar, conter'),
    e: tr('It represents wrapping or containing something.', 'Représente le fait d’envelopper ou de contenir quelque chose.', 'Stellt das Einwickeln oder Umschließen von etwas dar.', 'Rappresenta l’avvolgere o il contenere qualcosa.', 'Representa embrulhar ou conter algo.') },
  '匕': { m: tr('spoon, dagger', 'cuillère, poignard', 'Löffel, Dolch', 'cucchiaio, pugnale', 'colher, punhal'),
    e: tr('It represents an ancient spoon or dagger.', 'Représente une cuillère ou un poignard antique.', 'Stellt einen alten Löffel oder Dolch dar.', 'Rappresenta un cucchiaio o un pugnale antico.', 'Representa uma colher ou um punhal antigo.') },
  '匚': { m: tr('box, container', 'boîte, contenant', 'Kasten, Behälter', 'scatola, contenitore', 'caixa, recipiente'),
    e: tr('It represents a box or square container.', 'Représente une boîte ou un contenant carré.', 'Stellt einen Kasten oder quadratischen Behälter dar.', 'Rappresenta una scatola o un contenitore quadrato.', 'Representa uma caixa ou um recipiente quadrado.') },
  '十': { m: tr('ten, complete', 'dix, complet', 'zehn, vollständig', 'dieci, completo', 'dez, completo'),
    e: tr('A cross representing the number ten or completeness.', 'Une croix représentant le chiffre dix ou la complétude.', 'Ein Kreuz, das die Zahl Zehn oder Vollständigkeit darstellt.', 'Una croce che rappresenta il numero dieci o la completezza.', 'Uma cruz que representa o número dez ou a completude.') },
  '卜': { m: tr('divination', 'divination', 'Wahrsagung', 'divinazione', 'adivinhação'),
    e: tr('It represents cracks in bones used for divination.', 'Représente les fissures des os utilisés pour la divination.', 'Stellt Risse in Orakelknochen dar.', 'Rappresenta le crepe nelle ossa usate per la divinazione.', 'Representa rachaduras em ossos usados para adivinhação.') },
  '卩': { m: tr('seal, knee', 'sceau, genou', 'Siegel, Knie', 'sigillo, ginocchio', 'selo, joelho'),
    e: tr('It represents an official seal or a bent knee.', 'Représente un sceau officiel ou un genou plié.', 'Stellt ein Amtssiegel oder ein gebeugtes Knie dar.', 'Rappresenta un sigillo ufficiale o un ginocchio piegato.', 'Representa um selo oficial ou um joelho dobrado.') },
  '厂': { m: tr('cliff, factory', 'falaise, usine', 'Klippe, Fabrik', 'rupe, fabbrica', 'penhasco, fábrica'),
    e: tr('It represents a cliff or precipice.', 'Représente une falaise ou un précipice.', 'Stellt eine Klippe oder einen Abgrund dar.', 'Rappresenta una rupe o un precipizio.', 'Representa um penhasco ou precipício.') },
  '厶': { m: tr('private, personal', 'privé, personnel', 'privat, persönlich', 'privato, personale', 'privado, pessoal'),
    e: tr('It represents something private or personal.', 'Représente quelque chose de privé ou personnel.', 'Stellt etwas Privates oder Persönliches dar.', 'Rappresenta qualcosa di privato o personale.', 'Representa algo privado ou pessoal.') },
  '又': { m: tr('right hand, again', 'main droite, encore', 'rechte Hand, wieder', 'mano destra, di nuovo', 'mão direita, de novo'),
    e: tr('It represents a right hand. It also means “again”.', 'Représente une main droite. Signifie aussi « encore ».', 'Stellt eine rechte Hand dar. Bedeutet auch „wieder“.', 'Rappresenta una mano destra. Significa anche “di nuovo”.', 'Representa uma mão direita. Também significa “de novo”.') },
  '口': { m: tr('mouth, opening', 'bouche, ouverture', 'Mund, Öffnung', 'bocca, apertura', 'boca, abertura'),
    e: tr('It represents an open mouth. One of the most common radicals.', 'Représente une bouche ouverte. L’un des radicaux les plus courants.', 'Stellt einen offenen Mund dar. Eines der häufigsten Radikale.', 'Rappresenta una bocca aperta. Uno dei radicali più comuni.', 'Representa uma boca aberta. Um dos radicais mais comuns.') },
  '囗': { m: tr('enclosure', 'enceinte', 'Umzäunung', 'recinto', 'cercado'),
    e: tr('It represents a walled or fenced enclosure.', 'Représente une enceinte fortifiée ou clôturée.', 'Stellt ein ummauertes oder eingezäuntes Gelände dar.', 'Rappresenta un recinto murato o recintato.', 'Representa um recinto murado ou cercado.') },
  '土': { m: tr('earth, soil', 'terre, sol', 'Erde, Boden', 'terra, suolo', 'terra, solo'),
    e: tr('It represents a mound of earth.', 'Représente un monticule de terre.', 'Stellt einen Erdhügel dar.', 'Rappresenta un cumulo di terra.', 'Representa um monte de terra.') },
  '士': { m: tr('scholar, gentleman', 'lettré, gentilhomme', 'Gelehrter, Edelmann', 'studioso, gentiluomo', 'erudito, cavalheiro'),
    e: tr('It represents a scholar or educated gentleman.', 'Représente un lettré ou un gentilhomme instruit.', 'Stellt einen Gelehrten oder gebildeten Herrn dar.', 'Rappresenta uno studioso o un gentiluomo istruito.', 'Representa um erudito ou um cavalheiro instruído.') },
  '夂': { m: tr('to arrive, to follow', 'arriver, suivre', 'ankommen, folgen', 'arrivare, seguire', 'chegar, seguir'),
    e: tr('It represents arriving or following from behind.', 'Représente le fait d’arriver ou de suivre par derrière.', 'Stellt Ankommen oder Folgen von hinten dar.', 'Rappresenta l’arrivare o il seguire da dietro.', 'Representa chegar ou seguir por trás.') },
  '夕': { m: tr('evening, dusk', 'soir, crépuscule', 'Abend, Dämmerung', 'sera, crepuscolo', 'entardecer, noite'),
    e: tr('It represents the crescent moon at dusk.', 'Représente le croissant de lune au crépuscule.', 'Stellt die Mondsichel in der Abenddämmerung dar.', 'Rappresenta la luna crescente al crepuscolo.', 'Representa a lua crescente ao entardecer.') },
  '大': { m: tr('big, adult', 'grand, adulte', 'groß, Erwachsener', 'grande, adulto', 'grande, adulto'),
    e: tr('It represents a person with outstretched arms, meaning big.', 'Représente une personne aux bras écartés, signifiant grand.', 'Stellt eine Person mit ausgebreiteten Armen dar und bedeutet groß.', 'Rappresenta una persona con le braccia aperte, che significa grande.', 'Representa uma pessoa de braços abertos, significando grande.') },
  '女': { m: tr('woman, female', 'femme, féminin', 'Frau, weiblich', 'donna, femminile', 'mulher, feminino'),
    e: tr('It represents a kneeling woman.', 'Représente une femme agenouillée.', 'Stellt eine kniende Frau dar.', 'Rappresenta una donna inginocchiata.', 'Representa uma mulher ajoelhada.') },
  '子': { m: tr('child, seed', 'enfant, graine', 'Kind, Same', 'bambino, seme', 'criança, semente'),
    e: tr('It represents a child or baby.', 'Représente un enfant ou un bébé.', 'Stellt ein Kind oder Baby dar.', 'Rappresenta un bambino o un neonato.', 'Representa uma criança ou um bebê.') },
  '宀': { m: tr('roof, house', 'toit, maison', 'Dach, Haus', 'tetto, casa', 'telhado, casa'),
    e: tr('It represents a roof or house.', 'Représente un toit ou une maison.', 'Stellt ein Dach oder Haus dar.', 'Rappresenta un tetto o una casa.', 'Representa um telhado ou uma casa.') },
  '寸': { m: tr('inch, measure', 'pouce, mesure', 'Zoll, Maß', 'pollice, misura', 'polegada, medida'),
    e: tr('It represents a hand showing the pulse point, used as a measure.', 'Représente une main montrant le point du pouls, utilisé comme mesure.', 'Stellt eine Hand am Pulspunkt dar, als Maßeinheit verwendet.', 'Rappresenta una mano che indica il punto del polso, usato come misura.', 'Representa uma mão mostrando o ponto do pulso, usado como medida.') },
  '小': { m: tr('small', 'petit', 'klein', 'piccolo', 'pequeno'),
    e: tr('It represents small particles or something tiny.', 'Représente de petites particules ou quelque chose de minuscule.', 'Stellt kleine Teilchen oder etwas Winziges dar.', 'Rappresenta piccole particelle o qualcosa di minuscolo.', 'Representa partículas pequenas ou algo diminuto.') },
  '尢': { m: tr('lame, weak', 'boiteux, faible', 'lahm, schwach', 'zoppo, debole', 'manco, fraco'),
    e: tr('It represents a lame or weak person.', 'Représente une personne boiteuse ou faible.', 'Stellt eine lahme oder schwache Person dar.', 'Rappresenta una persona zoppa o debole.', 'Representa uma pessoa manca ou fraca.') },
  '尸': { m: tr('body, corpse', 'corps, cadavre', 'Körper, Leichnam', 'corpo, cadavere', 'corpo, cadáver'),
    e: tr('It represents a reclining body or corpse.', 'Représente un corps allongé ou un cadavre.', 'Stellt einen liegenden Körper oder Leichnam dar.', 'Rappresenta un corpo disteso o un cadavere.', 'Representa um corpo reclinado ou um cadáver.') },
  '屮': { m: tr('sprouting grass', 'herbe qui pousse', 'sprießendes Gras', 'erba che germoglia', 'erva brotando'),
    e: tr('It represents grass sprouting from the earth.', 'Représente de l’herbe qui sort de terre.', 'Stellt aus der Erde sprießendes Gras dar.', 'Rappresenta erba che germoglia dalla terra.', 'Representa erva brotando da terra.') },
  '山': { m: tr('mountain', 'montagne', 'Berg', 'montagna', 'montanha'),
    e: tr('It represents mountain peaks.', 'Représente des sommets de montagne.', 'Stellt Berggipfel dar.', 'Rappresenta cime di montagna.', 'Representa picos de montanha.') },
  '川': { m: tr('river, stream', 'rivière, courant', 'Fluss, Strom', 'fiume, corrente', 'rio, corrente'),
    e: tr('It represents the flow of a river.', 'Représente le courant d’une rivière.', 'Stellt das Fließen eines Flusses dar.', 'Rappresenta lo scorrere di un fiume.', 'Representa o fluxo de um rio.') },
  '工': { m: tr('work, tool', 'travail, outil', 'Arbeit, Werkzeug', 'lavoro, attrezzo', 'trabalho, ferramenta'),
    e: tr('It represents a carpenter’s tool or work.', 'Représente un outil de charpentier ou le travail.', 'Stellt ein Zimmermannswerkzeug oder Arbeit dar.', 'Rappresenta un attrezzo da falegname o il lavoro.', 'Representa uma ferramenta de carpinteiro ou o trabalho.') },
  '己': { m: tr('oneself', 'soi-même', 'selbst', 'se stesso', 'si mesmo'),
    e: tr('It represents oneself or personal identity.', 'Représente soi-même ou l’identité personnelle.', 'Stellt das Selbst oder die persönliche Identität dar.', 'Rappresenta se stessi o l’identità personale.', 'Representa a si mesmo ou a identidade pessoal.') },
  '巾': { m: tr('cloth, towel', 'tissu, étoffe', 'Tuch, Stoff', 'panno, stoffa', 'pano, tecido'),
    e: tr('It represents a hanging piece of cloth.', 'Représente un morceau de tissu suspendu.', 'Stellt ein hängendes Stück Stoff dar.', 'Rappresenta un pezzo di stoffa appeso.', 'Representa um pedaço de pano pendurado.') },
  '干': { m: tr('shield, dry', 'bouclier, sécher', 'Schild, trocknen', 'scudo, seccare', 'escudo, secar'),
    e: tr('It represents an ancient shield.', 'Représente un bouclier antique.', 'Stellt einen alten Schild dar.', 'Rappresenta uno scudo antico.', 'Representa um escudo antigo.') },
  '幺': { m: tr('tiny, thin', 'minuscule, fin', 'winzig, fein', 'minuscolo, sottile', 'minúsculo, fino'),
    e: tr('It represents a fine thread or something very small.', 'Représente un fil fin ou quelque chose de très petit.', 'Stellt einen feinen Faden oder etwas sehr Kleines dar.', 'Rappresenta un filo sottile o qualcosa di molto piccolo.', 'Representa um fio fino ou algo muito pequeno.') },
  '广': { m: tr('roofed structure', 'structure couverte', 'überdachter Bau', 'struttura con tetto', 'estrutura com telhado'),
    e: tr('It represents a building with a roof but no side walls.', 'Représente un bâtiment avec un toit mais sans murs latéraux.', 'Stellt ein Gebäude mit Dach, aber ohne Seitenwände dar.', 'Rappresenta un edificio con tetto ma senza pareti laterali.', 'Representa um edifício com telhado mas sem paredes laterais.') },
  '廴': { m: tr('long stride', 'longue marche', 'langer Gang', 'lunga camminata', 'caminhada longa'),
    e: tr('It represents walking a long distance.', 'Représente une longue marche.', 'Stellt das Gehen einer langen Strecke dar.', 'Rappresenta il camminare per una lunga distanza.', 'Representa caminhar uma longa distância.') },
  '廾': { m: tr('two hands', 'deux mains', 'zwei Hände', 'due mani', 'duas mãos'),
    e: tr('It represents two joined hands holding something.', 'Représente deux mains jointes tenant quelque chose.', 'Stellt zwei zusammengelegte Hände dar, die etwas halten.', 'Rappresenta due mani unite che reggono qualcosa.', 'Representa duas mãos unidas segurando algo.') },
  '弋': { m: tr('to shoot, dart', 'harponner, dard', 'Pfeil mit Schnur', 'dardo, colpire', 'arpoar, dardo'),
    e: tr('It represents a harpoon or corded spear.', 'Représente un harpon ou une lance à corde.', 'Stellt eine Harpune oder Schnurlanze dar.', 'Rappresenta un arpione o una lancia con corda.', 'Representa um arpão ou uma lança com corda.') },
  '弓': { m: tr('bow', 'arc', 'Bogen', 'arco', 'arco'),
    e: tr('It represents a bow for shooting arrows.', 'Représente un arc pour tirer des flèches.', 'Stellt einen Bogen zum Pfeilschießen dar.', 'Rappresenta un arco per scoccare frecce.', 'Representa um arco para atirar flechas.') },
  '彐': { m: tr('pig’s head', 'tête de porc', 'Schweinekopf', 'testa di maiale', 'cabeça de porco'),
    e: tr('It represents a pig’s head.', 'Représente la tête d’un porc.', 'Stellt einen Schweinekopf dar.', 'Rappresenta la testa di un maiale.', 'Representa a cabeça de um porco.') },
  '彡': { m: tr('hair, decoration', 'poils, décoration', 'Haar, Verzierung', 'peli, decorazione', 'cabelo, decoração'),
    e: tr('It represents hair or decorative stripes.', 'Représente des poils ou des rayures décoratives.', 'Stellt Haare oder Zierstreifen dar.', 'Rappresenta capelli o strisce decorative.', 'Representa cabelos ou listras decorativas.') },
  '心': { m: tr('heart, mind', 'cœur, esprit', 'Herz, Geist', 'cuore, mente', 'coração, mente'),
    e: tr('It represents the heart. Central to emotions and thoughts.', 'Représente le cœur. Fondamental pour les émotions et les pensées.', 'Stellt das Herz dar. Grundlegend für Gefühle und Gedanken.', 'Rappresenta il cuore. Fondamentale per emozioni e pensieri.', 'Representa o coração. Fundamental para emoções e pensamentos.') },
  '戈': { m: tr('halberd, spear', 'hallebarde, lance', 'Hellebarde, Lanze', 'alabarda, lancia', 'alabarda, lança'),
    e: tr('It represents an ancient halberd or spear. Associated with weapons and war.', 'Représente une hallebarde ou une lance antique. Associé aux armes et à la guerre.', 'Stellt eine alte Hellebarde oder Lanze dar. Mit Waffen und Krieg verbunden.', 'Rappresenta un’alabarda o una lancia antica. Associato ad armi e guerra.', 'Representa uma alabarda ou lança antiga. Associado a armas e guerra.') },
  '水': { m: tr('water', 'eau', 'Wasser', 'acqua', 'água'),
    e: tr('It represents flowing water. Essential in characters related to liquids.', 'Représente l’eau qui coule. Essentiel dans les caractères liés aux liquides.', 'Stellt fließendes Wasser dar. Wichtig in Zeichen rund um Flüssigkeiten.', 'Rappresenta l’acqua che scorre. Essenziale nei caratteri legati ai liquidi.', 'Representa a água corrente. Essencial em caracteres ligados a líquidos.') },
  '火': { m: tr('fire', 'feu', 'Feuer', 'fuoco', 'fogo'),
    e: tr('It represents a flame. Associated with heat, light and cooking.', 'Représente une flamme. Associé à la chaleur, la lumière et la cuisine.', 'Stellt eine Flamme dar. Mit Hitze, Licht und Kochen verbunden.', 'Rappresenta una fiamma. Associato a calore, luce e cucina.', 'Representa uma chama. Associado a calor, luz e cozinha.') },
  '木': { m: tr('tree, wood', 'arbre, bois', 'Baum, Holz', 'albero, legno', 'árvore, madeira'),
    e: tr('It represents a tree. Related to plants, wood and wooden objects.', 'Représente un arbre. Lié aux plantes, au bois et aux objets en bois.', 'Stellt einen Baum dar. Mit Pflanzen, Holz und Holzgegenständen verbunden.', 'Rappresenta un albero. Legato a piante, legno e oggetti di legno.', 'Representa uma árvore. Ligado a plantas, madeira e objetos de madeira.') },
  '日': { m: tr('sun, day', 'soleil, jour', 'Sonne, Tag', 'sole, giorno', 'sol, dia'),
    e: tr('It represents the sun. Related to time, light and brightness.', 'Représente le soleil. Lié au temps, à la lumière et à la clarté.', 'Stellt die Sonne dar. Mit Zeit, Licht und Helligkeit verbunden.', 'Rappresenta il sole. Legato al tempo, alla luce e alla chiarezza.', 'Representa o sol. Ligado ao tempo, à luz e à claridade.') },
  '月': { m: tr('moon, month', 'lune, mois', 'Mond, Monat', 'luna, mese', 'lua, mês'),
    e: tr('It represents the moon. It can also represent flesh or body parts.', 'Représente la lune. Peut aussi représenter la chair ou des parties du corps.', 'Stellt den Mond dar. Kann auch Fleisch oder Körperteile darstellen.', 'Rappresenta la luna. Può anche rappresentare la carne o parti del corpo.', 'Representa a lua. Também pode representar carne ou partes do corpo.') },
  '襾': { m: tr('to cover, west', 'couvrir, ouest', 'bedecken, Westen', 'coprire, ovest', 'cobrir, oeste'),
    e: tr('It represents something that covers. Traditional form of the radical for “west”.', 'Représente quelque chose qui couvre. Forme traditionnelle du radical de « ouest ».', 'Stellt etwas Bedeckendes dar. Traditionelle Form des Radikals für „Westen“.', 'Rappresenta qualcosa che copre. Forma tradizionale del radicale di “ovest”.', 'Representa algo que cobre. Forma tradicional do radical de “oeste”.') },
  '白': { m: tr('white, clear', 'blanc, clair', 'weiß, hell', 'bianco, chiaro', 'branco, claro'),
    e: tr('It represents the color white or brightness. It can also mean “in vain”.', 'Représente le blanc ou la clarté. Peut aussi signifier « en vain ».', 'Stellt die Farbe Weiß oder Helligkeit dar. Kann auch „vergeblich“ bedeuten.', 'Rappresenta il colore bianco o la chiarezza. Può anche significare “invano”.', 'Representa a cor branca ou a claridade. Também pode significar “em vão”.') },
  '艹': { m: tr('grass, plant', 'herbe, plante', 'Gras, Pflanze', 'erba, pianta', 'erva, planta'),
    e: tr('It represents grass or plants. It appears at the top of characters.', 'Représente l’herbe ou les plantes. Apparaît en haut des caractères.', 'Stellt Gras oder Pflanzen dar. Erscheint oben in Schriftzeichen.', 'Rappresenta erba o piante. Appare nella parte superiore dei caratteri.', 'Representa erva ou plantas. Aparece na parte superior dos caracteres.') },
  '车': { m: tr('cart, vehicle', 'char, véhicule', 'Wagen, Fahrzeug', 'carro, veicolo', 'carro, veículo'),
    e: tr('It represents a cart seen from above. Related to vehicles and transport.', 'Représente un char vu de dessus. Lié aux véhicules et au transport.', 'Stellt einen Wagen von oben dar. Mit Fahrzeugen und Transport verbunden.', 'Rappresenta un carro visto dall’alto. Legato a veicoli e trasporti.', 'Representa um carro visto de cima. Ligado a veículos e transporte.') },
  '讠': { m: tr('speech', 'parole', 'Sprechen, Rede', 'parola, discorso', 'fala, discurso'),
    e: tr('Radical related to speech and language.', 'Radical lié à la parole et au langage.', 'Radikal für Sprechen und Sprache.', 'Radicale legato alla parola e al linguaggio.', 'Radical ligado à fala e à linguagem.') },
  '辶': { m: tr('to walk', 'marcher', 'gehen', 'camminare', 'caminhar'),
    e: tr('Radical indicating movement or motion.', 'Radical indiquant le mouvement ou le déplacement.', 'Radikal für Bewegung oder Fortbewegung.', 'Radicale che indica movimento o spostamento.', 'Radical que indica movimento ou deslocamento.') },
  '扌': { m: tr('hand', 'main', 'Hand', 'mano', 'mão'),
    e: tr('Radical representing the hand and manual actions.', 'Radical représentant la main et les actions manuelles.', 'Radikal für die Hand und Handbewegungen.', 'Radicale che rappresenta la mano e le azioni manuali.', 'Radical que representa a mão e ações manuais.') },
  '纟': { m: tr('silk', 'soie', 'Seide', 'seta', 'seda'),
    e: tr('Radical related to silk or threads.', 'Radical lié à la soie ou aux fils.', 'Radikal für Seide oder Fäden.', 'Radicale legato alla seta o ai fili.', 'Radical ligado à seda ou a fios.') },
  '钅': { m: tr('metal', 'métal', 'Metall', 'metallo', 'metal'),
    e: tr('Radical indicating a relation to metals.', 'Radical indiquant un lien avec les métaux.', 'Radikal für einen Bezug zu Metallen.', 'Radicale che indica una relazione con i metalli.', 'Radical que indica relação com metais.') },
  '彳': { m: tr('step', 'pas', 'Schritt', 'passo', 'passo'),
    e: tr('Radical representing a step or walking.', 'Radical représentant un pas ou la marche.', 'Radikal für einen Schritt oder das Gehen.', 'Radicale che rappresenta un passo o il camminare.', 'Radical que representa um passo ou o andar.') },
  '禾': { m: tr('grain', 'céréale', 'Getreide', 'cereale', 'grão'),
    e: tr('Radical representing cereals or grain.', 'Radical représentant les céréales ou le grain.', 'Radikal für Getreide oder Korn.', 'Radicale che rappresenta cereali o grano.', 'Radical que representa cereais ou grão.') },
  '目': { m: tr('eye', 'œil', 'Auge', 'occhio', 'olho'),
    e: tr('Radical representing the eye or vision.', 'Radical représentant l’œil ou la vision.', 'Radikal für das Auge oder das Sehen.', 'Radicale che rappresenta l’occhio o la vista.', 'Radical que representa o olho ou a visão.') },
  '贝': { m: tr('shell', 'coquillage', 'Muschel', 'conchiglia', 'concha'),
    e: tr('Radical related to shells, money or valuables.', 'Radical lié aux coquillages, à l’argent ou aux objets de valeur.', 'Radikal für Muscheln, Geld oder Wertsachen.', 'Radicale legato a conchiglie, denaro o oggetti di valore.', 'Radical ligado a conchas, dinheiro ou objetos de valor.') },
  '斤': { m: tr('axe', 'hache', 'Axt', 'ascia', 'machado'),
    e: tr('Radical representing an axe or a unit of weight.', 'Radical représentant une hache ou une unité de poids.', 'Radikal für eine Axt oder eine Gewichtseinheit.', 'Radicale che rappresenta un’ascia o un’unità di peso.', 'Radical que representa um machado ou uma unidade de peso.') },
  '矢': { m: tr('arrow', 'flèche', 'Pfeil', 'freccia', 'flecha'),
    e: tr('Radical representing an arrow.', 'Radical représentant une flèche.', 'Radikal für einen Pfeil.', 'Radicale che rappresenta una freccia.', 'Radical que representa uma flecha.') },
  '黑': { m: tr('black', 'noir', 'schwarz', 'nero', 'preto'),
    e: tr('Radical representing the color black.', 'Radical représentant la couleur noire.', 'Radikal für die Farbe Schwarz.', 'Radicale che rappresenta il colore nero.', 'Radical que representa a cor preta.') },
};

const FREQ_TR = {
  'muy alta': tr('very high', 'très élevée', 'sehr hoch', 'molto alta', 'muito alta'),
  'alta': tr('high', 'élevée', 'hoch', 'alta', 'alta'),
  'media': tr('medium', 'moyenne', 'mittel', 'media', 'média'),
  'baja': tr('low', 'faible', 'niedrig', 'bassa', 'baixa'),
};

// ─── 5. Títulos de lección ───────────────────────────────────────────────────
const TITLES = {
  1: tr('How have you been lately?', 'Comment vas-tu ces derniers temps ?', 'Wie geht es dir in letzter Zeit?', 'Come stai ultimamente?', 'Como você tem estado ultimamente?'),
  2: tr('What country are you from?', 'De quel pays viens-tu ?', 'Aus welchem Land kommst du?', 'Di che paese sei?', 'De que país você é?'),
  3: tr('How many people are in your family?', 'Combien de personnes y a-t-il dans ta famille ?', 'Wie viele Personen hat deine Familie?', 'Quante persone ci sono nella tua famiglia?', 'Quantas pessoas há na sua família?'),
  4: tr('What time do you have class tomorrow?', 'À quelle heure as-tu cours demain ?', 'Um wie viel Uhr hast du morgen Unterricht?', 'A che ora hai lezione domani?', 'A que horas você tem aula amanhã?'),
  5: tr('Happy birthday', 'Joyeux anniversaire', 'Alles Gute zum Geburtstag', 'Buon compleanno', 'Feliz aniversário'),
  6: tr('The library is north of the dining hall', 'La bibliothèque est au nord de la cantine', 'Die Bibliothek liegt nördlich der Mensa', 'La biblioteca è a nord della mensa', 'A biblioteca fica ao norte do refeitório'),
  7: tr('How much is half a kilo of apples?', 'Combien coûte un demi-kilo de pommes ?', 'Was kostet ein halbes Kilo Äpfel?', 'Quanto costa mezzo chilo di mele?', 'Quanto custa meio quilo de maçãs?'),
  8: tr('I don’t feel well', 'Je ne me sens pas bien', 'Ich fühle mich nicht wohl', 'Non mi sento bene', 'Não me sinto bem'),
};

// ═══ Ejecución ═══════════════════════════════════════════════════════════════
const errors = [];

// Mapa de reutilización desde libro-data (meaningTr ya existente)
const libro = JSON.parse(readFileSync(LIBRO_FILE, 'utf8'));
const libroTr = {};
for (const lesson of libro.lessons) {
  for (const w of lesson.words) {
    if (w.meaningTr && !libroTr[w.char]) libroTr[w.char] = w.meaningTr;
  }
}

// 1+2+3. hsk1-data.json
const hsk = JSON.parse(readFileSync(HSK_FILE, 'utf8'));
let hskCount = 0;
for (const [char, det] of Object.entries(hsk.characters)) {
  const t = HSK_TR[char] || libroTr[char];
  if (!t) { errors.push(`hsk1 sin traducción: ${char} (${det.meaning})`); continue; }
  det.meaningTr = t;
  hskCount++;
}
let consCount = 0;
for (const c of hsk.consonants) {
  const t = CONS_TR[c.pinyin];
  if (!t) { errors.push(`consonante sin traducción: ${c.pinyin}`); continue; }
  c.soundTr = t;
  consCount++;
}
let sylCount = 0;
for (const s of hsk.specialSyllables) {
  const t = specialSoundTr(s.sound);
  if (!t) { errors.push(`sílaba especial sin patrón: ${s.pinyin} (${s.sound})`); continue; }
  s.soundTr = t;
  sylCount++;
}

// 4. radicals-data.json
const rad = JSON.parse(readFileSync(RAD_FILE, 'utf8'));
let radCount = 0;
for (const [key, det] of Object.entries(rad.radicals)) {
  const t = RAD[key];
  if (!t) { errors.push(`radical sin traducción: ${key} (${det.meaning})`); continue; }
  det.meaningTr = t.m;
  det.explanationTr = t.e;
  const f = FREQ_TR[det.frequency];
  if (f) det.frequencyTr = f;
  else if (det.frequency) errors.push(`frecuencia desconocida: ${key} (${det.frequency})`);
  radCount++;
}

// 5. libro-data.json títulos
let titleCount = 0;
for (const lesson of libro.lessons) {
  const t = TITLES[lesson.lesson];
  if (!t) { errors.push(`lección sin título traducido: ${lesson.lesson}`); continue; }
  lesson.titleTr = t;
  titleCount++;
}

if (errors.length) {
  console.error('ERRORES:\n' + errors.join('\n'));
  process.exit(1);
}

writeFileSync(HSK_FILE, JSON.stringify(hsk, null, 2) + '\n', 'utf8');
writeFileSync(RAD_FILE, JSON.stringify(rad, null, 2) + '\n', 'utf8');
writeFileSync(LIBRO_FILE, JSON.stringify(libro, null, 2) + '\n', 'utf8');

console.log(`OK — hsk chars: ${hskCount}, consonantes: ${consCount}, sílabas: ${sylCount}, radicales: ${radCount}, títulos: ${titleCount}`);
