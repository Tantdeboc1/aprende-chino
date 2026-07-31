// src/components/ui/GuidedTour.jsx
// Tutorial guiado del primer arranque: oscurece la pantalla, ilumina un
// elemento real de la interfaz y espera a que el usuario lo toque.
//
// La máscara son CUATRO rectángulos alrededor del hueco, no un clip-path ni un
// box-shadow gigante. Así se consiguen dos cosas de una vez:
//   - el elemento señalado se ve a brillo pleno (no hay nada encima),
//   - los cuatro rectángulos capturan los toques, de modo que el único punto
//     pulsable de la pantalla es el que se está enseñando.
// Por eso el botón de saltar es obligatorio: sin él no habría salida.
import { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { TOUR_STEPS, finishTour } from '@/utils/tour.js';

const DIM = 'rgba(0, 0, 0, 0.66)';
const PAD = 6;      // aire alrededor del hueco
const GAP = 12;     // separación entre hueco y bocadillo
// Tras tocar, la pantalla nueva tarda en montar; medir antes daría el rect
// del elemento viejo (o ninguno).
const ADVANCE_MS = 420;

export default function GuidedTour({ onClose }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);

  const step = TOUR_STEPS[index];
  const isLast = index === TOUR_STEPS.length - 1;

  const close = useCallback(() => {
    finishTour();
    onClose?.();
  }, [onClose]);

  const advance = useCallback(() => {
    setIndex(i => {
      if (i >= TOUR_STEPS.length - 1) {
        finishTour();
        onClose?.();
        return i;
      }
      return i + 1;
    });
  }, [onClose]);

  // ── Medir el objetivo ──────────────────────────────────────────────────
  // Se remide en cada paso y ante scroll/resize. Si el elemento aún no está
  // en el DOM (la pantalla destino sigue montando) se reintenta un momento.
  useLayoutEffect(() => {
    if (!step?.target) { setRect(null); return; }

    let cancelled = false;
    let raf = 0;
    let tries = 0;

    const measure = () => {
      if (cancelled) return;
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (!el) {
        // Hasta ~2 s esperando a que monte; luego se deja sin foco antes que
        // dejar al usuario con la pantalla bloqueada y nada que tocar.
        if (tries++ < 120) { raf = requestAnimationFrame(measure); }
        else setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      // Fuera de pantalla (secciones del Home): acercarlo antes de pintar.
      if (r.top < 0 || r.bottom > window.innerHeight) {
        el.scrollIntoView({ block: 'center', behavior: 'auto' });
        raf = requestAnimationFrame(measure);
        return;
      }
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    measure();
    const onMove = () => { tries = 0; measure(); };
    window.addEventListener('resize', onMove);
    window.addEventListener('scroll', onMove, true);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onMove);
      window.removeEventListener('scroll', onMove, true);
    };
  }, [step]);

  // ── Avanzar al tocar el objetivo ───────────────────────────────────────
  // Un único listener en captura sirve igual para los pasos que navegan y
  // para el que despliega una sección: no hace falta lógica por paso.
  useEffect(() => {
    if (!step?.target) return;
    const onClick = (e) => {
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (el && (e.target === el || el.contains(e.target))) {
        setTimeout(advance, ADVANCE_MS);
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [step, advance]);

  // Escape cierra: salida de teclado además del botón.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  if (!step) return null;

  const hole = rect
    ? {
        top: Math.max(0, rect.top - PAD),
        left: Math.max(0, rect.left - PAD),
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
      }
    : null;

  const stepNumber = index + 1;

  const bubble = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t(step.titleKey)}
      style={{
        position: 'fixed', zIndex: 10001,
        left: 16, right: 16,
        ...(hole
          ? (step.place === 'above'
              ? { bottom: window.innerHeight - hole.top + GAP }
              : { top: hole.top + hole.height + GAP })
          : { top: '50%', transform: 'translateY(-50%)' }),
        background: J.paperHi,
        border: `1px solid ${J.hair}`,
        borderRadius: 18,
        padding: '18px 18px 14px',
        boxShadow: '0 12px 32px -8px rgba(0,0,0,0.45)',
        maxWidth: 420, marginLeft: 'auto', marginRight: 'auto',
      }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: J.mute }}>
        {t('tour_step_counter', 'Paso {{n}} de {{total}}', { n: stepNumber, total: TOUR_STEPS.length })}
      </p>
      <p className="font-bold text-base mb-1" style={{ color: J.ink }}>{t(step.titleKey)}</p>
      <p className="text-sm" style={{ color: J.inkSoft, lineHeight: 1.5 }}>{t(step.descKey)}</p>

      <div className="flex items-center justify-between gap-3" style={{ marginTop: 14 }}>
        <button
          onClick={close}
          style={{
            background: 'none', border: 0, cursor: 'pointer',
            color: J.mute, fontSize: '0.8125rem', fontWeight: 600,
            minHeight: 44, paddingRight: 8,
          }}
        >
          {t('tour_skip', 'Saltar tutorial')}
        </button>

        {step.target ? (
          // Sin botón de avance: el paso se supera tocando lo que se ilumina.
          <span className="text-xs font-semibold" style={{ color: J.sandDeep }}>
            {t('tour_tap_hint', 'Toca lo resaltado ↓')}
          </span>
        ) : (
          <button
            onClick={advance}
            style={{
              background: J.red, color: J.onAccent, border: 0, cursor: 'pointer',
              borderRadius: 12, minHeight: 44, padding: '0 20px',
              fontWeight: 700, fontSize: '0.875rem',
            }}
          >
            {isLast ? t('tour_finish', 'Terminar') : t('tour_start', 'Empezar')}
          </button>
        )}
      </div>
    </div>
  );

  // Cuatro paños alrededor del hueco. Capturan el toque (onClick vacío basta:
  // al no propagarse a la app, el resto de la pantalla queda inerte).
  const panes = hole
    ? [
        { top: 0, left: 0, right: 0, height: hole.top },
        { top: hole.top + hole.height, left: 0, right: 0, bottom: 0 },
        { top: hole.top, left: 0, width: hole.left, height: hole.height },
        { top: hole.top, left: hole.left + hole.width, right: 0, height: hole.height },
      ]
    : [{ inset: 0 }];

  return createPortal(
    <>
      {panes.map((p, i) => (
        <div
          key={i}
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'fixed', zIndex: 10000, background: DIM, ...p }}
        />
      ))}

      {/* Marco del hueco: solo decorativo, sin capturar toques para que el
          dedo llegue al elemento de verdad que hay debajo. */}
      {hole && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed', zIndex: 10000, pointerEvents: 'none',
            top: hole.top, left: hole.left, width: hole.width, height: hole.height,
            borderRadius: 14,
            boxShadow: `0 0 0 3px ${J.sand}`,
          }}
        />
      )}

      {bubble}
    </>,
    document.body
  );
}
