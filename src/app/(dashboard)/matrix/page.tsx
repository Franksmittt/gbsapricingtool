'use client';

import React from 'react';
import { usePricingStore } from '@/store/pricingStore';
import { calculateAllPrices } from '@/lib/calculations';
import { SKU, Brand, Supplier } from '@/lib/types';
import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/formatters';
import { Info } from 'lucide-react';

const houseBrands: Brand[] = ['Global', 'Novax 18', 'Novax Premium'];
const localSuppliers: Supplier[] = ['Rezist', 'Enertec', 'Electro City'];

export default function MatrixPage() {
  const { supplierCosts, desiredGPs, updateDesiredGP } = usePricingStore();
  const pricesExVat = calculateAllPrices(supplierCosts, 'Alberton', desiredGPs, 'NearestR50', false);

  const handleGpChange = (sku: SKU, tier: 'gTierGP' | 'bTierGP' | 'sTierGP', value: string) => {
    const newGp = parseFloat(value);
    const currentGps = desiredGPs[sku] || { gTierGP: 20, bTierGP: 30, sTierGP: 40 };
    if (!isNaN(newGp) && newGp >= 0 && newGp < 100) {
      const updatedGps = { ...currentGps, [tier]: newGp };
      updateDesiredGP(sku, updatedGps.gTierGP, updatedGps.bTierGP, updatedGps.sTierGP);
    }
  };

  const getProfitability = (sellPrice: number, cost: number) => {
    if(cost <= 0) return <span className="text-gray-500">No Cost</span>;
    const profit = sellPrice - cost;
    const gp = sellPrice > 0 ? (profit / sellPrice) * 100 : 0;
    const color = gp < 15 ? 'text-red-400' : gp < 30 ? 'text-yellow-400' : 'text-green-400';
    return <span className={color}>{gp.toFixed(1)}%</span>;
  };

  const ProfitabilityAnalysis = ({ sku, sellPrice }: { sku: SKU, sellPrice: number}) => (
    <div className="relative group flex items-center gap-2">
      <span className="italic">Profitability Analysis</span>
      <Info className="h-4 w-4 text-gray-500 cursor-pointer" />
      <div className="absolute z-10 bottom-full mb-2 w-64 bg-gray-900 border border-gray-600 rounded-lg shadow-lg p-3 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <h4 className="font-bold text-white mb-2">Adjusted Cost GP% (S-Tier)</h4>
        <p className="text-gray-400 mb-2">GP% if sourcing a house brand from local suppliers using their cost minus scrap value.</p>
        <ul className="space-y-1">
          {localSuppliers.map(supplier => {
            const costDetail = supplierCosts[sku]?.[supplier];
            if (!costDetail || costDetail.invoicePrice === 0) return null;
            const adjustedCost = costDetail.invoicePrice - costDetail.scrapLoading;
            return (
              <li key={supplier} className="flex justify-between">
                <span className="text-gray-300">{supplier}:</span>
                {getProfitability(sellPrice, adjustedCost)}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Pricing Matrix</h1>
        <p className="text-gray-400">This is the central control panel. Adjust GP% per SKU to see live updates everywhere.</p>
      </div>
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">SKU / Brand</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Avg Cost</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">G-Tier GP%</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">B-Tier GP%</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">S-Tier GP%</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">G-Tier Price</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">B-Tier Price</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">S-Tier Price</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">A-Tier Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {Object.keys(pricesExVat).map((skuStr) => {
                const sku = skuStr as SKU;
                const avgCost = (supplierCosts[sku].Exide.invoicePrice + supplierCosts[sku].Willard.invoicePrice) / 2;
                const tierPrices = pricesExVat[sku];
                const gps = desiredGPs[sku] || { gTierGP: 20, bTierGP: 30, sTierGP: 40 };
                if (!tierPrices) {
                    return null;
                }

                return (
                  <React.Fragment key={sku}>
                    <tr className="bg-gray-800 hover:bg-gray-700/50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-bold text-white sm:pl-6">{sku} (Anchor)</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{formatCurrency(avgCost)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm"><input type="number" defaultValue={gps.gTierGP} onBlur={(e) => handleGpChange(sku, 'gTierGP', e.target.value)} className="w-20 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"/></td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm"><input type="number" defaultValue={gps.bTierGP} onBlur={(e) => handleGpChange(sku, 'bTierGP', e.target.value)} className="w-20 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"/></td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm"><input type="number" defaultValue={gps.sTierGP} onBlur={(e) => handleGpChange(sku, 'sTierGP', e.target.value)} className="w-20 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"/></td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 font-medium">{formatCurrency(tierPrices.G?.['Exide'] ?? null)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 font-medium">{formatCurrency(tierPrices.B?.['Exide'] ?? null)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 font-medium">{formatCurrency(tierPrices.S?.['Exide'] ?? null)}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 font-medium">{formatCurrency(tierPrices.A?.['Exide'] ?? null)}</td>
                    </tr>
                    {houseBrands.map(brand => (
                      <tr key={`${sku}-${brand}`} className="bg-gray-800/50 hover:bg-gray-700/40">
                        <td className="py-2 pl-8 pr-3 text-sm text-gray-300 sm:pl-10">{brand}</td>
                        <td colSpan={4} className="px-3 py-2 text-sm text-gray-400">
                           <ProfitabilityAnalysis sku={sku} sellPrice={tierPrices.S?.[brand] ?? 0} />
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-400">{formatCurrency(tierPrices.G?.[brand] ?? null)}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-400">{formatCurrency(tierPrices.B?.[brand] ?? null)}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-400">{formatCurrency(tierPrices.S?.[brand] ?? null)}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-400">{formatCurrency(tierPrices.A?.[brand] ?? null)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}