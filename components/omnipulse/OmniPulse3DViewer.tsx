"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type OmniPulseViewMode = "orbit" | "ortho" | "packaging" | "exploded";

interface OmniPulse3DViewerProps {
  productName?: string;
  category?: string;
  brand?: string;
}

export default function OmniPulse3DViewer({
  productName = "AMD Ryzen 7 7800X3D",
  category = "cpu",
  brand = "AMD",
}: OmniPulse3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<OmniPulseViewMode>("orbit");
  const [zoomPercent, setZoomPercent] = useState<number>(100);
  const [isRotating, setIsRotating] = useState<boolean>(true);

  // References for Three.js state
  const viewModeRef = useRef<OmniPulseViewMode>("orbit");
  const isRotatingRef = useRef<boolean>(true);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = null;

    // 2. Camera Setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 3.4);
    cameraRef.current = camera;

    // 3. Renderer Setup
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

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // zoom handled by slider/buttons
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.minPolarAngle = Math.PI / 6;
    controlsRef.current = controls;

    // 5. Studio-Grade Enhanced HDR Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.8);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0d47a1, 1.8); // Royal Navy tint
    dirLight2.position.set(-5, -3, -4);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xffb300, 1.8); // Amber rim light
    dirLight3.position.set(4, -2, -3);
    scene.add(dirLight3);

    const frontLight = new THREE.PointLight(0xffffff, 2.0, 20);
    frontLight.position.set(0, 2, 4);
    scene.add(frontLight);

    // 6. Pedestal Floor Grid
    const floorGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.08, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x0a2558,
      metalness: 0.8,
      roughness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -1.2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Pedestal outer glow ring
    const ringGeo = new THREE.RingGeometry(2.42, 2.5, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffb300,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = -1.16;
    scene.add(ringMesh);

    // 7. Component Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Group A: Hardware Component (Substrate, Dies, Heatspreader, Pins)
    const hardwareGroup = new THREE.Group();
    modelGroup.add(hardwareGroup);

    // 7.1 PCB Substrate (Green/Black FR4 with gold contact pads)
    const substrateGeo = new THREE.BoxGeometry(2.0, 0.08, 2.0);
    const substrateMat = new THREE.MeshStandardMaterial({
      color: 0x0d3b1e,
      roughness: 0.4,
      metalness: 0.2,
    });
    const substrate = new THREE.Mesh(substrateGeo, substrateMat);
    substrate.castShadow = true;
    hardwareGroup.add(substrate);

    // Substrate Edge gold notch
    const notchGeo = new THREE.BoxGeometry(0.12, 0.09, 0.12);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffb300,
      metalness: 0.9,
      roughness: 0.1,
    });
    const notch = new THREE.Mesh(notchGeo, goldMat);
    notch.position.set(-0.95, 0, -0.95);
    hardwareGroup.add(notch);

    // 7.2 Silicon Dies (CCD + IOD)
    const diesGroup = new THREE.Group();
    diesGroup.position.y = 0.06;

    const ccdGeo = new THREE.BoxGeometry(0.5, 0.04, 0.6);
    const dieMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.95,
      roughness: 0.05,
    });
    const ccd1 = new THREE.Mesh(ccdGeo, dieMat);
    ccd1.position.set(-0.35, 0, 0.3);
    diesGroup.add(ccd1);

    const iodGeo = new THREE.BoxGeometry(0.8, 0.04, 0.65);
    const iod = new THREE.Mesh(iodGeo, dieMat);
    iod.position.set(0.25, 0, -0.2);
    diesGroup.add(iod);
    hardwareGroup.add(diesGroup);

    // 7.3 Nickel-Plated Copper IHS (Integrated Heat Spreader)
    const ihsGeo = new THREE.BoxGeometry(1.65, 0.18, 1.65);
    const ihsMat = new THREE.MeshStandardMaterial({
      color: 0xc8d1dc,
      metalness: 0.9,
      roughness: 0.25,
    });
    const ihs = new THREE.Mesh(ihsGeo, ihsMat);
    ihs.position.y = 0.16;
    ihs.castShadow = true;
    hardwareGroup.add(ihs);

    // IHS Laser engraving plate
    const laserGeo = new THREE.PlaneGeometry(1.1, 1.1);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const laserMesh = new THREE.Mesh(laserGeo, laserMat);
    laserMesh.rotation.x = -Math.PI / 2;
    laserMesh.position.y = 0.252;
    hardwareGroup.add(laserMesh);

    // 7.4 Gold LGA Pin Pad Matrix (Bottom)
    const pinsGeo = new THREE.PlaneGeometry(1.8, 1.8);
    const pinsMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.85,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const pins = new THREE.Mesh(pinsGeo, pinsMat);
    pins.rotation.x = Math.PI / 2;
    pins.position.y = -0.045;
    hardwareGroup.add(pins);

    // Group B: Retail Packaging Box (for Packaging Mode)
    const packagingGroup = new THREE.Group();
    packagingGroup.visible = false;
    modelGroup.add(packagingGroup);

    const boxGeo = new THREE.BoxGeometry(2.4, 2.6, 1.4);
    // Face materials: Royal Navy front & sides, Amber accents
    const boxMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x0a2558, roughness: 0.3 }), // right
      new THREE.MeshStandardMaterial({ color: 0x0a2558, roughness: 0.3 }), // left
      new THREE.MeshStandardMaterial({ color: 0x0d47a1, roughness: 0.3 }), // top
      new THREE.MeshStandardMaterial({ color: 0x061b3d, roughness: 0.3 }), // bottom
      new THREE.MeshStandardMaterial({ color: 0x0d47a1, roughness: 0.25, metalness: 0.2 }), // front
      new THREE.MeshStandardMaterial({ color: 0x0a2558, roughness: 0.3 }), // back
    ];
    const retailBox = new THREE.Mesh(boxGeo, boxMaterials);
    retailBox.castShadow = true;
    packagingGroup.add(retailBox);

    // Holographic Bangladesh Importer Seal (Official Warranty)
    const sealGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.02, 32);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xffb300,
      metalness: 0.95,
      roughness: 0.1,
    });
    const seal = new THREE.Mesh(sealGeo, sealMat);
    seal.rotation.x = Math.PI / 2;
    seal.position.set(0.75, 0.9, 0.71);
    packagingGroup.add(seal);

    // Front Window Display (Clear Acrylic)
    const windowGeo = new THREE.PlaneGeometry(1.4, 1.2);
    const windowMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      roughness: 0.05,
      transmission: 0.9,
    });
    const windowMesh = new THREE.Mesh(windowGeo, windowMat);
    windowMesh.position.set(0, 0.1, 0.705);
    packagingGroup.add(windowMesh);

    // Mini CPU visible through window in packaging mode
    const miniCpu = hardwareGroup.clone();
    miniCpu.scale.set(0.55, 0.55, 0.55);
    miniCpu.position.set(0, 0.1, 0.4);
    packagingGroup.add(miniCpu);

    // 8. Animation Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-rotation if enabled and in orbit/packaging mode
      if (isRotatingRef.current && (viewModeRef.current === "orbit" || viewModeRef.current === "packaging")) {
        modelGroup.rotation.y += 0.008;
      }

      // Smooth Transitions between View Modes
      const currentMode = viewModeRef.current;

      if (currentMode === "exploded") {
        hardwareGroup.visible = true;
        packagingGroup.visible = false;
        // Explode layers along Y axis
        ihs.position.y = THREE.MathUtils.lerp(ihs.position.y, 0.9, 0.08);
        diesGroup.position.y = THREE.MathUtils.lerp(diesGroup.position.y, 0.45, 0.08);
        substrate.position.y = THREE.MathUtils.lerp(substrate.position.y, 0.0, 0.08);
        pins.position.y = THREE.MathUtils.lerp(pins.position.y, -0.4, 0.08);
      } else if (currentMode === "packaging") {
        hardwareGroup.visible = false;
        packagingGroup.visible = true;
      } else if (currentMode === "ortho") {
        hardwareGroup.visible = true;
        packagingGroup.visible = false;
        // Snap to top-down isometric view
        modelGroup.rotation.y = THREE.MathUtils.lerp(modelGroup.rotation.y, 0, 0.1);
        modelGroup.rotation.x = THREE.MathUtils.lerp(modelGroup.rotation.x, 0.5, 0.1);
        ihs.position.y = THREE.MathUtils.lerp(ihs.position.y, 0.16, 0.1);
        diesGroup.position.y = THREE.MathUtils.lerp(diesGroup.position.y, 0.06, 0.1);
        pins.position.y = THREE.MathUtils.lerp(pins.position.y, -0.045, 0.1);
      } else {
        // Standard Orbit
        hardwareGroup.visible = true;
        packagingGroup.visible = false;
        ihs.position.y = THREE.MathUtils.lerp(ihs.position.y, 0.16, 0.1);
        diesGroup.position.y = THREE.MathUtils.lerp(diesGroup.position.y, 0.06, 0.1);
        pins.position.y = THREE.MathUtils.lerp(pins.position.y, -0.045, 0.1);
        modelGroup.rotation.x = THREE.MathUtils.lerp(modelGroup.rotation.x, 0, 0.1);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  // View Mode Switcher
  const handleSetMode = (mode: OmniPulseViewMode) => {
    setViewMode(mode);
    if (mode === "ortho") {
      setIsRotating(false);
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 3.5, 2.5);
      }
    } else {
      if (cameraRef.current) {
        cameraRef.current.position.set(0, 2.2, 4.0);
      }
    }
  };

  const handleZoom = (delta: number) => {
    const nextZoom = Math.min(Math.max(zoomPercent + delta, 60), 160);
    setZoomPercent(nextZoom);
    if (cameraRef.current) {
      const baseDistance = 4.0;
      const factor = 100 / nextZoom;
      cameraRef.current.position.z = baseDistance * factor;
    }
  };

  const handleReset = () => {
    setViewMode("orbit");
    setIsRotating(true);
    setZoomPercent(100);
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2.2, 4.0);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] sm:h-[540px] lg:h-[580px] bg-gradient-to-b from-[#0A2558] via-[#0D47A1] to-[#081B3D] rounded-2xl border border-[#0D47A1] overflow-hidden shadow-xl"
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Badge & Telemetry */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-[#061B3D]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-white font-sans text-xs">
          <span className="w-2 h-2 rounded-full bg-[#FFB300] animate-ping" />
          <span className="font-bold text-[#FFB300]">WebGL 3D Engine</span>
          <span className="text-white/40">|</span>
          <span className="text-blue-100 font-medium truncate max-w-[180px]">{productName}</span>
        </div>

        <div className="flex items-center gap-2 bg-[#061B3D]/80 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15 font-mono text-[11px] text-amber-300">
          <span>{viewMode.toUpperCase()} VIEW</span>
        </div>
      </div>

      {/* Interactive Controls Overlay Bar (Bottom) */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#061B3D]/90 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-lg">
          <button
            onClick={() => handleSetMode("orbit")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${
              viewMode === "orbit"
                ? "bg-[#FFB300] text-[#0D47A1] shadow-sm"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            360° Orbit
          </button>

          <button
            onClick={() => handleSetMode("ortho")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${
              viewMode === "ortho"
                ? "bg-[#FFB300] text-[#0D47A1] shadow-sm"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Orthogonal
          </button>

          <button
            onClick={() => handleSetMode("packaging")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${
              viewMode === "packaging"
                ? "bg-[#FFB300] text-[#0D47A1] shadow-sm"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Retail Box
          </button>

          <button
            onClick={() => handleSetMode("exploded")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${
              viewMode === "exploded"
                ? "bg-[#FFB300] text-[#0D47A1] shadow-sm"
                : "text-white/80 hover:text-white hover:bg-white/10"
            }`}
          >
            Exploded Layers
          </button>
        </div>

        {/* Zoom & Rotation Controls */}
        <div className="flex items-center gap-1 bg-[#061B3D]/90 backdrop-blur-md p-1 rounded-xl border border-white/15 text-white shadow-lg">
          <button
            onClick={() => handleZoom(15)}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-white font-bold text-sm"
            title="Zoom In"
          >
            +
          </button>
          <span className="font-mono text-[10px] px-1 text-amber-300">
            {zoomPercent}%
          </span>
          <button
            onClick={() => handleZoom(-15)}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 text-white font-bold text-sm"
            title="Zoom Out"
          >
            -
          </button>
          <div className="w-px h-4 bg-white/20 mx-0.5" />
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
              isRotating ? "text-[#FFB300] bg-amber-400/20" : "text-white/70 hover:bg-white/10"
            }`}
            title="Toggle Auto-Rotation"
          >
            {isRotating ? "Pause" : "Spin"}
          </button>
          <button
            onClick={handleReset}
            className="px-2 py-1 rounded-lg text-[11px] font-medium text-white/70 hover:text-white hover:bg-white/10"
            title="Reset View"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
