"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type ViewerConcept =
  | "voltmatrix"
  | "neonforge"
  | "axiom"
  | "synapse"
  | "omnipulse"
  | "krypton";

export interface Hardware3DViewerProps {
  modelPath?: string;
  concept?: ViewerConcept;
  accentColor?: string;
  autoRotate?: boolean;
  className?: string;
  interactiveSwitch?: boolean;
  onSwitchPress?: () => void;
}

export const HARDWARE_3D_LIBRARY = [
  {
    id: "concept",
    label: "Concept View",
    category: "Specialized",
    path: "",
    desc: "Procedural CAD Viewport",
  },
  {
    id: "gpu",
    label: "RTX 4090 FE",
    category: "GPU",
    path: "/models/gpu-rtx4090.glb",
    desc: "NVIDIA GeForce RTX 4090 Dual Axial",
  },
  {
    id: "cpu",
    label: "Threadripper",
    category: "CPU",
    path: "/models/cpu-threadripper.glb",
    desc: "AMD Ryzen Threadripper sTR5 Substrate",
  },
  {
    id: "ram",
    label: "Corsair RAM",
    category: "Memory",
    path: "/models/ram-corsair.glb",
    desc: "Corsair Vengeance RGB DDR4/DDR5 Module",
  },
  {
    id: "switch",
    label: "Cherry MX",
    category: "Switch",
    path: "/models/switch-cherry-mx.glb",
    desc: "Cherry MX Mechanical 5-Pin Switch",
  },
  {
    id: "motherboard",
    label: "Motherboard",
    category: "Board",
    path: "/models/motherboard-atx.glb",
    desc: "Full ATX Reinforced Workstation PCB",
  },
  {
    id: "chassis",
    label: "Gaming Case",
    category: "Chassis",
    path: "/models/chassis-gaming.glb",
    desc: "High-Airflow Tempered Glass Tower",
  },
];

