# Política de privacidad — HanyuPath

**Última actualización: 5 de julio de 2026**

> Antes de publicar, sustituye `<EMAIL_CONTACTO>` por tu correo de contacto y
> aloja este texto en una URL pública (p. ej. `https://<DOMINIO>/privacy`).
> Google Play exige una política de privacidad accesible por URL porque la app
> solicita permiso de micrófono.

Esta política describe qué datos trata la aplicación **HanyuPath** (en
adelante, "la app") y con qué fin. La app está pensada para aprender chino
mandarín y puede usarse **como invitado** (sin cuenta) o **iniciando sesión con
Google**.

## 1. Datos que se tratan

**a) Sin iniciar sesión (modo invitado).** Tu progreso (lecciones, repasos,
puntuación, XP, ajustes) se guarda **únicamente en tu dispositivo** mediante el
almacenamiento local del navegador. No se envía a ningún servidor.

**b) Iniciando sesión con Google.** Para sincronizar tu progreso entre
dispositivos y las funciones sociales, se tratan:
- Tu **identificador de cuenta de Google, nombre y correo** (a través de Firebase
  Authentication).
- Tu **nombre de usuario, avatar y progreso de aprendizaje** (guardados en Google
  Firebase Firestore).
- Datos de la función de **amigos**: código de amistad, invitaciones y ranking.

**c) Micrófono (reconocimiento de voz).** En los ejercicios de pronunciación,
la app usa el reconocimiento de voz del navegador/sistema (Web Speech API) para
comprobar cómo pronuncias. Cuando pulsas el botón de grabar:
- El audio se procesa **en tiempo real por el motor de voz del navegador o del
  sistema operativo** (por ejemplo, el servicio de Google en Chrome) para
  convertirlo en texto.
- La app **no graba, no guarda ni sube ningún archivo de audio**. Solo recibe el
  **texto** transcrito, lo usa un instante para puntuar tu pronunciación y lo
  descarta. Únicamente se conserva la puntuación/XP resultante.

**d) Diagnóstico de errores.** La app puede enviar informes de errores técnicos
(mediante Sentry) para detectar fallos. Estos informes pueden incluir datos
técnicos del dispositivo/navegador y la traza del error, **no el contenido de
tus grabaciones**.

## 2. Terceros que intervienen

- **Google Firebase** (Authentication y Firestore): autenticación y sincronización.
- **Motor de reconocimiento de voz** del navegador/sistema (p. ej. Google en
  Chrome, Apple en Safari): transcripción del habla a texto, en tiempo real.
- **Sentry**: diagnóstico de errores.

Cada uno trata los datos conforme a su propia política de privacidad.

## 3. Micrófono: permiso y uso

El permiso de micrófono se solicita **solo** al usar los ejercicios de habla y se
utiliza **exclusivamente** para el reconocimiento de voz descrito arriba. Puedes
denegarlo o revocarlo desde los ajustes del sistema; en ese caso, esos ejercicios
no estarán disponibles, pero el resto de la app funciona con normalidad.

## 4. Conservación y eliminación

- Los datos locales (modo invitado) se eliminan al borrar los datos de la app o
  desde los ajustes de la propia app.
- Si iniciaste sesión con Google, puedes solicitar la eliminación de tu cuenta y
  datos asociados escribiendo a `<EMAIL_CONTACTO>`.
- **No se conserva ninguna grabación de audio** en ningún momento.

## 5. Menores

La app es apta para todos los públicos y no recopila datos más allá de lo descrito.
No está dirigida a la recopilación de datos personales de menores.

## 6. Cambios

Podemos actualizar esta política; la fecha de arriba indica la última revisión.

## 7. Contacto

Para cualquier consulta sobre privacidad o para solicitar la eliminación de tus
datos: **`<EMAIL_CONTACTO>`**.
