// src/components/ui/UpdateToast.jsx
// Toast discreto "Nueva versión disponible → Actualizar". Aparece cuando el
// SW nuevo queda en espera (modo 'prompt'); si el usuario lo ignora, la
// versión nueva entra igualmente en el próximo arranque (comportamiento previo).
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { onNeedRefresh } from '@/utils/pwaUpdate.js';

export default function UpdateToast() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const updateRef = useRef(null);

  useEffect(() => onNeedRefresh((updateFn) => {
    updateRef.current = updateFn;
    setVisible(true);
  }), []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl px-4 py-3"
      style={{
        // Encima de la bottom nav (que ocupa ~70px) y por debajo de modales (z-60).
        bottom: 84, zIndex: 55, maxWidth: 'calc(100vw - 32px)',
        background: J.ink, color: J.paperHi, boxShadow: J.shadowLg,
      }}
    >
      <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
        {t('update_available', 'Hay una versión nueva')}
      </span>
      <button
        onClick={() => updateRef.current?.()}
        className="text-sm font-bold px-3 py-1.5 rounded-xl flex-shrink-0"
        style={{ background: J.jade, color: J.onAccent, border: 0, cursor: 'pointer' }}
      >
        {t('update_reload', 'Actualizar')}
      </button>
      <button
        onClick={() => setVisible(false)}
        aria-label={t('common_close', 'Cerrar')}
        className="text-sm font-bold flex-shrink-0"
        style={{ background: 'none', color: J.mute2, border: 0, cursor: 'pointer', padding: 2 }}
      >
        ✕
      </button>
    </div>
  );
}
