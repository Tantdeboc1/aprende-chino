# Seguridad manteniendo el plan gratuito

## Alcance

Esta versión mantiene Firebase **Spark**, sin activar facturación ni añadir Cloud Functions. Conserva el estudio sin conexión, el XP personal, los códigos de amigo, las invitaciones y la clasificación. **El ranking es una comparación informal:** cada cliente declara su XP; no puede garantizarse que sea auténtico. La interfaz lo indica en los seis idiomas. No se presentan estas puntuaciones como verificadas y no se conceden premios ni permisos en función del ranking.

Se ha retirado la propuesta anterior con backend. Sus archivos se conservan únicamente como borrador en `output/security-review/archived-paid-approach`, fuera de la app y del despliegue. `firebase.json`, el cliente y CI no requieren funciones ni Blaze.

## Protecciones

- Las dependencias y herramientas de construcción se han actualizado para eliminar las vulnerabilidades conocidas detectadas por npm.
- El progreso privado solo puede leerse y escribirse por su dueño. Se validan el esquema y las fechas del servidor.
- Los perfiles con XP solo pueden consultarse por el dueño, sus amigos o quien recibe una invitación suya. La búsqueda de amigos expone únicamente nombre y avatar, sin XP ni progreso. No se permite listar perfiles, identidades ni códigos.
- El código se reserva junto con el perfil mediante una escritura atómica. No se permite cambiarlo para acumular reservas, robar códigos ni borrar el perfil dejando un código huérfano.
- Las invitaciones requieren un contador protegido por reglas: máximo 20 por ventana de 24 horas y al menos 20 segundos entre envíos. El contador no puede borrarse ni reiniciarse desde el cliente; cada actualización está ligada a una sola invitación.
- Solo el receptor de una invitación real puede crear la amistad; ambos miembros pueden eliminarla. Un tercero no puede añadir a otro usuario sin su aceptación.
- Los campos visibles tienen límites de tamaño, tipo y origen de imágenes. Las fotos compartidas admiten HTTPS de Googleusercontent; los avatares son del catálogo local.
- Pages solo se publica después de superar CI, que ejecuta auditoría, lint, pruebas de app, reglas y compilación. Las acciones están fijadas por SHA.
- La app embebida en un iframe no monta controles de cuenta o aprendizaje. En Vercel también se configuran cabeceras de protección; Pages no admite esas cabeceras propias.

## Pruebas

`npm run audit:security`, `npm test`, `npm run lint`, `npm run test:security`, `npm run build` y las pruebas Playwright.

Las pruebas de reglas usan exclusivamente el emulador local y un proyecto `demo-*`, con datos inventados. Requieren Java 21; el JAR oficial descargado se valida con SHA-256. No modifican cuentas ni datos de producción.

Resultado local de esta versión: 692 pruebas de la app superadas en la suite completa, más una prueba nueva del aviso de ranking (las 11 pruebas de Amigos pasan); 9 pruebas de reglas y 14 pruebas de navegador superadas. Auditoría npm: 0 vulnerabilidades conocidas. Compilación correcta; lint con 0 errores y 16 avisos existentes.

## Pendiente antes de publicar

La consola consultada el 6 de octubre de 2026 mantiene **Spark**. El usuario ha registrado la app web `Hsk Academy` con **Fraud Defense / reCAPTCHA Enterprise**. Se corrigió el campo de clave de sitio para usar la clave pública de la configuración existente, cuyo dominio es `tantdeboc1.github.io`. El cliente local utiliza ahora `ReCaptchaEnterpriseProvider`. No se ha activado facturación. El registro no confirma por sí solo el funcionamiento ni activa enforcement: debe publicarse el cliente compatible y comprobar tráfico verificado antes de exigirlo. La clave secreta no se guarda en el código ni en esta guía.

1. Publicar el cliente compatible con el proveedor ya registrado y comprobar que obtiene tokens válidos. Respetar las cuotas gratuitas; no habilitar facturación como parte de este trabajo.
2. Registrar los tokens de depuración solo para desarrollo. Comprobar tráfico válido antes de exigir App Check; activarlo antes bloquearía los clientes actuales. App Check dificulta abuso, pero no verifica el XP calculado por el cliente.
3. Desplegar las reglas y probar la sección Amigos con dos cuentas de prueba dentro de Spark. Verificar búsqueda, invitación, aceptación, consulta, eliminación de amistad y borrado de cuenta. Las reglas nuevas requieren el cliente nuevo para reservar códigos y enviar invitaciones; los clientes antiguos abiertos tendrán que actualizarse.
4. Publicar el frontend tras esas comprobaciones. No se ha subido ni desplegado esta versión.

Spark tiene cuotas gratuitas y puede interrumpir el servicio al agotarlas. Los controles reducen abuso por cuenta, pero no impiden cuentas múltiples ni garantizan disponibilidad frente a ataques. Cero alertas npm significa cero vulnerabilidades conocidas en esa auditoría, no una certificación de seguridad total. Los contadores de invitaciones se conservan para impedir que borrar el perfil reinicie los límites; no contienen nombre, foto ni progreso.

Fuentes oficiales: [planes de Firebase](https://firebase.google.com/pricing), [pruebas de reglas](https://firebase.google.com/docs/rules/unit-tests), [App Check](https://firebase.google.com/docs/app-check/web/recaptcha-provider), [activar protección tras comprobar métricas](https://firebase.google.com/docs/app-check/enable-enforcement).
