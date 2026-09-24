# Krypton Brutalist Design System Specification

Ingested from Google Stitch Project: `projects/8977331046542605234`
Concept: **Concept 6 — Krypton Brutalist (Industrial Hardware Depot & Custom Keyboard Lab)**

---

## 1. Brand & Aesthetic Movement

This design system channels an uncompromising neo-brutalist engineering aesthetic. It draws direct inspiration from DIN-standard machine tags, modular component drawers, printed circuit board schematics, and mechanical workshop calibration rigs. The atmosphere is utilitarian, dense, and tactile—treating the digital surface not as ephemeral canvas, but as heavy gauge aluminum, industrial acrylic, and milled tooling plates.

The audience consists of keyboard designers, hardware engineers, audio engineers, and tech purists who respect physical mechanics, clear functional delineation, and zero decorative fluff. 

### Core Tenets
- **Zero-Friction Utility**: Dense packing of parameters, visible data layers, and unambiguous division lines.
- **Physical Weight**: Monochromatic structural framing using unyielding 2px and 3px pure black strokes (`#000000`).
- **Mechanical Tactility**: Hard drop shadows (`4px 4px 0px #000000`), strict square profiles (`rounded: 0px`), and deliberate physical switch travel micro-interactions that compress flush upon actuation (`transform: translate(4px, 4px)` with shadow collapsing to `0px`).

---

## 2. Color Palette & Roles

| Role | Color Name | Hex Token | Usage |
|---|---|---|---|
| **Base Canvas** | Concrete Canvas | `#EBEAE5` | Raw poured concrete tone replacing pure sterile white canvas |
| **Surface Layer 1** | Polar White | `#FFFFFF` | Inside cards, tool bays, and active modular inputs |
| **Basalt Panels** | Heavy Basalt | `#1E1E24` | Structural trays, sidebar tool racks, terminal inspectors, and schematic footer frames |
| **Structural Border** | Ink Black | `#000000` | Unyielding 2px and 3px grid partitions, outlines, and offset shadow projections |
| **Primary Accent** | Safety Yellow | `#FACC15` | Primary buttons, active layer toggles, hero highlights, status tags |
| **Hazard Accent** | Hazard Orange | `#EA580C` | Alerts, destructive actions, voltage mismatches, hot-swap warnings |
| **Telemetry / Circuit** | Circuit Lime | `#84CC16` | Active bus circuits, live test signals, firmware flash success, switch continuity |
| **Trace / Copper** | PCB Copper | `#B45309` | Pinout mappings, trace routes, switch leaf spring details |
| **Assisted Sales** | Tactile Green | `#25D366` | Direct WhatsApp engineering support, live inventory hotlines, verification passes |

---

## 3. Typography Hierarchy

- **Display & Headlines**: `Syne` (800 Extra-Bold) / `Druk Wide`. Uppercase, tight tracking (`-0.02em` to `-0.03em`).
- **Body Copy**: `DM Sans` (400 / 500 / 700). Neutral grotesque for fatigue-free reading of pinout guides and technical spec sheets.
- **Telemetry & Data**: `Space Mono` (400 / 700). Used for pricing, pinout specifications, key travel tolerances, actuation forces (e.g., `45cN ± 5`), and raw schematic references.

```css
/* Stamped aluminum machine tag label */
.label-caps {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
```

---

## 4. Elevation, Shadow & Geometry

- **Resting Elevation**: `box-shadow: 4px 4px 0px #000000;`
- **Prominent / Modal Elevation**: `box-shadow: 6px 6px 0px #000000;`
- **Mechanical Active State (Pressed)**:
  `transform: translate(4px, 4px);`
  `box-shadow: 0px 0px 0px #000000;`
- **Boundaries**: `2px solid #000000` (Standard), `3px solid #000000` (Heavy bays & display frames).
- **Corner Radii**: **Strictly 0px** (`rounded-none`). No rounded corners anywhere in the Krypton layout.

---

## 5. Screen Manifest (Stitch Screen Equivalents)

1. **Screen 1 (`00dd0ae49c234cd58748893837790ef9`)**: Krypton Brutalist Homepage & Master Industrial Depot
2. **Screen 2 (`3dd1a338af474df8affd17c6ea4c639e`)**: Component Bins & Engineering Parts Directory (PLP)
3. **Screen 3 (`a7d65a288f5b40f8b2a565663a7f4ddd`)**: Interactive 3D Tactile PDP & PCB Pinout Explorer
4. **Screen 4 (`3a4d4326c4f94324955cad98774fe5ff`)**: Dual PC & Custom Keyboard Assembly Workbench
5. **Screen 5 (`45c47b7be1a44b01b2c50f9d88c0912e`)**: Brutalist Parts Depot Staging & Multi-Payment Checkout Tunnel
