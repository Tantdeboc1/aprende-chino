# Publicar "Aprende Chino" en Google Play

Guía y checklist para empaquetar la PWA y subirla a Google Play. El punto
delicado es el **micrófono** (reconocimiento de voz); todo lo demás es estándar.

> Rellena los marcadores `<...>` antes de publicar:
> - `<DOMINIO>` = dominio público donde vive la web (hoy GitHub Pages, ver nota).
> - `<USUARIO_GH>` = tu usuario de GitHub Pages.
> - `<EMAIL_CONTACTO>` = correo de soporte/privacidad.

---

## 1. Elegir el método de empaquetado

| Método | Motor | Reconocimiento de voz (micro) | Recomendación |
|---|---|---|---|
| **TWA** (Bubblewrap / PWABuilder) | Chrome real del dispositivo | Suele funcionar (probar en móvil) | ✅ **Preferido** para esta app |
| **WebView** (Capacitor / Cordova) | Android System WebView | ❌ No soporta `SpeechRecognition` | Solo si añades plugin nativo |

**Decisión recomendada: TWA con PWABuilder** (https://www.pwabuilder.com) o
Bubblewrap (`npm i -g @bubblewrap/cli`). Mantiene una sola base de código y usa
Chrome, que es donde la Web Speech API funciona.

### Si vas por Capacitor/WebView
Los minijuegos **Pronunciación** y **Repite la frase** mostrarán la pantalla
"No disponible aquí" (el fallback ya está implementado, la app NO crashea).
Para que funcionen habría que integrar `@capacitor-community/speech-recognition`
(plugin nativo) y adaptar `src/utils/speechRecognition.js` — trabajo aparte.

---

## 2. Requisito bloqueante del TWA: Digital Asset Links

El TWA verifica que la web es tuya con un fichero servido en la **raíz del dominio**:

    https://<DOMINIO>/.well-known/assetlinks.json

⚠️ **Problema actual:** la app se despliega en GitHub Pages con subruta
(`base=/aprende-chino/`), p. ej. `https://<USUARIO_GH>.github.io/aprende-chino/`.
Los asset links deben estar en `https://<USUARIO_GH>.github.io/.well-known/...`
(raíz del usuario), no en la subruta del proyecto. Opciones:

1. **Dominio propio** (recomendado): apuntar un dominio a GitHub Pages y servir
   `assetlinks.json` en su raíz. Es lo más limpio para Play.
2. Publicar `assetlinks.json` en la raíz del sitio de usuario de GitHub Pages
   (un repo `<USUARIO_GH>.github.io`) — funciona si controlas ese repo.

PWABuilder/Bubblewrap generan el `assetlinks.json` con la huella SHA-256 de tu
clave de firma; solo hay que colocarlo en la ruta correcta.

---

## 3. Micrófono: permiso + comportamiento

- La app pide micrófono **solo** en los 2 minijuegos de habla.
- En TWA, la primera vez Chrome pedirá permiso de micrófono; hay que probar en
  un dispositivo real que el prompt aparece y que la voz se reconoce.
- **No se graba ni se almacena audio.** El audio lo procesa el motor de voz del
  navegador/sistema (Google en Chrome) en tiempo real y solo se recibe el texto.
  Ver `docs/PRIVACY.md` y `docs/play-data-safety.md`.

---

## 4. Checklist de la ficha de Play (obligatorio)

- [x] **Política de privacidad publicada** — ya se sirve con la app en
      `https://<DOMINIO>/aprende-chino/privacidad.html` (fuente: `public/privacidad.html`;
      `docs/PRIVACY.md` queda como borrador). Obligatoria por usar micrófono.
- [x] **Eliminación de cuenta en la app** (requisito de Play): Ajustes → Cuenta →
      "Eliminar cuenta y datos" borra Firestore (users, publicProfiles, friendCodes,
      friendRequests, friendships) + cuenta de Auth + datos locales.
- [ ] **Formulario "Seguridad de los datos"** completado (ver `docs/play-data-safety.md`).
- [ ] Permiso `RECORD_AUDIO` declarado y justificado (uso: reconocimiento de voz
      para ejercicios de pronunciación; sin grabación ni almacenamiento).
- [ ] Icono, capturas, descripción corta/larga, categorización de contenido.
- [ ] Cuenta de Play Console (pago único de 25 USD) + firma de app (Play App Signing).
- [ ] Probar el AAB en un dispositivo real: instala, audio Opus, examen de nivel,
      y **los 2 minijuegos de micrófono**.

---

## 5. Pasos resumidos (ruta TWA con PWABuilder)

1. Despliega la web en `<DOMINIO>` con HTTPS y `manifest` válido (ya lo tienes vía
   vite-plugin-pwa). Verifica que es instalable y funciona offline.
2. Entra en https://www.pwabuilder.com, mete la URL, genera el paquete **Android**.
3. Coloca el `assetlinks.json` que te da en `https://<DOMINIO>/.well-known/`.
4. Sube el `.aab` a Play Console (pista interna primero).
5. Completa política de privacidad + Data Safety + permisos.
6. Prueba en dispositivo, luego promociona a producción.

---

## Notas del proyecto
- Deploy actual: GitHub Pages, `base=/aprende-chino/` (ver `package.json`).
- Firebase project: `hsk-academy-53806` (Auth Google + Firestore para sync/amigos).
  Recuerda restringir la API key por referrer/paquete antes de producción.
- Sentry activo solo en PROD, gateado por host.
