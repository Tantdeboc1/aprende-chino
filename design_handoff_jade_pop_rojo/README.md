# Handoff · Aprende Chino · Jade Pop · Rojo

## Overview
Mobile-first HSK 1 Chinese learning app. The design philosophy: **Chinese cultural elements drive the visual system**, not Western app conventions. Red is celebration and mastery (the master's seal, the lucky envelope), not error. Jade is the protagonist color, used for identity and "in-progress" states. Sand is the warm neutral that replaces red for "try again" actions — explicitly avoiding the Western pattern of red = bad.

The product covers nine screens: Home/today, Lessons list, Lesson detail, Flashcard review, Tone practice, Stroke practice, Translation practice, Dictionary, and Profile.

## About the Design Files
The files in this bundle are **design references created in HTML/React** — interactive prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these HTML designs in the target codebase's existing environment** (React Native, SwiftUI, Flutter, Kotlin Compose, etc.) using its established patterns and libraries. If no codebase exists yet, choose the most appropriate framework for a polished mobile app — React Native or SwiftUI are both fine fits.

The HTML mocks use plain inline styles and React 18 with Babel for prototyping speed. Do not port that pattern — translate into the chosen framework's idiomatic component/styling system.

## Fidelity
**High-fidelity (hifi)**. Pixel-perfect mockups with final colors, typography, spacing, radii, and interactions. Recreate pixel-perfectly using the target codebase's component library and styling system. Exact hex values, font sizes, padding, and border radii are documented below — match them.

---

## Design Principles (NON-NEGOTIABLE)

These are the rules that define the visual identity. Breaking them breaks the design.

### 1. No emojis. Anywhere.
Not in headings, not in chip labels, not as decoration. No 🔥 for streaks, no 👋 for greetings, no 🌱 for level. If you feel the urge to add one, use a Chinese character (CJK glyph) as typography or a small geometric badge instead.

### 2. No pictographic icons.
No house icon for "home", no book icon for "lessons", no magnifying glass for search. Bottom-nav tabs use CJK characters as their visual anchor (首页, 课程, 字典, 个人). Search uses 找. Saved uses 收. Tone curves use minimal SVG line drawings — abstract shapes, not iconography.

The only acceptable "icon-like" elements are:
- CJK characters used as typography
- Minimal SVG line drawings for tone curves
- Geometric shapes (circles, squares, dots) for status indicators
- Text-only buttons with chevron arrows (`←`, `→`)

### 3. Color logic is cultural, not Western.
The most important rule. Read this carefully:

| Color | Semantic role |
|---|---|
| **JADE** (`#2f6b4a`) | Identity, "in progress", live progress, "Bien" (correct in flashcards), navigation accent for active tab CJK |
| **RED / Cinabrio** (`#c8392f`) | Master's seal, achievement, "Dominado" (mastered), streak, character-of-the-day ornaments, the `.` after a name in headings |
| **SAND** (`#b88a3e`) | Warm neutral, "Otra vez" (try again) — replaces the Western pattern of red-for-error |
| **BUTTER** (`#f0c862`) | Only used on top of jade or red surfaces. Streak number, character-of-the-day pinyin on hero, gold ornaments |
| **INK** (`#1c1813`) | Text, headings, active tab background, "Repaso" card |

Red is **never** used for errors, alerts, or destructive actions. If you need a destructive color, use ink/dark with a red accent, or use sand.

### 4. CJK as protagonist
Chinese characters are not decoration — they are typography. Use Noto Sans SC at large sizes (110–180px) as visual anchors. The character of the day is rendered at 120px in cream on a jade hero card with a small rotated red seal (聽) next to it.

### 5. Master's seal pattern
A small red square (~20–32px) with a single white CJK character inside, rotated slightly (-4° to -6°), with a subtle dark shadow. Used to "sign" important moments: the character of the day, the dictionary saved-items badge, the flashcard's progress number, the lesson detail's section markers.

```
Seal styling (exact):
- background: #c8392f
- color: #fbf5e6 (paperHi)
- font: Noto Serif SC, 600 weight
- size: 0.52 × container
- transform: rotate(-5deg) (varies -4 to -6)
- border-radius: 2px
- box-shadow: 0 1px 0 rgba(139,31,26,0.4)
```

---

## Design Tokens

### Colors

```
// Paper / surface
paper:    #f4ecdc   (page bg, warm cream)
paperHi:  #fbf5e6   (card bg, lighter cream)
paperHi2: #f8f1de   (translate build-area bg)

// Ink / text
ink:      #1c1813   (primary text, headings, dark surface)
inkSoft:  #5b5446   (secondary text)
mute:     #928a76   (tertiary, labels)
mute2:    #bdb39a   (disabled, divider strong)
hair:     rgba(28,24,19,0.10)  (1px border)
hairS:    rgba(28,24,19,0.18)  (stronger border)

// Jade (protagonist)
jade:     #2f6b4a   (primary actions, "in progress", protagonist accent)
jadeDeep: #1f4a33   (shadows under jade, jade-on-jade text)
jadeBg:   #cfe1d3   (tinted background)
jadeMid:  #5a8f72   (rarely used; tone selection ring)

// Red / Cinabrio
red:      #c8392f   (master seal, "Dominado", streak chip, achievement)
redDeep:  #8b1f1a   (red-on-red text, hero shadow)
redBg:    #f0d6cf   (tinted background)

// Sand (warm neutral)
sand:     #b88a3e   (accents)
sandDeep: #7a5722   (text on sandBg)
sandBg:   #e8d4a8   ("Otra vez" button bg, neutral cards)
sandBg2:  #f0e0bc   (translate build-area bg variant)

// Butter (gold)
butter:   #f0c862   (only on jade or red surfaces — pinyin, streak number, ornaments)
```

### Typography

```
Sans:      "Geist", system-ui, sans-serif
CJK Sans:  "Noto Sans SC", "PingFang SC", sans-serif   ← preferred for body & display
CJK Serif: "Noto Serif SC", "Songti SC", serif         ← used for seals, small CJK labels
Mono:      "Geist Mono", monospace                     ← rarely used; data labels
```

**No Geist on CJK.** Always use Noto Sans SC (or system equivalent) for Chinese characters. The Latin sans is Geist, not Inter — they have different metrics.

#### Type scale

| Use | Family | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Display heading (H1) | Geist | 28px | 700 | -0.025em |
| Lesson title in hero | Geist | 22px | 700 | -0.015em |
| Section heading | Geist | 16px | 700 | -0.01em |
| Body | Geist | 14px | 500 | 0 |
| Body small | Geist | 12.5px | 500 | 0 |
| Tiny label (UPPERCASE) | Geist | 11px | 700 | 0.14em |
| Pinyin on hero | Geist | 28px | 700 | -0.02em |
| Pinyin small | Geist | 17px | 800 | -0.01em |
| CJK character of day | Noto Sans SC | 120px | 700 | -0.02em |
| CJK on flashcard | Noto Sans SC | 180px | 700 | -0.04em |
| CJK in tiles | Noto Sans SC | 28–32px | 700 | 0 |
| Tab label | Geist | 10.5px | 700 | 0.2em |

### Spacing

Use a 4px base unit. Common values: 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28.

- Phone frame: 412 × 860 (design size)
- Page horizontal padding: 20px
- Card padding: 14–22px
- Gap between stacked cards: 8–10px
- Gap between sections (vertical rhythm): 22px before section header, 12px after
- Bottom nav: 10px 16px 18px

### Radii

```
Pill (chips, buttons):  99px
Card large (hero):      22px
Card medium:            18px
Card small:             14–16px
Inner buttons:          12px
Tiny tags:              4–10px
Seal:                   2px
```

### Shadows

```
Hero jade card:    0 8px 24px rgba(31,74,51,0.25)
Hero red card:     0 8px 24px rgba(200,57,47,0.30)
Hero red streak:   0 1px 0 rgba(139,31,26,0.4)         (subtle bottom edge)
Hero ink button:   0 4px 12px -4px rgba(28,24,19,0.4)
Hero red button:   0 4px 12px -4px rgba(200,57,47,0.5)
Soft card:         0 8px 24px rgba(28,24,19,0.06)
Seal:              0 1px 0 rgba(139,31,26,0.4)
Audio button:      0 4px 14px -4px rgba(28,24,19,0.5)
```

### Gradients

Used sparingly on progress bars to express "crossing into achievement":
```
Progress (jade → red):       linear-gradient(90deg, #2f6b4a, #c8392f)
Hero progress (butter → red):linear-gradient(90deg, #f0c862, #c8392f)
```
A progress bar that fills past 65% transitions into red — crossing the daily goal is celebration.

---

## Screens

### 01 · Home (`JRHome`)

**Purpose:** Daily dashboard. The user sees their greeting, today's character, four practice routes, the lesson in progress, and today's stats.

**Layout (top to bottom):**

1. **Top bar** (14px 20px 8px)
   - Left: `<JMark/>` — 32×32 jade square with butter "学" + "Aprende chino" wordmark
   - Right: `<JStreak n={4} label="días"/>` — red pill with butter "4" circle

2. **Greeting** (margin-top 8, bottom 18)
   - H1: "Buenas tardes,\nJesús." — "Jesús" in jade (#2f6b4a), "." in red (#c8392f)
   - Subtitle: "Hoy **12 min** y cierras el día." — "12 min" in jade bold

3. **Character of the day hero card**
   - Jade background (#2f6b4a), radius 22, padding "20px 20px 18px"
   - Two decorative circles: top-right (140×140 jadeDeep, opacity 0.5), middle-right (80×80 butter, opacity 0.18)
   - Top row: butter label "CARÁCTER DE HOY · 今日" left, white-70% "1 / 7" right
   - Main row: 听 at 120px (paperHi) with rotated red seal 聽 at bottom-right of character; pinyin column with `tīng` (butter 28px), description "escuchar, oír"
   - Footer row (top border 1px white-18%): "口 boca + 斤 hacha · 7 trazos" + butter pill "Aprender →"
   - Whole card is clickable → goes to flashcard

4. **Practice grid** (4 cards, 2×2, gap 10)
   - Tonos: redBg / redDeep / red accent (118 items) — leads to tones
   - Trazos: jadeBg / jadeDeep / jade accent (42) — leads to strokes
   - Traducir: sandBg / sandDeep / sand accent (9) — leads to translate
   - Repaso: ink background / paperHi text / butter CJK / red number (14) — leads to flashcard
   - All cards radius 18, padding 14, contain: top row [CJK 30px bold, pinyin 12px], bottom row [title 14px bold, count 13px bold accent]

5. **Continuar section**
   - Section header "Continuar · 繼續"
   - Card: jade-tinted label "EN CURSO · 進行中", title "Lección 01 · Saludos" (16/700), subtitle "¿Cómo has estado últimamente? · 14 de 24"
   - Progress bar 8px tall, jade→red gradient at 58%
   - Tap → lesson detail

6. **Hoy section**
   - Section header "Hoy · 今天"
   - 3 stat cards: "3 dominadas" (number in red), "12' estudio" (ink), "60% meta" (ink)

7. **Bottom nav** — see Components section

---

### 02 · Lessons list (`JRLessons`)

**Purpose:** Browse HSK 1 syllabus.

**Layout:**
- Top bar: JMark + JStreak
- H1: "Lecciones." (with red period)
- Subtitle: "HSK 1 · dos en curso, diez por delante." — "dos en curso" in jade bold
- Fundamentos pill-card: sandBg background, contains seal "基" (size 36, sand-colored), label "FUNDAMENTOS · 基础", title "Radicales, tonos y pinyin", "00 →" right
- Section "HSK 1 · 课程"
- Stack of lesson rows (8px gap):
  - Each row: 44×44 number square (jadeBg for unlocked, red for in-progress, hair for locked), title, meta row [tag · X caracteres · X% (jade) or "bloqueada"], 4px progress bar for in-progress rows (jade→red gradient)
  - Tap row → lesson detail (unless locked)
- Bottom helper text "Las bloqueadas se abrirán al completar las anteriores."

---

### 03 · Lesson Detail (`JRLessonDetail`)

**Purpose:** Drill into a specific lesson, see character roster.

**Layout:**
- Top bar: JBack ("← Lecciones") + JStreak
- Hero jade card (same vibe as character-of-day):
  - "HSK 1 · LECCIÓN" / "14 / 24"
  - Big "01" (butter, 44px, 800) + 课 (paperHi, 28px, CJK)
  - H1 "¿Cómo has estado\núltimamente?" (22/700)
  - Subtitle "Saludos y respuestas básicas con 很 / 不太."
  - Progress bar (butter→red gradient) at 58%
- Primary CTA: jade button "Continuar lección" (full width)
- Section "Caracteres · 字" with red chip showing "4 de 24"
- Grid 4×N of character tiles. Each tile shows the CJK char + pinyin. Three states:
  - **Done** (jadeBg): green check badge top-right
  - **Next** (redBg): "hoy" pill badge top-right (red text on paperHi)
  - **Pending** (paperHi): no badge
- Section "Gramática · 语法" with a single card showing a jade seal "语" + grammar concept

---

### 04 · Flashcard (`JRFlash`)

**Purpose:** Spaced-repetition review of a single character.

**Layout:**
- Top bar: JBack ("← Cerrar") · centered "Repaso · 3 / 12" · "Saltar" link
- Progress bar (jade→red gradient) at 25%
- Centered card (332×~520):
  - Top-left: jade chip "tono 1"
  - Top-right: red seal showing position number "3"
  - 听 at 180px, ink
  - Text-only audio button below ("▷  Escuchar" → "◉  Reproduciendo" when tapped, jadeBg active state)
  - When revealed: pinyin "tīng" (jade, 32/800), "ALTO PLANO" tiny label, meaning "escuchar, oír", divider, example "我喜欢**听**音乐" (the 听 in red) + Spanish translation
- Difficulty grid (3 buttons, gap 8):
  - "Otra vez · < 1 min" — sandBg / sandDeep
  - "Bien · 3 días" — jadeBg / jadeDeep
  - "Dominado · 1 sem." — **red bg / paperHi**, hero shadow

If not revealed: full-width ink button "Revelar respuesta" replaces the difficulty grid.

---

### 05 · Tones (`JRTones`)

**Purpose:** Listening-comprehension: hear a syllable, pick the tone.

**Layout:**
- Top bar: back + "Tonos · 4 / 12" + Saltar
- Progress bar at 33%
- Label "ESCUCHA Y ELIGE"
- H2 "¿Qué tono escuchas?"
- **Play card** (jade hero): 56px butter circle with `▶` triangle, "SUENA" label, big "ma·" syllable (changes to "mā/má/mǎ/mà" based on selection), helper "Tócame para volver a escuchar"
- Section "Cuatro opciones · 四声"
- 4 option rows, gap 8:
  - 44×44 white-tinted square with `<JToneCurve tone={1..4}/>` SVG inside
  - Pinyin "mā/má/mǎ/mà" + dash + tone name (e.g., "Alto plano")
  - Description italic
  - Right: CJK numeral (一/二/三/四) in current accent color
- States: idle (paperHi), correct (jadeBg + jade shadow + ✓ badge), wrong (redBg), hint (sandBg, shown on the correct option when user picks wrong)
- After selection: full-width CTA — jade "Bien hecho — siguiente" if correct, red "Vamos otra vez" if wrong

#### JToneCurve component
A 4-line SVG showing the tone shape:
```
1: M 4 12 L 36 12          (flat horizontal)
2: M 4 22 L 36 6           (rising)
3: M 4 10 Q 20 28 36 10    (dip-then-rise curve)
4: M 4 6 L 36 22           (falling)
```
Stroke-width 2.5, round caps.

---

### 06 · Strokes (`JRStrokes`)

**Purpose:** Practice character stroke order step-by-step.

**Layout:**
- Top bar: back + "Trazos · 听" + Reiniciar
- Header tiles (2 cards in 1fr 1fr):
  - "Carácter" jade card with 听 + pinyin
  - "Trazo" card with "3 / 7" (3 in big red, 7 in mute)
- Practice surface: aspect-ratio 1:1, paperHi card padding 12, contains an SVG:
  - 70px grid pattern
  - Center crosshair (dashed)
  - Faded full character behind (opacity 0.10)
  - Drawn strokes in ink (full opacity for current, 0.7 for previous)
  - Next stroke shown as dashed red preview
- Sequence dots row: completed = 22×8 jade (last one red), pending = 8×8 hair
- Controls: "← Atrás" ghost button + jade/red "Siguiente trazo →" (turns red on last stroke = "Carácter completado")
- Helper text: "Arriba a abajo, izquierda a derecha. Orden tradicional · 笔顺."

---

### 07 · Translate (`JRTranslate`)

**Purpose:** Build a Chinese sentence from a word bank.

**Layout:**
- Top bar: back + "Traducir · 2 / 9" + Pista
- Progress at 22%
- Label "TRADUCE AL CHINO"
- Source phrase card: paperHi with quoted Spanish "Me gusta escuchar música."
- Build area: sandBg2 with dashed border, min-height 96. Built words appear as ink chips with butter pinyin under. Tap removes.
- Pinyin readout (jade, bold, centered)
- Section "Palabras · 词"
- Word pool: tappable chips in paperHi with mute pinyin
- Bottom: jade button "Comprobar" (turns red "Dominado · +1" when correct sequence is built)

---

### 08 · Dictionary (`JRDict`)

**Purpose:** Search and review saved characters.

**Layout:**
- Top bar: JMark + JStreak
- H1 "Diccionario." (red period)
- Search input mock: paperHi card with 找 (jade CJK at 22px) + placeholder "Buscar carácter, pinyin o significado…"
- Filters row (horizontal scroll): chips with ink active state — "Todos", "HSK 1", "HSK 2", "Radicales", "Guardados"
- Section "Recientes · 最近"
- Recent rows: 56×56 jadeBg square with CJK char, jade pinyin + sand tone-chip, meaning, "→" arrow right
- Section "Guardados · 收藏" + red chip with count
- Saved rows: large CJK char (78px column), pinyin (jade), meaning, rotated red seal "收" at right

---

### 09 · Profile (`JRProfile`)

**Purpose:** User identity, streak, progress, settings.

**Layout:**
- Top bar: JMark + text-only "Ajustes" link
- H1 "Jesús." (red period)
- Subtitle "Aprendiendo chino desde hace **18 días**." (jade)
- **Hero red streak card** (only place where red is the dominant surface):
  - red bg, paperHi text, shadow `rgba(200,57,47,0.30)`
  - butter "RACHA ACTUAL · 连续" label
  - Big "4" in butter (64px/800) + "días" small
  - Right side: white-70% "RÉCORD" label + "12" paperHi
  - 30-day grid (15 cols × 2 rows): butter (active), butter-45% (mid), white-12% (off)
  - Helper "Últimos 30 días"
- Section "Progreso · 进步" — rows card (no padding, items have internal hair dividers):
  - Caracteres aprendidos · 127 · tag "HSK 1"
  - Estudio acumulado · 3h 42m · tag "ritmo medio"
  - Precisión media · 89% (jade accent) · tag "bien"
  - Caracteres dominados · 42 (red accent) · tag "récord"
- Section "Ajustes · 设置" — settings rows:
  - Recordatorio diario · 20:00
  - Mostrar pinyin · Siempre
  - Caracteres · Simplificados
  - Sonido · Activado
  - Tema · Jade · Cinabrio

---

## Shared Components

### `<JMark/>` — App identity
- 32×32 rounded-10 jade square with butter 学 inside
- "Aprende chino" wordmark next to it (15/600/-0.01em)

### `<JStreak n label/>` — Streak chip
- Red rounded-99 pill, padding 5px 12px 5px 5px, color paperHi
- Inside: 22×22 butter circle with red-deep number (12/800)
- Label "días" or "días seguidos" (12/700)
- Box-shadow `0 1px 0 rgba(139,31,26,0.4)`

### `<JSeal char size rotate bg/>` — Master's seal
- Square with CJK character. Default bg red, can be jade or sand
- Default size 24px, rotation -5deg
- `font-family: Noto Serif SC, 600` (700 for seal characters, 600 for seal numbers)
- Used to "sign" things — characters of the day, saved chips, lesson detail header tiles

### `<JChip bg fg/>` — Inline chip
- rounded-99, padding 5px 11px, font 11.5/600
- Common variants: jadeBg/jadeDeep, redBg/redDeep, sandBg/sandDeep

### `<JLabel/>` — Tiny uppercase label
- 11px / 700 / 0.14em letter-spacing / uppercase / mute by default

### `<JCard padding style onClick/>` — Soft card
- paperHi background, 1px hair border, radius 18, padding 16px 18px default

### `<JBtn kind="primary|jade|red|ghost|butter"/>` — Pill button
- rounded-99, padding 14px 22px, 15/700
- Variants:
  - primary: ink bg, paperHi text, ink shadow
  - jade: jade bg, paperHi text, jade shadow
  - red: red bg, paperHi text, red shadow
  - ghost: paperHi bg, ink text, hair border
  - butter: butter bg, jadeDeep text, no shadow

### `<JBack onClick label/>` — Back link
- paperHi pill, 6px 12px, 13/600 inkSoft, "← Cerrar"

### `<JNav active onNav/>` — Bottom navigation
- Grid 4 cols, gap 6, padding "10px 16px 18px"
- Top border `1px hair`
- Each tab: rounded-18, 10px 6px padding
  - Active: ink bg, paperHi text, RED CJK character (`#c8392f`)
  - Inactive: transparent bg, inkSoft text, ink CJK
- Tabs: { id: 'home', cn: '首页', label: 'Hoy' }, { id: 'learn', cn: '课程', label: 'Lecciones' }, { id: 'dict', cn: '字典', label: 'Dicc.' }, { id: 'profile', cn: '个人', label: 'Tú' }

### `<JStat n l color/>` — Stat tile
- paperHi card, radius 14, padding 12
- Number: 22/800/-0.02em (defaults ink, can be passed color e.g. red for "dominadas")
- Label: 11/600 mute / 0.04em letter-spacing

### `<JSection label cn right/>` — Section heading
- Margin-top 22, margin-bottom 12
- Label: 16/700 ink
- CJK: serif 14 mute
- Optional right slot for chip or count

---

## Interactions & Behavior

### Navigation
- The prototype demonstrates the full nav graph. The `go(screen)` prop is passed down so any tappable surface can route.
- Bottom nav routes to: `home`, `learn`, `dict`, `profile`.
- Home → tap "Continuar" card → `lesson` (detail).
- Home → tap practice tile → `tones` | `strokes` | `translate` | `flashcard` (for Repaso).
- Lesson detail → "Continuar lección" → `flashcard`.
- Lesson detail → tap a character tile → `flashcard` (with that character pre-loaded; not implemented in mock).
- Flashcard/Tones/Strokes/Translate top-left → `home` (or wherever the user came from).

### State (per screen, minimal)
- **Flashcard:** `revealed: boolean` (toggle answer), `played: boolean` (audio button visual state).
- **Tones:** `selected: 1|2|3|4|null`. Compare with `correct = 1`. Show feedback CTA at bottom.
- **Strokes:** `stroke: number` (0..total). Next/Prev buttons mutate this.
- **Translate:** `picked: string[]` (selected words from pool). Tap pool item to add, tap built item to remove.
- **Dictionary:** `filter: string` (active filter chip).

### Animations
- `fadeIn` keyframe on flashcard answer reveal: `opacity 0 + translateY(4px) → opacity 1 + translateY(0)`, 0.3s ease.
- Progress dots in strokes: width transitions 8 → 22, 0.25s linear.
- Tone option colors: 0.3s color transition.
- No bouncy or playful animations. Movement is calm.

### Accessibility
- All tappable surfaces must have hit areas of at least 44×44.
- Color is never the only signal. Mastery is also marked with the explicit text "Dominado". Correct tones get a checkmark in addition to the green color. Locked lessons say "bloqueada".
- Text contrast: paperHi text on jade (#2f6b4a) is AAA. paperHi text on red (#c8392f) is AA-large only — confirm in your codebase; if borderline, darken red one notch.

### Haptics (recommended)
- Light tap: navigation, tile selection
- Success tap: revealing flashcard answer, correct tone
- Heavy tap: "Dominado" (mastered) action — celebration

---

## Files in this Handoff

Each `jr-*.jsx` is one screen group. They are reference implementations, not production code.

| File | Contains |
|---|---|
| `Jade Pop Rojo - App.html` | Top-level harness. Loads React, Babel, and all jr-*.jsx files. Renders the design canvas + interactive prototype. |
| `jr-shell.jsx` | Design tokens (`J` constant), `JFrame`, `JMark`, `JStreak`, `JSeal`, `JChip`, `JLabel`, `JTopBar`, `JBack`, `JNav`, `JScroll`, `JBtn`, `JStat`, `JCard`, `JSection`, `JToneCurve` |
| `jr-home.jsx` | `JRHome`, `JRPracticeCard` |
| `jr-lessons.jsx` | `JRLessons`, `JRLessonDetail`, `JRLessonRow`, `JRCharTile` |
| `jr-flash.jsx` | `JRFlash`, `JRDiff` |
| `jr-practice.jsx` | `JRTones`, `JRStrokes`, `JRTranslate` |
| `jr-dict-profile.jsx` | `JRDict`, `JRProfile`, `JRProfileRow` |
| `design-canvas.jsx` | Vendor — design canvas wrapper used only by the prototype harness. Do NOT port. |

## How to use

1. Open `Jade Pop Rojo - App.html` in a browser to see the live prototype. Click around. Read measurements with browser DevTools if needed.
2. Read this README. Internalize the **5 Design Principles** before writing any code.
3. Map screens to your codebase's routing system.
4. Define the color/type tokens in your design system first. Build the shared components (`JBtn`, `JCard`, `JChip`, `JSeal`, `JStreak`, `JNav`, `JLabel`, `JSection`) before any screen.
5. Build screens in this order: Home → Flashcard → Lessons list → Lesson detail → Profile → Tones → Strokes → Translate → Dictionary. Home and Flashcard are the most-touched, the rest reuse their patterns.
6. Audit emoji/icon usage at the end. If you see a single 🔥 or ▶ icon font glyph, you've violated principle #1 or #2 — fix it.

## Things NOT in scope of these mocks
The following are real-product concerns the mocks do not address. Decide them with the user:
- Onboarding / first-run flow
- Authentication
- Notifications design
- Empty / error / offline states
- Audio playback engine for pinyin and tones
- Stroke-input recognition (the mock shows a viewer, not a writer)
- Spaced-repetition algorithm (the mock shows the UI, not the scheduling)
- Settings detail screens (the rows are clickable but lead nowhere in the mock)
- Dark mode (not designed — the warm cream paper is intentional)

If the user asks for any of the above, send them back to the design tool to mock them before implementing.
