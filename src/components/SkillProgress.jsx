import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { JCard, JSection } from '@/components/jade';
import { useLocalSnapshot } from '@/hooks/useLocalSnapshot.js';
import { loadSkillSessions, SKILL_ACTIVITIES, summarizeSkill } from '@/utils/skillProgress.js';
import copy from '@/data/skillProgressText.js';

const titles = {
  'time-race': 'minigames_time_race_title', 'pinyin-connection': 'minigames_pinyin_connection_title',
  'find-intruder': 'minigames_intruder_title', 'sov-game': 'minigames_sov_title',
  'complete-sentence': 'minigames_complete_title', 'translation-game': 'minigames_translation_title',
  'dialogue-order': 'minigames_dialogue_title', 'reading-comprehension': 'minigames_reading_title',
  'dictation-game': 'minigames_dictation_title', 'tones-ear': 'tones_ear_title',
  'pronunciation-practice': 'minigames_pronunciation_title', 'echo-speaking': 'echo_title',
  'global-exam': 'minigames_global_exam_title', 'level-exam': 'level_exam_title',
  'lesson-exam': 'exam_title', 'character-quiz': 'quiz_mode_char_to_meaning',
  'cefr-listening': 'cefr_title', 'cefr-reading': 'cefr_title', 'cefr-grammar': 'cefr_title',
};
const symbols = { listening: '听', reading: '读', grammar: '句', vocabulary: '词', speaking: '说', writing: '写' };
// Assessment and lesson-specific activities lead to a matching open practice.
const practiceRoute = id => ({ 'cefr-listening': 'dictation-game', 'cefr-reading': 'reading-comprehension',
  'cefr-grammar': 'complete-sentence', 'lesson-exam': 'time-race', 'character-quiz': 'time-race', 'level-exam': 'time-race' })[id] || id;

export default function SkillProgress({ progress, onPractice }) {
  const { t, i18n } = useTranslation();
  const language = i18n.language?.split('-')[0] || 'es';
  const text = copy[language] || copy.en;
  const sessions = useLocalSnapshot(loadSkillSessions);
  const writing = Object.entries(progress?.__writing || {}).filter(([, count]) => Number.isFinite(count) && count > 0);
  const writingCount = writing.reduce((sum, [, n]) => sum + n, 0);
  const buttonStyle = { border: `1px solid ${J.jadeMid}`, borderRadius: 10, padding: '8px 12px', background: J.jadeBg, color: J.jadeDeep, fontWeight: 700, cursor: 'pointer' };
  return (
    <section aria-label={text.title}>
      <JSection label={text.title} cn="进步" />
      <p className="text-xs mb-3" style={{ color: J.mute }}>{text.intro}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Object.keys(SKILL_ACTIVITIES), 'writing'].map(skill => {
          const data = skill === 'writing' ? null : summarizeSkill(skill, sessions);
          const oral = skill === 'speaking';
          return (
            <JCard key={skill} padding="16px">
              <h3 className="font-bold mb-2" style={{ color: J.ink }}><span className="font-cn mr-2" style={{ color: J.jade }}>{symbols[skill]}</span>{text[skill]}</h3>
              {data ? <>
                <p className="text-2xl font-bold" style={{ color: J.jade }}>{data.pct === null ? '—' : `${data.pct}%`}</p>
                <p className="text-xs mt-1" style={{ color: J.inkSoft }}>{data.recent.length ? `${data.recent.length} ${data.recent.length === 1 ? text.session : text.sessions}${oral ? '' : ` · ${data.correct}/${data.total} ${text.answers}`}` : text.empty}</p>
                {data.pct !== null && !data.enough && <p className="text-xs mt-2" style={{ color: J.mute }}>{text.early}</p>}
                {oral && <p className="text-xs mt-2" style={{ color: J.mute }}>{text.voice}</p>}
                {data.recent.length > 0 && <details className="text-xs mt-3" style={{ color: J.inkSoft }}>
                  <summary className="cursor-pointer font-semibold">{text.details}</summary>
                  <ul className="mt-2 space-y-2">
                    {data.activityStats.filter(a => a.count > 0).map(a => <li key={a.activity}>
                      {t(titles[a.activity])}: {a.pct}%{a.trend !== null && <span> · {a.trend > 0 ? '+' : ''}{a.trend} pp</span>}
                    </li>)}
                  </ul>
                  {data.activityStats.some(a => a.trend !== null) && <p className="mt-2">{text.trend}</p>}
                  {data.errors.length > 0 && <>
                    <p className="font-semibold mt-3">{text.errors}</p>
                    {data.recent.some(s => s.activity === 'tones-ear' && s.errors?.length) && <p>{text.toneHint}</p>}
                    <ul>{data.errors.map(([error, count]) => <li key={error}>{error} · ×{count}</li>)}</ul>
                  </>}
                  <p className="font-semibold mt-3">{text.recent}</p>
                  <ul>{data.recent.slice(0, 5).map(s => <li key={s.id}>{new Date(s.at).toLocaleDateString(language)} · {t(titles[s.activity])} · {Math.round(s.correct / s.total * 100)}%</li>)}</ul>
                </details>}
              </> : <>
                <p className="font-bold text-xl" style={{ color: J.jade }}>{writing.length} {writing.length === 1 ? text.character : text.characters}</p>
                <p className="text-xs mt-1">{writingCount} {writingCount === 1 ? text.repetition : text.repetitions}</p>
                <p className="text-xs mt-2" style={{ color: J.mute }}>{text.writingHint}</p>
                {writing.length > 0 && <details className="mt-3 text-xs"><summary className="cursor-pointer">{text.details}</summary><p className="mt-2">{writing.sort((a, b) => b[1] - a[1]).slice(0, 20).map(([char, n]) => `${char} ×${n}`).join(' · ')}</p></details>}
              </>}
              {onPractice && <button className="mt-3 text-sm" style={buttonStyle} aria-label={`${text.practice}: ${text[skill]}`} onClick={() => onPractice(data ? practiceRoute(data.practice) : 'handwriting')}>{text.practice}</button>}
            </JCard>
          );
        })}
      </div>
    </section>
  );
}
