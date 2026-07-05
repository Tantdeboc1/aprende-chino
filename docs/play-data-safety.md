# Formulario "Seguridad de los datos" (Data Safety) — respuestas sugeridas

Guía para rellenar la sección **Data safety** en Google Play Console. Ajusta según
tu configuración final. La regla general: declara lo que **realmente** trata la app
(ver `docs/PRIVACY.md`). Omitir el micrófono o el envío de audio a terceros es
motivo de suspensión.

> Nota importante sobre el audio: aunque la app **no almacena** audio, el
> reconocimiento de voz **transmite** el audio al motor del navegador/sistema
> (Google) para transcribirlo. En el formulario, "collected" incluye datos
> enviados a servidores aunque sean efímeros, así que hay que declararlo.

---

## ¿Recopila o comparte datos de usuario? → **Sí**

### 1. Información personal
- **Nombre** — Recopilado. Fin: funcionalidad de la app (perfil), funciones
  sociales. Compartido: no. Opcional (solo con login Google).
- **Dirección de correo** — Recopilado (login con Google). Fin: gestión de cuenta.
  Compartido: no. Opcional (solo con login Google).
- **ID de usuario** — Recopilado (UID de Firebase). Fin: cuenta, sincronización,
  funciones sociales.

> En modo invitado NO se recopila nada de lo anterior (todo queda local). Es
> "opcional" porque depende de si el usuario inicia sesión.

### 2. Audio
- **Grabaciones de voz o sonido** — Marcar como **recopilado** (se transmite para
  transcripción), **NO almacenado**, **NO compartido con fines publicitarios**.
  - Fin: **Funcionalidad de la app** (reconocimiento de voz para ejercicios de
    pronunciación).
  - Procesado efímeramente por el motor de voz; la app no guarda el audio.
  - Opcional: sí (solo si el usuario usa esos ejercicios y concede el micro).

### 3. Actividad en la app
- **Otras acciones en la app** (progreso de aprendizaje, puntuaciones) —
  Recopilado (si hay login, se sincroniza en Firestore). Fin: funcionalidad,
  personalización.

### 4. Información de diagnóstico / rendimiento
- **Registros de fallos** y **diagnósticos** — Recopilado (Sentry, solo en
  producción). Fin: análisis / prevención de errores.

---

## Prácticas de seguridad
- [ ] **Datos cifrados en tránsito**: Sí (HTTPS / Firebase).
- [ ] **El usuario puede solicitar la eliminación de datos**: Sí (correo de
      contacto; ver política de privacidad).
- [ ] Enlace a la **política de privacidad**: `https://<DOMINIO>/privacy`.

---

## Resumen de "qué NO hace la app" (útil para revisores)
- No almacena grabaciones de audio.
- No comparte datos con terceros para publicidad.
- No hay anuncios ni tracking publicitario.
- En modo invitado no sale ningún dato del dispositivo.
