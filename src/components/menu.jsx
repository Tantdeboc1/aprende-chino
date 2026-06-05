// src/components/menu.jsx
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from 'react-i18next';

const LESSON_ACCENT = {
  1: { bg: 'bg-[#c8392f]', border: 'border-[#c8392f]', text: 'text-[#c8392f]', dot: 'bg-[#c8392f]', activePill: 'bg-[#c8392f] text-[#fbf5e6] border-transparent' },
  2: { bg: 'bg-[#b88a3e]', border: 'border-[#b88a3e]', text: 'text-[#b88a3e]', dot: 'bg-[#b88a3e]', activePill: 'bg-[#b88a3e] text-[#fbf5e6] border-transparent' },
  3: { bg: 'bg-[#b88a3e]', border: 'border-[#b88a3e]', text: 'text-[#b88a3e]', dot: 'bg-[#f0c862]', activePill: 'bg-[#b88a3e] text-[#fbf5e6] border-transparent' },
  4: { bg: 'bg-[#2f6b4a]', border: 'border-[#2f6b4a]', text: 'text-[#5a8f72]', dot: 'bg-[#5a8f72]', activePill: 'bg-[#2f6b4a] text-[#fbf5e6] border-transparent' },
  5: { bg: 'bg-[#c8392f]', border: 'border-[#c8392f]', text: 'text-[#c8392f]', dot: 'bg-[#c8392f]', activePill: 'bg-[#c8392f] text-[#fbf5e6] border-transparent' },
  6: { bg: 'bg-[#b88a3e]', border: 'border-[#b88a3e]', text: 'text-[#b88a3e]', dot: 'bg-[#b88a3e]', activePill: 'bg-[#b88a3e] text-[#fbf5e6] border-transparent' },
  7: { bg: 'bg-[#b88a3e]', border: 'border-[#b88a3e]', text: 'text-[#b88a3e]', dot: 'bg-[#f0c862]', activePill: 'bg-[#b88a3e] text-[#fbf5e6] border-transparent' },
  8: { bg: 'bg-[#2f6b4a]', border: 'border-[#2f6b4a]', text: 'text-[#5a8f72]', dot: 'bg-[#5a8f72]', activePill: 'bg-[#2f6b4a] text-[#fbf5e6] border-transparent' },
};

const GraduationCap = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const Calendar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
    <line x1="16" x2="16" y1="2" y2="6"/>
    <line x1="8" x2="8" y1="2" y2="6"/>
    <line x1="3" x2="21" y1="10" y2="10"/>
  </svg>
);
const BookOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const InfoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 16v-4"/>
    <path d="M12 8h.01"/>
  </svg>
);
const Gamepad = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="6" x2="10" y1="11" y2="11"/>
    <line x1="8" x2="8" y1="9" y2="13"/>
    <line x1="15" x2="15.01" y1="12" y2="12"/>
    <line x1="18" x2="18.01" y1="10" y2="10"/>
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4c0-1.545-.604-6.584-.693-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
  </svg>
);

function Menu({ userName, navigateTo, dailyComplete, selectedLesson, setSelectedLesson, lessonsData = [] }) {
  const { t } = useTranslation();

  const accent = selectedLesson ? (LESSON_ACCENT[selectedLesson] || LESSON_ACCENT[1]) : null;
  const activeLesson = lessonsData.find(l => l.lesson === selectedLesson);

  const menuItems = [
    { key: 'learn',      icon: <GraduationCap />, iconColor: 'text-[#2f6b4a]',   zh: '学习',     pinyin: 'Xuéxí',           desc: t('menu_learn_description') },
    { key: 'daily',      icon: <Calendar />,      iconColor: 'text-[#2f6b4a]',  zh: '每日挑战', pinyin: 'Měi rì tiǎozhàn', desc: t('menu_daily_description'), badge: dailyComplete ? '✓ Completado' : null },
    { key: 'minigames',  icon: <Gamepad />,        iconColor: 'text-[#b88a3e]', zh: '小游戏',   pinyin: 'Xiǎo yóuxì',      desc: t('menu_minigames_description') },
    { key: 'dictionary', icon: <BookOpen />,       iconColor: 'text-[#c8392f]', zh: '词典',     pinyin: 'Cídiǎn',          desc: t('menu_dictionary_description') },
    { key: 'info',       icon: <InfoIcon />,       iconColor: 'text-[#b88a3e]', zh: '信息',     pinyin: 'Xìnxī',           desc: t('menu_info_description') },
  ];

  return (
    <div className="min-h-screen p-4">
      <Container>

        {/* Banner de leccion activa */}
        <div className={`mb-6 rounded-2xl border ${accent ? accent.border : 'border-[rgba(28,24,19,0.10)]'} bg-[#fbf5e6]/60 px-5 py-4`}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {accent && <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${accent.dot}`} />}
              <div className="min-w-0">
                {selectedLesson ? (
                  <>
                    <p className={`text-xs font-bold uppercase tracking-widest mb-0.5 ${accent ? accent.text : 'text-[#928a76]'}`}>
                      Leccion {selectedLesson}
                    </p>
                    <p className="text-[#1c1813] font-semibold text-sm truncate">{activeLesson ? activeLesson.titleEs : ''}</p>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest text-[#928a76] mb-0.5">Modo</p>
                    <p className="text-[#1c1813] font-semibold text-sm">{t('menu_all_lessons')}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedLesson && setSelectedLesson(null)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${selectedLesson === null ? 'bg-[#2f6b4a] text-[#fbf5e6] border-[#2f6b4a]' : 'bg-[#f8f1de] text-[#928a76] border-[rgba(28,24,19,0.18)] hover:border-[#928a76] hover:text-[#5b5446]'}`}
              >{t('menu_filter_all')}</button>
              {lessonsData.map(l => {
                const a = LESSON_ACCENT[l.lesson] || LESSON_ACCENT[1];
                const isActive = selectedLesson === l.lesson;
                return (
                  <button
                    key={l.lesson}
                    onClick={() => setSelectedLesson && setSelectedLesson(isActive ? null : l.lesson)}
                    title={l.titleEs}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${isActive ? a.activePill : 'bg-[#f8f1de] border-[rgba(28,24,19,0.18)] hover:border-[rgba(28,24,19,0.18)] ' + a.text}`}
                  >L{l.lesson}</button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Saludo */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1c1813] mb-1">{t('menu_greeting', { name: userName })} </h1>
          <p className="text-[#928a76] text-sm">{t('menu_question')}</p>
        </div>

        {/* Grid de secciones */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {menuItems.map(item => (
            <button
              key={item.key}
              onClick={() => navigateTo(item.key)}
              className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-[#fbf5e6] border border-[rgba(28,24,19,0.10)] hover:border-[rgba(28,24,19,0.18)] hover:bg-[#f8f1de] transition-all duration-200 hover:scale-105 group cursor-pointer"
            >
              <div className={`mb-2 sm:mb-3 ${item.iconColor} group-hover:scale-110 transition-transform duration-200 scale-75 sm:scale-100`}>{item.icon}</div>
              <h2 className="text-base sm:text-lg font-bold text-[#1c1813] mb-0.5">{item.zh}</h2>
              <p className="text-xs text-[#928a76] mb-1 hidden sm:block">{item.pinyin}</p>
              <p className="text-xs text-[#928a76] text-center leading-tight hidden sm:block">{item.desc}</p>
              {item.badge && <span className="mt-1 sm:mt-2 text-xs text-[#2f6b4a] font-semibold">{item.badge}</span>}
            </button>
          ))}
        </div>

      </Container>
    </div>
  );
}

export default Menu;
