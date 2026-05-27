# 📖 Story Mode — Plan de Implementación
**App:** aprende-chino (React + Vite + Tailwind CSS)  
**Objetivo:** Añadir un modo de historias con personajes, diálogos por tema y ejercicios al final.

---

## 1. Concepto general

El usuario lee un diálogo entre personajes en estilo **novela visual** (personaje grande en pantalla, texto abajo). El vocabulario de cada historia está anclado al tema correspondiente del libro de texto que sigue la app. Al terminar la historia, se presentan 3 bloques de ejercicios de consolidación.

**Flujo de una historia:**
```
Mapa de historias
  → Pantalla de inicio de historia
  → Diálogo (escena por escena, avance manual con tap/click)
  → 3 bloques de ejercicios
  → Pantalla de resultados
```

---

## 2. Personajes

### Grupo fijo

| ID | Nombre | Pinyin | Perfil |
|----|--------|--------|--------|
| `user` | [Nombre del usuario] | — | Estudiante extranjero/a. Su nombre se toma del perfil del usuario y aparece dinámicamente en los diálogos. |
| `dong-ao` | 东奥 | Dōng Ào | Estudiante chino, amigo del usuario. Despistado y gracioso. Personaje principal. |
| `xiao-min` | 晓敏 | Xiǎo Mǐn | Estudiante china. Estudiosa y aplicada. Contrapunto de 东奥. |
| `ma-ke` | 马可 | Mǎ Kě | Estudiante italiano. Personaje secundario recurrente. |

### Personajes secundarios
Familiares u otros personajes que aparecen puntualmente en historias concretas (hermano/a de 东奥, profesor, etc.). Se definen historia por historia.

---

## 3. Historias por tema

Las historias se desbloquean en orden estricto: hay que completar la Historia 1 para acceder a la Historia 2, y así sucesivamente entre temas.

### Tema 1 — Saludos y presentaciones
*Vocabulario objetivo: 你好, 叫, 姓, 名字, 认识, 高兴, 也, 请问, 我, 你*

- **Historia 1 — Primer encuentro**  
  El usuario conoce a 东奥. Se presentan, dicen sus nombres y apellidos, saludos básicos.

- **Historia 2 — Una amiga estudiosa**  
  东奥 presenta al usuario a 晓敏. Nuevas presentaciones, el usuario practica presentarse ya con más soltura.

### Tema 2 — Nacionalidades y comida
*Vocabulario objetivo: 是, 哪, 国, 人, 朋友, 学习, 汉语, 喜欢, 吃, 好吃, 美国, 中国, 西班牙*

- **Historia 1 — ¿De dónde eres?**  
  El usuario conoce a 马可. Hablan de sus nacionalidades y de por qué estudian chino.

- **Historia 2 — En la cafetería**  
  东奥 y 晓敏 van a comer a la cafetería de la universidad. Hablan de comida, qué les gusta y qué no.

### Tema 3 — La familia
*Vocabulario objetivo: 家, 有, 几, 口, 照片, 工作, 医生, 哥哥, 姐姐, 妹妹, 女儿, 岁, 漂亮*

- **Historia 1 — Las fotos de 东奥**  
  东奥 enseña fotos de su familia en el móvil. El usuario le pregunta quiénes son y qué hacen.

- **Historia 2 — La familia de 晓敏**  
  晓敏 habla de su familia. Su madre es médico y su padre es profesor. Conversación sobre trabajos y edades.

### Tema 4 — Horarios y planes
*Vocabulario objetivo: 明天, 点, 上午, 下午, 晚上, 时间, 电影, 一起, 去, 行, 课, 现在*

- **Historia 1 — ¿Quedamos?**  
  El grupo intenta quedar para ver una película. Todos tienen horarios distintos y 东奥 se equivoca de hora (momento cómico).

- **Historia 2 — El horario de 马可**  
  马可 pregunta por el horario de clases. Hablan de qué asignaturas tienen y cuándo.

---

