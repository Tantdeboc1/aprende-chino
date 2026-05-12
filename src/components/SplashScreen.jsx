// src/components/SplashScreen.jsx
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MIN_DISPLAY_MS = 4000; // mostrar al menos 4s para ver la animación completa

export default function SplashScreen({ progress, onComplete }) {
  const { t } = useTranslation();
  const writerRef      = useRef(null);
  const writerInst     = useRef(null);
  const startTime      = useRef(Date.now());
  const animLoop       = useRef(null);
  const [visible, setVisible] = useState(false); // arranca invisible → fade-in
  const [exiting, setExiting] = useState(false);

  // ── Fade-in al montar ────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  // ── HanziWriter: animar 学 en bucle ──────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!writerRef.current) return;
      try {
        const HW = await import('hanzi-writer');
        if (!mounted || !writerRef.current) return;

        writerRef.current.innerHTML = '';
        const writer = HW.default.create(writerRef.current, '学', {
          width: 130, height: 130, padding: 8,
          strokeColor: '#ef4444',
          strokeAnimationSpeed: 1.8,
          delayBetweenStrokes: 80,
          showOutline: true,
          showCharacter: false,
        });
        writerInst.current = writer;

        setTimeout(() => {
          if (mounted) writer.animateCharacter();
        }, 400);
      } catch (e) {
        // HanziWriter no disponible — splash funciona igualmente
      }
    })();

    return () => {
      mounted = false;
      if (writerInst.current) {
        try { writerRef.current && (writerRef.current.innerHTML = ''); } catch (_) {}
        writerInst.current = null;
      }
    };
  }, []);

  // ── Disparar salida cuando progress === 100 ──────────────────────────────
  useEffect(() => {
    if (progress < 100) return;
    const elapsed  = Date.now() - startTime.current;
    const waitMore = Math.max(0, MIN_DISPLAY_MS - elapsed);

    const t = setTimeout(() => {
      setExiting(true);                       // dispara fade-out
      setTimeout(() => onComplete(), 650);    // llama al padre al terminar
    }, waitMore);

    return () => clearTimeout(t);
  }, [progress, onComplete]);

  const opacity = exiting ? 0 : (visible ? 1 : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900"
      style={{ opacity, transition: 'opacity 0.65s ease' }}
    >
      {/* Logotipo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-11 h-11 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-base">学</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-2xl tracking-tight">{t('splash_title')}</h1>
          <p className="text-gray-500 text-xs tracking-widest uppercase">HSK 1</p>
        </div>
      </div>

      {/* HanziWriter */}
      <div
        ref={writerRef}
        className="mb-10"
        style={{ width: 130, height: 130 }}
      />

      {/* Barra de progreso real */}
      <div className="w-44 space-y-2">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full"
            style={{
              width: `${progress}%`,
              transition: 'width 0.4s ease-out',
            }}
          />
        </div>
        <p className="text-gray-600 text-xs text-center">
          {progress < 100 ? t('splash_loading') : t('splash_ready')}
        </p>
      </div>
    </div>
  );
}
