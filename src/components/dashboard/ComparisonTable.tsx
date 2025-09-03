'use client';

import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/formatters';
import { SKU, Brand } from '@/lib/types';

interface ComparisonData {
  sku: SKU;
  albertonPrice: number;
  vanderbijlparkPrice: number;
  albertonProfit: number;
  vanderbijlparkProfit: number;
  albertonGp: number;
  vanderbijlparkGp: number;
  priceDiff: number;
  profitDiff: number;
  gpDiff: number;
}

interface ComparisonTableProps {
  data: ComparisonData[];
  brands: Brand[];
  selectedBrand: Brand;
  onBrandChange: (brand: Brand) => void;
}

const ComparisonTable = ({ data, brands, selectedBrand, onBrandChange }: ComparisonTableProps) => {
  const formatDiff = (value: number, isPercentage = false) => {
    if (value === 0) return <span className="text-gray-400">{isPercentage ? '0.0%' : formatCurrency(0)}</span>;
    const isNegative = value < 0;
    const displayValue = isPercentage ? `${Math.abs(value).toFixed(1)}%` : formatCurrency(Math.abs(value));
    return (
      <span className={isNegative ? 'text-green-400' : 'text-red-400'}>
        {isNegative ? '-' : '+'}
        {displayValue}
      </span>
    );
  };

  return (
    <Card padding="none">
      <div className="p-4 border-b border-gray-700 flex items-center">
        <label htmlFor="brand-selector" className="text-sm font-medium text-gray-300 mr-3">Compare Brand:</label>
        <select
          id="brand-selector"
          value={selectedBrand}
          onChange={(e) => onBrandChange(e.target.value as Brand)}
          className="rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
        >
          {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th scope="col" rowSpan={2} className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6 align-bottom">SKU</th>
              <th scope="colgroup" colSpan={3} className="px-3 py-2 text-center text-sm font-semibold text-white border-x border-gray-700">Alberton</th>
              <th scope="colgroup" colSpan={3} className="px-3 py-2 text-center text-sm font-semibold text-white border-l border-gray-700">Vanderbijlpark</th>
              <th scope="colgroup" colSpan={3} className="px-3 py-2 text-center text-sm font-semibold text-white border-l border-gray-700 bg-gray-700/50">Difference</th>
            </tr>
            <tr>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400 border-x border-gray-700">Price</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400">Profit</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400 border-r border-gray-700">GP%</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400">Price</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400">Profit</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400 border-r border-gray-700">GP%</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400 bg-gray-700/50">Price</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400 bg-gray-700/50">Profit</th>
              <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-400 bg-gray-700/50">GP%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-800">
            {data.map((row) => (
              <tr key={row.sku} className="hover:bg-gray-700/50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{row.sku}</td>
                {/* Alberton Data */}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 border-l border-gray-700">{formatCurrency(row.albertonPrice)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{formatCurrency(row.albertonProfit)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 border-r border-gray-700">{row.albertonGp.toFixed(1)}%</td>
                {/* Vanderbijlpark Data */}
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{formatCurrency(row.vanderbijlparkPrice)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{formatCurrency(row.vanderbijlparkProfit)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 border-r border-gray-700">{row.vanderbijlparkGp.toFixed(1)}%</td>
                {/* Difference Data */}
                <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold bg-gray-800">{formatDiff(row.priceDiff)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold bg-gray-800">{formatDiff(row.profitDiff)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold bg-gray-800">{formatDiff(row.gpDiff, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default ComparisonTable;