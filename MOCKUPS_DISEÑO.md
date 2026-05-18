# 🎨 MOCKUPS DE DISEÑO - Aprende Chino

**Documento visual con propuestas de interfaz**  
**Estado:** Análisis visual (SIN IMPLEMENTAR)

---

## 📱 1. PANTALLA HOME - ANTES vs DESPUÉS

### ANTES (Actual):
```
╔════════════════════════════════════════╗
║ 学中文                                  ║
║ Aprende Chino                          ║
╠════════════════════════════════════════╣
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │ Lección 1                      │   ║  ← Tarjeta gris, poco contraste
║  │ Radicales                      │   ║
║  │ 5 caracteres completados       │   ║
║  └────────────────────────────────┘   ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │ Lección 2                      │   ║
║  │ Tonos                          │   ║
║  │ No comenzada                   │   ║
║  └────────────────────────────────┘   ║
║                                        ║
║  ┌────────────────────────────────┐   ║
║  │ Lección 3                      │   ║
║  │ Caracteres                     │   ║
║  │ 3 caracteres completados       │   ║
║  └────────────────────────────────┘   ║
║                                        ║
╚════════════════════════════════════════╝

Problems:
❌ Cards uniformes
❌ Información no estructurada
❌ Sin indicadores visuales
❌ Poco espacio entre elementos
```

### DESPUÉS (Propuesto):
```
╔════════════════════════════════════════╗
║ 🌟 学中文                              ║  ← Con emoticono
║ Aprende Chino HSK-1                    ║
║ ────────────────────────────────────── ║
║ Tu progreso: 37% completo              ║
╠════════════════════════════════════════╣
║                                        ║
║  ┌──────────────────────────────────┐  ║
║  │ 📊 Estadísticas rápidas          │  ║
║  │ ┌──────────────────────────────┐│  ║
║  │ │ 73 ✓ completadas              ││  ║
║  │ │ 87% retención | 🔥 15 días   ││  ║
║  │ └──────────────────────────────┘│  ║
║  └──────────────────────────────────┘  ║
║                                        ║  ← Tarjeta stats con colores
║  ┌─ LECCIÓN 1 (Completada) ─────────┐  ║
║  │ 📚 Radicales Básicos             │  ║
║  │ ────────────────────────────────│  ║
║  │ Progreso: ██████░░░░ 75%        │  ║
║  │ • 30 radicales aprendidos       │  ║
║  │ • Próximo: Lección 2            │  ║
║  │ ────────────────────────────────│  ║
║  │ [Learn] [Quiz] [Writing]       │  ║
║  └──────────────────────────────────┘  ║
║                                        ║  ← Card con acento izq verde
║  ┌─ LECCIÓN 2 (En progreso) ────────┐  ║
║  │ 🎵 Tonos & Pronunciación        │  ║
║  │ ────────────────────────────────│  ║
║  │ Progreso: ███░░░░░░░░░ 25%      │  ║
║  │ • 8/30 tonos dominados          │  ║
║  │ • Necesitas práctica            │  ║
║  │ ────────────────────────────────│  ║
║  │ [Learn] [Quiz] [Writing]       │  ║
║  └──────────────────────────────────┘  ║
║                                        ║  ← Card con acento amarillo
║  ┌─ LECCIÓN 3 (Bloqueada) ──────────┐  ║
║  │ 🔒 Caracteres Chinos            │  ║
║  │ ────────────────────────────────│  ║
║  │ Debes completar Lección 2       │  ║
║  │                                │  ║
║  │ [Ir a Lección 2]               │  ║
║  └──────────────────────────────────┘  ║
║                                        ║
║  ┡────────────────────────────────────┐ ║
║  │ ⭐ Próximo logro desbloqueado:   │ ║
║  │ 7️⃣  "En Racha" (Te faltan 6 días)  │ ║
║  └────────────────────────────────────┘ ║
║                                        ║
╚════════════════════════════════════════╝

Improvements:
✅ Cards con color contextual (verde, amarillo, gris)
✅ Información estructurada y clara
✅ Indicadores visuales (emojis, barras, icons)
✅ Mejor espaciado y jerarquía
✅ Información de logros y progreso
✅ Acciones claramente marcadas
```

