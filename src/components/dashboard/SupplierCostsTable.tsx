'use client';

import { useState } from 'react';
import { usePricingStore } from '@/store/pricingStore';
import { SKU, Supplier, CostDetail } from '@/lib/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

const anchorSuppliers: Supplier[] = ['Exide', 'Willard'];

export default function SupplierCostsTable() {
  const { suppliers, supplierCosts, updateCostDetail, addSupplier } = usePricingStore();
  const [activeTab, setActiveTab] = useState<Supplier>(suppliers[0]);

  const skus = Object.keys(supplierCosts);

  const handleCostChange = (sku: SKU, supplier: Supplier, field: keyof CostDetail, value: string) => {
    const newAmount = parseFloat(value);
    if (!isNaN(newAmount)) {
      const currentDetails = supplierCosts[sku]?.[supplier] || { invoicePrice: 0, scrapLoading: 0 };
      const newDetails = { ...currentDetails, [field]: newAmount };
      updateCostDetail(sku, supplier, newDetails);
    }
  };

  const handleAddSupplier = () => {
    const newSupplierName = prompt("Enter the name for the new supplier:");
    if (newSupplierName) {
      addSupplier(newSupplierName);
      setActiveTab(newSupplierName);
    }
  };

  const isAnchor = anchorSuppliers.includes(activeTab);

  return (
    <Card padding="none">
      <div className="flex justify-between items-center border-b border-gray-700 px-6">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          {suppliers.map((supplier) => (
            <button key={supplier} onClick={() => setActiveTab(supplier)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === supplier ? 'border-red-500 text-red-500' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}>
              {supplier}
            </button>
          ))}
        </nav>
        <Button onClick={handleAddSupplier} size="sm" variant="secondary">
            <Plus className="h-4 w-4 mr-2" /> Add Supplier
        </Button>
      </div>

      <div key={activeTab} className="overflow-x-auto">
        <table className="min-w-full">
            <thead className="bg-gray-900/50">
                <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">SKU</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">{isAnchor ? 'Cost Price' : 'Invoice Price'}</th>
                    {!isAnchor && <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Scrap Loading</th>}
                    {!isAnchor && <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Actual Cost</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
                {skus.map((sku) => {
                    const costDetail = supplierCosts[sku]?.[activeTab] || { invoicePrice: 0, scrapLoading: 0};
                    const actualCost = costDetail.invoicePrice - costDetail.scrapLoading;
                    return (
                        <tr key={sku} className="hover:bg-gray-700/50">
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{sku}</td>
                            <td className="whitespace-nowrap px-3 py-4">
                                <input type="number" defaultValue={costDetail.invoicePrice.toFixed(2)} onBlur={(e) => handleCostChange(sku, activeTab, 'invoicePrice', e.target.value)} className="w-32 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"/>
                            </td>
                            {!isAnchor && (
                                <td className="whitespace-nowrap px-3 py-4">
                                    <input type="number" defaultValue={costDetail.scrapLoading.toFixed(2)} onBlur={(e) => handleCostChange(sku, activeTab, 'scrapLoading', e.target.value)} className="w-32 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"/>
                                </td>
                            )}
                            {!isAnchor && (
                                <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-green-400">{formatCurrency(actualCost)}</td>
                            )}
                        </tr>
                    )
                })}
            </tbody>
        </table>
      </div>
    </Card>
  );
}