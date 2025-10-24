// src/components/menu.jsx
import Button from "@/components/ui/Button.jsx";
import Container from "@/components/ui/Container.jsx";
import { useTranslation } from 'react-i18next';

function Menu({ userName, navigateTo, dailyComplete }) {
  const { t } = useTranslation();
  // Iconos SVG (más pequeños)
  const GraduationCap = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );

  const Calendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  );

  const BookOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );

  const Info = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>
  );

  // NUEVO ICONO PARA MINI-JUEGOS
  const Gamepad = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="6" x2="10" y1="11" y2="11"/>
      <line x1="8" x2="8" y1="9" y2="13"/>
      <line x1="15" x2="15.01" y1="12" y2="12"/>
      <line x1="18" x2="18.01" y1="10" y2="10"/>
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4c0-1.545-.604-6.584-.693-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/>
    </svg>
  );

  return (
    <div className="min-h-screen p-4">
      <Container>
                <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{t('menu_greeting', { name: userName })} 👋</h1>
          <p className="text-xl text-gray-300 mb-3">Nǐ hǎo, {userName}!</p>
          <p className="text-2xl text-white font-semibold">{t('menu_question')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Button
            variant="card"
            onClick={() => navigateTo('learn')}
            className="h-48 w-48 mx-auto flex flex-col justify-center p-6"
          >
            <div className="mx-auto mb-2 text-blue-500 flex items-center justify-center">
              <GraduationCap />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">学习</h2>
            <p className="text-md text-gray-300 mb-1">Xuéxí</p>
            <p className="text-gray-400 text-sm">{t('menu_learn_description')}</p>
          </Button>

          <Button
            variant="card"
            onClick={() => navigateTo('daily')}
            className="h-48 w-48 mx-auto flex flex-col justify-center p-6"
          >
            <div className="mx-auto mb-2 text-green-500 flex items-center justify-center">
              <Calendar />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">每日挑战</h2>
            <p className="text-md text-gray-300 mb-1">Měi rì tiǎozhàn</p>
            <p className="text-gray-400 text-sm">{t('menu_daily_description')}</p>
            {dailyComplete && <span className="inline-block mt-1 text-green-400 font-semibold text-sm">✓ Completado</span>}
          </Button>

          {/* NUEVO BOTÓN: MINI-JUEGOS */}
          <Button
            variant="card"
            onClick={() => navigateTo('minigames')}
            className="h-48 w-48 mx-auto flex flex-col justify-center p-6"
          >
            <div className="mx-auto mb-2 text-yellow-500 flex items-center justify-center">
              <Gamepad />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">小游戏</h2>
            <p className="text-md text-gray-300 mb-1">Xiǎo yóuxì</p>
            <p className="text-gray-400 text-sm">{t('menu_minigames_description')}</p>
          </Button>

          <Button
            variant="card"
            onClick={() => navigateTo('dictionary')}
            className="h-48 w-48 mx-auto flex flex-col justify-center p-6"
          >
            <div className="mx-auto mb-2 text-purple-500 flex items-center justify-center">
              <BookOpen />
            </div>
            <h2 className="text-xl font-bold text-white mb-1">词典</h2>
            <p className="text-md text-gray-300 mb-1">Cídiǎn</p>
            <p className="text-gray-400 text-sm">{t('menu_dictionary_description')}</p>
          </Button>

          <Button
            variant="card"
            onClick={() => navigateTo('info')}
            className="h-48 w-48 mx-auto flex flex-col justify-center p-6"
          >
            <div className="mx-auto mb-2 text-orange-500 flex items-center justify-center">
              <Info />
            </div>

            <h2 className="text-xl font-bold text-white mb-1">信息</h2>
            <p className="text-md text-gray-300 mb-1">Xìnxī</p>
            <p className="text-gray-400 text-sm">{t('menu_info_description')}</p>
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default Menu;