---

## 🎮 2. PANTALLA QUIZ - ANTES vs DESPUÉS

### ANTES:
```
╔════════════════════════════════════════╗
║ [←] Quiz - Lección 1                   ║
╠════════════════════════════════════════╣
║                                        ║
║ Pregunta 3/10                          ║
║                                        ║
║ ¿Cuál es la pronunciación de 新?      ║
║                                        ║
║ ┌────────────────────────────────────┐ ║
║ │ xīn                                │ ║
║ └────────────────────────────────────┘ ║
║ ┌────────────────────────────────────┐ ║
║ │ xín                                │ ║
║ └────────────────────────────────────┘ ║
║ ┌────────────────────────────────────┐ ║
║ │ xìn                                │ ║
║ └────────────────────────────────────┘ ║
║                                        ║
║ [Siguiente]                            ║
║                                        ║
╚════════════════════════════════════════╝

Problems:
❌ Sin feedback visual
❌ Sin indicador de progreso
❌ Sin información de tono
❌ Botones poco claros
```

### DESPUÉS:
```
╔════════════════════════════════════════╗
║ [←] Quiz - Lección 1        3️⃣/1️⃣0️⃣    ║
║ ──────────────────────────── ─────────║
║ Progreso: ███░░░░░░░░░░ 30%           ║
╠════════════════════════════════════════╣
║                                        ║
║ 🎯 Pronunciación                       ║
║ ┌────────────────────────────────────┐ ║
║ │           新 (xīn)                 │ ║
║ │  [▶ Escuchar pronunciación]         │ ║
║ │  Tono: 1️⃣  (Rosa - 1er tono)      │ ║
║ └────────────────────────────────────┘ ║
║                                        ║
║ ¿Cuál es la pronunciación correcta?   ║
║                                        ║
║ ┌────────────────────────────────────┐ ║
║ │ ○  xīn   (1️⃣ Rosa)                │ ║
║ └────────────────────────────────────┘ ║
║ ┌────────────────────────────────────┐ ║
║ │ ○  xín   (2️⃣ Aqua)                │ ║
║ └────────────────────────────────────┘ ║
║ ┌────────────────────────────────────┐ ║
║ │ ○  xìn   (4️⃣ Menta)               │ ║
║ └────────────────────────────────────┘ ║
║                                        ║
║ [Primary: Responder] [Ghost: Saltar]  ║
║                                        ║
╚════════════════════════════════════════╝

DESPUÉS DE RESPONDER CORRECTAMENTE:
┌────────────────────────────────────┐
│ ✅ ¡Correcto!  🎉                   │
│ ────────────────────────────────── │
│ 新 = xīn (xīn = Nuevo)             │
│ Tono 1 (Rosa): ā  á  ǎ  à         │
│                                    │
│ +1 punto | Racha: 3 correctas ✓✓✓ │
│ ────────────────────────────────── │
│ [Siguiente →]  [Revisar]          │
└────────────────────────────────────┘

OR SI FALLO:
┌────────────────────────────────────┐
│ ❌ Incorrecto                       │
│ ────────────────────────────────── │
│ Seleccionaste: xín (Tono 2)        │
│ ────────────────────────────────── │
│ Respuesta correcta: xīn (Tono 1)  │
│ 新 = xīn (Nuevo)                   │
│ ────────────────────────────────── │
│ Próxima revisión: En 1 día         │
│ ────────────────────────────────── │
│ [Reintentar]  [Siguiente]  [Ver]  │
└────────────────────────────────────┘

Improvements:
✅ Indicador de progreso visual (barra)
✅ Audio visible y accesible
✅ Colores para tonos
✅ Feedback inmediato (✓/✗)
✅ Información de contexto
✅ Botones con intención clara
✅ Animación de congratulación
```

---

## 📊 3. PANTALLA ANALYTICS - NUEVA

