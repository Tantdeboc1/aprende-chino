# Sourcemaps de Sentry

HanyuPath reporta errores a Sentry con un **transporte propio, sin el SDK**
(`src/utils/errorTracking.js`) para no cargar ~150 kB en el navegador del
usuario. Los eventos llevan `release: APP_VERSION` (p. ej. `v0.8.0`).

En producción los archivos JS van minificados, así que los stack traces de
Sentry son ilegibles hasta que se **suben los sourcemaps** de ese release.

## Cómo funciona

- El build ya genera sourcemaps con `build.sourcemap: 'hidden'` en
  `vite.config.js` (se generan pero **no** se referencian desde el bundle, así
  no se descargan en producción).
- `@sentry/vite-plugin` (devDependency, solo build-time) los sube a Sentry y
  luego **borra los `.map` del `dist`** para no publicarlos en GitHub Pages.
- El plugin **solo se activa si existe `SENTRY_AUTH_TOKEN`** en el entorno; sin
  esa variable, `npm run build`/`deploy` funcionan igual que siempre.

## Qué necesitas configurar (una vez)

Variables de entorno al hacer el build de release:

| Variable | Qué es | Dónde se saca |
|---|---|---|
| `SENTRY_AUTH_TOKEN` | Token con scope `project:releases` | Sentry → Settings → Auth Tokens |
| `SENTRY_ORG` | Slug de la organización | URL de Sentry (`sentry.io/organizations/<slug>/`) |
| `SENTRY_PROJECT` | Slug del proyecto | Settings del proyecto |

> El `release` (nombre) lo pone el plugin automáticamente = `APP_VERSION`
> (`src/utils/version.js`). Debe coincidir con el que envía `errorTracking.js`.
> **Al subir versión, actualiza `APP_VERSION` y vuelve a desplegar** para que los
> mapas del nuevo release se suban.

## Uso

Local (PowerShell):

```powershell
$env:SENTRY_AUTH_TOKEN = "..."; $env:SENTRY_ORG = "..."; $env:SENTRY_PROJECT = "..."
npm run deploy
```

En GitHub Actions: añade los tres valores como *repository secrets* y expórtalos
como `env` en el paso de build/deploy.

Sin las variables no pasa nada especial: el deploy sigue funcionando, solo que
los errores de Sentry seguirán minificados (como hasta ahora).
