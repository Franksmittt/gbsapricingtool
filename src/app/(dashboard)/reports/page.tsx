'use client';

import { useMemo, useState } from 'react';
import { usePricingStore } from '@/store/pricingStore';
import { calculateAllPrices } from '@/lib/calculations';
import BrandReport from '@/components/dashboard/BrandReport';
import { SKU, Brand, PriceTier } from '@/lib/types';
import { SELLING_BRANDS } from '@/data/initialData';
import Button from '@/components/ui/Button';
import { Printer } from 'lucide-react';

interface ReportRow {
  size: SKU;
  cost: number;
  vdbPriceIncVat: number;
  albPriceIncVat: number;
  difference: number;
  vdbGp: number;
  albGp: number;
  gpDiff: number;
}

export default function ReportsPage() {
  const [selectedBrand, setSelectedBrand] = useState<Brand>('Willard');

  const useBrandReportData = () => {
    const { supplierCosts, desiredGPs } = usePricingStore();

    return useMemo(() => {
      const albertonPricesExVat = calculateAllPrices(supplierCosts, 'Alberton', desiredGPs, 'NearestR50', false);
      const vanderbijlparkPricesExVat = calculateAllPrices(supplierCosts, 'Vanderbijlpark', desiredGPs, 'NearestR50', false);

      const reportData: Record<PriceTier, ReportRow[]> = { G: [], B: [], S: [], A: [] };

      for (const sku in supplierCosts) {
        const skuTyped = sku as SKU;
        const costs = supplierCosts[skuTyped];
        
        const brandCostDetail = costs[selectedBrand] || costs['Rezist'];
        const brandCost = brandCostDetail.invoicePrice - brandCostDetail.scrapLoading;
        
        if (!costs.Exide?.invoicePrice || !costs.Willard?.invoicePrice) continue;

        (['G', 'B', 'S', 'A'] as PriceTier[]).forEach(tier => {
          const albPriceExVat = albertonPricesExVat[skuTyped]?.[tier]?.[selectedBrand];
          const vdbPriceExVat = vanderbijlparkPricesExVat[skuTyped]?.[tier]?.[selectedBrand];
          
          if (albPriceExVat === null || vdbPriceExVat === null || typeof albPriceExVat === 'undefined' || typeof vdbPriceExVat === 'undefined') return;

          const albProfit = albPriceExVat - brandCost;
          const vdbProfit = vdbPriceExVat - brandCost;

          const albGp = albPriceExVat > 0 ? (albProfit / albPriceExVat) * 100 : 0;
          const vdbGp = vdbPriceExVat > 0 ? (vdbProfit / vdbPriceExVat) * 100 : 0;
          
          reportData[tier].push({
            size: skuTyped,
            cost: brandCost,
            vdbPriceIncVat: vdbPriceExVat * 1.15,
            albPriceIncVat: albPriceExVat * 1.15,
            difference: (albPriceExVat * 1.15) - (vdbPriceExVat * 1.15),
            vdbGp,
            albGp,
            gpDiff: albGp - vdbGp,
          });
        });
      }
      return reportData;
    }, [supplierCosts, desiredGPs, selectedBrand]);
  };

  const reportData = useBrandReportData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 no-print">
        <div>
          <h1 className="text-3xl font-bold text-white">Brand Price Reports</h1>
          <p className="text-gray-400">Generate a complete, printable price list for a specific brand.</p>
        </div>
        <div className="flex items-center gap-4">
            <select
              id="brand-selector"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value as Brand)}
              className="rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm py-2"
            >
              {SELLING_BRANDS.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
            <Button onClick={() => window.print()} variant="primary">
                <Printer className="h-4 w-4 mr-2" />
                Print Report
            </Button>
        </div>
      </div>
      <div className="print-section">
        <BrandReport data={reportData} brandName={selectedBrand} />
      </div>
    </div>
  );
}