### PROPUESTA COMPLETA:
```
╔════════════════════════════════════════╗
║ 📊 Mi Progreso                         ║
╠════════════════════════════════════════╣
║                                        ║
║ ┌────────────────────────────────────┐ ║
║ │ ┌──────────────────────────────┐  │ ║
║ │ │ Estudiadas: 127              │  │ ║
║ │ └──────────────────────────────┘  │ ║
║ │ ┌──────────────────────────────┐  │ ║
║ │ │ Retención: 87%               │  │ ║
║ │ └──────────────────────────────┘  │ ║
║ │ ┌──────────────────────────────┐  │ ║
║ │ │ 🔥 Racha: 15 días           │  │ ║
║ │ └──────────────────────────────┘  │ ║
║ │ ┌──────────────────────────────┐  │ ║
║ │ │ Promedio: 24/día             │  │ ║
║ │ └──────────────────────────────┘  │ ║
║ └────────────────────────────────────┘ ║
║                                        ║
║ 📈 Distribución                        ║
║ ┌────────────────────────────────────┐ ║
║ │ Nuevas:     ███░░░░░░░░░ 20/127  │ ║
║ │ Aprendiendo: ██████░░░░░░ 45/127 │ ║
║ │ Revisión:    ██████████░░ 55/127 │ ║
║ │ Suspendidas: █░░░░░░░░░░░ 7/127  │ ║
║ └────────────────────────────────────┘ ║
║                                        ║
║ 📅 Actividad (últimos 30 días)         ║
║ ┌────────────────────────────────────┐ ║
║ │  L  M  M  J  V  S  D           │ ║
║ │  █  █  █  █  █  ░  █           │ ║
║ │  █  █  ░  █  █  █  █           │ ║
║ │  █  █  █  █  █  ░  █           │ ║
║ │  █  █  █  █  ░  █  █           │ ║
║ │  ░  █  █  █  █  █  █           │ ║
║ │                                │ ║
║ │ Verde: Superaste meta (20/día) │ ║
║ │ Gris: Debajo de meta           │ ║
║ └────────────────────────────────┘ ║
║                                        ║
║ 💡 Factor de Facilidad                 ║
║ ┌────────────────────────────────────┐ ║
║ │ Promedio actual: 2.18              │ ║
║ │ ████████░░░░░░░░░░░░░░░░░░░░░░░░ │ ║
║ │ Rango óptimo: 1.3 - 2.5            │ ║
║ │ Estado: ✓ Excelente                │ ║
║ └────────────────────────────────────┘ ║
║                                        ║
║ ⏰ Carga de trabajo                     ║
║ ┌─────────────────────────────────┐   ║
║ │ Hoy:        15 tarjetas         │   ║
║ │ Próx 7 días: 43 tarjetas       │   ║
║ │ Después:     67 tarjetas       │   ║
║ └─────────────────────────────────┘   ║
║                                        ║
║ 🏅 Logros (3/10)                       ║
║ ┌────────────────────────────────────┐ ║
║ │ 🎯 🔥 ⭐ [7 bloqueados]           │ ║
║ └────────────────────────────────────┘ ║
║                                        ║
╚════════════════════════════════════════╝

Improvements:
✅ Todas las métricas visibles
✅ Gráficos simples pero informativos
✅ Indicadores de estado claros
✅ Información contextualizada
✅ Visualización de logros
```

---

## 🏆 4. PANTALLA ACHIEVEMENTS - NUEVA

