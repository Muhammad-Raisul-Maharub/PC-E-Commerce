import { HARDWARE_PRODUCTS, HardwareProduct, REAL_COMPONENT_IMAGES, SYNAPSECAD_ASSET_URLS } from "./hardwareDatabase";

export { REAL_COMPONENT_IMAGES, SYNAPSECAD_ASSET_URLS };

export const ENTERPRISE_ASSET_URLS = {
  motherboards: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
  graphicsAccelerators: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
  studioGpus: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1000&q=80",
  processors: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80",
  serverRacks: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
};

// Phase 2: Real Component & Gadget Asset Bindings for OmniPulse BD (Concept 5)
export const OMNIPULSE_ASSET_URLS = {
  laptops: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80",
  displays: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
  gadgets: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
  chassis: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1000&q=80",
  motherboards: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
  gpus: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
  processors: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1000&q=80",
  ram: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1000&q=80",
  storage: "https://images.unsplash.com/photo-1588239034647-25783cbfcfc1?auto=format&fit=crop&w=1000&q=80",
};


export interface TurnkeyWorkstationPlatform {
  id: string;
  name: string;
  codename: string;
  targetWorkflow: "ai" | "davinci" | "cad" | "analytics";
  tagline: string;
  basePrice: number;
  specs: {
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    chassis: string;
    cooling: string;
    pcieBandwidth: string;
  };
  metrics: {
    fp16Tflops: number;
    memoryBandwidthGBs: number;
    acousticLevelDba: number;
    isvCertified: string[];
  };
  image: string;
}

export const TURNKEY_WORKSTATIONS: TurnkeyWorkstationPlatform[] = [
  {
    id: "axiom-ai-studio-gen4",
    name: "Axiom AI-Studio Gen 4",
    codename: "HYPERION-96",
    targetWorkflow: "ai",
    tagline: "LLM Fine-Tuning & Multi-Modal Foundation Model Training Node",
    basePrice: 2850000,
    specs: {
      cpu: "AMD Threadripper PRO 7995WX (96C / 192T)",
      gpu: "Dual NVIDIA RTX 6000 Ada Generation (96GB Total GDDR6 ECC)",
      ram: "512GB (8x64GB) Registered ECC DDR5-5600",
      storage: "15.36TB (2x 7.68TB) Micron 9400 PRO U.3 NVMe",
      chassis: "Axiom R9600 4U Hybrid Chassis with Dual 2000W Titanium PSUs",
      cooling: "Axiom Industrial Closed-Loop Micro-Channel Cooling (<31 dBA)",
      pcieBandwidth: "128 Lanes PCIe 5.0 (Full x16/x16/x16/x16 Multi-GPU)",
    },
    metrics: {
      fp16Tflops: 2914,
      memoryBandwidthGBs: 1920,
      acousticLevelDba: 31,
      isvCertified: ["PyTorch", "TensorFlow", "NVIDIA NeMo", "vLLM", "HuggingFace"],
    },
    image: ENTERPRISE_ASSET_URLS.serverRacks,
  },
  {
    id: "axiom-rendernode-8k",
    name: "Axiom RenderNode 8K Studio",
    codename: "CHRONOS-8K",
    targetWorkflow: "davinci",
    tagline: "Uncompressed 8K Raw Color Grading & Real-Time Cinema VFX Rig",
    basePrice: 1650000,
    specs: {
      cpu: "AMD Threadripper PRO 7965WX (24C / 48T, 5.3GHz)",
      gpu: "NVIDIA RTX 6000 Ada 48GB + Blackmagic DeckLink 8K Pro",
      ram: "256GB (4x64GB) Registered ECC DDR5-5600",
      storage: "7.68TB Micron Enterprise NVMe Scratch + 30TB Archive",
      chassis: "Axiom Precision Tower with Sound-Dampening Baffles",
      cooling: "Whisper-Quiet Quad Heatpipe Tower Array",
      pcieBandwidth: "64 Lanes PCIe 5.0 Direct Dedicated Video Bus",
    },
    metrics: {
      fp16Tflops: 1457,
      memoryBandwidthGBs: 960,
      acousticLevelDba: 28,
      isvCertified: ["DaVinci Resolve Studio", "Avid Media Composer", "Adobe Premiere Pro", "Autodesk Flame"],
    },
    image: ENTERPRISE_ASSET_URLS.studioGpus,
  },
  {
    id: "axiom-solidworkstation-pro",
    name: "Axiom SolidWorkstation Pro",
    codename: "EUCLID-CAD",
    targetWorkflow: "cad",
    tagline: "Parametric Engineering, FEA Structural Simulation & BIM Architecture",
    basePrice: 1120000,
    specs: {
      cpu: "AMD Threadripper PRO 7965WX (24C / 48T, High Single-Core IPC)",
      gpu: "NVIDIA RTX 5000 Ada Generation 32GB ECC",
      ram: "128GB (2x64GB) Registered ECC DDR5-5600",
      storage: "3.84TB Enterprise NVMe Gen4",
      chassis: "Axiom Studio Minimalist Pedestal",
      cooling: "Axiom Dual-Chamber Low-Noise Air System",
      pcieBandwidth: "128 Lanes PCIe 5.0 Expandable",
    },
    metrics: {
      fp16Tflops: 653,
      memoryBandwidthGBs: 576,
      acousticLevelDba: 26,
      isvCertified: ["Dassault SolidWorks", "Autodesk Revit", "Siemens NX", "Catia V6", "ANSYS Fluent"],
    },
    image: ENTERPRISE_ASSET_URLS.motherboards,
  },
  {
    id: "axiom-quant-cluster",
    name: "Axiom QuantMatrix High-Freq Node",
    codename: "VECTOR-HFT",
    targetWorkflow: "analytics",
    tagline: "Sub-Microsecond Latency Backtesting & In-Memory Big Data Analytics",
    basePrice: 1980000,
    specs: {
      cpu: "AMD Threadripper PRO 7995WX (96C / 192T)",
      gpu: "NVIDIA RTX 5000 Ada 32GB + Solarflare 25Gb Low-Latency NIC",
      ram: "512GB (8x64GB) Registered ECC Octa-Channel DDR5",
      storage: "15.36TB High-IOPS U.3 PCIe 4.0 Storage Array",
      chassis: "Axiom 4U Rackmount Deployment Unit",
      cooling: "Redundant Dual-Ball Bearing Thermal Tunnel",
      pcieBandwidth: "128 Lanes Direct to Memory Fabric",
    },
    metrics: {
      fp16Tflops: 890,
      memoryBandwidthGBs: 1440,
      acousticLevelDba: 33,
      isvCertified: ["Apache Spark", "DuckDB", "kdb+/q", "ClickHouse", "PyTorch"],
    },
    image: ENTERPRISE_ASSET_URLS.processors,
  },
];

