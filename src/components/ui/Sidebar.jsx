import { APP_VERSION } from '@/utils/version';
import { useTranslation } from "react-i18next";

const Sidebar = ({ isOpen, onClose, onNavigate, onLearnWithSection, onDailyWithSection, onWritingClick }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar sin overlay - solo el panel lateral */}
      <div className="fixed left-0 top-0 bottom-0 w-64 bg-gray-800 shadow-xl z-50 overflow-y-auto rounded-r-2xl">
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {t('sidebar_navigation')}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-gray-300 hover:bg-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {/* Inicio */}
            <li>
              <button
                onClick={() => {
                  onNavigate('menu');
                  onClose();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-gray-700 transition-colors"
              >
                <span className="flex items-center space-x-3">
                  <span>🏠</span>
                  <span>{t('sidebar_home')}</span>
                </span>
              </button>
            </li>

            {/* Aprender - CON ESCRITURA INTEGRADA */}
            <li>
              <button
                onClick={() => {
                  onNavigate('learn');
                  onClose();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-gray-700 transition-colors"
              >
                <span className="flex items-center space-x-3">
                  <span>📚</span>
                  <span>{t('menu_learn_title')}</span>
                </span>
              </button>
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  <button
                    onClick={() => {
                      onLearnWithSection('characters');
                      onClose();
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center space-x-3">
                      <span>🈷️</span>
                      <span>{t('learn_characters_title')}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onLearnWithSection('tones');
                      onClose();
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center space-x-3">
                      <span>🎵</span>
                      <span>{t('learn_tones_title')}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onLearnWithSection('radicals');
                      onClose();
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center space-x-3">
                      <span>🔠</span>
                      <span>{t('learn_radicals_title')}</span>
                    </span>
                  </button>
                </li>
                {/* ESCRITURA INTEGRADA EN APRENDER - CORREGIDO */}
                <li>
                  <button
                    onClick={() => {
                      onWritingClick(); // USA LA FUNCIÓN ESPECÍFICA
                      onClose();
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center space-x-3">
                      <span>✍️</span>
                      <span>{t('learn_writing_title')}</span>
                    </span>
                  </button>
                </li>
              </ul>
            </li>

            {/* Desafíos Diarios */}
            <li>
              <button
                onClick={() => {
                  onNavigate('daily');
                  onClose();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-gray-700 transition-colors"
              >
                <span className="flex items-center space-x-3">
                  <span>🎯</span>
                  <span>{t('menu_daily_title')}</span>
                </span>
              </button>
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  <button
                    onClick={() => {
                      onDailyWithSection('characters');
                      onClose();
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center space-x-3">
                      <span>🈷️</span>
                      <span>{t('learn_characters_title')}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onDailyWithSection('radicals');
                      onClose();
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center space-x-3">
                      <span>🔠</span>
                      <span>{t('learn_radicals_title')}</span>
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      onDailyWithSection('tones');
                      onClose();
                    }}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
                  >
                    <span className="flex items-center space-x-3">
                      <span>🎵</span>
                      <span>{t('learn_tones_title')}</span>
                    </span>
                  </button>
                </li>
              </ul>
            </li>

            {/* Mini-juegos - NUEVA SECCIÓN */}
            <li>
              <button
                onClick={() => {
                  onNavigate('minigames');
                  onClose();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-gray-700 transition-colors"
              >
                <span className="flex items-center space-x-3">
                  <span>🎮</span>
                  <span>{t('menu_minigames_title')}</span>
                </span>
              </button>
            </li>

            {/* Diccionario */}
            <li>
              <button
                onClick={() => {
                  onNavigate('dictionary');
                  onClose();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-gray-700 transition-colors"
              >
                <span className="flex items-center space-x-3">
                  <span>📖</span>
                  <span>{t('menu_dictionary_title')}</span>
                </span>
              </button>
            </li>

            {/* Información */}
            <li>
              <button
                onClick={() => {
                  onNavigate('info');
                  onClose();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-white hover:bg-gray-700 transition-colors"
              >
                <span className="flex items-center space-x-3">
                  <span>ℹ️</span>
                  <span>{t('menu_info_title')}</span>
                </span>
              </button>
            </li>
          </ul>

          {/* VERSIÓN - MINIMALISTA */}
          <div className="mt-8 pt-4 border-t border-gray-700">
            <div className="text-center text-xs text-gray-300">
              <div>中文学习 {APP_VERSION}</div>
              <div className="mt-1">{t('welcome_title')}</div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
