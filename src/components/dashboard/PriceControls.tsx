'use client';

import { usePricingStore } from '@/store/pricingStore';
import { Branch, Rounding, PriceTier } from '@/lib/types';
import Card from '@/components/ui/Card';

export default function PriceControls() {
  const {
    branch, setBranch,
    rounding, setRounding,
    includeVAT, setIncludeVAT,
    activeTier, setActiveTier
  } = usePricingStore();

  const selectClasses = "w-full pl-3 pr-10 py-2 text-base border-gray-600 bg-gray-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm";

  return (
    <Card padding="md">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
        <div>
          <label htmlFor="tier-select" className="block text-sm font-medium text-gray-300 mb-1">Price Tier</label>
          <select id="tier-select" value={activeTier} onChange={(e) => setActiveTier(e.target.value as PriceTier)} className={selectClasses}>
            <option value="S">S - Counter</option>
            <option value="A">A - Advertising</option>
            <option value="B">B - Good Customer</option>
            <option value="G">G - Large Customer</option>
          </select>
        </div>
        <div>
          <label htmlFor="branch-select" className="block text-sm font-medium text-gray-300 mb-1">Branch</label>
          <select id="branch-select" value={branch} onChange={(e) => setBranch(e.target.value as Branch)} className={selectClasses}>
            <option>Alberton</option>
            <option>Vanderbijlpark</option>
          </select>
        </div>
        <div>
          <label htmlFor="rounding-select" className="block text-sm font-medium text-gray-300 mb-1">Rounding</label>
          <select id="rounding-select" value={rounding} onChange={(e) => setRounding(e.target.value as Rounding)} className={selectClasses}>
            <option value="NearestR50">Nearest R50</option>
            <option value="None">None</option>
          </select>
        </div>
        <div>
          <label htmlFor="vat-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" id="vat-toggle" className="sr-only peer" checked={includeVAT} onChange={(e) => setIncludeVAT(e.target.checked)} />
              <div className="block bg-gray-600 w-14 h-8 rounded-full peer-checked:bg-red-600 transition"></div>
              <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-6"></div>
            </div>
            <div className="ml-3 text-gray-300 font-medium text-sm">Include VAT</div>
          </label>
        </div>
      </div>
    </Card>
  );
}