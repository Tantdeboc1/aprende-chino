// components/welcome.jsx - Versión simple con audio integrado en "Comenzar"

import { useState } from 'react';

function Welcome({ inputName, setInputName, handleWelcome, onAudioInit }) {
  const [isActivatingAudio, setIsActivatingAudio] = useState(false);

  const handleClick = async () => {
    if (!inputName.trim()) return;

    setIsActivatingAudio(true);

    try {
      console.log('🔊 Activando audio desde botón Comenzar...');

      // 🔥 DESBLOQUEAR AUDIO DIRECTAMENTE DESDE EL CLICK
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      await audioContext.resume();

      // Reproducir buffer silencioso para activar completamente
      const buffer = audioContext.createBuffer(1, 1, 22050);
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start(0);

      console.log('✅ Audio desbloqueado');

      // Llamar la inicialización de audio de App.jsx
      if (onAudioInit) {
        await onAudioInit();
      }

      // Continuar con el flujo normal
      handleWelcome();

    } catch (error) {
      console.error('⚠️ Error activando audio:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-700">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🇨🇳</div>
          <h1 className="text-3xl font-bold text-white mb-2">学习中文</h1>
          <p className="text-xl text-gray-300 mb-1">Xuéxí Zhōngwén</p>
          <p className="text-gray-400">Aprende Chino - HSK 1</p>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Escribe tu nombre..."
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full px-4 py-3 border-2 border-gray-600 rounded-lg focus:border-red-500 focus:outline-none text-lg bg-gray-700 text-white placeholder-gray-400"
            disabled={isActivatingAudio}
          />
          <button
            onClick={handleClick}
            disabled={!inputName.trim() || isActivatingAudio}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isActivatingAudio ? (
              <>
                <span className="animate-pulse">🔊</span>
                <span>Activando audio...</span>
              </>
            ) : (
              <>
                <span>¡Comenzar!</span>
              </>
            )}
          </button>

          {/* Nota informativa solo para iOS */}
          {/iPad|iPhone|iPod/.test(navigator.userAgent) && (
            <p className="text-xs text-center text-gray-500 mt-2">
              📱 Al presionar "Comenzar" se activará el audio
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Welcome;