export default function Hardware3DViewer({
  modelPath,
  concept = "voltmatrix",
  accentColor,
  autoRotate = true,
  className = "w-full h-full min-h-[480px]",
  interactiveSwitch = false,
  onSwitchPress,
}: Hardware3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initial model selection based on prop
  const initialIndex = modelPath
    ? Math.max(
        0,
        HARDWARE_3D_LIBRARY.findIndex((item) => item.path === modelPath)
      )
    : 1;

  const [activeModelIndex, setActiveModelIndex] = useState<number>(
    initialIndex !== -1 ? initialIndex : 1
  );
  const [isRotating, setIsRotating] = useState<boolean>(autoRotate);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // References to Three.js elements
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentModelGroupRef = useRef<THREE.Group | null>(null);

  // Colors per concept theme
  const themeColors = {
    voltmatrix: { primary: "#EF4444", bg: "#020617", rim: 0xef4444, grid: 0x334155 },
    neonforge: { primary: "#00F0FF", bg: "#0A0A0F", rim: 0x00f0ff, grid: 0x1e1e2d },
    axiom: { primary: "#0EA5E9", bg: "#090D16", rim: 0x38bdf8, grid: 0x1e293b },
    synapse: { primary: "#06B6D4", bg: "#030712", rim: 0x06b6d4, grid: 0x164e63 },
    omnipulse: { primary: "#10B981", bg: "#0B1329", rim: 0x10b981, grid: 0x1e293b },
    krypton: { primary: "#FACC15", bg: "#121216", rim: 0xfacc15, grid: 0x27272a },
  }[concept] || { primary: "#EF4444", bg: "#020617", rim: 0xef4444, grid: 0x334155 };

  const activeThemeColor = accentColor || themeColors.primary;

  // Initialize Three.js scene once
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera - Positioned tighter to eliminate dead marginal space
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(2.8, 2.0, 3.2);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 14.0;
    controls.minDistance = 0.8;
    controls.autoRotate = isRotating;
    controls.autoRotateSpeed = 1.3;
    controlsRef.current = controls;

    // 5. Studio-Grade Enhanced HDR Lighting
    // Global Ambient Fill - Brightens all shadowed areas
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);

    // Primary Key Light - Crisp highlights & soft directional shadows
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(6, 9, 6);
    keyLight.castShadow = true;
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Opposing Fill Light - Soft secondary fill for depth
    const fillLight = new THREE.DirectionalLight(0xffffff, 2.2);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    // Front Camera Center Light - Eliminates dark fronts on complex shrouds
    const frontLight = new THREE.PointLight(0xffffff, 1.8, 30);
    frontLight.position.set(0, 3, 5);
    scene.add(frontLight);

    // Vibrant Concept Rim Light - Creates high-contrast edges matching theme
    const rimLight = new THREE.DirectionalLight(themeColors.rim, 3.0);
    rimLight.position.set(0, -3, -6);
    scene.add(rimLight);

    // 6. Ground Perspective Grid
    const grid = new THREE.GridHelper(12, 24, themeColors.rim, themeColors.grid);
    grid.position.y = -1.4;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.4;
    scene.add(grid);

    // 7. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  // Update autoRotate when state toggles
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isRotating;
    }
  }, [isRotating]);

  // Load Model or Procedural Fallback whenever activeModelIndex changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear previous model group
    if (currentModelGroupRef.current) {
      scene.remove(currentModelGroupRef.current);
      currentModelGroupRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.geometry?.dispose();
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => m.dispose());
          } else {
            mesh.material?.dispose();
          }
        }
      });
      currentModelGroupRef.current = null;
    }

    const selectedItem = HARDWARE_3D_LIBRARY[activeModelIndex] || HARDWARE_3D_LIBRARY[1];

    // Helper: Create Concept Procedural Mesh
    const mountProceduralMesh = () => {
      const group = new THREE.Group();

      if (concept === "voltmatrix" || selectedItem.id === "gpu") {
        // High-precision GPU Block
        const pcbGeo = new THREE.BoxGeometry(3.2, 0.09, 1.4);
        const pcbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 });
        const pcb = new THREE.Mesh(pcbGeo, pcbMat);
        group.add(pcb);

        const finGeo = new THREE.BoxGeometry(3.0, 0.6, 1.3);
        const finMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.15 });
        const fins = new THREE.Mesh(finGeo, finMat);
        fins.position.y = 0.35;
        group.add(fins);

        [-0.8, 0.8].map((x) => {
          const fanGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.09, 24);
          const fanMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
          const fan = new THREE.Mesh(fanGeo, fanMat);
          fan.rotation.x = Math.PI / 2;
          fan.position.set(x, 0.7, 0);
          group.add(fan);
        });
      } else if (concept === "krypton" || selectedItem.id === "switch") {
        // Mechanical Switch Block
        const baseGeo = new THREE.BoxGeometry(2.0, 0.9, 2.0);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.4 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        group.add(base);

        const stemGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.25 });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 0.75;
        group.add(stem);
      } else {
        // Futuristic Hardware Substrate
        const boxGeo = new THREE.BoxGeometry(2.2, 2.2, 2.2);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.75, roughness: 0.2 });
        const box = new THREE.Mesh(boxGeo, boxMat);
        group.add(box);
      }

      currentModelGroupRef.current = group;
      scene.add(group);
      setIsLoading(false);
      setLoadError(null);
    };

    // If "Concept View" (empty path), use procedural mesh
    if (!selectedItem.path) {
      mountProceduralMesh();
      return;
    }

    // Load .GLB Model asynchronously
    setIsLoading(true);
    setLoadError(null);

    const loader = new GLTFLoader();
    loader.load(
      selectedItem.path,
      (gltf) => {
        const root = gltf.scene;

        // Auto-center and normalize scale to fill viewport (3.2 units)
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        const targetSize = 3.2; // Optimized size to eliminate marginal gaps
        const scale = maxDim > 0 ? targetSize / maxDim : 1;
        root.scale.set(scale, scale, scale);

        const center = new THREE.Vector3();
        box.getCenter(center);
        root.position.x = -center.x * scale;
        root.position.y = -center.y * scale;
        root.position.z = -center.z * scale;

        // Enable shadows and enhance material responsiveness to light
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.material) {
              const mat = mesh.material as THREE.MeshStandardMaterial;
              if (mat.roughness !== undefined) {
                mat.roughness = Math.max(0.15, mat.roughness * 0.9);
              }
              if (mat.metalness !== undefined) {
                mat.metalness = Math.min(1.0, mat.metalness * 1.05);
              }
            }
          }
        });

        const group = new THREE.Group();
        group.add(root);
        currentModelGroupRef.current = group;
        scene.add(group);

        setIsLoading(false);
        setLoadError(null);
      },
      undefined,
      (error) => {
        console.warn(`[Hardware3DViewer] Failed to load ${selectedItem.path}, falling back to CAD mesh:`, error);
        mountProceduralMesh();
      }
    );
  }, [activeModelIndex, concept]);

  // Reset Camera View
  const handleResetCamera = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(2.8, 2.0, 3.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  // Zoom In Handler (moves camera 20% closer)
  const handleZoomIn = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
      if (offset.length() > controls.minDistance + 0.3) {
        offset.multiplyScalar(0.8);
        camera.position.addVectors(controls.target, offset);
        controls.update();
      }
    }
  }, []);

  // Zoom Out Handler (moves camera 25% further)
  const handleZoomOut = useCallback(() => {
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
      if (offset.length() < controls.maxDistance - 0.8) {
        offset.multiplyScalar(1.25);
        camera.position.addVectors(controls.target, offset);
        controls.update();
      }
    }
  }, []);

  const activeModel = HARDWARE_3D_LIBRARY[activeModelIndex] || HARDWARE_3D_LIBRARY[1];

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${className}`}
      style={{ backgroundColor: themeColors.bg }}
    >
      {/* Native WebGL Canvas - 100% full-bleed, no margin gaps */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Top HUD: Hardware Details & Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 flex items-center space-x-2.5 shadow-lg">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: activeThemeColor }}
          />
          <span className="font-mono text-xs font-extrabold text-white uppercase tracking-wider">
            {activeModel.label}
          </span>
          <span className="font-mono text-[10.5px] text-slate-400 hidden sm:inline">
            // {activeModel.category}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 pointer-events-auto">
          {/* Zoom In Button */}
          <button
            onClick={handleZoomIn}
            className="px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-slate-200 hover:text-white text-xs font-mono font-bold border border-white/15 shadow transition-all flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95"
            title="Zoom In (Inspect Closer)"
          >
            <span className="material-symbols-outlined text-[15px]">zoom_in</span>
            <span className="text-[11px] font-bold">+</span>
          </button>

          {/* Zoom Out Button */}
          <button
            onClick={handleZoomOut}
            className="px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-slate-200 hover:text-white text-xs font-mono font-bold border border-white/15 shadow transition-all flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95"
            title="Zoom Out (Wider View)"
          >
            <span className="material-symbols-outlined text-[15px]">zoom_out</span>
            <span className="text-[11px] font-bold">-</span>
          </button>

          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all border shadow cursor-pointer ${
              isRotating
                ? "bg-white/25 text-white border-white/40"
                : "bg-black/80 text-slate-400 border-white/15 hover:text-white"
            }`}
            title="Toggle Continuous 3D Orbit Rotation"
          >
            {isRotating ? "Orbiting" : "Paused"}
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="px-2.5 py-1.5 rounded-lg bg-black/80 hover:bg-black text-slate-200 hover:text-white text-xs font-mono font-bold uppercase border border-white/15 shadow transition-all flex items-center gap-1 cursor-pointer"
            title="Reset Camera Center"
          >
            <span className="material-symbols-outlined text-[15px]">restart_alt</span>
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center font-mono text-xs z-20 pointer-events-none">
          <div
            className="w-9 h-9 border-2 border-t-transparent rounded-full animate-spin mb-3"
            style={{ borderColor: `${activeThemeColor} transparent transparent transparent` }}
          />
          <span className="font-bold text-white uppercase tracking-wider text-sm">
            Streaming {activeModel.label} .GLB...
          </span>
          <span className="text-[11px] text-slate-400 mt-1">
            Zero-overhead WebGL PBR Shading
          </span>
        </div>
      )}

      {/* Interactive Bottom Hardware Dock Pill Selector */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center z-10 pointer-events-auto">
        <div className="bg-black/90 backdrop-blur-md px-2.5 py-2 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-1.5 overflow-x-auto max-w-full">
          {HARDWARE_3D_LIBRARY.map((item, idx) => {
            const isSelected = activeModelIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModelIndex(idx)}
                className={`px-3 py-1.5 rounded-xl font-mono text-[11px] font-bold uppercase whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "text-black shadow-lg scale-105"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                }`}
                style={{
                  backgroundColor: isSelected ? activeThemeColor : "transparent",
                }}
              >
                <span>{item.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
