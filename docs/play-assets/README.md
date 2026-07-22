# Recursos de la ficha de Google Play

Material gráfico de la ficha de HanyuPath en Play Console. Se versiona aquí para
poder rehacer la ficha sin depender de la consola ni de copias sueltas.

| Archivo | Formato | Dónde va |
| --- | --- | --- |
| `icon-512.png` | 512×512 | Icono de la app (obligatorio) |
| `feature-graphic.png` | 1024×500 | Gráfico destacado de la ficha (obligatorio) |
| `screenshot-01..06.png` | 1080×1920 | Capturas de teléfono (mínimo 2, máximo 8) |
| `MUSIC-LICENSE.txt` | — | Licencia de la música del vídeo promocional |

Las capturas están **en inglés**: la ficha de Play se publica en inglés. Para
regenerarlas, poner `localStorage.i18nextLng = 'en'` antes de capturar.

## Lo que NO está aquí

- **Los `.aab` firmados** están ignorados por `.gitignore`. Se generan en el
  proyecto TWA (`../../hanyupath-twa`) con `gradlew bundleRelease` y se firman
  con `android.keystore`. Nunca subir el keystore ni su contraseña al repo.
- **El vídeo promocional** (`HanyuPath-promo.mp4`) por tamaño; vive fuera del
  repo. Su licencia de música sí está documentada arriba.

Ver también [`../google-play.md`](../google-play.md), [`../PRIVACY.md`](../PRIVACY.md)
y [`../play-data-safety.md`](../play-data-safety.md).
