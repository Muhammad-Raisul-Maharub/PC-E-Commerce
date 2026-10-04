"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Cpu,
  ShieldCheck,
  UserCheck,
  Lock,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  MessageCircle,
  AlertCircle,
  Truck,
  Store,
  Clock,
  CreditCard,
  Eye,
  EyeOff,
  Sparkles,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { HardwareProduct, HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";
import { updateCustomerProfile, changeCustomerPassword } from "@/app/actions/userAccount";

export interface AccountOrderItem {
  id: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  name: string;
  slug?: string;
  imageUrl?: string | null;
  category?: string;
  warranty?: string;
}

export interface AccountOrder {
  id: string;
  trackingCode: string;
  status: string;
  totalAmount: number;
  subtotal: number;
  shippingFee: number;
  paymentStatus: string;
  paymentMethod: string;
  deliveryMethod: string;
  shippingAddress?: {
    district?: string;
    thana?: string;
    address?: string;
  } | null;
  notes?: string | null;
  createdAt: string;
  items: AccountOrderItem[];
}

export interface ProfileData {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  default_address?: Record<string, string> | null;
  created_at?: string;
}

interface Props {
  profile: ProfileData | null;
  orders: AccountOrder[];
  userEmail: string;
}

type TabType = "overview" | "orders" | "builds" | "warranty" | "profile" | "security";

export default function AccountDashboardClient({
  profile: initialProfile,
  orders,
  userEmail,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [orderFilter, setOrderFilter] = useState<"all" | "in_transit" | "delivered" | "pickup">("all");
  const [profile, setProfile] = useState<ProfileData | null>(initialProfile);

  // Profile Form State
  const [fullName, setFullName] = useState(initialProfile?.full_name || "");
  const [phone, setPhone] = useState(initialProfile?.phone || "");
  const [district, setDistrict] = useState(initialProfile?.default_address?.district || "Chattogram");
  const [thana, setThana] = useState(initialProfile?.default_address?.thana || "GEC Circle / Agrabad");
  const [streetAddress, setStreetAddress] = useState(initialProfile?.default_address?.address || "");

  // Notification / Toast States
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [securityMessage, setSecurityMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Security Form State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Transitions
  const [isPendingProfile, startProfileTransition] = useTransition();
  const [isPendingSecurity, startSecurityTransition] = useTransition();

  const { addStandaloneItem } = useCartStore();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Saved PC Builder Rigs
  const savedRigs = [
    {
      id: "rig-custom-1",
      name: "VoltMatrix AI Modeler Pro (AM5 // Liquid Loop)",
      powerLoad: "520W Peak Load",
      psuRec: "750W 80+ Gold",
      specSummary: "AMD Ryzen 9 7950X3D • RTX 4080 Super 16GB • 64GB DDR5-6000 • 360mm Distro Loop",
      totalPrice: 285500,
      slots: {
        cpu: "Ryzen 9 7950X3D",
        gpu: "RTX 4080 Super",
        ram: "64GB DDR5 G.Skill",
        storage: "2TB Samsung 990 Pro",
        chassis: "Lian Li O11 Dynamic EVO",
      },
    },
    {
      id: "rig-custom-2",
      name: "Synapse CAD Studio 4U Heavy Engine",
      powerLoad: "640W Peak Load",
      psuRec: "850W Platinum",
      specSummary: "Intel Core Ultra 9 285K • RTX 4090 24GB • 96GB DDR5 ECC • Custom Copper Loop",
      totalPrice: 425000,
      slots: {
        cpu: "Core Ultra 9 285K",
        gpu: "RTX 4090 24GB",
        ram: "96GB DDR5 High-Density",
        storage: "4TB Gen5 Corsair NVMe",
        chassis: "Fractal Design North XL",
      },
    },
    {
      id: "rig-custom-3",
      name: "Krypton Tactile Competitive Battlestation",
      powerLoad: "410W Peak Load",
      psuRec: "650W Gold",
      specSummary: "Ryzen 7 7800X3D • RTX 4070 Ti Super • 32GB Dual-Channel • Noctua Stealth Air",
      totalPrice: 198000,
      slots: {
        cpu: "Ryzen 7 7800X3D",
        gpu: "RTX 4070 Ti Super",
        ram: "32GB DDR5 Kingston",
        storage: "1TB WD Black SN850X",
        chassis: "NZXT H6 Flow RGB",
      },
    },
  ];

  // Hardware Warranty Vault items from actual orders + fallback registered genuine items
  const confirmedOrderItems = orders
    .filter((o) => o.status !== "cancelled")
    .flatMap((o) =>
      o.items.map((it, idx) => ({
        id: `${o.id}-${it.id}-${idx}`,
        name: it.name,
        category: it.category || "Hardware Component",
        serial: `SN-VMX-${o.trackingCode.replace(/[^0-9A-Z]/g, "").slice(-4)}${100 + idx}`,
        purchaseDate: new Date(o.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        warrantyTerm: it.warranty || "36 Months Official Distributor Warranty",
        daysRemaining: 1045 - idx * 40,
        status: "Official Active Warranty",
        orderCode: o.trackingCode,
      }))
    );

  const fallbackWarrantyItems = [
    {
      id: "w-item-1",
      name: "AMD Ryzen 7 7800X3D Boxed Gaming Processor",
      category: "Processors (CPU)",
      serial: "SN-AMD-7800X3D-9941B",
      purchaseDate: "Oct 01, 2026",
      warrantyTerm: "36 Months Replacement Warranty",
      daysRemaining: 1060,
      status: "Official Active Warranty",
      orderCode: "ORD-CTG-MAIN",
    },
    {
      id: "w-item-2",
      name: "MSI MAG B650 Tomahawk WiFi AM5 Motherboard",
      category: "Motherboards",
      serial: "SN-MSI-B650-84310C",
      purchaseDate: "Oct 01, 2026",
      warrantyTerm: "36 Months Official Distributor Coverage",
      daysRemaining: 1060,
      status: "Official Active Warranty",
      orderCode: "ORD-CTG-MAIN",
    },
    {
      id: "w-item-3",
      name: "Corsair RM750e 750W 80+ Gold Fully Modular PSU",
      category: "Power Supplies",
      serial: "SN-CS-RM750E-44211",
      purchaseDate: "Oct 01, 2026",
      warrantyTerm: "84 Months (7 Years) Manufacturer Warranty",
      daysRemaining: 2515,
      status: "Official Active Warranty",
      orderCode: "ORD-CTG-MAIN",
    },
  ];

  const warrantyVault = confirmedOrderItems.length > 0 ? confirmedOrderItems : fallbackWarrantyItems;

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    if (orderFilter === "in_transit") {
      return ["pending", "confirmed", "processing", "dispatched"].includes(ord.status.toLowerCase());
    }
    if (orderFilter === "delivered") {
      return ord.status.toLowerCase() === "delivered";
    }
    if (orderFilter === "pickup") {
      return ord.deliveryMethod === "store_pickup";
    }
    return true;
  });

  // Calculate Metrics
  const totalOrdersCount = orders.length;
  const activeShipmentsCount = orders.filter((o) =>
    ["pending", "confirmed", "processing", "dispatched"].includes(o.status.toLowerCase())
  ).length;
  const latestOrder = orders.length > 0 ? orders[0] : null;

  // Handle Save Profile
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    startProfileTransition(async () => {
      const res = await updateCustomerProfile({
        fullName,
        phone,
        district,
        thana,
        streetAddress,
      });

      if (res.success) {
        setProfileMessage({ type: "success", text: res.message || "Profile updated successfully." });
        setProfile((prev) => ({
          id: prev?.id || "",
          email: prev?.email || userEmail,
          full_name: fullName,
          phone: phone || null,
          role: prev?.role || "customer",
          default_address: { district, thana, address: streetAddress },
        }));
        showToast("Profile and default shipping address updated.");
      } else {
        setProfileMessage({ type: "error", text: res.error || "Failed to update profile." });
      }
    });
  };

  // Handle Change Password
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityMessage(null);

    if (newPassword.length < 6) {
      setSecurityMessage({ type: "error", text: "New password must be at least 6 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setSecurityMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    startSecurityTransition(async () => {
      const res = await changeCustomerPassword(newPassword);
      if (res.success) {
        setSecurityMessage({ type: "success", text: res.message || "Password changed successfully." });
        setNewPassword("");
        setConfirmPassword("");
        showToast("Password updated. Credentials secured.");
      } else {
        setSecurityMessage({ type: "error", text: res.error || "Failed to change password." });
      }
    });
  };

  // Re-Order items
  const handleReorder = (order: AccountOrder) => {
    if (!order.items || order.items.length === 0) {
      showToast("No components found in this order.");
      return;
    }

    order.items.forEach((item) => {
      const existingProduct = HARDWARE_PRODUCTS.find(
        (p) => p.id === item.productId || (item.slug && p.slug === item.slug)
      );

      if (existingProduct) {
        addStandaloneItem(existingProduct, item.quantity);
      } else {
        const fallbackProduct: HardwareProduct = {
          id: item.productId,
          slug: item.slug || `hardware-${item.id}`,
          sku: `SKU-${item.id.slice(0, 6)}`,
          name: item.name,
          brand: "VoltMatrix Certified",
          category: "cpu",
          price: item.unitPrice,
          regularPrice: item.unitPrice,
          image:
            item.imageUrl ||
            "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=600&q=80",
          description: "High-performance hardware component.",
          tdp: 65,
          specs: [],
          warranty: item.warranty || "36 Months Official Distributor Warranty",
          branchStock: {
            idb: 5,
            multiplan: 5,
            motijheel: 5,
            uttara: 5,
            chittagong: 10,
            central: 10,
          },
        };
        addStandaloneItem(fallbackProduct, item.quantity);
      }
    });

    showToast(`Added ${order.items.length} components to cart!`);
    router.push("/checkout");
  };

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0f172a] text-white border border-red-500/40 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 2-COLUMN RESPONSIVE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        {/* ============================================================== */}
        {/* LEFT SIDEBAR: PROFILE CARD & NAVIGATION RAIL                   */}
        {/* ============================================================== */}
        <aside className="w-full space-y-6">
          {/* Customer Avatar & Bio Card */}
          <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-[#b61722] to-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-red-950/60 border border-red-500/30">
                {(profile?.full_name || userEmail || "U")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-headline font-bold text-base text-white truncate">
                  {profile?.full_name || "Customer Account"}
                </h2>
                <p className="text-xs text-slate-400 font-mono truncate">{userEmail}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${
                      profile?.role === "admin"
                        ? "bg-red-500/15 text-red-400 border-red-500/30"
                        : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {profile?.role === "admin" ? "Master Admin" : "Verified Customer"}
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Contact Badges */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs font-mono">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="truncate">{profile?.phone || "No phone added yet"}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">
                  {profile?.default_address?.district || "Chattogram Hub Hub"}
                </span>
              </div>
            </div>

            {/* Navigation Rail */}
            <nav className="space-y-1 pt-3 border-t border-slate-800 font-mono text-xs">
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === "overview"
                    ? "bg-[#b61722] text-white font-bold shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Overview</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === "orders"
                    ? "bg-[#b61722] text-white font-bold shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>Orders &amp; Rigs</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("builds")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === "builds"
                    ? "bg-[#b61722] text-white font-bold shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4" />
                  <span>Saved Builds</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {savedRigs.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("warranty")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === "warranty"
                    ? "bg-[#b61722] text-white font-bold shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Warranty Vault</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                  {warrantyVault.length} Active
                </span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === "profile"
                    ? "bg-[#b61722] text-white font-bold shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4" />
                  <span>Profile &amp; Address</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === "security"
                    ? "bg-[#b61722] text-white font-bold shadow-md shadow-red-950/50"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4" />
                  <span>Security</span>
                </div>
              </button>
            </nav>

            {/* Sign Out CTA */}
            <form action="/auth/signout" method="POST" className="pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-red-950/40 hover:text-red-400 hover:border-red-900/50 text-xs font-mono font-semibold text-slate-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>

          {/* Chattogram Showroom Assistance Callout */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0b1329] to-[#0f172a] border border-slate-800 text-slate-300 shadow-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-red-400 font-mono text-[11px] uppercase tracking-wider">
              <Store className="w-4 h-4" />
              <span>Chattogram Concierge</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Order pickup, express RMA, and liquid cooling staging at our GEC Circle / Agrabad flagship hub.
            </p>
            <div className="pt-1">
              <a
                href="tel:+8801800000000"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-red-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+880 1800-000000</span>
              </a>
            </div>
          </div>
        </aside>

        {/* ============================================================== */}
        {/* RIGHT WORKSPACE: TAB PANELS                                    */}
        {/* ============================================================== */}
        <main className="w-full space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Header Greeting */}
              <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="font-headline font-bold text-2xl text-white">
                    Welcome back, {fullName || "Customer"}!
                  </h1>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Manage your hardware consignments, custom PC builder rigs, and warranty registrations.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/pc-builder"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-[#b61722] hover:brightness-110 text-white text-xs font-mono font-bold transition-all shadow-md shadow-red-950/50 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Launch PC Builder</span>
                  </Link>
                  <Link
                    href="/catalog"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold transition-all border border-slate-700 flex items-center gap-2"
                  >
                    <span>Browse Catalog</span>
                  </Link>
                </div>
              </div>

              {/* 3 Summary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono uppercase tracking-wider">Total Orders Placed</span>
                    <Package className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="font-mono text-2xl font-black text-white">{totalOrdersCount}</div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Lifetime hardware consignments logged
                  </p>
                </div>

                <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono uppercase tracking-wider">Active Shipments</span>
                    <Truck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="font-mono text-2xl font-black text-cyan-400">{activeShipmentsCount}</div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Currently in courier or staging pipeline
                  </p>
                </div>

                <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-5 shadow-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-mono uppercase tracking-wider">Saved Custom Rigs</span>
                    <Cpu className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-mono text-2xl font-black text-emerald-400">{savedRigs.length}</div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Ready for single-click builder sync
                  </p>
                </div>
              </div>

              {/* Recent Order Spotlight */}
              {latestOrder ? (
                <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase text-slate-400">Recent Spotlight:</span>
                        <span className="font-mono font-bold text-sm text-white">{latestOrder.trackingCode}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/30">
                          {latestOrder.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        Placed on {new Date(latestOrder.createdAt).toLocaleDateString()} • {latestOrder.deliveryMethod === "store_pickup" ? "Chattogram Showroom Pickup" : "Courier Cash on Delivery"}
                      </p>
                    </div>

                    <Link
                      href={`/track-order?code=${latestOrder.trackingCode}`}
                      className="px-4 py-2 rounded-xl bg-[#b61722] hover:bg-[#99131c] text-white text-xs font-mono font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Track Live Consignment</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* 5-Stage Visual Progress Bar */}
                  <div className="py-2">
                    <div className="grid grid-cols-5 gap-2 text-center font-mono text-[10px]">
                      {["Ordered", "Verified", "Assembling", "Dispatched", "Delivered"].map((stg, sIdx) => {
                        const stageStatusOrder = ["pending", "confirmed", "processing", "dispatched", "delivered"];
                        const currentIdx = stageStatusOrder.indexOf(latestOrder.status.toLowerCase());
                        const isDone = sIdx <= (currentIdx >= 0 ? currentIdx : 0);

                        return (
                          <div key={stg} className="space-y-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                isDone ? "bg-red-500 shadow-sm shadow-red-500/50" : "bg-slate-800"
                              }`}
                            />
                            <span className={isDone ? "text-slate-200 font-bold" : "text-slate-600"}>
                              {stg}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                      Consignment Components ({latestOrder.items.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {latestOrder.items.slice(0, 4).map((it) => (
                        <div
                          key={it.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono"
                        >
                          <img
                            src={it.imageUrl || "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=120&q=80"}
                            alt={it.name}
                            className="w-10 h-10 object-cover rounded-lg border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-slate-200 font-bold truncate">{it.name}</div>
                            <div className="text-slate-400 text-[11px]">
                              Qty: {it.quantity} • ৳{it.unitPrice.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-12 text-center shadow-xl space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-lg text-white">No Consignments Placed Yet</h3>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 font-mono">
                      Your orders, live delivery tracking codes, and digital warranty invoices will appear here once you make your first hardware purchase.
                    </p>
                  </div>
                  <div className="pt-2 flex justify-center gap-3">
                    <Link
                      href="/catalog"
                      className="px-4 py-2 bg-[#b61722] hover:bg-[#99131c] text-white text-xs font-mono font-bold rounded-xl transition-all shadow-md"
                    >
                      Explore Hardware Catalog
                    </Link>
                    <Link
                      href="/pc-builder"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold rounded-xl transition-all border border-slate-700"
                    >
                      Build Custom PC
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS & RIGS */}
          {activeTab === "orders" && (
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="font-headline font-bold text-xl text-white">
                    Purchases &amp; Consignment Pipeline
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Track and review hardware orders across courier dispatch and showroom pickup
                  </p>
                </div>
                <Link
                  href="/catalog"
                  className="px-4 py-2 rounded-xl bg-[#b61722] hover:bg-[#99131c] text-white text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>Browse Catalog</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2 text-xs font-mono">
                {[
                  { key: "all", label: "All Orders", count: orders.length },
                  {
                    key: "in_transit",
                    label: "In Transit",
                    count: orders.filter((o) =>
                      ["pending", "confirmed", "processing", "dispatched"].includes(o.status.toLowerCase())
                    ).length,
                  },
                  {
                    key: "delivered",
                    label: "Delivered",
                    count: orders.filter((o) => o.status.toLowerCase() === "delivered").length,
                  },
                  {
                    key: "pickup",
                    label: "Showroom Pickups",
                    count: orders.filter((o) => o.deliveryMethod === "store_pickup").length,
                  },
                ].map((chip) => (
                  <button
                    key={chip.key}
                    onClick={() => setOrderFilter(chip.key as any)}
                    className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                      orderFilter === chip.key
                        ? "bg-red-500/15 border-red-500/40 text-red-400 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <span>{chip.label}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {chip.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Orders List */}
              {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-4 hover:border-slate-700 transition-colors"
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <strong className="text-white text-base font-mono font-bold tracking-wide">
                              {ord.trackingCode}
                            </strong>
                            <span
                              className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                                ord.status === "delivered"
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : ord.status === "dispatched"
                                  ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                                  : ord.status === "processing"
                                  ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            <span>
                              {new Date(ord.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span>•</span>
                            <span className="text-slate-300">
                              {ord.deliveryMethod === "store_pickup"
                                ? "Chattogram Showroom Pickup"
                                : "Standard Courier COD"}
                            </span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right font-mono">
                          <span className="text-[10px] uppercase text-slate-400 block">Total Amount</span>
                          <span className="font-bold text-lg text-white">৳{ord.totalAmount.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Itemized Component List */}
                      <div className="space-y-2">
                        {ord.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs font-mono"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <img
                                src={
                                  item.imageUrl ||
                                  "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=120&q=80"
                                }
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded-lg border border-slate-800 shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-slate-200 font-bold truncate">{item.name}</div>
                                <div className="text-slate-500 text-[11px]">
                                  {item.category || "Hardware"} • {item.warranty || "Standard Warranty"}
                                </div>
                              </div>
                            </div>

                            <div className="text-right pl-3 shrink-0">
                              <div className="text-slate-300 font-bold">
                                ৳{(item.unitPrice * item.quantity).toLocaleString()}
                              </div>
                              <div className="text-slate-500 text-[10px]">
                                ৳{item.unitPrice.toLocaleString()} × {item.quantity}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Payment:</span>
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            {ord.paymentMethod.toUpperCase()} ({ord.paymentStatus})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReorder(ord)}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all border border-slate-700 flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Re-Order Parts</span>
                          </button>

                          <Link
                            href={`/track-order?code=${ord.trackingCode}`}
                            className="px-4 py-2 rounded-xl bg-[#b61722] hover:bg-[#99131c] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Live Consignment</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center space-y-3 font-mono">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                    <Package className="w-6 h-6" />
                  </div>
                  <h4 className="text-slate-300 font-bold text-sm">No orders match this filter</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try switching filters or explore the catalog to stage a new hardware shipment.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SAVED BUILDS */}
          {activeTab === "builds" && (
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="font-headline font-bold text-xl text-white">
                    Custom PC Architecture Rigs
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Configurations engineered in the 3D PC Builder with power draw diagnostics &amp; compatibility verification
                  </p>
                </div>
                <Link
                  href="/pc-builder"
                  className="px-4 py-2 rounded-xl bg-[#b61722] hover:bg-[#99131c] text-white text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Launch PC Builder</span>
                </Link>
              </div>

              <div className="space-y-4">
                {savedRigs.map((rig) => (
                  <div
                    key={rig.id}
                    className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-headline font-bold text-base text-white">{rig.name}</h3>
                        <div className="flex items-center gap-2 mt-1 font-mono text-xs">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                            {rig.powerLoad}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 text-[11px]">Recommended: {rig.psuRec}</span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right font-mono">
                        <span className="text-[10px] text-slate-400 uppercase block">Estimated Build Cost</span>
                        <span className="font-bold text-lg text-white">৳{rig.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Specs Summary Table */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 font-mono text-xs text-slate-300">
                      <div className="text-slate-400 text-[11px] mb-2 uppercase tracking-wider font-bold">
                        Component Blueprint
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-500">CPU: </span>
                          <span className="text-slate-200">{rig.slots.cpu}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">GPU: </span>
                          <span className="text-slate-200">{rig.slots.gpu}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">RAM: </span>
                          <span className="text-slate-200">{rig.slots.ram}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Storage: </span>
                          <span className="text-slate-200">{rig.slots.storage}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-slate-500">Enclosure: </span>
                          <span className="text-slate-200">{rig.slots.chassis}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 font-mono text-xs">
                      <Link
                        href="/pc-builder"
                        className="px-4 py-2 rounded-xl bg-[#b61722] hover:bg-[#99131c] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Load into PC Builder</span>
                      </Link>

                      <button
                        onClick={() => {
                          const url = `https://pc-e-commerce-nine.vercel.app/pc-builder?rig=${encodeURIComponent(rig.id)}`;
                          navigator.clipboard.writeText(url);
                          showToast(`Shareable blueprint URL copied to clipboard!`);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all border border-slate-700 flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Shareable URL</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HARDWARE WARRANTY VAULT */}
          {activeTab === "warranty" && (
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h2 className="font-headline font-bold text-xl text-white">
                    Digital Hardware Warranty Vault
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Official paperless warranty registration with distributor serial verification and 1-click WhatsApp concierge support
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
                  100% Genuine Bangladeshi Warranty
                </span>
              </div>

              {/* Warranty Table */}
              <div className="space-y-3 font-mono text-xs">
                {warrantyVault.map((item) => {
                  const whatsappMessage = `Hello VoltMatrix Concierge Support, I require warranty assistance for my component:\n- Component: ${item.name}\n- Serial Number: ${item.serial}\n- Purchase Order: ${item.orderCode}`;
                  const whatsappUrl = `https://wa.me/8801800000000?text=${encodeURIComponent(whatsappMessage)}`;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-slate-800 bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="font-headline font-bold text-sm text-white truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
                          <span className="text-slate-300 font-bold">Serial: {item.serial}</span>
                          <span>•</span>
                          <span>Purchased: {item.purchaseDate}</span>
                          <span>•</span>
                          <span className="text-slate-400">{item.warrantyTerm}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <div className="text-left md:text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 block">
                            {item.status} ({item.daysRemaining} Days Left)
                          </span>
                        </div>

                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-sm flex items-center gap-1.5 text-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Request Warranty Support</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  All warranties are honored directly through authorized Bangladesh brand distributors (UCC, Smart Technologies, Star Tech, Excel) and our Chattogram Central RMA desk.
                </span>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE & ADDRESS */}
          {activeTab === "profile" && (
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h2 className="font-headline font-bold text-xl text-white">
                  Customer Profile &amp; Default Delivery Address
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Manage your personal credentials, contact numbers, and primary Chattogram / Bangladesh delivery address
                </p>
              </div>

              {profileMessage && (
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-mono ${
                    profileMessage.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-5 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block uppercase text-[11px]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Raisul Maharub"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>

                  {/* Registered Email (Read-Only) */}
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block uppercase text-[11px]">
                      Registered Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={userEmail}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>Verified via Supabase Auth</span>
                    </span>
                  </div>
                </div>

                {/* Phone Number with BD Validation */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block uppercase text-[11px]">
                    Phone Number (BD Mobile) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801811223344 or 01811223344"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Format: +8801XXXXXXXXX or 01XXXXXXXXX (Used for courier SMS updates &amp; COD verification)
                  </span>
                </div>

                {/* Shipping Address Sub-Section */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <h3 className="font-bold text-sm text-slate-200">Default Shipping Address</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block uppercase text-[11px]">
                        District *
                      </label>
                      <input
                        type="text"
                        required
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="e.g. Chattogram"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block uppercase text-[11px]">
                        Thana / Area *
                      </label>
                      <input
                        type="text"
                        required
                        value={thana}
                        onChange={(e) => setThana(e.target.value)}
                        placeholder="e.g. GEC Circle / Agrabad"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block uppercase text-[11px]">
                      Street &amp; Building Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. House 12, Road 4, Nasirabad H/S"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPendingProfile}
                    className="px-6 py-2.5 rounded-xl bg-[#b61722] hover:bg-[#99131c] disabled:opacity-50 text-white font-bold transition-all shadow-md flex items-center gap-2"
                  >
                    {isPendingProfile ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 6: SECURITY */}
          {activeTab === "security" && (
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="pb-4 border-b border-slate-800">
                <h2 className="font-headline font-bold text-xl text-white">
                  Security &amp; Password Management
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Update your account password and security credentials
                </p>
              </div>

              {securityMessage && (
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-mono ${
                    securityMessage.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{securityMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleSecuritySubmit} className="space-y-5 font-mono text-xs max-w-md">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block uppercase text-[11px]">
                    New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block uppercase text-[11px]">
                    Confirm New Password *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPendingSecurity}
                    className="px-6 py-2.5 rounded-xl bg-[#b61722] hover:bg-[#99131c] disabled:opacity-50 text-white font-bold transition-all shadow-md flex items-center gap-2"
                  >
                    {isPendingSecurity ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
