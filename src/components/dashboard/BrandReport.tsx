'use client';

import { formatCurrency } from '@/lib/formatters';

interface ReportData {
  size: string;
  cost: number;
  vdbPriceIncVat: number;
  albPriceIncVat: number;
  difference: number;
  vdbGp: number;
  albGp: number;
  gpDiff: number;
}

interface BrandReportProps {
  brandName: string;
  data: {
    G: ReportData[];
    B: ReportData[];
    S: ReportData[];
    A: ReportData[];
  };
}

const ReportTable = ({ title, data }: { title: string; data: ReportData[] }) => (
  <div className="mb-10 break-after-page">
    <h2 className="text-xl font-bold print-text-color mb-3">{title}</h2>
    <table className="min-w-full text-sm">
      <thead className="text-left font-semibold text-gray-300 print-text-color print-header-bg">
        <tr>
          <th className="p-2 border border-gray-600">Size</th>
          <th className="p-2 border border-gray-600">Cost (EX VAT)</th>
          <th className="p-2 border border-gray-600">VDB Price (INC VAT)</th>
          <th className="p-2 border border-gray-600">ALB Price (INC VAT)</th>
          <th className="p-2 border border-gray-600">Difference (RAND)</th>
          <th className="p-2 border border-gray-600">VDB GP %</th>
          <th className="p-2 border border-gray-600">ALB GP %</th>
          <th className="p-2 border border-gray-600">GP % Difference</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.size} className="border-b border-gray-700">
            <td className="p-2 border-x border-gray-700 font-medium text-white print-text-color">{row.size}</td>
            <td className="p-2 border-x border-gray-700 text-gray-300 print-text-color">{formatCurrency(row.cost)}</td>
            <td className="p-2 border-x border-gray-700 text-gray-300 print-text-color">{formatCurrency(row.vdbPriceIncVat)}</td>
            <td className="p-2 border-x border-gray-700 text-gray-300 print-text-color">{formatCurrency(row.albPriceIncVat)}</td>
            <td className="p-2 border-x border-gray-700 text-gray-300 print-text-color">{formatCurrency(row.difference)}</td>
            <td className="p-2 border-x border-gray-700 text-gray-300 print-text-color">{row.vdbGp.toFixed(2)}%</td>
            <td className="p-2 border-x border-gray-700 text-gray-300 print-text-color">{row.albGp.toFixed(2)}%</td>
            <td className="p-2 border-x border-gray-700 text-gray-300 print-text-color">{row.gpDiff.toFixed(2)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function BrandReport({ data, brandName }: BrandReportProps) {
  const reportDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 bg-gray-900 p-8 rounded-lg border border-gray-700 text-gray-300 print-container">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold uppercase text-white print-text-color">{brandName} PRICES</h1>
        <p className="font-semibold print-text-color">{reportDate}</p>
      </div>

      <ReportTable title="G: DEALERS + BIG CUSTOMERS" data={data.G} />
      <ReportTable title="B: SMALLER CUSTOMERS" data={data.B} />
      <ReportTable title="S: COUNTER PRICES" data={data.S} />
      <ReportTable title="A: ADVERTISING ONLINE" data={data.A} />
    </div>
  );
}