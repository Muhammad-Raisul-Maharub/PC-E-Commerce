"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function WaterBlockExploded3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isExploded, setIsExploded] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);

  const isExplodedRef = useRef<boolean>(false);
  const zoomPercentRef = useRef<number>(100);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    isExplodedRef.current = isExploded;
  }, [isExploded]);

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
    const height = container.clientHeight || 420;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 4.4);
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
    controls.maxPolarAngle = Math.PI / 1.9;
    controls.minDistance = 2.0;
    controls.maxDistance = 10.0;
    controlsRef.current = controls;

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const cyanRim = new THREE.DirectionalLight(0x00f0ff, 2.0);
    cyanRim.position.set(-6, -2, -4);
    scene.add(cyanRim);

    // 6. Master Assembly Group
    const blockGroup = new THREE.Group();
    scene.add(blockGroup);

    // Layer Groups
    const pcbGroup = new THREE.Group();
    const vramPadGroup = new THREE.Group();
    const copperPlateGroup = new THREE.Group();
    const oringGroup = new THREE.Group();
    const plexiTopGroup = new THREE.Group();
    const terminalGroup = new THREE.Group();

    blockGroup.add(pcbGroup);
    blockGroup.add(vramPadGroup);
    blockGroup.add(copperPlateGroup);
    blockGroup.add(oringGroup);
    blockGroup.add(plexiTopGroup);
    blockGroup.add(terminalGroup);

    // Layer 1: GPU PCB (Bottom)
    const pcbGeo = new THREE.BoxGeometry(3.6, 0.08, 1.8);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.5,
      roughness: 0.5,
    });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcbGroup.add(pcb);

    // AD102 Silicon GPU Die in center
    const dieGeo = new THREE.BoxGeometry(0.8, 0.04, 0.8);
    const dieMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.9,
      roughness: 0.1,
    });
    const die = new THREE.Mesh(dieGeo, dieMat);
    die.position.set(0, 0.05, 0);
    pcbGroup.add(die);

    // Layer 2: Thermal Pads on VRAM
    const padGeo = new THREE.BoxGeometry(0.3, 0.02, 0.3);
    const padMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.8 });
    [-0.6, 0.6].forEach((x) => {
      [-0.6, 0.6].forEach((z) => {
        const pad = new THREE.Mesh(padGeo, padMat);
        pad.position.set(x, 0.05, z);
        vramPadGroup.add(pad);
      });
    });

    // Layer 3: Electrolytic Copper Cold Plate with CNC Micro-Fins
    const copperGeo = new THREE.BoxGeometry(3.4, 0.16, 1.6);
    const copperMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.95,
      roughness: 0.15,
    });
    const copperPlate = new THREE.Mesh(copperGeo, copperMat);
    copperPlateGroup.add(copperPlate);

    // Nickel Plated Center Jet Plate Area
    const finAreaGeo = new THREE.BoxGeometry(1.2, 0.04, 1.0);
    const finAreaMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: true,
    });
    const finArea = new THREE.Mesh(finAreaGeo, finAreaMat);
    finArea.position.set(0, 0.09, 0);
    copperPlateGroup.add(finArea);

    // Layer 4: EPDM Sealing O-Ring Loop
    const oringGeo = new THREE.TorusGeometry(0.7, 0.02, 8, 32);
    const oringMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.9 });
    const oring = new THREE.Mesh(oringGeo, oringMat);
    oring.rotation.x = Math.PI / 2;
    oringGroup.add(oring);

    // Layer 5: High-Transparency Cast Acrylic Plexi Top
    const plexiGeo = new THREE.BoxGeometry(3.4, 0.25, 1.6);
    const plexiMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transmission: 0.9,
      roughness: 0.05,
      transparent: true,
      opacity: 0.45,
    });
    const plexi = new THREE.Mesh(plexiGeo, plexiMat);
    plexiTopGroup.add(plexi);

    // Internal Neon Cyan Fluid Channel
    const flowGeo = new THREE.BoxGeometry(2.8, 0.06, 1.1);
    const flowMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.75,
    });
    const flow = new THREE.Mesh(flowGeo, flowMat);
    flow.position.set(0, -0.02, 0);
    plexiTopGroup.add(flow);

    // Layer 6: Acetal Terminal Block with G1/4 Ports
    const terminalGeo = new THREE.BoxGeometry(1.0, 0.4, 0.6);
    const terminalMat = new THREE.MeshStandardMaterial({
      color: 0x12121a,
      metalness: 0.8,
      roughness: 0.3,
    });
    const terminal = new THREE.Mesh(terminalGeo, terminalMat);
    terminal.position.set(1.1, 0.1, 0.45);
    terminalGroup.add(terminal);

    // G1/4 Brass Ports
    const portGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    const portMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.9 });
    const p1 = new THREE.Mesh(portGeo, portMat);
    p1.position.set(0.95, 0.32, 0.45);
    terminalGroup.add(p1);
    const p2 = new THREE.Mesh(portGeo, portMat);
    p2.position.set(1.25, 0.32, 0.45);
    terminalGroup.add(p2);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const exploded = isExplodedRef.current;
      const zoom = zoomPercentRef.current / 100;

      blockGroup.scale.lerp(new THREE.Vector3(zoom, zoom, zoom), 0.1);

      // Target layer heights
      const targetPcbY = exploded ? -1.4 : -0.15;
      const targetPadY = exploded ? -0.8 : -0.08;
      const targetCopperY = exploded ? -0.2 : 0.05;
      const targetOringY = exploded ? 0.4 : 0.14;
      const targetPlexiY = exploded ? 1.0 : 0.25;
      const targetTerminalY = exploded ? 1.7 : 0.35;

      pcbGroup.position.y = THREE.MathUtils.lerp(pcbGroup.position.y, targetPcbY, 0.1);
      vramPadGroup.position.y = THREE.MathUtils.lerp(vramPadGroup.position.y, targetPadY, 0.1);
      copperPlateGroup.position.y = THREE.MathUtils.lerp(copperPlateGroup.position.y, targetCopperY, 0.1);
      oringGroup.position.y = THREE.MathUtils.lerp(oringGroup.position.y, targetOringY, 0.1);
      plexiTopGroup.position.y = THREE.MathUtils.lerp(plexiTopGroup.position.y, targetPlexiY, 0.1);
      terminalGroup.position.y = THREE.MathUtils.lerp(terminalGroup.position.y, targetTerminalY, 0.1);

      // Gentle auto orbit rotation
      blockGroup.rotation.y += delta * 0.25;

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

  return (
    <div
      ref={containerRef}
      className="relative w-full h-80 sm:h-96 bg-[#0A0A0F] rounded-xl overflow-hidden border border-cyan-500/30 shadow-2xl"
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Viewport Overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <span className="bg-[#0A0A0F]/85 border border-cyan-500/40 px-2.5 py-1 rounded font-mono text-[10px] text-cyan-300 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          EXPLODED CAD VIEWPORT // EK-VECTOR²
        </span>
      </div>

      {/* Explode / Assemble Toggle */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isExploded
                ? "bg-[#00F0FF] text-[#0A0A0F] border-[#00F0FF] shadow-lg shadow-cyan-500/30"
                : "bg-[#12121A] text-slate-200 border-cyan-500/30 hover:border-cyan-400"
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {isExploded ? "layers_clear" : "view_in_ar"}
            </span>
            <span>{isExploded ? "Assemble Block" : "Explode Assembly"}</span>
          </button>
        </div>

        <div className="flex items-center gap-1 bg-[#12121A]/80 border border-slate-700 px-2 py-1 rounded-lg text-slate-300 font-mono text-[11px]">
          <button
            onClick={() => setZoomPercent((prev) => Math.max(70, prev - 10))}
            className="w-5 h-5 flex items-center justify-center hover:text-white"
          >
            -
          </button>
          <span className="w-8 text-center">{zoomPercent}%</span>
          <button
            onClick={() => setZoomPercent((prev) => Math.min(140, prev + 10))}
            className="w-5 h-5 flex items-center justify-center hover:text-white"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