// Phase 2: Real Component, Maker & Peripheral Asset Bindings for Krypton Brutalist (Concept 6)
export const KRYPTON_MAKER_ASSET_URLS = {
  microcontrollers: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1000&q=80",
  circuitBoards: "https://images.unsplash.com/photo-1517055729445-fa7d27394b48?auto=format&fit=crop&w=1000&q=80",
  switchesPack: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80",
  switchBlueStems: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80",
  keycaps: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80",
  moddingKits: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=1000&q=80",
  customKeyboards: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
  rgbKeyboards: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
  motherboards: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80",
  dedicatedGpus: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80",
  pcieNvmeSsds: "https://images.unsplash.com/photo-1588239034647-25783cbfcfc1?auto=format&fit=crop&w=1000&q=80",
};

export interface KryptonMakerProduct {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: "switch" | "keycap" | "kit" | "mcu" | "board" | "pc-part";
  domain: "keyboard" | "maker" | "core-pc";
  brand: string;
  price: number;
  regularPrice: number;
  image: string;
  description: string;
  specs: {
    switchType?: "Linear" | "Tactile" | "Clicky" | "Hall Effect Magnetic";
    pins?: "3-pin Plate Mount" | "5-pin PCB Mount";
    actuationForceGf?: number;
    bottomOutForceGf?: number;
    travelMm?: number;
    material?: string;
    profile?: string;
    mcuCore?: string;
    flashStorage?: string;
    formFactor?: string;
  };
  depotStock: {
    idbDhaka: number;
    elephantRoad: number;
    motijheelHq: number;
    chattogramSanmar: number;
  };
  kicadFootprint: string;
  pdfDatasheet: string;
  stockBinCode: string;
  status: "IN_STOCK" | "LOW_STOCK" | "DISPATCH_READY";
}

