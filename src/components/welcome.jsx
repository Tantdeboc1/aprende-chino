// components/welcome.jsx - Versión simple con audio integrado en "Comenzar"

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function Welcome({ inputName, setInputName, handleWelcome, onAudioInit }) {
  const { t, i18n } = useTranslation();
  const [isActivatingAudio, setIsActivatingAudio] = useState(false);

  const handleClick = async () => {
    if (!inputName.trim()) return;

    setIsActivatingAudio(true);

    try {

      // DESBLOQUEAR AUDIO DIRECTAMENTE DESDE EL CLICK
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await audioContext.resume();

      // Reproducir buffer silencioso para activar completamente
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);


      // Llamar la inicialización de audio de App.jsx
      if (onAudioInit) {
        await onAudioInit();
      }

      // Continuar con el flujo normal
      handleWelcome();

    } catch (error) {
      // Continuar de todos modos
      handleWelcome();
    } finally {
      setIsActivatingAudio(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const languages = [
    { code: 'es', name: 'ES' },
    { code: 'en', name: 'EN' },
    { code: 'fr', name: 'FR' },
    { code: 'de', name: 'DE' },
  ];

  return (
    <div className="min-h-screen bg-[#f4ecdc] p-4 flex items-center justify-center relative">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 flex gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`px-3 py-1 text-sm font-bold rounded-md transition-colors ${
              i18n.language === lang.code
                ? 'bg-[#c8392f] text-[#fbf5e6]'
                : 'bg-[#f8f1de] text-[#5b5446] hover:bg-[#bdb39a]'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>

      <div className="bg-[#fbf5e6] rounded-2xl shadow-sm p-8 max-w-md w-full border border-[rgba(28,24,19,0.10)]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src="https://flagcdn.com/w160/cn.png"
              alt="Bandera de China"
              className="w-24 h-16 object-cover rounded-sm shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-[#1c1813] mb-2">{t('welcome_title')}</h1>
          <p className="text-xl text-[#5b5446] mb-1">Xuéxí Zhōngwén</p>
          <p className="text-[#928a76]">Aprende Chino - HSK 1</p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder={t('welcome_placeholder')}
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 border-2 border-[rgba(28,24,19,0.32)] rounded-lg focus:border-[#c8392f] focus:outline-none text-lg bg-[#f8f1de] text-[#1c1813] placeholder-[#6e6757]"
            disabled={isActivatingAudio}
          />
          <button
            onClick={handleClick}
            disabled={!inputName.trim() || isActivatingAudio}
            className="w-full bg-[#c8392f] hover:bg-[#8b1f1a] disabled:bg-[#bdb39a] disabled:cursor-not-allowed text-[#fbf5e6] font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isActivatingAudio ? (
              <>
                <span className="animate-pulse"></span>
                <span>{t('welcome_activating_audio')}</span>
              </>
            ) : (
              <>
                <span>{t('welcome_button')}</span>
              </>
            )}
          </button>

          {/iPad|iPhone|iPod/.test(navigator.userAgent) && (
            <p className="text-xs text-center text-[#928a76] mt-2">
              {t('welcome_ios_note')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
