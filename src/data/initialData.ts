import { SupplierCosts, DesiredGPs, Brand, Supplier, SKU, CostDetail } from '@/lib/types';

export const INITIAL_SUPPLIERS: Supplier[] = ['Exide', 'Willard', 'Rezist', 'Enertec', 'Electro City'];

export const SCRAP_VALUES: Record<string, number> = {
  standard: 150,
  large: 250,
  none: 0
};

// --- UPDATED SECTION ---
// This object now correctly maps each SKU to its scrap category based on your lists.
export const SKU_SCRAP_CATEGORIES: Record<SKU, 'standard' | 'large'> = {
  // Standard SKUs (R150)
  '610': 'standard',
  '611': 'standard',
  '612': 'standard',
  '615': 'standard',
  '616': 'standard',
  '619': 'standard',
  '621': 'standard',
  '622': 'standard',
  '628': 'standard',
  '630': 'standard',
  '631': 'standard',
  '634': 'standard',
  '636': 'standard',
  '636CS / HT': 'standard',
  '638': 'standard',
  '639': 'standard',
  '640 / 643': 'standard',
  '646': 'standard',
  '651': 'standard',
  '652': 'standard',
  '652PS 75Ah': 'standard',
  '657': 'standard',
  '659': 'standard',
  '612AGM': 'standard',
  '646AGM': 'standard',
  '652AGM': 'standard',
  'RR0': 'standard',
  'RR1': 'standard',

  // Large SKUs (R250)
  '650': 'large',
  '658': 'large',
  '668': 'large',
  '669': 'large',
  '674': 'large',
  '682': 'large',
  '683': 'large',
  '689': 'large',
  '690': 'large',
  '692': 'large',
  '695': 'large',
  '696': 'large',
  'SMF100 / 674TP': 'large',
  'SMF101 / 674SP': 'large',
  '668AGM': 'large',
  '658AGM': 'large',
  '105AGM': 'large'
};