## 4. Ejercicios al final de cada historia

Aparecen **después de terminar el diálogo completo**, en 3 bloques secuenciales.

### Bloque 1 — Traducción
Aparece una frase del diálogo en chino. El usuario elige la traducción correcta entre 4 opciones en español.
- 5 preguntas por historia
- Las frases se sacan directamente del diálogo

### Bloque 2 — Completar la frase
Se muestra una frase del diálogo con una palabra en blanco. El usuario elige la palabra correcta entre 4 opciones en chino.
- 4 preguntas por historia
- La palabra en blanco siempre es vocabulario objetivo del tema

### Bloque 3 — Comprensión
Preguntas de elección múltiple sobre lo que ocurrió en la historia.
- 3 preguntas por historia
- Ejemplo: "¿De dónde es 马可?" → Italia / España / Francia / China

---

## 5. Configuración de dificultad (pinyin)

El usuario elige al entrar en Story Mode o desde ajustes. Se guarda en `localStorage`.

| Modo | Comportamiento |
|------|----------------|
| **Fácil** | Chino + pinyin siempre visibles |
| **Normal** | Chino visible, pinyin se revela al pulsar la frase |
| **Difícil** | Solo chino, sin pinyin |

La **traducción al español** siempre se revela al pulsar, en todos los modos.

---

## 6. Diseño visual

### Estilo general
**Novela visual estilo manga** — personaje grande ocupando la mitad superior de la pantalla, caja de texto en la mitad inferior. Diseñado para pantalla vertical (móvil primero, aunque ahora es web).

### Avatares de personajes
- SVG generado por código, estilo manga: ojos grandes, pelo con volumen, rasgos simples pero expresivos
- Cada personaje tiene al menos 2 expresiones: **normal** y **sorprendido/gracioso** (especialmente 东奥)
- Los avatares entran en pantalla con animación de deslizamiento desde un lado
- Animación sutil de "respiración" (movimiento suave arriba/abajo en bucle mientras el personaje está en pantalla)

### Animaciones (CSS puro)
- **Entrada del personaje:** slide-in desde izquierda o derecha según quién habla
- **Cambio de expresión:** transición suave al cambiar de frase
- **Texto:** aparece letra a letra (efecto typewriter)
- **Shake:** cuando 东奥 dice algo equivocado o gracioso
- **Transición entre escenas:** fade suave

### Paleta y tipografía
- Fondo oscuro con degradado suave (ambiente de novela visual)
- Caja de texto con fondo semitransparente y borde sutil
- Fuente para el chino: Noto Sans SC
- Fuente para el pinyin y español: algo limpio y legible, no genérico

---

## 7. Estructura de datos

```js
// src/data/stories/story-t1-h1.js
export const storyT1H1 = {
  id: "t1-h1",
  tema: 1,
  historia: 1,
  titulo: "Primer encuentro",
  personajes: ["user", "dong-ao"],
  vocabularioObjetivo: ["你好", "叫", "姓", "名字", "认识", "高兴"],

  escenas: [
    {
      id: "s1",
      personaje: "dong-ao",
      expresion: "normal",
      chino: "你好！",
      pinyin: "Nǐ hǎo!",
      traduccion: "¡Hola!"
    },
    {
      id: "s2",
      personaje: "user",
      expresion: "normal",
      chino: "你好！请问，你叫什么名字？",
      pinyin: "Nǐ hǎo! Qǐngwèn, nǐ jiào shénme míngzi?",
      traduccion: "¡Hola! Perdona, ¿cómo te llamas?"
    }
  ],

  ejercicios: {
    traduccion: [
      {
        frase: "很高兴认识你！",
        opciones: ["¡Encantado de conocerte!", "¡Hola, buenos días!", "¿Cómo te llamas?", "Estoy muy ocupado."],
        correcta: 0
      }
    ],
    completar: [
      {
        frase: "我 ___ 东奥。",
        pinyin: "Wǒ ___ Dōng Ào.",
        opciones: ["叫", "是", "姓", "认识"],
        correcta: 0
      }
    ],
    comprension: [
      {
        pregunta: "¿Cómo se llama el estudiante chino?",
        opciones: ["东奥", "晓敏", "马可"],
        correcta: 0
      }
    ]
  }
}
```

