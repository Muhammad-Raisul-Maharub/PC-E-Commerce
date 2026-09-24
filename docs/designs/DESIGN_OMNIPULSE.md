# OmniPulse BD Design System DNA
**Concept 5: Omnichannel Hyper-Local Retail Hub**
*Source: Google Stitch Project — OmniPulse BD Architecture*
*Production Architecture Reference: [https://blueyes-app.vercel.app](https://blueyes-app.vercel.app)*

---

## 1. Brand Philosophy & Mission
OmniPulse BD bridges the gap between high-velocity e-commerce and high-trust physical retail in Bangladesh. Recognizing that Bangladeshi enthusiasts, content creators, and enterprise consumers demand physical touchpoints, immediate same-day store pickup, official local warranty validation (Mushak-6.3 compliance), and localized multi-payment options (bKash, Nagad, Cash on Delivery, and 0% Bank EMI), OmniPulse BD provides a unified, hyper-local omnichannel experience.

Key tenants:
- **Physical-First Digital Agility**: Digital stock mirrors physical shelf inventory at IDB Bhaban, Multiplan Center, Motijheel HQ, Uttara Tech Plaza, and Chittagong Sanmar Hub.
- **Visual Clarity & Authority**: Royal Navy evokes institutional trust and technological precision, accented by vibrant Amber for deals and Savings Red for discounts.
- **Frictionless Local Payments**: Native integration representation for bKash, Nagad, nationwide Cash on Delivery (COD), and 0% bank EMI up to 36 months.
- **Direct Human Assistance**: WhatsApp sales consultant hooks embedded directly in every SKU and checkout route.

---

## 2. Palette Tokens

| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| **Canvas Base** | `#F4F6F9` | Clean cool background canvas layer |
| **Surface Pure** | `#FFFFFF` | Primary card faces, elevated tiles, sheets |
| **Royal Navy** | `#0D47A1` | Primary brand accent, mastheads, primary action buttons |
| **Royal Navy Dark** | `#0A387E` | Hero surfaces, footer deep well, header backgrounds |
| **Royal Navy Tint** | `#E3F2FD` | Chip fills, active state highlights, soft pill badges |
| **Amber Accent** | `#FFB300` | Secondary highlights, price badges, star ratings, promotions |
| **Amber Hover** | `#FFA000` | Button hover states, active slider accents |
| **Savings Red** | `#D32F2F` | Price drop banners, discount badges, urgent stock warnings |
| **WhatsApp Emerald**| `#25D366` | Live sales consultation hotline button and chat triggers |
| **Neutral Slate** | `#1E293B` | High-contrast typography, product titles, table headers |
| **Muted Slate** | `#64748B` | Secondary specs, SKU labels, breadcrumb trails |
| **Hairline Border** | `#E2E8F0` | Planar dividers, card borders, tabular dividers |

---

## 3. Typography Hierarchy

| Font Family | Application | Specification |
| :--- | :--- | :--- |
| **Poppins** | Primary Page Titles, Section Headers, Brand Logos, Hero Statements | `700` / `600`, -0.01em letter spacing |
| **Open Sans / Inter** | Product Titles, Feature Bullets, Specifications, Cart & Checkout Forms | `400` / `500` / `600`, 13px - 15px |
| **Tabular Monospace**| Price figures, EMI monthly calculations, Stock counts, SKU numbers | `600` / `700`, `JetBrains Mono` / `font-tabular` |
| **Currency** | Bangladeshi Taka (`৳` / `Tk`) | Always prefixed with standard Bangladeshi comma grouping |

---

## 4. Physical Branch Architecture

1. **IDB Bhaban Flagship Depot**: BCS Computer City, Ground & 1st Floor, Agargaon, Dhaka (2-Hour Express Collection)
2. **Multiplan Center Hub**: Level 9, New Elephant Road, Dhaka (Same-Day Depot)
3. **Motijheel Commercial HQ**: Dilkusha Commercial Area, Dhaka (B2B & Corporate Logistics)
4. **Uttara Tech Plaza**: Sector 3, Uttara, Dhaka (Northern Regional Depot)
5. **Chittagong GEC Sanmar Showroom**: Sanmar Ocean City, GEC Circle, Chattogram (Regional Hub)

---

## 5. Five Core Screen Archetypes

- **Screen 1: OmniPulse BD Homepage & Master Storefront**
  - Persistent physical branch selector with instant stock availability
  - Interactive 3D regional map linking Dhaka & Chittagong depots
  - Category quick-pills, branch-filtered hot deals, and WhatsApp sales consultant

- **Screen 2: Branch-Aware Catalog & Parametric Directory (PLP)**
  - Immediate in-store pickup filter by branch
  - Asynchronous facet filtering for Cash on Delivery (COD) and 0% EMI
  - Real component and gadget category browsing

- **Screen 3: Interactive 3D Technical PDP with Local Branch Stock**
  - 3D WebGL viewer with orthogonal inspection and packaging views
  - Real-time 5-branch physical inventory table with transfer timelines
  - Direct WhatsApp sales consultation button with pre-filled SKU

- **Screen 4: Omnichannel Custom PC Builder & Budget Tier Wizard**
  - Interactive "Build by Budget" slider (৳50,000 to ৳200,000+)
  - Automated socket, RAM, and wattage compatibility validation
  - Workshop assembly and 24-hour stress testing options
  - Export PDF Quotation and Copy Shareable Build Link

- **Screen 5: Regional Multi-Payment Cart & Checkout Tunnel**
  - In-Store Collection Reserve vs. Nationwide Courier Delivery
  - Local payments: Cash on Delivery (COD), bKash/Nagad USSD PIN modal simulation, Bank Cards, and 0% EMI
