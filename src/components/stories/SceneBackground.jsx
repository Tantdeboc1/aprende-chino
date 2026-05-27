// src/components/stories/SceneBackground.jsx
// Sistema híbrido de fondos para Story Mode:
//   1. Si existe una imagen para el `storyId` en /src/assets/fondos/story/ → la usa.
//      (formato preferente: .webp; también acepta .png)
//      Nombre del fichero = id de la historia. Ejemplo:
//        - t1-h1.webp  → historia 't1-h1'
//        - t1-h2.webp  → historia 't1-h2'
//        - ... (y así con t2-h1, t2-h2, t3-h1, t3-h2, t4-h1, t4-h2)
//   2. Si no existe, cae al SVG vectorial por `escenario` (campus, cafeteria, casa, aula).
//
// La imagen se renderiza con object-fit:cover para llenar siempre la pantalla,
// y se le aplica una viñeta sutil encima para que el personaje destaque.

// Vite carga todos los fondos disponibles. Si la carpeta está vacía, simplemente
// no aparecerán en el mapa y caeremos al SVG.
const STORY_BACKGROUNDS = import.meta.glob(
  '/src/assets/fondos/story/*.{webp,png}',
  { eager: true, query: '?url', import: 'default' }
);

function backgroundByStoryId(storyId) {
  if (!storyId) return null;
  for (const ext of ['webp', 'png']) {
    const target = `/${storyId}.${ext}`;
    const entry = Object.entries(STORY_BACKGROUNDS).find(([path]) => path.endsWith(target));
    if (entry) return entry[1];
  }
  return null;
}

// Fondos SVG por escena. Estilo plano, paleta cálida coherente con la app.
// Se usan como fallback cuando no hay imagen propia para la historia.

