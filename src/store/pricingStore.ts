import { create } from 'zustand';
import { INITIAL_SUPPLIER_COSTS, INITIAL_DESIRED_GPS, INITIAL_SUPPLIERS } from '@/data/initialData';
import { calculateAllPrices } from '@/lib/calculations';
import type {
  PricingStateWithActions,
  Branch,
  Rounding,
  SKU,
  Supplier,
  PriceTier,
  // FIX: Removed unused 'PricingState' import
  ExportData,
  CostDetail,
} from '@/lib/types';

export const usePricingStore = create<PricingStateWithActions>((set) => ({
  // --- STATE ---
  suppliers: INITIAL_SUPPLIERS,
  branch: 'Alberton',
  includeVAT: true,
  rounding: 'NearestR50',
  activeTier: 'S',
  supplierCosts: INITIAL_SUPPLIER_COSTS,
  desiredGPs: INITIAL_DESIRED_GPS,

  // --- ACTIONS ---
  importData: (data: ExportData) => set({ ...data }),

  addSupplier: (name: string) => 
    set((state) => {
      if (state.suppliers.includes(name) || !name) return state;
      const newSuppliers = [...state.suppliers, name];
      const newSupplierCosts = { ...state.supplierCosts };
      for (const sku in newSupplierCosts) {
        newSupplierCosts[sku][name] = { invoicePrice: 0, scrapLoading: 150 }; // Default new suppliers
      }
      return { suppliers: newSuppliers, supplierCosts: newSupplierCosts };
    }),

  setBranch: (branch: Branch) => set({ branch }),
  setIncludeVAT: (include: boolean) => set({ includeVAT: include }),
  setRounding: (rounding: Rounding) => set({ rounding }),
  setActiveTier: (tier: PriceTier) => set({ activeTier: tier }),

  updateCostDetail: (sku: SKU, supplier: Supplier, costDetail: CostDetail) =>
    set((state) => ({
      supplierCosts: {
        ...state.supplierCosts,
        [sku]: { ...state.supplierCosts[sku], [supplier]: costDetail },
      },
    })),

  updateDesiredGP: (sku: SKU, gTierGP: number, bTierGP: number, sTierGP: number) =>
    set((state) => ({
      desiredGPs: {
        ...state.desiredGPs,
        [sku]: { gTierGP, bTierGP, sTierGP },
      },
    })),
}));

export const useCalculatedPrices = () => {
  const { supplierCosts, branch, desiredGPs, rounding, includeVAT } = usePricingStore();
  return calculateAllPrices(supplierCosts, branch, desiredGPs, rounding, includeVAT);
};