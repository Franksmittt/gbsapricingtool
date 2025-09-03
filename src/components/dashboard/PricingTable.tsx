'use client';

import { useState, useEffect } from 'react';
import { usePricingStore } from '@/store/pricingStore';
// FIX: Removed unused 'PriceTier' import
import { SKU, Brand, CalculatedPrices } from '@/lib/types';
import Card from '@/components/ui/Card';

const formatCurrency = (value: number | null) => {
  if (isNaN(value as number) || value === null) return 'N/A';
  return value.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' });
};

interface PricingTableProps {
  priceData: CalculatedPrices;
  sellingBrands: Brand[];
}

export default function PricingTable({ priceData, sellingBrands }: PricingTableProps) {
  const { activeTier } = usePricingStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!priceData || !isClient) {
    return (
      <Card padding="none">
        <div className="overflow-x-auto p-10 text-center text-gray-500">Loading prices...</div>
      </Card>
    );
  }

  const skus = Object.keys(priceData) as SKU[];

  return (
    <Card padding="none">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">SKU</th>
              {sellingBrands.map((brand) => (
                <th key={brand} scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">{brand}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {skus.map((sku) => (
              <tr key={sku} className="hover:bg-gray-700/50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{sku}</td>
                {sellingBrands.map((brand) => (
                  <td key={`${sku}-${brand}`} className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                    {formatCurrency(priceData[sku]?.[activeTier]?.[brand] ?? null)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}