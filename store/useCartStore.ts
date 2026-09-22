import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HardwareProduct, HARDWARE_PRODUCTS } from "@/data/hardwareDatabase";
import { BuilderSlotKey, LabServices } from "./useBuilderStore";

export interface BundledRig {
  id: string;
  name: string;
  components: Record<BuilderSlotKey, HardwareProduct | null>;
  services: LabServices;
  rigSubtotal: number;
  totalWithServices: number;
  addedAt: number;
}

export interface StandaloneCartItem {
  product: HardwareProduct;
  quantity: number;
}

export type FulfillmentMode = "courier" | "pickup";
export type BranchKey = "idb" | "multiplan" | "motijheel" | "uttara" | "chittagong";
export type PaymentMethod = "cod" | "mfs" | "card" | "emi";

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  district: string;
  thana: string;
  address: string;
  notes: string;
  pickupBranch: BranchKey;
}

export interface B2BDetails {
  enabled: boolean;
  companyName: string;
  vatBin: string;
  tinNumber: string;
}

interface CartState {
  bundledRigs: BundledRig[];
  standaloneItems: StandaloneCartItem[];
  couponCode: string;
  couponDiscount: number;
  fulfillmentMode: FulfillmentMode;
  deliveryDetails: DeliveryDetails;
  paymentMethod: PaymentMethod;
  selectedEmiMonths: number;
  b2bDetails: B2BDetails;
  isMfsModalOpen: boolean;
  orderCompleted: boolean;
  orderId: string | null;