---

## 8. Estructura de archivos nuevos

```
src/
├── data/
│   ├── characters.js              ← definición de personajes y expresiones SVG
│   └── stories/
│       ├── index.js               ← exporta todas las historias y el orden
│       ├── story-t1-h1.js
│       ├── story-t1-h2.js
│       ├── story-t2-h1.js
│       ├── story-t2-h2.js
│       ├── story-t3-h1.js
│       ├── story-t3-h2.js
│       ├── story-t4-h1.js
│       └── story-t4-h2.js
│
├── components/
│   └── stories/
│       ├── StoryMap.jsx           ← mapa de historias con estado bloqueada/disponible/completada
│       ├── StoryPlayer.jsx        ← motor principal del diálogo
│       ├── CharacterDisplay.jsx   ← muestra el SVG del personaje con animaciones
│       ├── DialogueBox.jsx        ← caja de texto con typewriter y pinyin toggle
│       ├── ExerciseBlock.jsx      ← contenedor que encadena los 3 bloques
│       ├── ExTranslation.jsx      ← bloque traducción
│       ├── ExFillBlank.jsx        ← bloque completar frase
│       ├── ExComprehension.jsx    ← bloque comprensión
│       └── StoryResults.jsx       ← pantalla final con puntuación
│
└── pages/
    └── StoriesPage.jsx            ← ruta /stories
```

---

## 9. Progreso del usuario

Guardar en `localStorage` (consistente con el sistema actual de la app):

```js
storyProgress: {
  "t1-h1": { completada: true, puntuacion: 11, maxPuntuacion: 12 },
  "t1-h2": { completada: false, puntuacion: null, maxPuntuacion: 12 },
}
```

- **Bloqueada** si la historia anterior no está completada
- **Disponible** si la anterior está completada o es la primera del todo
- **Completada** si `completada: true`
- La integración con el sistema de XP y niveles existente se hará en una fase posterior

---

## 10. Fases de implementación

### Fase 1 — Motor visual (sin ejercicios)
- [ ] `characters.js` con los 4 personajes, sus SVGs manga y expresiones
- [ ] `story-t1-h1.js` con datos reales (solo escenas, sin ejercicios aún)
- [ ] `StoryPlayer.jsx` + `CharacterDisplay.jsx` + `DialogueBox.jsx`
- [ ] Animaciones: slide-in, respiración, typewriter, shake para 东奥
- [ ] Ajuste de dificultad pinyin (fácil/normal/difícil) guardado en localStorage
- [ ] `StoriesPage.jsx` con la historia T1-H1 de prueba

### Fase 2 — Ejercicios y progreso
- [ ] Los 3 componentes de ejercicio
- [ ] `ExerciseBlock.jsx` que los encadena en orden
- [ ] `StoryResults.jsx` con puntuación
- [ ] Sistema de desbloqueo en `localStorage`
- [ ] `StoryMap.jsx` con estado visual de cada historia

### Fase 3 — Contenido completo
- [ ] Las 7 historias restantes con sus ejercicios
- [ ] Integración con el sistema de XP existente
- [ ] Integración con el audio existente de la app en las frases del diálogo

---

## 11. Notas técnicas para Claude Code

- La app usa **React + Vite + Tailwind CSS**
- El progreso del usuario ya se guarda en `localStorage` — mantener consistencia con ese sistema
- Los avatares son **SVG generado por código**, no imágenes externas
- El nombre del usuario en los diálogos se toma del perfil existente de la app
- Empezar siempre por la **Fase 1** y pedir confirmación antes de pasar a la Fase 2
- La app está pensada para migrar a **React Native + Android** en el futuro — evitar dependencias incompatibles con ese entorno
