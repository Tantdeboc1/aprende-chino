# Novedades en el aviso de actualización

El despliegue de GitHub Pages calcula automáticamente la siguiente versión de parche (`vX.Y.Z`) a partir de `package.json` y de las etiquetas Git existentes. La inserta en la app y en `release-notes.json`, y reserva la etiqueta para ese commit antes de desplegar. Así, repetir un despliegue del mismo commit conserva el mismo número y no crea commits automáticos de versión.

Cuando haya novedades funcionales, actualizar las listas traducidas de `public/release-notes.json`. El número se completa automáticamente; el resumen necesita describir los cambios reales y por eso se redacta al preparar esos cambios. El archivo queda fuera del precache del service worker.

La app mantiene el aviso previo para activar la actualización y, al cargar la versión nueva, muestra una confirmación con su número y las novedades. Solo vuelve a listar las novedades cuando cambia su contenido; si no han cambiado, muestra un resumen de ajustes y correcciones.
