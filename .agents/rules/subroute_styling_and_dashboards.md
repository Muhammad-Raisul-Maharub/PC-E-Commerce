# Subroute Styling Invariants & Code-First Dashboard Scaffolding

## Rule 1: Subroute Styling & CSS Preservation Invariants
1. **Topmost CSS Import**: In `app/layout.tsx`, `import "./globals.css";` must always be placed at the very top of imports.
2. **Exhaustive Tailwind Scanning**: In `tailwind.config.ts`, the `content` array must always encompass:
   - `"./app/**/*.{js,ts,jsx,tsx,mdx}"`
   - `"./pages/**/*.{js,ts,jsx,tsx,mdx}"`
   - `"./components/**/*.{js,ts,jsx,tsx,mdx}"`
   - `"./lib/**/*.{js,ts,jsx,tsx,mdx}"`
3. **Flat PostCSS Layers**: Never nest `@layer components` or `@layer utilities` inside `@layer base` in `globals.css`. Keep all `@layer` directives at the root level to prevent CSS AST parse failures.
4. **SVG Dimension Containment**: Any inline or component SVG in headers, navbars, or global layouts must have explicit numeric attributes (`width={24} height={24}`) and inline style bounds (`style={{ maxWidth: "24px", maxHeight: "24px" }}`). This ensures SVGs cannot expand across the viewport before CSS hydration.

## Rule 2: Code-First Utility Dashboards vs. Google Stitch
1. **Google Stitch Boundary**: Use Google Stitch exclusively for creative customer-facing storefront concepts, brand themes (e.g. VoltMatrix, OmniPulse, Axiom Pro), and marketing hero layouts.
2. **Dashboards Scaffolding in Code**: Scaffold administrative consoles (`/admin`), inventory management tables, drag-and-drop dropzones, fulfillment packing slips, and customer portals (`/account`) directly in Next.js code using modern Tailwind CSS and Lucide icons for maximum speed, real-time database reactivity, and operational precision.
