// src/fonts.js
// Fuentes chinas auto-alojadas (@fontsource): woff2 troceados por
// unicode-range — el navegador solo descarga los trozos que usa.
// Pesos: 400/500/700 Sans y 400/700 Serif; 600 y 800 resuelven a 700.
//
// Este módulo se importa DINÁMICAMENTE desde main.jsx justo tras el primer
// render: las ~500 reglas @font-face pesan ~195 kB gzip y no pintan nada por
// sí mismas (los woff2 ya cargan async con font-display:swap), así que
// mantenerlas en el CSS render-blocking solo retrasaba el primer pintado.
// OJO: manualChunks (vite.config.js) excluye @fontsource del chunk 'vendor'
// para que este CSS no vuelva a la ruta crítica.
import '@fontsource/noto-sans-sc/400.css';
import '@fontsource/noto-sans-sc/500.css';
import '@fontsource/noto-sans-sc/700.css';
import '@fontsource/noto-serif-sc/400.css';
import '@fontsource/noto-serif-sc/700.css';