export const KRYPTON_MAKER_PRODUCTS: KryptonMakerProduct[] = [
  {
    id: "krp-sw-gateron-oil-king",
    slug: "gateron-oil-king-linear-pack-90",
    sku: "SW-GAT-OIL-90P",
    name: "Gateron Oil King Linear Switches (90-Pack)",
    category: "switch",
    domain: "keyboard",
    brand: "Gateron",
    price: 6800,
    regularPrice: 7500,
    image: KRYPTON_MAKER_ASSET_URLS.switchesPack,
    description: "Self-lubricating custom linear switches with all-black nylon PA66 housing and high-grade INX POM stem for deep acoustic resonance.",
    specs: {
      switchType: "Linear",
      pins: "5-pin PCB Mount",
      actuationForceGf: 55,
      bottomOutForceGf: 65,
      travelMm: 4.0,
      material: "Nylon PA66 & POM Stem",
    },
    depotStock: {
      idbDhaka: 24,
      elephantRoad: 18,
      motijheelHq: 10,
      chattogramSanmar: 12,
    },
    kicadFootprint: "Krypton_SW_MX_5Pin_Hotswap.kicad_mod",
    pdfDatasheet: "DS-GAT-OILKING-REV3.pdf",
    stockBinCode: "BIN-A2-08",
    status: "IN_STOCK",
  },
  {
    id: "krp-sw-blue-stem-tactile",
    slug: "krypton-cobalt-stem-tactile-pack-90",
    sku: "SW-KRP-COBALT-90P",
    name: "Krypton Cobalt Stem Tactile Switches (90-Pack)",
    category: "switch",
    domain: "keyboard",
    brand: "Krypton Labs",
    price: 7200,
    regularPrice: 8000,
    image: KRYPTON_MAKER_ASSET_URLS.switchBlueStems,
    description: "Sharp D-shape tactile bump with sub-zero stem tolerances, progressive gold-plated dual-stage spring, and high-frequency actuation.",
    specs: {
      switchType: "Tactile",
      pins: "5-pin PCB Mount",
      actuationForceGf: 62,
      bottomOutForceGf: 67,
      travelMm: 3.4,
      material: "Polycarbonate Top / UHMWPE Stem",
    },
    depotStock: {
      idbDhaka: 15,
      elephantRoad: 9,
      motijheelHq: 7,
      chattogramSanmar: 5,
    },
    kicadFootprint: "Krypton_SW_MX_Tactile_Gold.kicad_mod",
    pdfDatasheet: "DS-KRP-COBALT-TACTILE.pdf",
    stockBinCode: "BIN-A2-14",
    status: "IN_STOCK",
  },
  {
    id: "krp-kc-industrial-concrete",
    slug: "krypton-industrial-concrete-pbt-keycaps",
    sku: "KC-KRP-CONC-142",
    name: "Krypton DIN-Industrial Heavy PBT Keycap Set (142 Keys)",
    category: "keycap",
    domain: "keyboard",
    brand: "Krypton Foundry",
    price: 5400,
    regularPrice: 6200,
    image: KRYPTON_MAKER_ASSET_URLS.keycaps,
    description: "1.7mm thick dye-sublimated PBT keycaps in Raw Concrete & Hazard Safety Yellow with technical DIN legend typography and ISO/ANSI support.",
    specs: {
      profile: "Cherry Profile",
      material: "1.7mm Extra-Thick PBT",
      formFactor: "ANSI / ISO / 60% / 65% / 75% / TKL / Alice",
    },
    depotStock: {
      idbDhaka: 32,
      elephantRoad: 14,
      motijheelHq: 8,
      chattogramSanmar: 11,
    },
    kicadFootprint: "Krypton_Plate_Cherry_142.kicad_mod",
    pdfDatasheet: "DS-KRP-DIN-PBT-SPECS.pdf",
    stockBinCode: "BIN-B1-02",
    status: "IN_STOCK",
  },
  {
    id: "krp-mod-armory-workbench-kit",
    slug: "krypton-switch-lube-tuning-bench-station",
    sku: "KIT-LUBE-STATION-PRO",
    name: "Krypton Pro Modding & Lube Tuning Station",
    category: "kit",
    domain: "maker",
    brand: "Krypton Labs",
    price: 3800,
    regularPrice: 4500,
    image: KRYPTON_MAKER_ASSET_URLS.moddingKits,
    description: "Complete mechanical workstation kit: 36-switch acrylic station, Krytox 205g0 syringe, stem pickers, titanium tweezers, and switch opener.",
    specs: {
      material: "Heavy Machined Acrylic & Stainless Tooling",
      formFactor: "Benchtop 36-Switch Calibration Rig",
    },
    depotStock: {
      idbDhaka: 18,
      elephantRoad: 12,
      motijheelHq: 5,
      chattogramSanmar: 8,
    },
    kicadFootprint: "Krypton_Bench_Tooling_Rig.kicad_mod",
    pdfDatasheet: "MANUAL-LUBE-STATION-REV2.pdf",
    stockBinCode: "BIN-C3-01",
    status: "IN_STOCK",
  },
  {
    id: "krp-kb-brutalist-alu-75",
    slug: "krypton-forge-75-cnc-anodized-keyboard",
    sku: "KB-FORGE-75-ALU",
    name: "Krypton Forge-75 Milled Aluminum Custom Keyboard",
    category: "kit",
    domain: "keyboard",
    brand: "Krypton Foundry",
    price: 19500,
    regularPrice: 22000,
    image: KRYPTON_MAKER_ASSET_URLS.customKeyboards,
    description: "6063 aerospace billet aluminum chassis with gasket mounting, brass internal counterweight, hot-swappable South-facing PCB, and QMK/VIA.",
    specs: {
      formFactor: "75% Exploded Layout (82 Keys)",
      material: "CNC 6063 Aluminum (Raw Basalt Beadblast)",
      pins: "5-pin PCB Mount",
    },
    depotStock: {
      idbDhaka: 8,
      elephantRoad: 5,
      motijheelHq: 3,
      chattogramSanmar: 4,
    },
    kicadFootprint: "Krypton_Forge75_QMK_PCB.kicad_mod",
    pdfDatasheet: "DS-FORGE75-MECHANICAL-DRAWING.pdf",
    stockBinCode: "BIN-D4-09",
    status: "DISPATCH_READY",
  },
  {
    id: "krp-mcu-rp2040-matrix-node",
    slug: "krypton-rp2040-matrix-development-board",
    sku: "MCU-RP2040-NODE-V2",
    name: "Krypton Dual-Core RP2040 Maker Development Node",
    category: "mcu",
    domain: "maker",
    brand: "Krypton Labs",
    price: 1450,
    regularPrice: 1750,
    image: KRYPTON_MAKER_ASSET_URLS.microcontrollers,
    description: "Dual ARM Cortex-M0+ clocked at 133MHz with 16MB QSPI flash, onboard USB-C ESD protection, Castellated pinout headers, and CircuitPython.",
    specs: {
      mcuCore: "Dual-Core ARM Cortex-M0+ @ 133MHz",
      flashStorage: "16MB QSPI Flash",
      formFactor: "Castellated Edge & Breadboard Compatible",
    },
    depotStock: {
      idbDhaka: 45,
      elephantRoad: 30,
      motijheelHq: 20,
      chattogramSanmar: 25,
    },
    kicadFootprint: "Krypton_RP2040_Castellated.kicad_mod",
    pdfDatasheet: "DS-KRP-RP2040-NODE-SCHEMATIC.pdf",
    stockBinCode: "BIN-E1-15",
    status: "IN_STOCK",
  },
  {
    id: "krp-ic-driver-matrix-board",
    slug: "krypton-ic-mosfet-power-distribution-board",
    sku: "PCB-PWR-MOSFET-8CH",
    name: "Krypton 8-Channel Industrial MOSFET Power Driver Board",
    category: "board",
    domain: "maker",
    brand: "Krypton Labs",
    price: 2200,
    regularPrice: 2600,
    image: KRYPTON_MAKER_ASSET_URLS.circuitBoards,
    description: "Heavy 2oz copper PCB with optoisolated trigger lines, screw terminal bus bars, and onboard LED telemetry for high-current hardware switching.",
    specs: {
      material: "2oz FR4 Heavy Copper PCB",
      formFactor: "DIN-Rail Mountable Module (85x60mm)",
    },
    depotStock: {
      idbDhaka: 28,
      elephantRoad: 16,
      motijheelHq: 12,
      chattogramSanmar: 10,
    },
    kicadFootprint: "Krypton_8CH_MOSFET_Power.kicad_mod",
    pdfDatasheet: "DS-KRP-MOSFET-8CH-SCHEMATIC.pdf",
    stockBinCode: "BIN-E2-04",
    status: "IN_STOCK",
  },
  {
    id: "krp-pc-asus-rog-crosshair-x670e",
    slug: "asus-rog-crosshair-x670e-hero-am5",
    sku: "MB-ASUS-X670E-HERO",
    name: "ASUS ROG Crosshair X670E Hero (AM5)",
    category: "pc-part",
    domain: "core-pc",
    brand: "ASUS",
    price: 78500,
    regularPrice: 84000,
    image: KRYPTON_MAKER_ASSET_URLS.motherboards,
    description: "Heavyweight AM5 motherboard with 18+2 power stages (110A), dual PCIe 5.0 x16 slots, 5x M.2 slots, Wi-Fi 6E, and Polymo lighting matrix.",
    specs: {
      formFactor: "ATX (305 x 244 mm)",
      material: "High-density thermal heatpipe armor",
    },
    depotStock: {
      idbDhaka: 6,
      elephantRoad: 4,
      motijheelHq: 3,
      chattogramSanmar: 2,
    },
    kicadFootprint: "ATX_Standard_Mount_Points.kicad_mod",
    pdfDatasheet: "DS-ASUS-CROSSHAIR-X670E.pdf",
    stockBinCode: "BIN-F1-01",
    status: "IN_STOCK",
  },
  {
    id: "krp-pc-rtx-4090-rog-strix-oc",
    slug: "asus-rog-strix-geforce-rtx-4090-24gb-oc",
    sku: "GPU-ASUS-4090-STRIX-24G",
    name: "ASUS ROG Strix GeForce RTX 4090 24GB OC Edition",
    category: "pc-part",
    domain: "core-pc",
    brand: "ASUS",
    price: 295000,
    regularPrice: 310000,
    image: KRYPTON_MAKER_ASSET_URLS.dedicatedGpus,
    description: "Patented milled vapor chamber, diecast exoskeleton frame, and axial-tech fans scaled up for 23% more airflow. Unyielding 3.5-slot brutalist GPU.",
    specs: {
      formFactor: "3.5-Slot Form Factor (357.6 mm Length)",
      material: "Diecast metal frame with backplate bracket",
    },
    depotStock: {
      idbDhaka: 4,
      elephantRoad: 3,
      motijheelHq: 2,
      chattogramSanmar: 2,
    },
    kicadFootprint: "PCIe_x16_Gen5_Mechanical.kicad_mod",
    pdfDatasheet: "DS-ROG-RTX4090-STRIX-OC.pdf",
    stockBinCode: "BIN-F2-03",
    status: "LOW_STOCK",
  },
  {
    id: "krp-pc-samsung-990-pro-4tb",
    slug: "samsung-990-pro-4tb-pcie-4-nvme-heatsink",
    sku: "SSD-SAM-990PRO-4TB-HS",
    name: "Samsung 990 PRO 4TB PCIe 4.0 NVMe SSD with Heatsink",
    category: "pc-part",
    domain: "core-pc",
    brand: "Samsung",
    price: 42500,
    regularPrice: 46000,
    image: KRYPTON_MAKER_ASSET_URLS.pcieNvmeSsds,
    description: "Up to 7,450 MB/s read and 6,900 MB/s write. Factory engineered slim heatsink for sustained maximum throughput under heavy compile workloads.",
    specs: {
      formFactor: "M.2 2280 PCIe 4.0 x4",
      material: "Nickel-coated controller & integrated thermal fins",
    },
    depotStock: {
      idbDhaka: 14,
      elephantRoad: 9,
      motijheelHq: 5,
      chattogramSanmar: 7,
    },
    kicadFootprint: "M2_2280_Socket3_KeyM.kicad_mod",
    pdfDatasheet: "DS-SAMSUNG-990PRO-4TB.pdf",
    stockBinCode: "BIN-F3-08",
    status: "IN_STOCK",
  },
];

