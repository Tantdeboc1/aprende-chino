import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalSnapshot } from '@/hooks/useLocalSnapshot.js';
import { getLearningPrefs } from '@/utils/learningPrefs.js';

// Only used in learning content, never in quiz questions or exam answers.
export default function ReadingAid({ kind, children, className, style }) {
  const { t } = useTranslation();
  const prefs = useLocalSnapshot(getLearningPrefs);
  const [revealed, setRevealed] = useState(false);
  if (prefs[kind] !== 'tap' || revealed) return <span className={className} style={style}>{children}</span>;
  return <button className={className} style={style} onClick={e => { e.stopPropagation(); setRevealed(true); }}>{t(kind === 'pinyin' ? 'settings_reveal_pinyin' : 'settings_reveal_translation')}</button>;
}
