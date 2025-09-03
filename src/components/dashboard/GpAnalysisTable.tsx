'use client';

import { useState, useMemo } from 'react';
import { usePricingStore } from '@/store/pricingStore';
import { SKU } from '@/lib/types';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/formatters';

const VAT_RATE = 1.15;

export default function GpAnalysisTable() {
  const { supplierCosts } = usePricingStore();
  
  const [manualPrices, setManualPrices] = useState<Record<SKU, number | ''>>({});
  const [inputsIncludeVat, setInputsIncludeVat] = useState(true);

  const skus = Object.keys(supplierCosts);

  const handlePriceChange = (sku: SKU, value: string) => {
    const newPrice = value === '' ? '' : parseFloat(value);
    setManualPrices(prev => ({ ...prev, [sku]: newPrice }));
  };

  const analysisData = useMemo(() => {
    return skus.map(sku => {
      const costs = supplierCosts[sku];
      // Ensure costs for anchor brands exist before calculating average
      const avgCost = (costs?.Exide?.invoicePrice || 0) + (costs?.Willard?.invoicePrice || 0) / 2;
      const sellingPrice = manualPrices[sku];

      if (sellingPrice === '' || sellingPrice === null || sellingPrice === undefined || avgCost === 0) {
        return { sku, avgCost, profit: null, gp: null };
      }

      const sellingPriceExVat = inputsIncludeVat ? sellingPrice / VAT_RATE : sellingPrice;
      const profit = sellingPriceExVat - avgCost;
      const gp = sellingPriceExVat > 0 ? (profit / sellingPriceExVat) * 100 : 0;

      return { sku, avgCost, profit, gp };
    });
  }, [skus, supplierCosts, manualPrices, inputsIncludeVat]);

  const getGpColor = (gp: number | null) => {
    if (gp === null) return 'text-gray-400';
    if (gp < 15) return 'text-red-400';
    if (gp < 30) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <Card padding="none">
      <div className="p-4 border-b border-gray-700 flex justify-end">
        <label htmlFor="vat-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" id="vat-toggle" className="sr-only peer" checked={inputsIncludeVat} onChange={(e) => setInputsIncludeVat(e.target.checked)} />
              <div className="block bg-gray-600 w-14 h-8 rounded-full peer-checked:bg-red-600 transition"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-6"></div>
            </div>
            <div className="ml-3 text-gray-300 font-medium text-sm">Input Prices Include VAT</div>
          </label>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">SKU</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Avg Cost</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Your Selling Price</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Profit (Rand)</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">GP %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {analysisData.map(({ sku, avgCost, profit, gp }) => (
              <tr key={sku} className="hover:bg-gray-700/50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{sku}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">{formatCurrency(avgCost)}</td>
                <td className="whitespace-nowrap px-3 py-4">
                  <div className="relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-400 sm:text-sm">R</span>
                    </div>
                    <input
                      type="number"
                      value={manualPrices[sku] || ''}
                      onChange={(e) => handlePriceChange(sku, e.target.value)}
                      className="w-32 rounded-md border-gray-600 bg-gray-700 text-white pl-7 pr-2 py-2 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-300">
                  {profit !== null ? formatCurrency(profit) : '---'}
                </td>
                <td className={`whitespace-nowrap px-3 py-4 text-sm font-bold ${getGpColor(gp)}`}>
                  {gp !== null ? `${gp.toFixed(1)}%` : '---'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}