'use client';

import { useCalculatedPrices, usePricingStore } from '@/store/pricingStore';
import PriceControls from '@/components/dashboard/PriceControls';
import PricingTable from '@/components/dashboard/PricingTable';
import { SELLING_BRANDS } from '@/data/initialData';
import Button from '@/components/ui/Button';
import { Download, FileText } from 'lucide-react';
import { useState } from 'react';
import PrintablePriceList from '@/components/dashboard/PrintablePriceList';

export default function PriceListPage() {
  const calculatedData = useCalculatedPrices();
  const { activeTier, branch } = usePricingStore();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceData: calculatedData,
          activeTier: activeTier,
          sellingBrands: SELLING_BRANDS,
          branchName: branch
        }),
      });

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.headers.get('Content-Disposition')?.split('filename=')[1].replace(/"/g, '') || 'pricelist.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      alert('There was an error exporting the CSV file.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <>
      {/* The main UI is now wrapped in a .no-print container */}
      <div className="space-y-8 no-print">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Customer Price Lists</h1>
            <p className="text-gray-400">Live price calculations based on your settings.</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleExportPdf} variant="secondary">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={handleExportCsv} variant="secondary" disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : `Export ${activeTier}-Tier CSV`}
            </Button>
          </div>
        </div>

        <PriceControls />

        <PricingTable priceData={calculatedData} sellingBrands={SELLING_BRANDS} />
      </div>

      {/* This component is now outside the .no-print div. 
          The CSS will hide it on screen and show it for printing. */}
      <PrintablePriceList 
          priceData={calculatedData} 
          sellingBrands={SELLING_BRANDS}
          activeTier={activeTier}
          branch={branch}
      />
    </>
  );
}