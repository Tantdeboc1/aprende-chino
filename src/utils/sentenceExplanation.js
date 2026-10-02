import grammarData from '@/data/grammarData.js';
import sovData from '@/data/sovData.js';

const normalize = (text) => text.replace(/[\s。？！!?，,]/g, '');
const T = (es, en, fr, de, it, pt) => ({ es, en, fr, de, it, pt });
const explanations = {
  '他说___语。': T('汉语 significa chino mandarín: 汉 + 语. 英语 y 法语 son inglés y francés; también forman frases válidas, pero expresan otro idioma.', '汉语 means Mandarin Chinese: 汉 + 语. 英语 and 法语 mean English and French; they also form valid sentences but name different languages.', '汉语 signifie chinois mandarin. 英语 et 法语 désignent l’anglais et le français : les phrases sont possibles, mais le sens change.', '汉语 bedeutet Mandarin. 英语 und 法语 bedeuten Englisch und Französisch: Auch diese Sätze sind möglich, haben aber eine andere Bedeutung.', '汉语 significa cinese mandarino. 英语 e 法语 indicano inglese e francese: le frasi sono possibili, ma il significato cambia.', '汉语 significa chinês mandarim. 英语 e 法语 indicam inglês e francês: as frases são possíveis, mas o sentido muda.'),
  '___认识他吗？': T('你 significa tú. El sujeto va antes de 认识 (conocer) y 吗 convierte la frase en una pregunta de sí/no. Otros pronombres cambian quién conoce a esa persona.', '你 means you. The subject comes before 认识 (know), and 吗 makes a yes/no question. Other pronouns change who knows that person.', '你 signifie tu. Le sujet précède 认识 (connaître) et 吗 forme une question oui/non. Un autre pronom change le sujet.', '你 bedeutet du. Das Subjekt steht vor 认识 (kennen); 吗 bildet eine Ja/Nein-Frage. Andere Pronomen ändern das Subjekt.', '你 significa tu. Il soggetto precede 认识 (conoscere) e 吗 forma una domanda sì/no. Altri pronomi cambiano il soggetto.', '你 significa tu. O sujeito vem antes de 认识 (conhecer) e 吗 forma uma pergunta de sim/não. Outros pronomes mudam o sujeito.'),
  '我___有一个姐姐。': T('还 puede expresar además: añades que tienes una hermana mayor. 也 expresa también respecto a otra persona o situación; ambas opciones pueden ser válidas según el contexto.', '还 can mean in addition: you add that you have an older sister. 也 means also in relation to another person or situation; either can be valid depending on context.', '还 ajoute une information supplémentaire. 也 signifie aussi par rapport à une autre personne ou situation ; les deux sont possibles selon le contexte.', '还 fügt eine weitere Information hinzu. 也 bedeutet auch im Vergleich zu einer anderen Person oder Situation; beide sind je nach Kontext möglich.', '还 aggiunge un’informazione. 也 significa anche rispetto a un’altra persona o situazione; entrambe le opzioni sono possibili secondo il contesto.', '还 acrescenta uma informação. 也 significa também em relação a outra pessoa ou situação; ambas são possíveis conforme o contexto.'),
  '他有两个___子。': T('儿子 significa hijo. 两个儿子: dos hijos. 女 forma 女子 (mujer), no la palabra hija, que es 女儿.', '儿子 means son. 两个儿子 means two sons. 女 forms 女子 (woman), not daughter, which is 女儿.', '儿子 signifie fils. 两个儿子 : deux fils. Fille se dit 女儿, pas 女子.', '儿子 bedeutet Sohn. 两个儿子: zwei Söhne. Tochter heißt 女儿, nicht 女子.', '儿子 significa figlio. 两个儿子: due figli. Figlia si dice 女儿, non 女子.', '儿子 significa filho. 两个儿子: dois filhos. Filha é 女儿, não 女子.'),
  '我___天有课。': T('明天 significa mañana. 今天, 昨天 y 每天 significan hoy, ayer y cada día: son expresiones válidas, pero cambian cuándo tienes clase.', '明天 means tomorrow. 今天, 昨天 and 每天 mean today, yesterday and every day: they are valid expressions but change when you have class.', '明天 signifie demain ; 今天, 昨天 et 每天 signifient aujourd’hui, hier et chaque jour. Le choix change le moment du cours.', '明天 bedeutet morgen; 今天, 昨天 und 每天 bedeuten heute, gestern und jeden Tag. Die Auswahl ändert den Zeitpunkt.', '明天 significa domani; 今天, 昨天 e 每天 significano oggi, ieri e ogni giorno. La scelta cambia il momento della lezione.', '明天 significa amanhã; 今天, 昨天 e 每天 significam hoje, ontem e todos os dias. A escolha muda o momento da aula.'),
  '你___期几有课？': T('星期 significa semana y 星期几 pregunta qué día de la semana. 星期一 es lunes; 星期日 o 星期天 es domingo.', '星期 means week, and 星期几 asks which day of the week. 星期一 is Monday; 星期日 or 星期天 is Sunday.', '星期几 demande quel jour de la semaine. 星期一 : lundi ; 星期日 ou 星期天 : dimanche.', '星期几 fragt nach dem Wochentag. 星期一: Montag; 星期日 oder 星期天: Sonntag.', '星期几 chiede il giorno della settimana. 星期一: lunedì; 星期日 o 星期天: domenica.', '星期几 pergunta o dia da semana. 星期一: segunda-feira; 星期日 ou 星期天: domingo.'),
  '我送你一___礼物。': T('Número + clasificador + sustantivo: 一个礼物 es un regalo. 个 es general; 件 también puede usarse con 礼物. 本 se usa para libros y 条 para objetos alargados.', 'Number + classifier + noun: 一个礼物 means a gift. 个 is general; 件 can also be used with 礼物. 本 is used for books and 条 for long objects.', 'Nombre + classificateur + nom : 一个礼物, un cadeau. 个 est général ; 件 peut aussi accompagner 礼物. 本 sert aux livres et 条 aux objets allongés.', 'Zahl + Zählwort + Nomen: 一个礼物, ein Geschenk. 个 ist allgemein; 件 ist mit 礼物 auch möglich. 本 gilt für Bücher, 条 für längliche Gegenstände.', 'Numero + classificatore + nome: 一个礼物, un regalo. 个 è generale; anche 件 può accompagnare 礼物. 本 si usa per libri, 条 per oggetti allungati.', 'Número + classificador + nome: 一个礼物, um presente. 个 é geral; 件 também pode acompanhar 礼物. 本 usa-se para livros e 条 para objetos compridos.'),
};

