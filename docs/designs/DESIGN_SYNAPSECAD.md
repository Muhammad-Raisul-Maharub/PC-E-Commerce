# SynapseCAD Design System DNA
Source: Google Stitch Project ID `9780623817506361156`

## Brand & Philosophy
SynapseCAD embodies the clinical rigor of aerospace blueprints, electronic schematic layouts, and high-performance workstation CAD environments. Designed for hardware engineers, systems architects, and industrial designers, the interface prioritizes hyper-dense data display, pixel-accurate visual feedback, and technical certainty over decorative softness.

The design movement combines **technical brutalism** with **high-density instrumentation**:
- Visual motifs reference drafting paper, orthogonal vector grids, coordinate axes, and dimensional measurement annotations.
- Interactions are fast, snappy, and predictable, evoking mechanical microswitches and calibrated test equipment.
- Visual noise is kept to a minimum; every border, tick mark, and coordinate serves an operational purpose.

---

## Palette Tokens

| Token Name | Hex Code | Role |
| :--- | :--- | :--- |
| **Blueprint Dark Slate** | `#0F172A` | Viewport Base, canvas layer, background wells |
| **Card Slate** | `#1E293B` | Docked structural panels, technical cards, elevated pallets |
| **Slate Edges / Borders** | `#334155` | Razor-sharp 1px continuous planar boundaries |
| **Terminal Blueprint Cyan** | `#06B6D4` | Primary execution buttons, active trace routings, dimension leaders |
| **Signal Neon Lime** | `#84CC16` | Pass states, geometric clearance confirmations, power bus validations |
| **Caution Amber** | `#F59E0B` | Thermal warnings, BIOS overrides, voltage drift limits |
| **Alert Crimson** | `#EF4444` | Collision intersections, short circuits, thermal throttling ceilings |
| **Comms WhatsApp Lime** | `#25D366` | Dedicated CAD hotline and engineer collaboration links |
| **High-Contrast Readouts** | `#F8FAFC` | Primary values, technical specs, coordinates |
| **Subdued Technical Text** | `#94A3B8` | Units, pinout notations, datum descriptors |

---

## Typography Hierarchy

| Font Family | Application | Specs |
| :--- | :--- | :--- |
| **JetBrains Mono** | Primary Headlines, Coordinate Telemetry, Numeric Dimension Values, Tool Configurations | `700` / `600`, -0.02em letter-spacing |
| **Space Mono** | Board Silkscreen Notations, Mechanical Slot IDs (`PCIE_5_X16`, `DIMM_A2`), Dimensional Tolerance Annotations | `700` / `400`, Uppercase, 0.06em spacing |
| **Inter** | Specification Sheets, Engineering Checklists, Inspector Tooltips, Component Catalogs | `400` / `500`, 13px - 15px |

---

## Mechanical Elevation & Grid
- **0px Border Radius**: Mechanical sharp aesthetic across all cards, buttons, tabs, inputs, and chips.
- **Background Grid**: Orthogonal 16px minor grid lines (`#1E293B`, 0.7px) and 64px major coordinate axes (`#334155`, 1px).
- **Chamfered Notches**: 45° 4px cut corners on active status badges and viewport HUD corners.
- **Hairline Dividers**: 1px solid `#334155` lines with zero blur.
