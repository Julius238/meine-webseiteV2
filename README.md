# Meine Webseite — V2

Premium Business-Website von Julius Eggert. Stack: **Next.js 14 (App Router) · TypeScript · Tailwind CSS · GSAP/ScrollTrigger · Lenis**.

## Start

```bash
npm install
npm run dev
# http://localhost:3000
```

```bash
npm run build && npm run start
```

## Struktur

```
src/
├── app/                  # Next.js App Router (layout, page, globals)
├── components/
│   ├── Nav.tsx           # Floating Glas-Nav
│   ├── Footer.tsx
│   ├── SmoothScroll.tsx  # Lenis + GSAP-Sync
│   ├── SectionHeader.tsx
│   ├── sections/         # Eine Datei pro Hauptbereich
│   └── visuals/
│       ├── CinematicStage.tsx     # Full-Bleed Higgsfield-Bühne mit Parallax + Vignette
│       ├── ScrollScene.tsx        # Pinned Scroll-Sequenz (Services, Process)
│       └── SystemDemoScene.tsx    # Pinned System-Demo (Solutions — Bild-Cross-Fade)
└── lib/
    ├── gsap.ts           # GSAP-Registrierung + Helfer
    └── assets.ts         # ▶ HIER Higgsfield-Asset-URLs eintragen
```

## Animations-Prinzip

- **Lenis** trägt den ganzen Scroll, GSAP `ScrollTrigger` wird daran angekoppelt.
- Jede Sektion bekommt entweder eine **Pin-Sequenz** (Hero, Transformation, Services horizontal) oder **scrubbed Reveals** (Problem-Drift, Process-Timeline, Solutions-Sticky).
- Auf Mobile (`<768px`) werden Pin- und Scrub-Animationen ausgeschaltet — nur einfache Fades/Slides bleiben übrig.
- `prefers-reduced-motion` deaktiviert Lenis komplett und reduziert CSS-Animationen.

## SEO-Grundlagen

- `metadataBase`, `title`, `description`, `keywords`, OpenGraph, Twitter-Card in `src/app/layout.tsx`.
- `lang="de"` gesetzt.
- Vor Deploy: in `metadataBase` echte Domain eintragen und ein OG-Bild unter `public/og.png` ablegen.

## Higgsfield-Assets einbauen

Alle Asset-Slots liegen zentral in [`src/lib/assets.ts`](src/lib/assets.ts). Jeder Slot hat:

- `src` — Pfad/URL zum finalen Asset (solange leer → hochwertiger Code-Fallback)
- `prompt` — der exakte Prompt, den ich für Higgsfield empfehle
- `aspect` — Ziel-Seitenverhältnis
- (optional) `poster` für Video-Slots

**So fügst du ein generiertes Asset ein:**

1. Bild/Video in `public/assets/` ablegen oder Remote-URL bereitstellen.
2. In `src/lib/assets.ts` den passenden Slot öffnen und `src` setzen, z. B.
   ```ts
   heroBackdrop: {
     src: "/assets/hero-backdrop.webp",
     prompt: "...",
     aspect: "21:9",
   }
   ```
3. Bei Remote-URLs einmalig `images.remotePatterns` in `next.config.js` ergänzen.

Sobald `src` gesetzt ist, ersetzt der `<AssetSlot>` automatisch den Code-Fallback — keine Komponenten anfassen nötig.

### Empfohlene Higgsfield-Modelle pro Slot

