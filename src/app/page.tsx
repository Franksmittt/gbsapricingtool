'use client';

import DashboardLayout from "./(dashboard)/layout";
import PriceListPage from "./(dashboard)/pricelists/page";

// The main page of your site is the Price List dashboard.
// It is now fully protected by the authentication guard within DashboardLayout.
export default function Home() {
  return (
    <DashboardLayout>
      <PriceListPage />
    </DashboardLayout>
  );
}