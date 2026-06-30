import { useEffect, useRef, useState } from 'react';
import { J, resolveColor } from '@/styles/tokens';
import { hanziCharDataLoader } from '@/utils/hanziCharData.js';

const MIN_DISPLAY_MS = 4000;

export default function SplashScreen({ progress, onComplete }) {
  const writerRef  = useRef(null);
  const writerInst = useRef(null);
  const startTime  = useRef(Date.now());
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!writerRef.current) return;
    let mounted = true;
    let writer = null;
    // Host imperativo: HanziWriter pinta su SVG aquí, fuera del control de React,
    // para evitar el 'removeChild' al desmontar (ver HomeScreen / AnimatedLoader).
    const host = document.createElement('div');
    writerRef.current.appendChild(host);

    (async () => {
      try {
        const HW = await import('hanzi-writer');
        if (!mounted) return;
        writer = HW.default.create(host, '学', {
          charDataLoader: hanziCharDataLoader,
          width: 130, height: 130, padding: 8,
          strokeColor: resolveColor(J.jade), radicalColor: resolveColor(J.red),
          strokeAnimationSpeed: 1.8, delayBetweenStrokes: 80,
          showOutline: true, showCharacter: false,
          outlineColor: resolveColor(J.mute2),
        });
        writerInst.current = writer;
        setTimeout(() => { if (mounted) writer.animateCharacter(); }, 400);
      } catch (_) {}
    })();

    return () => {
      mounted = false;
      try { writer?.pauseAnimation?.(); } catch (_) {}
      try { host.remove(); } catch (_) {}
      writerInst.current = null;
    };
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    const elapsed = Date.now() - startTime.current;
    const waitMore = Math.max(0, MIN_DISPLAY_MS - elapsed);
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onComplete(), 650);
    }, waitMore);
    return () => clearTimeout(t);
  }, [progress, onComplete]);

  const opacity = exiting ? 0 : (visible ? 1 : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: J.paper, opacity, transition: 'opacity 0.65s ease' }}
    >
      <div className="flex items-center gap-3 mb-10">
        <div
          className="font-cn flex items-center justify-center"
          style={{ width: 44, height: 44, borderRadius: 14, background: J.jade, color: J.butter, fontSize: 24, fontWeight: 700 }}
        >
          学
        </div>
        <div>
          <h1 style={{ fontWeight: 700, fontSize: 24, letterSpacing: '-0.02em', color: J.ink, margin: 0 }}>
            Aprende Chino
          </h1>
          <p style={{ color: J.mute, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', margin: 0 }}>
            HSK 1
          </p>
        </div>
      </div>

      <div ref={writerRef} className="mb-10" style={{ width: 130, height: 130 }} />

      <div style={{ width: 176 }} className="space-y-2">
        <div style={{ height: 4, background: J.hair, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: `linear-gradient(90deg, ${J.jade}, ${progress > 65 ? J.red : J.jade})`,
            width: `${progress}%`,
            transition: 'width 0.4s ease-out',
          }} />
        </div>
        <p style={{ color: J.mute, fontSize: 12, textAlign: 'center', fontWeight: 500 }}>
          {progress < 100 ? 'Cargando...' : 'Todo listo'}
        </p>
      </div>
    </div>
  );
}
