# Novedades en el aviso de actualización

Antes de publicar cada versión, actualizar `public/release-notes.json`: ajustar `version` para que coincida con `src/utils/version.js` y escribir un resumen breve en cada idioma. El archivo se consulta al pulsar «Ver mejoras» y no forma parte de la caché de datos ni del precache del service worker.

El aviso muestra explícitamente la última versión publicada: si hay despliegues sucesivos, el service worker en espera y el archivo de novedades podrían corresponder a publicaciones distintas. Sin conexión o si el archivo no está disponible, se informa al usuario y el botón de actualizar sigue funcionando.

La primera versión que incorpore esta función debe instalarse antes de que el dispositivo pueda mostrar el nuevo botón en actualizaciones posteriores.
