import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import FundamentalsMenu from '../FundamentalsMenu.jsx';

export default function RadicalsIndex({ goBack, setRadicalSection, radicals }) {
  const { t } = useTranslation();
  const items = [
    { key: 'theory', cn: '部', label: t('radicals_theory_title'), description: t('radicals_theory_description'), onClick: () => setRadicalSection('theory'), bg: J.sandBg, fg: J.sandDeep },
    { key: 'quiz1', cn: '认', label: t('radicals_quiz1_title'), description: t('radicals_quiz1_description'), onClick: () => setRadicalSection('quiz1'), bg: J.jadeBg, fg: J.jadeDeep },
    { key: 'quiz2', cn: '义', label: t('radicals_quiz2_title'), description: t('radicals_quiz2_description'), onClick: () => setRadicalSection('quiz2'), bg: J.redBg, fg: J.redDeep },
  ];
  const stats = [
    [radicals.length, t('radicals_stat_radicals')],
    [radicals.reduce((sum, radical) => sum + (radical.examples?.length || 0), 0), t('radicals_stat_examples')],
    [new Set(radicals.map(radical => radical.strokeCount)).size, t('radicals_stat_strokes')],
  ];
  return <FundamentalsMenu backLabel={t('radicals_back_to_learn')} onBack={goBack} title="部首" pinyin="Bùshǒu" subtitle={t('radicals_title')} items={items}>
    <div className="mt-5 grid grid-cols-3 gap-2">{stats.map(([value, label]) => <div key={label} className="rounded-2xl p-3 text-center" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
      <div className="text-lg font-bold" style={{ color: J.jade }}>{value}</div><div className="text-xs" style={{ color: J.inkSoft }}>{label}</div>
    </div>)}</div>
  </FundamentalsMenu>;
}