const rawCostData = [
    { size: '610', exide: 948.07, willard: 979.00, rezist: 0.00 },
    { size: '611', exide: 948.07, willard: 979.00, rezist: 0.00 },
    { size: '612', exide: 971.80, willard: 928.00, rezist: 0.00 },
    { size: '615', exide: 888.18, willard: 928.00, rezist: 0.00 },
    { size: '616', exide: 888.18, willard: 928.00, rezist: 0.00 },
    { size: '619', exide: 925.47, willard: 964.00, rezist: 415.00 },
    { size: '621', exide: 1066.72, willard: 1070.00, rezist: 0.00 },
    { size: '622', exide: 1066.72, willard: 1070.00, rezist: 0.00 },
    { size: '628', exide: 1050.90, willard: 1089.00, rezist: 490.00 },
    { size: '630', exide: 971.80, willard: 966.00, rezist: 0.00 },
    { size: '631', exide: 971.80, willard: 966.00, rezist: 0.00 },
    { size: '634', exide: 948.07, willard: 1007.00, rezist: 0.00 },
    { size: '636', exide: 932.25, willard: 1007.00, rezist: 0.00 },
    { size: '636CS / HT', exide: 1068.98, willard: 1007.00, rezist: 0.00 },
    { size: '638', exide: 1159.38, willard: 1224.00, rezist: 0.00 },
    { size: '639', exide: 1159.38, willard: 1224.00, rezist: 0.00 },
    { size: '640 / 643', exide: 1334.53, willard: 1242.00, rezist: 0.00 },
    { size: '646', exide: 1248.65, willard: 1242.00, rezist: 495.00 },
    { size: '651', exide: 1309.67, willard: 1333.00, rezist: 0.00 },
    { size: '652', exide: 1444.14, willard: 1449.00, rezist: 750.00 },
    { size: '652PS 75Ah', exide: 1594.43, willard: 0.00, rezist: 0.00 },
    { size: '657', exide: 1444.14, willard: 1449.00, rezist: 0.00 },
    { size: '659', exide: 2095.02, willard: 1632.00, rezist: 0.00 },
    { size: '650', exide: 1578.61, willard: 1547.00, rezist: 0.00 },
    { size: '658', exide: 1959.42, willard: 2009.00, rezist: 1220.00 },
    { size: '668', exide: 1957.16, willard: 1808.00, rezist: 790.00 },
    { size: '669', exide: 1957.16, willard: 1808.00, rezist: 0.00 },
    { size: '674', exide: 1902.92, willard: 1890.00, rezist: 0.00 },
    { size: '682', exide: 2465.66, willard: 2486.00, rezist: 0.00 },
    { size: '683', exide: 2465.66, willard: 2486.00, rezist: 0.00 },
    { size: '689', exide: 2905.23, willard: 2912.00, rezist: 0.00 },
    { size: '690', exide: 2905.23, willard: 2912.00, rezist: 0.00 },
    { size: '692', exide: 3626.17, willard: 3330.00, rezist: 0.00 },
    { size: '695', exide: 4605.88, willard: 0.00, rezist: 0.00 },
    { size: '696', exide: 3944.83, willard: 3002.00, rezist: 0.00 },
    { size: 'SMF100 / 674TP', exide: 2057.73, willard: 2421.00, rezist: 0.00 },
    { size: 'SMF101 / 674SP', exide: 2057.73, willard: 2421.00, rezist: 0.00 },
    { size: '612AGM', exide: 2257.74, willard: 0.00, rezist: 0.00 },
    { size: '646AGM', exide: 2396.73, willard: 2580.00, rezist: 0.00 },
    { size: '652AGM', exide: 2684.88, willard: 3170.00, rezist: 0.00 },
    { size: '668AGM', exide: 3006.93, willard: 3476.00, rezist: 0.00 },
    { size: '658AGM', exide: 3369.66, willard: 3692.00, rezist: 0.00 },
    { size: '105AGM', exide: 3766.29, willard: 4035.00, rezist: 0.00 },
    { size: 'RR0', exide: 981.97, willard: 1188.00, rezist: 0.00 },
    { size: 'RR1', exide: 1119.83, willard: 1410.00, rezist: 0.00 },
];

const costs: SupplierCosts = {};
const gps: DesiredGPs = {};

const createCostDetail = (price: number, scrap: number = 0): CostDetail => ({
    invoicePrice: price,
    scrapLoading: scrap
});

rawCostData.forEach(item => {
  const sku = String(item.size);
  const scrapCategory = SKU_SCRAP_CATEGORIES[sku] || 'standard'; // Default to standard if not found
  const scrapValue = SCRAP_VALUES[scrapCategory] || 0;
  
  costs[sku] = {
    Exide: createCostDetail(item.exide),
    Willard: createCostDetail(item.willard),
    Rezist: createCostDetail(item.rezist, scrapValue),
    Enertec: createCostDetail(0, scrapValue), // Automatically applies correct scrap value
    'Electro City': createCostDetail(0, scrapValue), // Automatically applies correct scrap value
  };
  gps[sku] = { gTierGP: 20, bTierGP: 30, sTierGP: 40 };
});

// Per-SKU GP Overrides
gps['646'] = { gTierGP: 20, bTierGP: 32.5, sTierGP: 45 };
gps['652'] = { gTierGP: 20, bTierGP: 35, sTierGP: 50 };
gps['668'] = { gTierGP: 20, bTierGP: 35, sTierGP: 50 };
gps['658'] = { gTierGP: 20, bTierGP: 35, sTierGP: 50 };

export const INITIAL_SUPPLIER_COSTS: SupplierCosts = costs;
export const INITIAL_DESIRED_GPS: DesiredGPs = gps;

export const SELLING_BRANDS: Brand[] = ['Exide', 'Willard', 'Novax Premium', 'Novax 18', 'Global'];