| Slot                    | Empfehlung                   | Notiz                                |
|-------------------------|------------------------------|--------------------------------------|
| `heroBackdrop`          | `nano_banana_pro` (Bild)      | später optional `motion_control` für Loop-Video |
| `heroForeground`        | `nano_banana_pro`             | freigestellte UI-Panels über Backdrop |
| `problemChaos`          | `nano_banana_pro`             | „messy desk", editorial, dark        |
| `transformationNetwork` | `nano_banana_pro`             | sauberer Graph, Tiefe                |
| `serviceSoftware/Ai/Web/Cms` | `nano_banana_pro`        | 1:1 abstrakte Mini-Renders            |
| `solution*` (4 Stück)   | `marketing_studio_image`      | Photoreal UI-Mocks                   |
| `aboutArchitecture`     | `nano_banana_pro`             | iso 3D-Layer, keine Person           |
| `contactSystem`         | `nano_banana_pro`             | ruhig, fertiges System               |

### Integrierte Higgsfield-Assets (Iteration 4 — Cinematic Stage)

| Slot                    | Datei                                       | Modell                  |
|-------------------------|---------------------------------------------|-------------------------|
| `heroBackdrop`          | `public/assets/hero-backdrop.png`           | nano_banana_pro 16:9    |
| `problemChaos`          | `public/assets/problem-chaos.png`           | nano_banana_pro 3:2     |
| `transitionBridge`      | `public/assets/transition-bridge.png`       | nano_banana_pro 21:9    |
| `transformationNetwork` | `public/assets/transformation-network.png`  | nano_banana_pro 16:9    |
| `servicesScene`         | `public/assets/services-scene.png`          | nano_banana_pro 16:9    |
| `solutionDashboard`     | `public/assets/solution-dashboard.png`      | marketing_studio_image  |
| `solutionAutomation`    | `public/assets/solution-automation.png`     | marketing_studio_image  |
| `solutionCms`           | `public/assets/solution-cms.png`            | marketing_studio_image  |
| `solutionAssistant`     | `public/assets/solution-assistant.png`      | marketing_studio_image  |
| `aboutArchitecture`     | `public/assets/about-architecture.png`      | nano_banana_pro 4:5     |
| `contactSystem`         | `public/assets/contact-system.png`          | nano_banana_pro 21:9    |

Jede Hauptsektion wird jetzt von genau einem Higgsfield-Visual getragen. Code-Mocks (Glas-Karten, Dashboard-Pseudo-UIs, abstrakte Code-Layouts) wurden entfernt.

## Was hat sich in Iteration 2 geändert?

- **Portrait-Placeholder entfernt.** Stattdessen iso 3D-Layer-Stack als „System-Architekt"-Visual.
- **AmbientBackdrop** für jede Sektion: Gradients, Orbs, Grid, optionale Light-Beams → keine flachen schwarzen Flächen mehr.
- **Hero** mit 4 floatenden Glas-Panels (Code / Flow / KPI / Chart), Parallax-Tiefe.
- **Problem** ersetzt durch realistisches „überfordertes Workspace"-Mockup (Inbox, Spreadsheet mit `#REF!`, gelbe Sticky-Note mit handschrift, Chat, PDF-Angebot, Wochenkalender).
- **Transformation**: 3-Layer-Graph (Eingang/Kern/Ausgang) mit Bezier-Kanten und animierten Pulses; größere Bühne, zusätzlicher Orb-Hintergrund.
- **Services**: jede Karte hat ein eigenes Mini-Visual (Code-Window, Neural-Graph, Browser-Mock, CMS-Editor) + Farb-Tint pro Service.
- **Solutions**: viel realistischere Dashboard-Mockups inkl. Sidebar-Nav, KPI-Bändern, Live-Status, Sektoren.
- **Contact** schließt mit „system bereit · ihr projekt einsteckbar" + Akzent-Hairline-Detail am Formular.
- **AssetSlot** überall integriert — Tausch erfolgt zentral über `assets.ts`.

## Was noch fehlt (bewusst weggelassen)

- Echte Backend-Anbindung für das Kontaktformular.
- Impressum / Datenschutz-Routes.
- `sitemap.ts`, Analytics, Web-Vitals-Monitoring.
- Optionales `next/font` Setup (Inter / JetBrains Mono werden aktuell als CSS-Fallback geladen).
