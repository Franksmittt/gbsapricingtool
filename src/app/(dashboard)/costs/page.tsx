'use client';

import SupplierCostsTable from '@/components/dashboard/SupplierCostsTable';

export default function CostsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Supplier Cost Management</h1>
        <p className="text-gray-400">Update your Ex. VAT cost prices here. Changes will reflect across the app instantly.</p>
      </div>
      <SupplierCostsTable />
    </div>
  );
}