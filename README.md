# 🛣️ HanyuPath — Aprende chino

Aplicación web (PWA) para aprender chino de forma interactiva: caracteres, vocabulario, gramática, lectura y escritura de trazos, con minijuegos, historias y contenido cultural. Funciona offline y en 6 idiomas.

🔗 **En vivo:** [tantdeboc1.github.io/aprende-chino](https://tantdeboc1.github.io/aprende-chino/)

> El nombre de la marca, **HanyuPath**, no se traduce; el subtítulo («Aprende chino» / «Learn Chinese» / …) sí se adapta al idioma.

## ✨ Características

- 🧭 **Aprendizaje por destrezas (MCER):** escuchar, hablar, leer y escribir (听说读写), además de base y preparación de examen.
- ✍️ **Escritura de trazos** con [HanziWriter](https://hanziwriter.org/) — orden de trazos correcto, datos auto-alojados (funciona sin conexión).
- 🎮 **Minijuegos** interactivos (ordenar frases, intrusos, completar, SOV…) y **historias** graduadas con preguntas.
- 📖 **Diccionario** de vocabulario con pinyin, radicales y significados.
- 🗺️ **Explora China:** mapa SVG interactivo de provincias con fichas de gastronomía, dialectos y turismo.
- 👥 **Social:** sistema de amigos por código, invitaciones y ranking.
- 🏆 **Gamificación:** niveles, XP y títulos.
- 🔊 **Pronunciación** con síntesis de voz (Web Speech) y **práctica con micrófono** (reconocimiento de voz).
- 🌍 **Multi-idioma:** interfaz en español, inglés, francés, alemán, italiano y portugués.
- 🌙 **Modo claro/oscuro** (paleta «Jade Pop · Rojo»).
- 📱 **PWA instalable** y **offline** (service worker); **copia de seguridad** y restauración del progreso.
- 🔐 **Acceso** con Google o como invitado (el progreso de invitado se guarda solo en el dispositivo).

## 🛠️ Tecnologías

- **Frontend:** React 19 + Vite 7
- **Estilos:** Tailwind CSS 4 (design tokens con variables CSS para claro/oscuro)
- **Backend/servicios:** Firebase (Auth + Firestore)
- **Trazos:** HanziWriter con datos auto-alojados (`hanzi-writer-data`)
- **i18n:** i18next + react-i18next
- **PWA:** vite-plugin-pwa
- **Avatares:** DiceBear
- **Tipografías:** Noto Sans/Serif SC (auto-alojadas)
- **Despliegue:** GitHub Pages (base `/aprende-chino/`)

## 🚀 Desarrollo

Requiere **Node ≥ 22**.

```bash
npm install
npm run dev        # arranca en http://localhost:5173
npm run build      # build de producción
npm test           # tests (Vitest)
npm run lint       # ESLint
npm run deploy     # publica en GitHub Pages
```

Los scripts `predev`/`prebuild` generan automáticamente los datos i18n troceados y copian solo los datos de trazos de los caracteres que usa la app (`scripts/split-i18n-data.mjs` y `scripts/copy-hanzi-data.mjs`).

## 🎯 Próximas características

- [ ] Contenido HSK-2
- [ ] Tests E2E
- [ ] Rediseño del logo/icono
- [ ] Publicación en Google Play (TWA)

---

> **Nota de compatibilidad interna:** por marca la app se llama HanyuPath, pero identificadores internos (claves de `localStorage`, URL/repo `aprende-chino`, proyecto Firebase) se mantienen para no romper el progreso de los usuarios existentes.
