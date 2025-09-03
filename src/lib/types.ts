// This file defines the "shape" of all the important data in our application.

// User-related types for Authentication
export type UserRole = 'Boss' | 'Manager' | 'Technician' | 'Client';
export interface User {
  id: string;
  name: string;
  role: UserRole;
}

// Pricing App specific types
export type SKU = string;
export type Brand = 'Exide' | 'Willard' | 'Novax Premium' | 'Novax 18' | 'Global' | string;
export type Supplier = 'Exide' | 'Willard' | 'Rezist' | 'Enertec' | 'Electro City' | string;
export type Branch = 'Alberton' | 'Vanderbijlpark';
export type PriceTier = 'G' | 'B' | 'A' | 'S';
export type Rounding = 'None' | 'NearestR50';
export type ScrapCategory = 'standard' | 'large' | 'none';

export interface CostDetail {
  invoicePrice: number;
  scrapLoading: number;
}
export type SupplierCosts = Record<SKU, Record<Supplier, CostDetail>>;
export type DesiredGPs = Record<SKU, { gTierGP: number; bTierGP: number; sTierGP: number; }>;

// --- THIS IS THE MISSING TYPE DEFINITION ---
export type CalculatedPrices = Record<SKU, Partial<Record<PriceTier, Record<Brand, number | null>>>>;

export interface ExportData {
  suppliers: Supplier[];
  supplierCosts: SupplierCosts;
  desiredGPs: DesiredGPs;
}

export interface PricingState extends ExportData {
  branch: Branch;
  includeVAT: boolean;
  rounding: Rounding;
  activeTier: PriceTier;
}

export interface PricingStateWithActions extends PricingState {
  importData: (data: ExportData) => void;
  addSupplier: (name: string) => void;
  setBranch: (branch: Branch) => void;
  setIncludeVAT: (include: boolean) => void;
  setRounding: (rounding: Rounding) => void;
  setActiveTier: (tier: PriceTier) => void;
  updateCostDetail: (sku: SKU, supplier: Supplier, costDetail: CostDetail) => void;
  updateDesiredGP: (sku: SKU, gTierGP: number, bTierGP: number, sTierGP: number) => void;
}