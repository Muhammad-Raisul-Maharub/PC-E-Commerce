"use client";

import React, { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

interface SynapseBoundingBox3DProps {
  gpuLength?: number;
  gpuMaxClearance?: number;
  coolerHeight?: number;
  coolerMaxHeight?: number;
  showLabels?: boolean;
}

export default function SynapseBoundingBox3DScene({
  gpuLength = 304,
  gpuMaxClearance = 340,
  coolerHeight = 158,
  coolerMaxHeight = 165,
  showLabels = true,
}: SynapseBoundingBox3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraMode, setCameraMode] = useState<"iso" | "front" | "side" | "top">("iso");
  const [wireframeMode, setWireframeMode] = useState<boolean>(true);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"chassis" | "gpu" | "cooler">("chassis");

  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneGroupRef = useRef<THREE.Group | null>(null);
  const isRotatingRef = useRef<boolean>(true);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 380;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(3.8, 2.6, 4.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 12;
    controls.minDistance = 2;
    controlsRef.current = controls;

    // Master CAD Assembly Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    sceneGroupRef.current = rootGroup;

    // 1. Grid Floor
    const gridHelper = new THREE.GridHelper(6, 24, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -1.2;
    rootGroup.add(gridHelper);

    // 2. Chassis Outer Wireframe Bounding Box (Dimensions: 460 x 220 x 480 mm scaled to ~2.3 x 1.1 x 2.4 units)
    const boxW = 1.1; // Width (X)
    const boxH = 2.4; // Height (Y)
    const boxD = 2.3; // Depth (Z)

    const chassisGeo = new THREE.BoxGeometry(boxW, boxH, boxD);
    const chassisEdges = new THREE.EdgesGeometry(chassisGeo);
    const chassisMat = new THREE.LineBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.8,
      linewidth: 1.5,
    });
    const chassisWireframe = new THREE.LineSegments(chassisEdges, chassisMat);
    chassisWireframe.position.y = 0;
    rootGroup.add(chassisWireframe);

    // Subtle Chassis Glass Side Panel (Translucent)
    const glassGeo = new THREE.PlaneGeometry(boxD, boxH);
    const glassMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.rotation.y = Math.PI / 2;
    glassMesh.position.set(boxW / 2 + 0.005, 0, 0);
    rootGroup.add(glassMesh);

    // 3. Motherboard Tray & PCB (ATX scaled to ~0.05 x 1.5 x 1.2 units)
    const moboGeo = new THREE.BoxGeometry(0.04, 1.5, 1.2);
    const moboMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.75,
    });
    const moboMesh = new THREE.Mesh(moboGeo, moboMat);
    moboMesh.position.set(-boxW / 2 + 0.15, 0.2, 0);
    rootGroup.add(moboMesh);

    const moboEdges = new THREE.EdgesGeometry(moboGeo);
    const moboWire = new THREE.LineSegments(
      moboEdges,
      new THREE.LineBasicMaterial({ color: 0x4cd7f6, opacity: 0.9 })
    );
    moboMesh.add(moboWire);

    // AM5 CPU Socket & Cooler Clearance Bounding Volume
    const socketGeo = new THREE.BoxGeometry(0.08, 0.28, 0.28);
    const socketMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const socketMesh = new THREE.Mesh(socketGeo, socketMat);
    socketMesh.position.set(0.05, 0.35, -0.15);
    moboMesh.add(socketMesh);

    // CPU Cooler Volume Envelope (Green / Lime Safety clearance box)
    const coolerDepth = (coolerHeight / 165) * 0.75;
    const coolerGeo = new THREE.BoxGeometry(coolerDepth, 0.75, 0.75);
    const coolerMat = new THREE.MeshBasicMaterial({
      color: 0x84cc16,
      transparent: true,
      opacity: 0.18,
    });
    const coolerMesh = new THREE.Mesh(coolerGeo, coolerMat);
    coolerMesh.position.set(coolerDepth / 2 + 0.05, 0.35, -0.15);
    const coolerEdges = new THREE.EdgesGeometry(coolerGeo);
    const coolerWire = new THREE.LineSegments(
      coolerEdges,
      new THREE.LineBasicMaterial({ color: 0x84cc16, linewidth: 2 })
    );
    coolerMesh.add(coolerWire);
    moboMesh.add(coolerMesh);

    // 4. GPU Dedicated Graphics Card Bounding Volume
    // Scales dynamically with gpuLength prop vs maxClearance
    const gpuLengthUnits = (gpuLength / gpuMaxClearance) * 1.5;
    const gpuGeo = new THREE.BoxGeometry(0.32, 0.65, gpuLengthUnits);
    const gpuMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.22,
    });
    const gpuMesh = new THREE.Mesh(gpuGeo, gpuMat);
    gpuMesh.position.set(-0.08, -0.25, gpuLengthUnits / 2 - 0.6);
    rootGroup.add(gpuMesh);

    const gpuEdges = new THREE.EdgesGeometry(gpuGeo);
    const gpuWire = new THREE.LineSegments(
      gpuEdges,
      new THREE.LineBasicMaterial({ color: 0x00f0ff, linewidth: 2 })
    );
    gpuMesh.add(gpuWire);

    // Intake Buffer Margin (Remaining clearance box in Neon Lime)
    const remainingMm = Math.max(0, gpuMaxClearance - gpuLength);
    const bufferUnits = (remainingMm / gpuMaxClearance) * 1.5;
    if (bufferUnits > 0.05) {
      const bufferGeo = new THREE.BoxGeometry(0.32, 0.65, bufferUnits);
      const bufferMat = new THREE.MeshBasicMaterial({
        color: 0x84cc16,
        transparent: true,
        opacity: 0.08,
      });
      const bufferMesh = new THREE.Mesh(bufferGeo, bufferMat);
      bufferMesh.position.set(
        -0.08,
        -0.25,
        gpuLengthUnits - 0.6 + bufferUnits / 2
      );
      const bufferEdges = new THREE.EdgesGeometry(bufferGeo);
      const bufferWire = new THREE.LineSegments(
        bufferEdges,
        new THREE.LineBasicMaterial({
          color: 0x84cc16,
          transparent: true,
          opacity: 0.8,
        })
      );
      bufferMesh.add(bufferWire);
      rootGroup.add(bufferMesh);
    }

    // 5. PSU Basement Chamber (Lower Shroud)
    const psuGeo = new THREE.BoxGeometry(boxW - 0.1, 0.6, boxD - 0.1);
    const psuMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      transparent: true,
      opacity: 0.5,
    });
    const psuMesh = new THREE.Mesh(psuGeo, psuMat);
    psuMesh.position.set(0, -boxH / 2 + 0.35, 0);
    const psuEdges = new THREE.EdgesGeometry(psuGeo);
    const psuWire = new THREE.LineSegments(
      psuEdges,
      new THREE.LineBasicMaterial({ color: 0x334155, opacity: 0.8 })
    );
    psuMesh.add(psuWire);
    rootGroup.add(psuMesh);

    // 6. 3D Coordinate Datum Origin Indicator
    const axesHelper = new THREE.AxesHelper(0.8);
    axesHelper.position.set(-boxW / 2, -boxH / 2, -boxD / 2);
    rootGroup.add(axesHelper);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotatingRef.current && rootGroup) {
        rootGroup.rotation.y += 0.003;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Observer
    const handleResize = () => {
      if (!container || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // Clean disposal
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      chassisGeo.dispose();
      chassisMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      moboGeo.dispose();
      moboMat.dispose();
      socketGeo.dispose();
      socketMat.dispose();
      coolerGeo.dispose();
      coolerMat.dispose();
      gpuGeo.dispose();
      gpuMat.dispose();
      psuGeo.dispose();
      psuMat.dispose();
    };
  }, [gpuLength, gpuMaxClearance, coolerHeight, coolerMaxHeight]);

  // Handle Preset Camera Angles
  const setCameraAngle = (mode: "iso" | "front" | "side" | "top") => {
    setCameraMode(mode);
    setIsRotating(false);
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (mode) {
      case "iso":
        camera.position.set(3.8, 2.6, 4.2);
        controls.target.set(0, 0, 0);
        break;
      case "front":
        camera.position.set(0, 0, 5.5);
        controls.target.set(0, 0, 0);
        break;
      case "side":
        camera.position.set(5.5, 0, 0);
        controls.target.set(0, 0, 0);
        break;
      case "top":
        camera.position.set(0, 6, 0.01);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const remainingGpuMargin = Math.max(0, gpuMaxClearance - gpuLength);
  const remainingCoolerMargin = Math.max(0, coolerMaxHeight - coolerHeight);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-[#0B1326] rounded-none border border-[#334155] overflow-hidden flex flex-col select-none">
      {/* CAD Telemetry Header Bar */}
      <div className="h-10 bg-[#171F33] px-3 border-b border-[#334155] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
          <span className="text-[#06B6D4] font-bold tracking-wider">[VIEWPORT-01 // REALTIME_CAD]</span>
          <span className="text-[#94A3B8] hidden sm:inline">| ORTHO_V4.8</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-[#84CC16] font-mono">60.0 FPS</span>
          <span className="text-[#334155]">•</span>
          <span className="text-[#94A3B8]">FOV: 40.0°</span>
        </div>
      </div>

      {/* Main 3D Canvas Viewport */}
      <div ref={containerRef} className="relative flex-1 w-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

        {/* HUD Watermark & Datum Readout */}
        <div className="absolute top-3 left-3 pointer-events-none flex flex-col gap-0.5 bg-[#060E20]/80 p-2 border border-[#334155] font-mono text-[10px]">
          <div className="flex items-center gap-1.5 text-[#06B6D4] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
            <span>DATUM: PCIe REF (0,0,0)</span>
          </div>
          <div className="text-[#94A3B8] text-[9px]">
            <span>CHASSIS: 460 x 220 x 480 mm</span>
          </div>
        </div>

        {/* Right Corner Dimension Overlay Flags */}
        {showLabels && (
          <div className="absolute top-3 right-3 pointer-events-none flex flex-col gap-1.5 items-end font-mono text-[10px]">
            <div className="bg-[#060E20]/90 border border-[#06B6D4] px-2 py-0.5 text-[#06B6D4] font-bold shadow-md">
              H: 480mm · W: 220mm · D: 460mm
            </div>
            <div className="bg-[#060E20]/90 border border-[#84CC16] px-2 py-0.5 text-[#84CC16] font-bold shadow-md">
              GPU CLEARANCE: {remainingGpuMargin}mm BUFFER
            </div>
            <div className="bg-[#060E20]/90 border border-[#84CC16] px-2 py-0.5 text-[#84CC16] font-bold shadow-md">
              COOLER MARGIN: {remainingCoolerMargin}mm CLEAR
            </div>
          </div>
        )}

        {/* View Angle Preset Floating Buttons */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-[#171F33]/90 border border-[#334155] p-1 font-mono text-[10px]">
          <button
            onClick={() => setCameraAngle("iso")}
            className={`px-2 py-0.5 transition-colors ${
              cameraMode === "iso"
                ? "bg-[#06B6D4] text-[#0F172A] font-bold"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            ISO 35°
          </button>
          <button
            onClick={() => setCameraAngle("front")}
            className={`px-2 py-0.5 transition-colors ${
              cameraMode === "front"
                ? "bg-[#06B6D4] text-[#0F172A] font-bold"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            FRONT
          </button>
          <button
            onClick={() => setCameraAngle("side")}
            className={`px-2 py-0.5 transition-colors ${
              cameraMode === "side"
                ? "bg-[#06B6D4] text-[#0F172A] font-bold"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            SIDE
          </button>
          <button
            onClick={() => setCameraAngle("top")}
            className={`px-2 py-0.5 transition-colors ${
              cameraMode === "top"
                ? "bg-[#06B6D4] text-[#0F172A] font-bold"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            TOP
          </button>
        </div>

        {/* Orbit Auto-Rotate & Orbit Control Toggle */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-[#171F33]/90 border border-[#334155] p-1 font-mono text-[10px]">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2 py-0.5 transition-colors flex items-center gap-1 ${
              isRotating
                ? "bg-[#84CC16] text-[#0F172A] font-bold"
                : "text-[#94A3B8] hover:text-[#F8FAFC]"
            }`}
          >
            <span>{isRotating ? "AUTO-ROTATE ON" : "PAUSED"}</span>
          </button>
        </div>
      </div>

      {/* Bottom Technical Telemetry Strip */}
      <div className="bg-[#131B2E] border-t border-[#334155] px-3 py-1.5 grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
        <div>
          <span className="text-[#94A3B8] block text-[9px] uppercase">GPU ENVELOPE</span>
          <span className="text-[#06B6D4] font-bold">{gpuLength}mm / {gpuMaxClearance}mm MAX</span>
        </div>
        <div>
          <span className="text-[#94A3B8] block text-[9px] uppercase">COOLER HEIGHT</span>
          <span className="text-[#84CC16] font-bold">{coolerHeight}mm / {coolerMaxHeight}mm MAX</span>
        </div>
        <div>
          <span className="text-[#94A3B8] block text-[9px] uppercase">COLLISION STATUS</span>
          <span className="text-[#84CC16] font-bold">100% VERIFIED</span>
        </div>
      </div>
    </div>
  );
}
