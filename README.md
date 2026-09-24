# VoltMatrix Commerce // Multi-Concept PC Hardware Foundry

A next-generation computer hardware foundry, custom PC building platform, and omnichannel maker depot built with **Next.js 15**, **React 19**, **Three.js / React Three Fiber**, **Tailwind CSS**, and **Zustand**.

The platform features an architectural **6-Concept Dynamic Engine** that switches the entire application layout, theme, telemetry, and 3D scenes in real time between six distinct retail paradigms.

---

## ⚡ The 6 Design Concepts

| Concept | Name | Paradigm & Archetype | Primary Colors | Core Features |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **VoltMatrix** | High-Density Silicon & Parametric Grid | `#EF4444` / `#0F172A` | Technical brutalism, live branch stock, parametric filtering, interactive 3D component inspection. |
| **02** | **NeonForge** | Cyberpunk Liquid-Cooled Battlestation | `#00F0FF` / `#FF6B00` | Floating glassmorphism, animated coolant loops, mechanical keyboard soundboard, exploded waterblock. |
| **03** | **Axiom Pro** | Minimalist Enterprise Workstation & Studio | `#004F32` / `#2563EB` | High-density monochrome typography, turnkey AI/VFX/CAD nodes, ISV certifications, B2B procurement. |
| **04** | **SynapseCAD** | Blueprint 3D Assembly & Workbench | `#06B6D4` / `#84CC16` | Blueprint grid aesthetic, interactive 3D dimension bounding box, thermal clearance & pinout telemetry. |
| **05** | **OmniPulse BD** | Omnichannel Hyperlocal Retail Depot | `#0D47A1` / `#FFB300` | Interactive 3D Bangladesh depot map, 2-hour courier dispatch, EMI calculator, real-time branch stock. |
| **06** | **Krypton** | Industrial Maker Depot & Keyboard Lab | `#FACC15` / `#EA580C` | Raw tactile brutalism, mechanical switches & DIY PCB depot, dual PC & Custom Keyboard workbench. |

Switch between concepts instantly via the floating **ConceptSwitcher HUD** at the bottom-right of the screen.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **Language:** TypeScript 5.7+
- **UI & State:** React 19, [Zustand 5](https://zustand-demo.pmnd.rs/) (`useConceptStore`, `useBuilderStore`, `useCartStore`)
- **3D Graphics & WebGL:** [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei)
- **Styling:** [Tailwind CSS 3.4](https://tailwindcss.com/), PostCSS, CSS Variables
- **Icons & Typography:** [Lucide React](https://lucide.dev/), Material Symbols, Space Grotesk, JetBrains Mono, Inter, IBM Plex Mono
- **Export & Utilities:** `html2canvas`, `jspdf`, `clsx`, `tailwind-merge`

---

## 📁 Project Directory Structure

```
PC E-Commerce/
├── app/                            # Next.js App Router (Routes & Layouts)
│   ├── catalog/page.tsx            # Multi-concept hardware catalog
│   ├── checkout/page.tsx           # Multi-concept checkout & order summary
│   ├── pc-builder/page.tsx         # Multi-concept PC & keyboard configurator
│   ├── product/[slug]/page.tsx     # Dynamic PDP with 3D hardware viewports
│   ├── globals.css                 # Theme CSS variables & concept palettes
│   ├── layout.tsx                  # Root layout with Header, Footer & ConceptHUD
│   └── page.tsx                    # Multi-concept homepage router
│
├── components/                     # Component Library (Modular Architecture)
│   ├── axiom/                      # Concept 3: Enterprise Workstation Components
│   ├── canvas/                     # Three.js 3D Viewers & Parametric Scenes
│   ├── common/                     # ConceptSwitcherHUD & shared UI elements
│   ├── krypton/                    # Concept 6: Brutalist Maker & Keyboard Lab
│   ├── layout/                     # Universal Header & Footer
│   ├── neonforge/                  # Concept 2: Cyberpunk Liquid Cooling
│   ├── omnipulse/                  # Concept 5: Omnichannel Retail Hub & 3D Map
│   ├── synapse/                    # Concept 4: Blueprint CAD Architect
│   └── voltmatrix/                 # Concept 1: Silicon & Hardware Foundry
│
├── data/                           # Data Layer
│   ├── hardwareDatabase.ts         # Central hardware catalog & stock schema
│   └── mockProducts.ts             # Turnkey workstations & maker parts
│
├── docs/                           # Documentation & Specifications
│   ├── 3D_HARDWARE_INTEGRATION.md  # 3D WebGL pipeline & Draco compression guide
│   └── designs/                    # Detailed design system token specs
│       ├── DESIGN_VOLTMATRIX.md
│       ├── DESIGN_AXIOM.md
│       ├── DESIGN_KRYPTON.md
│       ├── DESIGN_NEONFORGE.md
│       ├── DESIGN_OMNIPULSE.md
│       └── DESIGN_SYNAPSECAD.md
│
├── public/                         # Static Web Assets
│   ├── brand/                      # Vector SVG brand identity logos
│   └── models/                     # Binary glTF (.glb) 3D hardware models
│
├── scripts/                        # Automation & Asset Utility Scripts
│   └── download_sketchfab_models.js # Sketchfab 3D asset fetcher
│
├── store/                          # Zustand State Management
│   ├── useBuilderStore.ts          # PC & keyboard configurator state
│   ├── useCartStore.ts             # Universal cart & branch delivery state
│   └── useConceptStore.ts          # Concept switching & theme state
│
└── types/                          # Global TypeScript declarations
    └── three-jsx.d.ts              # React 19 Three.js intrinsic elements
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.18+ or 20+
- npm 9+

### 2. Installation
Install project dependencies. An `.npmrc` is included with `legacy-peer-deps=true` to ensure seamless compatibility between React 19 and Three.js ecosystems:

```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

### 5. Lint & Type Check
```bash
npx tsc --noEmit
npm run lint
```

---

## 🧊 3D Hardware Model Pipeline

Binary glTF models (`.glb`) are stored under `public/models/` and loaded dynamically by `Hardware3DViewer.tsx`.
- For model specifications, Draco compression, and component generation, refer to [`docs/3D_HARDWARE_INTEGRATION.md`](docs/3D_HARDWARE_INTEGRATION.md).
- For individual design system guidelines and color tokens, refer to [`docs/designs/`](docs/designs/).
