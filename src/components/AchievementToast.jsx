// src/components/AchievementToast.jsx
// Toast deslizante para anunciar un logro desbloqueado. Aparece arriba a
// la derecha, se cierra solo a los N segundos (con barra de progreso) y
// admite click para cerrar antes.

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';

const AUTO_CLOSE_MS = 4500;

export default function AchievementToast({ achievement, onClose, stackIndex = 0 }) {
  const { t, i18n } = useTranslation();
  const [entered, setEntered] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => handleClose(), AUTO_CLOSE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setLeaving(true);
    setTimeout(() => onClose(), 380);
  };

  if (!achievement) return null;
  const lang = i18n.language;
  const title = achievement.title?.[lang] || achievement.title?.es || '';
  const desc  = achievement.desc?.[lang]  || achievement.desc?.es  || '';

  return createPortal(
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 18 + stackIndex * 96,    // apilamiento vertical
        right: 18,
        zIndex: 9998,                  // bajo LevelUpModal (9999)
        maxWidth: 'calc(100vw - 36px)',
        width: 340,
        background: `linear-gradient(135deg, ${J.jade} 0%, ${J.jadeDeep} 100%)`,
        color: J.paperHi,
        borderRadius: 16,
        border: `2px solid ${J.butter}`,
        padding: '12px 14px',
        cursor: 'pointer',
        boxShadow: '0 16px 40px -10px rgba(0,0,0,0.55), 0 0 0 4px rgba(240,200,98,0.18)',
        transform: leaving
          ? 'translateX(120%)'
          : (entered ? 'translateX(0)' : 'translateX(120%)'),
        opacity: leaving ? 0 : 1,
        transition: 'transform 420ms cubic-bezier(0.22,1,0.36,1), opacity 320ms ease-out',
        userSelect: 'none',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Icono */}
        <div style={{
          width: 56, height: 56,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.12)',
          border: `1.5px solid ${J.butter}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, flexShrink: 0,
          animation: 'ach-pop 700ms cubic-bezier(0.34,1.56,0.64,1) 100ms both',
        }}>
          {achievement.icon || '🏆'}
        </div>

        {/* Textos */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0, fontSize: 10, fontWeight: 800,
            letterSpacing: '0.18em', color: J.butter,
            textTransform: 'uppercase',
          }}>
            {t('achievement_unlocked')}
          </p>
          <p style={{
            margin: '3px 0 0', fontSize: 15, fontWeight: 800,
            color: J.paperHi, lineHeight: 1.2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {title}
            {achievement.zh && (
              <span className="font-cn" style={{ marginLeft: 6, fontSize: 12, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                {achievement.zh}
              </span>
            )}
          </p>
          {desc && (
            <p style={{
              margin: '2px 0 0', fontSize: 11.5,
              color: 'rgba(255,255,255,0.78)', lineHeight: 1.3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {desc}
            </p>
          )}
        </div>
      </div>

      {/* Barra de progreso del auto-cierre */}
      <div style={{
        marginTop: 8,
        height: 2, borderRadius: 99,
        background: 'rgba(0,0,0,0.30)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', background: J.butter,
          animation: `ach-progress ${AUTO_CLOSE_MS}ms linear forwards`,
        }} />
      </div>

      <style>{`
        @keyframes ach-pop {
          0%   { transform: scale(0.4) rotate(-12deg); opacity: 0; }
          70%  { transform: scale(1.18) rotate(6deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); }
        }
        @keyframes ach-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>,
    document.body
  );
}