  // Actions
  addBundledRig: (rig: Omit<BundledRig, "id" | "addedAt">) => void;
  removeBundledRig: (rigId: string) => void;
  addStandaloneItem: (product: HardwareProduct, quantity?: number) => void;
  removeStandaloneItem: (productId: string) => void;
  updateStandaloneQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  setFulfillmentMode: (mode: FulfillmentMode) => void;
  updateDeliveryDetails: (details: Partial<DeliveryDetails>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setSelectedEmiMonths: (months: number) => void;
  updateB2BDetails: (details: Partial<B2BDetails>) => void;
  setMfsModalOpen: (open: boolean) => void;
  submitOrder: () => Promise<{ success: boolean; orderId: string }>;
  clearCart: () => void;
  loadSampleCart: () => void;

  // Calculations
  getItemsSubtotal: () => number;
  getServicesSubtotal: () => number;
  getShippingFee: () => number;
  getInsuranceFee: () => number;
  getGrandTotal: () => number;
  getTotalItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      bundledRigs: [],
      standaloneItems: [],
      couponCode: "ARCHITECT10",
      couponDiscount: 2000,
      fulfillmentMode: "courier",
      deliveryDetails: {
        fullName: "Tanvir Hossain Chowdhury",
        phone: "+880 1712-449811",
        district: "Dhaka District (North / South)",
        thana: "Mirpur / Mirpur DOHS",
        address: "House #12, Road #4, Block C, Mirpur DOHS, Dhaka-1216",
        notes: "Please pack chassis in original outer double-box with foam braces. Insert GPU bracket support.",
        pickupBranch: "idb",
      },
      paymentMethod: "cod",
      selectedEmiMonths: 12,
      b2bDetails: {
        enabled: false,
        companyName: "",
        vatBin: "",
        tinNumber: "",
      },
      isMfsModalOpen: false,
      orderCompleted: false,
      orderId: null,

      addBundledRig: (rig) => {
        const newRig: BundledRig = {
          ...rig,
          id: `VM-${Math.floor(10000 + Math.random() * 90000)}`,
          addedAt: Date.now(),
        };
        set((state) => ({
          bundledRigs: [...state.bundledRigs, newRig],
        }));
      },

      removeBundledRig: (rigId) => {
        set((state) => ({
          bundledRigs: state.bundledRigs.filter((r) => r.id !== rigId),
        }));
      },

      addStandaloneItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.standaloneItems.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              standaloneItems: state.standaloneItems.map((i) =>
                i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            };
          }
          return {
            standaloneItems: [...state.standaloneItems, { product, quantity }],
          };
        });
      },

      removeStandaloneItem: (productId) => {
        set((state) => ({
          standaloneItems: state.standaloneItems.filter((i) => i.product.id !== productId),
        }));
      },

      updateStandaloneQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeStandaloneItem(productId);
          return;
        }
        set((state) => ({
          standaloneItems: state.standaloneItems.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        if (clean === "ARCHITECT10" || clean === "VOLT2000") {
          set({ couponCode: clean, couponDiscount: 2000 });
          return { success: true, message: "Coupon applied: ৳2,000 instant discount!" };
        }
        if (clean === "SILICON5") {
          const discount = Math.round(get().getItemsSubtotal() * 0.05);
          set({ couponCode: clean, couponDiscount: discount });
          return { success: true, message: `Coupon applied: ৳${discount.toLocaleString()} (5% off)!` };
        }
        return { success: false, message: "Invalid voucher code. Try ARCHITECT10." };
      },

      removeCoupon: () => {
        set({ couponCode: "", couponDiscount: 0 });
      },

      setFulfillmentMode: (mode) => {
        set({ fulfillmentMode: mode });
      },

      updateDeliveryDetails: (details) => {
        set((state) => ({
          deliveryDetails: { ...state.deliveryDetails, ...details },
        }));
      },

      setPaymentMethod: (method) => {
        set({ paymentMethod: method });
      },

      setSelectedEmiMonths: (months) => {
        set({ selectedEmiMonths: months });
      },

      updateB2BDetails: (details) => {
        set((state) => ({
          b2bDetails: { ...state.b2bDetails, ...details },
        }));
      },

      setMfsModalOpen: (open) => {
        set({ isMfsModalOpen: open });
      },

      submitOrder: async () => {
        const generatedId = `VM-${Date.now().toString().slice(-6)}`;
        set({ orderCompleted: true, orderId: generatedId });
        return { success: true, orderId: generatedId };
      },

      clearCart: () => {
        set({
          bundledRigs: [],
          standaloneItems: [],
          couponCode: "",
          couponDiscount: 0,
          orderCompleted: false,
          orderId: null,
        });
      },

      loadSampleCart: () => {
        // Load default rig and peripheral matching Screen 5 from Stitch
        const findById = (id: string) => HARDWARE_PRODUCTS.find((p) => p.id === id) || null;
        const rigParts = {
          cpu: findById("cpu-7800x3d"),
          motherboard: findById("mobo-b650-tomahawk"),
          cooler: findById("cooler-ls720"),
          ram: findById("ram-corsair-ddr5-32gb"),
          storage: findById("ssd-samsung-990-pro-1tb"),
          gpu: findById("gpu-rtx-4070-super"),
          psu: findById("psu-corsair-rm750e"),
          chassis: findById("case-pop-air-rgb"),
          peripherals: null,
        };

        const rigSub = Object.values(rigParts).reduce((acc, p) => (p ? acc + p.price : acc), 0);
        const sampleRig: BundledRig = {
          id: "VM-88491",
          name: "VoltMatrix AM5 7800X3D + RTX 4070 SUPER Master Rig",
          components: rigParts,
          services: {
            assembly: true,
            occtStressTest: true,
            osBiosSetup: false,
          },
          rigSubtotal: rigSub,
          totalWithServices: rigSub + 1500,
          addedAt: Date.now(),
        };

        const peripheral = HARDWARE_PRODUCTS.find((p) => p.id === "mouse-g-pro-x-2");

        set({
          bundledRigs: [sampleRig],
          standaloneItems: peripheral ? [{ product: peripheral, quantity: 1 }] : [],
          couponCode: "ARCHITECT10",
          couponDiscount: 2000,
          fulfillmentMode: "courier",
          orderCompleted: false,
          orderId: null,
        });
      },

      getItemsSubtotal: () => {
        const { bundledRigs, standaloneItems } = get();
        const rigsSub = bundledRigs.reduce((acc, r) => acc + r.rigSubtotal, 0);
        const standSub = standaloneItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
        return rigsSub + standSub;
      },

      getServicesSubtotal: () => {
        const { bundledRigs } = get();
        return bundledRigs.reduce((acc, r) => {
          let extra = 0;
          if (r.services.occtStressTest) extra += 1500;
          if (r.services.osBiosSetup) extra += 500;
          return acc + extra;
        }, 0);
      },

      getShippingFee: () => {
        const subtotal = get().getItemsSubtotal();
        const { fulfillmentMode } = get();
        if (fulfillmentMode === "pickup") return 0;
        if (subtotal >= 50000 || subtotal === 0) return 0; // Free delivery promo over 50k
        return 150;
      },

      getInsuranceFee: () => {
        const subtotal = get().getItemsSubtotal();
        if (subtotal === 0) return 0;
        return 650; // Wooden crating + transit insurance
      },

      getGrandTotal: () => {
        const itemsSub = get().getItemsSubtotal();
        const servicesSub = get().getServicesSubtotal();
        const shipping = get().getShippingFee();
        const insurance = get().getInsuranceFee();
        const discount = get().couponDiscount;

        const total = itemsSub + servicesSub + shipping + insurance - discount;
        return Math.max(0, total);
      },

      getTotalItemCount: () => {
        const { bundledRigs, standaloneItems } = get();
        const rigPartsCount = bundledRigs.reduce((acc, r) => {
          const filled = Object.values(r.components).filter((c) => c !== null).length;
          return acc + filled;
        }, 0);
        const standCount = standaloneItems.reduce((acc, i) => acc + i.quantity, 0);
        return rigPartsCount + standCount;
      },
    }),
    {
      name: "voltmatrix-cart-state",
      partialize: (state) => ({
        bundledRigs: state.bundledRigs,
        standaloneItems: state.standaloneItems,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
        fulfillmentMode: state.fulfillmentMode,
        deliveryDetails: state.deliveryDetails,
        paymentMethod: state.paymentMethod,
        selectedEmiMonths: state.selectedEmiMonths,
        b2bDetails: state.b2bDetails,
      }),
    }
  )
);
