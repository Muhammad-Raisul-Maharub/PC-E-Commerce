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
  className = "w-full h-80 sm:h-96",
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

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.5, 2.5, 4.0);
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
    controls.dampingFactor = 0.05;
    controls.maxDistance = 15.0;
    controls.minDistance = 1.0;
    controls.autoRotate = isRotating;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffffff, 1.2, 20);
    fillLight.position.set(-5, 3, -4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(themeColors.rim, 2.0);
    rimLight.position.set(0, -4, -5);
    scene.add(rimLight);

    // 6. Ground Grid
    const grid = new THREE.GridHelper(10, 20, themeColors.rim, themeColors.grid);
    grid.position.y = -1.2;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
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
        const pcbGeo = new THREE.BoxGeometry(2.8, 0.08, 1.2);
        const pcbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6, roughness: 0.3 });
        const pcb = new THREE.Mesh(pcbGeo, pcbMat);
        group.add(pcb);

        const finGeo = new THREE.BoxGeometry(2.6, 0.5, 1.1);
        const finMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
        const fins = new THREE.Mesh(finGeo, finMat);
        fins.position.y = 0.3;
        group.add(fins);

        [-0.7, 0.7].map((x) => {
          const fanGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.08, 24);
          const fanMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
          const fan = new THREE.Mesh(fanGeo, fanMat);
          fan.rotation.x = Math.PI / 2;
          fan.position.set(x, 0.6, 0);
          group.add(fan);
        });
      } else if (concept === "krypton" || selectedItem.id === "switch") {
        // Mechanical Switch Block
        const baseGeo = new THREE.BoxGeometry(1.6, 0.8, 1.6);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.5 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        group.add(base);

        const stemGeo = new THREE.BoxGeometry(0.6, 0.7, 0.6);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.y = 0.6;
        group.add(stem);
      } else {
        // Futuristic Hardware Substrate
        const boxGeo = new THREE.BoxGeometry(1.8, 1.8, 1.8);
        const boxMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.2 });
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

        // Auto-center and normalize scale
        const box = new THREE.Box3().setFromObject(root);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);

        const targetSize = 2.4;
        const scale = maxDim > 0 ? targetSize / maxDim : 1;
        root.scale.set(scale, scale, scale);

        const center = new THREE.Vector3();
        box.getCenter(center);
        root.position.x = -center.x * scale;
        root.position.y = -center.y * scale;
        root.position.z = -center.z * scale;

        // Enable shadows and enhance materials
        root.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
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
      cameraRef.current.position.set(3.5, 2.5, 4.0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, []);

  const activeModel = HARDWARE_3D_LIBRARY[activeModelIndex] || HARDWARE_3D_LIBRARY[1];

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden border border-white/10 shadow-2xl ${className}`}
      style={{ backgroundColor: themeColors.bg }}
    >
      {/* Native WebGL Canvas (Pure Three.js - 0 React internals dependencies) */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Top HUD: Hardware Details & Controls */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center space-x-2">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: activeThemeColor }}
          />
          <span className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
            {activeModel.label}
          </span>
          <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
            // {activeModel.category}
          </span>
        </div>

        <div className="flex items-center space-x-1.5 pointer-events-auto">
          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1 rounded text-[10.5px] font-mono font-bold uppercase transition-all border cursor-pointer ${
              isRotating
                ? "bg-white/20 text-white border-white/30"
                : "bg-black/60 text-slate-400 border-white/10 hover:text-white"
            }`}
            title="Toggle Continuous 3D Orbit Rotation"
          >
            {isRotating ? "Orbiting" : "Paused"}
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="px-2 py-1 rounded bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white text-[10.5px] font-mono font-bold uppercase border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
            title="Reset Camera Center"
          >
            <span className="material-symbols-outlined text-[14px]">restart_alt</span>
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center font-mono text-xs z-20 pointer-events-none">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-3"
            style={{ borderColor: `${activeThemeColor} transparent transparent transparent` }}
          />
          <span className="font-bold text-white uppercase tracking-wider">
            Streaming {activeModel.label} .GLB...
          </span>
          <span className="text-[10px] text-slate-400 mt-1">
            Zero-overhead WebGL PBR Shading
          </span>
        </div>
      )}

      {/* Interactive Bottom Hardware Dock Pill Selector */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center z-10 pointer-events-auto">
        <div className="bg-black/85 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/15 shadow-xl flex items-center gap-1 overflow-x-auto max-w-full">
          {HARDWARE_3D_LIBRARY.map((item, idx) => {
            const isSelected = activeModelIndex === idx;
            return (
              <button
                key={item.id}
                onClick={() => setActiveModelIndex(idx)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold uppercase whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                  isSelected
                    ? "text-black shadow-md scale-105"
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