### PROPUESTA:
```
╔════════════════════════════════════════╗
║ 🏆 Logros & Medallas                   ║
╠════════════════════════════════════════╣
║                                        ║
║ Progreso General: ███████░░░░░ 30%   ║
║ 3 de 10 logros desbloqueados           ║
║                                        ║
║ ════════════════════════════════════   ║
║ 🟢 LOGROS COMUNES (fáciles)            ║
║ ════════════════════════════════════   ║
║                                        ║
║ ┌──────────┬──────────┬──────────┐    ║
║ │   🎯    │   🔥    │   ⭐    │    ║
║ │ Primer   │ En racha │ Maestría│    ║
║ │ paso     │ 7 días   │ 100%    │    ║
║ │ ✓Hecho   │ ✓Hecho   │ ✓Hecho   │    ║
║ └──────────┴──────────┴──────────┘    ║
║                                        ║
║ ════════════════════════════════════   ║
║ 🟣 LOGROS POCO COMUNES                 ║
║ ════════════════════════════════════   ║
║                                        ║
║ ┌──────────┬──────────┬──────────┐    ║
║ │   🏆    │   ⚡    │   💯    │    ║
║ │ Super    │ Aprendiz │ Revisión │    ║
║ │ racha    │ rápido   │ perfecta │    ║
║ │ 30 días  │ 50 ✓     │ 10 seg.  │    ║
║ │ ×Bloqueado × (faltan 20) × (faltan 7) │    ║
║ └──────────┴──────────┴──────────┘    ║
║                                        ║
║ ════════════════════════════════════   ║
║ 🟡 LOGROS RAROS (desafiantes)          ║
║ ════════════════════════════════════   ║
║                                        ║
║ ┌──────────┬──────────┬──────────┐    ║
║ │   📚    │   📅    │   🎵    │    ║
║ │ Coleccio-│Consisten-│Maestro  │    ║
║ │ nista    │ cia      │ de tonos│    ║
║ │ 100 car. │ 20 días  │ 4 tonos │    ║
║ │ ×(73)    │ ×(15)    │ ×(3/4)   │    ║
║ └──────────┴──────────┴──────────┘    ║
║                                        ║
║ 💡 Tips para desbloquear:              ║
║ • Estudia consistentemente diariamente ║
║ • Responde correctamente para mejorar  ║
║ • Aprende nuevos caracteres            ║
║ • Mantén retención > 85%               ║
║                                        ║
╚════════════════════════════════════════╝

Improvements:
✅ Progreso visualizado con círculo
✅ Logros agrupados por dificultad
✅ Estados claros (✓ desbloqueado / × bloqueado)
✅ Progreso hacia logros (ej: 73/100)
✅ Tips contextuales
```

---

## 🎨 5. VARIANTES DE BOTONES

### PROPUESTA VISUAL:
```
┌────────────────────────────────────────────┐
│ PRIMARY (Acción principal)                 │
│ ┌──────────────────────────────────────┐   │
│ │  Empezar        ← Color rojo oscuro   │   │
│ │  hover: más rojo, sombra arriba       │   │
│ │  active: presionado, sin sombra       │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ SECONDARY (Acción secundaria)              │
│ ┌──────────────────────────────────────┐   │
│ │  Cancelar        ← Color púrpura      │   │
│ │  hover: más púrpura, efecto lift     │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ SUCCESS (Confirmar, completar)             │
│ ┌──────────────────────────────────────┐   │
│ │  ✓ Confirmar    ← Color verde        │   │
│ │  Checkmark visible y animado         │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ DANGER (Eliminar, riesgo)                  │
│ ┌──────────────────────────────────────┐   │
│ │  ✗ Eliminar     ← Rojo oscuro 900    │   │
│ │  Con warning icon, requiere confirm  │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ GHOST (Link-like, ligero)                  │
│ ┌──────────────────────────────────────┐   │
│ │  Ver más        ← Sin fondo          │   │
│ │  Hover: fondo gris sutil, subrayado  │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ OUTLINE (Alternativo, importante)          │
│ ┌──────────────────────────────────────┐   │
│ │ | Descargar |  ← Solo borde          │   │
│ │   Hover: relleno suave, borde visible│   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ LOADING (Estado intermedio)                │
│ ┌──────────────────────────────────────┐   │
│ │ ⊙ Guardando...   ← Spinner animado   │   │
│ │   Deshabilitado, opacity 75%         │   │
│ └──────────────────────────────────────┘   │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│ SIZES (sm, md, lg, xl)                     │
│ ┌──────┐  ┌────────┐  ┌─────────────┐    │
│ │ Sm   │  │ Md     │  │   Lg        │    │
│ └──────┘  └────────┘  └─────────────┘    │
│                                            │
│ ┌───────────────────┐                      │
│ │      Xl           │                      │
│ └───────────────────┘                      │
└────────────────────────────────────────────┘
```

---

## 6. VARIANTES DE CARDS

