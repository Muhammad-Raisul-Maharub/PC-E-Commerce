"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type ViewMode = "orbit" | "explode" | "pinout" | "ortho";

export default function ComponentViewer3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("orbit");
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  // References for Three.js state
  const viewModeRef = useRef<ViewMode>("orbit");
  const zoomPercentRef = useRef<number>(100);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    zoomPercentRef.current = zoomPercent;
  }, [zoomPercent]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = null;

    // 2. Camera Setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 4.2);
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

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // controlled by our UI buttons
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.minPolarAngle = Math.PI / 6;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8);
    dirLight2.position.set(-5, -4, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    // 6. Floor Grid Helper
    const grid = new THREE.GridHelper(10, 25, 0x334155, 0x1e293b);
    grid.position.y = -1.2;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.4;
    scene.add(grid);

    // 7. Component Model Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Layer Groups for Exploded View
    const ihsGroup = new THREE.Group();
    const timGroup = new THREE.Group();
    const diesGroup = new THREE.Group();
    const substrateGroup = new THREE.Group();
    const pinoutGroup = new THREE.Group();

    modelGroup.add(substrateGroup);
    modelGroup.add(pinoutGroup);
    modelGroup.add(diesGroup);
    modelGroup.add(timGroup);
    modelGroup.add(ihsGroup);

    // A. Substrate PCB (Green)
    const subGeo = new THREE.BoxGeometry(2.8, 0.1, 2.8);
    const subMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      metalness: 0.3,
      roughness: 0.7,
    });
    const substrate = new THREE.Mesh(subGeo, subMat);
    substrateGroup.add(substrate);

    // Gold Substrate Edge Traces
    const edgeGeo = new THREE.PlaneGeometry(2.7, 2.7);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: 0xeab308,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.rotation.x = -Math.PI / 2;
    edge.position.y = 0.051;
    substrateGroup.add(edge);

    // B. LGA 1718 Pinout Array (Underside)
    const pinoutGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const pinoutMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.9,
      roughness: 0.15,
      side: THREE.DoubleSide,
    });
    const pinout = new THREE.Mesh(pinoutGeo, pinoutMat);
    pinout.rotation.x = Math.PI / 2;
    pinoutGroup.add(pinout);

    // Central Capacitor Island
    const capGeo = new THREE.BoxGeometry(0.9, 0.03, 0.9);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = -0.01;
    pinoutGroup.add(cap);

    // C. Silicon Dies (CCD + IOD)
    // Core Complex Die (CCD) with 3D V-Cache stack
    const ccdGeo = new THREE.BoxGeometry(0.9, 0.06, 0.8);
    const ccdMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      metalness: 0.6,
      roughness: 0.3,
    });
    const ccd = new THREE.Mesh(ccdGeo, ccdMat);
    ccd.position.set(0, 0, -0.3);
    diesGroup.add(ccd);

    // 3D V-Cache Silicon Cap
    const vcacheGeo = new THREE.BoxGeometry(0.8, 0.03, 0.7);
    const vcacheMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      metalness: 0.8,
      roughness: 0.2,
    });
    const vcache = new THREE.Mesh(vcacheGeo, vcacheMat);
    vcache.position.set(0, 0.04, -0.3);
    diesGroup.add(vcache);

    // I/O Die (IOD)
    const iodGeo = new THREE.BoxGeometry(1.2, 0.06, 0.9);
    const iodMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.7,
      roughness: 0.3,
    });
    const iod = new THREE.Mesh(iodGeo, iodMat);
    iod.position.set(0, 0, 0.45);
    diesGroup.add(iod);

    // D. Indium Solder / Liquid Metal TIM Layer
    const timGeo = new THREE.BoxGeometry(1.4, 0.04, 1.4);
    const timMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.95,
      roughness: 0.1,
    });
    const tim = new THREE.Mesh(timGeo, timMat);
    timGroup.add(tim);

    // E. Integrated Heat Spreader (IHS - Nickel Plated Copper)
    const ihsGeo = new THREE.BoxGeometry(2.4, 0.22, 2.4);
    const ihsMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ihs = new THREE.Mesh(ihsGeo, ihsMat);
    ihsGroup.add(ihs);

    // AM5 Heatspreader Cutout Legs
    [-1.0, 1.0].forEach((x) => {
      [-1.0, 1.0].forEach((z) => {
        const legGeo = new THREE.BoxGeometry(0.3, 0.15, 0.3);
        const legMat = new THREE.MeshStandardMaterial({
          color: 0xcbd5e1,
          metalness: 0.8,
          roughness: 0.3,
        });
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(x, -0.05, z);
        ihsGroup.add(leg);
      });
    });

    // Laser Engraved Brand Mark on IHS
    const markGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const markMat = new THREE.MeshBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.6,
    });
    const mark = new THREE.Mesh(markGeo, markMat);
    mark.rotation.x = -Math.PI / 2;
    mark.position.y = 0.115;
    ihsGroup.add(mark);

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 9. Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const currentMode = viewModeRef.current;
      const currentZoom = zoomPercentRef.current / 100;

      // Apply zoom scale smoothly
      modelGroup.scale.lerp(
        new THREE.Vector3(currentZoom, currentZoom, currentZoom),
        0.1
      );

      // Target separation heights based on Explode mode
      const targetIhsY = currentMode === "explode" ? 1.4 : 0.22;
      const targetTimY = currentMode === "explode" ? 0.9 : 0.12;
      const targetDiesY = currentMode === "explode" ? 0.45 : 0.08;
      const targetPinoutY = currentMode === "explode" ? -0.5 : -0.06;

      ihsGroup.position.y = THREE.MathUtils.lerp(ihsGroup.position.y, targetIhsY, 0.1);
      timGroup.position.y = THREE.MathUtils.lerp(timGroup.position.y, targetTimY, 0.1);
      diesGroup.position.y = THREE.MathUtils.lerp(diesGroup.position.y, targetDiesY, 0.1);
      pinoutGroup.position.y = THREE.MathUtils.lerp(pinoutGroup.position.y, targetPinoutY, 0.1);

      // Rotations per mode
      if (currentMode === "pinout") {
        modelGroup.rotation.x = THREE.MathUtils.lerp(modelGroup.rotation.x, Math.PI * 0.85, 0.08);
        modelGroup.rotation.y = THREE.MathUtils.lerp(modelGroup.rotation.y, 0, 0.08);
      } else if (currentMode === "ortho") {
        modelGroup.rotation.x = THREE.MathUtils.lerp(modelGroup.rotation.x, Math.PI / 2, 0.08);
        modelGroup.rotation.y = THREE.MathUtils.lerp(modelGroup.rotation.y, 0, 0.08);
      } else {
        // Orbit mode: subtle auto-spin
        modelGroup.rotation.x = THREE.MathUtils.lerp(modelGroup.rotation.x, 0.35, 0.05);
        modelGroup.rotation.y += delta * 0.4;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 10. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, []);

  const adjustZoom = (delta: number) => {
    setZoomPercent((prev) => Math.min(150, Math.max(70, prev + delta)));
  };

  const resetView = () => {
    setViewMode("orbit");
    setZoomPercent(100);
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 2.5, 4.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full relative flex flex-col bg-slate-950 rounded border border-slate-800 overflow-hidden shadow-xl"
    >
      {/* Upper Status Badges */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <span className="bg-slate-900/90 backdrop-blur border border-slate-700/80 px-2.5 py-1 rounded font-mono text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          REALTIME CAD (WEBGL)
        </span>
        <span className="bg-slate-900/90 backdrop-blur border border-slate-700/80 px-2 py-1 rounded font-mono text-[10px] text-slate-300">
          SOCKET: AM5 (LGA1718)
        </span>
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="bg-slate-900/90 backdrop-blur border border-slate-700/80 px-2 py-1 rounded font-mono text-[10px] text-slate-300">
          SUBSTRATE: 40 x 40 mm
        </span>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div className="w-full h-80 sm:h-96 relative">
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
      </div>

      {/* Bottom Interactive Toolbar Matching Stitch Design */}
      <div className="bg-slate-900 border-t border-slate-800 p-2 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode("orbit")}
            className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold flex items-center gap-1 transition-all ${
              viewMode === "orbit"
                ? "bg-[#EF4444] text-white shadow"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">360</span>
            <span>Orbit 360°</span>
          </button>

          <button
            onClick={() => setViewMode("explode")}
            className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold flex items-center gap-1 transition-all ${
              viewMode === "explode"
                ? "bg-[#EF4444] text-white shadow"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">view_in_ar</span>
            <span>Explode Layers</span>
          </button>

          <button
            onClick={() => setViewMode("pinout")}
            className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold flex items-center gap-1 transition-all ${
              viewMode === "pinout"
                ? "bg-[#EF4444] text-white shadow"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">grain</span>
            <span>Pinout (1718 LGA)</span>
          </button>

          <button
            onClick={() => setViewMode("ortho")}
            className={`px-2.5 py-1 rounded font-mono text-[11px] font-semibold flex items-center gap-1 transition-all ${
              viewMode === "ortho"
                ? "bg-[#EF4444] text-white shadow"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">grid_4x4</span>
            <span>Orthographic</span>
          </button>
        </div>

        {/* Zoom Steppers & Camera Reset */}
        <div className="flex items-center gap-1.5 px-2 text-slate-300 font-mono text-[11px]">
          <button
            onClick={() => adjustZoom(-10)}
            className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
            title="Zoom Out"
          >
            -
          </button>
          <span className="w-10 text-center font-bold">{zoomPercent}%</span>
          <button
            onClick={() => adjustZoom(10)}
            className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={resetView}
            className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded text-slate-400 hover:text-white ml-1"
            title="Reset Camera"
          >
            <span className="material-symbols-outlined text-[14px]">restart_alt</span>
          </button>
        </div>
      </div>
    </div>
  );
}
