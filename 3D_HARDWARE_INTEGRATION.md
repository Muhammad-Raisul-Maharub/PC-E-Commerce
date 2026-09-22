# 3D Hardware Modeling & WebGL Rendering Architecture Guide

This architecture document defines the 3D asset pipeline, runtime stack, component structure, and concept-specific visual treatments for the **PC E-Commerce Multi-Concept Platform**.

---

## 1. Technology Stack & Formats

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend 3D Runtime** | **React Three Fiber (`@react-three/fiber`)** | Declarative React wrapper around Three.js with complete state integration. |
| **Helpers & Abstractions** | **Drei (`@react-three/drei`)** | High-level helpers (`OrbitControls`, `Stage`, `useGLTF`, `Html`, `OrthographicCamera`). |
| **3D Engine** | **Three.js (`three`)** | WebGL rendering engine, PBR shaders, matrix math, and lighting. |
| **Rapid Prototyping** | **Spline 3D (`@splinetool/react-spline`)** | Fast visual prototypes (e.g., interactive exploded motherboards or mechanical switches). |
| **Standard 3D Web Format**| **Binary glTF (`.glb` / `.gltf`)** | Compact, self-contained binary packaging geometry, PBR materials, textures, and animations. |

---

## 2. Where to Source Free 3D Hardware Models

| Platform | Best For | Supported Formats | Recommended Licensing |
| :--- | :--- | :--- | :--- |
| **[Sketchfab](https://sketchfab.com)** | Ready-to-use computer hardware (CPUs, GPUs, RAM, motherboards, fans). | `.glb`, `.gltf`, `.fbx`, `.blend` | Filter by **"Free Download" / Creative Commons (CC-BY)** |
| **[GrabCAD Community](https://grabcad.com)** | Exact millimeter CAD models of PC cases, radiators, and water blocks. | `STEP`, `IGES`, `STL`, `SOLIDWORKS` | Free community CAD models |
| **[CGTrader](https://cgtrader.com)** / **[TurboSquid](https://turbosquid.com)** | High-fidelity hardware peripherals and components. | `.glb`, `.obj`, `.fbx` | Filter by **"Free"** |

> [!TIP]
> **GrabCAD Workflow:** GrabCAD models are often in CAD boundary representation (STEP/IGES). Import them into **Blender** (Free & Open Source), clean the mesh if necessary, and export as a Draco-compressed `.glb` file.

---

## 3. Step-by-Step Integration Pipeline

### Step A: Optimize and Compress Asset with Draco
Download your model (e.g., `gpu.glb`), place it in your staging folder, and compress geometry with `gltf-pipeline`:
```bash
npm install -g gltf-pipeline
gltf-pipeline -i gpu.glb -o public/models/gpu-draco.glb -d
```

### Step B: Generate Declarative React JSX with `gltfjsx`
Generate a fully typed TypeScript component where every node, material, and mesh can be bound to application state:
```bash
npx gltfjsx public/models/gpu-draco.glb --types
```

### Step C: Use the Reusable `Hardware3DViewer`
Import `components/canvas/Hardware3DViewer.tsx` inside any client component:
```tsx
import Hardware3DViewer from "@/components/canvas/Hardware3DViewer";

<Hardware3DViewer
  modelPath="/models/gpu-draco.glb"
  concept="neonforge"
  accentColor="#00F0FF"
  autoRotate={true}
/>
```

---

## 4. Implementation by Concept

| Concept | Visual Style & Shader Parameters | Camera & Lighting Setup | Interactive Behavior |
| :--- | :--- | :--- | :--- |
| **Concept 1: VoltMatrix** | Clean industrial inspection, metallic PBR textures (`metalness: 0.8`, `roughness: 0.3`). | **`<OrthographicCamera>`** with `Stage intensity={0.8}` for shadow-defined precision. | 360° orbit inspection, technical callouts. |
| **Concept 2: NeonForge** | Transparent tempered glass chassis (`transmission: 0.9`, `thickness: 1.2`), dynamic liquid loop. | Internal **`<pointLight color="#00F0FF" intensity={3} />`** casting neon glow on coolant. | UI coolant color selector directly updates diffuse/emissive properties. |
| **Concept 3: Axiom Pro** | Uniform CAD clay matte finish (`roughness: 0.85`, `metalness: 0.1`, color: `#E2E8F0`). | Perspective camera with soft studio lighting (`intensity: 0.7`). | Clean studio rotation and dimensioning. |
| **Concept 4: SynapseCAD** | Blueprint wireframe shader (`<meshStandardMaterial wireframe color="#06B6D4" />`). | Perspective with technical background grid. | Drei **`<Html>`** callout badges showing real-time millimeter dimensions and slot clearance. |
| **Concept 5: OmniPulse BD** | Low-poly regional Bangladesh terrain/plane with localized coordinate pins. | Angled aerial perspective. | Interactive store beacon markers displaying live showroom inventory counts. |
| **Concept 6: Krypton Brutalist** | High-contrast industrial plastic and smoky polycarbonate mechanical switch. | Dynamic close-up perspective. | **Spring-damped stem depression along Y-axis** on click/keypress + Web Audio mechanical sound synthesis. |

---

## 5. Performance Optimizations for Web Deployment

1. **On-Demand Rendering (`frameloop="demand"`)**:
   - The renderer only evaluates and paints frames when user interaction, camera movements, or state updates occur, eliminating idle GPU utilization.
2. **Strict Geometry & Texture Budgets**:
   - Production models should target **$\le 100,000$ polygons** per scene.
   - Textures capped at **$1024 \times 1024$** or **$2048 \times 2048$ WebP**.
3. **2D Animated Suspense Skeletons**:
   - Prevents layout shift (CLS) while assets stream over the network.
4. **Preloading**:
   - Use `useGLTF.preload('/models/...')` on critical paths to eliminate loading latency during navigation.