// Explicit links to equivalent structures, rather than guessing a rule from
// a character that can serve different grammatical purposes.
const relatedSentences = {
  '___很忙。': '我很好',
  '他___老师。': '我是中国人',
  '她___是学生。': '她也是学生',
  '我___忙。': '我不好',
  '她叫___名字？': '你叫什么名字',
  '这是我___。': '她的爸爸是医生',
  '现在___点？': '现在几点了',
  '下午三___上课。': '我八点上课',
  '宿舍在___儿？': '请问宿舍在哪儿',
  '我头很___。': '我头疼',
  '今天我不___上课。': '我今天不能上课',
  '吃中药___是西药？': '你想吃中药还是西药',
};

export function getSentenceExplanation(item) {
  if (!item) return null;
  if (explanations[item.sentence]) return { explanation: explanations[item.sentence] };
  const sentence = normalize(item.sentence.replace('___', item.answer || ''));
  const patterns = grammarData[item.lesson]?.patterns || [];
  const pattern = patterns.find(p =>
    normalize(p.pattern) === sentence ||
    p.examples?.some(ex => normalize(ex.zh) === sentence));
  if (pattern) return { explanation: pattern.explanation, example: pattern.examples?.find(ex => normalize(ex.zh) !== sentence) };
  const related = relatedSentences[item.sentence];
  const source = sovData.find(s => (related || s.lesson === item.lesson) && normalize(s.sentence) === (related ? normalize(related) : sentence));
  if (source) return { explanation: source.hints };
  if (item.hints) return { explanation: item.hints };
  return null;
}
