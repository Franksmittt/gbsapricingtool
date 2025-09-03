'use client';

import DashboardLayout from "./(dashboard)/layout";
import PriceListPage from "./(dashboard)/pricelists/page";

// The main page of your site will now be the Price List dashboard.
// It wraps the PriceListPage with the main DashboardLayout.
export default function Home() {
  return (
    <DashboardLayout>
      <PriceListPage />
    </DashboardLayout>
  );
}