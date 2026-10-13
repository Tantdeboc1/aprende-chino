import { useTranslation } from 'react-i18next';
import { PRACTICE_ACTIVITIES, rememberPracticeCategory } from '@/utils/practiceNavigation.js';
import { J } from '@/styles/tokens';

export default function PracticeBreadcrumb({ activity, onNavigate }) {
  const { t } = useTranslation();
  const info = PRACTICE_ACTIVITIES[activity];
  if (!info) return null;
  const [category, title] = info;
  const back = (cat) => { rememberPracticeCategory(cat); onNavigate('practice'); };
  return <nav aria-label={t('practice_location')} className="px-4 pt-4 pb-2 text-xs" style={{ color: J.inkSoft }}>
    <ol className="flex flex-wrap items-center gap-2">
      <li><button onClick={() => back(null)} className="underline underline-offset-4">{t('nav_practice')}</button></li>
      <li aria-hidden="true">›</li>
      <li><button onClick={() => back(category)} className="underline underline-offset-4">{t('practice_' + category)}</button></li>
      <li aria-hidden="true">›</li>
      <li aria-current="page" className="font-semibold">{t(title)}</li>
    </ol>
  </nav>;
}
