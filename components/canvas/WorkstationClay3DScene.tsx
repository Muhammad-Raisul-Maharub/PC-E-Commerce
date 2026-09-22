"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface WorkstationClay3DSceneProps {
  interactive?: boolean;
  selectedHotspot?: number | null;
  onSelectHotspot?: (id: number | null) => void;
  heightClass?: string;
  showCameraToggle?: boolean;
}

export default function WorkstationClay3DScene({
  interactive = true,
  selectedHotspot = null,
  onSelectHotspot,
  heightClass = "h-[460px] md:h-[540px]",
  showCameraToggle = true,
}: WorkstationClay3DSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isOrthogonal, setIsOrthogonal] = useState(false);
  const [activePin, setActivePin] = useState<number | null>(selectedHotspot);
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const perspCameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const orthoCameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    setActivePin(selectedHotspot);
  }, [selectedHotspot]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xfbfbfd); // Axiom Canvas Off-White

    // 2. Cameras (Perspective & Orthographic)
    const aspect = width / height;
    const perspCamera = new THREE.PerspectiveCamera(38, aspect, 0.1, 1000);
    perspCamera.position.set(22, 14, 26);
    perspCamera.lookAt(0, 3, 0);
    perspCameraRef.current = perspCamera;

    const frustumSize = 28;
    const orthoCamera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.1,
      1000
    );
    orthoCamera.position.set(22, 14, 26);
    orthoCamera.lookAt(0, 3, 0);
    orthoCameraRef.current = orthoCamera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting (Cleanroom Architectural Studio - Enhanced Brightness)
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.6);
    keyLight.position.set(25, 35, 20);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 100;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xe0e7ff, 1.8);
    rimLight.position.set(-20, 20, -20);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xdcfce7, 1.6); // emerald fill
    fillLight.position.set(0, -10, 20);
    scene.add(fillLight);

    // 5. Ground Studio Plane with soft contact shadow
    const groundGeo = new THREE.PlaneGeometry(120, 120);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -6;
    ground.receiveShadow = true;
    scene.add(ground);

    // Subtle Titanium Grid on ground
    const gridHelper = new THREE.GridHelper(40, 20, 0x004f32, 0xe4e4e7);
    gridHelper.position.y = -5.99;
    scene.add(gridHelper);

    // 6. Master Workstation Group
    const workstationGroup = new THREE.Group();
    groupRef.current = workstationGroup;
    scene.add(workstationGroup);

    // Materials - Minimalist Clay Architectural Palette
    const clayChassisMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5, // Matte pure white-zinc clay
      roughness: 0.35,
      metalness: 0.1,
    });

    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x18181b, // Basalt charcoal
      roughness: 0.5,
      metalness: 0.2,
    });

    const titaniumPcbMat = new THREE.MeshStandardMaterial({
      color: 0x27272a, // Deep slate PCB
      roughness: 0.4,
      metalness: 0.4,
    });

    const emeraldAccentMat = new THREE.MeshStandardMaterial({
      color: 0x004f32, // Forest Emerald brand accent
      roughness: 0.2,
      metalness: 0.6,
    });

    const cobaltBusMat = new THREE.MeshStandardMaterial({
      color: 0x2563eb, // Cobalt telemetry / bus
      roughness: 0.3,
      metalness: 0.5,
    });

    const coolerHeatsinkMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8, // Machined aluminum fin stack
      roughness: 0.25,
      metalness: 0.7,
    });

    // --- A. Outer Chassis Frame (4U Architectural Pedestal) ---
    // Main Chassis Body (Open Frame architectural cutout)
    const frameGeo = new THREE.BoxGeometry(16, 20, 22);
    const frameMesh = new THREE.Mesh(frameGeo, clayChassisMat);
    frameMesh.position.set(0, 4, 0);
    frameMesh.castShadow = true;
    frameMesh.receiveShadow = true;
    workstationGroup.add(frameMesh);

    // Inner Cutout Chamber (creates architectural sectional view)
    const chamberGeo = new THREE.BoxGeometry(15.2, 18.8, 20.8);
    const chamberMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.6,
      side: THREE.BackSide,
    });
    const chamberMesh = new THREE.Mesh(chamberGeo, chamberMat);
    chamberMesh.position.set(0.5, 4, 0);
    workstationGroup.add(chamberMesh);

    // Front Architectural Hairline Louver Grille
    for (let i = -8; i <= 8; i += 1.2) {
      const louverGeo = new THREE.BoxGeometry(0.2, 0.4, 21.6);
      const louver = new THREE.Mesh(louverGeo, basaltMat);
      louver.position.set(8.1, i + 4, 0);
      louver.castShadow = true;
      workstationGroup.add(louver);
    }

    // --- B. Enterprise Motherboard Tray (WRX90 EEB Form Factor) ---
    const mbGeo = new THREE.BoxGeometry(0.5, 15, 18);
    const mbMesh = new THREE.Mesh(mbGeo, titaniumPcbMat);
    mbMesh.position.set(-6.5, 4.5, 0);
    mbMesh.castShadow = true;
    workstationGroup.add(mbMesh);

    // --- C. Dual sTR5 CPU Sockets & Precision Vapor Towers ---
    // Socket 1
    const cpu1SocketGeo = new THREE.BoxGeometry(0.4, 4.2, 3.6);
    const cpu1Socket = new THREE.Mesh(cpu1SocketGeo, basaltMat);
    cpu1Socket.position.set(-6.0, 7.5, -4);
    workstationGroup.add(cpu1Socket);

    // Cooler 1 (Twin-Tower High-Density Fin Array)
    const finStack1Geo = new THREE.BoxGeometry(4.5, 5.5, 4.5);
    const finStack1 = new THREE.Mesh(finStack1Geo, coolerHeatsinkMat);
    finStack1.position.set(-3.5, 7.5, -4);
    finStack1.castShadow = true;
    workstationGroup.add(finStack1);

    // Emerald Center Cap on Cooler 1
    const coolerCap1Geo = new THREE.BoxGeometry(0.2, 5.6, 4.6);
    const coolerCap1 = new THREE.Mesh(coolerCap1Geo, emeraldAccentMat);
    coolerCap1.position.set(-1.2, 7.5, -4);
    workstationGroup.add(coolerCap1);

    // Socket 2 (Dual-CPU or Secondary compute cluster)
    const cpu2SocketGeo = new THREE.BoxGeometry(0.4, 4.2, 3.6);
    const cpu2Socket = new THREE.Mesh(cpu2SocketGeo, basaltMat);
    cpu2Socket.position.set(-6.0, 7.5, 4);
    workstationGroup.add(cpu2Socket);

    const finStack2Geo = new THREE.BoxGeometry(4.5, 5.5, 4.5);
    const finStack2 = new THREE.Mesh(finStack2Geo, coolerHeatsinkMat);
    finStack2.position.set(-3.5, 7.5, 4);
    finStack2.castShadow = true;
    workstationGroup.add(finStack2);

    const coolerCap2Geo = new THREE.BoxGeometry(0.2, 5.6, 4.6);
    const coolerCap2 = new THREE.Mesh(coolerCap2Geo, emeraldAccentMat);
    coolerCap2.position.set(-1.2, 7.5, 4);
    workstationGroup.add(coolerCap2);

    // --- D. 8-Channel Registered ECC DDR5 Memory Banks ---
    for (let slot = 0; slot < 8; slot++) {
      const zOffset = (slot - 3.5) * 1.8;
      const dimmGeo = new THREE.BoxGeometry(0.3, 2.8, 1.4);
      const dimmMesh = new THREE.Mesh(dimmGeo, basaltMat);
      dimmMesh.position.set(-6.0, 11.2, zOffset);
      dimmMesh.castShadow = true;
      workstationGroup.add(dimmMesh);

      // Gold/Emerald edge detail
      const dimmEdgeGeo = new THREE.BoxGeometry(0.35, 0.4, 1.4);
      const dimmEdge = new THREE.Mesh(dimmEdgeGeo, emeraldAccentMat);
      dimmEdge.position.set(-5.95, 12.6, zOffset);
      workstationGroup.add(dimmEdge);
    }

    // --- E. Dual Full-Length NVIDIA RTX 6000 Ada Accelerators ---
    // GPU 1 (Top PCIe 5.0 Slot)
    const gpu1Geo = new THREE.BoxGeometry(3.2, 2.5, 14.5);
    const gpu1Mesh = new THREE.Mesh(gpu1Geo, basaltMat);
    gpu1Mesh.position.set(-4.2, 0.8, 0.5);
    gpu1Mesh.castShadow = true;
    workstationGroup.add(gpu1Mesh);

    // GPU 1 Titanium shroud stripe & blower fan ring
    const gpu1StripeGeo = new THREE.BoxGeometry(0.1, 2.3, 14.2);
    const gpu1Stripe = new THREE.Mesh(gpu1StripeGeo, emeraldAccentMat);
    gpu1Stripe.position.set(-2.55, 0.8, 0.5);
    workstationGroup.add(gpu1Stripe);

    const blowerGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const blowerMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8 });
    const blower1 = new THREE.Mesh(blowerGeo, blowerMat);
    blower1.rotation.z = Math.PI / 2;
    blower1.position.set(-2.5, 0.8, -4.5);
    workstationGroup.add(blower1);

    // GPU 2 (Bottom PCIe 5.0 Slot - Dual Accelerators)
    const gpu2Geo = new THREE.BoxGeometry(3.2, 2.5, 14.5);
    const gpu2Mesh = new THREE.Mesh(gpu2Geo, basaltMat);
    gpu2Mesh.position.set(-4.2, -2.6, 0.5);
    gpu2Mesh.castShadow = true;
    workstationGroup.add(gpu2Mesh);

    const gpu2Stripe = new THREE.Mesh(gpu1StripeGeo, emeraldAccentMat);
    gpu2Stripe.position.set(-2.55, -2.6, 0.5);
    workstationGroup.add(gpu2Stripe);

    const blower2 = new THREE.Mesh(blowerGeo, blowerMat);
    blower2.rotation.z = Math.PI / 2;
    blower2.position.set(-2.5, -2.6, -4.5);
    workstationGroup.add(blower2);

    // PCIe Interconnect NVLink / Cobalt Bus Bridge
    const bridgeGeo = new THREE.BoxGeometry(1.2, 2.2, 1.4);
    const bridgeMesh = new THREE.Mesh(bridgeGeo, cobaltBusMat);
    bridgeMesh.position.set(-2.4, -0.9, 4.5);
    workstationGroup.add(bridgeMesh);

    // --- F. Power & Storage Basement (Dual Redundant 2000W PSUs & Micron U.3 Trays) ---
    const psuDividerGeo = new THREE.BoxGeometry(15, 0.4, 21);
    const psuDivider = new THREE.Mesh(psuDividerGeo, clayChassisMat);
    psuDivider.position.set(0, -4.2, 0);
    workstationGroup.add(psuDivider);

    // Dual 2000W Hot-Swap Titanium Modules
    for (let p = 0; p < 2; p++) {
      const psuGeo = new THREE.BoxGeometry(4.5, 2.6, 8.5);
      const psuMesh = new THREE.Mesh(psuGeo, basaltMat);
      psuMesh.position.set(-3.5 + p * 5.2, -5.5, -5.5);
      workstationGroup.add(psuMesh);

      // Status LED indicator
      const ledGeo = new THREE.SphereGeometry(0.15, 16, 16);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-3.5 + p * 5.2, -5.5, -9.8);
      workstationGroup.add(led);
    }

    // 8x U.3 NVMe Enterprise Hot-Swap Trays
    for (let d = 0; d < 4; d++) {
      const trayGeo = new THREE.BoxGeometry(2.8, 0.9, 6.0);
      const tray = new THREE.Mesh(trayGeo, basaltMat);
      tray.position.set(4.5, -5.5 + d * 0.9, 3.5);
      workstationGroup.add(tray);
    }

    // 7. Mouse Orbit Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationY = -0.65;
    let targetRotationX = 0.18;

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.005;
      targetRotationX = Math.max(-0.4, Math.min(0.7, targetRotationX));
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // 8. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth idle rotation if not dragging
      if (!isDragging) {
        targetRotationY += 0.0015;
      }

      if (workstationGroup) {
        workstationGroup.rotation.y += (targetRotationY - workstationGroup.rotation.y) * 0.08;
        workstationGroup.rotation.x += (targetRotationX - workstationGroup.rotation.x) * 0.08;
      }

      const activeCamera = isOrthogonal ? orthoCameraRef.current : perspCameraRef.current;
      if (activeCamera && rendererRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, activeCamera);
      }
    };
    animate();

    // 9. Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const a = w / h;

      if (perspCameraRef.current) {
        perspCameraRef.current.aspect = a;
        perspCameraRef.current.updateProjectionMatrix();
      }

      if (orthoCameraRef.current) {
        orthoCameraRef.current.left = (frustumSize * a) / -2;
        orthoCameraRef.current.right = (frustumSize * a) / 2;
        orthoCameraRef.current.top = frustumSize / 2;
        orthoCameraRef.current.bottom = frustumSize / -2;
        orthoCameraRef.current.updateProjectionMatrix();
      }

      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        rendererRef.current.dispose();
      }
    };
  }, [interactive, isOrthogonal]);

  const hotspots = [
    {
      id: 1,
      label: "01 // Compute Cluster",
      detail: "AMD Threadripper PRO 7995WX (96C/192T, 384MB L3)",
      badge: "sTR5 Socket",
    },
    {
      id: 2,
      label: "02 // Octa-Channel Memory",
      detail: "Kingston 512GB (8x64GB) Registered ECC DDR5-5600",
      badge: "460 GB/s Bandwidth",
    },
    {
      id: 3,
      label: "03 // Parallel Acceleration",
      detail: "Dual NVIDIA RTX 6000 Ada Generation (96GB GDDR6 ECC)",
      badge: "PCIe 5.0 x16 / x16",
    },
  ];

  const handleZoomIn = () => {
    if (perspCameraRef.current) {
      perspCameraRef.current.position.multiplyScalar(0.85);
    }
    if (orthoCameraRef.current) {
      orthoCameraRef.current.zoom = Math.min(3.0, orthoCameraRef.current.zoom * 1.25);
      orthoCameraRef.current.updateProjectionMatrix();
    }
  };

  const handleZoomOut = () => {
    if (perspCameraRef.current) {
      perspCameraRef.current.position.multiplyScalar(1.2);
    }
    if (orthoCameraRef.current) {
      orthoCameraRef.current.zoom = Math.max(0.4, orthoCameraRef.current.zoom * 0.8);
      orthoCameraRef.current.updateProjectionMatrix();
    }
  };

  return (
    <div className={`relative w-full ${heightClass} select-none overflow-hidden rounded-2xl border border-[#E4E4E7] bg-[#FBFBFD] shadow-xl`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Architectural Telemetry Header Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-white/95 border border-[#E4E4E7] px-3 py-1.5 rounded-lg shadow-sm backdrop-blur-sm pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#004F32] animate-pulse" />
          <span className="font-mono text-[11px] font-bold tracking-wider text-[#18181B] uppercase">
            Axiom R9600-4U // Clay CAD Telemetry
          </span>
          <span className="font-mono text-[9px] bg-[#ECFDF5] text-[#004F32] px-1.5 py-0.5 rounded font-bold uppercase border border-[#ADF1C9]">
            Certified
          </span>
        </div>

        {/* Orthogonal vs Perspective Camera Switcher & Zoom Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-white/95 border border-[#E4E4E7] p-1 rounded-lg shadow-sm backdrop-blur-sm">
            <button
              onClick={handleZoomIn}
              className="px-2 py-1 rounded font-mono text-[10.5px] font-bold text-[#18181B] hover:bg-slate-100 transition-colors flex items-center gap-0.5 cursor-pointer"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[14px]">zoom_in</span>
              <span>+</span>
            </button>
            <button
              onClick={handleZoomOut}
              className="px-2 py-1 rounded font-mono text-[10.5px] font-bold text-[#18181B] hover:bg-slate-100 transition-colors flex items-center gap-0.5 cursor-pointer"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[14px]">zoom_out</span>
              <span>-</span>
            </button>
          </div>

          {showCameraToggle && (
            <div className="flex items-center gap-1 bg-white/95 border border-[#E4E4E7] p-1 rounded-lg shadow-sm backdrop-blur-sm">
              <button
                onClick={() => setIsOrthogonal(false)}
                className={`px-2.5 py-1 rounded font-mono text-[10.5px] font-semibold transition-colors cursor-pointer ${
                  !isOrthogonal
                    ? "bg-[#18181B] text-white"
                    : "text-[#52525B] hover:text-[#18181B] hover:bg-slate-100"
                }`}
              >
                Perspective
              </button>
              <button
                onClick={() => setIsOrthogonal(true)}
                className={`px-2.5 py-1 rounded font-mono text-[10.5px] font-semibold transition-colors cursor-pointer ${
                  isOrthogonal
                    ? "bg-[#004F32] text-white"
                    : "text-[#52525B] hover:text-[#18181B] hover:bg-slate-100"
                }`}
              >
                Orthogonal (CAD)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Hotspot Telemetry Chips */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          {hotspots.map((hs) => {
            const isActive = activePin === hs.id;
            return (
              <button
                key={hs.id}
                onClick={() => {
                  const next = isActive ? null : hs.id;
                  setActivePin(next);
                  onSelectHotspot?.(next);
                }}
                onMouseEnter={() => setHoveredHotspot(hs.id)}
                onMouseLeave={() => setHoveredHotspot(null)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded border text-left transition-all ${
                  isActive
                    ? "bg-[#004F32] text-white border-[#004F32] shadow-md"
                    : "bg-white/95 text-[#18181B] border-[#E4E4E7] hover:border-[#004F32] shadow-sm backdrop-blur-sm"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? "bg-[#ADF1C9]" : "bg-[#004F32]"
                  }`}
                />
                <span className="font-mono text-[11px] font-bold uppercase">{hs.label}</span>
                <span
                  className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-[#52525B]"
                  }`}
                >
                  {hs.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Live Thermal & Acoustic Telemetry Tag */}
        <div className="bg-white/95 border border-[#E4E4E7] px-3 py-1.5 rounded shadow-sm backdrop-blur-sm pointer-events-auto flex items-center gap-3 font-mono text-[10.5px]">
          <div>
            <span className="text-[#71717A]">THERMAL: </span>
            <span className="font-bold text-[#004F32]">28°C AMB / 62°C STRESS</span>
          </div>
          <div className="border-l border-[#E4E4E7] pl-3">
            <span className="text-[#71717A]">ACOUSTICS: </span>
            <span className="font-bold text-[#18181B]">31 dBA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
