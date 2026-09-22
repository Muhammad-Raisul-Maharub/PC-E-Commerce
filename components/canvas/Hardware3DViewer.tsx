"use client";

import React, { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Stage,
  useGLTF,
  Html,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

export type ViewerConcept =
  | "voltmatrix"
  | "neonforge"
  | "axiom"
  | "synapse"
  | "omnipulse"
  | "krypton";

interface Hardware3DViewerProps {
  modelPath?: string;
  concept?: ViewerConcept;
  accentColor?: string;
  autoRotate?: boolean;
  className?: string;
  interactiveSwitch?: boolean;
  onSwitchPress?: () => void;
}

// -------------------------------------------------------------
// 1. External .GLB / .GLTF Loader Model
// -------------------------------------------------------------
function ExternalHardwareModel({
  modelPath,
  autoRotate = false,
  scale = 1.5,
}: {
  modelPath: string;
  autoRotate?: boolean;
  scale?: number;
}) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return <primitive ref={groupRef} object={scene} scale={scale} />;
}

// -------------------------------------------------------------
// 2. Procedural Fallback Meshes (Custom Styled Per Concept)
// -------------------------------------------------------------

// Concept 1: VoltMatrix Clinical Component Inspection
function VoltMatrixProceduralGPU({ autoRotate }: { autoRotate?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={ref} position={[0, 0, 0]}>
      {/* GPU PCB */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.4, 0.08, 1.4]} />
        <meshStandardMaterial color="#0B132B" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Heavy Heatsink Fin Array */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[3.2, 0.7, 1.3]} />
        <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Dual Axial Flow Fans */}
      {[-0.85, 0.85].map((x, i) => (
        <group key={i} position={[x, 0.8, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.08, 24]} />
            <meshStandardMaterial color="#0F172A" roughness={0.6} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
            <meshStandardMaterial color="#EF4444" metalness={0.8} />
          </mesh>
        </group>
      ))}
      {/* PCIe Gold Edge Pins */}
      <mesh position={[0, -0.15, -0.6]}>
        <boxGeometry args={[1.8, 0.2, 0.04]} />
        <meshStandardMaterial color="#F59E0B" metalness={1.0} roughness={0.1} />
      </mesh>
    </group>
  );
}

// Concept 2: NeonForge Cyberpunk Liquid-Cooled Chassis
function NeonForgeLiquidChassis({
  coolantColor = "#00F0FF",
  autoRotate,
}: {
  coolantColor?: string;
  autoRotate?: boolean;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={ref}>
      {/* Pointlight inside transparent chassis casting neon illumination */}
      <pointLight color={coolantColor} intensity={3.0} distance={6} position={[0, 0.5, 0]} />
      <pointLight color="#FF007A" intensity={1.5} distance={5} position={[0.5, -0.3, 0.5]} />

      {/* Transparent Tempered Glass Chassis Box */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.4, 2.8, 1.6]} />
        <meshPhysicalMaterial
          color="#090D16"
          transparent
          opacity={0.25}
          roughness={0.05}
          transmission={0.9}
          thickness={1.2}
          reflectivity={0.9}
        />
      </mesh>

      {/* Internal Motherboard Tray */}
      <mesh position={[-0.2, 0, -0.6]}>
        <boxGeometry args={[1.8, 2.2, 0.08]} />
        <meshStandardMaterial color="#030712" roughness={0.7} metalness={0.5} />
      </mesh>

      {/* Glowing Liquid Cooling Reservoir */}
      <mesh position={[0.7, 0, 0.3]}>
        <cylinderGeometry args={[0.22, 0.22, 1.8, 24]} />
        <meshStandardMaterial
          color={coolantColor}
          emissive={coolantColor}
          emissiveIntensity={1.4}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Radiator Loop Tubing */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[2.0, 0.25, 0.9]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} />
      </mesh>
    </group>
  );
}

