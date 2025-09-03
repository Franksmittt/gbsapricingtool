import { NextRequest, NextResponse } from 'next/server';
import { Brand, PriceTier, SKU } from '@/lib/types';

// This is an API Route Handler. It runs on the server, not in the browser.
export async function POST(req: NextRequest) {
  try {
    // 1. Read the data sent from the frontend
    const body = await req.json();
    const { priceData, activeTier, sellingBrands, branchName } = body as {
      priceData: Record<SKU, Record<PriceTier, Record<string, number>>>;
      activeTier: PriceTier;
      sellingBrands: Brand[];
      branchName: string;
    };

    if (!priceData || !activeTier || !sellingBrands) {
      return new NextResponse('Missing required data for export', { status: 400 });
    }

    // 2. Build the CSV content as a string
    const header = ['SKU', ...sellingBrands].join(',');
    const rows = Object.keys(priceData).map(sku => {
      const tierData = priceData[sku][activeTier];
      const priceCells = sellingBrands.map(brand => {
        // Format to a plain number with 2 decimal places for the CSV
        return tierData[brand]?.toFixed(2) || '0.00';
      });
      return [sku, ...priceCells].join(',');
    });

    const csvContent = [header, ...rows].join('\n');

    // 3. Create a filename and send the file back to the browser
    const fileName = `GBSA_PriceList_${branchName}_${activeTier}-Tier_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('CSV Export Error:', error);
    return new NextResponse('Failed to generate CSV file.', { status: 500 });
  }
}