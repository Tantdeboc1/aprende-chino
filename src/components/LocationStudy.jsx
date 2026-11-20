import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loc } from '@/utils/loc.js';
import { locationComparison } from '@/data/topicWorkshop.js';
import { practiceLabels } from '@/data/topicPractice.js';
import SpeakButton from '@/components/ui/SpeakButton.jsx';
import { PracticeCard, PracticeFeedback, PracticeNext, PracticeOption, PracticeProgress } from '@/components/ui/PracticeControls.jsx';

const languages = ['es', 'en', 'fr', 'de', 'it', 'pt'];
const message = (text) => Object.fromEntries(text.split('|').map((part, i) => [languages[i], part]));
const copy = {
  title: message('Un paseo por el barrio|A walk around the neighborhood|Une promenade dans le quartier|Ein Spaziergang durchs Viertel|Un giro nel quartiere|Um passeio pelo bairro'),
  intro: message('Usa un plano para explicar dónde está un lugar, qué hay allí y qué edificio es.|Use a map to say where a place is, what is there, and which building it is.|Utilise un plan pour situer un lieu, dire ce qu’il y a et identifier un bâtiment.|Nutze einen Plan, um Orte zu finden und Gebäude zu beschreiben.|Usa una mappa per localizzare un luogo e dire che cosa c’è o quale edificio vedi.|Usa um mapa para localizar um sítio, dizer o que há e identificar um edifício.'),
  resume: message('Continuar estudiando|Continue studying|Reprendre l’étude|Weiterlernen|Continua a studiare|Continuar a estudar'),
  guided: message('Con ayuda|With guidance|Avec de l’aide|Mit Anleitung|Con una guida|Com ajuda'),
  apply: message('Ahora, otro plano|Now try another map|À toi, sur un autre plan|Jetzt mit einem neuen Plan|Ora prova un’altra mappa|Agora, outro mapa'),
  build: message('Construye la respuesta con las fichas.|Build the reply with the tiles.|Construis la réponse avec les tuiles.|Bilde die Antwort mit den Bausteinen.|Costruisci la risposta con le tessere.|Constrói a resposta com as peças.'),
  done: message('Recorrido completado|Route complete|Parcours terminé|Rundgang abgeschlossen|Percorso completato|Percurso concluído'),
  review: message('Repasar con otro plano|Review with another map|Réviser sur un autre plan|Mit einem anderen Plan üben|Ripassa con un’altra mappa|Rever com outro mapa'),
  directions: message('左边 · izquierda / 右边 · derecha|左边 · left / 右边 · right|左边 · gauche / 右边 · droite|左边 · links / 右边 · rechts|左边 · sinistra / 右边 · destra|左边 · esquerda / 右边 · direita'),
};
const places = {
  restaurant: ['饭馆', 'fànguǎn', message('Restaurante|Restaurant|Restaurant|Restaurant|Ristorante|Restaurante')],
  market: ['超市', 'chāoshì', message('Supermercado|Supermarket|Supermarché|Supermarkt|Supermercato|Supermercado')],
  school: ['学校', 'xuéxiào', message('Escuela|School|École|Schule|Scuola|Escola')],
  hospital: ['医院', 'yīyuàn', message('Hospital|Hospital|Hôpital|Krankenhaus|Ospedale|Hospital')],
  station: ['车站', 'chēzhàn', message('Estación|Station|Gare|Bahnhof|Stazione|Estação')],
};
const maps = [
  ['restaurant', 'market', 'school'],
  ['hospital', 'school', 'restaurant'],
  ['station', 'market', 'hospital'],
  ['school', 'station', 'hospital'],
];
const verbs = ['在', '有', '是'];
const counters = { restaurant: '家', market: '家', hospital: '家', station: '个', school: '所' };
const prompts = [
  message('Di dónde está el primer edificio. Usa el edificio del centro como referencia.|Say where the first building is. Use the middle building as a reference.|Situe le premier bâtiment par rapport à celui du milieu.|Beschreibe die Lage des ersten Gebäudes im Verhältnis zum mittleren.|Indica dove si trova il primo edificio rispetto a quello centrale.|Diz onde fica o primeiro edifício em relação ao do meio.'),
  message('Un visitante pregunta qué hay a la izquierda del edificio central. Dile qué hay.|A visitor asks what is to the left of the middle building. Say what is there.|Un visiteur demande ce qu’il y a à gauche du bâtiment du milieu. Réponds-lui.|Ein Besucher fragt, was links vom mittleren Gebäude ist. Antworte ihm.|Un visitatore chiede che cosa c’è a sinistra dell’edificio centrale. Rispondi.|Um visitante pergunta o que há à esquerda do edifício do meio. Responde.'),
  message('Alguien señala el edificio de la derecha y pregunta cuál es. Identifícalo tomando el edificio central como referencia.|Someone points at the building on the right and asks which it is. Identify it relative to the middle building.|Quelqu’un montre le bâtiment à droite et demande lequel c’est. Identifie-le par rapport au bâtiment du milieu.|Jemand zeigt auf das rechte Gebäude und fragt, welches es ist. Identifiziere es im Verhältnis zum mittleren.|Qualcuno indica l’edificio a destra e chiede quale sia. Identificalo rispetto all’edificio centrale.|Alguém aponta para o edifício à direita e pergunta qual é. Identifica-o em relação ao edifício do meio.'),
];
const key = 'hanyupath-location-study-v1';
const fresh = () => ({ step: 0, pending: [], review: null, variant: 0 });

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    const validRules = (items) => Array.isArray(items) && items.every((i) => Number.isInteger(i) && i >= 0 && i < 3);
    if (saved && Number.isInteger(saved.step) && saved.step >= 0 && validRules(saved.pending)
      && (saved.review === null || validRules(saved.review)) && Number.isInteger(saved.variant) && saved.variant >= 0) return saved;
  } catch { /* Storage may be unavailable. */ }
  return null;
}