// Concept 3: Axiom Pro CAD Clay Workstation Finish
function AxiomClayWorkstation({ autoRotate }: { autoRotate?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.25;
  });

  // Strict Uniform Clay CAD Material (roughness: 0.85, metalness: 0.1)
  const clayMaterial = new THREE.MeshStandardMaterial({
    color: "#E2E8F0",
    roughness: 0.85,
    metalness: 0.1,
    flatShading: false,
  });

  return (
    <group ref={ref}>
      {/* Studio Workstation Tower Chassis */}
      <mesh position={[0, 0, 0]} material={clayMaterial}>
        <boxGeometry args={[1.6, 2.8, 2.4]} />
      </mesh>
      {/* Front Minimalist Intake Bezel */}
      <mesh position={[0, 0, 1.22]} material={clayMaterial}>
        <boxGeometry args={[1.5, 2.6, 0.05]} />
      </mesh>
      {/* Top Studio Carry Handle */}
      <mesh position={[0, 1.5, 0]} material={clayMaterial}>
        <boxGeometry args={[0.3, 0.2, 1.4]} />
      </mesh>
      {/* Subtle Axiom Accent Strip */}
      <mesh position={[0.79, 0, 1.1]}>
        <boxGeometry args={[0.04, 2.2, 0.06]} />
        <meshStandardMaterial color="#004F32" roughness={0.4} metalness={0.3} />
      </mesh>
    </group>
  );
}

// Concept 4: SynapseCAD Blueprint Wireframe & Measurement Overlay
function SynapseWireframeModel({ autoRotate }: { autoRotate?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={ref}>
      {/* Primary CAD Wireframe Geometry */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 1.4, 2.2]} />
        <meshStandardMaterial wireframe color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.6} />
      </mesh>

      {/* Internal Component Bounding Box Wireframe */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[2.6, 0.8, 1.6]} />
        <meshStandardMaterial wireframe color="#84CC16" emissive="#84CC16" emissiveIntensity={0.4} />
      </mesh>

      {/* Drei HTML Millimeter Rulers / Clearance Callout Badges */}
      <Html position={[1.7, 0.7, 0]} center>
        <div className="bg-slate-900/90 border border-cyan-400/80 px-2 py-0.5 rounded font-mono text-[10px] text-cyan-300 font-bold whitespace-nowrap shadow-lg shadow-cyan-950/60 pointer-events-none">
          L: 320.0 mm (CLEARANCE: OK)
        </div>
      </Html>

      <Html position={[0, 1.0, 1.2]} center>
        <div className="bg-slate-900/90 border border-lime-400/80 px-2 py-0.5 rounded font-mono text-[10px] text-lime-400 font-bold whitespace-nowrap shadow-lg shadow-lime-950/60 pointer-events-none">
          H: 140.0 mm • 3.2 SLOTS
        </div>
      </Html>
    </group>
  );
}