export function toHardwareProduct(item: KryptonMakerProduct): HardwareProduct {
  return {
    id: item.id,
    slug: item.slug,
    sku: item.sku,
    name: item.name,
    brand: item.brand,
    category: (item.category === "pc-part" ? "chassis" : "peripherals") as HardwareProduct["category"],
    price: item.price,
    regularPrice: item.regularPrice,
    image: item.image,
    description: item.description,
    tdp: 0,
    specs: Object.entries(item.specs).map(([label, value]) => {
      const friendlyLabels: Record<string, string> = {
        switchType: "Key Feel & Switch Type",
        pins: "Switch Mounting Stability",
        actuationForceGf: "Key Press Resistance (gf)",
        bottomOutForceGf: "Full Bottom-Out Pressure (gf)",
        travelMm: "Key Travel Depth (mm)",
        material: "Keycap & Housing Material",
        profile: "Ergonomic Keycap Height",
        formFactor: "Supported Keyboard Size",
        mcuCore: "Processing Chip Core",
        flashStorage: "Onboard Flash Storage",
      };
      return {
        label: friendlyLabels[label] || (label.charAt(0).toUpperCase() + label.slice(1)),
        value: String(value),
      };
    }),
    branchStock: {
      idb: item.depotStock.idbDhaka,
      multiplan: item.depotStock.elephantRoad,
      motijheel: item.depotStock.motijheelHq,
      chittagong: item.depotStock.chattogramSanmar,
      central: 10,
    },
    warranty: "3 Years Krypton Depot Official Replacement Guarantee",
  };
}

