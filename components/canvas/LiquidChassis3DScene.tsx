"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface LiquidChassisProps {
  coolantColor: string; // e.g. '#00F0FF', '#10B981', '#8B5CF6', '#EF4444'
}

export default function LiquidChassis3DScene({ coolantColor = "#00F0FF" }: LiquidChassisProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const coolantColorRef = useRef<string>(coolantColor);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    coolantColorRef.current = coolantColor;
  }, [coolantColor]);

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
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(4.8, 3.2, 5.2);
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
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 3.0;
    controls.maxDistance = 14.0;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controlsRef.current = controls;

    // 5. Studio-Grade Enhanced HDR Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const mainSpot = new THREE.DirectionalLight(0xffffff, 3.8);
    mainSpot.position.set(5, 9, 6);
    scene.add(mainSpot);

    const fillLight = new THREE.DirectionalLight(0xffffff, 2.0);
    fillLight.position.set(-6, 4, -4);
    scene.add(fillLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 3.0);
    cyanRimLight.position.set(-6, -2, -4);
    scene.add(cyanRimLight);

    const frontLight = new THREE.PointLight(0xffffff, 1.8, 25);
    frontLight.position.set(0, 3, 5);
    scene.add(frontLight);

    const orangeUnderGlow = new THREE.PointLight(0xff6b00, 2.0, 10);
    orangeUnderGlow.position.set(0, -0.5, 0);
    scene.add(orangeUnderGlow);

    // Dynamic Coolant Glow PointLight
    const coolantGlow = new THREE.PointLight(new THREE.Color(coolantColor), 3.0, 6);
    coolantGlow.position.set(1.4, 1.2, 0.5);
    scene.add(coolantGlow);

    // 6. Floor Grid (Isometric Cyberpunk Pattern)
    const grid = new THREE.GridHelper(14, 28, 0x00f0ff, 0x1f1f25);
    grid.position.y = -1.6;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.3;
    scene.add(grid);

    // 7. Master Rig Group
    const rigGroup = new THREE.Group();
    scene.add(rigGroup);

    // A. Chassis Outer Frame (Matte Anodized Aluminum)
    const frameGeo = new THREE.BoxGeometry(3.6, 4.2, 2.4);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x12121a,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });
    // Inner cavity cut by geometry representation
    const backPanelGeo = new THREE.BoxGeometry(3.5, 4.1, 0.08);
    const backPanel = new THREE.Mesh(backPanelGeo, frameMat);
    backPanel.position.set(0, 0.5, -1.15);
    rigGroup.add(backPanel);

    const bottomChamberGeo = new THREE.BoxGeometry(3.5, 0.8, 2.3);
    const bottomChamberMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0f,
      metalness: 0.9,
      roughness: 0.2,
    });
    const bottomChamber = new THREE.Mesh(bottomChamberGeo, bottomChamberMat);
    bottomChamber.position.set(0, -1.2, 0);
    rigGroup.add(bottomChamber);

    // PSU Shroud Cutout with Neon Brand
    const shroudBrandGeo = new THREE.PlaneGeometry(1.6, 0.3);
    const shroudBrandMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85,
    });
    const shroudBrand = new THREE.Mesh(shroudBrandGeo, shroudBrandMat);
    shroudBrand.position.set(0, -1.2, 1.16);
    rigGroup.add(shroudBrand);

    // B. Tempered Glass Side Panel (Tinted Crystal)
    const glassGeo = new THREE.BoxGeometry(3.5, 3.3, 0.05);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.7,
      transparent: true,
      opacity: 0.35,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 0.8, 1.16);
    rigGroup.add(glass);

    // C. Motherboard Tray & PCB
    const moboGeo = new THREE.BoxGeometry(2.4, 2.8, 0.08);
    const moboMat = new THREE.MeshStandardMaterial({
      color: 0x131318,
      metalness: 0.6,
      roughness: 0.4,
    });
    const mobo = new THREE.Mesh(moboGeo, moboMat);
    mobo.position.set(-0.3, 0.8, -0.95);
    rigGroup.add(mobo);

    // D. CPU Water Block (Direct Die Nickel + Plexi)
    const cpuWbGeo = new THREE.BoxGeometry(0.7, 0.7, 0.3);
    const cpuWbMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.9,
      roughness: 0.15,
    });
    const cpuWb = new THREE.Mesh(cpuWbGeo, cpuWbMat);
    cpuWb.position.set(-0.3, 1.2, -0.75);
    rigGroup.add(cpuWb);

    // CPU Water Block glowing coolant core
    const cpuCoolantGeo = new THREE.BoxGeometry(0.4, 0.4, 0.1);
    const coolantMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(coolantColor),
    });
    const cpuCoolant = new THREE.Mesh(cpuCoolantGeo, coolantMaterial);
    cpuCoolant.position.set(-0.3, 1.2, -0.58);
    rigGroup.add(cpuCoolant);

    // E. GPU Water Block (Full Coverage Horizontal)
    const gpuGeo = new THREE.BoxGeometry(2.6, 0.18, 0.8);
    const gpuMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.2,
    });
    const gpu = new THREE.Mesh(gpuGeo, gpuMat);
    gpu.position.set(-0.2, 0.2, -0.3);
    rigGroup.add(gpu);

    // GPU Acrylic flow channel
    const gpuFlowGeo = new THREE.BoxGeometry(2.2, 0.04, 0.6);
    const gpuFlow = new THREE.Mesh(gpuFlowGeo, coolantMaterial);
    gpuFlow.position.set(-0.2, 0.3, -0.3);
    rigGroup.add(gpuFlow);

    // F. Distro Plate / D5 Pump Reservoir (Right Vertical Bay)
    const distroGeo = new THREE.BoxGeometry(0.4, 3.2, 1.6);
    const distroGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transmission: 0.85,
      roughness: 0.05,
      transparent: true,
      opacity: 0.45,
    });
    const distro = new THREE.Mesh(distroGeo, distroGlassMat);
    distro.position.set(1.4, 0.8, 0);
    rigGroup.add(distro);

    // Distro Plate Internal Fluid Volume
    const fluidGeo = new THREE.BoxGeometry(0.25, 2.9, 1.4);
    const fluidMesh = new THREE.Mesh(fluidGeo, coolantMaterial);
    fluidMesh.position.set(1.4, 0.8, 0);
    rigGroup.add(fluidMesh);

    // D5 Pump Base Cylinder
    const pumpGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.position.set(1.4, -0.85, 0.2);
    rigGroup.add(pump);

    // G. Top 360mm Liquid Cooling Radiator with Triple RGB Fans
    const radGeo = new THREE.BoxGeometry(3.2, 0.35, 1.2);
    const radMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7 });
    const rad = new THREE.Mesh(radGeo, radMat);
    rad.position.set(0, 2.3, 0);
    rigGroup.add(rad);

    // Triple RGB Fan Rings
    const fanRings: THREE.Mesh[] = [];
    [-0.9, 0, 0.9].forEach((xPos) => {
      const ringGeo = new THREE.RingGeometry(0.3, 0.42, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(coolantColor),
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(xPos, 2.1, 0);
      rigGroup.add(ring);
      fanRings.push(ring);
    });

    // H. Hardline PETG Tubing Loop Lines (Clear cylinders with glowing inner fluid)
    const tubes: THREE.Mesh[] = [];
    // Tube 1: Distro to GPU
    const t1Geo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 12);
    const t1 = new THREE.Mesh(t1Geo, coolantMaterial);
    t1.rotation.z = Math.PI / 2;
    t1.position.set(0.6, 0.25, 0.1);
    rigGroup.add(t1);
    tubes.push(t1);

    // Tube 2: GPU to CPU
    const t2Geo = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 12);
    const t2 = new THREE.Mesh(t2Geo, coolantMaterial);
    t2.position.set(-0.3, 0.7, -0.6);
    rigGroup.add(t2);
    tubes.push(t2);

    // Tube 3: CPU to Top Radiator
    const t3Geo = new THREE.CylinderGeometry(0.04, 0.04, 0.9, 12);
    const t3 = new THREE.Mesh(t3Geo, coolantMaterial);
    t3.position.set(-0.3, 1.7, -0.6);
    rigGroup.add(t3);
    tubes.push(t3);

    // Tube 4: Top Radiator to Distro Plate
    const t4Geo = new THREE.CylinderGeometry(0.04, 0.04, 1.3, 12);
    const t4 = new THREE.Mesh(t4Geo, coolantMaterial);
    t4.rotation.z = Math.PI / 4;
    t4.position.set(0.8, 1.8, 0.1);
    rigGroup.add(t4);
    tubes.push(t4);

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

    // 9. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Dynamic color update from ref
      const currentC = new THREE.Color(coolantColorRef.current);
      coolantMaterial.color.lerp(currentC, 0.1);
      coolantGlow.color.lerp(currentC, 0.1);
      fanRings.forEach((r) => {
        (r.material as THREE.MeshBasicMaterial).color.lerp(currentC, 0.1);
      });

      // Subtle breathing float
      rigGroup.position.y = Math.sin(elapsedTime * 0.7) * 0.04;

      // Pulse fluid glow
      const pulse = 2.5 + Math.sin(elapsedTime * 3.5) * 0.6;
      coolantGlow.intensity = pulse;

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

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(4.8, 3.2, 5.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
      if (offset.length() > controls.minDistance + 0.5) {
        offset.multiplyScalar(0.8);
        camera.position.addVectors(controls.target, offset);
        controls.update();
      }
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current;
      const controls = controlsRef.current;
      const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
      if (offset.length() < controls.maxDistance - 0.5) {
        offset.multiplyScalar(1.25);
        camera.position.addVectors(controls.target, offset);
        controls.update();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-[600px] bg-gradient-to-b from-[#0A0A0F] via-[#12121A] to-[#0A0A0F] rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_40px_rgba(0,240,255,0.15)]"
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Top Telemetry Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-[#0A0A0F]/85 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-cyan-500/30 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300 font-bold">
            NEONFORGE // LIQUID LOOP ARCHITECTURE
          </span>
        </div>

        <div className="bg-[#0A0A0F]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/80 flex items-center space-x-2">
          <span className="font-mono text-[11px] text-slate-300">
            FLOW: 4.2 L/MIN • D5 PWM
          </span>
        </div>
      </div>

      {/* Coolant Status Badge & Delta T Readout */}
      <div className="absolute bottom-4 left-4 pointer-events-auto bg-[#0A0A0F]/90 backdrop-blur-md p-3.5 rounded-xl border border-cyan-500/30 shadow-xl max-w-[280px]">
        <div className="flex items-center justify-between pb-1.5 border-b border-white/10 mb-2">
          <span className="font-mono text-[10px] text-slate-400 uppercase">Loop Telemetry</span>
          <span className="font-mono text-[10px] text-cyan-400 font-bold">PUMP: 3400 RPM</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-white text-xs font-bold">Fluid Temperature</span>
          <span className="font-mono text-sm font-extrabold text-[#00F0FF]">28.4°C</span>
        </div>
        <div className="flex items-baseline justify-between mt-1">
          <span className="text-slate-400 text-xs">Delta-T to Ambient</span>
          <span className="font-mono text-xs font-semibold text-emerald-400">+5.2°C</span>
        </div>
      </div>

      {/* Camera Reset & Zoom Controls */}
      <div className="absolute bottom-4 right-4 pointer-events-auto flex items-center space-x-2">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-[#12121A]/90 hover:bg-[#1E1E2D] text-cyan-400 rounded-lg border border-cyan-500/30 font-mono text-sm font-bold flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-[#12121A]/90 hover:bg-[#1E1E2D] text-cyan-400 rounded-lg border border-cyan-500/30 font-mono text-sm font-bold flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
          title="Zoom Out"
        >
          -
        </button>
        <button
          onClick={handleResetCamera}
          className="px-3 py-1.5 bg-[#12121A]/90 hover:bg-[#1E1E2D] text-slate-300 rounded-lg border border-cyan-500/30 font-mono text-[11px] flex items-center space-x-1.5 backdrop-blur-md transition-colors"
        >
          <span className="material-symbols-outlined text-[14px] text-cyan-400">restart_alt</span>
          <span>Reset Stage</span>
        </button>
      </div>
    </div>
  );
}
