import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import FundamentalsMenu from '../FundamentalsMenu.jsx';
import Vowels from './Vowels.jsx';
import Consonants from './Consonants.jsx';

export default function TonesIndex({ goBack, speakChinese, setToneSection }) {
  const { t } = useTranslation();
  const [innerSection, setInnerSection] = useState(null);
  if (innerSection === 'vowels') return <Vowels goBack={() => setInnerSection(null)} speakChinese={speakChinese} />;
  if (innerSection === 'consonants') return <Consonants goBack={() => setInnerSection(null)} speakChinese={speakChinese} />;
  const items = [
    { key: 'vowels', cn: '元', label: '元音', description: `Yuányīn · ${t('tones_vowels_title')}`, onClick: () => setInnerSection('vowels'), bg: J.sandBg, fg: J.sandDeep },
    { key: 'consonants', cn: '辅', label: '辅音', description: `Fǔyīn · ${t('tones_consonants_title')}`, onClick: () => setInnerSection('consonants'), bg: J.jadeBg, fg: J.jadeDeep },
    { key: 'specialSyllables', cn: '音', label: t('tones_syllables_title'), description: t('tones_syllables_description'), onClick: () => setToneSection?.('specialSyllables'), bg: J.redBg, fg: J.redDeep },
    { key: 'quizTone', cn: '听', label: t('tones_tone_quiz_title'), description: t('tones_tone_quiz_description'), onClick: () => setToneSection?.('quizTone'), bg: J.jadeBg, fg: J.jadeDeep },
    { key: 'quizPronunciation', cn: '说', label: t('tones_pronunciation_quiz_title'), description: t('tones_pronunciation_quiz_description'), onClick: () => setToneSection?.('quizPronunciation'), bg: J.sandBg, fg: J.sandDeep },
  ];
  return <FundamentalsMenu backLabel={t('tones_back_to_learn')} onBack={goBack} title="声调" pinyin="Shēngdiào" subtitle={t('tones_title')} items={items} />;
}
