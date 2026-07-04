// src/components/china/ChinaMap.jsx
// ─────────────────────────────────────────────────────────────────────────────
// "Explora China": mapa interactivo por provincias.
//
// El mapa es la silueta SVG real de China (un <path> por provincia, generado en
// src/data/chinaGeo.js). Los datos neutros van en provinces/base.js (estático);
// los textos de cada provincia se cargan por idioma en demanda (provinces/loader).
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { J, resolveColor } from '@/styles/tokens';
import { PROVINCE_BASE } from '@/data/provinces/base.js';
import { loadProvinces } from '@/data/provinces/loader.js';
import { CHINA_PATHS, CHINA_VIEWBOX, CHINA_LABELS } from '@/data/chinaGeo.js';

// Índice id → datos neutros (cn, pinyin, población).
const BY_ID = Object.fromEntries(PROVINCE_BASE.map((p) => [p.id, p]));

// Relleno de cada provincia (seleccionada / hover / normal). Se resuelven las
// variables CSS a color real porque SVG fill no hereda bien `var(--x)` al animar.
function fillFor(id, selectedId, hoveredId) {
  if (id === selectedId) return resolveColor(J.jade);
  if (id === hoveredId) return resolveColor(J.jadeMid);
  return resolveColor(J.jadeBg);
}