### PROPUESTA VISUAL:
```
DEFAULT
┌─────────────────────────────────┐
│ Contenido                       │
│ Gris 800, borde gris 700        │
└─────────────────────────────────┘

INTERACTIVE (con hover)
┌─────────────────────────────────┐
│ Contenido                       │ ← Cursor: pointer
│ Borde púrpura on hover, lift    │   Sombra: crece
└─────────────────────────────────┘

ELEVATED (prominencia máxima)
    ╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱
   ╱╱                      ╱╱
  ╱╱ ┌──────────────────┐ ╱╱
  ╱╱ │ Contenido        │ ╱╱
  ╱╱ │ Sombra grande    │ ╱╱
  ╱╱ └──────────────────┘ ╱╱
   ╱╱_____________________╱╱

SUCCESS (con tinta verde)
█─────────────────────────────────┐
│ ✓ Éxito                         │
│ Borde izquierdo verde, bg verde │
└─────────────────────────────────┘

WARNING (con tinta amarilla)
█─────────────────────────────────┐
│ ⚠️  Atención                    │
│ Borde izquierdo amarillo        │
│ Fondo amarillo/20               │
└─────────────────────────────────┘

DANGER (con tinta roja)
█─────────────────────────────────┐
│ ✗ Error                         │
│ Borde izquierdo rojo            │
│ Fondo rojo/20                   │
└─────────────────────────────────┘

INFO (con tinta azul)
█─────────────────────────────────┐
│ ℹ️  Información                 │
│ Borde izquierdo azul            │
│ Fondo azul/20                   │
└─────────────────────────────────┘

GHOST (muy sutil)
┌─────────────────────────────────┐
│ Contenido                       │
│ Borde muy claro, fondo mínimo   │
└─────────────────────────────────┘

BORDER: ACCENT (efecto especial)
┌─────────────────────────────────┐
│ Contenido                       │  ← On hover:
│ Borde izquierdo púrpura 4px     │    Se levanta
│                                 │    Sombra crece
└─────────────────────────────────┘    Brilla suave
```

---

## 7. INDICADORES DE TONO

### PROPUESTA VISUAL:

```
TONO 1 (Primer tono) - ROSA
┌─────────────────────┐
│ 1️⃣  TONO 1         │
│                     │
│ ā  á  ǎ  à         │
│ ma mā  má  mǎ  mà  │
│ Color: Rosa #FF6B9D│
│ Tipo: Tono plano   │
└─────────────────────┘

TONO 2 (Segundo tono) - AQUA
┌─────────────────────┐
│ 2️⃣  TONO 2         │
│                     │
│ ē  é  ě  è         │
│ ma mē  mé  mě  mè  │
│ Color: Aqua #4ECDC4│
│ Tipo: Tono ascend. │
└─────────────────────┘

TONO 3 (Tercer tono) - AMARILLO
┌─────────────────────┐
│ 3️⃣  TONO 3         │
│                     │
│ ī  í  ǐ  ì         │
│ ma mī  mí  mǐ  mì  │
│ Color: Amr. #FFE66D│
│ Tipo: Tono descend.│
└─────────────────────┘

TONO 4 (Cuarto tono) - MENTA
┌─────────────────────┐
│ 4️⃣  TONO 4         │
│                     │
│ ū  ú  ǔ  ù         │
│ ma mū  mú  mǔ  mù  │
│ Color: Mint #95E1D3│
│ Tipo: Tono caída   │
└─────────────────────┘

NEUTRO (Sin tono) - GRIS
┌─────────────────────┐
│ 0️⃣  NEUTRO         │
│                     │
│ ∅  (sin marca)     │
│ ma ma              │
│ Color: Gris #A0AEC0│
│ Tipo: Sin tono     │
└─────────────────────┘

EN CONTEXTO - PRONUNCIACIÓN:
┌──────────────────────────────┐
│ 新 = xīn (Nuevo)             │
│ Pinyin: x-ī-n                │
│ Tono: 1️⃣ Rosa - Plano      │
│                              │
│ [▶ Escuchar]                │
│                              │
│ Ejemplos:                    │
│ • 新年 xīnNián = Año Nuevo │
│ • 新闻 xīnWén = Noticia    │
└──────────────────────────────┘
```

