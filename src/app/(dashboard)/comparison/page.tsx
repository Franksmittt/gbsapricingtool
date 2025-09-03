'use client';

import { useMemo, useState } from 'react';
import { usePricingStore } from '@/store/pricingStore';
import { calculateAllPrices } from '@/lib/calculations';
import PriceControls from '@/components/dashboard/PriceControls';
import ComparisonTable from '@/components/dashboard/ComparisonTable';
import { SKU, Brand } from '@/lib/types';
import { SELLING_BRANDS } from '@/data/initialData';

export default function ComparisonPage() {
  const [selectedBrand, setSelectedBrand] = useState<Brand>(SELLING_BRANDS[0]);

  const useComparisonData = () => {
    const { supplierCosts, desiredGPs, rounding, includeVAT, activeTier } = usePricingStore();

    return useMemo(() => {
      const albertonData = calculateAllPrices(supplierCosts, 'Alberton', desiredGPs, rounding, includeVAT);
      const vanderbijlparkData = calculateAllPrices(supplierCosts, 'Vanderbijlpark', desiredGPs, rounding, includeVAT);
      
      const comparisonResult = [];
      
      for (const sku in supplierCosts) {
        const skuTyped = sku as SKU;
        const costs = supplierCosts[skuTyped];
        
        // --- LOGIC CORRECTION IS HERE ---
        // Determine the correct cost basis for the selected brand.
        let brandCost = 0;
        if (['Exide', 'Willard'].includes(selectedBrand)) {
            // For anchor brands, use their direct invoice price.
            brandCost = costs[selectedBrand]?.invoicePrice || 0;
        } else {
            // For house brands, use the adjusted cost from Rezist.
            const rezistCost = costs['Rezist'] || { invoicePrice: 0, scrapLoading: 0 };
            brandCost = rezistCost.invoicePrice - rezistCost.scrapLoading;
        }
        
        if (!costs.Exide?.invoicePrice || !costs.Willard?.invoicePrice) continue;

        const albertonPrice = albertonData[skuTyped]?.[activeTier]?.[selectedBrand] || 0;
        const vanderbijlparkPrice = vanderbijlparkData[skuTyped]?.[activeTier]?.[selectedBrand] || 0;
        
        const vatMultiplier = includeVAT ? 1.15 : 1;
        const albertonPriceExVat = albertonPrice / vatMultiplier;
        const vanderbijlparkPriceExVat = vanderbijlparkPrice / vatMultiplier;

        const albertonProfit = albertonPriceExVat - brandCost;
        const vanderbijlparkProfit = vanderbijlparkPriceExVat - brandCost;

        const albertonGp = albertonPriceExVat > 0 ? (albertonProfit / albertonPriceExVat) * 100 : 0;
        const vanderbijlparkGp = vanderbijlparkPriceExVat > 0 ? (vanderbijlparkProfit / vanderbijlparkPriceExVat) * 100 : 0;

        comparisonResult.push({
          sku: skuTyped,
          albertonPrice,
          vanderbijlparkPrice,
          albertonProfit,
          vanderbijlparkProfit,
          albertonGp,
          vanderbijlparkGp,
          priceDiff: vanderbijlparkPrice - albertonPrice,
          profitDiff: vanderbijlparkProfit - albertonProfit,
          gpDiff: vanderbijlparkGp - albertonGp,
        });
      }
      return comparisonResult;
    }, [supplierCosts, desiredGPs, rounding, includeVAT, activeTier, selectedBrand]);
  };

  const comparisonData = useComparisonData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Branch Price Comparison</h1>
        <p className="text-gray-400">Side-by-side analysis of Alberton vs. Vanderbijlpark pricing.</p>
      </div>
      <PriceControls />
      <ComparisonTable 
        data={comparisonData}
        brands={SELLING_BRANDS}
        selectedBrand={selectedBrand}
        onBrandChange={setSelectedBrand}
      />
    </div>
  );
}