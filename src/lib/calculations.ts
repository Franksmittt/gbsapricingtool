import {
  SKU,
  SupplierCosts,
  Rounding,
  Branch,
  PriceTier,
  DesiredGPs,
  CalculatedPrices,
  Supplier,
} from './types';

const VAT_RATE = 1.15;

function roundToNearest(value: number, nearest: number): number {
  if (nearest === 0 || nearest === 1) return value;
  return Math.round(value / nearest) * nearest;
}

const calculatePriceFromGp = (cost: number, gp: number, roundingValue: number) => {
  if (cost <= 0 || gp >= 100) return { incVat: null, exVat: null };
  const rawExVat = cost / (1 - gp / 100);
  const incVatRounded = roundToNearest(rawExVat * VAT_RATE, roundingValue);
  const exVatFinal = incVatRounded / VAT_RATE;
  return { incVat: incVatRounded, exVat: exVatFinal };
};

export function calculateAllPrices(
  supplierCosts: SupplierCosts,
  branch: Branch,
  desiredGPs: DesiredGPs,
  rounding: Rounding,
  includeVAT: boolean
): CalculatedPrices {
  
  const calculatedData: CalculatedPrices = {};
  const roundingValue = rounding === 'NearestR50' ? 50 : 1;

  for (const sku in supplierCosts) {
    const skuTyped = sku as SKU;
    const costs = supplierCosts[skuTyped];
    const exideCost = costs.Exide?.invoicePrice || 0;
    const willardCost = costs.Willard?.invoicePrice || 0;

    if (exideCost === 0 || willardCost === 0) {
      calculatedData[skuTyped] = { 
        G: { 'Exide': null, 'Willard': null, 'Global': null, 'Novax 18': null, 'Novax Premium': null },
        B: { 'Exide': null, 'Willard': null, 'Global': null, 'Novax 18': null, 'Novax Premium': null },
        S: { 'Exide': null, 'Willard': null, 'Global': null, 'Novax 18': null, 'Novax Premium': null },
        A: { 'Exide': null, 'Willard': null, 'Global': null, 'Novax 18': null, 'Novax Premium': null }
      };
      continue;
    }
    
    const avgCost = (exideCost + willardCost) / 2;
    const targets = desiredGPs[skuTyped] || { gTierGP: 20, bTierGP: 30, sTierGP: 40 };

    const gTier = calculatePriceFromGp(avgCost, targets.gTierGP, roundingValue);
    const bTier = calculatePriceFromGp(avgCost, targets.bTierGP, roundingValue);
    const sTier = calculatePriceFromGp(avgCost, targets.sTierGP, roundingValue);

    if(!gTier.incVat || !bTier.incVat || !sTier.incVat) continue;

    const rawATierIncVat = (bTier.incVat + sTier.incVat) / 2;
    const aTierIncVat = roundToNearest(rawATierIncVat, roundingValue);
    const aTierExVat = aTierIncVat / VAT_RATE;

    const albertonTierPrices: Record<PriceTier, { exVat: number | null }> = {
        G: { exVat: gTier.exVat }, B: { exVat: bTier.exVat },
        S: { exVat: sTier.exVat }, A: { exVat: aTierExVat },
    };

    calculatedData[skuTyped] = {};

    for (const tier in albertonTierPrices) {
      const tierTyped = tier as PriceTier;
      let anchorPriceExVat = albertonTierPrices[tierTyped].exVat;

      if (anchorPriceExVat === null) {
          calculatedData[skuTyped]![tierTyped] = { 'Exide': null, 'Willard': null, 'Global': null, 'Novax 18': null, 'Novax Premium': null };
          continue;
      }

      if (branch === 'Vanderbijlpark') {
        const rawVdbPriceExVat = anchorPriceExVat / 1.1;
        anchorPriceExVat = roundToNearest(rawVdbPriceExVat * VAT_RATE, roundingValue) / VAT_RATE;
      }
      
      const priceMultiplier = includeVAT ? VAT_RATE : 1;

      const localSuppliers: Supplier[] = ['Rezist', 'Enertec', 'Electro City'];
      
      const hasLocalSupplierCost = localSuppliers.some(supplier =>
        costs[supplier]?.invoicePrice > 0
      );

      let roundedGlobalPriceExVat: number | null = null;
      let roundedNovax18PriceExVat: number | null = null;
      let roundedNovaxPremiumPriceExVat: number | null = null;
      
      if (hasLocalSupplierCost) {
        const novaxPremiumPrice = anchorPriceExVat * (1 - 0.10);
        const novax18Price = novaxPremiumPrice * (1 - 0.10);
        const globalPrice = novax18Price * (1 - 0.10);

        roundedNovaxPremiumPriceExVat = roundToNearest(novaxPremiumPrice * VAT_RATE, roundingValue) / VAT_RATE;
        roundedNovax18PriceExVat = roundToNearest(novax18Price * VAT_RATE, roundingValue) / VAT_RATE;
        roundedGlobalPriceExVat = roundToNearest(globalPrice * VAT_RATE, roundingValue) / VAT_RATE;
      }
      
      calculatedData[skuTyped]![tierTyped] = {
        'Exide': anchorPriceExVat * priceMultiplier,
        'Willard': anchorPriceExVat * priceMultiplier,
        'Global': roundedGlobalPriceExVat !== null ? roundedGlobalPriceExVat * priceMultiplier : null,
        'Novax 18': roundedNovax18PriceExVat !== null ? roundedNovax18PriceExVat * priceMultiplier : null,
        'Novax Premium': roundedNovaxPremiumPriceExVat !== null ? roundedNovaxPremiumPriceExVat * priceMultiplier : null,
      };
    }
  }
  return calculatedData;
}