const SCENES = {
  // ── CAMPUS — patio de universidad con edificios al fondo ────────────────────
  campus: () => (
    <svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="sky-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#f7c98a" />
          <stop offset="45%" stopColor="#e89968" />
          <stop offset="100%" stopColor="#a8553a" />
        </linearGradient>
        <linearGradient id="ground-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#6b5436" />
          <stop offset="100%" stopColor="#2a1f17" />
        </linearGradient>
        <radialGradient id="sun-c" cx="0.7" cy="0.25" r="0.35">
          <stop offset="0%"  stopColor="#fff3c4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f7c98a" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* cielo */}
      <rect width="400" height="700" fill="url(#sky-c)" />
      {/* halo de sol */}
      <rect width="400" height="700" fill="url(#sun-c)" />
      {/* sol */}
      <circle cx="280" cy="160" r="32" fill="#fff0c4" opacity="0.9" />

      {/* montañas lejanas */}
      <path d="M0,360 L60,290 L130,335 L210,275 L290,330 L360,295 L400,335 L400,420 L0,420 Z"
        fill="#7a3f2a" opacity="0.55" />
      <path d="M0,395 L80,340 L160,380 L240,335 L320,375 L400,345 L400,440 L0,440 Z"
        fill="#5c2e1f" opacity="0.7" />

      {/* edificios del campus — silueta */}
      <g opacity="0.92">
        {/* edificio izquierdo (estilo chino, tejado curvo) */}
        <rect x="20" y="380" width="120" height="100" fill="#3a2418" />
        <path d="M10,380 L150,380 L130,360 L30,360 Z" fill="#7a1f1a" />
        <path d="M5,360 Q80,348 155,360 L150,378 L10,378 Z" fill="#c8392f" />
        <rect x="40" y="410" width="14" height="22" fill="#f7c98a" opacity="0.7" />
        <rect x="65" y="410" width="14" height="22" fill="#f7c98a" opacity="0.85" />
        <rect x="90" y="410" width="14" height="22" fill="#f7c98a" opacity="0.7" />
        <rect x="115" y="410" width="14" height="22" fill="#f7c98a" opacity="0.6" />
        <rect x="40" y="445" width="14" height="22" fill="#f7c98a" opacity="0.85" />
        <rect x="65" y="445" width="14" height="22" fill="#f7c98a" opacity="0.65" />
        <rect x="90" y="445" width="14" height="22" fill="#f7c98a" opacity="0.9" />
        <rect x="115" y="445" width="14" height="22" fill="#f7c98a" opacity="0.7" />

        {/* edificio derecho (más alto, moderno) */}
        <rect x="240" y="330" width="140" height="150" fill="#2a1c12" />
        <rect x="240" y="320" width="140" height="14" fill="#3a2418" />
        {Array.from({ length: 5 }).map((_, r) =>
          Array.from({ length: 5 }).map((__, c) => (
            <rect key={`b-${r}-${c}`}
              x={252 + c * 24} y={344 + r * 26}
              width="14" height="14"
              fill="#f7c98a"
              opacity={0.3 + ((r * 5 + c) % 5) * 0.15}
            />
          ))
        )}
      </g>

      {/* árboles */}
      <g>
        <ellipse cx="180" cy="430" rx="28" ry="32" fill="#244a32" />
        <ellipse cx="170" cy="415" rx="20" ry="20" fill="#2f6b4a" />
        <rect x="176" y="450" width="6" height="22" fill="#2a1410" />

        <ellipse cx="370" cy="450" rx="22" ry="26" fill="#244a32" />
        <rect x="368" y="468" width="5" height="18" fill="#2a1410" />
      </g>

      {/* suelo / patio */}
      <rect y="475" width="400" height="225" fill="url(#ground-c)" />
      {/* baldosas en perspectiva */}
      <g stroke="rgba(255,220,170,0.08)" strokeWidth="1" fill="none">
        <path d="M-50,500 L450,500" />
        <path d="M-100,540 L500,540" />
        <path d="M-160,590 L560,590" />
        <path d="M-240,650 L640,650" />
        {/* líneas en V */}
        <path d="M200,480 L-50,700" />
        <path d="M200,480 L80,700" />
        <path d="M200,480 L320,700" />
        <path d="M200,480 L450,700" />
      </g>

      {/* viñeta */}
      <radialGradient id="vig-c" cx="0.5" cy="0.55" r="0.75">
        <stop offset="60%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
      <rect width="400" height="700" fill="url(#vig-c)" />
    </svg>
  ),

  // ── CAFETERÍA — interior cálido con mesas, lámparas y comida ────────────────
  cafeteria: () => (
    <svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="wall-cf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#b88a4e" />
          <stop offset="60%" stopColor="#7a5230" />
          <stop offset="100%" stopColor="#3a2418" />
        </linearGradient>
        <linearGradient id="floor-cf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#5a3f24" />
          <stop offset="100%" stopColor="#1a0e08" />
        </linearGradient>
        <radialGradient id="lamp-cf" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"  stopColor="#fff0b8" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#f0c862" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f0c862" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Pared */}
      <rect width="400" height="500" fill="url(#wall-cf)" />

      {/* Halos de lámparas colgando */}
      <circle cx="80"  cy="120" r="110" fill="url(#lamp-cf)" />
      <circle cx="200" cy="80"  r="130" fill="url(#lamp-cf)" />
      <circle cx="320" cy="120" r="110" fill="url(#lamp-cf)" />

      {/* Lámparas colgantes (estilo lampión chino) */}
      <g>
        <line x1="80"  y1="0"  x2="80"  y2="60" stroke="#1a0e08" strokeWidth="1.5" />
        <ellipse cx="80" cy="80" rx="22" ry="28" fill="#c8392f" />
        <ellipse cx="80" cy="80" rx="22" ry="6"  fill="#8b1f1a" opacity="0.5" />
        <rect x="74" y="50" width="12" height="6" fill="#1a0e08" />
        <rect x="74" y="106" width="12" height="6" fill="#1a0e08" />
        <line x1="80" y1="112" x2="80" y2="120" stroke="#f0c862" strokeWidth="1.5" />
        <path d="M75,120 L80,128 L85,120 Z" fill="#f0c862" />
      </g>
      <g>
        <line x1="200" y1="0" x2="200" y2="30" stroke="#1a0e08" strokeWidth="1.5" />
        <ellipse cx="200" cy="56" rx="26" ry="34" fill="#c8392f" />
        <ellipse cx="200" cy="56" rx="26" ry="7"  fill="#8b1f1a" opacity="0.5" />
        <rect x="193" y="20" width="14" height="7" fill="#1a0e08" />
        <rect x="193" y="84" width="14" height="7" fill="#1a0e08" />
        <line x1="200" y1="91" x2="200" y2="100" stroke="#f0c862" strokeWidth="1.5" />
        <path d="M194,100 L200,110 L206,100 Z" fill="#f0c862" />
      </g>
      <g>
        <line x1="320" y1="0"  x2="320" y2="60" stroke="#1a0e08" strokeWidth="1.5" />
        <ellipse cx="320" cy="80" rx="22" ry="28" fill="#c8392f" />
        <ellipse cx="320" cy="80" rx="22" ry="6"  fill="#8b1f1a" opacity="0.5" />
        <rect x="314" y="50" width="12" height="6" fill="#1a0e08" />
        <rect x="314" y="106" width="12" height="6" fill="#1a0e08" />
      </g>

      {/* Marco de cuadro decorativo con caracteres */}
      <g transform="translate(160, 200)">
        <rect width="80" height="100" fill="#3a2418" stroke="#c8392f" strokeWidth="2" />
        <rect x="6" y="6" width="68" height="88" fill="#f4ecdc" opacity="0.85" />
        <text x="40" y="50" textAnchor="middle" fontSize="38" fontFamily="serif" fill="#8b1f1a" fontWeight="700">福</text>
        <text x="40" y="80" textAnchor="middle" fontSize="14" fill="#1a0e08">好运</text>
      </g>

      {/* Línea suelo/pared */}
      <rect y="495" width="400" height="6" fill="#1a0e08" opacity="0.6" />

      {/* Suelo de madera */}
      <rect y="500" width="400" height="200" fill="url(#floor-cf)" />
      {/* Tablones */}
      <g stroke="rgba(0,0,0,0.35)" strokeWidth="1">
        <line x1="0"   y1="540" x2="400" y2="540" />
        <line x1="0"   y1="590" x2="400" y2="590" />
        <line x1="0"   y1="650" x2="400" y2="650" />
        <line x1="80"  y1="500" x2="100" y2="700" />
        <line x1="200" y1="500" x2="220" y2="700" />
        <line x1="320" y1="500" x2="340" y2="700" />
      </g>

      {/* Mesa baja al fondo con bowls y palillos */}
      <g>
        <ellipse cx="200" cy="465" rx="170" ry="22" fill="rgba(0,0,0,0.45)" />
        <rect x="40" y="430" width="320" height="40" rx="6" fill="#5a3f24" />
        <rect x="40" y="430" width="320" height="8" fill="#7a5230" />

        {/* Bowl de fideos */}
        <ellipse cx="120" cy="430" rx="30" ry="10" fill="#f4ecdc" />
        <ellipse cx="120" cy="427" rx="28" ry="8"  fill="#e89968" />
        <path d="M100,425 Q110,418 120,425 Q130,418 140,425" stroke="#7a3f2a" strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M105,427 Q115,420 125,427" stroke="#7a3f2a" strokeWidth="1.5" fill="none" opacity="0.5" />
        {/* palillos sobre el bowl */}
        <line x1="100" y1="420" x2="135" y2="412" stroke="#3a2418" strokeWidth="2" strokeLinecap="round" />
        <line x1="103" y1="422" x2="138" y2="414" stroke="#3a2418" strokeWidth="2" strokeLinecap="round" />

        {/* Bowl de arroz */}
        <ellipse cx="200" cy="430" rx="26" ry="9" fill="#f4ecdc" />
        <ellipse cx="200" cy="427" rx="24" ry="7" fill="#ffffff" />
        <circle cx="194" cy="426" r="1.2" fill="#bdb39a" />
        <circle cx="200" cy="425" r="1.2" fill="#bdb39a" />
        <circle cx="206" cy="427" r="1.2" fill="#bdb39a" />

        {/* Taza de té */}
        <ellipse cx="280" cy="432" rx="18" ry="6" fill="#3a2418" />
        <ellipse cx="280" cy="428" rx="16" ry="5" fill="#7a3f2a" />
        <ellipse cx="280" cy="427" rx="14" ry="4" fill="#1a0e08" />
        {/* vapor */}
        <path d="M275,416 Q277,408 274,400 Q278,394 275,386" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none" />
        <path d="M283,416 Q285,408 282,400 Q286,394 283,386" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" fill="none" />
      </g>

      {/* Viñeta */}
      <radialGradient id="vig-cf" cx="0.5" cy="0.55" r="0.85">
        <stop offset="60%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
      <rect width="400" height="700" fill="url(#vig-cf)" />
    </svg>
  ),

  // ── CASA — salón con sofá, ventana y marcos familiares ─────────────────────
  casa: () => (
    <svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="wall-h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#e8c896" />
          <stop offset="55%" stopColor="#b88a4e" />
          <stop offset="100%" stopColor="#3a2418" />
        </linearGradient>
        <linearGradient id="floor-h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#6b4a2a" />
          <stop offset="100%" stopColor="#1a0e08" />
        </linearGradient>
        <linearGradient id="window-h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#f7e1b0" />
          <stop offset="100%" stopColor="#e89968" />
        </linearGradient>
        <linearGradient id="sofa-h" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#a82a22" />
          <stop offset="100%" stopColor="#6b1612" />
        </linearGradient>
      </defs>

      {/* Pared */}
      <rect width="400" height="500" fill="url(#wall-h)" />

      {/* Ventana grande con cortinas */}
      <g transform="translate(40, 80)">
        <rect width="140" height="160" fill="url(#window-h)" stroke="#3a2418" strokeWidth="4" />
        {/* cruz de marco */}
        <line x1="70" y1="0"   x2="70" y2="160" stroke="#3a2418" strokeWidth="3" />
        <line x1="0"  y1="80"  x2="140" y2="80" stroke="#3a2418" strokeWidth="3" />
        {/* paisaje al fondo (atardecer) */}
        <circle cx="100" cy="50" r="18" fill="#f0c862" opacity="0.85" />
        <path d="M0,140 L40,110 L70,130 L100,100 L140,135 L140,160 L0,160 Z" fill="#7a3f2a" opacity="0.6" />
        {/* cortinas */}
        <rect x="-12" y="-6" width="20" height="172" fill="#c8392f" />
        <rect x="132" y="-6" width="20" height="172" fill="#c8392f" />
        <path d="M-12,-6 L8,-6 L8,166 Q-2,180 -12,166 Z" fill="#8b1f1a" opacity="0.5" />
        <path d="M132,-6 L152,-6 L152,166 Q142,180 132,166 Z" fill="#8b1f1a" opacity="0.5" />
      </g>

      {/* Marcos de fotos familiares */}
      <g transform="translate(230, 90)">
        <rect width="60" height="80" fill="#3a2418" stroke="#7a5230" strokeWidth="3" />
        <rect x="6" y="6" width="48" height="68" fill="#f4ecdc" />
        {/* siluetas familiares dentro */}
        <circle cx="22" cy="30" r="8" fill="#7a5230" />
        <circle cx="38" cy="30" r="8" fill="#7a5230" />
        <rect x="14" y="38" width="16" height="22" rx="3" fill="#7a5230" />
        <rect x="30" y="38" width="16" height="22" rx="3" fill="#7a5230" />
      </g>
      <g transform="translate(310, 130)">
        <rect width="50" height="60" fill="#3a2418" stroke="#7a5230" strokeWidth="3" />
        <rect x="5" y="5" width="40" height="50" fill="#f4ecdc" />
        <circle cx="25" cy="22" r="9" fill="#7a5230" />
        <rect x="16" y="30" width="18" height="22" rx="3" fill="#7a5230" />
      </g>
      <g transform="translate(220, 200)">
        <rect width="50" height="60" fill="#3a2418" stroke="#7a5230" strokeWidth="3" />
        <rect x="5" y="5" width="40" height="50" fill="#f4ecdc" />
        <circle cx="25" cy="22" r="9" fill="#7a5230" />
        <rect x="16" y="30" width="18" height="22" rx="3" fill="#7a5230" />
      </g>

      {/* Aplique de pared (lámpara) */}
      <g transform="translate(320, 280)">
        <rect x="-3" y="0" width="6" height="20" fill="#3a2418" />
        <path d="M-18,20 L18,20 L12,42 L-12,42 Z" fill="#f0c862" opacity="0.85" />
        <radialGradient id="lamp-h" cx="0.5" cy="0" r="0.8">
          <stop offset="0%"  stopColor="#fff0b8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#f0c862" stopOpacity="0" />
        </radialGradient>
        <ellipse cx="0" cy="42" rx="60" ry="80" fill="url(#lamp-h)" />
      </g>

      {/* Línea suelo / pared */}
      <rect y="495" width="400" height="6" fill="#1a0e08" opacity="0.6" />

      {/* Suelo de madera */}
      <rect y="500" width="400" height="200" fill="url(#floor-h)" />
      <g stroke="rgba(0,0,0,0.35)" strokeWidth="1">
        <line x1="0"   y1="540" x2="400" y2="540" />
        <line x1="0"   y1="590" x2="400" y2="590" />
        <line x1="0"   y1="650" x2="400" y2="650" />
        <line x1="80"  y1="500" x2="100" y2="700" />
        <line x1="200" y1="500" x2="220" y2="700" />
        <line x1="320" y1="500" x2="340" y2="700" />
      </g>

      {/* Sofá rojo al fondo */}
      <g>
        {/* sombra base */}
        <ellipse cx="200" cy="500" rx="220" ry="14" fill="rgba(0,0,0,0.5)" />
        {/* asiento */}
        <rect x="40" y="440" width="320" height="55" rx="10" fill="url(#sofa-h)" />
        {/* respaldo */}
        <rect x="40" y="380" width="320" height="70" rx="14" fill="url(#sofa-h)" />
        <path d="M40,395 L360,395 L360,400 L40,400 Z" fill="#6b1612" opacity="0.4" />
        {/* cojines */}
        <ellipse cx="110" cy="430" rx="35" ry="14" fill="#f0c862" opacity="0.7" />
        <ellipse cx="200" cy="430" rx="35" ry="14" fill="#8b1f1a" opacity="0.7" />
        <ellipse cx="290" cy="430" rx="35" ry="14" fill="#f0c862" opacity="0.7" />
        {/* brazos */}
        <rect x="22" y="395" width="22" height="100" rx="10" fill="#6b1612" />
        <rect x="356" y="395" width="22" height="100" rx="10" fill="#6b1612" />
      </g>

      {/* Mesita pequeña con teléfono enfrente */}
      <g transform="translate(165, 540)">
        <rect width="70" height="40" rx="6" fill="#5a3f24" />
        <rect width="70" height="8" fill="#7a5230" />
        <rect x="6" y="40" width="6" height="30" fill="#3a2418" />
        <rect x="58" y="40" width="6" height="30" fill="#3a2418" />
        {/* móvil con foto encima */}
        <rect x="22" y="-22" width="26" height="34" rx="3" fill="#1a0e08" />
        <rect x="24" y="-20" width="22" height="28" rx="1" fill="#f7e1b0" />
        <circle cx="32" cy="-12" r="2.5" fill="#7a5230" />
        <circle cx="38" cy="-12" r="2.5" fill="#7a5230" />
        <rect x="29" y="-8" width="12" height="8" rx="1" fill="#7a5230" />
      </g>

      {/* Viñeta */}
      <radialGradient id="vig-h" cx="0.5" cy="0.55" r="0.85">
        <stop offset="60%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
      </radialGradient>
      <rect width="400" height="700" fill="url(#vig-h)" />
    </svg>
  ),

  // ── AULA — sala de clase con pizarra y pupitres ─────────────────────────────
  aula: () => (
    <svg viewBox="0 0 400 700" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="wall-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#cfb88a" />
          <stop offset="55%" stopColor="#8a6432" />
          <stop offset="100%" stopColor="#2a1f17" />
        </linearGradient>
        <linearGradient id="floor-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#6b4a2a" />
          <stop offset="100%" stopColor="#1a0e08" />
        </linearGradient>
      </defs>

      {/* Pared cálida */}
      <rect width="400" height="500" fill="url(#wall-a)" />

      {/* Pizarra verde grande con texto chino */}
      <g transform="translate(60, 80)">
        <rect width="280" height="170" fill="#1a4a32" stroke="#3a2418" strokeWidth="8" />
        {/* trazos de tiza */}
        <text x="140" y="60" textAnchor="middle" fontSize="44" fontFamily="serif" fill="rgba(255,255,255,0.92)" fontWeight="700">汉语课</text>
        <text x="140" y="100" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.6)" fontStyle="italic">Hànyǔ kè · Clase de chino</text>
        {/* línea horizontal */}
        <line x1="20" y1="120" x2="260" y2="120" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeDasharray="6 4" />
        <text x="140" y="146" textAnchor="middle" fontSize="22" fontFamily="serif" fill="rgba(255,255,255,0.85)">9:00 — 11:00</text>
        {/* polvo de tiza en la bandeja */}
        <rect x="-6" y="170" width="292" height="10" fill="#3a2418" />
        <rect x="100" y="172" width="34" height="3" fill="rgba(255,255,255,0.85)" />
        <rect x="160" y="172" width="20" height="3" fill="rgba(255,255,255,0.6)" />
      </g>

      {/* Reloj de pared a la derecha */}
      <g transform="translate(355, 130)">
        <circle r="22" fill="#f4ecdc" stroke="#3a2418" strokeWidth="3" />
        <circle r="2" fill="#3a2418" />
        {/* marcas horarias */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x1 = Math.cos(a) * 18;
          const y1 = Math.sin(a) * 18;
          const x2 = Math.cos(a) * 14;
          const y2 = Math.sin(a) * 14;
          return <line key={`m-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a2418" strokeWidth="1.5" />;
        })}
        {/* aguja horaria (las 9) */}
        <line x1="0" y1="0" x2="-9" y2="0" stroke="#1a0e08" strokeWidth="2.5" strokeLinecap="round" />
        {/* aguja minutera */}
        <line x1="0" y1="0" x2="0" y2="-14" stroke="#1a0e08" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* Estantería con libros a la izquierda */}
      <g transform="translate(10, 300)">
        <rect width="40" height="180" fill="#5a3f24" />
        <line x1="0" y1="60" x2="40" y2="60" stroke="#3a2418" strokeWidth="2" />
        <line x1="0" y1="120" x2="40" y2="120" stroke="#3a2418" strokeWidth="2" />
        {/* libros estante superior */}
        <rect x="4" y="20" width="6" height="38" fill="#c8392f" />
        <rect x="12" y="22" width="6" height="36" fill="#2f6b4a" />
        <rect x="20" y="18" width="6" height="40" fill="#b88a3e" />
        <rect x="28" y="24" width="6" height="34" fill="#3a2418" />
        {/* estante medio */}
        <rect x="4" y="80" width="6" height="38" fill="#b88a3e" />
        <rect x="12" y="78" width="6" height="40" fill="#c8392f" />
        <rect x="20" y="82" width="6" height="36" fill="#2f6b4a" />
        {/* libros tumbados estante inferior */}
        <rect x="4" y="148" width="32" height="6" fill="#c8392f" />
        <rect x="4" y="156" width="32" height="6" fill="#b88a3e" />
        <rect x="4" y="164" width="32" height="6" fill="#3a2418" />
      </g>

      {/* Línea suelo / pared */}
      <rect y="495" width="400" height="6" fill="#1a0e08" opacity="0.6" />

      {/* Suelo */}
      <rect y="500" width="400" height="200" fill="url(#floor-a)" />
      <g stroke="rgba(0,0,0,0.35)" strokeWidth="1">
        <line x1="0"   y1="540" x2="400" y2="540" />
        <line x1="0"   y1="590" x2="400" y2="590" />
        <line x1="0"   y1="650" x2="400" y2="650" />
      </g>

      {/* Pupitres en perspectiva (siluetas en el suelo) */}
      <g>
        <rect x="40" y="500" width="100" height="30" rx="4" fill="#5a3f24" />
        <rect x="40" y="530" width="6" height="40" fill="#3a2418" />
        <rect x="134" y="530" width="6" height="40" fill="#3a2418" />
        {/* libro abierto encima */}
        <path d="M55,496 L90,498 L90,486 L55,484 Z" fill="#f4ecdc" />
        <path d="M90,498 L125,496 L125,484 L90,486 Z" fill="#f4ecdc" />
        <line x1="90" y1="498" x2="90" y2="486" stroke="#bdb39a" strokeWidth="1" />

        <rect x="260" y="500" width="100" height="30" rx="4" fill="#5a3f24" />
        <rect x="260" y="530" width="6" height="40" fill="#3a2418" />
        <rect x="354" y="530" width="6" height="40" fill="#3a2418" />
        {/* lápiz */}
        <rect x="280" y="490" width="40" height="4" rx="1" fill="#f0c862" transform="rotate(-12 300 492)" />
      </g>

      {/* Viñeta */}
      <radialGradient id="vig-a" cx="0.5" cy="0.55" r="0.85">
        <stop offset="60%" stopColor="#000" stopOpacity="0" />
        <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
      </radialGradient>
      <rect width="400" height="700" fill="url(#vig-a)" />
    </svg>
  ),

  // ── DEFAULT — degradado oscuro elegante ─────────────────────────────────────
  default: () => (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #2a1f17 0%, #1a1410 100%)',
    }} />
  ),
};

export default function SceneBackground({ escenario = 'default', storyId }) {
  const bgImage = backgroundByStoryId(storyId);

  // Si hay imagen propia para la historia, la usamos (preferente)
  if (bgImage) {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: -1 }} aria-hidden>
        <img
          src={bgImage}
          alt=""
          draggable={false}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Viñeta encima para que el personaje destaque */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }} />
      </div>
    );
  }

  // Fallback: SVG vectorial por escenario
  const Comp = SCENES[escenario] || SCENES.default;
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: -1 }} aria-hidden>
      <Comp />
    </div>
  );
}
