// src/utils/appInfo.js
// Única fuente de verdad del NOMBRE de la app.
//
// "HanyuPath" es la marca: NO se traduce nunca (igual en los 6 idiomas).
// El subtítulo/tagline SÍ se traduce: clave i18n `app_tagline`
// ("Aprende chino" / "Learn Chinese" / …).
//
// OJO: esto es solo la marca visible. Los identificadores internos
// (claves de localStorage `aprende-chino-*`, el campo `app` de los backups,
// la URL /aprende-chino/) NO se renombran: cambiarlos rompería el progreso
// guardado de los usuarios existentes.
export const APP_NAME = 'HanyuPath';
