// jr-shell.jsx — Jade Pop · Rojo · shell + tokens compartidos
// Lógica de color (NO TOCAR sin pensar):
//   JADE      → protagonista, identidad, "en curso", progreso vivo
//   ROJO      → sello del maestro, logro, "dominado", racha, carácter del día como ornamento
//   ARENA     → neutro cálido, "otra vez" (NUNCA rojo de error)
//   MANTEQUILLA → solo sobre rojo (acentos dorados, números de racha)
//   TINTA     → texto, encabezados, fondo de tab activa
// SIN EMOJIS. Caracteres CJK como tipografía sí. Iconos pictográficos no.

const J = {
  paper:    '#f4ecdc',
  paperHi:  '#fbf5e6',
  paperHi2: '#f8f1de',
  ink:      '#1c1813',
  inkSoft:  '#5b5446',
  mute:     '#928a76',
  mute2:    '#bdb39a',
  hair:     'rgba(28,24,19,0.10)',
  hairS:    'rgba(28,24,19,0.18)',
  jade:     '#2f6b4a',
  jadeDeep: '#1f4a33',
  jadeBg:   '#cfe1d3',
  jadeMid:  '#5a8f72',
  red:      '#c8392f',
  redDeep:  '#8b1f1a',
  redBg:    '#f0d6cf',
  sand:     '#b88a3e',
  sandDeep: '#7a5722',
  sandBg:   '#e8d4a8',
  sandBg2:  '#f0e0bc',
  butter:   '#f0c862',
  cnSerif:  '"Noto Serif SC", "Songti SC", serif',
  cnSans:   '"Noto Sans SC", "PingFang SC", sans-serif',
  sans:     '"Geist", system-ui, sans-serif',
  mono:     '"Geist Mono", monospace',
};

// ── Phone frame ────────────────────────────────────────────────
const JFrame = ({ children, style = {} }) => (
  <div style={{
    width: 412, height: 860, background: J.paper, color: J.ink,
    fontFamily: J.sans, display: 'flex', flexDirection: 'column',
    overflow: 'hidden', position: 'relative', ...style,
  }}>{children}</div>
);

// ── Master's red seal ──────────────────────────────────────────
const JSeal = ({ char, size = 24, rotate = -5, bg = J.red, fg = J.paperHi }) => (
  <div style={{
    width: size, height: size, background: bg, color: fg,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: J.cnSerif, fontSize: size * 0.52, fontWeight: 700,
    transform: `rotate(${rotate}deg)`, borderRadius: 2,
    boxShadow: bg === J.red ? '0 1px 0 rgba(139,31,26,0.4)'
                              : '0 1px 0 rgba(0,0,0,0.15)',
    flexShrink: 0,
  }}>{char}</div>
);

// ── Pill chip ──────────────────────────────────────────────────
const JChip = ({ children, bg = J.jadeBg, fg = J.jadeDeep, style = {} }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: '5px 11px', borderRadius: 99,
    background: bg, color: fg,
    fontSize: 11.5, fontWeight: 600, letterSpacing: 0,
    ...style,
  }}>{children}</span>
);

// ── Streak chip (red with butter circle) ───────────────────────
const JStreak = ({ n = 4, label = 'días seguidos' }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 7,
    padding: '5px 12px 5px 5px', borderRadius: 99,
    background: J.red, color: J.paperHi,
    boxShadow: '0 1px 0 rgba(139,31,26,0.4)',
  }}>
    <span style={{
      width: 22, height: 22, borderRadius: '50%', background: J.butter,
      color: J.redDeep,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800, fontSize: 12,
    }}>{n}</span>
    <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.02em' }}>
      {label}
    </span>
  </div>
);

// ── Tiny inline label ─────────────────────────────────────────
const JLabel = ({ children, color = J.mute, size = 11 }) => (
  <span style={{
    fontSize: size, letterSpacing: '0.14em', textTransform: 'uppercase',
    color, fontWeight: 700, fontFamily: J.sans,
  }}>{children}</span>
);

