// Design tokens — Jade Pop · Rojo
// Color logic: jade = progress, red = achievement, sand = try again, butter = on jade/red only
//
// IMPORTANTE: los colores ya NO son hex literales — apuntan a variables CSS
// definidas en src/index.css (:root para claro, .dark para oscuro). Así los
// ~1500 estilos inline que usan `J.*` cambian de tema automáticamente al
// poner/quitar la clase .dark, sin tocar cada componente.
//
// Excepción: para texto/iconos que van SOBRE superficies de color (jade/rojo/
// arena) usa `J.onAccent` (siempre claro), no `J.paperHi` (que es superficie y
// se oscurece en modo noche).
export const J = {
  // Paper / surface
  paper:    'var(--paper)',
  paperHi:  'var(--paper-hi)',
  paperHi2: 'var(--paper-hi2)',

  // Ink / text
  ink:      'var(--ink)',
  inkSoft:  'var(--ink-soft)',
  mute:     'var(--mute)',
  mute2:    'var(--mute2)',
  // Para texto que necesita contraste WCAG AA sobre paper/paperHi (≥4.5:1).
  muteStrong: 'var(--mute-strong)',
  hair:     'var(--hair)',
  hairS:    'var(--hair-s)',
  // Borde de UI más visible para inputs en reposo — cumple SC 1.4.11 (≥3:1).
  border:   'var(--ui-border)',

  // Texto/iconos claros sobre superficies de color (jade/red/sand). Constante
  // entre temas: una superficie jade lleva texto claro tanto en claro como en
  // oscuro, mientras que paperHi (superficie) sí se oscurece.
  onAccent: 'var(--on-accent)',

  // Jade (protagonist)
  jade:     'var(--jade)',
  jadeDeep: 'var(--jade-deep)',
  jadeBg:   'var(--jade-bg)',
  jadeMid:  'var(--jade-mid)',

  // Red / Cinabrio — achievement, NOT error
  red:      'var(--red)',
  redDeep:  'var(--red-deep)',
  redBg:    'var(--red-bg)',

  // Sand (warm neutral)
  sand:     'var(--sand)',
  sandDeep: 'var(--sand-deep)',
  sandBg:   'var(--sand-bg)',
  sandBg2:  'var(--sand-bg2)',

  // Butter (gold — only on jade or red surfaces)
  butter:   'var(--butter)',

  // Sombras en capas (pulido cohesivo) — se adaptan al tema.
  shadowSm: 'var(--shadow-sm)',
  shadowMd: 'var(--shadow-md)',
  shadowLg: 'var(--shadow-lg)',

  // Typography
  sans:     '"Geist", system-ui, sans-serif',
  cnSans:   '"Noto Sans SC", "PingFang SC", sans-serif',
  cnSerif:  '"Noto Serif SC", "Songti SC", serif',
  mono:     '"Geist Mono", monospace',
};

// Resuelve un token 'var(--x)' a su color computado (hex/rgb). Necesario para
// librerías que pintan en canvas y NO entienden variables CSS — sobre todo
// HanziWriter (colorStringToVals falla con 'var(--jade)'). Para CSS normal
// usa J.* directamente; esto es solo para esos casos puntuales.
export function resolveColor(value) {
  if (typeof value === 'string' && value.startsWith('var(') && typeof window !== 'undefined') {
    const name = value.slice(4, -1).trim(); // 'var(--jade)' → '--jade'
    const resolved = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    if (resolved) return resolved;
  }
  return value;
}