// Concept 5: OmniPulse BD Interactive Regional Depot Map
function OmniPulseMapPlane({ autoRotate }: { autoRotate?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.2;
  });

  const hubs = [
    { name: "IDB Bhaban Flagship", pos: [-0.3, 0.2, 0.1], stock: "142 Units", color: "#EF4444" },
    { name: "Multiplan Center Hub", pos: [0.2, 0.2, 0.4], stock: "98 Units", color: "#3B82F6" },
    { name: "Chittagong GEC Hub", pos: [0.9, 0.2, 0.8], stock: "44 Units", color: "#10B981" },
  ];

  return (
    <group ref={ref} rotation={[-0.2, 0, 0]}>
      {/* Low-poly Regional Geography Map Plane */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[4.2, 0.1, 3.2]} />
        <meshStandardMaterial color="#0A2558" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Grid Floor */}
      <gridHelper args={[4.2, 16, "#1E3A8A", "#172554"]} position={[0, 0.02, 0]} />

      {/* Store Location Beacon Pins with HTML Tooltips */}
      {hubs.map((hub, idx) => (
        <group key={idx} position={hub.pos as [number, number, number]}>
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.04, 0.01, 0.6, 12]} />
            <meshStandardMaterial color={hub.color} emissive={hub.color} emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[0, 0.6, 0]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color={hub.color} emissive={hub.color} emissiveIntensity={1.2} />
          </mesh>
          <Html position={[0, 0.9, 0]} center>
            <div className="bg-slate-900/95 border border-blue-400 px-2 py-1 rounded text-white font-mono text-[9.5px] whitespace-nowrap shadow-xl pointer-events-none">
              <span className="font-bold text-amber-300 block">{hub.name}</span>
              <span className="text-emerald-400">{hub.stock} in Stock</span>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

// Concept 6: Krypton Brutalist Mechanical Switch Interactive Model
function KryptonMechanicalSwitch({
  interactive = true,
  onPress,
}: {
  interactive?: boolean;
  onPress?: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const stemY = useRef(0.5);

  const handleTrigger = () => {
    if (!interactive) return;
    setPressed(true);
    if (onPress) onPress();
    // Rebound after 120ms
    setTimeout(() => setPressed(false), 120);
  };

  useFrame((_, delta) => {
    const targetY = pressed ? 0.22 : 0.5;
    stemY.current = THREE.MathUtils.damp(stemY.current, targetY, 24, delta);
  });

  return (
    <group onClick={handleTrigger} onPointerDown={handleTrigger}>
      {/* Switch Bottom Housing (Black Industrial Plastic) */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[1.5, 0.6, 1.5]} />
        <meshStandardMaterial color="#171717" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Switch Top Housing (Smoky Transparent Polycarbonate) */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[1.42, 0.5, 1.42]} />
        <meshPhysicalMaterial
          color="#262626"
          roughness={0.2}
          transmission={0.65}
          thickness={0.8}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Depressible MX Cross Stem (Krypton Safety Yellow / Industrial Orange) */}
      <group position={[0, stemY.current, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.42, 0.45, 0.16]} />
          <meshStandardMaterial color="#FACC15" roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.16, 0.45, 0.42]} />
          <meshStandardMaterial color="#FACC15" roughness={0.4} metalness={0.1} />
        </mesh>
      </group>

      {/* Click Me HUD Callout */}
      <Html position={[0, 1.1, 0]} center>
        <div className="bg-[#FACC15] text-black border-2 border-black font-mono font-extrabold text-[10px] px-2 py-0.5 uppercase shadow-[2px_2px_0px_#000000] cursor-pointer active:translate-y-px">
          {pressed ? "ACTUATED (2.0mm)" : "CLICK / PRESS KEY"}
        </div>
      </Html>
    </group>
  );
}

// -------------------------------------------------------------
// 3. 2D Animated Suspense Skeleton Fallback
// -------------------------------------------------------------
function ViewerSkeletonFallback() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm z-10">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <div className="w-8 h-8 rounded-full border-2 border-red-500/20 border-b-red-400 animate-spin [animation-direction:reverse]" />
      </div>
      <p className="font-mono text-[11px] text-slate-300 mt-4 tracking-wider uppercase animate-pulse">
        Mounting 3D WebGL Canvas...
      </p>
    </div>
  );
}

// -------------------------------------------------------------
// 4. Main Exported Reusable Hardware3DViewer Component
// -------------------------------------------------------------
export const HARDWARE_3D_LIBRARY = [
  { id: "default", label: "Concept View", path: "" },
  { id: "gpu", label: "RTX 4090 FE", path: "/models/gpu-rtx4090.glb" },
  { id: "cpu", label: "Threadripper", path: "/models/cpu-threadripper.glb" },
  { id: "ram", label: "Corsair RAM", path: "/models/ram-corsair.glb" },
  { id: "switch", label: "Cherry MX", path: "/models/switch-cherry-mx.glb" },
  { id: "mobo", label: "Motherboard", path: "/models/motherboard-atx.glb" },
  { id: "case", label: "Gaming Case", path: "/models/chassis-gaming.glb" },
];

