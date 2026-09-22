"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface Hotspot {
  id: string;
  name: string;
  category: string;
  spec: string;
  position: [number, number, number];
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "socket",
    name: "LGA1851 / AM5 Direct Die Socket",
    category: "Processor Interface",
    spec: "Sub-0.5ps signal jitter • 170W+ sustained PPT support",
    position: [0, 0.6, -0.3],
  },
  {
    id: "ddr5",
    name: "Quad DDR5 Reinforced DIMM Slots",
    category: "Memory Architecture",
    spec: "Up to 8000+ MT/s (EXPO & XMP 3.0) • Isolated copper traces",
    position: [1.55, 0.6, -0.3],
  },
  {
    id: "pcie5",
    name: "PCIe 5.0 x16 SafeSlot Steel Core",
    category: "GPU Bus Subsystem",
    spec: "128 GB/s bi-directional bandwidth • Dual shear anchor pins",
    position: [-0.3, 0.6, 0.8],
  },
  {
    id: "m2",
    name: "M.2 Gen 5 NVMe Thermal Guard XL",
    category: "Storage Interface",
    spec: "14,000 MB/s sustained sequential reads • Direct heatpipe array",
    position: [-0.3, 0.6, 1.6],
  },
];

export default function Motherboard3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedPin, setSelectedPin] = useState<string>(HOTSPOTS[0].name);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot>(HOTSPOTS[0]);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);

  // References for Three.js instances to allow external control
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = null; // transparent canvas

    // 2. Camera Setup
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.5, 4.2, 5.0);
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
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below floor
    controls.minDistance = 2.5;
    controls.maxDistance = 12.0;
    controls.autoRotate = isAutoRotate;
    controls.autoRotateSpeed = 1.0;
    controlsRef.current = controls;

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(6, 10, 8);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const crimsonRimLight = new THREE.DirectionalLight(0xef4444, 2.0);
    crimsonRimLight.position.set(-6, 3, -6);
    scene.add(crimsonRimLight);

    const fillLight = new THREE.PointLight(0x38bdf8, 1.5, 15);
    fillLight.position.set(0, 4, 3);
    scene.add(fillLight);

    // 6. Floor Grid
    const grid = new THREE.GridHelper(12, 24, 0xef4444, 0x1e293b);
    grid.position.y = -0.5;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.3;
    scene.add(grid);

    // 7. Motherboard Model Group
    const mbGroup = new THREE.Group();
    mbGroup.rotation.set(-0.25, -0.3, 0);
    scene.add(mbGroup);

    // A. Main Motherboard PCB
    const pcbGeo = new THREE.BoxGeometry(4.2, 0.1, 4.6);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.6,
      metalness: 0.3,
    });
    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.position.set(0, -0.05, 0);
    pcbMesh.receiveShadow = true;
    mbGroup.add(pcbMesh);

    // PCB Circuit Traces Plane
    const traceGeo = new THREE.PlaneGeometry(4.1, 4.5, 16, 16);
    const traceMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const traceMesh = new THREE.Mesh(traceGeo, traceMat);
    traceMesh.rotation.x = -Math.PI / 2;
    traceMesh.position.y = 0.005;
    mbGroup.add(traceMesh);

    // B. CPU Socket Area
    const socketFrameGeo = new THREE.BoxGeometry(1.5, 0.12, 1.5);
    const socketFrameMat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.85,
      roughness: 0.2,
    });
    const socketFrame = new THREE.Mesh(socketFrameGeo, socketFrameMat);
    socketFrame.position.set(0, 0.06, -0.3);
    mbGroup.add(socketFrame);

    const socketPinsGeo = new THREE.BoxGeometry(1.2, 0.04, 1.2);
    const socketPinsMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      metalness: 0.9,
      roughness: 0.1,
    });
    const socketPins = new THREE.Mesh(socketPinsGeo, socketPinsMat);
    socketPins.position.set(0, 0.12, -0.3);
    mbGroup.add(socketPins);

    // C. VRM Aluminum Heatsink Blocks
    const vrmLeftGeo = new THREE.BoxGeometry(0.7, 0.6, 2.2);
    const vrmMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.75,
      roughness: 0.25,
    });
    const vrmLeft = new THREE.Mesh(vrmLeftGeo, vrmMat);
    vrmLeft.position.set(-1.4, 0.3, -0.3);
    mbGroup.add(vrmLeft);

    const vrmTopGeo = new THREE.BoxGeometry(2.0, 0.6, 0.7);
    const vrmTop = new THREE.Mesh(vrmTopGeo, vrmMat);
    vrmTop.position.set(0, 0.3, -1.6);
    mbGroup.add(vrmTop);

    // Heatsink crimson badge
    const badgeGeo = new THREE.BoxGeometry(0.05, 0.1, 1.2);
    const badgeMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.4,
    });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(-1.03, 0.4, -0.3);
    mbGroup.add(badge);

    // D. 4x DDR5 Slots
    const ddrPositions = [1.2, 1.38, 1.56, 1.74];
    ddrPositions.forEach((xPos, idx) => {
      // Slot base
      const slotGeo = new THREE.BoxGeometry(0.08, 0.2, 2.4);
      const slotMat = new THREE.MeshStandardMaterial({
        color: idx % 2 === 0 ? 0x0f172a : 0x334155,
        roughness: 0.4,
      });
      const slot = new THREE.Mesh(slotGeo, slotMat);
      slot.position.set(xPos, 0.1, -0.3);
      mbGroup.add(slot);

      // Memory sticks inside
      const stickGeo = new THREE.BoxGeometry(0.04, 0.5, 2.3);
      const stickMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.8,
        roughness: 0.2,
      });
      const stick = new THREE.Mesh(stickGeo, stickMat);
      stick.position.set(xPos, 0.35, -0.3);
      mbGroup.add(stick);

      // RGB top strip
      const rgbGeo = new THREE.BoxGeometry(0.04, 0.05, 2.3);
      const rgbMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.6,
      });
      const rgb = new THREE.Mesh(rgbGeo, rgbMat);
      rgb.position.set(xPos, 0.62, -0.3);
      mbGroup.add(rgb);
    });

    // E. PCIe Gen 5.0 x16 Slots
    const pciePositions = [0.8, 1.7];
    pciePositions.forEach((zPos) => {
      const pcieGeo = new THREE.BoxGeometry(2.8, 0.18, 0.14);
      const pcieMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.8,
        roughness: 0.3,
      });
      const pcie = new THREE.Mesh(pcieGeo, pcieMat);
      pcie.position.set(-0.3, 0.09, zPos);
      mbGroup.add(pcie);
    });

    // F. M.2 NVMe Aluminum Armor
    const m2Geo = new THREE.BoxGeometry(1.6, 0.14, 0.45);
    const m2Mat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.7,
      roughness: 0.3,
    });
    const m2Shield1 = new THREE.Mesh(m2Geo, m2Mat);
    m2Shield1.position.set(-0.3, 0.07, 0.3);
    mbGroup.add(m2Shield1);

    const m2Shield2 = new THREE.Mesh(m2Geo, m2Mat);
    m2Shield2.position.set(-0.3, 0.07, 1.25);
    mbGroup.add(m2Shield2);

    // G. Chipset Heatsink (Bottom Right)
    const chipsetGeo = new THREE.BoxGeometry(1.2, 0.22, 1.2);
    const chipsetMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2,
    });
    const chipset = new THREE.Mesh(chipsetGeo, chipsetMat);
    chipset.position.set(1.2, 0.11, 1.3);
    mbGroup.add(chipset);

    // 8. Hotspot Pin Meshes
    const pinMeshes: THREE.Group[] = [];
    HOTSPOTS.forEach((h) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(...h.position);

      // Outer pulsing ring
      const ringGeo = new THREE.RingGeometry(0.08, 0.12, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      pinGroup.add(ring);

      // Core sphere
      const sphereGeo = new THREE.SphereGeometry(0.05, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0xef4444,
        emissiveIntensity: 0.8,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      pinGroup.add(sphere);

      // Vertical marker pin line
      const lineGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.4, 8);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.position.y = -0.2;
      pinGroup.add(line);

      mbGroup.add(pinGroup);
      pinMeshes.push(pinGroup);
    });

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 10. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating animation
      mbGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.05;

      // Pulse pin rings
      pinMeshes.forEach((p, idx) => {
        const scale = 1.0 + Math.sin(elapsedTime * 3.0 + idx) * 0.25;
        p.scale.set(scale, scale, scale);
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 11. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, [isAutoRotate]);

  // Handle Hotspot Select
  const handleSelectHotspot = (hotspot: Hotspot) => {
    setActiveHotspot(hotspot);
    setSelectedPin(hotspot.name);
  };

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(4.5, 4.2, 5.0);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] lg:h-[560px] bg-gradient-to-b from-[#0F172A]/90 to-[#020617] rounded-xl overflow-hidden border border-slate-800 shadow-2xl"
    >
      {/* Three.js Native WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* Top Telemetry Header Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="bg-[#0F172A]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-slate-200">
            PROTOTYPE CAD // VM-X870E ARCHITECTURE
          </span>
        </div>

        <div className="bg-[#0F172A]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
          <span className="font-mono text-[11px] text-slate-300">
            60 FPS // OPENGL SHADING
          </span>
        </div>
      </div>

      {/* Hotspot Chips Selector */}
      <div className="absolute top-16 left-4 flex flex-col space-y-1.5 max-w-[260px]">
        {HOTSPOTS.map((h) => {
          const isSelected = activeHotspot.id === h.id;
          return (
            <button
              key={h.id}
              onClick={() => handleSelectHotspot(h)}
              className={`text-left px-2.5 py-1.5 rounded text-[11px] font-mono transition-all border ${
                isSelected
                  ? "bg-[#EF4444] text-white border-[#EF4444] shadow-md shadow-red-900/40"
                  : "bg-[#0F172A]/70 hover:bg-[#1E293B] text-slate-300 border-slate-700/60 backdrop-blur-sm"
              }`}
            >
              <div className="flex items-center space-x-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? "bg-white" : "bg-red-400"
                  }`}
                />
                <span className="font-bold truncate">{h.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Hotspot Detailed Telemetry Card */}
      <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-[#0F172A]/90 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl pointer-events-auto">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span className="font-mono text-xs font-bold text-white uppercase">
              {activeHotspot.category}
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400 uppercase">
            ID: {activeHotspot.id.toUpperCase()}-VERIFIED
          </span>
        </div>
        <h4 className="text-white text-sm font-bold tracking-tight mb-1">
          {activeHotspot.name}
        </h4>
        <p className="font-mono text-[11px] text-slate-300 leading-relaxed">
          {activeHotspot.spec}
        </p>
      </div>

      {/* Bottom Left Camera Controls */}
      <div className="absolute bottom-4 left-4 hidden md:flex items-center space-x-2">
        <button
          onClick={handleResetCamera}
          className="px-2.5 py-1.5 bg-[#0F172A]/80 hover:bg-[#1E293B] text-slate-300 rounded border border-slate-700 font-mono text-[11px] flex items-center space-x-1 backdrop-blur-sm transition-colors"
          title="Reset Orbit Camera"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span>Reset Cam</span>
        </button>

        <button
          onClick={() => {
            const nextState = !isAutoRotate;
            setIsAutoRotate(nextState);
            if (controlsRef.current) {
              controlsRef.current.autoRotate = nextState;
            }
          }}
          className={`px-2.5 py-1.5 rounded border font-mono text-[11px] flex items-center space-x-1 backdrop-blur-sm transition-colors ${
            isAutoRotate
              ? "bg-[#EF4444]/20 border-[#EF4444] text-red-300"
              : "bg-[#0F172A]/80 border-slate-700 text-slate-300 hover:bg-[#1E293B]"
          }`}
        >
          <span>{isAutoRotate ? "Orbit: ON" : "Orbit: OFF"}</span>
        </button>
      </div>
    </div>
  );
}
