// Design tokens — Jade Pop · Rojo
// Color logic: jade = progress, red = achievement, sand = try again, butter = on jade/red only
export const J = {
  // Paper / surface
  paper:    '#f4ecdc',
  paperHi:  '#fbf5e6',
  paperHi2: '#f8f1de',

  // Ink / text
  ink:      '#1c1813',
  inkSoft:  '#5b5446',
  mute:     '#928a76',
  mute2:    '#bdb39a',
  // Para texto que necesita contraste WCAG AA sobre paper/paperHi (≥4.5:1).
  // Úsalo en placeholders de inputs y en cualquier texto pequeño "secundario"
  // que deba seguir siendo legible. mute (#928a76) solo cumple AA en texto grande.
  muteStrong: '#6e6757',
  hair:     'rgba(28,24,19,0.10)',
  hairS:    'rgba(28,24,19,0.18)',
  // Borde de UI más visible para inputs en reposo — cumple SC 1.4.11 (≥3:1).
  border:   'rgba(28,24,19,0.32)',

  // Jade (protagonist)
  jade:     '#2f6b4a',
  jadeDeep: '#1f4a33',
  jadeBg:   '#cfe1d3',
  jadeMid:  '#5a8f72',

  // Red / Cinabrio — achievement, NOT error
  red:      '#c8392f',
  redDeep:  '#8b1f1a',
  redBg:    '#f0d6cf',

  // Sand (warm neutral)
  sand:     '#b88a3e',
  sandDeep: '#7a5722',
  sandBg:   '#e8d4a8',
  sandBg2:  '#f0e0bc',

  // Butter (gold — only on jade or red surfaces)
  butter:   '#f0c862',

  // Typography
  sans:     '"Geist", system-ui, sans-serif',
  cnSans:   '"Noto Sans SC", "PingFang SC", sans-serif',
  cnSerif:  '"Noto Serif SC", "Songti SC", serif',
  mono:     '"Geist Mono", monospace',
};