export default function LocationStudy({ startLabel, title }) {
  const { i18n } = useTranslation();
  const local = (value) => loc(value, i18n.language);
  const [savedProgress] = useState(load);
  const [progress, setProgress] = useState(() => savedProgress ?? fresh());
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState([]);
  const [result, setResult] = useState(null);
  const { step, pending, review, variant } = progress;
  const total = review?.length ?? 6;
  const done = step >= total;
  const guided = !review && step < 3;
  const rule = (review ? review[step] : step % 3) ?? 0;
  const example = locationComparison.examples[rule];
  const map = maps[guided ? 0 : review ? 2 + variant % 2 : 1];
  const [left, middle, right] = map.map((id) => places[id][0]);
  const reference = middle + (rule === 2 ? '右边' : '左边');
  const answer = rule === 0 ? [left, '在', reference] : [reference, verbs[rule], rule === 1 ? '一' + counters[map[0]] + left : right];
  const tokens = [answer[2], '有', answer[0], '是', '在'];
  const correctText = (guided ? example.parts : answer).join('') + '。';

  function save(state) {
    setProgress(state);
    try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* The session still works in memory. */ }
  }

  function next() {
    const pendingRules = result ? pending : [...new Set([...pending, rule])];
    save({ ...progress, step: step + 1, pending: pendingRules });
    setPicked([]);
    setResult(null);
  }

  const chosen = picked.map((i) => tokens[i]);
  return (
    <PracticeCard title={title || local(copy.title)}>
      {!open ? <>
        <p className="text-sm">{local(copy.intro)}</p>
        <PracticeNext onClick={() => { save(progress); setOpen(true); }}>
          {done ? local(copy.done) : savedProgress ? local(copy.resume) : startLabel || local(practiceLabels.start)}
        </PracticeNext>
      </> : done ? <>
        <p role="status">{local(copy.done)}</p>
        {pending.length > 0 && <PracticeNext onClick={() => save({ step: 0, review: pending, pending: [], variant: variant + 1 })}>
          {local(copy.review)} ({pending.length})
        </PracticeNext>}
        <PracticeOption onClick={() => save(fresh())}>{local(practiceLabels.retry)}</PracticeOption>
      </> : <div key={step} className="space-y-3">
        <PracticeProgress question={step + 1} total={total} completed={step + Number(result !== null)} />
        <p className="text-sm font-semibold">{local(guided ? copy.guided : copy.apply)}</p>
        <ol className="grid grid-cols-3 gap-1 rounded-lg bg-[var(--paper)] p-2 text-center">
          {map.map((id) => {
            const [hanzi, pinyin, meaning] = places[id];
            return <li key={id} className="min-w-0 break-words rounded-md border border-[var(--hair)] p-1 text-xs">
              <div lang="zh-Hans" className="font-cn text-base">{hanzi}</div>
              <div lang="zh-Latn-pinyin">{pinyin}</div>
              <div>{local(meaning)}</div>
            </li>;
          })}
        </ol>
        {guided ? <>
          <p className="text-sm">{local(example.question)}</p>
          <p className="text-sm font-medium">{local(example.pattern)}</p>
          <div className="flex items-center gap-2">
            <p lang="zh-Hans" className="font-cn text-lg">{example.parts[0]} ___ {example.parts[2]}。</p>
          </div>
          <details className="text-sm">
            <summary>{local(practiceLabels.transcript)}</summary>
            <p lang="zh-Hans">{correctText}</p>
            <p lang="zh-Latn-pinyin">{example.pinyin}</p>
            <p>{local(example.translation)}</p>
            <SpeakButton text={correctText} />
          </details>
          <div className="flex flex-wrap gap-2">
            {verbs.map((verb, i) => <PracticeOption key={verb} lang="zh-Hans" disabled={result !== null}
              state={result === null ? 'idle' : i === rule ? 'correct' : picked[0] === i ? 'incorrect' : 'muted'}
              onClick={() => { setPicked([i]); setResult(i === rule); }}>{verb}</PracticeOption>)}
          </div>
        </> : <>
          <p className="text-xs text-[var(--ink-soft)]">{local(copy.directions)}</p>
          <p className="text-sm">{local(prompts[rule])}</p>
          <p className="text-sm">{local(copy.build)}</p>
          <p lang="zh-Hans" className="min-h-9 rounded-lg bg-[var(--paper)] p-2 font-cn" aria-live="polite">{chosen.join(' ')}</p>
          <div className="flex flex-wrap gap-2">
            {tokens.map((token, i) => <PracticeOption key={i} lang="zh-Hans" disabled={result !== null || picked.includes(i) || picked.length === 3}
              onClick={() => setPicked([...picked, i])}>{token}</PracticeOption>)}
          </div>
          {result === null && <div className="flex flex-wrap gap-2">
            <PracticeOption disabled={!picked.length} onClick={() => setPicked(picked.slice(0, -1))}>{local(practiceLabels.undo)}</PracticeOption>
            <PracticeOption disabled={picked.length !== 3} onClick={() => setResult(answer.every((part, i) => chosen[i] === part))}>{local(practiceLabels.check)}</PracticeOption>
          </div>}
        </>}
        <PracticeFeedback correct={result}>
          <p className="font-semibold">{local(result ? practiceLabels.correct : practiceLabels.answer)}</p>
          <p lang="zh-Hans" className="font-cn">{correctText}</p>
          <p>{local(example.pattern)}</p>
        </PracticeFeedback>
        {result !== null && <PracticeNext onClick={next}>{local(practiceLabels.next)}</PracticeNext>}
      </div>}
    </PracticeCard>
  );
}