export default function Hardware3DViewer({
  modelPath,
  concept = "voltmatrix",
  accentColor,
  autoRotate = true,
  className = "w-full h-[450px]",
  interactiveSwitch = true,
  onSwitchPress,
}: Hardware3DViewerProps) {
  const [activeModelPath, setActiveModelPath] = useState<string>(modelPath || "");

  const isVolt = concept === "voltmatrix";
  const isNeon = concept === "neonforge";
  const isAxiom = concept === "axiom";
  const isSynapse = concept === "synapse";
  const isOmni = concept === "omnipulse";
  const isKrypton = concept === "krypton";

  // Concept-aware container styling
  const containerStyle = isKrypton
    ? "bg-[#EBEAE5] border-2 border-black shadow-[6px_6px_0px_#000000]"
    : isOmni
      ? "bg-[#061838] border border-blue-800/80 shadow-2xl"
      : isSynapse
        ? "bg-[#0B132B] border border-cyan-500/40 shadow-[0_0_30px_rgba(6,182,212,0.15)]"
        : isNeon
          ? "bg-[#060810] border border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.2)]"
          : isAxiom
            ? "bg-[#F8FAFC] border border-slate-300 shadow-sm"
            : "bg-[#090D16] border border-slate-800 shadow-md";

  const effectivePath = activeModelPath || modelPath || "";

  return (
    <div className={`relative overflow-hidden rounded-xl ${containerStyle} ${className}`}>
      {/* 2D Suspense Skeleton Placeholder */}
      <Suspense fallback={<ViewerSkeletonFallback />}>
        <Canvas
          frameloop="demand" // Performance optimization: only renders when state or camera changes
          gl={{
            antialias: true,
            powerPreference: "high-performance",
            alpha: true,
          }}
          className="w-full h-full"
        >
          {/* Concept 1 uses Orthographic Camera; Others use Perspective */}
          {isVolt ? (
            <OrthographicCamera makeDefault position={[3, 3, 3]} zoom={85} />
          ) : (
            <PerspectiveCamera makeDefault position={[0, 1.8, 4.2]} fov={45} />
          )}

          <Suspense fallback={null}>
            {/* Stage wrapper for lighting and soft ground shadows */}
            <Stage
              intensity={isVolt ? 0.8 : isNeon ? 0.4 : isAxiom ? 0.7 : 0.6}
              environment={isNeon ? "night" : "city"}
              adjustCamera={false}
            >
              {/* Load External .GLB if provided; otherwise render concept procedural model */}
              {effectivePath ? (
                <ExternalHardwareModel
                  modelPath={effectivePath}
                  autoRotate={autoRotate}
                />
              ) : (
                <>
                  {isVolt && <VoltMatrixProceduralGPU autoRotate={autoRotate} />}
                  {isNeon && (
                    <NeonForgeLiquidChassis
                      coolantColor={accentColor || "#00F0FF"}
                      autoRotate={autoRotate}
                    />
                  )}
                  {isAxiom && <AxiomClayWorkstation autoRotate={autoRotate} />}
                  {isSynapse && <SynapseWireframeModel autoRotate={autoRotate} />}
                  {isOmni && <OmniPulseMapPlane autoRotate={autoRotate} />}
                  {isKrypton && (
                    <KryptonMechanicalSwitch
                      interactive={interactiveSwitch}
                      onPress={onSwitchPress}
                    />
                  )}
                </>
              )}
            </Stage>

            {/* OrbitControls with angle limits to prevent clipping through floor */}
            <OrbitControls
              enableZoom={true}
              minDistance={2}
              maxDistance={8}
              maxPolarAngle={Math.PI / 2 - 0.05}
              makeDefault
            />
          </Suspense>
        </Canvas>
      </Suspense>

      {/* Telemetry Status Ribbon */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
        <span
          className={`w-2 h-2 rounded-full animate-pulse ${
            isKrypton
              ? "bg-[#EA580C]"
              : isNeon
                ? "bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]"
                : isSynapse
                  ? "bg-[#06B6D4]"
                  : isAxiom
                    ? "bg-[#004F32]"
                    : isOmni
                      ? "bg-[#3B82F6]"
                      : "bg-[#EF4444]"
          }`}
        />
        <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-slate-400">
          R3F WebGL 3D // {concept.toUpperCase()}
        </span>
      </div>

      {/* 3D Hardware Model Switcher Dock */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 p-1 bg-black/75 backdrop-blur-md rounded-full border border-white/10 max-w-[95%] overflow-x-auto no-scrollbar shadow-xl">
        {HARDWARE_3D_LIBRARY.map((item) => {
          const isActive = effectivePath === item.path;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModelPath(item.path)}
              className={`px-2.5 py-1 rounded-full font-mono text-[9.5px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
                isActive
                  ? "bg-white text-black shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
