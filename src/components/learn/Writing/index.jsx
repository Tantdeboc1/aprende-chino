import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import FundamentalsMenu from '../FundamentalsMenu.jsx';

export default function WritingMenu({ goBack, setWritingSection }) {
  const { t } = useTranslation();
  const items = [
    { key: 'hanzi', cn: '字', label: '汉字', description: `Hànzì · ${t('writing_hanzi_title')}`, onClick: () => setWritingSection('hanzi'), bg: J.jadeBg, fg: J.jadeDeep },
    { key: 'radicals', cn: '部', label: '部首', description: `Bùshǒu · ${t('writing_radicals_title')}`, onClick: () => setWritingSection('radicals'), bg: J.sandBg, fg: J.sandDeep },
  ];
  return <FundamentalsMenu backLabel={t('writing_back_to_learn')} onBack={goBack} title="书写" pinyin="Shūxiě" subtitle={t('writing_title')} items={items} />;
}