---

## 8. ANIMACIONES PROPUESTAS

### ESTADO: VISUAL DESCRIPTION

```
SLIDE IN UP (entrada desde abajo)
0ms:    ─────────────────── (opacity: 0, y: +20px)
150ms:  ───────────────────
300ms:  ═══════════════════ (opacity: 1, y: 0)
Uso: Modales, notificaciones

SCALE IN (escala suave)
0ms:    ■ (opacity: 0, scale: 0.95)
100ms:  ●
200ms:  ● (opacity: 1, scale: 1.0)
Uso: Cards que aparecen

BOUNCE IN (rebote)
0ms:    ■ (scale: 1.0)
100ms:  ● (scale: 1.05)
200ms:  ◆ (scale: 0.99)
300ms:  ● (scale: 1.0)
Uso: Celebraciones, respuestas correctas

FADE IN (desvanecimiento)
0ms:    ░░░░░░░░░░ (opacity: 0)
150ms:  ▒▒▒▒▒▒▒▒▒▒
300ms:  ██████████ (opacity: 1)
Uso: Cambios sutiles

SHAKE (vibración - errores)
0ms:    |contenido|
50ms:   >contenido<
100ms:  <contenido>
150ms:  |contenido|
Uso: Respuestas incorrectas

FLIP (volteo - tarjetas SRS)
0ms:    [Frente    ]
180ms:  [Voltear...]
360ms:  [   Dorso ]
Uso: Tarjetas interactivas

GLOW (brillo - elementos activos)
0ms:    ◇ (glow: 0.3)
500ms:  ◇ (glow: 0.6)
1000ms: ◇ (glow: 0.3)
Ciclo: 2s infinito
Uso: Elementos destacados
```

---

## 9. COLORES EN CONTEXTO

### USO EN DIFERENTES PANTALLAS:

```
QUIZ/REVIEW SCREEN:
┌──────────────────────────────────┐
│ Estado: NEW (primer aprendizaje) │
│ Color: Gris (#9CA3AF)           │
│ Mensaje: "Aprendiendo..."       │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Estado: LEARNING (practicando)   │
│ Color: Amarillo (#EAB308)        │
│ Mensaje: "Sigue practicando"    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Estado: REVIEW (dominado)        │
│ Color: Verde (#22C55E)          │
│ Mensaje: "Bien hecho! ✓"        │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Estado: SUSPENDED (problema)     │
│ Color: Rojo (#EF4444)           │
│ Mensaje: "Necesita atención"    │
└──────────────────────────────────┘

HOME SCREEN - LESSON STATUS:
├─ Completada: Verde (#10B981)
├─ En progreso: Amarillo (#D97706)
├─ No comenzada: Gris (#6B7280)
└─ Bloqueada: Rojo (#7F1D1D)

TONE INDICATORS:
├─ Tono 1: Rosa (#FF6B9D)
├─ Tono 2: Aqua (#4ECDC4)
├─ Tono 3: Amarillo (#FFE66D)
└─ Tono 4: Menta (#95E1D3)

NOTIFICATIONS:
├─ Success: Verde (#10B981)
├─ Warning: Amarillo (#D97706)
├─ Error: Rojo (#EF4444)
└─ Info: Azul (#3B82F6)
```

---

## 📌 RESUMEN DE CAMBIOS VISUALES

```
ANTES                           DESPUÉS
────────────────────────────────────────────────
Monótono (2 colores)   →    Contextual (12 colores)
Cards iguales          →    8 variantes + efectos
Botones uniformes      →    7 variantes + estados
Tipografía plana       →    8 niveles jerárquicos
Sin espaciado claro    →    Escala 8px consistente
Animaciones abruptas   →    8 transiciones suaves
Sin feedback claro     →    Estados visuales claros
Menos accesible        →    WCAG AA compliant
```

---

**Estado:** Mockups visuales propuestos (SIN IMPLEMENTAR)  
**Próximo:** Implementación fase por fase  
**Prioridad:** Paleta colores → Variantes → Tipografía → Animaciones