// Lienzo base del mapa, leído del viewBox generado ("0 0 W H").
const [, , MAP_W, MAP_H] = CHINA_VIEWBOX.split(' ').map(Number);
const MAX_ZOOM = 3;           // ampliación máxima (viewBox mínimo = W/3)
const MIN_VB_W = MAP_W / MAX_ZOOM;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function ChinaSvg({ selectedId, onSelect }) {
  const { t } = useTranslation();
  const ids = Object.keys(CHINA_PATHS);
  const svgRef = useRef(null);
  const [vb, setVb] = useState({ x: 0, y: 0, w: MAP_W, h: MAP_H });
  const [hoveredId, setHoveredId] = useState(null);
  const pointers = useRef(new Map()); // punteros activos: id → {x,y}
  const gesture = useRef(null);       // gesto en curso: pan | pinch
  const moved = useRef(false);
  const zoomed = vb.w < MAP_W - 0.5;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  // Encaja un viewBox dentro de los límites del mapa (sin salirse del lienzo).
  const fit = (x, y, w, h) => ({
    x: clamp(x, 0, MAP_W - w), y: clamp(y, 0, MAP_H - h), w, h,
  });

  // Zoom manteniendo fijo el punto (clientX, clientY) bajo el cursor.
  const zoomAt = useCallback((factor, clientX, clientY) => {
    const el = svgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;
    setVb(({ x, y, w, h }) => {
      const nw = clamp(w * factor, MIN_VB_W, MAP_W);
      const nh = nw * (MAP_H / MAP_W);
      const px = x + relX * w, py = y + relY * h;
      return fit(px - relX * nw, py - relY * nh, nw, nh);
    });
  }, []);

  // Rueda del ratón: listener nativo no-pasivo para poder frenar el scroll.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      zoomAt(e.deltaY < 0 ? 0.85 : 1 / 0.85, e.clientX, e.clientY);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const onPointerDown = (e) => {
    moved.current = false;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      // Dos dedos → pinch-to-zoom. Guardamos distancia y punto medio iniciales.
      const [p1, p2] = [...pointers.current.values()];
      gesture.current = { type: 'pinch', d0: dist(p1, p2) || 1, vb0: { ...vb }, mx: (p1.x + p2.x) / 2, my: (p1.y + p2.y) / 2 };
      moved.current = true; // suprime la selección accidental de provincia
      try { svgRef.current.setPointerCapture(e.pointerId); } catch { /* noop */ }
    } else if (pointers.current.size === 1 && zoomed) {
      // Un dedo con el mapa ampliado → posible pan. No capturamos aún: la
      // captura se activa al superar el umbral, para que un toque limpio
      // llegue al <path> y seleccione la provincia.
      gesture.current = { type: 'pan', sx: e.clientX, sy: e.clientY, ox: vb.x, oy: vb.y, w: vb.w, h: vb.h, active: false, pid: e.pointerId };
    }
  };
  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const g = gesture.current;
    if (!g) return;
    const rect = svgRef.current.getBoundingClientRect();
    if (g.type === 'pinch' && pointers.current.size >= 2) {
      const [p1, p2] = [...pointers.current.values()];
      const nw = clamp(g.vb0.w * (g.d0 / (dist(p1, p2) || 1)), MIN_VB_W, MAP_W);
      const nh = nw * (MAP_H / MAP_W);
      // El punto del mapa bajo el punto medio inicial se mantiene bajo el
      // punto medio actual → el pinch amplía y desplaza a la vez.
      const px = g.vb0.x + ((g.mx - rect.left) / rect.width) * g.vb0.w;
      const py = g.vb0.y + ((g.my - rect.top) / rect.height) * g.vb0.h;
      const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
      const relCx = (mx - rect.left) / rect.width, relCy = (my - rect.top) / rect.height;
      setVb(fit(px - relCx * nw, py - relCy * nh, nw, nh));
    } else if (g.type === 'pan') {
      const dxPx = e.clientX - g.sx, dyPx = e.clientY - g.sy;
      if (!g.active) {
        if (Math.abs(dxPx) < 4 && Math.abs(dyPx) < 4) return; // sigue siendo un toque
        g.active = true;
        moved.current = true; // ya es arrastre → suprime el click de selección
        try { svgRef.current.setPointerCapture(g.pid); } catch { /* noop */ }
      }
      const dvx = (dxPx / rect.width) * g.w, dvy = (dyPx / rect.height) * g.h;
      setVb(fit(g.ox - dvx, g.oy - dvy, g.w, g.h));
    }
  };
  const endDrag = (e) => {
    pointers.current.delete(e.pointerId);
    try { svgRef.current.releasePointerCapture(e.pointerId); } catch { /* noop */ }
    if (gesture.current?.type === 'pinch' && pointers.current.size < 2) gesture.current = null;
    if (pointers.current.size === 0) gesture.current = null;
  };

  const zoomBtn = (factor) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) zoomAt(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };
  const reset = () => setVb({ x: 0, y: 0, w: MAP_W, h: MAP_H });

  const ctrlStyle = {
    width: 32, height: 32, borderRadius: 9, background: J.paperHi,
    border: `1px solid ${J.hair}`, color: J.ink, cursor: 'pointer',
    fontSize: 18, fontWeight: 700, lineHeight: 1, display: 'flex',
    alignItems: 'center', justifyContent: 'center', boxShadow: J.shadowSm,
  };

  // Tamaño de fuente de las etiquetas en unidades de viewBox: al ser
  // proporcional al ancho del viewBox, se mantiene ~constante en pantalla
  // a cualquier zoom. Solo se muestran las provincias suficientemente grandes
  // para el zoom actual (o la seleccionada), evitando amontonar el este.
  const labelFs = vb.w / 52;

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        role="group"
        aria-label={t('china_a11y_map', 'Mapa de China por provincias')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        style={{
          width: '100%', height: 'auto', display: 'block',
          // Ampliado: el mapa se queda todos los gestos (pan + pinch). Sin
          // ampliar: 'pan-y' deja que un dedo haga scroll de la página, pero
          // el pinch de dos dedos sí llega al mapa para ampliar.
          touchAction: zoomed ? 'none' : 'pan-y',
          cursor: zoomed ? (gesture.current?.type === 'pan' && gesture.current.active ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {ids.map((id) => {
          const p = BY_ID[id];
          const selected = id === selectedId;
          return (
            <path
              key={id}
              d={CHINA_PATHS[id]}
              onClick={() => { if (!moved.current) onSelect(id); }}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId((h) => (h === id ? null : h))}
              role="button"
              aria-label={p ? `${p.cn} · ${p.pinyin}` : id}
              aria-pressed={selected}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id); } }}
              style={{ cursor: 'pointer', outline: 'none', transition: 'fill .15s' }}
              fill={fillFor(id, selectedId, hoveredId)}
              stroke={selected ? resolveColor(J.jadeDeep) : resolveColor(J.hair)}
              strokeWidth={selected ? 1.6 : 0.8}
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            >
              {p && <title>{`${p.cn} · ${p.pinyin}`}</title>}
            </path>
          );
        })}

        {/* Etiquetas de nombre (carácter chino) sobre cada provincia */}
        {ids.map((id) => {
          const lab = CHINA_LABELS[id];
          const p = BY_ID[id];
          if (!lab || !p) return null;
          const [lx, ly, lw] = lab;
          const selected = id === selectedId;
          // Mostrar si es la seleccionada o si la provincia ocupa ancho
          // suficiente en la vista actual.
          if (!selected && lw < vb.w * 0.05) return null;
          return (
            <text
              key={`l-${id}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="central"
              style={{
                pointerEvents: 'none',
                fontFamily: J.cnSans,
                fontSize: labelFs,
                fontWeight: 700,
                fill: selected ? resolveColor(J.onAccent) : resolveColor(J.jadeDeep),
                paintOrder: 'stroke',
                stroke: selected ? 'none' : resolveColor(J.paperHi),
                strokeWidth: selected ? 0 : labelFs * 0.16,
                strokeLinejoin: 'round',
              }}
            >
              {p.cn}
            </text>
          );
        })}
      </svg>

      {/* Controles de zoom */}
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button type="button" onClick={() => zoomBtn(0.7)} aria-label={t('china_zoom_in', 'Acercar')} style={ctrlStyle}>+</button>
        <button type="button" onClick={() => zoomBtn(1 / 0.7)} aria-label={t('china_zoom_out', 'Alejar')} style={ctrlStyle}>−</button>
        {zoomed && (
          <button type="button" onClick={reset} aria-label={t('china_zoom_reset', 'Restablecer zoom')} style={{ ...ctrlStyle, fontSize: 14 }}>⤢</button>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, children }) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-1">
        <span aria-hidden style={{ fontSize: 15 }}>{icon}</span>
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: J.mute }}>{label}</span>
      </div>
      <div className="text-sm leading-relaxed" style={{ color: J.inkSoft }}>{children}</div>
    </div>
  );
}

function DetailPanel({ province, onClose, onSpeak }) {
  const { t } = useTranslation();

  // Sin selección → placeholder (evita hueco vacío en escritorio).
  if (!province) {
    return (
      <div
        className="rounded-2xl flex items-center justify-center text-center p-8"
        style={{ background: J.paperHi, border: `1px dashed ${J.hair}`, minHeight: 180 }}
      >
        <div>
          <div className="font-cn text-4xl mb-2" style={{ color: J.mute2 }}>图</div>
          <p className="text-sm" style={{ color: J.mute }}>{t('china_pick_hint', 'Elige una provincia en el mapa')}</p>
        </div>
      </div>
    );
  }

  const ready = !!province.gastronomia; // textos del idioma ya cargados

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{ background: J.paperHi, border: `1px solid ${J.hair}`, boxShadow: J.shadowLg }}
    >
      {/* Cabecera */}
      <div className="p-4 flex items-start gap-3" style={{ background: J.jadeBg, borderBottom: `1px solid ${J.hair}` }}>
        <div
          className="font-cn flex items-center justify-center flex-shrink-0"
          style={{ width: 52, height: 52, borderRadius: 14, background: J.jade, color: J.onAccent, fontSize: 24, fontWeight: 700 }}
        >
          {province.cn}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold leading-tight" style={{ color: J.ink }}>{province.name || province.pinyin}</h3>
          <p className="text-sm" style={{ color: J.jadeDeep }}>{province.cn} · {province.pinyin}</p>
        </div>
        {onSpeak && (
          <button
            onClick={() => onSpeak(province.cn)}
            aria-label={t('china_listen', 'Escuchar el nombre')}
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: 30, height: 30, borderRadius: 9, background: J.jade, color: J.onAccent, cursor: 'pointer', fontSize: 15 }}
          >
            🔊
          </button>
        )}
        <button
          onClick={onClose}
          aria-label={t('common_close', 'Cerrar')}
          className="flex-shrink-0 flex items-center justify-center"
          style={{ width: 30, height: 30, borderRadius: 9, background: J.paperHi, color: J.mute, cursor: 'pointer', fontWeight: 700 }}
        >
          ✕
        </button>
      </div>

      {/* Datos básicos */}
      <div className="p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {province.region && (
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: J.sandBg, color: J.sandDeep }}>
              📍 {province.region}
            </span>
          )}
          {province.capital && (
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: J.sandBg, color: J.sandDeep }}>
              🏙️ {province.capital}
            </span>
          )}
          {province.poblacion && (
            <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: J.sandBg, color: J.sandDeep }}>
              👥 {province.poblacion}
            </span>
          )}
        </div>

        {ready ? (
          <>
            <InfoRow icon="🍜" label={t('china_gastronomy', 'Gastronomía')}>{province.gastronomia}</InfoRow>
            <InfoRow icon="🗣️" label={t('china_dialects', 'Dialectos')}>{province.dialectos}</InfoRow>
            <InfoRow icon="🏞️" label={t('china_tourism', 'Zonas turísticas')}>
              <ul className="space-y-1 mt-0.5">
                {province.turismo.map((spot, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span style={{ color: J.jade }}>·</span>
                    <span>{spot}</span>
                  </li>
                ))}
              </ul>
            </InfoRow>
          </>
        ) : (
          <p className="text-center text-sm py-6" style={{ color: J.mute }}>{t('common_loading', 'Cargando…')}</p>
        )}
      </div>
    </div>
  );
}

export default function ChinaMap({ goBack, speakChinese }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [selectedId, setSelectedId] = useState('sichuan'); // arranca con una ficha
  const [texts, setTexts] = useState(null);
  const total = Object.keys(CHINA_PATHS).length;

  // Carga (en demanda) los textos del idioma activo.
  useEffect(() => {
    let alive = true;
    loadProvinces(lang).then((data) => { if (alive) setTexts(data); });
    return () => { alive = false; };
  }, [lang]);

  // Provincia seleccionada = datos neutros + textos del idioma (si ya cargaron).
  const selected = selectedId
    ? { ...BY_ID[selectedId], ...(texts?.[selectedId] || {}) }
    : null;

  return (
    <div className="min-h-screen" style={{ background: J.paper }}>
      <div className="max-w-5xl mx-auto px-4 pt-4 pb-24">
        {/* Cabecera */}
        <div className="flex items-center gap-3 mb-1">
          {goBack && (
            <button
              onClick={goBack}
              aria-label={t('common_back', 'Volver')}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 38, height: 38, borderRadius: 11, background: J.paperHi, border: `1px solid ${J.hair}`, color: J.ink, cursor: 'pointer', fontWeight: 700 }}
            >
              ←
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold" style={{ color: J.ink }}>
              {t('china_title', 'Explora China')} <span className="font-cn">🗺️</span>
            </h1>
            <p className="text-xs" style={{ color: J.mute }}>
              {t('china_subtitle', 'Toca una provincia para descubrirla')}
            </p>
          </div>
        </div>

        <p className="text-[11px] mb-4 mt-2 px-1" style={{ color: J.mute2 }}>
          {t('china_map_disclaimer', '{{n}} provincias · toca cualquiera para explorar', { n: total })}
        </p>

        {/* Layout: mapa + panel. En desktop lado a lado, en móvil apilado. */}
        <div className="grid gap-5" style={{ gridTemplateColumns: 'minmax(0, 1fr)' }}>
          <div className="lg:grid lg:gap-5 lg:items-start" style={{ gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)' }}>
            <div
              className="rounded-2xl p-3 mb-5 lg:mb-0"
              style={{ background: J.paperHi2 || J.paperHi, border: `1px solid ${J.hair}` }}
            >
              <ChinaSvg selectedId={selectedId} onSelect={setSelectedId} />
            </div>

            <DetailPanel province={selected} onClose={() => setSelectedId(null)} onSpeak={speakChinese} />
          </div>
        </div>
      </div>
    </div>
  );
}
