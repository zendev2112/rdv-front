

# **VOLGA BENEFICIOS — UI Implementation Prompt**

## **For GitHub Copilot / Claude in IDE**

---

## **Context & Goal**

**You are building the Volga Beneficios landing page for radiodelvolga.com.ar, a local news and radio website for Coronel Suárez, Buenos Aires, Argentina.**

**The layout structure, component hierarchy, and spacing system must exactly replicate the pattern established by Club La Nación (club.lanacion.com.ar), as documented in the section analyses below. Every component — its grid, spacing, typography scale, carousel behavior, card structure, and responsive transitions — must match those specifications precisely.**

**The only changes from the La Nación reference are:**

* **Color palette: Replace all La Nación blues (\#0000CC) and yellows with Radio del Volga colors**  
* **Brand copy: All text adapted to Volga Beneficios / Radio del Volga**  
* **No login/subscription gate: All content is public (no "Suscribite" button, no user auth UI)**  
* **No app promotion banner: Remove the "Usar la App Te Suma" section entirely**  
* **"Mundo Black" section → "Socios Destacados": A dark-background premium section for featured partner businesses (same visual treatment, different copy)**  
* **"Sorteos" section → "Sorteos Volga": Same ticket-card design, adapted for Radio del Volga giveaways**  
* **"Tu espacio Club LA NACION" → "Noticias de Suárez": Same editorial card grid, links to radiodelvolga.com.ar news articles**

---

## **Radio del Volga Color Palette (replace ALL La Nación blues/yellows with these)**

**:root {**  
  **/\* Primary brand — replaces La Nación Royal Blue (\#0000CC) \*/**  
  **\--rdv-primary:        \#8B0000;   /\* Dark red / burgundy \*/**  
  **\--rdv-primary-hover:  \#6B0000;   /\* Darker red for hover states \*/**  
  **\--rdv-primary-light:  \#C0392B;   /\* Lighter red for accents \*/**

  **/\* CTA button — replaces La Nación Lemon Yellow (\#FFFF00) \*/**  
  **\--rdv-cta:            \#E8C547;   /\* Warm gold/amber \*/**  
  **\--rdv-cta-text:       \#1A1A1A;   /\* Dark text on CTA button \*/**

  **/\* Premium section ("Socios Destacados") — replaces Mundo Black midnight blue \*/**  
  **\--rdv-premium-bg:     \#1A0000;   /\* Very dark burgundy-black \*/**  
  **\--rdv-premium-accent: \#8B0000;   /\* Dark red accent in premium section \*/**

  **/\* Dark sections (Sorteos, footer banner) \*/**  
  **\--rdv-dark-bg:        \#1C1C1C;   /\* Near-black for dark sections \*/**

  **/\* Progress bars & indicators — replaces Royal Blue active state \*/**  
  **\--rdv-indicator:      \#8B0000;**

  **/\* Neutrals (keep identical to La Nación reference) \*/**  
  **\--rdv-text-primary:   \#1A1A1A;**  
  **\--rdv-text-secondary: \#666666;**  
  **\--rdv-text-muted:     \#999999;**  
  **\--rdv-text-white:     \#FFFFFF;**  
  **\--rdv-bg-page:        \#F5F5F5;**  
  **\--rdv-bg-white:       \#FFFFFF;**  
  **\--rdv-bg-input:       \#F2F2F2;**  
  **\--rdv-border:         \#E0E0E0;**  
  **\--rdv-shadow:         rgba(0, 0, 0, 0.08);**  
**}**

---

## **Typography**

**Use Inter (Google Fonts) as the base sans-serif, paired with Playfair Display for the premium "Socios Destacados" section title only (replicating La Nación's serif/luxury treatment).**

**/\* Import \*/**  
**@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900\&family=Playfair+Display:wght@700;900\&display=swap');**

**/\* Base scale — identical to La Nación reference measurements \*/**  
**\--font-xs:    11px;   /\* Category labels, badge text \*/**  
**\--font-sm:    12px;   /\* Brand names (all-caps), utility links \*/**  
**\--font-base:  14px;   /\* Body text, search placeholder \*/**  
**\--font-md:    16px;   /\* Card descriptions \*/**  
**\--font-lg:    20px;   /\* Greeting text, section subtitle \*/**  
**\--font-xl:    22px;   /\* Discount values in cards \*/**  
**\--font-2xl:   26px;   /\* Section titles (desktop) \*/**  
**\--font-3xl:   32px;   /\* Campaign title ("Vuelta al Cole") \*/**  
**\--font-4xl:   48px;   /\* Premium section hero title ("BLACK" equivalent) \*/**

---

## **Shared Component Specification**

### **Benefit Card (the fundamental unit — used in ALL carousels)**

**Identical internal structure across all sections. Only background color varies.**

**Structure:**

**┌─────────────────────────────┐**  
**│                             │  ← Image area (16:9 or 4:3, full-bleed)**  
**│         IMAGE               │     border-radius: 12px 12px 0 0**  
**│                             │**  
**├─────────────────────────────┤**  
**│ NOMBRE COMERCIO    HASTA    │  ← Text row**  
**│ (bold, all-caps, 12px)      │**  
**│ Descripción breve      25%  │  ← Brand left-aligned, discount RIGHT-aligned**  
**│                             │     Discount: bold, 22px, var(--rdv-primary)**  
**└─────────────────────────────┘**

**Styles:**

* **Background: `#FFFFFF`**  
* **Border-radius: `12px`**  
* **Border: `1px solid var(--rdv-border)`**  
* **Box-shadow: `0 2px 8px var(--rdv-shadow)`**  
* **Brand name: `font-size: var(--font-sm); font-weight: 700; text-transform: uppercase; color: var(--rdv-text-primary)`**  
* **"HASTA" label: `font-size: var(--font-xs); color: var(--rdv-text-muted); text-transform: uppercase`**  
* **Discount value: `font-size: var(--font-xl); font-weight: 800; color: var(--rdv-primary)`**  
* **Discount and brand name: `display: flex; justify-content: space-between; align-items: flex-end`**

**Carousel chevron button (floating, right edge):**

* **`width: 40px; height: 40px; border-radius: 50%`**  
* **`background: #FFFFFF; box-shadow: 0 2px 12px rgba(0,0,0,0.15)`**  
* **`position: absolute; right: -20px; top: 50%; transform: translateY(-50%)`**  
* **Contains a `>` chevron icon, `color: var(--rdv-text-primary)`**

**Progress bar (below carousel):**

* **Height: `4px`, border-radius: `2px`**  
* **Active segment: `background: var(--rdv-primary)`**  
* **Inactive track: `background: var(--rdv-border)`**  
* **Width: `80px` total, centered below the card row**  
* **`margin: 20px auto 0`**

---

## **DESKTOP LAYOUT (min-width: 1200px)**

### **Max container width: 1280px, centered, with 40px horizontal padding**

---

### **COMPONENT 1 — Desktop Header (Main Navbar)**

**Height: 64px (main nav) \+ 48px (sub-nav) \= 112px total Background: `#FFFFFF` Bottom border of entire header: `1px solid var(--rdv-border)`**

**Main Navbar (64px):**

* **Layout: `display: flex; align-items: center; justify-content: space-between`**  
* **LEFT: Hamburger icon (24px, `var(--rdv-text-primary)`) \+ Logo SVG (`radiodelvolga.com.ar/images/logo.svg`, height 36px)**  
  * **Gap between hamburger and logo: `16px`**  
* **CENTER: Pill-shaped search bar**  
  * **`width: 480px; height: 40px; border-radius: 50px`**  
  * **`background: var(--rdv-bg-input); border: none`**  
  * **Left: magnifying glass icon (16px, `var(--rdv-text-muted)`)**  
  * **Placeholder: `"Buscá un beneficio..."` in `var(--rdv-text-muted)`**  
* **RIGHT (flex row, gap: 12px):**  
  * **"Cerca Mío" pill button: `border-radius: 50px; border: 1px solid var(--rdv-border); padding: 8px 16px` Location pin icon \+ "Cerca Mío" text, `font-size: var(--font-sm)`**  
  * **CTA button: `"Sumarse"` (replaces "Suscribite") `background: var(--rdv-cta); color: var(--rdv-cta-text)` `border-radius: 50px; padding: 8px 20px; font-weight: 700` `font-size: var(--font-sm); text-transform: uppercase; letter-spacing: 0.5px`**  
  * **Notification bell icon (24px)**  
  * **User avatar circle: `width: 32px; height: 32px; border-radius: 50%` `background: var(--rdv-bg-input); font-size: var(--font-sm); font-weight: 700` Initials: "RV" (Radio del Volga)**

**Sub-Navigation (48px):**

* **`border-top: 1px solid var(--rdv-border)`**  
* **`display: flex; align-items: center; gap: 0`**  
* **Links: `font-size: var(--font-sm); font-weight: 600; text-transform: uppercase` `color: var(--rdv-text-primary); padding: 0 20px; height: 48px` `letter-spacing: 0.5px; text-decoration: none`**  
* **Links: "INICIO", "CORONEL SUÁREZ", "PUEBLOS ALEMANES", "HUANGUELÉN", "LA SEXTA ▾", "AGRO", "DEPORTES"**  
* **"Newsletters" pushed to far right with envelope icon: `margin-left: auto; color: var(--rdv-primary)`**

---

### **COMPONENT 2 — Desktop Hero Banner \+ Category Grid**

**Hero section: full viewport width, height \~420px**

**Hero image:**

* **Full-width background image (use a placeholder: `object-fit: cover; width: 100%; height: 420px`)**  
* **Carousel with left/right arrow buttons:**  
  * **Arrows: `width: 44px; height: 44px; border-radius: 50%` `background: rgba(255,255,255,0.85); position: absolute; top: 50%; transform: translateY(-50%)` Left arrow at `left: 20px`, right at `right: 20px`**  
* **Pagination dots: `position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%)` Each dot: `width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.5)` Active dot: `background: #FFFFFF; width: 24px; border-radius: 4px`**

**Offer Pill (overlaid top-left of hero):**

* **`position: absolute; top: 40px; left: 40px` (within container)**  
* **`background: #FFFFFF; border-radius: 50px; padding: 16px 24px`**  
* **`display: flex; align-items: center; gap: 0`**  
* **4 internal columns separated by `1px solid var(--rdv-border)` vertical dividers:**  
  1. **Brand logo circle (`width: 48px; height: 48px; border-radius: 50%`)**  
  2. **Offer 1: large bold value (e.g. "2x1") \+ small label below ("EN GASTRONOMÍA")**  
  3. **Offer 2: large bold value (e.g. "35% OFF") \+ label ("EN MODA")**  
  4. **Offer 3: large bold value (e.g. "20% OFF") \+ label ("EN SALUD")**  
* **Each offer column: `padding: 0 20px`**  
* **Offer values: `font-size: var(--font-2xl); font-weight: 800; color: var(--rdv-text-primary)`**  
* **Labels: `font-size: var(--font-xs); text-transform: uppercase; color: var(--rdv-text-muted)`**

**Category Grid (overlapping bottom of hero):**

* **`position: relative; margin-top: -48px; z-index: 10`**  
* **9-column grid of equal cards within the 1280px container**  
* **Each category card:**  
  * **`background: #FFFFFF; border-radius: 16px`**  
  * **`box-shadow: 0 4px 16px rgba(0,0,0,0.12)`**  
  * **`padding: 16px 8px; display: flex; flex-direction: column; align-items: center; gap: 8px`**  
  * **Icon container: `width: 48px; height: 48px; border-radius: 12px` `background: var(--rdv-bg-input); display: flex; align-items: center; justify-content: center` Icon: emoji or SVG, `font-size: 24px`**  
  * **Label: `font-size: var(--font-xs); font-weight: 700; text-transform: uppercase` `color: var(--rdv-text-primary); text-align: center`**  
* **Categories: GASTRO, SALIDAS, SALUD, MODA, HOGAR, SUPERM., AGRO, ÓPTICA, OTROS**

**"¿Necesitás ayuda?" button below category grid:**

* **`border-radius: 50px; border: 1px solid var(--rdv-border)`**  
* **`padding: 10px 20px; display: inline-flex; align-items: center; gap: 8px`**  
* **`font-size: var(--font-sm); color: var(--rdv-text-primary); margin: 16px 0`**  
* **Left: `?` icon circle (`background: var(--rdv-primary); color: white; border-radius: 50%; width: 20px; height: 20px`)**  
* **Text: "Atención a Socios"**

---

### **COMPONENT 3 — Desktop "Beneficios Relevantes" Carousel**

**External spacing: `margin-top: 48px`**

**Header row:**

* **`display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px`**  
* **Title: `"Beneficios Relevantes"` — `font-size: var(--font-2xl); font-weight: 700; color: var(--rdv-text-primary)`**  
* **Link: `"MÁS BENEFICIOS >"` — `font-size: var(--font-sm); font-weight: 700; text-transform: uppercase; color: var(--rdv-primary)`**

**Card grid:**

* **`display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; position: relative`**  
* **4 benefit cards (standard white card component, see Shared Component Specification)**  
* **Floating chevron `>` button on right edge of grid (see Shared Component Specification)**

**Progress bar: centered below cards (see Shared Component Specification)**

---

### **COMPONENT 4 — Desktop "Beneficios Destacados" Carousel**

**External spacing: `margin-top: 64px`**

**Identical layout to "Beneficios Relevantes" with:**

* **Title: `"Beneficios Destacados"`**  
* **Link: `"MÁS BENEFICIOS >"`**  
* **Same 4-column card grid**  
* **Same floating chevron \+ progress bar**

---

### **COMPONENT 5 — Desktop Campaign Section ("Comercios de Temporada")**

***Adapts La Nación's "Vuelta al Cole" split-column layout***

**External spacing: `margin-top: 80px`**

**Layout: 2-column split — `display: grid; grid-template-columns: 1fr 2fr; gap: 10%`**

**Left column (text, 33% width):**

* **`display: flex; flex-direction: column; justify-content: center`**  
* **Eyebrow: `"DESCUBRÍ"` — `font-size: var(--font-xs); font-weight: 700; text-transform: uppercase; color: var(--rdv-text-muted); letter-spacing: 1.5px`**  
* **Title: `"¡Comercios de temporada!"` — `font-size: var(--font-3xl); font-weight: 800; color: var(--rdv-text-primary); line-height: 1.1`**  
* **CTA link: `"MÁS BENEFICIOS >"` — `font-size: var(--font-sm); font-weight: 700; text-transform: uppercase; color: var(--rdv-primary); margin-top: 16px`**

**Right column (2x2 card grid, 66% width):**

* **`display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px`**  
* **4 standard benefit cards (same card component as carousels)**

---

### **COMPONENT 6 — Desktop "Socios Destacados" (Premium Section)**

***Adapts La Nación's "Mundo Black" section***

**Full-width dark section:**

* **`background: var(--rdv-premium-bg); padding: 64px 0`**

**Header (centered):**

* **Eyebrow: `"PROGRAMA"` — `font-size: var(--font-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: rgba(255,255,255,0.5); text-align: center`**  
* **Title: `"SOCIOS DESTACADOS"` — `font-family: 'Playfair Display', serif; font-size: var(--font-4xl); font-weight: 900; color: #FFFFFF; text-align: center; letter-spacing: 2px`**  
* **Subtitle: `"Beneficios exclusivos para socios de Radio del Volga"` — `font-size: var(--font-md); color: rgba(255,255,255,0.7); text-align: center; margin-top: 8px`**

**"MÁS BENEFICIOS \>" link: right-aligned above card row, `color: #FFFFFF; font-size: var(--font-sm); font-weight: 700; text-transform: uppercase`**

**Card row: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 40px; position: relative`**

**Card styling in this section (dark variant):**

* **`background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px`**  
* **Brand name: `color: #FFFFFF`**  
* **Discount: `color: var(--rdv-primary-light)` (lighter red for visibility on dark bg)**  
* **"HASTA" label: `color: rgba(255,255,255,0.4)`**

**Progress bar (this section): `background: rgba(255,255,255,0.15)` for inactive track; `var(--rdv-primary)` for active**

---

### **COMPONENT 7 — Desktop "Sorteos Volga" (Giveaways Section)**

***Adapts La Nación's "Sorteos únicos" section***

**Full-width dark section, immediately follows Socios Destacados:**

* **`background: var(--rdv-dark-bg); padding: 64px 0`**

**Orange wavy SVG divider at the very top of this section (decorative, same as La Nación reference):**

**.wave-divider {**  
  **width: 100%;**  
  **height: 32px;**  
  **background: url("data:image/svg+xml,...") repeat-x;**  
  **/\* SVG: a repeating orange wave pattern \*/**  
  **/\* Use: fill: \#E67E22 (warm orange) \*/**  
  **margin-top: \-32px; /\* overlaps section above \*/**  
**}**

**Header row: `display: flex; justify-content: space-between; align-items: baseline`**

* **Title: `"¡Sorteos únicos, pensados solo para vos!"` — `font-size: var(--font-2xl); font-weight: 700; color: #FFFFFF`**  
* **Link: `"MÁS SORTEOS >"` — `color: #FFFFFF; font-size: var(--font-sm); font-weight: 700; text-transform: uppercase`**

**Card grid: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 32px`**

**Giveaway (sorteo) card — special "ticket" design:**

**┌────────────────────────┐**  
**│                        │  ← Image (full bleed, rounded top corners: 12px)**  
**│       IMAGE            │**  
**│                        │**  
**├╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌┤  ← Perforated/zig-zag divider**  
**│ \[ACTIVO\] \[GRUPO\]       │  ← Status badges**  
**│ TÍTULO DEL SORTEO      │  ← font-weight: 700; all-caps; font-size: var(--font-sm)**  
**│ Descripción del premio │  ← font-size: 13px; color: var(--rdv-text-secondary)**  
**└────────────────────────┘**

**Perforated divider (CSS):**

**.ticket-perforation {**  
  **height: 12px;**  
  **background: radial-gradient(circle at 50% 0%, var(--rdv-dark-bg) 6px, transparent 6px),**  
              **radial-gradient(circle at 50% 100%, var(--rdv-dark-bg) 6px, transparent 6px);**  
  **background-size: 16px 12px;**  
  **background-repeat: repeat-x;**  
**}**

**Status badge styles:**

* **ACTIVO: `background: #27AE60; color: #FFFFFF; border-radius: 4px; padding: 2px 8px; font-size: var(--font-xs); font-weight: 700; text-transform: uppercase`**  
* **GRUPO: `background: #555555; color: #FFFFFF` (same padding/radius)**  
* **PRÓXIMAMENTE: `background: #8B0000; color: #FFFFFF` (same, using rdv-primary)**

---

### **COMPONENT 8 — Desktop "Noticias de Suárez" (Editorial Section)**

***Adapts La Nación's "Tu espacio Club LA NACION" editorial section***

**External spacing: `margin-top: 80px`**

**Header row:**

* **Title: `"Noticias de Suárez"` — `font-size: var(--font-2xl); font-weight: 700; color: var(--rdv-text-primary)`**  
* **Link: `"MÁS NOTICIAS >"` — `color: var(--rdv-primary); font-size: var(--font-sm); font-weight: 700; text-transform: uppercase`**

**Card grid: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-top: 24px`**

**Editorial card (different from benefit card — no discount, headline-first):**

**┌────────────────────────┐**  
**│                        │**  
**│       IMAGE            │  ← 16:9 image, border-radius: 12px 12px 0 0**  
**│                        │**  
**├────────────────────────┤**  
**│ Categoría              │  ← font-size: var(--font-xs); color: var(--rdv-primary); text-transform: uppercase; font-weight: 700**  
**│                        │**  
**│ Titular de la noticia  │  ← font-size: var(--font-md); font-weight: 700; color: var(--rdv-text-primary); line-height: 1.4**  
**│ en dos o tres líneas   │**  
**└────────────────────────┘**

---

### **COMPONENT 9 — Desktop Footer**

**Background: `#FFFFFF` Top border: `1px solid var(--rdv-border)` Padding: `60px 0 40px`**

**Row 1 — 4-column link directory:**

**VOLGA BENEFICIOS  |  AYUDA           |  COMERCIOS       |  CONTACTO**  
**Inicio            |  Cómo funciona   |  Sumar negocio   |  2926-XXXXXX**  
**Categorías        |  Preguntas       |  Renovar oferta  |  Lun-Vie 8-18hs**  
**Beneficios        |  Reglamento      |  Estadísticas    |**

* **Column headings: `font-size: var(--font-sm); font-weight: 700; text-transform: uppercase; color: var(--rdv-text-primary); margin-bottom: 16px`**  
* **Links: `font-size: 13px; color: var(--rdv-text-secondary); line-height: 2`**  
* **Phone number (CONTACTO column): `font-size: var(--font-2xl); font-weight: 800; color: var(--rdv-primary)`**

**Horizontal divider: `1px solid var(--rdv-border); margin: 40px 0`**

**Row 2 — 2-column utility split (separated by vertical divider):**

* **Left: "SEGUINOS EN NUESTRAS REDES" heading \+ circular social icons (Facebook, Instagram, YouTube, TikTok)**  
  * **Icon circle: `width: 40px; height: 40px; border-radius: 50%; background: var(--rdv-bg-input); display: flex; align-items: center; justify-content: center`**  
* **Right: Radio del Volga logo \+ "© 2026 Radio del Volga. Todos los derechos reservados."**  
  * **`font-size: 12px; color: var(--rdv-text-muted)`**

---

## **TABLET LAYOUT (768px ≤ width \< 1200px)**

### **Key responsive changes from desktop:**

**Header simplification:**

* **Remove search bar from main navbar entirely**  
* **Remove "Cerca Mío" pill button and CTA "Sumarse" button from main navbar**  
* **Main navbar becomes: `[=] LOGO ... (Bell) (RV)`**  
  * **3-node flexbox: hamburger left, logo center-left, utility icons right**  
  * **Height: `60px–70px`**  
* **Sub-navigation collapses into hamburger menu (not visible in tablet main view)**  
* **Touch targets: all icons minimum `44x44px`**

**Hero section:**

* **Offer pill: changes from `position: absolute; top-left` to centered horizontally within the hero `left: 50%; transform: translateX(-50%)` — still absolute positioned**  
* **Category grid: transitions from static 9-column grid to horizontal scroller**  
  * **`display: flex; overflow-x: auto; gap: 12px; padding-bottom: 16px`**  
  * **`scrollbar-width: none` (hide scrollbar)**  
  * **Approximately 6.5 items visible at once**  
  * **Category cards: same styling, `min-width: calc((100vw - 32px) / 6.5)` each**

**All carousel sections ("Beneficios Relevantes", "Beneficios Destacados", "Comercios de Temporada"):**

* **Desktop 4-column static grid → horizontal scroller showing \~2.5 cards**

**Structure:**  
 **.carousel-track {  display: flex;  overflow-x: auto;  gap: 16px;  scroll-snap-type: x mandatory;  scrollbar-width: none;  padding-bottom: 16px;}.carousel-card {  min-width: calc((100vw \- 64px) / 2.5);  scroll-snap-align: start;  flex-shrink: 0;}**

*   
* **The partial 3rd card is the visual affordance for swiping (intentional overflow)**  
* **Progress bar remains, centered below**

**"Comercios de Temporada" campaign section:**

* **Desktop split-column (1/3 \+ 2/3) → stacked vertically**  
* **Text block (eyebrow \+ title \+ link) appears above the carousel**  
* **2x2 grid → single-row horizontal carousel (2.2 cards visible)**

**"Socios Destacados" (premium dark section):**

* **Desktop 4-column grid → horizontal carousel (2.2 cards visible)**  
* **Header remains centered**  
* **Progress bar uses `rgba(255,255,255,0.2)` inactive \+ `var(--rdv-primary)` active**

**"Sorteos Volga" section:**

* **Same responsive treatment: 4-column → horizontal carousel (2.2–2.5 visible)**  
* **Orange wavy divider remains**

**"Noticias de Suárez":**

* **4-column → horizontal carousel (2.2 visible)**  
* **Touch swipe replaces visible arrow button**

**App promo banner → REMOVE (not building this)**

**Footer:**

* **4-column → 2-column grid (stacked into 2 rows of 2\)**  
* **Row 2 (social \+ logo) → stacks vertically, each block full-width**

---

## **MOBILE LAYOUT (width \< 768px)**

### **Header (Mobile)**

**Height: \~110px (stacked 2-row structure) Background: `#FFFFFF`**

**Row 1 — Greeting \+ utility:**

* **`display: flex; justify-content: space-between; align-items: center; padding: 16px 16px 8px`**  
* **Left: `"¡Hola!"` greeting — `font-size: var(--font-lg); font-weight: 700; color: var(--rdv-text-primary)` (Or time-based: "¡Buenos días\!" / "¡Buenas tardes\!")**  
* **Right: Notification bell icon (24px, `var(--rdv-text-primary)`)**

**Row 2 — Search bar:**

* **`padding: 0 16px 12px`**  
* **Pill-shaped input: `width: 100%; height: 44px; border-radius: 50px` `background: var(--rdv-bg-input); border: none` Magnifying glass icon left, placeholder: `"Buscá un beneficio..."`**

---

### **Mobile Category Navigation Scroller**

**Position: Directly below header, above hero carousel External spacing: `padding: 20px 0 20px 16px` (left padding only — allows overflow right)**

**Structure: Single-row horizontal scroller**

* **`display: flex; overflow-x: auto; gap: 12px; scrollbar-width: none`**  
* **\~3.5 items visible to signal swipability (partial 4th item visible)**

**Each category item:**

* **`display: flex; flex-direction: column; align-items: center; gap: 8px; min-width: 72px`**  
* **Icon container: `width: 56px; height: 56px; border-radius: 12px` `background: #FFFFFF; box-shadow: 0 2px 8px var(--rdv-shadow)` `display: flex; align-items: center; justify-content: center` Icon: emoji or SVG, `font-size: 24px`**  
* **Label: `font-size: var(--font-xs); font-weight: 700; text-transform: uppercase; color: var(--rdv-text-primary); text-align: center`**

---

### **Mobile Hero Carousel**

**Position: Below category scroller, above discovery bar External spacing: `padding: 0 0 0 16px; margin-top: 24px` (left-padded only)**

**Structure: Horizontal scroller, \~1.2 cards visible**

* **`display: flex; overflow-x: auto; gap: 12px; scrollbar-width: none`**  
* **Each card: `min-width: 82vw; border-radius: 24px; overflow: hidden` (aggressive rounding — mobile-first)**  
* **Background: full-bleed image**  
* **Overlaid white "offer block" (bottom-left of card):**  
  * **`background: rgba(255,255,255,0.92); border-radius: 12px; padding: 10px 14px`**  
  * **`position: absolute; bottom: 16px; left: 16px`**  
  * **Brand logo/name: `font-size: var(--font-sm); font-weight: 700; color: var(--rdv-text-primary); text-transform: uppercase`**  
  * **Discount: `font-size: var(--font-xl); font-weight: 800; color: var(--rdv-primary)`**  
  * **Validity: `font-size: var(--font-xs); color: var(--rdv-text-muted)` (e.g., "Hasta el 30/06")**

**Discovery bar (below hero carousel):**

* **`margin: 16px; border-radius: 50px; border: 1px solid var(--rdv-border); padding: 12px 20px`**  
* **`display: flex; align-items: center; justify-content: space-between`**  
* **Left: `?` icon circle \+ text `"¿Qué beneficio buscás hoy?"` — `font-size: var(--font-base); color: var(--rdv-text-secondary)`**  
* **Right: `>` chevron — `color: var(--rdv-primary)`**

---

### **Mobile Benefit Carousels ("Beneficios Relevantes", "Beneficios Destacados")**

**Section wrapper: `padding: 32px 0 0 16px` (left padding only — right overflows)**

**Header row:**

* **`padding-right: 16px; display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px`**  
* **Title: `font-size: 20px; font-weight: 700; color: var(--rdv-text-primary)`**  
* **Link: `"MÁS BENEFICIOS >"` — `font-size: var(--font-sm); font-weight: 700; text-transform: uppercase; color: var(--rdv-primary)`**

**Card track: `display: flex; overflow-x: auto; gap: 12px; scrollbar-width: none`**

* **Each card: `min-width: 70vw; flex-shrink: 0`**  
* **\~1.5 cards visible (second card partially visible)**  
* **Standard white card component (no progress bar on mobile — removed per La Nación mobile spec)**

---

### **Mobile "Comercios de Temporada"**

* **Title block stacked above carousel: eyebrow \+ title \+ link, all left-aligned, `padding: 0 16px`**  
* **Carousel: identical to benefit carousels above (1.5 visible, left-padded)**

---

### **Mobile "Socios Destacados" (Premium Dark Section — "Mundo Black" equivalent)**

**Full-width dark block:**

* **`background: var(--rdv-premium-bg); padding: 40px 0`**

**Header (centered):**

* **Eyebrow: `"PROGRAMA"` white, `font-size: var(--font-xs); letter-spacing: 3px; text-align: center`**  
* **Title: `"SOCIOS DESTACADOS"` — `font-family: 'Playfair Display'; font-size: 32px; font-weight: 900; color: #FFFFFF; text-align: center`**  
* **Subtitle: white, `font-size: var(--font-base); text-align: center; margin-top: 8px; padding: 0 16px`**

**Utility link row:**

* **`display: flex; justify-content: space-between; padding: 0 16px; margin: 24px 0 0`**  
* **Title-like text left, `"MÁS BENEFICIOS >"` right — both white**

**Carousel: `padding-left: 16px; display: flex; overflow-x: auto; gap: 12px; scrollbar-width: none`**

* **\~1.2 cards visible (same partial peek pattern)**  
* **Dark card variant (semi-transparent on dark bg)**

**Utility pill button at bottom:**

* **`margin: 24px 16px 0; border-radius: 50px; background: rgba(255,255,255,0.1); padding: 14px 20px`**  
* **`display: flex; align-items: center; justify-content: space-between`**  
* **Left: Crown icon circle \+ "Ver todos los Socios Destacados"**  
* **Right: `>` chevron — all white text**

---

### **Mobile "Sorteos Volga"**

* **Same dark background (`var(--rdv-dark-bg)`)**  
* **Orange wavy divider at top**  
* **Header row: `padding: 0 16px; display: flex; justify-content: space-between` Title white, link white**  
* **Carousel: `padding-left: 16px; ~1.5 cards visible`**  
* **Ticket cards with perforated divider (same as desktop)**  
* **No progress bar (per mobile spec)**

---

### **Mobile "Noticias de Suárez"**

* **`padding: 32px 0 0 16px`**  
* **Header: title left, "MÁS NOTICIAS \>" right (with `padding-right: 16px`)**  
* **Carousel: `~1.5 cards visible, overflow-x: auto`**  
* **Editorial card (same structure as desktop — image \+ category label \+ headline)**

---

### **Mobile Footer**

**Simplified:**

* **`padding: 40px 16px`**  
* **Logo centered**  
* **2-column link grid (stacked):**  
  * **Col 1: Volga Beneficios \+ Ayuda links**  
  * **Col 2: Comercios \+ Contacto links**  
* **Full-width social icon row (centered): Facebook, Instagram, YouTube, TikTok**  
* **Copyright text: `text-align: center; font-size: 12px; color: var(--rdv-text-muted); margin-top: 24px`**

---

## **Implementation Notes for the Developer**

### **Framework**

**This is a Next.js App Router project using Tailwind CSS. However, for all pixel-precise spacing, border-radius, and custom values documented above, use inline styles or a `globals.css` with CSS variables rather than relying solely on Tailwind utility classes. Tailwind is acceptable for responsive breakpoints (`md:`, `lg:`).**

### **Carousel implementation**

**Use CSS scroll-snap (no JavaScript carousel library required) for all horizontal scrollers:**

**.carousel-track {**  
  **display: flex;**  
  **overflow-x: auto;**  
  **scroll-snap-type: x mandatory;**  
  **\-webkit-overflow-scrolling: touch;**  
  **scrollbar-width: none;**  
**}**  
**.carousel-track::-webkit-scrollbar { display: none; }**  
**.carousel-card {**  
  **scroll-snap-align: start;**  
  **flex-shrink: 0;**  
**}**

### **Data**

**All carousels are server components that fetch from Supabase using the `beneficios_activos` view. Pass data as props to client carousel components. The category filter updates URL search params (`?categoria=slug`) for SEO compatibility.**

### **Images**

**All business `logo_url` and benefit images come from Supabase Storage or Cloudinary. Use Next.js `<Image>` component with appropriate `sizes` prop for responsive loading. Placeholder: use a CSS gradient `background: linear-gradient(135deg, #f5f5f5, #e0e0e0)`.**

### **Accessibility**

* **All interactive carousel elements must have `aria-label`**  
* **Category icons need `alt` text or `aria-label`**  
* **Color contrast: ensure discount values (`var(--rdv-primary)` on white) meet WCAG AA (`#8B0000` on `#FFFFFF` \= 7.1:1 contrast ratio — passes AAA)**  
* **All card links must be accessible via keyboard tab**

### **Breakpoints**

**/\* Mobile first \*/**  
**/\* Tablet \*/  @media (min-width: 768px) { ... }**  
**/\* Desktop \*/ @media (min-width: 1200px) { ... }**

### **Component file structure (Next.js)**

**/app/beneficios/**  
  **page.tsx                          ← main landing page (server component)**  
  **\[slug\]/**  
    **page.tsx                        ← individual business page**

**/components/beneficios/**  
  **Header.tsx                        ← desktop/tablet/mobile header (responsive)**  
  **HeroBanner.tsx                    ← hero carousel \+ offer pill**  
  **CategoryScroller.tsx              ← horizontal category navigation**  
  **BeneficioCard.tsx                 ← shared card component**  
  **BeneficioCarousel.tsx             ← reusable carousel section wrapper**  
  **CampaignSection.tsx               ← "Comercios de Temporada" split layout**  
  **SociosDestacados.tsx              ← dark premium section**  
  **SorteosSection.tsx                ← giveaways dark section \+ ticket cards**  
  **NoticiasSection.tsx               ← editorial news cards**  
  **BeneficioForm.tsx                 ← client component for benefit request form**  
  **CategoriaFilter.tsx               ← client filter pills**  
  **Footer.tsx                        ← site footer**

**The one thing worth borrowing from their model is the category structure — they have `/beneficios/gastronomia`, `/beneficios/supermercados` etc. as separate indexable pages. You should do the same. Right now your category filter works via `?categoria=slug` URL params, which Google *can* index but treats as lower priority than clean path-based URLs.**

**Consider adding static category pages at `/beneficios/categoria/gastronomia`, `/beneficios/categoria/salud-farmacia`, etc. Each one is a fully rendered page listing all businesses in that category, with a unique title like *"Descuentos en Gastronomía en Coronel Suárez | Volga Beneficios"*. That's 20 additional indexable pages targeting specific local search intents, with almost zero competition.**

