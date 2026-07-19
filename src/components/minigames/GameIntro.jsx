// src/components/minigames/GameIntro.jsx
// Pantalla de explicación compartida por todos los minijuegos.
// Estética coherente con GlobalExam (tokens J): icono hanzi, pasos numerados
// en chino, botón de comenzar y opción de "No volver a mostrar".
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { hideIntro } from '@/utils/gameIntroPrefs.js';

const CN_NUMERALS = ['一', '二', '三', '四', '五', '六'];

export default function GameIntro({ gameId, cn, title, subtitle, steps, onStart, onBack }) {
  const { t } = useTranslation();
  const [dontShow, setDontShow] = useState(false);

  const handleStart = () => {
    if (dontShow) hideIntro(gameId);
    onStart();
  };

  return (
    <div className="min-h-screen p-4 pb-28" style={{ background: J.paper }}>
      <div className="max-w-lg mx-auto pt-6">
        <button
          onClick={onBack}
          className="flex items-center text-sm mb-6 transition-colors"
          style={{ color: J.inkSoft, background: 'none', border: 0, cursor: 'pointer', fontWeight: 600 }}
        >
          <span className="mr-1.5">←</span> {t('minigames_back_to_minigames')}
        </button>

        <div className="text-center mb-8">
          <div
            className="font-cn mx-auto mb-4 flex items-center justify-center"
            style={{ width: 64, height: 64, borderRadius: 16, background: J.sandBg, color: J.sand, fontSize: '2.25rem', fontWeight: 700 }}
          >
            {cn}
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: J.ink }}>{title}</h1>
          {subtitle && <p style={{ color: J.inkSoft }}>{subtitle}</p>}
        </div>

        <div className="rounded-xl p-5 mb-6 space-y-3" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="font-cn rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                style={{ background: J.sand, color: J.onAccent }}
              >
                {CN_NUMERALS[i] || i + 1}
              </div>
              <p className="text-sm" style={{ color: J.inkSoft }}>{step}</p>
            </div>
          ))}
        </div>

        <label
          className="flex items-center gap-2.5 mb-4 cursor-pointer select-none"
          style={{ color: J.inkSoft, fontSize: '0.8125rem', fontWeight: 600 }}
        >
          <input
            type="checkbox"
            checked={dontShow}
            onChange={e => setDontShow(e.target.checked)}
            style={{ width: 18, height: 18, accentColor: J.jade, cursor: 'pointer' }}
          />
          {t('game_intro_dont_show_again', 'No volver a mostrar esta explicación')}
        </label>

        <button
          onClick={handleStart}
          className="w-full font-bold py-4 rounded-xl text-lg transition-colors"
          style={{ background: J.red, color: J.onAccent, border: 0, cursor: 'pointer' }}
        >
          {t('minigames_start_game_button')}
        </button>
      </div>
    </div>
  );
}