// ── Top bar (with optional back button) ───────────────────────
const JTopBar = ({ left, right, sub }) => (
  <div style={{ padding: '14px 20px 8px', display: 'flex',
                 alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
      {left}
    </div>
    {sub && (
      <div style={{ flex: 1, textAlign: 'center', fontSize: 12,
                     fontWeight: 700, color: J.inkSoft, letterSpacing: '0.04em' }}>
        {sub}
      </div>
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{right}</div>
  </div>
);

// ── App identity (top-left) ───────────────────────────────────
const JMark = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: 32, height: 32, borderRadius: 10,
      background: J.jade, color: J.butter,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: J.cnSans, fontSize: 18, fontWeight: 700,
    }}>学</div>
    <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em' }}>
      Aprende chino
    </span>
  </div>
);

// ── Back link (text only, no chevron icon) ────────────────────
const JBack = ({ onClick, label = 'Cerrar' }) => (
  <button onClick={onClick} style={{
    background: J.paperHi, border: 0, borderRadius: 14,
    padding: '6px 12px', fontSize: 13, color: J.inkSoft,
    fontWeight: 600, cursor: 'pointer', fontFamily: J.sans,
  }}>← {label}</button>
);

// ── Bottom nav ────────────────────────────────────────────────
const JNav = ({ active = 'home', onNav = () => {} }) => {
  const tabs = [
    { id: 'home',    cn: '首页', label: 'Hoy' },
    { id: 'learn',   cn: '课程', label: 'Lecciones' },
    { id: 'dict',    cn: '字典', label: 'Dicc.' },
    { id: 'profile', cn: '个人', label: 'Tú' },
  ];
  return (
    <div style={{
      padding: '10px 16px 18px', background: J.paper,
      borderTop: `1px solid ${J.hair}`,
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onNav(t.id)} style={{
            background: on ? J.ink : 'transparent',
            color: on ? J.paperHi : J.inkSoft,
            border: 0, borderRadius: 18, padding: '10px 6px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            cursor: 'pointer', fontFamily: J.sans,
          }}>
            <span style={{ fontFamily: J.cnSans, fontSize: 14, fontWeight: 600,
                            color: on ? J.red : J.ink, lineHeight: 1 }}>{t.cn}</span>
            <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500,
                            letterSpacing: 0.2 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ── Scroll area ───────────────────────────────────────────────
const JScroll = ({ children, pad = '6px 20px 24px', style = {} }) => (
  <div style={{ flex: 1, overflow: 'auto', padding: pad, ...style }}>
    {children}
  </div>
);

// ── Pill button (primary, secondary, ghost, red) ─────────────
const JBtn = ({ children, kind = 'primary', onClick, full, style = {} }) => {
  const styles = {
    primary:   { bg: J.ink, fg: J.paperHi, shadow: '0 4px 12px -4px rgba(28,24,19,0.4)' },
    jade:      { bg: J.jade, fg: J.paperHi, shadow: '0 4px 12px -4px rgba(31,74,51,0.4)' },
    red:       { bg: J.red,  fg: J.paperHi, shadow: '0 4px 12px -4px rgba(200,57,47,0.5)' },
    ghost:     { bg: J.paperHi, fg: J.ink, shadow: 'none', border: `1px solid ${J.hair}` },
    butter:    { bg: J.butter, fg: J.jadeDeep, shadow: 'none' },
  };
  const s = styles[kind] || styles.primary;
  return (
    <button onClick={onClick} style={{
      background: s.bg, color: s.fg, border: s.border || 0,
      cursor: 'pointer', padding: '14px 22px', borderRadius: 99,
      fontSize: 15, fontWeight: 700, letterSpacing: '-0.005em',
      fontFamily: J.sans, boxShadow: s.shadow,
      width: full ? '100%' : 'auto',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      ...style,
    }}>{children}</button>
  );
};

// ── Stat card ─────────────────────────────────────────────────
const JStat = ({ n, l, color }) => (
  <div style={{
    background: J.paperHi, border: `1px solid ${J.hair}`,
    borderRadius: 14, padding: '12px 12px',
  }}>
    <div style={{ fontSize: 22, fontWeight: 800, color: color || J.ink,
                   letterSpacing: '-0.02em' }}>{n}</div>
    <div style={{ fontSize: 11, color: J.mute, marginTop: 4,
                   fontWeight: 600, letterSpacing: '0.04em' }}>{l}</div>
  </div>
);

// ── Soft card (rounded, paperHi, light shadow) ───────────────
const JCard = ({ children, style = {}, onClick, padding = '16px 18px' }) => (
  <div onClick={onClick} style={{
    background: J.paperHi, border: `1px solid ${J.hair}`,
    borderRadius: 18, padding,
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  }}>{children}</div>
);

// ── Section header ───────────────────────────────────────────
const JSection = ({ label, cn, right }) => (
  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
                 marginTop: 22, marginBottom: 12 }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: J.ink,
                      letterSpacing: '-0.01em' }}>{label}</span>
      {cn && (
        <span style={{ fontFamily: J.cnSerif, fontSize: 14, color: J.mute,
                        fontWeight: 400 }}>{cn}</span>
      )}
    </div>
    {right}
  </div>
);

// ── Tone curves (SVG, no icon font) ──────────────────────────
const JToneCurve = ({ tone, size = 40, color = J.ink, sw = 2.5 }) => {
  const paths = {
    1: 'M 4 12 L 36 12',
    2: 'M 4 22 L 36 6',
    3: 'M 4 10 Q 20 28 36 10',
    4: 'M 4 6 L 36 22',
  };
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 40 28" fill="none"
         stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[tone]} />
    </svg>
  );
};

Object.assign(window, {
  J, JFrame, JSeal, JChip, JStreak, JLabel, JTopBar, JMark, JBack, JNav,
  JScroll, JBtn, JStat, JCard, JSection, JToneCurve,
});
