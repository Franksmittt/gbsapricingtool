'use client';

import { formatCurrency } from '@/lib/formatters';
import { Branch, PriceTier, CalculatedPrices, Brand, SKU } from '@/lib/types';

// Color Palette
const colors = {
  navy: '#001F3F',
  yellow: '#FFD700',
  charcoal: '#36454F',
  lightGrey: '#F9FAFB',
  white: '#FFFFFF',
};

// A modern, highly-readable font stack
const professionalFont = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Official addresses are now included
const branchDetails = {
  'Alberton': {
    phone: '011 869 2427',
    whatsapp: '079 320 3014',
    address: '6 Voortrekker Street, New Redruth, Alberton 1449'
  },
  'Vanderbijlpark': {
    phone: '016 023 0161',
    whatsapp: '071 139 4043',
    address: 'Shop 3, Ganda Ganda City, Cnr Golden Highway & Rautenbach Rd, Vanderbijlpark, 1900'
  }
};

interface PrintablePriceListProps {
  priceData: CalculatedPrices;
  sellingBrands: Brand[];
  activeTier: PriceTier;
  branch: Branch;
}

export default function PrintablePriceList({ priceData, sellingBrands, activeTier, branch }: PrintablePriceListProps) {
  const reportDate = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const details = branchDetails[branch];
  
  const leadAcidSkus = [
    '610', '611', '612', '615', '616', '619', '621', '622', '628', '630', '631', '634', '636', 
    '636CS / HT', '638', '639', '640 / 643', '646', '651', '652', '652PS 75Ah', '657', '659', 
    '650', '658', '668', '669', '674', '682', '683', '689', '690', '692', '695', '696', 
    'SMF100 / 674TP', 'SMF101 / 674SP'
  ];
  // --- UPDATED: '105AGM' has been moved to this category ---
  const agmSkus = ['612AGM', '646AGM', '652AGM', '668AGM', '658AGM', '105AGM'];
  // --- UPDATED: '105AGM' has been removed from this category ---
  const leisureSkus = ['RR0', 'RR1'];

  const tierFullName = {
    'S': 'S-Tier: Counter Prices', 'A': 'A-Tier: Advertising Online',
    'B': 'B-Tier: Smaller Customers', 'G': 'G-Tier: Dealers & Big Customers'
  }[activeTier];

  const TableSection = ({ title, skus, avoidBreak = false }: { title: string, skus: SKU[], avoidBreak?: boolean }) => {
    const sectionStyle: React.CSSProperties = { 
      marginBottom: '20px',
    };
    if (avoidBreak) {
      sectionStyle.breakInside = 'avoid';
    }

    return (
      <div style={sectionStyle}>
        <h3 style={{
          fontSize: '14pt', fontWeight: 'bold', color: colors.navy,
          borderBottom: `2px solid ${colors.yellow}`, paddingBottom: '8px', marginBottom: '12px',
          fontFamily: professionalFont
        }}>{title}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', textAlign: 'left', fontSize: '9pt', color: colors.charcoal, textTransform: 'uppercase', fontFamily: professionalFont }}>SKU / Size</th>
              {sellingBrands.map(brand => (
                <th key={brand} style={{ 
                  padding: '10px', 
                  textAlign: 'left', 
                  fontSize: '9pt', 
                  color: colors.charcoal, 
                  textTransform: 'uppercase', 
                  fontFamily: professionalFont 
                }}>{brand}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {skus.map((sku, index) => (
              priceData[sku] && (
                <tr key={sku} style={{ backgroundColor: index % 2 === 0 ? colors.white : colors.lightGrey, borderBottom: `1px solid #E5E7EB` }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold', color: colors.navy }}>
                    {sku}
                  </td>
                  {sellingBrands.map(brand => (
                    <td key={`${sku}-${brand}`} style={{ 
                      padding: '12px 10px', 
                      textAlign: 'left', 
                      fontFamily: professionalFont, 
                      fontSize: '12pt',
                      color: colors.charcoal
                    }}>
                      {formatCurrency(priceData[sku]?.[activeTier]?.[brand] ?? null)}
                    </td>
                  ))}
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="print-section">
      <div style={{ 
        backgroundColor: colors.white, fontFamily: professionalFont, color: colors.charcoal,
        width: '210mm', minHeight: '297mm', margin: '0 auto',
      }}>
        <div style={{ padding: '10mm' }}>
          <header style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            borderBottom: `3px solid ${colors.navy}`, paddingBottom: '16px', marginBottom: '20px'
          }}>
            <div>
              <h1 style={{ fontSize: '28pt', fontWeight: 'bold', color: colors.navy, margin: 0, lineHeight: 1 }}>Global Batteries</h1>
              <p style={{ margin: '4px 0 0', letterSpacing: '0.5px', color: colors.charcoal }}>Your Trusted Battery Specialists</p>
            </div>
            <div style={{ textAlign: 'right', fontSize: '10pt', color: colors.charcoal }}>
              <p style={{ margin: 0 }}>{details.address}</p>
              <p style={{ margin: '4px 0 0' }}><b>Call:</b> {details.phone}</p>
              <p style={{ margin: '4px 0 0' }}><b>WhatsApp:</b> {details.whatsapp}</p>
            </div>
          </header>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18pt', fontWeight: 'bold', color: colors.navy, margin: 0 }}>{tierFullName}</h2>
            <p style={{ margin: '4px 0 0', color: colors.charcoal }}>Price List Valid For: {reportDate}</p>
          </div>
          
          <main>
            <TableSection title="Lead Acid Batteries" skus={leadAcidSkus} />
            <TableSection title="AGM (Stop/Start) Batteries" skus={agmSkus} avoidBreak={true} />
            <TableSection title="Leisure & Marine Batteries" skus={leisureSkus} avoidBreak={true} />
          </main>
        </div>
      </div>
    </div>
  );
}