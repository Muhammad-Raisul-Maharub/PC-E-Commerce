# Frontend Architecture & Layout Invariants

1. **Standard Layout Container**:
   - All page views, headers, and footers MUST share the unified container standard:
     `w-full max-w-[1536px] mx-auto px-4 md:px-6`
   - Never use `lg:px-8` or `max-w-7xl` unless explicitly requested.

2. **Zero Dead Side Margins**:
   - Outer wrapper `<section>` or `<header>` elements must only manage vertical padding (`py-*`) or full-bleed backgrounds.
   - Do NOT add horizontal padding (`px-*`) to outer section wrappers that contain an inner `.layout-container` or `max-w-[1536px] mx-auto px-4 md:px-6` block.

3. **Catalog Sidebar Architecture**:
   - Catalog filter sidebars should be sticky `260px`:
     `w-full lg:w-[260px] lg:shrink-0 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] overflow-y-auto scrollbar-thin`
   - Pair with `flex-1 min-w-0` on the main product area.
