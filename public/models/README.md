# 3D Hardware Models Asset Directory (`public/models/`)

This directory is designated for binary glTF (`.glb` / `.gltf`) 3D assets to be dynamically rendered by `Hardware3DViewer.tsx` inside the Next.js React Three Fiber application.

---

## 🛠 Recommended Pipeline

### 1. Source Models
- **Sketchfab** (sketchfab.com): CPUs, GPUs, motherboards, fans (Filter by "Free Download" / Creative Commons).
- **GrabCAD Community** (grabcad.com): Dimensional chassis, radiators, waterblocks (STEP, IGES, STL).
- **CGTrader / TurboSquid**: Peripherals and PC components (Filter by "Free").

### 2. Convert & Compress with Draco
For models downloaded in `.obj`, `.fbx`, or `.step`, import into **Blender** (Free) and export as `.glb`.
Then apply Draco geometry compression using `gltf-pipeline`:

```bash
npm install -g gltf-pipeline
gltf-pipeline -i gpu.glb -o public/models/gpu-draco.glb -d
```

### 3. Generate Declarative React Component (Optional)
Generate typed JSX nodes with full prop control:

```bash
npx gltfjsx public/models/gpu-draco.glb --types
```

### 4. Load into `Hardware3DViewer`
```tsx
import Hardware3DViewer from "@/components/canvas/Hardware3DViewer";

<Hardware3DViewer 
  modelPath="/models/gpu-draco.glb" 
  concept="neonforge" 
  accentColor="#00F0FF" 
/>
```

---

## ⚡ Budgets for Production
- **Polygons:** Keep under 100,000 tris per model.
- **Textures:** WebP format, max $2048 \times 2048$ resolution.
- **Frameloop:** `demand` is enabled by default to preserve battery and GPU cycles.
